import assertRevert from './helpers/assertRevert';

let Procoin = artifacts.require("Procoin");
let ProcoinDB = artifacts.require("ProcoinDB");

contract('TokenERC20 methods', async (accounts) => {
  let procoin;
  let procoinDB;
  let initBalanceOne;
  let initBalanceTwo;

  before(async () => {
    procoin = await Procoin.deployed();
    procoinDB = await ProcoinDB.deployed();
    let totalSupply = await procoin.totalSupply();

    await procoinDB.changeOwner(procoin.address, true, { from: accounts[0] });
    await procoinDB.setBalance(accounts[0], totalSupply);
  });

  beforeEach(async () => {
    initBalanceOne = await procoin.balanceOf(accounts[0]);
    initBalanceTwo = await procoin.balanceOf(accounts[1]);
  });

  it("#totalSupply", async () => {
    let totalSupply = await procoin.totalSupply();

    assert.equal(totalSupply, 10e+6);
  });

  it("#balanceOf", async () => {
    let balance = await procoin.balanceOf(accounts[0]);

    assert.equal(+balance, 10e+6);
  });

  it("#transfer", async () => {
    let amount = 5e+6;

    await procoin.transfer(accounts[1], amount, { from: accounts[0] });

    let balanceOne = await procoin.balanceOf(accounts[0]);
    let balanceTwo = await procoin.balanceOf(accounts[1]);

    assert.equal(balanceOne - initBalanceOne, -amount);
    assert.equal(balanceTwo - initBalanceTwo, amount);
  });

  it("#transferFrom", async () => {
    let amount = 1e+6;

    await assertRevert(procoin.transferFrom(accounts[1], accounts[0], amount, { from: accounts[0] }));

    await procoin.approve(accounts[0], amount, { from: accounts[1] });
    await procoin.transferFrom(accounts[1], accounts[0], amount, { from: accounts[0] });

    let balanceOne = await procoin.balanceOf(accounts[0]);
    let balanceTwo = await procoin.balanceOf(accounts[1]);

    assert.equal(balanceOne - initBalanceOne, amount);
    assert.equal(balanceTwo - initBalanceTwo, -amount);
  });
})
