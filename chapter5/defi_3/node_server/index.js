const ethers = require('ethers')
const IPFS = require('ipfs')

const contractAddress = "0x1fE21EE3Fb5eF5Ac57265Ed4Adb4877CfFd9525E"
const contractABI = [
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

async function main () {

	const provider = new ethers.providers.JsonRpcProvider("http://52.224.65.230:8545")
	const node = await IPFS.create()
	const version = await node.version()

	console.log('Version:', version.version)

	const config = await node.config.get()
	console.log(config)

	provider.getNetwork().then(r => {
		console.log("Ethereum connecté sur ", r)
	})

	let contract = new ethers.Contract(contractAddress, contractABI, provider);

	contract.on("ePin(string)", async function(cid) {
		console.log("CID = " + cid);
		var pinset = await node.pin.add(cid.toString());
		console.log(pinset);
	});
}

main()
