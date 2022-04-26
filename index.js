const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ConnectionReadyEvent } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const app = express();
const port = process.env.PORT || 5000;


// ________ Middleware ________
app.use(cors());
app.use(express.json());


// ___________________ Secreate Password ___________________
const uri = "mongodb+srv://dbuser1:v9HiH7L8auI6Tzxu@cluster0.ztkh1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



// _____________________ main function ______________________
async function run() {
    try {
        await client.connect();
        const userCollection = client.db('foodExpress').collection('user');





        // 1111111. received user from client site and POST user in database
        app.post('/user', async (req, res) => {
            const newUser = req.body;
            const result = await userCollection.insertOne(newUser);
            // console.log(result)
            res.send(result);
        })


        // ____________ 2222222. to get multiple data from database __________
        app.get('/user', async (req, res) => {
            const query = {};
            const cursor = userCollection.find(query);
            console.log(cursor)
            // ডাটাবেস থেকে যে ডাটাগুলো পাবো সেটাকে টু এ্যারেতে কনভার্ট করতে হবে।
            const users = await cursor.toArray();
            res.send(users)
        })


        // 3333333. ________ to Delete a user in database ________
        app.delete('/user/:id', async (req, res) => {
            // client side থেকে fetch এ করে যে dynamic আইডি পাঠানো হয়েছে সেটাকে req থেকে বের করে id নামক ভ্যারিয়েবলে রাখা হয়েছে।
            const id = req.params.id;
            // query করার আগে অবশ্যই অবজেক্ট আইডিকে Mongodb থেকে require করে নিতে হবে।
            // console.log(id)
            const query = { _id: ObjectId(id) };

            // Video: 8
            const result = await userCollection.deleteOne(query);
            console.log(result)
            res.send(result);
        })



        // 4 _____________ for Update User ______________
        app.get('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await userCollection.findOne(query);
            res.send(result);
        })

        // _______________ for Update User _______________
        app.put('/user/:id', async (req, res) => {
            const id = req.params.id;
            const updatedUser = req.body;

            // এবার আমরা যাকে আপডেট করতে চাই তাকে আইডি দিয়ে খুঁজে বের করবো ডেটাবেস থেকে।
            const filter = { _id: ObjectId(id) };

            // এবার আমরা upsert ব্যবহার করবো। upsert এর কাজ হলো আমরা যে Deta টা আপডেট করবো সেটি database এ already থাকলে সেটাকে update করবে আর না থাকলে নতুন একটা insert করবে।
            const options = { upsert: true };

            // updated entry. এখানে, আমাদের আপডেটেড ডাটাগুলা ডেটাবেজ এ সেট করছি। এখানে আমরা name, email  আলাদা আলাদাভাবে না পাঠিয়ে সরাসরি বডিটাকেও পাঠাতে পারতাম।
            const updateDoc = {
                $set: {
                    name: updatedUser.name,
                    email: updatedUser.email
                }
            };

            const result = await userCollection.updateOne(filter, updateDoc, options);
            res.send(result);

        })

    }
    finally {

    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Hello World New')
});


app.listen(port, () => {
    console.log('my crud server is running', port)
})