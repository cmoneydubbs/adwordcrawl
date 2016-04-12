"use strict";
var fs =  require('fs');
var csv = require('fast-csv');
var cp = require('child_process');

var exportList = [];
var importList = [];

	
	module.exports = {

		csvIn : function(inputFilePath,outputFilePath){
			
			var stream = fs.createReadStream(inputFilePath);

			var csvStream = csv
		    .fromStream(stream, {headers : true})
		    .on("data", function(data){
		    	exportList.push(data);
		    	
		    })
		    .on("end", function(){
		         console.log("done");
			  var arr = exportList;
				 
				var newarr = [];
				var unique = [];
				
           

				for (let item of arr) {
					if(item.Geo != "Geo" && item.Geo != ''){
						item = JSON.stringify(item);
						var itemTest = unique.indexOf(item);
						if(itemTest == -1){
							newarr.push(item);
							unique.push(item);
						}
					}
				
					
				}
				 
				
				var child = cp.fork('./scrapeLogic.js')

				child.send(newarr);

				child.on('message', (m) => {
				  console.log('PARENT got message:', m);

				  //csvOut(outputFilePath,m);
				  

				 if(m == 'end'){
				  	console.log('sending lead list to the csv writer');
				  	csvOut(outputFilePath,importList);
				  }else{
				  	console.log('adding lead to Lead List.');
				  	var sm = JSON.stringify(m);
				  	importList.push(sm);
				  	console.log('import list is'+importList);
				  }

				  	
				});
		       
		    });

			stream.pipe(csvStream);

			function csvOut(filePath, data){

			var csvStream = csv.createWriteStream({headers: true}),
			 writableStream = fs.createWriteStream(filePath);
			 
			writableStream.on("finish", function(){
			  console.log("DONE!");
			});
			 
			csvStream.pipe(writableStream);
			
			for(var i in data){
				var leadOut = JSON.parse(data[i]);
				console.log(leadOut);
				csvStream.write(leadOut);
			};
			csvStream.end();


			}
		}

/*
		csvOut : function(filePath, data){

			var resultRows = data;

			var csvStream = csv.createWriteStream({headers: true}),
			writableStream = fs.createWriteStream(filePath);
			 
			writableStream.on("finish", function(){
			  console.log("DONE!");
			});
			 
			csvStream.pipe(writableStream);

			csvStream.write(data);
			
			for(i in resultRows){
				console.log(resultRows[i]);
				csvStream.write(resultRows[i]);
			};
			csvStream.end();
		


		}*/

	};

	










/*
var writeData = {
	
		Results: [
			{
				Geo: 'Denver',
				Query: 'limos Denver',
				URL: 'www.sunsetlimo.com',
				Phone: '(303) 426-9668',
				paidKeyWords: '74',
				estMonthlyPpcClicks: '693',
				estMonthlyAdwordsBudget: '$962'
			},

			{
				Geo: 'Denver',
				Query: 'limos Denver',
				URL: 'www.allprolimousinedenver.com',
				Phone: '720-366-4561',
				paidKeyWords: '34',
				estMonthlyPpcClicks: '502',
				estMonthlyAdwordsBudget: '$710'
			}
		]	
};

*/