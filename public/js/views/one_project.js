var TimeTracker = TimeTracker || {};

TimeTracker.Project = TimeTracker.Project || {};

TimeTracker.Project.View = Backbone.View.extend({
	el: '[data-name=one-project]',
	events: {
	//	'click [data-name="projects"] a': 'loadProject',
		'click [data-role="archive"]': 'archive'
	},
	initialize: function() {
		this.template = _.template($('[data-name=one-project-template]').html());

	},
	setModel:function(model) {
		this.model = model;
		this.render();
	},
	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		this.$el.find('[data-name="project-data"]').slideDown();
	},
	archive: function() {
		console.log('start archiving')
		var projectId = this.model.get('_id'),
			self = this;
		$.ajax({
			type: 'delete',
			url: '/project/' + projectId,
			success: function(data) {
				self.trigger('projectArchived', projectId);
			},
			error: function(error) {
				//@TODO: show error
			}
		});
	}
});