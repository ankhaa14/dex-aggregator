const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const balance = await deployer.provider.getBalance(deployer.address);
  if (balance < (ethers.parseEther("0.01"))) {
    throw new Error("Insufficient balance for deployment");
  }
  console.log("Deployer balance:", ethers.formatEther(balance));

  const sushiswapFactoryAddress = "0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac";
  const wethAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
  const usdcAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

  try {
    ethers.getAddress(sushiswapFactoryAddress);
  } catch (error) {
    throw new Error("Invalid Sushiswap Factory address");
  }
  try {
    ethers.getAddress(wethAddress);
  } catch (error) {
    throw new Error("Invalid WETH address");
  }
  try {
    ethers.getAddress(usdcAddress);
  } catch (error) {
    throw new Error("Invalid USDC address");
  }

  const DataFetcher = await ethers.getContractFactory("SushiswapDataFetcher");

  const dataFetcher = await DataFetcher.deploy(
    sushiswapFactoryAddress,
    wethAddress,
    usdcAddress
  );

  console.log("Deployment transaction sent. Waiting for confirmation...");
  await dataFetcher.waitForDeployment();

  console.log("SushiswapDataFetcher deployed to:", await dataFetcher.getAddress());
  const postDeployBalance = await deployer.provider.getBalance(deployer.address);
  console.log("Deployer balance after deployment:", ethers.formatEther(postDeployBalance));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error.message);
    process.exit(1);
  });
