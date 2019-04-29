class Poligono {

    constructor(){
        this.coord = [];
        this.start = false;
        this.color = "black";
        this.eixo;
        this.context;
        this.mirror;
        
    }
    addMirror(x, y){
        this.mirror = new Linha(x, y);
    }

    getTotalCoords(){
        return this.coord.length;
    }

    addPonto(x,y){
        this.coord.push(new Ponto(x,y));
    }
    addEixo(cx, cy){
        this.eixo = new Ponto(cx, cy);
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

    translation(cx, cy){

        var x = cx - this.coord[0].x;
        var y = cy - this.coord[0].y;
        
        this.coord[0].x = cx;
        this.coord[0].y = cy;

        var newPosition;
        for (let i = 1; i < this.coord.length; i++) {
            var currentPosition = [[this.coord[i].x], [this.coord[i].y], [1]];
            var translationMatrix = [[1, 0, x],[0, 1, y],[0, 0, 1]];
            newPosition = multiplyMatrix(translationMatrix, currentPosition);
            this.coord[i].x = newPosition[0][0];
            this.coord[i].y = newPosition[1][0];
        }
    }

    drawPreviewTranslation(cx, cy){

        var x = cx - this.coord[0].x;
        var y = cy - this.coord[0].y;

        context.beginPath();
        context.clearRect(0, 0, canvas.width, canvas.height);
        reDraw();
        context.strokeStyle = "green";
        context.moveTo(cx, cy);

        var newPosition;
        for (let i = 1; i < this.coord.length; i++) {
            var currentPosition = [[Math.abs(this.coord[i].x)], [Math.abs(this.coord[i].y)], [1]];
            var translationMatrix = [[1, 0, x],[0, 1, y],[0, 0, 1]];
            newPosition = multiplyMatrix(translationMatrix, currentPosition);
            context.lineTo(newPosition[0][0], newPosition[1][0]);
        }
        context.lineTo(cx, cy);
        context.stroke();
        
        
        context.closePath();
    }

    scale(cx, cy){
        var x = Math.abs(cx - this.coord[0].x);
        var y = Math.abs(cy - this.coord[0].y);
        var center = this.getCenter();
        var newPosition;

        var currentPosition;
        var scaleMatrix = [[x/100, 0, 0],[0, y/100, 0],[0, 0, 1]];
        var translationMatrix = [[1, 0, center.x],[0, 1, center.y],[0, 0, 1]];
        var invTranslationMatrix = [[1, 0, -center.x],[0, 1, -center.y],[0, 0, 1]];

        for (let i = 0; i < this.coord.length; i++) {
            currentPosition = [[this.coord[i].x], [this.coord[i].y], [1]];
            newPosition = multiplyMatrix(translationMatrix, multiplyMatrix(scaleMatrix, multiplyMatrix(invTranslationMatrix, currentPosition)));
            this.coord[i].x = newPosition[0][0];
            this.coord[i].y = newPosition[1][0];
        }

    }

    drawPreviewScale(cx, cy){

        var x = Math.abs(cx - this.coord[0].x);
        var y = Math.abs(cy - this.coord[0].y);
        var center = this.getCenter();
        var newPosition;

        var currentPosition = [[this.coord[0].x], [this.coord[0].y], [1]];
        var scaleMatrix = [[x/100, 0, 0],[0, y/100, 0],[0, 0, 1]];
        var translationMatrix = [[1, 0, center.x],[0, 1, center.y],[0, 0, 1]];
        var invTranslationMatrix = [[1, 0, -center.x],[0, 1, -center.y],[0, 0, 1]];
        newPosition = multiplyMatrix(translationMatrix, multiplyMatrix(scaleMatrix, multiplyMatrix(invTranslationMatrix, currentPosition)));

        context.clearRect(0, 0, canvas.width, canvas.height);
        reDraw();
        var b1 = newPosition[0][0];
        var b2 = newPosition[1][0];
        context.beginPath();
        context.strokeStyle = "green";
        context.moveTo(b1, b2);
        
        for (let i = 1; i < this.coord.length; i++) {
            currentPosition = [[this.coord[i].x], [this.coord[i].y], [1]];
            newPosition = multiplyMatrix(translationMatrix, multiplyMatrix(scaleMatrix, multiplyMatrix(invTranslationMatrix, currentPosition)));
            context.lineTo(newPosition[0][0], newPosition[1][0]);
        }
        context.lineTo(b1, b2);
        context.stroke();
    }

    getCenter(){
        var x;
        var y;

        var x_min = this.coord[0].x;
        var y_min = this.coord[0].y;

        var x_max = this.coord[0].x;
        var y_max = this.coord[0].y;

        for(let i=1; i<this.coord.length; i++){
            if(this.coord[i].x < x_min){
                x_min = this.coord[i].x;
            }
            if(this.coord[i].y < y_min){
                y_min = this.coord[i].y;
            }
            if(this.coord[i].x > x_max){
                x_max = this.coord[i].x;
            }
            if(this.coord[i].y > y_max){
                y_max = this.coord[i].y;
            }
        }

        x = x_min + ((x_max-x_min)/2);
        y = y_min + ((y_max-y_min)/2);
        var center = new Ponto(x,y);
        return center;
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
        var currentPosition;
        
        for (let i = 0; i < this.coord.length; i++) {
            currentPosition = [[this.coord[i].x], [this.coord[i].y], [1]];
            newPosition = multiplyMatrix(translationMatrix, multiplyMatrix(rotationMatrix, multiplyMatrix(invTranslationMatrix, currentPosition)));
            this.coord[i].x = newPosition[0][0];
            this.coord[i].y = newPosition[1][0];
        }
        
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
        var currentPosition = [[this.coord[0].x], [this.coord[0].y], [1]];
        
        newPosition = multiplyMatrix(translationMatrix, multiplyMatrix(rotationMatrix, multiplyMatrix(invTranslationMatrix, currentPosition)));
        var b1 = newPosition[0][0];
        var b2 = newPosition[1][0];

        context.clearRect(0, 0, canvas.width, canvas.height);
        reDraw();

        this.eixo.draw();

        context.beginPath();
        context.strokeStyle = "green";
        context.moveTo(b1, b2);
        
        for (let i = 1; i < this.coord.length; i++) {
            currentPosition = [[this.coord[i].x], [this.coord[i].y], [1]];
            newPosition = multiplyMatrix(translationMatrix, multiplyMatrix(rotationMatrix, multiplyMatrix(invTranslationMatrix, currentPosition)));
            context.lineTo(newPosition[0][0], newPosition[1][0]);
        }
        context.lineTo(b1, b2);
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
        var currentPosition;

        currentPosition = [[this.coord[0].x], [this.coord[0].y], [1]];
        newPosition = multiplyMatrix(translationMatrix, multiplyMatrix(invRotationMatrix, multiplyMatrix(mirrorMatrix, multiplyMatrix(rotationMatrix, multiplyMatrix(invTranslationMatrix, currentPosition)))));

        var b1 = newPosition[0][0];
        var b2 = newPosition[1][0];
        context.beginPath();
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.strokeStyle = "green";
        context.moveTo(b1, b2);
        for (let i = 1; i < this.coord.length; i++) {
            currentPosition = [[this.coord[i].x], [this.coord[i].y], [1]];
            newPosition = multiplyMatrix(translationMatrix, multiplyMatrix(invRotationMatrix, multiplyMatrix(mirrorMatrix, multiplyMatrix(rotationMatrix, multiplyMatrix(invTranslationMatrix, currentPosition)))));
            context.lineTo(newPosition[0][0], newPosition[1][0]);
        }
        context.lineTo(b1, b2);
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
        var currentPosition;

        for (let i = 0; i < this.coord.length; i++) {
            currentPosition = [[this.coord[i].x], [this.coord[i].y], [1]];
            newPosition = multiplyMatrix(translationMatrix, multiplyMatrix(invRotationMatrix, multiplyMatrix(mirrorMatrix, multiplyMatrix(rotationMatrix, multiplyMatrix(invTranslationMatrix, currentPosition)))));
            this.coord[i].x = newPosition[0][0];
            this.coord[i].y = newPosition[1][0];
        }
        this.mirror = null;
    }
}