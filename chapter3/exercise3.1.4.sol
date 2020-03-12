pragma solidity ^0.5.7;

contract Assemblee {
    
    address[] membres;  

    struct Decision {
        string description;
        uint votesPour;
        uint votesContre;
        mapping (address => bool) aVote;
    }

    Decision[] decisions;


    function rejoindre() public {
        membres.push(msg.sender);
    }
    
    function estMembre(address utilisateur) public view returns (bool) {
        bool isFound = false;
        for (uint i = 0; i < membres.length;i++){
            if (membres[i] == utilisateur){
                isFound = true;
                break;
            } 
        }
        return isFound;
    }
    
    function proposerDecision(string memory description) public {
        if(estMembre(msg.sender)){
            Decision memory decision;
            decision.description = description;
            decisions.push(decision);
        }
    }
    
    function voter(uint indice, bool value) public {
        if (estMembre(msg.sender) && !decisions[indice].aVote[msg.sender]){
            if (value)
                decisions[indice].votesPour += 1;
            else
                decisions[indice].votesContre += 1;

            decisions[indice].aVote[msg.sender] = true;
        }
    }

    function comptabiliser(uint indice) public view returns (int){
        return int(decisions[indice].votesPour - decisions[indice].votesContre);
    }
}