document.addEventListener('DOMContentLoaded', () => {
    // Mock data - this will eventually come from the backend API
    const products = {
        '1': {
            id: '1',
            name: 'Tabaco Orgânico',
            price: 25.00,
            description: 'Tabaco suave e orgânico, cultivado sem pesticidas. Perfeito para quem aprecia um fumo de alta qualidade.',
            image: 'images/tabaco-placeholder.png'
        },
        '2': {
            id: '2',
            name: 'Seda Clássica',
            price: 5.00,
            description: 'Pacote com 50 folhas de seda de alta qualidade, queima lenta e uniforme.',
            image: 'images/seda-placeholder.png'
        },
        '3': {
            id: '3',
            name: 'Isqueiro Maçarico',
            price: 35.00,
            description: 'Isqueiro tipo maçarico, recarregável e com chama potente e resistente ao vento.',
            image: 'images/isqueiro-placeholder.png'
        }
    };

    const productDetailContainer = document.getElementById('product-detail');
    if (!productDetailContainer) return;

    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const product = products[productId];

    if (product) {
        // Update the data attributes for the cart functionality
        productDetailContainer.dataset.id = product.id;
        productDetailContainer.dataset.name = product.name;
        productDetailContainer.dataset.price = product.price;

        // Populate the page elements
        document.getElementById('product-image').src = product.image;
        document.getElementById('product-image').alt = product.name;
        document.getElementById('product-name').textContent = product.name;
        document.getElementById('product-price').textContent = `R$ ${product.price.toFixed(2)}`;
        document.getElementById('product-description').textContent = product.description;
        document.title = `${product.name} - Tabacaria Online`;

        // The main 'script.js' will handle the click event for '.add-to-cart-btn'
        // so we don't need to re-implement the logic here.
    } else {
        productDetailContainer.innerHTML = '<p>Produto não encontrado.</p>';
    }
});
