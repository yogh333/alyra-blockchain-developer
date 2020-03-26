pragma solidity ^0.6.0;

import "https://raw.githubusercontent.com/OpenZeppelin/openzeppelin-contracts/master/contracts/math/SafeMath.sol";

contract Credibilite {
  mapping (address => uint256) public cred; // balances de cred que déspose une address 
  mapping (bytes32 => bool) public hashs; // liste des hashs remis
  uint256 public ordre; // orde actuel 

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
      // vérifier si un hash a été déjà remi
      require(!hashs[dev], "Hash déjà remi !");
      // ajouter le hash au mapping "hashs"
      hashs[dev] = true;
      // incrémenter l'ordre de la remise 
      ordre++;
      // retourner l'ordre actuel 
      return ordre;
  }
}