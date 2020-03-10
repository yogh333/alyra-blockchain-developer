/Write your own contracts here. Currently compiles using solc v0.4.15+commit.bbb8e64f.
pragma solidity ^0.4.25;
contract SceneOuverte {

  string[12] passagesArtistes;
  uint creneauxLibres = 12;

  function sInscrire(string memory nomDArtiste) public {
    if (creneauxLibres > 0){
      passagesArtistes[12 - creneauxLibres] = nomDArtiste;
      creneauxLibres -= 1;
    }
  }

  uint tour = 0;

  function passerArtisteSuivant() public {
     if (tour < (12 - creneauxLibres)){
       tour += 1;
     }
 }

 function artisteEnCours() public view returns (string memory){
   if (tour > (12 - creneauxLibres - 1)){
     return "FIN";
   }
   else {
     return passagesArtistes[tour];
   }
 }
}