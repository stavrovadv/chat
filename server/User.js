class User {
    constructor(userName, roomId){
        this.userName = userName;
        this.isOnline = true;
        this.roomsId = [];
        this.roomsId.push(roomId);
    }

    setStatus(val){
        this.isOnline = val;
    }
}

module.exports = User;
