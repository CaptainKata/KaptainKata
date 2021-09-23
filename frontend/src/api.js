/**WHERE WE DO ALL OF OUR BACKEND CONNECTIONS */

import axios from 'axios'

console.log(process.env)

const serverUrl = process.env.NODE_ENV === 'production' ? 'https://kaptainkata.herokuapp.com/api' : `http://localhost:5000/api`
console.log(serverUrl)
const createHeaders = () => {
    return { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
}


const actions = {

    getUser: async () => {
        return await axios.get(`${serverUrl}/get-the-user`, createHeaders())
    },

    addPost: async (post) => {
        let res = await axios.post(`${serverUrl}/add-post`, post, createHeaders())
        return res
    },
    getAllPosts: async (post) => {
        return await axios.get(`${serverUrl}/all-the-posts`, createHeaders())
    },

    authenticate: async (profileObj) => {
        console.log(profileObj, 'profileObj')
        let res = await axios.post(`${serverUrl}/authenticate`, profileObj, createHeaders())
        console.log(res)
        localStorage.setItem('token', res.data.token)

        return res
    },

    addKata: async (kata) => {
        return await axios.post(`${serverUrl}/add-kata`, kata, createHeaders())
    },
    getAllKatas: async () => {
        return await axios.get(`${serverUrl}/all-katas`)
    },
    deleteKata: async (id) => {
        return await axios.delete(`${serverUrl}/delete-kata?id=${id}`)
    },
    getPlayers: async () => {
        return await axios.get(`${serverUrl}/get-players`)
    },
    resetKatas: async () => {
        await axios.put(`${serverUrl}/reset-katas`)
    }
}

export default actions