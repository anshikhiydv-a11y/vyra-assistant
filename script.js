const micButton = document.getElementById("micButton");
const status = document.querySelector(".status");
const instruction = document.querySelector(".instruction");
const response = document.getElementById("response");

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const BACKEND_URL =
  "https://xdocnwwqdgfluiepxbxi.supabase.co/functions/v1/smart-task";

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
    response.textContent = "";
  });

  recognition.onresult = async (event) => {
    const userSpeech = event.results[0][0].transcript;

    status.textContent = "THINKING";
    instruction.textContent = "VYRA IS PROCESSING...";
    response.textContent = "You said: " + userSpeech;

    try {
      const backendResponse = await fetch(BACKEND_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: userSpeech
        })
      });

      const data = await backendResponse.json();

      if (data.reply) {
        response.textContent =
          "You said: " + userSpeech + "\n\nVYRA: " + data.reply;
      } else if (data.error) {
        response.textContent = "Backend Error: " + data.error;
      }

      status.textContent = "RECEIVED";
      instruction.textContent = "RESPONSE RECEIVED";

    } catch (error) {
      console.error("Backend connection error:", error);

      status.textContent = "ERROR";
      instruction.textContent = "BACKEND CONNECTION FAILED";

      response.textContent =
        "VYRA could not connect to the backend.";
    }
  };

  recognition.onend = () => {
    if (status.textContent === "LISTENING") {
      status.textContent = "STANDBY";
      instruction.textContent = "TAP TO SPEAK";
    }
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
