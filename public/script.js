const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

function addMessage(text, sender) {
  const div = document.createElement('div');
  div.classList.add('message', sender);
  div.textContent = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const msg = userInput.value.trim();
  if (!msg) return;
  addMessage(msg, 'user');
  userInput.value = '';
  userInput.disabled = true;
  sendBtn.disabled = true;

  const typingDiv = document.createElement('div');
  typingDiv.classList.add('message', 'bot');
  typingDiv.textContent = '🌸 Hutao sedang berpikir...';
  chatBox.appendChild(typingDiv);
  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    const res = await fetch('/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: msg })
    });
    const data = await res.json();
    chatBox.removeChild(typingDiv);
    if (res.ok) {
      addMessage(data.reply, 'bot');
    } else {
      addMessage('❌ Error: ' + (data.error || 'Terjadi kesalahan'), 'bot');
    }
  } catch (err) {
    chatBox.removeChild(typingDiv);
    addMessage('❌ Gagal terhubung ke server.', 'bot');
  } finally {
    userInput.disabled = false;
    sendBtn.disabled = false;
    userInput.focus();
  }
}

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendMessage();
});
