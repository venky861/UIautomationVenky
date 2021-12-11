var fs = require('fs');
var xlsx = require('xlsx');
var xml2js = require('xml2js');
var Excel = require('exceljs')

async function generateFailureReport(){
	var parser = new xml2js.Parser();
	return fs.readFile('./reports/htmlReports/junitresults.xml',async function(err, data) {
		parser.parseString(data, function (err, result) {
			var invalidSpecNames = ["Dashboard Test Suite: ","launchpad functionality","Health - functionality: ","Delivery Insights - functionality ","Inventory - functionality ","Actionable insight - functionality ","IT OPs timestamps ",
			'Incident management - functionality', 'Change management - functionality ','Pervasive Insights - functionality ','Problem management  - functionality ']
			var validSpecNames = ["Dashboard" ,"Launchpad" , "Health", "Delivery Insights", "Inventory","Actionable Insights","IT OPs timestamps","Incident","Change","Pervasive Insights","Problem"]
			var specArray = [];
			var testCaseLength = [];
			var allPassedTestcaseSpecsTimeout = [];
			var allPassedTestcaseSpecsNonTimeout = [];
			var testCaseFailedSpecs = []
			var specLength,specName,suiteName,testCaseName;
			specLength = result.testsuites.testsuite.length
			for(var i=0; i<specLength;i++){
				specName = result.testsuites.testsuite[i].$.name
				specArray.push(specName)
			}
			for(var i=0; i<specLength;i++){
				var testCaseCount = result.testsuites.testsuite[i].testcase.length
				testCaseLength.push(testCaseCount)
			}
			var finalArray = []
			var obj = {}
			var relevatTestCaseCount = []
			for(var i=0; i<specLength;i++){
				for(var j=0 ; j < testCaseLength[i];j++){
					if(!result.testsuites.testsuite[i].testcase[j].skipped){
						suiteName = result.testsuites.testsuite[i].testcase[j].$.classname;
						validSuitIndex = invalidSpecNames.indexOf(suiteName)
						obj[validSpecNames[validSuitIndex]] = obj[validSpecNames[validSuitIndex]] ? obj[validSpecNames[validSuitIndex]] + 1 : 1
						relevatTestCaseCount.push(validSpecNames[validSuitIndex])
					}
					if(result.testsuites.testsuite[i].testcase[j].failure){
						suiteName = result.testsuites.testsuite[i].testcase[j].$.classname;
						testCaseName = result.testsuites.testsuite[i].testcase[j].$.name
						var message = result.testsuites.testsuite[i].testcase[j].failure[0].$.message
						validSuitIndex = invalidSpecNames.indexOf(suiteName)
						testCaseFailedSpecs.push(validSpecNames[validSuitIndex])
						finalArray.push({msg:message,suitName:validSpecNames[validSuitIndex],testCaseName:testCaseName})	
					}
				}				
			}
			var summarizePageSpecs = []
            for(var i=0; i<specLength;i++){
                for(var j=0 ; j < testCaseLength[i];j++){
                    if(result.testsuites.testsuite[i].testcase[j]){
                        suiteName = result.testsuites.testsuite[i].testcase[j].$.classname;
                        testCaseName = result.testsuites.testsuite[i].testcase[j].$.name
                        validSuitIndex = invalidSpecNames.indexOf(suiteName)
                        summarizePageSpecs.push({suitName:validSpecNames[validSuitIndex],testCaseName:testCaseName})
                    }
                }
            }

            var summarizePageTotalSpecs = {};
            summarizePageSpecs.forEach((d)=>{
                summarizePageTotalSpecs[d.suitName] = summarizePageTotalSpecs[d.suitName] ? summarizePageTotalSpecs[d.suitName] + 1 : 1
            })
            
            let summarizePageFailedSpecs = {};
            finalArray.forEach((d)=>{
                summarizePageFailedSpecs[d.suitName] = summarizePageFailedSpecs[d.suitName] ? summarizePageFailedSpecs[d.suitName] + 1 : 1
            })
			var timeOutTestCase = [];
			var nonTimedOutTestCase = [];
			var currentlyValidSpec = [];			
			invalidSpecNames.forEach((specName,i)=>{
				var index = specArray.indexOf(specName)
				if( index >=0){
					currentlyValidSpec.push(validSpecNames[i])
				}
			})

			finalArray.forEach((element)=> {
				var timeOutRegex1 = /TimeoutError/ig
				var timeOutRegex2 = /Wait timed out/ig
				if(timeOutRegex1.test(element.msg) || timeOutRegex2.test(element.msg)){
					timeOutTestCase.push(element)
				}else{
					var result1 = element.msg.replace('(Session info: headless chrome=89.0.4389.82)','').
					replace('(Driver info: chromedriver=89.0.4389.23 (61b08ee2c50024bab004e48d2b1b083cdbdac579-refs/branch-heads/4389@{#294}),platform=Linux 4.4.0-179-generic x86_64)','').
					replace('(Driver info: chromedriver=89.0.4389.23 (61b08ee2c50024bab004e48d2b1b083cdbdac579-refs/branch-heads/4389@{#294}),platform=Linux4.4.0-179-generic x86_64)','')
					element.msg = result1.trim()
					nonTimedOutTestCase.push(element)
				}
			})

			var workbook = new Excel.Workbook()
			var worksheet1 = workbook.addWorksheet('Timeout')
			var worksheet2 = workbook.addWorksheet('Non timeout')
			var worksheet3 = workbook.addWorksheet('Summary')

			var workSheet= [worksheet1,worksheet2,worksheet3]
				worksheet1.columns = [
					{header:'Areas' , key:'nameOfTheSpec',width: 20 },
					{header:'Test cases' , key:'testCase',width: 120 },
					{header:'Result after running locally' , key:'resultAfterRunningLocally',width: 18 },
					{header:'Assignee' , key:'assignee',width: 20 },
					{header:'Action' , key:'action',width: 40 },
					{header:'Defect(if applicable)' , key:'defectIfApplicable',width: 20 }
				]
				worksheet2.columns = [
					{header:'Areas' , key:'nameOfTheSpec',width: 20 },
					{header:'Test cases' , key:'testCase',width: 70 },
					{header:'Result after running locally' , key:'resultAfterRunningLocally',width: 18 },
					{header:'Assignee' , key:'assignee',width: 20 },
					{header:'Code fix require(Y or N)',key:'codeFix',width:20},
					{header:'Action' , key:'action',width: 35 },
					{header:'Defect(if applicable)' , key:'defectIfApplicable',width: 15 },
					{header:'Message' , key:'message',width: 50 }
				]
				worksheet3.columns = [
                    {header:'Spec' , key:'nameOfTheSpec',width: 25 },
                    {header:'Total' , key:'totalSpec',width: 20 },
                    {header:'Pass' , key:'totalPass',width: 20 },
                    {header:'Fail' , key:'totalFailure',width: 20 },
                ]
		
			for(var i=0 ; i <3 ; i++){
				workSheet[i].autoFilter = {
					from: 'A1',
					to: 'G1',
				}  
			}
			// Process each row for beautification 
			for (var i=0 ; i <3 ; i++){
				workSheet[i].eachRow(function (row, rowNumber) {
					row.eachCell((cell, colNumber) => {
						if (rowNumber == 1) {
							cell.fill = {
								type: 'pattern',
								pattern: 'solid',
								fgColor: { argb: 'f5b914' }
							}
						}
						cell.border = {
							top: { style: 'thin' },
							left: { style: 'thin' },
							bottom: { style: 'thin' },
							right: { style: 'thin' }
						}
						cell.font ={
							bold:true
						}
					})
					row.commit();
				})
			}			
				timeOutTestCase.forEach((data)=>{
					worksheet1.addRow({nameOfTheSpec: data.suitName, testCase: data.testCaseName})
				})
				nonTimedOutTestCase.forEach((data)=>{
					worksheet2.addRow({nameOfTheSpec: data.suitName, testCase: data.testCaseName, message:data.msg})
				})

				var pass = 0;
                Object.keys(summarizePageTotalSpecs).forEach((data)=>{
					pass = parseInt(obj[data]) - parseInt((summarizePageFailedSpecs[data] ? summarizePageFailedSpecs[data] : 0))
                    worksheet3.addRow({nameOfTheSpec:data,totalSpec:obj[data],totalFailure:summarizePageFailedSpecs[data] ? summarizePageFailedSpecs[data] : 0,totalPass: pass})
                })
			
			var fileName = getMonthAndYear()
			var timeoutFailedSuites = timeOutTestCase.map((d)=>d.suitName)
			var nonTimeOutFailedSuites = nonTimedOutTestCase.map((d)=>d.suitName)
			var specFailedSpecific = [timeoutFailedSuites,nonTimeOutFailedSuites]
			var specPassedSpecific = [allPassedTestcaseSpecsTimeout,allPassedTestcaseSpecsNonTimeout]
			for(var j=0 ; j<specFailedSpecific.length; j++){
				for(var i=0 ;i< currentlyValidSpec.length;i++ ){
					if(Array.from(new Set(specFailedSpecific[j])).indexOf(currentlyValidSpec[i]) < 0){
						specPassedSpecific[j].push(currentlyValidSpec[i])
					}
				}
			}
			workSheet= [worksheet1,worksheet2]
			for(var i=0;i<workSheet.length;i++){
				specPassedSpecific[i].forEach((data)=>{
					workSheet[i].addRow({nameOfTheSpec:data,testCase:"No Failed test cases"}).eachCell((cell)=>{
						cell.fill = {
							type: 'pattern',
							pattern:'solid',
							fgColor:{argb:'FF00FF00'}
						  };
					})
				 })
			}
			workbook.xlsx.writeFile(`./reports/htmlReports/${fileName}`)
		})
	})
}

function getMonthAndYear(){
	var num = 1
    var monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
	var d = new Date();
	var year = d.getFullYear();
	var date = d.getDate();
	if(date.toString().split('').length === num){
		date =`0${date}`
	   }
    var month = (monthNames.indexOf(monthNames[d.getMonth()]) + 1).toString();
    if(month.length <= 1){
		return `Failure Analysis-${date}0${month}${year}.xlsx`
    }
    return `Failure Analysis-${date}${month}${year}.xlsx`;
}

module.exports = generateFailureReport
	

