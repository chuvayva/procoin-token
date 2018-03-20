let Procoin = artifacts.require("./Procoin.sol");
let ProcoinDB = artifacts.require("./ProcoinDB.sol");

module.exports = function(deployer, network, accounts) {
  deployer.deploy(ProcoinDB).then(function() {
    return deployer.deploy(Procoin, 0, 'Procoin', 'pro', ProcoinDB.address);
  });
};


