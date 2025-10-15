var MockKittyContract = artifacts.require("./MockKittyContract.sol");
var ZombieOwnership = artifacts.require("./zombieownership.sol");

module.exports = function(deployer) {
  deployer.then(async () => {
    const mockKitty = await MockKittyContract.deployed();
    const zombieOwnership = await ZombieOwnership.deployed();
    
    // Set the mock kitty contract address in ZombieFeeding
    await zombieOwnership.setKittyContractAddress(mockKitty.address);
    
    console.log("✅ Mock Kitty Contract deployed at:", mockKitty.address);
    console.log("✅ Kitty contract address set in ZombieOwnership");
    console.log("📝 Available mock kitties: 0, 1, 2, 3, 4");
  });
};
