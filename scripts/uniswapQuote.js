const { ethers } = require("hardhat");
require("dotenv").config();

const provider = new ethers.JsonRpcProvider(process.env.MAINNET_RPC_URL);

const quoterAddress = "0x61fFE014bA17989E743c5F6cB21bF9697530B21e";
const quoterAbi = [
  "function factory() view returns (address)",
  {
    "inputs": [
      {
        "components": [
          {"name":"tokenIn","type":"address"},
          {"name":"tokenOut","type":"address"},
          {"name":"amountIn","type":"uint256"},
          {"name":"fee","type":"uint24"},
          {"name":"sqrtPriceLimitX96","type":"uint160"}
        ],
        "name":"params",
        "type":"tuple"
      }
    ],
    "name":"quoteExactInputSingle",
    "outputs": [
      {"name":"amountOut","type":"uint256"},
      {"name":"sqrtPriceX96After","type":"uint160"},
      {"name":"initializedTicksCrossed","type":"uint32"},
      {"name":"gasEstimate","type":"uint256"}
    ],
    "stateMutability":"nonpayable",
    "type":"function"
  }
];

const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const USDC_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

async function main() {
  const block = await provider.getBlockNumber();
  console.log("Connected to mainnet. Current block:", block);

  const quoter = new ethers.Contract(quoterAddress, quoterAbi, provider);
  
  const params = {
    tokenIn: WETH_ADDRESS,
    tokenOut: USDC_ADDRESS,
    amountIn: ethers.parseUnits("1", 18), // 1 WETH
    fee: 3000, // 0.3% pool
    sqrtPriceLimitX96: 0
  };
  
  const quote = await quoter.quoteExactInputSingle.staticCall(params);
  console.log(`1 WETH = ${ethers.formatUnits(quote.amountOut, 6)} USDC`);
}

main().catch(console.error);
