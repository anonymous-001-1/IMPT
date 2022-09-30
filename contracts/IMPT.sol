// SPDX-License-Identifier: MIT
pragma solidity 0.8.12;

import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";

import "./TwoStageOwnable.sol";

/**
 * @title Implementation ERC20 token
 */
contract IMPT is ERC20Burnable, TwoStageOwnable, Pausable, ERC20Permit {
    /**
     * @dev Creates a contract instance that allows approve, transfer token
     * @param name_ Name token
     * @param symbol_ Symbol token
     * @param owner_ Address contract owner
     * @param recipients_ Array addresses for mint token
     * @param amounts_ Array amounts for mint token
     */
    constructor(
        string memory name_,
        string memory symbol_,
        address owner_,
        address[] memory recipients_,
        uint256[] memory amounts_
    ) ERC20(name_, symbol_) ERC20Permit(name_) TwoStageOwnable(owner_) {
        require(recipients_.length == amounts_.length, "Invalid params length");
        require(recipients_.length <= 20, "Invalid recipients length");
        uint256 dec_ = 10**decimals();
        for (uint256 i = 0; i < recipients_.length; i++) {
            require(amounts_[i] > 0, "Amount is not positive");
            _mint(recipients_[i], amounts_[i] * dec_);
        }
    }

    /**
     * @notice pause the contract
     * @return boolean value indicating whether the operation succeeded
     */
    function pause() public onlyOwner returns (bool) {
        _pause();
        return true;
    }
    /**
     * @notice unpause the contract
     * @return boolean value indicating whether the operation succeeded
     */
    function unpause() public onlyOwner returns (bool) {
        _unpause();
        return true;
    }
    /**
     * @inheritdoc ERC20
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, amount);
    }
}
