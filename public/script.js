const apiBase = '/api';
const themeBtn = document.getElementById('themeBtn');
const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const homeRows = document.getElementById('homeRows');
const copyBtn = document.getElementById('copyBtn');
const copyState = document.getElementById('copyState');

const player = document.getElementById('player');
const playerImg = document.getElementById('playerImg');
const playerTitle = document.getElementById('playerTitle');
const playerArtist = document.getElementById('playerArtist');
const ytLink = document.getElementById('ytLink');

const themes = [
  { bg: '#0f1117', card: '#191e2a', accent: '#79ffa9' },
  { bg: '#1a0f17', card: '#2a1928', accent: '#ff8bd1' },
  { bg: '#0d1720', card: '#132838', accent: '#5fd7ff' },
];
let themeIndex = 0;

function applyTheme(theme) {
  document.documentElement.style.setProperty('--bg', theme.bg);
  document.documentElement.style.setProperty('--card', theme.card);
  document.documentElement.style.setProperty('--accent', theme.accent);
}

themeBtn.onclick = () => {
  themeIndex = (themeIndex + 1) % themes.length;
  applyTheme(themes[themeIndex]);
};

function renderSongs(container, songs = []) {
  container.innerHTML = '';
  if (!songs.length) {
    container.innerHTML = '<p class="muted">Tidak ada data.</p>';
    return;
  }
  for (const song of songs) {
    const div = document.createElement('div');
    div.className = 'song';
    div.innerHTML = `
      <img src="${song.thumbnail || 'https://via.placeholder.com/80'}" alt="${song.title}" />
      <div>
        <strong>${song.title}</strong><br/>
        <small class="muted">${song.artist}</small>
      </div>
    `;
    div.onclick = () => openPlayer(song);
    container.appendChild(div);
  }
}

function openPlayer(song) {
  player.classList.remove('hidden');
  playerImg.src = song.thumbnail || 'https://via.placeholder.com/80';
  playerTitle.textContent = song.title;
  playerArtist.textContent = song.artist;
  ytLink.href = `https://www.youtube.com/watch?v=${song.videoId}`;
}

async function fetchHome() {
  homeRows.innerHTML = '<p class="muted">Memuat rekomendasi...</p>';
  const res = await fetch(`${apiBase}/home`);
  const json = await res.json();
  if (json.status !== 'success') {
    homeRows.innerHTML = `<p class="muted">Error: ${json.message}</p>`;
    return;
  }
  homeRows.innerHTML = '';
  Object.entries(json.data).forEach(([key, value]) => {
    const block = document.createElement('div');
    block.className = 'row';
    block.innerHTML = `<h3>${key.toUpperCase()}</h3>`;
    const list = document.createElement('div');
    list.className = 'list';
    renderSongs(list, value);
    block.appendChild(list);
    homeRows.appendChild(block);
  });
}

async function doSearch() {
  const q = searchInput.value.trim();
  if (!q) return;
  searchResults.innerHTML = '<p class="muted">Mencari...</p>';
  const res = await fetch(`${apiBase}/search?query=${encodeURIComponent(q)}`);
  const json = await res.json();
  renderSongs(searchResults, json.data || []);
}

searchBtn.onclick = doSearch;
searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') doSearch();
});

copyBtn.onclick = async () => {
  const links = [
    'WhatsApp: https://whatsapp.com/channel/0029VbBjyjlJ93wa6hwSWa0p',
    'Instagram: https://www.instagram.com/rahmt_nhw?igsh=MWQwcnB3bTA2ZnVidg==',
    'TikTok: https://www.tiktok.com/@r_hmtofc?_r=1&_t=ZS-94KRfWQjeUu',
    'GitHub: https://github.com/rahmat-369',
    'Telegram: https://t.me/rAi_engine',
  ].join('\n');
  await navigator.clipboard.writeText(links);
  copyState.textContent = 'Semua tautan berhasil dicopy ✅';
};

fetchHome();
