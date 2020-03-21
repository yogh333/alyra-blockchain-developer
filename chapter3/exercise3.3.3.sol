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

 string[] public balancier;
 Pulsation private tic;
 Pulsation private tac;

 constructor() public {
 }

 function ajouterTacTic(Pulsation _tic, Pulsation _tac)public{
    tic = _tic;
    tac = _tac;
 }
 
 function compareStringsbyBytes(string memory s1, string memory s2) public pure returns(bool) {
    return keccak256(abi.encodePacked(s1)) == keccak256(abi.encodePacked(s2));
 }
 

 function mouvementsBalancier() public {
     if (balancier.length == 0)
        balancier.push(tic.ajouterBattement());
    else {
        if (compareStringsbyBytes(balancier[balancier.length - 1], "tic"))
            balancier.push(tac.ajouterBattement());
        else
            balancier.push(tic.ajouterBattement());
    }
 }
}