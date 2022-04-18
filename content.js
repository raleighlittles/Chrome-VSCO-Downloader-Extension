// content.js
chrome.runtime.onMessage.addListener(

  function(request, sender, sendResponse) {
      if (request.message === "clicked_browser_action") {

          // Start by gathering metadata for the post
          const postAuthor = document.querySelector('meta[property=og\\:title]')["content"];
          const postDateObj = document.querySelector("time");
          // Date is of the form "<Month Name> <Day>, <Year>"
          const postDateRaw = postDateObj.children[0].innerText;

          // TODO: Include the time the post was uploaded
          // Take the raw string date on the page, and convert it to a unix epoch, then convert that unix epoch to a datetime object
          const postDateJSObj = new Date(Date.parse(postDateRaw));


          // Check if the post is a video by searching for a video URL. if no video element is found, you can assume its a photo
          // This can't be done the other way around, since video posts do include image URLs (for the thumbnail)
          const videoUrl = document.querySelector("meta[property=og\\:video\\:secure_url")["content"];

          // Image URLs something like: https://<website>.jpg?w=<size>
          // We need to strip off everything after the image extension.
          const imgUrlUntruncated = document.querySelector("meta[property=og\\:image]")["content"];
          const imgUrl = imgUrlUntruncated.split("?")[0];

          var postType;

          if (videoUrl != undefined) {
              postType = "v"; // video
              console.log("Downloading video from URL: ", videoUrl);
          } else {
              postType = "i"; // image
              console.log("Downloading image from URL: ", imgUrl);
          }

          chrome.runtime.sendMessage({
              mediaUrl: postType == 'v' ? videoUrl : imgUrl,
              filename: constructDownloadedFilename(postAuthor, postDateJSObj, postType)
          });
      }

      function constructDownloadedFilename(author, dateUploadedObj, mediaFmt) {
          // Store the date the file was downloaded
          const today = new Date();
          const timestamp = 'DA_'.concat(today.getFullYear(),
              '-', today.getMonth() + 1,
              '-', today.getDate(),
              'T', today.getHours(),
              '', today.getMinutes(),
              '', today.getSeconds());

          return "vsco__".concat(author, "_", timestamp, "__", 'DC'.concat(dateUploadedObj.getFullYear(), "-", dateUploadedObj.getMonth() + 1, "-", dateUploadedObj.getDate(), "T", today.getHours(), today.getMinutes(), today.getSeconds(), mediaFmt == "v" ? ".mp4" : ".jpg"));

        } // end constructDownloadedFilename

      } // end listener function
);