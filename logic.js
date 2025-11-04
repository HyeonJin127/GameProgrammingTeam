// ==========================================
// 1. (수정) index (2).html 의 최신 게임 데이터
// ==========================================

const ALL_EVENTS = [
    {
        id: "mystery_merchant",
        name: "수상한 상인",
        itemIds: [
            { itemID: "medium_potion", weight: 70 },
            { itemID: "large_potion", weight: 20 },
            { itemID: "str_potion", weight: 10 },
        ]
    },
    {
        id: "shop",
        name: "상점",
        itemIds: [ "small_potion", "medium_potion", "large_potion" ]
    },
    //몬스터 구조 (baseStats)
    {
        id: "spider",
        name: "거미",
        baseStats: { baseHp: 10, baseAttack: 2, baseDefense: 4 },
        reward: {
            goldRange: { min: 1, max: 5 },
            itemIds: [
                { itemID: "small_potion", weight: 45 },
                { itemID: "str_potion", weight: 5 },
                { itemID: null, weigth: 50 }, // null: 아이템 없음
            ]
        }
    },
    {
        id: "wolf",
        name: "늑대",
        baseStats: { baseHp: 10, baseAttack: 4, baseDefense: 2 },
        reward: {
            goldRange: { min: 1, max: 5 },
            itemIds: [
                { itemID: "small_potion", weight: 45 },
                { itemID: "str_potion", weight: 5 },
                { itemID: null, weigth: 50 },
            ]
        }
    },
    {
        id: "bear",
        name: "곰",
        baseStats: { baseHp: 50, baseAttack: 7, baseDefense: 9 },
        reward: {
            goldRange: { min: 10, max: 20 },
            itemIds: [
                { itemID: "medium_potion", weight: 40 },
                { itemID: "str_potion", weight: 20 },
                { itemID: null, weigth: 40 },
            ]
        }
    },
    {
        id: "head_wolf",
        name: "우두머리 늑대",
        baseStats: { baseHp: 40, baseAttack: 10, baseDefense: 5 },
        reward: {
            goldRange: { min: 10, max: 20 },
            itemIds: [
                { itemID: "medium_potion", weight: 40 },
                { itemID: "str_potion", weight: 20 },
                { itemID: null, weigth: 40 },
            ]
        }
    },
    {
        id: "goblin",
        name: "고블린",
        baseStats: { baseHp: 10, baseAttack: 3, baseDefense: 3 },
        reward: {
            goldRange: { min: 1, max: 5 },
            itemIds: [
                { itemID: "small_potion", weight: 45 },
                { itemID: "str_potion", weight: 5 },
                { itemID: null, weigth: 50 },
            ]
        }
    },
    {
        id: "ork",
        name: "오크",
        baseStats: { baseHp: 50, baseAttack: 8, baseDefense: 8 },
        reward: {
            goldRange: { min: 10, max: 20 },
            itemIds: [
                { itemID: "medium_potion", weight: 40 },
                { itemID: "str_potion", weight: 30 },
                { itemID: null, weigth: 30 },
            ]
        }
    },
];

const ALL_STAGES = [
    //index (2).html 데이터 반영
    {
        id: "forest_enter",
        name: "숲 초입부",
        description: "",
        randomEvent: [
            { eventID: "mystery_merchant", weight: 10 },
            { eventID: "spider", weight: 45 },
            { eventID: "wolf", weight: 45 },
        ],
        // nextStages는 STAGE_PROGRESSION_MAP에서 관리하므로 무시
    },
    {
        id: "forest_center",
        name: "숲의 중심",
        description: "왠지 위험한 기분이 든다",
        randomEvent: [
            { eventID: "bear", weight: 50 },
            { eventID: "head_wolf", weight: 50 },
        ]
    },
    {
        id: "cave_enter",
        name: "동굴 입구",
        description: "",
        randomEvent: [
            { eventID: "mystery_merchant", weight: 10 },
            { eventID: "goblin", weight: 90 },
        ]
    },
    {
        id: "cave_deep",
        name: "동굴 깊은 곳",
        description: "",
        randomEvent: [
            { eventID: "ork", weight: 100 },
        ]
    },
];

