const hre = require("hardhat");

async function main() {	
	const Main = await hre.ethers.getContractFactory("Main");
	const main = await Main.deploy();
	await main.deployed();
	
	console.log("Main deployed to:", main.address);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});