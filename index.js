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
        client.connect();
        const itemCollection = client.db('warehouse').collection('item')

         
        //...........................CREATE API........................//

        app.post('/items', async (req, res) => {
            const newItem = req.body;
            const result = await itemCollection.insertOne(newItem);
            res.send(result)
        })
        //........................READ API.....................//

        app.get('/items', async (req, res) => {
            const query = {};
            const cursor = itemCollection.find(query)
            const items = await cursor.toArray()
            res.send(items)

        })
         

        //....................My Item Api................//
          app.get('/myItems', async (req, res) => {
            const decodedEmail=req.decoded.email;
            const email=req.query.email;
            if(email===decodedEmail)
            {
                const query ={email:email};
                const cursor = itemCollection.find(query)
                const items = await cursor.toArray()
               
                res.send(items)
            }
           else{
               res.status(403).send({message:'forbidden access'})
           }

        })


        //..........................Decrement Quantity API..........................//
        app.put('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const updatedItem1 = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {

                    name: updatedItem1.name,
                    img: updatedItem1.img,
                    price: updatedItem1.price,
                    quantity: updatedItem1.quantity,
                    sold: updatedItem1.sold,
                    description: updatedItem1.description,
                    supplier: updatedItem1.supplier

                }
            };
            const result = await itemCollection.updateOne(filter, updatedDoc, options);
            res.send(result)

        })
        //..........................UPDATE Quantity API..........................//
        app.put('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const updatedItem2 = req.body;


            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {

                    name: updatedItem2.name,
                    img: updatedItem2.img,
                    price: updatedItem2.price,
                    quantity: updatedItem2.quantity,
                    sold: updatedItem2.sold,
                    description: updatedItem2.description,
                    supplier: updatedItem2.supplier

                }
            };
            const result = await itemCollection.updateOne(filter, updatedDoc, options);
            res.send(result)

        })

        //............................DELETE API......................//

        app.delete('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await itemCollection.deleteOne(query);
            res.send(result)

        })





        //..........................single data load API.....................//

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
    console.log('Server is ok', port);
})