var TimeTracker = TimeTracker || {};

TimeTracker.ProjectsPanel = TimeTracker.ProjectsPanel || {};

TimeTracker.ProjectsPanel.View = Backbone.View.extend({
	collection: [],
	status: 1,
	project: [],
	el: '[data-name="projects-panel"]',
	events: {
		'click [data-name="projects"] a': 'handleProjectClick',
		'click [data-role="status-toggler"] a': 'toggleStatus'
	},
	initialize: function(collection) {
		this.template = _.template($('[data-name=projects-list-template]').html());
		this.collection = collection;
	},

	showOpen: function() {
		this.projects = this.collection.getOpen();
		this.render();
	},

	showArchived: function() {
		this.projects = this.collection.getArchived();
		this.render();
	},
	render: function() {
		this.$el.html(this.template({projects: this.projects}));
		this.$el.find('[data-status="' + this.status +'"]').parent().addClass('active');
		this.$el.find('[data-name="projects"]').slideDown();
		if (this.projects.length > 0)
			this.trigger('projectSelected', _.first(this.projects.models).get('_id'));
		else
			$('[data-name="one-project"]').empty();
	},

	handleProjectClick: function(e) {
		var id = $(e.srcElement).attr('data-id');
		this.trigger('projectSelected', id);
		return false;
	},

	toggleStatus: function(e) {
		var status = parseInt($(e.srcElement).attr('data-status'), 10);
		this.status = status;
		this.redraw();
		return false;
	},

	redraw: function() {
		switch (this.status) {
			case TimeTracker.Project.STATUS_OPEN: this.showOpen(); break;
			case TimeTracker.Project.STATUS_ARCHIVED: this.showArchived(); break;
		}
	}
});