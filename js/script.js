document.addEventListener('DOMContentLoaded', () => {
    const cartCountElement = document.getElementById('cart-count');
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
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

    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productElement = button.closest('.product-item, .product-detail-container');
            const product = {
                id: productElement.dataset.id,
                name: productElement.dataset.name,
                price: parseFloat(productElement.dataset.price),
                image: productElement.querySelector('img').src
            };
            addToCart(product);
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

            // Simula o envio para o backend.
            // No futuro, aqui faremos uma chamada fetch() para a nossa API.
            console.log("--- NOVO PEDIDO ---");
            console.log("Enviando para o backend os seguintes itens:");
            console.log(JSON.stringify(cart, null, 2));

            // Limpa o carrinho
            cart = [];
            saveCart();

            // Redireciona para uma página de confirmação
            alert('Compra finalizada com sucesso! Redirecionando...');
            window.location.href = 'obrigado.html';
        });
    }

    // Initial Load
    updateCartCount();
    if (window.location.pathname.endsWith('carrinho.html')) {
        renderCartItems();
        updateCartTotal();
    }
});
