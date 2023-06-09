 # 🤖 Hardhat Raffle Smart Contract

## This project demonstrates a Raffle Smart Contract that :
  - accepts Raffle participants that send at least a pre-established ETH amount,
  - adds every player to a players array,
  - emits Events for each important action took by the contract,
  - reverts custom errors,
  - and withdraws a verifiable random winner automatically.
    
    
    
## Using a Chainlink Keeper :
 - every aspect of the raffle is analyzed to check if the raffle can be finished :
  - if so, the contract will request a random number to get the winner (random number % players array length) and emit a specific event - RequestedRaffleWinner,
  - otherwise, a custom error Raffle__UpkeepNotNeeded is reverted.



## Using a Chainlink VRFCoordinator :
- the random number is returned,
- the winner is determined using by getting the result of random number % players array length,
- the entire balance of the Contract is transfered to the winner's address,
  - if the tx goes through the WinnerPicked event is emitted,
  - if the tx fails the Raffle__TransferFailed error is reverted.
