
    const baseURL = 'http://localhost:3000';
    document.addEventListener("DOMContentLoaded", function () {
    const cart = [];
    const showCartButton = document.getElementById("show-cart-button");
    console.log("clicked");
    const cartContainer = document.getElementById("cart-container");
    const addToCartButtons = document.querySelectorAll(".add-to-cart-button");
    const cartPreview = document.querySelector(".cart-summary ul");
    const cartTotalAmount = document.getElementById("cart-total-amount");
    const closeCartButton = document.getElementById("close-cart-button");
    const sizeOptions = document.querySelectorAll('.size-option');
    const checkOutButton = document.getElementById('checkout-button');
    let selectedSize = null; // Variable to store the selected size
    const link = document.getElementById("cart-link-button");
    console.log(cartContainer.style.right);
    const nav = document.getElementById("templatemo_nav_top");
    const nav1 = document.getElementById("bler");
    const empty= document.getElementById("empty");
    const notEmpty=document.getElementById("notempty");
    const shippingForm=document.getElementById('shipping-form');

    fetch(`${baseURL}/cart/add`)
        .then(response => response.json())
        .then(cartData => {
            // Update the cart summary with the fetched data
             // Clear any existing items

            // Loop through the cart items and create HTML elements for each
            cart.push(...cartData);
            console.log(cartData);
            console.log(cart);

             updateCartPreview();
            // Update the total amount
            const total = cartData.reduce((acc, item) => acc + item.price * item.quantity, 0);
            cartTotalAmount.textContent = `$${total.toFixed(2)}`;
        })
        .catch(error => {
            console.error('Error:', error);
        });

    function updateCartPreview() {
         
      
       
        cartPreview.innerHTML = '';
        let total = 0;
        console.log(cart);
        cart.forEach(item => {
        const listItem = document.createElement("li");
        
        // Create a container for the image and information
         
       
        const itemContainer = document.createElement("div");
        itemContainer.classList.add("cart-item-container");
        const closeButtonContainer = document.createElement("div");
        closeButtonContainer.classList.add("close-button-container");
        const closeButton = document.createElement("button");
        const closeimg = document.createElement("img");
        closeimg.src="./assets/img/trash.svg";
        closeButton.style.border='none';
        closeButton.appendChild(closeimg);

        closeButton.setAttribute("data-product-id", item.id);
        console.log(closeButton.getAttribute("data-product-id"));
        const quantitySelectContainer = document.createElement("div");
        quantitySelectContainer.classList.add("quantity-select-container");
        const quantitySelect = document.createElement("select");
        quantitySelect.classList.add("quantity-select");
        closeButtonContainer.appendChild(closeButton);
        quantitySelectContainer.appendChild(quantitySelect);


        for (let i = 1; i <= 10; i++) {
            const option = document.createElement("option");
            option.value = i;
            option.text = i;
            if (i === item.quantity) {
                option.selected = true; // Select the current quantity
            }
            quantitySelect.appendChild(option);
        }
        // Add an event listener to update the quantity when the select box changes
        quantitySelect.addEventListener("change", function () {
            const newQuantity = parseInt(quantitySelect.value, 10);
            item.quantity = newQuantity;
            updateCartPreview();
        });
        
        closeButton.addEventListener("click",function(){

            const itemId = closeButton.getAttribute("data-product-id");
            console.log(itemId);
            fetch(`${baseURL}/cart/modify`,{
                method: 'PUT',
                headers:{
                'Content-Type': 'application/json',
                },
                 body: JSON.stringify({ itemId }),
            })
            .then(response => response.json())
            .then(data => {
            console.log(data.message);
            
           cart.splice(data, 1);
           updateCartPreview();
             // Server's response

            })
            .catch(error => {
                console.error('Error:', error);
             });

        console.log("yo");
            updateCartPreview();



            console.log(cart);
            //const itemIndex = cart.findIndex(item => item.id === itemId);
            //console.log(itemId);
            


            /*if (itemIndex !== -1) {
                cart.splice(itemIndex, 1);
                updateCartPreview(); // Update the cart preview after removing an item
                console.log("splice");
            }
        console.log("update");
        console.log(cart);*/


        });


        const itemImage = document.createElement("img");
        itemImage.src = item.image;
        itemImage.alt = item.name;
        
        // Create a div for the product information
        const itemInfo = document.createElement("div");
        const pname = document.createElement("h3");
        const psize = document.createElement("h3");
        const pquantity = document.createElement("h3");
        psize.textContent= item.name+ " | " + item.size;
        


        itemInfo.classList.add("cart-item-info");
        itemInfo.innerHTML =`${item.name}<br><br>Size: ${item.size}<br><br><br>(Qty: ${item.quantity})<br>`;
        
        // Append the image and information to the container

       
         itemContainer.appendChild(itemImage);
        itemContainer.appendChild(psize);

        itemContainer.appendChild(quantitySelectContainer);
        itemContainer.appendChild(closeButtonContainer);
        

        

        
        // Append the container to the list item
        listItem.appendChild(itemContainer);

        
        cartPreview.appendChild(listItem);
        total += item.price * item.quantity;
         
       
    });

    cartTotalAmount.textContent = total.toFixed(2);
            // ... (rest of the code)
            
   
    
        
    }


        shippingForm.addEventListener("submit",function(event){
             event.preventDefault();
             console.log("yes");
             const formData = {
                "contact-number": document.getElementById("contact-number").value,
                "country": document.getElementById("country").value,
                "city": document.getElementById("city").value,
                "state": document.getElementById("state").value,
                "pincode": document.getElementById("pincode").value,
            };
            fetch(`${baseURL}/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })
            .then(() => {
                // No need to handle response data
                // Simply navigate to the payment page
            window.location.href = 'payment.html';
                })
            .catch(error => {
                console.error('Error:', error);
                  });
        });
            
         
 

        
});




