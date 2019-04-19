class Ponto{
    constructor(cx, cy){
        this.x = cx;
        this.y = cy;
        this.w = 3;
        this.h = 3;
        this.color = "black";
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

   

}

function multMatrix(matA, matB){
    var newMatrix = [[0],[0],[0]];
    if(matA.length != matB.length){
        return null;
    }
    else{
        for (let i = 0; i < matA.length; i++) {
            for (let j = 0; j < matB.length; j++) {
                for (let k = 0; k < matA[0].length; k++) {
                    newMatrix[i][j] += matA[i][k]*matB[k][j];
                }
            }
            
        }
        return newMatrix;
    }
}

