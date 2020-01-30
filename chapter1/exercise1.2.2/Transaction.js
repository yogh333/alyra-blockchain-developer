class Transaction{
	constructor(size, tips){
		this.size = size;
		this.tips = tips;
	}
}

class Block {
	constructor(){
		this.size = 0;
		this.tips = 0;
		this.transactions = [];
	}
	addTransaction(transaction){
		//console.log("addTransaction");
		this.transactions.push(transaction);
		this.size += transaction.size;
		this.tips += transaction.tips;
	}
	getSize(){
		return this.size;
	}
	getTips(){
		return this.tips;
	}
}

function MiningBlock(transactions, selectionMask){
	//console.log("MiningBlock: " + selectionMask);
	if (transactions.length !== selectionMask.length) {
		console.error(`${MiningBlock.name} transactions are greater than selection mask !`);
		block = null;
	}
	else {
		block = new Block();
	}
	//console.log("MiningBlock: start " + block.size);
	for (let j = 0; j < selectionMask.length; j++){
		if (selectionMask[j] == 1){
			block.addTransaction(transactions[j]);
		}
	}
	//console.log("MiningBlock: end " + block.size);
	return block;
}

let transactions = [
	new Transaction(2000, 13000),
	new Transaction(6000, 9000),
	new Transaction(800, 2000),
	new Transaction(700, 1500),
	new Transaction(1200, 3500),
	new Transaction(1000, 2800),
	new Transaction(1300, 5000),
	new Transaction(600, 1500)
];


let select;
let maxTips = 0;
let bestBlock;
for (let i = 0; i < 256; i++){
	
	select = Number(i).toString(2).split("");
	//console.log(Number(i).toString(2), " ",Number(i).toString(2).split(""), " ", select.length);
	while (select.length < 8)
		select.unshift('0');

	let block = MiningBlock(transactions, select);
	//console.log(`Block mined: size = ${block.size}, tips = ${block.tips}`);
	if ((block !== null) && (block.size <= 6000) && (block.tips > maxTips)){
		maxTips = block.tips;
		bestBlock = block;		
	}
}
console.log("Found block: size = "+bestBlock.size+" tips = "+bestBlock.tips);
console.log("Transactions in block: ");
for (let i = 0; i < bestBlock.transactions.length; i++){
	console.log(bestBlock.transactions[i]);
}
