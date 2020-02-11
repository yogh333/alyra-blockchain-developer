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

const getVarInt = function(bitstream){
	let k = 0;
	let value = parseInt(bitstream.substring(k, k + 2), 16);
	k += 2;
	switch(value){
		case 0xFD:
			value = parseInt(Hex2String(bitstream.substring(k, k + 4), true), 16);
			k += 4;
			break;
		case 0xFE:
			value = parseInt(Hex2String(bitstream.substring(k, k + 8), true), 16);
			k += 8;
			break;
		case 0xFF:
			value = parseInt(Hex2String(bitstream.substring(k, k + 16), true), 16);
			k += 16
			break;
		default:
			break;
	}

	return [value, k];
}

const VERSION_SIZE = 4;
const LOCKTIME_SIZE = 4;

class Transaction{
	constructor(txBitstream){
		this.Inputs = [];
		this.Outputs = [];
		let k = 0;

		/* parse VERSION */
		this.version = Hex2String(txBitstream.substring(k, k + VERSION_SIZE * 2), true);
		k += VERSION_SIZE * 2;

		/* parse Inputs count */
		let varInt = getVarInt(txBitstream.substring(k));
		k += varInt[1];
		this.inputCount = varInt[0];
		console.log("input count ="+this.inputCount);

		for (let nbInputs = 0; nbInputs < this.inputCount; nbInputs++) {
			let input = new TxInput(txBitstream.substring(k));
			this.Inputs.push(input);
			k += input.getParsedLength();
		}

		/* parse Outputs count */
		varInt = getVarInt(txBitstream.substring(k));
		k += varInt[1];
		this.outputCount = varInt[0];

		for (let nbOutputs = 0; nbOutputs < this.outputCount; nbOutputs++) {
			let output = new TxOutput(txBitstream.substring(k));
			this.Outputs.push(output);
			k += output.getParsedLength();
		}

		/* parse Locktime */
		this.locktime = Hex2String(txBitstream.substring(k, k + LOCKTIME_SIZE * 2), true);
		k += LOCKTIME_SIZE * 2;

		console.log(txBitstream.length + " <=> " + k);

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
		this.txid = Hex2String(txInput.substring(k, k + TXID_SIZE * 2), true);
		k += TXID_SIZE * 2;

		/* parse VOUT */
		this.vout = Hex2String(txInput.substring(k, k + VOUT_SIZE * 2), true);
		k += VOUT_SIZE * 2;

		/* Parse ScriptSig length */
		let varInt = getVarInt(txInput.substring(k));
		let fieldSize = varInt[0];
		k += varInt[1];

		/* parse Signature length */
		varInt = getVarInt(txInput.substring(k));
		fieldSize = varInt[0];
		k += varInt[1];
		/* parse Signature */
		this.signature = Hex2String(txInput.substring(k, k + fieldSize * 2), false);
		k += fieldSize * 2;	

		/* parse PublicKey length */
		varInt = getVarInt(txInput.substring(k));
		fieldSize = varInt[0];
		k += varInt[1];
		/* parse Public Key */
		this.publicKey = Hex2String(txInput.substring(k, k + fieldSize * 2), false);
		k += fieldSize * 2;	

		/* parse Sequence */
		this.sequence = Hex2String(txInput.substring(k, k + SEQ_SIZE * 2), true);
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
		this.value = Hex2String(txOutput.substring(k, k + VALUE_SIZE * 2), true);
		k += VALUE_SIZE * 2;

		/* Parse ScriptPubKey length */
		let varInt = getVarInt(txOutput.substring(k));
		let fieldSize = varInt[0];
		k += varInt[1];

		/* parse ScriptPubKey */
		this.scriptPubKey = Hex2String(txOutput.substring(k, k + fieldSize * 2), false);
		k += fieldSize * 2;

		this.parsedLength = k;	

	}

	getParsedLength(){
		return this.parsedLength;
	}
}

let tx_bitstream = "01000000" /* version 4 bytes */
				  +"01"       /*  input counts  1 */
				  +"f129de033c57582efb464e94ad438fff493cc4de4481729b85971236858275c2" /* TXID 32 */
				  +"01000000" /* VOUT 4 */
				  +"6a"       /* ScriptSig length 106 */
				  +"47"       /* Signature length 71 */
				  +"30440220155a2ea4a702cadf37052c87bfe46f0bd24809759acff8d8a7206979610e46f6022052b688b784fa1dcb1cffeef89e7486344b814b0c578133a7b0bce5be978a920801"
				  +"21"       /* Public key length 33*/
				  +"03915170b588170cbcf6380ef701d19bd18a526611c0c69c62d2c29ff6863d501a"
				  +"ffffffff" /* Sequence 4 */
				  +"02"       /* output counts 1 */
				  +"ccaec81700000000" /* value 8 */
				  +"19" /* scriptPubkey length 25 */
				  +"76a9142527ce7f0300330012d6f97672d9acb5130ec4f888ac" /* scriptPubKey */
				  +"18411a0000000000" /* value */
				  +"17" /* ScriptPubkey length 23 */
				  +"a9140b8372dffcb39943c7bfca84f9c40763b8fa9a0687" /* scriptPubKey */
				  +"00000000"; /* LOCKTIME 4 */

tx_bitstream = "0100000001f129de033c57582efb464e94ad438fff493cc4de4481729b859712368582"
				+ "75c2010000006a4730440220155a2ea4a702cadf37052c87bfe46f0bd24809759acff8"
				+ "d8a7206979610e46f6022052b688b784fa1dcb1cffeef89e7486344b814b0c578133a7"
				+ "b0bce5be978a9208012103915170b588170cbcf6380ef701d19bd18a526611c0c69c62"
				+ "d2c29ff6863d501affffffff02ccaec817000000001976a9142527ce7f0300330012d6"
				+ "f97672d9acb5130ec4f888ac18411a000000000017a9140b8372dffcb39943c7bfca84"
				+ "f9c40763b8fa9a068700000000";

let transaction = new Transaction(tx_bitstream);
console.log(transaction.toString());