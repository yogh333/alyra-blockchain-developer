pragma solidity ^0.6.0;

import "https://raw.githubusercontent.com/OpenZeppelin/openzeppelin-contracts/master/contracts/math/SafeMath.sol";

contract Pulsation {

	using SafeMath for uint;
    using SafeMath for uint8;

	uint public battement;

	constructor() public {
        battement = 0; 
    }

    function ajouterBattement() public {
    	battement = battement.add(1);
    }
}