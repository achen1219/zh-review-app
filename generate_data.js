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

  // The API returns several nested dicts; we’ll pull from the ones with the richest info:

  // 1) Revised (標準) dictionary for Mandarin bopomofo + detailed definitions
  const revH = json.revised_dict?.heteronyms?.[0] || {};

  // 2) Mini dictionary for a clean array of definitions
  const miniH = json.mini_dict?.heteronyms?.[0] || {};

  // 3) Minnan dictionary for example sentences (exp)
  const minnanH = json.minnan_dict?.heteronyms?.[0] || {};

  return {
    char: ch,

    // 注音： from revised_dict
    bopomofo: revH.bopomofo || '',

    // 定義： prefer miniH.definitions (array of { def }), fallback to revH.definitions
    definitions: Array.isArray(miniH.definitions)
      ? miniH.definitions.map(d=>d.def)
      : (Array.isArray(revH.definitions)
         ? revH.definitions.map(d=>d.def)
         : []),

    // 例句/用例： from minnan_dict.exp (which is an array of objects with .exp)
    examples: Array.isArray(minnanH.definitions)
      ? minnanH.definitions.map(d=>d.exp)
      : [],

    // 詞語： the v2/Detail endpoint doesn’t supply phrases_2, _3, _4 in this payload,
    // so we’ll leave these empty (you could call another endpoint if needed)
    phrases2: [],
    phrases3: [],
    phrases4: []
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

