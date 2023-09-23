// Variables para almacenar los elementos HTML
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const dataTableSearch = document.getElementById("dataTable");
const modalSearch = document.getElementById("myModal");
const modalContentContainerSearch = document.getElementById("modal-content-container");
const closeModalSearch = document.getElementById("modal-close-btn");
const pageIntroductionContainerSearch = document.querySelector(".page-introduction-container");
const paginationFooterSearch = document.getElementById("paginationFooter");
let foundResults = false;


closeModalSearch.addEventListener("click", function () {
    closeModalHandlerSearch();
});
// Función para cerrar el modal de las busquedas
function closeModalHandlerSearch() {
    modalSearch.style.display = "none";
}

// Función para realizar la búsqueda en todas las categorías
function search() {
    paginationFooterSearch.style.display = "flex"
    pageIntroductionContainerSearch.style.display = "none";
    const query = searchInput.value.trim().toLowerCase();

    // Limpia los resultados anteriores
    dataTableSearch.innerHTML = "";

    // Define la URL base de la API SWAPI
    const apiUrl = "https://swapi.dev/api/";

    // Define un array con las categorías a buscar
    const categories = ["films", "people", "planets", "species", "starships", "vehicles"];

    // Itera sobre las categorías y realiza la búsqueda en cada una
    categories.forEach(category => {
        // Define la URL completa para la búsqueda en la categoría actual
        const searchUrl = apiUrl + category + "/?search=" + query;

        // Realiza la solicitud de búsqueda en la categoría actual
        fetch(searchUrl)
            .then(response => response.json())
            .then(data => {
                // Verifica si se encontraron resultados en la categoría actual
                if (data.results.length > 0) {
                    // Crea un encabezado para la categoría en la tabla
                    const categoryHeaderRow = document.createElement("tr");
                    const categoryHeaderCell = document.createElement("th");
                    categoryHeaderCell.colSpan = 2; // Ocupa dos columnas
                    categoryHeaderCell.textContent = category.toUpperCase();
                    categoryHeaderRow.appendChild(categoryHeaderCell);
                    dataTableSearch.appendChild(categoryHeaderRow);

                    // Llama a la función para mostrar los resultados en la tabla
                    displayResults(data.results, category);

                }
            })
            .catch(error => console.error("Error fetching search results:", error));
    });
}

// Función para mostrar los resultados en la tabla
function displayResults(results, category) {
    // Crea las filas de datos para cada resultado
    results.forEach(result => {

        const row = document.createElement("tr");

        const nameCell = document.createElement("td");
        nameCell.textContent = result.name || result.title;
        row.appendChild(nameCell);

        const linkCell = document.createElement("td");
        const link = document.createElement("a");
        link.textContent = "View";
        link.classList = category;
        link.href = result.url;
        link.target = "_blank"; // Abre el enlace en una nueva pestaña

        // Agrega un evento de clic al enlace para abrir el modal con detalles
        link.addEventListener("click", function (event) {
            event.preventDefault(); // Evita la navegación por defecto
            openModalWithDetails(result.url, category); // Función para abrir el modal con detalles
        });

        linkCell.appendChild(link);
        row.appendChild(linkCell);

        dataTableSearch.appendChild(row);
    });
}

// Función para abrir el modal y cargar detalles
function openModalWithDetails(resourceUrl, category) {
    if (category === 'planets') {
        openModalWithPlanets(resourceUrl);
    } else if (category === 'films') {
        openModalWithFilm(resourceUrl);
    } else if (category === 'vehicles') {
        openModalWithVehicle(resourceUrl)
    } else if (category === 'people') {
        openModalWithCharacter(resourceUrl)
    }
    else if (category === 'species') {
        openModalWithSpecies(resourceUrl)
    }
    else if (category === 'starships') {
        openModalWithStarship(resourceUrl)

    }
}