const ALL_ITEMS = [
    //index (2).html 데이터 반영
    {
        id: "small_potion",
        name: "소형 물약",
        description: "5 ~ 10 범위내 hp만큼 회복됩니다.",
        type: "consumable",
        priceRange: { minPrice: 5, maxPrice: 10 },
        effect: { 
            stat: "hp",
            value: { minValue: 5, maxValue: 10 },
            direction: "POSITIVE"
        },
    },
    {
        id: "medium_potion",
        name: "중형 물약",
        description: "15 ~ 25 범위내 hp만큼 회복됩니다.",
        type: "consumable",
        priceRange: { minPrice: 10, maxPrice: 15 },
        effect: { 
            stat: "hp",
            value: { minValue: 15, maxValue: 25 },
            direction: "POSITIVE"
        },
    },
    {
        id: "large_potion",
        name: "대형 물약",
        description: "40 ~ 50 범위내 hp만큼 회복됩니다.",
        type: "consumable",
        priceRange: { minPrice: 20, maxPrice: 30 },
        effect: { 
            stat: "hp",
            value: { minValue: 40, maxValue: 50 },
            direction: "POSITIVE"
        },
    },
    {
        id: "str_potion",
        name: "수상한 힘의 물약",
        description: "1 ~ 5 만큼 힘 수치가 오르거나 내려갑니다.",
        type: "consumable",
        priceRange: { minPrice: 10, maxPrice: 15 },
        effect: { 
            stat: "str", // 'str'은 'attack'으로 매핑됨
            direction: "RANDOM",
            // ★ (수정) valueDrops 가중치 사용
            valueDrops: [
                { amount: 1, weigth: 25 },
                { amount: 2, weight: 40 },
                { amount: 3, weight: 20 },
                { amount: 4, weight: 10 },
                { amount: 5, weigth: 5 }
            ]
        },
    },
];

// ==========================================
// 2. (수정) v3 로직: 상태 변수 및 헬퍼 함수
// ==========================================

let player;
let currentStageData; // 현재 스테이지 정보
let currentEvent;     // 현재 만난 몬스터/상점
let gameState; 

// v2 스테이지 진행 로직
let currentAreaID;
let stageLevel;
const STAGE_PROGRESSION_MAP = {
    'forest_enter': { nextArea: 'forest_center', levels: 4 }, 
    'forest_center': { nextArea: 'cave_enter', levels: 1 },    
    'cave_enter': { nextArea: 'cave_deep', levels: 4 },
    'cave_deep': { nextArea: 'GAME_CLEAR', levels: 1 }
};

let titleEl, statsEl, resultEl, buttonEl, inventoryButtonEl;

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

/*weight/weigth 오타 모두 처리 */
function getWeightedRandom(array) {
    let totalWeight = 0;
    for (const item of array) {
        totalWeight += item.weight || item.weigth || 0;
    }
    let randomNum = Math.random() * totalWeight;
    for (const item of array) {
        const weight = item.weight || item.weigth || 0;
        if (randomNum < weight) {
            return item; // { eventID, weight } 또는 { itemID, weight } 또는 { amount, weight }
        }
        randomNum -= weight;
    }
    return array[0];
}


// ==========================================
// 3. (수정) v3 로직: UI 업데이트 함수
// ==========================================

/*스탯창에 ATK, DEF, Stage 레벨 표시 */
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

    // 스테이지 레벨 표시
    const areaInfo = STAGE_PROGRESSION_MAP[currentAreaID];
    const stageText = areaInfo ? `${currentStageData.name} (${stageLevel}/${areaInfo.levels})` : currentStageData.name;

    // ATK, DEF 표시
    statsEl.innerHTML = `HP: ${player.hp} / ${player.maxHp} | ATK: ${player.attack} | DEF: ${player.defense} | Gold: ${player.gold}`
                    + `<br>Stage: ${stageText}<br>인벤토리: ${inventoryText}`;
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
    buttonEl.style.display = showMain ? 'block' : 'none';
    inventoryButtonEl.style.display = showInventory ? 'block' : 'none';
}


