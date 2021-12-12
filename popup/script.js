function sendtoPopup (tabs, i) {
  const newDiv = document.createElement("div");
  const newP = document.createElement("p");
  newDiv.setAttribute("id", "wrapperurl")
  newP.setAttribute("id", "url");
  newP.innerHTML = tabs[i].url;
  newP.style.font = "1em solid black";
  newP.style.fontWeight = "700";
  newP.style.fontFamily = "Arial, Helvetica, sans-serif";
  newDiv.appendChild(newP);
  newDiv.style.textAlign = "center";

  const currentDiv = document.getElementById("wrappermessage");
  currentDiv.after(newDiv);
}

function sendtoBackground (currentab) {
  const port = chrome.runtime.connect({ name: "knockknock" });
  port.postMessage({ joke: { msg: "back", data: currentab } });
};

const callback = function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    for (let i = 0; i < tabs.length; i++) {
      if (tabs[i].active == true) {
        console.log("Active Tab: " + tabs[i].url);
        sendtoBackground(tabs[i].url);
        sendtoPopup(tabs, i);
        return tabs[i].url;
      }
    }
  });
};

if (document.readyState === "complete" || (document.readyState !== "loading" && !document.documentElement.doScroll)) {
  callback();
} else {
  document.addEventListener("DOMContentLoaded", callback);
}
