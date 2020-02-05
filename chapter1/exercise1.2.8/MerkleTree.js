//const sha256 = require('crypto-js/sha256');
const sha1 = require('crypto-js/sha1');

function sha256(data){
	return data;
}

class MerkleTree {
	constructor(dataList) {

		this.tree = [];

		let hashList = [];
		for (let i in dataList)
			hashList.push(sha256(dataList[i]));

		
		let newHashList = [];
		while (true){
			this.tree.push(hashList);
			for (let i = 0; i < hashList.length - 1; i += 2)
				newHashList.push(sha256(hashList[i] + hashList[i+1]));
			if (hashList.length % 2 === 1)
				newHashList.push(sha256(hashList[hashList.length - 1] + hashList[hashList.length - 1]));
			if (newHashList.length === 1) {
				this.tree.push(newHashList);
				break;
			}
			else {
				hashList = newHashList;
				newHashList = [];
			}
		}
	}

	toString(){
		for (let i in this.tree)
			this._displayList(this.tree[i]);
	}

	_displayList(list){
		let out = "";
		for (let i in list)
			out += list[i] + " ";
		console.log(out);
	}

	preuve(data){
		let idx = 0;
		let out = "";
		while ((data !== this.tree[0][idx]) && (idx < this.tree[0].length))
			idx++;
		if (idx < this.tree[0].length){
			for (let h = 0; h < this.tree.length - 1; h++) {
				if (idx % 2 === 1)
					out += this.tree[h][idx - 1];
				else
					out += this.tree[h][Math.min(idx + 1, this.tree[h].length - 1)];
				out += " ";
				idx = Math.floor(idx / 2);
			}
			out += this.tree[this.tree.length - 1][0];
		}
		return out;
	}
}

let tab = ["A", "B", "C", "D", "E", "F", "G", "H"];
let a = new MerkleTree(tab);
a.toString();
console.log("Preuve = " + a.preuve("G"));