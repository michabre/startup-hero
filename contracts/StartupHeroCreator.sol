// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/utils/Counters.sol';

contract StartupHeroCreator is ERC721 {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;
    
  mapping(address => uint256[]) private userOwnedTokens;
  address public admin;

  constructor() ERC721('Startup Hero', 'SUP') {
    admin = msg.sender;
  }

  function mint(address to) external {
    require(msg.sender == admin, 'only admin');
    _tokenIds.increment();
    uint256 newItemId = _tokenIds.current();
    userOwnedTokens[msg.sender].push(newItemId);
    _safeMint(to, newItemId);
  }
  
  function _baseURI() internal override pure returns (string memory) {
    return 'https://nftplace.com/';
  }
  
  function getToken(uint256 index) public view returns (uint256) {
      return userOwnedTokens[msg.sender][index];
  }
}