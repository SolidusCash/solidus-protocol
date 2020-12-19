const web3 

let encodedFunctionSignature = web3.eth.abi.encodeFunctionSignature('sendMessage(string,address)');
 console.log(encodedFunctionSignature);
 // => 0xc48d6d5e