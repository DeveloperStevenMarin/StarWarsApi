// people.js

// Footer para el paginado
const prevPageBtn = document.getElementById("prevPageBtn");
const nextPageBtn = document.getElementById("nextPageBtn");
const currentPageSpan = document.getElementById("currentPage");
const lastPageSpan = document.getElementById("lastPage");
const modal = document.getElementById("myModal");
const modalContentContainer = document.getElementById("modal-content-container");
const closeModal = document.getElementById("modal-close-btn");

// Variables para almacenar información de paginación
let currentPage = 1;
let lastPage = 1;


// Función para cargar datos de la página actual
function loadPage(page) {
    const apiUrl = `https://swapi.dev/api/people/?page=${page}`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            lastPage = Math.ceil(data.count / data.results.length);
            displayPeople(data.results);
            updatePaginationInfo();
        })
        .catch(error => console.error("Error fetching people data:", error));
}

closeModal.addEventListener("click", function () {
    closeModalHandler()
});

// Función para actualizar la información de paginación
function updatePaginationInfo() {
    currentPageSpan.textContent = currentPage;
    lastPageSpan.textContent = lastPage;
}

// Evento de clic para el botón "Anterior"
prevPageBtn.addEventListener("click", function () {
    if (currentPage > 1) {
        currentPage--;
        loadPage(currentPage);
    }
});

// Evento de clic para el botón "Siguiente"
nextPageBtn.addEventListener("click", function () {
    currentPage++;
    loadPage(currentPage);
});

// Esta función se ejecutará cuando se cargue este módulo
function initCategory() {
    // Realiza una solicitud a la API SWAPI para obtener información sobre personajes
    loadPage(currentPage);
}

// Función para mostrar la información de los personajes en una tabla
function displayPeople(people) {
    const dataTable = document.getElementById("dataTable");

    // Limpia la tabla existente
    dataTable.innerHTML = "";

    // Crea el encabezado de la tabla
    const tableHeader = document.createElement("thead");
    const headerRow = document.createElement("tr");
    const columns = ["Name", "Birth Year", "Gender", "Homeworld", "Films"];

    columns.forEach(columnName => {
        const th = document.createElement("th");
        th.textContent = columnName;
        headerRow.appendChild(th);
    });

    tableHeader.appendChild(headerRow);
    dataTable.appendChild(tableHeader);

    // Crea las filas de datos para cada personaje
    const tableBody = document.createElement("tbody");
    people.forEach(person => {
        const row = document.createElement("tr");

        const nameCell = document.createElement("td");
        nameCell.textContent = person.name;
        row.appendChild(nameCell);

        const birthYearCell = document.createElement("td");
        birthYearCell.textContent = person.birth_year;
        row.appendChild(birthYearCell);

        const genderCell = document.createElement("td");
        genderCell.textContent = person.gender;
        row.appendChild(genderCell);

        const homeworldCell = document.createElement("td");
        const planetLink = document.createElement("a");
        
        if (person.homeworld) {
            fetch(person.homeworld)
                .then(response => response.json())
                .then(homeworldData => {
                    const planetName = homeworldData.name;
                    planetLink.textContent = planetName;
                    planetLink.href = "#"; // Puedes establecer el enlace como "#" por ahora
        
                    // Agrega un evento de clic al enlace para mostrar información de planetas en el modal
                    planetLink.addEventListener("click", function (event) {
                        event.preventDefault(); // Evita la navegación por defecto
                        openModalWithPlanets(person.homeworld); // Función para mostrar información de planetas en el modal
                    });
        
                    homeworldCell.appendChild(planetLink);
                })
                .catch(error => console.error("Error fetching homeworld data:", error));
        } else {
            // Si person.homeworld no existe, simplemente muestra un guión o un mensaje
            homeworldCell.textContent = "-";
        }
        
        row.appendChild(homeworldCell);

        const filmsCell = document.createElement("td");

        // Verificar si person.films existe antes de iterar sobre él
        if (person.films && person.films.length > 0) {
            const filmsCount = person.films.length;

            person.films.forEach((filmUrl, index) => {
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

                        // Agrega un evento de clic al enlace para abrir el modal y cargar el contenido
                        filmLink.addEventListener("click", function (event) {
                            event.preventDefault(); // Evita la navegación por defecto
                            openModalWithFilm(filmUrl); // Función para abrir el modal y cargar el contenido de la película
                        });
                    })
                    .catch(error => console.error("Error fetching film data:", error));
            });
        } else {
            // Si person.films no existe o está vacío, simplemente muestra un guión o un mensaje
            filmsCell.textContent = "-";
        }

        row.appendChild(filmsCell);
        tableBody.appendChild(row);
    });

    dataTable.appendChild(tableBody);
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
            modalContentContainer.innerHTML = modalContentHTML;
            modal.style.display = "flex";
        })
        .catch(error => console.error("Error fetching film data:", error));
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
                <!-- Puedes agregar más detalles de los planetas según tus necesidades -->
            `;

            // Actualiza el contenido del modal y lo muestra
            modalContentContainer.innerHTML = modalContentHTML;
            modal.style.display = "block";
        })
        .catch(error => console.error("Error fetching planet data:", error));
}

// Función para cerrar el modal
function closeModalHandler() {
    modal.style.display = "none";
}

// Llama a la función de inicialización cuando se carga este módulo
initCategory();