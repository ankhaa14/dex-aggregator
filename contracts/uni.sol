// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.7.5;
pragma abicoder v2;

import "@uniswap/v3-core/contracts/libraries/FullMath.sol";
import "@uniswap/v3-core/contracts/libraries/TickMath.sol";
import "@uniswap/v3-periphery/contracts/libraries/OracleLibrary.sol";
import "@uniswap/v3-periphery/contracts/interfaces/IQuoterV2.sol";

interface CurvePool {
    function get_dy(
        int128 i,
        int128 j,
        uint256 dx
    ) external view returns (uint256);

    function price_oracle(uint256 i) external view returns (uint256);
}

contract DEX {
    address public uniPool;
    // address public curvePool;
    address public quoter;
    address USDC = 0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238;
    address WETH = 0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14;

    event Quote(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 amountOut
    );

    constructor(
        address _uniPool,
        // address _curvePool,
        address _quoter
    ) {
        uniPool = _uniPool;
        // curvePool = _curvePool;
        quoter = _quoter;
    }

    function getQuoteUni(
        uint32 secondsAgo,
        uint128 amount,
        bool swap
    ) external view returns (uint256) {
        (int24 tick, ) = OracleLibrary.consult(uniPool, secondsAgo);
        uint256 price = 0;
        if (swap) {
            price = OracleLibrary.getQuoteAtTick(tick, amount, USDC, WETH);
        } else {
            price = OracleLibrary.getQuoteAtTick(tick, amount, WETH, USDC);
        }
        return price;
    }

    function getQuoteWETH(
        uint256 amountIn,
        address tokenIn,
        address tokenOut,
        uint24 fee
    ) public returns (uint256) {
        IQuoterV2.QuoteExactInputSingleParams memory params = IQuoterV2
            .QuoteExactInputSingleParams({
                tokenIn: tokenIn,
                tokenOut: tokenOut,
                amountIn: amountIn,
                fee: fee,
                sqrtPriceLimitX96: 0
            });
        (uint256 amountOut, , , ) = IQuoterV2(quoter).quoteExactInputSingle(
            params
        );
        emit Quote(tokenIn, tokenOut, amountIn, amountOut);
        return amountOut;
    }


    // function getQuoteCurveOracle(uint256 token) external view returns (uint256) {
    //     uint256 price = CurvePool(curvePool).price_oracle(token);
    //     return price;
    // }

    // function getQuoteCurve(int128 token, uint256 amount) external view returns (uint256) {
    //     uint256 price = CurvePool(curvePool).get_dy(0, token, amount);
    //     return price;
    // }
}