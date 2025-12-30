// Wishlist functionality
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

window.addEventListener('DOMContentLoaded', () => {
    displayWishlist();
    updateNavCount();
});

function updateNavCount() {
    const navCount = document.getElementById('wishlist-nav-count');
    if (navCount) {
        navCount.textContent = wishlist.length;
    }
}

function displayWishlist() {
    const wishlistGrid = document.querySelector('.wishlist-grid');
    const emptyWishlist = document.querySelector('.empty-wishlist');
    const wishlistCount = document.querySelector('.wishlist-count');
    const clearAllBtn = document.querySelector('.clear-all-btn');

    wishlistCount.textContent = wishlist.length;

    if (wishlist.length === 0) {
        emptyWishlist.classList.add('active');
        wishlistGrid.style.display = 'none';
        clearAllBtn.style.display = 'none';
    } else {
        emptyWishlist.classList.remove('active');
        wishlistGrid.style.display = 'grid';
        clearAllBtn.style.display = 'block';

        wishlistGrid.innerHTML = '';
        wishlist.forEach((item, index) => {
            const wishlistItem = createWishlistItem(item, index);
            wishlistGrid.appendChild(wishlistItem);
        });
    }
}

function createWishlistItem(item, index) {
    const div = document.createElement('div');
    div.className = 'wishlist-item';
    div.innerHTML = `
        <div class="wishlist-item-image">
            <img src="${item.image}" alt="${item.name}">
            <button class="remove-button" onclick="removeFromWishlist(${index})">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        </div>
        <div class="wishlist-item-details">
            <h3>${item.name}</h3>
            <p class="price">${item.price}</p>
            <div class="wishlist-item-actions">
                <button class="add-to-cart-btn" onclick="addToCart(${index}, this)">Add to Cart</button>
            </div>
        </div>
    `;
    return div;
}

function removeFromWishlist(index) {
    wishlist.splice(index, 1);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    displayWishlist();
    updateNavCount();
}

function addToCart(index, btn) {
    const item = wishlist[index];

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(cartItem => cartItem.id === (item.id || generateProductId(item.name)));

    if (!existingItem) {
        cart.push({
            id: item.id || (typeof generateProductId === 'function' ? generateProductId(item.name) : item.name.toLowerCase().replace(/\\s+/g, '-')),
            name: item.name,
            price: parseFloat(String(item.price).replace(/[^0-9.]/g, "")),
            image: item.image,
            quantity: 1
        });
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    btn.textContent = 'Added!';
    btn.classList.add('added');
    setTimeout(() => {
        btn.textContent = 'Add to Cart';
        btn.classList.remove('added');
    }, 2000);
}

// Clear All butonuna event listener
const clearBtn = document.querySelector('.clear-all-btn');
if (clearBtn) {
    clearBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear your entire wishlist?')) {
            wishlist = [];
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
            displayWishlist();
            updateNavCount();
        }
    });
}
