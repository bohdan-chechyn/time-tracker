var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    TimeRowSchema = new Schema({
        from: Date,
        to: Date,
        total: Number,
        description: String
    }),
    TimeRowModel = mongoose.model('TimeRow', TimeRowSchema);


exports.schema = TimeRowSchema;
exports.model = TimeRowModel;