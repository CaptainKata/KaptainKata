const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()
const Post = require('./models/Post')
const User = require('./models/User')
const Kata = require('./models/Kata')
const axios = require('axios')

/**ALL OUR BACKEND ROUTES */


router.post('/kata', async (req, res) => {

    let response = await axios.get(`https://www.codewars.com/api/v1/users/${req.body.user.id}`)
    let codeWarsUser = response.data

    console.log('codeWarsUser', codeWarsUser)
    // codeWarsUser.katas.push('new kata')

    let user = await User.findOneAndUpdate({ codeWarsId: req.body.user.id }, codeWarsUser, { upsert: true, new: true })
    console.log('user is now ', user._id)

    let latestKata = await Kata.findOneAndUpdate({}, { $addToSet: { usersCompleted: user._id } }, { sort: { lastDelivered: -1 }, new: true })
    console.log('latestKata is now ', latestKata)

    await User.findByIdAndUpdate(user._id, { $addToSet: { katasCompleted: latestKata._id } })

    res.status(200).end()

})

router.post('/add-kata', async (req, res) => {
    Kata.create(req.body).then(kata => {
        res.json(kata)
    }).catch(err => {
        res.json(err)
    })

})

router.get('/all-katas', async (req, res) => {
    res.json(await Kata.find().populate('usersCompleted'))
})

router.get('/get-players', async (req, res) => {
    res.json(await User.find().populate('katasCompleted'))
})

router.delete('/delete-kata', async (req, res) => {
    let deleted = await Kata.findByIdAndDelete(req.query.id)
    res.json(deleted)
})

router.put('/reset-katas', async (req, res) => {
    return await Kata.updateMany({ delivered: false, current: false })
})


router.get('/', (req, res) => {
    res.json({ serverWorking: true })
})

router.get('/get-the-user', authorize, async (req, res) => {
    let user = await User.findById(res.locals.user._id)
    res.json(user)
})


router.post('/add-post', authorize, async (req, res) => {

    let newPost = req.body
    newPost.userId = res.locals.user._id
    Post.create(newPost).then(post => {
        res.json(post)
    })
})


router.get('/all-the-posts', (req, res) => {
    Post.find().populate('userId').then(posts => {
        res.json(posts)
    })
})





















router.post('/authenticate', async (req, res) => {
    let user = await User.findOne({ email: req.body.email })

    if (!user) {
        user = await User.create(req.body)
    }

    jwt.sign({ user }, 'secret key', { expiresIn: '30min' }, (err, token) => {
        res.json({ user, token })
    })

})




//Middle ware >>> Put this in the middle of any route where you want to authorize
function authorize(req, res, next) {
    let token = req.headers.authorization.split(' ')[1] //Token from front end 
    if (token) {
        jwt.verify(token, 'secret key', (err, data) => {
            if (!err) {
                res.locals.user = data.user //Set global variable with user data in the backend 
                next()
            } else {
                res.status(403).json({ message: err })
                //throw new Error({ message: "ahhh" })
            }

        })
    } else {
        res.status(403).json({ message: "Must be logged in!" })
    }
}



module.exports = router