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

    // Adiciona os event listeners aos elementos da página
    addEventListeners() {
        // Botões "Adicionar ao Carrinho"
        const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const productElement = event.target.closest('.product-item, .product-detail-container');
                const product = {
                    id: productElement.dataset.id,
                    name: productElement.dataset.name,
                    price: parseFloat(productElement.dataset.price),
                    image: productElement.querySelector('img').src
                };
                this.addToCart(product);
            });
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

    // Renderiza a página do carrinho se estivermos nela
    renderCartPage() {
        if (window.location.pathname.endsWith('carrinho.html')) {
            this.renderCartItems();
            this.updateCartTotal();
        }
    }
};

// Inicializa a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
