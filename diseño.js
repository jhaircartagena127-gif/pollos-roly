document.addEventListener('DOMContentLoaded', () => {
    // --- 1. cateforas de munu ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const menuCards = document.querySelectorAll('.menu-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remover clase active de todos los botones y ponérsela al presionado
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const category = button.getAttribute('data-filter');

            menuCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                if (category === 'todos' || cardCategory === category) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // --- 2. lógica del carrito de compra---
    let cart = [];

    const cartBtn = document.getElementById('cart-btn');
    const cartModal = document.getElementById('cart-modal');
    const closeCart = document.getElementById('close-cart');
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    const cartCountElement = document.getElementById('cart-count');
    const addButtons = document.querySelectorAll('.btn-add');

    // abrir el carrito
    cartBtn.addEventListener('click', () => {
        cartModal.classList.add('active');
    });

    // Cerrar el carrito 
    closeCart.addEventListener('click', () => {
        cartModal.classList.remove('active');
    });

    // Cerrar el del carrito contenido
    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.classList.remove('active');
        }
    });

    // agregar productos al carrito
    addButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            const card = button.closest('.menu-card');
            const title = card.querySelector('h3').textContent;
            const priceText = card.querySelector('.price').textContent;
            // Extraer el número del precio (ej. "Bs. 65.00" -> 65.00)
            const price = parseFloat(priceText.replace('Bs.', '').trim());

            // Revisar si el producto ya está en el carrito
            const existingItem = cart.find(item => item.title === title);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ title, price, quantity: 1 });
            }

            updateCartUI();
            
            // Efecto visual rápido en el botón
            button.textContent = '¡Agregado! ✓';
            button.style.backgroundColor = '#ff5722';
            setTimeout(() => {
                button.textContent = 'Agregar al Carrito';
                button.style.backgroundColor = '';
            }, 1000);
        });
    });

    // Actualizar interfaz del carrito
    function updateCartUI() {
        cartItemsContainer.innerHTML = '';
        let total = 0;
        let totalCount = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-msg">Tu carrito está vacío.</p>';
            totalPriceElement.textContent = 'Bs. 0.00';
            cartCountElement.textContent = '0';
            return;
        }

        cart.forEach((item, index) => {
            const subtotal = item.price * item.quantity;
            total += subtotal;
            totalCount += item.quantity;

            const cartItemDiv = document.createElement('div');
            cartItemDiv.style.display = 'flex';
            cartItemDiv.style.justifyContent = 'space-between';
            cartItemDiv.style.alignItems = 'center';
            cartItemDiv.style.marginBottom = '10px';
            cartItemDiv.style.fontSize = '0.9rem';

            cartItemDiv.innerHTML = `
                <div>
                    <strong>${item.title}</strong><br>
                    <small>Bs. ${item.price.toFixed(2)} x ${item.quantity}</small>
                </div>
                <div>
                    <span style="margin-right: 10px; color: #ffc107;">Bs. ${subtotal.toFixed(2)}</span>
                    <button onclick="window.removeItem(${index})" style="background: #ff4444; color: white; border: none; padding: 2px 6px; border-radius: 4px; cursor: pointer;">✕</button>
                </div>
            `;
            cartItemsContainer.appendChild(cartItemDiv);
        });

        totalPriceElement.textContent = `Bs. ${total.toFixed(2)}`;
        cartCountElement.textContent = totalCount;
    }

    // Función global para eliminar un ítem del carrito
    window.removeItem = function(index) {
        cart.splice(index, 1);
        updateCartUI();
    };

    // --- 3. ENVÍO DE PEDIDO A WHATSAPP ---
    const checkoutWhatsappBtn = document.getElementById('checkout-whatsapp');
    checkoutWhatsappBtn.addEventListener('click', () => {
        const clientName = document.getElementById('client-name').value.trim();
        const clientAddress = document.getElementById('client-address').value.trim();

        if (cart.length === 0) {
            alert('Tu carrito está vacío. Agrega productos antes de pedir.');
            return;
        }

        if (clientName === '' || clientAddress === '') {
            alert('Por favor ingresa tu nombre y dirección de entrega.');
            return;
        }

        // Construir el mensaje estructurado para WhatsApp
        let message = `¡Hola!  Quisiera hacer el siguiente pedido en *Pollos Roly*:\n\n`;
        let total = 0;

        cart.forEach(item => {
            let subtotal = item.price * item.quantity;
            total += subtotal;
            message += `▪️ ${item.quantity}x ${item.title} (Bs. ${subtotal.toFixed(2)})\n`;
        });

        message += `\n*Total a cancelar:* Bs. ${total.toFixed(2)}`;
        message += `\n\n *Cliente:* ${clientName}`;
        message += `\n *Dirección:* ${clientAddress}`;

        // Codificar el mensaje para URL
        const encodedMessage = encodeURIComponent(message);
        
        // numero de whatsapp
        const phoneNumber = '+59165024514'; 

        // Abrir WhatsApp
        window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
    });
});