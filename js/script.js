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
const clearCartBtn = document.querySelector(".clear-cart");
let cart = [];

// Get Product class
class Products {
  getProduct() {
    return ProductsData;
  }
}
let buttonsDOM = [];
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
    const addToCartBtns = [...document.querySelectorAll(".add-to-cart")];
    buttonsDOM = addToCartBtns;
    addToCartBtns.forEach((btn) => {
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
      <i class="fas fa-chevron-up" data-id=${cartItem.id}></i>
      <p>${cartItem.quantity}</p>
      <i class="fas fa-chevron-down" data-id=${cartItem.id}></i>
    </div>
    <i class="fa-solid fa-trash-can" data-id=${cartItem.id}></i>`;
    cartDom.appendChild(div);
  }
  setApp() {
    cart = Storage.getCart() || [];
    cart.forEach((cartItem) => this.addCartItem(cartItem));
    this.setCartValue(cart);
  }
  cartLogic() {
    // clear cart button
    clearCartBtn.addEventListener("click", () => this.clearCart());
    cartDom.addEventListener("click", (event) => {
      // console.log(event.target);
      if (event.target.classList.contains("fa-chevron-up")) {
        // console.log();
        const addQuantity = event.target;
        // 1. get item from cart
        const addedItem = cart.find(
          (cItem) => cItem.id == addQuantity.dataset.id
        );
        addedItem.quantity++;
        // 3. update cart value
        this.setCartValue(cart);
        // 2. save cart
        Storage.saveCart(cart);
        addQuantity.nextElementSibling.innerText = addedItem.quantity;
      } else if (event.target.classList.contains("fa-trash-alt")) {
        const removeItem = event.target;
        const _removedItem = cart.find((C) => C.id == removeItem.dataset.id);
        this.removeItem(_removedItem.id);
        Storage.saveCart(cart);
        cartDom.removeChild(removeItem.parentEelement);
      } else if (event.target.classList.contains("fa-chevron-down")) {
        const subQuantity = event.target;
        const substractedItem = cart.find(
          (c) => c.id == subQuantity.dataset.id
        );
        this.removeItem(_removedItem.id);
        Storage.saveCart(cart);
        cartDom.removeChild(this.removeItem.parentElement);
      }
    });
  }
  clearCart() {
    cart.forEach((cItem) => this.removeItem(cItem.id));
    while (cartDom.children.length) {
      cartDom.removeChild(cartDom.children[0]);
    }
    closeModalFunction();
  }
  removeItem(id) {
    // update cart
    cart = cart.filter((cartItem) => cartItem.id != id);
    // total price and cart
    this.setCartValue(cart);
    // Update Storage :  cart = cart.filter((cartItem) => cartItem.id != id);
    this.setCartValue(cart);
    Storage.saveCart(cart);
    const button = this.getSingleButton(id);
    this.getSingleButton(id);
  }
  getSingleButton(id) {
    return buttonsDOM.find((btn) => parseInt(btn.dataset.id) === parseInt(id));
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
  static getCart() {
    return JSON.parse(localStorage.getItem("cart"));
  }
}
document.addEventListener("DOMContentLoaded", () => {
  const products = new Products();
  const productsData = products.getProduct();
  const ui = new UI();
  // Get item from local storage and set
  ui.setApp();
  ui.cartLogic();
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
