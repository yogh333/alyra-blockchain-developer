pragma solidity ^0.6.0;

import "https://raw.githubusercontent.com/OpenZeppelin/openzeppelin-contracts/master/contracts/math/SafeMath.sol";

contract Cogere {
    
    using SafeMath for uint;

    mapping (address => uint) organisateurs;
    uint nbOrganisateurs;

    constructor() internal {
        organisateurs[msg.sender] = 100;
        nbOrganisateurs = 1;   
    }

 function transfererOrga(address orga, uint parts) public {
    require(organisateurs[msg.sender] != 0, "Vous n'êtes pas un organisateur");
    require(parts <= organisateurs[msg.sender], "Vous ne pouvez pas transférer plus que votre part actuelle");
    require(organisateurs[orga] != 0, "La personne à qui vous souhaitez tranférer des parts ne fait pas partie des orginsateurs");
    organisateurs[msg.sender] = organisateurs[msg.sender].sub(parts);
    organisateurs[orga] = organisateurs[orga].add(parts);
    nbOrganisateurs = nbOrganisateurs.add(1);
  }

 function estOrga(address orga) public view returns (bool){
     if (organisateurs[orga] > 0)
        return true;
     else
        return false;
  }
}



contract CagnotteFestival is Cogere {
    
    using SafeMath for uint;
    
    mapping (address => bool) festivaliers;
    mapping (address => string) sponsors;

    uint placesRestantes;
    uint private cagnotte;
    uint dateFestival;
    uint dateLiquidation;
    uint timestampDerniereDepense;
    uint seuilDepenseQuotidienne;
    uint totalDepense;

    constructor(uint date) public {
        placesRestantes = 1000;
        cagnotte = 0;
        dateFestival = date;
        dateLiquidation = dateFestival.add(2 weeks);
        seuilDepenseQuotidienne = 50 ether;
        totalDepense = 0;   
    }


    function acheterTicket() public payable {
        require(msg.value>= 500 finney,"Place à 0.5 Ethers");
        require(placesRestantes>0,"Plus de places !");

        placesRestantes = placesRestantes.sub(1);
        festivaliers[msg.sender]=true;

        cagnotte = cagnotte.add(msg.value);
    }

    function controleDepense(uint montant) private returns (bool) {
        if ((block.timestamp - timestampDerniereDepense) < 86400 && (totalDepense.add(montant) > seuilDepenseQuotidienne))
            return false;
        else {
            totalDepense = 0;
        }

        totalDepense = totalDepense.add(montant);
        timestampDerniereDepense = now;

        return true;
    }

    function payer(address payable destinataire, uint montant) public {
        require(estOrga(msg.sender), "Il faut etre organisateur pour dépenser la cagnotte");
        require(destinataire != address(0), "destinataire non valide");
        require(montant > 0 && montant < cagnotte, "Impossible de dépenser plus que la cagnotte");

        require(controleDepense(montant) == true, "Seuil de dépense quotidienne dépassé !");

        destinataire.transfer(montant);

        cagnotte = cagnotte.sub(montant);
    }

    function retraitOrganisateurs() public {
        require(estOrga(msg.sender), "Vous n'etes pas un organisateur");
        require(block.timestamp > dateLiquidation, "La date de liquidation n'est pas encore atteinte");

        msg.sender.transfer(cagnotte.mul(organisateurs[msg.sender].div(100)));
        cagnotte = cagnotte.sub(cagnotte.mul(organisateurs[msg.sender].div(100)));
        organisateurs[msg.sender] = 0;
        nbOrganisateurs = nbOrganisateurs.sub(1);
        if (nbOrganisateurs == 0){
            selfdestruct(msg.sender);
        }
    }

    function sponsoriser(string memory nom) public payable {
        require(msg.value >= 30 ether, "Pour être cité comme sponsor, un paiement de 30 ethers minimum est requis");

        cagnotte = cagnotte.add(msg.value);
        sponsors[msg.sender] = nom;

    }

}