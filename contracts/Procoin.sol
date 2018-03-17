pragma solidity ^0.4.16;

import "./TokenERC20.sol";
import "./helpers/Owned.sol";

contract Procoin is Owned, TokenERC20 {

    mapping (address => bool) public frozenAccount;
    mapping(bytes => bool) signatures;

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
        if (_from == _to) { return; }
        require (_to != 0x0);                               // Prevent transfer to 0x0 address. Use burn() instead
        require(!frozenAccount[_from]);                     // Check if sender is frozen
        require(!frozenAccount[_to]);                       // Check if recipient is frozen

        uint balanceFrom = balanceOf(_from);
        uint balanceTo = balanceOf(_to);

        require(balanceFrom >= _value);                      // Check if the sender has enough

        db.setBalance(_from, balanceFrom.sub(_value));
        db.setBalance(_to, balanceTo.add(_value));

        Transfer(_from, _to, _value);
    }

    /// @notice Create `mintedAmount` tokens and send it to `target`
    /// @param target Address to receive the tokens
    /// @param mintedAmount the amount of tokens it will receive
    function mintToken(address target, uint256 mintedAmount) onlyOwner public {
        uint256 balance = db.balanceOf(target);

        db.setBalance(target, balance.add(mintedAmount));
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

    /**
     * @notice Submit a presigned transfer (from https://github.com/PROPSProject/props-token-distribution/blob/master/contracts/token/ERC865Token.sol)
     * @param _signature bytes The signature, issued by the owner.
     * @param _to address The address which you want to transfer to.
     * @param _value uint256 The amount of tokens to be transferred.
     * @param _fee uint256 The amount of tokens paid to msg.sender, by the owner.
     * @param _nonce uint256 Presigned transaction number.
     */
    function transferPreSigned(
        bytes _signature,
        address _to,
        uint256 _value,
        uint256 _fee,
        uint256 _nonce
    )
        public
        returns (bool)
    {
        require(_to != address(0));
        require(signatures[_signature] == false);

        bytes32 hashedTx = keccak256(address(this), _to, _value, _fee, _nonce);

        address from = recover(hashedTx, _signature);
        require(from != address(0));

        _transfer(from, _to, _value);
        _transfer(from, msg.sender, _fee);
        signatures[_signature] = true;

        return true;
    }

    /**
     * @notice Recover signer address from a message by using his signature
     * @param hash bytes32 message, the hash is the signed message. What is recovered is the signer address.
     * @param sig bytes signature, the signature is generated using web3.eth.sign()
     */
    function recover(bytes32 hash, bytes sig) internal pure returns (address) {
      bytes32 r;
      bytes32 s;
      uint8 v;

      //Check the signature length
      if (sig.length != 65) {
        return (address(0));
      }

      // Divide the signature in r, s and v variables
      assembly {
        r := mload(add(sig, 32))
        s := mload(add(sig, 64))
        v := byte(0, mload(add(sig, 96)))
      }

      // Version of signature should be 27 or 28, but 0 and 1 are also possible versions
      if (v < 27) {
        v += 27;
      }

      // If the version is correct return the signer address
      if (v != 27 && v != 28) {
        return (address(0));
      } else {
        return ecrecover(hash, v, r, s);
      }
    }

}


