let pokemonRepository = (function () {
    let pokemonList = [];
    let pokemonListElement = document.querySelector('.pokemon-list');

    function loadList() {
        return fetch('https://pokeapi.co/api/v2/pokemon/?limit=150')
          .then(response => response.json())
          .then(data => {
            data.results.forEach(pokemon => {
              add({
                name: pokemon.name,
                detailsUrl: pokemon.url
              });
            });
          })
          .catch(error => console.error('Error loading the Pokémon list:', error));
    }

    function add(pokemon) {
        if (typeof pokemon === 'object' && 'name' in pokemon && 'detailsUrl' in pokemon) {
            pokemonList.push(pokemon);
        }
    }

    function getAll() {
        return pokemonList;
    }

    function loadDetails(pokemon) {
        return fetch(pokemon.detailsUrl)
            .then(response => response.json())
            .then(details => {
                pokemon.imageUrl = details.sprites.front_default;
                pokemon.height = details.height;
                pokemon.types = details.types.map(typeInfo => typeInfo.type.name);
            })
            .catch(error => console.error('Error loading Pokémon details:', error));
    }

    function showDetails(pokemon) {
        loadDetails(pokemon).then(() => {
            console.log(pokemon);
            alert(`Name: ${pokemon.name}\nHeight: ${pokemon.height}\nTypes: ${pokemon.types.join(', ')}`);
        });
    }

    function addListItem(pokemon) {
        let listItem = document.createElement('li');
        let button = document.createElement('button');
        button.innerText = pokemon.name;
        button.classList.add('pokemon-button');
        button.addEventListener('click', function () {
            showDetails(pokemon);
        });
        listItem.appendChild(button);
        pokemonListElement.appendChild(listItem);
    }

    function displayPokemons() {
        getAll().forEach(pokemon => {
            addListItem(pokemon);
        });
    }

    return {
        getAll: getAll,
        add: add,
        loadList: loadList,
        loadDetails: loadDetails,
        showDetails: showDetails,
        addListItem: addListItem,
        displayPokemons: displayPokemons
    };
})();

pokemonRepository.loadList().then(() => {
    pokemonRepository.displayPokemons();
});