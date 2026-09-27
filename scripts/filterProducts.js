async function loadFilteredProducts() {
  const grid = document.querySelector("#productsGrid");
  const resultCount = document.querySelector("#resultCount");

  try {
    const response = await fetch("../api/bestSellerProducts.json");
    if (!response.ok) throw new Error("Failed to fetch products");

    const products = await response.json();
    let visibleProducts = products;

    const render = () => {
      const min = Number(document.querySelector("#minPrice").value) || 0;
      const max = Number(document.querySelector("#maxPrice").value) || Infinity;
      const selectedRatings = [
        ...document.querySelectorAll(".rating-filter:checked"),
      ].map((input) => Number(input.value));
      const sort = document.querySelector("#sortProducts").value;

      visibleProducts = products.filter((product) => {
        const ratingMatch =
          !selectedRatings.length ||
          selectedRatings.some((rating) => product.ratingCount >= rating);
        return product.price >= min && product.price <= max && ratingMatch;
      });

      if (sort === "low") visibleProducts.sort((a, b) => a.price - b.price);
      if (sort === "high") visibleProducts.sort((a, b) => b.price - a.price);
      if (sort === "rating")
        visibleProducts.sort((a, b) => b.ratingCount - a.ratingCount);

      grid.innerHTML = visibleProducts
        .map(
          (product) => `
        <article class="product-card">
          ${product.discount ? `<span class="sale-badge"><small>SAVE</small>$${product.discount}.00</span>` : ""}
          <a class="product-link" href="product-detail.html?id=${product.id}">
            <div class="product-image-wrapper"><img class="product-image" src="${product.image.replace("./images/", "../images/")}" alt="${product.name}"></div>
            <div class="product-rating">(${product.ratingCount})</div>
            <h3 class="product-name">${product.name}</h3>
          </a>
          <strong class="product-price">$${product.price.toLocaleString()}.00</strong>
          <div class="product-meta"><span class="shipping">${product.shipping}</span>${product.gift ? `<span class="shipping gift">${product.gift}</span>` : ""}</div>
          <p class="stock">${product.stock ? "● In stock" : "● Out of stock"}</p>
          <button class="add-to-cart" type="button" data-product-id="${product.id}">ADD TO CART</button>
        </article>
      `,
        )
        .join("");

      resultCount.textContent = visibleProducts.length;
      grid.querySelectorAll(".add-to-cart").forEach((button) => {
        button.addEventListener("click", () => {
          addToCart(Number(button.dataset.productId));
          button.textContent = "ADDED";
        });
      });
    };

    document
      .querySelectorAll(".rating-filter, #sortProducts")
      .forEach((input) => input.addEventListener("change", render));
    document.querySelector("#priceFilter").addEventListener("click", render);
    document.querySelector("#resetFilters").addEventListener("click", () => {
      document.querySelectorAll("input[type=checkbox]").forEach((input) => {
        input.checked = false;
      });
      document.querySelector("#minPrice").value = "";
      document.querySelector("#maxPrice").value = "";
      document.querySelector("#sortProducts").value = "default";
      render();
    });

    render();
  } catch (error) {
    grid.innerHTML = "<p>Unable to load products.</p>";
    console.error(error);
  }
}

loadFilteredProducts();
