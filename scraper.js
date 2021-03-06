  var page = require('webpage').create();
  var system = require('system');
  var args = system.args;
  var timeOutCounter = 2000;
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

      //If looking for live frames
      if(mode == "live")
      {
        //Everything for live handling
        setTimeout(function() {
                  var liveBtns = getLiveBtns("Live");
                  console.log("Rendering aftLiveBtn.png...");
                  page.render('aftLiveBtn.png');
                  console.log("Finished rendering!");
        }, timeOutCounter);
        timeOutCounter += 1000;

        setTimeout(function() {
          var okBtn = getOKBtn("OK");
          console.log("Rendering aftOKBtn.png...");
          page.render('aftOKBtn.png');
          console.log("Finished rendering!");
        }, timeOutCounter)
        timeOutCounter += 1000
        setTimeout(function() {
          //Get frame, open new window and save?
            var frame = getLiveFrame();
        }, timeOutCounter)
        //We got our link, let's die
      }
      else{
        timeOutCounter += 7000;
        updatingTrack = getFilter(trackArg);
        while(updatingTrack){};
        filterTest();
        timeOutCounter += 4000;
        filterYear(yearArg, boolYear);

        getRaceEvent(mode);
        getSingleRaceResults(filename);
      };
});

function filterTest(){
  setTimeout(function() {

            console.log("Rendering aftFilterTest.png...");
            page.render('aftFilterTest.png');
            console.log("Finished rendering!");
  }, timeOutCounter);
  timeOutCounter += 1000;
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
        die();
        break;

    default: //Input not recognized, exit.
        console.log("Invalid input, exiting...");
        die();
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
  }, timeOutCounter);
  timeOutCounter += 1000;
};

function getLiveBtns(type){
  console.log("Type set to " + type);
  var liveDivs;
  var test = evaluate(page, function(liveDivs){
    //Get all divs, search for innerHTML
    var divs = document.querySelectorAll("div:not(.NListViewTitle)");
    for(var i = 0; i < divs.length; i++){
      if(divs[i].innerText == "Live"){
        //It's a live link
        console.log("Live link found at div " + i + "!");
        liveDivs += divs[i];
        console.log("Clicking Live Button...");
        divs[i].click();
        console.log("Clicked it!");
        i = divs.length;
      }
    }
  return;
});
};

function getOKBtn(type){
  var liveDivs;
  var test = evaluate(page, function(liveDivs){
  console.log("Searching for 'OK' button...");
  //Get OK button
  var input = document.querySelectorAll("input");
  for(var i = 0; i < input.length; i++){
    if(input[i].value == "OK"){
      //Click OK button, we at the live stuff now
      console.log("OK button found at input " + i + "!");
      console.log("Clicking OK Button...");
      input[i].click();
      console.log("Clicked it!");
      i = input.length;
    }
    else{
      console.log("Not found at " + i + "...");
      }
    }
    //After this, all live divs found.
    return liveDivs;
  }, liveDivs);
  return;
};

function getLiveFrame(){
    //Eval document, get frame src, open new window
    var link = evaluate(page, function(){
      var frames = document.querySelectorAll("iframe[name]:not(UploadIFrame)");
      for(var i = 0; i < frames.length; i++){
        if(frames[i].id != ""){
          console.log("Frame found at: " + i);
          break;
        }
      }
      var link = frames[i].src;
      console.log("Link found: " + link);
      return link
      });

    var WebPage = require('webpage');
    page = WebPage.create();
    page.open(link);
    console.log("Opening " + link + "...");
    page.onLoadFinished = function(){
        console.log("Writing to iframelink.txt...");
        var fs = require('fs');
        try {
          fs.write("iframelink.txt", "Link: " + link, 'w');
          console.log("Write successful!");
        } catch(e) {
          console.log(e);
        }
        die();
    };
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
              die();
            }
            //TODO replace newBtn with 'complete' var, which starts as false, becomes true
            var newBtn = updateFilter(btn, response);
            while (newBtn == null){};
            return false; //finished updating track
  }, timeOutCounter);
  timeOutCounter += 1000;
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

    console.log("Beginning Year update sequence...");
    var checkResp = -2;
    checkResp = getOptions(yearBtn, yearIndex, boolYear);
    while(checkResp < -1){};
    console.log("Year response: " + checkResp);
    if(checkResp == -1){
      console.log("Error: Response = " + checkResp);
      console.log("String not found in <select>. Exiting...");
      die();
    }
    var newBtn = updateFilter(yearBtn, checkResp);
    while (newBtn == null){};
    console.log("Year updated!");
  }, timeOutCounter);
  timeOutCounter += 1000;
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
            die();
          }
  }, timeOutCounter);
  timeOutCounter += 1000;
};

function processAllEvents(btns){
  //Click each even/odd
  console.log("Btn length:" + btns.length)
  for (var i = 0; i < btns.length; i++){
    try {
      if ((i % 0) == 0) //It's a button we care about
      {
        console.log(btns[i].id);
      }
    }
    catch (err){
      console.log(err);
      continue;
    }
  }
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
                die();
            }
          }, timeOutCounter);
          timeOutCounter += 1000;
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
  console.log("Die() called.");
  console.log("Exiting...");
  phantom.exit();
}
