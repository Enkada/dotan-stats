import axios from "axios";
import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";


export default function ItemListPage() {  

    const [matches, setMatches] = useState([]);

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const response = await axios.get("/match/getAll.php");
                setMatches(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchMatches();
        
        document.title = 'Items - DotaN';

        return () => {
			document.title = 'DotaN';
		};
    }, []);

    function calculateItemStats() {
        // Create an object to count hero occurrences and wins
        const itemStats = {};

        // Iterate through each match
        for (const match of matches) {
            const winner = match.winner;
            const players = match.players;

            // Iterate through each player in the match
            for (const player of players.filter(x => x.steamID64 != "0")) {
                const hero = player.hero;
                const team = player.team;

                for (const item of player.items) {

                    // Count hero occurrences
                    if (!itemStats[item]) {
                        itemStats[item] = {
                            picked: 0,
                            wins: 0,
                            unfinished: 0,
                            losses: 0
                        };
                    }

                    // Count hero wins
                    if (winner != 0 && winner != 1) {
                        itemStats[item].unfinished++;
                    }
                    else if (player.team == winner) {
                        itemStats[item].wins++;
                        itemStats[item].picked++;
                    }
                    else {
                        itemStats[item].losses++;
                        itemStats[item].picked++;
                    }

                }

                
            }
        }

        // Calculate win rate for each hero
        const itemStatsArray = Object.keys(itemStats).map(item => {
            const stats = itemStats[item];
            const winRate = (stats.wins / (stats.wins + stats.losses)) * 100 || 0;
            return {
                name: item,
                picked: stats.picked,
                wins: stats.wins,
                losses: stats.losses,
                winRate: Math.floor(winRate) + "%"
            };
        });

        return itemStatsArray;
    }

    if (!matches.length) {
        return <img src="/loading.gif" className="loading" />;
    }

    const itemStats = calculateItemStats().sort((a, b) => b.picked - a.picked);

    return (
        <>
        <table className="hero-list">
            <thead>
                <tr>
                    <th style={{"width": "85px"}}>Item</th>
                    <th>Picked</th>
                    <th className="radiant">Wins</th>
                    <th className="dire">Losses</th>
                    <th>Winrate</th>
                </tr>
            </thead>
            <tbody>
                {itemStats.filter(x => x.picked > 0).map((item, index) => (
                <tr className="match-list__item" key={index} style={{"--index": index + 1}}>
                    <td><Link to={"/item/" + item.name} className="hero-link"><img src={"/item/" + item.name + ".png"}></img></Link></td>
                    <td>{item.picked}</td>
                    <td className="radiant">{item.wins}</td>
                    <td className="dire">{item.losses}</td>
                    <td>{item.winRate}</td>
                </tr>
                ))}
            </tbody>
        </table>

        </>
    );
}