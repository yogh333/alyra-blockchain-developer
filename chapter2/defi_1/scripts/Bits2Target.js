const computeTarget = (bits) => {

	if (bits.length == 8) {
		let exponent = parseInt(bits[0] + bits[1], 16);
		let coefficient = bits.slice(2);

		let target = coefficient.padEnd(exponent * 2, '0');
		target = target.padStart(64, '0');

    	return target;
    }
    else 
    	console.err("Wrong format for bits arg");
};

document.getElementById('compute_target').addEventListener('click', event => {
 	bitstream = document.getElementById('bits_in').value;
 	document.getElementById('target_out').innerHTML = computeTarget(bitstream);
 })