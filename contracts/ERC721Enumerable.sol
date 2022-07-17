// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.15;

import "./ERC721.sol";
import "./interfaces/IERC721Enumerable.sol";

contract ERC721Enumerable is ERC721, IERC721Enumerable {
  uint256[] private _allTokens;
  mapping(uint256 => uint256) private _allTokensIndex;
  mapping(address => uint256[]) private _ownedTokens;
  mapping(uint256 => uint256) private _ownedTokensIndex;

  constructor() {
    // function supportsInterface value: 0x01ffc9a7
    _registerInterface(
      bytes4(
        keccak256("totalSupply()") ^
          keccak256("tokenByIndex(uint256)") ^
          keccak256("tokenOfOwnerByIndex(address,uint256)")
      )
    );
  }

  function totalSupply() public view returns (uint256) {
    return _allTokens.length;
  }

  function tokenByIndex(uint256 index) public view returns (uint256) {
    require(index < totalSupply(), "ERC721: index out of range");
    return _allTokens[index];
  }

  function tokenOfOwnerByIndex(address owner, uint256 index)
    public
    view
    returns (uint256)
  {
    require(index < balanceOf(owner), "ERC721: index out of range");
    return _ownedTokens[owner][index];
  }

  function _mint(address to, uint256 _tokenId) internal override(ERC721) {
    super._mint(to, _tokenId);
    _addTokensToAllTokenEnumeration(_tokenId);
    _addTOkensToOwnerEnumeration(to, _tokenId);
  }

  function _addTokensToAllTokenEnumeration(uint256 tokenId) private {
    _allTokens.push(tokenId);
    _allTokensIndex[tokenId] = _allTokens.length - 1;
  }

  function _addTOkensToOwnerEnumeration(address to, uint256 tokenId) private {
    _ownedTokens[to].push(tokenId);
    _ownedTokensIndex[tokenId] = _ownedTokens[to].length - 1;
  }
}