// ==========================================
// 4. (수정) v3 로직: 게임 플레이 함수
// ==========================================

/*플레이어 스탯(ATK, DEF) 초기화 */
function startGame() {
    player = {
        hp: 100,
        maxHp: 100,
        attack: 10, // str -> attack
        defense: 5,  // defense 추가
        gold: 0,
        inventory: [] 
    };
    
    // 스테이지 초기화 (v2 로직)
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

/*몬스터 만날 시 baseStats -> currentHp 등으로 복사 */
function triggerRandomEvent() {
    const eventRoll = getWeightedRandom(currentStageData.randomEvent); 
    const eventData = findDataById(ALL_EVENTS, eventRoll.eventID);

    if (!eventData) {
        console.error(`이벤트 데이터를 찾을 수 없습니다: ${eventRoll.eventID}`);
        updateMainUI(currentStageData.name, "아무것도 발견하지 못했다.", "탐험하기");
        return;
    }

    //몬스터(baseStats)인지 상점인지 확인
    if (eventData.baseStats) {
        // 몬스터
        gameState = 'COMBAT';
        // (신규) 몬스터 생성: baseStats를 현재 스탯으로 복사
        currentEvent = {
            ...eventData, // name, reward 등 복사
            currentHp: eventData.baseStats.baseHp,
            attack: eventData.baseStats.baseAttack,
            defense: eventData.baseStats.baseDefense
        };
        updateMainUI(`몬스터 출현!`, `${currentEvent.name} (HP: ${currentEvent.currentHp})`, "공격하기");
        setUIForAction(true, false); 
    } 
    else if (eventData.id === "mystery_merchant" || eventData.id === "shop") {
        // 상점
        gameState = 'SHOPPING';
        currentEvent = { ...eventData }; // 상점은 단순 복사
        generateShopInventory(eventData); 
        displayShopUI(); 
    }
}

/*(공격력 - 방어력) 전투 공식 적용 */
function attackMonster() {
    let logMessage = "";

    // 1. 플레이어 공격
    const playerRawDamage = getRandomInt(player.attack - 2, player.attack + 2); // 기본 공격력
    const monsterDefense = currentEvent.defense;
    const playerDamage = Math.max(1, playerRawDamage - monsterDefense); // 최소 1 데미지
    
    currentEvent.currentHp -= playerDamage;
    logMessage += `[플레이어] ${currentEvent.name}에게 ${playerDamage}의 피해! (방어: ${monsterDefense})`;

    if (currentEvent.currentHp <= 0) {
        winCombat(); 
        return;
    }

    // 2. 몬스터 공격
    const monsterRawDamage = getRandomInt(currentEvent.attack - 1, currentEvent.attack + 1); // 몬스터 공격력
    const playerDefense = player.defense;
    const monsterDamage = Math.max(1, monsterRawDamage - playerDefense); // 최소 1 데미지

    player.hp -= monsterDamage;
    logMessage += `<br>[${currentEvent.name}] 플레이어에게 ${monsterDamage}의 피해! (방어: ${playerDefense})`;

    if (player.hp <= 0) {
        player.hp = 0;
        loseGame();
    } else {
        // 전투 지속
        updatePlayerStatsUI();
        updateMainUI('전투 중!', `${currentEvent.name} (HP: ${currentEvent.currentHp})`, "공격하기");
        resultEl.innerHTML = logMessage;
        setUIForAction(true, false); 
    }
}

/*스테이지 진행 로직 + itemID: null 처리 */
function winCombat() {
    const reward = currentEvent.reward;
    let gainedGold = 0;
    let resultMessage = `${currentEvent.name} 처치!`;

    // 1. 골드 획득
    if (reward.goldRange) {
        gainedGold = getRandomInt(reward.goldRange.min, reward.goldRange.max);
        player.gold += gainedGold;
        resultMessage += `<br>(+${gainedGold} Gold)`;
    }
    
    // 2. 아이템 드랍
    if (reward.itemIds && reward.itemIds.length > 0) {
        const droppedItemInfo = getWeightedRandom(reward.itemIds); 
        
        //itemID가 null이 아닌지 확인
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
    
    // 3.스테이지 진행 로직
    stageLevel++;
    const areaInfo = STAGE_PROGRESSION_MAP[currentAreaID];
    
    if (stageLevel > areaInfo.levels) {
        // 다음 지역 이동
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
        // 현재 지역 계속
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

/*게임 클리어 */
function winGame() {
    gameState = 'GAME_OVER'; // 재시작 가능하도록
    updatePlayerStatsUI();
    updateMainUI("★ GAME CLEAR ★", "모든 스테이지를 클리어했습니다!", "다시 시작하기");
    setUIForAction(true, false); // 인벤토리 숨김
}

// ==========================================
// 5. 상점 로직 함수
// ==========================================

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

function displayShopUI() {
    titleEl.textContent = currentEvent.name; 
    resultEl.innerHTML = ''; 
    resultEl.style.textAlign = 'left';
    setUIForAction(false, false); 

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

function exitShop() {
    gameState = 'EXPLORING';
    currentEvent = null;
    updateMainUI(currentStageData.name, '탐험을 계속합니다.', '탐험하기');
    setUIForAction(true, true); 
}


// ==========================================
// 6.인벤토리 및 아이템 사용
// ==========================================

function displayInventory() {
    gameState = 'INVENTORY';
    titleEl.textContent = '인벤토리';
    resultEl.innerHTML = ''; 
    resultEl.style.textAlign = 'left'; 
    setUIForAction(false, false); 

    if (player.inventory.length === 0) {
        resultEl.textContent = '가진 아이템이 없습니다.';
    }

    const inventoryCounts = {};
    for (const itemId of player.inventory) {
        inventoryCounts[itemId] = (inventoryCounts[itemId] || 0) + 1;
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

/*valueDrops (가중치) 또는 minValue/maxValue (범위)에 따라 효과 적용 */
function useItem(itemToUse) {
    const itemIndex = player.inventory.indexOf(itemToUse.id);
    if (itemIndex === -1) { /* (오류 처리) */ return; }
    player.inventory.splice(itemIndex, 1); 

    const effect = itemToUse.effect;
    let value = 0;

    //valueDrops (가중치)가 있는지 확인
    if (effect.valueDrops) {
        const drop = getWeightedRandom(effect.valueDrops);
        value = drop.amount;
    } 
    //valueDrops가 없으면 minValue/maxValue 사용
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
    //'str' 스탯을 'player.attack'에 적용
    else if (effect.stat === "str") {
        player.attack += changeValue;
        effectMessage = `공격력(ATK)이 ${changeValue}만큼 변동했습니다. (현재 ATK: ${player.attack})`;
    }

    alert(effectMessage);
    updatePlayerStatsUI(); 
    displayInventory(); // 인벤토리 새로고침
}


// ==========================================
// 7. 게임 시작 (HTML 로드 완료 후 실행)
// ==========================================

document.addEventListener('DOMContentLoaded', (event) => {
    initializeDOMElements();
    
    if (buttonEl) {
        buttonEl.onclick = handleMainAction;
    } else {
        console.error("메인 버튼 (id='main-button')을 찾을 수 없습니다.");
    }
    
    if (inventoryButtonEl) {
        inventoryButtonEl.onclick = handleInventoryAction;
    } else {
        console.error("인벤토리 버튼 (id='inventory-button')을 찾을 수 없습니다.");
    }

    gameState = 'START';
    updateMainUI("주사위 굴리기 RPG", "게임을 시작하세요!", "게임 시작");
    setUIForAction(true, true); 
});
