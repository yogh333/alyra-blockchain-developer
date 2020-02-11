/*

Input format:

Field		Size (bytes)		Endianness			Description

TXID		32					LE					Transaction ID
VOUT		4					LE					UTXO index
SCRIPTSIG	N					BE					Unlocking code
SEQUENCE	4					LE					FFFFFFFF


ScriptSig:

Field		Size (bytes)		Endianness			Description`

VarInt		1 or 2 or 4 or 8	LE					Size of ScriptSig
VarInt		1 or 2 or 4 or 8	LE					Size of Signature
Signature	VarInt				BE   				Signature
VarInt		1 or 2 or 4 or 8    LE  				Size of PublicKey
PublicKey	VarInt				BE                  Public Key
`
*/

const TXID_SIZE = 32;
const VOUT_SIZE = 4;
const SEQ_SIZE = 4;

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

const txInputParser = function(txInput) {
	
	/* parse TXID */
	let k = 0;
	let TXID = Hex2String(txInput.substring(k, k + TXID_SIZE * 2), true);
	k += TXID_SIZE * 2;

	/* parse VOUT */
	let VOUT = Hex2String(txInput.substring(k, k + VOUT_SIZE * 2), true);
	k += VOUT_SIZE * 2;

	/* Parse ScriptSig length */
	let varInt = getVarInt(txInput.substring(k));
	fieldSize = varInt[0];
	k += varInt[1];

	/* parse Signature length */
	varInt = getVarInt(txInput.substring(k));
	fieldSize = varInt[0];
	k += varInt[1];
	/* parse Signature */
	let Signature = Hex2String(txInput.substring(k, k + fieldSize * 2), false);
	k += fieldSize * 2;	

	/* parse PublicKey length */
	varInt = getVarInt(txInput.substring(k));
	fieldSize = varInt[0];
	k += varInt[1];
	/* parse Public Key */
	let PublicKey = Hex2String(txInput.substring(k, k + fieldSize * 2), false);
	k += fieldSize * 2;	

	/* parse Sequence */
	let SEQUENCE = Hex2String(txInput.substring(k, k + SEQ_SIZE * 2), true);
	k += SEQ_SIZE * 2;

	if (k !== txInput.length)
		console.err("TX Input parsing error");
	
	console.log("TXID = " + TXID);
	console.log("VOUT = " + VOUT);
	console.log("SCRIPTSIG :");
	console.log("	SIGNATURE = " + Signature);
	console.log("	PUBLICKEY = " + PublicKey);
	console.log("SEQUENCE = " + SEQUENCE);
}

let input = "941e985075825e09de53b08cdd346bb67075ef0ce5c94f98853292d4bf94c10d" + 
			"010000006b483045022100ab44ef425e6d85c03cf301bc16465e3176b55bba97" + 
			"27706819eaf07cf84cf52d02203f7dc7ae9ab36bead14dd3c83c8c030bf8ce59" +
			"6e692021b66441b39b4b35e64e012102f63ae3eba460a8ed1be568b0c9a6c947" + 
			"abe9f079bcf861a7fdb2fd577ed48a81Feffffff";

txInputParser(input);
