import { cart, removeFromCart, calculateCartQuantity, updateQuantity } from "../data/cart.js";
import { products } from "../data/products.js";
import formatCurrency from './utils/money.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { deliveryOptions } from '../data/deliveryOptions.js'

updateCartQuantity();

let cartSummaryHTML = '';
cart.forEach((cartItem) => {
  const { productId, quantity: productQuantity, deliveryOptionId } = cartItem;
  const matchingItem = products.find(product => product.id === productId);
  const deliveryOption = deliveryOptions.find(option => option.id === deliveryOptionId);
  
  const today = dayjs();
  const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
  const dateString = deliveryDate.format('dddd, MMMM D');

  cartSummaryHTML += `
    <div class="cart-item-container js-cart-item-container-${matchingItem.id}">
      <div class="delivery-date">
        Delivery date: ${dateString}
      </div>
      <div class="cart-item-details-grid">
        <img class="product-image" src="${matchingItem.image}">
        <div class="cart-item-details">
          <div class="product-name">${matchingItem.name}</div>
          <div class="product-price">$${formatCurrency(matchingItem.priceCents)}</div>
          <div class="product-quantity">
            <span>
              Quantity: <span class="quantity-label js-quantity-label">${productQuantity}</span>
            </span>
            <span class="update-quantity-link link-primary js-update-link" data-product-id="${matchingItem.id}">Update</span>
            <input type="number" class="quantity-input js-quantity-input">
            <span class="save-quantity-link js-save-quantity-link link-primary" data-product-id=${matchingItem.id}>Save</span>
            <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingItem.id}">Delete</span>
          </div>
        </div>
        <div class="delivery-options">
          <div class="delivery-options-title">Choose a delivery option:</div>
          ${deliveryOptionsHtml(matchingItem, cartItem)}
        </div>
      </div>
    </div>
  `;
});

function deliveryOptionsHtml(matchingItem, cartItem) {
  return deliveryOptions.map(deliveryOption => {
    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
    const dateString = deliveryDate.format('dddd, MMMM D');
    const priceString = deliveryOption.priceCents === 0 ? 'FREE' : `$${formatCurrency(deliveryOption.priceCents)} -`;
    const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

    return `
      <div class="delivery-option">
        <input type="radio" ${isChecked ? 'checked' : ''} class="delivery-option-input" name="delivery-option-${matchingItem.id}">
        <div>
          <div class="delivery-option-date">${dateString}</div>
          <div class="delivery-option-price">${priceString} Shipping</div>
        </div>
      </div>
    `;
  }).join('');
}

document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;

document.querySelectorAll('.js-delete-link').forEach(link => {
  link.addEventListener('click', () => {
    const productId = link.dataset.productId;
    removeFromCart(productId);
    const container = document.querySelector(`.js-cart-item-container-${productId}`);
    container.remove();
    updateCartQuantity();
  });
});

document.querySelectorAll('.js-update-link').forEach(link => {
  link.addEventListener('click', () => {
    const productId = link.dataset.productId;
    const container = document.querySelector(`.js-cart-item-container-${productId}`);
    container.classList.add('is-editing-quantity');
  });
});

document.querySelectorAll('.js-save-quantity-link').forEach(link => {
  const saveQuantity = () => {
    const productId = link.dataset.productId;
    const container = document.querySelector(`.js-cart-item-container-${productId}`);
    const newQuantity = Number(container.querySelector('.js-quantity-input').value);
    
    if (newQuantity <= 0 || newQuantity > 100) {
      alert(`Quantity can't be less than 0 or higher than 100`);
      return;
    }

    container.classList.remove('is-editing-quantity');
    updateQuantity(productId, newQuantity);
    container.querySelector('.js-quantity-label').innerHTML = newQuantity;
    updateCartQuantity();
  };

  link.addEventListener('click', saveQuantity);
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') saveQuantity();
  });
});

function updateCartQuantity() {
  const cartQuantity = calculateCartQuantity();
  const checkoutCartQuantityElement = document.querySelector('.js-checkout-cart-quantity');
  if (!cartQuantity) {
    checkoutCartQuantityElement.innerHTML = 'Checkout (<a class="return-to-home-link" href="amazon.html"></a>)';
  } else {
    checkoutCartQuantityElement.innerHTML = `Checkout (<a class="return-to-home-link" href="amazon.html">${cartQuantity} items</a>)`;
  }
}
