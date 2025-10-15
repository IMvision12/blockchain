# 🧟 CryptoZombies - Blockchain Game

A decentralized application (DApp) built with Solidity smart contracts where you can create, collect, and battle zombies on the Ethereum blockchain.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher)
- **Truffle** - `npm install -g truffle`
- **Ganache** - Download from [trufflesuite.com/ganache](https://trufflesuite.com/ganache)
- **MetaMask** - Browser extension from [metamask.io](https://metamask.io)

## 🚀 Getting Started

### Step 1: Install Dependencies

```cmd
cd blockchain
npm install
```

### Step 2: Start Ganache

1. Open Ganache application
2. Click **"QUICKSTART"** to start a local blockchain
3. Ganache will run on `http://127.0.0.1:7545` with Chain ID `1337`
4. You'll get 10 accounts with 100 ETH each

### Step 3: Compile Smart Contracts

```cmd
truffle compile
```

This compiles all Solidity contracts in the `contracts/` folder.

### Step 4: Deploy Contracts to Ganache

```cmd
truffle migrate --network development
```

**Important:** After deployment, you'll see output like this:

```
Deploying 'ZombieOwnership'
---------------------------
> contract address:    0x1A33752799e936Aad965a118AAe3718256CBe6a1
```

**Copy the contract address!** You'll need it for the next step.

### Step 5: Update Contract Address in Frontend

Open `index.html` and find line ~42:

```javascript
var cryptoZombiesAddress = "0x1A33752799e936Aad965a118AAe3718256CBe6a1";
```

Replace the address with your newly deployed contract address.

### Step 6: Configure MetaMask

1. **Add Ganache Network:**
   - Open MetaMask
   - Click network dropdown → "Add network" → "Add a network manually"
   - Fill in:
     - **Network name:** Ganache Local
     - **RPC URL:** http://127.0.0.1:7545
     - **Chain ID:** 1337
     - **Currency symbol:** ETH
   - Click "Save"
   - Switch to "Ganache Local" network

2. **Import Ganache Account:**
   - In Ganache, click the key icon 🔑 next to any account
   - Copy the private key
   - In MetaMask: Account icon → "Import Account"
   - Paste private key → "Import"

### Step 7: Start the Frontend

```cmd
npx browser-sync start --server --files "*.html, *.js, *.css"
```

The app will open at `http://localhost:3000`

## 🎮 How to Use

### Create a Zombie
1. Click **"🧬 Create Zombie"**
2. Enter a name in the modal
3. Approve the transaction in MetaMask
4. Wait for confirmation (~5 seconds)

**Note:** Each account can only create ONE zombie!

### View Your Zombies
- Click **"👁️ Show My Zombies"** to display all your zombies

### Level Up
- Click **"⚡ Level Up"** to upgrade your zombie (costs 0.001 ETH)

## 🔄 Redeploying Contracts

If you restart Ganache or need to redeploy:

```cmd
truffle migrate --reset --network development
```

**Remember to update the contract address in `index.html` after redeploying!**

## 🛠️ Project Structure

```
blockchain/
├── contracts/           # Solidity smart contracts
│   ├── zombiefactory.sol
│   ├── zombiefeeding.sol
│   ├── zombiehelper.sol
│   ├── zombieattack.sol
│   └── zombieownership.sol
├── migrations/          # Deployment scripts
├── build/              # Compiled contracts (auto-generated)
├── index.html          # Frontend UI
├── cryptozombies_abi.js # Contract ABI
└── truffle-config.js   # Truffle configuration
```

## ⚙️ Configuration

### Truffle Config (`truffle-config.js`)

```javascript
networks: {
  development: {
    host: "127.0.0.1",
    port: 7545,
    network_id: "*",  // Matches any network
  }
},
compilers: {
  solc: {
    version: "0.4.25"  // Must match contract pragma
  }
}
```

## 🐛 Troubleshooting

### Error: "Internal JSON-RPC error"
- **Cause:** You already created a zombie with this account (limit: 1 per account)
- **Solution:** Import a different Ganache account into MetaMask

### Error: "Network ID mismatch"
- **Cause:** MetaMask is on wrong network
- **Solution:** Switch MetaMask to "Ganache Local" (Chain ID: 1337)

### Error: "Contract not deployed"
- **Cause:** Contract address in HTML doesn't match deployed address
- **Solution:** Redeploy contracts and update address in `index.html`

### Ganache Restarted
- **Solution:** Run `truffle migrate --reset` and update contract address

### MetaMask Shows $0.00
- **Normal:** USD conversion doesn't work for local networks
- **Check:** You should still see ETH balance (e.g., "99.98 ETH")

## 📝 Smart Contract Details

### ZombieFactory
- Create zombies with unique DNA
- Limit: 1 zombie per address

### ZombieFeeding
- Feed zombies to create new ones
- Interact with CryptoKitties

### ZombieHelper
- Level up zombies (costs 0.001 ETH)
- Change zombie names

### ZombieAttack
- Battle other zombies
- Win/loss tracking

### ZombieOwnership
- ERC721 compliant NFT
- Transfer and trade zombies

## 📚 Additional Commands

### Run Tests
```cmd
truffle test
```

### Open Truffle Console
```cmd
truffle console --network development
```

### Check Contract Size
```cmd
truffle compile --all
```

## 🔗 Useful Links

- [Truffle Documentation](https://trufflesuite.com/docs/truffle/)
- [Solidity Documentation](https://docs.soliditylang.org/)
- [Web3.js Documentation](https://web3js.readthedocs.io/)
- [MetaMask Documentation](https://docs.metamask.io/)

## 🚀 Improvements & Custom Features

This project includes several enhancements beyond the standard CryptoZombies tutorial:

### 1. UI Improvements
- **Dark Cyberpunk Theme** - Stunning neon colors with purple, cyan, and pink gradients
- **Custom Fonts** - Creepster font for titles, Orbitron for body text
- **Animated Effects** - Glowing borders, gradient shifts, hover animations, and ripple effects
- **Glassmorphism Design** - Modern blur effects and transparent cards
- **Custom Modals** - Beautiful in-app modals instead of browser prompts
- **Responsive Layout** - Grid-based zombie cards that adapt to screen size
- **Visual Feedback** - Loading animations and status messages with emojis

### 2. Zombie ID Display
- **Unique ID Tracking** - Each zombie displays its unique blockchain ID
- **Easy Identification** - Quickly identify which zombie to level up or interact with
- **ID-Based Actions** - Level up specific zombies by entering their ID
- **Better Management** - Track and manage multiple zombies efficiently

### 3. Multiple Zombies Per Account
- **Removed Restriction** - Modified smart contract to allow unlimited zombies per account
- **Build Your Army** - Create as many zombies as you want with one wallet
- **Realistic Gameplay** - Matches real blockchain game mechanics (like CryptoKitties, Axie Infinity)
- **Enhanced Experience** - More engaging and fun for users
- **Future-Ready** - Enables features like breeding, battles, and trading

### Technical Changes Made:
```solidity
// Before (Original):
function createRandomZombie(string _name) public {
    require(ownerZombieCount[msg.sender] == 0);  // Only 1 zombie allowed
    ...
}

// After (Improved):
function createRandomZombie(string _name) public {
    // Removed restriction - unlimited zombies!
    ...
}
```

### 4. Visual Zombie Avatars
- **Unique Images** - Each zombie gets a unique robot avatar generated from its DNA
- **DNA-Based Generation** - Uses DiceBear API to create consistent avatars based on zombie DNA
- **Circular Avatar Display** - Beautiful circular frames with neon glow effects
- **Name Badges** - Prominent display of zombie names with glowing text
- **Hover Effects** - Avatars scale and glow when hovering over zombie cards
- **Better Visual Identity** - Easy to distinguish between different zombies at a glance

### 5. Mock CryptoKitties Contract
- **Testing Environment** - Mock CryptoKitties contract for local testing on Ganache
- **Pre-loaded Kitties** - 5 mock kitties with different DNA (IDs: 0-4)
- **Feed on Kitty Function** - Zombies can "eat" kitties to create hybrid zombies
- **DNA Mixing** - New zombies inherit DNA from both parent zombie and kitty
- **Cat-Zombie Hybrids** - Special zombies with DNA ending in "99"
- **Inter-Contract Communication** - Demonstrates how contracts interact with each other

**Available Mock Kitties:**
- Kitty #0: DNA 1234567890123456
- Kitty #1: DNA 9876543210987654
- Kitty #2: DNA 5555555555555555
- Kitty #3: DNA 1111111111111111
- Kitty #4: DNA 9999999999999999

### Future Enhancement Ideas:
- ⚔️ Zombie battle mechanics
- 🏪 Zombie marketplace for trading
- 📊 Leaderboard and statistics
- 🎁 Reward system for battles
- 🎮 Mini-games with zombies
- 🧬 Advanced breeding with multiple traits

## 📄 License

ISC

---

**Happy Zombie Hunting! 🧟‍♂️🎮**
