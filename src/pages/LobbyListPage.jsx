import axios from "axios";
import React, { useRef, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { formatTime, getMatchType, timeAgo } from "../Format";


export default function LobbyListPage() {
    const [lobbies, setLobbies] = useState([]);
    
    const fetchLobbies = async () => {
        try {
            const response = await axios.get("https://api.dotaworkshop.com/v2/GetAllLobbiesById/3005976802");
            setLobbies(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {

        fetchLobbies();
    }, []);


    if (!lobbies.length) {
        return;
    }    


    return (
        <>
        <table className="lobby-list">
            <caption>Lobby List  <span className="btn-refresh" onClick={() => fetchLobbies()}>⟳</span></caption>
            <thead>
                <tr>
                    <th style={{"width": "24px"}}>#</th>
                    <th>Leader</th>
                    <th style={{"width": "110px"}}>Region</th>
                    <th style={{"width": "130px"}}>Created</th>
                    <th className="center" style={{"width": "80px"}}>Players</th>
                </tr>
            </thead>
            <tbody>
                {lobbies.map((lobby, index) => (
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td><a href={`https://steamcommunity.com/profiles/[U:1:${lobby.leader_account_id}]`}>{lobby.leader_name}</a></td>
                    <td>{lobby.server_region}</td>
                    <td>{Math.floor((Date.now() / 1000 - lobby.lobby_creation_time) / 60)} minutes ago</td>
                    <td className="center">{lobby.member_count + " / 10"}</td>
                </tr>
                ))}
            </tbody>
        </table>

        </>
    );
}