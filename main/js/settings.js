var ab_cloak = document.getElementById("ab_cloak");
var tab_cloak = document.getElementById("tab_cloak");
var quick_links = document.getElementById("quick_links");
var auto_cloak = document.getElementById("auto_cloak");
var anti_close = document.getElementById("anti_close");
var allSettings = document.querySelectorAll("input");
var tabPresets = document.querySelectorAll("#details .tab");
var customTab = document.querySelectorAll("#detailBtn")[0];
var cancelBtn = document.querySelector("#removeBtn");
var openBlank = document.querySelector("#openBlank");
var openLinks = document.querySelector(".quickies");

saveTabCloak(localStorage.getItem("tabCloakTitle"), localStorage.getItem("tabCloakIcon"));

if(localStorage.getItem("tabCloakTitle") || localStorage.getItem("tabCloakIcon") || (localStorage.getItem("tabCloakTitle") && localStorage.getItem("tabCloakIcon"))) {
    cancelBtn.style.display = "inline";
}

if(localStorage.getItem("ab_cloak") == "true" && window.top.location.href != "about:blank"){
    openBlank.style.display = "block";
}

if(localStorage.getItem("quick_links") == "true"){
    openLinks.style.display = "block";
}

function isUrl(val = ''){ // quick links
    if (/^http(s?):\/\//.test(val) || val.includes('.') && val.substr(0, 1) !== ' ') return true;
    return false;
};

function isNumeric(value) {
    return /^-?\d+$/.test(value);
}

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
            this.newFrame = document.createElement("iframe");
            this.newFrame.style.border = "none";
            this.newFrame.style.display = "none";
            this.newFrame.src = "go.html?new4";
            document.body.appendChild(this.newFrame);
            window.location.href = '/service/' + this.id; 
        }
    }
}

openLinks.querySelector(".add").onclick = function(){
    this.quickLinkUrl = prompt("Enter the url you want to add to your quick links (ex. google.com). Click CANCEL to go back:");
    if(this.quickLinkUrl == null){return}
    this.quickLinkUrl = this.quickLinkUrl.trim();
    if (!isUrl(this.quickLinkUrl)) this.quickLinkUrl = 'https://www.google.com/search?q=' + this.quickLinkUrl;
    if (!(this.quickLinkUrl.startsWith('https://') || this.quickLinkUrl.startsWith('http://'))) this.quickLinkUrl = 'http://' + this.quickLinkUrl;
    this.quickLinkName = prompt("Enter the name you want for that URL (ex. Google). The name will be shown in 'Quick Links.' Click CANCEL to exit:");
    if(this.quickLinkName == null){return}
    this.currentLinks = localStorage.getItem("quickLinkDetails") == null ? [] : JSON.parse(localStorage.getItem("quickLinkDetails"));
    if (this.quickLinkName == "") this.quickLinkName = "No name set";
    this.currentLinks.push([this.quickLinkUrl, this.quickLinkName]);
    localStorage.setItem("quickLinkDetails", JSON.stringify(this.currentLinks));
    alert("Successfully added quick link.");

    updateLinks();
}

openLinks.querySelector(".rm").onclick = function(){
    if(localStorage.getItem("quickLinkDetails") == null) {
        alert("You have no quick links set.");
        return;
    }
    this.promptTxt = "Type the NUMBER of the quick link you want to remove. Below is a list of the your quick links:\n";
    for(var i=0;i<JSON.parse(localStorage.getItem("quickLinkDetails")).length;i++){
        this.promptTxt += "\n" + (i+1) + ": " + JSON.parse(localStorage.getItem("quickLinkDetails"))[i][1] + " - " + JSON.parse(localStorage.getItem("quickLinkDetails"))[i][0];
    }
    this.num = prompt(this.promptTxt);
    if((isNumeric(this.num) && this.num>0 && this.num <= JSON.parse(localStorage.getItem("quickLinkDetails")).length && JSON.parse(localStorage.getItem("quickLinkDetails"))[this.num-1].length == 2) == false) {this.continue = confirm("Invalid number.");return;}
    else {
        alert("Successfully deleted this quick link:\n\n" + this.num + ": " + JSON.parse(localStorage.getItem("quickLinkDetails"))[this.num-1][1] + " - " + JSON.parse(localStorage.getItem("quickLinkDetails"))[this.num-1][0]);
        this.newLinks = JSON.parse(localStorage.getItem("quickLinkDetails"));
        this.newLinks.splice(this.num-1,1);
        localStorage.setItem("quickLinkDetails", JSON.stringify(this.newLinks));
    }

    updateLinks();
}

