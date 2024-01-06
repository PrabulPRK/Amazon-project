export let cart = JSON.parse(localStorage.getItem('cart'));

export function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart))
}

export function addToCart(productId) {
  let matchingItem;

  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  })

  if (matchingItem) {
    matchingItem.quantity += Number(document.querySelector(`.js-quantity-selector-${productId}`).value);
  }else {
    cart.push({
      productId,
      quantity: Number(document.querySelector(`.js-quantity-selector-${productId}`).value),
      deliveryOptionId: '1'
    })
  }
  saveToStorage();
}

export function removeFromCart(productId) {
  cart = cart.filter((cartItem) => {return productId != cartItem.productId
  });

  saveToStorage();
}

export function updateQuantity(productId, newQuantity) {
  cart.forEach((cartItem) =>{
    if (cartItem.productId === productId) {
      cartItem.quantity = newQuantity;
    }
  });
  saveToStorage();
}

export function updateDeliveryOption(productId, deliveryOptionId) {
  let matchingItem;
  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  })

  matchingItem.deliveryOptionId = deliveryOptionId;

  saveToStorage();
}