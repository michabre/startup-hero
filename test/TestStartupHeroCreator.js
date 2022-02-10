const assert = require('chai').assert;

describe("StartupHeroCreator", function () {
  let contract;

  beforeEach(async () => {
    const StartupHeroCreator = await ethers.getContractFactory("StartupHeroCreator");
    contract = await StartupHeroCreator.deploy();
  });

  describe("Test StartupHeroCreator Contract", () => {
    it("contract has been deployed", async () => {
      await contract.deployed();
      testStartupHeroCreatorContract = contract.address; 
      return assert.isTrue(true);
    });
  });
  
});
