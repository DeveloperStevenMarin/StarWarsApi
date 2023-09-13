// vehicles.js

// Footer para el paginado de vehículos
const prevPageBtnVehicles = document.getElementById("prevPageBtn");
const nextPageBtnVehicles = document.getElementById("nextPageBtn");
const currentPageSpanVehicles = document.getElementById("currentPage");
const lastPageSpanVehicles = document.getElementById("lastPage");
const modalVehicles = document.getElementById("myModal");
const modalContentContainerVehicles = document.getElementById("modal-content-container");
const closeModalVehicles = document.getElementById("modal-close-btn");

// Variables para almacenar información de paginación de vehículos
let currentPageVehicles = 1;
let lastPageVehicles = 1;

// Función para cargar datos de la página actual de vehículos
function loadPageVehicles(page) {
    const apiUrlVehicles = `https://swapi.dev/api/vehicles/?page=${page}`;
    fetch(apiUrlVehicles)
        .then(response => response.json())
        .then(data => {
            lastPageVehicles = Math.ceil(data.count / data.results.length);
            displayVehicles(data.results);
            updatePaginationInfoVehicles();
        })
        .catch(error => console.error("Error fetching vehicle data:", error));
}

// Función para actualizar la información de paginación de vehículos
function updatePaginationInfoVehicles() {
    currentPageSpanVehicles.textContent = currentPageVehicles;
    lastPageSpanVehicles.textContent = lastPageVehicles;
}

// Evento de clic para el botón "Anterior" de vehículos
prevPageBtnVehicles.addEventListener("click", function () {
    if (currentPageVehicles > 1) {
        currentPageVehicles--;
        loadPageVehicles(currentPageVehicles);
    }
});

// Evento de clic para el botón "Siguiente" de vehículos
nextPageBtnVehicles.addEventListener("click", function () {
    currentPageVehicles++;
    loadPageVehicles(currentPageVehicles);
});

// Evento de clic para cerrar el modal de vehículos
closeModalVehicles.addEventListener("click", function () {
    closeModalHandlerVehicles();
});

// Esta función se ejecutará cuando se cargue este módulo de vehículos
function initCategoryVehicles() {
    // Realiza una solicitud a la API SWAPI para obtener información sobre vehículos
    loadPageVehicles(currentPageVehicles);
}

// Función para mostrar la información de los vehículos en una tabla
function displayVehicles(vehicles) {
    const dataTableVehicles = document.getElementById("dataTable");

    // Limpia la tabla existente de vehículos
    dataTableVehicles.innerHTML = "";

    // Crear las filas de datos para cada vehículo
    const tableBodyVehicles = document.createElement("tbody");
    vehicles.forEach(vehicle => {
        const row = document.createElement("tr");

        // Crear celdas para cada campo y asignar clases CSS
        createTableCell(row, vehicle.model, "model-cell");
        createTableCell(row, vehicle.name, "name-cell");
        createTableCell(row, vehicle.vehicle_class, "vehicle-class-cell");
        createTableCell(row, vehicle.cargo_capacity, "cargo-cell");
        createTableCell(row, vehicle.consumables, "consumables-cell");
        createTableCell(row, vehicle.cost_in_credits, "cost-cell");
        createTableCell(row, vehicle.length, "length-cell");
        createTableCell(row, vehicle.manufacturer, "manufacturer-cell");
        createTableCell(row, vehicle.max_atmosphering_speed, "max-speed-cell");
        createTableCell(row, vehicle.passengers, "passengers-cell");
        createFilmsCell(row, vehicle.films);

        tableBodyVehicles.appendChild(row);
    });

    dataTableVehicles.appendChild(tableBodyVehicles);
}

// Función para crear una celda de tabla con una clase CSS
function createTableCell(row, content, cssClass) {
    const cell = document.createElement("td");
    cell.textContent = content;
    cell.classList.add(cssClass);
    row.appendChild(cell);
}

// Función para crear una celda de tabla con enlaces a películas
function createFilmsCell(row, filmUrls) {
    const filmsCell = document.createElement("td");

    // Verificar si filmUrls existe antes de iterar sobre él
    if (filmUrls && filmUrls.length > 0) {
        const filmsCount = filmUrls.length;

        filmUrls.forEach((filmUrl, index) => {
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
        // Si filmUrls no existe o está vacío, simplemente muestra un guión o un mensaje
        filmsCell.textContent = "-";
    }

    row.appendChild(filmsCell);
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

            // Actualiza el contenido del modal de vehículos y lo muestra
            modalContentContainerVehicles.innerHTML = modalContentHTML;
            modalVehicles.style.display = "flex";
        })
        .catch(error => console.error("Error fetching film data:", error));
}

// Función para cerrar el modal de vehículos
function closeModalHandlerVehicles() {
    modalVehicles.style.display = "none";
}

// Llama a la función de inicialización de vehículos cuando se carga este módulo
initCategoryVehicles();