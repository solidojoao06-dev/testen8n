document.addEventListener('DOMContentLoaded', () => {
    // --- Element Selectors ---
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalElement = document.getElementById('cart-total');
    const clearCartButton = document.getElementById('clear-cart-btn');
    const checkoutButton = document.getElementById('checkout-btn');
    const applyCouponButton = document.getElementById('apply-coupon-btn');

    // --- Cart State ---
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // --- Functions ---
    const updateCartCount = () => {
        const allCartCountSpans = document.querySelectorAll('#cart-count');
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        allCartCountSpans.forEach(span => {
            if (span.parentElement.title === 'Carrinho') {
                span.textContent = `(${totalItems})`;
            } else {
                span.textContent = totalItems;
            }
        });
    };

    const saveCart = () => {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        renderCartItems(); // Re-render the cart whenever it's saved
    };

    const renderCartItems = () => {
        if (!cartItemsContainer) return;

        cartItemsContainer.innerHTML = '';
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Seu carrinho está vazio.</p>';
            if (cartTotalElement) cartTotalElement.textContent = '0.00';
            return;
        }

        let total = 0;
        cart.forEach((item, index) => {
            const cartItemElement = document.createElement('div');
            cartItemElement.classList.add('cart-item');
            const imageUrl = item.image ? item.image.replace('detalhe-placeholder', 'placeholder') : 'images/produto1-placeholder.png';
            cartItemElement.innerHTML = `
                <div class="cart-item-info">
                    <img src="${imageUrl}" alt="${item.name}" style="width: 50px; height: 50px; margin-right: 10px;">
                    <div>
                        <h4>${item.name}</h4>
                        <p>R$ ${item.price.toFixed(2)}</p>
                    </div>
                </div>
                <div class="cart-item-actions">
                    <button class="quantity-btn" data-index="${index}" data-action="decrease">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" data-index="${index}" data-action="increase">+</button>
                    <button class="remove-btn" data-index="${index}">Remover</button>
                </div>
            `;
            cartItemsContainer.appendChild(cartItemElement);
            total += item.price * item.quantity;
        });

        if (cartTotalElement) {
            cartTotalElement.textContent = total.toFixed(2);
        }
        addCartActionListeners();
    };

    const addCartActionListeners = () => {
        const quantityButtons = document.querySelectorAll('.quantity-btn');
        const removeButtons = document.querySelectorAll('.remove-btn');

        quantityButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                const action = e.target.dataset.action;

                if (action === 'increase') {
                    cart[index].quantity++;
                } else if (action === 'decrease') {
                    cart[index].quantity--;
                    if (cart[index].quantity <= 0) {
                        cart.splice(index, 1);
                    }
                }
                saveCart();
            });
        });

        removeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                cart.splice(index, 1);
                saveCart();
            });
        });
    };

    // --- Event Listeners ---
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productElement = button.closest('.product-item, .product-detail-container');
            const productId = productElement.dataset.id;
            const productName = productElement.dataset.name;
            const productPrice = parseFloat(productElement.dataset.price);
            const productImage = productElement.querySelector('img').src;

            const quantityInput = productElement.querySelector('#quantity');
            const quantity = quantityInput ? parseInt(quantityInput.value) : 1;

            const existingItem = cart.find(item => item.id === productId);

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.push({ id: productId, name: productName, price: productPrice, quantity: quantity, image: productImage });
            }

            saveCart();
            alert(`${productName} (x${quantity}) foi adicionado ao carrinho!`);
        });
    });

    if (clearCartButton) {
        clearCartButton.addEventListener('click', () => {
            cart = [];
            saveCart();
            alert('O carrinho foi esvaziado.');
        });
    }

    if (checkoutButton) {
        checkoutButton.addEventListener('click', () => {
            alert('A funcionalidade de finalizar a compra ainda não foi implementada.');
        });
    }

    if (applyCouponButton) {
        applyCouponButton.addEventListener('click', () => {
            const couponInput = document.getElementById('coupon-code');
            if (couponInput.value.toUpperCase() === 'PROMO10') {
                alert('Cupom de 10% aplicado! (funcionalidade de desconto não implementada)');
            } else {
                alert('Cupom inválido.');
            }
            couponInput.value = '';
        });
    }

    const setupTabs = () => {
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabContents = document.querySelectorAll('.tab-content');

        if (tabButtons.length === 0) return;

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.dataset.tab;
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                tabContents.forEach(content => {
                    content.classList.toggle('active', content.id === tabId);
                });
            });
        });
    };

    // --- Initial Page Load ---
    updateCartCount();
    if (window.location.pathname.endsWith('carrinho.html')) {
        renderCartItems();
    }
    if (window.location.pathname.endsWith('produto.html')) {
        setupTabs();
    }
});
