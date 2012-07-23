var TimeTracker = TimeTracker || {};

TimeTracker.Project = TimeTracker.Project || {};
TimeTracker.Project.STATUS_OPEN = 1;
TimeTracker.Project.STATUS_ARCHIVED = 2;

TimeTracker.Project.Model = Backbone.Model.extend({
	url: '/project'
});

TimeTracker.Project.Collection = Backbone.Collection.extend({
	model: TimeTracker.Project.Model,
	url: '/project',
	getOpen: function() {
		var list = this.filter(function(project) {
		      return project.get('status') === TimeTracker.Project.STATUS_OPEN;
		    });
		return new TimeTracker.Project.Collection(list);
	},
	getArchived: function() {
		var list = this.filter(function(project) {
		      return project.get('status') === TimeTracker.Project.STATUS_ARCHIVED;
		    });
		return new TimeTracker.Project.Collection(list);
	},
	archiveProject: function(id) {
		for (var i = 0; i < this.length; i++) {
			if (this.models[i].get('_id') === id) {
				this.models[i].set('status', TimeTracker.Project.STATUS_ARCHIVED);
			}
		}
	}
}); 