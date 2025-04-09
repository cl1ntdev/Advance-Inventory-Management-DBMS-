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


app.listen(port,()=>{
    console.log('listening on port',port)
})



