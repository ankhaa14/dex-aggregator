# DEX Aggregator 

## Prerequisites

- [Node.js](https://nodejs.org/) (version 14 or higher)
- npm (or yarn)
- [Hardhat](https://hardhat.org/)
- An RPC endpoint URL (e.g., from Buildbear) configured in your `.env` file
- A private key with sufficient balance on the network

## Setup

1. **Clone the Repository**

   ```bash
   git clone https://github.com/ankhaa14/dex-aggregator.git
   cd dex-aggregator

2. **Install Dependencies**
  ```bash
  npm install
  ```

3. **Configure Environment Variables**
  Create a .env file in the root directory and add your configuration:
  ```bash
  BUILDBEAR_URL=https://your-buildbear-rpc-url
  PRIVATE_KEY=your_private_key
  ```

## Commands

1. **Compile the Contracts**
  ```bash
  npx hardhat compile
  ```

2. **Deploy**
  ```bash
 npx hardhat run scripts/deploy.js --network buildbear
 ```

 you should see output similar to:
  ```bash
  Deployment transaction sent. Waiting for confirmation...
  SushiswapDataFetcher deployed to: 0xYourDeployedContractAddress
  ```

  change the contractAddress in sushiQuote.js with the deployed address.

3. **Run the Sushi Quote Script**
  ```bash
  npx hardhat run scripts/sushiQuote.js --network buildbear
  ```
