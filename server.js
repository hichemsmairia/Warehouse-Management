const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');
var bodyParser = require('body-parser');

const app = express();
// 1
const PORT = process.env.PORT || 8080;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// parse application/json
app.use(bodyParser.json())

const routes = require('./routes/api');

// the following line contains the URI for the database connection. In a real world, live applicaiton 
// I would obscure these credentials for good practice. 
// const MONGODB_URI = 'mongodb+srv://ColeSnyder:Diabetic123@bincluster-y3cn9.mongodb.net/test?retryWrites=true&w=majority';

// 2
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/scout', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// mongoose.connect(MONGODB_URI || 'mongodb://localhost/scout', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });

mongoose.connection.on('connected', () => {
    console.log("Connected to mongoose.");
});

mongoose.set('useFindAndModify', false);

//http logger
app.use(morgan('tiny'));
app.use('/api', routes);

// 3
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
}

app.listen(PORT, console.log(`Server is starting at ${PORT}`));

app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build/index.html'), function(err) {
      if (err) {
        res.status(500).send(err)
      }
    })
  })
