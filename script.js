
        const App = {
            // Estado de la aplicación
            state: {
                cart: [],
                orders: [],
                favorites: [],
                user: {
                    loggedIn: false,
                    name: "",
                    email: "",
                    address: "Av. Bolívar 123, La Paz",
                    phone: "+591 12345678",
                    notifications: true
                },
                location: "La Paz, Bolivia",
                currentProduct: null,
                paymentMethod: "card"
            },
            
            // Productos disponibles
            products: [
                { id: 1, name: "Pizza Familiar", restaurant: "Mr. Pizza", price: 120, 
                  icon: "fas fa-pizza-slice", color: "#ff9f43", 
                  category: "food", popular: true,
                  description: "Deliciosa pizza familiar con extra queso, pepperoni, champiñones y pimientos. Masa artesanal horneada a la perfección." },
                { id: 2, name: "Hamburguesa", restaurant: "Burger House", price: 45, 
                  icon: "fas fa-hamburger", color: "#e74c3c", 
                  category: "food", popular: true,
                  description: "Hamburguesa clásica con carne 100% res, queso, lechuga, tomate y salsa especial. Incluye papas fritas." },
                { id: 3, name: "Pescado a la plancha", restaurant: "Mar & Tierra", price: 85, 
                  icon: "fas fa-fish", color: "#3498db", 
                  category: "food", new: true,
                  description: "Filete de pescado fresco a la plancha con guarnición de arroz y ensalada. Incluye limón y hierbas." },
                { id: 4, name: "Ensalada César", restaurant: "Fresh Garden", price: 38, 
                  icon: "fas fa-cheese", color: "#2ecc71", 
                  category: "food", new: true,
                  description: "Ensalada fresca con lechuga romana, pollo a la parrilla, croutons y aderezo César casero." },
                { id: 5, name: "Pollo a la brasa", restaurant: "Pollería 'El Rico'", price: 65, 
                  icon: "fas fa-drumstick-bite", color: "#e67e22", 
                  category: "food",
                  description: "1/4 pollo a la brasa con papas fritas, ensalada y salsas. Tradicional receta peruana." },
                { id: 6, name: "Salchipapas", restaurant: "Snack House", price: 30, 
                  icon: "fas fa-bacon", color: "#9b59b6", 
                  category: "food",
                  description: "Papas fritas crocantes con salchichas, huevo, queso derretido y salsas a elección." },
                { id: 7, name: "Helado de Chocolate", restaurant: "Dulce Tentación", price: 25, 
      icon: "fas fa-ice-cream", color: "#8e44ad", 
      category: "dessert",
      description: "Helado artesanal de chocolate belga con topping de nueces y salsa de chocolate." },
      { id: 8, name: "Refresco Aretesanal", restaurant: "Bebidas Express", price: 15, 
      icon: "fas fa-wine-glass-alt", color: "#1abc9c", 
      category: "drink",
      description: "Refresco de cola, naranja o limón 500ml. Refrescante y frío." }
            ],

 
            // INICIALIZACIÓN
      
            init() {
                this.loadData();
                this.setupEventListeners();
                this.updateCartCount();
                this.updateMenuUserInfo();
                this.setupHamburgerMenu();
            },

   
            // MANEJO DE DATOS
      
            loadData() {
                // Cargar carrito desde localStorage
                const savedCart = localStorage.getItem('foodDeliveryCart');
                if (savedCart) {
                    this.state.cart = JSON.parse(savedCart);
                }
                
                // Cargar pedidos desde localStorage
                const savedOrders = localStorage.getItem('foodDeliveryOrders');
                if (savedOrders) {
                    this.state.orders = JSON.parse(savedOrders);
                }
                
                // Cargar favoritos desde localStorage
                const savedFavorites = localStorage.getItem('foodDeliveryFavorites');
                if (savedFavorites) {
                    this.state.favorites = JSON.parse(savedFavorites);
                }
                
                // Cargar usuario desde localStorage
                const savedUser = localStorage.getItem('foodDeliveryUser');
                if (savedUser) {
                    const userData = JSON.parse(savedUser);
                    this.state.user = { ...this.state.user, ...userData };
                    this.state.user.loggedIn = true;
                }
            },

            saveData() {
                localStorage.setItem('foodDeliveryCart', JSON.stringify(this.state.cart));
                localStorage.setItem('foodDeliveryOrders', JSON.stringify(this.state.orders));
                localStorage.setItem('foodDeliveryFavorites', JSON.stringify(this.state.favorites));
                
                // Guardar solo datos del usuario (sin loggedIn)
                const userData = {
                    name: this.state.user.name,
                    email: this.state.user.email,
                    address: this.state.user.address,
                    phone: this.state.user.phone,
                    notifications: this.state.user.notifications
                };
                localStorage.setItem('foodDeliveryUser', JSON.stringify(userData));
            },

            // menu hamburguesa 
            setupHamburgerMenu() {
                const hamburgerBtn = document.getElementById('hamburger-btn');
                const menuOverlay = document.getElementById('menu-overlay');
                const menuSidebar = document.getElementById('menu-sidebar');
                
                // Abrir menú
                hamburgerBtn.addEventListener('click', (e) => {
    e.preventDefault();  // ← Línea nueva
    e.stopPropagation(); // Esta ya la tenías
    menuOverlay.classList.toggle('active');
    menuSidebar.classList.toggle('active');
});
                
                // Cerrar menú al hacer clic en overlay
                menuOverlay.addEventListener('click', () => {
                    menuOverlay.classList.remove('active');
                    menuSidebar.classList.remove('active');
                });
                
                // Cerrar menú al hacer clic fuera
                document.addEventListener('click', (e) => {
                    if (!menuSidebar.contains(e.target) && !hamburgerBtn.contains(e.target)) {
                        menuOverlay.classList.remove('active');
                        menuSidebar.classList.remove('active');
                    }
                });
                
                // Cerrar con Escape
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape') {
                        menuOverlay.classList.remove('active');
                        menuSidebar.classList.remove('active');
                    }
                });
            },

            updateMenuUserInfo() {
                const userName = document.getElementById('menu-user-name');
                const userEmail = document.getElementById('menu-user-email');
                
                if (this.state.user.loggedIn && this.state.user.name) {
                    userName.textContent = this.state.user.name;
                    userEmail.textContent = this.state.user.email;
                } else {
                    userName.textContent = "Invitado";
                    userEmail.textContent = "Inicia sesión para continuar";
                }
            },

            
            // MANEJO DEL CARRITO
          
            addToCart(productId, quantity = 1) {
                const product = this.products.find(p => p.id === productId);
                if (!product) return false;

                const existingItem = this.state.cart.find(item => item.productId === productId);
                
                if (existingItem) {
                    existingItem.quantity += quantity;
                } else {
                    this.state.cart.push({
                        productId: productId,
                        name: product.name,
                        restaurant: product.restaurant,
                        price: product.price,
                        icon: product.icon,
                        color: product.color,
                        quantity: quantity
                    });
                }

                this.saveData();
                this.updateCartCount();
                this.showNotification(`${product.name} agregado al carrito`, "success");
                return true;
            },

            removeFromCart(productId) {
                this.state.cart = this.state.cart.filter(item => item.productId !== productId);
                this.saveData();
                this.updateCartCount();
                this.showNotification("Producto eliminado del carrito", "warning");
            },

            updateCartQuantity(productId, newQuantity) {
                const item = this.state.cart.find(item => item.productId === productId);
                if (item) {
                    if (newQuantity <= 0) {
                        this.removeFromCart(productId);
                    } else {
                        item.quantity = newQuantity;
                        this.saveData();
                        this.updateCartCount();
                    }
                }
            },

            clearCart() {
                this.state.cart = [];
                this.saveData();
                this.updateCartCount();
            },

            getCartTotal() {
                return this.state.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
            },

            getCartCount() {
                return this.state.cart.reduce((total, item) => total + item.quantity, 0);
            },

            //manejo de pepidos
            createOrder() {
                if (this.state.cart.length === 0) return null;

                const order = {
                    id: Date.now(),
                    date: new Date().toLocaleString('es-BO'),
                    items: [...this.state.cart],
                    subtotal: this.getCartTotal(),
                    shipping: 15,
                    total: this.getCartTotal() + 15,
                    status: 'preparing',
                    address: this.state.user.address
                };

                this.state.orders.unshift(order);
                this.clearCart();
                this.saveData();
                
                // Simular notificaciones de estado
                setTimeout(() => {
                    order.status = 'on_the_way';
                    this.saveData();
                    this.showNotification(`Tu pedido #${order.id} está en camino`, "success");
                }, 3000);
                
                setTimeout(() => {
                    order.status = 'delivered';
                    this.saveData();
                    this.showNotification(`¡Tu pedido #${order.id} ha sido entregado!`, "success");
                }, 8000);

                return order;
            },

            // MANEJO DE USUARIO Y LOGIN
            
            login(email, password) {
                // Simulación de login
                if (email && password) {
                    this.state.user = {
                        loggedIn: true,
                        name: "Juan Pérez",
                        email: email,
                        address: "Av. Bolívar 123, La Paz",
                        phone: "+591 12345678",
                        notifications: true
                    };
                    
                    this.saveData();
                    this.updateMenuUserInfo();
                    this.showNotification("¡Sesión iniciada correctamente!", "success");
                    this.showPage('home-page');
                    return true;
                }
                return false;
            },

            logout() {
                this.state.user.loggedIn = false;
                this.state.user.name = "";
                this.state.user.email = "";
                this.saveData();
                this.updateMenuUserInfo();
                this.showNotification("Sesión cerrada correctamente", "warning");
                this.showPage('home-page');
                
                // Cerrar menú hamburguesa
                document.getElementById('menu-overlay').classList.remove('active');
                document.getElementById('menu-sidebar').classList.remove('active');
            },

            register(userData) {
                // Simulación de registro
                this.state.user = {
                    loggedIn: true,
                    name: `${userData.names} ${userData.lastnames}`,
                    email: userData.email,
                    address: "La Paz, Bolivia",
                    phone: userData.phone,
                    notifications: true
                };
                
                this.saveData();
                this.updateMenuUserInfo();
                this.showNotification("¡Cuenta creada exitosamente!", "success");
                this.showPage('home-page');
                return true;
            },

           
            // Renderizado de page
         
            renderFoodPage() {
                const container = document.querySelector('#food-page .food-grid');
                if (!container) return;

                const foodProducts = this.products.filter(p => p.category === 'food');
                let html = '';
                
                foodProducts.forEach(product => {
                    const isFav = this.isFavorite(product.id);
                    html += `
                        <div class="food-card" data-product="${product.id}">
                            <div class="food-image" style="background: linear-gradient(45deg, ${product.color}, #ffaf60);">
                                <i class="${product.icon}"></i>
                            </div>
                            <div class="food-content">
                                <h3 class="food-title">${product.name}</h3>
                                <div class="food-restaurant">${product.restaurant}</div>
                                <div class="food-price">${product.price} Bs</div>
                                <div style="display: flex; gap: 10px; margin-top: 10px;">
                                    <button class="btn btn-primary btn-small view-product-btn" data-product="${product.id}">
                                        <i class="fas fa-eye"></i> Ver
                                    </button>
                                    <button class="btn btn-primary btn-small add-to-cart-btn" data-product="${product.id}">
                                        <i class="fas fa-cart-plus"></i> Añadir
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;
                });
                
                container.innerHTML = html;
                this.setupProductCardListeners();
            },

            renderCartPage() {
                const container = document.getElementById('cart-items-container');
                const emptyMsg = document.getElementById('empty-cart-message');
                const summary = document.getElementById('cart-summary');
                
                if (this.state.cart.length === 0) {
                    container.innerHTML = '';
                    emptyMsg.style.display = 'block';
                    summary.style.display = 'none';
                    return;
                }
                
                emptyMsg.style.display = 'none';
                summary.style.display = 'block';
                
                let html = '';
                this.state.cart.forEach(item => {
                    html += `
                        <div class="cart-item" data-id="${item.productId}">
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
                
                container.innerHTML = html;
                
                // Actualizar resumen
                const subtotal = this.getCartTotal();
                const total = subtotal + 15;
                
                document.getElementById('cart-subtotal').textContent = subtotal.toFixed(2);
                document.getElementById('cart-total').textContent = total.toFixed(2);
                
                // Configurar event listeners
                this.setupCartItemListeners();
            },

            renderOrdersPage() {
                const container = document.getElementById('orders-container');
                const emptyMsg = document.getElementById('empty-orders-message');
                
                if (this.state.orders.length === 0) {
                    container.innerHTML = '';
                    emptyMsg.style.display = 'block';
                    return;
                }
                
                emptyMsg.style.display = 'none';
                
                let html = '';
                this.state.orders.forEach(order => {
                    let statusClass = 'status-pending';
                    let statusText = 'PREPARANDO';
                    
                    if (order.status === 'on_the_way') {
                        statusClass = 'status-delivered';
                        statusText = 'EN CAMINO';
                    } else if (order.status === 'delivered') {
                        statusClass = 'status-delivered';
                        statusText = 'ENTREGADO';
                    } else if (order.status === 'cancelled') {
                        statusClass = 'status-cancelled';
                        statusText = 'CANCELADO';
                    }
                    
                    html += `
                        <div class="order-item">
                            <div class="order-info">
                                <h3>Pedido #${order.id}</h3>
                                <p>${order.date}</p>
                                <p>${order.items.length} producto(s)</p>
                                <p>${order.address}</p>
                            </div>
                            <div class="order-status ${statusClass}">${statusText}</div>
                            <div class="order-price">${order.total.toFixed(2)} Bs</div>
                        </div>
                    `;
                });
                
                container.innerHTML = html;
            },

            renderProductDetail(productId) {
                const product = this.products.find(p => p.id === productId);
                if (!product) return;
                
                this.state.currentProduct = product;
                
                document.getElementById('product-title').textContent = product.name;
                document.getElementById('product-restaurant').textContent = product.restaurant;
                document.getElementById('product-price').textContent = `${product.price} Bs`;
                document.getElementById('product-total').textContent = product.price;
                document.getElementById('product-quantity').textContent = '1';
                document.getElementById('product-description').textContent = product.description;
                
                const productImage = document.getElementById('product-image');
                productImage.innerHTML = `<i class="${product.icon}"></i>`;
                productImage.style.background = `linear-gradient(45deg, ${product.color}, #ffaf60)`;
                
                // Configurar botón de favoritos
                const favBtn = document.getElementById('add-favorite');
                const isFav = this.isFavorite(product.id);
                const icon = favBtn.querySelector('i');
                icon.className = isFav ? 'fas fa-heart' : 'far fa-heart';
                favBtn.classList.toggle('active', isFav);
                
                this.showPage('product-page');
            },

           
            // NAVEGACIÓN
                showPage(pageId) {
                // Ocultar todas las páginas
                document.querySelectorAll('.page').forEach(page => {
                    page.classList.remove('active');
                });
                
                // Mostrar página solicitada
                const targetPage = document.getElementById(pageId);
                if (targetPage) {
                    targetPage.classList.add('active');
                    
                    // Scroll al principio
                    window.scrollTo(0, 0);
                    
                    // Actualizar navegación
                    document.querySelectorAll('.nav-item').forEach(item => {
                        item.classList.remove('active');
                        if (item.dataset.page === pageId) {
                            item.classList.add('active');
                        }
                    });
                    
                    // Cerrar menú hamburguesa
                    document.getElementById('menu-overlay').classList.remove('active');
                    document.getElementById('menu-sidebar').classList.remove('active');
                    
                    // Renderizar contenido específico de la página
                    switch(pageId) {
                        case 'food-page':
                            this.renderFoodPage();
                            break;
                        case 'cart-page':
                            this.renderCartPage();
                            break;
                        case 'orders-page':
                            this.renderOrdersPage();
                            break;
                        case 'profile-page':
                            this.loadProfileData();
                            break;
                    }
                }
            },

            updateCartCount() {
                const count = this.getCartCount();
                document.getElementById('cart-count').textContent = count;
                document.getElementById('nav-cart-count').textContent = count;
                document.getElementById('menu-cart-count').textContent = count;
                
                // Mostrar/ocultar badge
                const show = count > 0;
                document.getElementById('nav-cart-count').style.display = show ? 'flex' : 'none';
                document.getElementById('menu-cart-count').style.display = show ? 'flex' : 'none';
            },

            // EVENT LISTENERS PRINCIPALES         
            setupEventListeners() {
                // Logo - Ir al inicio
                document.getElementById('logo').addEventListener('click', () => {
                    this.showPage('home-page');
                });

                // Ubicación - Mostrar modal
                document.getElementById('location-btn').addEventListener('click', () => {
                    this.showModal('location-modal');
                });

                // Carrito en header - Ir al carrito
                document.getElementById('header-cart').addEventListener('click', () => {
                    this.showPage('cart-page');
                });

                // Navegación inferior
                document.querySelectorAll('.nav-item').forEach(item => {
                    item.addEventListener('click', (e) => {
                        e.preventDefault();
                        const pageId = item.dataset.page;
                        this.showPage(pageId);
                    });
                });

                // Categorías en home
//                document.getElementById('category-food').addEventListener('click', () => {
  //                  this.showPage('food-page');
    //            });
              
      //          ['category-promotions', 'category-desserts', 'category-drinks'].forEach(id => {
       //             document.getElementById(id).addEventListener('click', () => {
        //                this.showNotification('Categoría en desarrollo', 'warning');
          //          });
            //    });

                // Promoción rápida
                //document.getElementById('promo-fast').addEventListener('click', () => {
                  //  this.showNotification('¡Entregas rápidas disponibles en tu zona!', 'success');
               // });

                // Botones "Añadir al carrito" en home
                document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const productId = parseInt(btn.dataset.product);
                        this.addToCart(productId);
                    });
                });

                // Cards de productos en home
                document.querySelectorAll('.food-card').forEach(card => {
                    card.addEventListener('click', (e) => {
                        if (!e.target.closest('.add-to-cart-btn')) {
                            const productId = parseInt(card.dataset.product);
                            this.renderProductDetail(productId);
                        }
                    });
                });

                // Página de producto
                document.getElementById('add-to-cart').addEventListener('click', () => {
                    if (this.state.currentProduct) {
                        const quantity = parseInt(document.getElementById('product-quantity').textContent);
                        this.addToCart(this.state.currentProduct.id, quantity);
                        this.showPage('cart-page');
                    }
                });

                document.getElementById('add-favorite').addEventListener('click', () => {
                    if (this.state.currentProduct) {
                        const added = this.toggleFavorite(this.state.currentProduct.id);
                        const icon = document.querySelector('#add-favorite i');
                        if (added) {
                            icon.className = 'fas fa-heart';
                            this.showNotification('Agregado a favoritos', 'success');
                        } else {
                            icon.className = 'far fa-heart';
                            this.showNotification('Eliminado de favoritos', 'warning');
                        }
                        document.getElementById('add-favorite').classList.toggle('active', added);
                    }
                });

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

                // Página de carrito
                document.getElementById('go-to-menu').addEventListener('click', () => {
                    this.showPage('food-page');
                });

                document.getElementById('checkout-btn').addEventListener('click', () => {
                    if (this.state.cart.length > 0) {
                        this.preparePayment();
                    } else {
                        this.showNotification('Tu carrito está vacío', 'warning');
                    }
                });

                // Página de pago
                document.getElementById('payment-card').addEventListener('click', () => {
                    this.state.paymentMethod = 'card';
                    document.getElementById('card-form').style.display = 'block';
                    document.getElementById('qr-form').style.display = 'none';
                    document.getElementById('payment-card').classList.add('active');
                    document.getElementById('payment-qr').classList.remove('active');
                });

                document.getElementById('payment-qr').addEventListener('click', () => {
                    this.state.paymentMethod = 'qr';
                    document.getElementById('card-form').style.display = 'none';
                    document.getElementById('qr-form').style.display = 'block';
                    document.getElementById('payment-qr').classList.add('active');
                    document.getElementById('payment-card').classList.remove('active');
                });

                document.getElementById('cancel-payment').addEventListener('click', () => {
                    this.showConfirmation(
                        'Cancelar pago',
                        '¿Estás seguro de que deseas cancelar el pago?',
                        () => {
                            this.showPage('cart-page');
                        }
                    );
                });

                document.getElementById('process-payment').addEventListener('click', () => {
                    if (this.state.paymentMethod === 'card') {
                        const cardNumber = document.getElementById('card-number').value;
                        const expiryDate = document.getElementById('expiry-date').value;
                        const cvv = document.getElementById('cvv').value;
                        
                        if (!cardNumber || !expiryDate || !cvv) {
                            this.showNotification('Por favor completa todos los datos de la tarjeta', 'warning');
                            return;
                        }
                        
                        if (cardNumber.replace(/\s/g, '').length !== 16) {
                            this.showNotification('Número de tarjeta inválido', 'warning');
                            return;
                        }
                    }
                    
                    this.processPayment();
                });

                // Formatear número de tarjeta
                document.getElementById('card-number').addEventListener('input', function(e) {
                    let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
                    let formatted = '';
                    for (let i = 0; i < value.length; i++) {
                        if (i > 0 && i % 4 === 0) formatted += ' ';
                        formatted += value[i];
                    }
                    e.target.value = formatted.substring(0, 19);
                });

                // Formatear fecha de expiración
                document.getElementById('expiry-date').addEventListener('input', function(e) {
                    let value = e.target.value.replace(/\D/g, '');
                    if (value.length >= 2) {
                        value = value.substring(0, 2) + '/' + value.substring(2, 4);
                    }
                    e.target.value = value.substring(0, 5);
                });

                // Solo números para CVV
                document.getElementById('cvv').addEventListener('input', function(e) {
                    e.target.value = e.target.value.replace(/\D/g, '').substring(0, 3);
                });

                // Página de pedidos
                document.getElementById('go-to-menu-orders').addEventListener('click', () => {
                    this.showPage('food-page');
                });

                // Login Page
                document.getElementById('login-btn').addEventListener('click', () => {
                    const email = document.getElementById('login-email').value.trim();
                    const password = document.getElementById('login-password').value.trim();
                    
                    if (!email || !password) {
                        this.showNotification('Por favor completa todos los campos', 'warning');
                        return;
                    }
                    
                    if (!this.validateEmail(email)) {
                        this.showNotification('Por favor ingresa un email válido', 'warning');
                        return;
                    }
                    
                    this.login(email, password);
                });

                document.getElementById('login-google').addEventListener('click', () => {
                    this.showNotification('Inicio de sesión con Google en desarrollo', 'warning');
                });

                document.getElementById('login-facebook').addEventListener('click', () => {
                    this.showNotification('Inicio de sesión con Facebook en desarrollo', 'warning');
                });

                document.getElementById('register-link').addEventListener('click', (e) => {
                    e.preventDefault();
                    this.showPage('register-page');
                });

                // Register Page
                document.getElementById('register-btn').addEventListener('click', () => {
                    const names = document.getElementById('register-names').value.trim();
                    const lastnames = document.getElementById('register-lastnames').value.trim();
                    const email = document.getElementById('register-email').value.trim();
                    const phone = document.getElementById('register-phone').value.trim();
                    const password = document.getElementById('register-password').value.trim();
                    const confirmPassword = document.getElementById('register-confirm-password').value.trim();
                    const terms = document.getElementById('terms').checked;
                    
                    if (!names || !lastnames || !email || !phone || !password || !confirmPassword) {
                        this.showNotification('Por favor completa todos los campos', 'warning');
                        return;
                    }
                    
                    if (!this.validateEmail(email)) {
                        this.showNotification('Por favor ingresa un email válido', 'warning');
                        return;
                    }
                    
                    if (password !== confirmPassword) {
                        this.showNotification('Las contraseñas no coinciden', 'warning');
                        return;
                    }
                    
                    if (password.length < 6) {
                        this.showNotification('La contraseña debe tener al menos 6 caracteres', 'warning');
                        return;
                    }
                    
                    if (!terms) {
                        this.showNotification('Debes aceptar los términos y condiciones', 'warning');
                        return;
                    }
                    
                    this.register({
                        names,
                        lastnames,
                        email,
                        phone,
                        password
                    });
                });

                document.getElementById('login-link').addEventListener('click', (e) => {
                    e.preventDefault();
                    this.showPage('login-page');
                });

                // Profile Page
                document.getElementById('save-profile').addEventListener('click', () => {
                    this.saveProfile();
                });

                // Manual Page
                document.getElementById('download-manual').addEventListener('click', () => {
                    this.showNotification('Descargando Manual de Usuario Básico...', 'success');
                    // Simulación de descarga
                    setTimeout(() => {
                        this.showNotification('Descarga completada', 'success');
                    }, 1500);
                });

                document.getElementById('download-guide').addEventListener('click', () => {
                    this.showNotification('Descargando Guía de Pago y Seguridad...', 'success');
                    // Simulación de descarga
                    setTimeout(() => {
                        this.showNotification('Descarga completada', 'success');
                    }, 1500);
                });

                // Menu Hamburguesa Items
                document.getElementById('menu-home').addEventListener('click', () => {
                    this.showPage('home-page');
                });

                document.getElementById('menu-food').addEventListener('click', () => {
                    this.showPage('food-page');
                });

                document.getElementById('menu-cart').addEventListener('click', () => {
                    this.showPage('cart-page');
                });

                document.getElementById('menu-orders').addEventListener('click', () => {
                    this.showPage('orders-page');
                });

                document.getElementById('menu-login').addEventListener('click', () => {
                    if (this.state.user.loggedIn) {
                        this.showPage('profile-page');
                    } else {
                        this.showPage('login-page');
                    }
                });

                document.getElementById('menu-manual').addEventListener('click', () => {
                    this.showPage('manual-page');
                });

                document.getElementById('menu-profile').addEventListener('click', () => {
                    if (this.state.user.loggedIn) {
                        this.showPage('profile-page');
                    } else {
                        this.showPage('login-page');
                    }
                });

                document.getElementById('menu-settings').addEventListener('click', () => {
                    this.showNotification('Configuración en desarrollo', 'warning');
                });

                document.getElementById('menu-logout').addEventListener('click', () => {
                    if (this.state.user.loggedIn) {
                        this.showConfirmation(
                            'Cerrar sesión',
                            '¿Estás seguro de que deseas cerrar sesión?',
                            () => {
                                this.logout();
                            }
                        );
                    } else {
                        this.showNotification('No hay sesión activa', 'warning');
                    }
                });

                // Modal de ubicación
                document.getElementById('location-save').addEventListener('click', () => {
                    const city = document.getElementById('city-select').value;
                    const address = document.getElementById('specific-address').value;
                    
                    if (address.trim()) {
                        this.state.location = `${address}, ${city}`;
                    } else {
                        this.state.location = city;
                    }
                    
                    document.querySelector('.location span').textContent = this.state.location;
                    this.hideModal('location-modal');
                    this.showNotification('Ubicación actualizada', 'success');
                });

                document.getElementById('location-cancel').addEventListener('click', () => {
                    this.hideModal('location-modal');
                });

                // Modal de confirmación
                document.getElementById('modal-cancel').addEventListener('click', () => {
                    this.hideModal('confirmation-modal');
                });

                // Recargar datos al volver a la página
                window.addEventListener('pageshow', () => {
                    this.updateCartCount();
                });
            },

           
            // EVENT LISTENERS SECUNDARIOS
            
            setupProductCardListeners() {
                // Botones en página de comidas
                document.querySelectorAll('.view-product-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const productId = parseInt(btn.dataset.product);
                        this.renderProductDetail(productId);
                    });
                });

                document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const productId = parseInt(btn.dataset.product);
                        this.addToCart(productId);
                    });
                });

                // Cards de productos
                document.querySelectorAll('.food-card').forEach(card => {
                    card.addEventListener('click', (e) => {
                        if (!e.target.closest('button')) {
                            const productId = parseInt(card.dataset.product);
                            this.renderProductDetail(productId);
                        }
                    });
                });
            },

            setupCartItemListeners() {
                // Botones de cantidad en carrito
                document.querySelectorAll('.decrease-item').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const itemElement = e.target.closest('.cart-item');
                        const productId = parseInt(itemElement.dataset.id);
                        const item = this.state.cart.find(item => item.productId === productId);
                        
                        if (item && item.quantity > 1) {
                            this.updateCartQuantity(productId, item.quantity - 1);
                            this.renderCartPage();
                        }
                    });
                });

                document.querySelectorAll('.increase-item').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const itemElement = e.target.closest('.cart-item');
                        const productId = parseInt(itemElement.dataset.id);
                        const item = this.state.cart.find(item => item.productId === productId);
                        
                        if (item) {
                            this.updateCartQuantity(productId, item.quantity + 1);
                            this.renderCartPage();
                        }
                    });
                });

                // Botones de eliminar en carrito
                document.querySelectorAll('.remove-item').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const itemElement = e.target.closest('.cart-item');
                        const productId = parseInt(itemElement.dataset.id);
                        
                        this.showConfirmation(
                            'Eliminar producto',
                            '¿Estás seguro de que quieres eliminar este producto del carrito?',
                            () => {
                                this.removeFromCart(productId);
                                this.renderCartPage();
                            }
                        );
                    });
                });
            },
            // FUNCIONALIDADES AUXILIARES
          
            isFavorite(productId) {
                return this.state.favorites.includes(productId);
            },

            toggleFavorite(productId) {
                const index = this.state.favorites.indexOf(productId);
                if (index === -1) {
                    this.state.favorites.push(productId);
                    this.saveData();
                    return true;
                } else {
                    this.state.favorites.splice(index, 1);
                    this.saveData();
                    return false;
                }
            },

            updateProductTotal() {
                if (!this.state.currentProduct) return;
                
                const quantity = parseInt(document.getElementById('product-quantity').textContent);
                const total = this.state.currentProduct.price * quantity;
                document.getElementById('product-total').textContent = total;
            },

            preparePayment() {
                const total = this.getCartTotal() + 15;
                const itemCount = this.getCartCount();
                
                document.getElementById('payment-total').textContent = `${total.toFixed(2)} Bs`;
                document.getElementById('payment-items').textContent = `${itemCount} producto(s) en tu pedido`;
                
                // Resetear formulario de pago
                document.getElementById('card-number').value = '';
                document.getElementById('expiry-date').value = '';
                document.getElementById('cvv').value = '';
                
                this.showPage('payment-page');
            },

            processPayment() {
                if (!this.state.user.loggedIn) {
                    this.showNotification('Debes iniciar sesión para realizar un pedido', 'warning');
                    this.showPage('login-page');
                    return;
                }

                const order = this.createOrder();
                if (order) {
                    this.showNotification('¡Pago procesado exitosamente! Tu pedido está en camino.', 'success');
                    this.showPage('orders-page');
                    this.renderOrdersPage();
                }
            },

            loadProfileData() {
                if (!this.state.user.loggedIn) {
                    this.showPage('login-page');
                    return;
                }

                const nameParts = this.state.user.name.split(' ');
                document.getElementById('profile-nombres').value = nameParts[0] || '';
                document.getElementById('profile-apellidos').value = nameParts.slice(1).join(' ') || '';
                document.getElementById('profile-correo').value = this.state.user.email;
                document.getElementById('profile-direccion').value = this.state.user.address;
                document.getElementById('profile-telefono').value = this.state.user.phone;
                document.getElementById('notifications').checked = this.state.user.notifications;
            },

            saveProfile() {
                if (!this.state.user.loggedIn) {
                    this.showNotification('Debes iniciar sesión para guardar cambios', 'warning');
                    return;
                }

                const nombre = document.getElementById('profile-nombres').value.trim();
                const apellido = document.getElementById('profile-apellidos').value.trim();
                const email = document.getElementById('profile-correo').value.trim();
                const address = document.getElementById('profile-direccion').value.trim();
                const phone = document.getElementById('profile-telefono').value.trim();
                const notifications = document.getElementById('notifications').checked;
                
                if (!nombre || !apellido || !email || !address || !phone) {
                    this.showNotification('Por favor completa todos los campos', 'warning');
                    return;
                }
                
                if (!this.validateEmail(email)) {
                    this.showNotification('Por favor ingresa un email válido', 'warning');
                    return;
                }
                
                this.state.user = {
                    ...this.state.user,
                    name: `${nombre} ${apellido}`,
                    email: email,
                    address: address,
                    phone: phone,
                    notifications: notifications
                };
                
                this.saveData();
                this.updateMenuUserInfo();
                this.showNotification('Perfil actualizado exitosamente', 'success');
                
                // Actualizar ubicación si cambió
                if (address.includes(',')) {
                    const city = address.split(',').pop().trim();
                    this.state.location = `${city}, Bolivia`;
                    document.querySelector('.location span').textContent = this.state.location;
                }
            },

            validateEmail(email) {
                const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return re.test(email);
            },

            // MODALES Y NOTIFICACIONES
            showModal(modalId) {
                const modal = document.getElementById(modalId);
                if (modal) {
                    modal.classList.add('active');
                }
            },

            hideModal(modalId) {
                const modal = document.getElementById(modalId);
                if (modal) {
                    modal.classList.remove('active');
                }
            },

            showConfirmation(title, message, onConfirm) {
                document.getElementById('modal-title').textContent = title;
                document.getElementById('modal-message').textContent = message;
                
                const confirmBtn = document.getElementById('modal-confirm');
                const newConfirm = () => {
                    onConfirm();
                    this.hideModal('confirmation-modal');
                    confirmBtn.removeEventListener('click', newConfirm);
                };
                confirmBtn.addEventListener('click', newConfirm);
                
                this.showModal('confirmation-modal');
            },

            showNotification(message, type = 'success') {
                // Eliminar notificaciones anteriores
                const existing = document.querySelector('.notification');
                if (existing) existing.remove();
                
                // Crear notificación
                const notification = document.createElement('div');
                notification.className = `notification ${type}`;
                notification.innerHTML = `
                    <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
                    <span>${message}</span>
                `;
                
                document.body.appendChild(notification);
                
                // Remover después de 3 segundos
                setTimeout(() => {
                    notification.remove();
                }, 3000);
            }
        };

      
        // INICIALIZAR LA APLICACIÓN
        
        document.addEventListener('DOMContentLoaded', () => {
            App.init();
        });
