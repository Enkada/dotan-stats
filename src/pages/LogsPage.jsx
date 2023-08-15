import axios from "axios";
import React, { useRef, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { formatTime } from "../Format";


export default function LogsPage() {
    const { xdd } = useParams();

    const [matches, setMatches] = useState([]);
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const response = await axios.get("/match/getAll.php");
                setMatches(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        const fetchLogs = async () => {
            try {
                const response = await axios.get(`/get_logs123.php?eblan=aRolf`);
                setLogs(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchMatches();
        fetchLogs();
    }, []);


    if (!matches.length || !logs.length) {
        return <img src="/loading.gif" className="loading" />;
    }

    const fetchMatches = async (data) => {

        try {
            const response = await axios.post("/match/add.php", {
                data: JSON.stringify(data)
            }, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });

            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    const getLogs = () => {
        let logRows = [];

        logs.filter(x => x.data.substring(0, 8) == "{\"data\":").forEach((log, index) => {
            
            const data = JSON.parse(JSON.parse(log.data).data);
            const onSever = matches.find(x => x.matchID == data.matchID);

            data.datetime = log.datetime;

            if (data.matchID != "0" && data.matchID != "" && !onSever) {

                logRows.push(<tr key={index}>
                    <td>{log.id}</td>
                    <td>{log.datetime}</td>
                    <td>{formatTime(data.duration)}</td>
                    <td>{data.matchID}</td>
                    <td>W - {data.winner}</td>
                    <td>{data.isRanked}</td>
                    <td>P - {data.players?.length}</td>
                    <td>{onSever ? "Yes" : "NO!"}</td>
                    <td><button onClick={() => fetchMatches(data)}>SEND</button></td>
                    {/* <td><pre>{JSON.stringify(data, null, 2)}</pre></td> */}
                </tr>)
            }

        });

        return logRows;
    }

    return (
        <>
        <table className="hero__pick-list">
            <thead>
                <tr>
                    <th></th>
                    <th>Player</th>
                </tr>
            </thead>
            <tbody>
                {getLogs()}
            </tbody>
        </table>
        </>
    );
}