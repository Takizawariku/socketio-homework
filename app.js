const { lstat } = require('fs');
const { connect } = require('http2');
const { disconnect, emit } = require('process');

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
var userlist=[]
let user={
    name:'',
    id:''
}

// var username
io.on('connection', (socket) => {
    // console.log('connecteduser',socket.id)

    socket.broadcast.emit('connectuser')

        //  user処理
//  usernameを受け取り配列に入れる
    socket.on('username',username =>{
        // console.log(username)
        let user={
            name:username,
            id:socket.id
        }  
        userlist.push(user)
        io.emit('userlist',userlist,user)
        // console.log(userlist)
    })
 
    socket.on('chat message', (msg,username) => {
    // console.log(msg,username)
        io.emit('chat message', msg,username);
    });

    // ｄｍ
    socket.on('dmc',(msg,aotSocketid,username)=>{
        console.log(aotSocketid ,msg ,username)

        socket.to(aotSocketid).emit('dms',msg,username)
    })


    // console.log(userlist[user.id])

    socket.on("disconnect",() => {
        // console.log('disconnext',socket.id)
        socket.broadcast.emit('userdisconnect')
        // userlist.id.filter(function(x){
        //     return x != socket.id
        // })
    })

});

http.listen(port, () => {
    console.log(`Socket.IO server running at http://localhost:${port}/`);
});
