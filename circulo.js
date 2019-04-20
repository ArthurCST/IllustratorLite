class Circulo{
    constructor(cx, cy) {
        this.ponto1 = new Ponto(cx, cy);
        this.ponto2;
        this.r = 0;
        this.eixo;
        this.color = "black";
    }

    addSegundoPonto(cx, cy){
        this.ponto2 = new Ponto(cx, cy);
    }

    addEixo(cx, cy){
        this.eixo = new Ponto(cx, cy);
    }

    Selecao(mx, my, t) {
        var a = (mx+t) - this.ponto1.x;
        var b = (my+t) - this.ponto1.y;
        var r = Math.sqrt(a*a + b*b);

        return  (r < this.r);
    }

    selected(){
        this.color = "red";
    }

    restore(){
        this.color = "black";
    }

    draw(){
        var dx = this.ponto1.x - this.ponto2.x;
        var dy = this.ponto1.y - this.ponto2.y;
        var dist = Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2));
        this.r = dist;
        context.beginPath();
        context.strokeStyle = this.color;
        context.arc(this.ponto1.x, this.ponto1.y, dist, 0, Math.PI*2);
        context.stroke();
        context.closePath();
    }

    drawPreview(x, y) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        reDraw();

        context.strokeStyle = "green";
        var dx = this.ponto1.x - x;
        var dy = this.ponto1.y - y;
        var dist = Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2));

        context.beginPath();
        
        context.arc(this.ponto1.x, this.ponto1.y, dist, 0, Math.PI*2);
        context.stroke();
    }

    translation(cx, cy){

        var x = cx - this.ponto1.x;
        var y = cy - this.ponto1.y;

        var newPositon2;
        var currentPosition2 = [[this.ponto2.x], [this.ponto2.y], [1]];
        var translationMatrix = [[1, 0, x],[0, 1, y],[0, 0, 1]];
       
        newPositon2 = multiplyMatrix(translationMatrix, currentPosition2);

        var dx = cx - newPositon2[0][0];
        var dy = cy - newPositon2[1][0];
        var dist = Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2));

        this.ponto1.x = cx;
        this.ponto1.y = cy;

        this.ponto2.x = newPositon2[0][0];
        this.ponto2.y = newPositon2[1][0];

        this.r = dist;

    }

    drawPreviewTranslation(cx, cy){

        var x = cx - this.ponto1.x;
        var y = cy - this.ponto1.y;

        var newPositon2;
        var currentPosition2 = [[this.ponto2.x], [this.ponto2.y], [1]];
        var translationMatrix = [[1, 0, x],[0, 1, y],[0, 0, 1]];
       
        newPositon2 = multiplyMatrix(translationMatrix, currentPosition2);

        var dx = cx - newPositon2[0][0];
        var dy = cy - newPositon2[1][0];
        var dist = Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2));
        

        context.clearRect(0, 0, canvas.width, canvas.height);
        reDraw();

        context.strokeStyle = "green";

        context.beginPath();
        
        context.arc(cx, cy, dist, 0, Math.PI*2);
        context.stroke();

        reDraw();
    }

    scale(cx, cy){
        var dx = this.ponto1.x - cx;
        var dy = this.ponto1.y - cy;
        var dist = Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2));
        this.r = dist;
        this.ponto2.x = cx;
        this.ponto2.y = cy;

    }

    drawPreviewScale(cx, cy){

        context.clearRect(0, 0, canvas.width, canvas.height);
        reDraw();

        context.strokeStyle = "green";
        var dx = this.ponto1.x - cx;
        var dy = this.ponto1.y - cy;
        var dist = Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2));

        context.beginPath();
        
        context.arc(this.ponto1.x, this.ponto1.y, dist, 0, Math.PI*2);
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
        
        var newPositon;
        var currentPosition = [[this.ponto1.x], [this.ponto1.y], [1]];
        newPositon = multiplyMatrix(translationMatrix, multiplyMatrix(rotationMatrix, multiplyMatrix(invTranslationMatrix, currentPosition)));

        var newPositon2;
        var currentPosition2 = [[this.ponto2.x], [this.ponto2.y], [1]];
        newPositon2 = multiplyMatrix(translationMatrix, multiplyMatrix(rotationMatrix, multiplyMatrix(invTranslationMatrix, currentPosition2)));

        this.ponto1.x = newPositon[0][0];;
        this.ponto1.y = newPositon[1][0];;

        this.ponto2.x = newPositon2[0][0];
        this.ponto2.y = newPositon2[1][0];

        var dx = this.ponto1.x - this.ponto2.x;
        var dy = this.ponto1.y - this.ponto2.y;
        var dist = Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2));
        this.r = dist;
        
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
        
        var newPositon;
        var currentPosition = [[this.ponto1.x], [this.ponto1.y], [1]];
        newPositon = multiplyMatrix(translationMatrix, multiplyMatrix(rotationMatrix, multiplyMatrix(invTranslationMatrix, currentPosition)));

        var newPositon2;
        var currentPosition2 = [[this.ponto2.x], [this.ponto2.y], [1]];
        newPositon2 = multiplyMatrix(translationMatrix, multiplyMatrix(rotationMatrix, multiplyMatrix(invTranslationMatrix, currentPosition2)));

        var dx = newPositon[0][0] - newPositon2[0][0];
        var dy = newPositon[1][0] - newPositon2[1][0];
        var dist = Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2));

        context.clearRect(0, 0, canvas.width, canvas.height);
        reDraw();

        context.strokeStyle = "green";

        this.eixo.draw();

        context.beginPath();
        
        context.arc(newPositon[0][0], newPositon[1][0], dist, 0, Math.PI*2);
        context.stroke();

    }

}