pragma solidity ^0.4.16;

import "./TokenERC20.sol";
import "./Owned.sol";

contract Procoin is Owned, TokenERC20 {

    mapping (address => bool) public frozenAccount;

    /* This generates a public event on the blockchain that will notify clients */
    event FrozenFunds(address target, bool frozen);

    /* Initializes contract with initial supply tokens to the creator of the contract */
    function Procoin(
        uint256 initialSupply,
        string tokenName,
        string tokenSymbol,
        address procoinDB
    ) TokenERC20(initialSupply, tokenName, tokenSymbol, procoinDB) public {}

    /* Internal transfer, only can be called by this contract */
    function _transfer(address _from, address _to, uint _value) internal {
        require (_to != 0x0);                               // Prevent transfer to 0x0 address. Use burn() instead
        require(!frozenAccount[_from]);                     // Check if sender is frozen
        require(!frozenAccount[_to]);                       // Check if recipient is frozen

        uint balanceFrom = balanceOf(_from);
        uint balanceTo = balanceOf(_to);

        require(balanceFrom >= _value);                      // Check if the sender has enough
        require(balanceTo + _value > balanceTo );            // Check for overflows

        db.setBalance(_from, balanceFrom - _value);
        db.setBalance(_to, balanceTo + _value);

        Transfer(_from, _to, _value);
    }

    /// @notice Create `mintedAmount` tokens and send it to `target`
    /// @param target Address to receive the tokens
    /// @param mintedAmount the amount of tokens it will receive
    function mintToken(address target, uint256 mintedAmount) onlyOwner public {
        uint256 balance = db.balanceOf(target);
        db.setBalance(target, balance + mintedAmount);

        totalSupply += mintedAmount;
        Transfer(0, this, mintedAmount);
        Transfer(this, target, mintedAmount);
    }

    /// @notice `freeze? Prevent | Allow` `target` from sending & receiving tokens
    /// @param target Address to be frozen
    /// @param freeze either to freeze it or not
    function freezeAccount(address target, bool freeze) onlyOwner public {
        frozenAccount[target] = freeze;
        FrozenFunds(target, freeze);
    }

    function kill() public onlyOwner {
        selfdestruct(msg.sender);
    }
}


