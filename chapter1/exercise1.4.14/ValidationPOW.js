var crypto = require('crypto');
const sha256_1 = crypto.createHash('sha256');
const sha256_2 = crypto.createHash('sha256');

const Hex2String = function(s, revert_flag){
	let hexString = "";
	if (revert_flag === false)
		j = 0;
	else
		j = s.length - 2;

	for (let i = 0; i < s.length; i+=2){
		hexString += s[j] + s[(j+1)];
		if (revert_flag === false) 
			j += 2;
		else 
			j -= 2;
	}
	return hexString;
}

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

const BLOCKVERSION_SIZE = 4;
const PREVBLOCKHASH_SIZE = 32;
const MROOT_SIZE = 32;
const TIMESTAMP_SIZE = 4;
const TARGET_SIZE = 4;
const NONCE_SIZE = 4;

class Block{
	constructor(bitstream){

		let k = 0;

		this.version = Hex2String(bitstream.substring(k, k + BLOCKVERSION_SIZE * 2), true);
		k += BLOCKVERSION_SIZE * 2;

		this.prevBlockHash = Hex2String(bitstream.substring(k, k + PREVBLOCKHASH_SIZE * 2), false);
		k += PREVBLOCKHASH_SIZE * 2;

		this.merkleRoot = Hex2String(bitstream.substring(k, k + MROOT_SIZE * 2), false);
		k += MROOT_SIZE * 2;

		this.timestamp = Hex2String(bitstream.substring(k, k + TIMESTAMP_SIZE * 2), true);
		k += TIMESTAMP_SIZE * 2;

		this.target = Hex2String(bitstream.substring(k, k + TARGET_SIZE * 2), true);
		k += TARGET_SIZE * 2;

		this.nonce = Hex2String(bitstream.substring(k, k + NONCE_SIZE * 2), true);
		k += NONCE_SIZE * 2;

	}

	toString(){
		let out ="";

		out += "VERSION                  = " + this.version + "\n";
		out += "PREV BLOCK HASH          = " + this.prevBlockHash + "\n";
		out += "MERKLE ROOT              = " + this.merkleRoot + "\n";
		out += "TIMESTAMP                = " + this.timestamp + "\n";
		out += "TARGET                   = " + this.target + "\n";
		out += "NONCE                    = " + this.nonce + "\n";

		return out;
	}
}

let s = "01000000008de6ae7a37b4f26a763f4d" +
		"65c5bc7feb1ad9e3ce0fff4190c067f0" +
		"000000000913281db730c5cff9871463" +
		"30508c88cc3e642d1b9f5154854764fd" +
		"547e0a54eaf26849ffff001d2e4a4c3d" /* block header */
		"01010000000100000000000000000000" +
		"00000000000000000000000000000000" +
		"000000000000ffffffff0704ffff001d" +
		"013fffffffff0100f2052a0100000043" +
		"41041ada81ea00c11098d2f52c20d5aa" +
		"9f5ba13f9b583fda66f2a478dd7d95a7" +
		"ab615159d98b63df2e6f3ecb3ef9eda1" +
		"38e4587e7afd31e7f434cbb6837e17fe" +
		"b0c5ac00000000";

/*s = "010000009500c43a25c624520b5100ad" +
	"f82cb9f9da72fd2447a496bc600b0000" +
	"000000006cd862370395dedf1da2841c" +
	"cda0fc489e3039de5f1ccddef0e83499" +
	"1a65600ea6c8cb4db3936a1ae3143991"; */
	
let block = new Block(s);

console.log(block.target);

//let hashBlock = sha256.update(Buffer.from(sha256.update(s.slice(0, 80)).digest('hex'),'hex')).digest('hex');
let hashBlock = sha256_1.update(Buffer.from(s.slice(0, 160), 'hex')).digest('hex');
let hashBlock2 = sha256_2.update(Buffer.from(hashBlock, 'hex')).digest('hex');
let exponent = parseInt(block.target[0]+block.target[1], 16);
let coefficient = block.target.slice(2);

console.log(Hex2String(hashBlock2, true) + " " + exponent + " " + coefficient);
console.log(TargetReached(coefficient, exponent, Hex2String(hashBlock2, true)));
