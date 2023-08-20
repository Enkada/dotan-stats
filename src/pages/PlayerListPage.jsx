import axios from "axios";
import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { formatPlayerName, getMedalByMMR } from "../Format";


export default function PlayerListPage() {  

    const [matches, setMatches] = useState([]);
    const [players, setPlayers] = useState(null);
    const [steamData, setSteamData] = useState({});    
    const [isSteamFetched, setIsSteamFetched] = useState(false);
    
    const [tableSort, setTableSort] = useState({ column: "mmr", isDesc: true });    

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
                winRate: winRate
            };
        });

        if (!isSteamFetched) {
            const playerData = {};

            const playerPromises = Object.keys(playerStats).filter(x => !players[x] && playerStats[x].games > 0).map(player => {
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

        return playerStatsArray.filter(x => x.games > 0);
    }

    if (!matches.length, !players) {
        return <img src="/loading.gif" className="loading" />;
    }

    let playerStats = calculatePlayerStats().sort((a, b) =>  (players[b.steamID64]?.mmr ?? 0) - (players[a.steamID64]?.mmr ?? 0));

    //console.log(playerStats.sort((a, b) =>  (b.winrate) - (a.winrate)));

    playerStats.forEach((object, index) => {
        object.index = index + 1;
    });

    if (tableSort.column) {

        if (tableSort.column == "mmr") {
            playerStats.sort((a, b) =>  (players[b.steamID64] ? players[b.steamID64][tableSort.column] : 0) - (players[a.steamID64] ? players[a.steamID64][tableSort.column] : 0));
        }
        else {
            playerStats.sort((a, b) =>  (b[tableSort.column]) - (a[tableSort.column]));
        }
        

        if (!tableSort.isDesc) {
            playerStats.reverse();
        }
    }

    const getPlayerMMR = (steamID64) => {
        if (!players) {
            return -1;
        }

        const player = players[steamID64];

        if (player) {
            return player.mmr;
        }
        else {
            return -1;
        }
    }

    const getPlayerAvatar = (player) => {
        if (players[player.steamID64] && players[player.steamID64] != "") {
            return <img className="avatar" src={players[player.steamID64].avatarFull}/>;
        }      
        else if (steamData[player.steamID64]) {
            return <img className="avatar" src={steamData[player.steamID64].avatarFull}/>;
        }  

        return <div className="avatar--fake" style={{"width": "48px"}}></div>;
    }

    const sortByColumn = (column) => {

        if (tableSort.column == column) {
            setTableSort({...tableSort, isDesc: !tableSort.isDesc});
        }
        else {
            setTableSort({...tableSort, column: column});
        }
    }

    return (
        <>
        <div className="markdown">
            <blockquote>
            This page contains a table of player leaderboards by MMR. You can read more about how the MMR system works <Link to={"/mmr"}>here</Link>.
            </blockquote>
        </div>
        <table className="player-list">
            <thead>
                <tr>
                    <th className="right">#</th>
                    <th ></th>
                    <th>Player</th>
                    <th onClick={() => sortByColumn("games")} className={`sortable ${tableSort.column == "games" ? `sorted ${tableSort.isDesc ? "desc" : ""}` : ""}`}>Games</th>
                    <th onClick={() => sortByColumn("wins")} className={`radiant sortable ${tableSort.column == "wins" ? `sorted ${tableSort.isDesc ? "desc" : ""}` : ""}`}>Wins</th>
                    <th onClick={() => sortByColumn("losses")} className={`dire sortable ${tableSort.column == "losses" ? `sorted ${tableSort.isDesc ? "desc" : ""}` : ""}`} >Losses</th>
                    <th onClick={() => sortByColumn("winRate")} className={`sortable ${tableSort.column == "winRate" ? `sorted ${tableSort.isDesc ? "desc" : ""}` : ""}`}>Winrate</th>
                    <th onClick={() => sortByColumn("mmr")} className={`sortable ${tableSort.column == "mmr" ? `sorted ${tableSort.isDesc ? "desc" : ""}` : ""}`}>MMR</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {playerStats.map((player, index) => (
                <tr className="player-list__item" key={index} style={{"--index": index + 1}}>
                    <td className="right">{player.index}</td>
                    <td>{getPlayerAvatar(player)}</td>
                    <td>
                        <Link to={"/player/" + player.steamID64}>
                            {steamData[player.steamID64] ? formatPlayerName(steamData[player.steamID64].name) : (player.playerName != "" ? formatPlayerName(player.playerName) : "Unknown")}
                        </Link>
                    </td>
                    <td>{player.games}</td>
                    <td className="radiant">{player.wins}</td>
                    <td className="dire">{player.losses}</td>
                    <td>{Math.floor(player.winRate) + "%"}</td>
                    <td>{getPlayerMMR(player.steamID64) == -1 ? "" : getPlayerMMR(player.steamID64)}</td>
                    <td>{getMedalByMMR(getPlayerMMR(player.steamID64))}</td>
                </tr>
                ))}
            </tbody>
        </table>

        </>
    );
}