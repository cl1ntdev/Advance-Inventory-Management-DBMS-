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


app.listen(port,()=>{
    console.log('listening on port',port)
})



