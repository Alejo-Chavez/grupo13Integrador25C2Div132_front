const url = "http://localhost:3000";
let cart = [];
// ==== === === === === === === === === ===
const cartContainer = document.getElementById("cart-container");
const cartList = document.getElementById("cart-list");
const cartAside = document.getElementById("cart-aside");
const cartEmpty = document.getElementById("cart-empty");
const logOut = document.getElementById("logOut")
const viewProducts = document.getElementById("viewProducts");
const cartTitle = document.getElementById("cart-title");
const ticketButton = document.getElementById("ticket-button");

//ADD EVENT LISTENER 
logOut.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "index.html";
});

viewProducts.addEventListener("click", () => {
    window.location.href = "productos.html";
});

ticketButton.addEventListener("click",()=>{
    window.location.href = "ticket.html"
})
//Funcion para guardar el carrito en localStorage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

//Funcion para cargar el carrito desde localStorage
function loadCart() {
  const cartStorage = localStorage.getItem("cart");
  //Si no esta vacio, lo parsea y lo asigna a la variable carrito
  if (cartStorage) {
    cart = JSON.parse(cartStorage);
  } else {
    cart = [];
  }
  const cartContent = localStorage.getItem('cart');
 console.log('Contenido crudo:', cartContent);
}

//Funcion para mostrar el carrito
function showCart() {
  if (cart.length === 0) {
    // Ocultamos el título
    if (cartTitle) {
      cartTitle.style.display = "none";
    }
    
    cartContainer.innerHTML = `<h2 class="car-empty-msg"> No tienes productos en el carrito</h2>`;
    cartAside.innerHTML = "";
    return;
  }
  
  // Mostramos el título cuando hay productos
  if (cartTitle) {
    cartTitle.style.display = "block"; // o "flex", "grid", etc.
  }

  let htmlCart = "";
  cart.forEach((item, index) => {
    const subtotal = item.precio * item.cantidad;
    const catogoryCapitalized = item.categoria.charAt(0).toUpperCase() + item.categoria.slice(1);

    htmlCart += `
      <li class="cart-item">
          <div class="cart-product-info">
            <img src="${item.img}" alt="${item.nombre}" class="car-img">
              <div class="cart-prduct-details">
                  <h3>${item.nombre}</h3>
                  <span class="cart-type">${catogoryCapitalized}</span>
                  <span class="cart-unit-price">Precio unitario: $${item.precio.toLocaleString()}</span>
              </div>
          </div>

          <div class="product-cart-actions">
              <div class="cart-quantity-control">
                  <button class="quantity-btn" onclick="decreaseQuantity(${index})">-
                  </button>
                  <span class="quantity-item">${item.cantidad}</span>
                  <button class="quantity-btn" onclick="increaseQuantity(${index})">+
                  </button>
              </div>
              
              <div class="cart-price-subtotal">$${subtotal}</div>
              
              <button class="delete-btn" onclick="deleteElement(${index})">
              <i class="fa fa-trash" aria-hidden="true"></i>
              </button>
          </div>
      </li>
    `;
  });

  cartList.innerHTML = htmlCart;
  cartAside.innerHTML = `
      <div class="resume-cart">
          <div class="resumen-row">
              <span class="span">Total a pagar:</span>
              <span class="total-resume">$${totalPrice().toLocaleString()}</span>
          </div>
          <div class="actions-resume">
              <button class="clear-btn" onclick="clearCart()">Vaciar Carrito</button>
              <button class="pay-btn" onclick="confirmPucharse()">Confirmar Compra</button>
          </div>
      </div>
  `;
}
//Logica necesaria para disminuir la cantidad de un producto en el carrito
function decreaseQuantity(index) {
  if (cart[index]) {
    if (cart[index].cantidad > 1) {
      cart[index].cantidad -= 1;
    } else {
      deleteElement(index);
      return;
    }
    saveCart();
    showCart();
  }
}

function deleteElement(index) {
  if (
    window.confirm("¿Estás seguro de que querés eliminar este producto del carrito?")
  ) {
    cart.splice(index, 1); //.slice() elimina un elemento del array en el index indicado
    saveCart();
    showCart();
  }
}

//Logica para aumentar la cantidad de un producto en el carrito
function increaseQuantity(index) {
  if (cart[index]) {
    cart[index].cantidad += 1;
    saveCart();
    showCart();
  }
}

//Funcion para vaciar el carrito
function clearCart() {
  if (confirm("¿Estás seguro de que querés vaciar el carrito?")) {
    cart.length = 0;
    saveCart();
    showCart();
  }
}

//Funcino para confirmar la compra
const confirmPucharse = async () => {
  if (!confirm("Deseas confirmar la compra?")) {
    return
  };

  if (cart.length === 0) {
    alert("El carrito está vacio. No se pudo confirmar la compra.");
    return;
  }

  const userName = localStorage.getItem('userName') || 'Invitado';
  const cartStorage = localStorage.getItem("cart");

  const datosVenta = {
      nombre_usuario: userName,  
      //total a pagar
      total: totalPrice(),             
      productos: cart.map(item => ({
      producto_id: item.id,    
      precio: item.precio,     
      cantidad: item.cantidad  
    }))
  };

  try {
    const respuesta = await fetch(`${url}/api/tickets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datosVenta)
    });

    if (!respuesta.ok) {
      alert(resultado.error || "Error al procesar la solicitud"); return;
    }

    const resultado = await respuesta.json();
    const data = resultado.factura;
    console.log(data);

    if (resultado.factura) {
      localStorage.setItem("ultimaVenta", JSON.stringify(resultado.factura));
    }

    alert("compra finalizada!");
    cart.length = 0
    saveCart()

    window.location.href = 'ticket.html';

  } catch (error) {
    console.error("Error al enviar los datos: ", error);
    alert("Error al procesar la solicitud");
  }
};

function totalPrice() {
  if (cart.length === 0) {
    return 0;
  }
  return cart.reduce((total, item) => {
    return total + item.precio * item.cantidad;
  }, 0);
}

init();

async function init() {
  loadCart();
  showCart();
}