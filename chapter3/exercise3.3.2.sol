pragma solidity ^0.6.0;

import "https://raw.githubusercontent.com/OpenZeppelin/openzeppelin-contracts/master/contracts/math/SafeMath.sol";


contract Pulsation {

    using SafeMath for uint;

    string private message;

	uint public battement;

	constructor(string memory text) public {
        battement = 0; 
        message = text;

    }

    function ajouterBattement() public returns (string memory) {
    	battement = battement.add(1);
    	return message;
    }
}

contract Pendule  {

 Pulsation pulse;

 constructor(string memory text) public {
    pulse = new Pulsation(text);
 }

 function provoquerUnePulsation()public{
   pulse.ajouterBattement();
 }
}