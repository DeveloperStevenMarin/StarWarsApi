// films.js

// Footer para el paginado de películas
const prevPageBtnMovies = document.getElementById("prevPageBtn");
const nextPageBtnMovies = document.getElementById("nextPageBtn");
const currentPageSpanMovies = document.getElementById("currentPage");
const lastPageSpanMovies = document.getElementById("lastPage");
const modalMovies = document.getElementById("myModal");
const modalContentContainerMovies = document.getElementById("modal-content-container");
const closeModalMovies = document.getElementById("modal-close-btn");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const modal = document.getElementById("myModal");
const modalContentContainer = document.querySelector(".modal-content-container");

// Función para abrir el modal y cargar detalles
function openModalWithDetails(personUrl) {
    // Realiza la solicitud al API para obtener detalles
    fetch(personUrl)
        .then(response => response.json())
        .then(personData => {
            // Crea el contenido específico de los detalles en el modal
            const modalContentHTML = `
                <h2>${personData.name}</h2>
                <p>Birth Year: ${personData.birth_year}</p>
                <p>Eye Color: ${personData.eye_color}</p>
                <p>Gender: ${personData.gender}</p>
                <!-- Agrega más detalles según tus necesidades -->
            `;

            // Actualiza el contenido del modal y lo muestra
            modalContentContainer.innerHTML = modalContentHTML;
            modal.style.display = "flex";
        })
        .catch(error => console.error("Error fetching details:", error));
}

// Variables para almacenar información de paginación de películas
let currentPageMovies = 1;
let lastPageMovies = 1;

// Función para cargar datos de la página actual de películas
function loadPageMovies(page) {
    const apiUrlMovies = `https://swapi.dev/api/films/?page=${page}`;
    fetch(apiUrlMovies)
        .then(response => response.json())
        .then(data => {
            lastPageMovies = Math.ceil(data.count / data.results.length);
            displayMovies(data.results);
            updatePaginationInfoMovies();
        })
        .catch(error => console.error("Error fetching movie data:", error));
}

// Función para actualizar la información de paginación de películas
function updatePaginationInfoMovies() {
    currentPageSpanMovies.textContent = currentPageMovies;
    lastPageSpanMovies.textContent = lastPageMovies;
}

// Evento de clic para el botón "Anterior" de películas
prevPageBtnMovies.addEventListener("click", function () {
    if (currentPageMovies > 1) {
        currentPageMovies--;
        loadPageMovies(currentPageMovies);
    }
});

// Evento de clic para el botón "Siguiente" de películas
nextPageBtnMovies.addEventListener("click", function () {
    currentPageMovies++;
    loadPageMovies(currentPageMovies);
});

// Evento de clic para cerrar el modal de películas
closeModalMovies.addEventListener("click", function () {
    closeModalHandlerMovies();
});

// Esta función se ejecutará cuando se cargue este módulo de películas
function initCategoryMovies() {
    // Realiza una solicitud a la API SWAPI para obtener información sobre películas
    loadPageMovies(currentPageMovies);
}

// Función para mostrar la información de las películas en una tabla
function displayMovies(movies) {
    const dataTableMovies = document.getElementById("dataTable");

    // Limpia la tabla existente de películas
    dataTableMovies.innerHTML = "";

    // Crea el encabezado de la tabla de películas
    const tableHeaderMovies = document.createElement("thead");
    const headerRowMovies = document.createElement("tr");
    const columnsMovies = ["Title", "Release Date", "Director", "Characters"];

    columnsMovies.forEach(columnName => {
        const th = document.createElement("th");
        th.textContent = columnName;
        headerRowMovies.appendChild(th);
    });

    tableHeaderMovies.appendChild(headerRowMovies);
    dataTableMovies.appendChild(tableHeaderMovies);

    // Crea las filas de datos para cada película
    const tableBodyMovies = document.createElement("tbody");
    movies.forEach(movie => {
        const row = document.createElement("tr");

        const titleCell = document.createElement("td");
        titleCell.textContent = movie.title;
        row.appendChild(titleCell);

        const releaseDateCell = document.createElement("td");
        releaseDateCell.textContent = movie.release_date;
        row.appendChild(releaseDateCell);

        const directorCell = document.createElement("td");
        directorCell.textContent = movie.director;
        row.appendChild(directorCell);

        const charactersCell = document.createElement("td");
        const charactersCount = movie.characters.length;

        // Verificar si movie.characters existe antes de iterar sobre él
        if (movie.characters && movie.characters.length > 0) {
            movie.characters.forEach((characterUrl, index) => {
                fetch(characterUrl)
                    .then(response => response.json())
                    .then(characterData => {
                        const characterName = characterData.name;
                        const characterLink = document.createElement("a");
                        characterLink.textContent = characterName;

                        // Si no es el último elemento, agrega una coma después del enlace
                        if (index < charactersCount - 1) {
                            const commaSpan = document.createElement("span");
                            commaSpan.textContent = ', ';
                            charactersCell.appendChild(characterLink);
                            charactersCell.appendChild(commaSpan);
                        } else {
                            // Si es el último elemento, no agrega una coma
                            charactersCell.appendChild(characterLink);
                        }

                        characterLink.href = "#"; // Puedes establecer el enlace como "#" por ahora

                        // Agrega un evento de clic al enlace para abrir el modal y cargar el contenido del personaje
                        characterLink.addEventListener("click", function (event) {
                            event.preventDefault(); // Evita la navegación por defecto
                            openModalWithCharacter(characterUrl); // Función para abrir el modal y cargar el contenido del personaje
                        });
                    })
                    .catch(error => console.error("Error fetching character data:", error));
            });
        } else {
            // Si movie.characters no existe o está vacío, simplemente muestra un guión o un mensaje
            charactersCell.textContent = "-";
        }

        row.appendChild(charactersCell);
        tableBodyMovies.appendChild(row);
    });

    dataTableMovies.appendChild(tableBodyMovies);
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
            modalContentContainerMovies.innerHTML = modalContentHTML;
            modalMovies.style.display = "flex";

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

// Función para cerrar el modal de películas
function closeModalHandlerMovies() {
    modalMovies.style.display = "none";
}

// Llama a la función de inicialización de películas cuando se carga este módulo
initCategoryMovies();