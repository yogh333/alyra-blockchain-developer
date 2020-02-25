const TargetReached = function(coeff, exp, hash){

	let target = coeff.padEnd(exp * 2, '0'); //.padStart(64, '0');
	target = target.padStart(64, '0');
	console.log("Target = " + target + " Length = " + target.length);
	console.log("Hash   = " + hash  + " Length = " + hash.length);

	let h = 0;
	let t = 0;
	while (hash[h] === '0')
		h++;
	while (target[t] === '0')
		t++;

	if (h > t)
		return true;
	else if (h < t)
		return false;
	else { /* same number of leading zeros */
		let valTarget = 0; 
		let valHash = 0;
		while ((valTarget === valHash) && (t < target.length)) {
			valTarget = parseInt(target[t++], 16);
			valHash = parseInt(hash[h++], 16);
		}
		 if (valHash < valTarget)
		 	return true;
		 else 
		 	return false;
	} 
}

let coefficient = "3218a5";
let exponent = 23;
let hash = "00000000000000000019b2634066a100e56ed58a0ae40ca5a4e2d1dba6a4be22"

console.log(TargetReached(coefficient, exponent, hash));