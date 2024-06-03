let messageDiv;
let destinationUsername;
let textbox;
let latestMessageDate = new Date(0);
let errorP;

// get all messages sent after the latest rendered message
async function getMessages() {
  const response = await fetch(`/get_messages/${destinationUsername}?date=${latestMessageDate}`);
  const responseJson = await response.json();
  if (response.status !== 200) {
    errorP.innerText = responseJson.message;
    return;
  }
  responseJson.messages.forEach((message) => {
    const p = document.createElement('p');
    if (message.Source === destinationUsername) {
      p.className = 'destination';
    } else {
      p.className = 'source';
    }
    p.innerText = message.Message;
    latestMessageDate = message.Date;
    messageDiv.append(p);
  });
  messageDiv.scrollTop = messageDiv.scrollHeight;
}

// send a message to the destination user
async function sendMessage() {
  if (textbox.value !== '') {
    const message = textbox.value;
    const response = await fetch('/send_message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ destination: destinationUsername, message }),
    });
    const responseJson = await response.json();
    if (response.status !== 200) {
      errorP.innerText = responseJson.message;
    } else {
      errorP.innerText = '';
      textbox.value = '';
    }
  }
  getMessages();
}

// set global variables, add action listener to button and get messages every 5 seconds
window.onload = () => {
  messageDiv = document.getElementById('messages');
  destinationUsername = window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1);
  textbox = document.getElementById('textarea');
  errorP = document.getElementById('error-message');

  getMessages();
  setInterval(getMessages, 5000);
  document.getElementById('send-message').addEventListener('click', sendMessage);
};
