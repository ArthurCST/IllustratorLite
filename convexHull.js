class convexHull{

	constructor(){
		this.pointsCloud = [];
        this.color = "blue";
		this.convex = [];
		this.context;
		
	}
	addConvex(){
		this.convex = mergeHull(sortByX(this.pointsCloud));
	}

	getPoints(shapes){
		for (const i in shapes) {
			if (shapes[i].constructor.name == "Ponto") {
				this.pointsCloud.push(shapes[i]);
			}else if (shapes[i].constructor.name == "Linha") {
				this.pointsCloud.push(shapes[i].ponto1);
				this.pointsCloud.push(shapes[i].ponto2);		
			}else if(shapes[i].constructor.name == "Curva"){
				for (const key in shapes[i]) {
					this.pointsCloud.push(shapes[i].pontos[key]);
				}
			}else if(shapes[i].constructor.name == "Circulo"){
				// x(t) = r cos(t) + j
				// y(t) = r sin(t) + k
				var ponto;
				var x;
				var y;
				for (let j = 0; j < 360; j++) {
					x = shapes[i].r * Math.cos(j)+ shapes[i].ponto1.x;
					y = shapes[i].r * Math.sin(j)+ shapes[i].ponto1.y;
					ponto = new Ponto(x, y);
					this.pointsCloud.push(ponto);
				}
			}else if(shapes[i].constructor.name == "Poligono"){
				for (let j = 0; j<shapes[i].coord.length; j++) {
					this.pointsCloud.push(shapes[i].coord[j]);
				}
			}
		}
	}

	draw(){
		context.beginPath();
        
        context.strokeStyle = this.color;
        context.moveTo(this.pointsCloud[0].x, this.pointsCloud[0].y);
        for(let i = 1; i < this.pointsCloud.length; i++){
            context.lineTo(this.pointsCloud[i].x, this.pointsCloud[i].y);
        }

        context.lineTo(this.pointsCloud[0].x, this.pointsCloud[0].y);
        //this.ar = this.area();
        context.stroke();
        context.closePath();
	}
}






var points = [];
var pointRadius = 8;
var canvas;
var widthAdjust = 1.04;
var heightAdjust = 1.25;
var numRandomPoints = 100;
var animationSpeed = 500;
var lineWeight = 1;

var currWidth;
var currHeight;

// Global variables necessary in drawing/animation
var finalHull;
var triangleLines = [];
var triangleLinesAnimate = [];

var upperTangentLines = [];
var lowerTangentLines = [];
var allLowerTangentLines = [];
var allUpperTangentLines = [];

var lowerTangentsToDraw = [];
var upperTangentsToDraw = [];

var topComplete = false;
var botComplete = false;
var subHullFound = false;
var upperTangentTemp;
var lowerTangentTemp;

var lTIdxDraw = 0;
var uTIdxDraw = 0;

// Timers used in animation 
var lowerTangentTimer;
var upperTangentTimer;

/*
* CORE CONVEX HULL FUNCTIONS
*/

/**
 * Main function for computing the convex hull using a divide and conquer technique
 * Parameters: An array of point objects
 * Return: An array representing the convex hull of the input points
 */ 
function mergeHull(pointSet) {

	if(pointSet.length <= 3){
		pointsAndSegments = bruteForceHull(pointSet);	
		triangleLines = triangleLines.concat(pointsAndSegments[1]);
		return pointsAndSegments[0];
	}

	// The divide-and-conquer/MergeHull algorithm is dependent on the points being in general position (essentially, points are not colinear). This adds
	// an unnoticeable random amount to each of the points to make colinear points extremely unlikely.
	for(var i=0; i<pointSet.length; ++i){
		pointSet[i].x = pointSet[i].x + Math.random()*.0001;
	}

	//split sorted array into two halves.
	var midIndex = Math.floor(pointSet.length / 2.0);
	var firstHalf = pointSet.slice(0, midIndex);
	var secondHalf = pointSet.slice(midIndex);

	// Recursive calls to compute  hulls. hullA = CH(firstHalf), hullB=CH(secondHalf)
	var hullA = mergeHull(firstHalf);
	var hullB = mergeHull(secondHalf);

	//Compute the upper and lower tangent points of hullA and hullB
	var upperTangentIndices = upperTangent(hullA, hullB);
	var lowerTangentIndices = lowerTangent(hullA, hullB);

	var upperTangentAIndex = upperTangentIndices[0];
	var lowerTangentAIndex = lowerTangentIndices[0];
	var upperTangentBIndex = upperTangentIndices[1];
	var lowerTangentBIndex = lowerTangentIndices[1];

	/* 
	The remainder of this function is to concatenate/merge the two hulls.
	This involves finding the points between the upper tangent to the lower tangent
	in counterclockwise order.
	*/ 

	var upperTangentAPoint = hullA[upperTangentAIndex];
	var lowerTangentAPoint = hullA[lowerTangentAIndex];

	// Make the upper tangent point of hull A index 0.
	while(hullA[0] != upperTangentAPoint){
		hullA.push(hullA.shift());
	}

	// We need to update the index of hullA's lower index because it changed in the previous shifting operation.
	for(var i=0; i<hullA.length; ++i){
		if(hullA[i] == lowerTangentAPoint){
			lowerTangentAIndex = i;
			break;
		}
	}

	var half = hullA.slice(0, lowerTangentAIndex+1);

	var upperTangentBPoint = hullB[upperTangentBIndex];
	var lowerTangentBPoint = hullB[lowerTangentBIndex];

	// Make the lower tangent point of hullB index 0.
	while(hullB[0] != lowerTangentBPoint){
		hullB.push(hullB.shift());
	}

	// We need to update the index of hullB's upper index because it changed in the previous shifting operation.
	for(var i=0; i<hullB.length; ++i){
		if(hullB[i] == upperTangentBPoint){
			upperTangentBIndex = i;
			break;
		}
	}

	var merged = half.concat(hullB.slice(0, upperTangentBIndex+1));
	//print(merged);
	return merged;

}

