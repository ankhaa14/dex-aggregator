const { ethers } = require("hardhat");
require("dotenv").config();

// Use mainnet provider from your environment (or Hardhat's provider if running via npx hardhat run)
const provider = new ethers.JsonRpcProvider(process.env.MAINNET_RPC_URL);

/* ------------------ Uniswap Quote ------------------ */

// Uniswap V3 Quoter contract (Mainnet)
const uniswapQuoterAddress = "0x61fFE014bA17989E743c5F6cB21bF9697530B21e";
const uniswapQuoterAbi = [
  "function factory() view returns (address)",
  {
    "inputs": [
      {
        "components": [
          { "name": "tokenIn", "type": "address" },
          { "name": "tokenOut", "type": "address" },
          { "name": "amountIn", "type": "uint256" },
          { "name": "fee", "type": "uint24" },
          { "name": "sqrtPriceLimitX96", "type": "uint160" }
        ],
        "name": "params",
        "type": "tuple"
      }
    ],
    "name": "quoteExactInputSingle",
    "outputs": [
      { "name": "amountOut", "type": "uint256" },
      { "name": "sqrtPriceX96After", "type": "uint160" },
      { "name": "initializedTicksCrossed", "type": "uint32" },
      { "name": "gasEstimate", "type": "uint256" }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// Mainnet token addresses (checksummed)
const wethAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const usdcAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

async function getUniswapQuote() {
  try {
    console.log("Fetching Uniswap quote...");
    const quoter = new ethers.Contract(uniswapQuoterAddress, uniswapQuoterAbi, provider);
    const params = {
      tokenIn: wethAddress,
      tokenOut: usdcAddress,
      amountIn: ethers.parseUnits("1", 18), // 1 WETH
      fee: 3000, // 0.3% fee tier
      sqrtPriceLimitX96: 0
    };

    // Use callStatic to simulate the transaction
    const quote = await quoter.quoteExactInputSingle.staticCall(params);
    const formatted = ethers.formatUnits(quote.amountOut, 6);
    console.log(`Uniswap: 1 WETH = ${formatted} USDC`);
    return formatted;
  } catch (error) {
    console.error("Error fetching Uniswap quote:", error);
    return null;
  }
}

/* ------------------ Sushiswap Quote ------------------ */

// Sushiswap Factory address on mainnet
const sushiswapFactoryAddress = "0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac";

// Minimal ABI for the Sushiswap Factory
const factoryAbi = [
  "function getPair(address tokenA, address tokenB) external view returns (address pair)"
];

// Minimal ABI for a Uniswap V2 style Pair contract
const pairAbi = [
  "function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
  "function token0() external view returns (address)",
  "function token1() external view returns (address)"
];

async function getSushiswapQuote() {
  try {
    console.log("Fetching Sushiswap quote...");
    const factory = new ethers.Contract(sushiswapFactoryAddress, factoryAbi, provider);
    const pairAddress = await factory.getPair(WETH_ADDRESS, USDC_ADDRESS);
    if (pairAddress === ethers.ZeroAddress) {
      console.log("Sushiswap pair not found for WETH/USDC.");
      return null;
    }
    console.log("Sushiswap pair address:", pairAddress);

    const pair = new ethers.Contract(pairAddress, pairAbi, provider);
    const [reserve0, reserve1] = await pair.getReserves();
    const token0 = await pair.token0();
    const token1 = await pair.token1();

    let reserveIn, reserveOut;
    // Assume we're swapping WETH for USDC.
    if (token0.toLowerCase() === WETH_ADDRESS.toLowerCase()) {
      reserveIn = reserve0;
      reserveOut = reserve1;
    } else if (token1.toLowerCase() === WETH_ADDRESS.toLowerCase()) {
      reserveIn = reserve1;
      reserveOut = reserve0;
    } else {
      console.error("WETH not found in the pair");
      return null;
    }

    // Use the Uniswap V2 formula with a 0.3% fee: multiplier is 997/1000.
    const amountIn = ethers.parseUnits("1", 18);
    const amountInBigInt = BigInt(amountIn.toString());
    const reserveInBigInt = BigInt(reserveIn.toString());
    const reserveOutBigInt = BigInt(reserveOut.toString());
    const amountOutBigInt = (amountInBigInt * 997n * reserveOutBigInt) / (reserveInBigInt * 1000n + amountInBigInt * 997n);
    const formatted = ethers.formatUnits(amountOutBigInt, 6);
    console.log(`Sushiswap: 1 WETH = ${formatted} USDC`);
    return formatted;
  } catch (error) {
    console.error("Error fetching Sushiswap quote:", error);
    return null;
  }
}

/* ------------------ Main Aggregator ------------------ */

async function main() {
  // Verify connection (optional)
  const block = await provider.getBlockNumber();
  console.log("Connected to mainnet. Current block:", block);

  const uniQuote = await getUniswapQuote();
  const sushiQuote = await getSushiswapQuote();

  console.log("\nSummary:");
  console.log(`Uniswap Quote: 1 WETH = ${uniQuote} USDC`);
  console.log(`Sushiswap Quote: 1 WETH = ${sushiQuote} USDC`);
}

main().catch(console.error);