// Función para abrir el modal y cargar el contenido de un personaje
function openModalWithCharacter(characterUrl) {
    fetch(characterUrl)
        .then(response => response.json())
        .then(characterData => {
            // Crea el contenido específico del personaje en el modal
            const modalContentHTML = `
                <h2>${characterData.name}</h2>
                <p>Birth Year: ${characterData.birth_year}</p>
                <p>Gender: ${characterData.gender}</p>
                <p>Homeworld: <span id="homeworldName">Loading...</span></p>
            `;
            // Actualiza el contenido del modal de películas y lo muestra
            modalContentContainerSearch.innerHTML = modalContentHTML;
            modalSearch.style.display = "flex";

            // Obtén y muestra el nombre del planeta
            if (characterData.homeworld) {
                fetch(characterData.homeworld)
                    .then(response => response.json())
                    .then(homeworldData => {
                        const homeworldName = homeworldData.name;
                        const homeworldNameElement = document.getElementById("homeworldName");
                        homeworldNameElement.textContent = homeworldName;
                    })
                    .catch(error => console.error("Error fetching homeworld data:", error));
            }
        })
        .catch(error => console.error("Error fetching character data:", error));
}
// Función para mostrar información de planetas en el modal
function openModalWithPlanets(planetUrl) {
    fetch(planetUrl)
        .then(response => response.json())
        .then(planetData => {
            // Crea el contenido específico de los planetas en el modal
            const modalContentHTML = `
                <h2>${planetData.name}</h2>
                <p>Climate: ${planetData.climate}</p>
                <p>Diameter: ${planetData.diameter}</p>
                <p>Gravity: ${planetData.gravity}</p>
                <p>Population: ${planetData.population}</p>
                <p>Terrain: ${planetData.terrain}</p>
            `;

            // Actualiza el contenido del modal y lo muestra
            modalContentContainerSearch.innerHTML = modalContentHTML;
            modalSearch.style.display = "flex";
        })
        .catch(error => console.error("Error fetching planet data:", error));
}
// Función para abrir el modal y cargar el contenido de una película
function openModalWithFilm(filmUrl) {
    fetch(filmUrl)
        .then(response => response.json())
        .then(filmData => {
            // Crea el contenido específico de la película en el modal
            const modalContentHTML = `
                <h2>${filmData.title}</h2>
                <p>Director: ${filmData.director}</p>
                <p>Release date: ${filmData.release_date}</p>
                <p>Description: ${filmData.opening_crawl}</p>
            `;

            // Actualiza el contenido del modal y lo muestra
            modalContentContainerSearch.innerHTML = modalContentHTML;
            modalSearch.style.display = "flex";
        })
        .catch(error => console.error("Error fetching film data:", error));
}
// Función para abrir el modal y cargar el contenido de una especie
function openModalWithSpecies(speciesUrl) {
    fetch(speciesUrl)
        .then(response => response.json())
        .then(speciesData => {
            // Crea el contenido específico de la especie en el modal
            const modalContentHTML = `
                <h2>${speciesData.name}</h2>
                <p>Average Height: ${speciesData.average_height}</p>
                <p>Average Lifespan: ${speciesData.average_lifespan}</p>
                <p>Classification: ${speciesData.classification}</p>
                <p>Designation: ${speciesData.designation}</p>
                <p>Eye Colors: ${speciesData.eye_colors}</p>
                <p>Hair Colors: ${speciesData.hair_colors}</p>
                <p>Homeworld: <span id="homeworldName">Loading...</span></p>
                <p>Language: ${speciesData.language}</p>
            `;

            // Actualiza el contenido del modal y lo muestra
            modalContentContainerSearch.innerHTML = modalContentHTML;
            modalSearch.style.display = "flex";

            // Obtén y muestra el nombre del planeta de origen
            if (speciesData.homeworld) {
                fetch(speciesData.homeworld)
                    .then(response => response.json())
                    .then(homeworldData => {
                        const homeworldName = homeworldData.name;
                        const homeworldNameElement = document.getElementById("homeworldName");
                        homeworldNameElement.textContent = homeworldName;
                    })
                    .catch(error => console.error("Error fetching homeworld data:", error));
            }
        })
        .catch(error => console.error("Error fetching species data:", error));
}
// Función para abrir el modal y cargar el contenido de un vehículo
function openModalWithVehicle(vehicleUrl) {
    fetch(vehicleUrl)
        .then(response => response.json())
        .then(vehicleData => {
            // Crea el contenido específico del vehículo en el modal
            const modalContentHTML = `
                <h2>${vehicleData.name}</h2>
                <p>Cargo Capacity: ${vehicleData.cargo_capacity}</p>
                <p>Consumables: ${vehicleData.consumables}</p>
                <p>Cost in Credits: ${vehicleData.cost_in_credits}</p>
                <p>Crew: ${vehicleData.crew}</p>
                <p>Length: ${vehicleData.length}</p>
                <p>Manufacturer: ${vehicleData.manufacturer}</p>
                <p>Max Atmosphering Speed: ${vehicleData.max_atmosphering_speed}</p>
                <p>Model: ${vehicleData.model}</p>
                <p>Passengers: ${vehicleData.passengers}</p>
                <p>Pilots: ${vehicleData.pilots}</p>
                <p>Vehicle Class: ${vehicleData.vehicle_class}</p>
            `;

            // Actualiza el contenido del modal y lo muestra
            modalContentContainerSearch.innerHTML = modalContentHTML;
            modalSearch.style.display = "flex";
        })
        .catch(error => console.error("Error fetching vehicle data:", error));
}
// Función para abrir el modal y cargar el contenido de una nave espacial
function openModalWithStarship(starshipUrl) {
    fetch(starshipUrl)
        .then(response => response.json())
        .then(starshipData => {
            // Crea el contenido específico de la nave espacial en el modal
            const modalContentHTML = `
                <h2>${starshipData.name}</h2>
                <p>MGLT: ${starshipData.MGLT}</p>
                <p>Cargo Capacity: ${starshipData.cargo_capacity}</p>
                <p>Consumables: ${starshipData.consumables}</p>
                <p>Cost in Credits: ${starshipData.cost_in_credits}</p>
                <p>Crew: ${starshipData.crew}</p>
                <p>Hyperdrive Rating: ${starshipData.hyperdrive_rating}</p>
                <p>Length: ${starshipData.length}</p>
                <p>Manufacturer: ${starshipData.manufacturer}</p>
                <p>Max Atmosphering Speed: ${starshipData.max_atmosphering_speed}</p>
                <p>Model: ${starshipData.model}</p>
                <p>Passengers: ${starshipData.passengers}</p>
                <p>Starship Class: ${starshipData.starship_class}</p>
            `;

            // Actualiza el contenido del modal y lo muestra
            modalContentContainerSearch.innerHTML = modalContentHTML;
            modalSearch.style.display = "flex";
        })
        .catch(error => console.error("Error fetching starship data:", error));
}
// Agrega un evento de clic al botón de búsqueda para ejecutar la función de búsqueda
searchButton.addEventListener("click", search);