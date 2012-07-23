var TimeTracker = TimeTracker || {};

TimeTracker.Timerow = TimeTracker.Timerow || {};

TimeTracker.Timerow.Model = Backbone.Model.extend({
	url: '/timerow',
	initialize: function() {
		this.set('from', new Date(this.get('from')));
		this.set('to', new Date(this.get('to')));
	}
});

TimeTracker.Timerow.Collection = Backbone.Collection.extend({
	model: TimeTracker.Timerow.Model,
	getByDateRange: function(startDate, endDate) {
		startDate = parseInt(moment(startDate).format('YYYYMMDD'), 10);
		endDate = parseInt(moment(endDate).format('YYYYMMDD'), 10);
		var list = this.filter(function(timerow) {
			var time = parseInt(moment(timerow.get('from')).format('YYYYMMDD'), 10);
				return time >= startDate && time <= endDate;			
		});
		return new TimeTracker.Timerow.Collection(list);
	}
});