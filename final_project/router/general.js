const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios')



public_users.post("/register", (req,res) => {
  if(req.body.username  && req.body.password ){
    let username = req.body.username
    let password = req.body.password
    users.map(user => {
      if(user.username == username){
        console.log(users)
        return res.send('Sorry a user with that username already exists')
      }
    })
    users.push({'username': username, 'password': password})
    return res.send("User " + username + " was successfuly created!")
  } else {
    return res.send('Please provide a username and password!')
  }
});


// Get the book list available in the shop
public_users.get('/',function (req, res) {
  new Promise((resolve, reject) => {
    resolve(books)
  }).then(data => {
    res.send(JSON.stringify(data))
  }).catch(error => {
    res.status(500).send("Error fetching books")
  })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  let isbn = req.params.isbn
  console.log(isbn)
  try {
    let books = await axios.get('http://localhost:5000/') 
    res.send(books.data[isbn])
  } catch(error) {
    console.error('Error fetching book', error)
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  new Promise((resolve, reject)=>{
    resolve(books)
  }).then(data=>{
    let booksByAuthor = Object.values(data).filter(book=>{
      console.log(book)
      return book.author == req.params.author
    })
    res.send(booksByAuthor)
  }).catch(error => {
    res.status(500).send("There was a problem fetching books by author" + req.params.author)
  })
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  try {
    let books = await axios.get('http://localhost:5000/')
    let booksByTitle = Object.values(books.data).filter((book) => {
      return book.title == req.params.title
    })
    res.send(booksByTitle)
  } catch (error) {
    console.error('Error fetching book', error)
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn
  return res.send(books[parseInt(isbn)].reviews)
});

module.exports.general = public_users;
