var search = document.getElementById("search");
var loading = document.querySelector("#loading");
//var submitBtn = document.querySelector(".submit");
//var loadingText = '<img src="/img/loading.png" class="loading" style="margin:0" height="16">';

function submitUrl(prx){
  if(/\S/.test(search.value)){
    //submitBtn.innerHTML = loadingText;
    quickGo(search.value, prx);
  }
}

function decodeUrl(str){
  if (!str) return str;
  let [ input, ...search ] = str.split('?');

  return decodeURIComponent(input).split('').map((char, ind) => ind % 2 ? String.fromCharCode(char.charCodeAt(0) ^ 2) : char).join('') + (search.length ? '?' + search.join('?') : '');
}

if(/*localStorage.getItem("ab_cloak") == "true" && */window.top.location.href != "about:blank") {
  //document.getElementById("blank").style.display = "inline-block";
} else {
  //document.getElementById("disc").style.marginTop = "-30px";
  //document.getElementById("blank").style.display = "none";
}

/*document.getElementById("blank").onclick = function (){
  var tab = window.open('about:blank', '_blank');
  tab.document.documentElement.innerHTML = '<!DOCTYPE html><html><head><title>' + /*(localStorage.getItem("tabCloakTitle") ? localStorage.getItem("tabCloakTitle") : "Utopia")*/'Utopia' + '</title><link rel="icon" type="image/png" href="' + /*(localStorage.getItem("tabCloakIcon") ? localStorage.getItem("tabCloakIcon") : window.location.origin + "/favicon.ico")*/window.location.origin + "/favicon.ico" + '"><style>body {margin:0;overflow:hidden}</style></head><body><iframe width="100%" height="100%" src="' + window.location.href + '" frameborder="0"></iframe></body></html>';
  /*tab.document.close();
  
  window.top.location.replace("https://www.google.com");
}*/

if(search){search.addEventListener('keydown', function onEvent(e) {
  if (e.key === "Enter"){uv(search.value)}  if(e.key === "Escape"){search.blur()}   })  };
//submitBtn.onclick = () => {uv(search.value)};

/* ENCODING URL */

function encodeB64(str){
  str = str.toString();
  const b64chs = Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=');
  let u32;
  let c0; 
  let c1; 
  let c2; 
  let asc = '';
  let pad = str.length % 3;
  
  for (let i = 0; i < str.length;) {
    if((c0 = str.charCodeAt(i++)) > 255 || (c1 = str.charCodeAt(i++)) > 255 || (c2 = str.charCodeAt(i++)) > 255)throw new TypeError('invalid character found');
    u32 = (c0 << 16) | (c1 << 8) | c2;
    asc += b64chs[u32 >> 18 & 63]
        + b64chs[u32 >> 12 & 63]
        + b64chs[u32 >> 6 & 63]
        + b64chs[u32 & 63];
  }
  
  return encodeURIComponent(pad ? asc.slice(0, pad - 3) + '==='.substr(pad) : asc);
}

function encodeXor(str){
  if (!str) return str;
  return encodeURIComponent(str.toString().split('').map((char, ind) => ind % 2 ? String.fromCharCode(char.charCodeAt() ^ 2) : char).join(''));
}

/* GETTING URL */

function quickGo(url, prx){
  if(prx == "wm"){
    wm(defaultUrl(url));
  }
  else if(prx == "uv"){
    uv(url);
  }/* else {
    cr(defaultUrl(url));
  }*/
}

function defaultUrl(url){
  if( !url.includes('.') && !url.startsWith('https://') && !url.startsWith('http://') ){
    this.url = "https://www.google.com/search?q=" + url;
  }
  else if (url.startsWith('https://')) {
    this.url = url;
  } else if(url.startsWith('http://')) {
    this.url = 'https://' + url.substring(7);
  } else if (url.startsWith('//')) {
    url = 'https:' + url;
  } else {
    this.url = 'https://' + url;
  }
  return this.url;
}

function isUrl(val = ''){ //uv
  if (/^http(s?):\/\//.test(val) || val.includes('.') && val.substr(0, 1) !== ' ') return true;
  return false;
};

/* BUTTON FUNCTIONS */
/*
function ggl() { // Google
  quickGo("https://google.com");
}

function yt() { // Youtube
  quickGo("https://youtube.com");
}

function invds() { // Invidious
  quickGo("https://yewtu.be");
}

function rbt() { // Rebbit
  quickGo("https://reddit.com"); //window.top.location = "url";
}

function cr(url) { // Open Corrosion
  window.location.href = "/beta/" + encodeB64(url);
}
*/
function uv(url) { // Open Ultraviolet
  loading.style.display = "flex";
  loading.querySelectorAll("span")[1].innerText = "loading content";
  window.setTimeout(function(){
    loading.querySelectorAll("span")[1].innerText = "heavy server load may cause slowness";
  }, 2500);
  window.setTimeout(function(){
    loading.querySelectorAll("span")[1].innerHTML = "there might be an error; join our <span style='text-decoration:underline;cursor:pointer;color:rgb(200,200,255);' onclick=\"window.open('https://discord.gg/hFZC5cgsmq', '_blank');\">discord</span> for support";
  }, 15000);
  window.navigator.serviceWorker.register('./sw.js', {
    scope: __uv$config.prefix
  }).then(() => {
    this.url = url.trim();
    if (!isUrl(this.url)) this.url = 'https://www.google.com/search?q=' + this.url;
    else if (!(this.url.startsWith('https://') || this.url.startsWith('http://'))) this.url = 'http://' + this.url;
    if(url != ""){
      if(localStorage.getItem("ab_cloak") == "true") {
        var tab = window.open('about:blank', '_blank');
        tab.document.documentElement.innerHTML = '<!DOCTYPE html><html><head><title>' + /*(localStorage.getItem("tabCloakTitle") ? localStorage.getItem("tabCloakTitle") : "Utopia")*/'Utopia' + '</title><link rel="icon" type="image/png" href="' + /*(localStorage.getItem("tabCloakIcon") ? localStorage.getItem("tabCloakIcon") : window.location.origin + "/favicon.ico")*/window.location.origin + "/favicon.ico" + '"><style>body {margin:0;overflow:hidden}</style></head><body><iframe width="100%" height="100%" src="' + window.location.origin + __uv$config.prefix + encodeXor(this.url) + '" frameborder="0"></iframe></body></html>';
        tab.document.close();
    
        window.top.location.replace("https://www.google.com");
      } else {
        window.location.href = __uv$config.prefix + encodeXor(this.url);
      }
    }
  });
}

function rh() { // Open Rammerhead
  wlh = window.location.hostname;
  window.location.href = "https://r." + (wlh.startsWith("www") ? wlh.substring(4) : wlh);
}
/*
function wm(url) { // Open Womginx
  wlh = window.location.hostname;
  window.location.href = "https://science." + (wlh.startsWith("www") ? wlh.substring(4) : wlh) + "/main/" + quickGo(url);
}
*/