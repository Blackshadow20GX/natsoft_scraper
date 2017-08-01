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
    console.log("Searching for Circuit Racing Button...");
    var title = "\"Circuit Racing\""
    var fullTitle = 'img[title][title=' + title + ']';
    var k = evaluate(page, function(fullTitle){
          console.log(fullTitle);
          var j = document.querySelectorAll(fullTitle);
          j[0].click();
          return j;
      }, fullTitle);

    //Need to give time for buttonclick to register since its asynchronous
    setTimeout(function() {
              console.log("Rendering aftHeaderBtn.png...");
              page.render('aftHeaderBtn.png');
              console.log("Finished rendering!");
      }, 2000);

    getRaceList(k);

  });

function getRaceList(k)
{
  //Click on the specific race button
  setTimeout(function() {
        var k = page.evaluate(function(){
          console.log("Searching for Even Race button...");
          var j = document.querySelectorAll('div[class][class="NListViewLinkEven"]');
          console.log("Clicking Even Race button...");
          j[0].click();
          return j;
      });
            console.log("Rendering aftEvenBtn.png...");
            page.render('aftEvenBtn.png');
            console.log("Finished rendering!");
      }, 2000);

  //Click on the results button
  setTimeout(function() {
          var k = page.evaluate(function(){
            console.log("Searching for Results button...");
            var j = document.querySelectorAll('a[class][class="NListViewLinkOdd"]');
            console.log("Clicking Results button...");
            j[0].click();
            return j;
      });
            var WebPage = require('webpage');
            page = WebPage.create();
            var link = k[0].href;
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
      }, 2000);
};

function evaluate(page, func) {
  var args = [].slice.call(arguments, 2);
  var fn = "function() { return (" + func.toString() + ").apply(this, " +     JSON.stringify(args) + ");}";
  return page.evaluate(fn);
};


function getButtonTest(buttonName, query){
  //Click on the specified button
  setTimeout(function() {
    console.log(buttonName + " : " + query);
    var k = page.evaluate(function(){
      console.log("Searching for " + buttonName + " button...");
      var j = document.querySelectorAll(query);
      console.log("Clicking " + buttonName + " button...");
      j[0].click();
      return j;
    });
  }, 2000);
};
