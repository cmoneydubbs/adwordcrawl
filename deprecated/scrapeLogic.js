const webdriver = require('selenium-webdriver');
const until = require('selenium-webdriver').until;
const By = require('selenium-webdriver').By;
const sendKeys= require('selenium-webdriver').sendKeys;
const  csvIo = require('./csvio.js');
var Promise = require('promise');
const escapeStringRegexp = require('escape-string-regexp');


var writeData = {};
var urlList = [];
//var geoLoad = "";
var queryLoad;
var leads = {};
var lead = {};
var leadCount = 0;




process.on('message', (m) => {

	var start = function(m){
		var arrLength = m.length;
		
	console.log('opening browser');

	var browser = new webdriver.Builder()
	  .forBrowser('chrome')
  		.build();
  		browser.get('http://www.google.com').then(function(){
  			queryIter(m);
  		});

	var count = 1;

	function queryIter(m){
		console.log('Query iter started');
		if(m.length > 0){
			//console.log('the m array is '+m);
			console.log(m[0]);
			var i = JSON.parse(m[0]);
		
			//console.log(m);
			console.log('count is '+ count);
			count += 1;
		 	
			var geoLoad = i.Geo;
			var queryLoad = i.Query;
		
			var pageWait1 = browser.wait(until.elementLocated({name:'q'})).then(function(element){
				console.log('found search field');
			});

			
			var search = browser.findElement(webdriver.By.name('q')).then(function(element){
				console.log('Attempting to click the Search field');
				element.click();
				console.log('clicked search field');
				console.log('Attempting to send Query to search');
				element.sendKeys(queryLoad);
				console.log('Sent Query to search');

			});
			


			var searchButton = browser.findElement(webdriver.By.name('btnG'))
			searchButton.click();
			//var current = '';
			//var queryCount = 0;
			var pageWait2 = browser.wait(until.elementLocated({xpath:'//*[@id="fsl"]/a[4]'}));

			browser.getCurrentUrl().then(function(url){
				current = url;

				var check = browser.isElementPresent({xpath:'//*[@id="tads"]/ol/li[1]/div[position()<3]/cite'}).then(function(res){
					console.log("the bool is "+res);
					if(res === true){
					var adUrls = browser.findElements(webdriver.By.xpath('//*[@id="tads"]/ol/li[1]/div[position()<3]/cite'))
					.then(function(elements){
						for(i in elements){
							elements[i].getText().then(function(element){
								console.log(element);
								var findBold = element.indexOf('<b>');
									if(findBold > -1){
										element = element.replace('<b>','');
										element = element.replace('</b>','');
										console.log(element);
										urlList.push(element);
										console.log(urlList);

									}else{
										urlList.push(element);
										console.log(urlList);
									}
							
							});
						}	
					});
					

					}else{
						console.log('no ads found');
					}
				});

				var check2 = browser.isElementPresent({xpath:'//*[@id="mbEnd"]/ol/li[position()<10]/div[1]/cite'}).then(function(res){
					console.log("the bool is "+res);
					if(res === true){
					var adUrls = browser.findElements(webdriver.By.xpath('//*[@id="mbEnd"]/ol/li[position()<10]/div[1]/cite'))
					.then(function(elements){
						for(i in elements){
							elements[i].getText().then(function(element){
								console.log(element);
								var findBold = element.indexOf('<b>');
									if(findBold > -1){
										element = element.replace('<b>','');
										element = element.replace('</b>','');
										console.log(element);
										urlList.push(element);
										console.log(urlList);

									}else{
										urlList.push(element);
										console.log(urlList);
									}
							
							});
						}	
					});
					
					}else{
						console.log('no ads found');
						
					}
			});
			
            
			
		});


			browser.get('http://www.google.com').then(function(){
				m.splice(0,1);
				if(m.length == 0){
					console.log("the final list is "+urlList)
					

					for(i in urlList){

						var adUrl = urlList[i];
						browser.get('http://'+adUrl);
						browser.getPageSource().then(function(source){

							browser.getCurrentUrl().then(function(currentUrl){
								var re = /(?:\d{1}\s)?\(?(\d{3})\)?-?\s?(\d{3})-?\s?(\d{4})/;
								var result = re.exec(source);

								if(result != null){
									console.log('the phone number search for '+currentUrl+' is '+result[0]);
								lead.site = currentUrl;
								lead.phone = result[0];
								browser.get('http://www.spyfu.com/ppc/overview/url?query='+currentUrl).then(function(){
									var sfWait = browser.wait(until.elementLocated({xpath:'//*[@id="ppc_overview_chart_region"]/div/div/div'}));
									browser.findElement(webdriver.By.xpath('//*[@id="ppc_overview_chart_region"]/div/div/div/div[1]/div/div[2]/span')).getText().then(function(element){
										console.log('Paid Keyword count is '+element);
										element = String(element);
										lead.paidKeywordCount = element;
										
									});
									browser.findElement(webdriver.By.xpath('//*[@id="ppc_overview_chart_region"]/div/div/div/div[2]/div/div[2]/span')).getText().then(function(element){
										console.log('Estimated Monthly Clicks is '+element);
										lead.estimatedMonthlyClicks = element;
									});
									browser.findElement(webdriver.By.xpath('//*[@id="ppc_overview_chart_region"]/div/div/div/div[3]/div/div[2]/span')).getText().then(function(element){
										console.log('Estimated Monthly Budget is '+element);
										lead.estimatedMonthlyBudget = element;
									});

									var sfWait2 = browser.wait(until.elementLocated({xpath:'//*[@id="ppc_overview_chart_region"]/div/div/div/div[1]/div/div[2]/span'}));

									browser.findElement(webdriver.By.xpath('//*[@id="ppc_overview_chart_region"]/div/div/div/div[1]/div/div[2]/span')).getText().then(function(element){
										console.log('The lead is '+ 
										lead['site'],
										lead['phone'],
										lead['paidKeywordCount'],
										lead['estimatedMonthlyClicks'],
										lead['estimatedMonthlyBudget']
										);

										var sfWait2 = browser.wait(until.elementLocated({xpath:'//*[@id="overview_printable"]/div[2]'})).then(function(){
											
											if(i == urlList.length -1){
												process.send(lead);
												process.send('end');
											}else{
												process.send(lead);
											}
											
											
											
										});

										
									});

									

								});
								}
								
							});

							

						});
						/*var sendEnd = browser.get('http://www.google.com').then(function(){
							process.send('end');
						});*/

					}



					//browser.quit();


				}else{
					console.log("List not finished being made")
					queryIter(m);
				}


			});
			
			
		}

	}

	}(m);



});

