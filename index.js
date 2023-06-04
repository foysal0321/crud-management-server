const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
    res.send('server is running')
})

//
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.pbaqirc.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

 async function run () {
    try{
        const userCollection = client.db('nodeMongoCrud').collection('users');
       
        app.get('/users', async(req,res)=>{
            const query = {}
            const cursor =  userCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/users/:id',async(req,res)=>{
            const id = req.params.id
            const query = { _id : ObjectId(id)}
            const result = await userCollection.findOne(query)
            res.send(result)
        })

        app.post('/users', async (req,res)=>{
            const user = req.body
            console.log(user);
            const result = await userCollection.insertOne(user);
            res.send(result)
        })

        app.put('/users/:id', async (req,res)=>{
            const id = req.params.id;
            const filter = { _id: ObjectId(id)}
            const user = req.body;
            const option = {upsert : true}
            const updateUser ={
                $set :{
                    title : user.title,
                    description : user.description,
                    status : user.status
                }
            }
            const result = await userCollection.updateOne(filter, updateUser,option)
            res.send(result)
            console.log(user);
        })

        app.delete('/users/:id',async (req,res)=>{
            const id = req.params.id
            const qurty = { _id: ObjectId(id) }
            const result = await userCollection.deleteOne(qurty)
            res.send(result)
            //console.log('tring to', id);
        })
    }
    finally{

    }
 }
 run().catch(err =>console.log(err))
//
app.listen(port,() =>{
    console.log(`node-mongo-crud running ${port}`);
})

