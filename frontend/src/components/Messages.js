import React, {useState, useEffect} from 'react'
import socket from "../socket";

export default function Messages(props) {
    const [messagesItems, setMessagesItems] = useState([]);
    const [text, setText] = useState('');
    const [isNewMess, setIsNewMess] = useState(false);

    useEffect(renderingChat,[]);
    useEffect(()=> {
        if(isNewMess) renderingChat();
    }, [isNewMess])

    function renderingChat(){
        sendIdToServer();
        socket.on('get messages', function (messages) {
            let res = messages.map(message => {
                return (<li key={message.time + message.user} className="messages__item">
                    <div className="message__info">
                        <div className="message__author">{message.user}</div>
                        <div className="message__time">{message.time}</div>
                    </div>
                    <div className="message__text">{message.message}</div>
                </li>);
            });
            setMessagesItems(res);
            setIsNewMess(false);
        });
    }

    function sendIdToServer(){
        socket.emit('get messages', props.formData.room);
    }

    function addNewMessage(e){
        e.preventDefault();
        let currDate = new Date();
        let time = currDate.getHours() + ":"
            + currDate.getMinutes() + ":"
            + currDate.getSeconds();
        socket.emit('chat message', props.formData.room, props.formData.name, text, time);
        setText("");
        setIsNewMess(true);
    }

    return(
        <div className="messages">
            <ul id="messages" className="messages__list">
                {messagesItems}
            </ul>
            <form id="form" className="messages__form" action="">
                <textarea id="textarea" className="messages__textarea" value={text} onChange={(e) => setText(e.target.value)}/>
                <button className="messages__btn btn" onClick={addNewMessage}>Отправить</button>
            </form>
        </div>
    )
}
