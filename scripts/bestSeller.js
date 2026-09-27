async function getBestSellers() {
  try {
    const response = await fetch("./api/bestSellerProducts.json");

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const products = await response.json();

    displayProducts(products);
  } catch (error) {
    console.error("Error:", error);
  }
}

function displayProducts(products) {
  const productsGrid = document.querySelector(".products-grid");

  productsGrid.innerHTML = "";

  products.forEach((product) => {
    const productCard = `
            <article class="product-card">

                ${
                  product.discount
                    ? `<span class="discount">$${product.discount}.00</span>`
                    : ""
                }

                <a class="product-link" href="./pages/product-detail.html?id=${product.id}">
                <div class="product-image">
                    <img 
                        src="${product.image}" 
                        alt="${product.name}"
                    >
                </div>

                <small>(${product.ratingCount})</small>

                <h3>${product.name}</h3>
                </a>

                <strong class="product-price ${product.oldPrice ? "sale" : ""}">
                    $${product.price.toLocaleString()}.00

                    ${
                      product.oldPrice
                        ? `<del>$${product.oldPrice.toLocaleString()}.00</del>`
                        : ""
                    }
                </strong>

                <div class="mini-tags">

                    ${
                      product.shipping === "FREE SHIPPING"
                        ? `<span>FREE SHIPPING</span>`
                        : ""
                    }

                    ${product.gift ? `<span>${product.gift}</span>` : ""}

                </div>

                ${
                  product.stock
                    ? `<p class="stock">● In stock</p>`
                    : `<p class="out-stock">● Out of stock</p>`
                }

                ${product.preorder ? `<p class="preorder">PRE - ORDER</p>` : ""}

                ${product.contact ? `<p class="contact">Contact</p>` : ""}

                <button class="add-to-cart" type="button" data-product-id="${product.id}">
                  ADD TO CART
                </button>

            </article>
        `;

    productsGrid.innerHTML += productCard;
  });

  productsGrid.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", () => {
      addToCart(Number(button.dataset.productId));
      button.textContent = "ADDED";
      setTimeout(() => {
        button.textContent = "ADD TO CART";
      }, 700);
    });
  });
}

getBestSellers();
