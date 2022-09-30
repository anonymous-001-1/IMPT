 
const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
// const { describe } = require("mocha");
require("@nomicfoundation/hardhat-chai-matchers");
let params=require("../ip_parameter.json");
const { assert } = require("console");

 
describe('IMPL', async () => {
 
     async function deployFixture(){
        const  [owner,account1,account2,account3,account4,account5,account6,account7,account8,account9,account10] = await ethers.getSigners();
        const Contract= await ethers.getContractFactory("IMPT",owner);
        let recipients=[account1.address,account2.address,account3.address,account4.address,account5.address];
        let amount=[100,200,300,400,1000]
        const contract=await Contract.deploy(params.name,params.Symbol,owner.address,recipients,amount);
        await contract.deployed();
        return {owner,contract,recipients,amount,account6};
     }
 
     describe("constructor check", async (done) =>{
 
        it("Check for valid name and symbol", async ()=>{
 
            const {owner,contract,recipients,amount} =await loadFixture(deployFixture)
               expect(await contract.name()).to.be.equal(params.name);
               expect(await contract.symbol()).to.be.equal(params.Symbol);
        })

        it("The owner is set right", async ()=>{
            const {owner,contract,recipients,amount} =await loadFixture(deployFixture)
            expect(await contract.owner()).to.be.equal(owner.address);
     })
      it("The distribution of tokens is done right", async ()=>{
        const {owner,contract,recipients,amount} =await loadFixture(deployFixture)
           for(let i=0;i<recipients.length;i++){
            let amtineth=ethers.utils.formatEther(await contract.balanceOf(recipients[i]))
             expect(parseInt(amtineth)).to.be.equal(amount[i]);
           }
      })
      it("check total supply", async ()=>{
        const {owner,contract,recipients,amount} =await loadFixture(deployFixture)
         let totalinnwei=parseInt(ethers.utils.formatEther(await contract.totalSupply()))
         let sum=0;
         for(let i=0;i<amount.length; i++){
                   sum+=amount[i]
         }
         expect(sum).to.be.equal(totalinnwei);
      })

    })
      describe('transfer', () => { 
          
          it("check for transfer ",async()=>{
            const {contract,recipients,amount} =await loadFixture(deployFixture)
            const  [owner,account1,account2,account3,account4,account5,account6,account7,account8,account9,account10] = await ethers.getSigners();
            let transfer_amount=10
              await contract.connect(account1).transfer(account6.address,transfer_amount)
              let amtineth=(await contract.balanceOf(account6.address))
              expect(amtineth).to.be.equal(transfer_amount);
          })
          it("should emit a transfer event", async ()=>{
            const {contract,recipients,amount} =await loadFixture(deployFixture)
            const  [owner,account1,account2,account3,account4,account5,account6,account7,account8,account9,account10] = await ethers.getSigners();
            let transfer_amount=10
              await expect(contract.connect(account1).transfer(account6.address,transfer_amount)).to.emit(contract,"Transfer")
          })
      })

      describe("allowance", ()=>{
          it("Should approve other address to spend token", async ()=>{
            const {contract,recipients,amount} =await loadFixture(deployFixture)
            const  [owner,account1,account2,account3,account4,account5,account6,account7,account8,account9,account10] = await ethers.getSigners();
            let allowance_amt=50
            await contract.connect(account1).approve(account6.address,allowance_amt);
            let allowed_amount=await contract.allowance(account1.address,account6.address);
            expect(allowance_amt).to.be.equal(allowance_amt)
        })
        it("Should not be let transfer of unapproved tokens",async()=>{
            const {contract,recipients,amount} =await loadFixture(deployFixture)
            const  [owner,account1,account2,account3,account4,account5,account6,account7,account8,account9,account10] = await ethers.getSigners();
            let allowance_amt=50
                await contract.connect(account1).approve(account6.address,allowance_amt);
                await expect(contract.connect(account6).transferFrom(account1.address,account7.address,allowance_amt*2)).to.be.reverted;
        })
        it("emits an approval event, when an approval occurs", async () => {
            const {contract,recipients,amount} =await loadFixture(deployFixture)
            const  [owner,account1,account2,account3,account4,account5,account6,account7,account8,account9,account10] = await ethers.getSigners();
            let allowance_amt=50
            await expect(contract.connect(account1).approve(account6.address,allowance_amt)).to.emit(contract, "Approval")
        })
      })
          describe("check for pausable", () => {
            it("The transfer fails when paused", async () => {
              
              const {contract,recipients,amount} =await loadFixture(deployFixture)
              const  [owner,account1,account2,account3,account4,account5,account6,account7,account8,account9,account10] = await ethers.getSigners();
              let transfer_amount=10
               await contract.connect(owner).pause();
               await expect (contract.connect(account1).transfer(account6.address,transfer_amount)).to.be.reverted;  
            })
            it("The transaction continues when not paused", async () => {
              const {contract,recipients,amount} =await loadFixture(deployFixture)
              const  [owner,account1,account2,account3,account4,account5,account6,account7,account8,account9,account10] = await ethers.getSigners();
              let transfer_amount=10
              await contract.connect(owner).pause();
              await expect (contract.connect(account1).transfer(account6.address,transfer_amount)).to.be.reverted
              await contract.connect(owner).unpause();
              await contract.connect(account1).transfer(account6.address,transfer_amount)
              let amtineth=(await contract.balanceOf(account6.address))
              expect(amtineth).to.be.equal(transfer_amount);

            })
          })
})


        describe("Two stage ownable",()=>{
            async function deployFixture(){
                const  [owner,account1,account2,account3,account4,account5,account6,account7,account8,account9,account10] = await ethers.getSigners();
                const Contract= await ethers.getContractFactory("IMPT",owner);
                let recipients=[account1.address,account2.address,account3.address,account4.address,account5.address];
                let amount=[100,200,300,400,1000]
                const contract=await Contract.deploy(params.name,params.Symbol,owner.address,recipients,amount);
                await contract.deployed();
                return {owner,contract,recipients,amount,account6};
             }
             it("Should set the right owner",async ()=>{
                const {contract,recipients,amount} =await loadFixture(deployFixture)
                const  [owner,account1,account2,account3,account4,account5,account6,account7,account8,account9,account10] = await ethers.getSigners();
                expect(await contract.owner()).to.be.equal(owner.address);
             })
             
             describe("nominate new owner", ()=>{
                    it("Only owner can nominate new owner", async()=>{
                        const {contract,recipients,amount} =await loadFixture(deployFixture)
                        const  [owner,account1,account2,account3,account4,account5,account6,account7,account8,account9,account10] = await ethers.getSigners();
                        await expect( contract.connect(account1).nominateNewOwner(account6.address)).to.be.revertedWith("Not owner")
                    })
                    it("should allow owner to nominate new owners", async()=>{
                        const {contract,recipients,amount} =await loadFixture(deployFixture)
                        const  [owner,account1,account2,account3,account4,account5,account6,account7,account8,account9,account10] = await ethers.getSigners();
                        await expect( contract.connect(account1).nominateNewOwner(account6.address)).to.be.revertedWith("Not owner")
                    })
                    it("should change ownerto new owner once accpeted", async()=>{
                      const {contract,recipients,amount} =await loadFixture(deployFixture)
                      const  [owner,account1,account2,account3,account4,account5,account6,account7,account8,account9,account10] = await ethers.getSigners();
                      await expect( contract.connect(owner).nominateNewOwner(account6.address))
                      await contract.connect(account6).acceptOwnership()
                      expect(await contract.owner()).to.be.equal(account6.address);

                    })
                
             })
 
        })


