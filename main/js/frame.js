var pageLoading = document.querySelector(".pageLoading");
var frame = document.querySelector(".frame");
var iframeLoads = 0;
var loadingDisplay = "flex";
var bkgColor = "#081d28";

frame.onload = function(){
  iframeLoads++;
  if(iframeLoads==1) {
    //document.body.style.backgroundImage = "none";
    //document.body.style.backgroundColor = bkgColor;
  }
  pageLoading.style.display = "none";

  frame.contentWindow.onunload = unloading;

  if(this.contentWindow.location.pathname.startsWith("/service/")) {
    document.body.style.background = "none";
  } else {
    document.body.style.background = "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/img/space-tint.png')";
  }
}

function unloading(){
  pageLoading.style.display = loadingDisplay;
}
