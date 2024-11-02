const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();
const { MongoClient } = require("mongodb");
const mongoose = require('mongoose');
const { Schema } = mongoose;

//.env setup
require('dotenv').config()
const mongodbUri = process.env.MONGODB_URI;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


// Define the listitem schema
const shoppingListItemSchema = new Schema({
    name: String,
    amount: Number,
});

// Define the listitem model
const SLI = mongoose.model('Shoppinglist item', shoppingListItemSchema);

// Start the application
main().catch(err => console.log(err));

async function main() {

    // Wait for connection, use database test
    await mongoose.connect(mongodbUri);

    // Hydrate a user model with instance values
    const test = new SLI({
        name: "Kurkku",
        amount: 5000
    });

    const test2 = new SLI({
        name: "Porkkana",
        amount: 5000
    });

    // Persist the model instance in the database
    test.save();
    test2.save();
    console.log("Saved");

    // Fetch and print all model instances
    const listitems = await SLI.find();
    console.log(listitems);
}


module.exports = app;
