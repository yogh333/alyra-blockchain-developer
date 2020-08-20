pragma solidity ^0.6.0;

import "@openzeppelin/contracts/math/SafeMath.sol";	
import "@openzeppelin/contracts/access/Ownable.sol";

contract MagicItemBase is Ownable {

	using SafeMath for uint16;
	using SafeMath for uint256;


	/// @dev EVENTS

	event Transfer(address indexed _from, address indexed _to, uint16 _tokenId);
	event NewMagicItem(address indexed _digger, uint16 _tokenID);
	event Destroyed(uint16 _tokenID, uint8 _rand);

	/// @dev DATA TYPES

	struct MagicItem {
		uint16 id; 	/* rarity * 1000 + type * 100 + design * 10 + state */
		// uint8 rarity; 	/* 0 (current), 1 (rare) or 2 (divine) */
		// uint8 object;		/* 0 to 9 */ 
		// uint8 version; 	/* 0 to 5 (0 = basic to 5 = high tech) */
		// uint8 state;	/* 0 to 4 (0 = new to 4 = worn) */
	}

	/// @dev CONSTANTS

  	uint16 constant MAX_MI_ID = 3000;
  	uint16 constant DIVINE_MI_ID = 2000;

  	/// @dev STORAGE ***/

    /// @dev An array containing MagicItem struct for all magic items in existence. The ID
    ///  of each magic item is actually an index into this array.

	MagicItem[] magicitems;

	/// @dev A mapping from magic item IDs to the address that owns them. All magic items have
    ///  some valid owner address.
	mapping (uint16 => address) public magicitemIndexToOwner;

	// @dev A mapping from owner address to count of tokens that address owns.
    //  Used internally inside balanceOf() to resolve ownership count.
	mapping (address => uint256) public ownerToNumMagicItem;

	// @dev A mapping from owner address to count of tokens that address owns.
    //  Used internally inside balanceOf() to resolve ownership count.
  	mapping (uint16 => bool) public magicitemExist;

  	function balanceOf(address _owner) public view returns (uint256 balance) {
  		return ownerToNumMagicItem[_owner];
  	}

  	function totalSupply() public view returns (uint256) {
  		return magicitems.length;
    }

  	function tokensOfOwner(address _owner) external view returns (uint16[] memory ownerTokens){

  		uint256 tokenCount = balanceOf(_owner);
  		uint256 resultIndex = 0;

  		if (tokenCount == 0) {
            // Return an empty array
            return new uint16[](0);
        } else {
        	uint16[] memory _IDs = new uint16[](tokenCount);
        	uint256 totalMagicItems = totalSupply();		
	  		uint8 i;

	  		for (i = 0; i < totalMagicItems; i++){
	  			if (ownerOf(magicitems[i].id) == _owner) {
	  				_IDs[resultIndex] = magicitems[i].id;
	  				resultIndex++;
	  			}
	  		}
  			return _IDs;
  		}
  	}

  	function ownerOf(uint16 _tokenId) public view returns (address _owner){
  		return magicitemIndexToOwner[_tokenId];
	}

	function exists(uint16 _tokenId) public view returns (bool exist){
		return magicitemExist[_tokenId];

	}

	function transferFrom(address _from, address _to, uint16 _tokenId) public {
		require(magicitemIndexToOwner[_tokenId] == msg.sender);
		require(((_from == msg.sender) || (_from == address(this))),"");
		require(_tokenId < DIVINE_MI_ID);

		magicitemIndexToOwner[_tokenId] = _to;
		ownerToNumMagicItem[_from] = ownerToNumMagicItem[_from].sub(1);
		ownerToNumMagicItem[_to] = ownerToNumMagicItem[_to].add(1); 

		emit Transfer(_from, _to, _tokenId);
	}

	function dig() public payable {

		require(msg.value >= 0.1 ether, "You must pay at least 0.1 ether to dig for new MagicItem");

		uint256 _rand = (uint256)(blockhash(block.number - 1));
		uint16 _newID = (uint16)(_rand % MAX_MI_ID);
		while (magicitemExist[_newID]){
			_rand = (uint256)(blockhash(block.number - 1));
			_newID = (uint16)(_rand % MAX_MI_ID);
		}
		magicitemExist[_newID] = true;	

		MagicItem memory _mi;
		_mi.id = _newID; 

		/*
		_mi.rarity = (uint8)(_newID / 1000);
		_newID = _newID % 1000;
		_mi.object = (uint8)(_newID / 100);
		_newID = _newID % 100; 
		_mi.version = (uint8)(_newID / 10);
		_newID = _newID % 10; 
		_mi.state = (uint8)(_newID); 
	*/
		magicitems.push(_mi);

		magicitemIndexToOwner[_mi.id] = msg.sender;
		ownerToNumMagicItem[msg.sender] = ownerToNumMagicItem[msg.sender].add(1);

		emit NewMagicItem(msg.sender, _mi.id);
			
	}

	function use(uint16 _tokenId) public {	

		require(magicitemIndexToOwner[_tokenId] == msg.sender);

		uint8 _rand = (uint8)((uint256)(blockhash(block.number - 1)) % 10);

		if (_rand == 0){
			uint256 index = 0;
			while (magicitems[index].id != _tokenId){
				index++;
			}
			magicitems[index] = magicitems[magicitems.length - 1];
			magicitems.pop();

			delete magicitemIndexToOwner[_tokenId];
			delete magicitemExist[_tokenId];
			ownerToNumMagicItem[msg.sender] = ownerToNumMagicItem[msg.sender].sub(1);
		}
		
		emit Destroyed(_tokenId, _rand);
	}
}


