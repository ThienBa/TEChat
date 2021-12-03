const renderLocationChat = (data, isUserself) => {
    const { createdAt, messageText, avatar } = data;
    const contentHtmlMessage = isUserself ?
        `<div class="col-start-6 col-end-13 p-3 rounded-lg text-right">
            <span class="mr-14" style="font-size:12px;">${createdAt}</span>
            <div class="flex flex-row items-center">
                <div class="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
                    <iframe src="https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d251637.95196238213!2d${messageText.longitude}!3d${messageText.latitude}!3m2!1i1024!2i768!4f13.1!5e0!3m2!1svi!2s!4v1638449036051!5m2!1svi!2s" width="600" height="250" style="border:0;" loading="lazy"></iframe> 
                </div>
                <div
                    class="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0 overflow-hidden">
                        <img src=${avatar} alt=${avatar} />
                </div>
            </div>
        </div>`
        :
        ` <div class="col-start-1 col-end-8 p-3 rounded-lg">
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
        </div>` ;
    document.getElementById("listMessage").innerHTML += contentHtmlMessage;
    document.getElementById("boxChat").scrollTop = document.getElementById("boxChat").scrollHeight;
}