import * as SpeechCommands from "@tensorflow-models/speech-commands";
const VoiceModelMetadata = { tfjsSpeechCommandsVersion: "0.4.0", modelName: "TMv2", timeStamp: "2021-03-26T18:25:49.755Z", wordLabels: ["Background Noise", "down", "top", "stop", "scroll", "up"] }

// import VoiceModel from "../AI_MODELS/voice_model/model.json";
// import VoiceModelMetadata from "../AI_MODELS/voice_model/metadata.json";
export default class VoiceAssistant {
  constructor() {
    this.options = {
      includeSpectogram: true,
      overlapFactor: 0.5,
      invokeCallbackOnNoiseAndUnkown: false,
      probabilityThershold: 0.75,
    };
  }

  async buildModel() {
    const recognizer = SpeechCommands.create(
      "BROWSER_FFT",
      undefined,
      chrome.extension.getURL("/model.json"),
      VoiceModelMetadata
    );

    await recognizer.ensureModelLoaded();

    return recognizer;
  }

  async startAssistant(onListen) {
    this.recognizer = await this.buildModel();

    const classLabels = this.recognizer.wordLabels();

    this.recognizer.listen((result) => {
      const scores = result.scores;

      const wordScore = scores.reduce((previousValue, value) => {
        // console.log("_______", value);
        if (previousValue) {
          if (previousValue > value) return previousValue;
        }
        return value;
      });

      const wordIdx = scores.findIndex((v) => v === wordScore);
      const word = classLabels[wordIdx];

      if (onListen) onListen(word);
    }, this.options);
  }

  async stopAssistant() {
    await this.recognizer.stopListening();
  }

  saySpeech(text) {
    const speech = new window.SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(speech);
  }
}
