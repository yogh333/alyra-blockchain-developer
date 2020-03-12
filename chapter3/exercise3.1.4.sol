pragma solidity ^0.5.7;

contract Assemblee {
    
    mapping (address => bool) public membres; // mapping des membres

    struct Decision {
        string description;
        uint votesPour;
        uint votesContre;
        mapping (address => bool) aVote;
        uint dateFin;
    }

    Decision[] decisions;


    function rejoindre() public {
        require (!membres[msg.sender], "Already member !");
        membres[msg.sender] = true;
    }
    
    function estMembre(address utilisateur) public view returns (bool) {
        return membres[msg.sender];
    }
    
    function proposerDecision(string memory description) public {
        require(membres[msg.sender], "You are not a member !");
        decisions.push(Decision(description, 0, 0, now + 7 days));
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