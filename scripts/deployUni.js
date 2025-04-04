const hre = require("hardhat");
require("dotenv").config();

// Replace with the correct addresses for your network
const SEPOLIA_UNISWAP = "0xEd1f6473345F45b75F8179591dd5bA1888cf2FB3"; // Example address
const QUOTER = "0x61fFE014bA17989E743c5F6cB21bF9697530B21e"; // Replace with the actual quoter contract address

async function main() {
    // Get the contract factory for the DEX contract
    const DEX = await hre.ethers.getContractFactory("DEX");
    
    // Deploy the contract with the given parameters
    const dex = await DEX.deploy(SEPOLIA_UNISWAP, QUOTER);
    console.log("Deployment transaction sent. Waiting for confirmation...");
    await dex.waitForDeployment();

    console.log("DEX deployed to:", dex.target);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Deployment failed:", error);
        process.exit(1);
    });
