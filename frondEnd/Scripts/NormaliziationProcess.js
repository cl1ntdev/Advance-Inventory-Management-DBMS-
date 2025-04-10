const NormalizeProcessPane = async () => {
    const rawdata = await getRawData();
    console.log(rawdata);

    // 1NF: Split comma-separated values
    const normalized1NF = rawdata.flatMap(item => {
        const suppliers = item.supplier.split(', ');
        const stocks = item.stocks.split(', ');
        const contactinfos = item.contactinfo.split(', ');
        return suppliers.map((supplier, index) => ({
            id: item.id,
            productname: item.productname,
            category: item.category,
            price: item.price,
            supplier,
            stocks: stocks[index],
            contactinfo: contactinfos[index]
        }));
    });

    // 2NF & 3NF: Separate into tables
    const products = [{
        product_id: rawdata[0].id,
        productname: rawdata[0].productname,
        category: rawdata[0].category,
        price: rawdata[0].price
    }];

    const suppliersMap = new Map();
    const productSuppliers = [];
    normalized1NF.forEach((item) => {
        if (!suppliersMap.has(item.supplier)) {
            suppliersMap.set(item.supplier, {
                supplier_id: suppliersMap.size + 1,
                supplier_name: item.supplier,
                contactinfo: item.contactinfo
            });
        }
        productSuppliers.push({
            product_id: item.id,
            supplier_id: suppliersMap.get(item.supplier).supplier_id,
            stocks: item.stocks
        });
    });
    const suppliers = Array.from(suppliersMap.values());

    // Generate HTML with all tables
    role_base_cont.innerHTML = `
        <div class="normalize-process">
            <!-- Raw Data Table -->
            <table class="rawdata-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Product Name</th>
                        <th>Category</th>
                        <th>Supplier</th>
                        <th>Contact Info</th>
                        <th>Price</th>
                        <th>Stocks</th>
                    </tr>
                </thead>
                <tbody>
                    ${rawdata.map(item => `
                        <tr>
                            <td>${item.id}</td>
                            <td>${item.productname}</td>
                            <td>${item.category}</td>
                            <td>${item.supplier}</td>
                            <td>${item.contactinfo}</td>
                            <td>${item.price}</td>
                            <td>${item.stocks}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>

            <!-- 1NF -->
            <div class="_1nf">
                <h3>First Normal Form (1NF)</h3>
                <table class="_1nf-table-1">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Product Name</th>
                            <th>Category</th>
                            <th>Supplier</th>
                            <th>Contact Info</th>
                            <th>Price</th>
                            <th>Stocks</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${normalized1NF.map(item => `
                            <tr>
                                <td>${item.id}</td>
                                <td>${item.productname}</td>
                                <td>${item.category}</td>
                                <td>${item.supplier}</td>
                                <td>${item.contactinfo}</td>
                                <td>${item.price}</td>
                                <td>${item.stocks}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>

            <!-- 2NF -->
            <div class="_2nf">
                <h3>Second Normal Form (2NF)</h3>
                <table class="_2nf-table-1">
                    <thead>
                        <tr>
                            <th>Product ID</th>
                            <th>Product Name</th>
                            <th>Category</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${products.map(item => `
                            <tr>
                                <td>${item.product_id}</td>
                                <td>${item.productname}</td>
                                <td>${item.category}</td>
                                <td>${item.price}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <table class="_2nf-table-2">
                    <thead>
                        <tr>
                            <th>Supplier ID</th>
                            <th>Supplier Name</th>
                            <th>Contact Info</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${suppliers.map(item => `
                            <tr>
                                <td>${item.supplier_id}</td>
                                <td>${item.supplier_name}</td>
                                <td>${item.contactinfo}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <table class="2nf-table-3">
                    <thead>
                        <tr>
                            <th>Product ID</th>
                            <th>Supplier ID</th>
                            <th>Stocks</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${productSuppliers.map(item => `
                            <tr>
                                <td>${item.product_id}</td>
                                <td>${item.supplier_id}</td>
                                <td>${item.stocks}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>

            <!-- 3NF -->
            <div class="_3nf">
                <h3>Third Normal Form (3NF)</h3>
                <table class="3nf-table-1">
                    <thead>
                        <tr>
                            <th>Product ID</th>
                            <th>Product Name</th>
                            <th>Category</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${products.map(item => `
                            <tr>
                                <td>${item.product_id}</td>
                                <td>${item.productname}</td>
                                <td>${item.category}</td>
                                <td>${item.price}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <table class="3nf-table-2">
                    <thead>
                        <tr>
                            <th>Supplier ID</th>
                            <th>Supplier Name</th>
                            <th>Contact Info</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${suppliers.map(item => `
                            <tr>
                                <td>${item.supplier_id}</td>
                                <td>${item.supplier_name}</td>
                                <td>${item.contactinfo}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <table class="3nf-table-3">
                    <thead>
                        <tr>
                            <th>Product ID</th>
                            <th>Supplier ID</th>
                            <th>Stocks</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${productSuppliers.map(item => `
                            <tr>
                                <td>${item.product_id}</td>
                                <td>${item.supplier_id}</td>
                                <td>${item.stocks}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
};

