import React, { useContext, useEffect, useState } from "react";
//import axios from "axios";
import { Link } from "react-router-dom";
import MatchListPage from "./pages/MatchListPage";
import axios from "axios";
import LobbyListPage from "./pages/LobbyListPage";


export default function MainPage() {


    return (
        <>

            <LobbyListPage />
            <MatchListPage />
        </>
    );
}