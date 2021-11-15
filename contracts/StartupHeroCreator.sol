// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/utils/Counters.sol';

// import 'https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol';
// import 'https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/Counters.sol';



contract StartupHeroCreator is ERC721 {
  using Counters for Counters.Counter;
  Counters.Counter private _itemId;
 
  /**
   * Global State Variables
   */
  address public admin;
  
  /**
   * Struct Types
   */

  // attributes of a startup hero
  struct Attributes {
    uint8 artist;
    uint8 hacker;
    uint8 hustler;
    uint8 success;
  }
  
  struct Member {
    string name;
    uint256 balance;
    bool membership;
  }
  
  struct Series {
      Counters.Counter active;
      Counters.Counter count;
  }
  
  Series public currentSeries;
  
  mapping(address => Attributes) private userStoredAttributes;    
  mapping(address => uint256[]) private _userOwnedTokens;
  mapping(address => Member) private _collective;
  
  constructor() ERC721('Startup Hero', 'SUP') {
    admin = msg.sender;
    
    // Make the Admin the first member of the collective
    _collective[admin].name = "The Boss";
    _collective[admin].membership = true;
    
    // Define initial series
    currentSeries.active.increment();
  }
  
  /**
   * MODIFIERS
   */
   // Admins Only
  modifier onlyAdmin {
    require(msg.sender == admin, "Only the admin can do this");
    _;
  }
  
  // Collective Members Only
  modifier collectiveMember {
    require(_collective[msg.sender].membership == true, 'User is not a member');
    _;
  }
  
  
  
  
  /**
   * EVENTS
   */
  event NftMinted(uint256 _tid, string _uri, uint256 _time, string _note);
  event NftStatus(string _status, uint256 _tid, string _uri, uint256 _time);
 
  
  
  /**
   * FUNCTIONS
   */
   
  /**
   * Mint an NFT
   * 
   * Only a member of the collective can mint
   * 
   */
  function mint(address to, uint256 tid, string calldata note) collectiveMember() external {
    _itemId.increment();
    _userOwnedTokens[msg.sender].push(tid);
    
    currentSeries.count.increment();
    
    if( currentSeries.count.current() > 5) {
        currentSeries.active.increment();
        currentSeries.count.reset();
    }
    
    userStoredAttributes[msg.sender].artist = 0;
    userStoredAttributes[msg.sender].hacker = 0;
    userStoredAttributes[msg.sender].hustler = 0;
    userStoredAttributes[msg.sender].success = 0;
    
    _safeMint(to, tid);
    
    string memory uri = tokenURI(tid);
    uint256 time = block.timestamp;
    
    emit NftMinted(tid, uri, time, note);
  }
  
  /**
   * Merge two(2) NFTs
   * 
   * Any holder of an NFT can Merge
   * 
   */
   function merge(address to, uint256 tid) external {
    _itemId.increment();
    _safeMint(to, tid);

    string memory uri = tokenURI(tid);
    uint256 time = block.timestamp;

    userStoredAttributes[msg.sender].artist = 0;
    userStoredAttributes[msg.sender].hacker = 0;
    userStoredAttributes[msg.sender].hustler = 0;
    userStoredAttributes[msg.sender].success = 0;
    
    emit NftStatus("merge", tid, uri, time);
  }
  

  /**
   * Burn an NFT
   * 
   * Any holder of an NFT can burn
   * 
   */
  function burn(uint256 tokenId, uint8 _artist, uint8 _hacker, uint8 _hustler, uint8 _success) onlyAdmin() public {
    userStoredAttributes[msg.sender].artist += _artist;
    userStoredAttributes[msg.sender].hacker += _hacker;
    userStoredAttributes[msg.sender].hustler += _hustler;
    userStoredAttributes[msg.sender].success += _success;
    uint256 time = block.timestamp;
    
    _burn(tokenId);
    
    emit NftStatus("burn", tokenId, "This token has been burned.", time);
  }
  
  /**
   * Add User to Collective
   * 
   * Admin can add a user to the collective
   * 
   */
  function addToCollective(address newMember, string calldata newMemberName) onlyAdmin() public {
    _collective[newMember].name = newMemberName;
    _collective[newMember].membership = true;
  }

  /**
   * Define the URI to use for storing the NFT JSON
   */
  function _baseURI() internal override pure returns (string memory) {
    return 'http://localhost:5000/nft/';
  }
  
  /**
   * Get a specific token owned by the User
   */
  function getToken(uint256 index) public view returns (uint256) {
    return _userOwnedTokens[msg.sender][index];
  }

  /**
   * Retrieve available attributes that may be applied as part of tehe Burn Bonus
   */
  function getAttributes() public view returns (Attributes memory) {
    return userStoredAttributes[msg.sender];
  }
  
  /**
   * Get status of the current series
   */
  function getSeriesInfo() public view returns (Series memory) {
    return currentSeries;
  }
  
}