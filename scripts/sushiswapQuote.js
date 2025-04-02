const { ethers } = require("hardhat");
require("dotenv").config();

// const provider = ethers.provider;
const provider = new ethers.JsonRpcProvider(process.env.BUILDBEAR_URL);

const sushiswapFactoryAddress = "0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac";

const factoryAbi = [
  "function getPair(address tokenA, address tokenB) external view returns (address pair)"
];

const pairAbi = [
  "function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
  "function token0() external view returns (address)",
  "function token1() external view returns (address)"
];

const wethAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const usdcAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

async function main() {
  const factory = new ethers.Contract(sushiswapFactoryAddress, factoryAbi, provider);

  const pairAddress = await factory.getPair(wethAddress, usdcAddress);
  if (pairAddress === ethers.ZeroAddress) {
    console.log("Pair not found for this token pair.");
    return;
  }
  console.log("Sushiswap pair address:", pairAddress);

  const pair = new ethers.Contract(pairAddress, pairAbi, provider);

  const [reserve0, reserve1] = await pair.getReserves();

  const token0 = await pair.token0();
  const token1 = await pair.token1();

  let reserveIn, reserveOut;
  if (token0.toLowerCase() === wethAddress.toLowerCase()) {
    reserveIn = reserve0;
    reserveOut = reserve1;
  } else if (token1.toLowerCase() === wethAddress.toLowerCase()) {
    reserveIn = reserve1;
    reserveOut = reserve0;
  } else {
    console.error("WETH not found in the pair");
    return;
  }

  const amountIn = ethers.parseUnits("1", 18);
  const amountInWithFee = amountIn * 997n / 1000n;
  const reserveInBigInt = BigInt(reserveIn.toString());
  const reserveOutBigInt = BigInt(reserveOut.toString());
  const amountOut = (amountInWithFee * reserveOutBigInt) / (reserveInBigInt + amountInWithFee);
  
  const formattedAmountOut = ethers.formatUnits(amountOut, 6);
  
  console.log(`Estimated output for 1 WETH → USDC on Sushiswap: ${formattedAmountOut} USDC`);
}

main().catch(console.error);