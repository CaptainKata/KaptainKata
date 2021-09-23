const axios = require('axios')
const Kata = require('./models/Kata')
const User = require('./models/User')
const mongoose = require('mongoose')
require('dotenv').config();

const URI = process.env.MONGODB_URI || 'mongodb://localhost/Toro'
console.log(URI)
mongoose
    .connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async x => {
        console.log(`Connected to ${x.connections[0].name}`)

        await Kata.updateMany({}, { current: false })


        Kata.find({ delivered: false }).then(async katas => {
            console.log(katas, 'katas')
            let kata = katas[Math.floor(Math.random() * katas.length)];
            console.log(kata)

            if (kata) {

                await axios.post(
                    //`https://discord.com/api/webhooks/890345559402086450/Xr55fjOgEdaoHHaX-N8hwEAfTmaiZtENaM2Bolxbsa9IANM7BYIoL7iRPNLsuMuELieo`,
                    `https://discord.com/api/webhooks/890292247717892156/LMhQ1OMXWjjzYtnZqWH5BWGn-LFSowtEDCZB1Tp2sdH7lmn1MWwfrNa1m09Vq1fzIwY2`,
                    { content: kata.url })
                kata.delivered = true;
                kata.lastDelivered = new Date()
                kata.current = true
                await kata.save()
            } else {
                console.error('out of katas')
            }
            mongoose.disconnect();
        })
    })
    .catch(() => console.error("Error connecting to Mongo"))




// axios.post(`https://discord.com/api/webhooks/890292247717892156/LMhQ1OMXWjjzYtnZqWH5BWGn-LFSowtEDCZB1Tp2sdH7lmn1MWwfrNa1m09Vq1fzIwY2`,
//     {
//         content: 'coool beans'
//     }).then(res => console.log(res.data))
