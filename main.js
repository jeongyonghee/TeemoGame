'use strict';

const MUSHROOM_SIZE = 75;
const BUSH_SIZE = 160;
const TEEMO_COUNT = 1;
const TEEMO_BAG = 1;
const GAREN_COUNT = 1;
const MUSHROOM_COUNT = 4;
const BUSH_COUNT = 5;
const GAME_DURATION_SEC = 10;

let TEEMO_TOGGLE = false;


const field = document.querySelector('.game__field');
const fieldRect = field.getBoundingClientRect();

const game = document.querySelector('.game');
const gameBtn = document.querySelector('.game__button');
const gameInfo = document.querySelector('.game__info')
const gamePopUp = document.querySelector('.game__information')
const gamePopUpHide = document.querySelector('.fa-times-circle')
const timerIndicator = document.querySelector('.game__timer');
const gameScore = document.querySelector('.game__score');

const bush = document.querySelectorAll('.bush');
const bush_x = [bush[0].getBoundingClientRect().left - fieldRect.left, bush[1].getBoundingClientRect().x - fieldRect.left, bush[2].getBoundingClientRect().left - fieldRect.left, bush[3].getBoundingClientRect().left - fieldRect.left, bush[4].getBoundingClientRect().left - fieldRect.left] 
const bush_y = bush[0].getBoundingClientRect().y - fieldRect.height;
const bush_open = [bush[0].getBoundingClientRect().left, bush[1].getBoundingClientRect().left, bush[2].getBoundingClientRect().left, bush[3].getBoundingClientRect().left, bush[4].getBoundingClientRect().left] 

const popUp = document.querySelector('.pop-up');
const popUpText = document.querySelector('.pop-up__message');
const popUpRefresh = document.querySelector('.pop-up__refresh');

const effectSound = new Audio('./sound/carrot_pull.mp3');
const retrySound = new Audio('./sound/retry.mp3');
const bgSound = new Audio('./sound/bg.mp3');
const alertSound = new Audio('./sound/alert.mp3');
const winSound = new Audio('./sound/game_win.mp3');
 
let started = false;
let score = 0;
let timer = undefined;
let keyD = false; 


gameBtn.addEventListener('click', () => {
  if (started) {
    stopGame();
  }else {
    startGame();
  }
});

popUpRefresh.addEventListener('click', () => {
  startGame();
  hidePopUp();
});

gameInfo.addEventListener('click',()=>{
  gamePopUp.style.display = 'block';
  gameInfo.style.visibility = 'hidden';
})
gamePopUpHide.addEventListener('click',()=>{
  gamePopUp.style.display = 'none';
  gameInfo.style.visibility = 'visible';
})

function startGame() {
  started = true;
  keyD = true;
  gameScore.style.opacity = 1;
  timerIndicator.style.opacity = 1;
  
  initGame();
  showStopButton();
  showTimerAndScore();
  startGameTimer();
  playSound(bgSound);
}

function stopGame() {
  started = false;
  keyD = false;
  stopGameTimer();
  hideGameButton();
  showPopUpWithText('REPLAY❓');
  playSound(retrySound);
  stopSound(bgSound);
}

function finishGame(win) {
  started = false;
  keyD = false;
  hideGameButton();
  if (win) {
    playSound(winSound);
  } else {
    playSound(alertSound);
    
  }
  stopGameTimer();
  stopSound(bgSound);
  showPopUpWithText(win ? 'YOU WON 🎉' : 'YOU LOST 💩');
}

function showStopButton() {
  const icon = gameBtn.querySelector('.fas');
  icon.classList.add('fa-stop');
  icon.classList.remove('fa-play');
  gameBtn.style.visibility = 'visible';
}


function hideGameButton() {
  gameBtn.style.visibility = 'hidden';
}

function showTimerAndScore() {
  timerIndicator.style.visibility = 'visible';
  gameScore.style.visibility = 'visible';
}

function startGameTimer() {
  let remainingTimeSec = GAME_DURATION_SEC;
  updateTimerText(remainingTimeSec);
  timer = setInterval(() => {
    if (remainingTimeSec <= 0) {
      clearInterval(timer);
      finishGame(score === TEEMO_COUNT);
      return;
    }
    updateTimerText(--remainingTimeSec);
  }, 1000);
}

function stopGameTimer() {
  clearInterval(timer);
}

function updateTimerText(time) {
  // const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  timerIndicator.innerHTML = `${seconds}`;
}

function showPopUpWithText(text) {
  popUpText.innerText = text;
  popUp.classList.remove('pop-up--hide');
}

