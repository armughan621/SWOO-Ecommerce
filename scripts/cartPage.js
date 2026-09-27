async function loadCartPage() {
  const productsContainer = document.querySelector("#cart-products");

  try {
    const response = await fetch("../api/bestSellerProducts.json");
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const products = await response.json();
    renderCart(products);
    window.addEventListener("cart-updated", () => renderCart(products));
  } catch (error) {
    productsContainer.innerHTML = `<p class="empty-cart">Unable to load cart products.</p>`;
    console.error(error);
  }
}

function renderCart(products) {
  const cart = getCart();
  const cartProducts = products.filter((product) => cart[product.id] > 0);
  const productsContainer = document.querySelector("#cart-products");

  if (!cartProducts.length) {
    productsContainer.innerHTML = `<p class="empty-cart">Your cart is empty.</p>`;
    updateSummary(0, 0);
    return;
  }

  productsContainer.innerHTML = cartProducts
    .map((product) => {
      const quantity = cart[product.id];
      const image = product.image.replace("./images/", "../images/");
      const shipping =
        product.shipping === "FREE SHIPPING"
          ? 0
          : Number(product.shipping.match(/[\d.]+/)?.[0] || 0);

      return `
        <article class="cart-item">
          <div class="product-image-box">
            ${product.discount ? `<span class="save-badge"><small>SAVE</small>$${product.discount}.00</span>` : ""}
            <img src="${image}" alt="${product.name}" />
          </div>
          <div class="product-details">
            <small class="reviews">(${product.ratingCount})</small>
            <h2>${product.name}</h2>
            <p class="product-price">$${product.price.toLocaleString()}.00</p>
            <div class="quantity" data-product-id="${product.id}">
              <button type="button" data-change="-1" aria-label="Decrease quantity">-</button>
              <span>${quantity}</span>
              <button type="button" data-change="1" aria-label="Increase quantity">+</button>
            </div>
            <button class="remove-cart" type="button" data-product-id="${product.id}">REMOVE</button>
            <div class="product-tags">
              ${product.shipping === "FREE SHIPPING" ? `<span class="shipping">FREE SHIPPING</span>` : `<span class="shipping paid">${product.shipping}</span>`}
              ${product.gift ? `<span class="gift">${product.gift}</span>` : ""}
            </div>
            <p class="stock"><span>●</span>${product.stock ? "In stock" : "Out of stock"}</p>
          </div>
        </article>
      `;
    })
    .join("");

  productsContainer.querySelectorAll(".quantity button").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = Number(button.parentElement.dataset.productId);
      changeCartQuantity(productId, Number(button.dataset.change));
    });
  });

  productsContainer.querySelectorAll(".remove-cart").forEach((button) => {
    button.addEventListener("click", () =>
      removeFromCart(Number(button.dataset.productId)),
    );
  });

  const subtotal = cartProducts.reduce(
    (total, product) => total + product.price * cart[product.id],
    0,
  );
  const shipping = cartProducts.reduce((total, product) => {
    const cost =
      product.shipping === "FREE SHIPPING"
        ? 0
        : Number(product.shipping.match(/[\d.]+/)?.[0] || 0);
    return total + cost * cart[product.id];
  }, 0);

  updateSummary(subtotal, shipping);
}

function updateSummary(subtotal, shipping) {
  const tax = subtotal * 0.05;
  document.querySelector("#subtotal").textContent = `$${subtotal.toFixed(2)}`;
  document.querySelector("#shipping-estimate").textContent =
    `$${shipping.toFixed(2)}`;
  document.querySelector("#tax-estimate").textContent = `$${tax.toFixed(2)}`;
  document.querySelector("#order-total").textContent =
    `$${(subtotal + shipping + tax).toFixed(2)}`;
}

loadCartPage();
