const credibility_sc = {

	address : "0x5D798109D77F0A321995fDcd157b91ec0f4804A2",
	abi : [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "bytes32",
				"name": "hash",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			}
		],
		"name": "Devoir",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "cred",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "url",
				"type": "string"
			}
		],
		"name": "produireHash",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "dev",
				"type": "bytes32"
			}
		],
		"name": "remettre",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "destinataire",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "valeur",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]
}


async function createMetaMaskDapp() {
 try {
   // Demande à MetaMask l'autorisation de se connecter
   const addresses = await ethereum.enable();
   const user = addresses[0]
   // Connection au noeud fourni par l'objet web3
   const provider = new ethers.providers.Web3Provider(ethereum);

	dapp = { user, provider };

 } catch(err) {
   // Gestion des erreurs
   console.error(err);
 }
}

async function getBalance(){
	dapp.provider.getBalance(dapp.user).then((balance) => {
		let etherString = ethers.utils.formatEther(balance);
   		console.log("Balance: "+etherString);
   		document.getElementById('balance').innerHTML = etherString;
   	});
}

async function getBlockNumber(){
	dapp.provider.getBlockNumber().then((_blockNumber) => {
		console.log("Block Number: " + _blockNumber);
		document.getElementById('block_number').innerHTML = _blockNumber;
	});
}

async function getGasPrice(){
	dapp.provider.getGasPrice().then((_gasPrice) => {
    	console.log("Gas Price: " + _gasPrice);
    	let gasPriceString = _gasPrice.toString() + " wei";
    	document.getElementById('gas_price').innerHTML = gasPriceString;
	});
}

async function sendHomework(){

	let contratCredibilite = new ethers.Contract(credibility_sc.address, credibility_sc.abi, dapp.provider.getSigner(dapp.user.address));

	let url = document.getElementById('homework_url').value;
	
	contratCredibilite.produireHash(url).then((hash) => {
		contratCredibilite.remettre(hash);
	});

	contratCredibilite.on('Devoir', (hash, user) => {
		console.log("Hash = " + hash.toString());
		console.log("Sender = " + user.toString())
		let text = "Homework URL Hash = " + hash;
		document.getElementById('homework_hash').innerHTML = text;
		text = "Sender = " + user.toString();
		document.getElementById('sender_addr').innerHTML = text;
	});
}
	
async function getCredibility(){

	let contratCredibilite = new ethers.Contract(credibility_sc.address, credibility_sc.abi, dapp.provider);

	contratCredibilite.cred(dapp.user).then((credibility) => {
		let text = "Credibility = " + credibility
		console.log(text);
		document.getElementById('credibility').innerHTML = text;
	});

}
		




