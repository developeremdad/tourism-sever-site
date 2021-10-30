const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const port = process.env.PORT || 5000;

// Middleware 
app.use(cors());
app.use(express.json());

// DB url setting 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eogpx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        // connect mongodb
        await client.connect();
        const database = client.db('tourismDb');
        const collectionService = database.collection('services');
        const collectionOrder = database.collection('orders');

        /*------------------
        CRUD Method Start  
        --------------------*/

        // create or insert services to database 
        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await collectionService.insertOne(service);
            res.json(result);
            console.log("Documnent was inserted", result);
        });

        // get all data from server 
        app.get('/services', async (req, res) => {
            const services = await collectionService.find({}).toArray();
            res.send(services);
        });

        //find a single data using id
        app.get('/details/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const service = await collectionService.findOne(filter);
            res.send(service);
        });



        /* --------------------------
            place order part start 
        --------------------------- */
        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await collectionOrder.insertOne(order);
            res.json(result);
            console.log("Documnent was inserted", result);
        });

    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Running Tourism Server Online');
});
app.listen(port, () => {
    console.log('Running Tourism server, port:', port);
});
