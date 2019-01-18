


function myFunction() {
    var x = document.getElementById("mainNav");
    if (x.className === "topnav") {
        x.className += " responsive";
    } else {
        x.className = "topnav";
    }


}


function loadFile(fileObject) {
    var URLFile = fileObject.files[0];
    var reader = new FileReader();

    reader.readAsText(URLFile);
    reader.onload = function (e){
      displayURL(e);
    }
}

function random(min, max) {
    return Math.floor(Math.random() * max) + min
}

function displayURL (e){

  var lines = e.target.result.split('\n');
  var response;

  for(var urlIndex = 0; urlIndex < lines.length; urlIndex++){
      var url = new URL(lines[urlIndex]);
      var ip = "";
      var port="";
      dnsRequest  = new XMLHttpRequest();
      dnsRequest.open("GET", "https://dns.google.com/resolve?name=" + url.hostname, false);
      dnsRequest.onreadystatechange = function() {
       if (dnsRequest.readyState == 4) {
          response = (JSON.parse(dnsRequest.responseText)).Answer;
          response = response[response.length -1].data;
        }
      };
      dnsRequest.send();
      if (typeof (response) != "undefined"){
        ip = response;
      }
      console.log (url.port);
      if (!isNumber(parseInt(url.port,10))){
        if (url.protocol == "http:"){
          port = "80";
        }
        if (url.protocol == "https:"){
          port = "443";
        }
        if (url.protocol == "ftp:"){
          port = "21";
        }
        if (url.protocol == "sftp:"){
          port = "22";
        }
       }
      else{
       port = url.port;
      }

     urlParts = url.hostname.split(".");
     topLevelDomain = "." + urlParts[urlParts.length - 1]

      addRowToURLTable ([url.protocol.toString(),
                          topLevelDomain,
                          port.toString(),
                          url.pathname.toString(),
                          url.searchParams.toString(),
                          url.hash.toString(),
                          ip.toString()])



   }
   drawPieChart (document.getElementById("urlTable"), document.getElementById("chartContainer"));

}

function isNumber(n){
    return typeof(n) != "boolean" && !isNaN(n);
}

function drawPieChart (table, container) {


  var hiding = document.getElementById("urlTableContainer");
  hiding.classList.remove("hiddenElem");

  var hiding = document.getElementById("urlTable");
  hiding.classList.remove("hiddenElem");

  var dataForCharts = summarize (table);
  var charts = [];

  for (var i = 0; i < 3; i++) {
    var name = table.rows[0].cells[i].childNodes[0].nodeValue;

    var div = document.createElement("div");
    div.classList.add("chart");
    div.classList.add(name);


     charts[i] = new CanvasJS.Chart(div, {
      animationEnabled: true,
      title: {
        text: name
      },
      data: [{
        type: "pie",
        startAngle: 240,
        yValueFormatString: "##0.00\"%\"",
        indexLabel: "{label} {y}",
        dataPoints: dataForCharts[i]
      }]
    });
     container.appendChild(div);
     console.log (dataForCharts[i]);
    charts[i].render();

}


}
function getCol (table, colNo){
  var rows = table.rows;
  var col =[];
  for (var i =0; i < rows.length; i++) {
    col [i] = rows[i].cells[colNo].childNodes[0].nodeValue;
  }
  return col;

}
function summarize (table){
  var rows = table.rows;
  var allCols =[];
  var dataPointsCollection = [];
  for (var i = 0; i < rows[0].cells[0].childNodes[0].length; i++) {
    var dataPoints = new Array ();
    var col = getCol(table,i);
    var labelName = col[0];
    var uniqueElems;
    var withoutHeader = col;
    withoutHeader.shift();
    uniqueElems = getUnique (withoutHeader);
    for (var j = 0; j < uniqueElems.length; j++) {
      var percent = getPercentage(uniqueElems[j],col);
      dataPoints[j] = {y: percent, label: uniqueElems[j]};
    }
    dataPointsCollection[i] = dataPoints;

  }


  return dataPointsCollection;

}

function getUnique (arr){
  var unique = [];
  for (var i = 0; i < arr.length; i++) {
   if (!exists( arr[i], unique)){
      unique.push(arr[i]);
   }
  }
return unique;
}

