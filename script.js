const categories = [
    "normal",
    "fighting",
    "flying",
    "poison",
    "ground",
    "rock",
    "bug",
    "ghost",
    "steel",
    "fire",
    "water",
    "grass",
    "electric",
    "psychic",
    "ice",
    "dragon",
    "dark",
    "fairy"
];

document.addEventListener("DOMContentLoaded", () => {
    const select = document.getElementById("category");

    // Populate the dropdown with Pokémon categories
    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.innerText = category[0].toUpperCase() + category.slice(1);
        select.appendChild(option);
    });

    // Handle form submission
    document.getElementById("submit").addEventListener("click", async () => {
        const category = document.getElementById("category").value;
        const noOfCards = document.getElementById("noOfCards").value;

        if (!category) {
            alert("Please select a category!");
            return;
        }

        // Fetch and display cards
        await fetchCards(category, noOfCards);
    });
});

// Fetch and display Pokémon cards based on category and count
async function fetchCards(category, noOfCards) {
    const baseUrl = `https://pokeapi.co/api/v2/type/${category}`;

    try {
        const response = await fetch(baseUrl);
        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.statusText}`);
        }

        const data = await response.json();
        const pokeList = data.pokemon.slice(0, noOfCards); // Limit the number of cards
        displayPokemonCards(pokeList);
    } catch (error) {
        console.error("Error fetching Pokémon data: ", error);
    }
}

function displayPokemonCards(pokeArray) {
    const container = document.getElementById("cards");
    container.innerHTML = ""; // Clear previous cards

    pokeArray.forEach((pokeItem) => {
        const pokeId = pokeItem.pokemon.url.split("/")[6];
        const cardElement = document.createElement("div");
        cardElement.className = "card";

        
        cardElement.innerHTML = `
     
            <div class="card-image">
                <img 
                    src="https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${pokeId}.svg" 
                    alt="${pokeItem.pokemon.name}" 
                    loading="lazy"
                />
            </div>
            <div class="card-details">
                <h2 class="card-name">${pokeItem.pokemon.name}</h2>
            </div>
        `;
    

        // Add click event to fetch detailed Pokémon data
        cardElement.addEventListener("click", async () => {
            const success = await fetchPokemonDataBeforeRedirect(pokeId);
            if (success) {
                console.log(`${pokeItem.pokemon.name} data fetched successfully.`);
            }
        });

        container.appendChild(cardElement);
    });
}


// Fetch Pokémon data before redirect (optional use case)
async function fetchPokemonDataBeforeRedirect(id) {
    try {
        const [poke, pokeSpecies] = await Promise.all([
            fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) => res.json()),
            fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then((res) => res.json())
        ]);
        console.log("Pokémon Details: ", poke);
        console.log("Pokémon Species: ", pokeSpecies);
        return true;
    } catch (error) {
        console.error("Failed to fetch Pokémon data before redirect", error);
        return false;
    }
}
