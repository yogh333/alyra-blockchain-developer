let histogram = [];

function count(code){
	let idx = 0;
	let pair = histogram[idx++];
	while (pair !== undefined){
		if (pair[0] === code)
			break;
		else 
			pair = histogram[idx++];
	}
	if (pair !== undefined)
		pair[1] += 1;
	else {
		pair = [code, 1];
		histogram.push(pair);
	}
}

let text = "AAAAAAAAABBBBBBBBBGGGGGGGGGUUU";

for (let i = 0; i < text.length; i++){
	count(text.charCodeAt(i));
}

let out = "";
for (let i in histogram){
	out += String.fromCharCode(histogram[i][0]) + ": " + histogram[i][1]+", ";
}
console.log(out);