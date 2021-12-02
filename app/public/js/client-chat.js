const socket = io();

document.getElementById("formChat").addEventListener("submit", (e) => {
    e.preventDefault();
    const messageText = document.getElementById("inputChat").value;
    const acknowledgements = (error) => {
        if (error)
            return alert(error);
        console.log("Sent");
    }
    socket.emit('send message chat from client to server', messageText, acknowledgements);
});

socket.on('send message chat from server to client', (message) => {
    const { createdAt, messageText, avatar } = message;
    const contentHtmlMessage = `
        <div class="col-start-1 col-end-8 p-3 rounded-lg">
            <span class="ml-14" style="font-size:12px;">${createdAt}</span>
            <div class="flex flex-row items-center">
                <div
                    class="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0 overflow-hidden">
                        <img src=${avatar} alt=${avatar} />
                </div>
                <div class="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
                    <div>${messageText}</div>
                </div>
            </div>
        </div>
    `;
    document.getElementById("listMessage").innerHTML += contentHtmlMessage;
    //Clear input message
    document.getElementById("inputChat").value = "";
});

//Send message userself chat
socket.on("send message userself chat from server to client", (message) => {
    const { createdAt, messageText, avatar } = message;
    const contentHtmlMessage = `
            <div class="col-start-6 col-end-13 p-3 rounded-lg text-right">
            <span class="mr-14" style="font-size:12px;">${createdAt}</span>
            <div class="flex items-center justify-start flex-row-reverse">
                <div
                    class="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0 overflow-hidden">
                    <img src=${avatar} alt=${avatar} />
                </div>
                <div class="relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl">
                    <div>${messageText}</div>
                </div>
            </div>
            </div> 
    `;
    document.getElementById("listMessage").innerHTML += contentHtmlMessage;
    //Clear input message
    document.getElementById("inputChat").value = "";
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
    const { createdAt, messageText, avatar } = data;
    const contentHtmlMessage = `
            <div class="col-start-1 col-end-8 p-3 rounded-lg">
                <span class="ml-14" style="font-size:12px;">${createdAt}</span>
                <div class="flex flex-row items-center">
                    <div
                        class="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0 overflow-hidden">
                            <img src=${avatar} alt=${avatar} />
                    </div>
                    <div class="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
                        <iframe src="https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d251637.95196238213!2d${messageText.longitude}!3d${messageText.latitude}!3m2!1i1024!2i768!4f13.1!5e0!3m2!1svi!2s!4v1638449036051!5m2!1svi!2s" width="600" height="250" style="border:0;" loading="lazy"></iframe> 
                    </div>
                </div>
            </div>
        `;
    document.getElementById("listMessage").innerHTML += contentHtmlMessage;
})

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