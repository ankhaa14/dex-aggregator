// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IUniswapV2Factory {
    function getPair(address tokenA, address tokenB) external view returns (address pair);
}

interface IUniswapV2Pair {
    function getReserves() external view returns (
        uint112 reserve0, 
        uint112 reserve1, 
        uint32 blockTimestampLast
    );
    function token0() external view returns (address);
    function token1() external view returns (address);
}

contract SushiswapDataFetcher {
    address public factory;
    address public weth;
    address public usdc;

    constructor(
        address _factory,
        address _weth,
        address _usdc
    ) {
        factory = _factory;
        weth = _weth;
        usdc = _usdc;
    }

    function getWethToUsdcAmountOut(uint amountIn) external view returns (uint amountOut) {
        address pairAddress = IUniswapV2Factory(factory).getPair(weth, usdc);
        require(pairAddress != address(0), "Pair not found");

        (uint112 reserve0, uint112 reserve1, ) = IUniswapV2Pair(pairAddress).getReserves();
        address token0 = IUniswapV2Pair(pairAddress).token0();
        address token1 = IUniswapV2Pair(pairAddress).token1();

        uint reserveIn;
        uint reserveOut;
        if (token0 == weth) {
            reserveIn = reserve0;
            reserveOut = reserve1;
        } else if (token1 == weth) {
            reserveIn = reserve1;
            reserveOut = reserve0;
        } else {
            revert("WETH not found in pair");
        }

        uint amountInWithFee = amountIn * 997;
        amountOut = (amountInWithFee * reserveOut) / (reserveIn * 1000 + amountInWithFee);
    }
}
