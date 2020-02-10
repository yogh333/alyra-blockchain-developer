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
	return hex;
}

const Hex2String = function(s, be_flag, varint_flag){
	
	let hexString = "0x ";
	if (varint_flag === true)
			hexString += ((s.length << 1) === 8 ? "ff " : ((s.length << 1) === 4 ? "fe " : (((s.length << 2) === 2) ? "fd ": "")));

	if (be_flag === true)
		j = 0;
	else
		j = s.length - 2;

	for (let i = 0; i < s.length; i+=2){
		hexString += s[j % s.length] + s[ (j+1)%s.length];
		hexString += " ";
		j += 2;
	}
	return hexString;
}

let hexaNumber = Dec2Hex(466321);
console.log(hexaNumber);
console.log(Hex2String(hexaNumber, true, false));
console.log(Hex2String(hexaNumber, false, false));
console.log(Hex2String(hexaNumber, false, true));