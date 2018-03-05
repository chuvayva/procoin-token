import assertRevert from './helpers/assertRevert';

const Procoin = artifacts.require("Procoin");

contract('TokenERC20 methods', async (accounts) => {
  let procoin;
  let initBalanceOne;
  let initBalanceTwo;

  beforeEach(async function() {
    procoin = await Procoin.deployed();
    initBalanceOne = await procoin.balanceOf(accounts[0]);
    initBalanceTwo = await procoin.balanceOf(accounts[1]);
  });

  it("#totalSupply", async () => {
    let totalSupply = await procoin.totalSupply();

    assert.equal(totalSupply, 10e+6);
  });

  it("#balance_of", async () => {
    let balance = await procoin.balanceOf(accounts[0]);

    assert.equal(balance, 10e+6);
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
