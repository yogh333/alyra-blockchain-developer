function PowerOf2(n){
	if (n  === 1)
		return 0;
	else
		return (Math.floor(n / 2) + PowerOf2(Math.floor(n / 2)));
}

function Product(n){
	//console.log("Product = " + n);
	if (n  === 1)
		return n;
	else {
		let product = 1;
		let factor = (n % 2 === 0 ? n-1:n);
		while (factor >= 1){
			product *= factor;
			factor -= 2;
		}
		factor = Math.floor(n / 2); 
		return product * Product(factor);
	}	
}


function Factorial(n){
	
	let powerOf2 = PowerOf2(n);
	//console.log("Power of 2 = " + powerOf2);
	let value = Math.pow(2, powerOf2);

	return Product(n) * Math.pow(2, powerOf2);
}
console.log(Factorial(20));