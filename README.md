# Procoin Token
This is Ethereum cryptocurrency contracts based on [ERC20 Token Standard](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md).

## Token Structure

To make the contract upgradable we separate Logic and Storage like [here](https://gist.github.com/tjade273/69e3cb5dce1789738830). It splits the contract into _Procoin_ and _ProcoinDB_. To run them all you need:

- deploy ProcoinDB;
- deploy Procoin using ProcionDB address;
- add Procoin to ProcoinDB _owners_;

See [tests](test/Procoin.test.js#L30-L32) for example.

## Truffle
We use [Truffle](truffleframework.com) framework for developing and testing.

### Setup Truffle
```
npm install -g truffle
```

### Run Tests
Run tests:

```
truffle test
```


### Development
Setup temp blockchain and run console attached to it:

```
truffle development
```

Then run migrate command to create all smart contracts:

```
migrate
```

And finally you need to add Procoin to ProcoinDB _owners_.
```
ProcoinDB.at(<db address>).changeOwner(<procoin address>, true)
```

You can start using the contract from adding tokens to a user:
```
Procoin.at(<procoin address>).mintToken(<account address>, 10e+6)
```

Another option is to setup [Ganache App](http://truffleframework.com/ganache) and connect to it:
```
truffle console --network ganache
```

Also it's possible to connect to any network. See [truffle docs](http://truffleframework.com/docs/getting_started/client) for details.

## Deployment to Ropsten

[Ropsten](https://ropsten.etherscan.io) is one of the live test blockchain. You need an account with some ether and RPC Server url (check [Infura](https://infura.io)). To deploy from scratch:
```
DEPLOYMENT_PRIVATE_KEY=<private key> ETHEREUM_RPC_URL=<rpc server url> truffle migrate --network ropsten
```

It uses [Truffle HD Wallet Provider](https://github.com/rhlsthrm/truffle-hdwallet-provider-privkey) internally.

## Token Functions

First of all the token contract has all ERC20 Standard functions like tranfer, allow, transferFrom. See [ERC20](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md)


### Mint Tokens

Adding of new tokens to any account.

### Freeze Account

Blacklist of accounts who is restricted to transfer tokens.

### Pre Signed Transfer

Every transaction (tranfer) costs ether. But as a token holder I don't want to have two currencies (tokens and ether) to send Procoin. There is an Improvement Proposal [865](https://github.com/ethereum/EIPs/issues/865) to overcome this and one of the possible [solution](https://github.com/PROPSProject/props-token-distribution/blob/master/test/PropsToken.js#L85).

So every token holder can sign transfer params with his private key and save somewhere. And anybody who has ether is able to execute this signed _transaction_.

Sign process is implemented on the frontend side. See Procoin [Client](https://github.com/chuvayva/procoin)


