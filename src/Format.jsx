import { Link } from "react-router-dom";

export function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    const formattedMinutes = minutes.toString();
    const formattedSeconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds.toString();

    return `${formattedMinutes}:${formattedSeconds}`;
}


export function getMatchType(match) {
    if (match.matchID == "0") {
        return <span className="subtext">Dev</span>;
    }
    else if (match.winner != 0 && match.winner != 1) {
        return <span className="subtext">Unfinished</span>;
    }
    else if (match.isRanked != 0) {
        return <Link to={"/mmr"} className="mmr-link">Ranked</Link>;
    }

    return <span className="subtext">Unranked</span>;
}

export function formatPlayerName(name) {
    if (/[а-яА-Я]/.test(name)) {
        let ruName = "";
        name.split(' ').forEach(word => {
            ruName += `<span>${word}</span>`;
        });

        return <span className="ru-text" dangerouslySetInnerHTML={{__html: ruName}}></span>
    }

    return name;
}

export function getMedalByMMR(mmr) {
    if (mmr < 0) {
        return <img className="medal" src={"/rank/rank0.png"}/>
    }
    
    const index = Math.floor(mmr / 100) + 1;
    
    if (index > 35) {
        return <img className="medal" src={"/rank/rank35.png"}/>
    }

    return <img className="medal" src={"/rank/rank" + index + ".png"}/>
}

export function timeAgo(datetimeString) {
    const now = new Date();
    const pastTime = new Date(datetimeString);
    const timeDifferenceMs = now - pastTime;

    if (timeDifferenceMs < 60000) {
        // Less than 1 minute ago
        const seconds = Math.floor(timeDifferenceMs / 1000);
        return seconds === 1 ? "a second ago" : seconds + " seconds ago";
    } else if (timeDifferenceMs < 3600000) {
        // Less than 1 hour ago
        const minutes = Math.floor(timeDifferenceMs / 60000);
        return minutes === 1 ? "a minute ago" : minutes + " minutes ago";
    } else if (timeDifferenceMs < 86400000) {
        // Less than 1 day ago
        const hours = Math.floor(timeDifferenceMs / 3600000);
        return hours === 1 ? "an hour ago" : hours + " hours ago";
    } else {
        // More than 1 day ago
        const days = Math.floor(timeDifferenceMs / 86400000);
        return days === 1 ? "a day ago" : days + " days ago";
    }
}

export function formatNumberToK(number) {
    // Convert the number to a string
    const numStr = number.toString();

    // If the number is less than 1000, no need for conversion
    if (number < 1000) {
        return numStr;
    }

    // Calculate the number of thousands
    const thousands = Math.floor(number / 1000);

    // Calculate the remaining hundreds
    const remainingHundreds = Math.floor((number % 1000) / 100);

    // Build the "k" format
    if (remainingHundreds === 0) {
        // If there are no remaining hundreds, display only the thousands with "k"
        return thousands + "k";
    } else {
        // Display one decimal place for the hundreds
        return thousands + "," + remainingHundreds + "k";
    }
}
