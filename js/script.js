// Objeto principal da aplicação para organizar o código
const app = {
    cart: [],

    // Inicializa a aplicação
    init() {
        this.loadCart();
        this.addEventListeners();
        this.updateCartCount();
        this.renderCartPage();
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
        const existingItem = this.cart.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            this.cart.push({ ...product, quantity: 1 });
        }
        this.saveCart();
        alert(`${product.name} foi adicionado ao carrinho!`);
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

        cartItemsContainer.innerHTML = ''; // Limpa o container antes de renderizar

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
    },

    // Cria o elemento HTML para um item do carrinho (mais seguro que innerHTML)
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
        this.updateCartTotal();
        alert('O carrinho foi esvaziado.');
    },

    // Renderiza a galeria de produtos na página inicial
    renderProductGallery() {
        const galleryContainer = document.querySelector('.gallery-container');
        if (!galleryContainer) return;

        products.forEach(product => {
            const productItem = this.createProductItemElement(product);
            galleryContainer.appendChild(productItem);
        });
    },

    // Cria o elemento HTML para um produto na galeria
    createProductItemElement(product) {
        const productItem = document.createElement('div');
        productItem.classList.add('product-item');
        productItem.dataset.id = product.id;
        productItem.dataset.name = product.name;
        productItem.dataset.price = product.price;

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
        // Delegação de eventos para os botões "Adicionar ao Carrinho"
        document.body.addEventListener('click', (event) => {
            if (event.target.classList.contains('add-to-cart-btn')) {
                const productElement = event.target.closest('.product-item, .product-detail-container');
                const product = {
                    id: productElement.dataset.id,
                    name: productElement.dataset.name,
                    price: parseFloat(productElement.dataset.price),
                    image: productElement.querySelector('img').src
                };
                this.addToCart(product);
            }
        });

        // Botão "Limpar Carrinho"
        const clearCartButton = document.getElementById('clear-cart-btn');
        if (clearCartButton) {
            clearCartButton.addEventListener('click', () => this.clearCart());
        }

        // Botão "Finalizar Compra"
        const checkoutButton = document.getElementById('checkout-btn');
        if (checkoutButton) {
            checkoutButton.addEventListener('click', () => {
                alert('A funcionalidade de finalizar a compra ainda não foi implementada.');
            });
        }
    },

    // Renderiza a página do carrinho ou a galeria de produtos
    renderPage() {
        const path = window.location.pathname;
        if (path.endsWith('carrinho.html')) {
            this.renderCartItems();
            this.updateCartTotal();
        } else if (path.endsWith('produto.html')) {
            this.renderProductDetail();
        } else if (path.endsWith('index.html') || path === '/') {
            this.renderProductGallery();
        }
    },

    // Renderiza os detalhes de um produto na página de detalhes
    renderProductDetail() {
        const productDetailContainer = document.getElementById('product-detail');
        if (!productDetailContainer) return;

        const urlParams = new URLSearchParams(window.location.search);
        const productId = parseInt(urlParams.get('id'));

        const product = products.find(p => p.id === productId);

        if (product) {
            productDetailContainer.innerHTML = ''; // Limpa a mensagem de "carregando"
            productDetailContainer.dataset.id = product.id;
            productDetailContainer.dataset.name = product.name;
            productDetailContainer.dataset.price = product.price;

            const productImage = document.createElement('div');
            productImage.classList.add('product-image');
            const img = document.createElement('img');
            img.src = product.image;
            img.alt = product.name;
            productImage.appendChild(img);

            const productInfo = document.createElement('div');
            productInfo.classList.add('product-info');

            const productName = document.createElement('h2');
            productName.textContent = product.name;

            const productPrice = document.createElement('p');
            productPrice.classList.add('price');
            productPrice.textContent = `R$ ${product.price.toFixed(2)}`;

            const productDescription = document.createElement('p');
            productDescription.classList.add('description');
            productDescription.textContent = product.description;

            const addToCartBtn = document.createElement('button');
            addToCartBtn.classList.add('add-to-cart-btn');
            addToCartBtn.textContent = 'Adicionar ao Carrinho';

            productInfo.appendChild(productName);
            productInfo.appendChild(productPrice);
            productInfo.appendChild(productDescription);
            productInfo.appendChild(addToCartBtn);

            productDetailContainer.appendChild(productImage);
            productDetailContainer.appendChild(productInfo);
        } else {
            productDetailContainer.innerHTML = '<p>Produto não encontrado.</p>';
        }
    }
};

// Inicializa a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    // É necessário ter o array de produtos antes de inicializar
    if (typeof products !== 'undefined') {
        app.init();
    } else {
        console.error('O arquivo de produtos (products.js) não foi carregado.');
    }
});
