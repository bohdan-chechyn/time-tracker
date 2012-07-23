$(document).on('ready', function() {
	var project = new TimeTracker.Project.Model(),
	    projects = new TimeTracker.Project.Collection();

	projects.fetch({success: function(projects) {
		var oneProjectView = new TimeTracker.Project.View(project),
		    projectsView = new TimeTracker.ProjectsPanel.View(projects);

		var loadProject = function(id) {
			$.get('/project/' + id, function(projectData) {
				projectData.timeline = new TimeTracker.Timerow.Collection(projectData.timeline);
				var project = new TimeTracker.Project.Model(projectData);
				oneProjectView.setModel(project);
			});
		}

		projectsView.showOpen();
		
		projectsView.on('projectSelected', loadProject);
		oneProjectView.on('timeLogged',loadProject);

		projectsView.on('projectAdded', function addProject(project) {
			projects.add(project);
			projectsView.redraw();
		});

		oneProjectView.on('projectArchived', function archiveProject(projectId) {
			projects.archiveProject(projectId);
			projectsView.redraw();
		});
	}});

});
 