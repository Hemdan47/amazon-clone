import {getCartQuantity} from "../data/cart.js";
import {getOrder} from "../data/orders.js";
import {getProduct , loadProducts} from "../data/products.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";

loadPage();

async function loadPage() {
    await loadProducts();
    document.querySelector('.js-cart-quantity').innerHTML = getCartQuantity();
    
    let trackingHTML = '';
    const url= new URL(window.location.href);
    const productId= url.searchParams.get('productId');
    const orderId= url.searchParams.get('orderId');
    const order = getOrder(orderId);
    const product = getProduct(productId);
    const orderDate = dayjs(order.orderTime);

    let quantity;
    let arrivingDate;
    
    order.products.forEach((product)=>{
        if(product.productId === productId){
            quantity= product.quantity;
            arrivingDate= dayjs(product.estimatedDeliveryTime);
        }
    });


    const progress= Number((dayjs() - orderDate) / (arrivingDate - orderDate)) * 100;

    trackingHTML+= `
        <div class="order-tracking">
            <a class="back-to-orders-link link-primary" href="orders.html">
            View all orders
            </a>

            <div class="delivery-date">
            Arriving on ${arrivingDate.format('dddd MMMM d')}
            </div>

            <div class="product-info">
            ${product.name}
            </div>

            <div class="product-info">
            Quantity: ${quantity}
            </div>

            <img class="product-image" src= ${product.image}>

            <div class="progress-labels-container">
            <div class="progress-label ${(progress < 50)? 'current-status' : ''}">
                Preparing
            </div>
            <div class="progress-label ${(progress<100 && progress>=50)? 'current-status' : ''}">
                Shipped
            </div>
            <div class="progress-label ${(progress>=100)? 'current-status' : ''}">
                Delivered
            </div>
            </div>

            <div class="progress-bar-container">
            <div class="progress-bar js-progress-bar"></div>
            </div>
        </div>
    `;

    document.querySelector('.js-main').innerHTML = trackingHTML;
    document.querySelector('.js-progress-bar').style.width = `${progress}%`
}