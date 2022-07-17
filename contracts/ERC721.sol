// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.15;

import "./ERC165.sol";
import "./interfaces/IERC721.sol";

contract ERC721 is ERC165, IERC721 {
  // Mapping from token id to the owner
  mapping(uint256 => address) private _tokenOwner;
  // Mapping from owner to number of owned tokens
  mapping(address => uint256) private _ownedTokensCount;

  // Mapping from token id to approve addresses

  constructor() {
    // function supportsInterface value: 0x01ffc9a7
    _registerInterface(
      bytes4(
        keccak256("balanceOf(address)") ^
          keccak256("ownerOf(uint256d)") ^
          keccak256("transferFrom(address,address,uint256)") ^
          keccak256("approve(address,uint256)")
      )
    );
  }

  mapping(uint256 => address) private _tokenApprovals;

  function balanceOf(address _owner) public view returns (uint256) {
    require(_owner != address(0), "ERC721: invalid owner address");
    return _ownedTokensCount[_owner];
  }

  function ownerOf(uint256 _tokenId) public view returns (address) {
    address owner = _tokenOwner[_tokenId];
    require(owner != address(0), "ERC721: invalid token ID");
    return owner;
  }

  function transferFrom(
    address _from,
    address _to,
    uint256 _tokenId
  ) public payable {
    require(
      isApprovedOrOwner(msg.sender, _tokenId),
      "ERC721: caller is not approved"
    );
    require(_from != address(0), "ERC721: invalid address");
    require(_to != address(0), "ERC721: invalid address");
    require(ownerOf(_tokenId) == _from, "ERC721: caller is not owner");
    _tokenOwner[_tokenId] = _to;
    _ownedTokensCount[_from]--;
    _ownedTokensCount[_to]++;

    emit Transfer(_from, _to, _tokenId);
  }

  function _mint(address to, uint256 tokenId) internal virtual {
    require(to != address(0), "ERC721: invalid address");
    require(!_tokenExists(tokenId), "ERC721: token already minted");

    _tokenOwner[tokenId] = to;
    _ownedTokensCount[to]++;
    emit Transfer(address(0), to, tokenId);
  }

  function _tokenExists(uint256 tokenId) internal view returns (bool) {
    return _tokenOwner[tokenId] != address(0);
  }

  function approve(address _to, uint256 tokenId) public payable {
    address owner = ownerOf(tokenId);
    require(msg.sender == owner, "ERC721: caller is not owner");
    require(_to != owner, "ERC721: cannot approve to self");
    require(
      _tokenApprovals[tokenId] == address(0),
      "ERC721: token already approved"
    );
    _tokenApprovals[tokenId] = _to;
    emit Approval(owner, _to, tokenId);
  }

  function isApprovedOrOwner(address spender, uint256 tokenId)
    internal
    view
    returns (bool)
  {
    require(_tokenExists(tokenId), "ERC721: token does not exist");
    address owner = ownerOf(tokenId);
    return (spender == owner || _tokenApprovals[tokenId] == spender);
  }
}
