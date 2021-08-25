// content.js
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if( request.message === "clicked_browser_action" ) {
          // Looks something like: https://<website>.jpg?w=<size>
          // We need to strip off everything after the image extension.
          const imgUrlUntruncated = document.querySelector("meta[property=og\\:image]")["content"];

          const postAuthor = document.querySelector('meta[property=og\\:title]')["content"];

          const postDateObj = document.querySelector("time");

          // Date is of the form "<Month Name> <Day>, <Year>"
          // Time is of the form: "AB:CD <A|P>M"

          const postDateRaw = postDateObj.children[0].innerText;
          const postTimeRaw = postDateObj.children[1].innerText;

          const postDateJSObj = Date.parse("".concat(postDateRaw, " ", postTimeRaw));
          const today = new Date();
          const timestamp = 'DA_'.concat(today.getFullYear(),
                                    '-', today.getMonth() + 1,
                                    '-', today.getDate(),
                                    'T', today.getHours(),
                                    '', today.getMinutes(),
                                    '', today.getSeconds());
        
         
        // Call chrome.runtime.sendMessage directly
          


      }

      function downloadMediaFromPost(mediaUrl, filenameToSaveAs) {
          chrome.runtime.sendMessage({mediaUrl: mediaUrl, filename: filenameToSaveAs});
      }

      function constructDownloadedFilename(author, dateUploadedUnixTs) {
          const today = new Date();
          const timestamp = 'DA_'.concat(today.getFullYear(),
                                  '-', today.getMonth(),
                                  '-', today.getDate(),
                                  'T', today.getHours(),
                                  '', today.getMinutes(),
                                  '', today.getSeconds());

          // Unix epochs/timestamps are in units of seconds, whereas Javascript date objects use milliseconds.
          const uploadDateObj = new Date(dateUploadedUnixTs * 1000);

          const uploadDate = 'DC_'.concat(uploadDateObj.getFullYear(),
              '-', uploadDateObj.getMonth() + 1, // Javascript months are 1-indexed, while days within months are 0-indexed
              '-', uploadDateObj.getDate(),
              'T', uploadDateObj.getHours(),
              '', uploadDateObj.getMinutes(),
              '', uploadDateObj.getSeconds());

          return author.concat("__", timestamp, "__", uploadDate, (mediaFmt === "vid") ? "_v.mp4" : "_i.jpg");
      }
    }
  );
