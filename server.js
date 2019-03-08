var express = require('express');
var handlebars = require('express-handlebars').create({ defaultLayout: 'main.handlebars' });

var sentences = require('./src/sentences.js');

var app = express();

app.engine('handlebars', handlebars.engine);

app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 3000);

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.render('home.handlebars');
});

app.get('/about', function(req, res) {
  res.render('about.handlebars', { sentence: sentences[1] });
});

app.use(function(req, res) {
  res.status(404);
  res.render('404.handlebars');
});

app.use(function(err, req, res, next) {
  console.log(err.stack);
  res.status(500);
  res.render('500.handlebars');
});

app.listen(app.get('port'), function() {
  console.log('Server is running at http://localhost:' + app.get('port') + ', Press Ctrl + C to exit.');
});


