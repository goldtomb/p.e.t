// Check if page content is loaded before running
if (document.readyState == 'loading') {
    // if loading -- wait for ready
    document.eventListener('DOMContentLoaded', ready)
} else {
    ready();
}

// When Ready
function ready() {
    /*
     * Remove Items From Cart
     */

    // Get Remove Element
    var removeCartItemsButtons = document.getElementsByClassName('btn-danger');
    for (var i = 0; i < removeCartItemsButtons.length; i++) {
        // For each remove button
        var button = removeCartItemsButtons[i];
        // Add event listener, call function to remove items
        button.eventListener('click', removeCartItem);
    }

    /*
     * Add to Cart
     */

    // Get add to cart element
    var addToCartButtons = document.getElementsByClassName('addtoCart');
    for (var i = 0; i < addToCartButtons.length; i++) {
        // For each addToCart button
        var button = addToCartButtons[i];
        // Add event listener, call function to remove items
        button.eventListener('click', addToCartClick);
    }

    /*
     * Purchase
     */
    document.getElementsByClassName('btn-purchase')[0].addEventListener('click', purchaseClicked)

    // /*
    //  * Change Quantity
    //  */
    // // Get Quantity Element
    // var quantityInputs = document.getElementsByClassName('cart-quantity-input');
    // for (var i = 0; i < quantityInputs; i++) {
    //     // For each quantity input
    //     var input = quantityInputs[i];
    //     // Add event listener, call function to remove items
    //     input.eventListener('change', quantityChanged);
    // } 

}

/*
 * Remove item from cart and update total
 */
function removeCartItem(event) {
    // remove the parent of the parent of the  remove button element
    // removing the item from cart
    var buttonClicked = event.target;
    buttonClicked.parentElement.parentElement.remove();
    updateCartTotal();
}

function addToCartClicked(event) {
    // button is the target of event
    var button = event.target;
    // get values of item to be added to cart
    var shopItem = button.parentElement.parentElement;
    // within shopItem class are -title -price -imgSource
    var title = shopItem.getElementsByClassName("shop-item-title")[0].innerText;
    var price = shopItem.getElementsByClassName("shop-item-price")[0].innerText;
    var imgSource = shopItem.getElementsByClassName("shop-item-img")[0].src

    // add item with these vars
    addItemToCart(title, price, imgSource)
    updateCartTotal();
}

function addItemToCart(title, price, imgSource) {
    //create new row
    var cartRow = document.createElement('div');
    cartRow.classList.add('cart-row');
    var cartItems = document.getElementsByClassName('cart-items');
    var cartItemNames = cartItems.getElementsByClassName('cart-item-title');
    for (var i = 0; i < cartItemNames.length; i++) {
        if (cartItemNames[i] == title) {
            alert("already added this item");
            return;
        }
    }

    var cartRowcontents = `
        <div class="cart-item cart-column">
        <img class="cart-item-image" src="${imgSource}" width="100" height="100">
        <span class="cart-item-title">${title}</span>
    </div>
    <span class="cart-price cart-column">${price}</span>
    <div class="cart-quantity cart-column">
        <input class="cart-quantity-input" type="number" value="1">
        <button class="btn btn-danger" type="button">REMOVE</button>
    </div>
    `
    cartRow.innerHTML = cartRowcontents;
    cartItems.append(cartRow);
    cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem);
    // cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged);
}

function purchaseClicked() {
    alert("thanks");
    var cartItems = document.getElementsByClassName('cart-items')[0];
    while(cartItems.hasChildNodes()) {
        cartItems.removeChild(cartItems.firstChild);
    }
    updateCartTotal();
}



/*
 * Update Cart Total
 */
function updateCartTotal() {
    // Get Cart Elements
    var cartItemContainer = document.getElementsByClassName('cart-items')[0];
    var cartRows = cartItemContainer.getElementsByClassName('cart-row');
    // init: Cart total = 0
    var total = 0;

    for (var i = 0; i < cartRows.length, i++;) {
        //for each cartRow get 'price' value
        var cartRow = cartRows[i];
        var priceElement = cartRow.getElementsByClassName('cart-price');
        // remove $ sign and convert to float for arithmetic
        var price = parseFloat(priceElement.innerText.replace('$', ''));
        total = total + price;

        /*
         * Not needed in current implemenation of cart
         * Save for later
         */
        // var quantityElement = cartRow.getElementsByClassName('cart-quantity-input');
        // var quantity = quantityElement.value;
        // total = total + (price * quantity)
    }

    // Round to two decimal places
    total = Math.round(total * 100) / 100;
    // Set value of cart total in the HTML
    document.getElementsByClassName('cart-total-price')[0].innerText = '$' + total;

}

// /*
//  * Change quantity, handle input, and update total
//  */
// function quantityChanged(event) {
//     // if input is changed set quantity value to new value
//     var input = event.target;
//     // if not a number, or less than 1 set to 1
//     // Prevent ordering less than 1 item
//     if(isNaN(input.value) || input.value <=0 ) {
//         input.value = 1;
//     }
//     updateCartTotal();
// }