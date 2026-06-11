require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 4000;

const app = express()
const uri = process.env.MONGO_URI;

// middleware

app.use(cors());
app.use(express.json());


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

    const db = client.db('smart_db');
    const productsCollection = db.collection('product');


    // get all data

    app.get('/products',async(req,res)=>{
        const cursor = productsCollection.find();
        const result = await cursor.toArray();
        res.send(result) ;
    })

    // get single data

    app.get('/products/:id',async(req,res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await productsCollection.findOne(query);
        res.send(result);
    })

    // post data api

    app.post('/products',async(req,res)=>{
        const newProduct = req.body;
        const result = await productsCollection.insertOne(newProduct);
        res.send(result)
    })


    // update api 

    app.patch('/products/:id',async(req,res)=>{
        const id = req.params.id;
        const query = {_id : new ObjectId(id)};
        const updatedData = req.body;
        const update = {
            $set: {
                name:updatedData.name,
                price:updatedData.price
            }
        }
        const result = await productsCollection.updateOne(query,update);
        res.send(result);
    })


    // delete api 

    app.delete('/products/:id',async(req,res)=>{
        const id = req.params.id;
        const query = {_id : new ObjectId(id)}
        const result = await productsCollection.deleteOne(query);
        res.send(result);
    })






    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    
  }
}
run().catch(console.dir);




app.get('/',(req,res)=>{
    res.send("smart server is running")
});



app.listen(port,()=>{
    console.log(`Our server is running in ${port}`);
})