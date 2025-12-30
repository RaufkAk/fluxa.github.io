document.addEventListener('DOMContentLoaded', () => {   
   
    let navBar = document.querySelector('nav');
    
    function navScroll(result) {
        if (window.scrollY > 0 && !(result)) {
            navBar.style.boxShadow = '0 5px 20px rgba(190, 190, 190, 0.15)';
            navBar.style.backgroundColor = 'white'
        }
        else {
            navBar.style.boxShadow = 'none'
            navBar.style.backgroundColor = 'transparent'
        }
    }

    navScroll(false)
    document.addEventListener('scroll', () => {
        navScroll(false)
    })

    // menu bar
    let menuBar = document.querySelector('#menu-bar');
    let menuPage = document.querySelector('#menu-page');
    let html = document.querySelector('html');

    let menuBarStyle = window.getComputedStyle(menuBar);
    let screenType = '';

    if (menuBarStyle.display === "flex") {
        screenType = "mobile"
    }
    else if (menuBarStyle.display === "none") {
        screenType = "desktop"
    }
    else {
        console.log("Error: Failed to identify screen type", screenType)
    }

    menuBar.addEventListener('click', () => {
        menuPage.classList.toggle('active');
        html.style.overflow = (menuPage.classList.contains('active')) ? "hidden" : "scroll"
        navScroll(menuPage.classList.contains('active'))
    })
     // product card
    let productContainerWidth = document.querySelector('.product-cards-container').offsetWidth;
    let rootStyles = getComputedStyle(html);
    let productCardWidth;
    let productCards;
    let productCardsPerRow;

    if (screenType === "desktop") {
        productCardWidth = parseInt(rootStyles.getPropertyValue('--product-card-width').replace('px', ''));
        productCardsPerRow = Math.floor(productContainerWidth / (productCardWidth + 5));
    }
    else if (screenType === "mobile") {
        productCardsPerRow = (html.offsetWidth > 430) ? 3 : 2
        productCardWidth = Math.floor((productContainerWidth / productCardsPerRow) - 10)
    }
    else {
        console.log("Error: Failed to set productCardsPerRow & productCardWidth")
    }

    let marginSpacing = (productContainerWidth - (productCardsPerRow * productCardWidth)) / (productCardsPerRow - 1);
    let lastElement = productCardsPerRow - 1;
    
    let sectionLastElement = []
    let productSections = document.querySelectorAll('.product-section');
    productSections.forEach((section) => {
        productCards = section.querySelectorAll('.product-card');
        
        for (let i = 0; i < productCardsPerRow; i++) {
            productCards[i].classList.add('active');

            if (i === lastElement) {
                productCards[i].style.marginRight = '0px';
            }
            else {
                productCards[i].style.marginRight = `${marginSpacing}px`;
            }
        }

        sectionLastElement[section.id] = lastElement;
    })

    // localstorage metodları
    function getCart() {
        const cart = localStorage.getItem('cart');
        return cart ? JSON.parse(cart) : [];
    }

    function saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function getWishlist() {
        const wishlist = localStorage.getItem('wishlist');
        return wishlist ? JSON.parse(wishlist) : [];
    }

    function saveWishlist(wishlist) {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }

    function generateProductId(productName) {
        return productName.toLowerCase().replace(/\s+/g, '-');
    }

    function updateCartCount() {
        const cart = getCart();
        const countElements = document.querySelectorAll('.cart-link span');
        countElements.forEach(element => {
            element.textContent = cart.length;
        });
    }

    function updateWishlistCount() {
        const wishlist = getWishlist();
        const countElements = document.querySelectorAll('.wishlist-link span');
        countElements.forEach(element => {
            element.textContent = wishlist.length;
        });
    }

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
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

    // sepete ekleme
    function addToCart(productCard) {
        const productName = productCard.querySelector('.product-text-container h1').textContent;
        const productPrice = productCard.querySelector('.product-text-container p').textContent;
        const productImage = productCard.querySelector('.product-image-container img').src;
        
        const product = {
            id: generateProductId(productName),
            name: productName,
            price: parseFloat(productPrice.replace('$', '')),
            image: productImage,
            quantity: 1
        };

        let cart = getCart();
        const existingProduct = cart.find(item => item.id === product.id);

        if (existingProduct) {
            existingProduct.quantity++;
        } else {
            cart.push(product);
        }

        saveCart(cart);
        updateCartCount();
        showNotification('Ürün sepete eklendi! ');
    }

    function removeFromCart(productId) {
        let cart = getCart();
        cart = cart.filter(item => item.id !== productId);
        saveCart(cart);
        updateCartCount();
        showNotification('Ürün sepetten çıkarıldı');
    }

    // cart butonları
    let cartButtons = document.querySelectorAll('.product-card .blue-button');
    
    cartButtons.forEach((button) => {
        const productCard = button.closest('.product-card');
        const productId = generateProductId(productCard.querySelector('.product-text-container h1').textContent);
        
        
        const cart = getCart();
        if (cart.some(item => item.id === productId)) {
            button.classList.add('active');
            button.textContent = 'Remove';
        }

        button.addEventListener('click', () => {
            button.classList.toggle('active');
            
            if (button.classList.contains('active')) {
                button.textContent = 'Remove';
                addToCart(productCard);
            } else {
                button.textContent = 'Add To Cart';
                removeFromCart(productId);
            }
        });
    });

    // favorilere ekleme
    function addToWishlist(productCard, heartButton) {
        const productName = productCard.querySelector('.product-text-container h1').textContent;
        const productPrice = productCard.querySelector('.product-text-container p').textContent;
        const productImage = productCard.querySelector('.product-image-container img').src;
        
        const product = {
            id: generateProductId(productName),
            name: productName,
            price: productPrice,
            image: productImage
        };

        let wishlist = getWishlist();
        const exists = wishlist.some(item => item.id === product.id);

        if (!exists) {
            wishlist.push(product);
            saveWishlist(wishlist);
            heartButton.classList.add('active');
            updateWishlistCount();
            showNotification('Ürün favorilere eklendi! ');
        } else {
            wishlist = wishlist.filter(item => item.id !== product.id);
            saveWishlist(wishlist);
            heartButton.classList.remove('active');
            updateWishlistCount();
            showNotification('Ürün favorilerden çıkarıldı');
        }
    }

    // wishlist butonları
    let heartButtons = document.querySelectorAll('.heart-button');

    heartButtons.forEach((button) => {
        const productCard = button.closest('.product-card');
        const productId = generateProductId(productCard.querySelector('.product-text-container h1').textContent);
        

        const wishlist = getWishlist();
        if (wishlist.some(item => item.id === productId)) {
            button.classList.add('active');
        }

        button.addEventListener('click', () => {
            addToWishlist(productCard, button);
        });
    });

    // slide show
    let slideshowButtons = document.querySelectorAll('.slideshow-button');
    slideshowButtons.forEach((button) => {
        button.addEventListener('click', () => {
            let slideshowSection = button.parentElement.dataset.slideshow;
            let slideshowContainer = document.querySelector(`#product-section-${slideshowSection}`);
            let productCards = slideshowContainer.querySelectorAll('.product-card');

            let currentSection = `product-section-${slideshowSection}`;
            if (button.classList.contains('prev-button')) {
                if (sectionLastElement[currentSection] <= (productCardsPerRow - 1)) {
                    sectionLastElement[currentSection] = productCards.length - 1
                }
                else {
                    sectionLastElement[currentSection]--
                }
            }
            else if (button.classList.contains('next-button')) {
                if (sectionLastElement[currentSection] === (productCards.length - 1)) {
                    sectionLastElement[currentSection] = productCardsPerRow - 1;
                }
                else {
                    sectionLastElement[currentSection]++
                }
            }
            else {
                console.log("Slideshow: Error occurred");
            }

            for (let i = 0; i < productCards.length; i++) {
                if ((i <= sectionLastElement[currentSection]) && (i >= (sectionLastElement[currentSection] - (productCardsPerRow - 1)))) {
                    productCards[i].classList.add('active');

                    if (i === sectionLastElement[currentSection]) {
                        productCards[i].style.marginRight = '0px'
                    }
                    else {
                        productCards[i].style.marginRight = `${marginSpacing}px`
                    }
                }
                else {
                    productCards[i].classList.remove('active');
                    productCards[i].style.marginRight = '0px'
                }
            }
        })
    })

    // Sayfa yüklendiğinde sayaçları güncelle
    updateCartCount();
    updateWishlistCount();
});


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
    
    .heart-button.active svg {
        fill: #ff4757 !important;
        stroke: #ff4757 !important;
    }
    
    .heart-button {
        transition: transform 0.2s ease;
    }
    
    .heart-button:active {
        transform: scale(0.9);
    }
`;
document.head.appendChild(style);
