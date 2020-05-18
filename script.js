$(document).ready(function(){
if($(location).attr('href').includes('musicmagpie') && !$(location).attr('href').includes('My-Buying-Orders-View-Order') && !$(location).attr('href').includes('store')){
  var instance=getCookie('data');
  if(instance=="")
       setFirstMagpieOrderNumInCookie();
  else{
    var orderContent=JSON.parse(getCookie('data'));
    var orderNumber=orderContent[orderContent.length-1];
       if(orderNumber=='|')
           getNextMagpieOrderNum();
       else
          clickOnOrderNumLink();
    }
}
else if(contains($(location).attr('href'),['musicmagpie.co.uk','store','orders']))
  getMagpieOrderData();

else if(contains($(location).attr('href'),['uk.webuy.com','user','orderTracking']))
  getCexData();

else if(contains($(location).attr('href'),['game.co.uk','langId','storeId','pageSize=All']) && !contains($(location).attr('href'),['orderId']))
  clickGameOrder();

else if(contains($(location).attr('href'),['game.co.uk','orderId']))
  getGameOrderData();

});


var json_str;

//cex
async function getCexData(){
var check=getCookie('cexData');var orderContent=new Array();
if(check!="")
orderContent=JSON.parse(getCookie('cexData'));
await sleep(20000);var orderPosition;var orderNumber;var date;
$(".hlRow").each(function(index, element){
orderNumber= element.innerText.trim().split(" ")[0].split(" ")[0].split("£")[0].replace(new RegExp("\\s","g"),"");
if(element.rowIndex!=0 && !orderContent.includes(orderNumber)){
var dateArray=element.innerText.trim().split(" ");
date=dateArray[dateArray.length-1].replace(new RegExp("[a-zA-Z]","g"),"").replace(new RegExp("\\s","g"),"");
$(element).find(".arrowBox").click();
orderPosition=index;
return false;
}
});
if(orderNumber==undefined){
$(".order-tracking-tabs")[0].find("");
}
if(orderNumber!=undefined && !orderContent.includes(orderNumber)){
await sleep(10000);
var itemList=$(".weSellOrderDetails")[orderPosition].innerHTML.split("<tr>");
if(itemList[itemList.length-1].includes("Tracking Number"))
var listLength=itemList.length-2;
else
listLength=itemList.length-1;
var titles=new Array();
var prices=new Array();
var quantities=new Array();
var itemIds=new Array();
for(var i=2;i<listLength;i++){
titles.push(itemList[i].split("class=\"\">")[1].split("</a>")[0]+"("+itemList[i].split("<td><br>")[3].split("</td>")[0]+")");
prices.push(itemList[i].split("\"><br><span>")[1].split("</span>")[0]);
itemIds.push(itemList[i].split("<em>")[1].split("</em>")[0]);
quantities.push(1);
}
if(itemList[listLength+1].includes("Tracking Number"))
var trackingNumber=itemList[listLength+1].split("trackNumber=")[1].split("\"")[0];
if(itemList[listLength].includes("Delivery"))
var total=itemList[listLength].split("\"><br><strong><span>")[1].split("</span>")[0];
var entireOrderData={'orderNumber':orderNumber,'date':date,'trackingNumber':trackingNumber,'titles':titles,'prices':prices,'quantities':quantities,'total':total,'itemIds':itemIds,'trackingNumber':trackingNumber}
    $.ajax({  url: 'https://simsapp.co.uk/api/orders/postJsonData?site='+'Cex',
              type: "POST",
              contentType:'application/json',
              data: JSON.stringify(entireOrderData),
              dataType:'json'
             });
   await sleep(15000);
   orderContent.push(orderNumber);
   json_str = JSON.stringify(orderContent);
   setCookie('cexData',json_str);
   location.reload();
}
}



//Game
function clickGameOrder(){
var check=getCookie('gameData');var cookieData=new Array();
if(check!="")
cookieData=JSON.parse(getCookie('gameData'));
$(".orderNum").each(function(index, element){
orderNumber = element.innerText;
if(index!=0 && !cookieData.includes(orderNumber)){
var href=element.outerHTML.split("href=\"")[1].split("\">")[0].replace(new RegExp("amp;", "g"),"");
window.open(href,'_self');
return false;
}
});
}

//Game
async function getGameOrderData(){
var check=getCookie('gameData');var orderContent=new Array();
if(check!="")
orderContent=JSON.parse(getCookie('gameData'));
var orderNumber=$(".orderDetailsHead >.orderNumber")[0].innerText.split("Number ")[1];
var date=$(".orderDetailsHead >.orderDate")[0].innerText.split("Date ")[1]
var title;var quantity;var price;var status;
var itemList=$(".orderDetailsItems >")[0].innerHTML.split("</tbody")[0].split("<tbody")[1].split("items");
var titles=new Array();
var quantities=new Array();
var prices=new Array();
var statuses=new Array();
for(var i=1;i<itemList.length;i++){
title=itemList[i].split("productName\">")[1].split("</")[0]+itemList[i].split("platform\">")[1].split("</")[0];
quantity=itemList[i].split("quantity\">")[1].split("</")[0].replace(new RegExp("\\s","g"),"");
price=itemList[i].split("price\">")[1].split("</")[0].replace(new RegExp("\\s","g"),"");
status=itemList[i].split("status\">")[1].split("</")[0].replace(new RegExp("\\s","g"),"");
titles.push(title);
quantities.push(quantity);
prices.push(price);
statuses.push(status);
}
var entireOrderData={'orderNumber':orderNumber,'date':date,'titles':titles,'quantities':quantities,'prices':prices,'statuses':statuses}
    $.ajax({  url: 'https://simsapp.co.uk/api/orders/postJsonData?site='+'Game',
              type: "POST",
              contentType:'application/json',
              data: JSON.stringify(entireOrderData),
              dataType:'json'
             });
   await sleep(15000);
   orderContent.push(orderNumber);
   json_str = JSON.stringify(orderContent);
   setCookie('gameData',json_str);
   var href=$("#content").find(".back").attr('href')+'&pageSize=All';
   window.open(href,'_self');
}


