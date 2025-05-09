// ======= DOM Elements =========
const counterElements = document.querySelectorAll(".counter");
const sellingPriceElement = document.getElementById("selling-price");
const comparePriceElement = document.getElementById("compare-price");
const increaserBtns = document.querySelectorAll(".counter-increaser");
const decreaserBtns = document.querySelectorAll(".counter-decreaser");
const addToCartBtn = document.getElementById("add-to-cart");
const drawer = document.getElementById("drawer");
const cartDrawer = document.querySelector(".cart-drawer");
const drawerButton = document.querySelector(".drawer-header button");
const body = document.querySelector("body");
const cartEstimatePrice = document.querySelector(".estimated-price .price");
// ======= Config =========
const baseSellingPrice = 249.0;
const baseComparePrice = 369.0;
const MIN_COUNT = 1;
const MAX_COUNT = 10;

// ======= State =========
let products = loadProducts();
let currentProductIndex = 0;

// ======= Functions =========

// Load product array from localStorage
function loadProducts() {
  const saved = localStorage.getItem("products");
  if (saved) {
    return JSON.parse(saved);
  }
  return [
    {
      id: 1,
      sellingPrice: baseSellingPrice,
      comparePrice: baseComparePrice,
      count: 1,
    },
  ];
}

// Save product array to localStorage
function saveProducts() {
  localStorage.setItem("products", JSON.stringify(products));
}

// Update displayed counter
function updateCounterDisplay() {
  const product = products[currentProductIndex];
  counterElements.forEach((el) => (el.textContent = product.count));
}

// Update price displays
function updateSellingPriceDisplay() {
  const product = products[currentProductIndex];
  sellingPriceElement.textContent = `$${(
    product.sellingPrice * product.count
  ).toFixed(2)}`;
}
function updateComparePriceDisplay() {
  const product = products[currentProductIndex];
  comparePriceElement.textContent = `$${(
    product.comparePrice * product.count
  ).toFixed(2)}`;
}
function updateUI() {
  updateCounterDisplay();
  updateSellingPriceDisplay();
  updateComparePriceDisplay();
}

// Increase product count
function increaseCount() {
  const product = products[currentProductIndex];
  if (product.count < MAX_COUNT) {
    product.count++;
    saveProducts();
    updateUI();
  }
}

// Decrease product count
function decreaseCount() {
  const product = products[currentProductIndex];
  if (product.count > MIN_COUNT) {
    product.count--;
    saveProducts();
    updateUI();
  }
}

// Toggle drawer
function activeToggler() {
  body.classList.toggle("active");
  drawer.classList.toggle("active");
  cartDrawer.classList.toggle("active");
}

// Add product to cart
function addToCart() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const product = products[currentProductIndex];

  const existingIndex = cart.findIndex((item) => item.id === product.id);
  if (existingIndex >= 0) {

    cart[existingIndex].count += product.count;
    if(cart[existingIndex].count>10){
      cart[existingIndex].count = product.count;
    }
  } else {
    cart.push({ ...product });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

//Render Estimated Total price in the drawer
function renderTotalPrice(){
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const currentProduct = cart[currentProductIndex]
  if(currentProduct){
    cartEstimatePrice.innerHTML= `$${(currentProduct.sellingPrice * currentProduct.count).toFixed(2)} <p><sup>90</sup> AUD</p>`;
  }else{
    cartEstimatePrice.innerHTML=`$0 <p><sup>90</sup> AUD</p>`
  }
  
}

// Render cart drawer
function renderCart() {
  const cartContainer = cartDrawer.querySelector(".addtocart-container");
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  cartContainer.innerHTML = "";

  cart.forEach((item, index) => {
    const itemElement = document.createElement("div");
    itemElement.className = "cart-item";
    itemElement.innerHTML = `

            <div class="cart">
              <div class="cart-image">
                <img src="./assets/images/cart-image-one-rep.png" alt="" />
              </div>
              <div class="cart-details">
                <p class="cart-title">Helio Pet Device</p>
                <p class="cart-price">${item.sellingPrice}</p>
                <div class="cart-buttons">
                  <div class="cart-counter-buttons">
                    <button class="cart-counter-btn cart-increase" data-index="${index}"> &#43;</button>
                    <p class="cart-counter">${item.count}</p>
                    <button class="cart-counter-btn cart-decrease" data-index="${index}">&#8722;</button>
                  </div>
                  <button class="delete-button delete-item" data-index="${index}">
                    <svg
                      aria-hidden="true"
                      focusable="false"
                      class="icon icon-remove"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>
              <div class="cart-price">$${(item.sellingPrice * item.count).toFixed(2)}</div>
            </div>

    `;
    cartContainer.appendChild(itemElement);
  });

  // Attach event listeners for increase/decrease
  const increaseBtns = cartContainer.querySelectorAll(".cart-increase");
  const decreaseBtns = cartContainer.querySelectorAll(".cart-decrease");
  const deleteBtns = cartContainer.querySelectorAll(".delete-item");

  increaseBtns.forEach((btn) =>
    btn.addEventListener("click", (e) => {
      const index = parseInt(e.target.dataset.index);
      increaseCartItem(index);
    })
  );
  decreaseBtns.forEach((btn) =>
    btn.addEventListener("click", (e) => {
      const index = parseInt(e.target.dataset.index);
      decreaseCartItem(index);
    })
  );
  deleteBtns.forEach((btn) =>
    btn.addEventListener("click", (e) => {
      const index = parseInt(e.target.dataset.index);
      deleteFromCart(index);
    })
  );
  renderTotalPrice();
}

// Increase item in cart
function increaseCartItem(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart[index].count < MAX_COUNT) {
    cart[index].count++;
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  }
}

// Decrease item in cart
function decreaseCartItem(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart[index].count > MIN_COUNT) {
    cart[index].count--;
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  }
}

// Delete from cart
function deleteFromCart(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
  renderTotalPrice();
}

// ======= Event Listeners =========
increaserBtns.forEach((btn) => btn.addEventListener("click", increaseCount));
decreaserBtns.forEach((btn) => btn.addEventListener("click", decreaseCount));
addToCartBtn.addEventListener("click", () => {
  addToCart();
  activeToggler();
});
drawerButton.addEventListener("click", activeToggler);

// ======= Initialize =========
updateUI();
renderCart();
renderTotalPrice();