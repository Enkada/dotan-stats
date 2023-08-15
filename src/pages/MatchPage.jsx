import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { formatNumberToK, formatPlayerName, formatTime, getMatchType, timeAgo } from "../Format";


export default function MatchPage() {    
    const { id } = useParams();
    const [match, setMatch] = useState(null);
    const [playersData, setPlayersData] = useState(null);
    const [isSteamFetched, setIsSteamFetched] = useState(false);

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const response = await axios.get("/match/get.php/?id=" + id);
                setMatch(response.data);
                document.title = `Match #${response.data.id} - DotaN`
            } catch (error) {
                console.error(error);
            }
        };

        const fetchPlayers = async () => {
            try {
                const response = await axios.get("/player/getAll.php");
                setPlayersData(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchMatches();
        fetchPlayers();

        return () => {
			document.title = 'DotaN';
		};
    }, []);

    useEffect(() => {
        if (match && !isSteamFetched) {
            setIsSteamFetched(true);
            const updatedPlayers = [...match.players];

            // Fetch data for each player
            const playerPromises = updatedPlayers.filter(x => x.steamID64 != "0").map(player => {
                return axios.get(`/steam.php/?id=${player.steamID64}`)
                .then(response => {
                    const playerData = response.data;

                    // Update player information in the copied array
                    const playerIndex = updatedPlayers.findIndex(p => p.steamID64 === player.steamID64);
                    if (playerIndex !== -1) {
                    updatedPlayers[playerIndex] = {
                        ...player,
                        playerName: playerData.name,
                        avatar: playerData.avatar,
                    };
                    }
                });
            });

            // Wait for all player data to be fetched and updated
            Promise.all(playerPromises).then(() => {
                // Update the match state with the updated player data
                setMatch(prevMatch => ({
                    ...prevMatch,
                    players: updatedPlayers,
                }));
            });
        }
    }, [match]);

    
    const getTeamTotalStat = (team, stat) => {
        return match.players.filter(x => x.team == team).reduce((sum, player) => sum + player[stat], 0)
    }

    const getTeamTable = (team) => {
        const players = match.players.filter(x => x.team == team);

        return (<table className={`match__team ${team == 0 ? "match__team--radiant" : "match__team--dire"}`}>
            <caption>{team == 0 ? "The Radiant" : "The Dire"}{!!(match.winner == team) && " 🏆"}</caption>
            <thead>
                <tr>
                    <th>Hero</th>
                    <th>Player</th>
                    <th></th>
                    <th className="center" style={{"width": "44px"}}>LVL</th>
                    <th className="networth right" style={{"width": "60px"}}>NW</th>
                    <th className="center" style={{"width": "40px"}}>K</th>
                    <th className="center" style={{"width": "40px"}}>D</th>
                    <th className="center" style={{"width": "40px"}}>A</th>
                    <th className="right">LH</th>
                    <th>DN</th>
                    <th className="right" style={{"width": "60px"}}>GPM</th>
                    <th>XPM</th>
                    <th className="right" style={{"width": "60px"}}>DMG</th>
                    <th className="right" style={{"width": "60px"}}>Heal</th>
                    <th>Items</th>
                </tr>
            </thead>
            <tbody>
            {players.map((player, index) => (
                <tr key={index} style={{"--index": index + 1}}>
                    <td style={{"width": "73px"}}><Link to={"/hero/" + player.hero} className="hero-link"><img src={"/hero/" + player.hero + ".png"}></img></Link></td>
                    <td>{player.steamID64 != 0 ? 
                        <Link to={"/player/" + player.steamID64}>{player.playerName != "" ? formatPlayerName(player.playerName) : "Unknown"}</Link> :
                        "Bot"}
                        <div>
                            {!!(playersData && playersData[player.steamID64]) && <span className="subtext">{`MMR ${playersData[player.steamID64].mmr}`}</span>}
                            {!!player.mmrChange && 
                            (player.mmrChange > 0 ? <span className="radiant">{` +${player.mmrChange}`}</span> : <span className="dire">{` ${player.mmrChange}`}</span>)}
                        </div>
                    </td>
                    <td style={{"width": "50px"}}>{player.avatar ? <img src={player.avatar}/> : ""}</td>
                    <td className="center">{player.level}</td>
                    <td className="networth right">{formatNumberToK(player.networth)}</td>
                    <td className="center" style={{"width": "40px"}}>{player.kills}</td>
                    <td className="center" style={{"width": "40px"}}>{player.deaths}</td>
                    <td className="center" style={{"width": "40px"}}>{player.assists}</td>
                    <td className="right slash" style={{"width": "60px"}}>{player.lastHits}</td>
                    <td style={{"width": "60px"}}>{player.denies}</td>
                    <td className="right slash" style={{"width": "60px"}}>{formatNumberToK(Math.floor(player.gpm))}</td>
                    <td style={{"width": "60px"}}>{Math.floor(player.xpm)}</td>
                    <td className="right" style={{"width": "60px"}}>{formatNumberToK(player.damage)}</td>
                    <td className="right" style={{"width": "60px"}}>{formatNumberToK(player.healing)}</td>
                    <td style={{"width": "290px"}}>
                        <div className="item-list">
                            {player.items.map((item, index) => (
                                <Link to={"/item/" + item} className="item-link" key={index}>
                                    <img src={"/item/" + item + ".png"}/>
                                </Link>
                            ))}
                        </div>
                    </td>
                </tr>
            ))}
            <tr style={{"--index": 6}}>
                <td></td><td></td><td></td><td></td>
                <td className="networth right">{formatNumberToK(getTeamTotalStat(team, "networth"))}</td>
                <td className="center">{getTeamTotalStat(team, "kills")}</td>
                <td className="center">{getTeamTotalStat(team, "deaths")}</td>
                <td className="center">{getTeamTotalStat(team, "assists")}</td>
                <td className="right slash">{getTeamTotalStat(team, "lastHits")}</td>
                <td>{getTeamTotalStat(team, "denies")}</td>
                <td className="right slash">{formatNumberToK(Math.floor(getTeamTotalStat(team, "gpm")))}</td>
                <td>{formatNumberToK(Math.floor(getTeamTotalStat(team, "xpm")))}</td>                
                <td className="right">{formatNumberToK(getTeamTotalStat(team, "damage"))}</td>    
                <td className="right">{formatNumberToK(getTeamTotalStat(team, "healing"))}</td>
                <td></td>
            </tr>
            </tbody>
        </table>)
    }

    if (!match) {
        return <img src="/loading.gif" className="loading"/>;
    }

    return (
        <>
            <div className="match">
            <div className="match__info">
                <div className="match__type">{getMatchType(match)} Match #{match.id} {!!(match.matchID != "0") && (<span className="subtext">{`(${match.matchID})`}</span>)}</div>
                <div className="match__score radiant">{match.players.filter(x => x.team == 0).reduce((sum, player) => sum + player.kills, 0)}</div>
                <div className="match__duration">{formatTime(match.duration)}</div>
                <div className="match__score dire">{match.players.filter(x => x.team == 1).reduce((sum, player) => sum + player.kills, 0)}</div>
                <div className="match__datetime">Ended {timeAgo(match.datetime)}</div>
            </div>
            <div className="match__team-tables">
                {getTeamTable(0)}
                {getTeamTable(1)}
            </div>
            
            </div>
        </>        
    );
}