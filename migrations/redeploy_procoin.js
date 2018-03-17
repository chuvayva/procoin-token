function redeployProcoin(artifacts, deployer) {
  let Procoin = artifacts.require("./Procoin.sol");
  let ProcoinDB = artifacts.require("./ProcoinDB.sol");

  deployer.deploy(Procoin, 10e+6, 'Procoin', 'pro', ProcoinDB.address);
}

module.exports = redeployProcoin;
