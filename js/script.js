// "Banco de Dados" de Produtos
const products = [
    {
        id: 1,
        name: "Vaso Elegante",
        price: 49.90,
        image: "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='250'%20height='250'%3E%3Crect%20width='100%25'%20height='100%25'%20fill='%23cccccc'/%3E%3C/svg%3E",
        description: "Um vaso elegante impresso em 3D, perfeito para decorar qualquer ambiente. Feito com material PLA de alta qualidade."
    },
    {
        id: 2,
        name: "Action Figure",
        price: 59.90,
        image: "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='250'%20height='250'%3E%3Crect%20width='100%25'%20height='100%25'%20fill='%23cccccc'/%3E%3C/svg%3E",
        description: "Uma action figure detalhada, impressa com precisão para colecionadores. Material resistente e acabamento de primeira."
    },
    {
        id: 3,
        name: "Suporte para Headset",
        price: 39.90,
        image: "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='250'%20height='250'%3E%3Crect%20width='100%25'%20height='100%25'%20fill='%23cccccc'/%3E%3C/svg%3E",
        description: "Mantenha seu setup organizado com este suporte para headset. Design moderno e funcional."
    },
    {
        id: 4,
        name: "Organizador de Mesa",
        price: 34.90,
        image: "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='250'%20height='250'%3E%3Crect%20width='100%25'%20height='100%25'%20fill='%23cccccc'/%3E%3C/svg%3E",
        description: "Um organizador de mesa prático para canetas, clips e outros itens pequenos. Otimize seu espaço de trabalho."
    },
    {
        id: 5,
        name: "Chaveiro Personalizado",
        price: 19.90,
        image: "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='250'%20height='250'%3E%3Crect%20width='100%25'%20height='100%25'%20fill='%23cccccc'/%3E%3C/svg%3E",
        description: "Chaveiro personalizado com seu nome ou logo. Um ótimo presente ou brinde."
    },
    {
        id: 6,
        name: "Luminária de Lua",
        price: 89.90,
        image: "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='250'%20height='250'%3E%3Crect%20width='100%25'%20height='100%25'%20fill='%23cccccc'/%3E%3C/svg%3E",
        description: "Uma linda luminária em formato de lua, criando um ambiente aconchegante e relaxante. Perfeita para quartos."
    }
];

