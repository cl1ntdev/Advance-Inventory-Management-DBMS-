async function fillPaneReports() {
    try {
        const salesReport = await getSalesReport();
        console.log(salesReport)
        // Validate salesReport
        if (!salesReport || typeof salesReport !== 'object') {
            throw new Error('Invalid sales report data');
        }

        const { products = [], totalRevenue = 0, totalUnitsSold = 0, lowStockCount = 0 } = salesReport;

        // Use backend's lowStock flag for low stock products
        console.log(products)
        const lowStockProducts = products.filter(prod => prod.LowStock);
        const sortedProductsDescending = products.sort((prodA, prodB) => parseFloat(prodB.ProductRevenue) - parseFloat(prodA.ProductRevenue));
        console.log(sortedProductsDescending);
        role_base_cont.innerHTML = `
            <div class="sales-report-container">
                <h3>Sales & Inventory Report</h3>
                
                <!-- Summary Section -->
                <div class="summary-section">
                    <div class="summary-card">
                        <h4>Total Revenue</h4>
                        <p>₱${parseFloat(totalRevenue).toFixed(2)}</p>
                    </div>
                    <div class="summary-card">
                        <h4>Total Units Sold</h4>
                        <p>${totalUnitsSold}</p>
                    </div>
                    <div class="summary-card">
                        <h4>Products in Stock</h4>
                        <p>${products.length}</p>
                    </div>
                    <div class="summary-card">
                        <h4>Low Stock Items</h4>
                        <p>${lowStockCount}</p>
                    </div>
                </div>

                <!-- Product Sales Details Table -->
                <h4>Product Sales Details</h4>
                <div class="product-lists">
                    <div class="table-wrapper">
                        <table class="product-show-table">
                            <thead>
                                <tr>
                                    <th>Product ID</th>
                                    <th>Product Name</th>
                                    <th>Suppliers</th>
                                    <th>Price</th>
                                    <th>Current Stock</th>
                                    <th>Units Sold</th>
                                    <th>Revenue</th>
                                </tr>
                            </thead>
                            <tbody class="product-table-body">
                                ${products.length > 0 ? products.map(prod => `
                                    <tr ${prod.LowStock ? 'class="low-stock"' : ''}>
                                        <td>${prod.ProductID || '-'}</td>
                                        <td>${prod.ProductName || '-'}</td>
                                        <td>${prod.SupplierNames || 'No Supplier'}</td>
                                        <td>₱${parseFloat(prod.Price || 0).toFixed(2)}</td>
                                        <td>${prod.CurrentStock || 0}</td>
                                        <td>${prod.TotalQuantitySold || 0}</td>
                                        <td>₱${parseFloat(prod.ProductRevenue || 0).toFixed(2)}</td>
                                    </tr>
                                `).join('') : `
                                    <tr>
                                        <td colspan="7">No sales data available</td>
                                    </tr>
                                `}
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Stock Summary Table -->
                <h4>Stock Summary</h4>
                <div class="stock-summary">
                    <div class="table-wrapper">
                        <table class="stock-table">
                            <thead>
                                <tr>
                                    <th>Product Name</th>
                                    <th>Suppliers</th>
                                    <th>Current Stock</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${products.length > 0 ? products.map(prod => `
                                    <tr ${prod.LowStock ? 'class="low-stock"' : ''}>
                                        <td>${prod.ProductName || '-'}</td>
                                        <td>${prod.SupplierNames || 'No Supplier'}</td>
                                        <td>${prod.CurrentStock || 0}</td>
                                        <td>${prod.LowStock ? 'Low Stock' : 'In Stock'}</td>
                                    </tr>
                                `).join('') : `
                                    <tr>
                                        <td colspan="4">No stock data available</td>
                                    </tr>
                                `}
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Low Stock Alert (if any) -->
                ${lowStockProducts.length > 0 ? `
                    <div class="low-stock-alert">
                        <h4>Low Stock Alert</h4>
                        <p>The following products need restocking:</p>
                        <ul>
                            ${lowStockProducts.map(prod => `
                                <li>${prod.ProductName || '-'} (Stock: ${prod.CurrentStock || 0}) - Suppliers: ${prod.SupplierNames || 'No Supplier'}</li>
                            `).join('')}
                        </ul>
                    </div>
                ` : ''}
            </div>`
    } catch (error) {
        console.error('Error in fillPaneReports:', error);
        role_base_cont.innerHTML = `
            <div class="error-message">
                <h3>Error Loading Report</h3>
                <p>Failed to load sales report. Please try again later.</p>
                <p>Error: ${error.message}</p>
            </div>
        `;
    }
}