import React, {useState} from "react";

export default function Video() {
    const [isVideoCall, setIsVideoCall] = useState(false);
    function clickHandler() {
        setIsVideoCall((val) => !val);
    }

    return(
        <>
            <button className="room__video" onClick={clickHandler}>
                <img src="/camera.png" className="room__video-img" alt=""/>
            </button>
            <div className={(isVideoCall) ? "room__player" : "room__player hidden"}></div>
        </>
    )
}
