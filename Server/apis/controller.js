const Web3 = require('web3');
const path = require('path');
const express = require('express');

const fs = require('fs');
const solc = require('solc');
const res = require('express/lib/response');

const connectionURL= "https://rinkeby.infura.io/v3/b140d24d3a5744e0b9b98848003f07fe";
var web3 = new Web3(new Web3.providers.HttpProvider(connectionURL));
const privKey = 'a96afb0e82fbd41e5d8fb6e82beb33a0dc792075da3147b45d433e6548c59706';
const address = "0x482472da24426AA56a38c97f4D8960965E3933eb";

/**
 * TOKEN DETAILS
 */
// export const getTokenDetails = (request, response)=>{
//   const requestBody = request.body;
//   if(!requestBody){
//     return response.status(400).send({ message: "Invalid request"});
//   }
//   if(!requestBody.tokenName || !requestBody.tokenSymbol || !requestBody.tokenDecimals || !requestBody.initialSupply || !requestBody.totalSupply ){
//     return response.status(400).send({ message: "Invalid request"});
//   }
//   // Logic to implement

// }

/**
 * TOKEN FEATURES
 */
//  export const getTokenFeatures = (request, response)=>{
//   const requestBody = request.body;
//   if(!requestBody){
//     return response.status(400).send({ message: "Invalid request"});
//   }
//   if(!requestBody.supplyType || !requestBody.accessType || !requestBody.transferType || !requestBody.mintable || !requestBody.burnable ){
//     return response.status(400).send({ message: "Invalid request"});
//   }
//   

// }

/**
 * TOKEN DEPLOYMENT DETAILS
 */
//  export const getTokenDeployDetails = (request, response)=>{
//   const requestBody = request.body;
//   if(!requestBody){
//     return response.status(400).send({ message: "Invalid request"});
//   }
//   if(!requestBody.tokenType || !requestBody.network ){
//     return response.status(400).send({ message: "Invalid request"});
//   }
//   // Logic to implement

// }




/**
 * COMPILATION SCRIPT
 */
const source = fs.readFileSync('./model/AlphaToken.sol', 'UTF-8');

var input = {
  language: 'Solidity',
  sources: {
    'AlphaToken.sol': {
      content: source,
    }
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*']
      }
    }
  }
};

var output = JSON.parse(solc.compile(JSON.stringify(input)));

// `output` here contains the JSON output as specified in the documentation
for (var contractName in output.contracts['AlphaToken.sol']) {
  console.log(
    contractName +
      ': ' +
      output.contracts['AlphaToken.sol'][contractName].evm.bytecode.object
  );
}


/**
 * DEPLOYMENT SCRIPT
 */
const byteCode = output.contracts['AlphaToken.sol'][contractName].evm.bytecode.object;
console.log("bytecode",byteCode);
const contractABI = output.contracts['AlphaToken.sol'][contractName].abi;
console.log("contarct ABI",contractABI);

const deploy = async () => {
console.log('Attempting to deploy from account:', address);
const incrementer = new web3.eth.Contract(contractABI);
const incrementerTx = incrementer.deploy({
      data: byteCode,
      arguments: ["nischay","nisch"]
   });
const createTransaction = await web3.eth.accounts.signTransaction(
      {
         from: address,
         data: incrementerTx.encodeABI(),
         gas: '3000000',
      },
      privKey
   );
const createReceipt = await web3.eth.sendSignedTransaction(
      createTransaction.rawTransaction
   );
   console.log('Contract deployed at address', createReceipt.contractAddress);
};

deploy();





