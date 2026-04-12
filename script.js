let allPokemon = [];

const grid = document.getElementById("pokemonGrid");
const infoText = document.getElementById("infoText");
const searchInput = document.getElementById("searchInput");
const typeFilter = document.getElementById("typeFilter");

async function loadGeneration(offset, limit, clickedButton) {
  if (clickedButton) {
    document.querySelector(".active").classList.remove("active");
    clickedButton.classList.add("active");
  }

  grid.innerHTML = "";
  infoText.innerText = "Downloading Pokemon... Please wait.";

  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
    );
    const data = await response.json();

    const downloadTasks = data.results.map(item =>
      fetch(item.url).then(res => res.json())
    );

    allPokemon = await Promise.all(downloadTasks);

    allPokemon.sort((a, b) => a.name.localeCompare(b.name));

    displayPokemon(allPokemon);
    infoText.innerText = `Showing ${allPokemon.length} Pokemon`;
  } catch (error) {
    infoText.innerText = "Error loading data. Check your connection.";
  }
}

function displayPokemon(pokemonList) {
  grid.innerHTML = "";

  pokemonList.forEach(pokemon => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" />
      <div class="card-name">${pokemon.name}</div>
    `;

    grid.appendChild(card);
  });
}

function applyFilters() {
  const searchText = searchInput.value.toLowerCase();
  const selectedType = typeFilter.value;

  const filteredList = allPokemon.filter(pokemon => {
    const nameMatches = pokemon.name.includes(searchText);

    const typeMatches =
      selectedType === "" ||
      pokemon.types.some(slot => slot.type.name === selectedType);

    return nameMatches && typeMatches;
  });

  displayPokemon(filteredList);
  infoText.innerText = `Showing ${filteredList.length} Pokemon`;
}

searchInput.addEventListener("input", applyFilters);
typeFilter.addEventListener("change", applyFilters);

loadGeneration(0, 151, null);
