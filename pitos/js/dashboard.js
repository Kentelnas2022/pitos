document.addEventListener('DOMContentLoaded', () => {
    const productModal = document.getElementById('productModal');
    const productForm = document.getElementById('productForm');
    const productList = document.getElementById('productList');
    const notification = document.getElementById('notification');
    const searchInput = document.getElementById('searchInput');
    const categorySelect = document.getElementById('categorySelect');
    const sortSelect = document.getElementById('sortSelect');
    const closeModalButton = document.querySelector('.close-button');
    const burgerMenu = document.querySelector('.burger-menu');
    const menuContent = document.getElementById('menu'); // Ensure you have this ID in your HTML

    let products = JSON.parse(localStorage.getItem('products')) || [];
    let editingProductIndex = null; // Store the index of the product being edited

    // Show modal on plus icon click
    document.querySelector('.plus-icon').addEventListener('click', () => {
        productModal.style.display = 'block';
        productForm.reset(); // Reset the form for a new product
        editingProductIndex = null; // Clear the editing index
    });

    // Close modal
    closeModalButton.addEventListener('click', () => {
        productModal.style.display = 'none';
    });

    // Toggle burger menu
    burgerMenu.addEventListener('click', () => {
        menuContent.classList.toggle('show'); // Toggle the visibility of the menu
        // Optional: you can add a class to animate the burger icon here if desired
    });

    // Handle form submission
    productForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent default form submission

        const productName = document.getElementById('productName').value;
        const price = parseFloat(document.getElementById('price').value); // Ensure price is a number
        const productImage = document.getElementById('productImage').files[0];
        const category = document.getElementById('category').value; // Get selected category

        const reader = new FileReader();
        reader.onload = (e) => {
            const newProduct = {
                name: productName,
                price: price,
                image: e.target.result, // Get the image URL
                category: category // Store the category
            };

            if (editingProductIndex !== null) {
                // Update existing product
                products[editingProductIndex] = newProduct;
                showNotification(`${productName} updated successfully!`);
            } else {
                // Add new product
                products.push(newProduct);
                showNotification(`${productName} added successfully!`);
            }

            // Store products in local storage
            localStorage.setItem('products', JSON.stringify(products));

            // Create and display the product card
            updateProductList();

            // Clear the form and hide the modal
            productForm.reset();
            productModal.style.display = 'none';
        };
        reader.readAsDataURL(productImage); // Read the uploaded file as a data URL
    });

    // Function to create product card and append to product list
    const createProductCard = (product, index) => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');

        const img = document.createElement('img');
        img.src = product.image; // Use the stored image URL

        const productInfo = document.createElement('div');
        productInfo.innerHTML = 
            `<h3>${product.name}</h3>
            <p>Price: ₱${parseFloat(product.price).toFixed(2)}</p>`; // Removed category display

        const editButton = document.createElement('button');
        editButton.classList.add('edit-button');
        editButton.textContent = 'Edit';
        editButton.onclick = () => openEditModal(index); // Pass index to open edit modal

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteProduct(productCard, index); // Pass index to delete function

        productCard.appendChild(img);
        productCard.appendChild(productInfo);
        productCard.appendChild(editButton);
        productCard.appendChild(deleteButton);

        // Hide buttons by default
        editButton.style.display = 'none';
        deleteButton.style.display = 'none';

        // Show buttons on hover
        productCard.addEventListener('mouseenter', () => {
            editButton.style.display = 'block';
            deleteButton.style.display = 'block';
        });
        productCard.addEventListener('mouseleave', () => {
            editButton.style.display = 'none';
            deleteButton.style.display = 'none';
        });

        productList.appendChild(productCard);
    };

    // Update product list display
    const updateProductList = () => {
        productList.innerHTML = ''; // Clear the existing list
        products.forEach(createProductCard); // Recreate product cards
    };

    // Function to show notifications
    const showNotification = (message) => {
        notification.textContent = message;
        notification.style.display = 'block';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000); // Hide after 3 seconds
    };

    // Function to open the edit modal
    const openEditModal = (index) => {
        const product = products[index]; // Get the product based on the index
        document.getElementById('productName').value = product.name;
        document.getElementById('price').value = product.price;
        document.getElementById('category').value = product.category;

        productModal.style.display = 'block';
        editingProductIndex = index; // Set the editing index
    };

    // Function to delete a product
    const deleteProduct = (productCard, index) => {
        products.splice(index, 1); // Remove product from array
        localStorage.setItem('products', JSON.stringify(products)); // Update local storage
        updateProductList(); // Refresh the product list
    };

    // Initial population of product cards
    updateProductList();

    // Search functionality
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredProducts = products.filter(product =>
            product.name.toLowerCase().includes(searchTerm)
        );
        productList.innerHTML = ''; // Clear existing products
        filteredProducts.forEach(createProductCard); // Display filtered products
    });

    // Handle category selection
    categorySelect.addEventListener('change', () => {
        const selectedCategory = categorySelect.value;
        const filteredProducts = products.filter(product =>
            product.category === selectedCategory || selectedCategory === 'All Categories'
        );
        productList.innerHTML = ''; // Clear existing products
        filteredProducts.forEach(createProductCard); // Display filtered products
    });

    // Sort functionality
    sortSelect.addEventListener('change', () => {
        const sortValue = sortSelect.value;
        let sortedProducts;

        switch (sortValue) {
            case 'priceLowToHigh':
                sortedProducts = [...products].sort((a, b) => a.price - b.price);
                break;
            case 'priceHighToLow':
                sortedProducts = [...products].sort((a, b) => b.price - a.price);
                break;
            case 'nameAtoZ':
                sortedProducts = [...products].sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'nameZtoA':
                sortedProducts = [...products].sort((a, b) => b.name.localeCompare(a.name));
                break;
            default:
                sortedProducts = products;
        }

        productList.innerHTML = ''; // Clear existing products
        sortedProducts.forEach(createProductCard); // Display sorted products
    });
});
