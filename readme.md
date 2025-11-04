# **핵심 로직기능 설명**

## **1\. HTML 연결**

이 로직이 정상적으로 작동하려면, design.html (또는 최종 HTML)에 **다음 id들이 반드시 존재**해야 합니다.

* id="main-button": 메인 행동 버튼 (탐험하기, 공격하기, 다시 시작하기)  
* id="inventory-button": 인벤토리 열기 버튼  
* id="player-stats": 플레이어 정보 (HP, STR, Gold, 인벤토리, 스테이지)가 표시될 영역  
* id="dice-result": 게임 로그, 몬스터 정보, 상점/인벤토리 아이템 목록이 표시될 메인 화면  
* id="main-title": 현재 스테이지 이름 (예: "숲 초입부")이 표시될 제목

## **2\. 핵심 변수 및 데이터**

### **player**

플레이어의 현재 상태 (체력, 힘, 돈, 인벤토리)를 저장하는 객체입니다.
~~~
let player \= {  
    hp: 100,  
    maxHp: 100,  
    str: 10,  
    gold: 0,  
    inventory: \[\]   
};
~~~
### **gameState**

플레이어의 현재 행동 상태를 저장하여 버튼 동작을 제어합니다.
~~~
let gameState; // 'START', 'EXPLORING', 'COMBAT', 'SHOPPING', 'INVENTORY', 'GAME\_OVER'
~~~
### **스테이지 진행 변수**
~~~
플레이어의 현재 스테이지 위치와 레벨을 추적합니다.

let currentAreaID;    // 현재 지역 (예: 'forest\_enter')  
let stageLevel;         // 현재 지역 내 레벨 (예: 1, 2, 3, 4\)  
let currentStageData;   // 현재 지역의 데이터 (ALL\_STAGES\[...\])
~~~
### **STAGE\_PROGRESSION\_MAP**

스테이지 순서와 레벨(전투 횟수)을 정의한 핵심 데이터입니다.
~~~
const STAGE\_PROGRESSION\_MAP \= {  
    'forest\_enter': { nextArea: 'forest\_center', levels: 4 }, // 1\~4 스테이지  
    'forest\_center': { nextArea: 'cave\_enter', levels: 1 },    // 5 스테이지 (보스)  
    'cave\_enter': { nextArea: 'cave\_deep', levels: 4 },  
    'cave\_deep': { nextArea: 'GAME\_CLEAR', levels: 1 }  
};
~~~
## **3\. 핵심 기능별 함수 설명**

### **가. 게임 시작 및 버튼 제어**

#### **document.addEventListener('DOMContentLoaded', ...)**

HTML 로딩이 완료되면 initializeDOMElements()로 HTML 요소들을 연결하고, handleMainAction과 handleInventoryAction 함수를 각 버튼의 onclick 이벤트에 할당합니다.
~~~
document.addEventListener('DOMContentLoaded', (event) \=\> {  
    initializeDOMElements();  
      
    if (buttonEl) {  
        buttonEl.onclick \= handleMainAction;  
    } else {  
        console.error("메인 버튼 (id='main-button')을 찾을 수 없습니다.");  
    }  
      
    if (inventoryButtonEl) {  
        inventoryButtonEl.onclick \= handleInventoryAction;  
    } else {  
        console.error("인벤토리 버튼 (id='inventory-button')을 찾을 수 없습니다.");  
    }

    gameState \= 'START';  
    updateMainUI("주사위 굴리기 RPG", "게임을 시작하세요\!", "게임 시작");  
    setUIForAction(true, true);   
});
~~~
#### **startGame()**

'게임 시작' 또는 '다시 시작하기' 버튼을 누르면 호출됩니다. player 객체와 스테이지 진행 변수(currentAreaID, stageLevel)를 초기화합니다.
~~~
function startGame() {  
    player \= {  
        hp: 100,  
        maxHp: 100,  
        str: 10,  
        gold: 0,  
        inventory: \[\]   
    };  
      
    currentAreaID \= 'forest\_enter';  
    currentStageData \= findDataById(ALL\_STAGES, currentAreaID);  
    stageLevel \= 1;

    gameState \= 'EXPLORING';

    updatePlayerStatsUI();  
    updateMainUI(currentStageData.name, "무엇을 하시겠습니까?", "탐험하기");  
    setUIForAction(true, true);   
}
~~~
#### **handleMainAction() (메인 버튼)**

