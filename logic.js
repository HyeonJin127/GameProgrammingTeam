// (참고) 이 로직은 'game_v4_with_intro.html' 파일에서 사용됩니다.
// HTML 인트로 애니메이션이 끝난 후,
// 'loadMainGameUI()' 함수가 'initializeDOMElements()'와 'startGame()'을
// 수동으로 호출하여 게임을 시작합니다.

// ==========================================
// 1. 게임 데이터 (v3)
// ==========================================
const ALL_EVENTS = [
    { id: "mystery_merchant", name: "수상한 상인", itemIds: [{ itemID: "medium_potion", weight: 70 }, { itemID: "large_potion", weight: 20 }, { itemID: "str_potion", weight: 10 }] },
    { id: "shop", name: "상점", itemIds: ["small_potion", "medium_potion", "large_potion"] },
    { id: "example", name: "예시", baseStats: { baseHp: 100, baseAttack: 100, baseDefense: 100, }, reward: { goldRange: { min: 1, max: 1000 }, itemIds: [{ itemID: "small_potion", weight: 40 }, { itemID: "medium_potion", weight: 25 }, { itemID: "large_potion", weight: 10 }, { itemID: "str_potion", weight: 25 }] } },
    { id: "spider", name: "거미", baseStats: { baseHp: 10, baseAttack: 2, baseDefense: 4, }, reward: { goldRange: { min: 1, max: 5 }, itemIds: [{ itemID: "small_potion", weight: 45 }, { itemID: "str_potion", weight: 5 }, { itemID: null, weigth: 50 }] } },
    { id: "wolf", name: "늑대", baseStats: { baseHp: 10, baseAttack: 4, baseDefense: 2, }, reward: { goldRange: { min: 1, max: 5 }, itemIds: [{ itemID: "small_potion", weight: 45 }, { itemID: "str_potion", weight: 5 }, { itemID: null, weigth: 50 }] } },
    { id: "bear", name: "곰", baseStats: { baseHp: 50, baseAttack: 7, baseDefense: 9, }, reward: { goldRange: { min: 10, max: 20 }, itemIds: [{ itemID: "medium_potion", weight: 40 }, { itemID: "str_potion", weight: 20 }, { itemID: null, weigth: 40 }] } },
    { id: "head_wolf", name: "우두머리 늑대", baseStats: { baseHp: 40, baseAttack: 10, baseDefense: 5, }, reward: { goldRange: { min: 10, max: 20 }, itemIds: [{ itemID: "medium_potion", weight: 40 }, { itemID: "str_potion", weight: 20 }, { itemID: null, weigth: 40 }] } },
    { id: "goblin", name: "고블린", baseStats: { baseHp: 10, baseAttack: 3, baseDefense: 3, }, reward: { goldRange: { min: 1, max: 5 }, itemIds: [{ itemID: "small_potion", weight: 45 }, { itemID: "str_potion", weight: 5 }, { itemID: null, weigth: 50 }] } },
    { id: "ork", name: "오크", baseStats: { baseHp: 50, baseAttack: 8, baseDefense: 8, }, reward: { goldRange: { min: 10, max: 20 }, itemIds: [{ itemID: "medium_potion", weight: 40 }, { itemID: "str_potion", weight: 30 }, { itemID: null, weigth: 30 }] } },
];
const ALL_STAGES = [
    { id: "forest_enter", name: "숲 초입부", description: "", randomEvent: [{ eventID: "mystery_merchant", weight: 10 }, { eventID: "spider", weight: 45 }, { eventID: "wolf", weight: 45 },], nextStages: ["forest_enter", "forest_ center"], },
    { id: "forest_center", name: "숲의 중심", description: "왠지 위험한 기분이 든다", randomEvent: [{ eventID: "bear", weight: 50 }, { eventID: "head_wolf", weight: 50 },], nextStages: ["forest_enter", "cave_ enter"], },
    { id: "cave_enter", name: "동굴 입구", description: "", randomEvent: [{ eventID: "mystery_merchant", weight: 10 }, { eventID: "goblin", weight: 90 },], nextStages: ["cave_enter", "cave_center"], },
    { id: "cave_deep", name: "동굴 깊은 곳", description: "", randomEvent: [{ eventID: "ork", weight: 100 },], nextStages: ["forest_enter", "cave_ center"], },
];
const ALL_ITEMS = [
    { id: "small_potion", name: "소형 물약", description: "5 ~ 10 범위내 hp만큼 회복됩니다.", type: "consumable", priceRange: { minPrice: 5, maxPrice: 10, }, effect: { stat: "hp", value: { minValue: 5, maxValue: 10 }, direction: "POSITIVE" }, },
    { id: "medium_potion", name: "중형 물약", description: "15 ~ 25 범위내 hp만큼 회복됩니다.", type: "consumable", priceRange: { minPrice: 10, maxPrice: 15, }, effect: { stat: "hp", value: { minValue: 15, maxValue: 25 }, direction: "POSITIVE" }, },
    { id: "large_potion", name: "대형 물약", description: "40 ~ 50 범위내 hp만큼 회복됩니다.", type: "consumable", priceRange: { minPrice: 20, maxPrice: 30, }, effect: { stat: "hp", value: { minValue: 40, maxValue: 50 }, direction: "POSITIVE" }, },
    { id: "str_potion", name: "수상한 힘의 물약", description: "1 ~ 5 만큼 힘 수치가 오르거나 내려갑니다.", type: "consumable", priceRange: { minPrice: 10, maxPrice: 15, }, effect: { stat: "str", direction: "RANDOM", valueDrops: [{ amount: 1, weigth: 25 }, { amount: 2, weight: 40 }, { amount: 3, weight: 20 }, { amount: 4, weight: 10 }, { amount: 5, weigth: 5 }] }, },
];

