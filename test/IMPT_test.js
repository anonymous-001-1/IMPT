 
const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
// const { describe } = require("mocha");
require("@nomicfoundation/hardhat-chai-matchers");
let params=require("../ip_parameter.json");
const { assert } = require("console");
const { notDeepEqual } = require("assert");

 
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
 
     describe("constructor check", async () =>{
          
         it("should fail if unequal number of recipients and amount", async ()=>{
          const  [owner,account1,account2,account3,account4,account5,] = await ethers.getSigners();
          const Contract= await ethers.getContractFactory("IMPT",owner);
          let recipients=[account1.address,account2.address,account3.address,account4.address,account5.address];
          let amount=[100,200,300,400]
          await expect( Contract.deploy(params.name,params.Symbol,owner.address,recipients,amount)).to.be.revertedWith("Invalid params length"); 

        })
        it("Should fail if more than 20 aurguments are passed",async()=>{
          const  [owner,account1,account2,account3,account4,account5,account6,account7,account8,account9,account10,account11,account12,account13,account14,account15,account16,account17,account18,account19] = await ethers.getSigners();
          
          const Contract= await ethers.getContractFactory("IMPT",owner);
          let recipients=[account1.address,account2.address,account3.address,account4.address,account5.address,account6.address,account7.address,account8.address,account9.address,account10.address,account11.address,account12.address,account13.address,account14.address,account15.address,account16.address,account17.address,account18.address,account19.address,account1.address,account2.address];
          let amount=[100,200,300,400,500,600,700,200,900,1000,100,200,300,400,500,600,700,800,900,1000,100]
          await expect( Contract.deploy(params.name,params.Symbol,owner.address,recipients,amount)).to.be.revertedWith("Invalid recipients length");         
         })
         it("Should fail if any negative amount passed",async ()=>{
          const  [owner,account1,account2,account3,account4,account5] = await ethers.getSigners();
          const Contract= await ethers.getContractFactory("IMPT",owner);
          let recipients=[account1.address,account2.address,account3.address,account4.address,account5.address];
          let amount=[100,200,300,-400,500]   
          await expect( Contract.deploy(params.name,params.Symbol,owner.address,recipients,amount)).to.be.rejected;         
         })
         it("Should fail if all negative amount passed",async ()=>{
          const  [owner,account1,account2,account3,account4,account5] = await ethers.getSigners();
          const Contract= await ethers.getContractFactory("IMPT",owner);
          let recipients=[account1.address,account2.address,account3.address,account4.address,account5.address];
          let amount=[-100,-200,-300,-400,-500]   
          await expect( Contract.deploy(params.name,params.Symbol,owner.address,recipients,amount)).to.be.rejected;         
         })

        it(" should have valid name and symbol", async ()=>{
 
            const {contract} =await loadFixture(deployFixture)
               expect(await contract.name()).to.be.equal(params.name);
               expect(await contract.symbol()).to.be.equal(params.Symbol);
        })
  
        it("should have set the owner right", async ()=>{
            const {owner,contract} =await loadFixture(deployFixture)
            expect(await contract.owner()).to.be.equal(owner.address);
     })
      it("should distribute  tokens  right", async ()=>{
        const {contract,recipients,amount} =await loadFixture(deployFixture)
           for(let i=0;i<recipients.length;i++){
            let amtineth=ethers.utils.formatEther(await contract.balanceOf(recipients[i]))
             expect(parseInt(amtineth)).to.be.equal(amount[i]);
           }
      })
      it(" should have valid total supply", async ()=>{
        const {contract,amount} =await loadFixture(deployFixture)
         let total_in_nwei=parseInt(ethers.utils.formatEther(await contract.totalSupply()))
         let sum=0;
         for(let i=0;i<amount.length; i++){
                   sum+=amount[i]
         }
         expect(sum).to.be.equal(total_in_nwei);
      })

    })
      describe('transfer', () => { 
          
          it("should allow transfer of tokens",async()=>{
            const {contract} =await loadFixture(deployFixture)
            const  [owner,account1,account2,account3,account4,account5,account6] = await ethers.getSigners();
            let transfer_amount=10
              await contract.connect(account1).transfer(account6.address,transfer_amount)
              let amtineth=(await contract.balanceOf(account6.address))
              expect(amtineth).to.be.equal(transfer_amount);
          })
          it("should emit a transfer event", async ()=>{
            const {contract} =await loadFixture(deployFixture)
            const  [owner,account1,account2,account3,account4,account5,account6] = await ethers.getSigners();
            let transfer_amount=10
              await expect(contract.connect(account1).transfer(account6.address,transfer_amount)).to.emit(contract,"Transfer")
          })
      })

      describe("allowance", ()=>{
          it("Should approve other address to spend token", async ()=>{
            const {contract} =await loadFixture(deployFixture)
            const  [owner,account1,account2,account3,account4,account5,account6,] = await ethers.getSigners();
            let allowance_amt=50
            await contract.connect(account1).approve(account6.address,allowance_amt);
            let allowed_amount=await contract.allowance(account1.address,account6.address);
            expect(allowance_amt).to.be.equal(allowance_amt)
        })
        it("Should not be let transfer of unapproved tokens",async()=>{
            const {contract} =await loadFixture(deployFixture)
            const  [owner,account1,account2,account3,account4,account5,account6,account7] = await ethers.getSigners();
            let allowance_amt=50
                await contract.connect(account1).approve(account6.address,allowance_amt);
                await expect(contract.connect(account6).transferFrom(account1.address,account7.address,allowance_amt*2)).to.be.reverted;
        })
        it(" should emit an approval event, when an approval occurs", async () => {
            const {contract} =await loadFixture(deployFixture)
            const  [owner,account1,account2,account3,account4,account5,account6] = await ethers.getSigners();
            let allowance_amt=50
            await expect(contract.connect(account1).approve(account6.address,allowance_amt)).to.emit(contract, "Approval")
        })
      })
          describe("check for pausable", () => {
            it("should  fail transfer's when paused", async () => {
              const {contract} =await loadFixture(deployFixture)
              const  [owner,account1,account2,account3,account4,account5,account6] = await ethers.getSigners();
              let transfer_amount=10
               await contract.connect(owner).pause();
               await expect (contract.connect(account1).transfer(account6.address,transfer_amount)).to.be.reverted;  
            })
            it("should revert if tried to unpause the unpaused contract",async()=>{
              const {contract} =await loadFixture(deployFixture)
              const  [owner] = await ethers.getSigners();
               await contract.connect(owner).pause();
               await expect( contract.connect(owner).pause()).to.be.reverted;
            })
            it("should revert if tried to pause by non owner",async()=>{
              const {contract} =await loadFixture(deployFixture)
              const  [owner,account1] = await ethers.getSigners();
               await expect( contract.connect(account1).pause()).to.be.reverted;
            })
            it("should revert if tried to unpause by non owner",async()=>{
              const {contract} =await loadFixture(deployFixture)
              const  [owner,account1] = await ethers.getSigners();
               await  contract.connect(owner).pause()
               await expect( contract.connect(account1).unpause()).to.be.reverted;
            })
       
            it("should allow transaction  when not paused", async () => {
              const {contract} =await loadFixture(deployFixture)
              const  [owner,account1,account2,account3,account4,account5,account6] = await ethers.getSigners();
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
                const  [owner,account1,account2,account3,account4,account5,account6] = await ethers.getSigners();
                const Contract= await ethers.getContractFactory("IMPT",owner);
                let recipients=[account1.address,account2.address,account3.address,account4.address,account5.address];
                let amount=[100,200,300,400,1000]
                const contract=await Contract.deploy(params.name,params.Symbol,owner.address,recipients,amount);
                await contract.deployed();
                return {owner,contract,recipients,amount,account6};
             }
             describe("Contructor",async()=>{

               it("Should not accept zero address as owner",async ()=>{
                const  [owner,account1,account2,account3,account4,account5] = await ethers.getSigners();
                const Contract= await ethers.getContractFactory("IMPT",owner);
                let recipients=[account1.address,account2.address,account3.address,account4.address,account5.address];
                let amount=[100,200,300,400,1000]
                let zeroaddr=ethers.constants.AddressZero
               await expect (Contract.deploy(params.name,params.Symbol,zeroaddr,recipients,amount)).to.be.revertedWith("Owner is zero");
              })
                
               it("Should set the right owner",async ()=>{
                  const {contract} =await loadFixture(deployFixture)
                  const  [owner] = await ethers.getSigners();
                  expect(await contract.owner()).to.be.equal(owner.address);
               })
             })
              
             
             describe("nominate new owner", ()=>{
                    it("should let Only owner  nominate new owner", async()=>{
                        const {contract} =await loadFixture(deployFixture)
                        const  [owner,account1,account2,account3,account4,account5,account6] = await ethers.getSigners();
                        await expect( contract.connect(account1).nominateNewOwner(account6.address)).to.be.revertedWith("Not owner")
                    })
                    it("shouldn't allow non owner to nominate new owners", async()=>{
                        const {contract} =await loadFixture(deployFixture)
                        const  [owner,account1,account2,account3,account4,account5,account6] = await ethers.getSigners();
                        await expect( contract.connect(account1).nominateNewOwner(account6.address)).to.be.revertedWith("Not owner")
                      })
                      it("should set the right new nominated owner",async()=>{
                        const {contract} =await loadFixture(deployFixture)
                        const  [owner,account1,account2,account3,account4,account5,account6] = await ethers.getSigners();
                        expect(  await contract.connect(owner).nominateNewOwner(account6.address))
                        expect(await contract.nominatedOwner()).to.be.equal(account6.address);
                      })
                    it("should change owner to new owner once accepted", async()=>{
                      const {contract} =await loadFixture(deployFixture)
                      const  [owner,account1,account2,account3,account4,account5,account6] = await ethers.getSigners();
                       await contract.connect(owner).nominateNewOwner(account6.address)
                      await contract.connect(account6).acceptOwnership()
                      expect(await contract.owner()).to.be.equal(account6.address);
                    })
                    it("Should fail if the accept ownership is noot called by nominated owner",async()=>{
                      const {contract} =await loadFixture(deployFixture)
                      const  [owner,account1,account2,account3,account4,account5,account6] = await ethers.getSigners();
                       await contract.connect(owner).nominateNewOwner(account6.address)
                      await expect ( contract.connect(account1).acceptOwnership()).to.be.revertedWith("Not nominated to ownership");
                    })
                    it("should emit event if new ownership accepted",async ()=>{
                      const {contract} =await loadFixture(deployFixture)
                      const  [owner,account1,account2,account3,account4,account5,account6] = await ethers.getSigners();
                       await contract.connect(owner).nominateNewOwner(account6.address)
                      await expect( contract.connect(account6).acceptOwnership()).to.emit(contract,"OwnerChanged")  
                    })
                    it("should emit event when new owner nominated",async()=>{
                      const {contract} =await loadFixture(deployFixture)
                      const  [owner,account1,account2,account3,account4,account5,account6] = await ethers.getSigners();
                      await expect(contract.connect(owner).nominateNewOwner(account6.address)).to.emit(contract,"OwnerNominated")
                    })
                    
                
             })
 
        })


