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
- event.html # 메인 HTML (인트로 로직 포함)
- intro.css # 스타일 정의 (외부 CSS)
- gamelogo.png # 게임 로고 (PNG, 투명 배경 권장)

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

---

## 코드별 상세 설명

### event.html — 인트로 화면 구조 & 로직

#### <head> 구성
- meta viewport : 모바일 기기 대응 및 반응형 확대 비율 설정  
- <title> : 브라우저 탭 제목 설정  
- <link rel="stylesheet" href="intro.css"> : 외부 CSS 파일 연결  

#### 인트로 레이아웃 구조

▪ 상단 사운드 토글 버튼
------------------------------------------------------------
<div class="top-ui">
  <button id="sound" class="tiny-btn">🔊 SOUND</button>
</div>
------------------------------------------------------------
- 사운드 온/오프를 제어하는 버튼  
- 클릭 시 AudioMgr.toggle() 호출, Web Audio API 정책으로 인해 사용자 입력 후만 작동

▪ 인트로 메인 영역
------------------------------------------------------------
<div class="intro" id="intro">
  <img id="logo" src="./gamelogo.png" alt="게임 로고" />
  <div class="status" id="status">자원을 불러오는 중…</div>
</div>
------------------------------------------------------------
- #logo : 로딩 100% 후 페이드인 + 확대 등장  
- #status : 로딩 중 텍스트 갱신 (“주사위를 굴리는 중…”, “던전 문을 여는 중…” 등)

▪ 용암 게이지 + 주사위 토큰 로딩바
------------------------------------------------------------
<div class="dice-bar" id="diceBar">
  <div class="track rock">
    <div class="fill" id="fill">
      <div class="lava-flow"></div>
      <div class="lava-noise"></div>
      <div class="lava-bubbles" id="lavaBubbles"></div>
      <div class="lava-gloss"></div>
    </div>
  </div>
  <div class="token" id="token">
    <svg class="die">...</svg>
    <div class="shadow" id="shadow"></div>
  </div>
</div>
------------------------------------------------------------
- .fill 의 width를 통해 진행률 시각화  
- 내부 레이어 구성  
  - lava-flow : 붉은 용암 흐름  
  - lava-noise : 용암 흔들림 노이즈  
  - lava-bubbles : 버블 애니메이션  
  - lava-gloss : 광택 반사  

▪ 게이트 및 클릭 베일
------------------------------------------------------------
<div class="click-veil" id="veil"></div>
<div class="gate" id="gate">
  <div class="top"></div>
  <div class="bottom"></div>
</div>
------------------------------------------------------------
- #veil : 로딩 완료 후 클릭/터치 영역 활성화  
- .gate : 화면 전환 애니메이션 (상하 닫힘)


------------------------------------------------------------
### JavaScript 로직
------------------------------------------------------------

🎲 주사위 눈 관리
------------------------------------------------------------
function setFace(n){
  die.querySelectorAll('.pip').forEach(el=>{
    el.style.display = el.classList.contains('f'+n) ? 'block' : 'none';
  });
}
------------------------------------------------------------
- SVG 내부의 점(pip)을 숨기거나 표시해 1~6 눈 구현

주사위 이동/회전/바운스 처리
------------------------------------------------------------
function updateTokenPosition(percentage){
  const bw = diceBar.clientWidth;
  const tw = token.offsetWidth || 44;
  const centerX = (tw/2) + (bw - tw) * (percentage/100);
  token.style.left = centerX + 'px';
  token.style.transform = `translate(-50%,-50%) rotate(${percentage*3}deg)`;
  const bob = Math.sin(percentage/100 * Math.PI * 2) * 6;
  token.style.transform += ` translateY(${-Math.abs(bob)}px)`;
}
------------------------------------------------------------
- 로딩바의 실제 픽셀 단위를 기준으로 이동  
- 회전 + 위아래 바운스 + 그림자 크기 보정  

