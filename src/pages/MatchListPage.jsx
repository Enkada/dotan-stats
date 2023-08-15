import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { formatTime, getMatchType, timeAgo } from "../Format";


export default function MatchListPage() {    
    const [matches, setMatches] = useState([]);
    const [isDevVisible, setIsDevVisible] = useState(false);
    const [isUnrankedVisible, setIsUnrankedVisible] = useState(true);
    const [isUnfinishedVisible, setIsUnfinishedVisible] = useState(false);

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
    }, []);

    if (!matches.length) {
        return <img src="/loading.gif" className="loading"/>;
    }

    let filteredMatches = [...matches];

    if (!isDevVisible)
        filteredMatches = filteredMatches.filter(x => x.matchID != "0");

    if (!isUnrankedVisible)
        filteredMatches = filteredMatches.filter(x => x.isRanked != 0);

    if (!isUnfinishedVisible)
        filteredMatches = filteredMatches.filter(x => x.winner == 0 || x.winner == 1);

    return (
        <>
            <div className="match-list">
                <div className="match-list__parameters">
                    <label><input type="checkbox" checked={isDevVisible} onChange={() => setIsDevVisible(!isDevVisible)}/> Developer</label>
                    <label><input type="checkbox" checked={isUnfinishedVisible} onChange={() => setIsUnfinishedVisible(!isUnfinishedVisible)}/> Unfinished</label>
                    <label><input type="checkbox" checked={isUnrankedVisible} onChange={() => setIsUnrankedVisible(!isUnrankedVisible)}/> Unranked</label>
                </div>
                <table className="match-list__table">
                    <thead>
                        <tr>
                            <th>Match</th>
                            <th>Type</th>
                            <th>Duration</th>
                            {/* <th>Score</th> */}
                            <th className="radiant">Radiant</th>
                            <th style={{"width": "44px"}}></th>
                            <th style={{"width": "44px"}}></th>
                            <th className="dire">Dire</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMatches.map((match, index) => (
                        <tr className="match-list__item" key={index} style={{"--index": index + 1}}>
                            <td>
                                <Link to={"match/" + match.id}>Match #{match.id}</Link>
                                <div title={match.datetime} className="subtext">{timeAgo(match.datetime)}</div>
                            </td>
                            <td>{getMatchType(match)}</td>
                            <td>{formatTime(match.duration)}</td>
                            {/* <td>
                                <span className="radiant">{match.players.filter(x => x.team == 0).reduce((sum, player) => sum + player.kills, 0)}</span>
                                <span> - </span>
                                <span className="dire">{match.players.filter(x => x.team == 1).reduce((sum, player) => sum + player.kills, 0)}</span>
                            </td> */}
                            <td style={{"width": "380px"}}>
                                <div className={`match-list__item__hero-list ${match.winner == 0 ? "winner" : ""}`}>
                                {match.players.filter(x => x.team == 0).map((player, index) => (
                                    <Link to={"/hero/" + player.hero} className="hero-link" key={index}><img src={"hero/" + player.hero + ".png"}></img></Link>
                                ))}
                                </div>
                            </td>
                            <td className="center dash"><span className="radiant">{match.players.filter(x => x.team == 0).reduce((sum, player) => sum + player.kills, 0)}</span></td>
                            <td className="center"><span className="dire">{match.players.filter(x => x.team == 1).reduce((sum, player) => sum + player.kills, 0)}</span></td>
                            <td style={{"width": "380px"}}>                        
                                <div className={`match-list__item__hero-list ${match.winner == 1 ? "winner" : ""}`}>
                                {match.players.filter(x => x.team == 1).map((player, index) => (
                                    <Link to={"/hero/" + player.hero} className="hero-link" key={index}><img src={"hero/" + player.hero + ".png"}></img></Link>
                                ))}
                                </div>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
        </>        
    );
}