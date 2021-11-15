const express = require('express')
const cors = require('cors')
const app = express()
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;
const { MongoClient } = require('mongodb');


const port = process.env.PORT || 5000

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7ysaz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// console.log(uri);

async function run(){
    try{

        await client.connect();
        const database = client.db('nicheWebsite');
        const productsCollection = database.collection('products');
        const categoriesCollection = database.collection('categories');
        const usersCollection = database.collection('users');
        const ordersCollection = database.collection('orders');
        const reviewsCollection = database.collection('reviews');
        console.log('database connected successfully');


        // work start from here

        // Get Method Package API  E
        app.get("/products", async (req, res) => {
            const cursor = productsCollection.find({});
            const products = await cursor.toArray();
            res.json(products);
        });

          // Products Add 
          app.post('/products', async (req, res) => {
            const newProduct = req.body;
            const result = await productsCollection.insertOne(newProduct);
            res.json(result)
        })


         // get products by id 
        app.get("/products/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const products = await productsCollection.findOne(query);
            res.json(products);
          });

        
        // Delete Product 
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            console.log(("delete product with id", id));
            const query = { _id: ObjectId(id) };
            const result = await productsCollection.deleteOne(query);
            res.json(result);
        })

        
          //Categories Collection 
          app.get('/categories', async (req, res) => {
            const cursor = categoriesCollection.find({});
            const categories = await cursor.toArray();
            res.send(categories);
        });

           
          // Post Order  
          app.post('/orders', async(req, res) =>{
            const newOrder = req.body;
            const result = await ordersCollection.insertOne(newOrder);
            res.json(result)
        })
        

         // review post  
         app.post('/reviews', async (req, res) => {
            const newReview = req.body;
            const result = await reviewsCollection.insertOne(newReview);
            res.json(result)

        })

        // Get review  
        app.get('/reviews', async (req, res) => {
            const cursor = reviewsCollection.find({});
            const review = await cursor.toArray();
            res.send(review);
        });

    

         //Post For User Register  

         app.post('/users', async (req, res) => {
            const newUsers = req.body;
            const result = await usersCollection.insertOne(newUsers);
            res.json(result)
        })


         
        //   User Put Google Signin  
        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email }
            const options = { upsert: true }
            const updateDoc = { $set: user }
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            // console.log("Got New User", req.body);
            // console.log("Added User", result);
            res.json(result)
        })
        
            // Make Admin  
        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email }
            const updateDoc = { $set: { role: 'admin' } }
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result)

        })

         //Get Admin  

         app.get('/users/:email', async (req, res) => {

            const email = req.params.email;
            const query = { email: email }
            const user = await usersCollection.findOne(query);
            let isAdmin = false
            if (user?.role === 'admin') {
                isAdmin = true
            }
            res.json({ admin: isAdmin })

        })
        
        //UPDATED API  

        app.put('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const updateOrder = req.body;
            const filter = { _id: ObjectId(id) };
            // const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: updateOrder.status
                }
            };
            const result = await ordersCollection.updateOne(filter, updateDoc);
            console.log(req.body);
            res.json(result)

        })

        //Use Query for My Order 
        app.get('/orders/product', async (req, res) => {
            const search = req.query.email;
            console.log(req.query.search);
            const query = { userEmail: search }
            const cursor = await ordersCollection?.find(query);
            const orders = await cursor.toArray();
            res.send(orders)

        });

        //Get Order  
        app.get('/orders', async (req, res) => {
            const cursor = ordersCollection.find({})
            const orders = await cursor.toArray()
            res.send(orders)
        })

        //Delete Order  
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            console.log(("delete product with id", id));
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);
            res.json(result);

        })


    }

    finally{
        // await client.close();
    }

}

run().catch(console.dir);






app.get('/', (req, res) => {
  res.send('Hello carhouse')
})

app.listen(port, () => {
    console.log('Running server on port', port);
})