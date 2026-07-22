const micButton = document.getElementById("micButton");
const status = document.querySelector(".status");
const instruction = document.querySelector(".instruction");

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
  status.textContent = "NOT SUPPORTED";
  instruction.textContent = "BROWSER NOT SUPPORTED";
} else {
  const recognition = new SpeechRecognition();

  recognition.lang = "en-IN";
  recognition.continuous = false;
  recognition.interimResults = false;

  micButton.addEventListener("click", () => {
    recognition.start();

    status.textContent = "LISTENING";
    instruction.textContent = "VYRA IS LISTENING...";
  });

  recognition.onresult = (event) => {
    const userSpeech = event.results[0][0].transcript;

    console.log("You said:", userSpeech);

    status.textContent = "RECEIVED";
    instruction.textContent = "VOICE RECEIVED";

    alert("You said: " + userSpeech);
  };

  recognition.onend = () => {
    status.textContent = "STANDBY";
    instruction.textContent = "TAP TO SPEAK";
  };

  recognition.onerror = (event) => {
    console.log("Speech recognition error:", event.error);

    status.textContent = "ERROR";
    instruction.textContent = "TRY AGAIN";

    setTimeout(() => {
      status.textContent = "STANDBY";
      instruction.textContent = "TAP TO SPEAK";
    }, 2000);
  };
}
