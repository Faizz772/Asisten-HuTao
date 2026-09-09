import express from 'express';
import cors from 'cors';
import axios from 'axios';
import FormData from 'form-data';
import { randomUUID } from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.DEEPAI_API_KEY;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const SYSTEM_PROMPT = `
Kamu adalah **Hutao**, Direktur Funeral Parlor ke-77 dari Wangsheng Funeral Parlor di Liyue. 
Kamu suka bercanda, centil, suka panggil orang dengan "kamu", sering ngomong "hehe", "ya", "hmm", dan suka bercerita tentang hal-hal aneh tapi menggemaskan.

Gaya bicaramu:
- Pakai logat yang santai, kadang nyampur bahasa Mandarin sedikit (misal: "nihao", "xiexie", "ya").
- Sering memberi semangat dengan cara unik, misal: "Santai aja, hidup itu kayak bunga, mekar dan layu, yang penting nikmati!"
- Kalau membantu tugas, tetap beri penjelasan jelas, tapi bungkus dengan candaan atau perumpamaan khas Hutao.
- Jangan terlalu formal, tapi tetap informatif.
- Maksimal 2-3 paragraf per jawaban, kecuali diminta lebih.
- Jika user minta bantuan tugas, jawab dengan semangat: "Wah, tugas ya? Hutao siap bantuin! Tapi inget, jangan lupa istirahat ya~"

Ingat: kamu adalah asisten AI yang ramah, lucu, dan suka membantu, dengan kepribadian Hutao.
`;

app.post('/chat', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Pesan kosong' });

  try {
    const sessionUUID = randomUUID();

    const saveForm = new FormData();
    saveForm.append('uuid', sessionUUID);
    saveForm.append('title', '');
    saveForm.append('chat_style', 'chat');
    saveForm.append('chat_model', 'standard');
    saveForm.append(
      'messages',
      JSON.stringify([
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: message }
      ])
    );

    await axios.post('https://api.deepai.org/save_chat_session', saveForm, {
      headers: {
        ...saveForm.getHeaders(),
        Origin: 'https://deepai.org',
        Referer: 'https://deepai.org/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/150.0.0.0 Safari/537.36'
      }
    });

    const chatForm = new FormData();
    chatForm.append('chat_style', 'chat');
    chatForm.append(
      'chatHistory',
      JSON.stringify([
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: message }
      ])
    );
    chatForm.append('model', 'standard');
    chatForm.append('session_uuid', sessionUUID);
    chatForm.append('sensitivity_request_id', randomUUID());
    chatForm.append('hacker_is_stinky', 'very_stinky');
    chatForm.append('enabled_tools', JSON.stringify(['image_generator', 'image_editor']));

    const { data } = await axios.post(
      'https://api.deepai.org/hacking_is_a_serious_crime',
      chatForm,
      {
        headers: {
          ...chatForm.getHeaders(),
          'api-key': API_KEY,
          Origin: 'https://deepai.org',
          Referer: 'https://deepai.org/',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/150.0.0.0 Safari/537.36'
        },
        responseType: 'text'
      }
    );

    let reply = typeof data === 'string' ? data.trim() : data;
    try {
      const parsed = typeof data === 'string' ? JSON.parse(data) : data;
      reply = parsed.output || parsed.text || parsed.response || parsed.message || JSON.stringify(parsed);
    } catch (_) {}

    if (typeof reply !== 'string') reply = String(reply);
    if (reply.length > 4000) reply = reply.slice(0, 4000) + '\n\n... [pesan dipotong]';
    reply = reply.replace(/(https?:\/\/[^\s]+)/g, '[$1]');

    res.json({ reply });
  } catch (e) {
    console.error(e);
    const errMsg = e?.response?.data
      ? typeof e.response.data === 'string'
        ? e.response.data
        : JSON.stringify(e.response.data)
      : e.message;
    res.status(500).json({ error: errMsg });
  }
});

// ===== EKSPOR UNTUK VERCEL =====
export default app;

// ===== JALANKAN LOKAL (hanya jika tidak di Vercel) =====
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🌸 Hutao AI berjalan di http://localhost:${PORT}`);
  });
}