/*
* Computes the next counterclockwise point in a hull. Note that hulls
* are maintained/stored in counterclockwise order.
* Parameters: An integer for current index and an array of point objects
* Return: An integer representing the index of the next (counterclockwise) point on the hull
*/ 
function nextCounterClockwisePoint(currentIndex, hull){
	var nextIndex = currentIndex + 1;
	if(nextIndex > hull.length-1){
		nextIndex = 0;
	}
	return nextIndex;
}

/*
* Computes the next clockwise point in a hull. Note that hulls
* are maintained/stored in counterclockwise order.
* Parameters: An integer for current index and an array of point objects
* Return: An integer representing the index of the next (clockwise) point on the hull
*/ 
function nextClockwisePoint(currentIndex, hull){
	var nextIndex = currentIndex - 1;
	if(nextIndex < 0){
		nextIndex = hull.length - 1;
	}
	return nextIndex;
}

/*
* Compute the lower tangent between two convex hulls (hulls separated by a vertical line).
* Parameters: Two arrays of point objects, each representing a convex hull.
* Return: An array of two indices (one from hA, one from hB) that define the lower tangent.
*/
function lowerTangent(hA, hB){

	var a = maxXValueIndex(hA);

	var b = minXValueIndex(hB);

	// while a and b are not the indices of points of the lower tangent line,
	// move a clockwise and/or b counterclockwise until the two points form the lower tangent.
	var tangentFound = false;
	allLowerTangentLines.push(new LineObj(hA[a].x, hA[a].y, hB[b].x, hB[b].y));
	while (!tangentFound){
		tangentFound = true;

		while(isCounterClockwise(hB[b], hA[a], hA[nextClockwisePoint(a, hA)])){
			//move a clockwise
			a = nextClockwisePoint(a, hA);
			allLowerTangentLines.push(new LineObj(hA[a].x, hA[a].y, hB[b].x, hB[b].y));			
		}

		while(isClockwise(hA[a], hB[b], hB[nextCounterClockwisePoint(b, hB)])){
			//move b counterclockwise
			b = nextCounterClockwisePoint(b, hB);
			allLowerTangentLines.push(new LineObj(hA[a].x, hA[a].y, hB[b].x, hB[b].y));
			tangentFound = false;	
		}
	}
	lowerTangentLines.push(new LineObj(hA[a].x, hA[a].y, hB[b].x, hB[b].y));

	// return the indices of points defining the lower tangent line (one point from hull hA and one from hull hB)
	return [a, b];
}

/*
* Compute the upper tangent between two convex hulls hA and hB (hulls separated by a vertical line).
* Parameters: Two arrays of point objects, each representing a convex hull.
* Return: An array of two indices (one from hA, one from hB) that define the upper tangent. 
*/
function upperTangent(hA, hB){

	var a = maxXValueIndex(hA);

	var b = minXValueIndex(hB);

	// while a and b are not the indices of points of the upper tangent line for hA and hB,
	// move a counterclockwise or b clockwise until the two points form the upper tangent line.
	var tangentFound = false;
	allUpperTangentLines.push(new LineObj(hA[a].x, hA[a].y, hB[b].x, hB[b].y));

	while (!tangentFound){
		tangentFound = true;

		while(isCounterClockwise(hA[a], hB[b], hB[nextClockwisePoint(b, hB)])){
			b = nextClockwisePoint(b, hB);
			allUpperTangentLines.push(new LineObj(hA[a].x, hA[a].y, hB[b].x, hB[b].y));
		}

		while(isClockwise(hB[b], hA[a], hA[nextCounterClockwisePoint(a, hA)])){
			a = nextCounterClockwisePoint(a, hA);
			allUpperTangentLines.push(new LineObj(hA[a].x, hA[a].y, hB[b].x, hB[b].y));
			tangentFound = false;	
		}	
	}
	upperTangentLines.push(new LineObj(hA[a].x, hA[a].y, hB[b].x, hB[b].y));

	// return the indices of points defining the upper tangent line (one point from hull hA and one from hull hB)
	return [a, b];
}

