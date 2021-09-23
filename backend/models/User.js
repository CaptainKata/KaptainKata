const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    name: String,
    email: String,
    imageUrl: String,
    googleId: String,
    codeWarsName: String,
    codeWarsId: String,
    katasCompleted: [{ type: Schema.Types.ObjectId, ref: 'Kata' }],
    clan: String,
    leaderboardPosition: Number,
    skills: Array,
    ranks: Object,
    codeChallenges: Object,
})

module.exports = model('User', userSchema);