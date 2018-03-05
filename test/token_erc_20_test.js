const Procoin = artifacts.require("Procoin");

contract('TokenERC20 methods', async (accounts) => {
  let procoin;
  let initBalanceOne;
  let initBalanceTwo;

  beforeEach(async function() {
    procoin = await Procoin.deployed();
    initBalanceOne = await procoin.balanceOf.call(accounts[0]);
    initBalanceTwo = await procoin.balanceOf.call(accounts[1]);
  });

  it("#totalSupply", async () => {
    let totalSupply = await procoin.totalSupply();

    assert.equal(totalSupply.toNumber(), 10e+6);
  });

  it("#balance_of", async () => {
    let balance = await procoin.balanceOf.call(accounts[0]);

    assert.equal(balance.toNumber(), 10e+6);
  });

  it("#transfer", async () => {
    let amount = 5e+6;

    await procoin.transfer(accounts[1], amount, { from: accounts[0] });

    let balanceOne = await procoin.balanceOf.call(accounts[0]);
    let balanceTwo = await procoin.balanceOf.call(accounts[1]);

    assert.equal(balanceOne.toNumber() - initBalanceOne, -amount);
    assert.equal(balanceTwo.toNumber() - initBalanceTwo, amount);
  });
})
