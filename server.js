var express = require('express');
var handlebars = require('express-handlebars').create({
  defaultLayout: 'main.handlebars',
  helpers: {
    section: function(name, options) {
      if(!this._sections) {
        this._sections = {};
      }
      this._sections[name] = options.fn(this);
      return null;
    }
  }
});
var a = 5;

var sentences = require('./src/sentences.js');

var app = express();

app.disable('x-powered-by');
app.engine('handlebars', handlebars.engine);

app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 3000);

// middleware
app.use(express.static(__dirname + '/public'));
app.use(function(req, res, next) {
  if(!res.locals.partials) {
    res.locals.partials = {};
  }

  res.locals.partials.currencyContent = {
    text: 'Some text'
  };
  next();
});
app.use(function(req, res, next) {
  res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
  next();
});

var homeContextObject = {
  currency: {
    name: 'USD',
    course: 27,
    valid: false
  },
  tours: [
    { _id: '0', name: 'Petro', price: 5 },
    { _id: '1', name: 'Taras', price: 10 }
  ],
  additionalInfo: 'Additional Info'
};

app.get('/', function(req, res) {
  res.status(200).render('home.handlebars', homeContextObject);
});

app.get('/process-contact', function(req, res) {
  return res.json({ error: 'DB error' });
  res.redirect(303, '/thank-you');
});

app.get('/tours/hood-river', function(req, res) {
  res.render('tours/hood-river.handlebars');
});

app.get('/tours/request-group-rate', function(req, res) {
  res.render('tours/request-group-rate');
});

app.get('/nursery', function(req, res) {
  res.render('nursery.handlebars');
});

app.get('/data/nursery-rhyme', function(req, res){
  res.json({
    animal: 'бельчонок',
    bodyPart: 'хвост',
    adjective: 'пушистый',
    noun: 'черт'
  });
});

var tours = [
  { _id: '0', name: 'Petro', price: 5 },
  { _id: '1', name: 'Taras', price: 10 }
];

app.get('/api/tours', function(req, res) {
  var toursXml = '<?xml version="1.0"?><tours>' +
    tours.map(function(t) {
      return '<tour price="' + t.price + '">' + t.name + '</tour>';
    }).join('') + '</tours>';
  var toursText = tours.map(function(t) {
    return t._id + ': ' + t.name;
  }).join('\n');

  res.format({
    'application/json': function() {
      res.json(tours);
    },
    'application/xml': function() {
      res.type('application/xml');
      res.send(toursXml);
    },
    'text/xml': function() {
      res.type('text/xml');
      res.send(toursText);
    },
    'text/plain': function() {
      res.type('text/plain');
      res.send(toursXml);
    }
  });
});

/////////////////////////////////////////////
// how execute put, del metods from client //
app.put('/api/tour/:id', function(req, res) {
  console.log('params: ', req.params.id);
  console.log('array: ', tours[0]);
  var tour = tours.filter(function(t) {
    return t._id === req.params.id
  })[0];

  if(tour) {
    tour.name = 'Taras2';
    tours[req.param.is] = tour;
    return res.json(tours);
  } else {
    return res.json({ error: "Tour isn't found" });
  }

  // if above there isn't return next to send respons then this code will be invoked and
  // as result - error because cant set new headers second time
  res.status(200).send('lalallallal');
});

app.delete('/api/tour/:id', function(req, res) {
  var id = req.params.id;

  if(id > tours.length - 1) {
    return res.send('Incorrect ID');
  } else {
    tours.splice(id, 1);
    return res.json({ success: 'Tour was deleted' });
  }
});
////////////////////////////////////////////

app.get('/thank-you', function(req, res) {
  res.render('thank-you.handlebars');
});

app.get('/no-layout', function(req, res) {
  res.render('no-layout.handlebars', { layout: null });
});

app.get('/text', function(req, res) {
  res.status(200).type('text/plain').send('TEXT');
});

app.get('/about', function(req, res) {
  res.render('about.handlebars', { sentence: sentences[1], pageTestScript: '/qa/tests-about.js' });
});

app.use(function(req, res) {
  res.status(404);
  res.render('404.handlebars');
});

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).render('500.handlebars');
});

app.listen(app.get('port'), function() {
  console.log('Server is running at http://localhost:' + app.get('port') + ', Press Ctrl + C to exit.');
});


