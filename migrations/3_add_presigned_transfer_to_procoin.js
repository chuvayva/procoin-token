let redeployProcoin = require("./redeploy_procoin");

module.exports = function(deployer, network, accounts) {
  redeployProcoin(artifacts, deployer);
};

