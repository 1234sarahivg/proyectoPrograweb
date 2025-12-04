
        const menuToggle = document.getElementById('menu-toggle');
        const closeBtn = document.getElementById('close-btn');
        const navMenu = document.getElementById('nav-menu');
        const mainContent = document.getElementById('main-content');

        // Función para abrir el menú
        function openMenu() {
            navMenu.classList.add('open');
            mainContent.classList.add('nav-open');
        }

        // Función para cerrar el menú
        function closeMenu() {
            navMenu.classList.remove('open');
            mainContent.classList.remove('nav-open');
        }

        // Event listeners
        menuToggle.addEventListener('click', openMenu);
        closeBtn.addEventListener('click', closeMenu);

        // Cerrar el menú al hacer clic fuera de él (opcional, pero útil)
        document.addEventListener('click', function(event) {
            if (!navMenu.contains(event.target) && !menuToggle.contains(event.target)) {
                closeMenu();
            }
        });
