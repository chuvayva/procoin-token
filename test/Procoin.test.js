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

  describe(`When considering pre-paid transfers,`, () => {
    beforeEach(async () => {
      await procoin.mintToken(alice, 1200, { from: owner });
    });

    describe(`if Charlie performs a transaction T, transfering 100 tokens from Alice to Bob (fee=10)`, () => {
      beforeEach(async () => {
        const nonce = 32;
        const from = alice;
        const to = bob;
        const delegate = charlie;
        const fee = 10;
        const amount = 100;
        const alicePrivateKey = Buffer.from('c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3', 'hex');

        const components = [
          formattedAddress(procoin.address),
          formattedAddress(to),
          formattedInt(amount),
          formattedInt(fee),
          formattedInt(nonce)
        ];
        const vrs = ethUtil.ecsign(hashedTightPacked(components), alicePrivateKey);
        const sig = ethUtil.toRpcSig(vrs.v, vrs.r, vrs.s);

        await procoin.transferPreSigned(
          sig,
          to,
          amount,
          fee,
          nonce,
          {from: delegate}
        );
      });

      describe(`it should:`, () => {
        it('decrements Alice balance of 1090', async () => {
          let balance = await procoin.balanceOf(alice);
          assert.equal(+balance, 1090);
        });
        it('increments Bob balance of 100', async () => {
          let balance = await procoin.balanceOf(bob);
          assert.equal(+balance, 100);
        });
        it('increments Charlie balance of 10', async () => {
          let balance = await procoin.balanceOf(charlie);
          assert.equal(+balance, 10);
        });
        it('fails if Damiens tries to replay the same transaction', async () => {
          const nonce = 32;
          const from = alice;
          const to = bob;
          const delegate = charlie;
          const fee = 10;
          const amount = 100;
          const alicePrivateKey = Buffer.from('c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3', 'hex');

          const components = [
            formattedAddress(procoin.address),
            formattedAddress(to),
            formattedInt(amount),
            formattedInt(fee),
            formattedInt(nonce)
          ];
          const vrs = ethUtil.ecsign(hashedTightPacked(components), alicePrivateKey);
          const sig = ethUtil.toRpcSig(vrs.v, vrs.r, vrs.s);
          const tx = procoin.transferPreSigned(
            sig,
            to,
            amount,
            fee,
            nonce,
            {from: charlie}
          );
          await assertRevert(tx);
        });
      });
    });
  });
})
