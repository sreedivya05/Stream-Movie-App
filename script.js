// ===== GLOBAL STATE =====
let allMovies = [];
let currentCategory = "all";
let currentSearch = "";

// ===== LOAD MOVIE DATA & RENDER TABLE =====
async function loadMovieData() {
  try {
    const response = await fetch("datamovies.json");
    if (!response.ok) throw new Error("HTTP " + response.status);
    allMovies = await response.json();
    renderMovies();
  } catch (err) {
    console.error("Error loading datamovies.json:", err);
  }
}

function renderMovies() {
  const tbody = document.querySelector("#moviesTable tbody");
  if (!tbody) return; // if we're not on movies.html

  tbody.innerHTML = "";

  const search = currentSearch.toLowerCase();

  allMovies.forEach((movie) => {
    const ratingNum = parseFloat(movie.rating);

    // category filter
    if (currentCategory === "top-rated") {
      if (!(ratingNum >= 8.5)) return;
    } else if (currentCategory !== "all") {
      if (movie.category !== currentCategory) return;
    }

    // search filter
    if (search) {
      const haystack = (
        movie.title +
        " " +
        (movie.theatre || "") +
        " " +
        (movie.ott || "")
      ).toLowerCase();
      if (!haystack.includes(search)) return;
    }

    const tr = document.createElement("tr");
    tr.classList.add("movie-row");

    tr.innerHTML = `
      <td><img src="${movie.poster}" alt="${movie.title}" class="poster-thumb" /></td>
      <td>${movie.title}</td>
      <td>${movie.theatre || "-"}</td>
      <td>${movie.ott || "-"}</td>
      <td>${movie.rating}</td>
    `;

    tr.addEventListener("click", () => openMovieModal(movie));
    tbody.appendChild(tr);
  });
}

// ===== SEARCH & FILTER SETUP =====
function setupSearchAndFilters() {
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      currentSearch = e.target.value || "";
      renderMovies();
    });
  }

  const filterButtons = document.querySelectorAll("[data-filter]");
  if (filterButtons.length) {
    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        currentCategory = btn.dataset.filter;
        renderMovies();
      });
    });
  }
}

// ===== NETFLIX-STYLE MODAL =====
function setupMovieModal() {
  const modal = document.getElementById("movieModal");
  if (!modal) return;

  const overlay = modal.querySelector(".modal-overlay");
  const closeBtn = document.getElementById("modalCloseBtn");

  function close() {
    modal.classList.add("hidden");
  }

  overlay.addEventListener("click", close);
  closeBtn.addEventListener("click", close);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
}

function openMovieModal(movie) {
  const modal = document.getElementById("movieModal");
  if (!modal) return;

  document.getElementById("modalPoster").src = movie.poster;
  document.getElementById("modalPoster").alt = movie.title;
  document.getElementById("modalTitle").textContent = movie.title;
  document.getElementById("modalYear").textContent = movie.year || "";
  document.getElementById("modalCategory").textContent =
    (movie.category || "").toUpperCase();
  document.getElementById("modalRating").textContent = movie.rating;
  document.getElementById("modalDescription").textContent =
    movie.description || "No description available.";
  document.getElementById("modalTheatre").textContent =
    movie.theatre || "N/A";
  document.getElementById("modalOtt").textContent = movie.ott || "N/A";

  modal.classList.remove("hidden");
}

// ===== RANDOM TRENDING POSTER =====
const posters = [
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQsz5h5Lqk0YvKiwocqZ4aRNukcLkgALnWF7TikfxzT52o7ilFqGIZAqWFWeBSy-w9D4A&usqp=CAU",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSM09zUBsJz7HZqZUlpJAMftR1BZ9OMOaTPUA&usqp=CAU",
  "https://i0.wp.com/www.socialnews.xyz/wp-content/uploads/2016/07/06/100-Days-of-Love-Movie-Poster.jpg?w=773&h=1344&quality=80&zoom=1&ssl=1"
];

function setupRandomPoster() {
  const poster = document.getElementById("randomPoster");
  if (!poster) return;

  function setRandom() {
    const random = posters[Math.floor(Math.random() * posters.length)];
    poster.style.backgroundImage = `url('${random}')`;
  }

  setRandom();
  poster.addEventListener("mouseover", setRandom);
}

// ===== SIGNUP VALIDATION =====
function validateSignup(form) {
  const pw = form.pw.value;
  const rpw = form.rpw.value;
  const mn = form.mn.value.trim();

  if (pw !== rpw) {
    alert("Passwords do not match");
    return false;
  }

  if (pw.length < 6) {
    alert("Password must be at least 6 characters");
    return false;
  }

  if (mn && isNaN(mn)) {
    alert("Mobile number must contain only digits");
    return false;
  }

  return true;
}

// ===== INIT ON PAGE LOAD =====
document.addEventListener("DOMContentLoaded", () => {
  setupRandomPoster();
  loadMovieData();
  setupSearchAndFilters();
  setupMovieModal();
});
