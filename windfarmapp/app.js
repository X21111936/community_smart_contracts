var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var { OpenWeatherAPI } = require("openweather-api-node");

let weather = new OpenWeatherAPI({
    key: "2241ef50ceb342a1a0fc475d45568040",
    locationName: "Cloghan",
    units: "metric"
})

/* 
you can use setters as well:
weather.setKey("put-key-here")
weather.setLocationByName("New York")
...
*/

weather.getCurrent().then(data => {
  console.log(`Current temperature in Cloghan is: ${data.weather.temp.cur}\u00B0F`)
}).catch(error =>{
  console.log(`Error while connecting to OpenWeatherAPI: ${error.message}\u00B0F`)
})

// Cloghan Wind Farm 
// lat/lon coordinates: 53.1957196,-7.880049
// Accuweather locationKey: 3526825

  /*
var AccuWeather = require('accuweather')
var forecast = new AccuWeather('accukey') //Unique client code used for identification and authorization purposes. Contact AccuWeather to receive an API key.
forecast
                .localkey(28580)				// http://apidev.accuweather.com/developers/locationsAPIguide
                .time('hourly/1hour')			// http://apidev.accuweather.com/developers/forecastsAPIguide
                .language("ru")					// http://apidev.accuweather.com/developers/languages
                .metric(true)					// Boolean value (true or false) that specifies to return the data in either metric (=true) or imperial units 
                .details(true)					// Boolean value (true or false) that specifies whether or not to include a truncated version of the forecasts object or the full object (details = true)
                .get()
                .then(res => {
                    console.log(res)
                })
                .catch(err => {
                    console.log(err)
                })*/

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//weather api???
/*
app.table('readings',(req,res) =>{
  let url = 'https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}'
})
*/
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

module.exports = app;

