const ticketData = JSON.parse(localStorage.getItem("ticket"));

if (ticketData) {
    // Mostrar información de la venta en HTML 
    const totalCant = ticketData.productos.reduce((total, producto) => {
        return total + producto.cantidad;
    }, 0);

    document.querySelector(".ticket-user-info").innerHTML = `
        <p>${ticketData.nombre_usuario}</p>
        <p>${ticketData.fecha}</p>
        <P>${totalCant}</p>
    `;
}

    