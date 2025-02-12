// SPDX-License-Identifier: NONE
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "hardhat/console.sol";

contract LuckToken is ERC20("LuckToken", "LCK"), ERC20Burnable, Ownable {
    uint256 private cap = 5_000_000_000 * 10 ** uint256(18);

    constructor() {
        console.log("Owner: %s | maxCap: %s", msg.sender, cap);
        _mint(msg.sender, cap);
        transferOwnership(msg.sender);
    }

    function mint(address to, uint256 amount) public onlyOwner {
        require(ERC20.totalSupply() + amount <= cap, "LuckToken: can exceeded");
        _mint(to, amount);
    }
}
