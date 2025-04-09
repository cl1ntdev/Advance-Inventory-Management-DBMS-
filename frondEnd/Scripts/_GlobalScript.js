const getSuppliers = async() =>{
    var result = await fetch('http://127.0.0.1:8080/suppliers')
    var suppliers = await result.json();
    return suppliers
}

const getProducts = async() =>{
    var result = await fetch('http://127.0.0.1:8080/products')
    var products = await result.json();
    return products
}

var role_base_cont = document.querySelector('.role-base-content')
var _global_current_suppliers;



//  SCIRTPS
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
                    <input type="text" class="custom-supplier-name-contact" placeholder="Contact Info">
                    <p onclick="removeElement(this)">Remove</p>

                </div>
            `;
            suppShowPane.insertAdjacentHTML('beforeend', customSupplier);
            break;
         case "custom-sup-only":
            var customSupplier = `
                <div class="supplier-show">
                    <input type="text" class="custom-supplier-name" placeholder="Custom Supplier Name">
                    <input type="text" class="custom-supplier-name-contact" placeholder="Contact Info">
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



