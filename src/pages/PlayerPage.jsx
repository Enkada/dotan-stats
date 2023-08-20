import axios from "axios";
import React, { useRef, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { formatPlayerName, formatTime, getMatchType, getMedalByMMR, timeAgo } from "../Format";


export default function PlayerPage() {
    const { id } = useParams();

    const [matches, setMatches] = useState([]);
    const [steamData, setSteamData] = useState({});
    const [playerData, setPlayerData] = useState(null);    

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const response = await axios.get("/match/getAll.php");
                setMatches(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        const fetchSteam = async () => {
            try {
                const response = await axios.get(`/steam.php/?id=${id}`);
                setSteamData(response.data);
                document.title = response.data.name + " - DotaN";
            } catch (error) {
                console.error(error);
            }
        };

        const fetchPlayer = async () => {
            try {
                const response = await axios.get(`/player/get.php/?steamID64=${id}`);
                setPlayerData(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchMatches();
        fetchSteam();
        fetchPlayer();

        document.title = `Player ${id} - DotaN`;

        return () => {
			document.title = 'DotaN';
		};
    }, []);


    if (!matches.length || !playerData || !steamData) {
        return <img src="/loading.gif" className="loading" />;
    }    

    const getPlayerMatchRows = () => {
        const playerMatches = matches.filter(x => x.players.some(p => p.steamID64 == id));

        let rows = [];

        playerMatches.forEach((match, index) => {
            const player = match.players.find(x => x.steamID64 == id);
            const isWin = match.winner == player.team;

            const matchType = getMatchType(match);

            rows.push(<tr key={index} style={{"--index": index + 1}}>
                <td>
                    <div><Link to={"/match/" + match.id}>Match #{match.id}</Link></div>
                    <div className="subtext">{timeAgo(match.datetime)}</div>
                </td>
                <td>
                    <Link to={"/hero/" + player.hero} className="hero-link">
                        <img src={"/hero/" + player.hero + ".png"} />
                    </Link>
                </td>
                <td>
                    <div>{matchType}</div>                    
                </td>              
                {/* <td><span className="subtext hero-name">{player.hero.replace(/_/g, ' ')}</span></td>  */}
                <td className="center">
                    {!!(match.winner == 0 || match.winner == 1) && (isWin ? 
                    <span className="radiant">Win {!!(match.isRanked == 1) && (player.mmrChange > 0 ? <span className="radiant rating--small">{` (+${player.mmrChange})`}</span> : <span className="dire rating--small">{` (${player.mmrChange})`}</span>)}</span> : 
                    <span className="dire">Loss {!!(match.isRanked == 1) && (player.mmrChange > 0 ? <span className="radiant rating--small">{` (+${player.mmrChange})`}</span> : <span className="dire  rating--small">{` (${player.mmrChange})`}</span>)}</span>)}
                </td>
                <td className="center" style={{"width": "73px"}}>{formatTime(match.duration)}</td> 
                <td className="center" style={{"width": "32px"}}>{player.kills}</td>
                <td className="center" style={{"width": "32px"}}>{player.deaths}</td>
                <td className="center" style={{"width": "32px"}}>{player.assists}</td>
                <td>
                    <div className="item-list">
                    {player.items.map((item, index) => (
                        <Link to={"/item/" + item} className="item-link" key={index}>
                            <img key={index} src={"/item/" + item + ".png"}/>
                        </Link>
                    ))}
                    </div>
                </td>
            </tr>);
        });

        return rows;
    }

    return (
        <>
        <div className="player">
            <div className="player__header">
                <img className="player__header__avatar" src={steamData.avatarFull} />
                <div className="player__header__name">
                    <a href={"https://steamcommunity.com/profiles/" + id}>{formatPlayerName(steamData.name)}</a>
                </div>
                {!!playerData.mmr && <div className="player__header__mmr"><span className="subtext">MMR:</span> {playerData.mmr}</div>}
                {!!playerData.mmr && <div className="player__header__medal">{getMedalByMMR(playerData.mmr)}</div>}
            </div>

            <table className="player__match-list">
                <thead>
                    <tr>
                        <th style={{"width": "120px"}}>Match</th>
                        <th style={{"width": "73px"}}>Hero</th>
                        <th style={{"width": "82px"}}>Type</th>
                        <th className="center" style={{"width": "60px"}}>Result</th>
                        <th>Duration</th>
                        <th className="center">K</th>
                        <th className="center">D</th>
                        <th className="center">A</th>
                        <th style={{"width": "280px"}}>Items</th>
                    </tr>
                </thead>
                <tbody>
                    {getPlayerMatchRows()}
                </tbody>
            </table>
        </div>

        </>
    );
}