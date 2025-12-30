// cart.html script extracted
// ============================================
// CART PAGE SCRIPT
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // =====================
    // NAVIGATION SCROLL
    // =====================
    let navBar = document.querySelector('nav');
    document.addEventListener('scroll', () => {
        if (window.scrollY > 0) {
            navBar.style.boxShadow = '0 5px 20px rgba(190, 190, 190, 0.15)';
            navBar.style.backgroundColor = 'white';
        } else {
            navBar.style.boxShadow = 'none';
            navBar.style.backgroundColor = 'transparent';
        }
    });

    // =====================
    // LOCALSTORAGE FUNCTIONS
    // =====================
    function getCart() {
        const cart = localStorage.getItem('cart');
        return cart ? JSON.parse(cart) : [];
    }

    function saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function updateNavCount() {
        const cart = getCart();
        const countElements = document.querySelectorAll('.cart-link span');
        countElements.forEach(element => {
            element.textContent = cart.length;
        });
    }

    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.textContent = message;
        const bgColor = type === 'success' ? '#4CAF50' : '#ef4444';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${bgColor};
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // =====================
    // RENDER CART
    // =====================
    function renderCart() {
        const cartItems = getCart();
        const cartContainer = document.getElementById('cart-items');
        cartContainer.innerHTML = '';

        if (cartItems.length === 0) {
            cartContainer.innerHTML = `
                <div class="empty-cart" style="text-align: center; padding: 60px 20px;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="currentColor" viewBox="0 0 16 16" style="opacity: 0.3; margin-bottom: 20px;">
                        <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                    </svg>
                    <p style="font-size: 20px; color: #666; margin-bottom: 20px;">Sepetiniz boş</p>
                    <a href="products.html" style="display: inline-block; padding: 12px 30px; background: #3b82f6; color: white; text-decoration: none; border-radius: 8px; font-weight: 500;">Alışverişe Başla</a>
                </div>
            `;
            updateTotals();
            hideClearButton();
            return;
        }

        cartItems.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p class="item-price">$${item.price.toFixed(2)}</p>
                </div>
                <div class="item-quantity">
                    <button class="qty-btn minus" data-index="${index}">−</button>
                    <span class="qty-value">${item.quantity}</span>
                    <button class="qty-btn plus" data-index="${index}">+</button>
                </div>
                <div class="item-total">
                    <p>$${(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <button class="remove-btn" data-index="${index}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                    </svg>
                </button>
            `;
            cartContainer.appendChild(cartItem);
        });

        updateTotals();
        attachEventListeners();
        showClearButton();
    }

    // =====================
    // UPDATE TOTALS
    // =====================
    function updateTotals() {
        const cartItems = getCart();
        const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = subtotal > 0 ? (subtotal > 100 ? 0 : 15) : 0;
        const tax = subtotal * 0.08;
        const total = subtotal + shipping + tax;

        document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('shipping').textContent = shipping === 0 && subtotal > 0 ? 'Ücretsiz' : `$${shipping.toFixed(2)}`;
        document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
        document.getElementById('total').textContent = `$${total.toFixed(2)}`;
    }

    // =====================
    // EVENT LISTENERS
    // =====================
    function attachEventListeners() {
        // Artırma butonları
        document.querySelectorAll('.qty-btn.plus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.dataset.index);
                let cart = getCart();
                cart[index].quantity++;
                saveCart(cart);
                renderCart();
                updateNavCount();
            });
        });

        // Azaltma butonları
        document.querySelectorAll('.qty-btn.minus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.dataset.index);
                let cart = getCart();
                if (cart[index].quantity > 1) {
                    cart[index].quantity--;
                    saveCart(cart);
                    renderCart();
                    updateNavCount();
                }
            });
        });

        // Silme butonları
        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.dataset.index);
                let cart = getCart();
                
                const item = cart[index];
                if (confirm(`"${item.name}" ürününü sepetten çıkarmak istediğinize emin misiniz?`)) {
                    cart.splice(index, 1);
                    saveCart(cart);
                    renderCart();
                    updateNavCount();
                    showNotification('Ürün sepetten çıkarıldı', 'error');
                }
            });
        });
    }

    // =====================
    // CLEAR CART BUTTON
    // =====================
    function showClearButton() {
        let clearBtn = document.getElementById('clear-cart-btn');
        if (!clearBtn) {
            clearBtn = document.createElement('button');
            clearBtn.id = 'clear-cart-btn';
            clearBtn.textContent = 'Sepeti Temizle';
            clearBtn.style.cssText = `
                margin-top: 20px;
                padding: 10px 20px;
                background: #ef4444;
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                width: 100%;
                font-size: 14px;
                font-weight: 500;
                transition: background 0.3s;
            `;
            clearBtn.addEventListener('mouseover', () => {
                clearBtn.style.background = '#dc2626';
            });
            clearBtn.addEventListener('mouseout', () => {
                clearBtn.style.background = '#ef4444';
            });
            clearBtn.addEventListener('click', () => {
                if (confirm('Sepetteki tüm ürünleri silmek istediğinize emin misiniz?')) {
                    localStorage.removeItem('cart');
                    renderCart();
                    updateNavCount();
                    showNotification('Sepet temizlendi', 'error');
                }
            });
            
            const cartSummary = document.getElementById('cart-summary');
            cartSummary.appendChild(clearBtn);
        }
    }

    function hideClearButton() {
        const clearBtn = document.getElementById('clear-cart-btn');
        if (clearBtn) {
            clearBtn.remove();
        }
    }

    // =====================
    // CHECKOUT FORM
    // =====================
    const checkoutForm = document.getElementById('checkout-form');
    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const cartItems = getCart();
        if (cartItems.length === 0) {
            alert('Sepetiniz boş!');
            return;
        }

        const formData = new FormData(checkoutForm);
        const orderData = {
            orderNumber: 'ORD-' + Date.now(),
            customer: {
                fullName: formData.get('fullName'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                address: formData.get('address'),
                city: formData.get('city'),
                zipCode: formData.get('zipCode')
            },
            payment: formData.get('payment'),
            items: cartItems,
            totals: {
                subtotal: document.getElementById('subtotal').textContent,
                shipping: document.getElementById('shipping').textContent,
                tax: document.getElementById('tax').textContent,
                total: document.getElementById('total').textContent
            },
            orderDate: new Date().toISOString()
        };

        console.log('✅ Sipariş oluşturuldu:', orderData);
        
        // Siparişi kaydet
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        orders.push(orderData);
        localStorage.setItem('orders', JSON.stringify(orders));

        // Sepeti temizle
        localStorage.removeItem('cart');
        
        // Başarı mesajı
        alert(`✅ Siparişiniz başarıyla oluşturuldu!\n\nSipariş No: ${orderData.orderNumber}\nTeşekkür ederiz, ${orderData.customer.fullName}!`);
        
        // Sayfayı yenile
        window.location.reload();
    });

    // =====================
    // INITIALIZE
    // =====================
    renderCart();
    updateNavCount();
});

// =====================
// CSS ANIMATIONS
// =====================
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
