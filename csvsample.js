var fs =  require('fs');
var csv = require('fast-csv');

var stream = fs.createReadStream('csvinput.csv');



var csvStream = csv
	.fromStream(stream, {headers : true})
    //.parse()
    .on("data", function(data){
  		for(i in data){

  			console.log(data[i]);
  		}
         console.log(data);
    })
    .on("end", function(){
         console.log("done");
    });
 
stream.pipe(csvStream);



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

var resultRows = writeData.Results;

/*

var csvWriteStream = csv.createWriteStream({headers: true}),
    ws= fs.createWriteStream("csvoutput.csv");
 
ws.on("finish", function(){
  console.log("DONE!");
});
 
csvStream.pipe(ws);
/*
for(i in resultRows){
	//console.log(resultRows[i]);
	csvStream.write({a: "a0", b: "b0"});
}

csvStream.write({a: "a0", b: "b0"});
csvStream.write({a: "a0", b: "b0"});
csvStream.write({a: "a0", b: "b0"});
csvStream.write({a: "a0", b: "b0"});
csvStream.write({a: "a0", b: "b0"});
csvStream.end();

*/

var csvStream = csv.createWriteStream({headers: true}),
    writableStream = fs.createWriteStream("my.csv");
 
writableStream.on("finish", function(){
  console.log("DONE!");
});
 
csvStream.pipe(writableStream);

for(i in resultRows){
	console.log(resultRows[i]);
	csvStream.write(resultRows[i]);
};
csvStream.end();