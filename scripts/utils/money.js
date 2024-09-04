// function to convert the price from cents to dollars
export function formatCurrency(priceCents){
    return (Math.round(priceCents)/100).toFixed(2);
}