const SwapBytes = function(inString, revert_flag){
	let outString = "";
	if (revert_flag === false)
		j = 0;
	else
		j = inString.length - 2;

	for (let i = 0; i < inString.length; i+=2){
		outString += inString[j] + inString[(j+1)];
		if (revert_flag === false) 
			j += 2;
		else 
			j -= 2;
	}
	return outString;
}


const getVarInt = function(bitstream){
	let k = 0;
	let value = parseInt(bitstream.substring(k, k + 2), 16);
	console.log(value);
	k += 2;
	switch(value){
		case 0xFD:
			value = parseInt(SwapBytes(bitstream.substring(k, k + 4), true), 16);
			k += 4;
			break;
		case 0xFE:
			value = parseInt(SwapBytes(bitstream.substring(k, k + 8), true), 16);
			k += 8;
			break;
		case 0xFF:
			value = parseInt(SwapBytes(bitstream.substring(k, k + 16), true), 16);
			k += 16
			break;
		default:
			break;
	}

	return value;
}

document.getElementById('convert_varint').addEventListener('click', event => {
 	bitstream = document.getElementById('varInt_in').value;
 	document.getElementById('varInt_out').innerHTML = getVarInt(bitstream);
 })