openBlank.onclick = function() {
    var tab = window.open('about:blank', '_blank');
    tab.document.documentElement.innerHTML = '<!DOCTYPE html><html><head><title>' + /*(localStorage.getItem("tabCloakTitle") ? localStorage.getItem("tabCloakTitle") : "Utopia")*/'Utopia' + '</title><link rel="icon" type="image/png" href="' + /*(localStorage.getItem("tabCloakIcon") ? localStorage.getItem("tabCloakIcon") : window.location.origin + "/favicon.ico")*/window.location.origin + "/favicon.ico" + '"><style>body {margin:0;overflow:hidden}</style></head><body><iframe width="100%" height="100%" src="' + window.location.href + '" frameborder="0"></iframe></body></html>';
    tab.document.close();

    window.top.location.replace("https://www.google.com");
}

cancelBtn.onclick = function() {
    parent.document.title = "Utopia";
    localStorage.removeItem("tabCloakTitle");
    document.getElementById("cloakTitle").innerText = "none";

    parent.document.querySelector("link[rel~='icon']").href = "favicon.ico";
    localStorage.removeItem("tabCloakIcon");
    document.getElementById("cloakIcon").innerText = "none";

    cancelBtn.style.display = "none";
}

for(var i=0;i<allSettings.length;i++){
    allSettings[i].checked = (localStorage.getItem(allSettings[i].id) != null ? localStorage.getItem(allSettings[i].id) == "true" : allSettings[i].checked);

    if(allSettings[i].checked == true){
        localStorage.setItem(allSettings[i].id, true);
    } else {
        localStorage.setItem(allSettings[i].id, false);
    }

    allSettings[i].onclick = function() {
        localStorage.setItem(this.id, this.checked);
        document.querySelector("#" + this.id + " + label + p").classList.remove("appear");
        void document.querySelector("#" + this.id + " + label + p").offsetWidth;
        document.querySelector("#" + this.id + " + label + p").classList.add("appear");

        if(this.id == "ab_cloak"){
            if(localStorage.getItem(this.id) == "true" && window.top.location.href != "about:blank"){
                openBlank.style.display = "block";
            } else {
                openBlank.style.display = "none";
            }
        }

        if(this.id == "auto_cloak"){
            if(localStorage.getItem(this.id) == "true" && window.top.location.href != "about:blank"){
                var tab = window.open('about:blank', '_blank');
                tab.document.documentElement.innerHTML = '<!DOCTYPE html><html><head><title>' + /*(localStorage.getItem("tabCloakTitle") ? localStorage.getItem("tabCloakTitle") : "Utopia")*/'Utopia' + '</title><link rel="icon" type="image/png" href="' + /*(localStorage.getItem("tabCloakIcon") ? localStorage.getItem("tabCloakIcon") : window.location.origin + "/favicon.ico")*/window.location.origin + "/favicon.ico" + '"><style>body {margin:0;overflow:hidden}</style></head><body><iframe width="100%" height="100%" src="' + window.location.href + '" frameborder="0"></iframe></body></html>';
                tab.document.close();

                window.top.location.replace("https://www.google.com");
            }
        }

        if(this.id == "quick_links"){
            if(localStorage.getItem(this.id) == "true"){
                openLinks.style.display = "block";
                updateLinks();
            } else {
                openLinks.style.display = "none";
                document.querySelector(".dropdown-links").innerHTML = '<a href="settings.html"><span class="material-symbols-outlined" style="font-size:14px;">add_circle</span>&nbsp;Add links in <span style="text-decoration: underline;">Settings</span></a>';
            }
        }
    }
}

function saveTabCloak(title, icon) {
    if(title){
        //parent.document.title = title;
        localStorage.setItem("tabCloakTitle", title);
        document.getElementById("cloakTitle").innerText = title;
    }
    
    if(icon){
        //parent.document.querySelector("link[rel~='icon']").href = icon;
        localStorage.setItem("tabCloakIcon", icon);
        document.getElementById("cloakIcon").innerHTML = "<img src='" + icon + "' width='15px'>";
    }
}

for(var i=0;i<tabPresets.length;i++) {
    tabPresets[i].onclick = function() {
        if(this.id == "Classes") {
            saveTabCloak(this.id.replace(/_/g, " "), window.location.origin + "/img/classroom16.png");
        } else if(this.id == "Home_|_Schoology") {
            saveTabCloak(this.id.replace(/_/g, " "), window.location.origin + "/img/schoology16.png");
        } else {
            saveTabCloak(this.id.replace(/_/g, " "), this.src);
        }
        cancelBtn.style.display = "inline";
    }
}

customTab.onclick = function() {
    this.tabTitle = prompt("Enter the title you want:");
    this.tabIcon = prompt("Enter the URL for the icon you want. If you don't know how to get the icon of a website, try adding '/favicon.ico' at the end of the domain name (ex. example.com/favicon.ico):", "example.com/favicon.ico");

    if (!(this.tabIcon.startsWith('https://') || this.tabIcon.startsWith('http://'))) this.tabIcon = 'http://' + this.tabIcon;
    saveTabCloak(this.tabTitle, this.tabIcon);
    cancelBtn.style.display = "inline";
}
