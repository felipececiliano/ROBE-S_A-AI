// TABELA DE PREÇOS DOS COPOS
const sizesData = [
    { id: 's1', name: 'Copo 300ml', price: 10.00, maxAddons: 2 },
    { id: 's2', name: 'Copo 500ml', price: 14.00, maxAddons: 4 },
    { id: 's3', name: 'Copo 700ml', price: 18.00, maxAddons: null },
    { id: 's4', name: 'Copo 1 Litro', price: 24.00, maxAddons: null }
];

// LISTA EXPANDIDA DE ADICIONAIS (26 OPÇÕES)
const addonsData = [
    // Acompanhamentos
    { id: 'a1', name: 'Leite em Pó', price: 2.00, category: 'acompanhamento' },
    { id: 'a2', name: 'Granola', price: 1.50, category: 'acompanhamento' },
    { id: 'a3', name: 'Paçoca', price: 2.00, category: 'acompanhamento' },
    { id: 'a4', name: 'Castanha de Caju', price: 3.00, category: 'acompanhamento' },
    { id: 'a5', name: 'Castanha do Pará', price: 3.50, category: 'acompanhamento' },
    { id: 'a6', name: 'Gotas de Chocolate', price: 2.50, category: 'acompanhamento' },
    { id: 'a7', name: 'Bis Picado', price: 3.00, category: 'acompanhamento' },
    { id: 'a8', name: 'Chocoball', price: 2.00, category: 'acompanhamento' },
    { id: 'a9', name: 'Sucrilhos', price: 1.50, category: 'acompanhamento' },
    { id: 'a10', name: 'Farinha Láctea', price: 2.00, category: 'acompanhamento' },
    { id: 'a11', name: 'Ovetto / Ovalmaltine', price: 3.00, category: 'acompanhamento' },
    { id: 'a12', name: 'Amendoim Torrado', price: 2.00, category: 'acompanhamento' },
    
    // Frutas
    { id: 'f1', name: 'Banana', price: 2.00, category: 'fruta' },
    { id: 'f2', name: 'Morango', price: 3.00, category: 'fruta' },
    { id: 'f3', name: 'Kiwi em Rodelas', price: 3.50, category: 'fruta' },
    { id: 'f4', name: 'Manga em Cubos', price: 2.50, category: 'fruta' },
    { id: 'f5', name: 'Abacaxi Picado', price: 2.50, category: 'fruta' },
    { id: 'f6', name: 'Uva Sem Semente', price: 3.50, category: 'fruta' },

    // Caldas e Cremes
    { id: 'c1', name: 'Leite Condensado', price: 1.50, category: 'calda' },
    { id: 'c2', name: 'Calda de Chocolate', price: 1.50, category: 'calda' },
    { id: 'c3', name: 'Nutella / Avelã', price: 3.50, category: 'calda' },
    { id: 'c4', name: 'Creme de Ninho', price: 3.50, category: 'calda' },
    { id: 'c5', name: 'Doce de Leite', price: 2.50, category: 'calda' },
    { id: 'c6', name: 'Mel Puro', price: 2.00, category: 'calda' },
    { id: 'c7', name: 'Calda de Morango', price: 1.50, category: 'calda' },
    { id: 'c8', name: 'Creme de Cupuaçu', price: 3.50, category: 'calda' }
];

let currentCustomer = {
    name: '',
    phone: '',
    neighborhood: '',
    street: '',
    number: '',
    deliveryFee: 10.00
};

let currentOrder = {
    size: null,
    addons: []
};

// ELEMENTOS DOM
const welcomeScreen = document.getElementById('welcome-screen');
const mainApp = document.getElementById('main-app');
const customerForm = document.getElementById('customer-form');
const backHomeBtn = document.getElementById('back-home-btn');

const sizesGrid = document.getElementById('sizes-grid');
const addonsGrid = document.getElementById('addons-grid');
const tabButtons = document.querySelectorAll('.tab-btn');

const previewName = document.getElementById('preview-name');
const previewPhone = document.getElementById('preview-phone');
const previewNeighborhood = document.getElementById('preview-neighborhood');
const previewAddress = document.getElementById('preview-address');

