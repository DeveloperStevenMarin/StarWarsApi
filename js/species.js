// species.js

// Footer para el paginado de especies
const prevPageBtnSpecies = document.getElementById("prevPageBtn");
const nextPageBtnSpecies = document.getElementById("nextPageBtn");
const currentPageSpanSpecies = document.getElementById("currentPage");
const lastPageSpanSpecies = document.getElementById("lastPage");
const modalSpecies = document.getElementById("myModal");
const modalContentContainerSpecies = document.getElementById("modal-content-container");
const closeModalSpecies = document.getElementById("modal-close-btn");

// Variables para almacenar información de paginación de especies
let currentPageSpecies = 1;
let lastPageSpecies = 1;

// Función para cargar datos de la página actual de especies
function loadPageSpecies(page) {
    const apiUrlSpecies = `https://swapi.dev/api/species/?page=${page}`;
    fetch(apiUrlSpecies)
        .then(response => response.json())
        .then(data => {
            lastPageSpecies = Math.ceil(data.count / data.results.length);
            displaySpecies(data.results);
            updatePaginationInfoSpecies();
        })
        .catch(error => console.error("Error fetching species data:", error));
}

// Función para actualizar la información de paginación de especies
function updatePaginationInfoSpecies() {
    currentPageSpanSpecies.textContent = currentPageSpecies;
    lastPageSpanSpecies.textContent = lastPageSpecies;
}

// Evento de clic para el botón "Anterior" de especies
prevPageBtnSpecies.addEventListener("click", function () {
    if (currentPageSpecies > 1) {
        currentPageSpecies--;
        loadPageSpecies(currentPageSpecies);
    }
});

// Evento de clic para el botón "Siguiente" de especies
nextPageBtnSpecies.addEventListener("click", function () {
    currentPageSpecies++;
    loadPageSpecies(currentPageSpecies);
});

// Evento de clic para cerrar el modal de especies
closeModalSpecies.addEventListener("click", function () {
    closeModalHandlerSpecies();
});

// Esta función se ejecutará cuando se cargue este módulo de especies
function initCategorySpecies() {
    // Realiza una solicitud a la API SWAPI para obtener información sobre especies
    loadPageSpecies(currentPageSpecies);
}

// Función para mostrar la información de las especies en una tabla
function displaySpecies(species) {
    const dataTableSpecies = document.getElementById("dataTable");

    // Limpia la tabla existente de especies
    dataTableSpecies.innerHTML = "";

    // Crea el encabezado de la tabla de especies
    const tableHeaderSpecies = document.createElement("thead");
    const headerRowSpecies = document.createElement("tr");
    const columnsSpecies = [
        "Name",
        "Average Height",
        "Average Lifespan",
        "Classification",
        "Designation",
        "Eye Colors",
        "Hair Colors",
        "Skin Colors",
        "People"
    ];

    columnsSpecies.forEach(columnName => {
        const th = document.createElement("th");
        th.textContent = columnName;
        headerRowSpecies.appendChild(th);
    });

    tableHeaderSpecies.appendChild(headerRowSpecies);
    dataTableSpecies.appendChild(tableHeaderSpecies);

    // Crea las filas de datos para cada especie
    const tableBodySpecies = document.createElement("tbody");
    species.forEach(specie => {
        const row = document.createElement("tr");

        const nameCell = document.createElement("td");
        nameCell.textContent = specie.name;
        row.appendChild(nameCell);

        const averageHeightCell = document.createElement("td");
        averageHeightCell.textContent = specie.average_height;
        row.appendChild(averageHeightCell);

        const averageLifespanCell = document.createElement("td");
        averageLifespanCell.textContent = specie.average_lifespan;
        row.appendChild(averageLifespanCell);

        const classificationCell = document.createElement("td");
        classificationCell.textContent = specie.classification;
        row.appendChild(classificationCell);

        const designationCell = document.createElement("td");
        designationCell.textContent = specie.designation;
        row.appendChild(designationCell);

        const eyeColorsCell = document.createElement("td");
        eyeColorsCell.textContent = specie.eye_colors;
        row.appendChild(eyeColorsCell);

        const hairColorsCell = document.createElement("td");
        hairColorsCell.textContent = specie.hair_colors;
        row.appendChild(hairColorsCell);

        const skinColorsCell = document.createElement("td");
        skinColorsCell.textContent = specie.skin_colors;
        row.appendChild(skinColorsCell);

        const peopleCell = document.createElement("td");

        // Verificar si specie.people existe antes de iterar sobre él
        if (specie.people && specie.people.length > 0) {
            const peopleCount = specie.people.length;

            specie.people.forEach((personUrl, index) => {
                fetch(personUrl)
                    .then(response => response.json())
                    .then(personData => {
                        const personName = personData.name;
                        const personLink = document.createElement("a");
                        personLink.textContent = personName;

                        // Si no es el último elemento, agrega una coma después del enlace
                        if (index < peopleCount - 1) {
                            const commaSpan = document.createElement("span");
                            commaSpan.textContent = ', ';
                            peopleCell.appendChild(personLink);
                            peopleCell.appendChild(commaSpan);
                        } else {
                            // Si es el último elemento, no agrega una coma
                            peopleCell.appendChild(personLink);
                        }

                        personLink.href = "#"; // Puedes establecer el enlace como "#" por ahora

                        // Agrega un evento de clic al enlace para abrir el modal y cargar el contenido del personaje
                        personLink.addEventListener("click", function (event) {
                            event.preventDefault(); // Evita la navegación por defecto
                            openModalWithCharacter(personUrl); // Función para abrir el modal y cargar el contenido del personaje
                        });
                    })
                    .catch(error => console.error("Error fetching person data:", error));
            });
        } else {
            // Si specie.people no existe o está vacío, simplemente muestra un guión o un mensaje
            peopleCell.textContent = "-";
        }

        row.appendChild(peopleCell);
        tableBodySpecies.appendChild(row);
    });

    dataTableSpecies.appendChild(tableBodySpecies);
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
            // Actualiza el contenido del modal de especies y lo muestra
            modalContentContainerSpecies.innerHTML = modalContentHTML;
            modalSpecies.style.display = "flex";

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

// Función para cerrar el modal de especies
function closeModalHandlerSpecies() {
    modalSpecies.style.display = "none";
}

// Llama a la función de inicialización de especies cuando se carga este módulo
initCategorySpecies();