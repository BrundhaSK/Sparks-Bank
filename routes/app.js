const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
require("./db/conn");
const hbs = require("hbs");
const Customer = require("./models/create_acc");
const Transaction = require("./models/transfer");
const alert = require('alert');

const app = express();
const port = process.env.PORT || 3000;

//setting the path
const staticpath = path.join(__dirname, "../public");
const templatepath = path.join(__dirname, "../templates/views");
const partialpath = path.join(__dirname, "../templates/partial");

//middleware
app.use('/css', express.static(path.join(__dirname, "../node_modules/bootstrap/dist/css")));
app.use('/js', express.static(path.join(__dirname, "../node_modules/bootstrap/dist/js")));
app.use('/jq', express.static(path.join(__dirname, "../node_modules/jquery/dist")));

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json());
app.use(express.static(staticpath))
app.set("view engine", "hbs");
app.set("views", templatepath);
hbs.registerPartials(partialpath);

// routing
// app.get(path,callback)
app.get("/",(req,res) => {
    res.render("index");
})

app.get("/create_acc",(req,res) => {
    res.render("create_acc");
})

const createDummy = [
    {
        "first_name": 'Aaron', 
        "last_name": 'Alford', 
        "gender": 'male', 
        "email":'aaronalford@gmail.com', 
        "phone":'9871654321',
        "acc_balance":2000
    },
    {
        "first_name": 'Charlotte', 
        "last_name": 'Tyrell', 
        "gender": 'female', 
        "email":'charlottetyrell@gmail.com', 
        "phone":'9877542321',
        "acc_balance":2000
    },
    {
        "first_name": 'Olivia', 
        "last_name": 'ygritte', 
        "gender": 'female', 
        "email":'oliviaygritte@gmail.com', 
        "phone":'9176544321',
        "acc_balance":2000
    },
    {
        "first_name": 'Fabian', 
        "last_name": 'walker', 
        "gender": 'male', 
        "email":'fabianwalker@gmail.com', 
        "phone":'9820534322',
        "acc_balance":2000
    },
    {
        "first_name": 'Emilia', 
        "last_name": 'Clarke', 
        "gender": 'female', 
        "email":'emiliaclarke@gmail.com', 
        "phone":'98765333280',
        "acc_balance":2000
    },
    {
        "first_name": 'Harold', 
        "last_name": 'Ness', 
        "gender": 'male', 
        "email":'Haroldness@gmail.com', 
        "phone":'7876539324',
        "acc_balance":2000
    },
    {
        "first_name": 'Amelia', 
        "last_name": 'Klint', 
        "gender": 'female', 
        "email":'ameliaklint@gmail.com', 
        "phone":'9876533321',
        "acc_balance":2000
    },
    {
        "first_name": 'Heisen', 
        "last_name": 'Clinft', 
        "gender": 'male', 
        "email":'heisenclinft@gmail.com', 
        "phone":'9876531190',
        "acc_balance":2000
    },
    {
        "first_name": 'Sedrick', 
        "last_name": 'Degory', 
        "gender": 'male', 
        "email":'sedrickdegory@gmail.com', 
        "phone":'9876500076',
        "acc_balance":2000
    },
    {
        "first_name": 'Alias', 
        "last_name": 'carlos', 
        "gender": 'female', 
        "email":'aliascorlos@gmail.com', 
        "phone":'9876743240',
        "acc_balance":2000
    }
]
    

app.post("/created", async(req,res) => {
    try{
        //res.send(req.body);
        const customerData = new Customer({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            gender: req.body.gender,
            email: req.body.email,
            phone: req.body.phone,
            acc_balance: req.body.acc_balance
        });
        await customerData.save();
        res.status(201).render("index");
    } catch(error){
        res.status(500).send(error);
    }
})

app.get("/transaction",(req,res) => {
    res.render("transaction");
})  

app.get('/view_customers', async(req, res) => {
    await Customer.find((err, Customer) => {
    if(!err) {
        res.render('view_customers',{customerData : Customer});
    }
    else{
        console.log('Error in customers: '+ err);
    }
    });
})

app.get('/select', async(req, res) => {
    await Customer.find((err, Customer) => {
    if(!err) {
        res.render('select',{customerData : Customer});
    }
    else{
        console.log('Error in customers: '+ err);
    }
    });
})

app.post('/customer/:id', async (req,res)=>{
    const { id } = req.params;
    const customers = await Customer.findById(id);
    res.render('transfer', {customers});
})

app.post('/transfer', async(req, res) => {
    console.log(req.body);
    const transferFrom = req.body.Sender;
    const transferTo = req.body.receipient;
    const amount = req.body.amount;

    console.log(transferFrom, transferTo, amount)

    await Customer.findOneAndUpdate({first_name: transferTo}, {$inc : {acc_balance : amount}}, {new: true})
    .then(data => {
        console.log(data)
    })

    await Customer.findOneAndUpdate({first_name: transferFrom}, {$inc : {acc_balance : -amount}}, {new: true})
    .then(data => {
        console.log(data)
    })

    .catch(err => {
        console.log(err)
    })

    const transactionData = new Transaction({
        transferFrom: req.body.Sender,
        transferTo: req.body.receipient,
        amount: req.body.amount
    })
    await transactionData.save();
    console.log(transactionData);

    res.redirect('/history')
})

app.get('/history', async(req, res) => {
    await Transaction.find((err, transaction) => {
    if(!err) {
        console.log(transaction);
        res.render('history', {transactionData : transaction});
    }
    else{
        console.log('Error in customers history: '+ err);
    }
    });
})

// server create
app.listen(port, () => {
    console.log(`server is running at port no ${port}`);
})