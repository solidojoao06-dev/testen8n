document.addEventListener('DOMContentLoaded', () => {
    const ordersListContainer = document.getElementById('orders-list');
    const inventoryListContainer = document.getElementById('inventory-list');
    const API_URL = 'http://localhost:5000/api'; // Assuming the backend runs on port 5000

    // --- Funções de Renderização ---

    const renderOrders = (orders) => {
        if (orders.length === 0) {
            ordersListContainer.innerHTML = '<p>Nenhum pedido encontrado.</p>';
            return;
        }

        ordersListContainer.innerHTML = orders.map(order => `
            <div class="order-item" data-id="${order._id}">
                <h4>Pedido #${order._id.slice(-6)} - <span class="status-badge status-${order.status.toLowerCase()}">${order.status}</span></h4>
                <p><strong>Total:</strong> R$ ${order.total.toFixed(2)}</p>
                <p><strong>Itens:</strong></p>
                <ul>
                    ${order.items.map(item => `<li>${item.quantity}x ${item.name}</li>`).join('')}
                </ul>
                <div class="order-actions">
                    <label for="status-select-${order._id}">Mudar Status:</label>
                    <select id="status-select-${order._id}" data-id="${order._id}">
                        <option value="Novo" ${order.status === 'Novo' ? 'selected' : ''}>Novo</option>
                        <option value="Em Separação" ${order.status === 'Em Separação' ? 'selected' : ''}>Em Separação</option>
                        <option value="Embalado" ${order.status === 'Embalado' ? 'selected' : ''}>Embalado</option>
                        <option value="Enviado" ${order.status === 'Enviado' ? 'selected' : ''}>Enviado</option>
                        <option value="Concluído" ${order.status === 'Concluído' ? 'selected' : ''}>Concluído</option>
                        <option value="Cancelado" ${order.status === 'Cancelado' ? 'selected' : ''}>Cancelado</option>
                    </select>
                </div>
            </div>
        `).join('');
    };

    const renderInventory = (products) => {
        if (products.length === 0) {
            inventoryListContainer.innerHTML = '<p>Nenhum produto no inventário.</p>';
            return;
        }
        inventoryListContainer.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Produto</th>
                        <th>Estoque Atual</th>
                    </tr>
                </thead>
                <tbody>
                    ${products.map(product => `
                        <tr>
                            <td>${product.name}</td>
                            <td>${product.quantity}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    };

    // --- Funções da API ---

    const fetchOrders = async () => {
        try {
            const response = await fetch(`${API_URL}/orders`);
            if (!response.ok) throw new Error('Falha ao buscar pedidos.');
            const orders = await response.json();
            renderOrders(orders);
        } catch (error) {
            ordersListContainer.innerHTML = `<p style="color: red;">${error.message}</p>`;
            console.error(error);
        }
    };

    const fetchInventory = async () => {
        try {
            const response = await fetch(`${API_URL}/products`);
            if (!response.ok) throw new Error('Falha ao buscar inventário.');
            const products = await response.json();
            renderInventory(products);
        } catch (error) {
            inventoryListContainer.innerHTML = `<p style="color: red;">${error.message}</p>`;
            console.error(error);
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const response = await fetch(`${API_URL}/orders/${orderId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            if (!response.ok) throw new Error('Falha ao atualizar status do pedido.');

            // Refresh the orders list to show the change
            fetchOrders();
        } catch (error) {
            alert(error.message);
            console.error(error);
        }
    };

    // --- Event Listeners ---

    ordersListContainer.addEventListener('change', (e) => {
        if (e.target.tagName === 'SELECT' && e.target.id.startsWith('status-select-')) {
            const orderId = e.target.dataset.id;
            const newStatus = e.target.value;
            updateOrderStatus(orderId, newStatus);
        }
    });


    // --- Carga Inicial ---
    fetchOrders();
    fetchInventory();
});
