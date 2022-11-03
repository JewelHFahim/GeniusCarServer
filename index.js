const express = require('express');
const app = express();
const port = process.env.PORT = 5000;
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()



app.use(cors());
app.use(express.json());

// password: Q7k5HMz4xFsiOu3f
// user id: genius-car process.env.DB_USER process.env.DB_PASSWORD

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.qez1k8e.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});


app.get('/', (req, res)=>{
    res.send('API Working....!');
})

app.listen(port, ()=>{
    console.log('Working on:', port);
})