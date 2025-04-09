var role_base_cont = document.querySelector('.role-base-content')
var _global_current_suppliers;
const crud = (element) => {
    console.log('tes')
    currentCrud = element.innerHTML.trim();
    
    fillPane()
}

const getSuppliers = async() =>{
    var result = await fetch('http://127.0.0.1:8080/suppliers')
    var suppliers = result.json();
    return suppliers
}

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
                    <form action="">
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
                                <div className="supplier-show">
                                    <select name="role" id="role" class="select-input-supplier">
                                            ${currentSuppliers.map(supplier => `<option>${supplier.Name}</option>`).join('')}
                                    </select>
                                    <input type="text" class="stock-count" placeholder="stock count">
                                </div>
                               
                            </div>
                            
                            
                            <span class="addsupplier" onclick="addSupplier('sel')">+Add More Supplier </span>
                            <span class="addsupplier" onclick="addSupplier('custom')">+Add Custom Supplier </span>

                       </div>
                       
                       <button onclick="addProduct()">Add</button>
                    </form>
                    `
                
        }else if (currentCrud == "Add" && currentSideBar == "Supplier"){
    
        }else if (currentCrud == "Add" && currentSideBar == "Users"){
            
        }
    }catch(e){
        console.log(e)
    }
    
}













//  
const addSupplier = (value) => {
    console.log('add');
    var currentSuppliers = _global_current_suppliers;
    var suppShowPane = document.querySelector('.supplier-show-pane');

    switch (value) {
        case "sel":
            var supplier = `
                <div class="supplier-show">
                    <select name="role" class="select-input-supplier">
                        ${currentSuppliers.map(supplier => `<option>${supplier.Name}</option>`).join('')}
                    </select>
                    <input type="text" class="stock-count" placeholder="stock count">
                    <p onclick="removeElement(this)">Remove</p>
                </div>
            `;
            suppShowPane.insertAdjacentHTML('beforeend', supplier);
            break;

        case "custom":
            var customSupplier = `
                <div class="supplier-show">
                    <input type="text" class="custom-supplier-name" placeholder="Custom Supplier Name">
                    <input type="text" class="stock-count" placeholder="stock count">
                    <p onclick="removeElement(this)">Remove</p>

                </div>
            `;
            suppShowPane.insertAdjacentHTML('beforeend', customSupplier);
            break;
    }
}


const removeElement = (element) => {
    element.parentElement.remove();
}

