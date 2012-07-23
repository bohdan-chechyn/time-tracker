var express = require('express')
  , mongoose = require('mongoose')
  , moment = require('moment')
  , db = mongoose.connect(' mongodb://time-tracker:qwer@ds033267.mongolab.com:33267/time-tracker');
 // , db = mongoose.connect(' mongodb://localhost/time-tracker');


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
        res.send(project);
    });
});

app.get('/project', function getProjectsList(req, res) {
    ProjectModel.find(function(error, projects) {
        res.send(projects);
    });
});


app.delete('/project/:id', function deleteProject(req, res) {
    var projectId = req.params.id;
    ProjectModel.findOne({_id: projectId}, function(error, project) {
        project.status = ProjectModel.STATUS_ARCHIVED;
        project.save(function(err) {
            res.send(err);
        });
    });
});

app.get('/project/:id', function getProject(req, res) {
    var projectId = req.params.id;
    ProjectModel.findOne({_id: projectId}, function(error, project) {
        res.send(project);
    });
}); 

app.post('/timerow', function saveTimerow(req, res) {
    var timerow,
        from = new Date(req.body.from),
        to = new Date(req.body.to),
        description = req.body.description,
        projectId = req.body.project_id;

    timerow = new TimeRowModel({from: from,
                                to: to,
                                total: Math.abs(to.valueOf() - from.valueOf()),
                                description:description});

    ProjectModel.findOne({_id: projectId}, function(error, project) {
        var errorTimeRow, to, from, isAlreadyBusy = true;
        for (var i = 0; i < project.timeline.length; i++) {
            to = project.timeline[i].to;
            from = project.timeline[i].from;
            isAlreadyBusy = (timerow.from.valueOf() >= from.valueOf() && timerow.from.valueOf() <= to.valueOf()) ||
                            (timerow.to.valueOf() >= from.valueOf() && timerow.to.valueOf() <= to.valueOf());
            if (isAlreadyBusy) {
                res.send({error: 'This time range is already busy: ' 
                    + moment(from).format('HH:mm') + ' - ' 
                    + moment(to).format('HH:mm')});
                return;
            }
        }
        project.timeline.push(timerow);
        project.save(function(err) {
            res.send({error:err});
        });
    });
});

app.listen(8011);
console.log("Express server listening on port 8011 in %s mode", app.settings.env);