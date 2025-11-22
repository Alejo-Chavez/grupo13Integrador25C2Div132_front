const products_list = [
    {id: 1, categoria:"Ropa Deportiva", nombre:"Anana", precio: 200, ruta_img: "img/anana.jpg"},
    {id: 2, categoria:"Suplemento", nombre:"Arandano", precio: 100, ruta_img: "img/arandano.jpg"},
    {id: 3, categoria:"Suplemento", nombre: "Banana", precio: 350, ruta_img: "img/banana.jpg"},
    {id: 4, categoria:"Suplemento", nombre: "Frambuesa", precio: 160, ruta_img: "img/frambuesa.png"},
    {id: 5, categoria:"Ropa Deportiva", nombre: "Frutilla", precio: 80, ruta_img: "img/frutilla.jpg"},
    {id: 6, categoria:"Ropa Deportiva", nombre: "Kiwi", precio: 190, ruta_img: "img/kiwi.jpg"},
    {id: 7, categoria:"Ropa Deportiva", nombre: "Mandarina", precio: 40, ruta_img: "img/mandarina.jpg"},
    {id: 8, categoria:"Ropa Deportiva", nombre: "Manzana", precio: 80, ruta_img: "img/manzana.jpg"},
    {id: 9, categoria:"Suplemento", nombre: "Naranja", precio: 25, ruta_img: "img/naranja.jpg"},
    {id: 10, categoria:"Suplemento", nombre: "Pera", precio: 200, ruta_img: "img/pera.jpg"},
    {id: 11, categoria:"Ropa Deportiva", nombre: "Pomelo amarillo", precio: 182, ruta_img: "img/pomelo-amarillo.jpg"},
    {id: 12, categoria:"Ropa Deportiva", nombre: "Pomelo rojo", precio: 500, ruta_img: "img/pomelo-rojo.jpg"},
    {id: 13, categoria:"Suplemento", nombre: "Ssandia", precio: 50, ruta_img: "img/sandia.jpg"},
    {id: 1, categoria:"Ropa Deportiva", nombre:"Anana", precio: 200, ruta_img: "img/anana.jpg"},
    {id: 2, categoria:"Suplemento", nombre:"Arandano", precio: 100, ruta_img: "img/arandano.jpg"},
    {id: 3, categoria:"Suplemento", nombre: "Banana", precio: 350, ruta_img: "img/banana.jpg"},
    {id: 4, categoria:"Suplemento", nombre: "Frambuesa", precio: 160, ruta_img: "img/frambuesa.png"},
    {id: 5, categoria:"Ropa Deportiva", nombre: "Frutilla", precio: 80, ruta_img: "img/frutilla.jpg"},
    {id: 6, categoria:"Ropa Deportiva", nombre: "Kiwi", precio: 190, ruta_img: "img/kiwi.jpg"},
    {id: 7, categoria:"Ropa Deportiva", nombre: "Mandarina", precio: 40, ruta_img: "img/mandarina.jpg"},
    {id: 8, categoria:"Ropa Deportiva", nombre: "Manzana", precio: 80, ruta_img: "img/manzana.jpg"},
    {id: 9, categoria:"Suplemento", nombre: "Naranja", precio: 25, ruta_img: "img/naranja.jpg"},
    {id: 10, categoria:"Suplemento", nombre: "Pera", precio: 200, ruta_img: "img/pera.jpg"},
    {id: 11, categoria:"Ropa Deportiva", nombre: "Pomelo amarillo", precio: 182, ruta_img: "img/pomelo-amarillo.jpg"},
    {id: 12, categoria:"Ropa Deportiva", nombre: "Pomelo rojo", precio: 500, ruta_img: "img/pomelo-rojo.jpg"},
    {id: 13, categoria:"Suplemento", nombre: "Ssandia", precio: 50, ruta_img: "img/sandia.jpg"}
    
];


//===== FUNCION PARA MOSTRAR LOS PORDUCTOS =======

function displayProducts(productArray) {
    const container = document.getElementById("products-section");
    container.innerHTML = ""; // Limpia lo anterior

    productArray.forEach(prod => {
        const card = `
            <div class="product-card">
                <div class="image-container">
                    <img src="${prod.ruta_img}" alt="${prod.nombre}">
                </div>
                <div class="information-container">
                    <h3>${prod.nombre}</h3>
                    <p class="product-category" >${prod.categoria}</p>
                    <p class="product-price" >$${prod.precio}</p>
                    <button class="add-to-cart-btn" onclick="agregarACarrito(${prod.id})">
                        Agregar al carrito
                    </button>
                </div>
            </div>
        `;
        container.innerHTML += card;
    });
}

