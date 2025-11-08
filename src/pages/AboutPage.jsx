import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { asset } from '../Format';


export default function AboutPage() {

    const audioRef = useRef(null);

    useEffect(() => {
        if (audioRef.current) {
            //audioRef.current.play();
            audioRef.current.volume = 0.8;
        }

        document.title = 'About - DotaN';

        return () => {
            document.title = 'DotaN';
        };
    }, []);

    return (
        <>
            <div className="about">
                <div className="markdown">
                    <p>The new way to play Dota. </p>
                    <p>This custom game derives from Dota and tries to explore new Dota ideas with entirely new map.</p>
                    <p>Current version: 0.5</p>
                    <p>Contributors:</p>
                    <ul>
                        <li><a href="https://steamcommunity.com/id/pepegi7">pugiko</a>: Additional programming, Panorama programming, lua items scripting and abilities.</li>
                        <li><a href="https://steamcommunity.com/id/siceria/">Enkada</a>: Server-side development (backend) and the visual design (frontend) of the website with statistics, design of <Link to={"/mmr"}>the MMR system</Link></li>
                        <li>scarcrxwaxaxa: Logo design.</li>
                        <li><a href="https://steamcommunity.com/id/Aplpn">APpLePeN</a>: Lua items scripting and abilities</li>
                        <li><a href="https://steamcommunity.com/id/bk4p/">bk4p</a>: Lua scripting</li>
                        <li><a href="https://steamcommunity.com/id/kabzdec1/">kabzdetsu</a>: Design of presentation for screenshots section</li>
                    </ul>
                </div>
                <div className="sara">
                    <img src={asset("sara.png")} alt="Sara"></img>
                </div>
                {/* <audio ref={audioRef} autoPlay controls>
                <source src="bounce.mp3" type="audio/mpeg" />
            </audio><br /> */}
            </div>
        </>
    );
}