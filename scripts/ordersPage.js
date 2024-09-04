import {orders} from "../data/orders.js";
import {getProduct , loadProducts} from "../data/products.js";
import {getCartQuantity , addToCart} from "../data/cart.js";
import {formatCurrency} from "./utils/money.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";



loadPage();

async function loadPage() {
    await loadProducts();
    document.querySelector('.js-cart-quantity').innerHTML = getCartQuantity();

    let ordersHTML = '';
    function generateOrderProducts(order){
        let productsHTML = '';
        const orderProducts = order.products;
        orderProducts.forEach((orderProduct)=>{
            const product = getProduct(orderProduct.productId);
            productsHTML+= `
                <div class="product-image-container">
                <img src=${product.image}>
                </div>

                <div class="product-details">
                <div class="product-name">
                    ${product.name}
                </div>
                <div class="product-delivery-date">
                    Arriving on: ${dayjs(orderProduct.estimatedDeliveryTime).format('MMMM D')}
                </div>
                <div class="product-quantity">
                    Quantity: ${orderProduct.quantity}
                </div>
                <button class="buy-again-button button-primary js-buy-again" data-product-id=${orderProduct.productId} data-quantity= ${orderProduct.quantity} data-order-id= ${order.id}>
                    <img class="buy-again-icon" src="images/icons/buy-again.png">
                    <span class="buy-again-message">Buy it again</span>
                </button>
                </div>

                <div class="product-actions">
                <a href="tracking.html?orderId=${order.id}&productId=${orderProduct.productId}">
                    <button class="track-package-button button-secondary">
                    Track package
                    </button>
                </a>
                </div>
            `;
        });
        return productsHTML;
    }
    orders.forEach((order)=>{
        ordersHTML+= `
            <div class="order-container">
            <div class="order-header">
                <div class="order-header-left-section">
                <div class="order-date">
                    <div class="order-header-label">Order Placed:</div>
                    <div>${dayjs(order.orderTime).format('MMMM D')}</div>
                </div>
                <div class="order-total">
                    <div class="order-header-label">Total:</div>
                    <div>$${formatCurrency(order.totalCostCents)}</div>
                </div>
                </div>

                <div class="order-header-right-section">
                <div class="order-header-label">Order ID:</div>
                <div>${order.id}</div>
                </div>
            </div>

            <div class="order-details-grid">
                ${generateOrderProducts(order)}
            </div>
            </div>
        `;
    })

    document.querySelector('.js-orders-grid').innerHTML = ordersHTML;
    
    document.querySelectorAll('.js-buy-again').forEach((button) => {
        let timeoutID;
        button.addEventListener('click', () => {
            const id = button.dataset.productId;
            const quantity = button.dataset.quantity;
            addToCart(id, quantity);

            button.lastElementChild.innerHTML = 'Added';
            button.firstElementChild.src = 'images/icons/added.png';

            if (timeoutID) {
                clearTimeout(timeoutID);
            }

            timeoutID = setTimeout(() => {
                button.lastElementChild.innerHTML = 'Buy it again';
                button.firstElementChild.src = 'images/icons/buy-again.png';
            }, 1500);

            document.querySelector('.js-cart-quantity').innerHTML = getCartQuantity();
        });
    });
}





