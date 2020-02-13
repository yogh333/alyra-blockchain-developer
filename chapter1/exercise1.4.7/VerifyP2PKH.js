var crypto = require('crypto');
const sha256 = crypto.createHash('sha256');
const ripemd160 = crypto.createHash('ripemd160');

let ScriptSig = "48" + 
				"3045022100d544eb1ede691f9833d44e5266e923dae058f702d2891e4ee87621a433ccdf4f022021e405c26b0483cd7c5636e4127a9510f3184d1994015aae43a228faa608362001" +
				"21" + 
				"0372cc7efb1961962bba20db0c6a3eebdde0ae606986bf76cb863fa460aee8475c";

let ScriptPubKey = "76" +
				   "a9" +
				   "14" +
				   "7c3f2e0e3f3ec87981f9f2059537a355db03f9e8" +
				   "88" +
				   "ac" ;


const OP_DUP = 118;
const OP_HASH160 = 169;
const OP_EQUALVERIFY = 136; 
const OP_CHECKSIG = 172;

class BCScriptInterpreter {
	constructor(){
		this.stack = [];
	}

	verify(ScriptSig, ScriptPubKey){
		this.add(ScriptSig);
		this.add(ScriptPubKey);
		return this.stack[0];
	}

	add(s){
		let a, b;
		let k = 0;
		let flag = true;
		while ((flag === true) && (k < s.length)) {
			let symbol = s[k++] + s[k++];
			let opCode = parseInt(symbol, 16); 
			//console.log("Symbol = " + symbol + " OpCode = " + opCode);
			switch(opCode){
				case OP_DUP :
					a = this.stack.pop();
					this.stack.push(a);
					this.stack.push(a);
					break;
				case OP_HASH160:
					//console.log("hash160: PubK = " + a);
					a = Buffer.from(this.stack.pop(), 'hex');
					let hash160 = ripemd160.update(Buffer.from(sha256.update(a).digest('hex'),'hex')).digest('hex');
					//console.log("hash160: hash160 = " + hash160);
					this.stack.push(hash160);
					break;
				case OP_EQUALVERIFY:
					b = this.stack.pop();
					a = this.stack.pop();
					flag = (a === b ? true:false);
					break;
				case OP_CHECKSIG:
					b = this.stack.pop();
					a = this.stack.pop();
					this.stack.push(true);
					break;
				default:
					if (opCode < 76) {
						this.stack.push(s.slice(k, k + opCode * 2));
						k += opCode * 2;
					}
					break;
			}
			//console.log("stack = " + this.stack);
		}
		if (k < s.length)
			console.log("Error in script parsing");
		/*else
			console.log("script fully parsed");*/
	}

	pop(){
		return this.stack[this.stack.length - 1];
	}

	flush() {
		while (this.stack.length > 1)
			this.stack.pop();
		this.stack.push(0);
	}
}

script = new BCScriptInterpreter();
console.log(script.verify(ScriptSig, ScriptPubKey));
