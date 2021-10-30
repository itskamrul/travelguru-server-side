const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const app = express();
const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.i2s3w.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

async function run() {
  try {
    await client.connect();
    const database = client.db('travelguru');
    const placeCollection = database.collection('places');
    const bookingCollection = database.collection('booking');
    const travellerPackagesCollection =
      database.collection('travellerPackages');

    //add tour place
    app.post('/addPlace', async (req, res) => {
      const place = req.body;
      const result = await placeCollection.insertOne(place);
      res.json(result);
    });

    // GET API
    app.get('/places', async (req, res) => {
      const cursor = placeCollection.find({});
      const places = await cursor.toArray();
      res.send(places);
    });
    app.get('/travellerPackages', async (req, res) => {
      const cursor = travellerPackagesCollection.find({});
      const places = await cursor.toArray();
      res.send(places);
    });

    // add booking place
    app.post('/bookingPlace', async (req, res) => {
      const bookingPlace = req.body;
      const result = await bookingCollection.insertOne(bookingPlace);

      res.send(result);
      console.log(result);
    });

    //get my booking
    app.get('/myBooking/:email', async (req, res) => {
      const result = await bookingCollection
        .find({ email: req.params.email })
        .toArray();
      res.send(result);
    });

    //get all booking
    app.get('/allBooking', async (req, res) => {
      const result = await bookingCollection.find({}).toArray();
      res.send(result);
    });

    //delete booking place
    app.delete('/deleteBooking/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const result = await bookingCollection.deleteOne({ _id: ObjectId(id) });
      res.send(result);
      console.log(result);
    });

    //update product
    app.put('/update/:id', async (req, res) => {
      const id = req.params.id;
      const updatedStatus = req.body;
      console.log(id);
      const filter = { _id: ObjectId(id) };

      bookingCollection
        .updateOne(filter, {
          $set: {
            status: updatedStatus.status,
          },
        })
        .then(result => {
          res.send(result);
          console.log(result);
        });
    });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('travel guru server running');
});

app.listen(port, () => {
  console.log('server running at ', port);
});
