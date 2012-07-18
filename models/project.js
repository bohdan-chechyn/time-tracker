var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    TimeRowSchema = require('./timerow.js').schema,
    ProjectSchema = new Schema({
        title: String,
        status: {type:Number, default: 1},
        description: String,
        timeline: [TimeRowSchema],
    }),
    ProjectModel = mongoose.model('Project', ProjectSchema);

exports.schema = ProjectSchema;
exports.model = ProjectModel;