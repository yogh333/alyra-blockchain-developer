async function createMetaMaskDapp() {
 try {
   // Demande à MetaMask l'autorisation de se connecter
   const addresses = await ethereum.enable();
   const address = addresses[0]
   // Connection au noeud fourni par l'objet web3
   const provider = new ethers.providers.Web3Provider(ethereum);
   dapp = { address, provider };
   console.log(dapp);
 } catch(err) {
   // Gestion des erreurs
   console.error(err);
 }
}


document.getElementById('get_balance').addEventListener('click', event => {
	dapp.provider.getBalance(dapp.address).then((balance) => {
		let etherString = ethers.utils.formatEther(balance);
   		console.log("Balance: " + etherString);
   		document.getElementById('balance').innerHTML = etherString;
	});
 })


document.getElementById('get_block_number').addEventListener('click', event => {
	dapp.provider.getBlockNumber().then((_blockNumber) => {
		console.log("Block Number " + _blockNumber);
		document.getElementById('block_number').innerHTML = _blockNumber;
	});
 })


document.getElementById('get_gas_price').addEventListener('click', event => {
	dapp.provider.getGasPrice().then((_gasPrice) => {
    	console.log("Gas Price" + _gasPrice);
    	let gasPriceString = _gasPrice.toString() + " wei";
    	document.getElementById('gas_price').innerHTML = gasPriceString;
	});
 })
