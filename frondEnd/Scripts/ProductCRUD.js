const crud = (element) => {
    console.log('tes')
    currentCrud = element.innerHTML.trim();
    if(currentSideBar == "Product"){
        fillPane()
    }else if(currentSideBar == "Supplier"){
        fillPaneSupplier();
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
            <h1>Add product</h1>
                    <div action="">
                       <div class="product-add-details">
                           <label for="add-product-name">Product Name</label>
                           <input type="text" name="add-product-name" id="product-name">
                       </div>
                       <div class="product-add-details">
                           <label for="add-product-category">Product Category</label>
                           <input type="text" name="add-product-category" id="product-category">
                       </div>
                       <div class="product-add-details">
                           <label for="add-product-price">Product Price</label>
                           <input type="text" name="add-product-price" id="product-price">
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
                            
                            
                            <span class="addsupplier" onclick="addSupplier('sel')">+Add More Supplier </span>
                            <span class="addsupplier" onclick="addSupplier('custom')">+Add Custom Supplier </span>

                       </div>
                       
                       <button onclick="addProduct()">Add</button>
                    </div>
                    `
                
        }else if( currentCrud == "View" && currentSideBar == "Product"){
            var products = await getProducts();
            console.log(products)
            role_base_cont.innerHTML = `
                <table class="product-show-table">
                        <th>
                            <tr>
                                <td>Product ID</td>
                                <td>Name</td>
                                <td>Category</td>
                                <td>Price</td>
                            </tr>
                        </th>
                        <tbody class="product-table-body">
                           
                        </tbody>
                    </table>
            `
            var tableBody = document.querySelector('.product-table-body')
            products.forEach(product=>{
                var content = `
                            <tr>
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
                <h3>Update Product</h3>
                <div class="product-lists">
                    <table class="product-show-table">
                        <thead>
                            <tr>
                                <th>Product ID</th>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody class="product-table-body">
                            ${products.map(prod => (
                                `<tr>
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
            `;

        }else if (currentCrud == "Delete" && currentSideBar == "Product"){
            var products = await getProducts();
            role_base_cont.innerHTML = `
                <h3>Delete Product</h3>
                <div class="product-lists">
                    <table class="product-show-table">
                        <thead>
                            <tr>
                                <th>Product ID</th>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody class="product-table-body">
                            ${products.map(prod => (
                                `<tr>
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
            `;
    }
    }catch(e){
        console.log(e)
    }
    
}









