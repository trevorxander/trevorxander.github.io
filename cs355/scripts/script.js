


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

function addRowIP (IP, isIPV6, isClassless, classLabel, zeroCompression ){
  var table = document.getElementById("IPTable");
  var row = table.insertRow(table.length);
  for (var urlIt = 0; urlIt < urlDetails.length; urlIt++){
    var urlPart = urlDetails[urlIt];

    if (typeof(urlPart) == "undefined" || urlPart == "") urlPart = "N/A";
    row.insertCell(urlIt).innerHTML = urlPart ;
  }

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
