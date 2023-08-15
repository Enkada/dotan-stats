import axios from "axios";
import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { formatPlayerName } from "../Format";


export default function PlayerListPage() {  

    const [matches, setMatches] = useState([]);
    const [players, setPlayers] = useState(null);
    const [steamData, setSteamData] = useState({});    
    const [isSteamFetched, setIsSteamFetched] = useState(false);

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const response = await axios.get("/match/getAll.php");
                setMatches(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        const fetchPlayers = async () => {
            try {
                const response = await axios.get("/player/getAll.php");
                setPlayers(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchMatches();
        fetchPlayers();

        document.title = 'Players - DotaN';

        return () => {
			document.title = 'DotaN';
		};
    }, []);
   
    function calculatePlayerStats() {
        let playerStats = {}

        matches.filter(x => x.matchID != "0").forEach(match => {
            const winner = match.winner;

            match.players.filter(x => x.steamID64 != "0").forEach(player => {
                const id = player.steamID64;
                
                if (!playerStats[id]) {
                    playerStats[id] = {
                        games: 0,
                        unfinished: 0,
                        wins: 0,
                        losses: 0,
                        playerName: player.playerName
                    };
                }

                if (winner != 0 && winner != 1) {
                    playerStats[id].unfinished++;
                }
                else if (player.team == winner) {
                    playerStats[id].wins++;
                    playerStats[id].games++;
                }
                else {
                    playerStats[id].losses++;
                    playerStats[id].games++;
                }
            });
        });

        const playerStatsArray = Object.keys(playerStats).map(player => {
            const stats = playerStats[player];
            const winRate = (stats.wins / (stats.games)) * 100 || 0;
            return {
                steamID64: player,
                games: stats.games,
                wins: stats.wins,
                losses: stats.losses,
                unfinished: stats.unfinished,
                playerName: stats.playerName,
                winRate: Math.floor(winRate) + "%"
            };
        });

        if (!isSteamFetched) {
            const playerData = {};

            const playerPromises = Object.keys(playerStats).map(player => {
                return axios.get(`/steam.php/?id=${player}`)
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

        return playerStatsArray;
    }

    if (!matches.length, !players) {
        return <img src="/loading.gif" className="loading" />;
    }

    const playerStats = calculatePlayerStats().sort((a, b) =>  (players[b.steamID64]?.mmr ?? 0) - (players[a.steamID64]?.mmr ?? 0));

    const getPlayerMMR = (steamID64) => {
        if (!players) {
            return "...";
        }

        const player = players[steamID64];

        if (player) {
            return player.mmr;
        }
        else {
            return <span className="mmr1984">1984</span>;
        }
    }

    return (
        <>
        <table className="player-list">
            <thead>
                <tr>
                    <th></th>
                    <th>Player</th>
                    <th>Games</th>
                    <th className="radiant">Wins</th>
                    <th className="dire">Losses</th>
                    <th>Winrate</th>
                    <th><Link to={"/mmr"}>MMR</Link></th>
                </tr>
            </thead>
            <tbody>
                {playerStats.filter(x => x.games > 0).map((player, index) => (
                <tr className="player-list__item" key={index} style={{"--index": index + 1}}>
                    <td>{!!steamData[player.steamID64] && <img src={steamData[player.steamID64].avatar}/>}</td>
                    <td>
                        <Link to={"/player/" + player.steamID64}>
                            {steamData[player.steamID64] ? formatPlayerName(steamData[player.steamID64].name) : (player.playerName != "" ? formatPlayerName(player.playerName) : "Unknown")}
                        </Link>
                    </td>
                    <td>{player.games}</td>
                    <td className="radiant">{player.wins}</td>
                    <td className="dire">{player.losses}</td>
                    <td>{player.winRate}</td>
                    <td>{getPlayerMMR(player.steamID64)}</td>
                </tr>
                ))}
            </tbody>
        </table>

        </>
    );
}