class User {
	constructor(_address, _name){
		this.address = _address;
		this.name = _name;
	}

	getName(){
		return this.name;
	}

	getAddress(){
		return this.address;
	}
}

var users = [
	new User("0xBA34E351c44c7D6D7B498dE06B34f6610C478028","Company A"),
	new User("0x1F5AeBF658209Bd8241219Be55ef88Fd55A868D0","Company B"),
	new User("0xEE97B937786e85a30f99d585a7761cc037334470","Company C"),
	new User("0x716b3f59058FAB4bC90a2540518Ce307CE3CC9B3","Illustrator A"),
	new User("0x50ce3c77A22A3E0a85621287eF49Fbf2C58F4d01","Illustrator B"),
	new User("0xE29F73F39168E39299E7ce411d6fecA2c7E81230","Illustrator C"),
	new User("0xF616E24339F4DBD8F2DfF95C70766d5e9ab01B9A","Illustrator D"),
	new User("0x00d09E9081782646D42c9a5C6b5E6B7e2eD352A0","Misc A"),
	new User("0x144A5aCF3596210686ecdF24e40a344F439BC5D4","Misc B"),
	new User("0x622ADFf2406D51863e630b677672C5E593F132b7","Admin")
];

const marketplace_sc = {
	address : "0xf4631dE7ff98A45d249bca4aA568B889826BA46D",
	abi : [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "bytes32",
				"name": "hash",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "eDeliverable",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "remuneration",
				"type": "uint256"
			}
		],
		"name": "ePayment",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "bool",
				"name": "flag",
				"type": "bool"
			}
		],
		"name": "eRegister",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "demande_id",
				"type": "uint256"
			}
		],
		"name": "eRequest",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "banUser",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "request_id",
				"type": "uint256"
			},
			{
				"internalType": "bytes32",
				"name": "url_hash",
				"type": "bytes32"
			}
		],
		"name": "deliver",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getBalance",
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
				"internalType": "uint256",
				"name": "request_id",
				"type": "uint256"
			}
		],
		"name": "getCandidates",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "",
				"type": "address[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "request_id",
				"type": "uint256"
			}
		],
		"name": "getMoney",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getRequests",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "id",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "requester",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "remuneration",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "deliveryTime",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "description",
						"type": "string"
					},
					{
						"internalType": "enum PlaceMarche.State",
						"name": "requestState",
						"type": "uint8"
					},
					{
						"internalType": "address[]",
						"name": "candidates",
						"type": "address[]"
					},
					{
						"internalType": "address",
						"name": "selectedIllustrator",
						"type": "address"
					},
					{
						"internalType": "bytes32",
						"name": "deliveryHash",
						"type": "bytes32"
					}
				],
				"internalType": "struct PlaceMarche.Request[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "getUserInfo",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "user",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "reputation",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"internalType": "enum PlaceMarche.Role",
						"name": "profession",
						"type": "uint8"
					},
					{
						"internalType": "bool",
						"name": "registered",
						"type": "bool"
					}
				],
				"internalType": "struct PlaceMarche.Participant",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_description",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_deliveryTime",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_remuneration",
				"type": "uint256"
			}
		],
		"name": "newRequest",
		"outputs": [],
		"stateMutability": "payable",
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
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_status",
				"type": "uint256"
			}
		],
		"name": "register",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "request_id",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "illustrator",
				"type": "address"
			}
		],
		"name": "selectCandidate",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "request_id",
				"type": "uint256"
			}
		],
		"name": "submit",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]
}

const EtatDemande = ["OUVERTE", "ENCOURS", "FERMEE", "PAYEE"];

async function createMetaMaskDapp() {
	try {
		// Demande à MetaMask l'autorisation de se connecter
		const addresses = await ethereum.enable();

		//const user = addresses[0]
		// Connection au noeud fourni par l'objet web3
		const provider = new ethers.providers.Web3Provider(ethereum);

		dapp = {addresses, provider};

		let s="connected with address ";
		s += addresses[0].toString();

		for (let i = 0; i < users.length; i++){
			if (users[i].getAddress().toUpperCase().localeCompare(addresses[0].toString().toUpperCase()) === 0) {
				s += " (" + users[i].getName() +")";
				break;
			} 
		}
		document.getElementById('test_output_user_address').innerHTML = s ;
	} catch(err) {
		// Gestion des erreurs
		console.error(err);
	}
}

async function getBalance(){
	dapp.provider.getBalance(dapp.addresses[0]).then((balance) => {
		let etherString = ethers.utils.formatEther(balance);
   		console.log("Balance: "+etherString);
   		document.getElementById('test_output_user_balance').innerHTML = etherString;
   	});
}

async function getScBalance(){
	let contratMarketPlace = new ethers.Contract(marketplace_sc.address, marketplace_sc.abi, dapp.provider.getSigner(dapp.addresses[0]));

	contratMarketPlace.getBalance().then((balance) => {
		document.getElementById("test_output_sc_balance").innerHTML = balance;
	});	
}

async function inscription(){

	console.log(marketplace_sc.address);
	console.log(dapp.addresses[0]);

	let contratMarketPlace = new ethers.Contract(marketplace_sc.address, marketplace_sc.abi, dapp.provider.getSigner(dapp.addresses[0]));

	var name = document.getElementById("nomUtilisateur").value;
	var role = document.getElementById("natureUtilisateur");
	var result = role.options[role.selectedIndex].value;

	if (result === "ID001"){
		console.log("Inscription: " + name + " " + 1);
		contratMarketPlace.register(name, 1);
	}
	else if (result === "ID002"){
		console.log("inscription " + name + " " + 2);
		contratMarketPlace.register(name, 2);
	}
	contratMarketPlace.on('eRegister', (flag) => {
			console.log("Flag = " + flag.toString());
			if (flag === true)
				document.getElementById('inscription_output_result').innerHTML = "inscription réussie !";
	});
}

