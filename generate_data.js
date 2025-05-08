// generate_data.js
// Run: node generate_data.js
const fetch = require('node-fetch');
const fs    = require('fs');

// ← YOUR API KEY HERE ↓
const apiKey = 'ca3c6b07-0e0e-4774-a57d-6d0bb178801d';

// 1) Your daily schedule:
const schedule = {
  "2025-05-07": ["腰","蓋","初","夏","省","桐","包","類","資","影","敦","爾","悟","拆"],
  "2025-05-08": ["取","抬","腰","蓋","初","夏","技","票","周","例","擁","擠","盛","隨"]
};
// flatten + dedupe:
const chars = Array.from(new Set(Object.values(schedule).flat()));

async function fetchDetail(ch) {
  const url = `https://pedia.cloud.edu.tw/api/v2/Detail`
            + `?term=${encodeURIComponent(ch)}`
            + `&api_key=${apiKey}`;
  const res  = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();

  // 1) Grab the first item in the data array:
  const rec = Array.isArray(json.data) 
            ? json.data[0] 
            : (json.data || {});

  // 2) Normalize each field:
  return {
    char:       ch,
    bopomofo:   rec.bopomofo || rec.pinyin_bopomofo || '',
    definitions: rec.definitions
                  ? (Array.isArray(rec.definitions)
                      ? rec.definitions
                      : [rec.definitions])
                  : [],
    examples:   Array.isArray(rec.examples)   ? rec.examples   : [],
    phrases2:   Array.isArray(rec.phrases_2)  ? rec.phrases_2  : [],
    phrases3:   Array.isArray(rec.phrases_3)  ? rec.phrases_3  : [],
    phrases4:   Array.isArray(rec.collocations_4)
                  ? rec.collocations_4 
                  : []
  };
}

(async () => {
  // TEST MODE: only fetch one character
  const testChars = ['腰'];
  for (const ch of testChars) {
    const d = await fetchDetail(ch);
    console.log('Parsed data for', ch, ':', d);
  }
  process.exit(0);   // stop the script right here
})();