/**
 * Compute convex hull with brute force
 * Parameters: An array of point objects
 * Return: returns an array of arrays: the array of counter clockwise points that make up the hull and an array of line objects that define the hull
 */ 
function bruteForceHull(newPoints) {
	var tempPoints = [];
	var lineSegments = [];
	if(newPoints.length == 1){

		tempPoints.push(newPoints[0]);
		return [tempPoints, lineSegments];

	} else if (newPoints.length == 2){
		
		var p1 = newPoints[0];
		var p2 = newPoints[1];

		if(p1.x < p2.x){
			tempPoints.push(p1);
			tempPoints.push(p2);
			lineSegments.push( new LineObj(p1.x, p1.y, p2.x, p2.y));
		} else {
			tempPoints.push(p2);
			tempPoints.push(p1);
			lineSegments.push(new LineObj(p2.x, p2.y, p1.x, p1.y));
		}

		
		return [tempPoints, lineSegments];

	} else {

		for(var i=0; i<newPoints.length; ++i){
			tempPoints.push(newPoints[i]);
		}
		var p1 = newPoints[0];
		var p2 = newPoints[1];
		var p3 = newPoints[2];

		if(isClockwise(p1,p2,p3)){
			tempPoints = newPoints.reverse();
			for(var i=0; i<3; ++i){
				p1 = tempPoints[i];
				p2 = tempPoints[(i+1)%3];
				lineSegments.push(new LineObj(p1.x, p1.y, p2.x, p2.y));

			}
			return [tempPoints,lineSegments];
		} else {
			tempPoints = newPoints;
			for(var i=0; i<3; ++i){
				p1 = tempPoints[i];
				p2 = tempPoints[(i+1)%3];
				lineSegments.push(new LineObj(p1.x, p1.y, p2.x, p2.y));
			}
			return [tempPoints,lineSegments];
		}
	}
}

/*
* Parameters: Array of point objects
* Return: A sorted (by x coord) array of point objects
*/
function sortByX(pointSet) {
	return pointSet.sort(function(a,b){
		return a.x - b.x;
	});
}

/*
* Determine if three points are in clockwise order.
* Parameters: Three point objects
* Return: A boolean (true if the points are in clockwise order, false otherwise)
*/
function isClockwise(p1,p2,p3){
	//this would ordinarily be < 0, however in the p5.js coordinate system y increases when moving downward from the top of the canvas.
	return (p2.x - p1.x)*(p3.y-p1.y) - (p3.x - p1.x)*(p2.y-p1.y) > 0;
}


/*
* Determine if three points are in counterclockwise order.
* Parameters: Three point objects
* Return: A boolean (true if the points are in clockwise order, false otherwise)
*/
function isCounterClockwise(p1,p2,p3){
	// this would ordinarily be > 0, however in the p5.js coordinate system y increases when moving downward from the top of the canvas.
	return (p2.x - p1.x)*(p3.y-p1.y) - (p3.x - p1.x)*(p2.y-p1.y) < 0;
}

/* 
* Parameters: An array of point objects
* Return: The point with the minimum x value from the input
*/
function minXValueIndex(inputPoints){

	var min = Number.MAX_VALUE;
	var index = 0;
	for(var i=0; i<inputPoints.length; ++i){
		if(inputPoints[i].x <= min){
			min = inputPoints[i].x;
			index = i;
		}
	}
	return index;
}

/* 
* Parameters: An array of point objects
* Return: The point with the maximum x value from the input
*/
function maxXValueIndex(inputPoints){
	var max = Number.MIN_VALUE;
	var index = 0;

	for(var i=0; i<inputPoints.length; ++i){
		if(inputPoints[i].x >= max){
			max = inputPoints[i].x;
			index = i;
		}
	}
	return index;
}


class LineObj {
	constructor (x1,y1, x2,y2){
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;
	}

	getLength(){
		return Math.sqrt((this.x2-this.x1)^2 + (this.y2-this.y1)^2);
	}

	getSlope(){
		return ((this.y2-this.y1) / (this.x2-this.x1));
	}
}