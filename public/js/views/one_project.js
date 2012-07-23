var TimeTracker = TimeTracker || {};

TimeTracker.Project = TimeTracker.Project || {};

TimeTracker.Project.View = Backbone.View.extend({
	from: '',
	to: '',
	el: '[data-name=one-project]',
	events: {
		'click [data-role="archive"]': 'archive',
		'click [data-role="save-timerow"]': 'saveTimerow',
		'click [data-role="filter-date"]': 'filterTimeline'
	},
	initialize: function() {
		this.template = _.template($('[data-name=one-project-template]').html());
		this.to = new Date();
		this.from = new Date();
		this.from.setDate(1);
	},
	setModel:function(model) {
		this.model = model;
		this.render();
	},
	render: function() {
		var oldTime, self = this;
		this.$el.html(this.template(this.model.toJSON()));
		this.$el.find('[data-name="project-data"]').slideDown();
	    $('#timerow-from-input, #timerow-to-input').timePicker();
	    oldTime = $.timePicker('#timerow-from-input').getTime();

	    $('#timerow-from-input').on('change', function() {
	    	if ($("#timerow-to-input").val()) {
			    var duration = ($.timePicker("#timerow-to-input").getTime() - oldTime);
			    var time = $.timePicker("#timerow-from-input").getTime();
			    $.timePicker("#timerow-to-input").setTime(new Date(new Date(time.getTime() + duration)));
			    oldTime = time;
			}
	    });

	    $("#timerow-to-input").change(function() {
		  if($.timePicker("#timerow-from-input").getTime() > $.timePicker(this).getTime()) {
		    $(this).parents('.control-group').addClass("error");
		  }
		  else {
		    $(this).parents('.control-group').removeClass("error");
		  }
		});

		this.$el.find('[data-name="filter-from"]').datepicker({
			defaultDate: '-w',
			dateFormat: 'dd.mm.yy',
			changeMonth: true,
			onSelect: function( selectedDate ) {
				self.$el.find('[data-name="filter-to"]').datepicker( "option", "minDate", selectedDate );
			}
		});
		this.$el.find('[data-name="filter-to"]').datepicker({
			dateFormat: 'dd.mm.yy',
			changeMonth: true,
			onSelect: function( selectedDate ) {
				self.$el.find('[data-name="filter-from"]').datepicker( "option", "maxDate", selectedDate );
			}
		});
	},
	archive: function() {
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
	},
	saveTimerow: function() {
		var timerow = new TimeTracker.Timerow.Model(),
			projectId = this.model.get('_id'),
		    from = $('#timerow-from-input').val().trim(),
		    to = $('#timerow-to-input').val().trim(),
		    description = $('#timerow-description-input').val().trim(),
		    today = new Date(),
		    self = this,
		    timeFormat = /^\d\d:\d\d$/;
		 
		if (from === '' || !timeFormat.test(from)) 
			$('#timerow-from-input').parents('.control-group').addClass("error");
		else 
			$('#timerow-from-input').parents('.control-group').removeClass("error");

		if (to === '' || !timeFormat.test(to)) 
			$('#timerow-to-input').parents('.control-group').addClass("error");
		else
			$('#timerow-to-input').parents('.control-group').removeClass("error");

		if (this.$el.find('.error').length > 0) {
			console.log('error');
			return;
		}
		today.setHours(from.split(':')[0]);
		today.setMinutes(from.split(':')[1])
		from = new Date(today.valueOf());
		today.setHours(to.split(':')[0]);
		today.setMinutes(to.split(':')[1])
		to = new Date(today.valueOf());
		timerow.set('from', from);
		timerow.set('to', to);
		timerow.set('description', description);
		timerow.set('project_id', this.model.get('_id'));
		timerow.save(null, {success:function(model, data) {
			if (data.error !== null) {
				self.$el.find('[data-role="error-console"]').text(data.error);
				return;
			}
 			$('#log_time_popup').modal('hide');
			self.trigger('timeLogged', projectId);
		}});
	},

	filterTimeline: function() {
		var from = this.$el.find('[data-name="filter-from"]').val().trim(),
			to = this.$el.find('[data-name="filter-to"]').val().trim(),
			dateFormat = /^\d\d\.\d\d\.\d\d\d\d$/;
			if (dateFormat.test(from) && dateFormat.test(to)) {
				this.from = moment(from, 'DD.MM.YYYY').toDate();
				this.to = moment(to, 'DD.MM.YYYY').toDate();
				this.render();
			}
	}
});