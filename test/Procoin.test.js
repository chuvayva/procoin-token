import assertRevert from './helpers/assertRevert';
import ethUtil from 'ethereumjs-util'

const Procoin = artifacts.require("Procoin");
const ProcoinDB = artifacts.require("ProcoinDB");

const formattedAddress = (address) => {
  return  Buffer.from(ethUtil.stripHexPrefix(address), 'hex');
};
const formattedInt = (int) => {
  return ethUtil.setLengthLeft(int, 32);
};
const formattedBytes32 = (bytes) => {
  return ethUtil.addHexPrefix(bytes.toString('hex'));
};
const hashedTightPacked = (args) => {
  return ethUtil.sha3(Buffer.concat(args));
};

contract('Procoin methods', ([
  alice,
  bob,
  charlie,
  owner
]) => {
  let procoin;
  let procoinDB;

  beforeEach(async () => {
    procoinDB = await ProcoinDB.new({ from: owner });
    procoin = await Procoin.new(0, 'Procoin', 'pro', procoinDB.address, { from: owner });
    await procoinDB.changeOwner(procoin.address, true, { from: owner });
  });

  it("#mintToken", async () => {
    let amount = 3e+6;

    await procoin.mintToken(alice, amount, { from: owner });

    let balance = await procoin.balanceOf(alice);

    assert.equal(balance, amount);
  });

  it("#freezeAccount", async () => {
    await procoin.freezeAccount(bob, true, { from: owner });
    await assertRevert(procoin.transfer(alice, 123, { from: bob }));

    let balanceOne = await procoin.balanceOf(alice);
    let balanceTwo = await procoin.balanceOf(bob);

    assert.equal(balanceOne, 0);
    assert.equal(balanceTwo, 0);
  });
})