const selectedSizeDisplay = document.getElementById('selected-size-display');
const selectedAddonsList = document.getElementById('selected-addons-list');
const deliveryFeeDisplay = document.getElementById('delivery-fee-display');
const itemCountBadge = document.getElementById('item-count-badge');
const grandTotalEl = document.getElementById('grand-total');
const finalizeBtn = document.getElementById('finalize-btn');

const modalSuccess = document.getElementById('modal-success');
const newOrderBtn = document.getElementById('new-order-btn');
const displayOrderName = document.getElementById('display-order-name');
const modalOrderSummaryText = document.getElementById('modal-order-summary-text');

document.addEventListener('DOMContentLoaded', () => {
    renderSizes();
    renderAddons('all');
    setupEventListeners();
});

function setupEventListeners() {
    customerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('client-name').value.trim();
        const phone = document.getElementById('client-phone').value.trim();
        const neighborhoodSelect = document.getElementById('client-neighborhood');
        const neighborhood = neighborhoodSelect.value;
        const street = document.getElementById('client-street').value.trim();
        const number = document.getElementById('client-number').value.trim();

        if (!name || !phone || !neighborhood || !street || !number) {
            alert('Por favor, preencha todos os campos do formulário para entrega!');
            return;
        }

        // Taxa de Entrega: Centro = R$ 5,00 | Demais Bairros = R$ 10,00
        const isCentro = neighborhood === 'Centro';
        const deliveryFee = isCentro ? 5.00 : 10.00;

        currentCustomer = { name, phone, neighborhood, street, number, deliveryFee };

        previewName.textContent = currentCustomer.name;
        previewPhone.textContent = currentCustomer.phone;
        previewNeighborhood.textContent = `${currentCustomer.neighborhood} (${isCentro ? 'Taxa Centro' : 'Taxa Padrão'})`;
        previewAddress.textContent = `${currentCustomer.street}, Nº ${currentCustomer.number}`;

        welcomeScreen.classList.add('hidden');
        mainApp.classList.remove('hidden');

        updateSummary();
    });

    backHomeBtn.addEventListener('click', () => {
        mainApp.classList.add('hidden');
        welcomeScreen.classList.remove('hidden');
    });

    finalizeBtn.addEventListener('click', finishOrder);

    newOrderBtn.addEventListener('click', () => {
        modalSuccess.classList.add('hidden');
        clearOrder();
        customerForm.reset();
        mainApp.classList.add('hidden');
        welcomeScreen.classList.remove('hidden');
    });

    tabButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            tabButtons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            renderAddons(e.target.dataset.category);
        });
    });
}

function renderSizes() {
    sizesGrid.innerHTML = sizesData.map(size => `
        <div class="option-card ${currentOrder.size?.id === size.id ? 'selected' : ''}" onclick="selectSize('${size.id}')">
            <span class="check-badge">✓</span>
            <div class="card-title">${size.name}</div>
            <div class="card-price">R$ ${size.price.toFixed(2).replace('.', ',')}</div>
            ${size.maxAddons ? `<div class="card-limit">(Máx. ${size.maxAddons} adic.)</div>` : ''}
        </div>
    `).join('');
}

function renderAddons(category) {
    const filtered = category === 'all' 
        ? addonsData 
        : addonsData.filter(item => item.category === category);

    addonsGrid.innerHTML = filtered.map(addon => {
        const isSelected = currentOrder.addons.some(item => item.id === addon.id);
        return `
            <div class="option-card ${isSelected ? 'selected' : ''}" onclick="toggleAddon('${addon.id}')">
                <span class="check-badge">✓</span>
                <div class="card-title">${addon.name}</div>
                <div class="card-price">+ R$ ${addon.price.toFixed(2).replace('.', ',')}</div>
            </div>
        `;
    }).join('');
}

function selectSize(sizeId) {
    const newSize = sizesData.find(s => s.id === sizeId);
    
    if (newSize.maxAddons && currentOrder.addons.length > newSize.maxAddons) {
        currentOrder.addons = currentOrder.addons.slice(0, newSize.maxAddons);
        alert(`O ${newSize.name} permite no máximo ${newSize.maxAddons} adicionais.`);
    }

    currentOrder.size = newSize;
    renderSizes();
    renderAddons(document.querySelector('.tab-btn.active')?.dataset.category || 'all');
    updateSummary();
}

