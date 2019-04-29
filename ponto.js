class Ponto{
    constructor(cx, cy){
        this.x = cx;
        this.y = cy;
        this.w = 3;
        this.h = 3;
        this.color = "black";
        this.mirror;
    }
    addMirror(x, y){
        this.mirror = new Linha(x, y);
    }

    draw(){
        context.beginPath();
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.w, this.h);
        context.closePath();
    }

    selected(){
        this.color = "red";
    }

    restore(){
        this.color = "black";
    }

    Selecao(mx, my, t){

        if(((this.x-t) <= mx) && (mx <= (this.x+t))){
            if(((this.y-t) <= my) && (my <= (this.y+t))){
                return true;
            }
        }
        return false;

    }

    translation(x, y){
        this.x = x;
        this.y = y;
    }

    drawPreview(x, y) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        context.beginPath();
        context.fillStyle = "green";
        context.fillRect(x, y, 3, 3);

        reDraw();
        
    }

    drawPreviewTranslation(x, y){
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        context.beginPath();
        context.fillStyle = "green";
        context.fillRect(x, y, 3, 3);

        reDraw();
    }

    drawPreviewMirror(x, y){

        var espelho = this.mirror;
        
        context.beginPath();
        context.fillStyle = "blue";
        context.fillRect(this.mirror.ponto1.x, this.mirror.ponto1.y, this.w, this.h);
        context.closePath();
        
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
        var currentPosition;
        currentPosition = [[this.x], [this.y], [1]];
        newPosition = multiplyMatrix(translationMatrix, multiplyMatrix(invRotationMatrix, multiplyMatrix(mirrorMatrix, multiplyMatrix(rotationMatrix, multiplyMatrix(invTranslationMatrix, currentPosition)))));

        context.clearRect(0, 0, canvas.width, canvas.height);
        
        context.beginPath();
        context.fillStyle = "green";
        context.fillRect(newPosition[0][0], newPosition[1][0], 3, 3);

        espelho.color = "blue";
        espelho.draw();
        reDraw();
    }

    reflection(x, y){
        this.mirror.addSegundoPonto(x, y);
        var vetorBase = new Linha(0, 0);
        vetorBase.addSegundoPonto(canvas.width, 0);

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
        var currentPosition;
        currentPosition = [[this.x], [this.y], [1]];
        newPosition = multiplyMatrix(translationMatrix, multiplyMatrix(invRotationMatrix, multiplyMatrix(mirrorMatrix, multiplyMatrix(rotationMatrix, multiplyMatrix(invTranslationMatrix, currentPosition)))));
        this.x = newPosition[0][0];
        this.y = newPosition[1][0];
        this.mirror = null;
    }
   

}

