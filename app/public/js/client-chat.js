const socket = io();

document.getElementById("formChat").addEventListener("submit", (e) => {
    e.preventDefault();
    const messageText = document.getElementById("inputChat").value;
    const acknowledgements = (error) => {
        if (error)
            return alert(error);
    }
    socket.emit('send message chat from client to server', messageText, acknowledgements);

    //Clear input message
    document.getElementById("inputChat").value = "";
});

socket.on('send message chat from server to client', (message) => {
    renderMessageChat(message, false);
});

//Send message userself chat
socket.on("send message userself chat from server to client", (message) => {
    renderMessageChat(message, true);
});

//Share location
document.getElementById('btnShareLocation').addEventListener("click", () => {
    if (!navigator.geolocation) {
        return alert("The browser does not support location sharing");
    }
    navigator.geolocation.getCurrentPosition((postion) => {
        const { latitude, longitude } = postion.coords;
        socket.emit("share location from client to server", { latitude, longitude });
    })
});

socket.on("share location from server to client", (data) => {
    renderLocationChat(data, false);
});

socket.on("share userself location from server to client", (data) => {
    renderLocationChat(data, true);
});

//Query string
const queryString = location.search;
const { username, room } = Qs.parse(queryString, {
    ignoreQueryPrefix: true
});
if (!room || !username) {
    window.location.href = "http://localhost:8080/index.html";
}
socket.emit("join room from client to server", { username, room });
document.getElementById("nameRoom").innerHTML = room;

//Handle user list 
socket.on("send user list from server to client", (userList) => {
    //Display list user in browser
    let contentHtml = "";
    userList.map((item) => {
        contentHtml += `
            <button class="flex flex-row items-center hover:bg-gray-100 rounded-xl p-2">
                <div class="flex items-center justify-center h-8 w-8 bg-purple-200 rounded-full overflow-hidden">
                    <img src=${item.avatar} alt=${item.username} />
                </div>
                <div class="ml-2 text-sm font-semibold">${item.username}</div>
            </button>
        `;
        return contentHtml;
    });
    document.getElementById("numberClient").innerHTML = userList.length;
    document.getElementById("listClientInRoom").innerHTML = contentHtml;
});

//Handle client 
socket.on("send the user who just joined the chat room from server to client", (userself) => {
    document.getElementById("avatarClient").src = userself.avatar;
    document.getElementById("nameClient").innerHTML = userself.username;
});