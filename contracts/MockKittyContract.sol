pragma solidity ^0.4.25;

/**
 * @title MockKittyContract
 * @dev Mock CryptoKitties contract for testing zombie feeding on Ganache
 */
contract MockKittyContract {
    
    struct Kitty {
        uint256 genes;
        uint64 birthTime;
        uint32 matronId;
        uint32 sireId;
        uint32 generation;
    }
    
    Kitty[] public kitties;
    
    // Create some mock kitties for testing
    constructor() public {
        // Create 5 mock kitties with different DNA
        _createKitty(1234567890123456, 0, 0, 0);
        _createKitty(9876543210987654, 0, 0, 0);
        _createKitty(5555555555555555, 0, 0, 0);
        _createKitty(1111111111111111, 0, 0, 0);
        _createKitty(9999999999999999, 0, 0, 0);
    }
    
    function _createKitty(
        uint256 _genes,
        uint256 _matronId,
        uint256 _sireId,
        uint256 _generation
    ) internal returns (uint) {
        Kitty memory _kitty = Kitty({
            genes: _genes,
            birthTime: uint64(now),
            matronId: uint32(_matronId),
            sireId: uint32(_sireId),
            generation: uint32(_generation)
        });
        
        uint256 newKittyId = kitties.push(_kitty) - 1;
        return newKittyId;
    }
    
    // This matches the CryptoKitties interface
    function getKitty(uint256 _id) external view returns (
        bool isGestating,
        bool isReady,
        uint256 cooldownIndex,
        uint256 nextActionAt,
        uint256 siringWithId,
        uint256 birthTime,
        uint256 matronId,
        uint256 sireId,
        uint256 generation,
        uint256 genes
    ) {
        Kitty storage kitty = kitties[_id];
        
        isGestating = false;
        isReady = true;
        cooldownIndex = 0;
        nextActionAt = 0;
        siringWithId = 0;
        birthTime = uint256(kitty.birthTime);
        matronId = uint256(kitty.matronId);
        sireId = uint256(kitty.sireId);
        generation = uint256(kitty.generation);
        genes = kitty.genes;
    }
    
    // Helper function to create more kitties for testing
    function createKitty(uint256 _genes) external returns (uint) {
        return _createKitty(_genes, 0, 0, 0);
    }
    
    // Get total number of kitties
    function totalKitties() external view returns (uint) {
        return kitties.length;
    }
}
