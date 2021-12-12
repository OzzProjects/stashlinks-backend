const xj = new XMLHttpRequest();

function connLogger () {
  if (xj.readyState == 4 && xj.status == 200) {
    console.log(xj.responseText);
  }
};

//let port = process.env.PORT;
function sendTabdata (tab) {
  console.log("Send Tab: " + tab);
  xj.open("POST", "https://stashlinks-backend.herokuapp.com/"+process.env.PORT, true);
  xj.setRequestHeader("Content-Type", "application/json");
  xj.send(JSON.stringify({ "data": tab }));
  xj.onreadystatechange = connLogger();
}

chrome.runtime.onConnect.addListener(function (port) {
  if (console.assert(port.name == "knockknock") == true) {
    console.log("Connection script to background established");
  }

  port.onMessage.addListener(function (msg) {
    if (msg.joke.msg == "back") {
      const tab = msg.joke.data;
      sendTabdata(tab);
    } else {
      console.error("No data recieved from connection")
    }
  });
});
