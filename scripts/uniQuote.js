const { ethers } = require("hardhat");

async function main() {
    const dexAddress = "0x27029b4D3f2436Cd5e5eBae0411C6E44C34af903";
    const ethAddress = "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14";
    const usdcAddress = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238";

    const dexAbi = [
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_uniPool",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "_quoter",
                    "type": "address"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "tokenIn",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "tokenOut",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "amountIn",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "amountOut",
                    "type": "uint256"
                }
            ],
            "name": "Quote",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "uint32",
                    "name": "secondsAgo",
                    "type": "uint32"
                },
                {
                    "internalType": "uint128",
                    "name": "amount",
                    "type": "uint128"
                },
                {
                    "internalType": "bool",
                    "name": "swap",
                    "type": "bool"
                }
            ],
            "name": "getQuoteUni",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "amountIn",
                    "type": "uint256"
                },
                {
                    "internalType": "address",
                    "name": "tokenIn",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "tokenOut",
                    "type": "address"
                },
                {
                    "internalType": "uint24",
                    "name": "fee",
                    "type": "uint24"
                }
            ],
            "name": "getQuoteWETH",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "quoter",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "uniPool",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ];

    const dex = new ethers.Contract(dexAddress, dexAbi, ethers.provider);

    const fee = 3000; // 0.3% fee (3000 represents 0.3% in Uniswap V3)
    const amountIn = ethers.parseUnits("1", 18); // 1 WETH

    try {
        // Use callStatic with the fully qualified function signature
        const quoteWETH = await dex.callStatic["getQuoteWETH(uint256,address,address,uint24)"](amountIn, ethAddress, usdcAddress, fee);
        console.log("getQuoteWETH output for 1 WETH → USDC:", ethers.formatUnits(quoteWETH, 6), "USDC");

        // For getQuoteUni, since it's a view function, you can call it directly via callStatic
        const quoteUni = await dex.callStatic.getQuoteUni(30, amountIn, true);
        console.log("getQuoteUni output for 1 WETH → USDC (30 seconds ago):", ethers.formatUnits(quoteUni, 6), "USDC");
    } catch (error) {
        console.error("Error fetching quote:", error);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Script failed:", error);
        process.exit(1);
    });
