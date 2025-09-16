document.addEventListener('DOMContentLoaded', () => {
    // --- Lógica do Menu Responsivo ---
    const menuToggle = document.getElementById('menu-toggle');
    const navContainer = document.getElementById('nav-container');

    if (menuToggle && navContainer) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navContainer.classList.toggle('active');
        });
    }

    // --- Lógica do Carrinho de Compras ---
    const cartCountElement = document.getElementById('cart-count');
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    const buyNowButtons = document.querySelectorAll('.buy-now-btn');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalElement = document.getElementById('cart-total');
    const clearCartButton = document.getElementById('clear-cart-btn');
    const checkoutButton = document.getElementById('checkout-btn');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const updateCartCount = () => {
        cartCountElement.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    };

    const saveCart = () => {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
    };

    const addToCart = (product) => {
        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        saveCart();
        alert(`${product.name} foi adicionado ao carrinho!`);
    };

    const buyNow = (product) => {
        cart = []; // Limpa o carrinho principal
        cart.push({ ...product, quantity: 1 }); // Adiciona o item atual
        saveCart(); // Salva o carrinho no localStorage e atualiza o contador
        window.location.href = 'checkout.html'; // Redireciona para o checkout
    };

    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productElement = button.closest('.product-item, .product-detail-container');
            const product = {
                id: productElement.dataset.id,
                name: productElement.dataset.name,
                price: parseFloat(productElement.dataset.price),
                image: productElement.dataset.image || productElement.querySelector('img').src // Usa dataset ou fallback
            };
            addToCart(product);
        });
    });

    buyNowButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productElement = button.closest('.product-item, .product-detail-container');
            const product = {
                id: productElement.dataset.id,
                name: productElement.dataset.name,
                price: parseFloat(productElement.dataset.price),
                image: productElement.dataset.image || productElement.querySelector('img').src // Usa dataset ou fallback
            };
            buyNow(product);
        });
    });

    const renderCartItems = () => {
        if (!cartItemsContainer) return;

        cartItemsContainer.innerHTML = '';
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Seu carrinho está vazio.</p>';
            return;
        }

        cart.forEach(item => {
            const cartItemElement = document.createElement('div');
            cartItemElement.classList.add('cart-item');
            cartItemElement.innerHTML = `
                <div class="cart-item-info">
                    <img src="${item.image}" alt="${item.name}">
                    <div>
                        <h4>${item.name}</h4>
                        <p>R$ ${item.price.toFixed(2)}</p>
                    </div>
                </div>
                <div>
                    <p>Qtd: ${item.quantity}</p>
                </div>
            `;
            cartItemsContainer.appendChild(cartItemElement);
        });
    };

    const updateCartTotal = () => {
        if (!cartTotalElement) return;
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotalElement.textContent = total.toFixed(2);
    };

    if (clearCartButton) {
        clearCartButton.addEventListener('click', () => {
            cart = [];
            saveCart();
            renderCartItems();
            updateCartTotal();
            alert('O carrinho foi esvaziado.');
        });
    }

    if (checkoutButton) {
        checkoutButton.addEventListener('click', () => {
            if (cart.length === 0) {
                alert('Seu carrinho está vazio. Adicione produtos antes de finalizar a compra.');
                return;
            }
            // Redireciona para a página de checkout
            window.location.href = 'checkout.html';
        });
    }

    // Initial Load
    updateCartCount();
    if (window.location.pathname.endsWith('carrinho.html')) {
        renderCartItems();
        updateCartTotal();
    }
});
