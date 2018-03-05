var Procoin = artifacts.require("./Procoin.sol");

module.exports = function(deployer) {
  deployer.deploy(Procoin, 10e+6, 'Procoin', 'pro');
};


