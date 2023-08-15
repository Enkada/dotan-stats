import React, { useRef, useEffect, useState } from "react";


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
            <p>The new way to play Dota. </p>
            <p>This custom game derives from Dota and tries to explore new Dota ideas with entirely new map.</p>    
            <p>Current version: 0.4</p>    
            <p>Contributors:</p>
            <ul>
                <li>pugiko: Additional programming, Panorama programming, lua items scripting and abilities.</li>
                <li>scarcrxwaxaxa: Logo design.</li>
                <li>kabzdetsu: Design of presentation for screenshots section</li>
            </ul>

                
            

            
            {/* <audio ref={audioRef} autoPlay controls>
                <source src="bounce.mp3" type="audio/mpeg" />
            </audio><br /> */}
            </div>
        </>
    );
}