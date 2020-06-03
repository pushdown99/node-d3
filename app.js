var express = require('express');
var moment  = require('moment');
var mysql   = require('mysql');

var app = express();
var path = require('path');
var server = require('http').createServer(app);
var port = process.env.PORT || 8082;

var db = mysql.createConnection({
  host     : 'localhost',
  user     : 'sqladmin',
  password : 'admin',
  database : 'kaa'
});

db.connect(function(err){
  if(err) {
    console.error("[mysql] Connection (" + err + ")");
    process.exit();
  }
});

db.query("set time_zone='+9:00'", function (err, result) {
  if (err) {
    console.log("[mysql] Timezone (" + err + ")");
    process.exit();
  }
});

app.use(express.json());
app.use(express.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.get('/', function(req, res){
  res.send("root");
})

app.get('/d3', function(req, res){
  console.log("d3");
  res.render("d3");
})

app.get('/json', function(req, res){
  console.log("json");
  var sql = "SELECT id, date_format(ts, '%Y%m%d%H%i%s') as ts, temperature, humidity FROM (SELECT * FROM log_dht ORDER BY ts DESC LIMIT 25) as a ORDER BY ts ASC"
  db.query(sql, function (err, result) {
    if (err) {
      console.error("[mysql] Query (" + err + ")");
      console.error("[mysql] * " + sql);
    }
    else 
      console.log(result);
      res.send(JSON.stringify(result));
  });
})

server.listen(port, () => { console.log('Server listening at port %d', port); });

