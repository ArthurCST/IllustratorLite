class Linha{
    constructor(cx,cy){
        this.ponto1 = new Ponto(cx,cy);
        this.ponto2;
        this.color = "black";
        this.eixo;
        this.mirror;
    }
    addMirror(x, y){
        this.mirror = new Linha(x, y);
    }

    addSegundoPonto(cx, cy){
        this.ponto2 = new Ponto(cx,cy);
    }
    addEixo(cx, cy){
        this.eixo = new Ponto(cx, cy);
    }

    codSelecao(x, y, xmin, xmax, ymin, ymax){
        var cod = [];
        cod[0] = x < xmin;
        cod[1] = x > xmax;
        cod[2] = y < ymin;
        cod[3] = y > ymax;

        return cod;
    }

    Selecao(mx,my,t){
        let cod0, cod1, j;
        let x0 = this.ponto1.x, x1 = this.ponto2.x;
        let y0 = this.ponto1.y, y1 = this.ponto2.y;
        let xmin,xmax,ymin,ymax;

        xmin = mx - t;
        xmax = mx + t;
        ymin = my - t;
        ymax = my + t;

        cod1 = this.codSelecao(x1, y1, xmin, xmax, ymin, ymax);

        do{
            cod0 = this.codSelecao(x0, y0, xmin, xmax, ymin, ymax);

            for(j = 0; j < 4; j++)
                if(cod1[j] && cod0[j]) break;
            if(j != 4) break;

            if(cod0[0]){
                y0 += (xmin - x0)*(y1-y0)/(x1-x0);
                x0 = xmin;
            }else if(cod0[1]){
                y0 += (xmax - x0)*(y1-y0)/(x1-x0);
                x0 = xmax;
            }else if(cod0[2]){
                x0 += (ymin - y0)*(x1-x0)/(y1-y0);
                y0 = ymin;
            }else if(cod0[3]){
                x0 += (ymax - y0)*(x1-x0)/(y1-y0);
            }else{
                return true;
            }
        }while(1);

        return false;
    }

    selected(){
        this.color = "red";
    }

    restore(){
        this.color = "black";
    }

    draw(){
        context.strokeStyle = this.color;
        context.beginPath();
        context.moveTo(this.ponto1.x, this.ponto1.y);
        context.lineTo(this.ponto2.x, this.ponto2.y);
        context.stroke();
        context.closePath();
    }

    getCenter(){
        var x;
        var y;

        var x_min = this.ponto1.x;
        var y_min = this.ponto1.y;

        var x_max = this.ponto2.x;
        var y_max = this.ponto2.y;

        x = x_min + ((x_max-x_min)/2);
        y = y_min + ((y_max-y_min)/2);
        var center = new Ponto(x,y);
        return center;
    }

    drawPreview(x, y) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        reDraw();

        context.strokeStyle = "green";

        context.beginPath();
        context.moveTo(this.ponto1.x, this.ponto1.y);
        context.lineTo(x, y);
        context.stroke();
        
    }

    drawPreviewTranslation(cx, cy){

        var x = cx - this.ponto1.x;
        var y = cy - this.ponto1.y;

        var newPosition2;
        var currentPosition2 = [[this.ponto2.x], [this.ponto2.y], [1]];
        var translationMatrix = [[1, 0, x],[0, 1, y],[0, 0, 1]];

        newPosition2 = multiplyMatrix(translationMatrix, currentPosition2);

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.beginPath();
        context.strokeStyle = "green";
        context.moveTo(cx, cy);
        context.lineTo(newPosition2[0][0], newPosition2[1][0]);
        context.stroke();

        reDraw();
    }


    translation(cx, cy){

        var x = cx - this.ponto1.x;
        var y = cy - this.ponto1.y;

        var newPosition2;
        var currentPosition2 = [[this.ponto2.x], [this.ponto2.y], [1]];
        var translationMatrix = [[1, 0, x],[0, 1, y],[0, 0, 1]];

        
        newPosition2 = multiplyMatrix(translationMatrix, currentPosition2);

        this.ponto1.x = cx;
        this.ponto1.y = cy;

        this.ponto2.x = newPosition2[0][0];
        this.ponto2.y = newPosition2[1][0];

    }

    scale(cx, cy){
        var x = cx - this.ponto1.x;
        var y = cy - this.ponto1.y;
        this.ponto2.x += x;
        this.ponto2.y += y;

    }

    drawPreviewScale(cx, cy){
        var x = cx - this.ponto1.x;
        var y = cy - this.ponto1.y;
        context.clearRect(0, 0, canvas.width, canvas.height);
        reDraw();

        context.strokeStyle = "green";

        context.beginPath();
        context.moveTo(this.ponto1.x, this.ponto1.y);
        context.lineTo(this.ponto2.x+x, this.ponto2.y+y);
        context.stroke();
    }

    rotation(cx, cy){
        var center = this.eixo;

        var vetorEixo = new Linha(center.x, center.y);
        vetorEixo.addSegundoPonto(cx, cy);
        
        var vetorBase = new Linha(0, canvas.height);
        vetorBase.addSegundoPonto(canvas.width, canvas.height);

        var norma1 = Norma(vetorEixo);
        var norma2 = Norma(vetorBase);
        var produtoInterno = ProdutoInterno(vetorEixo, vetorBase);
        arccos = Math.acos(((produtoInterno) / (norma1 * norma2)));
        var teta = arccos*180/Math.PI;
        
        var rotationMatrix = [[Math.cos(teta), -Math.sin(teta), 0],[Math.sin(teta), Math.cos(teta), 0],[0, 0, 1]];
        var translationMatrix = [[1, 0, center.x],[0, 1, center.y],[0, 0, 1]];
        var invTranslationMatrix = [[1, 0, -center.x],[0, 1, -center.y],[0, 0, 1]];
        
        var newPosition;
        var currentPosition = [[this.ponto1.x], [this.ponto1.y], [1]];
        newPosition = multiplyMatrix(translationMatrix, multiplyMatrix(rotationMatrix, multiplyMatrix(invTranslationMatrix, currentPosition)));

        var newPosition2;
        var currentPosition2 = [[this.ponto2.x], [this.ponto2.y], [1]];
        newPosition2 = multiplyMatrix(translationMatrix, multiplyMatrix(rotationMatrix, multiplyMatrix(invTranslationMatrix, currentPosition2)));

        this.ponto1.x = newPosition[0][0];;
        this.ponto1.y = newPosition[1][0];;

        this.ponto2.x = newPosition2[0][0];
        this.ponto2.y = newPosition2[1][0];
        
    }

    drawPreviewRotation(cx, cy){
        this.eixo.color = "blue";
        
        var center = this.eixo;

        var vetorEixo = new Linha(center.x, center.y);
        vetorEixo.addSegundoPonto(cx, cy);
        
        var vetorBase = new Linha(0, canvas.height);
        vetorBase.addSegundoPonto(canvas.width, canvas.height);

        var norma1 = Norma(vetorEixo);
        var norma2 = Norma(vetorBase);
        var produtoInterno = ProdutoInterno(vetorEixo, vetorBase);
        arccos = Math.acos(((produtoInterno) / (norma1 * norma2)));
        var teta = arccos*180/Math.PI;
        
        var rotationMatrix = [[Math.cos(teta), -Math.sin(teta), 0],[Math.sin(teta), Math.cos(teta), 0],[0, 0, 1]];
        var translationMatrix = [[1, 0, center.x],[0, 1, center.y],[0, 0, 1]];
        var invTranslationMatrix = [[1, 0, -center.x],[0, 1, -center.y],[0, 0, 1]];
        
        var newPosition;
        var currentPosition = [[this.ponto1.x], [this.ponto1.y], [1]];
        newPosition = multiplyMatrix(translationMatrix, multiplyMatrix(rotationMatrix, multiplyMatrix(invTranslationMatrix, currentPosition)));

        var newPosition2;
        var currentPosition2 = [[this.ponto2.x], [this.ponto2.y], [1]];
        newPosition2 = multiplyMatrix(translationMatrix, multiplyMatrix(rotationMatrix, multiplyMatrix(invTranslationMatrix, currentPosition2)));

        context.clearRect(0, 0, canvas.width, canvas.height);
        reDraw();

        context.strokeStyle = "green";
        this.eixo.draw();

        context.beginPath();
        context.moveTo(newPosition[0][0], newPosition[1][0]);
        context.lineTo(newPosition2[0][0], newPosition2[1][0]);
        context.stroke();
    }

    drawPreviewMirror(x, y){

        var espelho = this.mirror;
        
        espelho.addSegundoPonto(x, y);

        var norma1 = Norma(espelho);

        var senTeta = (espelho.ponto2.y-espelho.ponto1.y)/norma1;
        var cosTeta = (espelho.ponto2.x-espelho.ponto1.x)/norma1;

        var y = espelho.ponto2.y-(((espelho.ponto2.y - espelho.ponto1.y)* espelho.ponto2.x)/(espelho.ponto2.x-espelho.ponto1.x));
        
        var invTranslationMatrix = [[1, 0, 0],[0, 1, -y],[0, 0, 1]];
        var rotationMatrix = [[cosTeta, senTeta, 0],[-senTeta, cosTeta, 0],[0, 0, 1]];
        var mirrorMatrix = [[1, 0, 0],[0, -1, 0],[0, 0, 1]];
        var invRotationMatrix = [[cosTeta, -senTeta, 0],[senTeta, cosTeta, 0],[0, 0, 1]];
        var translationMatrix = [[1, 0, 0],[0, 1, y],[0, 0, 1]];
 

        var newPosition;
        var newPosition2;
        var currentPosition;
        var currentPosition2;

        currentPosition = [[this.ponto1.x], [this.ponto1.y], [1]];
        newPosition = multiplyMatrix(translationMatrix, multiplyMatrix(invRotationMatrix, multiplyMatrix(mirrorMatrix, multiplyMatrix(rotationMatrix, multiplyMatrix(invTranslationMatrix, currentPosition)))));

        currentPosition2 = [[this.ponto2.x], [this.ponto2.y], [1]];
        newPosition2 = multiplyMatrix(translationMatrix, multiplyMatrix(invRotationMatrix, multiplyMatrix(mirrorMatrix, multiplyMatrix(rotationMatrix, multiplyMatrix(invTranslationMatrix, currentPosition2)))));

        context.clearRect(0, 0, canvas.width, canvas.height);

        context.beginPath();
        context.strokeStyle = "green";
        context.moveTo(newPosition[0][0], newPosition[1][0]);
        context.lineTo(newPosition2[0][0], newPosition2[1][0]);
        context.stroke();

        espelho.color = "blue";
        espelho.draw();
        reDraw();
    }

    reflection(x, y){
        this.mirror.addSegundoPonto(x, y);

        var norma1 = Norma(this.mirror);

        var senTeta = (this.mirror.ponto2.y-this.mirror.ponto1.y)/norma1;
        var cosTeta = (this.mirror.ponto2.x-this.mirror.ponto1.x)/norma1;


        var y = this.mirror.ponto2.y-(((this.mirror.ponto2.y - this.mirror.ponto1.y)* this.mirror.ponto2.x)/(this.mirror.ponto2.x-this.mirror.ponto1.x));
        
        var invTranslationMatrix = [[1, 0, 0],[0, 1, -y],[0, 0, 1]];
        var rotationMatrix = [[cosTeta, senTeta, 0],[-senTeta, cosTeta, 0],[0, 0, 1]];
        var mirrorMatrix = [[1, 0, 0],[0, -1, 0],[0, 0, 1]];
        var invRotationMatrix = [[cosTeta, -senTeta, 0],[senTeta, cosTeta, 0],[0, 0, 1]];
        var translationMatrix = [[1, 0, 0],[0, 1, y],[0, 0, 1]];

        var newPosition;
        var newPosition2;
        var currentPosition;
        var currentPosition2;

        currentPosition = [[this.ponto1.x], [this.ponto1.y], [1]];
        newPosition = multiplyMatrix(translationMatrix, multiplyMatrix(invRotationMatrix, multiplyMatrix(mirrorMatrix, multiplyMatrix(rotationMatrix, multiplyMatrix(invTranslationMatrix, currentPosition)))));

        currentPosition2 = [[this.ponto2.x], [this.ponto2.y], [1]];
        newPosition2 = multiplyMatrix(translationMatrix, multiplyMatrix(invRotationMatrix, multiplyMatrix(mirrorMatrix, multiplyMatrix(rotationMatrix, multiplyMatrix(invTranslationMatrix, currentPosition2)))));
        
        
        this.ponto1.x = newPosition[0][0];
        this.ponto1.y = newPosition[1][0];
        this.ponto2.x = newPosition2[0][0];
        this.ponto2.y = newPosition2[1][0];
        this.mirror = null;
    }

}

function multiplyMatrix(matrixA, matrixB)
{
    var result = [[0],[0],[0]];//declare an array   

    //var numColsRows=$("#matrixRC").val();
    numColsRows=matrixA.length;
    
    //iterating through first matrix rows
    for (var i = 0; i < numColsRows; i++) 
    { 
        //iterating through second matrix columns
        for (var j = 0; j < matrixB[0].length; j++) 
        { 
            //calculating sum of pairwise products
            for (var k = 0; k < numColsRows; k++) 
            {
                result [i][j] += matrixA[i][k]*matrixB[k][j];
            }//for 3
            
            //result.push(matrixRow);
        }//for 2
    }//for 1
    return result;
}// 