const express = require('express')
const app = express();

const admin = require("firebase-admin")
const credentials = require("./crud-firestore.json")

admin.initializeApp({
  credential: admin.credential.cert(credentials)
})

const db = admin.firestore()

app.use(express.json())

app.use(express.urlencoded({ extended: true }))

// set post and listen for our requests

app.post('/create', async (req, res) => {
  try {
    console.log(req.body)
    const id = req.body.email;
    const userJson = {
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    };
    // const response = await db.collection('users').doc(id).set(userJson);
    const response = await db.collection('users').add(userJson);
    res.send(response);
  } catch (err) {
    res.send(err)
  }
})

app.get('/read/all', async (req, res) => {
  try {
    const usersRef = db.collection('users');
    const response = await usersRef.get();
    let responseArr = [];
    response.forEach(doc => {
      responseArr.push(doc.data())
    })
    res.send(responseArr)
  } catch (err) {
    res.send(err)
  }
})

app.get('/read/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const userRef = db.collection('users').doc(id);
    const response = await userRef.get()
    res.send(response.data())
  } catch (err) {
    res.send(err)
  }
})

app.post('/update', async (req, res) => {
  try {
    const id = req.body.id;
    const newFirstName = "hello World";
    const userRef = await db.collection('users').doc(id).update({
      firstName: newFirstName,
    });
    res.send(userRef)
  } catch (err) {
    res.send(err)
  }
})

app.delete('/delete/:id', async (req, res) => {
  try {
    const response = await db.collection('users').doc(req.params.id).delete()
    res.send(response)
  } catch (err) {
    res.send(err)
  }
})


// https://www.youtube.com/watch?v=8Se_F7c03UM&list=PLSuzwxF6LC4AGZN8SrPbRkN3MrLWubOGW&index=3&ab_channel=CodewithKavit


const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}.`);
})