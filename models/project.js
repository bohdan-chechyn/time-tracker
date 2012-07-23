var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    TimeRowSchema = require('./timerow.js').schema,
    ProjectSchema = new Schema({
        title: String,
        status: {type:Number, default: 1},
        total_time: {type:Number, default: 0},
        description: {type:String, default: ''},
        timeline: {type:[TimeRowSchema], default: []},
    }),
    ProjectModel = mongoose.model('Project', ProjectSchema);

ProjectModel.STATUS_OPEN = 1;
ProjectModel.STATUS_ARCHIVED = 2;
exports.schema = ProjectSchema;
exports.model = ProjectModel;