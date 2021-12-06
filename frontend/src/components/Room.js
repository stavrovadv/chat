import React, {useState, useEffect} from "react";

import Messages from "./Messages.js";
import socket from "../socket";

export default function Room(props){
    let roomId = window.location.href.match(/\/room-(.*)$/)[1];
    const [usersCount, setUsersCount] = useState({
       roomUsers: 0,
       roomOnlineUsers: []
    });

    useEffect(() => {
        getUsersCount();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            getUsersCount();
        }, 60000);

        return () => clearTimeout(timer);
    }, []);

    function getUsersCount() {
        socket.emit('users count', roomId);
        socket.on('users count', function (resObj) {
            if(usersCount.roomUsers !== resObj.all ||
                usersCount.roomOnlineUsers !== resObj.onlineArr) {
                setUsersCount({
                    roomUsers: resObj.all,
                    roomOnlineUsers: resObj.onlineArr
                })
            }
        });
    }

    function showOnlineUsers() {
        let users = usersCount.roomOnlineUsers.map(user => user.userName);
        if(users.length > 5) {
            users = users.slice(0, 5);
            return users.join(",") + "and others";
        }
        else if(users.length === 0) return "0";
        return users.join(",");
    }

    return(
        <>
            <div className="room">
                <div className="container">
                    <div className="room__content">
                        <h1 className="title room__title">Комната {roomId}</h1>
                        <div id="countUsersOnline" className="room__info">Количество участников: {usersCount.roomUsers}, онлайн: {showOnlineUsers()}</div>
                        <div className="room__chats">
                            <Messages formData={props.formData}/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
