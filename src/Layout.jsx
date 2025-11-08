import { useContext, useEffect } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { asset } from './Format';

export default function Layout() {    
    
    return (
        <>
            <header>
                <div className="dotan-links">
                    <a href="https://steamcommunity.com/sharedfiles/filedetails/?id=3005976802"><img src="https://store.steampowered.com/favicon.ico"/></a>
                    <a href="https://www.twitch.tv/uselessmouth"><img src="https://static.twitchcdn.net/assets/favicon-32-e29e246c157142c94346.png"/></a>
                </div>
                <NavLink to={"/"}><img className="logo" src={asset('logo.png')} /></NavLink>
                <nav>
                    <NavLink to={"/"} style={{"--index": 0}}>Matches</NavLink>
                    <NavLink to={"/heroes"} style={{"--index": 1}}>Heroes</NavLink>
                    <NavLink to={"/players"} style={{"--index": 2}}>Players</NavLink>
                    <NavLink to={"/items"} style={{"--index": 3}}>Items</NavLink>
                    <NavLink to={"/about"} style={{"--index": 4}}>About</NavLink>
                </nav>
            </header>
            <main>
                <Outlet></Outlet>
            </main>
            <footer>
                DotaN is an original idea by UselessMouth - 2023
            </footer>
        </>
    )
}