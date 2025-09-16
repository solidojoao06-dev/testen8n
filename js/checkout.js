document.addEventListener('DOMContentLoaded', () => {
    const checkoutForm = document.getElementById('checkout-form');

    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            if (cart.length === 0) {
                alert('Não é possível finalizar a compra com o carrinho vazio.');
                window.location.href = 'index.html';
                return;
            }

            // Coletar dados do formulário
            const customerInfo = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                address: document.getElementById('address').value,
                city: document.getElementById('city').value,
                postalCode: document.getElementById('postal-code').value,
            };

            const paymentInfo = {
                cardNumber: document.getElementById('card-number').value,
                cardName: document.getElementById('card-name').value,
                expiryDate: document.getElementById('expiry-date').value,
                cvc: document.getElementById('cvc').value,
            };

            // Montar o objeto do pedido
            const orderData = {
                cart: cart,
                customer: customerInfo,
                payment: paymentInfo, // No backend, isso seria processado para gerar um ID de transação
            };

            // Simular o envio para o backend
            console.log("--- ENVIANDO PEDIDO COMPLETO PARA A API ---");
            console.log(JSON.stringify(orderData, null, 2));

            // Enviar para o backend com fetch()
            fetch('http://localhost:5000/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData),
            })
            .then(response => {
                if (!response.ok) {
                    // Se a resposta não for OK, tenta extrair a mensagem de erro do corpo
                    return response.json().then(err => { throw new Error(err.msg || 'Erro no servidor') });
                }
                return response.json();
            })
            .then(data => {
                // Limpar o carrinho e redirecionar
                localStorage.removeItem('cart');
                alert('Compra realizada com sucesso!');
                window.location.href = 'obrigado.html';
            })
            .catch(err => {
                console.error("Erro ao finalizar a compra:", err);
                alert(`Ocorreu um erro ao finalizar a compra: ${err.message}`);
            });
        });
    }
});
