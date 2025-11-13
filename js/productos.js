const products_list = [
    {id: 1, categoria:"ropa", nombre:"Anana", precio: 200, ruta_img: "img/anana.jpg"},
    {id: 2, categoria:"suplemento", nombre:"Arandano", precio: 100, ruta_img: "img/arandano.jpg"},
    {id: 3, categoria:"suplemento", nombre: "Banana", precio: 350, ruta_img: "img/banana.jpg"},
    {id: 4, categoria:"suplemento", nombre: "Frambuesa", precio: 160, ruta_img: "img/frambuesa.png"},
    {id: 5, categoria:"ropa", nombre: "Frutilla", precio: 80, ruta_img: "img/frutilla.jpg"},
    {id: 6, categoria:"ropa", nombre: "Kiwi", precio: 190, ruta_img: "img/kiwi.jpg"},
    {id: 7, categoria:"ropa", nombre: "Mandarina", precio: 40, ruta_img: "img/mandarina.jpg"},
    {id: 8, categoria:"ropa", nombre: "Manzana", precio: 80, ruta_img: "img/manzana.jpg"},
    {id: 9, categoria:"suplemento", nombre: "Naranja", precio: 25, ruta_img: "img/naranja.jpg"},
    {id: 10, categoria:"suplemento", nombre: "Pera", precio: 200, ruta_img: "img/pera.jpg"},
    {id: 11, categoria:"ropa", nombre: "Pomelo amarillo", precio: 182, ruta_img: "img/pomelo-amarillo.jpg"},
    {id: 12, categoria:"ropa", nombre: "Pomelo rojo", precio: 500, ruta_img: "img/pomelo-rojo.jpg"},
    {id: 13, categoria:"suplemento", nombre: "Ssandia", precio: 50, ruta_img: "img/sandia.jpg"}
];


let product = document.querySelector('#products-container');

function displayProducts(product_array) {
//string vacio para agregarle la estructura del producto
    let product_card = '';
    product_array.forEach(element => {
        product_card += `
        <div class="product-card">
            <img src="${element.ruta_img}" alt="${element.nombre}">
            <h3>${element.nombre}</h3>
            <p>Categoria: ${element.categoria}</p>
            <p>$${element.precio}</p>
            <button onclick="agregarACarrito(${element.id})" class="boton-agregar-carrito">Agregar al carrito</button>
        </div>
        `;
    });
    product.innerHTML = product_card;
}
function init() {
    displayProducts(products_list);
}
init();

