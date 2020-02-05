const utf16_A = "A".charCodeAt(0);
const utf16_Z = "Z".charCodeAt(0);
const utf16_a = "a".charCodeAt(0);
const utf16_z = "z".charCodeAt(0);

function cipher(data, key){
	let out = "";
	for (let i = 0; i < data.length; i++){
		let code = data.charCodeAt(i);

		if ( ((code >= utf16_A) && (code <= utf16_Z)) ||
			  (( code >= utf16_a) && (code <= utf16_z)) ) {

			if (code <= utf16_Z)
				code = "A".charCodeAt(0) + (code - "A".charCodeAt(0) + key) % 26;
			else
				code = "a".charCodeAt(0) + (code - "a".charCodeAt(0) + key) % 26;
		}
		out += String.fromCharCode(code);
			
			
	}
	return out;
}

let text = "je planche sur 34 exercices de blockchain";
console.log(cipher(text, 23));
