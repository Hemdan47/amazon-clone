import {cart , getCartQuantity} from "../../data/cart.js";
import {getDeliveryOption} from "../../data/deliveryOptions.js";
import {getProduct} from "../../data/products.js";
import {formatCurrency} from "../utils/money.js";
import {addOrder} from "../../data/orders.js";

const ESTIMATED_TAX_RATE = 0.1;

export function renderPaymentSummary(){
    let shippingCostCents = 0;
    let itemsCostCents = 0;
    let totalCostBeforeTax = 0;

    // updating the cost
    cart.forEach((cartItem)=>{
        let deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
        let matchingProduct = getProduct(cartItem.productId);

        shippingCostCents+= Number(deliveryOption.priceCents);
        itemsCostCents+= Number(matchingProduct.priceCents*cartItem.quantity);
        totalCostBeforeTax+= (itemsCostCents+shippingCostCents);
    });

    // generating the HTML for payment summary
    let paymentSummaryHTML = `
        <div class="payment-summary-title">
        Order Summary
        </div>

        <div class="payment-summary-row">
            <div>Items (${getCartQuantity()}):</div>
            <div class="payment-summary-money">$${formatCurrency(itemsCostCents)}</div>
        </div>

        <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money">$${formatCurrency(shippingCostCents)}</div>
        </div>

        <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">$${formatCurrency(totalCostBeforeTax)}</div>
        </div>

        <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money">$${formatCurrency(totalCostBeforeTax*ESTIMATED_TAX_RATE)}</div>
        </div>

        <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money">$${formatCurrency(totalCostBeforeTax+(totalCostBeforeTax*ESTIMATED_TAX_RATE))}</div>
        </div>

        <button class="place-order-button button-primary js-place-order">
        Place your order
        </button>
    `;

    document.querySelector('.js-payment-summary').innerHTML = paymentSummaryHTML;

    // sending the order data to the backend
    document.querySelector('.js-place-order').addEventListener('click' , async ()=>{
        if(cart.length!=0){
            const response = await fetch('https://supersimplebackend.dev/orders' , {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({cart: cart})
            });
    
            const order = await response.json();
            addOrder(order);
    
            // clearing the current cart after placing the order
            localStorage.removeItem('cart');
    
            // go to orders page
            window.location.href = 'orders.html';
        }
        else{
            alert('The cart is empty')
        }
        
    });
}