async function ajouterDemande(){

	let contratMarketPlace = new ethers.Contract(marketplace_sc.address, marketplace_sc.abi, dapp.provider.getSigner(dapp.addresses[0]));

	var description = document.getElementById("descriptionDemande").value;
	var delai = document.getElementById("delaiDemande").value;
	var remuneration = document.getElementById("remunerationDemande").value;
	console.log("remuneration = " + remuneration);
	let val = Math.trunc((102 * remuneration) / 100 + 0.5);
	console.log("cout de la transaction = " + val);

	let overrides = {
		value: ethers.utils.parseUnits(val.toString(), "wei")
	};

	document.getElementById('cout_total').innerHTML = val.toString();

	await contratMarketPlace.newRequest(description, delai, remuneration, overrides);

	contratMarketPlace.on('eRequest', (user, id) => {
		console.log("Sender = " + user.toString());
		console.log("Demande ID = " + id.toString());
		document.getElementById('demande_id').innerHTML = id.toString();
	});
}


async function displayRequests(){
	let s = "";
	let table = document.getElementById("liste_demandes_entreprise");
	while (table.hasChildNodes()){
		table.removeChild(table.firstChild);
	}

	let contratMarketPlace = new ethers.Contract(marketplace_sc.address, marketplace_sc.abi, dapp.provider.getSigner(dapp.addresses[0]));

	contratMarketPlace.getRequests().then((demandes) => {

		for (let i = 0; i < demandes.length; i++){
			console.log(
				demandes[i].id + " " + demandes[i].requester + " " + demandes[i].remuneration + " " + 
				demandes[i].deliveryTime + " " + demandes[i].description + " " + demandes[i].requestState + 
				" " + demandes[i].candidates.length);
			row = table.insertRow();
			row.insertCell(0).innerHTML = demandes[i].id;
			row.insertCell(1).innerHTML = demandes[i].requester;
			row.insertCell(2).innerHTML = demandes[i].description;
			row.insertCell(3).innerHTML = demandes[i].remuneration;
			row.insertCell(4).innerHTML = demandes[i].deliveryTime;
			row.insertCell(5).innerHTML = EtatDemande[demandes[i].requestState];	
			row.insertCell(6).innerHTML = demandes[i].candidates.length;
			if (demandes[i].requestState > 0)
				row.insertCell(7).innerHTML = demandes[i].selectedIllustrator;
			else
				row.insertCell(7).innerHTML = "?";		
		}
	});
}

async function postuler(){
	
	let contratMarketPlace = new ethers.Contract(marketplace_sc.address, marketplace_sc.abi, dapp.provider.getSigner(dapp.addresses[0]));

	var demande_id = document.getElementById("demande_id_postuler").value;

	contratMarketPlace.submit(demande_id).then((flag) => {
		let s = "Votre candidature pour l'offre " + demande_id + " a bien été enregistrée";
		document.getElementById("output_postuler").innerHTML = s;
	});

}

async function listOfCandidates(){

	let contratMarketPlace = new ethers.Contract(marketplace_sc.address, marketplace_sc.abi, dapp.provider.getSigner(dapp.addresses[0]));

	let demande_id = document.getElementById("liste-candidats-demandeid").value;
	let table = document.getElementById("row-table-liste-candidats");
	while (table.hasChildNodes()){
		table.removeChild(table.firstChild);
	}
	contratMarketPlace.getCandidates(demande_id).then((candidates) => {	
		for (let i = 0; i < candidates.length; i++){
			contratMarketPlace.getUserInfo(candidates[i]).then((candidat) => {
				row =  table.insertRow();
				row.insertCell(0).innerHTML = candidat.user.toString();
				row.insertCell(1).innerHTML = candidat.name.toString();
				row.insertCell(2).innerHTML = candidat.reputation.toString();
				let button = document.createElement('button');
				let text = document.createTextNode("Accepter Offre");
				button.appendChild(text);
				button.onclick = async function () {
					await contratMarketPlace.selectCandidate(demande_id, candidat.user);	
				}
				row.insertCell(3).appendChild(button);
			});
		}
	});
}

async function livrer(){

	let contratMarketPlace = new ethers.Contract(marketplace_sc.address, marketplace_sc.abi, dapp.provider.getSigner(dapp.addresses[0]));

	let url = document.getElementById('delivery_url').value;
	let demande_id = document.getElementById('delivery_demandeID').value;

	console.log("URL = " + url);
	console.log("Demande ID = " + demande_id);
	
	contratMarketPlace.produireHash(url).then((hash) => {
		console.log("Hash =" + hash);
		contratMarketPlace.deliver(demande_id, hash);
	});

	contratMarketPlace.on('eDeliverable', (id, hash, user) => {
		console.log("Hash = " + hash.toString());
		console.log("Sender = " + user.toString())
		let s = "Hash du livrable = " + hash.toString();
		document.getElementById('delivery_hash').innerHTML = s;
		
	});
}
		
async function encaisser(){

	let contratMarketPlace = new ethers.Contract(marketplace_sc.address, marketplace_sc.abi, dapp.provider.getSigner(dapp.addresses[0]));
	let demande_id = document.getElementById('delivery_demandeID').value;

	contratMarketPlace.getMoney(demande_id);

	contratMarketPlace.on('ePayment', (remuneration) => {
		let s = "Votre compte a été crédité de " + remuneration.toString() + "wei";
		document.getElementById('delivery_paiement').innerHTML = s;
	});

}



