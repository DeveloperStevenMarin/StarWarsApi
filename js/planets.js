// planets.js

// Footer para el paginado de planetas
const prevPageBtnPlanets = document.getElementById("prevPageBtn");
const nextPageBtnPlanets = document.getElementById("nextPageBtn");
const currentPageSpanPlanets = document.getElementById("currentPage");
const lastPageSpanPlanets = document.getElementById("lastPage");
const modalPlanets = document.getElementById("myModal");
const modalContentContainerPlanets = document.getElementById("modal-content-container");
const closeModalPlanets = document.getElementById("modal-close-btn");
const pageIntroductionContainerPlanets = document.querySelector(".page-introduction-container");
const paginationFooterPlanets = document.getElementById("paginationFooter");
paginationFooterPlanets.style.display = "flex"
pageIntroductionContainerPlanets.style.display = "none";

// Variables para almacenar información de paginación de planetas
let currentPagePlanets = 1;
let lastPagePlanets = 1;

// Función para cargar datos de la página actual de planetas
function loadPagePlanets(page) {
    const apiUrlPlanets = `https://swapi.dev/api/planets/?page=${page}`;
    fetch(apiUrlPlanets)
        .then(response => response.json())
        .then(data => {
            lastPagePlanets = Math.ceil(data.count / data.results.length);
            displayPlanets(data.results);
            updatePaginationInfoPlanets();
        })
        .catch(error => console.error("Error fetching planet data:", error));
}

// Función para actualizar la información de paginación de planetas
function updatePaginationInfoPlanets() {
    currentPageSpanPlanets.textContent = currentPagePlanets;
    lastPageSpanPlanets.textContent = lastPagePlanets;
}

// Evento de clic para el botón "Anterior" de planetas
prevPageBtnPlanets.addEventListener("click", function () {
    if (currentPagePlanets > 1) {
        currentPagePlanets--;
        loadPagePlanets(currentPagePlanets);
    }
});

// Evento de clic para el botón "Siguiente" de planetas
nextPageBtnPlanets.addEventListener("click", function () {
    currentPagePlanets++;
    loadPagePlanets(currentPagePlanets);
});

// Evento de clic para cerrar el modal de planetas
closeModalPlanets.addEventListener("click", function () {
    closeModalHandlerPlanets();
});

// Esta función se ejecutará cuando se cargue este módulo de planetas
function initCategoryPlanets() {
    // Realiza una solicitud a la API SWAPI para obtener información sobre planetas
    loadPagePlanets(currentPagePlanets);
}

// Función para mostrar la información de los planetas en una tabla
function displayPlanets(planets) {
    const dataTablePlanets = document.getElementById("dataTable");

    // Limpia la tabla existente de planetas
    dataTablePlanets.innerHTML = "";

    // Crea el encabezado de la tabla de planetas
    const tableHeaderPlanets = document.createElement("thead");
    const headerRowPlanets = document.createElement("tr");
    const columnsPlanets = ["Name", "Diameter", "Gravity", "Climate", "Population", "Terrain"];

    columnsPlanets.forEach(columnName => {
        const th = document.createElement("th");
        th.textContent = columnName;
        headerRowPlanets.appendChild(th);
    });

    tableHeaderPlanets.appendChild(headerRowPlanets);
    dataTablePlanets.appendChild(tableHeaderPlanets);

    // Crea las filas de datos para cada planeta
    const tableBodyPlanets = document.createElement("tbody");
    planets.forEach(planet => {
        const row = document.createElement("tr");

        const nameCell = document.createElement("td");
        nameCell.textContent = planet.name;
        row.appendChild(nameCell);

        const diameterCell = document.createElement("td");
        diameterCell.textContent = planet.diameter;
        row.appendChild(diameterCell);

        const gravityCell = document.createElement("td");
        gravityCell.textContent = planet.gravity;
        row.appendChild(gravityCell);

        const climateCell = document.createElement("td");
        climateCell.textContent = planet.climate;
        row.appendChild(climateCell);

        const populationCell = document.createElement("td");
        populationCell.textContent = planet.population;
        row.appendChild(populationCell);

        const terrainCell = document.createElement("td");
        terrainCell.textContent = planet.terrain;
        row.appendChild(terrainCell);

        tableBodyPlanets.appendChild(row);
    });

    dataTablePlanets.appendChild(tableBodyPlanets);
}

// Función para abrir el modal y cargar el contenido de un planeta
function openModalWithPlanet(planetData) {
    // Crea el contenido específico del planeta en el modal
    const modalContentHTML = `
        <h2>${planetData.name}</h2>
        <p>Diameter: ${planetData.diameter}</p>
        <p>Gravity: ${planetData.gravity}</p>
        <p>Climate: ${planetData.climate}</p>
        <p>Population: ${planetData.population}</p>
        <p>Terrain: ${planetData.terrain}</p>
    `;

    // Actualiza el contenido del modal de planetas y lo muestra
    modalContentContainerPlanets.innerHTML = modalContentHTML;
    modalPlanets.style.display = "flex";
}

// Función para cerrar el modal de planetas
function closeModalHandlerPlanets() {
    modalPlanets.style.display = "none";
}

// Llama a la función de inicialización de planetas cuando se carga este módulo
initCategoryPlanets();