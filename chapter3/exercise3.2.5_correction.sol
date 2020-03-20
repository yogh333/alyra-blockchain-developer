pragma solidity ^0.6.0;

import "https://raw.githubusercontent.com/OpenZeppelin/openzeppelin-contracts/master/contracts/math/SafeMath.sol";


contract CagnotteFestival{
    using SafeMath for uint;
    
    struct Ticket {
        uint8 choix;
        address participant;
    }

    struct Lotterie {
        Ticket[] tickets;
        uint8 tirage;
        bool estTire;
        uint hauteurTirage;
    }

    mapping (address => uint) organisateurs; // Mapping des organisateurs et leurs parts 
    string[] sponsors; // Liste des sponsors
    uint constant LIMITE = 100; // Limite des sponsors à ajouter
    uint dateFestival;
    uint dateLiquidation;
    uint constant seuilDepense = 100 ether; // Seuil dépense par jour 
    mapping (uint => uint) depenses; // Jour => valeur
    uint partsTotal = 100;
    // partie Lotterie
    Lotterie[13] lotteries;
    mapping (address => uint) gainsLotteries;

    constructor(uint date) public {
        require(date >= block.timestamp, "La date renseignée est fausse !");
        organisateurs[msg.sender] = partsTotal;
        dateFestival = date;
        dateLiquidation = dateFestival + 2 weeks;
    }
    
    function acheterTicket(uint jour, uint8 choix) public payable {
        // Vérfier que la valeur d'ether envoyée == 100 finney
        require(msg.value == 100 finney, "Vérifier votre valeur d'ether envoyée !");
        // Vérifier que le jour choisi est dans le future 
        require(jourActuel() < jour, "Vérifier le jour choisi !");
        // Ajouter la lotterie 
        lotteries[jour].tickets.push(Ticket(choix, msg.sender));
    }

    function demanderTirage(uint jour) public {
        // Vérifier qu'on peut demander un tirage
        require(jourActuel() > jour, "Vérifier le jour choisi !");
        // Le tirage sera possible dans ~1 minute
        lotteries[jour].hauteurTirage = block.number + 6; 
    }

    function tirer(uint jour) public {
        // Vérifier qu'on peut demander un tirage
        require(jourActuel() > jour, "Vérifier le jour choisi !");
        // Vérifier si la hauteur du tirage est dépassée
        require(block.number >= lotteries[jour].hauteurTirage, "La hauteur du tirage n'est pas dépassée !");
        // Vérifier que la lotterie n'est pas déjà tiré 
        require(!lotteries[jour].estTire, "La lotterie est déjà tirée !");
        // Définir la lotterie du jour 
        lotteries[jour].tirage = uint8(uint(blockhash(lotteries[jour].hauteurTirage)) % 256);
        // Mettre à jour la lotterie du jour 
        lotteries[jour].estTire = true;
        // Récupérer le nombre des gagnants du jour
        uint n = nombreGagnants(jour);
        // Parcourrir les lotteries du jour et mettre à jour les gains 
        for (uint i; i < lotteries[jour].tickets.length; i++) {
            if (lotteries[jour].tickets[i].choix == lotteries[jour].tirage) {
                gainsLotteries[lotteries[jour].tickets[i].participant] = SafeMath.add(lotteries[jour].tickets.length.mul(50 finney).div(n),
                gainsLotteries[lotteries[jour].tickets[i].participant]);
            }
        }
    }

    function retirerGains() public {
        // gains à transférer
        uint toTransfer = gainsLotteries[msg.sender];
        require(toTransfer > 0, "Vous n'avez pas de gains à retirer !");
        // supprimer le participant pour 
        delete gainsLotteries[msg.sender];
        // transférer les gains au participant (msg.sender)
        msg.sender.transfer(toTransfer);
    }

    function nombreGagnants(uint jour) internal view returns (uint) {
        uint c;
        // Parcourrir la liste des lotteries et incrémenter le nombre des gagnants  
        for (uint i; i < lotteries[jour].tickets.length; i++) {
            if (lotteries[jour].tickets[i].choix == lotteries[jour].tirage) {
                c.add(1);
            }
        }
        return c;
    }

    function jourActuel() internal view returns (uint) {
        return now.sub(dateLiquidation.sub(2 weeks)).div(1 days);
    }

    function payer(uint valeur, address payable destinataire) public {
        // Vérifier que l'address du destinataire n'est pas l'address 0
        require(destinataire != address(0), "Vérifier l'address du destinataire !");
        // Vérifier que celui qui appelle la fonction est un organisateur
        require(estOrga(msg.sender), "Vous n'êtes pas un organisateur");
        // Vérifier si la dateLiquidation est atteinte ou pas 
        require(block.timestamp < dateLiquidation, "Vous ne pouvez plus payer, date de liquidation atteinte !");
        // Contrôler la dépense
        require(controleDepense(valeur), "Vous avez atteint votre limite !");
        // Mettre à jour les dépenses du jour 
        depenses[jour(block.timestamp)] = depenses[jour(block.timestamp)].add(valeur);
        // transférer la valeur au destinataire
        destinataire.transfer(valeur);
    }
    
    function controleDepense(uint valeur) internal view returns (bool) {
        // vérifier la dépense du jour 
        return SafeMath.add(depenses[jour(block.timestamp)], valeur) <= seuilDepense;
    }
    
    function jour(uint t) internal pure returns (uint) {
        // Indice du jour du moment t
        return SafeMath.div(t, 1 days);
    }
    
    function retrait() public {
        // vérifier que la date de liquidation est atteinte
        require(block.timestamp >= dateLiquidation, "La date de liquidation n'est pas dépassée !");
        // to avoid re-entrancy
        uint toTransfer = (address(this).balance).mul(organisateurs[msg.sender].div(partsTotal));
        // mettre à jour les parts 
        partsTotal = partsTotal.sub(organisateurs[msg.sender]);
        assert(partsTotal <= 100);
        // supprimer l'organisateur 
        delete organisateurs[msg.sender];
        // transferer le montant équivalent à ses parts au msg.sender
        msg.sender.transfer(toTransfer);
        // vérifier si y'a plus de parts, kill le contrat 
        if (partsTotal == 0) {
          selfdestruct(msg.sender);
        }
    }

    function transfererOrga(address orga, uint parts) public {
        // vérifier si l'organisateur a assez de parts à transférer 
        require(organisateurs[msg.sender] >= parts);
        // vérifier si l'orga n'existe pas 
        require(!estOrga(orga));
        // vérifier si l'orga auquel on transfère des parts n'est pas l'address 0
        require(orga != address(0));
        // modifier les parts de l'organisateur actuel 
        organisateurs[msg.sender] = organisateurs[msg.sender].sub(parts);
        // rajouter les parts au nouveau orga
        organisateurs[orga] = parts;
    }
    
    function estOrga(address orga) public view returns (bool){ 
        // vérifier si un l'orga est un organisateur revient à vérifier si 
        // l'orga donné a des parts > 0 
        return (organisateurs[orga] > 0);
    }
    
    function sponsoriser(string memory nom) public payable {
        // vérifier les ethers envoyés par le sponsor 
        // et si la limite a été atteinte 
        if(msg.value >= 30 ether &&  sponsors.length <= LIMITE){
            // Si c'est >= 30 ether on rajoute le nom du sponsor à la liste 
            sponsors.push(nom);
        }
    }
}