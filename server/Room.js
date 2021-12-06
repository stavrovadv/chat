class Room {
    constructor(roomId, roomName, user, messages) {
        this.id = roomId;
        this.roomName = roomName; // чтобы пользователи могли задать имя комнате
        this.users = [];
        this.users.push(user);
        this.messages = messages;
    };

    setName(roomName) {
        this.roomName = roomName;
    }
}

module.exports = Room;
