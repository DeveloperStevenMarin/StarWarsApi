document.addEventListener("DOMContentLoaded", function () {
    const apiUrl = "https://swapi.dev/api/";
    const categoryPicker = document.getElementById("categoryPicker");
    const categoryScript = document.getElementById("categoryScript");
    const global = {}
    global.prevPageBtn = document.getElementById("prevPageBtn");
    global.nextPageBtn = document.getElementById("nextPageBtn");
    global.currentPageSpan = document.getElementById("currentPage");
    global.lastPageSpan = document.getElementById("lastPage");
    global.modal = document.getElementById("myModal");
    global.modalContentContainer = document.getElementById("modal-content-container");
    global.closeModal = document.getElementById("modal-close-btn");
    global.pageIntroductionContainer = document.querySelector(".page-introduction-container");
    global.paginationFooter = document.getElementById("paginationFooter");

    // Función para cargar y ejecutar el módulo JavaScript específico según la categoría
    function loadCategoryModule(selectedCategory) {
        const moduleFileName = `${selectedCategory}.js`;
        const moduleFilePath = `js/${moduleFileName}`;

        // Comprueba si el módulo ya está cargado
        if (document.querySelector(`script[src="${moduleFilePath}"]`)) {
            // Si ya está cargado, solo ejecuta la función initCategory del módulo
            if (window[selectedCategory] && typeof window[selectedCategory].initCategory === "function") {
                window[selectedCategory].initCategory();
            }
        } else {
            // Si no está cargado, crea un nuevo script para cargar el módulo y ejecutar initCategory
            const newScript = document.createElement("script");
            newScript.src = moduleFilePath;
            newScript.onload = function () {
                if (window[selectedCategory] && typeof window[selectedCategory].initCategory === "function") {
                    window[selectedCategory].initCategory();
                }
            };

            // Remueve el script anterior para evitar cargar varios scripts de la misma categoría
            const previousScript = document.querySelector("#loadedCategoryScript");
            if (previousScript) {
                previousScript.remove();
            }

            // Agrega el nuevo script al DOM y asigna un ID para futuras referencias
            newScript.id = "loadedCategoryScript";
            document.body.appendChild(newScript);
        }
    }

    // Escucha el evento de cambio en el selector
    categoryPicker.addEventListener("change", function () {
        const selectedCategory = categoryPicker.value;

        // Carga y ejecuta el módulo JavaScript específico según la categoría
        loadCategoryModule(selectedCategory);
    });
});