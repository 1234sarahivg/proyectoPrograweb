
        // Sistema de Carrito y Pedidos - Responsivo
        const cartSystem = {
            cart: [],
            orders: [],
            currentProduct: null,
            
            // Productos disponibles
            products: {
                1: { id: 1, name: "Pizza Familiar", restaurant: "Mr. Pizza", price: 120, icon: "fas fa-pizza-slice", color: "#ff9f43", description: "Deliciosa pizza familiar con extra queso, pepperoni, champiñones y pimientos. Masa artesanal horneada a la perfección." },
                2: { id: 2, name: "Hamburguesa", restaurant: "Burger House", price: 45, icon: "fas fa-hamburger", color: "#e74c3c", description: "Hamburguesa clásica con carne 100% res, queso, lechuga, tomate y salsa especial. Incluye papas fritas." },
                3: { id: 3, name: "Pescado a la plancha", restaurant: "Mar & Tierra", price: 85, icon: "fas fa-fish", color: "#3498db", description: "Filete de pescado fresco a la plancha con guarnición de arroz y ensalada. Incluye limón y hierbas." },
                4: { id: 4, name: "Ensalada César", restaurant: "Fresh Garden", price: 38, icon: "fas fa-cheese", color: "#2ecc71", description: "Ensalada fresca con lechuga romana, pollo a la parrilla, croutons y aderezo César casero." },
                5: { id: 5, name: "Pollo a la brasa", restaurant: "Pollería \"El Rico\"", price: 65, icon: "fas fa-drumstick-bite", color: "#e67e22", description: "1/4 pollo a la brasa con papas fritas, ensalada y salsas. Tradicional receta peruana." },
                6: { id: 6, name: "Salchipapas", restaurant: "Snack House", price: 30, icon: "fas fa-bacon", color: "#9b59b6", description: "Papas fritas crocantes con salchichas, huevo, queso derretido y salsas a elección." }
            },
            
            // Inicializar
            init() {
                this.loadCart();
                this.setupEventListeners();
                this.updateCartDisplay();
                this.setupResponsiveFeatures();
            },
            
            // Configurar características responsivas
            setupResponsiveFeatures() {
                // Menú toggle para móviles
                const menuToggle = document.getElementById('menu-toggle');
                if (menuToggle) {
                    menuToggle.addEventListener('click', () => {
                        const nav = document.querySelector('.bottom-nav');
                        nav.style.display = nav.style.display === 'none' ? 'flex' : 'none';
                    });
                    
                    // Mostrar navegación al cambiar tamaño de ventana
                    window.addEventListener('resize', () => {
                        const nav = document.querySelector('.bottom-nav');
                        if (window.innerWidth >= 768) {
                            nav.style.display = 'flex';
                        }
                    });
                }
                
                // Detectar orientación
                window.addEventListener('orientationchange', () => {
                    setTimeout(() => {
                        this.handleOrientationChange();
                    }, 100);
                });
                
                // Detectar modo oscuro
                const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
                darkModeMediaQuery.addEventListener('change', (e) => {
                    this.handleDarkModeChange(e.matches);
                });
            },
            
            handleOrientationChange() {
                console.log('Orientación cambiada a:', window.orientation);
                // Podrías ajustar estilos específicos para orientación aquí
            },
            
            handleDarkModeChange(isDarkMode) {
                console.log('Modo oscuro:', isDarkMode ? 'activado' : 'desactivado');
                // Ajustes específicos para modo oscuro
            },
            
            // Cargar carrito desde localStorage
            loadCart() {
                const savedCart = localStorage.getItem('foodCart');
                if (savedCart) {
                    this.cart = JSON.parse(savedCart);
                }
            },
            
            // Guardar carrito en localStorage
            saveCart() {
                localStorage.setItem('foodCart', JSON.stringify(this.cart));
            },
            
            // Agregar producto al carrito
            addToCart(productId, quantity = 1) {
                const product = this.products[productId];
                if (!product) return;
                
                const existingItem = this.cart.find(item => item.id === productId);
                
                if (existingItem) {
                    existingItem.quantity += quantity;
                } else {
                    this.cart.push({
                        id: productId,
                        name: product.name,
                        restaurant: product.restaurant,
                        price: product.price,
                        icon: product.icon,
                        color: product.color,
                        quantity: quantity
                    });
                }
                
                this.saveCart();
                this.updateCartDisplay();
                this.showNotification(`${product.name} agregado al carrito`);
            },
            
            // Remover producto del carrito
            removeFromCart(productId) {
                this.cart = this.cart.filter(item => item.id !== productId);
                this.saveCart();
                this.updateCartDisplay();
            },
            
            // Actualizar cantidad de producto en el carrito
            updateQuantity(productId, newQuantity) {
                const item = this.cart.find(item => item.id === productId);
                if (item) {
                    if (newQuantity <= 0) {
                        this.removeFromCart(productId);
                    } else {
                        item.quantity = newQuantity;
                        this.saveCart();
                        this.updateCartDisplay();
                    }
                }
            },
            
            // Calcular subtotal del carrito
            calculateSubtotal() {
                return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
            },
            
            // Calcular total del carrito (con envío)
            calculateTotal() {
                const subtotal = this.calculateSubtotal();
                const shipping = subtotal > 0 ? 15 : 0; // Costo de envío fijo
                return subtotal + shipping;
            },
            
            // Vaciar carrito
            clearCart() {
                this.cart = [];
                this.saveCart();
                this.updateCartDisplay();
            },
            
            // Crear pedido desde el carrito
            createOrder() {
                if (this.cart.length === 0) return null;
                
                const order = {
                    id: Date.now(),
                    date: new Date().toLocaleString(),
                    items: [...this.cart],
                    subtotal: this.calculateSubtotal(),
                    shipping: 15,
                    total: this.calculateTotal(),
                    status: 'pending'
                };
                
                this.orders.unshift(order); // Agregar al inicio del array
                this.clearCart();
                
                // Guardar pedidos en localStorage
                localStorage.setItem('foodOrders', JSON.stringify(this.orders));
                
                return order;
            },
            
            // Mostrar notificación responsiva
            showNotification(message) {
                // Remover notificaciones anteriores
                const existingNotifications = document.querySelectorAll('.custom-notification');
                existingNotifications.forEach(notification => notification.remove());
                
                // Crear elemento de notificación
                const notification = document.createElement('div');
                notification.className = 'custom-notification';
                notification.style.cssText = `
                    position: fixed;
                    top: 80px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: #2ecc71;
                    color: white;
                    padding: 12px 20px;
                    border-radius: 8px;
                    z-index: 1000;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    font-weight: 600;
                    animation: slideDown 0.3s ease;
                    max-width: 90%;
                    word-wrap: break-word;
                    text-align: center;
                `;
                
                // Agregar animación CSS
                const style = document.createElement('style');
                style.textContent = `
                    @keyframes slideDown {
                        from { top: 0; opacity: 0; }
                        to { top: 80px; opacity: 1; }
                    }
                    @media (max-width: 768px) {
                        .custom-notification {
                            top: 70px;
                            padding: 10px 15px;
                            font-size: 0.9rem;
                        }
                    }
                `;
                document.head.appendChild(style);
                
                notification.textContent = message;
                document.body.appendChild(notification);
                
                // Remover después de 3 segundos
                setTimeout(() => {
                    notification.remove();
                    style.remove();
                }, 3000);
            },
            
            // Actualizar visualización del carrito
            updateCartDisplay() {
                const cartCount = this.cart.reduce((total, item) => total + item.quantity, 0);
                
                // Actualizar contadores
                document.getElementById('cart-count').textContent = cartCount;
                document.getElementById('nav-cart-count').textContent = cartCount;
                
                // Ocultar badge si no hay items
                document.getElementById('nav-cart-count').style.display = cartCount > 0 ? 'flex' : 'none';
                
                // Actualizar página del carrito si está visible
                if (document.getElementById('cart-page').classList.contains('active')) {
                    this.renderCartPage();
                }
            },
            
            // Renderizar página del carrito responsiva
            renderCartPage() {
                const container = document.getElementById('cart-items-container');
                const emptyMsg = document.getElementById('empty-cart-message');
                const summary = document.getElementById('cart-summary');
                
                if (this.cart.length === 0) {
                    container.innerHTML = '';
                    emptyMsg.style.display = 'block';
                    summary.style.display = 'none';
                    return;
                }
                
                emptyMsg.style.display = 'none';
                summary.style.display = 'block';
                
                // Renderizar items del carrito
                let cartHTML = '';
                this.cart.forEach(item => {
                    cartHTML += `
                        <div class="cart-item" data-id="${item.id}">
                            <div class="cart-item-image" style="background: linear-gradient(45deg, ${item.color}, #ffaf60);">
                                <i class="${item.icon}"></i>
                            </div>
                            <div class="cart-item-details">
                                <h3 class="cart-item-title">${item.name}</h3>
                                <p class="cart-item-restaurant">${item.restaurant}</p>
                                <div class="cart-item-price">${item.price} Bs</div>
                            </div>
                            <div class="cart-item-actions">
                                <div class="cart-quantity">
                                    <button class="cart-quantity-btn decrease-item">-</button>
                                    <span class="cart-quantity-display">${item.quantity}</span>
                                    <button class="cart-quantity-btn increase-item">+</button>
                                </div>
                                <button class="remove-item" title="Eliminar">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    `;
                });
                
                container.innerHTML = cartHTML;
                
                // Actualizar resumen
                const subtotal = this.calculateSubtotal();
                const total = this.calculateTotal();
                
                document.getElementById('cart-subtotal').textContent = subtotal.toFixed(2);
                document.getElementById('cart-total').textContent = total.toFixed(2);
                
                // Agregar event listeners a los botones del carrito
                this.setupCartItemListeners();
            },
            
            // Configurar event listeners para elementos del carrito
            setupCartItemListeners() {
                // Botones de disminuir cantidad
                document.querySelectorAll('.decrease-item').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const itemElement = e.target.closest('.cart-item');
                        const itemId = parseInt(itemElement.dataset.id);
                        const item = this.cart.find(item => item.id === itemId);
                        
                        if (item && item.quantity > 1) {
                            this.updateQuantity(itemId, item.quantity - 1);
                        }
                    });
                });
                
                // Botones de aumentar cantidad
                document.querySelectorAll('.increase-item').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const itemElement = e.target.closest('.cart-item');
                        const itemId = parseInt(itemElement.dataset.id);
                        const item = this.cart.find(item => item.id === itemId);
                        
                        if (item) {
                            this.updateQuantity(itemId, item.quantity + 1);
                        }
                    });
                });
                
                // Botones de eliminar
                document.querySelectorAll('.remove-item').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const itemElement = e.target.closest('.cart-item');
                        const itemId = parseInt(itemElement.dataset.id);
                        
                        if (confirm('¿Estás seguro de que quieres eliminar este producto del carrito?')) {
                            this.removeFromCart(itemId);
                        }
                    });
                });
            },
            
            // Configurar todos los event listeners
            setupEventListeners() {
                // Navegación entre páginas
                document.querySelectorAll('.nav-item').forEach(item => {
                    item.addEventListener('click', (e) => {
                        e.preventDefault();
                        const pageId = item.dataset.page;
                        this.showPage(pageId);
                        
                        // En móviles, ocultar navegación después de hacer clic
                        if (window.innerWidth < 768) {
                            const nav = document.querySelector('.bottom-nav');
                            nav.style.display = 'none';
                        }
                    });
                });
                
                // Ver más y categorías
                document.querySelectorAll('.see-more, .category, .food-card').forEach(item => {
                    item.addEventListener('click', (e) => {
                        e.preventDefault();
                        const pageId = item.dataset.page;
                        const productId = item.dataset.product;
                        
                        if (pageId) {
                            this.showPage(pageId);
                        } else if (productId) {
                            this.showProductDetail(parseInt(productId));
                        }
                    });
                });
                
                // Carrito en el header
                document.getElementById('header-cart').addEventListener('click', () => {
                    this.showPage('cart-page');
                });
                
                // Ir al menú desde carrito vacío
                document.getElementById('go-to-menu').addEventListener('click', () => {
                    this.showPage('food-page');
                });
                
                // Procesar pedido
                document.getElementById('checkout-btn').addEventListener('click', () => {
                    if (this.cart.length > 0) {
                        this.preparePayment();
                    } else {
                        alert('Tu carrito está vacío');
                    }
                });
                
                // Agregar al carrito desde página de producto
                document.getElementById('add-to-cart').addEventListener('click', () => {
                    if (this.currentProduct) {
                        const quantity = parseInt(document.getElementById('product-quantity').textContent);
                        this.addToCart(this.currentProduct.id, quantity);
                        this.showPage('cart-page');
                    }
                });
                
                // Configurar selectores de cantidad en página de producto
                document.getElementById('increase-qty').addEventListener('click', () => {
                    const quantityElement = document.getElementById('product-quantity');
                    let quantity = parseInt(quantityElement.textContent);
                    quantityElement.textContent = quantity + 1;
                    this.updateProductTotal();
                });
                
                document.getElementById('decrease-qty').addEventListener('click', () => {
                    const quantityElement = document.getElementById('product-quantity');
                    let quantity = parseInt(quantityElement.textContent);
                    if (quantity > 1) {
                        quantityElement.textContent = quantity - 1;
                        this.updateProductTotal();
                    }
                });
                
                // Configurar página de pago
                this.setupPaymentPage();
                
                // Configurar registro
                document.getElementById('finalizar-registro').addEventListener('click', () => {
                    const nombres = document.getElementById('nombres').value;
                    const apellidos = document.getElementById('apellidos').value;
                    const correo = document.getElementById('correo').value;
                    const direccion = document.getElementById('direccion').value;
                    
                    if (nombres && apellidos && correo && direccion) {
                        this.showNotification('¡Registro completado con éxito!');
                        this.showPage('home-page');
                    } else {
                        alert('Por favor, completa todos los campos del formulario.');
                    }
                });
                
                // Configurar favoritos
                document.getElementById('add-favorite').addEventListener('click', function() {
                    const heartIcon = this.querySelector('i');
                    const isFavorite = heartIcon.classList.contains('fas');
                    
                    if (isFavorite) {
                        heartIcon.classList.remove('fas');
                        heartIcon.classList.add('far');
                        this.style.color = '';
                        cartSystem.showNotification('Eliminado de favoritos');
                    } else {
                        heartIcon.classList.remove('far');
                        heartIcon.classList.add('fas');
                        this.style.color = '#ff6b6b';
                        cartSystem.showNotification('¡Añadido a favoritos!');
                    }
                });
                
                // Touch events para mejor soporte táctil
                this.setupTouchEvents();
            },
            
            // Configurar eventos táctiles
            setupTouchEvents() {
                // Prevenir zoom en inputs en iOS
                document.addEventListener('touchstart', function(e) {
                    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                        e.target.style.fontSize = '16px'; // Prevenir zoom en iOS
                    }
                }, { passive: true });
                
                // Mejorar scrolling en iOS
                document.addEventListener('touchmove', function(e) {
                    // Permitir scroll normal
                }, { passive: true });
            },
            
            // Mostrar página específica
            showPage(pageId) {
                // Ocultar todas las páginas
                document.querySelectorAll('.page').forEach(page => {
                    page.classList.remove('active');
                });
                
                // Mostrar página solicitada
                const targetPage = document.getElementById(pageId);
                if (targetPage) {
                    targetPage.classList.add('active');
                    
                    // Scroll al principio de la página
                    window.scrollTo(0, 0);
                    
                    // Actualizar navegación
                    document.querySelectorAll('.nav-item').forEach(item => {
                        item.classList.remove('active');
                        if (item.dataset.page === pageId) {
                            item.classList.add('active');
                        }
                    });
                    
                    // Si es la página del carrito, renderizarla
                    if (pageId === 'cart-page') {
                        this.renderCartPage();
                    }
                }
            },
            
            // Mostrar detalle de producto
            showProductDetail(productId) {
                const product = this.products[productId];
                if (!product) return;
                
                this.currentProduct = product;
                
                // Actualizar elementos de la página
                document.getElementById('product-title').textContent = product.name;
                document.getElementById('product-restaurant').textContent = product.restaurant;
                document.getElementById('product-price').textContent = `${product.price} Bs`;
                document.getElementById('product-total').textContent = product.price;
                document.getElementById('product-quantity').textContent = '1';
                document.getElementById('product-description').textContent = product.description;
                
                // Actualizar icono y color
                const productImage = document.getElementById('product-image');
                productImage.innerHTML = `<i class="${product.icon}"></i>`;
                productImage.style.background = `linear-gradient(45deg, ${product.color}, #ffaf60)`;
                
                // Mostrar página
                this.showPage('product-page');
            },
            
            // Actualizar total en página de producto
            updateProductTotal() {
                if (!this.currentProduct) return;
                
                const quantity = parseInt(document.getElementById('product-quantity').textContent);
                const total = this.currentProduct.price * quantity;
                document.getElementById('product-total').textContent = total;
            },
            
            // Preparar página de pago
            preparePayment() {
                const total = this.calculateTotal();
                const itemCount = this.cart.reduce((sum, item) => sum + item.quantity, 0);
                
                document.getElementById('payment-total').textContent = `${total.toFixed(2)} Bs`;
                document.getElementById('payment-items').textContent = `${itemCount} producto(s) en tu pedido`;
                
                this.showPage('payment-page');
            },
            
            // Configurar página de pago
            setupPaymentPage() {
                // Selección de método de pago
                document.querySelectorAll('.payment-option').forEach(option => {
                    option.addEventListener('click', function() {
                        // Remover active de todas las opciones
                        document.querySelectorAll('.payment-option').forEach(opt => {
                            opt.classList.remove('active');
                        });
                        
                        // Agregar active a la opción clickeada
                        this.classList.add('active');
                        
                        // Mostrar formulario correspondiente
                        const paymentType = this.dataset.payment;
                        document.getElementById('card-form').style.display = paymentType === 'card' ? 'block' : 'none';
                        document.getElementById('qr-form').style.display = paymentType === 'qr' ? 'block' : 'none';
                    });
                });
                
                // Cancelar pago
                document.getElementById('cancel-payment').addEventListener('click', () => {
                    if (confirm('¿Estás seguro de que deseas cancelar el pago?')) {
                        this.showPage('cart-page');
                    }
                });
                
                // Procesar pago
                document.getElementById('process-payment').addEventListener('click', () => {
                    const order = this.createOrder();
                    if (order) {
                        this.showNotification('¡Pedido realizado con éxito! Tu comida está en camino.');
                        this.showPage('orders-page');
                    }
                });
                
                // Formatear número de tarjeta
                const cardNumberInput = document.getElementById('card-number');
                if (cardNumberInput) {
                    cardNumberInput.addEventListener('input', function(e) {
                        let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
                        let formattedValue = '';
                        
                        for (let i = 0; i < value.length; i++) {
                            if (i > 0 && i % 4 === 0) formattedValue += ' ';
                            formattedValue += value[i];
                        }
                        
                        e.target.value = formattedValue;
                    });
                }
                
                // Formatear fecha de expiración
                const expiryDateInput = document.getElementById('expiry-date');
                if (expiryDateInput) {
                    expiryDateInput.addEventListener('input', function(e) {
                        let value = e.target.value.replace(/\D/g, '');
                        
                        if (value.length >= 2) {
                            value = value.substring(0, 2) + '/' + value.substring(2, 4);
                        }
                        
                        e.target.value = value;
                    });
                }
                
                // Solo números para CVV
                const cvvInput = document.getElementById('cvv');
                if (cvvInput) {
                    cvvInput.addEventListener('input', function(e) {
                        e.target.value = e.target.value.replace(/\D/g, '');
                    });
                }
            }
        };
        
        // Inicializar el sistema cuando la página cargue
        document.addEventListener('DOMContentLoaded', () => {
            cartSystem.init();
            
            // Cargar pedidos guardados
            const savedOrders = localStorage.getItem('foodOrders');
            if (savedOrders) {
                cartSystem.orders = JSON.parse(savedOrders);
            }
            
            // Ajustar tamaños para diferentes dispositivos
            function adjustForDevice() {
                const isMobile = window.innerWidth < 768;
                const isTablet = window.innerWidth >= 768 && window.innerWidth < 992;
                
                // Ajustar tamaños de fuente para mejor legibilidad
                if (isMobile) {
                    document.documentElement.style.fontSize = '14px';
                } else if (isTablet) {
                    document.documentElement.style.fontSize = '15px';
                } else {
                    document.documentElement.style.fontSize = '16px';
                }
            }
            
            // Ejecutar al cargar y al cambiar tamaño
            adjustForDevice();
            window.addEventListener('resize', adjustForDevice);
            
            // Prevenir comportamiento por defecto en enlaces
            document.addEventListener('click', function(e) {
                if (e.target.tagName === 'A' && e.target.getAttribute('href') === '#') {
                    e.preventDefault();
                }
            });
        });