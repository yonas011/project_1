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
    const token = getCookie('jwts');
    const LocalStoredCart = JSON.parse(localStorage.getItem('cart'));
    let account_link = document.getElementById("account_id");






    console.log(LocalStoredCart);
    if(LocalStoredCart != null){
        for (const item of LocalStoredCart) {
        if (!cart.includes(item)) {
            cart.push(item);
            console.log(cart);
            updateCartPreview();
            }
        }

    }


    if (token) {

        
    
            account_link.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent the default behavior of the link
            fetch(`${baseURL}/logout`,{ 
            method:'POST',
            credentials:'include',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(cart)




            })
            .then(response => {
              if (response.status === 200) {
                console.log("cart inserted to database");
                localStorage.removeItem('cart');
                console.log("removed local storage");
                cart.length = 0;
                window.location.reload();

              }
              else{
                console.log(response.message);
                console.log("checkerrot");
              } 
             

            })
            .catch(error => {
                console.error('Error',error.message);
            })
            console.log('Link clicked!');
        });
    }

    
     
  






    

    console.log(token);
    /*
    fetch(`${baseURL}/database_cart`, {
        method: 'GET', // or 'POST', 'PUT', etc.
        credentials:'include',
        headers: {
        'Content-Type': 'application/json'
            // Add other necessary headers if required
        }
    })
    .then(response => {
    // Handle response here
        
        if (response.status === 500) {
            console.log("invalid token");
            
        }
        else if (response.status === 401) {
            console.log(response.message);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        return response.json();
    })
    .then(data =>{
        console.log(data.cart);
        const cart_data = data.cart;
        cart.push(...cart_data);
        updateCartPreview();


    })
    .catch(error => {
    // Handle fetch error
        console.error('Error',error.message);
    });
    */

   










    const storedToken = document.cookie.split('; ').find(row => row.startsWith('unlogged='))?.split('=')[1];

    if (!storedToken) {
        console.log("custom");
        fetch('/user_jwt', {
        method: 'GET', // Adjust the method as per your server endpoint
        headers: {
        'Content-Type': 'application/json',
   
             },
          })
       }

 

    /*
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

       */


 





    // Initialize an empty cart
   
    function showcartbutton(event){
         if (cartContainer.style.right === "0px") {
                cartContainer.style.right = "-100%";

                
                
            } else {
                cartContainer.style.right = "0px";
                nav.style.filter="blur(3px)";
                nav1.style.filter="blur(3px)";
                document.body.style.overflow="hidden";
                
                
                
            }

    
    }
    link.addEventListener('click', showcartbutton);
   

    // Function to update the cart preview and total
    function updateCartPreview() {
         
      
        
        if (cart.length > 0) {
            empty.style.display = "none";
            console.log("here");
            notEmpty.style.display="";


        }
        else{
            notEmpty.style.display="none";
            empty.style.display="";
            


        }   
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

    // Event listener for "Add to Cart" buttons
    addToCartButtons.forEach(button => {
        button.addEventListener("click", function () {
          





            const productId = button.getAttribute("data-product-id");
            const productImage = button.getAttribute("data-product-image");
            const productName = button.getAttribute("product-name");
            const productsize = button.getAttribute("product-size");
    

            // Example: Fetch product details from your data source
            const productDetails = {
                id: productId,
                name: productName, // Replace with actual product name
                price: 99.99, // Replace with actual product price
                quantity: 1,
                image: productImage, // Add the image URL to the product details
                size:productsize,
            };

            // Check if the product is already in the cart
            const existingItem = cart.find(item => item.id === productDetails.id);

            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push(productDetails);
            }

            // Update the cart preview and total
            updateCartPreview();
        });
    });

    sizeOptions.forEach(sizeOption => {
    sizeOption.addEventListener("click", function () {

        const sizeOptionsContainer = sizeOption.closest(".size-options");
        // Check if the size option is already selected
        const isSelected = sizeOption.classList.contains("selected");

        // Remove background color from all size options
       sizeOptionsContainer.querySelectorAll(".size-option").forEach(option => {
            option.style.backgroundColor = ''; // Reset background color
             
        });
       sizeOptions.forEach(option => {
          option.classList.remove("selected"); // Remove the "selected" class
        }); 

        // If the size option was not selected, mark it as selected
        if (!isSelected) {
             // Change the background color as desired
            sizeOption.classList.add("selected"); // Add the "selected" class
        }
        else{
            
        }

        // Get the selected size
        const selectedSize = isSelected ? '' : sizeOption.textContent;

        // You can now use the selectedSize value as needed
        console.log(`Selected Size: ${selectedSize}`);

        // Add the selected product to the cart if a size is selected
        if (selectedSize) {
            const closestImage = sizeOption.closest("#canvas").querySelector("img");
            

            const productId = closestImage.getAttribute("product-id");
            const productImage = closestImage.getAttribute("src");
            const productName = closestImage.getAttribute("alt");

            // Example: Fetch product details from your data source
            const productDetails = {
                id:productId,
                name: productName,
                price: 19.99, // Replace with the actual product price
                quantity: 1,
                image: productImage,
                size: selectedSize,
            };

            // Check if the product is already in the cart
            const existingItem = cart.find(item => item.id === productDetails.id && item.size === productDetails.size);

            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push(productDetails);
            }

            fetch(`${baseURL}/cart/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productDetails),
        })
            .then(response => response.json())
            .then(data => {
                // Handle the response here (if needed)
                console.log(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
            // Update the cart preview and total
            updateCartPreview();
        }
    });
});  

    checkOutButton.addEventListener("click",function(){
          window.location.href = "cart-preview.html";
 
    });

     closeCartButton.addEventListener("click", function () {
        cartContainer.style.right = "-100%"; // Hide the cart when the close button is clicked
        nav.style.filter="none";
        nav1.style.filter="none";
        document.body.style.overflow="visible";
    });
    console.log("yesder");
    function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));




    }

    // Event listener for beforeunload event
    window.addEventListener('beforeunload', function(event) {
    // Save cart data when the user leaves the page
    saveCartToLocalStorage();
    });
    window.addEventListener('offline', () => {
    const cartData = cart;
    localStorage.setItem('cart', JSON.stringify(cartData));
    });

    function getCookie(cookieName) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    // Check if the cookie name matches the specified name
    if (cookie.startsWith(`${cookieName}=`)) {
      return cookie.substring(cookieName.length + 1);
        }
    }
    return null; // Return null if the cookie is not found
    }



});




