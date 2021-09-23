import { useState, useEffect } from 'react';
import actions from '../api';

function Players(props) {

    const [players, setPlayers] = useState([])

    useEffect(async () => {
        let res = await actions.getPlayers()
        setPlayers(res.data)
    }, [])




    function FormatKata({ player }) {
        let sortedKatas = player.katasCompleted.sort((a, b) => new Date(b.lastDelivered) - new Date(a.lastDelivered))
        return sortedKatas.map(kata => {
            return <li>☑️ {kata.url.slice(-10)} </li >
        })

    }

    function ShowPlayers() {
        console.log(players)
        return players.map(player => {
            return (
                <li className="player">
                    <div> {player.name} has completed {player.katasCompleted?.length} katas.</div>
                    <ul><FormatKata player={player} /></ul>
                    <i>{JSON.stringify(player.ranks)}</i>
                </li>
            )
        })
    }

    return (
        <ol>
            <ShowPlayers />

        </ol>
    );
}

export default Players;