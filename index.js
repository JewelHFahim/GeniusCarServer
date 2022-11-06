const express = require('express');
const app = express();
const jwt = require('jsonwebtoken')
const port = process.env.PORT = 5000;
const cors = require('cors');
const { MongoClient, ServerApiVersion, CURSOR_FLAGS, ObjectId } = require('mongodb');
require('dotenv').config()



app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.qez1k8e.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
    try{
        const serviceCollection = client.db('geniusCar').collection('services');
        const orderCollection = client.db('geniusCar').collection('orders');

        // JWT Start
        app.post('/jwt', (req, res)=>{
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1h'});
            res.send({token});
        }) 
        // JWT End


        app.get('/services', async(req, res)=>{
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })

        app.get('/services/:id', async(req, res)=>{
            const id = req.params.id;
            // console.log(id);
            const query = {_id: ObjectId(id)};
            const service = await serviceCollection.findOne(query);
            res.send(service);
        })

        // order api
        app.post('/orders', async(req, res)=>{
            console.log(req.headers.authorization);
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.send(result);
        })

        app.get('/orders', async(req, res)=>{
            // console.log(req.headers.authorization);
            const id = req.params.id;
            let query = {};
            if(req.query.email){
                query = {
                    email: req.query.email
                }
            }
            const cursor = orderCollection.find(query);
            const orders = await cursor.toArray();
            res.send(orders)
        })

        app.delete('/orders/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await orderCollection.deleteOne(query);
            res.send(result);
        })

        app.patch('/orders/:id', async(req, res)=>{
            const id = req.params.id;
            const status = req.body.status;
            const query = {_id: ObjectId(id)};
            const updatedDoc = {
                $set:{
                    status: status
                }
            }
            const result = await orderCollection.updateOne(query, updatedDoc);
            res.send(result);
            console.log(result);
        })

    }
    finally{

    }
}
run().catch(error=>{console.error(error);})

app.get('/', (req, res)=>{
    res.send('API Working....!');
})

app.listen(port, ()=>{
    console.log('Working on:', port);
})