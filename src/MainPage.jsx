import React, { useContext, useEffect, useState } from "react";
//import axios from "axios";
import { Link } from "react-router-dom";
import { asset } from './Format';
import MatchListPage from "./pages/MatchListPage";
import axios from "axios";
import LobbyListPage from "./pages/LobbyListPage";


export default function MainPage() {


    return (
        <>
            <div className="rip">
                <div className="rip__text">
                    <h2>RIP DotaN 07.07.2023 — 17.08.2023</h2>
                    <p>On August 20, 2023, UselessMouth made the final decision to suspend development of this custom mode</p>
                    <p>The last update 0.5.004 was released on August 17</p>
                    <p>Before the project was shut down, 42 days were spent on it</p>
                </div>
                <img src={asset('rip.png')} />
            </div>
            <LobbyListPage />
            <MatchListPage />
        </>
    );
}