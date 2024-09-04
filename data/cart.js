export const cart = JSON.parse(localStorage.getItem('cart')) || [];

// function to get the current cart quantity
export function getCartQuantity(){
  if(!cart){
    return 0;
  }
  let quantity = 0;
  cart.forEach((product)=>{
    quantity+=product.quantity;
  });
  return quantity;
}

// function to update the cart quantity
export function updateQuantity(productId , newQuantity){
  
  cart.forEach((product)=>{
    if(product.productId === productId){
      product.quantity = newQuantity;
    }
  });
  
  saveToStorage();
} 



// function to save the cart data in local storage
export function saveToStorage(){
  localStorage.setItem('cart' , JSON.stringify(cart));
}


// add to cart
export function addToCart(productId , productQuantity){
    let is_exist = false;
      for(let i = 0 ; i < cart.length ; i++){
        if(productId === cart[i].productId){
          cart[i].quantity+= Number(productQuantity);
          is_exist = true;
          break;
        }
      }
      if(!is_exist){
        cart.push({ 
          productId: productId,
          quantity: Number(productQuantity),
          deliveryOptionId : '1'
        });
      }

      saveToStorage();
};


// remove from the cart
export function removeFromCart(productId){
  cart.forEach((order , index)=>{
    if(order.productId === productId){
        cart.splice(index,1);
    }
  });

  saveToStorage();
}





// update the delivery option in the cart
export function updateDeliveryOption(productId , deliveryOptionId){
  let cartItem;
  cart.forEach((item)=>{
    if(item.productId === productId){
      cartItem = item;
    }
  });
  cartItem.deliveryOptionId = deliveryOptionId;
  
  saveToStorage();
}