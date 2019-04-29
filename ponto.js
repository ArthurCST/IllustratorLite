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
 
        var vetorBase = new Linha(0, 0);
        vetorBase.addSegundoPonto(0, canvas.height);

        var norma1 = Norma(espelho);
        var norma2 = Norma(vetorBase);
        var produtoInterno = ProdutoInterno(espelho, vetorBase);
        arccos = Math.acos(((produtoInterno) / (norma1 * norma2)));
        var teta = arccos*180/Math.PI; 

        var invTranslationMatrix = [[1, 0, -this.x],[0, 1, -this.y],[0, 0, 1]];
        var rotationMatrix = [[Math.cos(teta), -Math.sin(teta), 0],[Math.sin(teta), Math.cos(teta), 0],[0, 0, 1]];
        var invrotationMatrix = [[Math.cos(teta), Math.sin(teta), 0],[-Math.sin(teta), Math.cos(teta), 0],[0, 0, 1]];
        var mirrorMatrix = [[-1, 0, 0],[0, 1, 0],[0, 0, 1]];
        var translationMatrix = [[1, 0, this.x],[0, 1, this.y],[0, 0, 1]];

        var newPosition;
        var currentPosition;
        currentPosition = [[this.x], [this.y], [1]];
        newPosition = multiplyMatrix(translationMatrix, multiplyMatrix(invrotationMatrix, multiplyMatrix(mirrorMatrix, multiplyMatrix(rotationMatrix, multiplyMatrix(invTranslationMatrix, currentPosition)))));

        context.clearRect(0, 0, canvas.width, canvas.height);
        
        context.beginPath();
        context.fillStyle = "green";
        context.fillRect(newPosition[0][0], newPosition[1][0], 3, 3);

        reDraw();
    }

   

}

