const io = require('./csvIo.js');



  exports.startScrape = function(input,output){ 
    console.log('button clicked');
    if(input == ''){
      alert('Please drag and drop a file into the input box.');
    }else{
      alert(input+' is the input file');
	    if(output == ''){
	      alert('Please drag and drop a file into the output box.');
	    }else{
	      alert(output+' is the output file');
	      io.csvIn(input,output);

	    };
    }; 
  };


  exports.stopScrape = function(){
  	browser.closeBrowser();
  };