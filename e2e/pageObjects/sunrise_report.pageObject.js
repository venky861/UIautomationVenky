/**
 * Created by : Pushpraj
 * created on : 12/02/2020
 */

"use strict";
var extend = require('extend');
var url = browser.params.url;
var logGenerator = require("../../helpers/logGenerator.js"),
	logger = logGenerator.getApplicationLogger();
var EC = protractor.ExpectedConditions;
var util = require('../../helpers/util.js');
var frames = require('../../testData/frames.json');
var timeout = require('../../testData/timeout.json');
var serviceMgmtUtil = require('../../helpers/serviceMgmtUtil.js');
var sunriseReportTestData = require('../../testData/cards/sunriseReportTestData.json');


var defaultConfig = {
	widgetsNumericValueXpath: "//span[contains(@class, 'embPanel__titleText')][text()='{0}']/ancestor::div[@data-test-subj='embeddablePanel']//div[@class='mtrVis__value']/span",
	ownerGroupHeaderXpath: "//kbn-enhanced-agg-table//th//span[text()='Owner Group']",
	ownerGroupRowTextXpath: "//kbn-enhanced-agg-table//th//span[text()='Owner Group']/ancestor::thead/following-sibling::tbody//div[@class='kbnTableCellFilter__hover']/span[@ng-non-bindable]",
	downloadSunriseReportCss: "div.downloadButton > a.iconLabel",
	downloadReportsTooltipCss: "div.downloadButton span.iconDownload > svg.blueIcon",
	downloadReportsTooltipMessageCss: " div.downloadButton span.iconDownload > div.fullBoxModelWrapper",
	toTimeFromLastUpdatedTimestampCss: "span.lastUpdatedFrom",
	kibanaLoadedCss:"#kibana-body"

};

function sunrisereport(selectorConfig) {
	if (!(this instanceof sunrisereport)) {
		return new sunrisereport(selectorConfig);
	}
	extend(this, defaultConfig);

	if (selectorConfig) {
		extend(this, selectorConfig);
	}
}

/**
 * Method to perform switch to default content then switch to frame 
 */
sunrisereport.prototype.open = function () {
	util.switchToDefault();
	util.switchToFrameById(frames.mcmpIframe);
	util.waitForAngular();
	util.switchToFrameById(frames.cssrIFrame);
};


/**
 * Method to get numeric value from widgets
 */
sunrisereport.prototype.getWidgetsNumericValue = function (widgetName) {
	util.waitForAngular();
	var widgetValueXpath = this.widgetsNumericValueXpath.format(widgetName);
	browser.wait(EC.visibilityOf(element(by.xpath(widgetValueXpath))), timeout.timeoutInMilis);
	return element(by.xpath(widgetValueXpath)).getText().then(async function (widgetValue) {
		logger.info(widgetName + " widget's value : " + widgetValue);
		var numbericValue = await util.stringToInteger(widgetValue);
		logger.info("String to Integer : " + numbericValue);
		if (isNaN(numbericValue)) {
			return widgetValue;
		} else {
			return numbericValue;
		}
	});
};

/**
 * Method to get numeric value or - string from widgets
 */
sunrisereport.prototype.checkWidgetsValueIsNumericOrString = function (widgetName) {
	return this.getWidgetsNumericValue(widgetName).then(function (widgetValue) {
		logger.info("widgetValue ----- " + widgetValue);
		if (!isNaN(widgetValue)) {
			return true;
		} else if (widgetValue.includes("-")) {
			return true;
		} else {
			return false;
		}
	});
};

/**
 * Method to get backlog ticket aging widgets table text for owner group applied filter
 */
sunrisereport.prototype.getOwnerGroupRowTextFromAginTable = function () {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.xpath(this.ownerGroupHeaderXpath))), timeout.timeoutInMilis);
	return element(by.xpath(this.ownerGroupRowTextXpath)).getText().then(function (ownerGroupRowTxt) {
		logger.info("Owner group row text : " + ownerGroupRowTxt);
		return ownerGroupRowTxt;
	});
};

/*
get Widget Value in Floating Number
*/
sunrisereport.prototype.getWidgetsFloatValue = function (widgetName) {
	util.waitForAngular();
	var widgetValueXpath = this.widgetsNumericValueXpath.format(widgetName);
	browser.wait(EC.visibilityOf(element(by.xpath(widgetValueXpath))), timeout.timeoutInMilis);
	return element(by.xpath(widgetValueXpath)).getText().then(async function (widgetValue) {
		logger.info(widgetName + " widget's value : " + widgetValue);
		var numbericValue = Number(await util.getNumberFromString(widgetValue));
		logger.info("String to Float : " + numbericValue);
		if (isNaN(numbericValue)) {
			return undefined;
		} else {
			return util.stringToFloat(numbericValue.toFixed(3));
		}
	});
};

