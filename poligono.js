class Poligono {

    constructor(){
        this.coord = [];
        this.start = false;
        this.color = "black";
        this.context;
        
    }

    getTotalCoords(){
        return this.coord.length;
    }

    addPonto(x,y){
        this.coord.push(new Ponto(x,y));
    }

    drawning(){
        context.clearRect(0, 0, canvas.width, canvas.height);
        reDraw();
        context.beginPath();
        
        context.strokeStyle = this.color;
        context.moveTo(this.coord[0].x, this.coord[0].y);
        
        for(let i = 0; i < this.coord.length; i++){
            context.lineTo(this.coord[i].x, this.coord[i].y);
        }
        
        

        context.stroke();
        
    }

    drawPreview(x, y) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        reDraw();

        context.strokeStyle = "green";

        context.beginPath();
        context.moveTo(this.coord[this.coord.length-1].x, this.coord[this.coord.length-1].y);
        context.lineTo(x, y);
        context.stroke();
        
    }

    draw() {

        context.beginPath();
        
        context.strokeStyle = this.color;
        context.moveTo(this.coord[0].x, this.coord[0].y);
        for(let i = 0; i < this.coord.length; i++){
            context.lineTo(this.coord[i].x, this.coord[i].y);
        }

        context.lineTo(this.coord[0].x, this.coord[0].y);
        //this.ar = this.area();
        context.stroke();
        context.closePath();
        
    }

    area(){
        var determinantes = [];
        var normal = [];
        var i, j;

        var length = this.coord.length;

        for (i = 0; i < length - 1; i++) {
            determinantes.push(this.determinante(this.coord[i], this.coord[i + 1]));
        }

        determinantes.push(this.determinante(this.coord[length - 1], this.coord[0]));

        for (i = 0; i < 3; i++) {
            var aux = 0;

            for (j = 0; j < determinantes.length; j++) {
                var d = determinantes[j];
                aux += d[i];
            }

            normal[i] = aux / 2;
        }
        
        return Math.sqrt(Math.pow(normal[0], 2) + Math.pow(normal[1], 2) + Math.pow(normal[2], 2));
    }

    determinante(ponto1, ponto2) {
        var vetorResultante = [];
    
        var i1 = ponto1.y * 0;
        var i2 = ponto2.y * 0;
        var j1 = 0 * ponto2.x;
        var j2 = 0 * ponto1.x;
        var k1 = ponto1.x * ponto2.y;
        var k2 = ponto2.x * ponto1.y;
    
        vetorResultante[0] = i1 - i2;
        vetorResultante[1] = j1 - j2;
        vetorResultante[2] = k1 - k2;
    
        return vetorResultante;
    }
    selected(){
        
        this.color = "red";
        
    }

    restore(){
        this.color = "black";
    }

    Selecao(mx, my){

        let ni = 0;
        let fst = this.coord.length -1;
        let xc
        let p1, p2

        for(let i =0; i < this.coord.length; i++){
            p1 = this.coord[i];
            p2 = this.coord[fst];

            if(!(p1.y == p2.y) && !((p1.y > my) && (p2.y > my)) &&
                !((p1.y < my) && (p2.y < my)) && !((p1.x < mx) && (p2.x < mx))){
                if(p1.y == my){
                    if((p1.x > mx) && (p2.y > my))
                        ni++;
                }else{
                    if(p2.y == my){
                        if((p2.x > mx) && (p1.y > my))
                            ni++;
                    }else{
                        if((p1.x > mx) && (p2.x > mx)) {
                            ni++;
                        }else{
                            let dx = p1.x - p2.x;
                            xc = p1.x;
                            if( dx != 0){
                                xc += (my - p1.y) * dx / (p1.y - p2.y);
                                if(xc > mx)
                                    ni++;
                            }
                        }
                    }
                }
            }
            fst = i;
        }
        return(ni%2);
    }


}