import { useState, useEffect } from 'react';
import actions from '../api';

function AddKata(props) {

    const [kata, setKata] = useState({})
    const [katas, setKatas] = useState([])
    const [currentKata, setCurrentKata] = useState({})

    useEffect(async () => {
        let res = await actions.getAllKatas()

        setCurrentKata(res.data.find(kata => kata.current))
        setKatas(sortKatas(res.data))
    }, [])


    const sortKatas = (k) => e => {
        return k
    }

    const handleSubmit = async e => {
        e.preventDefault();
        let res = await actions.addKata(kata)
        console.log(res)
        if (!res.data.errors) {
            setKatas([...katas, ...[res.data]])
        } else {
            alert(res.data.message)
        }

    }
    const deleteKata = id => async e => {
        let yes = window.confirm('Are you sure you want to delete this kata?')
        if (yes) {
            let res = await actions.deleteKata(id)
            setKatas(() => katas.filter(kata => kata._id != id))
        }
    }

    const resetKatas = () => {
        let yes = window.confirm('Are you sure you want to reset katas?')
        if (yes) {
            actions.resetKatas()
            window.location.reload()
        }
    }

    // function ShowKatas() {
    //     return katas.map((kata) => <KataDetail/>)
    // }


    function ShowKata({ kata }) {
        let [active, setActive] = useState(false)
        return (
            <div onClick={e => setActive(!active)} className={`katas ${kata.delivered && 'delivered'} ${kata.current && 'current'}`}>
                <div className="details">
                    <div>
                        <b>Level: {kata.level}</b>
                        <b>Delivered: {JSON.stringify(kata.delivered)}</b>
                        <b>Current: {JSON.stringify(kata.current)}</b>
                    </div>
                    <div><a target="_blank" href={kata.url}>{kata.url.slice(-10)}</a></div>
                    <div><button onClick={deleteKata(kata._id)}>X</button></div>
                </div>
                <div className={`users ${active && 'active'}`}>
                    {kata.usersCompleted.length > 0 ?
                        <ul>Completed By: {kata.usersCompleted.map(player => <li>{player.name}</li>)}</ul>
                        : "No one Yet"}
                </div>
            </div>
        )
    }




    return (
        <div>
            <h2>Katas</h2>
            <div id="currentKata">
                {currentKata?.current && <ShowKata kata={currentKata} />}
            </div>
            <hr></hr>
            {katas.map((kata) => <ShowKata kata={kata} />)}

            <hr></hr>
            <br></br>
            <br></br>
            <br></br>
            <label>Add Kata</label>
            <form onSubmit={handleSubmit}>
                <input type="number" placeholder="Level" onChange={e => setKata({ ...kata, level: e.target.value })} />
                <input type="text" placeholder="Url" onChange={e => setKata({ ...kata, url: e.target.value })} />

                <button>Submit</button>
            </form>

            <button onClick={resetKatas} id="reset">Reset Katas</button>
        </div>
    );
}

export default AddKata;