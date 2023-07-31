const { run } = require("hardhat");

/**
 * ! Function to verify contracts in the Polygon Mumbai net
 */

async function verify(contractAddress, args) {
  console.log("Verifying contract...");

  try {
    //We use RUN to execute the internal function of Hardhat VERIFY.
    //This function has multiple subtasks, and we need to choose "Verify."
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
      //-----------------
      network: "mumbai",
    });
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already Verified");
    } else {
      console.log(e);
    }
  }
}

module.exports = { verify };
