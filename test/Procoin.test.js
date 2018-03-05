import assertRevert from './helpers/assertRevert';

const Procoin = artifacts.require("Procoin");

contract('Procoin methods', async (accounts) => {
  let procoin;
  let initBalanceOne;
  let initBalanceTwo;

  beforeEach(async function() {
    procoin = await Procoin.deployed();
    initBalanceOne = await procoin.balanceOf(accounts[0]);
    initBalanceTwo = await procoin.balanceOf(accounts[1]);
  });

  it("#mintToken", async () => {
    let amount = 3e+6;

    await procoin.mintToken(accounts[1], amount, { from: accounts[0] });

    let balanceOne = await procoin.balanceOf(accounts[0]);
    let balanceTwo = await procoin.balanceOf(accounts[1]);

    assert.equal(balanceOne - initBalanceOne, 0);
    assert.equal(balanceTwo - initBalanceTwo, amount);
  });

  it("#freezeAccount", async () => {
    let amount = 2e+6;

    await procoin.freezeAccount(accounts[1], true, { from: accounts[0] });
    await assertRevert(procoin.transfer(accounts[0], amount, { from: accounts[1] }));

    let balanceOne = await procoin.balanceOf(accounts[0]);
    let balanceTwo = await procoin.balanceOf(accounts[1]);

    assert.equal(+balanceOne, +initBalanceOne);
    assert.equal(+balanceTwo, +initBalanceTwo);
  });
})
