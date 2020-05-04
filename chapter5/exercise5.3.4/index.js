const ipfsClient = require('ipfs-http-client');
const ethers = require('ethers');

const ipfs = ipfsClient('http://localhost:5001') // (the default in Node.js)

const cartes_sc = {
	address : "0xfD0C2231729178d089A17b3eA1C0bD68560fC136",
	abi : [
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "string",
				"name": "s",
				"type": "string"
			}
		],
		"name": "ajouterCarte",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "ind",
				"type": "uint256"
			}
		],
		"name": "recuperer",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
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
}

global.connect = function(){
	connectMetaMask().then(() =>{
		document.getElementById('ethereumaddress').innerHTML = "Connected with account = " + dapp.addresses[0].toString();
	});
}


global.listFilename= function (){
	var imageList = document.getElementById("input").files;
	const reader = new FileReader();

	let contrat = new ethers.Contract(cartes_sc.address, cartes_sc.abi, dapp.provider.getSigner(dapp.addresses[0]));

	for (let i = 0; i < imageList.length; i++){
		console.log(imageList[i].name);
		console.log(imageList[i].type);
		reader.readAsArrayBuffer(imageList[i]);
		reader.onloadend = async function() {
   			// le résultat à mettre sur IPFS est dans l’objet reader.result  
				for await (let res of ipfs.add(reader.result)) {
					console.log("CID = " + res.cid);
					contrat.ajouterCarte(res.cid.toString());
				};
 		}
	}		
}

async function cat(cid){
	let chunks = [];
	for await (const chunk of ipfs.cat(cid)) {
			chunks.push(chunk);
	}
	return Buffer.concat(chunks);
}

global.displayImage = function (){

	let contrat = new ethers.Contract(cartes_sc.address, cartes_sc.abi, dapp.provider.getSigner(dapp.addresses[0]));

	for (let idx = 0 ; idx < 3; idx++){
			contrat.recuperer(idx).then(cid => {
				console.log("Get CID = " + cid);
				cat(cid).then(res => {
					let img = document.createElement("img");
					img.height = 200;
					img.width = 200;
					img.src = "data:image/jpg;base64,"+res.toString('base64');
					document.body.appendChild(img);
			})	
		});		
	}
}


