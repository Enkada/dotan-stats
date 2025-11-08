import axios from "axios";
import React, { useRef, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { formatPlayerName, formatTime, getMatchType, timeAgo, asset } from "../Format";


export default function ItemPage() {
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

        return () => {
			document.title = 'DotaN';
		};
    }, []);

    useEffect(() => {
        document.title = `${name.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} - DotaN`;
    }, [name]);


    if (!matches.length || !steamData) {
        return <img src={asset('loading.gif')} className="loading" />;
    }    

    const getItemMatchRows = () => {
        const itemMatches = matches.filter(x => x.players.some(p => p.items.includes(name)));

        let rows = [];

        let playerSet = new Set();

        let index = 0

        itemMatches.forEach((match) => {
            const playersWithItem = match.players.filter(x => x.items.includes(name) && x.steamID64 != "0");           

            const matchType = getMatchType(match);

            playersWithItem.forEach((player) => {
                const isWin = match.winner == player.team;
                playerSet.add(player.steamID64);

                if (isSteamFetched && !(Object.keys(steamData).length === 0 && steamData.constructor === Object) && !steamData[player.steamID64]) {
                    setSteamData({});
                    setIsSteamFetched(false);
                }

                rows.push(<tr key={index++} style={{"--index": index + 1}}>
                    <td>
                        <div><Link to={"/match/" + match.id}>Match #{match.id}</Link></div>
                        <div className="subtext">{timeAgo(match.datetime)}</div>
                    </td>
                    <td>
                        <Link to={"/hero/" + player.hero} className="hero-link">
                            <img src={asset('hero/' + player.hero + '.png')} />
                        </Link>
                    </td>
                    <td>{player.steamID64 == "0" ? "Bot" : 
                        <Link className="player-link" to={"/player/" + player.steamID64}>
                            {steamData[player.steamID64] ? formatPlayerName(steamData[player.steamID64].name) : (player.playerName != "" ? formatPlayerName(player.playerName) : "Unknown")}
                        </Link>}
                    </td>
                    <td>{!!steamData[player.steamID64] && <img src={steamData[player.steamID64].avatar}/>}</td>
                    <td>{matchType}</td>              
                    {/* <td><span className="subtext hero-name">{player.hero.replace(/_/g, ' ')}</span></td>  */}
                    <td className="center">{!!(match.winner == 0 || match.winner == 1) && (isWin ? <span className="radiant">Win</span> : <span className="dire">Loss</span>)}</td>
                    <td className="center" style={{"width": "73px"}}>{formatTime(match.duration)}</td> 
                    <td className="center" style={{"width": "32px"}}>{player.kills}</td>
                    <td className="center" style={{"width": "32px"}}>{player.deaths}</td>
                    <td className="center" style={{"width": "32px"}}>{player.assists}</td>
                    <td>
                        <div className="item-list">
                        {player.items.map((itemName, index) => (
                            <Link to={"/item/" + itemName} className="item-link" key={index}><img className={itemName == name ? "highlighted" : ""} src={asset('item/' + itemName + '.png')}/></Link>
                        ))}
                        </div>
                    </td>
                </tr>);
            });
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
        <div className="item">
            <div className="item__header">
                <img className="item__header__image" src={asset('item/' + name + '.png')} />
                <div className="item__header__name">{name.replace(/_/g, ' ')}</div>
            </div>

            <table className="item__match-list">
                <thead>
                    <tr>
                        <th style={{"width": "110px"}}>Match</th>
                        <th style={{"width": "73px"}}>Hero</th>
                        <th>Player</th>
                        <th style={{"width": "50px"}}></th>
                        <th style={{"width": "65px"}}>Type</th>
                        <th className="center" style={{"width": "60px"}}>Result</th>
                        <th>Duration</th>
                        <th className="center">K</th>
                        <th className="center">D</th>
                        <th className="center">A</th>
                        <th style={{"width": "280px"}}>Items</th>
                    </tr>
                </thead>
                <tbody>
                    {getItemMatchRows()}
                </tbody>
            </table>
        </div>

        </>
    );
}