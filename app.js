// Declare variables
let cart = [];
let subtotal = 0;
let itemCount = 0;
let vat = 0;
let total = 0;

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
}

// Update cart display
function updateCart() {
  const cartItemsList = document.getElementById("cartItems");
  const subtotalPrice = document.getElementById("subtotalPrice");
  const itemCountDisplay = document.getElementById("itemCount");
  const vatDisplay = document.getElementById("vat");
  const totalPrice = document.getElementById("total");
  cartItemsList.innerHTML = "";

  subtotal = 0;
  itemCount = 0;
  vat = 0;
  total = 0;

  cart.forEach((item) => {
    subtotal += item.price * item.quantity;
    itemCount += item.quantity;
    cartItemsList.innerHTML += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.title}">
                <div class="cart-item-details">
                    <div class="product-name">${item.title}</div>
                    <div class="product-price">Tk ${item.price.toFixed(
                      2
                    )}</div> 
                    
                    <div class="cart-item-actions">
                    <button onclick="changeQuantity(${
                      item.id
                    }, 'decrease')">−</button>
                    <span>${item.quantity}</span>
                    <button onclick="changeQuantity(${
                      item.id
                    }, 'increase')">+</button>
                    <button class="remove-btn" onclick="removeFromCart(${
                      item.id
                    })">Remove</button>
                    </div>
                </div>    
            </div>
        `;
  });

  vat = subtotal * 0.1; // VAT = 10% of subtotal

  // Calculate total price
  total = subtotal + vat;

  // Update the UI with the calculated values
  subtotalPrice.textContent = subtotal.toFixed(2);
  vatDisplay.textContent = vat.toFixed(2);
  totalPrice.textContent = total.toFixed(2);
  itemCountDisplay.textContent = itemCount;
}

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

// Checkout function
function checkout() {
  alert(`Proceeding to checkout with total $${total.toFixed(2)}`);
}
