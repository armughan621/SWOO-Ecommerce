async function loadProductDetail() {
  const productId = Number(
    new URLSearchParams(window.location.search).get("id"),
  );

  try {
    const response = await fetch("../api/bestSellerProducts.json");
    if (!response.ok) throw new Error("Failed to fetch products");

    const products = await response.json();
    const product =
      products.find((item) => item.id === productId) || products[0];
    const image = product.image.replace("./images/", "../images/");

    document.querySelector(".main-product-image img").src = image;
    document.querySelector(".main-product-image img").alt = product.name;
    document.querySelector(".product-info h1").textContent = product.name;
    document.querySelector(".rating-count").textContent =
      `(${product.ratingCount})`;
    document.querySelector(".price-range").textContent =
      `$${product.price.toLocaleString()}.00`;
    document.querySelector(".product-info .shipping-tag").textContent =
      product.shipping;
    document.querySelector(".product-info .gift-tag").textContent =
      product.gift || "";
    document.querySelector(".product-meta").innerHTML =
      `<p><strong>SKU:</strong> SWOO-${product.id}</p><p><strong>CATEGORY:</strong> ${product.category}</p><p><strong>BRAND:</strong> SWOO</p>`;
    document.querySelectorAll(".thumbnail img").forEach((thumbnail) => {
      thumbnail.src = image;
    });

    const quantity = document.querySelector(".purchase-section .quantity span");
    const addButton = document.querySelector(".add-cart");
    let selectedQuantity = 1;
    quantity.textContent = selectedQuantity;

    document
      .querySelector(".purchase-section .quantity button:first-child")
      .addEventListener("click", () => {
        selectedQuantity = Math.max(1, selectedQuantity - 1);
        quantity.textContent = selectedQuantity;
      });
    document
      .querySelector(".purchase-section .quantity button:last-child")
      .addEventListener("click", () => {
        selectedQuantity += 1;
        quantity.textContent = selectedQuantity;
      });
    addButton.addEventListener("click", () => {
      for (let index = 0; index < selectedQuantity; index += 1)
        addToCart(product.id);
      addButton.textContent = "ADDED TO CART";
    });
  } catch (error) {
    console.error(error);
  }
}

loadProductDetail();
