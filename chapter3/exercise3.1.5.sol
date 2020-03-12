pragma solidity ^0.5.7;

contract Assemblee {

    string public nomAssemblee;

    constructor(string memory nom) public {
        admins[msg.sender] = true;
        membres[msg.sender] = true;
        nomAssemblee = nom;
    }
    
    mapping (address => bool) public membres; // mapping des membres
    mapping (address => bool) public admins; // mapping des administrateurs
    mapping (address => uint) public blames; // mapping des blames par membres

    struct Decision {
        string description;
        uint votesPour;
        uint votesContre;
        uint dateFin;
        mapping (address => uint) voix;
        mapping (address => bool) aVote;
    }

    Decision electionAdmin;

    Decision[] decisions;

    function elireAdmin(address addr_membre) public {
        require(membres[msg.sender], "You are not a member !");
        require(membres[addr_membre], "Vous ne pouvez voter que pour un membre de l'assemblée");
        require(!admins[addr_membre], "le membre pour lequel vous votez est déjà administrateur !");

        electionAdmin.voix[addr_membre] += 1;
    }

    function ajouteAdmin(address new_admin) public {
        require(admins[msg.sender], "Vous n'etes pas autorisé à désigner un administrateur");
        require(membres[new_admin], "Il faut etre membre pour devenir administrateur");
        require(!admins[new_admin], "Ce membre est déjà un administrateur");

        admins[new_admin] = true;

    }

    function demissionAdmin() public {
        require(membres[msg.sender], "Vous n'êtes pas membre de l'assemblée");
        require(admins[msg.sender], "Vous n'êtes pas administrateur");

        admins[msg.sender] = false;
    }

    function blameMembre(address addr_membre) public {
        require(admins[msg.sender], "Vous n'êtes pas administrateur");
        require(membres[addr_membre], "Ce n'est pas un membre");

        blames[addr_membre] += 1;
        if (blames[addr_membre] == 2)
            membres[addr_membre] = false;
    }


    function rejoindre() public {
        require (!membres[msg.sender], "Already member !");
        require (blames[msg.sender] == 0, "Vous avez été banni de l'assemblée");
        membres[msg.sender] = true;
        blames[msg.sender] = 0;
    }
    
    
    function proposerDecision(string memory description) public {
        require(membres[msg.sender], "You are not a member !");
        decisions.push(Decision(description, 0, 0, now + 7 days));
    }

    function clotureVote(uint indice) public {
        require(admins[msg.sender], "Vous n'êtes pas administrateur");
        require(indice < decisions.length && indice >= 0, "Wrong index");

        decisions[indice].dateFin = now;
    }
    
    function voter(uint indice, bool value) public {
        require(membres[msg.sender], "You are not a member !");
        require(indice < decisions.length && indice >= 0, "Wrong index");
        require(!decisions[indice].aVote[msg.sender], "You have already voted");
        require(decisions[indice].dateFin > now, "Vote is closed");
        decisions[indice].aVote[msg.sender] = true;
        if (value)
            decisions[indice].votesPour += 1;
        else
            decisions[indice].votesContre += 1;
    }

    function comptabiliser(uint indice) public view returns (int){
        return int(decisions[indice].votesPour - decisions[indice].votesContre);
    }
}