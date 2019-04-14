class Circulo{
    constructor(cx, cy) {
        this.ponto1 = new Ponto(cx, cy);
        this.ponto2;
        this.r = 0;
        this.color = "black";
    }

    addSegundoPonto(cx, cy){
        this.ponto2 = new Ponto(cx, cy);
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
        this.r = dist;

        context.beginPath();
        
        context.arc(this.ponto1.x, this.ponto1.y, this.r, 0, Math.PI*2);
        context.stroke();
    }

}