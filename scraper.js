var page = require('webpage').create();
var system = require('system');
page.viewportSize = { width: 1280, height: 800 };
link = "http://racing.natsoft.com.au/results";
//link = "test.html";
page.onConsoleMessage = function (msg) {
  console.log(msg);
};

page.open(link, function() {
    console.log("Started evaluation.");
    page.render("aftOpen.png");

    //Main program flow
    var filename = getRaceResponse();
    //Currently debugging this
    getFilter();
    //getRaceEvent();
    //getRaceResults(filename);

});

function getRaceResponse(){
  console.log("1: Circuit Racing 2: Speedway 3: Bikes 4: Kart");
  var response = system.stdin.readLine();
  //Debug-REMOVE LATER
  response = "1";
  switch(response) {
    case "1":
        type = "\"Circuit Racing\"";
        filename = "circuit";
        break;

    case "2":
        type = "\"Speedway\"";
        filename = "speedway";
        break;

    case "3":
        type = "\"Bikes\"";
        filename = "bikes";
        break;

    case "4":
        type = "\"Kart\"";
        filename = "kart";
        //Debug code since not fully implemented
        console.log("Kart not fully implemented. Exiting...");
        phantom.exit();
        break;

    default: //Input not recognized, exit.
        console.log("Invalid input, exiting...");
        phantom.exit();
    }
  getRaceType(type);
  return filename;
}

function getRaceType(type){
  console.log("Type set to " + type);
  var query = 'img[title][title=' + type + ']';
  //Need to give time for buttonclick to register since its asynchronous
  setTimeout(function() {
            var btn = getButton(type, query);
            console.log("Rendering aftHeaderBtn.png...");
            page.render('aftHeaderBtn.png');
            console.log("Finished rendering!");
  }, 1000);
};

function getFilter(){
  setTimeout(function(){
            var type = "Track List"
            var query = 'select[title][title="Track "]';
            var btn = getButton(type, query);
            btn = btn[0];
            //Now have the select element
            //TODO NOT WORKING :C
            //console.log("btn id: " + btn.id);
            console.log("btn opt length: " + btn.options.length);
          //  console.log(btn[0].id);
            var options = [];
            options = getOptions(btn);
            //console.log(options);
  }, 2000)
};

//test
function getOptions(btn) {
  var lst = [];
  page.evaluate(function(btn, lst){
       btn = document.getElementById(btn.id);
       console.log(btn);
       console.log(btn.options[1].text);
       var i;
       for (i = 0; i < btn.options.length; i++){
         lst.push(btn.options[i].text);
         console.log(btn.options[i].text);
       };
  }, btn, lst);
  return lst;
};

function getRaceEvent(){
  setTimeout(function() {
            var type = "Even Race";
            var query = 'div[class][class="NListViewLinkEven"]';
            var btn = getButton(type, query);
            console.log("Rendering aftEvenBtn.png...");
            page.render('aftEvenBtn.png');
            console.log("Finished rendering!");
  }, 3000);
};

function getRaceResults(filename){
  setTimeout(function() {
            var type = "Results";
            var query = 'a[class][class="NListViewLinkOdd"]';
            var btn = getButton(type, query);
            var WebPage = require('webpage');
            page = WebPage.create();
            var link = btn[0].href;
            page.open(link);
            console.log("Opening " + link + "...");
            page.onLoadFinished = function(){
                console.log("Rendering aftResultsBtn.png...");
                page.render('aftResultsBtn.png');
                console.log("Finished rendering!");

                var fs = require('fs');
                console.log("Writing result to file...");
                fs.write(filename + '.html', page.content, 'w');
                console.log("Write complete!");
                console.log("Exiting...");
                phantom.exit();
            }
          }, 4000);
};

function getButton(type, query){
  var btn = evaluate(page, function(type, query){
      console.log("Searching for " + type + " button...");
      var btn = document.querySelectorAll(query);
      console.log("Clicking " + type + " button...");
      if(type != "Track List"){
        btn[0].click();
      }
      return btn;
    }, type, query);
  return btn;
};

//Allows for proper evaluation of arguments because Javascript sucks
function evaluate(page, func) {
  var args = [].slice.call(arguments, 2);
  var fn = "function() { return (" + func.toString() + ").apply(this, " +     JSON.stringify(args) + ");}";
  return page.evaluate(fn);
};
