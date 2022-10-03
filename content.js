// File: content.js
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.message === "clicked_browser_action") {
            // Looks something like: https://<website>.jpg?w=<size>
            // We need to strip off everything after the image extension.
            const imgUrlUntruncated = document.querySelector("meta[property=og\\:image]")["content"];
            const imgUrl = imgUrlUntruncated.split("?")[0];
            console.log("Downloading from URL: ", imgUrl);

            const postAuthor = document.querySelector('meta[property=og\\:title]')["content"];

            const postDateObj = document.querySelector("time");

            // Date is of the form "<Month Name> <Day>, <Year>"
            const postDateRaw = postDateObj.children[0].innerText;

            // TODO: Include the time the post was uploaded
            // Take the raw string date on the page, and convert it to a unix epoch, then convert that unix epoch to a datetime object
            const postDateJSObj = new Date(Date.parse(postDateRaw));

            // Store the date the file was downloaded
            const today = new Date();
            const timestamp = 'DA_'.concat(today.getFullYear(),
                '-', today.getMonth() + 1,
                '-', today.getDate(),
                'T', today.getHours(),
                '', today.getMinutes(),
                '', today.getSeconds());

            const safeFilenameRegex = "/[\/:*|?\"<>|]/g";

            // Call chrome.runtime.sendMessage directly
            const newFilename = ("".concat("vsco__", postAuthor.indexOf(' ') > 0 ? "" : postAuthor, "__", timestamp, "__", 'DC'.concat(postDateJSObj.getFullYear(),
                postDateJSObj.getMonth() + 1,
                postDateJSObj.getDay()), ".jpg"));


            console.log("Downloading file to location: ", newFilename);

            chrome.runtime.sendMessage({
                mediaUrl: imgUrl,
                filename: newFilename
            });
        }
    } // end function
);
