class Cercle {
    constructor(rayon){
        this.rayon = rayon;
    }
    
    aire(){
        return Math.PI * Math.pow(this.rayon, 2);
    }
    perimetre(){
    	return Math.PI * 2 * this.rayon;
    }
}

let c = new Cercle(5);
console.log({'aire': c.aire(), 'perimetre': c.perimetre()});