/*
get Widget Value in Integer Number
*/
sunrisereport.prototype.getWidgetsIntegerValue = function (widgetName) {
	util.waitForAngular();
	var widgetValueXpath = this.widgetsNumericValueXpath.format(widgetName);
	browser.wait(EC.visibilityOf(element(by.xpath(widgetValueXpath))), timeout.timeoutInMilis);
	return element(by.xpath(widgetValueXpath)).getText().then(async function (widgetValue) {
		logger.info(widgetName + " widget's value : " + widgetValue);
		var numbericValue = util.stringToInteger(widgetValue);
		logger.info("String to Integer : " + numbericValue);
		return numbericValue;
	});
};

/*
 * This function will open and close the Download Reports Tooltip clicking on 'i' icon
*/
sunrisereport.prototype.clickOnDownloadSunriseReportTooltip =  function() {
	browser.wait(EC.visibilityOf(element(by.css(this.downloadReportsTooltipCss))), timeout.timeoutInMilis);
	element(by.css(this.downloadReportsTooltipCss)).click().then(function() {
		logger.info("Clicked on Download Reports Tooltip icon.");
	});
};

/*
 * This function will get the Download Reports Tooltip message. 
*/
sunrisereport.prototype.getSunriseReportTooltipMessage = function() {
	browser.wait(EC.visibilityOf(element(by.css(this.downloadReportsTooltipMessageCss))), timeout.timeoutInMilis);
	return element(by.css(this.downloadReportsTooltipMessageCss)).getText().then(function(tooltipMessage) {
		logger.info("Tooltip Message:", tooltipMessage);
		return tooltipMessage;
	});
};

/*
 * This function will download the Sunrise Report clicking in Download Reports...
 * The downloaded file will be in aiops_report directory
*/
sunrisereport.prototype.downloadSunriseReportXlsx =  function() {
	util.deleteAllReports();
	browser.wait(EC.visibilityOf(element(by.css(this.downloadSunriseReportCss))), timeout.timeoutInMilis);
	return element(by.css(this.downloadSunriseReportCss)).click().then(function() {
		logger.info("Clicked on Download Reports xlsx Link");
		// Added static wait to download report xlsx
		browser.sleep(5000);
		return true;
	});
};

/**
 * Get To time from Last updated timestamp
 */
sunrisereport.prototype.getToTimeFromTimestamp = function(){
	var self = this;
	util.switchToDefault();
	util.switchToFrame(frames.mcmpIframe);
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.toTimeFromLastUpdatedTimestampCss))), timeout.timeoutInMilis);
	return element(by.css(this.toTimeFromLastUpdatedTimestampCss)).getText().then(function (toTime) {
		var t_Time = toTime.split("To:")[1].trim();
		if (t_Time.includes("IST")) {
			var toTimestamp = new Date(t_Time.split("IST")[0].trim());
		}
		else {
			var toTimestamp = new Date(t_Time);
		}
		logger.info("To time after Local Timezone conversion: " + toTimestamp);
		self.open();
		return util.getDateFromISOFormat(toTimestamp);
	})
};

/*
 * this Method is to validate dashboard page DSR Incident priority count matches with DSR page priority count
*/

sunrisereport.prototype.ValidateIncidentDsrPriorityData =async function(priorityValues,incidentPriorityCount){
	var result = true
	logger.info('Formatted Incident priority count on dashboard is ' + incidentPriorityCount)
	if(priorityValues.length > 0){
		for(var i=0 ; i< priorityValues.length;i++){
			if(i !== 0){
				serviceMgmtUtil.clickOnFilterButtonBasedOnName(sunriseReportTestData.priorityFilterName);
				var priorityValues = await serviceMgmtUtil.getAllValuesFromMultiselectFilter(sunriseReportTestData.priorityFilterName)
			}
			await serviceMgmtUtil.selectFilterValueBasedOnName(sunriseReportTestData.priorityFilterName, priorityValues[i]);
			await serviceMgmtUtil.clickOnUpdateFilterButton(sunriseReportTestData.priorityFilterName);
			await serviceMgmtUtil.clickOnApplyFilterButton();
			await util.waitOnlyForInvisibilityOfKibanaDataLoader();
			var created = await this.getWidgetsNumericValue(sunriseReportTestData.ticketsCreatedInLast24HrsWidgetName)
			var resolved = await this.getWidgetsNumericValue(sunriseReportTestData.ticketsResolvedInLast24HrsWidgetName)
			logger.info(priorityValues[i] + ' created count for last 24hrs is ' + created)
			logger.info(priorityValues[i] + ' resolved count for last 24hrs is ' + resolved)
			if(incidentPriorityCount.created[priorityValues[i]] !== created.toString() && incidentPriorityCount.resolved[priorityValues[i]] !== resolved.toString()){
				result = false
				break;
			}
			await util.clickOnResetFilterLink();
			await util.waitOnlyForInvisibilityOfKibanaDataLoader();
		}
	}
	return result
}

/*
 * this Method is to validate dashboard page DSR problem priority count matches with DSR page priority count
*/

