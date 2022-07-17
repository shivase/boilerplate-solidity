// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.15;
import "hardhat-deploy/solc_0.8/proxy/Proxied.sol";
import "./ERC721Connector.sol";

contract KryptoBird is Proxied, ERC721Connector {
  string internal _prefix;
  string[] public kryptoBirdz;

  mapping(string => bool) private _kryptoBirdzExists;

  constructor(string memory prefix) ERC721Connector("KryptoBird", "KBIRDZ") {
    postUpgrade(prefix);
  }

  function mint(string memory _kryptoBird) public {
    require(!_kryptoBirdzExists[_kryptoBird], "KryptoBird already exists");
    kryptoBirdz.push(_kryptoBird);
    uint256 _id = uint256(kryptoBirdz.length) - 1;

    _mint(msg.sender, _id);
    _kryptoBirdzExists[_kryptoBird] = true;
  }

  function postUpgrade(string memory prefix) public proxied {
    _prefix = prefix;
  }
}
