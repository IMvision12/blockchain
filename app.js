var cryptoZombies;
var userAccount;
var zombieParents = {}; // Store parent zombie IDs
var battleZombies = {}; // Store battle-created zombie IDs
const showZombieButton = document.querySelector('.showZombieButton');
const createzombieButton = document.querySelector('.createzombieButton');
const feedKittyButton = document.querySelector('.feedKittyButton');
const levelupButton = document.querySelector('.levelupButton');
const attackButton = document.querySelector('.attackButton');

function startApp() {
    var cryptoZombiesAddress = "0xEd8438904FAb05B698A5553f25B6ec4A5B1336D9"
    cryptoZombies = new web3.eth.Contract(cryptoZombiesABI, cryptoZombiesAddress);

    // Load stored parent relationships
    const stored = localStorage.getItem('zombieParents');
    if (stored) {
        zombieParents = JSON.parse(stored);
    }

    // Load stored battle zombies
    const storedBattle = localStorage.getItem('battleZombies');
    if (storedBattle) {
        battleZombies = JSON.parse(storedBattle);
    }

    cryptoZombies.events.Transfer({ filter: { _to: userAccount } })
        .on("data", function (event) {
            let data = event.returnValues;
            getZombiesByOwner(userAccount).then(displayZombies);
        }).on("error", console.error);
}

