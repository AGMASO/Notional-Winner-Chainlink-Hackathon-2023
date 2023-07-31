const { assert, expect } = require("chai")
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")
const { ethers } = require("hardhat")

describe("Main Unit Tests", function () {
    // fixtures
    async function deployMainFixture() {
        const [owner, otherAccount] = await ethers.getSigners();
        console.log("deploying main contract...");
        const Main = await ethers.getContractFactory("Main");
        const main = await Main.connect(owner).deploy();

        return {main, owner, otherAccount }
    }

    it("main is able to generate and store escrow contracts in an array", async function () {
        const { main, owner, otherAccount } = await loadFixture(deployMainFixture);

        let contractAddress;
        for (let i = 0; i < 3; i++) {
            await main.createEscrowContract();
        }
        for (let i = 0; i < 3; i++) {
            contractAddress = await main.escrowArray(i);
            expect(contractAddress).to.not.equal(ethers.constants.AddressZero);
        }
    });

    it("main methods can call escrow methods to store/retrieve numbers", async function () {
        const { main, owner, otherAccount } = await loadFixture(deployMainFixture);
        
        for (let i = 0; i < 3; i++) {
            await main.createEscrowContract();
        }

        const number = 7
        for (let i = 0; i < 3; i++) {
            await main.sfStore(i, number);
            const number_retrieved = await main.sfGet(i);
            expect(number_retrieved).to.equal(number);
        }
    });

    it("escrow methods can store/retrieve numbers", async function () {
        const { main, owner, otherAccount } = await loadFixture(deployMainFixture);
        
        for (let i = 0; i < 3; i++) {
            await main.createEscrowContract();
        }

        const number = 7
        const Escrow = await ethers.getContractFactory("Escrow");
        let contract;
        for (let i = 0; i < 3; i++) {
            contractAddress = await main.escrowArray(i);
            contract = await Escrow.attach(contractAddress);
            await contract.store(number);
            const number_retrieved = await contract.retrieve();
            expect(number_retrieved).to.equal(number);
        }
    });
})