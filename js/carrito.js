const URL = "http://localhost:3000";
let car = [];
// ==== === === === === === === === === ===
const carContainer = document.getElementById("car-container");
const carList = document.getElementById("car-list");
const carFooter = document.getElementById("car-footer");
const carEmpty = document.getElementById("car-empty");

//Funcion para guardar el carrito en sessionStorage
function saveCar() {
  sessionStorage.setItem("car", JSON.stringify(car));
}

//Funcion para cargar el carrito desde sessionStorage
function loadCar() {
  const car = sessionStorage.getItem("car");
  //Si no esta vacio, lo parsea y lo asigna a la variable carrito
  if (car) {
    car = JSON.parse(car);
  }
}

//Funcion para mostrar el carrito
function showCar() {
  console.log("Tus productos!:", car);
  if (car.length === 0) {
    carContainer.innerHTML = `<h2 class="car-empty-msg"> No tienes productos en el carrito</h2>`;

    carFooter.innerHTML = "";
    return;
  }
  carContainer.style.display = "block";

  let htmlCar = "";
  car.forEach((item, index) => {
    const subtotal = item.precio * item.cantidad;

    htmlCar += `
      <li class="car-item">
          <div class="car-producto-info">
            <img src="${imgSrc}" alt="${item.nombre}" class="car-img">
              <div class="car-prduct-details">
                  <h3>${item.nombre}</h3>
                  <span class="car-type">${item.tipo}</span>
                  <span class="car-unit-price">Precio unitario: $${item.precio}</span>
              </div>
          </div>

          <div class="product-car-actions">
              <div class="cart-quantity-control">
                  <button class="quantity-btn" onclick="decreaseQuantity(${index})">-
                  </button>
                  <span class="quantity-item">${item.cantidad}</span>
                  <button class="quantity-btn" onclick="increaseQuantity(${index})">+
                  </button>
              </div>
              
              <div class="car-price-subtotal">$${subtotal}</div>
              
              <button class="delete-btn" onclick="deleteElement(${index})">
              <i class="fa fa-trash" aria-hidden="true"></i>
              </button>
          </div>
      </li>
    `;
  });

  carList.innerHTML = htmlCar;

  carFooter.innerHTML = `
      <div class="resume-car">
          <div class="resumen-row">
              <span>Total a pagar:</span>
              <span class="total-resume">$${calcularPrecioTotal()}</span>
          </div>
          <div class="actions-resume">
              <button class="clear-btn" onclick="clearCar()">Vaciar Carrito</button>
              <button class="pay-btn" onclick="confirmPucharse()">Confirmar Compra</button>
          </div>
      </div>
  `;
}
//Logica necesaria para disminuir la cantidad de un producto en el carrito
function decreaseQuantity(index) {
  if (car[index]) {
    if (car[index].cantidad > 1) {
      car[index].cantidad -= 1;
    } else {
      deleteElement(index);
      return;
    }
    saveCar();
    showCar();
  }
}

function deleteElement(index) {
  if (
    window.confirm("¿Estás seguro de que querés eliminar este producto del carrito?")
  ) {
    car.splice(index, 1); //.slice() elimina un elemento del array en el index indicado
    saveCar();
    showCar();
  }
}

//Logica para aumentar la cantidad de un producto en el carrito
function increaseQuantity(index) {
  if (car[index]) {
    car[index].cantidad += 1;
    saveCar();
    showCar();
  }
}

//Funcion para vaciar el carrito
function clearCar() {
  if (confirm("¿Estás seguro de que querés vaciar el carrito?")) {
    car.length = 0;
    saveCar();
    showCar();
  }
}

//Funcino para confirmar la compra
const confirmPucharse = async () => {
  if (!confirm("Deseas confirmar la compra?")) {
    return
  };

  if (car.length === 0) {
    alert("El carrito está vacio. No se pudo confirmar la compra.");
    return;
  }

  const userName = sessionStorage.getItem('userName') || 'Invitado';

  const datosVenta = {
    user_name: userName,
    productos: car.map(item => ({
      id_producto: item.id,
      cantidad: item.cantidad
    }))
  };

  try {
    const respuesta = await fetch("http://localhost:3300/api/sales", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datosVenta)
    });

    if (!respuesta.ok) {
      alert(resultado.error || "Error al procesar la solicitud"); return;
    }

    const resultado = await respuesta.json();


    console.log(resultado);

    if (resultado.factura) {
      sessionStorage.setItem("ultimaVenta", JSON.stringify(resultado.factura));
    }

    alert("compra finalizada!");
    car.length = 0
    saveCar()

    window.location.href = 'ticket.html';

  } catch (error) {
    console.error("Error al enviar los datos: ", error);
    alert("Error al procesar la solicitud");
  }
};