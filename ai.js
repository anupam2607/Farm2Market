const API_KEY = "AIzaSyAzW3SR19pAOmHIoNkzkV9j5b5ofc33sxM";
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent?key=${API_KEY}`;


const chatBox = document.getElementById("chat");
const inputBox = document.getElementById("inputBox");
const sendBtn = document.getElementById("sendBtn");

sendBtn.addEventListener("click", sendMessage);
inputBox.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});

function appendMessage(text, sender) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.textContent = `${sender === "user" ? "You" : "Bot"}: ${text}`;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const message = inputBox.value.trim();
  if (!message) return;

  appendMessage(message, "user");
  inputBox.value = "";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: message }
            ]
          }
        ]
      })
    });

    const data = await response.json();


    if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      const reply = data.candidates[0].content.parts[0].text;
      appendMessage(reply, "bot");
    } else {
      appendMessage("❌ No valid response from Gemini.", "bot");
      console.log("Full response:", data);
    }

  } catch (err) {
    appendMessage("❌ Error reaching Gemini API.", "bot");
    console.error(err);
  }
}