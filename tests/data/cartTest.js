import {addToCart , cart , saveToStorage} from '../../data/cart.js';

describe('test suite: addToCart' , ()=>{
    
    it('add a new product to the cart' , ()=>{
        const productId = '19c6a64a-5463-4d45-9af8-e41140a4100c';
        const quantity = 1;
        // making sure the product does not exist
        let wasExist = false;
        let previousQuantityOfCartItem = 0;
        cart.forEach((cartItem , index)=>{
            if(cartItem.productId === productId){
                wasExist = true;
                previousQuantityOfCartItem= cartItem.quantity; 
                cart.splice(index , 1);
            }
        });

        const currentCartLength = cart.length;

        addToCart(productId , quantity);

        expect(cart.length).toEqual(currentCartLength+1);

        const isValid= (cart[cart.length-1].productId === productId) && (cart[cart.length-1].quantity=== 1) ;
        expect(isValid).toEqual(true);


        if(!wasExist){
            cart.splice(cart.length-1 ,1);
        }
        else{
            cart[cart.length-1].quantity = previousQuantityOfCartItem;
        }

        saveToStorage();
    });


    it('add an existing product to the cart' , ()=>{
        const productId = '19c6a64a-5463-4d45-9af8-e41140a4100c';
        const quantity = 1;
        // making sure the product does not exist
        let wasExist = false;
        let previousQuantityOfCartItem = 0;
        cart.forEach((cartItem , index)=>{
            if(cartItem.productId === productId){
                wasExist = true;
                previousQuantityOfCartItem= cartItem.quantity; 
                cart.splice(index , 1);
            }
        });

        const currentCartLength = cart.length;

        addToCart(productId , quantity);
        addToCart(productId , quantity + 1);

        expect(cart.length).toEqual(currentCartLength+1);

        const isValid= (cart[cart.length-1].productId === productId) && (cart[cart.length-1].quantity=== 3) ;
        expect(isValid).toEqual(true);

        if(!wasExist){
            cart.splice(cart.length-1 ,1);
        }
        else{
            cart[cart.length-1].quantity = previousQuantityOfCartItem;
        }

        saveToStorage();
    });
})