// ==========================================
// 2. 핵심 변수 및 헬퍼 함수
// ==========================================
let player;
let currentAreaID;
let stageLevel;
let currentStageData;
let currentEvent; 
let gameState; 
let titleEl, statsEl, resultEl, buttonEl, inventoryButtonEl;

const STAGE_PROGRESSION_MAP = {
    'forest_enter': { nextArea: 'forest_center', levels: 4 }, // 1~4 스테이지
    'forest_center': { nextArea: 'cave_enter', levels: 1 },    // 5 스테이지 (보스)
    'cave_enter': { nextArea: 'cave_deep', levels: 4 },
    'cave_deep': { nextArea: 'GAME_CLEAR', levels: 1 }
};

function initializeDOMElements() {
    titleEl = document.getElementById('main-title');
    statsEl = document.getElementById('player-stats');
    resultEl = document.getElementById('dice-result');
    buttonEl = document.getElementById('main-button');
    inventoryButtonEl = document.getElementById('inventory-button');
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function findDataById(array, id) {
    return array.find(item => item.id === id);
}

function getWeightedRandom(array) {
    let totalWeight = 0;
    for (const item of array) {
        totalWeight += item.weight || item.weigth || 0;
    }
    let randomNum = Math.random() * totalWeight;
    for (const item of array) {
        const weight = item.weight || item.weigth || 0;
        if (randomNum < weight) {
            return item;
        }
        randomNum -= weight;
    }
    return array[0];
}

// ==========================================
// 3. UI 업데이트 함수
// ==========================================
function updatePlayerStatsUI() {
    if (!statsEl) return;
    const inventoryCounts = {};
    for (const itemId of player.inventory) {
        inventoryCounts[itemId] = (inventoryCounts[itemId] || 0) + 1;
    }
    let inventoryText = '없음';
    if (player.inventory.length > 0) {
        inventoryText = Object.keys(inventoryCounts).map(id => {
            const item = findDataById(ALL_ITEMS, id);
            return `${item.name} x${inventoryCounts[id]}`;
        }).join(', ');
    }
    const areaInfo = STAGE_PROGRESSION_MAP[currentAreaID];
    statsEl.innerHTML = `<b>Stage: ${currentStageData.name} (${stageLevel}/${areaInfo.levels})</b><br>
                         HP: ${player.hp} / ${player.maxHp} | ATK: ${player.attack} | DEF: ${player.defense} | Gold: ${player.gold}<br>
                         인벤토리: ${inventoryText}`;
}

function updateMainUI(title, result, buttonText) {
    if (!titleEl || !resultEl || !buttonEl) return; 
    titleEl.textContent = title;
    resultEl.innerHTML = result; 
    buttonEl.textContent = buttonText;
    resultEl.style.flexDirection = 'column';
    resultEl.style.textAlign = 'center';
}

function setUIForAction(showMain = false, showInventory = false) {
    if (buttonEl) buttonEl.style.display = showMain ? 'block' : 'none';
    if (inventoryButtonEl) inventoryButtonEl.style.display = showInventory ? 'block' : 'none';
}

// ==========================================
// 4. 게임 플레이 함수
// ==========================================
function startGame() {
    player = {
        hp: 100, maxHp: 100, attack: 10, defense: 5, gold: 0, inventory: [] 
    };
    currentAreaID = 'forest_enter';
    currentStageData = findDataById(ALL_STAGES, currentAreaID);
    stageLevel = 1;
    gameState = 'EXPLORING';
    updatePlayerStatsUI();
    updateMainUI(currentStageData.name, "무엇을 하시겠습니까?", "탐험하기");
    setUIForAction(true, true); 
}

function handleMainAction() {
    switch (gameState) {
        case 'START':
        case 'GAME_OVER':
            startGame();
            break;
        case 'EXPLORING':
            triggerRandomEvent();
            break;
        case 'COMBAT':
            attackMonster();
            break;
    }
}

function handleInventoryAction() {
    if (gameState === 'EXPLORING' || gameState === 'START' || gameState === 'GAME_OVER') {
        displayInventory();
    }
}

function triggerRandomEvent() {
    const eventRoll = getWeightedRandom(currentStageData.randomEvent); 
    const eventData = findDataById(ALL_EVENTS, eventRoll.eventID);
    if (!eventData) {
        console.error(`이벤트 데이터를 찾을 수 없습니다: ${eventRoll.eventID}`);
        updateMainUI(currentStageData.name, "아무것도 발견하지 못했다.", "탐험하기");
        return;
    }
    if (eventData.baseStats) {
        gameState = 'COMBAT';
        currentEvent = {
            ...eventData, 
            currentHp: eventData.baseStats.baseHp,
            attack: eventData.baseStats.baseAttack,
            defense: eventData.baseStats.baseDefense
        };
        updateMainUI(`몬스터 출현!`, `${currentEvent.name} (HP: ${currentEvent.currentHp})`, "공격하기");
        setUIForAction(true, false); 
    } 
    else if (eventData.id === "mystery_merchant" || eventData.id === "shop") {
        gameState = 'SHOPPING';
        currentEvent = { ...eventData };
        displayShopUI(); 
    }
}

function attackMonster() {
    let logMessage = "";
    const playerRawDamage = getRandomInt(player.attack - 2, player.attack + 2);
    const monsterDefense = currentEvent.defense;
    const playerDamage = Math.max(1, playerRawDamage - monsterDefense); 
    currentEvent.currentHp -= playerDamage;
    logMessage += `[플레이어] ${currentEvent.name}에게 ${playerDamage}의 피해! (방어: ${monsterDefense})`;
    if (currentEvent.currentHp <= 0) {
        winCombat(); 
        return;
    }
    const monsterRawDamage = getRandomInt(currentEvent.attack - 1, currentEvent.attack + 1);
    const playerDefense = player.defense;
    const monsterDamage = Math.max(1, monsterRawDamage - playerDefense); 
    player.hp -= monsterDamage;
    logMessage += `<br>[${currentEvent.name}] 플레이어에게 ${monsterDamage}의 피해! (방어: ${playerDefense})`;
    if (player.hp <= 0) {
        player.hp = 0;
        loseGame();
    } else {
        updatePlayerStatsUI();
        updateMainUI('전투 중!', `${currentEvent.name} (HP: ${currentEvent.currentHp})`, "공격하기");
        resultEl.innerHTML = logMessage;
        setUIForAction(true, false); 
    }
}

function winCombat() {
    const reward = currentEvent.reward;
    let gainedGold = 0;
    let resultMessage = `${currentEvent.name} 처치!`;
    if (reward.goldRange) {
        gainedGold = getRandomInt(reward.goldRange.min, reward.goldRange.max);
        player.gold += gainedGold;
        resultMessage += `<br>(+${gainedGold} Gold)`;
    }
    if (reward.itemIds && reward.itemIds.length > 0) {
        const droppedItemInfo = getWeightedRandom(reward.itemIds); 
        if (droppedItemInfo && droppedItemInfo.itemID) {
            const itemData = findDataById(ALL_ITEMS, droppedItemInfo.itemID);
            if (itemData) {
                player.inventory.push(itemData.id); 
                resultMessage += `<br>(${itemData.name} 획득!)`;
            }
        } else {
            resultMessage += `<br>(아이템 없음)`;
        }
    }
    gameState = 'EXPLORING';
    currentEvent = null; 
    stageLevel++;
    const areaInfo = STAGE_PROGRESSION_MAP[currentAreaID];
    if (stageLevel > areaInfo.levels) {
        const nextAreaID = areaInfo.nextArea;
        if (nextAreaID === 'GAME_CLEAR') {
            winGame();
            return;
        }
        currentAreaID = nextAreaID;
        currentStageData = findDataById(ALL_STAGES, currentAreaID);
        stageLevel = 1;
        resultMessage += `<br><br><b>다음 지역 [${currentStageData.name}] (으)로 이동합니다!</b>`;
    } else {
        resultMessage += `<br><br>다음 스테이지 (${stageLevel}/${areaInfo.levels}) 로 이동합니다.`;
    }
    updatePlayerStatsUI();
    updateMainUI(currentStageData.name, resultMessage, "탐험하기");
    setUIForAction(true, true); 
}

function loseGame() {
    gameState = 'GAME_OVER';
    updatePlayerStatsUI();
    updateMainUI("게임 오버", "사망했습니다...", "다시 시작하기");
    setUIForAction(true, true); 
}

function winGame() {
    gameState = 'GAME_OVER'; 
    updatePlayerStatsUI();
    updateMainUI("★ GAME CLEAR ★", "모든 스테이지를 클리어했습니다!", "다시 시작하기");
    setUIForAction(true, false); 
}

// ==========================================
// 5. 인벤토리 및 아이템 사용
// ==========================================
function displayInventory() {
    gameState = 'INVENTORY';
    titleEl.textContent = '인벤토리';
    resultEl.innerHTML = ''; 
    resultEl.style.textAlign = 'left'; 
    setUIForAction(false, false); 
    const inventoryCounts = {};
    for (const itemId of player.inventory) {
        inventoryCounts[itemId] = (inventoryCounts[itemId] || 0) + 1;
    }
    if (player.inventory.length === 0) {
        resultEl.textContent = '가진 아이템이 없습니다.';
    }
    for (const itemId in inventoryCounts) {
        const item = findDataById(ALL_ITEMS, itemId);
        if (item && item.type === 'consumable') {
            const itemButton = document.createElement('button');
            itemButton.textContent = `사용: ${item.name} (x${inventoryCounts[itemId]}) - ${item.description}`;
            itemButton.onclick = () => useItem(item); 
            resultEl.appendChild(itemButton);
        }
    }
    const exitButton = document.createElement('button');
    exitButton.textContent = '탐험으로 돌아가기';
    exitButton.className = 'exit-button';
    exitButton.onclick = () => exitInventory(); 
    resultEl.appendChild(exitButton);
}

function exitInventory() {
    if (player.hp <= 0) {
        loseGame(); 
    } else {
        gameState = 'EXPLORING';
        updateMainUI(currentStageData.name, '탐험을 계속합니다.', '탐험하기');
        setUIForAction(true, true); 
    }
}

function useItem(itemToUse) {
    const itemIndex = player.inventory.indexOf(itemToUse.id);
    if (itemIndex === -1) { alert("오류: 해당 아이템이 없습니다."); displayInventory(); return; }
    player.inventory.splice(itemIndex, 1); 
    const effect = itemToUse.effect;
    let value = 0;
    if (effect.valueDrops) {
        const drop = getWeightedRandom(effect.valueDrops);
        value = drop.amount;
    } 
    else if (effect.value) { 
        value = getRandomInt(effect.value.minValue, effect.value.maxValue);
    }
    let changeValue = 0;
    if (effect.direction === "POSITIVE") {
        changeValue = value;
    } else if (effect.direction === "NEGATIVE") {
        changeValue = -value;
    } else if (effect.direction === "RANDOM") {
        changeValue = (Math.random() < 0.5) ? value : -value;
    }
    let effectMessage = "";
    if (effect.stat === "hp") {
        player.hp += changeValue;
        if (player.hp > player.maxHp) player.hp = player.maxHp; 
        effectMessage = `HP가 ${changeValue}만큼 회복되었습니다. (현재 HP: ${player.hp})`;
    } 
    else if (effect.stat === "str") {
        player.attack += changeValue;
        effectMessage = `공격력(ATK)이 ${changeValue}만큼 변동했습니다. (현재 ATK: ${player.attack})`;
    }
    alert(effectMessage);
    updatePlayerStatsUI(); 
    displayInventory(); 
}

// ==========================================
// 6. 상점 기능
// ==========================================
function displayShopUI() {
    titleEl.textContent = currentEvent.name; 
    resultEl.innerHTML = ''; 
    resultEl.style.textAlign = 'left'; 
    setUIForAction(false, false); 
    generateShopInventory(currentEvent); 
    for (const item of currentEvent.inventory) {
        const itemButton = document.createElement('button');
        itemButton.textContent = `구매: ${item.name} (${item.price} Gold) - ${item.description}`;
        itemButton.onclick = () => buyItem(item); 
        resultEl.appendChild(itemButton);
    }
    const exitButton = document.createElement('button');
    exitButton.textContent = '가게 나가기';
    exitButton.className = 'exit-button'; 
    exitButton.onclick = () => exitShop(); 
    resultEl.appendChild(exitButton);
}

function exitShop() {
    gameState = 'EXPLORING';
    currentEvent = null;
    updateMainUI(currentStageData.name, '탐험을 계속합니다.', '탐험하기');
    setUIForAction(true, true); 
}

function buyItem(itemToBuy) {
    if (player.gold >= itemToBuy.price) {
        player.gold -= itemToBuy.price;
        player.inventory.push(itemToBuy.id);
        updatePlayerStatsUI(); 
        alert(`${itemToBuy.name}을(를) 구매했습니다.`);
    } else {
        alert('골드가 부족합니다.');
    }
}

function generateShopInventory(eventData) {
    currentEvent.inventory = []; 
    let itemIDList = [];
    if (eventData.id === 'shop') {
        itemIDList = eventData.itemIds;
    } else if (eventData.id === 'mystery_merchant') {
        // (개선 필요) 현재는 상인도 모든 아이템 판매
        itemIDList = eventData.itemIds.map(item => item.itemID); 
    }
    for (const id of itemIDList) {
        const itemData = findDataById(ALL_ITEMS, id);
        if (itemData) {
            const price = getRandomInt(itemData.priceRange.minPrice, itemData.priceRange.maxPrice);
            currentEvent.inventory.push({ ...itemData, price: price });
        }
    }
}

