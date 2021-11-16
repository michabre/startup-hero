// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/utils/Counters.sol';

// kept for testing in Remix
// import 'https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol';
// import 'https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/Counters.sol';



contract StartupHeroCreator is ERC721 {
  using Counters for Counters.Counter;
  Counters.Counter private _indexNumber;
 
  /**
   * Global State Variables
   */
  address public admin;
  uint256 public totalSupply;
  Counters.Counter public currentSupply;
  
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
    totalSupply = 10000;
    
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
    require(msg.sender == admin, "Only the admin can do this.");
    _;
  }
  
  // Collective Members Only
  modifier collectiveMember {
    require(_collective[msg.sender].membership == true, 'User is not a member.');
    _;
  }
  
  // total supply reached
  modifier totalSupplyReached {
    require(currentSupply < totalSupply, 'Total Supply has been reached.');
    _;
  }
  
  
  
  
  /**
   * EVENTS
   */
  event NftMinted(uint256 _tid, uint256 _current, string _uri, uint256 _time, bytes32 _note);
  event NftStatus(string _status, uint256 _tid, uint256 _current, string _uri, uint256 _time, bytes32 _note);
 
  
  
  /**
   * FUNCTIONS
   */
   
  /**
   * Mint an NFT
   * 
   * Only a member of the collective can mint
   * 
   */
  function mint(address to, uint256 tid) totalSupplyReached() external {
    _indexNumber.increment();
    uint256 current = _indexNumber.current();
    _userOwnedTokens[msg.sender].push(tid);
    
    currentSeries.count.increment();
    
    if( currentSeries.count.current() > 5) {
        // increase to next series level
        currentSeries.active.increment();
        // reset minted NFT count
        currentSeries.count.reset();
    }
    
    userStoredAttributes[msg.sender].artist = 0;
    userStoredAttributes[msg.sender].hacker = 0;
    userStoredAttributes[msg.sender].hustler = 0;
    userStoredAttributes[msg.sender].success = 0;

        
    currentSupply.increment();    
    _safeMint(to, tid);
    
    string memory uri = tokenURI(tid);
    uint256 time = block.timestamp;
    bytes32 note = "NFT has been minted.";
    
    emit NftMinted(tid, current, uri, time, note);
  }
  
  /**
   * Merge two(2) NFTs
   * 
   * Any holder of an NFT can Merge
   * 
   */
   function merge(address to, uint256 tid) external {
    _indexNumber.increment();
    _safeMint(to, tid);

    string memory uri = tokenURI(tid);
    uint256 time = block.timestamp;
    uint256 current = _indexNumber.current();
    bytes32 note = "Merging has completed.";

    userStoredAttributes[msg.sender].artist = 0;
    userStoredAttributes[msg.sender].hacker = 0;
    userStoredAttributes[msg.sender].hustler = 0;
    userStoredAttributes[msg.sender].success = 0;
    
    emit NftStatus("merge", tid, current, uri, time, note);
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
    uint256 current = _indexNumber.current();
    bytes32 note = "This token has been burned.";
    
    _burn(tokenId);
    
    emit NftStatus("burn", tokenId, current, "", time, note);
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
  
  
}