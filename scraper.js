var page = require('webpage').create();
var system = require('system');
page.viewportSize = { width: 1280, height: 800 };
link = "http://racing.natsoft.com.au/results";
//link = "testdata.html";
page.onConsoleMessage = function (msg) {
  console.log(msg);
};

page.open(link, function() {
    console.log("Started evaluation.");
    page.render("aftOpen.png");
    console.log("1: Circuit Racing 2: Speedway 3: Bikes 4: Kart");
    var response = system.stdin.readLine();
    var btn;
    var type;
    var query;
    var filename;

    if(response == "1"){
      type = "\"Circuit Racing\"";
      filename = "circuit";
    }
    else if (response == "2"){
      type = "\"Speedway\"";
      filename = "speedway";
    }
    else if (response == "3"){
      type = "\"Bikes\"";
      filename = "bikes";
    }
    else if (response == "4"){
      type = "\"Kart\"";
      filename = "kart";
      //Debug code since not fully implemented
      console.log("Kart not fully implemented. Exiting...");
      phantom.exit();
    }
    else { //Input not recognized, exit.
       console.log("Invalid input, exiting...");
       phantom.exit();
    }

    console.log("Type set to " + type);
    query = 'img[title][title=' + type + ']';
    //Need to give time for buttonclick to register since its asynchronous
    setTimeout(function() {
              btn = getButton(type, query);
              console.log("Rendering aftHeaderBtn.png...");
              page.render('aftHeaderBtn.png');
              console.log("Finished rendering!");
    }, 1000);

    setTimeout(function() {
              type = "Even Race";
              query = 'div[class][class="NListViewLinkEven"]';
              btn = getButton(type, query);
              console.log("Rendering aftEvenBtn.png...");
              page.render('aftEvenBtn.png');
              console.log("Finished rendering!");
    }, 2000);

    setTimeout(function() {
              type = "Results";
              query = 'a[class][class="NListViewLinkOdd"]';
              btn = getButton(type, query);
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
            }, 3000);

});
//Allows for proper evaluation of arguments because Javascript sucks
function evaluate(page, func) {
  var args = [].slice.call(arguments, 2);
  var fn = "function() { return (" + func.toString() + ").apply(this, " +     JSON.stringify(args) + ");}";
  return page.evaluate(fn);
};

function getButton(type, query){
  var btn = evaluate(page, function(type, query){
      console.log("Searching for " + type + " button...");
      var btn = document.querySelectorAll(query);
      console.log("Clicking " + type + " button...");
      btn[0].click();
      return btn;
    }, type, query);
  return btn;
}
