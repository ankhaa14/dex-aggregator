// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HelloBuildbear {
    string public message;

    constructor(string memory _message) {
        message = _message;
    }

    // Allows updating the message
    function setMessage(string memory _message) public {
        message = _message;
    }
}
