# eth_amsterdam_daodom/gnosis

The implementation of the gnosis safe sdk as in the example of [eth-scaffold](https://github.com/scaffold-eth/scaffold-eth/tree/gnosis-starter-kit).

## Getting Started

These instructions will give you a copy of the project up and running on
your local machine for development and testing purposes. See deployment
for notes on deploying the project on a live system.

### Prerequisites

/none

### Installing

A step by step series of examples that tell you how to get a development
environment running

Clone the repository

    git clone https://github.com/MarijoR/eth_amsterdam_daodom.git

Switch to branch: gnosisscratch

Install npm

    npm install

## Built With

  - [eth-scaffold/gnosis](https://github.com/scaffold-eth/scaffold-eth/tree/gnosis-starter-kit) - Used
    for the idea and concept
  - [kindred](https://github.com/seeinplays/kindred) - Used to compare

## Contribution

[Kai-Uwe Porrmann](https://github.com/KaiPorrmann)
[Rocio Senger](https://github.com/RocioSe)

## Acknowledgments

  - SDK can be used only partially right away 
  (https://github.com/safe-global/safe-core-sdk/tree/main/packages/safe-core-sdk)
  
  - Inspiration and Help available through stackoverflow 
  (https://ethereum.stackexchange.com/)

## Current State

It is possible to create a safe with hard coded Signers aswell as Treshold. The goal is it to insert these manually upon creation. The call to already existing Safes leads to an error with communication. It´s the same with any existing communication to an existing Safe. So, information like Balance or the Signers can´t be called and the call leads to an error. 
Next steps would be:
- Make it possible to manually insert Signers and Threshold

- Fix the call to existent Safes, so upon pressing Deploy Safe, if there has been inserted an existing Safe Adress, connect the existing Safe instead of creating a new one (Code for this exists already and needs to be adjusted/fixed. Its been done like in the eth-scaffold Example with a simple if condition upon pressing Deploy Safe)

- Receive Balance aswell as all necessary information of the Safe connected. (Code already exists and is done with the eth-scaffold as Example, aswell.)

- Implement Transactions to the Safe, like in the eth-scaffold Example. (Code needs to be written)

- Implement Transactions triggered from the Safe, which need Signing from all the Signers necessary. With them having to connect the corresponding Safe first. 
(Code needs to be written)

For all the points above, help can be received from the SDK Link, the Stackexchange for ethereum or the Repository of eth-scaffold. All Links are provided.
