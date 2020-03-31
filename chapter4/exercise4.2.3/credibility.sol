pragma solidity ^0.6.0;

import "https://raw.githubusercontent.com/OpenZeppelin/openzeppelin-contracts/master/contracts/math/SafeMath.sol";

contract Credibilite {
    
    using SafeMath for uint;
    
  mapping (address => uint256) public cred; // balances de cred que déspose une address 
  
  bytes32[] private devoirs;

  event Devoir(bytes32 hash, address sender);

  function produireHash(string memory url) public pure returns (bytes32) {
    return keccak256(bytes(url));
  }

  function transfer(address destinataire, uint256 valeur) public {
       require(cred[msg.sender] > valeur, "Vous n'avez pas suffisamment de crédits");
       require(cred[destinataire] != 0, "Le destinataire n'a pas de creds");
       require(SafeMath.sub(cred[msg.sender], valeur) >= 1, "Vous devez garder au moins un cred");
       
       cred[msg.sender] = cred[msg.sender].sub(valeur);
       cred[destinataire] = cred[destinataire].add(valeur);
   }

  function remettre(bytes32 dev) external returns (uint256) {

    devoirs.push(dev);
    uint ordre = devoirs.length;

    uint value = 10;

    if (ordre < 3){
      if (ordre == 1) {
        value = 30;
      }
      else {
        value = 20;
      }
    }

    cred[msg.sender] = cred[msg.sender].add(value);

    emit Devoir(dev, msg.sender);

    return ordre;
  }
}