import {cart, removeFromCart,
  calculateCartQuantity, updateQuantity} from "../data/cart.js";
import {products} from "../data/products.js";
import formatCurrency from './utils/money.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import {deliveryOptions} from '../data/deliveryOptions.js'

updateCartQuantity();

let cartSummaryHTML = '';
cart.forEach((cartItem) => {
  const { productId, quantity: productQuantity, deliveryOptionId } = cartItem;
  let matchingItem;
  products.forEach((product) => {
    if(product.id === productId){
      matchingItem = product;
    }
  });
  let deliveryOption;
  deliveryOptions.forEach((option) => {
    if(option.id === deliveryOptionId)
      deliveryOption = option;
  })
  const today = dayjs();
  const deliveryDate = today.add(
    deliveryOption.deliveryDays, 'days'
  );
  const dateString = deliveryDate.format('dddd, MMMM D');
  cartSummaryHTML += `
    <div class="cart-item-container 
      js-cart-item-container-${matchingItem.id}">
      <div class="delivery-date">
        Delivery date: ${dateString};
      </div>

      <div class="cart-item-details-grid">
        <img class="product-image"
          src="${matchingItem.image}">

        <div class="cart-item-details">
          <div class="product-name">
            ${matchingItem.name}
          </div>
          <div class="product-price">
          $${formatCurrency(matchingItem.priceCents)}
          </div>
          <div class="product-quantity">
            <span>
              Quantity: <span class="quantity-label js-quantity-label">${productQuantity}</span>
            </span>
            <span class="update-quantity-link link-primary
            js-update-link" data-product-id="${matchingItem.id}">
              Update
            </span>
            <input type = "number" class="quantity-input js-quantity-input">
            <span class="save-quantity-link js-save-quantity-link
             link-primary" data-product-id=${matchingItem.id}>Save
            </span>
            <span class="delete-quantity-link link-primary
              js-delete-link" data-product-id="${matchingItem.id}">
              Delete
            </span>
          </div>
        </div>

        <div class="delivery-options">
          <div class="delivery-options-title">
            Choose a delivery option:
          </div>
          ${deliveryOptionsHtml(matchingItem, cartItem)}
        </div>
      </div>
    </div> 
  `;
});

function deliveryOptionsHtml(matchingItem, cartItem) {
  let html = '';
  deliveryOptions.forEach((deliveryOption) => {
    const today = dayjs();
    const deliveryDate = today.add(
      deliveryOption.deliveryDays, 'days'
    );
    const dateString = deliveryDate.format('dddd, MMMM D');
    const priceString = deliveryOption.priceCents === 0
      ? 'FREE'
      : `$${formatCurrency(deliveryOption.priceCents)} -`
    const isChecked = deliveryOption.id === cartItem.deliveryOptionId;
    html += `
      <div class="delivery-option">
        <input type="radio"
          ${isChecked ? 'checked': ''}
          class="delivery-option-input"
          name="delivery-option-${matchingItem.id}">
        <div>
          <div class="delivery-option-date">
            ${dateString}
          </div>
          <div class="delivery-option-price">
            ${priceString} Shipping
          </div>
        </div>
      </div>
    `  
  });
  return html;
};

document.querySelector('.js-order-summary')
  .innerHTML = cartSummaryHTML;

document.querySelectorAll('.js-delete-link')
  .forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      removeFromCart(productId);
      const container = document
        .querySelector(`.js-cart-item-container-${productId}`);
      container.remove();
      updateCartQuantity();
    })
  })

document.querySelectorAll('.js-update-link').
  forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      const container = document
        .querySelector(`.js-cart-item-container-${productId}`)
      container.classList.add('is-editing-quantity');
    })
  })
document.querySelectorAll('.js-save-quantity-link').
  forEach((link) => {
    const saveQuantity = () => {
      const productId = link.dataset.productId;
      const container = document
        .querySelector(`.js-cart-item-container-${productId}`)
      const newQuantity = Number
        (container.querySelector('.js-quantity-input').value);
      if(newQuantity <= 0 || newQuantity > 100){
        alert(`Quantity can't be less than 0 or higher than 100`);
        return;
      } else {
        container.classList.remove('is-editing-quantity');
        updateQuantity(productId, newQuantity);
        container.querySelector('.js-quantity-label')
          .innerHTML = newQuantity;
      };
      updateCartQuantity()
    };
    link.addEventListener('click', saveQuantity);
    const input = link.closest('.cart-item-details-grid').querySelector('.js-quantity-input');
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') saveQuantity();
    });
  });

function updateCartQuantity(){
  const cartQuantity = calculateCartQuantity()
  if (!cartQuantity) {
    document.querySelector('.js-checkout-cart-quantity')
    .innerHTML =`Checkout (<a class="return-to-home-link" href="amazon.html"></a>)`
  } else {
    document.querySelector('.js-checkout-cart-quantity')
    .innerHTML =`Checkout (<a class="return-to-home-link" href="amazon.html">${cartQuantity} items</a>)`
  }
};
