// Add, View, Update, Delete

const fillPaneSupplier = async() =>{

    try{
        var currentSuppliers = await getSuppliers(); 
        _global_current_suppliers = currentSuppliers
        console.log(currentSuppliers)
        console.log(currentCrud)
        console.log(currentSideBar)
        
        if(currentCrud == "Add" && currentSideBar == "Supplier"){
            role_base_cont.innerHTML = `
            <div class="add-supplier-main">
                <h1>Add Supplier</h1>
                <div action="">
                  
                    <div class="product-add-details-suppliers">
                        <div class="supplier-show-pane">
                            <div class="supplier-show">
                               
                            </div>
                           
                        </div>
                        
                        
                        <span class="addsupplier" onclick="addSupplier('custom-sup-only')">+Add Custom Supplier </span>

                   </div>
                   
                   <button class="addsupplier" onclick="addSupplierDb()">Add</button>
                </div>
            </div>
                `
                
        }else if( currentCrud == "View" && currentSideBar == "Supplier"){
            var suppliers = await getSuppliers();
            role_base_cont.innerHTML = `
            <div class="view-supplier-main">
                <h3>View Supplier</h3>

                <table class="product-show-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Supplier ID</th>
                                <th>Name</th>
                                <th>ContactInfo</th>
                            </tr>
                        </thead>
                        <tbody class="product-table-body">
                           
                        </tbody>
                    </table>
                    </div>
            `
            var tableBody = document.querySelector('.product-table-body')
            suppliers.forEach((supplier,i)=>{
                var content = `
                            <tr>
                                <td>${++i}</td>
                                <td>${supplier.SupplierID}</td>
                                <td>${supplier.Name}</td>
                                <td>${supplier.ContactInfo}</td>
                            </tr>
                `
                tableBody.insertAdjacentHTML('beforeend',content)
            })
        }else if (currentCrud == "Update" && currentSideBar == "Supplier"){
            var suppliers = await getSuppliers();
            role_base_cont.innerHTML = `
                <div class="update-supplier-pane-main">
                <h3>Update Supplier</h3>
                <div class="product-lists">
                    <table class="product-show-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Supplier ID</th>
                                <th>Name</th>
                                <th>Contact Info</th>
                            </tr>
                        </thead>
                        <tbody class="product-table-body">
                            ${suppliers.map((prod,i) => (
                                `<tr>
                                    <td>${++i}</td>
                                    <td>${prod.SupplierID}</td>
                                    <td>${prod.Name}</td>
                                    <td>${prod.ContactInfo}</td>
                                </tr>`
                            )).join('')}
                        </tbody>
                    </table>
                </div>
                <div class="update-inputs">
                    <label for="prodname">Enter Supplier ID</label>
                    <input type="text" name="prodname" class="supplier-id-update" required>
                    <label for="prodname">Edit Supplier Name</label>
                    <input type="text" name="prodname" class="supplier-name-update" required>
                    <label for="prodcategory">Edit Supplier Contact Info</label>
                    <input type="text" name="prodname" class="supplier-contact-update" required>
                    
                    <button onclick="updateSupplier()">Update</button>
                </div>
                </div>
            `;

        }else if (currentCrud == "Delete" && currentSideBar == "Supplier"){
            var suppliers = await getSuppliers();
            role_base_cont.innerHTML = `
                <div class="delete-supplier-main">
                    <h3>Delete Supplier</h3>
                    <div class="product-lists">
                        <table class="product-show-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Supplier ID</th>
                                    <th>Name</th>
                                    <th>Contact Info</th>
                                </tr>
                            </thead>
                            <tbody class="product-table-body">
                                ${suppliers.map((prod,i) => (
                                    `<tr>
                                        <td>${++i}</td>
                                        <td>${prod.SupplierID}</td>
                                        <td>${prod.Name}</td>
                                        <td>${prod.ContactInfo}</td>
                                    </tr>`
                                )).join('')}
                            </tbody>
                        </table>
                    </div>
                    <div class="update-inputs">
                         <div class="update-inputs">
                        <label for="prodname">Enter Supplier ID</label>
                        <input type="text" name="prodname" class="supplier-id-delete" required>
                        <button onclick="deleteSupplier()">Delete</button>
                    </div>
                    </div>
                </div>
            `;
    }
    }catch(e){
        console.log(e)
    }
    
}












