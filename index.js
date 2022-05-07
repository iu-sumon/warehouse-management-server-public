const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const app = express();

require('dotenv').config()
app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vc4pm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const itemCollection = client.db('warehouse').collection('item')

        //...........................CREATE........................//
        app.post('/items', async (req, res) => {
            const newItem = req.body;
            const result = await itemCollection.insertOne(newItem);
            res.send(result)
        })

        //................................READ..........................//
        app.get('/items', async (req, res) => {
            const query = {};
            const cursor = itemCollection.find(query)
            const items = await cursor.toArray()
            res.send(items)

        })

        //..........................UPDATE..........................//
        app.put('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const updatedItem = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    ...updatedItem
                }
            };
            const result = await itemCollection.updateOne(filter, updatedDoc, options);
            res.send(result)

        })







        //single data load
        app.get('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const item = await itemCollection.findOne(query);
            res.send(item)

        })






    } finally {

    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Running electronic store')
});

app.listen(port, () => {
    console.log('Listening to the port', port);
})