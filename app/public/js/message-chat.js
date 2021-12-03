const renderMessageChat = (message, isUserself) => {
    const { createdAt, messageText, avatar } = message;
    const contentHtmlMessage = isUserself ?
        `<div class="col-start-6 col-end-13 p-3 rounded-lg text-right">
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
        </div>`
        :
        `<div class="col-start-1 col-end-8 p-3 rounded-lg">
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
        </div>` ;
    document.getElementById("listMessage").innerHTML += contentHtmlMessage;
    document.getElementById("boxChat").scrollTop = document.getElementById("boxChat").scrollHeight;
}