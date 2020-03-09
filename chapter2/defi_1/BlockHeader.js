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


function ComputeTXID(txBitstream){
	let typedArray1 = new Uint8Array(txBitstream.length / 2);
	for (let i = 0; i < txBitstream.length; i+=2){
  		typedArray1[j] = parseInt(txBitstream[i] + txBitstream[i+1], 16);
  		j += 1;
  	}
//  	let hashBuffer = await crypto.subtle.digest('SHA-256', typedArray1);
//  	let hashBuffer = CryptoJS.AES.(typedArray1);
  	console.log(hashBuffer);
  	let hashArray = Array.from(new Uint8Array(hashBuffer));
  	//hashBuffer =  crypto.subtle.digest('SHA-256', hashArray);
  	//hashArray = Array.from(new Uint8Array(hashBuffer));
  	let hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
  	return hashHex;
}

const SwapEndian = function(s, revert_flag){
	
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

const readVarInt = function(bitstream){
	let k = 0;
	let value = parseInt(bitstream.substring(k, k + 2), 16);
	k += 2;
	switch(value){
		case 0xFD:
			value = parseInt(SwapEndian(bitstream.substring(k, k + 4), true), 16);
			k += 4;
			break;
		case 0xFE:
			value = parseInt(SwapEndian(bitstream.substring(k, k + 8), true), 16);
			k += 8;
			break;
		case 0xFF:
			value = parseInt(SwapEndian(bitstream.substring(k, k + 16), true), 16);
			k += 16
			break;
		default:
			break;
	}

	return [value, k];
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

		this.version = SwapEndian(bitstream.substring(k, k + BLOCKVERSION_SIZE * 2), true);
		k += BLOCKVERSION_SIZE * 2;

		this.prevBlockHash = SwapEndian(bitstream.substring(k, k + PREVBLOCKHASH_SIZE * 2), true);
		k += PREVBLOCKHASH_SIZE * 2;

		this.merkleRoot = SwapEndian(bitstream.substring(k, k + MROOT_SIZE * 2), true);
		k += MROOT_SIZE * 2;

		this.timestamp = SwapEndian(bitstream.substring(k, k + TIMESTAMP_SIZE * 2), true);
		k += TIMESTAMP_SIZE * 2;

		this.target = SwapEndian(bitstream.substring(k, k + TARGET_SIZE * 2), true);
		k += TARGET_SIZE * 2;

		this.nonce = SwapEndian(bitstream.substring(k, k + NONCE_SIZE * 2), true);
		k += NONCE_SIZE * 2;

		let varInt = readVarInt(bitstream.slice(k));
		this.nbTX = varInt[0];
		k += varInt[1];

		this.Transactions = [];
		this.TXIDs = [];
		for (let i = 0; i < this.nbTX; i++){
			let tx = new Transaction(bitstream.slice(k));
			//let txid = ComputeTXID(bitstream.slice(k, tx.getParsedLength()));
			//console.log("TXID = "+txid);
			k += tx.getParsedLength();
			this.Transactions.push(tx);
			//this.TXIDs.push(txid);
		}

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

const VERSION_SIZE = 4;
const LOCKTIME_SIZE = 4;
class Transaction{
	constructor(txBitstream){
		this.Inputs = [];
		this.Outputs = [];
		let k = 0;

		/* parse VERSION */
		this.version = SwapEndian(txBitstream.substring(k, k + VERSION_SIZE * 2), true);
		k += VERSION_SIZE * 2;

		/* parse Inputs count */
		let varInt = readVarInt(txBitstream.substring(k));
		k += varInt[1];
		this.inputCount = varInt[0];

		for (let nbInputs = 0; nbInputs < this.inputCount; nbInputs++) {
			let input = new TxInput(txBitstream.substring(k));
			this.Inputs.push(input);
			k += input.getParsedLength();
		}

		/* parse Outputs count */
		varInt = readVarInt(txBitstream.substring(k));
		k += varInt[1];
		this.outputCount = varInt[0];

		for (let nbOutputs = 0; nbOutputs < this.outputCount; nbOutputs++) {
			let output = new TxOutput(txBitstream.substring(k));
			this.Outputs.push(output);
			k += output.getParsedLength();
		}

		/* parse Locktime */
		this.locktime = SwapEndian(txBitstream.substring(k, k + LOCKTIME_SIZE * 2), true);
		k += LOCKTIME_SIZE * 2;

		this.parsedLength = k;

	}

	getParsedLength(){
		return this.parsedLength;
	}

	toString(){
		let out ="";

		out += "VERSION = " + this.version + "\n";
		out += "Nb of Inputs = " + this.inputCount + "\n";
		for (let i = 0; i < this.inputCount; i++){
			out += "	TXID      = " + this.Inputs[i].txid + "\n";
			out += "	VOUT      = " + this.Inputs[i].vout + "\n";
			out += "	SIGNATURE = " + this.Inputs[i].signature + "\n";
			out += "	PUBLICKEY = " + this.Inputs[i].publicKey + "\n";
			out += " 	SEQUENCE  = " + this.Inputs[i].sequence + "\n";
		}
		out += "Nb of Outputs = " + this.outputCount + "\n";
		for (let i = 0; i < this.outputCount; i++){
			out += "	VALUE           = " + this.Outputs[i].value + "\n";
			out += "	SCRIPTPUBKEY    = " + this.Outputs[i].scriptPubKey + "\n";
		}
		out += "LOCKTIME = " + this.locktime + "\n";

		return out;
	}
}

const TXID_SIZE = 32;
const VOUT_SIZE = 4;
const SEQ_SIZE = 4;
class TxInput{
	constructor(txInput){
		/* parse TXID */
		let k = 0;
		this.txid = SwapEndian(txInput.substring(k, k + TXID_SIZE * 2), true);
		k += TXID_SIZE * 2;

		/* parse VOUT */
		this.vout = SwapEndian(txInput.substring(k, k + VOUT_SIZE * 2), true);
		k += VOUT_SIZE * 2;

		/* Parse ScriptSig length */
		let varInt = readVarInt(txInput.substring(k));
		let fieldSize = varInt[0];
		k += varInt[1];

		/* parse ScriptSig */
		this.ScriptSig = SwapEndian(txInput.substring(k, k + fieldSize * 2), false);
		k += fieldSize * 2;	

		/* parse Sequence */
		this.sequence = SwapEndian(txInput.substring(k, k + SEQ_SIZE * 2), true);
		k += SEQ_SIZE * 2;

		this.parsedLength = k;
	}

	getParsedLength(){
		return this.parsedLength;
	}
}

const VALUE_SIZE = 8;
class TxOutput{
	constructor(txOutput){
		let k = 0;
		
		/* parse Value (in satoshis) */ 
		this.value = SwapEndian(txOutput.substring(k, k + VALUE_SIZE * 2), true);
		k += VALUE_SIZE * 2;

		/* Parse ScriptPubKey length */
		let varInt = readVarInt(txOutput.substring(k));
		let fieldSize = varInt[0];
		k += varInt[1];

		/* parse ScriptPubKey */
		this.scriptPubKey = SwapEndian(txOutput.substring(k, k + fieldSize * 2), false);
		k += fieldSize * 2;

		this.parsedLength = k;	

	}

	getParsedLength(){
		return this.parsedLength;
	}
}

document.getElementById('parse_blockheader').addEventListener('click', event => {
 	bitstream = document.getElementById('blockheader_in').value;
 	let block = new Block(bitstream);
 	document.getElementById('block_out_version').innerHTML = "<strong>Version: </strong>"+block.version;
 	document.getElementById('block_out_prevblockhash').innerHTML = "<strong>Prev Block Hash: </strong>"+block.prevBlockHash;
 	document.getElementById('block_out_merkleroot').innerHTML = "<strong>Merkle Root: </strong>"+block.merkleRoot;
 	let date = new Date(parseInt(block.timestamp, 16)*1000);
 	document.getElementById('block_out_time').innerHTML = "<strong>Time: </strong>"+date.toString();
 	document.getElementById('block_out_bits').innerHTML = "<strong>Bits: </strong>"+block.target;
 	document.getElementById('block_out_nonce').innerHTML = "<strong>Nonce: </strong>"+parseInt(block.nonce, 16);
 	document.getElementById('block_out_nbTx').innerHTML = "<strong>Nb of Tx: </strong>"+block.nbTX;
 	let s="";
 	for (let i = 0; i < block.TXIDs.length; i++){
 		s += block.TXIDs[i] + "\n";
 	}
 	document.getElementById('block_out_txids').innerHTML =s ;
 	
 })