function hidePopUp() {
  popUp.classList.add('pop-up--hide');
}

function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}

function stopSound(sound) {
  sound.pause();
}

function updateScoreBoard() {
  gameScore.innerHTML = `<p class="blue">[팀]정용희(티모):</p> ${MUSHROOM_COUNT - score}개 남았다.`;
}
function initGame() {
  score = 0;
  field.innerHTML = '';
  gameScore.innerHTML = `<p class="blue">[팀]정용희(티모):</p> ${MUSHROOM_COUNT}개 남았다.`;
  addItem('teemo', TEEMO_COUNT, 'img/teemo_F.png');
  // addItem('teemo__bag',TEEMO_BAG,'img/bag.png');
  addItem('garen', GAREN_COUNT, 'img/garen_1.png');
  addItem('mushroom',MUSHROOM_COUNT,'img/find_mushroom.png')
  addItem('bush', BUSH_COUNT, 'img/bush_hide.png');
}


function addItem(className, count, imgPath) {
  const mushroom = document.querySelectorAll('.mushroom')
  const garen = document.querySelector('.garen');
  const bushRect = bush_x.sort(()=> Math.random() - 0.5);
  for(let i=0; i<count; i++){
    const item = document.createElement('img');
    item.setAttribute('class', className);
    item.setAttribute('src', imgPath);
    for(let j=0; j < mushroom.length; j++){
      garen.style.position = 'absolute';
      garen.style.top = `${bush_y}px`;
      garen.style.opacity = 0;

      mushroom[j].style.opacity = 0;
      mushroom[j].style.position = 'absolute';
      mushroom[j].style.top = `${bush_y}px`
      
      garen.style.left = `${bushRect[4] + 40 }px`
      
      mushroom[0].style.left = `${bushRect[0] + 40 }px`
      mushroom[1].style.left = `${bushRect[1] + 40 }px`
      mushroom[2].style.left = `${bushRect[2] + 40 }px`
      mushroom[3].style.left = `${bushRect[3] + 40 }px`
    }
    field.appendChild(item);
  }
}


document.addEventListener('keydown',(e)=>{
    const teemo = document.querySelector('.teemo');
    const teemoComputedStyle = getComputedStyle(teemo).left;
    const widthoutPx = Number(teemoComputedStyle.split('px')[0]);

    let key = e.key;
    let x = parseInt(teemo.style.left || 360, 0);
          
    if(keyD){
      if (key === "ArrowLeft") {
        if(widthoutPx <= 40){
          return;
        }else{
          teemo.style.left = `${x - 160}px`;
        } 
      }
      if (key === "ArrowRight") {
        if(widthoutPx >= 680){
          return;
        }else{
          teemo.style.left = `${x + 160}px`;
        }
      }
      if (key === "ArrowUp") {
        teemo.src = 'img/teemo_B.png'; 
        TEEMO_TOGGLE = true;
        onFieldMove()
      }else{
        teemo.src = 'img/teemo_F.png';
        TEEMO_TOGGLE = false;
      }
  }
})

function onFieldMove() {
  
  const teemo = document.querySelector('.teemo');
  const mushroom = document.querySelectorAll('.mushroom');
  const garen = document.querySelector('.garen');
  const bush = document.querySelectorAll('.bush');
  const teemoLeft = teemo.getBoundingClientRect().left;
  const garenLeft = garen.getBoundingClientRect().left;

  for(let i=0; i < mushroom.length; i++){
    if(mushroom[i].getBoundingClientRect().left === teemoLeft ){
      mushroom[i].style.opacity = 1;
      mushroom[i].style.scale = 1.3;
      mushroom[i].style.top = `${bush_y - 25}px`
      popUp.style.zIndex=99;
      playSound(effectSound);
      score++
      updateScoreBoard(); 
    }
    if(garenLeft === teemoLeft){
      garen.style.top = `${bush_y - 50}px`;
      garen.style.opacity = 1;
      garen.style.scale = 1.3;
      popUp.style.zIndex=99;
      gameScore.innerHTML = `<p class="blue">[팀]정용희(티모):</p> 정글차이 GG `;
      finishGame(false)
    }
  for(let j=0; j < bush.length ; j++){
      if(bush_open[j] + 40 === teemoLeft){
        bush[j].src = 'img/bush_open.png';
      }
    }
  if(score === MUSHROOM_COUNT){
    finishGame(true)
    gameScore.innerHTML = `<p class="blue">[팀]정용희(티모):</p> EASY`;    
  }
  }
}

