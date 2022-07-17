// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.15;

import "./interfaces/IERC165.sol";

contract ERC165 is IERC165 {
  mapping(bytes4 => bool) private _supportedInterfaces;

  constructor() {
    // function supportsInterface value: 0x01ffc9a7
    _registerInterface(bytes4(keccak256("supportsInterface(bytes4)")));
  }

  function supportsInterface(bytes4 interfaceId)
    external
    view
    override
    returns (bool)
  {
    return _supportedInterfaces[interfaceId];
  }

  function _registerInterface(bytes4 interfaceId) internal {
    require(interfaceId != 0xffffffff, "ERC165: interface ID invalid");
    _supportedInterfaces[interfaceId] = true;
  }
}
