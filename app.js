const FIXED_USER = {
  username: "demo",
  password: "password123"
};

const products = [
  {
    id: "coffee",
    name: "Coffee Beans",
    description: "Medium roast beans for a smooth daily cup.",
    price: 12.5,
    shortCode: "CB"
  },
  {
    id: "keyboard",
    name: "Compact Keyboard",
    description: "A clean typing setup for desk work.",
    price: 49,
    shortCode: "KB"
  },
  {
    id: "bottle",
    name: "Water Bottle",
    description: "Stainless bottle with a leak-safe lid.",
    price: 18.75,
    shortCode: "WB"
  },
  {
    id: "notebook",
    name: "Notebook",
    description: "Dotted pages for plans, notes, and test cases.",
    price: 8.25,
    shortCode: "NB"
  },
  {
    id: "headphones",
    name: "Headphones",
    description: "Lightweight headphones for focused sessions.",
    price: 39.99,
    shortCode: "HP"
  },
  {
    id: "lamp",
    name: "Desk Lamp",
    description: "Warm adjustable light for late builds.",
    price: 24.5,
    shortCode: "DL"
  },
  {
    id: "backpack",
    name: "Backpack",
    description: "Durable backpack with laptop compartment.",
    price: 59.95,
    shortCode: "BP"
  }
];

const state = {
  cart: {}
};

const loginView = document.querySelector("#login-view");
const shopView = document.querySelector("#shop-view");
const loginForm = document.querySelector("#login-form");
const usernameInput = document.querySelector("#username");
const passwordInput = document.querySelector("#password");
const loginError = document.querySelector("#login-error");
const productList = document.querySelector("#product-list");
const productCount = document.querySelector("#product-count");
const cartItems = document.querySelector("#cart-items");
const cartCount = document.querySelector("#cart-count");
const cartTotal = document.querySelector("#cart-total");
const checkoutButton = document.querySelector("#checkout-button");
const checkoutMessage = document.querySelector("#checkout-message");
const logoutButton = document.querySelector("#logout-button");

function formatPrice(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(value);
}

function isAuthenticated() {
  return localStorage.getItem("simple-shop-auth") === "true";
}

function setAuthenticated(value) {
  if (value) {
    localStorage.setItem("simple-shop-auth", "true");
    return;
  }

  localStorage.removeItem("simple-shop-auth");
}

function updateView() {
  const signedIn = isAuthenticated();
  loginView.classList.toggle("hidden", signedIn);
  shopView.classList.toggle("hidden", !signedIn);

  if (signedIn) {
    renderProducts();
    renderCart();
  }
}

function renderProducts() {
  productCount.textContent = `${products.length} products`;
  productList.innerHTML = products
    .map(
      (product) => `
        <article class="product-card">
          <div class="product-image" aria-hidden="true">${product.shortCode}</div>
          <div>
            <h3>${product.name}</h3>
            <p>${product.description}</p>
          </div>
          <div class="product-meta">
            <span class="price">${formatPrice(product.price)}</span>
            <button type="button" data-add-product="${product.id}">Add</button>
          </div>
        </article>
      `
    )
    .join("");
}

function getCartProducts() {
  return Object.entries(state.cart)
    .map(([productId, quantity]) => {
      const product = products.find((item) => item.id === productId);
      return product ? { ...product, quantity } : null;
    })
    .filter(Boolean);
}

function renderCart() {
  const cartProducts = getCartProducts();
  const totalItems = cartProducts.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartProducts.reduce((sum, item) => sum + item.price * item.quantity, 0);

  cartCount.textContent = `${totalItems} ${totalItems === 1 ? "item" : "items"}`;
  cartTotal.textContent = formatPrice(totalPrice);
  checkoutButton.disabled = totalItems === 0;

  if (cartProducts.length === 0) {
    cartItems.innerHTML = '<div class="cart-empty">Your cart is empty.</div>';
    return;
  }

  cartItems.innerHTML = cartProducts
    .map(
      (item) => `
        <div class="cart-row">
          <div>
            <h3>${item.name}</h3>
            <p>${formatPrice(item.price)} each</p>
          </div>
          <div class="quantity-controls" aria-label="${item.name} quantity controls">
            <button type="button" data-decrease-product="${item.id}" aria-label="Decrease ${item.name}">-</button>
            <span>${item.quantity}</span>
            <button type="button" data-add-product="${item.id}" aria-label="Increase ${item.name}">+</button>
          </div>
        </div>
      `
    )
    .join("");
}

function addToCart(productId) {
  state.cart[productId] = (state.cart[productId] || 0) + 1;
  checkoutMessage.textContent = "";
  renderCart();
}

function decreaseFromCart(productId) {
  if (!state.cart[productId]) {
    return;
  }

  state.cart[productId] -= 1;

  if (state.cart[productId] <= 0) {
    delete state.cart[productId];
  }

  checkoutMessage.textContent = "";
  renderCart();
}

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const username = usernameInput.value.trim();
  const password = passwordInput.value;

  if (username === FIXED_USER.username && password === FIXED_USER.password) {
    loginError.textContent = "";
    setAuthenticated(true);
    loginForm.reset();
    updateView();
    return;
  }

  loginError.textContent = "Invalid username or password.";
});

logoutButton.addEventListener("click", () => {
  setAuthenticated(false);
  state.cart = {};
  checkoutMessage.textContent = "";
  updateView();
});

productList.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add-product]");
  if (addButton) {
    addToCart(addButton.dataset.addProduct);
  }
});

cartItems.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add-product]");
  const decreaseButton = event.target.closest("[data-decrease-product]");

  if (addButton) {
    addToCart(addButton.dataset.addProduct);
  }

  if (decreaseButton) {
    decreaseFromCart(decreaseButton.dataset.decreaseProduct);
  }
});

checkoutButton.addEventListener("click", () => {
  state.cart = {};
  checkoutMessage.textContent = "Order placed successfully.";
  renderCart();
});

updateView();
