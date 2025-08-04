const episodesPerPage = 18;
let currentPage = 1;
let episodes = [];

document.addEventListener("DOMContentLoaded", () => {
  generateEpisodes();
  renderEpisodes();
  setupPagination();
  setupSearchAndFilter();
});

function generateEpisodes() {
  for (let i = 1; i <= 300; i++) {
    episodes.push({
      number: i,
      title: `Episode ${i}`,
      image: `assets/images/${i}.jpg`,
      video: `downloads/${i}.mp4`,
      watched: false
    });
  }
}

function renderEpisodes() {
  const list = document.getElementById("episodeList");
  const start = (currentPage - 1) * episodesPerPage;
  const end = start + episodesPerPage;
  const visible = episodes.slice(start, end);

  list.innerHTML = visible.map(ep => `
    <div class="episode-card">
      <img src="${ep.image}" class="episode-thumbnail" alt="Episode ${ep.number}">
      <div class="episode-info">
        <h2>${ep.title}</h2>
        <div class="episode-buttons">
          <a href="${ep.video}" class="icon-button" download title="Download">
            <i class="fas fa-download"></i>
          </a>
          <a href="${ep.video}" class="icon-button" target="_blank" title="Stream">
            <i class="fas fa-play"></i>
          </a>
        </div>
      </div>
    </div>
  `).join('');

  document.getElementById("pageInfo").textContent = `Page ${currentPage}`;
}

function setupPagination() {
  document.getElementById("prevPage").addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderEpisodes();
    }
  });

  document.getElementById("nextPage").addEventListener("click", () => {
    const totalPages = Math.ceil(episodes.length / episodesPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      renderEpisodes();
    }
  });
}

function setupSearchAndFilter() {
  document.getElementById("searchInput").addEventListener("input", filterEpisodes);
  document.getElementById("filterSelect").addEventListener("change", filterEpisodes);
}

function filterEpisodes() {
  const search = document.getElementById("searchInput").value.toLowerCase();
  const filter = document.getElementById("filterSelect").value;

  episodes = [];
  for (let i = 1; i <= 300; i++) {
    episodes.push({
      number: i,
      title: `Episode ${i}`,
      image: `assets/images/${i}.jpg`,
      video: `downloads/${i}.mp4`,
      watched: i % 2 === 0 // simulate watched for even episodes
    });
  }

  if (filter === "watched") {
    episodes = episodes.filter(e => e.watched);
  } else if (filter === "unwatched") {
    episodes = episodes.filter(e => !e.watched);
  }

  if (search) {
    episodes = episodes.filter(e => e.title.toLowerCase().includes(search));
  }

  currentPage = 1;
  renderEpisodes();
}
