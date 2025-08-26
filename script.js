document.addEventListener('DOMContentLoaded', () => {

    // ===================================================================
    // =================== ATLAS: LÓGICA DO FRONTEND =====================
    // ===================================================================

    // --- DADOS MOCK (Simulando o Backend) ---
    const properties = [
        {
            id: 1,
            title: "Apartamento Moderno no Centro",
            purpose: "Alugar",
            price: 2500,
            neighborhood: "Centro",
            bedrooms: 2,
            location: "Rua Principal, 123, Centro",
            images: [
                "https://placehold.co/600x400/a3a3a3/ffffff?text=Imóvel+1+-+Foto+1",
                "https://placehold.co/600x400/bfdbfe/1e3a8a?text=Sala",
                "https://placehold.co/600x400/bfdbfe/1e3a8a?text=Cozinha"
            ],
            longDescription: "Este apartamento moderno no coração da cidade oferece conveniência e estilo. Com acabamentos de alta qualidade, é perfeito para quem busca uma vida urbana vibrante.",
            details: ["Área: 75m²", "Banheiros: 2", "Vagas: 1", "Andar: 10º", "Mobiliado"]
        },
        {
            id: 2,
            title: "Casa Espaçosa com Quintal",
            purpose: "Comprar",
            price: 750000,
            neighborhood: "Jardim das Flores",
            bedrooms: 4,
            location: "Av. das Rosas, 456, Jardim das Flores",
            images: [
                "https://placehold.co/600x400/a3a3a3/ffffff?text=Imóvel+2+-+Foto+1",
                "https://placehold.co/600x400/fecaca/991b1b?text=Quintal"
            ],
            longDescription: "Uma casa familiar espaçosa com um grande quintal, ideal para crianças e animais de estimação. Localizada em um bairro tranquilo e arborizado.",
            details: ["Área: 220m²", "Banheiros: 3", "Vagas: 4", "Quintal Amplo", "Churrasqueira"]
        },
        {
            id: 3,
            title: "Cobertura Duplex com Vista",
            purpose: "Comprar",
            price: 1200000,
            neighborhood: "Alto da Colina",
            bedrooms: 3,
            location: "Alameda dos Sonhos, 789, Alto da Colina",
            images: [
                "https://placehold.co/600x400/a3a3a3/ffffff?text=Imóvel+3+-+Foto+1"
            ],
            longDescription: "Cobertura com vista panorâmica da cidade, piscina privativa e acabamentos de luxo. Um imóvel exclusivo para quem busca o melhor.",
            details: ["Área: 180m²", "Banheiros: 4", "Vagas: 3", "Piscina Privativa"]
        },
        {
            id: 4,
            title: "Kitnet Mobiliada para Estudantes",
            purpose: "Alugar",
            price: 1200,
            neighborhood: "Universitário",
            bedrooms: 1,
            location: "Rua do Saber, 101, Universitário",
            images: ["https://placehold.co/600x400/a3a3a3/ffffff?text=Imóvel+4"],
            longDescription: "Kitnet prática e mobiliada, ideal para estudantes. Perto da universidade e com todas as contas inclusas.",
            details: ["Área: 30m²", "Banheiros: 1", "Contas Inclusas"]
        },
        {
            id: 5,
            title: "Casa de Condomínio com Lazer",
            purpose: "Comprar",
            price: 980000,
            neighborhood: "Jardim das Flores",
            bedrooms: 3,
            location: "Rua das Palmeiras, 212, Jardim das Flores",
            images: ["https://placehold.co/600x400/a3a3a3/ffffff?text=Imóvel+5"],
            longDescription: "Casa em condomínio fechado com segurança 24h e área de lazer completa, incluindo piscina e salão de festas.",
            details: ["Área: 190m²", "Banheiros: 3", "Vagas: 2", "Lazer Completo"]
        },
        {
            id: 6,
            title: "Apartamento Studio Próximo ao Metrô",
            purpose: "Alugar",
            price: 1800,
            neighborhood: "Centro",
            bedrooms: 1,
            location: "Viela da Estação, 333, Centro",
            images: ["https://placehold.co/600x400/a3a3a3/ffffff?text=Imóvel+6"],
            longDescription: "Studio moderno e funcional, a poucos passos da estação de metrô. Perfeito para quem busca mobilidade.",
            details: ["Área: 40m²", "Banheiros: 1", "Vagas: 1", "Portaria 24h"]
        },
        {
            id: 7,
            title: "Mansão de Luxo",
            purpose: "Comprar",
            price: 15000000,
            neighborhood: "Alto da Colina",
            bedrooms: 6,
            location: "Avenida das Mansões, 100, Alto da Colina",
            images: ["https://placehold.co/600x400/a3a3a3/ffffff?text=Imóvel+7"],
            longDescription: "Uma propriedade magnífica com design de arquiteto renomado, automação completa e vista deslumbrante.",
            details: ["Área: 1200m²", "Banheiros: 8", "Vagas: 10", "Cinema Privativo", "Academia"]
        }
    ];

    const appRoot = document.getElementById('app-root');

    // --- FUNÇÕES DE RENDERIZAÇÃO DE COMPONENTES ---

    const renderHeader = (activePage) => {
        return `
            <header class="header">
                <div class="nav-pill">
                    <a href="#" class="header-logo" data-page="home">
                        <img src="assets/logo.png" alt="Logo Presence Imobiliária" onerror="this.onerror=null;this.src='https://placehold.co/150x50/4f46e5/ffffff?text=Presence';">
                    </a>
                    <nav class="header-nav">
                        <a href="#" class="nav-link ${activePage === 'home' ? 'active' : ''}" data-page="home">Home</a>
                        <a href="#" class="nav-link ${activePage === 'properties' ? 'active' : ''}" data-page="properties">Imóveis</a>
                        <a href="#" class="nav-link ${activePage === 'contact' ? 'active' : ''}" data-page="contact">Contato</a>
                    </nav>
                    <div class="auth-buttons">
                        <a href="#" class="button button-secondary" data-page="login">Login</a>
                        <a href="#" class="button" data-page="register">Cadastro</a>
                    </div>
                </div>
            </header>
        `;
    };

    const renderFooter = () => {
        return `
            <footer class="footer">
                <div class="container">
                    <div class="footer-content">
                        <div class="footer-column">
                            <h3>Presence Consultoria Imobiliária</h3>
                            <p>Unindo tecnologia e atendimento personalizado para oferecer uma experiência imobiliária única e sofisticada.</p>
                        </div>
                        <div class="footer-column">
                            <h3>Redes Sociais</h3>
                            <div class="social-link">
                                <ion-icon name="logo-instagram"></ion-icon>
                                <a href="https://www.instagram.com/presenceimobiliaria" target="_blank">@presenceimobiliaria</a>
                            </div>
                        </div>
                    </div>
                    <div class="footer-divider"></div>
                    <p class="footer-copyright">© ${new Date().getFullYear()} Presence Consultoria Imobiliária. Todos os direitos reservados.</p>
                </div>
            </footer>
        `;
    };

    // --- FUNÇÕES DE RENDERIZAÇÃO DE PÁGINAS ---

    const renderHomePage = () => {
        appRoot.innerHTML = `
            ${renderHeader('home')}
            <main>
                <div class="container" style="display: flex; flex-direction: column; gap: 4rem;">
                    <section class="about-section">
                        <div class="about-logo-col">
                            <img src="assets/logo.png" alt="Logo Presence" class="about-logo" onerror="this.onerror=null;this.src='https://placehold.co/250x150/4f46e5/ffffff?text=Presence';">
                        </div>
                        <div class="about-text-col">
                            <h1 class="about-title">Encontrando seu lugar no mundo.</h1>
                            <p class="about-description">Na Presence, unimos tecnologia e atendimento personalizado para oferecer uma experiência imobiliária única. Nossa missão é apresentar imóveis de forma clara e sofisticada, garantindo que você encontre não apenas uma casa, mas um verdadeiro lar.</p>
                        </div>
                    </section>
                    <section class="features-section">
                        <div class="feature-card">
                            <ion-icon name="search-circle-outline" class="feature-icon"></ion-icon>
                            <h3 class="feature-title">Busca Inteligente</h3>
                            <p class="feature-description">Filtros avançados para encontrar o imóvel ideal com precisão e rapidez.</p>
                        </div>
                        <div class="feature-card">
                            <ion-icon name="chatbubbles-outline" class="feature-icon"></ion-icon>
                            <h3 class="feature-title">Consultoria Exclusiva</h3>
                            <p class="feature-description">Nossas corretoras estão prontas para oferecer um atendimento personalizado e proativo.</p>
                        </div>
                        <div class="feature-card">
                            <ion-icon name="shield-checkmark-outline" class="feature-icon"></ion-icon>
                            <h3 class="feature-title">Processo Transparente</h3>
                            <p class="feature-description">Acompanhe tudo com clareza e segurança, do primeiro contato à entrega das chaves.</p>
                        </div>
                    </section>
                </div>
            </main>
            ${renderFooter()}
        `;
    };

    const renderPropertiesPage = (filters = {}) => {
        const filteredProperties = properties.filter(p => {
            const purposeMatch = !filters.purpose || filters.purpose === 'todos' || p.purpose === filters.purpose;
            
            const minPrice = filters.minPrice ? parseInt(filters.minPrice, 10) : null;
            const maxPrice = filters.maxPrice ? parseInt(filters.maxPrice, 10) : null;
            const minPriceMatch = minPrice === null || p.price >= minPrice;
            const maxPriceMatch = maxPrice === null || p.price <= maxPrice;

            const neighborhoodMatch = !filters.neighborhood || filters.neighborhood === 'todos' || p.neighborhood === filters.neighborhood;
            
            // **CORREÇÃO 2: Lógica do filtro de quartos**
            const bedroomsFilter = filters.bedrooms ? parseInt(filters.bedrooms, 10) : null;
            let bedroomsMatch = true; // Começa como verdadeiro
            if (bedroomsFilter) {
                if (bedroomsFilter < 5) {
                    bedroomsMatch = p.bedrooms === bedroomsFilter; // Filtro exato para 1 a 4
                } else {
                    bedroomsMatch = p.bedrooms >= 5; // Filtro "maior ou igual" para 5+
                }
            }

            return purposeMatch && minPriceMatch && maxPriceMatch && neighborhoodMatch && bedroomsMatch;
        });

        const neighborhoods = [...new Set(properties.map(p => p.neighborhood))];

        appRoot.innerHTML = `
            ${renderHeader('properties')}
            <main>
                <div class="container properties-page-layout">
                    <aside class="filters-sidebar">
                        <h3>Filtros</h3>
                        <form id="filters-form">
                            <div class="filter-group">
                                <label for="purpose-filter">Finalidade</label>
                                <select id="purpose-filter" name="purpose">
                                    <option value="todos" ${(!filters.purpose || filters.purpose === 'todos') ? 'selected' : ''}>Todos</option>
                                    <option value="Comprar" ${filters.purpose === 'Comprar' ? 'selected' : ''}>Comprar</option>
                                    <option value="Alugar" ${filters.purpose === 'Alugar' ? 'selected' : ''}>Alugar</option>
                                </select>
                            </div>
                            <div class="filter-group">
                                <label>Faixa de Preço (R$)</label>
                                <div class="price-inputs-container">
                                    <input type="number" name="minPrice" placeholder="Mínimo" min="0" value="${filters.minPrice || ''}">
                                    <input type="number" name="maxPrice" placeholder="Máximo" min="0" value="${filters.maxPrice || ''}">
                                </div>
                            </div>
                            <div class="filter-group">
                                <label for="neighborhood-filter">Bairro</label>
                                <select id="neighborhood-filter" name="neighborhood">
                                    <option value="todos">Todos</option>
                                    ${neighborhoods.map(n => `<option value="${n}" ${filters.neighborhood === n ? 'selected' : ''}>${n}</option>`).join('')}
                                </select>
                            </div>
                            <div class="filter-group">
                                <label for="bedrooms-filter">Nº de Quartos</label>
                                <select id="bedrooms-filter" name="bedrooms">
                                    <option value="todos" ${(!filters.bedrooms || filters.bedrooms === 'todos') ? 'selected' : ''}>Todos</option>
                                    <option value="1" ${filters.bedrooms === '1' ? 'selected' : ''}>1</option>
                                    <option value="2" ${filters.bedrooms === '2' ? 'selected' : ''}>2</option>
                                    <option value="3" ${filters.bedrooms === '3' ? 'selected' : ''}>3</option>
                                    <option value="4" ${filters.bedrooms === '4' ? 'selected' : ''}>4</option>
                                    <option value="5" ${filters.bedrooms === '5' ? 'selected' : ''}>5+</option>
                                </select>
                            </div>
                        </form>
                    </aside>
                    <section class="properties-grid-container">
                        <div class="grid-header">
                            <p>Mostrando <strong>${filteredProperties.length}</strong> de <strong>${properties.length}</strong> imóveis.</p>
                        </div>
                        <div class="property-grid">
                            ${filteredProperties.map(p => `
                                <div class="property-card" data-id="${p.id}">
                                    <div class="property-image-wrapper">
                                        <img src="${p.images[0]}" alt="${p.title}" class="property-image" onerror="this.onerror=null;this.src='https://placehold.co/600x400/cccccc/ffffff?text=Imagem+Indisponível';">
                                        <span class="property-purpose-badge">${p.purpose}</span>
                                    </div>
                                    <div class="property-details">
                                        <h2 class="property-title">${p.title}</h2>
                                        <p class="property-location">
                                            <ion-icon name="location-outline"></ion-icon>
                                            ${p.neighborhood}
                                        </p>
                                        <div class="property-features">
                                            <div class="feature-item">
                                                <ion-icon name="bed-outline"></ion-icon>
                                                <span>${p.bedrooms} Quartos</span>
                                            </div>
                                        </div>
                                        <p class="property-price">
                                            R$ ${p.price.toLocaleString('pt-BR')}
                                            ${p.purpose === 'Alugar' ? '<span>/mês</span>' : ''}
                                        </p>
                                        <a href="#" class="button view-details-btn" data-id="${p.id}">Ver Detalhes</a>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </section>
                </div>
            </main>
            ${renderFooter()}
        `;
    };

    const renderContactPage = () => {
        appRoot.innerHTML = `
            ${renderHeader('contact')}
            <main>
                <div class="container contact-page">
                    <h1 class="page-title">Entre em Contato</h1>
                    <p class="page-subtitle">Estamos prontas para ajudar você a encontrar o imóvel dos seus sonhos. Fale com uma de nossas especialistas.</p>
                    <div class="brokers-container">
                        <div class="broker-card">
                            <h3>Helo</h3>
                            <ul class="contact-info-list">
                                <li>
                                    <ion-icon name="mail-outline"></ion-icon>
                                    <a href="mailto:helo@presence.com.br">helo@presence.com.br</a>
                                </li>
                                <li>
                                    <ion-icon name="logo-whatsapp"></ion-icon>
                                    <a href="https://wa.me/5511999999999" target="_blank">+55 (11) 99999-9999</a>
                                </li>
                            </ul>
                        </div>
                        <div class="broker-card">
                            <h3>Vânia</h3>
                             <ul class="contact-info-list">
                                <li>
                                    <ion-icon name="mail-outline"></ion-icon>
                                    <a href="mailto:vania@presence.com.br">vania@presence.com.br</a>
                                </li>
                                <li>
                                    <ion-icon name="logo-whatsapp"></ion-icon>
                                    <a href="https://wa.me/5511888888888" target="_blank">+55 (11) 88888-8888</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </main>
            ${renderFooter()}
        `;
    };

    const renderLoginPage = () => {
        appRoot.innerHTML = `
            ${renderHeader('login')}
            <main>
                <div class="container">
                    <div class="auth-form-container">
                        <h2>Acessar Conta</h2>
                        <form class="auth-form" id="login-form">
                            <div class="filter-group">
                                <label for="email">E-mail</label>
                                <input type="email" id="email" name="email" required>
                            </div>
                            <div class="filter-group">
                                <label for="password">Senha</label>
                                <input type="password" id="password" name="password" required>
                            </div>
                            <button type="submit" class="button">Entrar</button>
                        </form>
                        <p class="auth-switch-link">
                            Não tem uma conta? <a href="#" data-page="register">Cadastre-se</a>
                        </p>
                    </div>
                </div>
            </main>
            ${renderFooter()}
        `;
    };

    const renderRegisterPage = () => {
        appRoot.innerHTML = `
            ${renderHeader('register')}
            <main>
                <div class="container">
                     <div class="auth-form-container">
                        <h2>Criar Conta</h2>
                        <form class="auth-form" id="register-form">
                            <div class="filter-group">
                                <label for="name">Nome Completo</label>
                                <input type="text" id="name" name="name" required>
                            </div>
                            <div class="filter-group">
                                <label for="email">E-mail</label>
                                <input type="email" id="email" name="email" required>
                            </div>
                            <div class="filter-group">
                                <label for="password">Senha</label>
                                <input type="password" id="password" name="password" required>
                            </div>
                            <button type="submit" class="button">Criar Conta</button>
                        </form>
                        <p class="auth-switch-link">
                            Já tem uma conta? <a href="#" data-page="login">Faça login</a>
                        </p>
                    </div>
                </div>
            </main>
            ${renderFooter()}
        `;
    };

    const openPropertyModal = (propertyId) => {
        const property = properties.find(p => p.id === propertyId);
        if (!property) return;
        let currentImageIndex = 0;
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal-overlay';
        modalOverlay.innerHTML = `
            <div class="modal-content">
                <button class="modal-close-btn"><ion-icon name="close-outline"></ion-icon></button>
                <div class="modal-gallery">
                    <img src="${property.images[currentImageIndex]}" alt="${property.title}" class="modal-main-image">
                    <div class="modal-thumbnails">
                        ${property.images.map((img, index) => `<img src="${img}" alt="Thumbnail ${index + 1}" class="modal-thumbnail ${index === 0 ? 'active' : ''}" data-index="${index}">`).join('')}
                    </div>
                </div>
                <div class="modal-info">
                    <h2>${property.title}</h2>
                    <p class="price">R$ ${property.price.toLocaleString('pt-BR')}${property.purpose === 'Alugar' ? ' /mês' : ''}</p>
                    <p class="description">${property.longDescription || 'Descrição detalhada não disponível.'}</p>
                    <ul class="details-list">
                        ${(property.details || []).map(detail => `<li><ion-icon name="checkmark-circle-outline"></ion-icon>${detail}</li>`).join('')}
                    </ul>
                    <a href="https://wa.me/553400000000" target="_blank" class="button">Falar com Corretor</a>
                </div>
            </div>
        `;
        document.body.appendChild(modalOverlay);
        setTimeout(() => modalOverlay.classList.add('active'), 10);
        document.body.classList.add('modal-open');
        const mainImage = modalOverlay.querySelector('.modal-main-image');
        const thumbnails = modalOverlay.querySelectorAll('.modal-thumbnail');
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', () => {
                currentImageIndex = parseInt(thumb.dataset.index);
                mainImage.src = property.images[currentImageIndex];
                thumbnails.forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
            });
        });
    };

    const closePropertyModal = () => {
        const modalOverlay = document.querySelector('.modal-overlay');
        if (modalOverlay) {
            modalOverlay.classList.remove('active');
            document.body.classList.remove('modal-open');
            setTimeout(() => modalOverlay.remove(), 300);
        }
    };

    const navigateTo = (pageName) => {
        window.scrollTo(0, 0);
        switch (pageName) {
            case 'home': renderHomePage(); break;
            case 'properties': renderPropertiesPage(); break;
            case 'contact': renderContactPage(); break;
            case 'login': renderLoginPage(); break;
            case 'register': renderRegisterPage(); break;
            default: renderHomePage();
        }
    };
    
    const attachEventListeners = () => {
        document.body.addEventListener('click', (e) => {
            const navLink = e.target.closest('[data-page]');
            if (navLink) {
                e.preventDefault();
                navigateTo(navLink.dataset.page);
                return;
            }
            const detailsButton = e.target.closest('.view-details-btn');
            if (detailsButton) {
                e.preventDefault();
                const propertyId = parseInt(detailsButton.dataset.id);
                openPropertyModal(propertyId);
                return;
            }
            if (e.target.closest('.modal-close-btn') || e.target.classList.contains('modal-overlay')) {
                closePropertyModal();
                return;
            }
        });

        // **CORREÇÃO 1: Lógica de atualização dos filtros**
        appRoot.addEventListener('change', (e) => {
            if (e.target.closest('#filters-form')) {
                const form = e.target.closest('#filters-form');
                const formData = new FormData(form);
                const filters = Object.fromEntries(formData.entries());
                
                const scrollY = window.scrollY;
                const focusedElement = document.activeElement;
                const focusedName = focusedElement.name;
                const focusedValue = focusedElement.value;


                renderPropertiesPage(filters);

                setTimeout(() => {
                    window.scrollTo(0, scrollY);
                    if (focusedName) {
                        const newElement = document.querySelector(`[name="${focusedName}"]`);
                        if (newElement) {
                            newElement.focus();
                            // Restaura o valor para evitar que o cursor vá para o início
                            newElement.value = focusedValue;
                        }
                    }
                }, 0);
            }
        });
    };

    const init = () => {
        renderHomePage();
        attachEventListeners();
    };

    init();
});
