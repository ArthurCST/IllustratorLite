class Curva{
    constructor(){
        this.pontos = [];
        this.color = "black";
    }
    addPonto(cx, cy){
        this.pontos.push(new Ponto(cx,cy));
    }
    
    restore(){
        
    }

    draw(){
        context.beginPath();
        context.strokeStyle = this.color;
        context.moveTo(this.pontos[0].x, this.pontos[0].y);
        context.bezierCurveTo(this.pontos[0].x, this.pontos[0].y, this.pontos[2].x, this.pontos[2].y, this.pontos[1].x, this.pontos[1].y);
        context.stroke();
        context.closePath();
    }

    drawPreview(x, y) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        reDraw();

        context.strokeStyle = "green";

        if (this.pontos.length == 2) {
            context.beginPath();
            //context.moveTo(this.pontos[0].x, this.pontos[0].y);
            context.bezierCurveTo(this.pontos[0].x, this.pontos[0].y, x, y, this.pontos[1].x, this.pontos[1].y);
            context.stroke();
        }else if (this.pontos.length == 1){
            context.clearRect(0, 0, canvas.width, canvas.height);
            reDraw();

            context.strokeStyle = "green";

            context.beginPath();
            context.moveTo(this.pontos[0].x, this.pontos[0].y);
            context.lineTo(x, y);
            context.stroke();
        }
    }

}