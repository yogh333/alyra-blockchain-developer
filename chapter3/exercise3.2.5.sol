pragma solidity ^0.6.0;

import "https://raw.githubusercontent.com/OpenZeppelin/openzeppelin-contracts/master/contracts/math/SafeMath.sol";

contract Lottery {

    using SafeMath for uint;
    using SafeMath for uint8;

    mapping (uint => mapping (uint8 => address[])) loteries;
    mapping (uint => address[]) GagnantsTirage;
    mapping (uint => uint) CagnotteTirage;

    uint dateLoterie = now;
    uint8 randomValue;
    address payable organisateur;

    constructor() public {
        organisateur = msg.sender;
        dateLoterie = dateLoterie.add(2 minutes); 
    }
    
    function dateProchaineLoterie() public view returns (uint){
        return dateLoterie;
    }

    function buyTicket(uint number) public payable {
        require(msg.value >= 100 finney, "Ticket price is 100 finney");
        require(number < 256 && number >= 0, "le nombre choisi doit etre compris entre 0 et 255");

        loteries[dateLoterie][uint8(number)].push(msg.sender);
    }

    function tirage() public {
        require(now >= dateLoterie, "Il faut attendre pour le tirage de la loterie");
        require(msg.sender == organisateur, "seul l'organisateur peut effectuer le tirage");
        
        
        randomValue = uint8(bytes1(blockhash(block.number - 1)));
        GagnantsTirage[dateLoterie] = loteries[dateLoterie][randomValue];
        CagnotteTirage[dateLoterie] = address(this).balance;

        dateLoterie = dateLoterie.add(2 minutes); 
    }

    function retraitGain(uint dateTirage) public {
        for (uint i = 0 ; i < GagnantsTirage[dateTirage].length; i++){
            if (GagnantsTirage[dateTirage][i] == msg.sender) {
                msg.sender.transfer(CagnotteTirage[dateTirage].div(GagnantsTirage[dateTirage].length));
                GagnantsTirage[dateTirage][i] = address(0);
            }
        }
    }
}