function displayZombies(ids) {
    $("#zombies").empty();

    if (ids.length === 0) {
        $("#zombies").html(`
      <div class="empty-state">
        <h2>NO ZOMBIES DETECTED</h2>
        <p>Create your first zombie to start building your army 🧟</p>
      </div>
    `);
        return;
    }

    for (let i = 0; i < ids.length; i++) {
        let zombieId = ids[i];
        getZombieDetails(zombieId)
            .then(function (zombie) {
                const avatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${zombie.dna}&backgroundColor=0a0e27,7000ff,ff0080`;
                const isCatZombie = zombie.dna % 100 == 99;
                const isBattleZombie = battleZombies[zombieId] !== undefined;

                console.log(`Zombie ${zombieId}: isCat=${isCatZombie}, isBattle=${isBattleZombie}, battleZombies=`, battleZombies);

                let hybridBadge = '';
                if (isCatZombie) {
                    hybridBadge = '<div class="hybrid-badge">🐱 CAT-ZOMBIE HYBRID</div>';
                } else if (isBattleZombie) {
                    hybridBadge = '<div class="hybrid-badge">⚔️ BATTLE ZOMBIE</div>';
                }

                $("#zombies").append(`<div class="zombie ${isCatZombie || isBattleZombie ? 'hybrid' : ''}">
          ${hybridBadge}
          <div class="zombie-avatar">
            <img src="${avatarUrl}" alt="${zombie.name}" />
          </div>
          <div class="zombie-name-badge">${zombie.name}</div>
          <ul>
            <li><strong>🆔 ID:</strong> ${zombieId}</li>
            <li><strong>🧬 DNA:</strong> ${zombie.dna}</li>
            <li><strong>⭐ LEVEL:</strong> ${zombie.level}</li>
            <li><strong>🏆 WINS:</strong> ${zombie.winCount}</li>
            <li><strong>💀 LOSSES:</strong> ${zombie.lossCount}</li>
            <li><strong>⏰ READY:</strong> ${new Date(zombie.readyTime * 1000).toLocaleString()}</li>
          </ul>
        </div>`);
            });
    }
}

var isCreatingZombie = false;

function createRandomZombie(name) {
    if (isCreatingZombie) {
        console.log("Already creating a zombie, please wait...");
        return;
    }

    isCreatingZombie = true;
    $("#txStatus").html("⏳ SPAWNING ZOMBIE ON BLOCKCHAIN...").addClass("loading");

    return cryptoZombies.methods.createRandomZombie(name)
        .send({ from: userAccount })
        .on("receipt", function (receipt) {
            $("#txStatus").html("✅ ZOMBIE " + name.toUpperCase() + " CREATED!").removeClass("loading");
            isCreatingZombie = false;
            getZombiesByOwner(userAccount).then(displayZombies);
        })
        .on("error", function (error) {
            $("#txStatus").html("❌ ERROR: " + error.message).removeClass("loading");
            isCreatingZombie = false;
        });
}

function feedOnKitty(zombieId, kittyId) {
    $("#txStatus").html("🐱 FEEDING ZOMBIE #" + zombieId + " WITH KITTY #" + kittyId + "...").addClass("loading");

    // Get parent zombie name first
    getZombieDetails(zombieId).then(function (parentZombie) {
        cryptoZombies.methods.feedOnKitty(zombieId, kittyId)
            .send({ from: userAccount })
            .on("receipt", function (receipt) {
                // Store parent info for the new zombie
                getZombiesByOwner(userAccount).then(function (ids) {
                    const newZombieId = ids[ids.length - 1]; // The newest zombie
                    zombieParents[newZombieId] = zombieId; // Store parent ID
                    localStorage.setItem('zombieParents', JSON.stringify(zombieParents));

                    $("#txStatus").html("✅ HYBRID ZOMBIE CREATED FROM " + parentZombie.name.toUpperCase() + " (ID: " + zombieId + ")! Check your zombies!").removeClass("loading");
                    displayZombies(ids);
                });
            })
            .on("error", function (error) {
                $("#txStatus").html("❌ ERROR: " + error.message).removeClass("loading");
            });
    });
}

function levelUp(zombieId) {
    $("#txStatus").html("⚡ LEVELING UP ZOMBIE #" + zombieId + "...").addClass("loading");
    return cryptoZombies.methods.levelUp(zombieId)
        .send({ from: userAccount, value: web3.utils.toWei("0.001", "ether") })
        .on("receipt", function (receipt) {
            $("#txStatus").html("✅ ZOMBIE #" + zombieId + " LEVELED UP!").removeClass("loading");
            getZombiesByOwner(userAccount).then(displayZombies);
        })
        .on("error", function (error) {
            $("#txStatus").html("❌ ERROR: " + error.message).removeClass("loading");
        });
}

function getZombieDetails(id) {
    return cryptoZombies.methods.zombies(id).call()
}

function getZombiesByOwner(owner) {
    return cryptoZombies.methods.getZombiesByOwner(owner).call()
}

function openCreateModal() {
    document.getElementById('createModal').classList.add('active');
    document.getElementById('zombieName').focus();
}

function closeCreateModal() {
    document.getElementById('createModal').classList.remove('active');
    document.getElementById('zombieName').value = '';
}

function submitZombie() {
    var name = document.getElementById('zombieName').value.trim();
    if (name) {
        closeCreateModal();
        createRandomZombie(name);
    } else {
        alert('Please enter a zombie name!');
    }
}

function openLevelupModal() {
    document.getElementById('levelupModal').classList.add('active');
    document.getElementById('zombieIdInput').focus();
}

function closeLevelupModal() {
    document.getElementById('levelupModal').classList.remove('active');
    document.getElementById('zombieIdInput').value = '';
}

function submitLevelup() {
    var zombieId = document.getElementById('zombieIdInput').value;
    if (zombieId !== null && zombieId !== "") {
        closeLevelupModal();
        levelUp(parseInt(zombieId));
    } else {
        alert('Please enter a zombie ID!');
    }
}

function openFeedKittyModal() {
    document.getElementById('feedKittyModal').classList.add('active');
    document.getElementById('feedZombieId').focus();
}

function closeFeedKittyModal() {
    document.getElementById('feedKittyModal').classList.remove('active');
    document.getElementById('feedZombieId').value = '';
    document.getElementById('feedKittyId').value = '';
}

function submitFeedKitty() {
    var zombieId = document.getElementById('feedZombieId').value;
    var kittyId = document.getElementById('feedKittyId').value;

    if (zombieId !== "" && kittyId !== "") {
        if (kittyId < 0 || kittyId > 4) {
            alert('Please enter a valid Kitty ID (0-4)!');
            return;
        }
        closeFeedKittyModal();
        feedOnKitty(parseInt(zombieId), parseInt(kittyId));
    } else {
        alert('Please enter both Zombie ID and Kitty ID!');
    }
}

function attack(attackerZombieId, targetZombieId) {
    $("#txStatus").html("⚔️ ZOMBIE #" + attackerZombieId + " ATTACKING ZOMBIE #" + targetZombieId + "...").addClass("loading");

    // Get current zombie count before battle
    getZombiesByOwner(userAccount).then(function (currentIds) {
        const zombieCountBefore = currentIds.length;

        return cryptoZombies.methods.attack(attackerZombieId, targetZombieId)
            .send({ from: userAccount })
            .on("receipt", function (receipt) {
                // Check if new zombie was created
                getZombiesByOwner(userAccount).then(function (newIds) {
                    if (newIds.length > zombieCountBefore) {
                        // Find the new zombie ID (the one not in the previous list)
                        const newZombieId = newIds.find(id => !currentIds.includes(id));
                        if (newZombieId !== undefined) {
                            battleZombies[newZombieId] = { attacker: attackerZombieId, target: targetZombieId };
                            localStorage.setItem('battleZombies', JSON.stringify(battleZombies));
                            $("#txStatus").html("⚔️ VICTORY! NEW BATTLE ZOMBIE #" + newZombieId + " CREATED!").removeClass("loading");
                        } else {
                            $("#txStatus").html("⚔️ BATTLE COMPLETE! Check your zombies for results!").removeClass("loading");
                        }
                    } else {
                        $("#txStatus").html("⚔️ BATTLE LOST! No new zombie created.").removeClass("loading");
                    }
                    displayZombies(newIds);
                });
            })
            .on("error", function (error) {
                $("#txStatus").html("❌ ERROR: " + error.message).removeClass("loading");
            });
    });
}

function openAttackModal() {
    document.getElementById('attackModal').classList.add('active');
    document.getElementById('attackerZombieId').focus();
}

function closeAttackModal() {
    document.getElementById('attackModal').classList.remove('active');
    document.getElementById('attackerZombieId').value = '';
    document.getElementById('targetZombieId').value = '';
}

function submitAttack() {
    var attackerZombieId = document.getElementById('attackerZombieId').value;
    var targetZombieId = document.getElementById('targetZombieId').value;

    if (attackerZombieId !== "" && targetZombieId !== "") {
        if (attackerZombieId === targetZombieId) {
            alert('You cannot attack your own zombie!');
            return;
        }
        closeAttackModal();
        attack(parseInt(attackerZombieId), parseInt(targetZombieId));
    } else {
        alert('Please enter both Attacker and Target Zombie IDs!');
    }
}

function renameZombie(zombieId, newName) {
    $("#txStatus").html("✏️ RENAMING ZOMBIE #" + zombieId + "...").addClass("loading");
    return cryptoZombies.methods.changeName(zombieId, newName)
        .send({ from: userAccount })
        .on("receipt", function (receipt) {
            $("#txStatus").html("✅ ZOMBIE #" + zombieId + " RENAMED TO " + newName.toUpperCase() + "!").removeClass("loading");
            getZombiesByOwner(userAccount).then(displayZombies);
        })
        .on("error", function (error) {
            $("#txStatus").html("❌ ERROR: " + error.message).removeClass("loading");
        });
}

function openRenameModal() {
    document.getElementById('renameModal').classList.add('active');
    document.getElementById('renameZombieId').focus();
}

function closeRenameModal() {
    document.getElementById('renameModal').classList.remove('active');
    document.getElementById('renameZombieId').value = '';
    document.getElementById('newZombieName').value = '';
}

function submitRename() {
    var zombieId = document.getElementById('renameZombieId').value;
    var newName = document.getElementById('newZombieName').value.trim();

    if (zombieId !== "" && newName !== "") {
        closeRenameModal();
        renameZombie(parseInt(zombieId), newName);
    } else {
        alert('Please enter both Zombie ID and New Name!');
    }
}

// Add Enter key support for input fields only
document.getElementById('zombieName').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        submitZombie();
    }
});

document.getElementById('zombieIdInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        submitLevelup();
    }
});

document.getElementById('feedKittyId').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        submitFeedKitty();
    }
});

document.getElementById('feedZombieId').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        submitFeedKitty();
    }
});

document.getElementById('attackerZombieId').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        submitAttack();
    }
});

document.getElementById('targetZombieId').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        submitAttack();
    }
});

document.getElementById('renameZombieId').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        document.getElementById('newZombieName').focus();
    }
});

document.getElementById('newZombieName').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        submitRename();
    }
});

window.addEventListener('load', async () => {
    if (window.ethereum) {
        window.web3 = new Web3(ethereum);
        try {
            const accounts = await ethereum.enable();
            userAccount = accounts[0];
            $("#accountInfo").html(`CONNECTED: ${userAccount.substring(0, 6)}...${userAccount.substring(38)}`);
            startApp()
        } catch (error) {
            $("#txStatus").html("❌ CONNECT METAMASK WALLET");
        }
    } else if (window.web3) {
        window.web3 = new Web3(web3.currentProvider);
        userAccount = web3.eth.accounts[0];
        $("#accountInfo").html(`CONNECTED: ${userAccount.substring(0, 6)}...${userAccount.substring(38)}`);
        startApp()
    } else {
        $("#txStatus").html("❌ INSTALL METAMASK");
    }
});

ethereum.on('accountsChanged', (accounts) => {
    window.location.reload();
});

ethereum.on('chainChanged', (chainId) => {
    window.location.reload();
});

createzombieButton.addEventListener('click', openCreateModal);

showZombieButton.addEventListener('click', () => {
    getZombiesByOwner(userAccount).then(displayZombies);
});

feedKittyButton.addEventListener('click', openFeedKittyModal);

levelupButton.addEventListener('click', openLevelupModal);

attackButton.addEventListener('click', openAttackModal);

// Add rename button listener with null check
const renameBtn = document.querySelector('.renameButton');
if (renameBtn) {
    renameBtn.addEventListener('click', openRenameModal);
} else {
    console.error('Rename button not found!');
}