// Objeto principal da aplicação para organizar o código
const app = {
    cart: [],

    // Inicializa a aplicação
    init() {
        this.loadCart();
        this.addEventListeners();
        this.updateCartCount();
        this.renderPage();
    },

    // Carrega o carrinho do localStorage
    loadCart() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
    },

    // Salva o carrinho no localStorage e atualiza a contagem de itens
    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
        this.updateCartCount();
    },

    // Adiciona um produto ao carrinho
    addToCart(product) {
        const productData = products.find(p => p.id == product.id);
        if (!productData) return;

        const existingItem = this.cart.find(item => item.id === productData.id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            this.cart.push({
                id: productData.id,
                name: productData.name,
                price: productData.price,
                image: productData.image,
                quantity: 1
            });
        }
        this.saveCart();
        alert(`${productData.name} foi adicionado ao carrinho!`);
    },

    // Atualiza o contador de itens no cabeçalho
    updateCartCount() {
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCountElement.textContent = totalItems;
        }
    },

    // Renderiza os itens na página do carrinho
    renderCartItems() {
        const cartItemsContainer = document.getElementById('cart-items-container');
        if (!cartItemsContainer) return;

        cartItemsContainer.innerHTML = '';

        if (this.cart.length === 0) {
            const emptyCartMessage = document.createElement('p');
            emptyCartMessage.textContent = 'Seu carrinho está vazio.';
            cartItemsContainer.appendChild(emptyCartMessage);
            return;
        }

        this.cart.forEach(item => {
            const cartItemElement = this.createCartItemElement(item);
            cartItemsContainer.appendChild(cartItemElement);
        });
        this.updateCartTotal();
    },

    // Cria o elemento HTML para um item do carrinho
    createCartItemElement(item) {
        const cartItemElement = document.createElement('div');
        cartItemElement.classList.add('cart-item');

        const itemInfo = document.createElement('div');
        itemInfo.classList.add('cart-item-info');

        const itemImage = document.createElement('img');
        itemImage.src = item.image;
        itemImage.alt = item.name;

        const itemDetails = document.createElement('div');
        const itemName = document.createElement('h4');
        itemName.textContent = item.name;
        const itemPrice = document.createElement('p');
        itemPrice.textContent = `R$ ${item.price.toFixed(2)}`;
        itemDetails.appendChild(itemName);
        itemDetails.appendChild(itemPrice);

        itemInfo.appendChild(itemImage);
        itemInfo.appendChild(itemDetails);

        const itemQuantity = document.createElement('div');
        const quantityText = document.createElement('p');
        quantityText.textContent = `Qtd: ${item.quantity}`;
        itemQuantity.appendChild(quantityText);

        cartItemElement.appendChild(itemInfo);
        cartItemElement.appendChild(itemQuantity);

        return cartItemElement;
    },

    // Atualiza o valor total do carrinho
    updateCartTotal() {
        const cartTotalElement = document.getElementById('cart-total');
        if (cartTotalElement) {
            const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            cartTotalElement.textContent = total.toFixed(2);
        }
    },

    // Limpa todos os itens do carrinho
    clearCart() {
        this.cart = [];
        this.saveCart();
        this.renderCartItems();
    },

    // Renderiza a galeria de produtos na página inicial
    renderProductGallery() {
        const galleryContainer = document.querySelector('.gallery-container');
        if (!galleryContainer) return;

        products.forEach(product => {
            const productItem = this.createProductItemElementForGallery(product);
            galleryContainer.appendChild(productItem);
        });
    },

    // Cria o elemento HTML para um produto na galeria
    createProductItemElementForGallery(product) {
        const productItem = document.createElement('div');
        productItem.classList.add('product-item');
        productItem.dataset.id = product.id;

        const productLink = document.createElement('a');
        productLink.href = `produto.html?id=${product.id}`;
        productLink.classList.add('product-link');

        const productImage = document.createElement('img');
        productImage.src = product.image;
        productImage.alt = product.name;

        const productName = document.createElement('h3');
        productName.textContent = product.name;

        productLink.appendChild(productImage);
        productLink.appendChild(productName);

        const productPrice = document.createElement('p');
        productPrice.textContent = `R$ ${product.price.toFixed(2)}`;

        const addToCartBtn = document.createElement('button');
        addToCartBtn.classList.add('add-to-cart-btn');
        addToCartBtn.textContent = 'Adicionar ao Carrinho';

        productItem.appendChild(productLink);
        productItem.appendChild(productPrice);
        productItem.appendChild(addToCartBtn);

        return productItem;
    },

    // Adiciona os event listeners aos elementos da página
    addEventListeners() {
        document.body.addEventListener('click', (event) => {
            if (event.target.classList.contains('add-to-cart-btn')) {
                const productElement = event.target.closest('[data-id]');
                if (productElement) {
                    const product = {
                        id: productElement.dataset.id,
                    };
                    this.addToCart(product);
                }
            }
        });

        const clearCartButton = document.getElementById('clear-cart-btn');
        if (clearCartButton) {
            clearCartButton.addEventListener('click', () => this.clearCart());
        }

        const checkoutButton = document.getElementById('checkout-btn');
        if (checkoutButton) {
            checkoutButton.addEventListener('click', () => {
                alert('A funcionalidade de finalizar a compra ainda não foi implementada.');
            });
        }

        const applyPointsButton = document.getElementById('apply-points-btn');
        if (applyPointsButton) {
            applyPointsButton.addEventListener('click', () => {
                const pointsInput = document.getElementById('points-to-use');
                const points = pointsInput.value;
                alert(`${points} pontos aplicados! (Funcionalidade de UI)`);
            });
        }
    },

    // Renderiza a página correta
    renderPage() {
        const path = window.location.pathname;
        if (path.endsWith('carrinho.html')) {
            this.renderCartItems();
        } else if (path.endsWith('produto.html')) {
            this.renderProductDetail();
        } else if (path.endsWith('login.html') || path.endsWith('cadastro.html') || path.endsWith('conta.html')) {
            // Nenhuma renderização específica necessária para estas páginas
        } else {
            this.renderProductGallery();
        }
    },

    // Renderiza os detalhes de um produto
    renderProductDetail() {
        const container = document.getElementById('product-detail');
        if (!container) return;

        const urlParams = new URLSearchParams(window.location.search);
        const productId = parseInt(urlParams.get('id'));
        const product = products.find(p => p.id === productId);

        if (product) {
            container.innerHTML = '';
            container.dataset.id = product.id;

            const imageDiv = document.createElement('div');
            imageDiv.classList.add('product-image');
            const img = document.createElement('img');
            img.src = product.image;
            img.alt = product.name;
            imageDiv.appendChild(img);

            const infoDiv = document.createElement('div');
            infoDiv.classList.add('product-info');

            const name = document.createElement('h2');
            name.textContent = product.name;

            const price = document.createElement('p');
            price.classList.add('price');
            price.textContent = `R$ ${product.price.toFixed(2)}`;

            const description = document.createElement('p');
            description.classList.add('description');
            description.textContent = product.description;

            const button = document.createElement('button');
            button.classList.add('add-to-cart-btn');
            button.textContent = 'Adicionar ao Carrinho';

            infoDiv.appendChild(name);
            infoDiv.appendChild(price);
            infoDiv.appendChild(description);
            infoDiv.appendChild(button);

            container.appendChild(imageDiv);
            container.appendChild(infoDiv);
        } else {
            container.innerHTML = '<p>Produto não encontrado.</p>';
        }
    }
};

// Objeto para o Popup Promocional
const promoPopup = {
    popup: document.getElementById('promo-popup'),
    closeButton: document.querySelector('.popup-close'),

    init() {
        if (!this.popup) return;

        if (sessionStorage.getItem('promoPopupSeen')) {
            return;
        }

        setTimeout(() => this.show(), 1000);

        this.addEventListeners();
    },

    show() {
        this.popup.classList.add('active');
    },

    hide() {
        this.popup.classList.remove('active');
        sessionStorage.setItem('promoPopupSeen', 'true');
    },

    addEventListeners() {
        if(this.closeButton) {
            this.closeButton.addEventListener('click', () => this.hide());
        }
        this.popup.addEventListener('click', (event) => {
            if (event.target === this.popup) {
                this.hide();
            }
        });
    }
};

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', () => {
    app.init();
    promoPopup.init();
});
