import VoiceAssistant from "./voiceAssistant";
const startButton = document.createElement("button");
startButton.id = "start-btn";
startButton.innerHTML = "Click to start";

let isStarted = false;
let processingWord = null;
const voiceAssistant = new VoiceAssistant();

async function processWord(word) {
  if (word !== "Background Noise") {
    console.log(word);
  }
  switch (word) {
    case "stop":
      stop();
      break;
    case "iji":
      scrollPage("down");
      break;
    case "verev":
      scrollPage("up");
      break;
    case "skizb":
      scrollPage("top");
      break;
    case "dandax":
      read();
      break;
    default:
  }

  processingWord = null;
}

function onListen(word) {
  if (processingWord) return;

  processingWord = word;
  processWord(word);
}

startButton.onclick = async () => {
  if (!isStarted) {
    //Start assistant
    startButton.innerText = "Starting...";
    await voiceAssistant.startAssistant(onListen);
    isStarted = true;
    startButton.innerText = "Stop Assistant";
  } else {
    //Stop assistant
    startButton.innerText = "Stopping...";
    await voiceAssistant.stopAssistant();
    isStarted = false;
    startButton.innerText = "Start Assistant";
  }
};

//////////////////////////////////////////////////////////
let is_start = false;
window.onload = function () {
  if (!is_start) {
    startButton.style = `
    outline: 0;
    border: 0;
    background-color: #2ecc71;
    padding: 7px 12px;
    color: #fff;
    font-size: 16px;
    font-weight: 600;
    border-radius: 5px;
    cursor: pointer;
    transition: all 250ms ease-in-out;
    position: absolute;
    z-index: 99999999999999999;
  `;
    document.body.prepend(startButton);
  }
};
let TOP = 100;
let READ = null;

function scrollPage(option) {
  switch (option.toLowerCase().trim()) {
    case "down":
      TOP += 800;
      break;
    case "up":
      TOP -= 800;
      break;
    default:
      TOP = 0;
  }

  window.scroll({
    top: TOP,
    behavior: "smooth",
  });
}

function read() {
  if (!READ) {
    READ = setInterval(() => {
      TOP += 150;
      window.scroll({
        top: TOP,
        behavior: "smooth",
      });
    }, 1000);
  }
}

function stop() {
  if (READ) {
    clearInterval(READ);
    READ = null;
  }
}
