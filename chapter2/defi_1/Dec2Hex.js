const hexDigit = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];

/* return the decimal value in hexa format (1 or 2 or 4 or 8 or 16 or ... pow(2,n) bytes) */
const Dec2Hex = function(value){
	let p = 2;
	let hex = [];
	let d;

	while (Math.pow(16, p) <= value)
		p *= 2;

	for (let i = (p - 1); i >= 0; i--){
		d = Math.floor(value / Math.pow(16, i));
		hex.push(hexDigit[d]);
		value %= Math.pow(16, i);
	}
	return '0x'+hex.join('');
}

document.getElementById('convert_dec2hex').addEventListener('click', event => {
 	decimal = document.getElementById('decimal_in').value;
 	document.getElementById('hexadecimal_out').innerHTML = Dec2Hex(decimal);
 })