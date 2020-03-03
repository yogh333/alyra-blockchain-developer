const calculerDifficulte = (bits) => {
	if (bits.length == 10) {
		let exponent = parseInt(bits[2] + bits[3], 16);
		let coefficient = parseInt(bits.slice(4), 16);

    	return ((Math.pow(2, 16) - 1) * Math.pow(2, 208)) / (coefficient * Math.pow(2, 8*(exponent-3)));
    }
    else 
    	console.err("Wrong format for bits arg");
} ;

console.log(calculerDifficulte("0x1c0ae493"));
console.log(calculerDifficulte("0x03000001"));
