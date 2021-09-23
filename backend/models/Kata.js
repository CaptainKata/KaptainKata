const { Schema, model } = require('mongoose');

const kataSchema = new Schema({
    url: { type: String, unique: true, required: true },
    level: Number,
    delivered: { type: Boolean, default: false },
    lastDelivered: Date,
    usersCompleted: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    current: { type: Boolean, default: false }
})


kataSchema.path('url').validate((val) => {
    urlRegex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;
    return urlRegex.test(val);
}, 'Invalid URL.');

module.exports = model('Kata', kataSchema);