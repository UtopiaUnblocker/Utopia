var searchbar = document.getElementById("gsearchbar");
var resultElem = document.querySelector(".results");
var results = 0;

function searchGams() {
  var a=document.querySelectorAll('#glist a[href]');
  results = 0;
  for(var i=0;i<a.length;i++){
a[i].style.display=a[i].textContent.toUpperCase().indexOf(searchbar.value.toUpperCase())!=-1?'inline-block':'none';
    if(a[i].style.display == 'inline-block'){
      results++;
    }
  }

  if(searchbar.value != ""){
    resultElem.style.display = "block";
    resultElem.innerText = "Results found: " + results;
  } else {
    resultElem.style.display = "none";
  }
  /*for(var a=0;a<gameCategories.length;a++){
    var attrName = gameCategories[a].innerText.replace(/[^0-9a-z]/gi, '');
    var allInvis = true;
    var canRemoveCategory = false;
    for(var b=0;b<document.querySelectorAll("#glist #" + attrName + " a").length;b++){
      if(document.querySelectorAll("#glist #" + attrName + " a")[b].style.display != "none"){
        allInvis = false;
        console.log("element SHOWING:" + gameCategories[a].innerText);
      }
      if(b == (document.querySelectorAll("#glist #" + attrName + " a").length - 1) && allInvis == true){
        canRemoveCategory = true;
      }
    }
    if(canRemoveCategory == true){
      gameCategories[a].style.display = "none";
      console.log("HIDING category:" + gameCategories[a].innerText);
    }
  }
*/
}

function encodeUrl(str){
  if (!str) return str;
  return encodeURIComponent(str.toString().split('').map((char, ind) => ind % 2 ? String.fromCharCode(char.charCodeAt() ^ 2) : char).join(''));
}

var gams = document.querySelectorAll('#glist a[href]');

for(var i=0;i<gams.length;i++){
  gams[i].onclick = function(e){
    this.link = this.href;
    e.preventDefault();
    if(!this.id) {
      window.location.href = "/gams.html#" + this.pathname;
    } else {
      window.navigator.serviceWorker.register('/sw.js', {
        scope: __uv$config.prefix
      }).then(() => {
        if(!this.id.startsWith("http")){
          window.location.href = "/gams.html#" + __uv$config.prefix + encodeUrl(window.location.origin + this.id.replace(/\\\//g, "/"));
        } else {
          window.location.href = "/gams.html#" + __uv$config.prefix + encodeUrl(this.id.replace(/\\\//g, "/"));
        }
      });
    }
  };
}
