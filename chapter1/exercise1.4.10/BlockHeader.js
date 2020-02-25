/*

Block Header format

Field			Size (bytes)			Endianness			Description

VERSION				4					BE					Protocole version
PREV_BLOCK_HASH		32					BE  				Previous block header hash
M_ROOT				32					BE					Merkle Root
TIMESTAMP			4					BE					Nb of seconds since Epoch Time (January 1st, 1970)
TARGET				4					BE  				Max value Target
NONCE				4					BE   				

*/

const Hex2String = function(s, revert_flag){
	
	let hexString = "";

	if (revert_flag === false)
		j = 0;
	else
		j = s.length - 2;

	for (let i = 0; i < s.length; i+=2){
		hexString += s[j] + s[(j+1)];
		//hexString += " ";
		if (revert_flag === false) 
			j += 2;
		else 
			j -= 2;
	}
	return hexString;
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

let s = "010000009500c43a25c624520b5100adf82cb9f9da72fd2447a496bc600b0000000000006cd862370395dedf1da2841ccda0fc489e3039de5f1ccddef0e834991a65600ea6c8cb4db3936a1ae3143991";
let block = new Block(s);
console.log(block.toString());