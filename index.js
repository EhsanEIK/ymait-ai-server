const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@clusteryng.hkriv30.mongodb.net/?retryWrites=true&w=majority&appName=ClusterYNG`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const YMAITAIDB = client.db("YMAITAIDB");
        const pcDataCollection = YMAITAIDB.collection("pcDataTable");

        // GET: retrieve pc data from the db
        app.get('/pcData', async (req, res) => {
            const query = {};
            const cursor = pcDataCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

        // POST: save pc data to the db
        app.post('/pcData', async (req, res) => {
            const pcData = req.body;
            const result = await pcDataCollection.insertOne(pcData);
            res.send(result);
        })

        // DELETE: delete pc data from db
        app.delete('/pcData/:id', async (req, res) => {
            const pcData = req.params.id;
            const query = { _id: new ObjectId(pcData) };
            const result = await pcDataCollection.deleteOne(query);
            res.send(result);

        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Welcome To The YMA-IT AI Server');
})

app.listen(port, () => {
    console.log('Process is running on the Port:', port);
})