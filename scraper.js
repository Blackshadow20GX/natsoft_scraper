  var page = require('webpage').create();
  var system = require('system');
  var args = system.args;

  if (args.length === 1) {
    console.log('No arguments detected.');
  } else {
    args.forEach(function(arg, i) {
      console.log(i + ': ' + arg);
    });
  }

  page.viewportSize = { width: 1280, height: 800 };
  link = "http://racing.natsoft.com.au/results";
  //link = "test.html";
  page.onConsoleMessage = function (msg) {
    console.log(msg);
  };

  page.open(link, function() {
      console.log("Started evaluation.");
      page.render("aftOpen.png");

      var raceArg = args[1];
      var trackArg = args[2];
      var yearArg = args[3];
      var mode = args[4];
      var boolYear = true;
      var updatingTrack = true;

      //Main program flow
      var filename = getRaceResponse(raceArg);

      updatingTrack = getFilter(trackArg);
      while(updatingTrack){};
      filterTest();
      filterYear(yearArg, boolYear);
      //filterTest();

      getRaceEvent(mode);
      //getSingleRaceResults(filename);
});

function filterTest(){
  setTimeout(function() {

            console.log("Rendering aftFilterTest.png...");
            page.render('aftFilterTest.png');
            console.log("Finished rendering!");
            //phantom.exit();
  }, 3000);
}

function getRaceResponse(raceArg){
  //console.log("1: Circuit Racing 2: Speedway 3: Bikes 4: Kart");
  var response = raceArg;
  var type;
  var filename;

  switch(response) {
    case "circuit":
        type = "\"Circuit Racing\"";
        filename = "circuit";
        break;

    case "speedway":
        type = "\"Speedway\"";
        filename = "speedway";
        break;

    case "bikes":
        type = "\"Bikes\"";
        filename = "bikes";
        break;

    case "kart":
        type = "\"Kart\"";
        filename = "kart";
        //Debug code since not fully implemented
        //TODO Save kart object as pdf somehow
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

function getFilter(response){

  setTimeout(function(){
            var type = "Track List"
            var query = 'select[title][title="Track "]';
            var btn = getButton(type, query);

            //Get first select element
            btn = btn[0];

            var checkResp = -2;
            checkResp = getOptions(btn, response, false);
            while(checkResp < -1){};
            if(checkResp == -1){
              console.log("Error: Response = " + checkResp);
              console.log("String not found in <select>. Exiting...");
              phantom.exit();
            }
            //TODO replace newBtn with 'complete' var, which starts as false, becomes true
            var newBtn = updateFilter(btn, response);
            while (newBtn == null){};
            return false; //finished updating track
  }, 2000);
};

function updateFilter(updBtn, response){
  var test = "string";
  setTimeout(function(){
    console.log("Updating filter...");
    var test = evaluate(page, function(updBtn, response){
        var newBtn = document.getElementById(updBtn.id);
        newBtn.selectedIndex = parseInt(response);

        var event = document.createEvent("HTMLEvents");
        event.initEvent("change", false, true);
        newBtn.dispatchEvent(event);

        console.log("Updated filter!");
        var test = "test";
        return test;
      }, updBtn, response);
    }, 1000);
    return test;
};

function getOptions(optBtn, val, yearVal) {
  var newResp = -1;
  console.log("Substring: " + val.charAt(0));
  if (yearVal){
    if (val.charAt(0) == 'y'){
      console.log("Concat substring " + val);
      val = val.substring(1);
      console.log("New val: " + val);
    }
    else{
      val = val.toString();
    }
  }
  else{
    if (val < optBtn.options.length){
      newResp = val;
      return newResp;
    }
    else{
      return newResp;
    }
  }
  var resp;
   //It's a string
  //Need to check for existence of string val instead
  return resp = evaluate(page, function(optBtn, val){

       optBtn = document.getElementById(optBtn.id);
       var i;
       var newResp = -1;
       //Search options for value specified (string or index)
       for (i = 0; i < optBtn.options.length; i++){
         console.log("Option: " + optBtn.options[i].text);
         if(optBtn.options[i].text == val){
           console.log("String found at " + i + ": " + optBtn.options[i].text);
           newResp = i;
           i = optBtn.options.length;
          }
        };
       return newResp;
     }, optBtn, val);
};

function filterYear(yearIndex, boolYear){

  setTimeout(function() {
    var type = "Year";
    var query = 'select[title][title="Year "]';
    var yearBtn = getButton(type, query);
    yearBtn = yearBtn[0];
    //Fire change event to year to update index (hopefully)
    //var test = updateFilter(yearBtn, 0);

    console.log("Beginning Year update sequence...");
    var checkResp = -2;
    checkResp = getOptions(yearBtn, yearIndex, boolYear);
    while(checkResp < -1){};
    console.log("Year response: " + checkResp);
    if(checkResp == -1){
      console.log("Error: Response = " + checkResp);
      console.log("String not found in <select>. Exiting...");
      phantom.exit();
    }
    var newBtn = updateFilter(yearBtn, checkResp);
    while (newBtn == null){};
    console.log("Year updated!");
  }, 7000);
}

function getRaceEvent(mode){
  setTimeout(function() {
    if (mode == "single"){
            var type = "Even Race";
            var query = 'div[class][class="NListViewLinkEven"]';
            var btn = getButton(type, query);
            console.log("Rendering aftEvenBtn.png...");
            page.render('aftEvenBtn.png');
            console.log("Finished rendering!");
          }
          else if (mode == "all"){
            //get all Evens
            var type = "All";
            var query = 'div[class][class="NListViewLinkEven"]';
            var evenBtns = getButton(type, query);
            query = 'div[class][class="NListViewLinkOdd"]';
            var oddBtns = getButton(type, query);
            processAllEvents(evenBtns);
            processAllEvents(oddBtns);
          }
  }, 16000);
};

function processAllEvents(btns){
  //Click each even/odd
  for (var i = 0; i < btns.length; i++){
    try {
      if ((i % 0) == 0) //It's a button we care about
      {
        console.log(btns[i].id);
        //btns[i].click();
      }
    }
    catch (err){
      console.log(err);
      //continue;
    }
  }
  die();
}

function getSingleRaceResults(filename){
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
                if(filename == "kart"){//different format
                  fs.write(filename + '.pdf', page.content, 'w');
                }
                else{
                  fs.write(filename + '.html', page.content, 'w');
                }
                console.log("Write complete!");
                console.log("Exiting...");
                phantom.exit()
            }
          }, 17000);
};

function getButton(type, query){
  var btn = evaluate(page, function(type, query){
      console.log("Searching for " + type + " button...");
      var btn = document.querySelectorAll(query);
      console.log("Clicking " + type + " button...");
      if(type != "Track List" || type != "Year" || type != "All"){
        try{
          btn[0].click();
          }
        catch(err){
          console.log(err);
          console.log("Clicking btn[0] for type " + type + " failed. Exiting...");
          btn = "die";
        }
      }
      return btn;
    }, type, query);
  if(btn == "die"){
    die();
  }
  return btn;
};

//Allows for proper evaluation of arguments because Javascript sucks
function evaluate(page, func) {
  var args = [].slice.call(arguments, 2);
  var fn = "function() { return (" + func.toString() + ").apply(this, " +     JSON.stringify(args) + ");}";
  return page.evaluate(fn);
};

function die(){
  phantom.exit();
}
