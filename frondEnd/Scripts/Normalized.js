const AllNormalizedData = async () => {
    const products = await getProducts();
    const roles = await getRoles();
    const sales = await getSales();
    const stocks = await getStocks();
    const supplierProducts = await getAllSupplierProducts();
    const suppliers = await getSuppliers();
    const users = await getUsers();

    const formatDate = (dateStr) => new Date(dateStr).toISOString().split('T')[0];

    role_base_cont.innerHTML = `
    <div class="normalized-table">

      <div class="table-array-cont">
        <h3>Products</h3>
        <table>
          <thead>
            <tr><th>ProductID</th><th>Name</th><th>Category</th><th>Price</th></tr>
          </thead>
          <tbody>
            ${products.map(p => `
              <tr>
                <td>${p.ProductID}</td>
                <td>${p.Name}</td>
                <td>${p.Category}</td>
                <td>${p.Price}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div class="table-array-cont">
        <h3>Roles</h3>
        <table>
          <thead>
            <tr><th>RoleID</th><th>RoleName</th></tr>
          </thead>
          <tbody>
            ${roles.map(r => `
              <tr>
                <td>${r.RoleID}</td>
                <td>${r.RoleName}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div class="table-array-cont">
        <h3>Sales</h3>
        <table>
          <thead>
            <tr><th>SaleID</th><th>ProductID</th><th>QuantitySold</th><th>SaleDate</th><th>TotalAmount</th></tr>
          </thead>
          <tbody>
            ${sales.map(s => `
              <tr>
                <td>${s.SaleID}</td>
                <td>${s.ProductID}</td>
                <td>${s.QuantitySold}</td>
                <td>${formatDate(s.SaleDate)}</td>
                <td>${s.TotalAmount}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div class="table-array-cont">
        <h3>Stocks</h3>
        <table>
          <thead>
            <tr><th>StockID</th><th>ProductID</th><th>SupplierID</th><th>QuantityAdded</th><th>DateAdded</th></tr>
          </thead>
          <tbody>
            ${stocks.map(s => `
              <tr>
                <td>${s.StockID}</td>
                <td>${s.ProductID}</td>
                <td>${s.SupplierID}</td>
                <td>${s.QuantityAdded}</td>
                <td>${formatDate(s.DateAdded)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div class="table-array-cont">
        <h3>SupplierProducts</h3>
        <table>
          <thead>
            <tr><th>ID</th><th>SupplierID</th><th>ProductID</th></tr>
          </thead>
          <tbody>
            ${supplierProducts.map(sp => `
              <tr>
                <td>${sp.ID}</td>
                <td>${sp.SupplierID}</td>
                <td>${sp.ProductID}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div class="table-array-cont">
        <h3>Suppliers</h3>
        <table>
          <thead>
            <tr><th>SupplierID</th><th>Name</th><th>ContactInfo</th></tr>
          </thead>
          <tbody>
            ${suppliers.map(s => `
              <tr>
                <td>${s.SupplierID}</td>
                <td>${s.Name}</td>
                <td>${s.ContactInfo}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div class="table-array-cont">
        <h3>Users</h3>
        <table>
          <thead>
            <tr><th>UserID</th><th>Username</th><th>Password</th><th>RoleID</th></tr>
          </thead>
          <tbody>
            ${users.map(u => `
              <tr>
                <td>${u.UserID}</td>
                <td>${u.Username}</td>
                <td>${u.Password}</td>
                <td>${u.RoleID}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

    </div>
    `;
};
