
$(document).ready(function () {
  const msgerForm = $(".msger-inputarea");
  const msgerInput = $(".msger-input");
  const msgerChat = $(".msger-chat");

  const BOT_IMG = "../bot.png";
  const PERSON_IMG = "../ava1-bg.webp";
  const BOT_NAME = "BOT";
  const PERSON_NAME = "Rahul";

  msgerForm.on("submit", function (event) {
    event.preventDefault();

    const userQuestion = msgerInput.val();
    if (!userQuestion) return;

    appendMessage(PERSON_NAME, PERSON_IMG, "right", userQuestion);
    msgerInput.val("");

    fetchBotResponse(userQuestion);
  });

  function appendMessage(name, img, side, text) {
    const msgHTML = `
        <div class="msg ${side}-msg">
        <div class="msg-img" style="background-image: url(${img})"></div>

        <div class="msg-bubble">
          <div class="msg-info">
            <div class="msg-info-name">${name}</div>
            <div class="msg-info-time">${formatDate(new Date())}</div>
          </div>

          <div class="msg-text">${text}</div>
        </div>
      </div>
    `;

    msgerChat.append(msgHTML);
    msgerChat.scrollTop(msgerChat.prop("scrollHeight"));
  }

  function fetchBotResponse(userQuestion) {
    fetch("http://127.0.0.1:5000/answer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question: userQuestion }),
    })
      .then((response) => response.json())
      .then((data) => {
        const botResponse = data.answer || "Sorry, I couldn't find an answer.";
        appendMessage(BOT_NAME, BOT_IMG, "left", botResponse);
      })
      .catch((error) => {
        console.error("Error fetching bot response:", error);
      });
  }

  // Utils
  function formatDate(date) {
    const h = ("0" + date.getHours()).slice(-2);
    const m = ("0" + date.getMinutes()).slice(-2);
    return `${h}:${m}`;
  }

  function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
});

// $(document).on("submit", "#loginForm", function (e) {
//   e.preventDefault();
//   const enteredEmail = $("#emailInput").val();
//   const enteredPassword = $("#passwordInput").val();
//   alert(
//     `Login successful. Please check your email ${enteredEmail} and password ${enteredPassword}.`
//   );
// });
