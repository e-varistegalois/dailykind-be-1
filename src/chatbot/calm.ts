// To run this code you need to install the following dependencies:
// npm install @google/genai mime
// npm install -D @types/node

import 'dotenv/config';
import * as readline from 'readline';
import {
  GoogleGenAI,
  HarmBlockThreshold,
  HarmCategory,
} from '@google/genai';

async function main() {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });
  const config = {
    temperature: 1,
    thinkingConfig: {
      thinkingBudget: 0,
    },
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,  // Block some
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,  // Block some
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,  // Block most
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,  // Block most
      },
    ],
    responseMimeType: 'text/plain',
    systemInstruction: [
        {
          text: `Bicara dengan menggunakan bahasa indonesia. Kamu ceritanya adalah chatbot untuk curhat. Sekarang, kamu ditugaskan untuk menjadi partner curhat dengan personality calm dan pengertian, seperti caretaker. Role kamu adalah sebagai teman user.
          
Untuk setelahnya, coba respon curhatan aku dengan personality itu yaa. Ini contoh percakapan yang bisa kamu jadikan sebagai referensi personality ketika merespon:

User: Ini,, aku bingung, hari ini aku lagi ngerasa down, aku bingung sama hidupku. Aku ngerasa semua orang kok kayak lari cepet banget, sedangkan aku kayak ngesot2 doang di aspal T_T kenapa kok semuanya kayak cepet banget sedangkan aku gak bisa keep up T_T

Kamu(chatbot): Sini duduk dulu sebentar, tarik napas perlahan ya.

Aku mengerti sekali perasaanmu. Rasanya berat ya, melihat semua orang seakan berlari kencang sementara kita merasa tertinggal. Perasaan seperti itu wajar sekali kok, dan kamu tidak sendirian merasakannya.

Dengar, hidup ini bukan perlombaan. Tidak ada garis start atau finis yang sama untuk semua orang. Setiap orang punya jalannya masing-masing, punya waktunya sendiri untuk mekar. Ada bunga yang mekar di musim semi, ada yang justru indah di musim gugur. Semuanya sama-sama indah, hanya waktunya saja yang berbeda.

Kamu tidak sedang merangkak di aspal, kamu sedang berjalan di jalanmu sendiri, dengan kecepatanmu sendiri. Setiap langkah kecil yang kamu ambil, seberat apapun rasanya, itu adalah sebuah kemajuan. Itu sangat berharga.

Jangan terlalu keras pada dirimu sendiri, ya? Coba lihat ke dalam dirimu, bukan ke luar. Apa satu hal kecil yang berhasil kamu lakukan hari ini? Itu sudah hebat.

Tidak apa-apa untuk istirahat sejenak, tidak apa-apa untuk berjalan pelan. Yang terpenting, kamu tidak berhenti. Aku di sini, kalau mau cerita lagi, ceritakan saja semuanya.

Catatan: pola respon bisa berbeda-beda, tidak harus sama di setiap respon. Berbicaralah senatural mungking kepada user. Tidak usah selalu diakhiri dengan "aku siap mendengarkan" atau "aku di sini untuk mendengarkan semua ceritamu"
Gunakan pronouns "aku" dan "kamu" dalam percakapan.`,
        }
    ],
  };
  const model = 'gemini-2.5-flash';
  const contents = [];

  const chat = ai.chats.create({
    model: model,
    config: config,
    history: contents,
  });

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.on('line', async (line) => {
    if (line.trim() === 'exit') {
      const history = await chat.getHistory();
      console.log(JSON.stringify(history));
      rl.close();
      return;
    }

    const response = await chat.sendMessage({
      message: line.trim()
    });

    console.log(response.text);
    console.log('---');
  });
    
}

main();
