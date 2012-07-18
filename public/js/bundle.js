$(document).on('ready', function() {
	var project = new TimeTracker.Project.Model();

//	project.set({title:'test ololo' + Math.random()});
//	project.save();

	var appRouter = Backbone.Router.extend({
		routes: {
			'/': 'index',
			'/project/:id': 'loadProject'
		},
		loadProject: function() {
			console.log(arguments);
		}
	});



	var projects = new TimeTracker.Project.Collection();
	


	projects.fetch({success: function(projects) {
		var oneProjectView = new TimeTracker.Project.View(project),
		    projectsView = new TimeTracker.ProjectsPanel.View(projects);

		projectsView.showOpen();
		
		projectsView.on('projectSelected', function loadProject(id) {
			$.get('/project/' + id, function(projectData) {
				var project = new TimeTracker.Project.Model(projectData);
				oneProjectView.setModel(project);
			})
		});

		oneProjectView.on('projectArchived', function(projectId) {
			projects.archiveProject(projectId);
			projectsView.redraw();
		});

	}});

});
 