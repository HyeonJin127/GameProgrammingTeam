# 게임프로그래밍 팀 과제
- 팀장
  - 김현진 (hyeonjin127)
- 팀원
  - 조현창 (chc020604)
  - 조민혁 (kitdevjmh)
 
---

### ❌주의해야 할 명령어
- `reset`

---

### 목록
- [스테이지](#stage)
  - [스테이지 코드 구조](#stage_code)

- [몬스터/이벤트](#event)
  - [몬스터/이벤트 코드 구조](#event_code)

- [아이템](#item)
  - [아이템 구조 설명](#item_des)
  - [아이템 코드 구조](#item_code)
---

<h3 id="stage">스테이지</h3>

- 숲 ( 1~4스테이지 )
  - 초입부
  - 중심

- 동굴 ( 5스테이지, **보스** )
  - 입구
  - 깊은 곳

---

<h3 id="stage_code">스테이지 코드 구조</h3>

```javascript
{
    id: "forest_enter",
    name: "숲 초입부",
    description: "",
    // 이벤트 확률
    // eventID -> ALL_EVENTS 의 이벤트 중 하나
    // weight -> 이벤트가 나올 확률 ( 가중치 )
    randomEvent: [
        { eventID: "mystery_merchant", weight: 10 },
        { eventID: "spider", weight: 55 },
        { eventID: "wolf", weight: 35 },
    ]
}
```

---

<h3 id="event">몬스터/이벤트 ( 등장 확률 )</h3>

- 숲 초입부
  - `거미 [55%]`
  - `늑대 [35%]`
  - `수상한 상인 [10%]`

- 숲의 중심 
  - `우두머리 늑대 [50%]`
  - `곰 [50%]`

- 동굴 입구
  - `고블린 [65%]`
  - `곰 [25%]`
  - `수상한 상인 [10%]`

- 동굴 깊은 곳
  - `오크 [100%]`

<h3 id="event_code">몬스터/이벤트 코드 구조</h3>

```javascript
// 몬스터 구조 예시
{
    id: "goblin",
    name: "고블린",
    hp: 30,
    reward: {
        goldRange: {
            min: 10,
            max: 20
        },

        itemIds: [
            { itemID: "small_potion", weight: 40 },
            { itemID: "medium_potion", weight: 10 },
            { itemID: "str_potion", weight: 5 },
        ]
    }
}
```

```javascript
// 이벤트 구조 예시
{
    id: "mystery_merchant",
    name: "수상한 상인",

    // 등장하는 아이템들과 확률
    itemIds: [
        { itemID: "medium_potion", weight: 70 },
        { itemID: "large_potion", weight: 20 },
        { itemID: "str_potion", weight: 10 },
    ]
}
```
---

<h3 id="item">아이템</h3>

- `소형 물약`
  - 체력을 5 ~ 10 사이 값만큼 회복함

- `중형 물약`
  - 체력을 15 ~ 25 사이 값만큼 회복함

- `대형 물약`
  - 체력을 40 ~ 50 사이 값만큼 회복함

- `수상한 힘의 물약`
  - 힘 스탯(공격력)이 1 ~ 5 사이 값만큼 오르거나 떨어짐

<h3 id="item_des">아이템 구조 설명</h3>

|값|설명|
|---|---|
|id|아이템 id|
|name|아이템 이름|
|description|아이템 설명|
|type|아이템 분류 ( ex : consumable, weapon 등 )|
|priceRange|가격 범위|
|effect|아이템 효과|


- effect (아이템 효과)
  - stat -> 영향주는 부분
  - value -> 영향주는 값
  - direction -> 효과 적용 방향
    - "RANDOM"     ->  + 또는 - 중 50% 확률로 결정
    - "POSITIVE"   ->  항상 +
    - "NEGATIVE"   ->  항상 -

<h3 id="item_code">코드 예시</h3>

```javascript
{
    id: "small_potion",
    name: "소형 물약",
    description: "5 ~ 10 범위내 hp만큼 회복됩니다.",
    type: "consumable",
    priceRange: {
        minPrice: 5,
        maxPrice: 10,
    },
    effect: { 
        stat: "hp",
        value: {
            minValue: 5,
            maxValue: 10
        },
        
        direction: "POSITIVE"
    },
}
```

---