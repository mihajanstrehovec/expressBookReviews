const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
users.map((user)=>{
  if(user.username === username){
    return true
  }
  return false
})

}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  let validUser = users.filter((user)=>{
    return user.username === username && user.password === password 
  })
  return validUser.length > 0

}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  let username = req.body.username
  let password = req.body.password
  if(authenticatedUser(username, password)){
    let token = jwt.sign(
      {
        data: password
      },
      'fingerprint_customer',
      {
        expiresIn: 60*60
      }
    )
    req.session.authorization = {
      token, username
    }
    return res.status(200).send("Successfuly signed in!")
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
  

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let review_username = req.session.authorization.username
  let isbn = req.params.isbn
  let new_review = req.query.review
  let update_review = false
  
  books[isbn].reviews.map((review) => {
    if(review.username === review_username){
      review.review = new_review
      console.log(books[isbn].reviews)
      update_review = true
    }
  })

  if(update_review){
    return res.status(200).send("Your review was successfully updated!")
  } else {
    books[isbn].reviews.push({
      "username": review_username,
      "review": new_review
    })
    console.log(books[isbn].reviews)
    return res.status(200).send("Your review was successfully addded!")
  }

});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn
  let review_username = req.session.authorization.username
  let updated_reviews = books[isbn].reviews.filter((review) => {
    return review.username != review_username
  })
  books[isbn].reviews = updated_reviews
  return res.status(200).send("Successfully deleted your review!")
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
