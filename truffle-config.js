require('babel-register');
require('babel-polyfill');
require('dotenv');

const HDWalletProvider = require("truffle-hdwallet-provider-privkey");
const privKey = process.env["DEPLOYMENT_PRIVATE_KEY"];
const infuraUrl = process.env["ETHEREUM_RPC_URL"];

module.exports = {
  networks: {
    ganache: {
      host: 'localhost',
      port: 7545,
      network_id: '*',
      gasPrice: 10000000000
    },
    ropsten: {
      provider: () => {
        return new HDWalletProvider(privKey, infuraUrl)
      },
      gas: 3000000,
      gasPrice: 10000000000,
      network_id: 3
    }
  }
};
