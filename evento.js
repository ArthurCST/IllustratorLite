var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

var shapes = [];
var shape = 0;

var ang = 0;

function reset(){
    for (let i = 0; i < shapes.length; i++) {
        shapes[i].resetColor();
    }
}

function reDraw(){

    for (let i = 0; i < shapes.length; i++) {
        shapes[i].draw();
    }
}

function restoreDraw(){
    for (let i = 0; i < shapes.length; i++) {
        shapes[i].restore();
    }
    reDraw();
}

function EquacaoDaReta(x, x1, y1, x2, y2) {
    return (((x - x1) * (y2 - y1)) / (x2 - x1)) + y1;
}

function Norma(reta) {
    var deltaX = Math.abs(reta.ponto2.x - reta.ponto1.x);
    var deltaY = Math.abs(reta.ponto2.y - reta.ponto1.y);
    return Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
}

function ProdutoInterno(reta1, reta2) {
    var deltaX1 = reta1.ponto2.x - reta1.ponto1.x;
    var deltaX2 = reta2.ponto2.x - reta2.ponto1.x;
    var deltaY1 = reta1.ponto2.y - reta1.ponto1.y;
    var deltaY2 = reta2.ponto2.y - reta2.ponto1.y;
    return (deltaX1 * deltaX2) + (deltaY1 * deltaY2);
}

var previousX = 0;
var previousY = 0;
var shapeSelected = null;
var shapeSelected2 = null;
var origem = 0;
var origem2 = 0;
var fim = 0;
var fim2 = 0;


var btnCurrentAction = "none";
var numberOfClicks = 0;
var arccos;
var cx;
var cy;
var mousePressed = false;
var shapeDragging = false;
var mouseLeft = 0;

function onmousemove(event) {
    var rect = canvas.getBoundingClientRect();

    mouse_x = event.x - rect.x;
    mouse_y = event.y - rect.y;

    

    if (numberOfClicks > 0) {
        shape.drawPreview(mouse_x, mouse_y);
    }
    reDraw();
}

function onDown(event){

    cx = event.clientX - context.canvas.offsetLeft;
    cy = event.clientY - context.canvas.offsetTop;
    mouseRight = event.button;
    mousePressed = true;
    switch (btnCurrentAction) {
        case "Ponto":
            if(numberOfClicks == 0){
                shape = new Ponto(cx, cy);
                shapes.push(shape);
                shape.draw();
                numberOfClicks = 0;
            }
            break;
        case "Linha":
            if(numberOfClicks == 0){
                shape = new Linha(cx, cy);
                shape.addSegundoPonto(cx,cy);
                numberOfClicks++;
            }else if(numberOfClicks == 1){
                shape.addSegundoPonto(cx,cy);
                shape.draw();
                shapes.push(shape);

                numberOfClicks = 0;
            }
            break;
        case "Angulo":
            for (let i = 0; i < shapes.length; i++) {
                if(numberOfClicks == 0){
                    if(shapes[i] instanceof  Linha){
                        if(shapes[i].Selecao(cx, cy, 10)){
                            if(shapeSelected != null)
                                shapeSelected.restore();
                            shapeSelected = shapes[i];
                            shapeSelected.selected();
                            previousX = cx;
                            previousY = cy;
                            origem = shapeSelected.ponto1;
                            fim = shapeSelected.ponto2;
                        }
                    }
                    reDraw();
                    numberOfClicks++;
                }else{
                    if(shapes[i] instanceof  Linha){
                        if(shapes[i].Selecao(cx, cy, 10)){
                            if(shapeSelected2 != null)
                                shapeSelected2.restore();
                            shapeSelected2 = shapes[i];
                            shapeSelected2.selected();
                            previousX = cx;
                            previousY = cy;
                            origem2 = shapeSelected2.ponto1;
                            fim2 = shapeSelected2.ponto2;
                        }
                    }
                    numberOfClicks = 0;
                    
                    reDraw();
                    break;
                }
            }
            var norma1 = Norma(shapeSelected);
            var norma2 = Norma(shapeSelected2);
            var produtoInterno = ProdutoInterno(shapeSelected, shapeSelected2);
            arccos = Math.acos(((produtoInterno) / (norma1 * norma2)));

            alert("Angulo entre as retas: "+arccos*180/Math.PI);

            break;
        case "Circulo":
            if(numberOfClicks == 0){
                shape = new Circulo(cx, cy);
                shape.addSegundoPonto(cx,cy);
                numberOfClicks++;
            }else if(numberOfClicks == 1){
                shape.addSegundoPonto(cx,cy);
                shape.draw();
                
                shapes.push(shape);

                numberOfClicks = 0;
            }
            break;
        case "Poligono":
            if(numberOfClicks == 0){
                shape = new Poligono();
                shape.addPonto(cx,cy);
                shapes.push(shape);
                numberOfClicks++;
            }else{

                shape.addPonto(cx,cy);
                
                numberOfClicks++;
                shape.drawning(cx, cy);
            }
            break;
        case "Curva":
            if(numberOfClicks == 0){
                shape = new Curva();
                shape.addPonto(cx, cy);
                numberOfClicks++;
            }else{
                shape.addPonto(cx, cy);            
                numberOfClicks++;
                if (numberOfClicks == 3) {
                    shapes.push(shape);
                    shape.draw();
                    numberOfClicks = 0;
                }
            }
            break;
        case "Selecao":
            for (let i = 0; i < shapes.length; i++) {
                /*Ponto*/
                if(shapes[i] instanceof Ponto){
                    if(shapes[i].Selecao(cx, cy, 5)){

                        if(shapeSelected != null)
                        shapeSelected.restore();
                        shapeSelected = shapes[i];
                        shapeSelected.selected();

                        previousX = cx;
                        previousY = cy;
                    }
                }
                /*Linha*/
                if(shapes[i] instanceof  Linha){
                    if(shapes[i].Selecao(cx, cy, 10)){
                        if(shapeSelected != null)
                            shapeSelected.restore();
                        shapeSelected = shapes[i];
                        shapeSelected.selected();
                        previousX = cx;
                        previousY = cy;
                    }
                }
                /*Circulo*/
                if(shapes[i] instanceof Circulo){
                    if(shapes[i].Selecao(cx, cy, 30)){
                        if(shapeSelected != null)
                            shapeSelected.restore();
                        shapeSelected = shapes[i];
                        shapeSelected.selected();
                        previousX = cx;
                        previousY = cy;
                    }
                }

                /*Poligono*/
                if(shapes[i] instanceof  Poligono){
                    if(shapes[i].Selecao(cx, cy)){
                        if(shapeSelected != null){
                            shapeSelected.restore();
                        }
                        shapeSelected = shapes[i];
                        alert("Area do poligono: "+shapeSelected.area());
                        shapeSelected.selected();
                        previousX = cx;
                        previousY = cy;           
                    }
                    
                }

            }
            reDraw();
            break;

        case "Translacao":
            
            if(numberOfClicks > 0){
                numberOfClicks = 0;
                shapeSelected.translation(cx,cy);
                shapeSelected.restore();
                reDraw();
                //shapeSelected.draw();
                break;
                
            }else{
                for (let i = 0; i < shapes.length; i++) {
                    /*Ponto*/
                    if(shapes[i] instanceof Ponto){
                        if(shapes[i].Selecao(cx, cy, 5)){

                            shapeSelected = shapes[i];
                            if(numberOfClicks == 0){
                                shapeSelected.color = "whitesmoke";
                                numberOfClicks++;  
                            }
                        }
                        
                        previousX = cx;
                        previousY = cy;
                    }
                    /*Linha*/
                    if(shapes[i] instanceof  Linha){
                        if(shapes[i].Selecao(cx, cy, 10)){
                            if(shapeSelected != null){
                                shapeSelected.restore();
                            }
                            shapeSelected = shapes[i];
                            if(numberOfClicks == 0){
                                shapeSelected.color = "whitesmoke";
                                numberOfClicks++; 
                                 
                            }
                            previousX = cx;
                            previousY = cy;
                        }
                    }
                    /*Circulo*/
                    if(shapes[i] instanceof Circulo){
                        if(shapes[i].Selecao(cx, cy, 30)){
                            if(shapeSelected != null)
                                shapeSelected.restore();
                            shapeSelected = shapes[i];
                            shapeSelected.selected();
                            previousX = cx;
                            previousY = cy;
                        }
                    }

                    /*Poligono*/
                    if(shapes[i] instanceof  Poligono){
                        if(shapes[i].Selecao(cx, cy)){
                            if(shapeSelected != null){
                                shapeSelected.restore();
                            }
                            shapeSelected = shapes[i];
                            alert("Area do poligono: "+shapeSelected.area());
                            shapeSelected.selected();
                            previousX = cx;
                            previousY = cy;           
                        }
                        
                    }

                }
            }    
            reDraw();
            break;
    }
}

