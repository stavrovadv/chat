const {server} = require("./HTTPServer.js");
const { Server } = require("socket.io");
const io = new Server(server);

const User = require("./User.js");
const Room = require("./Room.js");

const roomsMap = new Map();
const usersMap = new Map();

class WS {
    static initWS() {
        io.on('connection', (socket) => {
            // Обработка данных формы входа
            socket.on('enter', (userName, roomId) => {
                WS.#userEnter(userName, roomId);
                socket.user = userName;
            });
            socket.on('users count', (roomId) => {
                socket.join(roomId);
                WS.#calcUsersInRoom(roomId);
            });
            // Передача клиенту всей информации по идентификатору комнаты
            socket.on('get messages', (roomId) => {
                socket.join(roomId);
                WS.#sendRoomMessages(roomId);
            });
            // Получение нового сообщения в комнате и отправка всем пользователям
            socket.on('chat message', (roomId, user, message, time) => {
                socket.join(roomId);
                WS.#addChatMessage(roomId, user, message, time);
            });
            socket.on('disconnect', () => {
                if(socket.user && usersMap.get(socket.user)) usersMap.get(socket.user).isOnline = false;
            });
        });
    }

    static generateRoomId() {
        // Генерация идентификатора комнаты длиной 10 символов
        let crypto = require("crypto");
        return crypto.randomBytes(10).toString('hex');
    }

    static #calcUsersInRoom(roomId) {
        let roomInfo = roomsMap.get(roomId);
        if(roomInfo && roomInfo.users) {
            let usersRoom = roomInfo.users;
            let online = usersRoom.filter((user) => user.isOnline);
            io.to(roomId).emit('users count', {
                all: usersRoom.length,
                onlineArr: online
            });
        }
    }

    static #addChatMessage(roomId, user, message, time){
        let currObjMessage = {
            roomId,
            user,
            message,
            time
        };
        if(roomsMap.get(roomId) && roomsMap.get(roomId).messages){
            roomsMap.get(roomId).messages.push(currObjMessage);
            io.to(roomId).emit('chat message', currObjMessage);
        }
    }

    static #userEnter(userName, roomId) {
        // Пользователь не ввел комнату, создаем новую
        if(!roomId) {
            let roomId = WS.generateRoomId();

            // если вдруг уже существует такое имя комнаты
            while (roomsMap.has(roomId)){
                roomId = WS.generateRoomId();
            }

            // если это новый пользователь
            if(!usersMap.has(userName)) usersMap.set(userName, new User(userName, roomId));

            // Название по умолчанию будет равно roomId
            let roomName = roomId;
            let roomObj = new Room(roomId, roomName, usersMap.get(userName), []);
            roomsMap.set(roomId, roomObj);
            io.emit('enter', userName, roomId);
            return;
        }

        // Ввел комнату и она существует
        if(roomsMap.has(roomId)) {
            // Пришел по чьей-то ссылке и еще не состоял в комнате
            if(!roomsMap.get(roomId).users.some(user => user.userName === userName)) {
                let usersRoom = roomsMap.get(roomId).users;

                // Создаем нового пользователя, если его нет
                if(!usersMap.has(userName)) {
                    let currUser = new User(userName, roomId);
                    usersMap.set(userName, currUser);
                }

                usersRoom.push(usersMap.get(userName));
            }
            io.emit('enter', userName, roomId);
        }

        // Ввел комнату, но она не существует
        else {
            io.emit('enter-error', new Error("room not found"));
        }
    }

    static #sendRoomMessages(roomId) {
        let room = roomsMap.get(roomId);
        if(room && room.messages) io.to(roomId).emit('get messages', room.messages);
    }
}

module.exports = WS;
