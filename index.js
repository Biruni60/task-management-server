const express=require("express")
const cors=require("cors")
require('dotenv').config()
const app =express()
const port=process.env.PORT ||5000



const corsOptions = {
  origin:[
  'http://localhost:5173',
  'https://learnbd-88548.web.app',
  'https://learnbd-88548.firebaseapp.com'
  ],
  credentials:true,
  optionSuccessStatus: 200

}
app.use(cors(corsOptions));
app.use(express.json())



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fjhyf9f.mongodb.net/?retryWrites=true&w=majority`;

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
    // await client.connect();
    

    const taskCollection=client.db("taskManager").collection("tasks")
    
    
    
    app.get('/tasks/:email', async (req, res) => {
        const email=req.params?.email 
    
      const   query={email:email}
      const result = await taskCollection.find(query).toArray();
      res.send(result);
    });
    app.delete('/delete/:id', async (req, res) => {
        const id=req.params?.id 
    
      const   query={_id:new ObjectId(id)}
      const result = await taskCollection.deleteOne(query);
      res.send(result);
    });
     
      app.put('/role', async (req, res) => {
      const data = req.body;
      console.log(data);
      const filter = { _id: new ObjectId(data.id) };
      const updatedDoc = {
        $set: {
          role: data.role
        }
      }   
      const result = await taskCollection.updateOne(filter, updatedDoc);
      res.send(result);
    })

    app.put('/update/:id', async (req, res) => {
        const item = req.body;
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) }
        const updatedDoc = {
          $set: {
                  title:item.title,
                  description:item.description,
                  priority:item.priority,
                  deadline:item.deadline,
          }
        }
  
        const result = await taskCollection.updateOne(filter, updatedDoc)
        res.send(result);
      })
    app.post('/addtasks', async (req, res) => {
      const item = req.body;
      const result = await taskCollection.insertOne(item);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})