function onUp(){
    mousePressed = false;
    shapeDragging = false;
}


/*Adicionando evento ao botão btnPonto */
document.getElementById('btnPonto').addEventListener('click', function(){
    btnCurrentAction = "Ponto";

    if(shapes.length > 0){
        restoreDraw();
    }
})

/*Adicionando evento ao botão btnLinha */
document.getElementById('btnLinha').addEventListener('click', function(){
    btnCurrentAction = "Linha";

    if(shapes.length > 0){
        restoreDraw();
    }
})
/*Adicionando evento ao botão btnAngulo */
document.getElementById('btnAngulo').addEventListener('click', function(){
    btnCurrentAction = "Angulo";

    if(shapes.length > 0){
        restoreDraw();
    }
})

/*Adicionando evento ao botão btnCirculo */
document.getElementById('btnCirculo').addEventListener('click', function(){
    btnCurrentAction = "Circulo";
})

/*Adicionando evento ao botão btnPoligono */
document.getElementById('btnPoligono').addEventListener('click', function(){
    btnCurrentAction = "Poligono";

    if(shapes.length > 0){
        restoreDraw();
    }
})

/*Adicionando evento ao botão btnSelecao */
document.getElementById('btnSelecao').addEventListener('click', function(){
    btnCurrentAction = "Selecao";

    if(shapes.length > 0){
        restoreDraw();
    }
})

document.getElementById('btnTranslacao').addEventListener('click', function(){
    btnCurrentAction = "Translacao";

    if(shapes.length > 0){
        restoreDraw();
    }
})

document.getElementById('btnCurva').addEventListener('click', function(){
    btnCurrentAction = "Curva";

    if(shapes.length > 0){
        restoreDraw();
    }
})


/*Adicionando evento ao botão btnClear */
document.getElementById('btnLimpar').addEventListener('click', function (){
    btnCurrentAction = "limpar";
    context.clearRect(0, 0, canvas.width, canvas.height);
    shapes = [];
})

canvas.addEventListener("mousedown", onDown);
canvas.addEventListener("mouseup", onUp);
canvas.addEventListener("mousemove", onmousemove);


canvas.addEventListener("dblclick", function(event){
    
    if(btnCurrentAction == "Poligono"){
        numberOfClicks = 0;
        shape.draw();
    }        
}, false);