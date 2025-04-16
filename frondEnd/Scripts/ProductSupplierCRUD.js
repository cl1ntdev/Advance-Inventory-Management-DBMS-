
// role_base_cont
const fillPaneProductSupplier = async() =>{
    try{
        var supplierProd = await getSupplierProducts()
        console.log(supplierProd)
        role_base_cont.innerHTML = `
                <h3>Product Supplier</h3>
                <div class="product-lists">
                    <table class="product-show-table">
                        <thead>
                            <tr>
                                <th>Supplier ID</th>
                                <th>Name</th>
                                <th>Product ID </th>
                                <th>Product Name</th>
                            </tr>
                        </thead>
                        <tbody class="product-table-body">
                            ${supplierProd.map(prod => (
                                `<tr>
                                    <td>${prod.SupplierID}</td>
                                    <td>${prod.SupplierName}</td>
                                    <td>${prod.ProductID}</td>
                                    <td>${prod.ProductName}</td>
                                </tr>`
                            )).join('')}
                        </tbody>
                    </table>
                </div>
               
        `
    }catch(e){
        console.log(e)
    }
}