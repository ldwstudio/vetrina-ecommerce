
document.addEventListener('DOMContentLoaded', () => {
  // Cookie banner
  const cookieBanner = document.querySelector('.cookie-banner');
  const cookieAccept = document.querySelector('.cookie-accept');
  const cookieReject = document.querySelector('.cookie-reject');
  
  // Always show cookie banner initially if preference not set
  setTimeout(() => {
    if (localStorage.getItem('cookiesAccepted') === null) {
      cookieBanner.classList.add('visible');
    }
  }, 1000);
  
  cookieAccept.addEventListener('click', () => {
    localStorage.setItem('cookiesAccepted', 'true');
    cookieBanner.classList.remove('visible');
  });

  cookieReject.addEventListener('click', () => {
    localStorage.setItem('cookiesAccepted', 'false');
    cookieBanner.classList.remove('visible');
  });
  // Carousel functionality
  const slides = document.querySelectorAll('.carousel-slide');
  let currentSlide = 0;

  function nextSlide() {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
  }

  // Show first slide
  slides[0].classList.add('active');
  // Change slide every 5 seconds
  setInterval(nextSlide, 5000);

  const contactBadge = document.querySelector('.contact-badge');
  const cartClose = document.querySelector('.cart-close');
  
  // Show contact badge on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      contactBadge.classList.add('visible');
    } else {
      contactBadge.classList.remove('visible');
    }
  });

  // Cart close button
  cartClose.addEventListener('click', () => {
    cartPopup.classList.remove('active');
  });
  const cartIcon = document.querySelector('.cart-icon');
  const cartPopup = document.querySelector('.cart-popup');
  const addToCartButtons = document.querySelectorAll('.add-to-cart');
  const cartItems = document.querySelector('.cart-items');
  const cartCount = document.querySelector('.cart-count');
  const cartTotal = document.querySelector('.cart-total');
  let cart = [];

  // Smooth scroll for navigation
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });

  // Cart toggle
  cartIcon.addEventListener('click', () => {
    cartPopup.classList.toggle('active');
  });

  // Close cart when clicking outside
  const checkoutButton = document.querySelector('.checkout-button');
  const checkoutPopup = document.querySelector('.checkout-popup');
  const checkoutClose = document.querySelector('.checkout-close');
  const checkoutForm = document.querySelector('.checkout-form');

  document.addEventListener('click', (e) => {
    if (!cartPopup.contains(e.target) && !cartIcon.contains(e.target)) {
      cartPopup.classList.remove('active');
    }
    if (!checkoutPopup.contains(e.target) && !checkoutButton.contains(e.target)) {
      checkoutPopup.classList.remove('active');
    }
  });

  checkoutButton.addEventListener('click', () => {
    cartPopup.classList.remove('active');
    checkoutPopup.classList.add('active');
  });

  checkoutClose.addEventListener('click', () => {
    checkoutPopup.classList.remove('active');
  });

  function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
  }

  checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const privacyChecked = document.getElementById('privacy-check').checked;
    if (!privacyChecked) {
      alert('Per favore accetta la Privacy Policy per continuare');
      return;
    }
    alert('Ordine inviato con successo!');
    checkoutPopup.classList.remove('active');
    cart = [];
    updateCart();
  });

  // Add to cart functionality
  addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
      const card = button.closest('.product-card');
      const product = {
        name: card.querySelector('h3').textContent,
        price: parseFloat(card.querySelector('p').textContent.replace('€', '')),
        id: Date.now()
      };

      cart.push(product);
      updateCart();
      
      // Animation feedback
      button.textContent = 'Aggiunto!';
      button.style.background = '#059669';
      setTimeout(() => {
        button.textContent = 'Aggiungi al Carrello';
        button.style.background = '#2563eb';
      }, 1000);
    });
  });

  function updateCart() {
    cartCount.textContent = cart.length;
    cartItems.innerHTML = cart.map(item => `
      <div class="cart-item">
        <p>${item.name}</p>
        <p>€${item.price.toFixed(2)}</p>
        <button class="remove-item" data-id="${item.id}">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `).join('');
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-item').forEach(button => {
      button.addEventListener('click', () => {
        const id = parseInt(button.dataset.id);
        cart = cart.filter(item => item.id !== id);
        updateCart();
      });
    });
    
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    cartTotal.textContent = `Totale: €${total.toFixed(2)}`;

    // Enable/disable checkout button based on cart items
    checkoutButton.disabled = cart.length === 0;
    checkoutButton.classList.toggle('disabled', cart.length === 0);

    // Enable/disable checkout button based on cart items
    checkoutButton.disabled = cart.length === 0;
    checkoutButton.classList.toggle('disabled', cart.length === 0);
  }

  // Intersection Observer for fade-in animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  });

  document.querySelectorAll('.product-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(card);
  });

  // Showcase slider animation
  const showcaseTrack = document.querySelector('.showcase-track');
  const showcaseItems = document.querySelectorAll('.showcase-track .showcase-item');
  let currentShowcaseIndex = 0;

  function slideShowcase() {
    currentShowcaseIndex = (currentShowcaseIndex + 1) % showcaseItems.length;
    showcaseTrack.style.transform = `translateX(-${currentShowcaseIndex * (100 / showcaseItems.length)}%)`;
  }

  // Clone first item and append it to the end for smooth infinite loop
  const firstClone = showcaseItems[0].cloneNode(true);
  showcaseTrack.appendChild(firstClone);

  // Animate showcase every 4 seconds
  setInterval(slideShowcase, 4000);
});
