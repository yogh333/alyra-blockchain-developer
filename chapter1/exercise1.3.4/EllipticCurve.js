class EllipticCurve {
	constructor(a ,b){
		if ( (4*Math.pow(a, 3) + 27*Math.pow(b, 2)) !== 0){
			this.a = a;
			this.b = b;
		}
		else
		{
			console.log("a and b does not satisfy 4 x ( a x a x a) + 27 x (b x b) = 0");
		}
	}

	equal(ecurve){
		if ((this.a === ecurve.a) && (this.b === ecurve.b))
			return true;
		else
			return false;
	}

	testPoint(x, y){
		if (Math.pow(x, 3)+this.a*x+this.b-Math.pow(y,2) === 0)
			return true;
		else 
			return false;
	}

	toString(){
		return this.a + ", " + this.b;
	}
}

a = new EllipticCurve(20, 0);
b = new EllipticCurve(23, 0);
console.log(a.equal(b));
console.log(b.toString());

