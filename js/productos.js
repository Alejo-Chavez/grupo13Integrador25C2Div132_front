const url = "http://localhost:3000/api/productos";

let products_list = [];
let cart = [];
const suplementosBtn = document.querySelector('.supplement-sort-btn');
const ropaBtn = document.querySelector('.clothes-sort-btn');
const cartCount = document.getElementById("cart-badge");
let currentCategoryFilter = null;  // Guarda qué categoría está filtrada (null = sin filtro)


//FUNCION PARA OBETENER LOS PRODUCTOS DESDE EL BACKEND
async function getProducts() {
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    products_list = Array.isArray(data.payload) ? data.payload : data;
    displayProducts(products_list);

  } catch (error) {
    console.error("Error en getProducts:", error);
    
    // ← CORREGIR: Obtener el contenedor primero
    const productContainer = document.getElementById("products-section");
    if (productContainer) {
      productContainer.innerHTML = `<p>Error al cargar productos: ${error.message}</p>`;
        }
    }
}

//===== FUNCION PARA MOSTRAR LOS PORDUCTOS =======
function displayProducts(productArray) {
    const productContainer = document.getElementById("products-section");
    if (!productContainer) return; //por si no existe el contenedor
    productContainer.innerHTML = ""; // Limpia lo anterior

    //verifica si hay productos para mostarar
    if (!productArray || productArray.length === 0) {
        productContainer.innerHTML = "<p>No hay productos disponibles</p>";
        return;
    }

    productArray.forEach(prod => {
        const card = `
            <div class="product-card">
                <div class="image-container">
                    <img src="${prod.img}" alt="${prod.nombre}">
                </div>
                <div class="information-container">
                    <h3>${prod.nombre}</h3>
                    <p class="product-category"> ${prod.categoria}</p>
                    <p class="product-price" >$${prod.precio}</p>
                    <button class="add-to-cart-btn" onclick="addToCart(${prod.id})">
                        Agregar al carrito
                    </button>
                </div>
            </div>
        `;
        productContainer.innerHTML += card;
    });
}
//
//========================== FILTRAR POR CATEGORIA =====================



suplementosBtn.addEventListener('click', () => filterByCategory("suplemento"));
ropaBtn.addEventListener('click', () => filterByCategory("ropa_deportiva"));

function filterByCategory(category) {
    // Verifica si hay productos para filtrar
    if (!products_list || products_list.length === 0) {
        console.error("No hay productos para filtrar");
        return;
    }

    // Si el filtro ya está activo, lo desactivamos (toggle)
    if (currentCategoryFilter === category) {
        currentCategoryFilter = null;
        displayProducts(products_list); // Mostrar todos los productos
        updateCategoryButtons();        // Actualizar apariencia de botones
        return;
    }
    
    currentCategoryFilter = category;
    
    const filteredProducts = products_list.filter(prod => 
        prod.categoria === category 
    );
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
    if (currentCategoryFilter === "suplemento") {
        suplementosBtn.classList.add('active-category');
    } else if (currentCategoryFilter === "ropa_deportiva") {
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

        // Si hace clic en la misma opción que ya estaba activa  vuelve a default
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
    let sortedProducts = [...products_list];

    if (!sortedProducts || sortedProducts.length === 0) {
        console.error("No hay productos para ordenar");
        return;
    }

    if (currentCategoryFilter) {
        sortedProducts = sortedProducts.filter(prod => 
        prod.categoria === currentCategoryFilter);
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
//=========================== CARRITO =================================
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function loadCart() {
    const cartStorage = localStorage.getItem("cart");
    if (cartStorage) {
        cart = JSON.parse(cartStorage);
    } else {
        cart = [];
    }
}
function addToCart(id){
    const selectedProd = products_list.find(p => p.id === id);
    if(selectedProd){
        const itemOnCart = cart.find(item => item.id === id);

        if (itemOnCart) {
            itemOnCart.cantidad += 1;
        } else {
  
          cart.push({
          id: selectedProd.id,
          nombre: selectedProd.nombre,
          categoria: selectedProd.categoria,
          precio: selectedProd.precio,
          img: selectedProd.img,
          cantidad: 1,
    });
  }       
        saveCart();
        updateCartQuantity();
        //alert(`Se agregó ${selectedProd.nombre} al carrito!`);
    } else {
        console.error("Producto no encontrado con ID:", id);
    }
}

function updateCartQuantity() {
    const cartTotal = cart.reduce((total, prod) => total + prod.cantidad, 0);
    
    if(cartTotal > 0 ){
        cartCount.style.display = 'block';
    }
    cartCount.textContent = cartTotal;
}




async function init() {
    // Llamamos a la nueva función que separa por categoria
    loadCart();
    updateCartQuantity();
    await getProducts();
    displayProducts(products_list);
}

init();

