import axios from "axios";
import React, { useRef, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { formatPlayerName, formatTime, getMatchType, timeAgo, asset } from "../Format";


export default function HeroPage() {
    const { name } = useParams();

    const [matches, setMatches] = useState([]);
    const [steamData, setSteamData] = useState({});    
    const [isSteamFetched, setIsSteamFetched] = useState(false);

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const response = await axios.get("match/getAll.php");
                setMatches(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchMatches();

        document.title = `${name.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} - DotaN`

        return () => {
			document.title = 'DotaN';
		};
    }, []);


    if (!matches.length) {
        return <img src={asset('loading.gif')} className="loading" />;
    }    

    const getPlayerName = (player) => {
        if (player.steamID64 == "0") {
            return "Bot";
        }

        if (player.playerName) {
            return <Link to={"/player/" + player.steamID64}>{formatPlayerName(player.playerName)}</Link>
        }

        if (steamData[player.steamID64]) {
            return <Link to={"/player/" + player.steamID64}>{formatPlayerName(steamData[player.steamID64].name)}</Link>
        }

        return <Link to={"/player/" + player.steamID64}>Unknown</Link>;
    }

    const getHeroPickRow = () => {
        const heroPicks = matches.filter(x => x.players.some(p => p.hero == name));

        let rows = [];

        let playerSet = new Set();

        heroPicks.forEach((match, index) => {
            const player = match.players.find(x => x.hero == name);
            const isWin = match.winner == player.team;

            playerSet.add(player.steamID64);

            rows.push(<tr key={index} style={{"--index": index + 1}}>
                <td>
                    <div><Link to={"/match/" + match.id}>Match #{match.id}</Link></div>
                    <div className="subtext">{timeAgo(match.datetime)}</div>
                </td>
                <td>{getPlayerName(player)}</td>
                <td>{!!steamData[player.steamID64] && <img src={steamData[player.steamID64].avatar}/>}</td>                 
                <td className="center">{formatTime(match.duration)}</td>
                <td className="center" style={{"width": "84px"}}>{getMatchType(match)}</td>
                <td className="center">{!!(match.winner == 0 || match.winner == 1) && (isWin ? <span className="radiant">Win</span> : <span className="dire">Loss</span>)}</td>
                <td className="center" style={{"width": "32px"}}>{player.kills}</td>
                <td className="center" style={{"width": "32px"}}>{player.deaths}</td>
                <td className="center" style={{"width": "32px"}}>{player.assists}</td>
                <td>
                    <div className="item-list">
                    {player.items.map((item, index) => (
                        <Link to={"/item/" + item} className="item-link" key={index}>
                            <img key={index} src={asset('item/' + item + '.png')}/>
                        </Link>
                    ))}
                    </div>
                </td>
            </tr>);
        });

        if (!isSteamFetched) {
            const playerData = {};

            const playerPromises = Array.from(playerSet).map(player => {
                return axios.get(`steam.php/?id=${player}`)
                .then(response => {
                    playerData[player] = response.data;
                });
            });

            Promise.all(playerPromises).then(() => {
                // Update the match state with the updated player data
                setSteamData(playerData);
            });
        }

        if (isSteamFetched != true) {
            setIsSteamFetched(true);
        }

        return rows;
    }

    return (
        <>
        <div className="hero">
            <div className="hero__header">
                <img className="hero__header__portrait" src={asset('hero/' + name + '.png')} />
                <div className="hero__header__name hero-name">{name.replace(/_/g, ' ')}</div>
            </div>

            <table className="hero__pick-list">
                <thead>
                    <tr>
                        <th style={{"width": "120px"}}>Match</th>
                        <th>Player</th>
                        <th style={{"width": "50px"}}></th>
                        <th className="center" style={{"width": "50px"}}>Duration</th>
                        <th className="center">Type</th>
                        <th className="center" style={{"width": "60px"}}>Result</th>
                        <th className="center">K</th>
                        <th className="center">D</th>
                        <th className="center">A</th>
                        <th style={{"width": "280px"}}>Items</th>
                    </tr>
                </thead>
                <tbody>
                    {getHeroPickRow()}
                </tbody>
            </table>
        </div>

        </>
    );
}