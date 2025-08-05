const episodesPerPage = 18;
let currentPage = 1;
let allEpisodes = [];
let episodes = [];

// ✅ Google Drive file IDs (replace with actual IDs in order)
const driveIds = [
  "1YV4fDtE1OVqr9-M5h7U7q3LgeGWjPUY3", // Episode 1
  "FILE_ID_2", // Episode 2
  "FILE_ID_3", // Episode 3
  // ... up to 300
];

document.addEventListener("DOMContentLoaded", () => {
  generateEpisodes();
  renderEpisodes();
  setupPagination();
  setupSearchAndFilter();
});

function generateEpisodes() {
  allEpisodes = [];

  for (let i = 0; i < driveIds.length; i++) {
    const id = driveIds[i];

    allEpisodes.push({
      number: i + 1,
      title: `Episode ${i + 1}`,
      image: `assets/images/${i + 1}.jpg`,
      video: `https://drive.google.com/file/d/${id}/preview`,         // for streaming
      download: `https://drive.google.com/uc?export=download&id=${id}`, // for direct download
      watched: (i + 1) % 2 === 0 // simulate watched for even episodes
    });
  }

  episodes = [...allEpisodes];
}

function renderEpisodes() {
  const list = document.getElementById("episodeList");
  const start = (currentPage - 1) * episodesPerPage;
  const end = start + episodesPerPage;
  const visible = episodes.slice(start, end);

  if (visible.length === 0) {
    list.innerHTML = `<p>No episodes found.</p>`;
    document.getElementById("pageInfo").textContent = ``;
    return;
  }

  list.innerHTML = visible.map(ep => `
    <div class="episode-card">
      <img src="${ep.image}" class="episode-thumbnail" alt="Episode ${ep.number}">
      <div class="episode-info">
        <h2>${ep.title}</h2>
        <div class="episode-buttons">
          <a href="${ep.download}" class="icon-button" download title="Download">
            <i class="fas fa-download"></i>
          </a>
          <a href="${ep.video}" class="icon-button" target="_blank" title="Stream">
            <i class="fas fa-play"></i>
          </a>
        </div>
      </div>
    </div>
  `).join('');

  const totalPages = Math.ceil(episodes.length / episodesPerPage);
  document.getElementById("pageInfo").textContent = `Page ${currentPage} of ${totalPages}`;
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

  episodes = allEpisodes.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(search);
    const matchesFilter =
      filter === "all" ||
      (filter === "watched" && e.watched) ||
      (filter === "unwatched" && !e.watched);

    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(episodes.length / episodesPerPage);
  if (currentPage > totalPages) {
    currentPage = totalPages || 1;
  }

  renderEpisodes();
}
