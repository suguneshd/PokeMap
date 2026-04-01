// --- Global Variables ---
let allPokemon = [];

const grid = document.getElementById("pokemonGrid");
const infoText = document.getElementById("infoText");
const searchInput = document.getElementById("searchInput");
const typeFilter = document.getElementById("typeFilter");
const modalWindow = document.getElementById("modalWindow");
const modalImage = document.getElementById("modalImage");
const modalName = document.getElementById("modalName");

// --- Fetch Data ---
async function loadGeneration(offset, limit, clickedButton) {
    if (clickedButton) {
    document.querySelector(".active").classList.remove("active");
    clickedButton.classList.add("active");
    }

    grid.innerHTML = "";
    infoText.innerText = "Downloading Pokemon... Please wait.";

    try {
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
    let data = await response.json();

    // Fetch detailed data for each Pokemon
    let downloadTasks = [];
    for (let item of data.results) {
        let task = fetch(item.url).then(res => res.json());
        downloadTasks.push(task);
    }

    allPokemon = await Promise.all(downloadTasks);

    displayPokemon(allPokemon);
    infoText.innerText = `Showing ${allPokemon.length} Pokemon`;
    } catch (error) {
    infoText.innerText = "Error loading data. Check your connection.";
    }
}

// --- Display Cards ---
function displayPokemon(pokemonList) {
    grid.innerHTML = ""; 

    for (let pokemon of pokemonList) {
    let card = document.createElement("div");
    card.className = "card";
    
    card.innerHTML = `
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" />
        <div class="card-name">${pokemon.name}</div>
    `;

    card.onclick = function() {
        modalName.innerText = pokemon.name;
        modalImage.src = pokemon.sprites.front_default;
        modalWindow.style.display = "flex";
    };

    grid.appendChild(card);
    }
}

// --- Filtering (Search & Type) ---
function applyFilters() {
    let searchText = searchInput.value.toLowerCase();
    let selectedType = typeFilter.value;
    let filteredList = [];

    for (let pokemon of allPokemon) {
    let nameMatches = pokemon.name.includes(searchText);
    let typeMatches = false;
    
    if (selectedType === "") {
        typeMatches = true;
    } else {
        for (let slot of pokemon.types) {
        if (slot.type.name === selectedType) {
            typeMatches = true;
        }
        }
    }

    if (nameMatches && typeMatches) {
        filteredList.push(pokemon);
    }
    }

    displayPokemon(filteredList);
    infoText.innerText = `Showing ${filteredList.length} Pokemon`;
}

// --- Modal ---
function closeModal() {
    modalWindow.style.display = "none";
}

// --- Events & Init ---
searchInput.addEventListener("input", applyFilters);
typeFilter.addEventListener("change", applyFilters);

loadGeneration(0, 151, null);
