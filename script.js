document.addEventListener("DOMContentLoaded", () => {
  fetch(
    "https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889"
  )
    .then((response) => response.json())
    .then((data) => {
      const cartList = document.getElementById("cart-list");

      cartList.innerHTML = "";

      data.items.forEach((item) => {
        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");
        cartItem.innerHTML = `
          <img src="${item.image}" alt="${item.title}" />
          <h3>${item.title}</h3>
          <p>Price: ₹${item.price.toFixed(2)}</p>
          <input type="number" value="${
            item.quantity
          }" min="1" class="quantity-input" data-price="${item.price}">
          <p>Subtotal: ₹<span class="item-total">${(
            item.price * item.quantity
          ).toFixed(2)}</span></p>
          <button class="remove-item">Remove</button>
        `;

        cartList.appendChild(cartItem);
      });

      updateTotals();

      document.querySelectorAll(".quantity-input").forEach((input) => {
        input.addEventListener("input", (event) => {
          event.target.value = event.target.value.replace(/[^0-9]/g, "");
          updateTotals();
        });

        input.addEventListener("blur", (event) => {
          if (!event.target.value || event.target.value < 1) {
            event.target.value = 1;
          }
          updateTotals();
        });
      });

      document.querySelectorAll(".remove-item").forEach((button) => {
        button.addEventListener("click", removeItem);
      });
    })
    .catch((error) => console.error("Error fetching cart data:", error));
});

function updateTotals() {
  let subtotal = 0;
  document.querySelectorAll(".cart-item").forEach((item) => {
    const quantity =
      parseInt(item.querySelector(".quantity-input").value, 10) || 1;
    const price = parseFloat(
      item.querySelector(".quantity-input").dataset.price
    );
    const itemTotal = quantity * price;
    item.querySelector(".item-total").textContent = itemTotal.toFixed(2);
    subtotal += itemTotal;
  });

  document.getElementById("subtotal").textContent = `₹${subtotal.toFixed(2)}`;
  document.getElementById("total").textContent = `₹${subtotal.toFixed(2)}`;
}

function removeItem(event) {
  event.target.closest(".cart-item").remove();
  updateTotals();
}
