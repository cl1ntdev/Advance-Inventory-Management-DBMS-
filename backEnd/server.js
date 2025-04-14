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

    const customSuppliers = suppliers.filter(s => s.contactInfo);

    const qProduct = 'INSERT INTO products(Name, Category, Price) VALUES (?, ?, ?)';
    const qSuppliers = 'INSERT INTO suppliers(Name, ContactInfo) VALUES ?';
    const getProductIdQuery = 'SELECT ProductID FROM products WHERE Name = ? ORDER BY ProductID DESC LIMIT 1';
    const getSupplierIdsQuery = 'SELECT SupplierID, Name FROM suppliers WHERE Name IN (?)';
    const linkProductSupplier = 'INSERT INTO supplierproducts(SupplierID, ProductID) VALUES ?';

    const con = await pool.getConnection();

    try {
        // 1. Insert product
        const [productResult] = await con.execute(qProduct, [pName, pCat, pPrice]);

        // 2. Get the inserted ProductID
        const [productRows] = await con.execute(getProductIdQuery, [pName]);
        const productID = productRows[0]?.ProductID;

        // 3. Insert only custom suppliers
        if (customSuppliers.length > 0) {
            const supplierValues = customSuppliers.map(s => [s.name, s.contactInfo]);
            await con.query(qSuppliers, [supplierValues]);
        }

        // 4. Get SupplierIDs for custom suppliers
        const supplierNames = customSuppliers.map(s => s.name);
        const [supplierRows] = await con.query(getSupplierIdsQuery, [supplierNames]);

        // 5. Insert into supplierproducts
        const supplierProductValues = supplierRows.map(supplier => [supplier.SupplierID, productID]);
        if (supplierProductValues.length > 0) {
            await con.query(linkProductSupplier, [supplierProductValues]);
        }

        con.release();
        res.json({ message: 'Product and custom suppliers inserted successfully.' });
    } catch (e) {
        con.release();
        console.error(e);
        res.status(500).json({ error: 'Database insertion failed.' });
    }
});

//delete product
app.post('/delete-product', async(req,res)=>{
    console.log(req.body)
    const {id} = req.body;
    const query2 = "delete from products where ProductID = ?"
    const query1 = "delete from supplierproducts where ProductID = ?"
    try{
        const con = await pool.getConnection();
        await con.execute(query1,[id])
        await con.execute(query2,[id])
        con.release()
        console.log('deleted successfully')
    }catch(e){
        console.log(e)
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
    const query = `
        SELECT 
            sales.SaleID,
            sales.TotalAmount,
            sales.QuantitySold,
            sales.SaleDate,
            products.Name AS ProductName,
            products.Price,
            suppliers.Name AS SupplierName
        FROM 
            sales
        JOIN 
            products ON sales.ProductID = products.ProductID
        JOIN 
            supplierproducts ON products.ProductID = supplierproducts.ProductID
        JOIN 
            suppliers ON supplierproducts.SupplierID = suppliers.SupplierID
    `;

    try {
        const con = await pool.getConnection();
        const [result] = await con.execute(query);
        con.release();
        res.json(result);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Failed to fetch sales data" });
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

app.post('/product-info-to-sell',async(req,res)=>{
    
    const {productName} = req.body
    const query = "select * from products where ProductID = ?";
    try{
        var con = await pool.getConnection();
        if(con!=null){
            var [result] = await con.execute(query,[productName])
            console.log(result)
            con.release();
            res.json(result)
        }
    }catch(e){
        console.log(e)
    }
})

// selllllllllllll

app.post('/sell-product', async (req, res) => {
    console.log(req.body)
    const { allProdSaleInfo } = req.body;
    
    try {
        // Create database connection
        const con = await pool.getConnection();
        
        try {
            // Begin transaction
            await con.beginTransaction();
            
            // Process each product sale
            for (const sale of allProdSaleInfo) {
                const { ProductName, Price, Amount, Total, SaleDate } = sale;
                
                // Get ProductID by ProductName
                const [productResult] = await con.query(
                    'SELECT ProductID FROM Products WHERE Name = ?',
                    [ProductName]
                );
                
                if (!productResult.length) {
                    throw new Error(`Product ${ProductName} not found`);
                }
                
                const ProductID = productResult[0].ProductID;
                
                // Insert into Sales table
                await con.query(
                    `INSERT INTO Sales (ProductID, QuantitySold, SaleDate, TotalAmount)
                    VALUES (?, ?, ?, ?)`,
                    [ProductID, Amount, SaleDate, Total]
                );
                
                // Update Stock quantity
                await con.query(
                    `UPDATE Stock 
                    SET QuantityAdded = QuantityAdded - ? 
                    WHERE ProductID = ?`,
                    [Amount, ProductID]
                );
            }
            
            // Commit transaction
            await con.commit();
            res.status(200).json({ message: 'Sales recorded successfully' });
            
        } catch (error) {
            // Rollback transaction on error
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












