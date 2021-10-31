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
        // insert order to mongodb
        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await collectionOrder.insertOne(order);
            res.json(result);
            console.log("Documnent was inserted", result);
        });

        // Get all my orders 
        app.get('/orders', async (req, res) => {
            const orders = await collectionOrder.find({}).toArray();
            res.send(orders);
        });

        // get spacific login user order with metching email 
        app.get('/orders/:email', async (req, res) => {
            const userEmail = req.params.email;
            const query = { email: userEmail };
            const myOrders = await collectionOrder.find(query).toArray();
            console.log(myOrders);
            res.send(myOrders);
        });

        // Cancel or delete a order 
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await collectionOrder.deleteOne(query);
            console.log('deleted order complete ', result);
            res.json(result);
        });

        // get single order using id 
        /*  app.get('/manage/:id', async (req, res) => {
             const id = req.params.id;
             const query = { _id: ObjectId(id) };
             const order = await collectionOrder.findOne(query);
             console.log('Find order with id: ', id);
             res.send(order);
         }) */

        //update a single services

        app.put('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const updatedOrder = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateStatus = {
                $set: {
                    status: updatedOrder.status
                },
            };
            const result = await collectionOrder.updateOne(filter, updateStatus, options)
            console.log('updated Successful: ', id);
            res.json(result)
        })

    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Running Tourism Server Online');
});
app.listen(process.env.PORT || port, () => {
    console.log('Running Tourism server, port:', port);
});
