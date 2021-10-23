var StartupHeroCreator = artifacts.require("./StartupHeroCreator.sol");

module.exports = function (deployer) {
  deployer.deploy(StartupHeroCreator);
};
