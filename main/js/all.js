function inFrame () {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}

function usingFirefox(){
  return navigator.userAgent.indexOf("Firefox") != -1;
}

var redirectSite = "https://www.google.com";

if(inFrame() != true && usingFirefox() != true && localStorage.getItem("auto_cloak") == "true" && window.location.pathname != "/") {
  var tab = window.open('about:blank', '_blank');
  // Popup blocked
  if(!tab || tab.closed || typeof tab.closed=='undefined'){
    console.log("Popup blocked");
    window.top.location.replace(window.location.origin + '?url=' + window.location.pathname); //changeSrc handles the rest
  } else { // Finish tab b‍y‍p‍a‍s‍s
    tab.document.documentElement.innerHTML = '<!DOCTYPE html><html><head><title>' + /*(localStorage.getItem("tabCloakTitle") ? localStorage.getItem("tabCloakTitle") : "Utopia")*/'Utopia' + '</title><link rel="icon" type="image/png" href="' + /*(localStorage.getItem("tabCloakIcon") ? localStorage.getItem("tabCloakIcon") : window.location.origin + "/favicon.ico")*/window.location.origin + "/favicon.ico" + '"><style>body {margin:0;overflow:hidden}</style></head><body><iframe width="100%" height="100%" src="' + window.location.href + '" frameborder="0"></iframe></body></html>';
    tab.document.close();
    window.location.replace(redirectSite);
  }
}

if(localStorage.getItem("anti_close") == "true"){
  if(inFrame() != false){
    window.top.addEventListener('beforeunload', function (e) {
      e.preventDefault();
      e.returnValue = 'Are you sure you want to leave?';
    });
  } else {
    window.addEventListener('beforeunload', function (e) {
      e.preventDefault();
      e.returnValue = 'Are you sure you want to leave?';
    });
  }
}

var originalTitle = parent.document.title;

document.addEventListener('visibilitychange', function (event) {
  if (parent.document.hidden) {
    if(localStorage.getItem("tabCloakTitle")){
      parent.document.title = localStorage.getItem("tabCloakTitle");
    }
    
    if(localStorage.getItem("tabCloakIcon")){
      this.icon = parent.document.querySelector("link[rel~='icon']");
      if (!this.icon) {
        this.icon = parent.document.createElement("link");
        this.icon.rel = "icon";
        parent.document.getElementsByTagName("head")[0].appendChild(this.icon);
      }
      this.icon.href = localStorage.getItem("tabCloakIcon");
    }
  } else {
    parent.document.title = originalTitle;
    parent.document.querySelector("link[rel~='icon']").href = window.location.origin + "/favicon.ico";
  }

});
