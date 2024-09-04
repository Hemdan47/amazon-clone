export let products = [];

// loading the products using fetch
export async function loadProducts(){
  const response = await fetch('https://supersimplebackend.dev/products')
  const productsData = await response.json();
  products = productsData;
}





// loading the products
// export function loadProducts(fun){
//   const xhr = new XMLHttpRequest();
//   xhr.addEventListener('load' , ()=>{
//     products = JSON.parse(xhr.response);
//     fun();
//   });
//   xhr.open('GET' , 'https://supersimplebackend.dev/products');
//   xhr.send();
// }



// get the current product in cart from the products
export function getProduct(productId){
  let matchingProduct;
  products.forEach((product)=>{
    if(product.id === productId){
        matchingProduct = product;
    }
  });
  return matchingProduct;
}





export function searchProducts(searchParameter) {
  return products.filter(product => 
      product.name.toLowerCase().includes(searchParameter)
  );
}