용암 버블 생성
------------------------------------------------------------
function spawnBubble(){
  const b = document.createElement('span');
  b.className = 'bubble';
  const x = Math.random()*100;
  const s = 6 + Math.random()*10;
  b.style.left = x + '%';
  b.style.width = s + 'px';
  b.style.height = s + 'px';
  const dur = 1000 + Math.random()*1400;
  bubbles.appendChild(b);
  b.animate([
    { transform:'translate(-50%,6px) scale(.8)', opacity:0 },
    { transform:'translate(-50%,-26px) scale(1)', opacity:.9, offset:.2 },
    { transform:'translate(-50%,-58px) scale(.9)', opacity:0 }
  ], { duration: dur, easing:'cubic-bezier(.3,.8,.2,1)' });
  setTimeout(()=> b.remove(), dur+30);
}
------------------------------------------------------------
- 무작위 크기/위치의 버블을 생성해 부드럽게 떠오르는 효과  

사운드 매니저
------------------------------------------------------------
const AudioMgr = (()=>{ ... })();
------------------------------------------------------------
- Web Audio API로 구현된 미니 사운드 시스템  
- fire() : 로딩 완료 시 불타는 듯한 음  
- beep(freq, dur) : 단일 비프  
- toggle() : 음소거 토글 + 버튼 상태 갱신  

로딩 시뮬레이션
------------------------------------------------------------
const timer = setInterval(()=>{
  load = Math.min(100, load + (load<75? Math.random()*8 : Math.random()*3 + 1));
  fill.style.width = load + '%';
  updateTokenPosition(load);

  if(!bubbleTimer) bubbleTimer = setInterval(spawnBubble, 180);
  if(load>35 && load<70) statusEl.textContent='주사위를 굴리는 중…';
  if(load>=70 && load<100) statusEl.textContent='던전 문을 여는 중…';

  if(load>=100){
    clearInterval(timer); clearInterval(rollTimer); clearInterval(bubbleTimer);
    setFace(6); updateTokenPosition(100);
    AudioMgr.fire();
    diceBar.classList.add('hidden');
    requestAnimationFrame(()=> logo.classList.add('show'));
    statusEl.textContent='로딩 완료! 터치 해서 접속하세요!';
    statusEl.classList.add('ready');
    veil.classList.add('on');
    ready = true;
  }
}, 95);
------------------------------------------------------------
- 가짜 로딩 진행률을 시뮬레이션  
- 단계별 문구 자동 변경  
- 100% 도달 시  
  - 로딩바 숨김  
  - 로고 등장  
  - 사운드 재생  
  - 클릭 가능 상태로 전환  

게이트 전환 (던전 입장)
------------------------------------------------------------
function openGateAndEnter(){
  veil.classList.remove('on');
  intro.style.visibility = 'hidden';
  intro.style.opacity = '0';
  gate.classList.add('open');
  setTimeout(()=>{
    document.body.innerHTML =
      '<div style="display:grid;place-items:center;height:100vh;background:var(--bg);color:#fff;font-size:2.5rem;font-weight:900;">던전 입장!</div>';
  }, 720);
}
------------------------------------------------------------
- 클릭 시 인트로 즉시 숨김  
- 게이트 애니메이션 실행  
- 완료 후 “던전 입장!” 화면으로 전환  


------------------------------------------------------------
### intro.css — 스타일 정의 요약
------------------------------------------------------------

| 섹션 | 설명 |
|------|------|
| :root | 색상, 강조 컬러 등 전역 변수 설정 |
| html, body | 전체 레이아웃 및 다크 배경 적용 |
| #logo | 페이드인 / 스케일 업 애니메이션 |
| .status | 로딩 상태 문구, 완료 시 크기 확대 + 깜빡임 |
| .dice-bar | 로딩바 베이스, 내부 레이어 용암 효과 |
| .token / .shadow | 주사위 크기 및 그림자 효과 |
| .gate | 게이트 상/하 패널 닫힘 애니메이션 (부드러운 블랙 그라데이션) |


------------------------------------------------------------
### 동작 흐름 요약
------------------------------------------------------------

1. 페이지 로드 → 가짜 로딩 시작  
2. 주사위 굴림 + 버블 + 상태 문구 변경  
3. 100% → 로고 등장 + 효과음 재생  
4. 터치/클릭/Enter → 인트로 숨김 + 게이트 닫힘  
5. 게이트 애니메이션 종료 후 → “던전 입장!” 화면 표시  


------------------------------------------------------------
💡 요약
------------------------------------------------------------
event.html 은 던전 게임의 인트로 씬을 담당하며,  
intro.css 는 시각적 연출과 애니메이션을 담당합니다.  
두 파일이 함께 작동하여 로딩·효과음·애니메이션·전환이 완성됩니다.
