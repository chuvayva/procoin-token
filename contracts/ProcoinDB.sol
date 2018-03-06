pragma solidity ^0.4.16;

contract ProcoinDB {
    mapping (address => uint256) public balanceOf;
    mapping (address => mapping (address => uint256)) public allowance;
    mapping(address => bool) _owners;

    function ProcoinDB() public {
        _owners[msg.sender] = true;
    }

    function setBalance(address account, uint newBalance) public returns (bool) {
        if(_owners[msg.sender]) {
            balanceOf[account] = newBalance;
            return true;
        }

        return false;
    }

    function approve(address owner, address spender, uint256 amount) public returns (bool) {
        if(_owners[msg.sender]) {
            allowance[owner][spender] = amount;
            return true;
        }

        return false;
    }

    function changeOwner(address owner, bool permission) public returns(bool) {
        if(_owners[msg.sender]) {
            _owners[owner] = permission;
            return true;
        }

        return false;
    }
}

