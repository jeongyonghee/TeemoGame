'use strict';

const MUSHROOM_SIZE = 75;
const BUSH_SIZE = 160;
const TEEMO_COUNT = 1;
const GAREN_COUNT = 1;
const MUSHROOM_COUNT = 4;
const BUSH_COUNT = 5;
const GAME_DURATION_SEC = 10;

let TEEMO_TOGGLE = false;


const field = document.querySelector('.game__field');
const fieldRect = field.getBoundingClientRect();

const gameBtn = document.querySelector('.game__button');
const timerIndicator = document.querySelector('.game__timer');
const gameScore = document.querySelector('.game__score');

const bush = document.querySelectorAll('.bush');
const bush_x = [bush[0].getBoundingClientRect().left - fieldRect.left, bush[1].getBoundingClientRect().x - fieldRect.left, bush[2].getBoundingClientRect().left - fieldRect.left, bush[3].getBoundingClientRect().left - fieldRect.left, bush[4].getBoundingClientRect().left - fieldRect.left] 

const bush_y = bush[0].getBoundingClientRect().y - fieldRect.height;
const bushRect = bush_x.sort(()=> Math.random() - 0.5);

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
let timer 
 






field.addEventListener('click', onFieldClick);
gameBtn.addEventListener('click', () => {
  if (started) {
    stopGame();
  } else {
    startGame();
  }
});
popUpRefresh.addEventListener('click', () => {
  startGame();
  hidePopUp();
});

function startGame() {
  started = true;
  initGame();
  teemoMove();
  showStopButton();
  showTimerAndScore();
  startGameTimer();
  playSound(bgSound);
}

function stopGame() {
  started = false;
  stopGameTimer();
  hideGameButton();
  showPopUpWithText('REPLAY❓');
  playSound(retrySound);
  stopSound(bgSound);
}

function finishGame(win) {
  started = false;
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
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  timerIndicator.innerHTML = `${minutes}:${seconds}`;
}

function showPopUpWithText(text) {
  popUpText.innerText = text;
  popUp.classList.remove('pop-up--hide');
}

function hidePopUp() {
  popUp.classList.add('pop-up--hide');
}




function onFieldClick(event) {
  if (!started) {
    return;
  }
  const target = event.target;
  if (target.matches('.teemo')) {
    target.remove();
    score++;
    playSound(effectSound);
    updateScoreBoard();
    if (score === TEEMO_COUNT) {
      finishGame(true);
    }
  } else if (target.matches('.garen')) {
    finishGame(false);
  }
}

function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}

function stopSound(sound) {
  sound.pause();
}

function updateScoreBoard() {
  gameScore.innerText = MUSHROOM_COUNT - score;
}
function initGame() {
  score = 0;
  field.innerHTML = '';
  gameScore.innerText = MUSHROOM_COUNT;
  
  addItem('teemo', TEEMO_COUNT, 'img/teemo_F.png');
  addItem('garen', GAREN_COUNT, 'img/garen_1.png');
  addItem('mushroom',MUSHROOM_COUNT,'img/find_mushroom.png')
  addItem('bush', BUSH_COUNT, 'img/bush_hide.png');
  teemoMove();
}


function addItem(className, count, imgPath) {
  const mushroom = document.querySelectorAll('.mushroom')
  const garen = document.querySelector('.garen');
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


function teemoMove(){
  document.addEventListener('keydown',(e)=>{
    const teemo = document.querySelector('.teemo');
    const mushroom = document.querySelectorAll('.mushroom');
    const garen = document.querySelector('.garen');
    const bush = document.querySelectorAll('.bush');
    
    let key = e.key;
    let x = parseInt(teemo.style.left || 360, 0);
    
    // switch 구문으로 바꿀것. case별로 설정해야함 
    console.log('티모',teemo.getBoundingClientRect().left)
    if (key === "ArrowLeft") {
      teemo.style.left = `${x - 80}px`;
    }
    if (key === "ArrowRight") {
      teemo.style.left = `${x + 80}px`;
    }
    if (key === "ArrowUp") {
      teemo.src = 'img/teemo_B.png';
      TEEMO_TOGGLE = true;
      
    }else{
      teemo.src = 'img/teemo_F.png';
      TEEMO_TOGGLE = false;
    }
    
    for(let i=0; i < mushroom.length; i++){
      if(mushroom[i].getBoundingClientRect().left === teemo.getBoundingClientRect().left && TEEMO_TOGGLE === true){
        mushroom[i].style.opacity = 1;
        mushroom[i].style.zIndex = 9;
        popUp.style.zIndex=99;
      }
      if(garen.getBoundingClientRect().left === teemo.getBoundingClientRect().left && TEEMO_TOGGLE === true){
        garen.style.opacity = 1;
        garen.style.zIndex = 9;
        popUp.style.zIndex=99;
      }
    }
    
    for(let j=0; j <bush.length ; j++){
        
        if(bush_open[j] + 40 === teemo.getBoundingClientRect().left && TEEMO_TOGGLE === true){
          bush[j].src = 'img/bush_open.png';
        }
      }
  })
}

