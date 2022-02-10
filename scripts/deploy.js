const main = async () => {
    const StartupHeroCreatorContractFactory = await hre.ethers.getContractFactory("StartupHeroCreator");
    const StartupHeroCreatorContract = await StartupHeroCreatorContractFactory.deploy();
  
    await StartupHeroCreatorContract.deployed();
  
    console.log("StartupHeroCreator address: ", StartupHeroCreatorContract.address);
  };
  
  const runMain = async () => {
    try {
      await main();
      process.exit(0);
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  };
  
  runMain();