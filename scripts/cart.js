const CART_STORAGE_KEY = "swoo-cart";

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  updateCartCount();
  updateCartHeaderTotal();
}

function addToCart(productId) {
  const cart = getCart();
  cart[productId] = (cart[productId] || 0) + 1;
  saveCart(cart);
}

function changeCartQuantity(productId, change) {
  const cart = getCart();
  const nextQuantity = (cart[productId] || 0) + change;

  if (nextQuantity > 0) {
    cart[productId] = nextQuantity;
  } else {
    delete cart[productId];
  }

  saveCart(cart);
  window.dispatchEvent(new CustomEvent("cart-updated"));
}

function removeFromCart(productId) {
  const cart = getCart();
  delete cart[productId];
  saveCart(cart);
  window.dispatchEvent(new CustomEvent("cart-updated"));
}

function getCartCount() {
  return Object.values(getCart()).reduce(
    (total, quantity) => total + quantity,
    0,
  );
}

function updateCartCount() {
  document.querySelectorAll(".cart-count").forEach((counter) => {
    counter.textContent = getCartCount();
  });
}

async function updateCartHeaderTotal() {
  const totalElements = document.querySelectorAll(".cart-info strong");
  if (!totalElements.length) return;

  try {
    const productPath = window.location.pathname.includes("/pages/")
      ? "../api/bestSellerProducts.json"
      : "./api/bestSellerProducts.json";
    const response = await fetch(productPath);
    const products = await response.json();
    const total = products.reduce(
      (sum, product) => sum + product.price * (getCart()[product.id] || 0),
      0,
    );

    totalElements.forEach((element) => {
      element.textContent = `$${total.toLocaleString()}.00`;
    });
  } catch (error) {
    console.error("Unable to update cart total", error);
  }
}

updateCartCount();
updateCartHeaderTotal();
window.addEventListener("storage", updateCartCount);
