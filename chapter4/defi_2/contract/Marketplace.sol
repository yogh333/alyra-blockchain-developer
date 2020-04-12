pragma solidity ^0.6.0;

pragma experimental ABIEncoderV2;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/math/SafeMath.sol";

contract PlaceMarche{

	using SafeMath for uint;

	enum Role {Administrateur, Entreprise, Illustrateur} // three kinds of participants
	enum State {OUVERTE, ENCOURS, FERMEE, PAYEE}

	struct Participant {
		address user;		// user's blockchain address
		uint reputation;	// user's reputation
		string name;		// user's name
		Role profession; 	// user's profession 
		bool registered;	// true if user is registered 
	}

	event eRequest(address sender, uint demande_id);
	event eDeliverable(uint id, bytes32 hash, address user);
	event eRegister(bool flag);
	event ePayment(uint remuneration);

	struct Request {
	    uint id;                	// Request's identifier
		address requester;      	// Request issuer's address
		uint remuneration;      	// Remuneration
		uint deliveryTime;   		// desired Delivery date
		string description;     	// Task description
		State requestState;      	// State of Demand
		address[] candidates;   	// List of Illustrator candidates
		address selectedIllustrator;// Illustrateur selectionné
		bytes32	deliveryHash;		// hash de l'URL du livrable de l'illustrateur
	}

	mapping(address => Participant) private users;	// Mapping of users  
	mapping(address => bool) private bannedUsers;	// Mapping of banned users

	Request[] private requestList; // List of all requests 
	
	constructor() public {
	    users[msg.sender].user = msg.sender;
		users[msg.sender].reputation = 1000;
		users[msg.sender].name = "Admin";
		users[msg.sender].profession = (Role.Administrateur);
		users[msg.sender].registered = true;
    }
    
    function getBalance() public view returns (uint) {
        require(users[msg.sender].registered, "Vous n'etes pas inscrit sur cette place de marché");
        require(users[msg.sender].profession == (Role.Administrateur), "Seul l'administrateur peut connaitre la balance");
	    return address(this).balance;
	}

    function getUserInfo(address user) public view returns (Participant memory) {
    	require(users[msg.sender].registered, "Vous n'êtes pas registered sur cette place de marché");
    	require(users[user].registered, "L'utilisateur n'est pas inscrit sur cette place de marché");

    	return users[user];
    }
    
    function banUser(address user) public {
        require(users[msg.sender].registered, "Vous n'êtes pas inscrit sur cette place de marché");
        require(users[msg.sender].profession == (Role.Administrateur), "Seul un administrateur peut bannir une adresse");
        require(users[user].registered, "L'utilisateur n'est pas inscrit");
        require(!bannedUsers[user], "L'utilisateur a déjà été banni");
        
        bannedUsers[user] = true;
        users[user].reputation = 0;
        users[user].registered = false;
    }

	function register(string memory _name, uint _status) public {
		require(!users[msg.sender].registered, "Vous êtes déjà inscrit sur cette place de marché");
		require(_status > (uint)(Role.Administrateur), "Vous ne pouvez vous inscrire qu'en tant que Entreprise ou Illustrateur");
		require(!bannedUsers[msg.sender], "Vous avez été banni de cette plateforme et ne pouvez plus vous inscrire");
		
		users[msg.sender].user = msg.sender;
		users[msg.sender].reputation = 1;
		users[msg.sender].name = _name;
		users[msg.sender].profession = (Role)(_status);
		users[msg.sender].registered = true;

		emit eRegister(true);
	}

	function newRequest(string memory _description, uint _deliveryTime, uint _remuneration) public payable {
		require(users[msg.sender].registered, "Vous n'êtes pas inscrit sur cette place de marché");
		require(users[msg.sender].profession == (Role.Entreprise), "Seule une entreprise peut déposer une demande");
		require(users[msg.sender].reputation >= 1, "Votre reputation est trop basse");
		require(SafeMath.mul(100, SafeMath.sub(msg.value, _remuneration)) >= SafeMath.mul(2, _remuneration), "2% de frais doiventê être ajouté");
    
		Request memory r;
		r.id = requestList.length;
		r.requester = msg.sender;
		r.remuneration = _remuneration;
		r.deliveryTime = _deliveryTime;
		r.description = _description;
		r.requestState = State.OUVERTE;
		requestList.push(r);

		emit eRequest(msg.sender, r.id);
	}

	function getRequests() public view returns (Request[] memory) {

		require(users[msg.sender].registered, "Vous n'êtes pas inscrit sur cette place de marché");
		require(users[msg.sender].reputation >= 1, "Votre reputation est trop basse");

		return requestList;
	}
	
	function submit(uint request_id) public returns (bool) {
	    require(users[msg.sender].registered, "Vous n'êtes pas inscrit sur cette place de marché");
	    require(users[msg.sender].profession == (Role.Illustrateur), "Seule un illustrateur peut postuler à une offre");
	    require(request_id < requestList.length, "L'offre pour laquelle vous souhaitez postuler n'existe pas");
	    require(requestList[request_id].requestState == State.OUVERTE, "L'offre a déjà était acceptée");
	    
	    requestList[request_id].candidates.push(msg.sender);

	    return true;
	}
	
	function getCandidates(uint request_id) public view returns (address[] memory){
	    require(users[msg.sender].registered, "Vous n'êtes pas inscrit sur cette place de marché");
		require(users[msg.sender].profession == (Role.Entreprise), "Seule une entreprise peut demander la liste des candidates");
		require(request_id < requestList.length, "La demande n'existe pas");
		require(users[msg.sender].user == requestList[request_id].requester, "You can only retireve candidate for your own request");
		
		return requestList[request_id].candidates;
		
	}
	
	function selectCandidate(uint request_id, address illustrator) public {
	    require(users[msg.sender].registered, "Vous n'êtes pas inscrit sur cette place de marché");
	    require(users[msg.sender].profession == (Role.Entreprise), "Seule une entreprise peut accepter une offre");
	    require(request_id < requestList.length, "L'offre n'existe pas");
	    require(requestList[request_id].requestState == State.OUVERTE, "L'offre a déjà été acceptée");
	    require(users[illustrator].registered, "L'illustrateur n'est pas inscrit");
	    
	    requestList[request_id].requestState = State.ENCOURS;
	    requestList[request_id].selectedIllustrator = users[illustrator].user;
	    
	}

	function produireHash(string memory url) public pure returns (bytes32) {
		return keccak256(bytes(url));
  	}
	
	function deliver(uint request_id, bytes32 url_hash) public {
		require(users[msg.sender].registered, "Vous n'êtes pas inscrit sur cette place de marché");
		require(users[msg.sender].profession == (Role.Illustrateur), "Seule un illusrateur peut livrer");
		require(requestList[request_id].requestState == State.ENCOURS, "ID de la demande erroné");
		require(requestList[request_id].selectedIllustrator == msg.sender, "Vous n'êtes pas l'illustrateur sélectionné");

	    requestList[request_id].deliveryHash = url_hash;
	    requestList[request_id].requestState = State.FERMEE;
	    
	    users[msg.sender].reputation += 1;
	    
	    emit eDeliverable(request_id, url_hash, msg.sender);
	}

	function getMoney(uint request_id) public payable {
		require(users[msg.sender].registered, "Vous n'êtes pas inscrit sur cette place de marché");
		require(users[msg.sender].profession == (Role.Illustrateur), "Seule un illusrateur peut être payé");
		require(requestList[request_id].requestState == State.FERMEE, "ID de la demande erroné");
		require(requestList[request_id].selectedIllustrator == msg.sender, "Vous n'êtes pas l'illustrateur sélectionné");

		msg.sender.transfer(requestList[request_id].remuneration);

		requestList[request_id].requestState = State.PAYEE;

		emit ePayment(requestList[request_id].remuneration);
	}
}