sunrisereport.prototype.ValidateProblemDsrPriorityData =async function(priorityValues,problemPriorityCount){
	var result = true
	logger.info('Formatted Problem priority count on dashboard is ' + problemPriorityCount)
	if(priorityValues.length > 0){
		for(var i=1 ; i< priorityValues.length;i++){
			if(i !== 1){
				serviceMgmtUtil.clickOnFilterButtonBasedOnName(sunriseReportTestData.priorityFilterName);
				var priorityValues = await serviceMgmtUtil.getAllValuesFromMultiselectFilter(sunriseReportTestData.priorityFilterName)
			}
			await serviceMgmtUtil.selectFilterValueBasedOnName(sunriseReportTestData.priorityFilterName, priorityValues[i]);
			await serviceMgmtUtil.clickOnUpdateFilterButton(sunriseReportTestData.priorityFilterName);
			await serviceMgmtUtil.clickOnApplyFilterButton();
			await util.waitOnlyForInvisibilityOfKibanaDataLoader();
			var created = await this.getWidgetsNumericValue("Tickets Created in Last 24 Hrs")
			var closed = await this.getWidgetsNumericValue("Tickets Closed in Last 24 Hrs")
			var rcaCompleted = await this.getWidgetsNumericValue("RCA Completed in Last 24 Hrs")
			logger.info(priorityValues[i] + ' tickets created count for last 24hrs is ' + created)
			logger.info(priorityValues[i] + ' tickets closed count for last 24hrs is ' + closed)
			logger.info(priorityValues[i] + ' RCA completed count for last 24hrs is ' + rcaCompleted)
			if(problemPriorityCount.created[priorityValues[i]] !== created.toString() && problemPriorityCount.closed[priorityValues[i]] !== closed.toString() &&
			problemPriorityCount.rcaComplete[priorityValues[i]] !== rcaCompleted.toString()){
				result = false;
				break;
			}
			await util.clickOnResetFilterLink();
			await util.waitOnlyForInvisibilityOfKibanaDataLoader();
		}
	}
	return result
}

/*
 * this Method is to validate dashboard page DSR Service request count matches with DSR page service request count
*/

sunrisereport.prototype.ValidateServiceRequestDsrPriorityData =async function(priorityValues,serviceRequestCount){
	var result = true
	logger.info('Formatted Service request count is ' + serviceRequestCount)
	if(priorityValues.length > 0){
		for(var i=1 ; i< priorityValues.length;i++){
			if(i !== 1){
				serviceMgmtUtil.clickOnFilterButtonBasedOnName(sunriseReportTestData.priorityFilterName);
				var priorityValues = await serviceMgmtUtil.getAllValuesFromMultiselectFilter(sunriseReportTestData.priorityFilterName)
			}
			await serviceMgmtUtil.selectFilterValueBasedOnName(sunriseReportTestData.priorityFilterName, priorityValues[i]);
			await serviceMgmtUtil.clickOnUpdateFilterButton(sunriseReportTestData.priorityFilterName);
			await serviceMgmtUtil.clickOnApplyFilterButton();
			await util.waitOnlyForInvisibilityOfKibanaDataLoader();
			var initiated = await this.getWidgetsNumericValue("Total Service Requests Opened in Last 24 hrs")
			var fullfilled = await this.getWidgetsNumericValue("Total Service Requests Fulfilled in Last 24 hrs")
			logger.info(priorityValues[i] + ' tickets initiated: count for last 24hrs is ' + initiated)
			logger.info(priorityValues[i] + ' tickets fullfilled count for last 24hrs is ' + fullfilled)
			if(serviceRequestCount.initiated[priorityValues[i]] !== initiated.toString() && serviceRequestCount.fullfilled[priorityValues[i]] !== fullfilled.toString()){
				result = false;
				break;
			}
			await util.clickOnResetFilterLink();
			await util.waitOnlyForInvisibilityOfKibanaDataLoader();
		}
	}
	return result
}


/*
 * this Method is to validate dashboard page DSR change request count matches with DSR page change request count
*/

sunrisereport.prototype.ValidateChangeRequestDsrPriorityData =async function(changeRequestCount){
	var result = true
	logger.info('Formatted Service request count is ',changeRequestCount)
	await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	var expeditedCreated = await this.getWidgetsNumericValue("Total Expedited Changes Created in 24 Hrs")
	var expeditedImplemented = await this.getWidgetsNumericValue("Total Expedited Changes Implemented in 24 Hrs")
	var emergencyCreated = await this.getWidgetsNumericValue("Total Emergency Changes Created in 24 Hrs")
	var emergencyImplemented = await this.getWidgetsNumericValue("Total Emergency Changes Implemented in 24 Hrs")
	logger.info("Total Expedited Changes Created in 24hrs " + expeditedCreated)
	logger.info("Total Expedited Changes Implemented in 24hrs " + expeditedImplemented)
	logger.info("Total Emergency Changes Created in 24hrs " + emergencyCreated)
	logger.info("Total Emergency Changes Implemented in 24hrs " + emergencyImplemented)
	if(expeditedCreated !== parseInt(changeRequestCount.expedited.created) || expeditedImplemented !== parseInt(changeRequestCount.expedited.implemented)||
		emergencyCreated !== parseInt(changeRequestCount.emergency.created) || emergencyImplemented !== parseInt(changeRequestCount.emergency.implemented)){
		result = false
	}
	return result
}


module.exports = sunrisereport;