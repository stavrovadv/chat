import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import IntroFormElement from "./IntroFormElement";
import socket from "../socket";

export default function IntroPage(props) {
    const [isOk, setIsOk] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        room: ""
    });
    const [dataHasError, setDataHasError] = useState({
        name: false,
        room: false
    })

    useEffect(() => {
        if(formData.name) {
            setDataHasError((val) => {
                return {...val, name: false}
            })
        }
        else {
            setDataHasError((val) => {
                return {...val, name: true}
            })
        }
    },[formData.name])

    function setFormName(formName) {
        setFormData((fd) => {
            return {...formData, name: formName}
        });
    }
    function setFormRoom(formRoom) {
        if(!formRoom.match(/\/room-(.*)$/)) {
            setDataHasError((val) => {
                return {...val, room: true}
            });
            return;
        }

        let formId = formRoom.match(/\/room-(.*)$/)[1];
        if(formId) {
            setFormData((fd) => {
                return {...formData, room: formId}
            });
        }
        else {
            setDataHasError((val) => {
                return {...val, room: true}
            })
        }
    }

    function clickHandler(e) {
        e.preventDefault();
        if(!dataHasError.name){
            sendDataToServer();
            getAnswerFromServer();
        }
    }

    function sendDataToServer() {
        socket.emit('enter', formData.name, formData.room);
    }

    function getAnswerFromServer() {
        socket.on('enter-error', function (ex) {
            setDataHasError((val) => {
                return {...val, room: true}
            })
        });
        socket.on('enter', function(userName, roomId) {
            setFormData({
                name: userName,
                room: roomId
            });
            props.setData({
                name: userName,
                room: roomId
            });
            setIsOk(true);
        });
    }

    return(
        <div className="enter__container container">
            <form action="" id="form" className="enter">
                <div className="enter__labels">
                    <IntroFormElement dataHasError={dataHasError.name} cssId="name" text="Имя: " setVal={setFormName} errorText="Введите имя" />
                    <IntroFormElement dataHasError={dataHasError.room} cssId="room" setVal={setFormRoom} text="Ссылка на комнату (если у вас есть): " errorText="Комнаты не существует" />
                </div>
                <button className="btn enter__btn" onClick={clickHandler}>Отправить</button>
                {(isOk) ? <Navigate to={`/room-${formData.room}`} formData={formData}/> : null}
            </form>
        </div>
    )
}
