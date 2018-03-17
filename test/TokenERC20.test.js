import assertRevert from './helpers/assertRevert';

let Procoin = artifacts.require("Procoin");
let ProcoinDB = artifacts.require("ProcoinDB");

contract('TokenERC20 methods', async ([
  alice,
  bob,
  charlie,
  owner
]) => {
  let procoin;
  let procoinDB;
  const totalSupply = 100;

  beforeEach(async () => {
    procoinDB = await ProcoinDB.new({ from: owner });
    procoin = await Procoin.new(0, 'Procoin', 'pro', procoinDB.address, { from: owner });

    await procoinDB.changeOwner(procoin.address, true, { from: owner });
    await procoin.mintToken(alice, totalSupply, { from: owner });
  });

  it("#totalSupply", async () => {
    let supply = await procoin.totalSupply();

    assert.equal(supply, totalSupply);
  });

  it("#balanceOf", async () => {
    let balance = await procoin.balanceOf(alice);

    assert.equal(+balance, totalSupply);
  });

  it("#transfer", async () => {
    let amount = 30;

    await procoin.transfer(bob, amount, { from: alice });

    let balanceAlice = await procoin.balanceOf(alice);
    let balanceBob = await procoin.balanceOf(bob);

    assert.equal(balanceAlice, 70);
    assert.equal(balanceBob, 30);
  });

  it("#transferFrom", async () => {
    let amount = 40;

    await assertRevert(procoin.transferFrom(alice, bob, amount, { from: bob }));

    await procoin.approve(bob, amount, { from: alice });
    await procoin.transferFrom(alice, bob, amount, { from: bob });

    let balanceAlice = await procoin.balanceOf(alice);
    let balanceBob = await procoin.balanceOf(bob);

    assert.equal(balanceAlice, 60);
    assert.equal(balanceBob, 40);
  });
})
