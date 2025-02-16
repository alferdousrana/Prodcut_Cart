// Declare variables
let cart = [];
let subtotal = 0;
let itemCount = 0;
let vat = 0;
let total = 0;
let discount = 0;

const validPromoCodes = {
  ostad10: 0.1,
  ostad5: 0.05,
};

let url = "https://fakestoreapi.com/products"; //data.forEach()

let url2 = "https://fakestoreapi.in/api/products"; //data.products.forEach()
fetch(url2)
  .then((response) => response.json())
  .then((data) => {
    const productGrid = document.getElementById("productGrid");
    data.products.forEach((product) => {
      let title = product.title;
      //remove '/" from title to make clean title.
      let escapedTitle;
      if (title.match(/'/g)) {
        escapedTitle = title.replace(/'/g, "");
      } else if (title.match(/"/g)) {
        escapedTitle = title.replace(/"/g, "");
      }else{
      escapedTitle = title;
      }
      const productCard = `
                <div class="col-lg-3 col-md-6 mb-3">
                    <div class="card product-card" style="width: 18rem;">
                        <img src="${
                          product.image
                        }" class="card-img-top" alt="${escapedTitle}">
                        <div class="card-body">
                            <h5 class="card-title">${escapedTitle}</h5>
                            <p class="card-text">${product.description.slice(0, 50)}...</p>
                            <p><strong>$${product.price}</strong></p>
                            <button class="btn btn-primary" onclick="addToCart(
                            ${product.id}, 
                            '${escapedTitle}', 
                            ${product.price}, 
                            '${product.image}'
                            )">Add to Cart</button>
                        </div>
                    </div>
                </div>
            `;
      productGrid.innerHTML += productCard;
    });
  });

// Add item to cart
function addToCart(productId, productTitle, productPrice, productImage) {
  console.log("Adding to cart: ", productId, productTitle); // Log the ID being added to cart

  const existingProductIndex = cart.findIndex((item) => item.id === productId);
  if (existingProductIndex === -1) {
    cart.push({
      id: productId,
      title: productTitle,
      price: productPrice,
      image: productImage,
      quantity: 1,
    });
  } else {
    cart[existingProductIndex].quantity += 1;
  }

  updateCart();
  updateCartBadge(); // Update the cart badge after adding the item
  showToast();
}

function applyPromoCode() {
  const promoInput = document.getElementById("promoCodeInput").value.trim();
  const promoMessage = document.getElementById("promoMessage");

  if (validPromoCodes.hasOwnProperty(promoInput)) {
    discount = subtotal * validPromoCodes[promoInput];
    promoMessage.textContent = "Promo applied successfully!";
    promoMessage.style.color = "green";
  } else {
    discount = 0;
    promoMessage.textContent = "Your promo code is incorrect.";
    promoMessage.style.color = "red";
  }

  updateCart();
}

// Update cart display
function updateCart() {
  const cartItemsList = document.getElementById("cartItems");
  const subtotalPrice = document.getElementById("subtotalPrice");
  const itemCountDisplay = document.getElementById("itemCount");
  const vatDisplay = document.getElementById("vat");
  const totalPrice = document.getElementById("total");
  const discountDisplay = document.getElementById("discount");
  
  cartItemsList.innerHTML = "";
  subtotal = 0;
  itemCount = 0;

  cart.forEach((item) => {
    subtotal += item.price * item.quantity;
    itemCount += item.quantity;
    cartItemsList.innerHTML += `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.title}">
        <div class="cart-item-details">
          <div class="product-name">${item.title}</div>
          <div class="product-price">$${item.price.toFixed(2)}</div> 
          <div class="cart-item-actions">
            <button onclick="changeQuantity(${item.id}, 'decrease')">−</button>
            <span>${item.quantity}</span>
            <button onclick="changeQuantity(${item.id}, 'increase')">+</button>
            <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
          </div>
        </div>    
      </div>
    `;
  });

  vat = subtotal * 0.1;
  total = subtotal + vat - discount;

  subtotalPrice.textContent = subtotal.toFixed(2);
  vatDisplay.textContent = vat.toFixed(2);
  discountDisplay.textContent = discount.toFixed(2);
  totalPrice.textContent = total.toFixed(2);
  itemCountDisplay.textContent = itemCount;
}

// HTML changes for promo input
const promoSection = `
  <div class="row mt-2">
    <div class="col-6">
      <input type="text" id="promoCodeInput" class="form-control" placeholder="Enter promo code">
    </div>
    <div class="col-6">
      <button class="btn btn-success" onclick="applyPromoCode()">Apply</button>
    </div>
    <div class="col-12">
      <p id="promoMessage" style="margin-top: 5px;"></p>
    </div>
  </div>
  <div class="row">
    <div class="col-6">
      <div>Discount: $ <span id="discount">0</span></div>
    </div>
  </div>
  <!-- Checkout Button Below Promo Section -->
  <div class="row mt-4">
    <div class="col-12">
      <button class="btn btn-primary w-100" id="checkoutButton" onclick="checkout()">Checkout</button>
    </div>
  </div>
`;

document.addEventListener("DOMContentLoaded", function () {
  document.querySelector("#cartSidebar .cart-content").insertAdjacentHTML("beforeend", promoSection);
});


// Update the cart badge with the subtotal items count
function updateCartBadge() {
  const cartBadge = document.getElementById("cartBadge");
  const subtotalItems = cart.reduce(
    (subtotal, item) => subtotal + item.quantity,
    0
  );
  cartBadge.textContent = subtotalItems;
}

// Change the quantity of a cart item
function changeQuantity(productId, action) {
  const productIndex = cart.findIndex((item) => item.id === productId);
  if (productIndex !== -1) {
    if (action === "increase") {
      cart[productIndex].quantity += 1;
    } else if (action === "decrease" && cart[productIndex].quantity > 1) {
      cart[productIndex].quantity -= 1;
    }

    updateCart();
    updateCartBadge();
    
  }
}

// Remove item from cart
function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  updateCart();
  updateCartBadge();
}

// Toggle cart sidebar
function toggleCart() {
  const cartSidebar = document.getElementById("cartSidebar");
  if (cartSidebar.style.width === "0px" || cartSidebar.style.width === "") {
    cartSidebar.style.width = "400px";
  } else {
    cartSidebar.style.width = "0";
  }
}

// Close the cart sidebar when the cross button is clicked
function closeCart() {
  const cartSidebar = document.getElementById("cartSidebar");
  cartSidebar.style.width = "0";
}

  function checkout() {
    if (cart.length === 0) {
      alert("Your cart is empty. Add items before checking out.");
      return;
    }
    alert(`Proceeding to checkout with total $${total.toFixed(2)}`);
  }

function showToast() {
  var toast = document.getElementById("toast");

  // Ensure the toast is visible by adding the 'show' class
  toast.classList.add("show");

  setTimeout(function () {
    toast.classList.remove("show"); 
  }, 3000);
}
