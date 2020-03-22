pragma solidity ^0.6.0;

import "https://raw.githubusercontent.com/OpenZeppelin/openzeppelin-contracts/master/contracts/math/SafeMath.sol";


contract Pulsation {

    using SafeMath for uint;
    using SafeMath for uint8;

    string private message;

    uint public battement;

    constructor(string memory text) public {
        battement = 0; 
        message = text;

    }

    function ajouterBattement() public returns (string memory) {
        battement = battement.add(1);
        if ((battement.mod(10) == 0) && uint8(bytes1(blockhash(block.number - 1))).mod(2) == 0)
            return string("Criii");
        else
            return message;
    }
}

contract Pendule  {

    using SafeMath for uint;

    string[] public balancier;
    Pulsation private tic;
    Pulsation private tac;
    bytes32 err_hash = keccak256(abi.encodePacked("Criii"));
    uint public n;


    constructor() public {
        tic = new Pulsation('tic');
        tac = new Pulsation('tac');
        n = 1;
    }
 

    function mouvementsBalancier(uint k) public {
        uint nbMvt = k;
        while (nbMvt != 0){
            balancier.push(tic.ajouterBattement());
            balancier.push(tac.ajouterBattement());
            nbMvt = nbMvt.sub(1);
        }
    }


    function inspection() public returns (int) {
        
        require((balancier.length / 10) == n, "nombre de mouvements du balancier insuffisant");

        bytes32 hash;
        uint start = SafeMath.mul(10, n.sub(1));
        uint end = SafeMath.mul(10, n);
        int idx = -1;

        for (uint i = start ; i < end; i++){
            hash = keccak256(abi.encodePacked(balancier[i]));
            if (hash == err_hash){
                idx = int(i);
                break;
            }
        }
        n = n.add(1);
        return idx;
    }
}