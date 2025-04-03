const { ethers } = require("hardhat");

async function main() {
  const contractAddress = "0x9C6930D56dF4F32aF6Bd870042D3b1faafd27535";
  const DataFetcher = await ethers.getContractAt("SushiswapDataFetcher", contractAddress);
  
  // Example: simulate converting 1 WETH (1e18 wei) to USDC.
  const amountIn = ethers.parseUnits("1", 18);
  const amountOut = await DataFetcher.getWethToUsdcAmountOut(amountIn);
  
  // Assuming USDC has 6 decimals:
  console.log("Estimated USDC output:", ethers.formatUnits(amountOut, 6));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Interaction failed:", error.message);
    process.exit(1);
  });
