const Le2Be = function(s){
	let hexString = "";
	if (s.length % 2 === 1)
		s = '0'+s;
	j = s.length - 2;

	for (let i = 0; i < s.length; i+=2){
		hexString += s[j] + s[(j+1)];
	
			j -= 2;
	}
	return hexString;
}

document.getElementById('convert_le2be').addEventListener('click', event => {
 	hexadecimal = document.getElementById('hexa_le_in').value;
 	document.getElementById('hexa_be_out').innerHTML = Le2Be(hexadecimal);
 })