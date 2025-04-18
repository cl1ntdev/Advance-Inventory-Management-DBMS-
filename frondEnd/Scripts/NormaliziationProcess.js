const NormalizeProcessPane = async () => {
    const rawdata = await getRawData();
  
    const firstNF = [];
    console.log(rawdata)
    rawdata.forEach(item => {
        const stocks = item.stocks.split(", ").map(s => s.trim());
        const suppliers = item.supplier.split(", ").map(s => s.trim());
        const contacts = item.contactinfo.split(", ").map(c => c.trim());
      if (
        stocks.length>1 ||
        suppliers.length>1 ||
        contacts.length>1
      ) {
       
        
        for (let i = 0; i < stocks.length; i++) {
          firstNF.push({
            id: item.id,
            productname: item.productname,
            category: item.category,
            price: item.price,
            stocks: stocks[i],
            supplier: suppliers[i],
            contactinfo: contacts[i]
          });
        }
      } else {
        firstNF.push({
          id: item.id,
          productname: item.productname,
          category: item.category,
          price: item.price || "?",
          stocks: item.stocks || "?",
          supplier: item.supplier || "?",
          contactinfo: item.contactinfo || "?"
        });
      }
    });
  
    const products2NF = [];
    const productIds = new Set();
    rawdata.forEach(item => {
      if (!productIds.has(item.id)) {
        products2NF.push({
          id: item.id,
          productname: item.productname,
          category: item.category,
          price: item.price || "?"
        });
        productIds.add(item.id);
      }
    });
  
    const suppliers2NF = [];
    const supplierSet = new Set();
    let supplierCounter = 1;
    firstNF.forEach(item => {
      if (item.supplier !== "?" && !supplierSet.has(item.supplier)) {
        suppliers2NF.push({
          supplier_id: `${supplierCounter++}`,
          supplier: item.supplier,
          contactinfo: item.contactinfo
        });
        supplierSet.add(item.supplier);
      }
    });
  
    const productSupplierStocks2NF = firstNF
      .filter(item => item.supplier !== "?")
      .map(item => {
        const supplier = suppliers2NF.find(s => s.supplier === item.supplier);
        return {
          id: item.id,
          supplier_id: supplier.supplier_id, //item.supplier = supplier id
          stocks: item.stocks
        };
      });
  
    const products3NF = [...products2NF];
  
    const suppliers3NF = suppliers2NF.map(sup => ({
      supplier_id: sup.supplier_id,
      supplier_name: sup.supplier
    }));
  
    const supplierContacts3NF = suppliers2NF.map(sup => ({
      supplier_id: sup.supplier_id,
      contactinfo: sup.contactinfo
    }));
  
    console.log(productSupplierStocks2NF)
    const productSupplierStocks3NF = productSupplierStocks2NF.map(item => ({
      id: item.id,
      supplier_id: item.supplier_id,
      stocks: item.stocks
    }));
  
    role_base_cont.innerHTML = `
      <div class="normalization-process-pane">
        <h2>Raw Data</h2>
        <table border="1">
          <tr>
            <th>ID</th>
            <th>Product Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stocks</th>
            <th>Supplier</th>
            <th>Contact Info</th>
          </tr>
          ${rawdata
            .map(
              row => `
                <tr>
                  <td>${row.id}</td>
                  <td>${row.productname}</td>
                  <td>${row.category}</td>
                  <td>${row.price || "?"}</td>
                  <td>${row.stocks || "?"}</td>
                  <td>${row.supplier || "?"}</td>
                  <td>${row.contactinfo || "?"}</td>
                </tr>
              `
            )
            .join("")}
        </table>
  
        <h2>1NF: Products Table</h2>
        <table border="1">
          <tr>
            <th>ID</th>
            <th>Product ID</th>
            <th>Product Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stocks</th>
            <th>Supplier</th>
            <th>Contact Info</th>
          </tr>
          ${firstNF
            .map(
              (row,i)=> `
                <tr>
                  <td>${++i}</td>
                  <td>${row.id}</td>
                  <td>${row.productname}</td>
                  <td>${row.category}</td>
                  <td>${row.price}</td>
                  <td>${row.stocks}</td>
                  <td>${row.supplier}</td>
                  <td>${row.contactinfo}</td>
                </tr>
              `
            )
            .join("")}
        </table>
  
        <h2>2NF: Products Table</h2>
        <table border="1">
          <tr>
            <th>ID</th>
            <th>Product Name</th>
            <th>Category</th>
            <th>Price</th>
          </tr>
          ${products2NF
            .map(
              row => `
                <tr>
                  <td>${row.id}</td>
                  <td>${row.productname}</td>
                  <td>${row.category}</td>
                  <td>${row.price}</td>
                </tr>
              `
            )
            .join("")}
        </table>
  
        <h2>2NF: Suppliers Table</h2>
        <table border="1">
          <tr>
            <th>Supplier ID</th>
            <th>Supplier</th>
            <th>Contact Info</th>
          </tr>
          ${suppliers2NF
            .map(
              row => `
                <tr>
                  <td>${row.supplier_id}</td>
                  <td>${row.supplier}</td>
                  <td>${row.contactinfo}</td>
                </tr>
              `
            )
            .join("")}
        </table>
  
        <h2>2NF: Product_Supplier_Stocks Table</h2>
        <table border="1">
          <tr>
            <th>ID</th>
            <th>Product ID</th>
            <th>Supplier ID</th>
            <th>Stocks</th>
          </tr>
          ${productSupplierStocks2NF
            .map(
              (row,i) => `
                <tr>
                  <td>${++i}</td>
                  <td>${row.id}</td>
                  <td>${row.supplier_id}</td>
                  <td>${row.stocks}</td>
                </tr>
              `
            )
            .join("")}
        </table>
  
        <h2>3NF: Products Table</h2>
        <table border="1">
          <tr>
            <th>ID</th>
            <th>Product Name</th>
            <th>Category</th>
            <th>Price</th>
          </tr>
          ${products3NF
            .map(
              row => `
                <tr>
                  <td>${row.id}</td>
                  <td>${row.productname}</td>
                  <td>${row.category}</td>
                  <td>${row.price}</td>
                </tr>
              `
            )
            .join("")}
        </table>
  
        <h2>3NF: Suppliers Table</h2>
        <table border="1">
          <tr>
            <th>ID</th>
            <th>Supplier ID</th>
            <th>Supplier Name</th>
          </tr>
          ${suppliers3NF
            .map(
              (row,i) => `
                <tr>
                  <td>${++i}</td>
                  <td>${row.supplier_id}</td>
                  <td>${row.supplier_name}</td>
                </tr>
              `
            )
            .join("")}
        </table>
  
        <h2>3NF: Supplier_Contacts Table</h2>
        <table border="1">
          <tr>
            <th>ID</th>
            <th>Supplier ID</th>
            <th>Contact Info</th>
          </tr>
          ${supplierContacts3NF
            .map(
              (row,i) => `
                <tr>
                  <td>${++i}</td>
                  <td>${row.supplier_id}</td>
                  <td>${row.contactinfo}</td>
                </tr>
              `
            )
            .join("")}
        </table>
  
        <h2>3NF: Product_Supplier_Stocks Table</h2>
        <table border="1">
          <tr>
            <th>ID</th>
            <th>Product ID</th>
            <th>Supplier ID</th>
            <th>Stocks</th>
          </tr>
          ${productSupplierStocks3NF
            .map(
              (row,i) => `
                <tr>
                  <td>${++i}</td>
                  <td>${row.id}</td>
                  <td>${row.supplier_id}</td>
                  <td>${row.stocks}</td>
                </tr>
              `
            )
            .join("")}
        </table>
      </div>
    `;
  };