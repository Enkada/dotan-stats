import axios from "axios";
import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { asset } from "../Format";


export default function HeroListPage() {  

    const [matches, setMatches] = useState([]);

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
        
        document.title = 'Heroes - DotaN';

        return () => {
			document.title = 'DotaN';
		};
    }, []);

    function calculateHeroStats() {
        // Create an object to count hero occurrences and wins
        const heroStats = {};

        // Iterate through each match
        for (const match of matches) {
            const winner = match.winner;
            const players = match.players;

            // Iterate through each player in the match
            for (const player of players.filter(x => x.steamID64 != "0")) {
                const hero = player.hero;
                const team = player.team;

                // Count hero occurrences
                if (!heroStats[hero]) {
                    heroStats[hero] = {
                        picked: 0,
                        wins: 0,
                        unfinished: 0,
                        losses: 0
                    };
                }

                // Count hero wins
                if (winner != 0 && winner != 1) {
                    heroStats[hero].unfinished++;
                }
                else if (player.team == winner) {
                    heroStats[hero].wins++;
                    heroStats[hero].picked++;
                }
                else {
                    heroStats[hero].losses++;
                    heroStats[hero].picked++;
                }
            }
        }

        // Calculate win rate for each hero
        const heroStatsArray = Object.keys(heroStats).map(hero => {
            const stats = heroStats[hero];
            const winRate = (stats.wins / (stats.wins + stats.losses)) * 100 || 0;
            return {
                name: hero,
                picked: stats.picked,
                wins: stats.wins,
                losses: stats.losses,
                winRate: Math.floor(winRate) + "%"
            };
        });

        return heroStatsArray;
    }

    if (!matches.length) {
        return <img src={asset('loading.gif')} className="loading" />;
    }

    const heroStats = calculateHeroStats().sort((a, b) => b.picked - a.picked);

    return (
        <>
        <table className="hero-list">
            <thead>
                <tr>
                    <th>Hero</th>
                    <th>Picked</th>
                    <th className="radiant">Wins</th>
                    <th className="dire">Losses</th>
                    <th>Winrate</th>
                </tr>
            </thead>
            <tbody>
                {heroStats.filter(x => x.picked > 0).map((hero, index) => (
                <tr className="match-list__item" key={index} style={{"--index": index + 1}}>
                    <td style={{"width": "102px"}}><Link to={"/hero/" + hero.name} className="hero-link"><img src={asset('hero/' + hero.name + '.png')}></img></Link></td>
                    <td>{hero.picked}</td>
                    <td className="radiant">{hero.wins}</td>
                    <td className="dire">{hero.losses}</td>
                    <td>{hero.winRate}</td>
                </tr>
                ))}
            </tbody>
        </table>

        </>
    );
}