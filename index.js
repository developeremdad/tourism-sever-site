const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config()
const { MongoClient } = require('mongodb');

// Middleware 
app.use(cors());
app.use(express.json());

// DB url setting 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eogpx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        // connected DB
        await client.connect();
        const database = client.db('tourismDb');
        const collectionService = database.collection('services');

        /*------------------
        CRUD Method Start  
        --------------------*/





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
    console.log('Running genius server on port', port);
});
