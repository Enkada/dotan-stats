import React, { useRef, useEffect, useState } from "react";


export default function MMRPage() {

    const getRankLine = () => {
        const medalGroupCount = 7;
        const medalGroupSize = 5;
        const medalGap = 100;

        let groups = [];

        for (let i = 0; i < medalGroupCount; i++) {
            let ranges = [];
            
            for (let j = 0; j < medalGroupSize; j++) {
                const index = 1 + i * medalGroupSize + j;
                const medalImage = <img src={"/rank/rank" + index + ".png"}/>;

                const range = <div key={j} className="medal-range">
                    {medalImage}
                    <div className="medal-range__boundaries">
                        <span>{i * (medalGap * medalGroupSize) + j * medalGap}</span>
                        <span>{i * (medalGap * medalGroupSize) + j * medalGap + medalGap - 1}</span>
                    </div>
                </div>

                ranges.push(range);
            }

            groups.push(<div key={i} className="medal-group">
                {ranges}
            </div>);
        }

        return (<div className="medal-line">
            {groups}
        </div>);
    }

    return (
        <>
        <div className="mmr-info markdown">
            <h1>How Ranked Matchmaking works</h1>
            <p>A game is considered <b>ranked</b> if:</p>
            <ol>
                <li>One of the team's Ancients has been destroyed at the end of the match</li>
                <li>The number of players in each team is equal</li>
                <li>The final duration of the match is <b>8</b> minutes or more</li>
                <li>The game does not have bots</li>
            </ol>
            <p>In a ranked game, all players receive an increase or decrease to their ranking. </p> 
            {/* Players of the winning team get <b>+25 MMR</b>, players of the losing team get <b>-25 MMR</b>. */}
            <p>The starting value of MMR for all players who have not participated in rating games before is equal to <b>500 MMR</b>.</p>
            <h3>Team Size Penalty</h3>
            <p>If at least one player out of five is absent, the amount of MMR earned/deducted is reduced by <b>2 MMR</b> for each absent player. </p>
            {/* <p>Thus, with incomplete teams, MMR is calculated by the formula:</p> */}
            <p><b>TeamSizePenalty</b> = (5 - TeamSize) * <b>2</b></p>
            <h3>Fantasy Points</h3>
            <p>For each player, the number of Fantasy points is calculated. The calculation uses a modified formula invented by Valve. </p>
            <blockquote>
                The modified formula does not use the following values: seconds of enemy stuns, tower kills, Roshan kills
            </blockquote>
            <p><b>FantasyPoints</b> = Kills * <b>0.3</b> + Deaths * (<b>-0.3</b>) + Assists * <b> 0.15</b> + LastHits * <b>0.003</b> + GPM * <b>0.002</b> + XPM * <b>0.002</b> + Healing * <b>0.0004</b></p>
            {/* <p>Additionally, a Fantasy Points Factor is calculated, which assumes that by scoring <b>7</b> Fantasy Points, a player can increase the amount of MMR he receives in a win or decrease the amount of MMR deducted in a loss.</p>
            <p>This works the other way as well, scoring less than <b>7</b> Fantasy Points, a player will gain less or lose more MMR when winning or losing respectively.</p>
            <p><b>FantasyPointsFactor</b> = (<b>-7</b> + FantasyPoints) * <b>2</b></p> */}
            <h3>Final Formula</h3>
            <p>The amount of MMR that each player of the winning team receives is calculated using the following formula:</p>
            <p><b>MMR Gain</b> = <b>25</b> - TeamSizePenalty + MAX( (-7 + FantasyPoints) * 2; -15 )</p>
            <blockquote>
                <p>The formula sets a threshold of 7 Fantasy Points, a player who gets more than this number will get more MMR for winning, while a player who gets less than this number will get less MMR.</p>
                <p>The MAX() function sets a limit that prevents a player from losing more than 15 MMR at low Fantasy Point values</p>
            </blockquote>
            <p>The amount of MMR that each player of the losing team has is calculated using the following formula:</p>
            <p><b>MMR Loss</b> = <b>-25</b> + TeamSizePenalty + FantasyPoints</p>
            <img width={128} style={{"float": "right"}} src="/rank/rank0.png" alt="" />
            <h3>Medals</h3>
            <p>There are 7 categories of medals. There are 5 medals in each category. Each medal has a MMR range of <b>100</b>, all players whose MMR is within that range receive that medal. </p>
            {getRankLine()}
        </div>
        </>
    );
}