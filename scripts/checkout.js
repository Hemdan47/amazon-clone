import {renderOrderSummary} from './checkout/orderSummary.js';
import {renderPaymentSummary} from './checkout/paymentSummary.js';
import {loadProducts} from '../data/products.js';

async function loadPage(){
    await loadProducts();
    renderOrderSummary();
    renderPaymentSummary();
}


loadPage();