//========================== FILTRAR POR CATEGORIA =====================
const suplementosBtn = document.querySelector('.supplement-sort-btn');
const ropaBtn = document.querySelector('.clothes-sort-btn');
let currentCategoryFilter = null;  // Guarda qué categoría está filtrada (null = sin filtro)


suplementosBtn.addEventListener('click', () => filterByCategory("Suplemento"));
ropaBtn.addEventListener('click', () => filterByCategory("Ropa Deportiva"));

function filterByCategory(category) {
    // Si el filtro ya está activo, lo desactivamos (toggle)
    if (currentCategoryFilter === category) {
        currentCategoryFilter = null;
        displayProducts(products_list); // Mostrar todos los productos
        updateCategoryButtons();        // Actualizar apariencia de botones
        return;
    }
    
    // Aplicamos el nuevo filtro
    currentCategoryFilter = category;
    const filteredProducts = products_list.filter(prod => prod.categoria === category);
    displayProducts(filteredProducts);
    updateCategoryButtons();
}

function updateCategoryButtons() {
    const suplementosBtn = document.querySelector('.supplement-sort-btn');
    const ropaBtn = document.querySelector('.clothes-sort-btn');
    
    // Remover clase activa de ambos botones
    suplementosBtn.classList.remove('active-category');
    ropaBtn.classList.remove('active-category');
    
    // Aplicar clase activa al botón correspondiente si hay filtro activo
    if (currentCategoryFilter === "Suplemento") {
        suplementosBtn.classList.add('active-category');
    } else if (currentCategoryFilter === "Ropa Deportiva") {
        ropaBtn.classList.add('active-category');
    }
}


//================= MOSTRAR AL TOCAR EL BOTON ORDENAR ======================
const sortButton = document.getElementById("sort-button");
const sortDropdown = document.getElementById("sort-dropdown");
let dropdownOpen = false;
let currentSort = null;

// Abrir/cerrar dropdown
sortButton.addEventListener("click", (event) => {

    event.stopPropagation();
    dropdownOpen = !dropdownOpen;
    sortDropdown.classList.toggle('active', dropdownOpen);
});

// Al hacer clic en una opción
sortDropdown.addEventListener('click', (event) => {

    if (event.target.tagName === 'A') {
        event.preventDefault();
        const selectedOption = event.target.dataset.sort;
        const optionText = event.target.textContent.trim();

        // Si hace clic en la misma opción que ya estaba activa → vuelve a default
        if (currentSort === selectedOption) {
            currentSort = null;
            sortButton.textContent = "Ordenar";
            sortButton.classList.remove('active-sort');
            sortProducts("default"); // es el orden original
        } else {
            // Si es una opción nueva la activamos
            currentSort = selectedOption;
            sortButton.textContent = optionText;
            sortButton.classList.add('active-sort');
            sortProducts(selectedOption);
        }

        // Resaltar visualmente la opción seleccionada
        sortDropdown.querySelectorAll('a').forEach(a => {
            a.classList.remove('selected');
        });
        if (currentSort !== null) {
            event.target.classList.add('selected');
        }

        // Cerrar dropdown
        sortDropdown.classList.remove('active');
        dropdownOpen = false;
    }
});
 //Cierra el dropdown si se hace click afuera
document.addEventListener('click', () => {
    if (dropdownOpen) {
        sortDropdown.classList.remove('active');
        dropdownOpen = false;
    }
});
//================== AHORA LA FUNCION PARA ORDENAR LOS PRODUCTOS ======================
function sortProducts(option){
    let sortedProducts = [...products_list]

    if (currentCategoryFilter) {
        sortedProducts = sortedProducts.filter(prod => prod.categoria === currentCategoryFilter);
    }

    switch(option){
        case "lowest-price":
            sortedProducts.sort((a, b)=> a.precio - b.precio);
            break;

        case "highest-price":
            sortedProducts.sort((a, b)=> b.precio - a.precio);
            break;
        case "az":                   
            sortedProducts.sort((a, b) => a.nombre.localeCompare(b.nombre));
            break;

        case "za":                    
            sortedProducts.sort((a, b) => b.nombre.localeCompare(a.nombre));
            break;

        default:
            // Si por alguna razón llega algo raro, vuelve al orden original
            sortedProducts = products_list;
            // ============ Aplicar filtro de categoría si está activo ============
            if (currentCategoryFilter) {
                sortedProducts = sortedProducts.filter(prod => prod.categoria === currentCategoryFilter);
            }
            break;
    }
    displayProducts(sortedProducts);
    updateCategoryButtons();
}




function init() {
    // Llamamos a la nueva función que separa por categoria
    displayProducts(products_list);
}

init();