function exists (elem, arr){
  var match
  for (var i = 0; i < arr.length; i++) {
    match  = arr[i];
   if (elem == match){
      return true;
   }
  }
  return false;
}
function getPercentage (elem, arr){
  var count = 0;
  for (var i = 0; i < arr.length; i++) {
    if (elem == arr[i]){
        count++
    }
  }
  return count/arr.length*100;
}


function addRowToURLTable (urlDetails){
  var table = document.getElementById("urlTable");
  var row = table.insertRow(table.length);
  for (var urlIt = 0; urlIt < urlDetails.length; urlIt++){
    var urlPart = urlDetails[urlIt];

    if (typeof(urlPart) == "undefined" || urlPart == "") urlPart = "N/A";
    row.insertCell(urlIt).innerHTML = urlPart ;
  }

}



function random (min, max){
  return Math.floor(Math.random()*(max-min+1)+min);
}

function clearIPs(){
  var table = document.getElementById("IPTable");
  table.classList.add("hiddenElem");
  for(var i = table.rows.length - 1; i > 0; i--){
    table.deleteRow(i);
  }
}
function generateIPs (){

  var table = document.getElementById("IPTable");
  var classLabel = document.getElementById("IPClass");
  var classLabelVal = classLabel.options[classLabel.selectedIndex].value;  

  var adressType = document.getElementById("IPVersion");
  var isIPV6 = adressType.options[adressType.selectedIndex].value;

  var zeroCompression = document.getElementById("IPCompression");
  var hasCompression = zeroCompression.options[zeroCompression.selectedIndex].value;

  var noOfAddresses = document.getElementById("amtOfIP").value;
  var type;

  var IPs =[];
  var newIP;
  if (isIPV6 == "false"){
    type = "IPv4";
    while (IPs.length < noOfAddresses){
      IPs.push(generateIPv4(classLabelVal));
      IPs = getUnique (IPs);
    }
  }
  else {
    type = "IPv6";
    classLabelVal = "Classless";
    while (IPs.length < noOfAddresses){
      IPs.push(generateIPv6(hasCompression));
      IPs = getUnique (IPs);
    }


  }
  if (noOfAddresses >=1) addIPRows (IPs, type, classLabelVal);
}

function addIPRows (IPs, type, classLabel){
  var table = document.getElementById("IPTable");
  for (var ip = 0; ip < IPs.length; ip++){
    var row = table.insertRow(table.length);
    row.insertCell(0).innerHTML = type;
    row.insertCell(1).innerHTML = IPs[ip];
    row.insertCell(2).innerHTML = classLabel;
  }
  table.classList.remove("hiddenElem");
}
function generateIPv4 (classLabel){
  var first = "";
  if (classLabel == "Classless") first = random (0,255) ;
  if (classLabel == "A")  first = random (0,127);
  if (classLabel == "B")  first = random (128,191);
  if (classLabel == "C")  first = random (192,223);
  if (classLabel == "D")  first = random (239,254);
  if (classLabel == "E")  first = random (192,254);


  return first + "." + random (0,255) + "." 
                    + random (0,255) + "." 
                    + random (0,255);
          
    
}
function generateIPv6 (hasCompression){
  var ip = "";
  for(i = 0; i < 8; ++i){
    for(j = 0; j < 4; ++j){
      ip += toHex (random(0,15));
    }
    ip += ":";
  }
  ip = ip.substring(0, ip.length - 1);

  if (hasCompression){
	  ip = ip.replaceAll ("0000","*");
	  ip = ip.replaceAllReg (":0+",":");
	  ip = ip.replace (new RegExp(":\\*:\\*(:\\*)+:", 'g'),"::");
	  ip = ip.replaceAll ("*", 0);
  }
  return ip;
}
String.prototype.replaceAllReg = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};


function toHex (decimal){
  hexString = decimal.toString(16);
  return hexString;
}

var curPage;
var firstCall = true;



window.onload = pageLoad;
function pageLoad(){
  changePage();
}

window.onhashchange = changePage;
function changePage (){
  var hash = location.hash.substr(1);
  displayPage(hash);
}
var firstCall = true;
function displayPage(hash) {
  if (firstCall == false){
    curPage.style.display = "none";
  }
  curPage = document.getElementById(hash);
  curPage.style.display = "block";
  firstCall = false;
}
var btnContainer = document.getElementById("mainNav");
