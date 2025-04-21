import cors from 'cors';
import mysql2 from 'mysql2/promise';
import express from 'express';

const pool = mysql2.createPool({
    host:'localhost',
    user: 'root',
    password: 'clinT',
    database: 'advncinventory',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
})

const app = express()
const port = 8080;
app.use(cors({origin: '*'}));
app.use(express.json())

app.get('/home',async(req,res)=>{
    res.send("nice")
})
//get all users
app.get('/users',async(req,res)=>{
    var query = 'select * from users';
    try{
        var con = await pool.getConnection();
        if(con!=null){
            const [result] = await con.execute(query);
            con.release();
            res.json(result)
        }
    }catch(e){
        console.log(e)
    }
})


// get suppliers
app.get('/suppliers',async (req,res)=>{
    const query = "select * from suppliers";
    try{
        var con = await pool.getConnection();
        if(con!=null){
            var [result] = await con.execute(query)
            con.release();
            res.json(result)
        }
    }catch(e){
        console.log(e)
    }
})
// get products
app.get('/products',async (req,res)=>{
    const query = "select * from products";
    try{
        var con = await pool.getConnection();
        if(con!=null){
            var [result] = await con.execute(query)
            con.release();
            res.json(result)
        }
    }catch(e){
        console.log(e)
    }
})

app.get('/stock',async (req,res)=>{
    const query = "select * from stock";
    try{
        var con = await pool.getConnection();
        if(con!=null){
            var [result] = await con.execute(query)
            con.release();
            res.json(result)
        }
    }catch(e){
        console.log(e)
    }
})

//verify user
app.post('/verify-account',async(req,res)=>{
    console.log(req.body)

    const {Username, Password, Role } = req.body;
    const query = "select * from users where Username = ? and Password = ? and RoleID = ?"
    if (!Username || !Password || !Role) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
        }

    try{
        var con = await pool.getConnection();   
        if(con!=null){
            const [result] = await con.execute(query,[Username,Password,Role]);
            con.release();
            res.json(result)
           
        }
    }catch(e){
        console.log(e)
    }
})





// ABOUT PRODUC ==========
// add product

app.post('/insert-product', async (req, res) => {
    const { pName, pCat, pPrice, suppliers } = req.body;
    console.log("req body in insert prod", req.body);

    const qProduct = 'INSERT INTO Products(Name, Category, Price) VALUES (?, ?, ?)';
    const qSuppliers = 'INSERT INTO Suppliers(Name, ContactInfo) VALUES (?, ?)';
    const qStock = 'INSERT INTO Stock(ProductID, SupplierID, QuantityAdded, DateAdded) VALUES (?, ?, ?, ?)';
    const getProductIdQuery = 'SELECT ProductID FROM Products WHERE Name = ? ORDER BY ProductID DESC LIMIT 1';
    const getSupplierIdQuery = 'SELECT SupplierID FROM Suppliers WHERE Name = ?';
    const linkProductSupplier = 'INSERT INTO SupplierProducts(SupplierID, ProductID) VALUES ?';

    const con = await pool.getConnection();

    try {
        await con.beginTransaction();

        // 1. Insert product
        const [productResult] = await con.execute(qProduct, [pName, pCat, pPrice]);

        // 2. Get the inserted ProductID
        const [productRows] = await con.execute(getProductIdQuery, [pName]);
        const productID = productRows[0]?.ProductID;
        if (!productID) {
            throw new Error('Failed to retrieve ProductID');
        }

        // 3. Process suppliers and stock
        const supplierProductValues = [];
        const currentDate = new Date().toISOString().split('T')[0]; // Current date in YYYY-MM-DD

        for (const supplier of suppliers) {
            const supplierName = supplier.name;
            let supplierID;

            // Check if supplier already exists
            const [existingSupplier] = await con.execute(getSupplierIdQuery, [supplierName]);
            
            if (existingSupplier.length > 0) {
                supplierID = existingSupplier[0].SupplierID;
            } else {
                const contactInfo = supplier.contactInfo || null;
                const [supplierResult] = await con.execute(qSuppliers, [supplierName, contactInfo]);
                supplierID = supplierResult.insertId;
            }

            // Insert stock if provided
            if (supplier.stock) {
                await con.execute(qStock, [productID, supplierID, supplier.stock, currentDate]);
            }

            // Add to supplierProductValues for linking
            supplierProductValues.push([supplierID, productID]);
        }

        // 4. Insert into SupplierProducts
        if (supplierProductValues.length > 0) {
            await con.query(linkProductSupplier, [supplierProductValues]);
        }

        await con.commit();
        con.release();
        res.json({ message: 'Product, suppliers, and stock inserted successfully.' });

    } catch (e) {
        await con.rollback();
        con.release();
        console.error('Error inserting product:', e);
        res.status(500).json({ error: 'Database insertion failed.', details: e.message });
    }
});


