let pokemonRepository = (function () {
    let e = [];
    let t = document.querySelector(".pokemon-list");

    function n(t) {
        if (typeof t === "object" && "name" in t && "detailsUrl" in t) {
            e.push(t);
        }
    }

    function o() {
        return e;
    }

    function i(e) {
        return fetch(e.detailsUrl)
            .then(res => res.json())
            .then(data => {
                e.imageUrl = data.sprites.front_default;
                e.height = data.height;
                e.types = data.types.map(t => t.type.name);
            })
            .catch(error => console.error("Error loading Pokémon details:", error));
    }

    function r(e) {
        i(e).then(() => {
            document.getElementById("pokemonModalLabel").innerText = e.name;
            document.getElementById("pokemonHeight").innerText = `Height: ${e.height} m`;
            document.getElementById("pokemonImage").src = e.imageUrl;

            let types = e.types.join(", ");
            document.getElementById("pokemonTypes").innerText = `Types: ${types}`;

            $("#pokemonModal").modal("show");
        });
    }

    function a(e) {
        let li = document.createElement("li");
        li.classList.add("list-group-item");

        let button = document.createElement("button");
        button.innerText = e.name;
        button.classList.add("btn", "btn-primary", "btn-block", "text-capitalize");
        button.setAttribute("type", "button");
        button.setAttribute("data-toggle", "modal");
        button.setAttribute("data-target", "#pokemonModal");

        button.addEventListener("click", function () {
            r(e);
        });

        li.appendChild(button);
        t.appendChild(li);
    }

    return {
        getAll: o,
        add: n,
        loadList: function () {
            return fetch("https://pokeapi.co/api/v2/pokemon/?limit=150")
                .then(res => res.json())
                .then(data => {
                    data.results.forEach(pokemon => {
                        n({
                            name: pokemon.name,
                            detailsUrl: pokemon.url
                        });
                    });
                })
                .catch(error => console.error("Error loading the Pokémon list:", error));
        },
        loadDetails: i,
        showDetails: r,
        addListItem: a,
        displayPokemons: function () {
            e.forEach(a);
        }
    };
})();

// Load the Pokémon list and display them
pokemonRepository.loadList().then(() => {
    pokemonRepository.displayPokemons();
});