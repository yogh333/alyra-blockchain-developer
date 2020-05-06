pragma solidity ^0.6.0;

contract Epinglage{

	event ePin(string cid);

	function payerStockage(string memory cid) public payable {

		require(msg.value >= 0.1 ether, "Payez au moins 0.1 ether pour permettre le stockage d'un fichier");

		emit ePin(cid);
	}
}