gameState에 따라 '탐험', '공격', '재시작' 등 각기 다른 함수를 호출하는 메인 컨트롤러입니다.
~~~
function handleMainAction() {  
    switch (gameState) {  
        case 'START':  
        case 'GAME\_OVER':  
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
~~~
#### **handleInventoryAction() (인벤토리 버튼)**

gameState가 'COMBAT'(전투)이 아닐 때 displayInventory() 함수를 호출하여 인벤토리를 엽니다.
~~~
function handleInventoryAction() {  
    if (gameState \=== 'EXPLORING' || gameState \=== 'START' || gameState \=== 'GAME\_OVER') {  
        displayInventory();  
    }  
}
~~~
### **나. 탐험 및 전투**

#### **triggerRandomEvent()**

'탐험하기' 시 호출됩니다. 현재 스테이지(currentStageData)의 randomEvent 목록에서 getWeightedRandom() 헬퍼를 이용해 이벤트를 하나 뽑습니다.

* hp 속성이 있으면 몬스터로 간주, gameState를 COMBAT으로 변경.  
* 아니면 상점으로 간주, gameState를 SHOPPING으로 변경.
~~~
function triggerRandomEvent() {  
    const eventRoll \= getWeightedRandom(currentStageData.randomEvent);   
    const eventData \= findDataById(ALL\_EVENTS, eventRoll.eventID);  
      
    // ... (오류 처리) ...

    currentEvent \= { ...eventData }; 

    if (eventData.hp) {  
        gameState \= 'COMBAT';   
        updateMainUI(\`몬스터 출현\!\`, \`${currentEvent.name} (HP: ${currentEvent.hp})\`, "공격하기");  
        setUIForAction(true, false);   
    }   
    else if (eventData.id \=== "mystery\_merchant" || eventData.id \=== "shop") {  
        gameState \= 'SHOPPING';   
        generateShopInventory(eventData);   
        displayShopUI();   
    }  
}
~~~
#### **attackMonster()**

'공격하기' 시 호출됩니다. 플레이어의 str 기반 데미지와 몬스터의 기본 데미지를 계산하여 서로 HP를 깎습니다. 몬스터나 플레이어의 HP가 0 이하가 되면 winCombat() 또는 loseGame()을 호출합니다.
~~~
function attackMonster() {  
    // 플레이어 공격  
    const playerDamage \= getRandomInt(player.str \- 2, player.str \+ 2);   
    currentEvent.hp \-= playerDamage;  
    let logMessage \= \`\[플레이어\] ${currentEvent.name}에게 ${playerDamage}의 피해\!\`;

    if (currentEvent.hp \<= 0\) {  
        winCombat();   
        return;  
    }

    // 몬스터 공격  
    const monsterDamage \= getRandomInt(3, 8);   
    player.hp \-= monsterDamage;  
    logMessage \+= \`\<br\>\[${currentEvent.name}\] 플레이어에게 ${monsterDamage}의 피해\!\`;

    if (player.hp \<= 0\) {  
        player.hp \= 0;  
        loseGame();  
    } else {  
        // ... (전투 지속 UI 업데이트) ...  
    }  
}
~~~
#### **winCombat()**

전투 승리 시 호출됩니다.

1. 몬스터의 reward (골드, 아이템)를 계산하여 player 객체에 추가합니다.  
2. **(핵심)** stageLevel을 1 올립니다.  
3. STAGE\_PROGRESSION\_MAP을 확인하여 stageLevel이 최대치를 넘었으면 다음 지역(nextArea)으로 이동시킵니다.  
4. 만약 nextArea가 'GAME\_CLEAR'이면 winGame()을 호출합니다.
~~~
function winCombat() {  
    // 1\. 보상 획득 로직  
    const reward \= currentEvent.reward;  
    // ... (골드 획득) ...  
    if (reward.itemIds && reward.itemIds.length \> 0\) {  
        const droppedItemInfo \= getWeightedRandom(reward.itemIds);   
        const itemData \= findDataById(ALL\_ITEMS, droppedItemInfo.itemID);  
        if (itemData) {  
            player.inventory.push(itemData.id);   
        }  
    }  
      
    gameState \= 'EXPLORING';  
    currentEvent \= null;   
      
    // 2\. 스테이지 진행 로직  
    stageLevel++;  
    const areaInfo \= STAGE\_PROGRESSION\_MAP\[currentAreaID\];  
      
    if (stageLevel \> areaInfo.levels) {  
        // 다음 지역 이동  
        const nextAreaID \= areaInfo.nextArea;  
        if (nextAreaID \=== 'GAME\_CLEAR') {  
            winGame();  
            return;  
        }  
        currentAreaID \= nextAreaID;  
        currentStageData \= findDataById(ALL\_STAGES, currentAreaID);  
        stageLevel \= 1;  
        // ...  
    } else {  
        // ... (현재 지역 계속)  
    }  
      
    updatePlayerStatsUI();  
    updateMainUI(currentStageData.name, resultMessage, "탐험하기");  
    setUIForAction(true, true);   
}
~~~
### **다. 인벤토리 및 아이템 사용**

#### **displayInventory() / exitInventory()**

displayInventory: gameState를 INVENTORY로 바꾸고 dice-result 영역에 player.inventory 목록을 버튼으로 생성합니다. '탐험으로 돌아가기' 버튼도 함께 생성합니다.  
exitInventory: gameState를 EXPLORING (또는 GAME\_OVER)으로 되돌리고 메인 UI를 복구합니다.  
~~~
function displayInventory() {  
    gameState \= 'INVENTORY';  
    titleEl.textContent \= '인벤토리';  
    resultEl.innerHTML \= '';   
    setUIForAction(false, false); // 메인 버튼 숨김

    // ... (인벤토리 아이템 버튼 생성 로직) ...  
      
    // 닫기 버튼 생성  
    const exitButton \= document.createElement('button');  
    exitButton.textContent \= '탐험으로 돌아가기';  
    exitButton.className \= 'exit-button';  
    exitButton.onclick \= () \=\> exitInventory();   
    resultEl.appendChild(exitButton);  
}
~~~
#### **useItem()**

인벤토리에서 아이템 버튼 클릭 시 호출됩니다.

1. player.inventory 배열에서 아이템 ID를 1개 제거합니다.  
2. ALL\_ITEMS 데이터에서 해당 아이템의 effect를 찾습니다.  
3. effect의 direction('POSITIVE', 'RANDOM' 등)과 value(범위)에 따라 player.hp 또는 player.str 값을 변경합니다.  
4. updatePlayerStatsUI()와 displayInventory()를 다시 호출하여 화면을 갱신합니다.
~~~
function useItem(itemToUse) {  
    // 1\. 인벤토리에서 아이템 제거  
    const itemIndex \= player.inventory.indexOf(itemToUse.id);  
    // ... (오류 처리) ...  
    player.inventory.splice(itemIndex, 1); 

    // 2\. 아이템 효과 적용  
    const effect \= itemToUse.effect;  
    const value \= getRandomInt(effect.value.minValue, effect.value.maxValue);  
    let changeValue \= 0;  
    // ... (direction에 따른 changeValue 계산) ...

    // 3\. 스탯 적용  
    if (effect.stat \=== "hp") {  
        player.hp \+= changeValue;  
        if (player.hp \> player.maxHp) player.hp \= player.maxHp;   
    }   
    else if (effect.stat \=== "str") {  
        player.str \+= changeValue;  
    }

    alert(effectMessage);  
    updatePlayerStatsUI();   
    displayInventory(); // 인벤토리 새로고침  
}
~~~
### **라. 상점 기능**

#### **displayShopUI() / exitShop()**

triggerRandomEvent에서 상점 만났을 때 호출됩니다. displayInventory와 유사하게 dice-result 영역에 아이템 구매 버튼과 '가게 나가기' 버튼을 생성합니다.
~~~
function displayShopUI() {  
    titleEl.textContent \= currentEvent.name;   
    resultEl.innerHTML \= '';   
    setUIForAction(false, false); // 메인 버튼 숨김

    // ... (판매 아이템 버튼 생성 로직) ...

    // 나가기 버튼 생성  
    const exitButton \= document.createElement('button');  
    exitButton.textContent \= '가게 나가기';  
    exitButton.className \= 'exit-button';   
    exitButton.onclick \= () \=\> exitShop();   
    resultEl.appendChild(exitButton);  
}
~~~
#### **buyItem()**

상점에서 아이템 구매 버튼 클릭 시 호출됩니다. player.gold와 아이템 가격(itemToBuy.price)을 비교하여 구매를 처리합니다.
~~~
function buyItem(itemToBuy) {  
    if (player.gold \>= itemToBuy.price) {  
        player.gold \-= itemToBuy.price;  
        player.inventory.push(itemToBuy.id);  
        updatePlayerStatsUI();   
        alert(\`${itemToBuy.name}을(를) 구매했습니다.\`);  
    } else {  
        alert('골드가 부족합니다.');  
    }  
}
~~~  
