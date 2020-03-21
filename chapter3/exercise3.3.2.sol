pragma solidity ^0.5.7;

contract Pulsation {

    string private message;

	uint public battement;

	constructor(string memory text) public {
        battement = 0; 
        message = text;

    }

    function ajouterBattement() public returns (string memory) {
    	battement += 1;
    	return message;
    }
}