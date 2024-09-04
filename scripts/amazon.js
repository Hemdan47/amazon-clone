import {cart , getCartQuantity , addToCart} from "../data/cart.js";
import {products , loadProducts , searchProducts} from "../data/products.js";
import {formatCurrency} from "./utils/money.js";



loadPage();

// adding searching functionality
document.querySelector('.js-search-button').addEventListener('click', () => {
  const searchParameter = document.querySelector('.js-search-bar').value.toLowerCase();
  const searchResult = searchProducts(searchParameter);
  loadPage(searchResult);
});


async function loadPage(searchResult){
  await loadProducts();
  let productsHTML = '';

  const productsToRender = searchResult || products;
  productsToRender.forEach((product)=>{
    productsHTML += `
        <div class="product-container">
          <div class="product-image-container">
            <img class="product-image"
              src="${product.image}">
          </div>

          <div class="product-name limit-text-to-2-lines js-product-name">
            ${product.name}
          </div>

          <div class="product-rating-container">
            <img class="product-rating-stars"
              src="images/ratings/rating-${product.rating.stars*10}.png">
            <div class="product-rating-count link-primary">
              ${product.rating.count}
            </div>
          </div>

          <div class="product-price">
            $${formatCurrency(product.priceCents)}
          </div>

          <div class="product-quantity-container">
            <select class="js-product-quantity-selector-${product.id}">
              <option selected value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
          </div>

          <div class="product-spacer"></div>

          <div class="added-to-cart js-added-to-cart-${product.id}">
            <img src="images/icons/checkmark.png">
            Added
          </div>

          <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id="${product.id}">
            Add to Cart
          </button>
        </div>`;
  });
  
  
  // add the generated HTML to the page
  document.querySelector('.js-products-grid').innerHTML = productsHTML;
  
  // update the cart quantity onload
  updateCartQuantity();
  
  
  
  // update the cart quantity in amazon main page
  function updateCartQuantity(){
    const cartQuantityElem = document.querySelector('.js-cart-quantity');
      cartQuantityElem.innerHTML = getCartQuantity();
  }
  
  // displaying added message for 2sec when clicking on add to cart button
  let addedToCartMessageTimeOutID = {};
  function displayAddedMessage(productId){
    const addedToCartElem = document.querySelector(`.js-added-to-cart-${productId}`);
      addedToCartElem.style.opacity = 1;
      if(addedToCartMessageTimeOutID[productId]){
        clearTimeout(addedToCartMessageTimeOutID[productId]);
      }
      addedToCartMessageTimeOutID[productId] = setTimeout(()=>{addedToCartElem.style.opacity = 0;} , 2000);
  }
  
  
  
  // adding functionality to all add-to-cart buttons
  document.querySelectorAll('.js-add-to-cart').forEach((button)=>{
    button.addEventListener('click' , ()=>{
      const productId = button.dataset.productId;
      const productQuantity = document.querySelector(`.js-product-quantity-selector-${productId}`).value;
  
      // adding to the cart
      addToCart(productId , productQuantity);
      
      // making cart quantity in the main page interactive
      updateCartQuantity();
  
      // displaying the added messages
      displayAddedMessage(productId);
  
    })
  });
  
}







