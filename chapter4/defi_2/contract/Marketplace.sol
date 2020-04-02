pragma solidity ^0.6.0;

pragma experimental ABIEncoderV2;

import "https://raw.githubusercontent.com/OpenZeppelin/openzeppelin-contracts/master/contracts/math/SafeMath.sol";


contract PlaceMarche{
	using SafeMath for uint;

	enum Roles {Administrateur, Entreprise, Illustrateur}

	struct Participant {
		address user;
		uint reputation;
		string nom;
		Roles fonction; 
		bool inscrit;
	}

	enum EtatDemande {OUVERTE, ENCOURS, FERMEE}

	struct Demande {
	    uint id;                // Demande identifier
		address demandeur;      // Offer issuer's address
		uint remuneration;      // Remuneration
		uint delai_livraison;   // desired Delivery date
		string description;     // Task description
		EtatDemande etat;       // State of Demand
		address[] candidats;    // List of Illustrator candidates
	}

	mapping (address => Participant) private utilisateurs;  
	
	Demande[] private listeDemandes; // List of all demands 
	
	mapping (uint => bytes32) private livraisons; // Mapping of deliveries
	mapping (address => bool) private bannis; // Mapping of banned users
	
	event Livrable(uint, bytes32, address);
	
	constructor() public {
	    utilisateurs[msg.sender].user = msg.sender;
		utilisateurs[msg.sender].reputation = 1000;
		utilisateurs[msg.sender].nom = "Admin";
		utilisateurs[msg.sender].fonction = (Roles.Administrateur);
		utilisateurs[msg.sender].inscrit = true;
    }
    
    
    function bannir(address user) public {
        require(!utilisateurs[msg.sender].inscrit, "Vous êtes déjà inscrit sur cette place de marché");
        require(utilisateurs[msg.sender].fonction == (Roles.Administrateur), "Seul un administrateur peut bannir une adresse");
        require(utilisateurs[user].inscrit, "L'utilisateur n'est pas inscrit");
        require(!bannis[user], "L'utilisateur a déjà été banni");
        
        bannis[user] = true;
        utilisateurs[user].reputation = 0;
    }

	function inscription(string memory _nom, uint _status) public {
		require(!utilisateurs[msg.sender].inscrit, "Vous êtes déjà inscrit sur cette place de marché");
		require(_status > (uint)(Roles.Administrateur), "Vous ne pouvez vous inscrire qu'en tant que Entreprise ou Illustrateur");
		utilisateurs[msg.sender].user = msg.sender;
		utilisateurs[msg.sender].reputation = 1;
		utilisateurs[msg.sender].nom = _nom;
		utilisateurs[msg.sender].fonction = (Roles)(_status);
		utilisateurs[msg.sender].inscrit = true;
	}

	function ajouterDemande(string memory _description, uint _delai, uint _remuneration) public payable returns (uint) {

		require(utilisateurs[msg.sender].inscrit, "Vous n'êtes pas inscrit sur cette place de marché");
		require(utilisateurs[msg.sender].fonction == (Roles.Entreprise), "Seule une entreprise peut déposer une demande");
		require(utilisateurs[msg.sender].reputation >= 1, "Votre reputation est trop basse");
		require(msg.value > _remuneration);
		require(SafeMath.mul(100, SafeMath.sub(msg.value, _remuneration)) >= SafeMath.mul(2, _remuneration), "2% de frais doiventê être ajouté");
    
		Demande memory demande;
		demande.id = listeDemandes.length;
		demande.demandeur = msg.sender;
		demande.remuneration = _remuneration;
		demande.delai_livraison = _delai;
		demande.description = _description;
		demande.etat = EtatDemande.OUVERTE;
		listeDemandes.push(demande);
		
		return demande.id;
	}

	function getListOfDemandes() public view returns (Demande[] memory) {

		require(utilisateurs[msg.sender].inscrit, "Vous n'êtes pas inscrit sur cette place de marché");
		require(utilisateurs[msg.sender].reputation >= 1, "Votre reputation est trop basse");

		return listeDemandes;
	}
	
	function postuler(uint demande_id) public {
	    
	    require(utilisateurs[msg.sender].inscrit, "Vous n'êtes pas inscrit sur cette place de marché");
	    require(utilisateurs[msg.sender].fonction == (Roles.Illustrateur), "Seule un illustrateur peut postuler à une offre");
	    require(demande_id < listeDemandes.length, "L'offre pour laquelle vous souhaitez postuler n'existe pas");
	    require(listeDemandes[demande_id].etat == EtatDemande.OUVERTE, "L'offre a déjà était acceptée");
	    
	    listeDemandes[demande_id].candidats.push(msg.sender);
	}
	
	function listeCandidats(uint demande_id) public view returns (address[] memory){
	    
	    require(utilisateurs[msg.sender].inscrit, "Vous n'êtes pas inscrit sur cette place de marché");
		require(utilisateurs[msg.sender].fonction == (Roles.Entreprise), "Seule une entreprise peut déposer une demande");
		require(demande_id < listeDemandes.length, "L'offre pour laquelle vous souhaitez postuler n'existe pas");
		
		return listeDemandes[demande_id].candidats;
		
	}
	
	function accepterOffre(uint demande_id) public {
	    
	    require(utilisateurs[msg.sender].inscrit, "Vous n'êtes pas inscrit sur cette place de marché");
	    require(utilisateurs[msg.sender].fonction == (Roles.Entreprise), "Seule une entreprise peut accepter une offre");
	    require(demande_id < listeDemandes.length, "L'offre n'existe pas");
	    require(listeDemandes[demande_id].etat == EtatDemande.OUVERTE, "L'offre a déjà était acceptée");
	    
	    listeDemandes[demande_id].etat = EtatDemande.ENCOURS;
	    
	}
	
	function livraison(uint demande_id, bytes32 url_hash) public {
	    
	    livraisons[demande_id] = url_hash;
	    listeDemandes[demande_id].etat = EtatDemande.FERMEE;
	    
	    utilisateurs[msg.sender].reputation = utilisateurs[msg.sender].reputation.add(1);
	    
	    msg.sender.transfer(listeDemandes[demande_id].remuneration);
	    
	    emit Livrable(demande_id, url_hash, msg.sender);
	}
}