/* Script to handle page initialization and DOM manipulation for ordering system */
document.addEventListener('DOMContentLoaded', () => {
    /* Object containing references to product category selections */
    const categories = {
        fruits: document.getElementById('fruits'),
        vegetables: document.getElementById('vegetables'),
        dairy: document.getElementById('dairy'),
        meatSeafood: document.getElementById('meat-seafood'),
        bakingCooking: document.getElementById('baking-cooking')
    };

    /* Object containing references to quantity inputs for products */
    const quantities = {
        fruits: document.getElementById('quantity-fruits'),
        vegetables: document.getElementById('quantity-vegetables'),
        dairy: document.getElementById('quantity-dairy'),
        meatSeafood: document.getElementById('quantity-meat-seafood'),
        bakingCooking: document.getElementById('quantity-baking-cooking')
    };

    /* Object containing references to buttons for adding items to the cart */
    const buttons = {
        fruits: document.getElementById('add-to-cart-fruits'),
        vegetables: document.getElementById('add-to-cart-vegetables'),
        dairy: document.getElementById('add-to-cart-dairy'),
        meatSeafood: document.getElementById('add-to-cart-meat-seafood'),
        bakingCooking: document.getElementById('add-to-cart-baking-cooking')
    };

    /* Reference to the order summary table body */
    const orderSummaryTable = document.querySelector('#order-summary tbody');
    /* Reference to the total price display element */
    const totalPriceElement = document.getElementById('total-price');
    /* Reference to the button for saving favorites */
    const saveFavouritesButton = document.getElementById('save-favourites');
    /* Reference to the button for applying saved favorites to the order */
    const applyFavouritesButton = document.getElementById('apply-favourites');
    /* Reference to the button for clearing the cart */
    const clearCartButton = document.getElementById('clear-cart');

    /* Initial order items array, loaded from localStorage or empty */
    let orderItems = JSON.parse(localStorage.getItem('orderItems')) || [];

    /* Event listeners for each category's add-to-cart button */
    Object.keys(buttons).forEach(category => {
        buttons[category].addEventListener('click', () => {
            const selectedProduct = categories[category].value;
            const quantity = parseFloat(quantities[category].value);
            
            if (selectedProduct && quantity > 0) {
                const [productName, price] = selectedProduct.split('-');
                const pricePerUnit = parseFloat(price);
                const totalPrice = (pricePerUnit * quantity).toFixed(2);

                const item = {
                    productName,
                    quantity,
                    pricePerUnit,
                    totalPrice
                };

                orderItems.push(item);
                saveOrderItems(); // Save items to localStorage
                updateOrderSummary();
            } else {
                alert('Please select a product and enter a valid quantity.');
            }
        });
    });

    /* Event listener for saving favorite orders to localStorage */
    saveFavouritesButton.addEventListener('click', () => {
        localStorage.setItem('favourites', JSON.stringify(orderItems));
    });

    /* Event listener for applying saved favorite orders */
    applyFavouritesButton.addEventListener('click', () => {
        const savedItems = JSON.parse(localStorage.getItem('favourites'));
        if (savedItems) {
            orderItems = savedItems;
            saveOrderItems(); // Save applied favourites to localStorage
            updateOrderSummary();
        }
    });

    /* Event listener for clearing the entire cart */
    clearCartButton.addEventListener('click', () => {
        orderItems = []; // Clear the order items array
        saveOrderItems(); // Update localStorage
        updateOrderSummary(); // Refresh the order summary table
    });

    /* Function to save current order items to localStorage */
    function saveOrderItems() {
        localStorage.setItem('orderItems', JSON.stringify(orderItems));
    }

    /* Function to update the order summary table with current order items */
    function updateOrderSummary() {
        orderSummaryTable.innerHTML = '';
        let total = 0;
        orderItems.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.productName}</td>
                <td>${item.quantity}</td>
                <td>Rs. ${item.pricePerUnit}</td>
                <td>Rs. ${item.totalPrice}</td>
            `;
            orderSummaryTable.appendChild(row);
            total += parseFloat(item.totalPrice);
        });
        totalPriceElement.textContent = `Rs. ${total.toFixed(2)}`;
    }

    /* Call to initially populate the order summary table on page load */
    updateOrderSummary();
});
