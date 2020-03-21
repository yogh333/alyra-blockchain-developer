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

    using SafeMath for uint;

    string[] public balancier;
    Pulsation private tic;
    Pulsation private tac;

    constructor() public {
        tic = new Pulsation('tic');
        tac = new Pulsation('tac');
    }
 

    function mouvementsBalancier(uint k) public {
        while (k != 0){
            balancier.push(tic.ajouterBattement());
            balancier.push(tac.ajouterBattement());
            k = k.sub(1);
        }
    }
}