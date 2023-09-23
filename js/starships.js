// starships.js

// Footer para el paginado de naves espaciales
const prevPageBtnStarships = document.getElementById("prevPageBtn");
const nextPageBtnStarships = document.getElementById("nextPageBtn");
const currentPageSpanStarships = document.getElementById("currentPage");
const lastPageSpanStarships = document.getElementById("lastPage");
const modalStarships = document.getElementById("myModal");
const modalContentContainerStarships = document.getElementById("modal-content-container");
const closeModalStarships = document.getElementById("modal-close-btn");
const pageIntroductionContainerStarships = document.querySelector(".page-introduction-container");
const paginationFooterStarships = document.getElementById("paginationFooter");
paginationFooterStarships.style.display = "flex"
pageIntroductionContainerStarships.style.display = "none";

// Variables para almacenar información de paginación de naves espaciales
let currentPageStarships = 1;
let lastPageStarships = 1;

// Función para cargar datos de la página actual de naves espaciales
function loadPageStarships(page) {
    const apiUrlStarships = `https://swapi.dev/api/starships/?page=${page}`;
    fetch(apiUrlStarships)
        .then(response => response.json())
        .then(data => {
            lastPageStarships = Math.ceil(data.count / data.results.length);
            displayStarships(data.results);
            updatePaginationInfoStarships();
        })
        .catch(error => console.error("Error fetching starships data:", error));
}

// Función para actualizar la información de paginación de naves espaciales
function updatePaginationInfoStarships() {
    currentPageSpanStarships.textContent = currentPageStarships;
    lastPageSpanStarships.textContent = lastPageStarships;
}

// Evento de clic para el botón "Anterior" de naves espaciales
prevPageBtnStarships.addEventListener("click", function () {
    if (currentPageStarships > 1) {
        currentPageStarships--;
        loadPageStarships(currentPageStarships);
    }
});

// Evento de clic para el botón "Siguiente" de naves espaciales
nextPageBtnStarships.addEventListener("click", function () {
    currentPageStarships++;
    loadPageStarships(currentPageStarships);
});

// Evento de clic para cerrar el modal de naves espaciales
closeModalStarships.addEventListener("click", function () {
    closeModalHandlerStarships();
});

// Esta función se ejecutará cuando se cargue este módulo de naves espaciales
function initCategoryStarships() {
    // Realiza una solicitud a la API SWAPI para obtener información sobre naves espaciales
    loadPageStarships(currentPageStarships);
}

// Función para mostrar la información de las naves espaciales en una tabla
function displayStarships(starships) {
    const dataTableStarships = document.getElementById("dataTable");

    // Limpia la tabla existente de naves espaciales
    dataTableStarships.innerHTML = "";

    // Crea el encabezado de la tabla de naves espaciales
    const tableHeaderStarships = document.createElement("thead");
    const headerRowStarships = document.createElement("tr");
    const columnsStarships = [
        "Model",
        "Name",
        "MGLT",
        "Cargo Capacity",
        "Consumables",
        "Cost in Credits",
        "Length",
        "Manufacturer",
        "Max Atmosphering Speed",
        "Passengers",
        "Films"
    ];

    columnsStarships.forEach(columnName => {
        const th = document.createElement("th");
        th.textContent = columnName;
        headerRowStarships.appendChild(th);
    });

    tableHeaderStarships.appendChild(headerRowStarships);
    dataTableStarships.appendChild(tableHeaderStarships);

    // Crea las filas de datos para cada nave espacial
    const tableBodyStarships = document.createElement("tbody");
    starships.forEach(starship => {
        const row = document.createElement("tr");

        const modelCell = document.createElement("td");
        modelCell.textContent = starship.model;
        row.appendChild(modelCell);

        const nameCell = document.createElement("td");
        nameCell.textContent = starship.name;
        row.appendChild(nameCell);

        // Luego, puedes agregar las demás columnas en el orden que desees
        // ...

        // Resto de las columnas
        const mgltCell = document.createElement("td");
        mgltCell.textContent = starship.MGLT;
        row.appendChild(mgltCell);

        const cargoCapacityCell = document.createElement("td");
        cargoCapacityCell.textContent = starship.cargo_capacity;
        row.appendChild(cargoCapacityCell);

        const consumablesCell = document.createElement("td");
        consumablesCell.textContent = starship.consumables;
        row.appendChild(consumablesCell);

        const costInCreditsCell = document.createElement("td");
        costInCreditsCell.textContent = starship.cost_in_credits;
        row.appendChild(costInCreditsCell);


        const lengthCell = document.createElement("td");
        lengthCell.textContent = starship.length;
        row.appendChild(lengthCell);

        const manufacturerCell = document.createElement("td");
        manufacturerCell.textContent = starship.manufacturer;
        row.appendChild(manufacturerCell);

        const maxAtmospheringSpeedCell = document.createElement("td");
        maxAtmospheringSpeedCell.textContent = starship.max_atmosphering_speed;
        row.appendChild(maxAtmospheringSpeedCell);

        const passengersCell = document.createElement("td");
        passengersCell.textContent = starship.passengers;
        row.appendChild(passengersCell);

        const filmsCell = document.createElement("td");

        // Verificar si starship.films existe antes de iterar sobre él
        if (starship.films && starship.films.length > 0) {
            const filmsCount = starship.films.length;

            starship.films.forEach((filmUrl, index) => {
                fetch(filmUrl)
                    .then(response => response.json())
                    .then(filmData => {
                        const filmName = filmData.title;
                        const filmLink = document.createElement("a");
                        filmLink.textContent = filmName;

                        // Si no es el último elemento, agrega una coma después del enlace
                        if (index < filmsCount - 1) {
                            const commaSpan = document.createElement("span");
                            commaSpan.textContent = ', ';
                            filmsCell.appendChild(filmLink);
                            filmsCell.appendChild(commaSpan);
                        } else {
                            // Si es el último elemento, no agrega una coma
                            filmsCell.appendChild(filmLink);
                        }

                        filmLink.href = "#"; // Puedes establecer el enlace como "#" por ahora

                        // Agrega un evento de clic al enlace para abrir el modal y cargar el contenido de la película
                        filmLink.addEventListener("click", function (event) {
                            event.preventDefault(); // Evita la navegación por defecto
                            openModalWithFilm(filmUrl); // Función para abrir el modal y cargar el contenido de la película
                        });
                    })
                    .catch(error => console.error("Error fetching film data:", error));
            });
        } else {
            // Si starship.films no existe o está vacío, simplemente muestra un guión o un mensaje
            filmsCell.textContent = "-";
        }

        row.appendChild(filmsCell);
        tableBodyStarships.appendChild(row);
    });

    dataTableStarships.appendChild(tableBodyStarships);
    // ...
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

            // Actualiza el contenido del modal de naves espaciales y lo muestra
            modalContentContainerStarships.innerHTML = modalContentHTML;
            modalStarships.style.display = "flex";
        })
        .catch(error => console.error("Error fetching film data:", error));
}

// Función para cerrar el modal de naves espaciales
function closeModalHandlerStarships() {
    modalStarships.style.display = "none";
}

// Llama a la función de inicialización de naves espaciales cuando se carga este módulo
initCategoryStarships();