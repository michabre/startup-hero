// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/utils/Counters.sol';

contract StartupHeroCreator is ERC721 {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  struct attributes {
    uint8 artist;
    uint8 hacker;
    uint8 hustler;
    uint8 success;
  }
  mapping(address => attributes) public userStoredAttributes;
    
  mapping(address => uint256[]) private userOwnedTokens;
  address public admin;

  constructor() ERC721('Startup Hero', 'SUP') {
    admin = msg.sender;
  }

  function mint(address to) onlyAdmin() external {
    _tokenIds.increment();
    uint256 newItemId = _tokenIds.current();
    userOwnedTokens[msg.sender].push(newItemId);
    _safeMint(to, newItemId);

    string memory uri = tokenURI(newItemId);
    uint256 time = block.timestamp;
    
    emit NftMinted(newItemId, uri, time);
  }



  /**
   * Merging 2 NFTs together creates a new one and sends
   * The NFTs used in the process are sent back to the Contract
  */
  // function merge(address to, uint256 tid_1, uint256 tid_2) onlyAdmin() external {
  //   _tokenIds.increment();
  //   uint256 newItemId = _tokenIds.current();
  //   userOwnedTokens[msg.sender].push(newItemId);
  //   _safeMint(to, newItemId);

  //   string memory uri = tokenURI(newItemId);
  //   uint256 time = block.timestamp;

  //   // Burn tokens used in merge
  //   burn(tid_1);
  //   burn(tid_2);
    
  //   emit NftMinted(newItemId, uri, time);
  // }

  function burn(uint256 tokenId, uint8 _artist, uint8 _hacker, uint8 _hustler, uint8 _success) onlyAdmin() public {
    userStoredAttributes[msg.sender].artist += _artist;
    userStoredAttributes[msg.sender].hacker += _hacker;
    userStoredAttributes[msg.sender].hustler += _hustler;
    userStoredAttributes[msg.sender].success += _success + 1;
    _burn(tokenId);
  }

  function _baseURI() internal override pure returns (string memory) {
    return 'http://localhost:5000/nft/';
  }
  
  function getToken(uint256 index) public view returns (uint256) {
      return userOwnedTokens[msg.sender][index];
  }

  modifier onlyAdmin {
      require(msg.sender == admin, "Only the admin can do this");
      _;
  }

  event NftMinted(uint256 _tid, string _uri, uint256 _time);
}