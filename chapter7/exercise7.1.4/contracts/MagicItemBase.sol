pragma solidity ^0.6.0;

import "@openzeppelin/contracts/math/SafeMath.sol";	
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MagicItemBase is Ownable, ERC721 {

	using SafeMath for uint16;
	using SafeMath for uint256;


	/// @dev EVENTS
	event Destroyed(uint16 _tokenID, uint8 _rand);

	/// @dev CONSTANTS
  	uint16 constant MAX_MI_ID = 3000;
  	uint16 constant DIVINE_MI_ID = 2000;

  	constructor() ERC721("MyMagicItem", "MMI") public {
  	}

	function dig() public payable {

		require(msg.value >= 0.1 ether, "You must pay at least 0.1 ether to dig for new MagicItem");

		uint256 _rand = (uint256)(blockhash(block.number - 1));
		uint16 _newItemD = (uint16)(_rand % MAX_MI_ID);
		while (_exists(_newItemD)){
			_rand = (uint256)(blockhash(block.number - 1));
			_newItemD = (uint16)(_rand % MAX_MI_ID);
		}
		_safeMint(msg.sender, _newItemD);			
	}

	function use(uint16 _tokenId) public {	

		require(ownerOf(_tokenId) == msg.sender);

		uint8 _rand = (uint8)((uint256)(blockhash(block.number - 1)) % 10);

		if (_rand == 0){
			_burn(_tokenId);
		}
		
		emit Destroyed(_tokenId, _rand);
	}
}


