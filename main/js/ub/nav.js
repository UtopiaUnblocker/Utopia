var menuIcon = document.querySelector(".hamburger");
var menuBtn = document.getElementById("menuBtn");
var navbar = document.querySelector(".navbar");
var links = document.querySelector(".pages");
var linkBtns = document.querySelectorAll("#pageHover");
var centeredStuff = document.querySelector(".center");
var dropdown = document.querySelector(".dropdown");
var dropdownLinks = document.querySelector(".dropdown-links");

document.body.classList.add('notransition'); //disable on load
document.body.classList.remove('notransition'); //enable after

menuIcon.style.top = ((navbar.clientHeight - linkBtns[0].clientHeight*3)/2 -13).toString() + "px";

menuIcon.onclick = function(){
  if(menuBtn.innerText != "close"){
    menuBtn.innerText = "close";
  } else {
    menuBtn.innerText = "menu";
  }
  for(var i=0;i<linkBtns.length;i++){
    linkBtns[i].classList.toggle('show');
  }
}

dropdown.onmouseover = function() {
  dropdownLinks.style.display = "block";
  dropdownLinks.style.opacity = "1";
  dropdownLinks.style.animation = "0.4s dropdownFadeIn";
}

dropdown.onmouseout = function() {
  dropdownLinks.style.opacity = "0";
  dropdownLinks.style.animation = "0.3s dropdownFadeOut";
}

dropdownLinks.addEventListener("animationend", function() {
  if(dropdownLinks.style.opacity == "0") {
    dropdownLinks.style.display = "none";
  }
}, false);

function encodeUrl(str){
  if (!str) return str;
  return encodeURIComponent(str.toString().split('').map((char, ind) => ind % 2 ? String.fromCharCode(char.charCodeAt() ^ 2) : char).join(''));
}

function updateLinks() {
  if(localStorage.getItem("quickLinkDetails") != null) {
    this.links = JSON.parse(localStorage.getItem("quickLinkDetails"));
  } else {return;}
  if(this.links.length == 0) {
    document.querySelector(".dropdown-links").innerHTML = '<a href="settings.html"><span class="material-symbols-outlined" style="font-size:14px;">add_circle</span>&nbsp;Add links in <span style="text-decoration: underline;">Settings</span></a>';
    return;
  }
  document.querySelector(".dropdown-links").innerHTML = "";
  for(var i=0;i<this.links.length;i++){
    this.newLink = document.createElement("a");
    this.newLink.href = "#";
    this.newLink.id = encodeUrl(this.links[i][0]);
    this.newLink.innerText = this.links[i][1];
    document.querySelector(".dropdown-links").appendChild(this.newLink);

    this.newLink.onclick = function () {
      /*this.newFrame = document.createElement("iframe");
      this.newFrame.style.border = "none";
      this.newFrame.style.display = "none";
      this.newFrame.src = "go.html";
      document.body.appendChild(this.newFrame);*/
      window.navigator.serviceWorker.register('/sw.js', {
        scope: __uv$config.prefix
      }).then(() => {
        console.log("Service worker (for Quick Links) registered.");
        window.location.href = __uv$config.prefix + this.id; 
      });
    }
  }
}

updateLinks();
