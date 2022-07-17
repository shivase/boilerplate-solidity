// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.15;

library SafeMath {
  function mul(uint256 a, uint256 b) internal pure returns (uint256) {
    uint256 c = a * b;
    require(c / b == a, "SafeMath: multiplation overflow");
    return c;
  }

  function div(uint256 a, uint256 b) internal pure returns (uint256) {
    require(b > 0, "SafeMath: division by zero");
    uint256 c = a / b;
    require(a == b * c + (a % b), "SafeMath: division overflow");
    return c;
  }

  function sub(uint256 a, uint256 b) internal pure returns (uint256) {
    require(b <= a, "SafeMath: subtraction overflow");
    return a - b;
  }

  function add(uint256 a, uint256 b) internal pure returns (uint256) {
    uint256 c = a + b;
    require(c >= a, "SafeMath: addition overflow");
    return c;
  }

  function exp(uint256 a, uint256 b) internal pure returns (uint256) {
    uint256 c = 1;
    for (uint256 i = 0; i < b; i++) {
      c = mul(c, a);
    }
    return c;
  }

  function pow(uint256 a, uint256 b) internal pure returns (uint256) {
    uint256 c = 1;
    for (uint256 i = 0; i < b; i++) {
      c = mul(c, a);
    }
    return c;
  }

  function factorial(uint256 a) internal pure returns (uint256) {
    uint256 c = 1;
    for (uint256 i = 1; i <= a; i++) {
      c = mul(c, i);
    }
    return c;
  }

  function mod(uint256 a, uint256 b) internal pure returns (uint256) {
    require(b != 0, "SafeMath: modulo by zero");
    return a % b;
  }

  function isEven(uint256 a) internal pure returns (bool) {
    return mod(a, 2) == 0;
  }

  function isOdd(uint256 a) internal pure returns (bool) {
    return mod(a, 2) != 0;
  }
}
