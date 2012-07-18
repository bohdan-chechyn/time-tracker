var express = require('express')
  , mongoose = require('mongoose')
  , db = mongoose.connect(' mongodb://time-tracker:qwer@ds033267.mongolab.com:33267/time-tracker');

var ProjectModel = require('./models/project.js').model,
	TimeRowModel = require('./models/timerow.js').model;


var app = module.exports = express.createServer();

app.configure(function(){
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.static(__dirname + '/public'));
});

app.get('/', function(req, res) {
    res.render('layout.jade');
});

app.post('/project', function createProject(req, res) {
	var project = new ProjectModel(req.body);
    project.save(function(err) {
        res.send(err);
    });
});

app.get('/project', function getProjectsList(req, res) {
    ProjectModel.find(function(error, projects) {
        res.send(projects);
    });
});

app.get('/project/:id', function getProject(req, res) {
    var projectId = req.params.id;
    ProjectModel.findOne({_id: projectId}, function(error, project) {
        res.send(project);
    });
});

app.delete('/project/:id', function deleteProject(req, res) {
    var projectId = req.params.id;
    ProjectModel.findOne({_id: projectId}, function(error, project) {
        project.status = 2;
        project.save(function(err) {
            res.send(err);
        });
    });
});

app.listen(8011);
console.log("Express server listening on port 8010 in %s mode", app.settings.env);