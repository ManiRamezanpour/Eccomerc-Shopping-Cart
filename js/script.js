// Import Data
import { ProductsData } from "./Products.js";
// Select the DOM
const cartBtn = document.querySelector(".cart-btn");
const cartModal = document.querySelector(".cart");
const backDrop = document.querySelector(".backdrop");
const closeModal = document.querySelector(".cart-item-confirm");
const ProductsDom = document.querySelector(".products-center");
const cartDom = document.querySelector(".cart-content");
const cartItem = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
let cart = [];
// Get Product class
class Products {
  getProduct() {
    return ProductsData;
  }
}
// UI class
class UI {
  displayTheProducts() {
    let result = "";
    ProductsData.forEach((item) => {
      result += `<div class="product">
    <div class="img-container">
      <img src=${item.imgUrl} class="product-img" />
    </div>
    <div class="product-desc">
      <p class="product-price">${item.price}</p>
      <p class="product-title">${item.title}</p>
      <button class="btn add-to-cart" data-id=${item.id}>
      <i class="fa-solid fa-plus"></i>
    </button> 
    </div>
  </div> `;
      ProductsDom.innerHTML = result;
    });
  }
  getAddToCartBtns() {
    const addToCartButton = document.querySelectorAll(".add-to-cart");
    const buttons = [...addToCartButton];
    buttons.forEach((btn) => {
      const id = btn.dataset.id;
      const isInCart = cart.find((p) => p.id === id);
      if (isInCart) {
        // btn.innerText = "in Cart";
        btn.disabled = true;
      }
      btn.addEventListener("click", (event) => {
        // console.log(event.target.dataset.id);
        // btn.innerText = "in Cart";
        btn.disabled = true;
        // console.log("button is clicked");
        const addedProduct = { ...Storage.getProduct(id), quantity: 1 };
        // console.log(addedProduct);
        cart = [...cart, addedProduct];
        // console.log(cart);
        Storage.saveCart(cart);
        this.setCartValue(cart);
        this.addCartItem(addedProduct);
      });
    });
  }
  setCartValue(cart) {
    // console.log(cart);
    let tempCartItems = 0;
    const totalPrice = cart.reduce((acc, curr) => {
      tempCartItems += curr.quantity;
      // console.log(tempCartItems);
      return acc + curr.quantity * curr.price;
    }, 0);
    // console.log(totalPrice);
    cartTotal.innerText = `total price : ${parseFloat(totalPrice).toFixed(
      2
    )} $`;
    cartItem.innerText = tempCartItems;
  }
  addCartItem(cartItem) {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
    <img class="cart-item-img" src=${cartItem.imgUrl} />
    <div class="cart-item-desc">
      <h4>${cartItem.title}</h4>
      <h5>${cartItem.price}</h5>
    </div>
    <div class="cart-item-conteoller">
      <i class="fas fa-chevron-up"></i>
      <p>${cartItem.quantity}</p>
      <i class="fas fa-chevron-down"></i>
    </div>
    <i class="fa-solid fa-trash-can"></i>`;
    cartDom.appendChild(div);
  }
}
// local Storage Class
class Storage {
  static saveTheProduct(product) {
    localStorage.setItem("Product", JSON.stringify(product));
  }
  static getProduct(id) {
    const _Product = JSON.parse(localStorage.getItem("Product"));
    return _Product.find((p) => p.id === parseInt(id));
  }
  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  static saveTheCartItem(cart) {
    localStorage.setItem("cartItem", JSON.stringify(cart));
  }
}
document.addEventListener("DOMContentLoaded", () => {
  const products = new Products();
  const productsData = products.getProduct();
  const ui = new UI();
  // Get item from local storage and set
  ui.setUpApp();
  ui.displayTheProducts(productsData);
  ui.getAddToCartBtns();
  Storage.saveTheProduct(productsData);
});
function showModalFunction() {
  backDrop.style.display = "block";
  cartModal.style.opacity = "1";
  cartModal.style.top = "20%";
}

function closeModalFunction() {
  backDrop.style.display = "none";
  cartModal.style.opacity = "0";
  cartModal.style.top = "-100%";
}

cartBtn.addEventListener("click", showModalFunction);
closeModal.addEventListener("click", closeModalFunction);
backDrop.addEventListener("click", closeModalFunction);
