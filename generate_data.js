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
  console.log(`\n→ Fetching URL for "${ch}":\n  ${url}`);

  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();

  // Dump the raw JSON for just this one char:
  console.log(`Response for "${ch}":\n`, JSON.stringify(json, null, 2));

  // Now pick the payload, either under .data or top‐level
  const d = json.data || json;

  return {
    bopomofo:    d.bopomofo    || d.pinyin_bopomofo || '',
    definitions: d.definitions || (d.definition ? [d.definition] : []),
    examples:    d.examples    || [],
    phrases2:    d.phrases_2   || [],
    phrases3:    d.phrases_3   || [],
    phrases4:    d.collocations_4 || []
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