//MusicMagpie
function setFirstMagpieOrderNumInCookie(){
$(".newBuyingLineReturns").each(function(index, element){
order = $(element).find(".orderNumberReturns")[0].innerHTML.split("<span>")[1].split("</span>");
var orderNumber=order[0].substr(1);
var orderDate=order[1].split("> ")[1];
var jsData=new Array(orderNumber);
json_str = JSON.stringify(jsData);
setCookie('data',json_str);
var orderContent=JSON.parse(getCookie('data'));
orderContent.push(orderDate);
json_strDate = JSON.stringify(orderContent);
setCookie('data',json_strDate);
location.reload();
});
}


//MusicMagpie
function clickOnOrderNumLink(){
var orderContent=JSON.parse(getCookie('data'));
var orderNumber=orderContent[orderContent.length-2];
$(".newBuyingLineReturns").each(function(index, element){
order = $(element).find(".orderNumberReturns")[0].innerHTML.split("<span>")[1].split("</span>");
var orderNum=order[0].substr(1);
  if(orderNum.localeCompare(orderNumber)==0){
    var href="https://www.musicmagpie.co.uk/store/orders/"+orderNum;
    window.open(href,'_self');
   }
});
}


//MusicMagpie
async function getMagpieOrderData(){
var orderContent=JSON.parse(getCookie('data'));
var orderDetails=document.getElementById("non-insurance").innerHTML.split("Order number")[1].split("Order Summary")[0];
var orderNumber=orderDetails.split("</h4>")[0];
var date=orderContent[orderContent.length-1];
var pricePaid=orderDetails.split("xl-font\">")[1].split(" ")[0].replace(new RegExp("\\n","g"),"");
var quantity=orderDetails.split("xl-font\">")[1].split(" ")[1].split(")")[0].replace("(","").replace(new RegExp("\\n","g"),"");
var orderSplit=document.getElementById("non-insurance").innerHTML.split("Order number")[1].split("Order Summary")[1].split("option-item flex-container");
var titles=new Array();
var quantities=new Array();
var prices=new Array();
var conditions=new Array();
for(var i=1;i<orderSplit.length;i++){
titles.push(orderSplit[i].split("<strong>")[1].split("</p>")[0].replace("</strong>&nbsp;"," ").replace(new RegExp("\\n","g"),""));
prices.push(orderSplit[i].split("flex-center-vertically\">")[2].split("</strong>")[0].replace("<strong>","").replace(new RegExp("\\n","g"),""));
quantities.push(orderSplit[i].split("flex-center-vertically\">")[1].split("</div>")[0].replace(new RegExp("\\n","g"),""));
conditions.push(orderSplit[i].split("Condition: ")[1].split("<br>")[0].replace(new RegExp("\\n","g"),""));
}
var entireOrderData={'orderNumber':orderNumber,'date':date,'pricePaid':pricePaid,'quantity':quantity,'titles':titles,'prices':prices,'quantities':quantities,'conditions':conditions}
    $.ajax({  url: 'https://simsapp.co.uk/api/orders/postJsonData?site='+'MusicMagpie',
              type: "POST",
              contentType:'application/json',
              data: JSON.stringify(entireOrderData),
              dataType:'json'
             });
   await sleep(15000);
   orderContent.push('|');
   json_str = JSON.stringify(orderContent);
   setCookie('data',json_str);
   window.history.back();

}



//MusicMagpie
function getNextMagpieOrderNum(){
var orderContent=JSON.parse(getCookie('data'));
var previousOrderNum;
var previousOrderDate;
var orderNumber=orderContent[orderContent.length-3];
$(".newBuyingLineReturns").each(function(index, element){
order = $(element).find(".orderNumberReturns")[0].innerHTML.split("<span>")[1].split("</span>");
var orderNum=order[0].substr(1);
var orderDate=order[1].split("> ")[1];
if(orderNum.localeCompare(orderNumber)!=0){
previousOrderNum=order[0].substr(1);
previousOrderDate=order[1].split("> ")[1];
}
  if(orderNum.localeCompare(orderNumber)==0){
   orderContent.push(previousOrderNum);
   orderContent.push(previousOrderDate);
   json_str = JSON.stringify(orderContent);
   setCookie('data',json_str);
   location.reload();
}
});
}



function setCookie(cname, cvalue) {
  var d = new Date();
  d.setTime(d.getTime() + (30 * 24 * 60 * 60 * 1000));
  var expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
function contains(target, pattern){
    var value = 0;
    pattern.forEach(function(word){
      value = value + target.includes(word);
    });
if(value==pattern.length)
    return true;
else
    return false;
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
