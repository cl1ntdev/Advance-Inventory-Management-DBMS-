

const fillPaneReports = async() =>{
    var salesReport = await getSalesReport();
    console.log(salesReport)
    role_base_cont.innerHTML = `
    <h3>Sales Report Product</h3>
    <div class="product-lists">
        <table class="product-show-table">
            <thead>
                <tr>
                    <th>Sales ID</th>
                    <th>Product Name</th>
                    <th>SaleDate</th>
                    <th>Price</th>
                    <th>Quantity Sold</th>
                    <th>Revenue</th>
                    <th>Supplier Name</th>
                </tr>
            </thead>
            <tbody class="product-table-body">
                ${salesReport.map(prod => (
                    `<tr>
                        <td>${prod.SaleID}</td>
                        <td>${prod.ProductName}</td>
                        <td>${prod.SaleDate}</td>
                        <td>${prod.Price}</td>
                        <td>${prod.QuantitySold}</td>
                        <td>${prod.TotalAmount}</td>
                        <td>${prod.SupplierName}</td>
                    </tr>`
                )).join('')}
            </tbody>
        </table>
    </div>`
}
