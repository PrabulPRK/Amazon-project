import { cart, removeFromCart, updateDeliveryOption, updateQuantity } from "../../data/cart.js";
import { getProduct, products } from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";
import { calculateDeliveryDate, deliveryOptions, getDeliveryOption } from "../../data/deliveryOptions.js";
import { renderPaymentSummary } from "./paymentSummary.js";
import { renderCheckoutHeader } from "./checkoutHeader.js";

export function renderOrderSummary() {
  let cartSummaryHTML = '';

  cart.forEach((cartItem) => {
    const productId = cartItem.productId;

    const matchingProduct = getProduct(productId);

    const deliveryOptionId = cartItem.deliveryOptionId;

    const deliveryOption = getDeliveryOption(deliveryOptionId);

    const dateString = calculateDeliveryDate(deliveryOption);
    
    cartSummaryHTML +=  `
      <div class="cart-item-container js-cart-container-${matchingProduct.id}">
        <div class="delivery-date">
          Delivery date: ${dateString}
        </div>

        <div class="cart-item-details-grid">
          <img class="product-image"
            src="${matchingProduct.image}">

          <div class="cart-item-details">
            <div class="product-name">
              ${matchingProduct.name}
            </div>
            <div class="product-price">
              $${formatCurrency(matchingProduct.priceCents)}
            </div>
            <div class="product-quantity">
              <span>
                Quantity: <span class="quantity-label js-quantity-label-${matchingProduct.id}">${cartItem.quantity}</span>
              </span>
              <span class="update-quantity-link link-primary js-update-link" data-product-id="${matchingProduct.id}">
                Update
              </span>
              <input type="number" min="1" max="1000" class="quantity-input js-quantity-input-keydown js-quantity-input-${matchingProduct.id}" data-product-id="${matchingProduct.id}">
              <span class="save-quantity-link link-primary js-save-link" data-product-id="${matchingProduct.id}">Save</span>
              <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
                Delete
              </span>
            </div>
          </div>

          <div class="delivery-options">
            <div class="delivery-options-title">
              Choose a delivery option:
            </div>
            ${deliveryOptionsHTML(matchingProduct, cartItem)}
          </div>
        </div>
      </div>
    `;
  })

  document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;

  function deliveryOptionsHTML(matchingProduct, cartItem) {
    let html = '';
    deliveryOptions.forEach((deliveryOption) => {

      const dateString = calculateDeliveryDate(deliveryOption);

      const priceString = deliveryOption.priceCents === 0 ? 'FREE' : `$${formatCurrency(deliveryOption.priceCents)} -`;

      const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

      html += `
      <div class="delivery-option js-delivery-option" data-product-id="${matchingProduct.id}" data-delivery-option-id="${deliveryOption.id}">
        <input type="radio" ${isChecked ? 'checked' : ''}
          class="delivery-option-input"
          name="delivery-option-${matchingProduct.id}">
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
  }

  document.querySelectorAll('.js-delete-link').forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      removeFromCart(productId);

      renderCheckoutHeader();
      renderOrderSummary();
      renderPaymentSummary();
    })
  })

  document.querySelectorAll('.js-update-link').forEach((link) => {
    link.addEventListener('click', () => {
      const { productId } = link.dataset;

      const container = document.querySelector(`.js-cart-container-${productId}`);

      container.classList.add('is-editing-quantity');
    })
  })

  document.querySelectorAll('.js-save-link').forEach((link) => {
    link.addEventListener('click', () => {
      const { productId } = link.dataset;

      const newQuantity = Number(document.querySelector(`.js-quantity-input-${productId}`).value);

      if (newQuantity <= 0 || newQuantity >= 1000) {
        alert('Quantity must be at least 1 and less than 1000');
        return;
      }

      updateQuantity(productId, newQuantity);

      renderCheckoutHeader();
      renderOrderSummary();

      const container = document.querySelector(`.js-cart-container-${productId}`);

      container.classList.remove('is-editing-quantity');
      renderPaymentSummary();
    })
  })

  //Added keydown eventListener to js-quantity-input-keydown.
  document.querySelectorAll('.js-quantity-input-keydown').forEach((link) => {
    link.addEventListener('keydown', (event) => {
      console.log(event.key);
      if (event.key === 'Enter'){
        const { productId } = link.dataset;

        const newQuantity = Number(document.querySelector(`.js-quantity-input-${productId}`).value);
    
        if (newQuantity <= 0 || newQuantity >= 1000) {
          alert('Quantity must be at least 1 and less than 1000');
          return;
        }
    
        updateQuantity(productId, newQuantity);
        renderCheckoutHeader();
        renderOrderSummary();
        renderPaymentSummary();

        const container = document.querySelector(`.js-cart-container-${productId}`);
    
        container.classList.remove('is-editing-quantity');
      }
    })
  })

  document.querySelectorAll('.js-delivery-option').forEach((element) => {
    element.addEventListener('click', () => {
      const {productId, deliveryOptionId} = element.dataset;
      updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary();
      renderPaymentSummary();
    });
  });
}
