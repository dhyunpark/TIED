'use strict'

//first we import our dependencies...
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var User = require('./model/users');
var Comment = require('./model/comments')
var Group = require('./model/groups');
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
const cors = require('cors');

//and create our instances
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

var router = express.Router();

//set our port to either a predetermined port number if you have set it up, or 3001
var port = process.env.API_PORT || 3001;

//authorization method
const authCheck = jwt({
  secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        // YOUR-AUTH0-DOMAIN name e.g prosper.auth0.com
        jwksUri: "https://tied.auth0.com/.well-known/jwks.json"
    }),
    // This is the identifier we set when we created the API
    aud: 'http://tiedgroups.com',
    issuer: 'tied.auth0.com',
    algorithms: ['RS256']
});

//db config
var mongoDB = 'mongodb://Jab123:softcoop1@ds125113.mlab.com:25113/test1';
mongoose.connect(mongoDB)
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));

    //now we should configure the API to use bodyParser and look for JSON data in the request body
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    //To prevent errors from Cross Origin Resource Sharing, we will set our headers to allow CORS with middleware like so:
    app.use(function(req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');

        //and remove cacheing so we get the most recent comments
        res.setHeader('Cache-Control', 'no-cache');
        next();
    });

//now  we can set the route path & initialize the API
router.get('/', function(req, res) {
    res.json({ message: 'API Initialized!'});
});

//adding the /comments router to our /api router
router.route('/comments')
//retrieve all comments from the database
.get(function(req, res) {
    //looks at our comment schema
    Comment.find(function(err, comments) {
        if (err)
            res.send(err);
        //responds with a json object of our database comments.
        res.json(comments)
    });
})
//post new comments to the database
.post(function(req, res) {
    var comment = new Comment();
    //body parser lets us use the req.body
    comment.author = req.body.author;
    comment.text = req.body.text;

    comment.save(function(err) {
        if (err)
            res.send(err);
        res.json({ message: 'Comment successfully added!' });
    });
});

router.route('/comments/:comment_id')
//The put method gives us the chance to update our comment based on
//the ID passed to the route
 .put(function(req, res) {
      Comment.findById(req.params.comment_id, function(err, comment) {
          if (err)
            res.send(err);
          //setting the new author and text to whatever was changed. If
          //nothing was changed we will not alter the field.
          (req.body.author) ? comment.author = req.body.author : null;
          (req.body.text) ? comment.text = req.body.text : null;
          //save comment
          comment.save(function(err) {
              if (err)
                  res.send(err);
                  res.json({ message: 'Comment has been updated' });
          });
      });
 })
 //delete method for removing a comment from our database
 .delete(function(req, res) {
 //selects the comment by its ID, then removes it.
      Comment.remove({ _id: req.params.comment_id }, function(err, comment) {
          if (err)
              res.send(err);
          res.json({ message: 'Comment has been deleted' })
      })
 });

router.route('/users')
//retrieve all users from the database
.get(function(req, res) {
    //looks at our user schema
    User.find(function(err, users) {
        if (err)
            res.send(err);
            //responds with a json object of our database users.
        res.json(users)
    });
},authCheck)
//post new users to the database
.post(function(req, res) {
    var user = new User();
    //body parser lets us use the req.body
    user.user = req.body.user;
    user.password = req.body.password;
    user.firstname = req.body.firstname;
    user.lastname = req.body.lastname;
    user.email = req.body.email;
    user.uniqueId = req.body.uniqueId;

    user.save(function(err) {
        if (err)
            res.send(err);
        res.json({ message: 'User successfully added!' });
    });
},authCheck);

router.route('/users/:user_id')
  .get(function(req, res) {
    var user_id = req.params.user_id;
    var userFound = null;

    User.find(function(err,users) {
      if(err)
        res.send(err);
      users.map(function(user) {
        if (user.uniqueId === user_id) {
          userFound = user;
        }
      });
      res.json(userFound);
    });
  },authCheck)

  .post(function(req,res){
    var user_id = Number(req.params.user_id);
    var user = new User();
    user._id = user_id;
    user.save(function(err) {
      if(err)
        res.send(err);

    });
  },authCheck);

router.route('/groups')
//retrieve all groups from the database
.get((req,res) => {
    //look at the group schema
    Group.find(function(err, groups) {
        if (err)
            res.send(err);
        res.json(groups)
    });
},authCheck)
//post new group to the database
.post(function(req, res) {
    var group = new Group();
    group.name = req.body.name;
    group.description = req.body.description;
    group.img = req.body.img;

    group.save(function(err) {
        if (err)
            res.send(err);
        res.json({ message: 'Group successfully added'});
    });
},authCheck);

//Use our router configuration when we call /api
app.use('/api', router);

//starts the server and listens for requests
app.listen(port, function() {
    console.log(`api running on port ${port}`);
});
