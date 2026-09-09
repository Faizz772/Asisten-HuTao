// ===== PARTICLE BACKGROUND =====
(function createParticles() {
  const container = document.getElementById('particles');
  const count = 80;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 4 + 2;
    p.style.width = size + 'px';
    p.style.height = size + 'px';
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDuration = (Math.random() * 12 + 8) + 's';
    p.style.animationDelay = (Math.random() * 10) + 's';
    p.style.opacity = Math.random() * 0.5 + 0.2;
    container.appendChild(p);
  }
})();

// ===== CHAT LOGIC =====
const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// Welcome message
const welcomeMessages = [
  "🍡 Nihao! Aku Hutao, Direktur Funeral Parlor ke-77! Hehe, ada yang bisa aku bantu hari ini?",
  "🌸 Hai hai~ Hutao siap temani kamu! Mau tanya tugas atau sekadar ngobrol?",
  "✨ Wah, ada tamu baru! Santai aja, hidup itu kayak bunga, mekar dan layu, yang penting nikmati!"
];
const randomWelcome = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];

setTimeout(() => {
  addMessage(randomWelcome, 'bot');
}, 400);

function addMessage(text, sender) {
  const div = document.createElement('div');
  div.classList.add('message', sender);
  div.textContent = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function showTyping() {
  const div = document.createElement('div');
  div.className = 'typing-indicator';
  div.id = 'typing-indicator';
  for (let i = 0; i < 3; i++) {
    const span = document.createElement('span');
    div.appendChild(span);
  }
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function hideTyping() {
  const el = document.getElementById('typing-indicator');
  if (el) el.remove();
}

async function sendMessage() {
  const msg = userInput.value.trim();
  if (!msg) return;

  addMessage(msg, 'user');
  userInput.value = '';
  userInput.disabled = true;
  sendBtn.disabled = true;

  showTyping();

  try {
    const res = await fetch('/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: msg })
    });
    const data = await res.json();
    hideTyping();

    if (res.ok) {
      // Tunda sebentar biar efek animasi terasa
      await new Promise(r => setTimeout(r, 300));
      addMessage(data.reply, 'bot');
    } else {
      addMessage('❌ Error: ' + (data.error || 'Terjadi kesalahan'), 'bot');
    }
  } catch (err) {
    hideTyping();
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
