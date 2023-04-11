const { getNamedAccounts, deployments, ethers, network } = require("hardhat");
const {
  developmentChains,
  networkConfig,
} = require("../../../helper.hardhat.config");
const { assert, expect } = require("chai");

developmentChains.includes(network.name)
  ? describe.skip
  : describe("Raffle", function () {
      let raffle, raffleEntranceFee, deployer;

      beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer;
        raffle = await ethers.getContract("Raffle", deployer);
        raffleEntranceFee = await raffle.getEntranceFee();
      });

      describe("fuldillRandomWords", function () {
        it("works with live chainlink keepers and chainlink VRF, we get a random winner", async function () {
          //enter the raffle
          console.log("Setting up the test...");
          const startingTimeStamp = await raffle.getLatestTimestamp();
          const accounts = await ethers.getSigners();

          console.log("Setting up Listener...");
          await new Promise(async (resolve, reject) => {
            raffle.once("WinnerPicked", async () => {
              console.log("WinnerPicked event fired !");
              try {
                const recentWinner = await raffle.getRecentWinner();
                const raffleState = await raffle.getRaffleState();
                const winnerEndingBalance = await accounts[0].getBalance();
                const endingTimeStamp = await raffle.getLatestTimestamp();

                await expect(raffle.getPlayer(0)).to.be.reverted; //checking if the players array has been reseted
                assert.equal(recentWinner.toString(), accounts[0].address);
                assert.equal(raffleState, 0);
                // assert.equal(
                //   winnerEndingBalance.toString(),
                //   winnerStartingBalance.add(raffleEntranceFee).toString()
                // );
                assert(endingTimeStamp > startingTimeStamp);
                resolve();
              } catch (e) {
                console.log(e);
                reject(e);
              }
            });

            console.log("Entering Raffle...");
            await raffle.enterRaffle({ value: raffleEntranceFee });
            console.log("Ok, time to wait...");
            const winnerStartingBalance = await accounts[0].getBalance();
          });
        });
      });
    });
