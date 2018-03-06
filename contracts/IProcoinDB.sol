pragma solidity ^0.4.16;

contract IProcoinDB {
    function balanceOf(address account) public view returns (uint256);
    function setBalance(address account, uint256 newBalance) public returns (bool);

    function allowance(address owner, address spender) public view returns (uint256);
    function approve(address owner, address spender, uint256 amount) public returns (bool);

    function changeOwner(address owner, bool permission) public returns(bool);
}
