const { ethers } = require("hardhat");

async function main() {
  const contractAddress = "0x138A2e27FcE83f0E86ea126360be44A41867Cb7b";
  const DataFetcher = await ethers.getContractAt("SushiswapDataFetcher", contractAddress);

  const amountIn = ethers.parseUnits("1", 18);
  const amountOut = await DataFetcher.getWethToUsdcAmountOut(amountIn);
  console.log("Estimated USDC output for 1 WETH:", ethers.formatUnits(amountOut, 6));

  const reserves = await DataFetcher.getPoolReserves();
  const reserveWETH = reserves[0];
  const reserveUSDC = reserves[1];
  
  console.log("Pool Reserves:");
  console.log("WETH Reserve:", ethers.formatUnits(reserveWETH, 18));
  console.log("USDC Reserve:", ethers.formatUnits(reserveUSDC, 6));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Interaction failed:", error.message);
    process.exit(1);
  });

