const ethers = require('ethers');
const ipfs = require('ipfs')

const epinglage_sc = {
	address : "0x1fE21EE3Fb5eF5Ac57265Ed4Adb4877CfFd9525E",
	abi : [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "cid",
				"type": "string"
			}
		],
		"name": "ePin",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "cid",
				"type": "string"
			}
		],
		"name": "payerStockage",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	}
]
}

async function connectMetaMask() {
	// Demande à MetaMask l'autorisation de se connecter
	const addresses = await ethereum.enable();

	//const user = addresses[0]
	// Connection au noeud fourni par l'objet web3
	const provider = new ethers.providers.Web3Provider(ethereum);

	dapp = {addresses, provider};

	node = await ipfs.create();
}

global.connect = function(){
	connectMetaMask().then(() =>{
		document.getElementById('ethereumaddress').innerHTML = "Connected with account = " + dapp.addresses[0].toString();
	});
}


global.listFilename = function (){
	var fileList = document.getElementById("input").files;
	const reader = new FileReader();

	for (let i = 0; i < fileList.length; i++){
		console.log(fileList[i].name);
		console.log(fileList[i].type);
		reader.readAsArrayBuffer(fileList[i]);
		reader.onloadend = async function() {
				console.log("Add file into IPFS");
   			// le résultat à mettre sur IPFS est dans l’objet reader.result  
				for await (let res of node.add(new Buffer(reader.result))) {
					console.log("CID = " + res.cid);
					document.getElementById("ipfs-cid").innerHTML = res.cid;
				};
 		}
	}		
}

global.EpinglerFichier = async function(){

	let contrat = new ethers.Contract(epinglage_sc.address, epinglage_sc.abi, dapp.provider.getSigner(dapp.addresses[0]));

	let cost = document.getElementById("epinglage-frais").value;
	
	let overrides = {
		value: ethers.utils.parseUnits(cost.toString(), "ether")
	};

	let cid = document.getElementById("ipfs-cid").value;

	await contrat.payerStockage(cid, overrides);

	contrat.on('ePin', async function(cid) {
		document.getElementById('ipfs-pin').innerHTML = "Fichier épinglé";
		for await (const { cid, type } of node.pin.ls()) {
  			console.log({ cid, type })
		}
	});

}