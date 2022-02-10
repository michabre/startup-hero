const main = async () => {
    const StartupHeroCreatorContractFactory = await hre.ethers.getContractFactory("StartupHeroCreator");
    const StartupHeroCreatorContract = await StartupHeroCreatorContractFactory.deploy();
    await StartupHeroCreatorContract.deployed();
    console.log("Contract address:", StartupHeroCreatorContract.address);
  
    let contractBalance = await hre.ethers.provider.getBalance(
        StartupHeroCreatorContract.address
    );
    console.log(
      "Contract balance:",
      hre.ethers.utils.formatEther(contractBalance)
    );
  };
  
  const runMain = async () => {
    try {
      await main();
      process.exit(0);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  };
  
  runMain();