function toggleAddon(addonId) {
    if (!currentOrder.size) {
        alert('Escolha o tamanho do copo antes de selecionar os adicionais!');
        return;
    }

    const addon = addonsData.find(a => a.id === addonId);
    const index = currentOrder.addons.findIndex(a => a.id === addonId);

    if (index > -1) {
        currentOrder.addons.splice(index, 1);
    } else {
        const maxAllowed = currentOrder.size.maxAddons;
        if (maxAllowed !== null && currentOrder.addons.length >= maxAllowed) {
            alert(`Para o ${currentOrder.size.name}, o limite máximo é de ${maxAllowed} adicionais.`);
            return;
        }
        currentOrder.addons.push(addon);
    }

    const activeCategory = document.querySelector('.tab-btn.active').dataset.category;
    renderAddons(activeCategory);
    updateSummary();
}

function updateSummary() {
    if (currentOrder.size) {
        selectedSizeDisplay.className = 'summary-item-row';
        selectedSizeDisplay.innerHTML = `
            <span>${currentOrder.size.name}</span>
            <span class="price" style="color:var(--yellow-light); font-weight:700;">R$ ${currentOrder.size.price.toFixed(2).replace('.', ',')}</span>
        `;
    } else {
        selectedSizeDisplay.className = 'summary-item-row placeholder';
        selectedSizeDisplay.innerHTML = `
            <span>Nenhum copo selecionado</span>
            <span class="price">R$ 0,00</span>
        `;
    }

    if (currentOrder.addons.length > 0) {
        selectedAddonsList.innerHTML = currentOrder.addons.map(addon => `
            <li>
                <span>+ ${addon.name}</span>
                <span class="price" style="color:var(--yellow-light);">+ R$ ${addon.price.toFixed(2).replace('.', ',')}</span>
            </li>
        `).join('');
    } else {
        selectedAddonsList.innerHTML = `<li class="empty-addons">Nenhum adicional escolhido</li>`;
    }

    deliveryFeeDisplay.textContent = `R$ ${currentCustomer.deliveryFee.toFixed(2).replace('.', ',')}`;

    const totalItemsCount = (currentOrder.size ? 1 : 0) + currentOrder.addons.length;
    itemCountBadge.textContent = `${totalItemsCount} ${totalItemsCount === 1 ? 'item' : 'itens'}`;

    const sizePrice = currentOrder.size ? currentOrder.size.price : 0;
    const addonsPrice = currentOrder.addons.reduce((sum, item) => sum + item.price, 0);
    const grandTotal = sizePrice + addonsPrice + currentCustomer.deliveryFee;

    grandTotalEl.textContent = `R$ ${grandTotal.toFixed(2).replace('.', ',')}`;
    finalizeBtn.disabled = !currentOrder.size;
}

function finishOrder() {
    displayOrderName.textContent = currentCustomer.name.toUpperCase();

    let summaryText = `<strong>Tel:</strong> ${currentCustomer.phone}<br>`;
    summaryText += `<strong>Endereço:</strong> ${currentCustomer.street}, Nº ${currentCustomer.number}<br>`;
    summaryText += `<strong>Bairro:</strong> ${currentCustomer.neighborhood}<br>`;
    summaryText += `<strong>Copo:</strong> ${currentOrder.size.name}<br>`;
    if (currentOrder.addons.length > 0) {
        summaryText += `<strong>Adicionais:</strong> ${currentOrder.addons.map(a => a.name).join(', ')}<br>`;
    }
    summaryText += `<strong>Taxa Entrega:</strong> R$ ${currentCustomer.deliveryFee.toFixed(2).replace('.', ',')}<br>`;
    summaryText += `<strong>TOTAL A COBRAR:</strong> ${grandTotalEl.textContent}`;

    modalOrderSummaryText.innerHTML = summaryText;
    modalSuccess.classList.remove('hidden');
}

function clearOrder() {
    currentOrder = { size: null, addons: [] };
    renderSizes();
    renderAddons('all');
    updateSummary();
}