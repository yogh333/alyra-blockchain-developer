pragma solidity ^0.5.7;

contract CagnotteFestival{

 mapping (address => uint) organisateurs;

 constructor() public {
   organisateurs[msg.sender] = 100;   
 }

  function transfererOrga(address orga, uint parts) public {
  	require(organisateurs[msg.sender] != 0, "Vous n'êtes pas un organisateur");
  	require(parts <= organisateurs[msg.sender], "Vous ne pouvez pas transférer plus que votre part actuelle");
  	require(organisateurs[orga] != 0, "La personne à qui vous souhaitez tranférer des parts ne fait pas partie des orginsateurs");
  	organisateurs[msg.sender] -= parts;
  	organisateurs[orga] += parts;
  }

  function estOrga(address orga) public view returns (bool){
  	if (organisateurs[orga] >= 0)
  		return true;
  	else
  		return false;
  }
}