// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
contract Test {
    uint256 counter = 5;
    function increment() public {  
        counter++;
    }
    function decrement() public { 
        counter--;
    }
}