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
	new User("0xBA34E351c44c7D6D7B498dE06B34f6610C478028","Admin"),
	new User("0x1F5AeBF658209Bd8241219Be55ef88Fd55A868D0","Company A"),
	new User("0xEE97B937786e85a30f99d585a7761cc037334470","Company B"),
	new User("0x716b3f59058FAB4bC90a2540518Ce307CE3CC9B3","Company C"),
	new User("0x50ce3c77A22A3E0a85621287eF49Fbf2C58F4d01","Illustrator 1"),
	new User("0xE29F73F39168E39299E7ce411d6fecA2c7E81230","Illustrator 2"),
	new User("0xF616E24339F4DBD8F2DfF95C70766d5e9ab01B9A","Illustrator 3"),
	new User("0x00d09E9081782646D42c9a5C6b5E6B7e2eD352A0","Illustrator 4"),
	new User("0x144A5aCF3596210686ecdF24e40a344F439BC5D4","Illustrator 5"),
	new User("0x622ADFf2406D51863e630b677672C5E593F132b7","Misc")
];

const marketplace_sc = {
	address : "0xd32aF86780AabA704CB7B39a448F8ae6CE74e653",
	abi : [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "demande_id",
				"type": "uint256"
			}
		],
		"name": "accepterOffre",
		"outputs": [],
		"stateMutability": "nonpayable",
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
				"name": "_delai",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_remuneration",
				"type": "uint256"
			}
		],
		"name": "ajouterDemande",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "payable",
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
		"name": "bannir",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_nom",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_status",
				"type": "uint256"
			}
		],
		"name": "inscription",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "demande_id",
				"type": "uint256"
			},
			{
				"internalType": "bytes32",
				"name": "url_hash",
				"type": "bytes32"
			}
		],
		"name": "livraison",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
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
				"name": "",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "Livrable",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "demande_id",
				"type": "uint256"
			}
		],
		"name": "postuler",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getListOfDemandes",
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
						"name": "demandeur",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "remuneration",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "delai_livraison",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "description",
						"type": "string"
					},
					{
						"internalType": "enum PlaceMarche.EtatDemande",
						"name": "etat",
						"type": "uint8"
					},
					{
						"internalType": "address[]",
						"name": "candidats",
						"type": "address[]"
					}
				],
				"internalType": "struct PlaceMarche.Demande[]",
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
				"internalType": "uint256",
				"name": "demande_id",
				"type": "uint256"
			}
		],
		"name": "listeCandidats",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "",
				"type": "address[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]
}

async function createMetaMaskDapp() {
	try {
		// Demande à MetaMask l'autorisation de se connecter
		const addresses = await ethereum.enable();

		//const user = addresses[0]
		// Connection au noeud fourni par l'objet web3
		const provider = new ethers.providers.Web3Provider(ethereum);

		dapp = {addresses, provider};

		let s="";
		s += addresses[0].toString();

		for (let i = 0; i < users.length; i++){
			if (users[i].getAddress().toUpperCase().localeCompare(addresses[0].toString().toUpperCase()) === 0) {
				s += " as " + users[i].getName();
				break;
			} 
		}
		document.getElementById('user_address').innerHTML = s ;
	} catch(err) {
		// Gestion des erreurs
		console.error(err);
	}
}

async function getBalance(){
	dapp.provider.getBalance(dapp.addresses[0]).then((balance) => {
		let etherString = ethers.utils.formatEther(balance);
   		console.log("Balance: "+etherString);
   		document.getElementById('balance').innerHTML = etherString;
   	});
}

async function inscription(){

	console.log(marketplace_sc.address);
	console.log(dapp.addresses[0]);

	let contratMarketPlace = new ethers.Contract(marketplace_sc.address, marketplace_sc.abi, dapp.provider.getSigner(dapp.addresses[0]));

	var name = document.getElementById("nomUtilisateur").value;
	var role = document.getElementById("fonctionUtilisateur");
	var result = role.options[role.selectedIndex].value;

	if (result === "ID001"){
		console.log("Inscription: " + name + " " + 1);
		contratMarketPlace.inscription(name, 1);
	}
	else if (result === "ID002"){
		console.log("inscription " + name + " " + 2);
		contratMarketPlace.inscription(name, 2);
	}
}


		




