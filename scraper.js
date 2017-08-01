var page = require('webpage').create();
page.viewportSize = { width: 1280, height: 800 };
link = "http://racing.natsoft.com.au/results";
//link = "testdata.html";
page.onConsoleMessage = function (msg) {
  console.log(msg);
};

page.open(link, function() {
    console.log("Started evaluation.");
    page.render("aftOpen.png");

    var btn;
    var type;
    //TODO Query changes based on
    var query;
    //Need to give time for buttonclick to register since its asynchronous
    setTimeout(function() {
              type = "\"Circuit Racing\"";
              query = 'img[title][title=\"Circuit Racing\"]';
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
                  fs.write('1.html', page.content, 'w');
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
      var j = document.querySelectorAll(query);
      console.log("Clicking " + type + " button...");
      j[0].click();
      return j;
    }, type, query);
  return btn;
}
