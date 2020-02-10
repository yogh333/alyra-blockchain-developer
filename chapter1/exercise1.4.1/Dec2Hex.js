const hexDigit = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];

const Dec2Hex = function(value){
	let p = 1;
	let hex = "";
	let d;

	while ((Math.pow(16, p) - 1) < value)
		p++;

	for (let i = p; i >= 0; i--){
		d = Math.floor(value / Math.pow(16, i));
		hex += hexDigit[d];
		value %= Math.pow(16, i);
	}
	return hex;
}

const DisplayHex = function(s, b){
	let hexString = (s.length%2 === 0 ? s:"0"+s);
	let dHexString = "0x ";
	if (b === true){
		for (let i = 0; i < hexString.length; i+=2){
			dHexString += hexString[i]+hexString[i+1];
			dHexString += " ";
		}
	}
	else
	{
		for (let i = hexString.length - 1; i > 0; i-=2){
			dHexString += hexString[i-1]+hexString[i];
			dHexString += " ";
		}
	}
	return dHexString;
}

let hexaString = Dec2Hex(466321);

console.log(DisplayHex(hexaString, true));
console.log(DisplayHex(hexaString, false));