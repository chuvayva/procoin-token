pragma solidity ^0.4.16;

import "./IProcoinDB.sol";

contract TokenERC20 {
    // Public variables of the token
    string public name;
    string public symbol;
    uint8 public decimals = 0;
    uint256 public totalSupply;

    IProcoinDB internal db;

    // This generates a public event on the blockchain that will notify clients
    event Transfer(address indexed from, address indexed to, uint256 value);

    event Approval(address indexed _owner, address indexed _spender, uint256 _value);
    /**
     * Constrctor function
     *
     * Initializes contract with initial supply tokens to the creator of the contract
     */
    function TokenERC20(
        uint256 initialSupply,
        string tokenName,
        string tokenSymbol,
        address procoinDB
    ) public {
        db = IProcoinDB(procoinDB);

        totalSupply = initialSupply * 10 ** uint256(decimals);       // It's "totalSupply = initialSupply" in our case
        name = tokenName;                                   // Set the name for display purposes
        symbol = tokenSymbol;                               // Set the symbol for display purposes
    }

    /**
     * Internal transfer, only can be called by this contract
     */
    function _transfer(address _from, address _to, uint _value) internal {
        // Prevent transfer to 0x0 address
        require(_to != 0x0);

        uint balanceFrom = balanceOf(_from);
        uint balanceTo = balanceOf(_to);

        // Check if the sender has enough
        require(balanceFrom >= _value);
        // Check for overflows
        require(balanceTo + _value > balanceTo );
        // Save this for an assertion in the future
        uint previousBalances = balanceFrom + balanceTo;

        db.setBalance(_from, balanceFrom - _value);
        db.setBalance(_to, balanceTo + _value);
        Transfer(_from, _to, _value);
        // Asserts are used to use static analysis to find bugs in your code. They should never fail
        balanceFrom = db.balanceOf(_from);
        balanceTo = db.balanceOf(_to);

        assert(balanceFrom + balanceTo == previousBalances);
    }

    /**
     * Transfer tokens
     *
     * Send `_value` tokens to `_to` from your account
     *
     * @param _to The address of the recipient
     * @param _value the amount to send
     */
    function transfer(address _to, uint256 _value) public {
        _transfer(msg.sender, _to, _value);
    }

    /**
     * Transfer tokens from other address
     *
     * Send `_value` tokens to `_to` in behalf of `_from`
     *
     * @param _from The address of the sender
     * @param _to The address of the recipient
     * @param _value the amount to send
     */
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        uint256 allowance = db.allowance(_from, msg.sender);
        require(_value <= allowance);     // Check allowance
        db.approve(_from, msg.sender, allowance - _value);
        _transfer(_from, _to, _value);
        return true;
    }

    /**
     * Set allowance for other address
     *
     * Allows `_spender` to spend no more than `_value` tokens in your behalf
     *
     * @param _spender The address authorized to spend
     * @param _value the max amount they can spend
     */
    function approve(address _spender, uint256 _value) public
        returns (bool success) {
        db.approve(msg.sender, _spender, _value);
        Approval(msg.sender, _spender, _value);

        return true;
    }

    function allowance(address owner, address spender) public view returns (uint256) {
      return db.allowance(owner, spender);
    }

    function balanceOf(address account) public view returns(uint256) {
      return db.balanceOf(account);
    }

    function update(address newContract) public {
        db.changeOwner(newContract, true); // Give new contract write permissions
        db.changeOwner(this, false); // Revokes it's own permissions
    }
}

