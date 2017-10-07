var Db = require('mongodb').Db,
  MongoClient = require('mongodb').MongoClient,
  Server = require('mongodb').Server,
  ReplSetServers = require('mongodb').ReplSetServers,
  ObjectID = require('mongodb').ObjectID,
  Binary = require('mongodb').Binary,
  GridStore = require('mongodb').GridStore,
  Grid = require('mongodb').Grid,
  Code = require('mongodb').Code
assert = require('assert');

MongoClient.connect("mongodb://localhost:27017/telescope", function(err, db) {
  if (err) {
    return console.dir(err);
  }
  var collection = db.collection('users');
  collection.find().toArray(function(err, users) {
    let newMap = users.map((user) => {
      for (let key in user.telescope) {
        if(!user.hasOwnProperty(key) && key !== "telescope"){
          user[key] = user.telescope[key];
        }
      }
      user.telescope = null;
      delete user.telescope;
      return user;
    })
    // here ...
    let job = newMap.map(user=>{
      return collection.update({_id: user._id}, {$set: user})
    })
    Promise.all(job).then(async ()=>{
      let newx = await collection.find().toArray();
      //console.log("First user", newx)
      console.log("Everyone has slugs?", newx.some((data)=>data.hasOwnProperty("slug")))
    })
  });
});
