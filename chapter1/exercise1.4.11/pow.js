var crypto = require('crypto');
const sha256 = crypto.createHash('sha256');

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function stringRandom(n){
	let out ='';
	for (let i = 0; i < n; i++)
		out += String.fromCharCode(0x41+getRandomInt(26));
	return out;
}

function find(target, length){
	let counter = 0;
	let s = stringRandom(length);
	console.log("Counter = " + counter++ + " Target = " + target + " String = " + s);
	while (s.startsWith(target) != true){
		s = stringRandom(length);
		console.log("Counter = " + counter++ + " Target = " + target + " String = " + s);
	}
}

let target = "ZOBIT";
find(target, 16);
