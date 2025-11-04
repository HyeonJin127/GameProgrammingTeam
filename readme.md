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

# 🏰 던전 오브 다이스 (Dungeon of Dice)

HTML5 기반의 **랜덤 RPG 게임** 입니다.  
주사위를 굴려 던전에 진입하는 세계관을 표현합니다.

이 인트로 페이지는 용암 게이지와 주사위 애니메이션을 통해 **로딩 + 진입 연출**을 제공합니다.

---

## 폴더 구조

/event
event.html # 메인 HTML (인트로 로직 포함)
intro.css # 스타일 정의 (외부 CSS)
gamelogo.png # 게임 로고 (PNG, 투명 배경 권장)

> ⚠️ `event.html`, `intro.css`, `gamelogo.png`는 **같은 폴더**에 있어야 합니다.

---

## 실행 방법

1. 위 세 파일을 같은 폴더에 둡니다.  
2. `event.html`을 브라우저로 열면 인트로 화면이 표시됩니다.  
3. 로딩이 완료되면  
   **“로딩 완료! 터치 해서 접속하세요!”** 문구가 뜹니다.
4. 화면을 클릭 / 터치 / `Enter` / `Space` 키로 **게임 진입**이 가능합니다.

---

## 주요 기능 요약

### 🎲 1. 용암 게이지 + 주사위 로딩바
- 주사위 토큰이 **용암 게이지 위를 따라 이동**하며 로딩이 진행됩니다.  
- 주사위는 실제 주사위 눈금처럼 굴러가며 바 끝에서도 **잘리지 않도록 보정**됨.
- 게이지 내부는 다음 레이어들로 구성됩니다:
  - `lava-flow` : 붉은 용암 흐름 애니메이션  
  - `lava-noise` : 미세한 용암 흔들림 효과  
  - `lava-bubbles` : 몽글거리는 용암 버블  
  - `lava-gloss` : 광택층 (빛 반사)

### 2. 주사위(토큰) 애니메이션
- `updateTokenPosition(%)` 함수로 위치 및 회전, 바운스 효과 제어  
- 주사위는 바의 픽셀 폭에 맞춰 중심 이동이 계산되며,  
  끝에서 잘리는 현상이 없도록 **여유 좌우폭(min/maxCenter)** 보정

### 3. 상태(Status) 텍스트 동적 변화
| 진행도 | 문구 |
|--------|------|
| 0~35%  | 자원을 불러오는 중… |
| 35~70% | 주사위를 굴리는 중… |
| 70~99% | 던전 문을 여는 중… |
| 100%   | 로딩 완료! 터치 해서 접속하세요! |

- 100% 이후 `.ready` 클래스로 **크기 확대 + 깜빡임(pulse)** 효과 적용.

### 4. 게임 로고 페이드인 / 확대
- 로딩 완료 시 `.show` 클래스를 적용하여 자연스러운 등장:
  ```css
  #logo { opacity:0; transform:scale(.9); transition:.8s ease; }
  #logo.show { opacity:1; transform:scale(1); }

#event.html — 인트로 화면 구조 & 로직 설명

<head>
meta viewport : 모바일 대응(반응형 스케일).
<title> : 브라우저 탭 제목.
<link rel="stylesheet" href="intro.css"> : 스타일을 외부 CSS로 분리.
<body>

**1)상단 UI**
```javascript
<div class="top-ui">
  <button id="sound" class="tiny-btn">🔊 SOUND</button>
</div>
```
- 사운드 온/오프 토글 버튼.
- 첫 사용자 제스처(클릭/터치)가 있어야 브라우저에서 소리 재생 허용(Web Audio 정책).

# 2) 인트로 컨테이너
```javascript
<div class="intro" id="intro">
  <img id="logo" src="./gamelogo.png" alt="게임 로고" />
  <div class="status" id="status">자원을 불러오는 중…</div>
  ...
</div>
```
- #logo : 로딩 100% 이후에 페이드-인+확대로 나타남.
- #status : 로딩 단계에 따라 문구가 바뀜(“주사위를 굴리는 중…”, “던전 문을 여는 중…”, 완료 메시지).

# 3) 용암 게이지 + 주사위 토큰 로딩바
```javascript
<div class="dice-bar" id="diceBar" role="progressbar" ...>
  <div class="track rock">
    <div class="fill" id="fill">
      <div class="lava-flow"></div>
      <div class="lava-noise"></div>
      <div class="lava-bubbles" id="lavaBubbles"></div>
      <div class="lava-gloss"></div>
    </div>
  </div>

  <div class="token" id="token" aria-hidden="true">
    <svg class="die" ...> ... </svg>
    <div class="shadow" id="shadow"></div>
  </div>
</div>
```
- role="progressbar" + aria-* : 접근성(스크린리더에 진행률 제공).
- .fill : width(%)로 진행률 표현. 내부에 용암 애니메이션 레이어 4종:
- .lava-flow : 좌→우 흐르는 컬러 그라데이션
- .lava-noise : 미세한 요동/노이즈
- .lava-bubbles : 몽글거리는 버블
- .lava-gloss : 상단 하이라이트
- .token : 주사위 토큰. 진행률에 따라 위치/회전/바운스.
- 픽셀 중심좌표 보정으로 바 끝에서 잘리지 않음.

 # 4) 클릭 베일 & 게이트(상/하 패널)
 ```javascript
<div class="click-veil" id="veil" aria-hidden="true"></div>
<div class="gate" id="gate"><div class="top"></div><div class="bottom"></div></div>
```
- #veil : 완료 후 화면 전체 클릭 영역(접속 안내 시점에만 표시).
- .gate : 화면 전환 애니메이션(상/하 패널이 중앙으로 닫힘).
- 전환 직전에 인트로를 숨겨서 잔상 없이 다음 화면으로 교체.
- 