//delete product
app.post('/delete-product', async(req,res)=>{
    const id = parseInt(req.body.id);
    if (isNaN(id)) return res.status(400).send('Invalid Product ID');
  
    const deleteSales = "DELETE FROM sales WHERE ProductID = ?";
    const deleteStock = "DELETE FROM stock WHERE ProductID = ?";
    const deleteSupplierProducts = "DELETE FROM supplierproducts WHERE ProductID = ?";
    const deleteProduct = "DELETE FROM products WHERE ProductID = ?";
  
    try {
      const con = await pool.getConnection();
      await con.beginTransaction();
  
      // Delete dependent records first
      await con.execute(deleteSales, [id]);
      await con.execute(deleteStock, [id]);
      await con.execute(deleteSupplierProducts, [id]);
  
      // Delete product last
      const [result] = await con.execute(deleteProduct, [id]);
  
      await con.commit();
      con.release();
  
      if (result.affectedRows === 0) {
        return res.status(404).send('Product not found or already deleted');
      }
  
      console.log('Product and related data deleted successfully');
      res.send('Product and related data deleted successfully');
    } catch (error) {
      console.error('Deletion failed:', error);
      if (con) await con.rollback();
      res.status(500).send('Server error during deletion');
    }
})

// Update product 
app.post('/update-product', async (req, res) => {
    console.log(req.body);
    const { prodID, prodName, prodCat, prodPrice } = req.body;
    const query1 = "UPDATE products SET Name = ?, Category = ?, Price = ? WHERE ProductID = ?";

    try {
        const con = await pool.getConnection();
        await con.execute(query1, [prodName, prodCat, prodPrice, prodID]);
        con.release();
        console.log('Product updated successfully');
        res.json({ message: 'Product updated successfully' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Product update failed' });
    }
});


// ABOUT SUPPLIER ==========


app.post('/insert-supplier', async(req,res)=>{
    console.log(req.body)
    // const {name,contactInfo} = req.body
    const suppliers = req.body
    const q = "insert into suppliers(Name,ContactInfo) values (?,?)"
    try{
        var con = await pool.getConnection();
        // Loop through each supplier in the array and insert them
        for (let supplier of suppliers) {
            const { name, contactInfo } = supplier;

            // Check if the required data exists (name, contactInfo)
            if (name && contactInfo) {
                await con.execute(q, [name, contactInfo]);
                console.log(`Successfully added supplier: ${name}`);
            } else {
                console.log('Missing required fields (name/contactInfo) for supplier');
            }
        }
    }catch(e){
        console.log(e)
    }
})

// Update supplier 
app.post('/update-supplier', async (req, res) => {
    console.log(req.body);
    const { supplierID,supplierName,supplierContact } = req.body;
    const query1 = "UPDATE suppliers SET Name = ?, ContactInfo = ? WHERE SupplierID = ?";

    try {
        const con = await pool.getConnection();
        await con.execute(query1, [supplierName,supplierContact,supplierID]);
        con.release();
        console.log('Supplier updated successfully');
        res.json({ message: 'Supplier updated successfully' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Product update failed' });
    }
});

//delete supplier
app.post('/delete-supplier', async(req,res)=>{
    console.log(req.body)
    const {id} = req.body;
    // const query2 = "delete from supplier where SupplierID = ?"
    const query1 = "delete from suppliers where SupplierID = ?"
    try{
        const con = await pool.getConnection();
        await con.execute(query1,[id])
        con.release()
        console.log('deleted successfully')
    }catch(e){
        console.log(e)
    }
})


// ABOUT USER
 

//get existing user
app.post('/existing-user',async(req,res)=>{
    console.log("reqbody is:",req.body)
    const {Username} = req.body
    var query = 'select Username from users where Username = ?';
    try{
        var con = await pool.getConnection();
        if(con!=null){
            const [result] = await con.execute(query,[Username]);
            con.release();
            res.json(result)
        }
    }catch(e){
        console.log(e)
    }
})

//add user
app.post('/add-user',async(req,res)=>{
    console.log("reqbody is:",req.body)
    const {Username,Password,Role} = req.body
    var RoleID = (Role == "Admin" ? 1 : Role == "Salesperson" ? 2 : 3)
    
    var query = 'insert into users(Username,Password,RoleID) values (?,?,?)';
    try{
        var con = await pool.getConnection();
        if(con!=null){
            const [result] = await con.execute(query,[Username,Password,RoleID]);
            con.release();
            res.json(result)
            console.log('successfully added user to db')
        }
    }catch(e){
        console.log(e)
    }
})


// get roles type shi
app.get('/roles',async(req,res)=>{
    const query = "select * from roles";
    try{
        var con = await pool.getConnection();
        if(con!=null){
            var [result] = await con.execute(query)
            con.release();
            res.json(result)
        }
    }catch(e){
        console.log(e)
    }
})


// update user
app.post('/update-user',async(req,res)=>{
    console.log("reqbody is:",req.body)
    const {UserID,Username,UserRole} = req.body
    var RoleID = (UserRole == "Admin" ? 1 : UserRole == "Salesperson" ? 2 : 3)
    const query = "UPDATE users SET Username = ?, RoleID = ? where UserID = ?";

    try{
        var con = await pool.getConnection();
        if(con!=null){
            const [result] = await con.execute(query,[Username,RoleID,UserID]);
            con.release();
            res.json(result)
            console.log('successfully updated user to db')
        }
    }catch(e){
        console.log(e)
    }
})

// delete user
app.post('/delete-user', async(req,res)=>{
    console.log(req.body)
    const {id} = req.body;
    // const query2 = "delete from supplier where SupplierID = ?"
    const query1 = "delete from users where UserID = ?"
    try{
        const con = await pool.getConnection();
        await con.execute(query1,[id])
        con.release()
        console.log('deleted successfully user')
    }catch(e){
        console.log(e)
    }
})





















// // SUUPLLIER PRODUCT but ids
// app.get('/supplier-product',async(req,res)=>{
//     const query = "select * from suppliers join on products where supplierproducts.SupplierID = suppliers.SupplierID";
//         try{
//             var con = await pool.getConnection();
//             if(con!=null){
//                 var [result] = await con.execute(query)
//                 con.release();
//                 res.json(result)
//             }
//         }catch(e){
//             console.log(e)
//         }
// })

// get supplier product but not the id, the top is the ids
app.get('/supplier-product', async (req, res) => {
    const query = `
        SELECT 
            sp.SupplierID,
            s.Name AS SupplierName,
            sp.ProductID,
            p.Name AS ProductName
        FROM 
            SupplierProducts sp
        JOIN 
            Suppliers s ON sp.SupplierID = s.SupplierID
        JOIN 
            Products p ON sp.ProductID = p.ProductID
    `;

    try {
        const con = await pool.getConnection();
        const [result] = await con.execute(query);
        con.release();
        res.json(result);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Failed to fetch supplier-product relations" });
    }
});


// Sales PRODUCT but ids

app.get('/sales', async (req, res) => {
    const { startDate, endDate } = req.query; // Optional date range filter

    // Build the WHERE clause for date filtering
    let dateFilter = '';
    const queryParams = [];
    if (startDate && endDate) {
        dateFilter = 'WHERE SaleDate BETWEEN ? AND ?';
        queryParams.push(startDate, endDate);
    } else if (startDate) {
        dateFilter = 'WHERE SaleDate >= ?';
        queryParams.push(startDate);
    } else if (endDate) {
        dateFilter = 'WHERE SaleDate <= ?';
        queryParams.push(endDate);
    }

    const query = `
        WITH StockSummary AS (
            SELECT 
                ProductID, 
                SUM(QuantityAdded) AS TotalStockAdded
            FROM 
                Stock
            ${endDate ? 'WHERE DateAdded <= ?' : ''}
            GROUP BY 
                ProductID
        ),
        SalesSummary AS (
            SELECT 
                ProductID,
                COALESCE(SUM(QuantitySold), 0) AS TotalQuantitySold,
                COALESCE(SUM(TotalAmount), 0) AS ProductRevenue
            FROM 
                Sales
                ${dateFilter}
            GROUP BY 
                ProductID
        ),
        ProductSales AS (
            SELECT 
                p.ProductID,
                p.Name AS ProductName,
                p.Price,
                GROUP_CONCAT(DISTINCT s.Name ORDER BY s.Name) AS SupplierNames,
                COALESCE(ss.TotalQuantitySold, 0) AS TotalQuantitySold,
                COALESCE(ss.ProductRevenue, 0) AS ProductRevenue,
                COALESCE(st.TotalStockAdded, 0) - COALESCE(ss.TotalQuantitySold, 0) AS CurrentStock
            FROM 
                Products p
            LEFT JOIN 
                SalesSummary ss ON p.ProductID = ss.ProductID
            LEFT JOIN 
                StockSummary st ON p.ProductID = st.ProductID
            LEFT JOIN 
                SupplierProducts sp ON p.ProductID = sp.ProductID
            LEFT JOIN 
                Suppliers s ON sp.SupplierID = s.SupplierID
            GROUP BY 
                p.ProductID, p.Name, p.Price, st.TotalStockAdded, ss.TotalQuantitySold, ss.ProductRevenue
        ),
        TotalRevenue AS (
            SELECT 
                COALESCE(SUM(TotalAmount), 0) AS TotalRevenue
            FROM 
                Sales
                ${dateFilter}
        )
        SELECT 
            ps.*,
            tr.TotalRevenue,
            (SELECT SUM(TotalQuantitySold) FROM ProductSales) AS TotalUnitsSold
        FROM 
            ProductSales ps
        CROSS JOIN 
            TotalRevenue tr;
    `;

    // Adjust query parameters for Stock date filter
    const finalParams = [...queryParams];
    if (endDate) {
        finalParams.splice(queryParams.length - 1, 0, endDate); // Add endDate for Stock
    }

    try {
        const con = await pool.getConnection();
        
        // Execute the combined query
        const [results] = await con.query(query, finalParams);
        
        con.release();

        // Process results
        const products = results.map(row => ({
            ProductID: row.ProductID,
            ProductName: row.ProductName,
            SupplierNames: row.SupplierNames || 'No Supplier',
            Price: parseFloat(row.Price).toFixed(2),
            CurrentStock: Math.max(row.CurrentStock, 0), // Prevent negative stock
            TotalQuantitySold: row.TotalQuantitySold,
            ProductRevenue: parseFloat(row.ProductRevenue).toFixed(2),
            LowStock: row.CurrentStock < 20 // Flag for low stock
        }));

        // Extract total revenue and units sold
        const totalRevenue = results.length > 0 ? parseFloat(results[0].TotalRevenue).toFixed(2) : '0.00';
        const totalUnitsSold = results.length > 0 ? results[0].TotalUnitsSold : 0;

        res.json({
            products,
            totalRevenue,
            totalUnitsSold,
            lowStockCount: products.filter(p => p.LowStock).length
        });
    } catch (e) {
        console.error('Error fetching sales data:', e);
        res.status(500).json({
            error: 'Failed to fetch sales data',
            details: e.message,
            sqlState: e.sqlState,
            sqlMessage: e.sqlMessage
        });
    }
});
// get sales type shi
app.get('/all-sales',async(req,res)=>{
    const query = "select * from sales";
    try{
        var con = await pool.getConnection();
        if(con!=null){
            var [result] = await con.execute(query)
            con.release();
            res.json(result)
        }
    }catch(e){
        console.log(e)
    }
})
// get supplierproduct shi
app.get('/all-supplierproducts',async(req,res)=>{
    const query = "select * from supplierproducts";
    try{
        var con = await pool.getConnection();
        if(con!=null){
            var [result] = await con.execute(query)
            con.release();
            res.json(result)
        }
    }catch(e){
        console.log(e)
    }
})

// get stokcs type shi
app.get('/all-stocks',async(req,res)=>{
    const query = "select * from stock";
    try{
        var con = await pool.getConnection();
        if(con!=null){
            var [result] = await con.execute(query)
            con.release();
            res.json(result)
        }
    }catch(e){
        console.log(e)
    }
})

app.post('/add-raw-data', async (req, res) => {
    console.log(req.body);

    const { productname, productcategory, productprice, suppliers } = req.body;

    try {
        var con = await pool.getConnection();

        // Prepare arrays to hold the supplier data
        let supplierNames = [];
        let supplierStocks = [];
        let supplierContactInfo = [];

        for (let supplier of suppliers) {
            let { name, stock, contactInfo } = supplier;

            // If no contact info is provided, get it from the database
            if (!contactInfo) {
                const getContactInfoQuery = `
                    SELECT contactinfo FROM suppliers WHERE name = ?
                `;
                const [result] = await con.query(getContactInfoQuery, [name]);

                if (result.length > 0) {
                    contactInfo = result[0].contactinfo;
                } else {
                    contactInfo = null;
                }
            }

            // Push the supplier data into arrays
            supplierNames.push(name);
            supplierStocks.push(stock);
            supplierContactInfo.push(contactInfo);
        }

        // Join the arrays into strings (comma-separated)
        const supplierNamesStr = supplierNames.join(', ');
        const supplierStocksStr = supplierStocks.join(', ');
        const supplierContactInfoStr = supplierContactInfo.join(', ');

        // Insert the data into the rawdata table
        const insertRawDataQuery = `
            INSERT INTO rawdata (productname, category, price, supplier, stocks, contactinfo)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        
        await con.query(insertRawDataQuery, [
            productname, 
            productcategory, 
            productprice, 
            supplierNamesStr, 
            supplierStocksStr, 
            supplierContactInfoStr
        ]);

        res.send('Data inserted successfully!');
    } catch (e) {
        console.log(e);
        res.status(500).send('Error inserting data');
    } finally {
        if (con) con.release();
    }
});


// get rawdata shi
app.get('/rawdata',async(req,res)=>{
    const query = "select * from rawdata";
    try{
        var con = await pool.getConnection();
        if(con!=null){
            var [result] = await con.execute(query)
            con.release();
            res.json(result)
        }
    }catch(e){
        console.log(e)
    }
})

// product info to sell


app.post('/product-info-to-sell', async (req, res) => {
    const { prodID } = req.body;

    if (!prodID) {
        return res.status(400).json({ error: 'Product ID is required' });
    }

    const query = `
        WITH StockSummary AS (
            SELECT 
                ProductID,
                COALESCE(SUM(QuantityAdded), 0) AS TotalStockAdded
            FROM 
                Stock
            GROUP BY 
                ProductID
        ),
        SalesSummary AS (
            SELECT 
                ProductID,
                COALESCE(SUM(QuantitySold), 0) AS TotalQuantitySold
            FROM 
                Sales
            GROUP BY 
                ProductID
        )
        SELECT 
            p.ProductID,
            p.Name,
            p.Category,
            p.Price,
            COALESCE(st.TotalStockAdded, 0) AS TotalStockAdded,
            COALESCE(sal.TotalQuantitySold, 0) AS TotalQuantitySold,
            COALESCE(st.TotalStockAdded, 0) - COALESCE(sal.TotalQuantitySold, 0) AS CurrentStock
        FROM 
            Products p
        LEFT JOIN 
            StockSummary st ON p.ProductID = st.ProductID
        LEFT JOIN 
            SalesSummary sal ON p.ProductID = sal.ProductID
        WHERE 
            p.ProductID = ?
    `;

    let con;
    try {
        con = await pool.getConnection();
        const [results] = await con.execute(query, [prodID]);

        if (results.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const product = results[0];
        console.log(`ProductID: ${prodID}, TotalStockAdded: ${product.TotalStockAdded}, TotalQuantitySold: ${product.TotalQuantitySold}, CurrentStock: ${product.CurrentStock}`);

        res.json({
            ProductID: product.ProductID,
            Name: product.Name,
            Category: product.Category,
            Price: parseFloat(product.Price).toFixed(2),
            CurrentStock: Math.max(product.CurrentStock, 0),
            InStock: product.CurrentStock > 0
        });
    } catch (e) {
        console.error('Error fetching product info:', e);
        res.status(500).json({
            error: 'Failed to fetch product info',
            details: e.message
        });
    } finally {
        if (con) con.release();
    }
});

// selllllllllllll
app.post('/sell-product', async (req, res) => {
    const { allProdSaleInfo } = req.body;

    try {
        const con = await pool.getConnection();

        try {
            await con.beginTransaction();

            for (const sale of allProdSaleInfo) {
                const { ProductName, Price, Amount, Total, SaleDate } = sale;

                const [productResult] = await con.query(
                    'SELECT ProductID FROM Products WHERE Name = ?',
                    [ProductName]
                );

                if (!productResult.length) {
                    throw new Error(`Product ${ProductName} not found`);
                }

                const ProductID = productResult[0].ProductID;

                let remainingAmount = Amount;

                // Fetch stocks per supplier for this product, order by available Quantity
                const [stockRows] = await con.query(
                    `SELECT StockID, SupplierID, QuantityAdded 
                     FROM Stock 
                     WHERE ProductID = ? AND QuantityAdded > 0 
                     ORDER BY QuantityAdded DESC`,
                    [ProductID]
                );

                let totalAvailable = stockRows.reduce((sum, s) => sum + s.QuantityAdded, 0);
                if (totalAvailable < remainingAmount) {
                    throw new Error(`Insufficient stock for ${ProductName}`);
                }

                for (const stock of stockRows) {
                    if (remainingAmount === 0) break;

                    const usedQuantity = Math.min(stock.QuantityAdded, remainingAmount);

                    // Insert sale record for this supplier
                    await con.query(
                        `INSERT INTO Sales (ProductID, QuantitySold, SaleDate, TotalAmount)
                         VALUES (?, ?, ?, ?)`,
                        [ProductID, usedQuantity, SaleDate, (usedQuantity * Price).toFixed(2)]
                    );

                    // Update stock
                    // await con.query(
                    //     `UPDATE Stock 
                    //      SET QuantityAdded = QuantityAdded - ? 
                    //      WHERE StockID = ?`,
                    //     [usedQuantity, stock.StockID]
                    // );

                    remainingAmount -= usedQuantity;
                }
            }

            await con.commit();
            res.status(200).json({ message: 'Sales recorded and stocks updated successfully' });

        } catch (error) {
            await con.rollback();
            throw error;
        } finally {
            con.release();
        }

    } catch (error) {
        console.error('Error processing sale:', error);
        res.status(500).json({
            error: 'Failed to process sale',
            details: error.message
        });
    }
});
























app.listen(port,()=>{
    console.log('listening on port',port)
})



// get roles 












