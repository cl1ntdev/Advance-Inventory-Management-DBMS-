const crud = (element) => {
    console.log('tes')
    currentCrud = element.innerHTML.trim();
    console.log(currentSideBar)
    if(currentSideBar == "Product"){
        fillPane()
    }else if(currentSideBar == "Supplier"){
        fillPaneSupplier();
    }else if (currentSideBar == "Users"){
        fillPaneUser()
    }else if(currentSideBar == "Product Supplier"){
        fillPaneProductSupplier();
    }else if(currentSideBar == "Report"){
        fillPaneReports()
    }else if(currentSideBar == "Normalized"){
        AllNormalizedData();
    }else if(currentSideBar == "Normalize Process"){
        NormalizeProcessPane();
    }
}
// Add, View, Update, Delete

const fillPane = async() =>{

    try{
        var currentSuppliers = await getSuppliers(); 
        _global_current_suppliers = currentSuppliers
        console.log(currentSuppliers)
        console.log(currentCrud)
        console.log(currentSideBar)
        
        if(currentCrud == "Add" && currentSideBar == "Product"){
            role_base_cont.innerHTML = `
                    <div class="product-main-container">
                        <h1>Add product</h1>
                       <div class="product-add-details">
                           <label for="add-product-name">Product Name</label>
                           <input type="text" name="add-product-name" placeholder="Doritos"  id="product-name">
                       </div>
                       <div class="product-add-details">
                           <label for="add-product-category">Product Category</label>
                           <input type="text" name="add-product-category" placeholder="Consumables" id="product-category">
                       </div>
                       <div class="product-add-details">
                           <label for="add-product-price">Product Price</label>
                           <input type="text" name="add-product-price" placeholder="25" id="product-price">
                       </div>
                        <div class="product-add-details-suppliers">
                           <h3>Suppliers</h3>
                            <div class="supplier-show-pane">
                                <div class="supplier-show">
                                    <select name="role" id="role" class="select-input-supplier">
                                            ${currentSuppliers.map(supplier => `<option value="${supplier.Name}">${supplier.Name}</option>`).join('')}
                                    </select>
                                    <input type="text" class="stock-count" placeholder="stock count">
                                </div>
                               
                            </div>
                            
                            <div class="button-add-options">
                                <span class="addsupplier" onclick="addSupplier('sel')"> Add Existing Supplier </span>
                                <span class="addsupplier" onclick="addSupplier('custom')"> Add New Supplier </span>
                            </div>
                            

                       </div>
                       
                       <button class="add-product-submit" onclick="addProduct()">Add</button>
                    </div>
                    `
                
        }else if( currentCrud == "View" && currentSideBar == "Product"){
            var products = await getProducts();
            console.log(products)
            role_base_cont.innerHTML = `
                <div class="view-product-main">
                <h3>View Products</h3>
                <table class="product-show-table">
                        <th>
                            <tr>
                                <td>ID</td>
                                <td>Product ID</td>
                                <td>Name</td>
                                <td>Category</td>
                                <td>Price</td>
                            </tr>
                        </th>
                        <tbody class="product-table-body">
                           
                        </tbody>
                    </table>
                    </div>
            `
            var tableBody = document.querySelector('.product-table-body')
            products.forEach((product,i)=>{
                var content = `
                            <tr>
                                <td>${++i}</td>
                                <td>${product.ProductID}</td>
                                <td>${product.Name}</td>
                                <td>${product.Category}</td>
                                <td>${product.Price}</td>
                            </tr>
                `
                tableBody.insertAdjacentHTML('beforeend',content)
            })
        }else if (currentCrud == "Update" && currentSideBar == "Product"){
            var products = await getProducts();
            role_base_cont.innerHTML = `
                <div class="update-product-pane-main">
                <h3>Update Product</h3>
                <div class="product-lists">
                    <table class="product-show-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Product ID</th>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody class="product-table-body">
                            ${products.map((prod,i) => (
                                `<tr>
                                    <td>${++i}</td>
                                    <td>${prod.ProductID}</td>
                                    <td>${prod.Name}</td>
                                    <td>${prod.Category}</td>
                                    <td>${prod.Price}</td>
                                </tr>`
                            )).join('')}
                        </tbody>
                    </table>
                </div>
                <div class="update-inputs">
                    <label for="prodname">Enter Product ID</label>
                    <input type="text" name="prodname" class="product-id-update" required>
                    <label for="prodname">Enter Product Name</label>
                    <input type="text" name="prodname" class="product-name-update" required>
                    <label for="prodcategory">Enter Product Category</label>
                    <input type="text" name="prodname" class="product-category-update" required>
                    <label for="prodprice">Enter Product price</label>
                    <input type="text" name="prodname" class="product-price-update" required>
                    <button onclick="updateProduct()">Update</button>
                </div>
                </div>
            `;

        }else if (currentCrud == "Delete" && currentSideBar == "Product"){
            var products = await getProducts();
            role_base_cont.innerHTML = `
            <div class="delete-prod-main">
                <h3>Delete Product</h3>
                <div class="product-lists">
                    <table class="product-show-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Product ID</th>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody class="product-table-body">
                            ${products.map((prod,i) => (
                                `<tr>
                                    <td>${++i}</td>
                                    <td>${prod.ProductID}</td>
                                    <td>${prod.Name}</td>
                                    <td>${prod.Category}</td>
                                    <td>${prod.Price}</td>
                                </tr>`
                            )).join('')}
                        </tbody>
                    </table>
                </div>
                <div class="update-inputs">
                    <label for="prodname">Enter Product ID</label>
                    <input type="text" name="prodname" class="product-id-delete" required>
                    <button onclick="deleteProduct()">Delete</button>
                </div>
                </div>
            `;
    }
    }catch(e){
        console.log(e)
    }
    
}



const addSupplier = (value) => {
    console.log('add');
    var currentSuppliers = _global_current_suppliers;
    var suppShowPane = document.querySelector('.supplier-show-pane');

    switch (value) {
        case "sel":
            var supplier = `
                <div class="supplier-show">
                    <select name="role" class="select-input-supplier">
                        ${currentSuppliers.map(supplier => `<option value="${supplier.Name}">${supplier.Name}</option>`).join('')}
                    </select>
                    <input type="text" class="stock-count" placeholder="stock count">
                    <button class="remove-element-button" onclick="removeElement(this)">Remove</button>
                </div>
            `;
            suppShowPane.insertAdjacentHTML('beforeend', supplier);
            break;

        case "custom":
            var customSupplier = `
                <div class="supplier-show">
                    <input type="text" class="custom-supplier-name" placeholder="Custom Supplier Name">
                    <input type="text" class="stock-count" placeholder="stock count">
                    <input type="text" class="custom-supplier-name-contact" placeholder="Contact Info">
                    <button class="remove-element-button" onclick="removeElement(this)">Remove</button>
                
                </div>
            `;
            suppShowPane.insertAdjacentHTML('beforeend', customSupplier);
            break;
         case "custom-sup-only":
            var customSupplier = `
                <div class="supplier-show">
                    <input type="text" class="custom-supplier-name" placeholder="Custom Supplier Name">
                    <input type="text" class="custom-supplier-name-contact" placeholder="Contact Info">
                    <button class="remove-element-button" onclick="removeElement(this)">Remove</button>
                </div>
            `;
            suppShowPane.insertAdjacentHTML('beforeend', customSupplier);
            break;
    }
}






