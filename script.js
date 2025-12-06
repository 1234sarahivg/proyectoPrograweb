// botones de promociones
const promoButtons = document.querySelectorAll('.promo_comida button');
promoButtons.forEach(button => {
    button.addEventListener('click', function() {
        alert('¡Promoción seleccionada! Redirigiendo a la página de pedido...');
       
    });
});

// mostrar/ocultar detalles del restaurante
const foodCards = document.querySelectorAll('.comida_uno_restaurant1, .comida_dos_restaurant1, .comida_tres_restaurant1, .comida_uno_restaurant2, .comida_uno_restaurant3');
const restaurantDetail = document.querySelector('.detalles_restaurantes');

foodCards.forEach(card => {
    card.addEventListener('click', function() {
        // Alterna la visibilidad del detalle del restaurante
        if (restaurantDetail.style.display === 'none' || restaurantDetail.style.display === '') {
            restaurantDetail.style.display = 'grid';
        } else {
            restaurantDetail.style.display = 'none';
        }
    });
});

// Validación y envío del formulario de pedido
const orderForm = document.querySelector('.formulario_para_la_orden');
const submitButton = orderForm.querySelector('button');

submitButton.addEventListener('click', function(event) {
    event.preventDefault(); // Previene envío por defecto

    const nombre = document.getElementById('nombre').value.trim();
    const direccion = document.getElementById('direccion').value.trim();
    const celular = document.getElementById('celular').value.trim();
    const descripcion = document.getElementById('descripcion').value.trim();

    // Validación básica
    if (!nombre || !direccion || !celular) {
        alert('Por favor, completa todos los campos obligatorios (Nombre, Dirección, Celular).');
        return;
    }

    // Simula envío
    alert(`Pedido enviado exitosamente!\nNombre: ${nombre}\nDirección: ${direccion}\nCelular: ${celular}\nDescripción: ${descripcion}`);
    
 
    orderForm.reset();
});
