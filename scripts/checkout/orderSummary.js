import {cart , getCartQuantity, removeFromCart , updateDeliveryOption , updateQuantity} from "../../data/cart.js";
import {getProduct} from "../../data/products.js";
import {formatCurrency} from "../utils/money.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import {deliveryOptions} from "../../data/deliveryOptions.js";
import {renderPaymentSummary} from "./paymentSummary.js";

// function to render the order summary page
export function renderOrderSummary(){

    // generating the HTML for the order summary
    let cartSummaryHTML= '';
    cart.forEach((cartItem)=>{
    const productId = cartItem.productId;
    const matchingProduct = getProduct(productId);
    const deliveryOptionsId = cartItem.deliveryOptionId;
    let deliveryDate;
    deliveryOptions.forEach((deliveryOption)=>{
        if(deliveryOption.id === cartItem.deliveryOptionId){
            deliveryDate = dayjs().add(deliveryOption.deliveryDays , 'days').format('dddd, MMMM D');
        }
    })

    cartSummaryHTML+= `
        <div class="cart-item-container js-cart-item-container-${productId}">
            <div class="delivery-date js-delivery-date">
                Delivery date: ${deliveryDate}
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
                    <div class="product-quantity js-product-quantity-${productId}">
                        <span>
                        Quantity: <span class="quantity-label js-quantity-label">${cartItem.quantity}</span>
                        </span>
                        <span class="update-quantity-link link-primary js-update-link" 
                        data-product-id="${productId}">
                        Update
                        </span>
                        <input type="number" min="1" class="quantity-input js-quantity-input">
                        <span class="save-quantity-link link-primary js-save-quantity-link" data-product-id="${productId}">save</span>
                        <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${productId}">
                        Delete
                        </span>
                    </div>
                </div>

                <div class="delivery-options">
                    <div class="delivery-options-title">
                        Choose a delivery option:
                    </div>
                    ${deliveryOptionsHTML(productId , cartItem)}
                </div>
            </div>
        </div>`;
    });


    // displaying the checkout items count
    function displayCheckoutItemsCount(){
        document.querySelector('.js-checkout-items').innerHTML = `${getCartQuantity()} items`;
    }
    displayCheckoutItemsCount();

    // add the generated HTML to the page
    document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;


    // generating the delivery options html
    function deliveryOptionsHTML(productId , cartItem){
        let deliveryHTML ='';
        deliveryOptions.forEach((deliveryOption)=>{
            const today = dayjs();
            const deliveryDate = today.add(deliveryOption.deliveryDays , 'days');
            const priceString = formatCurrency(deliveryOption.priceCents) ? `$${formatCurrency(deliveryOption.priceCents)} -` : 'Free';
            const isChecked = deliveryOption.id === cartItem.deliveryOptionId ? 'checked' : '';
            deliveryHTML+= `
                <div class="delivery-option js-delivery-option" data-delivery-option-id= ${deliveryOption.id} data-product-id= ${productId}>
                    <input type="radio" ${isChecked}
                    class="delivery-option-input"
                    name="delivery-option-${productId}">
                    <div>
                    <div class="delivery-option-date">
                        ${deliveryDate.format('dddd, MMMM D')}
                    </div>
                    <div class="delivery-option-price">
                        ${priceString} Shipping
                    </div>
                    </div>
                </div>
            `
        });
        return deliveryHTML;
    }




    // making the delete button interactive
    document.querySelectorAll('.js-delete-link')
    .forEach((link)=>{
        link.addEventListener('click' , ()=>{
            const productId = link.dataset.productId;
            removeFromCart(productId);

            // delete the HTML for the order from the page
            const container = document.querySelector(`.js-cart-item-container-${productId}`);
            container.remove();
            displayCheckoutItemsCount();
            renderPaymentSummary();
        });
    })




    // making the update button interactive
    document.querySelectorAll('.js-update-link')
    .forEach((link)=>{
        link.addEventListener('click' , ()=>{
            const productId = link.dataset.productId;
            const container = document.querySelector(`.js-cart-item-container-${productId}`);
            container.classList.add('is-editing-quantity');

            // making the initaial value for the input field the current quantity
            const currentQuantity = document.querySelector(`.js-product-quantity-${productId} .js-quantity-label`).innerHTML;
            document.querySelector(`.js-product-quantity-${productId} .js-quantity-input`)
            .value= currentQuantity; 

            
            
        });
    })

    // making the save button interactive
    document.querySelectorAll('.js-save-quantity-link')
    .forEach((link)=>{
        link.addEventListener('click' , ()=>{
            const productId = link.dataset.productId;

            const container = document.querySelector(`.js-cart-item-container-${productId}`);

            const currentQuantity = Number(document.querySelector(`.js-cart-item-container-${productId} .js-quantity-label`).innerHTML);

            let updatedQuantity = Number((document.querySelector(`.js-product-quantity-${productId} .js-quantity-input`).value));


            if(updatedQuantity <= 0){
                updatedQuantity = currentQuantity;
                alert("Invalid Quantity!");
            }

            updateQuantity(productId , updatedQuantity);

            container.classList.remove('is-editing-quantity');

            // updating the product count on the order summary
            document.querySelector(`.js-product-quantity-${productId} .js-quantity-label`)
            .innerHTML = updatedQuantity;

            // updating the checout items count
            displayCheckoutItemsCount();
            renderPaymentSummary();
        });
    })



    // making the delivery options interactive
    document.querySelectorAll('.js-delivery-option').forEach((option)=>{
        const productId = option.dataset.productId;
        const deliveryOptionId = option.dataset.deliveryOptionId;
        option.addEventListener('click' , ()=>{
            updateDeliveryOption(productId , deliveryOptionId);
            renderOrderSummary();
            renderPaymentSummary();
        });
    });

}