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
var healthAndInventoryUtil = require('../../helpers/healthAndInventoryUtil.js');
var timeout = require('../../testData/timeout.json');
var appUrls = require('../../testData/appUrls.json'),
	dashboardTestData = require('../../testData/cards/dashboardTestData.json');
var path = require('path');
const { isObject } = require('util');


var defaultConfig = {
	pageUrl: url,
	dashboardHeaderTileTextCss: "#fullwrapperDiv h1.titleMainTop",
	dsrTileTitleTextCss: "div.sunriseMain h2",
	dsrFromTimestampCss: "div.sunRiseLastUpdated",
	alertHeader:"label.pagetitle",
	dsrToTimestampCss: "div.sunRiseLastUpdated span:nth-child(2)",
	lastUpdatedTimestampXpath: "//span[contains(text(),'Last updated')]",
	lastUpdatedTimestampHealthInventoryCss: "label.currenttimestamp",
	alertsCardTitleXpath: "//span[text()[contains(.,'Alerts')]]",
	alertsRowsCss: "div.rowAlertcard",
	criticalAlertsRowsCss: "div.rowAlertcard #critical-0",
	warningAlertsRowsCss: "div.rowAlertcard #Warning-0",
	alertDateCss:"div.rowAlertcard p:nth-child(4)",
	allAvailableParameterOverview:"label.overViewtitle",
	criticalCountXpath: "//div[@class='rowAlertcard']//*[contains(text(),'critical')]",
	warningCountXpath: "//div[@class='rowAlertcard']//*[contains(text(),'Warning')]",
	healthyCountCss: "p.txtHealthy",
	alertRowsNameCss: "div.rowAlertcard p.txtBlueBold",
	criticalAlertsRowsNameXpath: "//*[contains(@id,'critical-')]//ancestor::div[@class='rowAlertcard']//p[contains(@class,'txtBlueBold')]",
	criticalAlertRowCICountXpath: "//*[contains(@id,'critical-')]//ancestor::div[@class='rowAlertcard']//p[contains(@class,'txtmiddle')]",
	warningAlertsRowsNameXpath: "//*[contains(@id,'Warning-')]//ancestor::div[@class='rowAlertcard']//p[contains(@class,'txtBlueBold')]",
	warningAlertRowCICountXpath: "//*[contains(@id,'Warning-')]//ancestor::div[@class='rowAlertcard']//p[contains(@class,'txtmiddle')]",
	allAvailableCardsNameCss: "#fullwrapperDiv  [class*='cardsubTitle'], #fullwrapperDiv h2",
	noDataAvailableXpath: "/ancestor::div[@class='cardPadding']//img[contains(@src, 'dataNotAvailable.svg')]/following-sibling::div/p",
	connectionFailureXpath: "/ancestor::div[@class='cardPadding']//img[contains(@src, 'connectionFailure.svg')]/following-sibling::div/p",
	largeViewCss: "#largeView",
	smallViewCss: "#smallView",
	selectedCategoryAttribute: "selectedcategoryIcon",
	classAttribute: "class",
	viewDetailsLinkXpath: "//span[@title='{0}']/ancestor::div[@class='cardPadding']//a[contains(@class, 'hand-cursor')]",
	toolTipTextCss: "div.nvtooltip strong",
	miniViewCardsTextXpath: "//span[@title='{0}']/ancestor::div[@class='cardPadding']//a[contains(@class, 'progressTxt')][contains(text(),'{1}')]/../preceding-sibling::p//a",
	dailySunRiseReportDataXpath: "//div[contains(@class, 'pticketslabel')][contains(text(), '{0}')]/following-sibling::div//*[@class='ticketPlabel'][contains(text(), '{1}')]/preceding-sibling::a",
	GraphWrapperCss: "div.{0} .bar",
	top5ServersPervasiveInsightsTxtCss: "#pervassiveInsights text.nv-legend-text",
	pervasiveInsightsGraphBarTxtCss: "#pervassiveInsights g > rect.nv-bar",
	cardTitleCss: "span[title='{0}']",
	cardTitleDataCenterCss: "span[title='{0}'] ~ .lastUpdatedDate",
	actionableInsightsRowXpath: "//span[contains(text(),'Actionable Insights')]/ancestor::div[@class='cardPadding']//p",
	cardDefinitionTxtXpath: "//span[contains(text(),'{0}')]/ancestor::div[@class='cardPadding']//p",
	barGraphKeyValueXpath:"//span[contains(text(),'{0}')]/ancestor::div[@class='clientCardTitleDiv cardupTitle']/following-sibling::div//*[name()='g' and contains(@class,'nv-series')]//*[name()='text']",
	barGraphXaxisTitleXpath:"//span[contains(text(),'{0}')]/ancestor::div[@class='clientCardTitleDiv cardupTitle']/following-sibling::div//*[name()='g' and contains(@class,'nv-x nv-axis nvd3-svg')]//*[name()='text' and @class]",
	barGraphXaxisLabelsCss:"div.{0} .bottom text",
	barGraphYaxisTitleXpath:"//span[contains(text(),'{0}')]/ancestor::div[@class='clientCardTitleDiv cardupTitle']/following-sibling::div//*[name()='g' and contains(@class,'nv-y nv-axis nvd3-svg')]//*[name()='text'  and @class]",
	barGraphYaxisLabelsCss:"div.{0} .left text",
	inventoryItemTextCss:"text.nv-pie-title",
	inventoryCardLegendsCss:"div.invMain .legend-item text",
	accountNameTextXpath:"//h1[@class='titleMainTop']",
	customiseButtonXpath:"#customize",
	cancelButtonTextXpath: "//button[contains(text(),'Cancel')]",
	saveButtonTextXpath:"//button[contains(text(),'Save')]",
	visibilityIconButtonXpath: "//*[contains(@class,'clientcardTitle')]/span[1][contains(@title,'{0}')]//ancestor::*[@class='cardPadding']//preceding-sibling::div[@class='CustomTopIconPart']//*[name()='svg']",
	customisationSuccessMessageXpath: "//p[contains(text(),'Your customization saved successfully.')]",
	cardDisabledMessageXpath: "//div[@class='sunriseReportWrapper']//div[@title='Customization mode - You will not be able to interact with the cards']",
    clickChangeMgmtCreatedLnkXpath: "//div[@id='cardNo_16']//a[contains(text(),'Created')]",
	clickDashboardLinkCss: "div.dashboardLink",
	clickIncidentMgmtCreatedLnkXpath: "//div[@id='cardNo_15']//a[contains(text(),'Created')]",
	clickParvasiveLnkXpath: "(//div[@id='cardNo_17']//a)[1]",
	clickProblemCreatedLnkXpath: "//div[@id='cardNo_7']//a[contains(text(),'Created')]",
	sunriseReportCreatedXpath:"//div[contains(text(),'P1')]/following-sibling::div/div[1]//a",
	dashboardTitleTextXpath:"//h1[@class='titleMainTop']",
	deliveryInsightsRowCss: ".ActionableInsightsScrollbar a p",
	deliveryInsightsLinkXpath: "//span[@title='{0}']/ancestor::div[@class='cardPadding']//p[contains(text(),'{1}')]",
	deliveryInsightDashboardXpath: "//*[contains(text(), '{0}')]",
	dashboarAllCardHeaderCss:"span.clientcardTitle span[title]",
	selfServiceXpath:"//p[contains(text(),'{0}')]",
	auditLogCss:".bx--data-table-header__title",
	tableDataByIndex:"div table.bx--data-table tbody tr td:nth-child({0})",
	downloadXpath:"//*[@id='icon']",
	downloadTemplateCss:"label#label-radio-0 span",
	downloadTemplateXpath:"//button[contains(text(),'{0}')]",
	uploadFileCss:"button.bx--btn--primary",
	chooseFileCss:"button#dropdown-0",
	chooseRequestCss:"li div.bx--list-box__menu-item__option",
	addFileCss:"input[type=file]",
	resolverGroupTabXpath: "//button[@class='bx--tabs--scrollable__nav-link' and contains(text(), '{0}')]",
	applyResolverGroupSelectionButtonXpath : "//button[@class='resolver--group-apply bx--btn bx--btn--primary']",
	ticketsInScopeCheckboxCss : "label.bx--checkbox-label",
	totalAuditLogCountCss : "span.bx--pagination__text",
	resolverGroupSuccessNotificationCss : "p.bx--toast-notification__title",
	successNotificationCloseIconXpath : "//*[@class='bx--toast-notification__close-icon notification__close']",
	dahsboardCardsHeaderXpath : "//div[@class='clientCardTitleDiv cardupTitle']",
	selfServiceHeaderCss:"h4.bx--data-table-header__title",
	totalItemsCountCss:"span.bx--pagination__text",
	paginationDetailsTextCss: "div.bx--pagination__left span.bx--pagination__text",
	clickCss:".bx--select__item-count .bx--select__arrow",
	optionCss:".bx--select__item-count .bx--select-option",
	applicationResourceTableRowCss:".bx--data-table-container .bx--data-table tbody tr",
	paginationDisplayCss:"select#pagination-select-current-page-0",
	clickOnPageCss:"select#pagination-select-current-page-0 option.bx--select-option",
	clickResolverGroupTableHeaderCss:"span.bx--table-sort__flex",
	clickHeaderCss:"div.bx--table-header-label",
	healthyMessageCss:"p.cardBoldTxtMd",
	noAlertsTextMessageCss:"p.messageTxt",
	sunriseTicketsCountCss:"a.createdTicket",
	sunriseHeaderCss:"div div h2",
	dailySunriseCardSubHeadersCss:"div.pticketslabel",
	dailySunrisePriorityCountXpath:"//div[@class='row sunriseCol {0}']//div[@class='pticketsMrgnRght']//span[contains(@class,'tlabel')]",
	dailySunriseReportViewDetailsXpath:"//div[@class='row sunriseCol {0}']//div[@class='viewDetails']//a",
	healthAssessmentLabelCss:"div.kbnMarkdown__body h2",
	healthAssessmentLinkXpath:"//p[contains(text(),'{0}')]",
	monthYearTabCss:".bx--content-switcher .bx--content-switcher-btn",
	customiseButtonCss:"#customize",
	ticketInScopeHeaderCss:"label.bx--checkbox-label-text",
	legendNamesDashboardCss:"div.{0} .legend-item text",
	getTicketCountCss:"div.{0} .bx--cc--simple-bar .bx--cc--simple-bar path",
	chartColumnXpath:"//div[@class='{0}']//span[@class='icons']//*[contains(text(),'Chart column')]/..",
	providerCountXpath:"//a[contains(text(),'{0}')]/../preceding-sibling::p//a",
	legendCheckboxCss:"div.{0} .legend-item .active",
	totalBarCss:"div.{0} .bx--cc--simple-bar .bar",
	smCardBarCss:"div.{0} .bx--cc--simple-bar .bar"
};

function dashboard(selectorConfig) {
	if (!(this instanceof dashboard)) {
		return new dashboard(selectorConfig);
	}
	extend(this, defaultConfig);

	if (selectorConfig) {
		extend(this, selectorConfig);
	}
}

/**
 * Method to perform switch to default content then switch to frame
 */
dashboard.prototype.open = function () {
	util.waitForAngular();
	util.switchToDefault();
	util.switchToFrame();
};

/**
 * Method to get dashboard header title text
 */
dashboard.prototype.getDashboardHeaderTitleText = function () {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.dashboardHeaderTileTextCss))), timeout.timeoutInMilis);
	return element(by.css(this.dashboardHeaderTileTextCss)).getText().then(function (text) {
		logger.info("Dashboard page header title text : " + text);
		var splitStr = text.split(" ")[0];
		logger.info("splitted string : " + splitStr);
		return splitStr.trim();
	});
};
/**
 * Method to check whether the Daily sunrise report card is available or not
 */
dashboard.prototype.isPresentDSRTile = function () {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.dsrTileTitleTextCss))), timeout.timeoutInMilis);
	return element(by.css(this.dsrTileTitleTextCss)).getText().then(function (text) {
		logger.info("DSR title text is : " + text);
		return text;
	});
};
/**
 * Method to get alerts timestamp
 */
dashboard.prototype.getAlertsTimestamp = function () {
	var self = this;
	browser.wait(EC.visibilityOf(element.all(by.css(self.dailySunriseCardSubHeadersCss)).get(0)), timeout.timeoutInMilis);
	browser.wait(EC.visibilityOf(element.all(by.css(self.alertDateCss)).get(0)), timeout.timeoutInMilis);
	return element.all(by.css(self.alertDateCss)).getText().then(function (datetime) {
	    logger.info("Time stamp of the alert is  : " + datetime);
	    return datetime;
	});
};

/**
 * Method to get all cards header on dashboard Page
 */
dashboard.prototype.getAllCardsNameFromDashboard = async function(adminCardName) {
	var self = this;
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.css(self.dashboarAllCardHeaderCss)).get(0)), timeout.timeoutInMilis);
	return await element.all(by.css(self.dashboarAllCardHeaderCss)).getText().then(function (dashboardCardText) {
		var dashboardCardNames = dashboardCardText.map((names)=>names.split('(')[0].trim())
		logger.info("Dashboard header card text is : " + dashboardCardNames);
		return dashboardCardNames
	});
}

/**
 * method to click on self service link
 */

dashboard.prototype.clickOnAdminConsoleCategories = async function(serviceName) {
	var self = this;
	util.waitForAngular();
	var selfService = self.selfServiceXpath.format(serviceName);
	browser.wait(EC.visibilityOf(element.all(by.css(self.dailySunriseCardSubHeadersCss)).get(0)), timeout.timeoutInMilis);
	browser.wait(EC.elementToBeClickable(element(by.xpath(selfService))), timeout.timeoutInMilis)
	await browser.actions().mouseMove(element(by.xpath(selfService))).click().perform().then(function () {
		logger.info('clicked on ' + serviceName)
	})
}

/**
 * Method to get audit log header
 */
dashboard.prototype.getAuditLogHeaderText =async function() {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.auditLogCss))), timeout.timeoutInMilis);
	await element(by.css(this.auditLogCss)).getText().then(function(auditLogText){
		logger.info("header is " + auditLogText);	
	});
}


/**
 * Method to get all parameters from alerts overview section
 */
dashboard.prototype.getAllAvailableParameterNameFromAlert = function () {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.css(this.allAvailableParameterOverview)).get(0)), timeout.timeoutInMilis);
	return element.all(by.css(this.allAvailableParameterOverview)).getText().then(function (alertOverviewParam) {
		var list = new Array();
		for (var i = 0; i < alertOverviewParam.length; i++) {
			var split = alertOverviewParam[i].toString().split("(")[0];
			list[i] = split.trim();
		}
		logger.info("list " + list);
		return list;
	});
};
/**
 * Method to get total alerts count value
 */
dashboard.prototype.getAlertsTotalCount =async function () {
	var countVal;
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.xpath(this.alertsCardTitleXpath))), timeout.timeoutInMilis);
	return await element(by.xpath(this.alertsCardTitleXpath)).getText().then(function (title) {
		var temp = title.trim().split("(")[1];
		countVal = parseInt(temp.split(")")[0]);
		logger.info("Total count : " + countVal);
		return countVal;
	});
};

/**
 * Method to get total alerts row count
 */
dashboard.prototype.getAlertsRowCount = async function () {
	var self= this;
	util.waitForAngular();
	var totalCount = await this.getAlertsTotalCount()
	if(totalCount > 0){
		browser.wait(EC.visibilityOf(element(by.xpath(self.alertsCardTitleXpath))), timeout.timeoutInMilis);
		browser.wait(EC.visibilityOf(element.all(by.css(self.alertsRowsCss)).get(0)), timeout.timeoutInMilis);
		return element.all(by.css(this.alertsRowsCss)).count().then(function (rowCount) {
			logger.info("Total alerts Row count : " + rowCount);
			return parseInt(rowCount);
		});
	}else{
		return 0;
	}
};

/**
 * Method to get critical alerts row count
 */
dashboard.prototype.getCriticalAlertsRowCount = function () {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.xpath(this.alertsCardTitleXpath))), timeout.timeoutInMilis);
	return element.all(by.css(this.criticalAlertsRowsCss)).count().then(function (rowCount) {
		logger.info("Critical alerts Row count : " + rowCount);
		return parseInt(rowCount);
	});
};

/**
 * Method to get warning alerts row count
 */
dashboard.prototype.getWarningAlertsRowCount = function () {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.xpath(this.alertsCardTitleXpath))), timeout.timeoutInMilis);
	return element.all(by.css(this.warningAlertsRowsCss)).count().then(function (rowCount) {
		logger.info("Warning alerts Row count : " + rowCount);
		return parseInt(rowCount);
	});
};
/**
 * Method to retrieve the alert header title
 */
dashboard.prototype.retrieveAlertHeader =  function () {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.alertHeader))), timeout.timeoutInMilis);
	return element(by.css(this.alertHeader)).getText().then(function (alertHeader) {
        logger.info("alert Header title is : " + alertHeader);
	    return alertHeader;
	});
};

/**
 * Method to get first alert event Name such as Critical or warning
 */
dashboard.prototype.getFirstAlertEventName = async function () {
	var self = this;
	util.waitForAngular();
	return await element(by.css(self.criticalAlertsRowsCss)).isPresent().then(function (result) {
		if(result){
			logger.info("First Alert is : " + dashboardTestData.criticalAlertName)
			return dashboardTestData.criticalAlertName
		}
		logger.info("First Alert is : " + dashboardTestData.warningAlertName)
		return dashboardTestData.warningAlertName
	});
}

/**
 * Method to click on first alert row on alerts card and return text on it
 */
dashboard.prototype.clickOnFirstAlertFromAlertsCard = async function () {
	util.waitForAngular();
	var rowCnt = await this.getAlertsRowCount();
	if (rowCnt > 0) {
		browser.wait(EC.visibilityOf(element.all(by.css(this.dailySunriseCardSubHeadersCss)).get(0)), timeout.timeoutInMilis);
		var firstAlertRowCss = element.all(by.css(this.alertRowsNameCss)).get(0);
		browser.wait(EC.elementToBeClickable(firstAlertRowCss), timeout.timeoutInMilis);
		return firstAlertRowCss.getText().then(function (text) {
			return firstAlertRowCss.click().then(function () {
				var txt = text.split(" application")[0].trim();
				logger.info("Clicked on first alert from alerts card. Text on alert: " + txt);
				return true;
			})
		})
	}
	else {
		logger.info("There are no alerts present.");
		return false;
	}
};
/**
 * Method to retrieve the first alert name from dashboard
 */
dashboard.prototype.retrieveFirstAlert = async function () {
	var rowCnt = await this.getAlertsRowCount();
	if (rowCnt > 0) {
		var firstAlertRowCss = await element(by.css(this.alertRowsNameCss));
		browser.wait(EC.elementToBeClickable(firstAlertRowCss), timeout.timeoutInMilis);
		return firstAlertRowCss.getText().then(function (alertName) {
		    logger.info("alert present and the name is " + alertName);
		    return alertName;
		})
	}
};
/**
 * Method to get details of first Critical alert from Alert card and return App Name and Server count affected
 */
dashboard.prototype.getFirstCriticalAlertDetailsFromAlertsCard = async function () {
	var alertCount = await this.getCriticalAlertsRowCount();
	if (alertCount > 0) {
		var firstAlertRowNameCss = element.all(by.xpath(this.criticalAlertsRowsNameXpath)).get(0);
		var firstAlertRowCICountCss = element.all(by.xpath(this.criticalAlertRowCICountXpath)).get(0);
		browser.wait(EC.visibilityOf(firstAlertRowNameCss), timeout.timeoutInMilis);
		return firstAlertRowNameCss.getText().then(function (appName) {
			return firstAlertRowCICountCss.getText().then(function (CIcount) {
				var name = appName.split(" application")[0].trim();
				var count = parseInt(CIcount.split("/")[0]);
				logger.info("App name: " + name + ", CI impacted count: " + count);
				var details = [name, count];
				return details;
			});
		});
	}
	else {
		logger.info("There are no critical alerts present.");
		return false;
	}
};

/**
 * Method to get critical alerts count from health card
 */
dashboard.prototype.getCriticalAlertsCountFromHealthCard =async function () {
	util.waitForAngular();
	var self=this;
	return await browser.wait(EC.presenceOf(element.all(by.xpath(self.criticalCountXpath)).get(0)), timeout.timeoutInMilis).then(function(){
		return element.all(by.xpath(self.criticalCountXpath)).count().then(function (criticalCount) {
			logger.info("Health Card critical count : " + criticalCount);
			return parseInt(criticalCount);
		})
	}).catch(function(err){
		logger.info('There is no critical alert')
		return 0;
	})
};

/**
 * Method to get details of first Warning alert from Alert card and return App Name and Server count affected
 */
dashboard.prototype.getFirstWarningAlertDetailsFromAlertsCard = async function () {
	var alertCount = await this.getWarningAlertsRowCount();
	if (alertCount > 0) {
		var firstAlertRowNameCss = element.all(by.xpath(this.warningAlertsRowsNameXpath)).get(0);
		var firstAlertRowCICountCss = element.all(by.xpath(this.warningAlertRowCICountXpath)).get(0);
		browser.wait(EC.visibilityOf(firstAlertRowNameCss), timeout.timeoutInMilis);
		return firstAlertRowNameCss.getText().then(function (appName) {
			return firstAlertRowCICountCss.getText().then(function (CIcount) {
				var name = appName.split(" application")[0];
				var count = parseInt(CIcount.split("/")[0]);
				logger.info("App name: " + name + ", CI impacted count: " + count);
				var details = [name, count];
				return details;
			});
		});
	}
	else {
		logger.info("There are no warning alerts present.");
		return false;
	}
};

/**
 * Method to get warning alerts count from health card
 */
dashboard.prototype.getWarningAlertsCountFromHealthCard =async function () {
	util.waitForAngular();
	var self = this;
	return await browser.wait(EC.presenceOf(element.all(by.xpath(self.warningCountXpath)).get(0)), timeout.timeoutInMilis).then(function(){
		return element.all(by.xpath(self.warningCountXpath)).count().then(function (warningCount) {
			logger.info("Health Card warning count : " + warningCount);
			return parseInt(warningCount);
		});
	}).catch(function(err){
		logger.info('There is no warning alert')
		return 0;
	})
};

/**
 * Method to get total[critical+warning] alerts count from health card
 */
dashboard.prototype.getTotalAlertsCountFromHealthCard = async function () {
	var criticalAlerts = await this.getCriticalAlertsCountFromHealthCard();
	var warningAlerts = await this.getWarningAlertsCountFromHealthCard();
	return (criticalAlerts + warningAlerts);
};

/**
 * Method to get Healthy alerts count from health card
 */
dashboard.prototype.getHealthyAlertsCountFromHealthCard = function () {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.healthyCountCss))), timeout.timeoutInMilis);
	return element(by.css(this.healthyCountCss)).getText().then(function (healthyCount) {
		logger.info("Health Card Healthy count : " + healthyCount);
		return parseInt(healthyCount);
	});
};

/**
 * Method to verify last updated timestamp is updated within limit or not
 * time -- Numeric value in Hours or Minutes
 * timeUnit -- String value as "Hours" or "Minutes"
 */
dashboard.prototype.verifyLastUpdatedTimestampForITOps = function (time, timeUnit) {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.xpath(this.lastUpdatedTimestampXpath))), timeout.timeoutInMilis);
	return element(by.xpath(this.lastUpdatedTimestampXpath)).getText().then(function (lu_time) {
		var temp = lu_time.split("updated:");
		var lastUpdatedTime = temp[1].trim();
		logger.info("Last Updated Time: " + lastUpdatedTime);
		// Get app time in Local timezone
		if (lastUpdatedTime.includes("IST")) {
			logger.info("Sliced time: " + lastUpdatedTime.split("IST")[0].trim());
			var d1 = new Date(lastUpdatedTime.split("IST")[0].trim());
		}
		else {
			var d1 = new Date(lastUpdatedTime);
		}
		// Get local time in Local timezone
		var curr_Time = util.getLocalTimeDate();
		var d2 = new Date(curr_Time);
		logger.info("App_time: " + d1 + " " + "Local_time: " + d2);
		if (timeUnit == "Hours") {
			// Find the difference between 2 dates and convert it in hours
			var diff = Math.abs(d2 - d1) / (60 * 60 * 1000);
		}
		else if (timeUnit == "Minutes") {
			// Find the difference between 2 dates and convert it in minutes
			var diff = Math.abs(d2 - d1) / (60 * 1000);
		}
		else {
			logger.info("Invalid time unit provided..");
			return false;
		}
		if (diff <= time) {
			logger.info("Difference is within limit[" + time + " " + timeUnit + "] and value is: " + diff);
			return true;
		}
		else {
			logger.info("Difference is exceeded the limit[" + time + " " + timeUnit + "] and value is: " + diff);
			return false;
		}
	});
};

/**
 * Method to verify last updated timestamp for Health & Inventory landing pages is updated within limit or not
 * time -- Numeric value in Hours or Minutes
 * timeUnit -- String value as "Hours" or "Minutes"
 */
dashboard.prototype.verifyLastUpdatedTimestampForHealthInventory = function (time, timeUnit) {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.lastUpdatedTimestampHealthInventoryCss))), timeout.timeoutInMilis);
	browser.sleep(2000);
	return element(by.css(this.lastUpdatedTimestampHealthInventoryCss)).getText().then(function (lu_time) {
		var temp = lu_time.split("updated");
		var lastUpdatedTime = temp[1].trim();
		logger.info("Last Updated Time: " + lastUpdatedTime);
		// Get app time in Local timezone
		if (lastUpdatedTime.includes("IST")) {
			logger.info("Sliced time: " + lastUpdatedTime.split("IST")[0].trim());
			var d1 = new Date(lastUpdatedTime.split("IST")[0].trim());
		}
		else {
			var d1 = new Date(lastUpdatedTime);
		}
		// Get local time in Local timezone
		var curr_Time = util.getLocalTimeDate();
		var d2 = new Date(curr_Time);
		logger.info("App_time: " + d1 + " " + "Local_time: " + d2);
		if (timeUnit == "Hours") {
			// Find the difference between 2 dates and convert it in hours
			var diff = Math.abs(d2 - d1) / (60 * 60 * 1000);
		}
		else if (timeUnit == "Minutes") {
			// Find the difference between 2 dates and convert it in minutes
			var diff = Math.abs(d2 - d1) / (60 * 1000);
		}
		else {
			logger.info("Invalid time unit provided..");
			return false;
		}
		if (diff <= time) {
			logger.info("Difference is within limit[" + time + " " + timeUnit + "] and value is: " + diff);
			return true;
		}
		else {
			logger.info("Difference is exceeded the limit[" + time + " " + timeUnit + "] and value is: " + diff);
			return false;
		}
	});
};

/**
 * Method to get timestamp difference for Daily sunrise report card
 */
dashboard.prototype.getTimestampDiffForSunriseReport = function () {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.dsrToTimestampCss))), timeout.timeoutInMilis);
	var self = this;
	var fTime, tTime;
	return element(by.css(this.dsrFromTimestampCss)).getText().then(function (fromTime) {
		var temp = fromTime.split("To:");
		fTime = temp[0].split("From:");
		//logger.info("From time: " + fTime[1].trim());
		return element(by.css(self.dsrToTimestampCss)).getText().then(function (toTime) {
			tTime = toTime.split("To:");
			var f_Time = fTime[1].trim();
			var t_Time = tTime[1].trim();
			if (f_Time.includes("IST") && t_Time.includes("IST")) {
				var fromTimestamp = new Date(f_Time.split("IST")[0].trim());
				var toTimestamp = new Date(t_Time.split("IST")[0].trim());
			}
			else {
				var fromTimestamp = new Date(f_Time);
				var toTimestamp = new Date(t_Time);
			}
			logger.info("From time after Local Timezone conversion: " + fromTimestamp);
			logger.info("To time after Local Timezone conversion: " + toTimestamp);
			// Get local time in IST
			var curr_Time = util.getLocalTimeDate();
			var curr_dateObj = new Date(curr_Time);
			logger.info("Current time after Local Timezone conversion: " + curr_dateObj);
			// Check whether the environment gets updated today or not
			var updateHoursDiff = Math.abs(curr_dateObj - toTimestamp) / (60 * 60 * 1000);
			logger.info("Hours difference between current time and updated time of env: " + updateHoursDiff);
			if (updateHoursDiff > 24) {
				logger.info(dashboardTestData.envNotUpdatedMsg);
				return dashboardTestData.envNotUpdatedMsg;
			}
			else {
				// Find the difference between 2 dates and convert it in hours
				var hours = Math.abs(toTimestamp - fromTimestamp) / (60 * 60 * 1000);
				logger.info("Hours Diiference of DSR: " + hours);
				return hours.toString();
			}
		});
	});
};

/**
 * Method to get all available cards name from dashboard page
 */
dashboard.prototype.getAllAvialableCardsNameFromDashboard = function () {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.css(this.dailySunriseCardSubHeadersCss)).get(0)), timeout.timeoutInMilis);
	browser.wait(EC.visibilityOf(element.all(by.css(this.allAvailableCardsNameCss)).get(0)), timeout.timeoutInMilis);
	return element.all(by.css(this.allAvailableCardsNameCss)).getText().then(function (text) {
		logger.info("Available cards name from dashboard page : " + text);
		var list = new Array();
		for (var i = 0; i < text.length; i++) {
			var split = text[i].toString().split("(")[0];
			list[i] = split.trim();
		}
		logger.info("list " + list);
		return list;
	});
};
/**
 * Method to check no data available text is present or not based on card name
 */
dashboard.prototype.isNoDataAvailableTextPresent = function (cardName) {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css("span[title='" + cardName + "']"))), timeout.timeoutInMilis);
	var noDataAvailableElement = element(by.xpath("//span[@title='" + cardName + "']" + this.noDataAvailableXpath));
	return noDataAvailableElement.isPresent().then(function (bool) {
		if (bool) {
			logger.info("Is No data available text present for " + cardName + " : " + bool);
			return true;
		} else {
			logger.info("Is No data available text present for " + cardName + " : " + bool);
			return false;
		}
	});
};


/**
 * Method to check connection failure text is present or not based on card name
 */
dashboard.prototype.isConnectionFailureTextPresent = function (cardName) {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css("span[title='" + cardName + "']"))), timeout.timeoutInMilis);
	var connectionFailureElement = element(by.xpath("//span[@title='" + cardName + "']" + this.connectionFailureXpath));
	return connectionFailureElement.isPresent().then(function (bool) {
		if (bool) {
			logger.info("Is connection failure text present for " + cardName + " : " + bool);
			return true;
		} else {
			logger.info("Is connection failure text present for " + cardName + " : " + bool);
			return false;
		}
	});
};


/**
 * Method to click on large view ICON
 */
dashboard.prototype.clickOnLargeViewIcon = function () {
	var self = this;
	util.waitForAngular();
	var largeViewIcon = element(by.css(self.largeViewCss));
	browser.wait(EC.elementToBeClickable(largeViewIcon), timeout.timeoutInMilis);
	util.scrollToTop();
	element(by.css(self.largeViewCss)).getAttribute(self.classAttribute).then(function (res) {
		if (res.includes(self.selectedCategoryAttribute)) {
			logger.info("Large view is already selected");
		}
		else {
			largeViewIcon.click().then(function () {
				logger.info("Clicked on large view ICON");
				util.waitForAngular();
			});
		}
	});

};

/**
 * Get all legends from inventory pie chart
 */
dashboard.prototype.getAllLegendsFromInventoryCard = async function(){
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.css(this.inventoryCardLegendsCss)).get(0)), timeout.timeoutInMilis);
	return await element.all(by.css(this.inventoryCardLegendsCss)).getText().then(function(legendList){
		logger.info("All legends from inventory card: ",legendList);
		return legendList;
	});
}

/**
 * Method to click on small/Mini view ICON
 */
dashboard.prototype.clickOnMiniViewIcon = async function () {
	var self = this;
	util.waitForAngular();
	var miniViewIcon = element(by.css(self.smallViewCss));
	browser.wait(EC.elementToBeClickable(miniViewIcon), timeout.timeoutInMilis);
	util.scrollToTop();
	await element(by.css(self.smallViewCss)).getAttribute(self.classAttribute).then(function (res) {
		if (res.includes(self.selectedCategoryAttribute)) {
			logger.info("Small view is already selected");
		}
		else {
			miniViewIcon.click().then(function () {
				logger.info("Clicked on small view ICON");
				browser.sleep(2000);
				util.waitForAngular();
			});
		}
	});

};


/**
 * Method to click on view details link based on card
 */
dashboard.prototype.clickOnViewDetailsLinkBasedOnCard = async function (cardName) {
	var self = this;
	util.waitForAngular();
	var xpathSelector = self.viewDetailsLinkXpath.format(cardName);
	await browser.wait(EC.elementToBeClickable(element(by.xpath(xpathSelector))), timeout.timeoutInMilis);
	await util.scrollToWebElement(element(by.xpath(xpathSelector)));
	await element(by.xpath(xpathSelector)).click().then(function () {
		logger.info("Clicked on " + cardName + "'s view details link");
		util.waitForAngular();
	});
};


/**
 * Method to get text from tooltip
 */
dashboard.prototype.getToolTipText = function () {
	browser.wait(EC.visibilityOf(element(by.css(this.toolTipTextCss))), timeout.timeoutInMilis);
	return element(by.css(this.toolTipTextCss)).getText().then(function (toolTipText) {
		logger.info("tool tip text is : " + toolTipText);
		return toolTipText;
	});
};


/**
 * Method to get text from miniView based on input
 * @cardName e.g. inventory, health
 * @identifier e.g. DC, MC, Created, implemented, resolved
 */
dashboard.prototype.getTextFromMiniViewCard = async function (cardName, identifier) {
	util.waitForAngular();
	var xpathSelector = this.miniViewCardsTextXpath.format(cardName, identifier);
	browser.wait(EC.visibilityOf(element.all(by.css(this.dailySunriseCardSubHeadersCss)).get(0)), timeout.timeoutInMilis);
	browser.wait(EC.visibilityOf(element(by.xpath(xpathSelector))), timeout.timeoutInMilis);
	return await element(by.xpath(xpathSelector)).getText().then(function (identifierValue) {
		logger.info(cardName + " card title's " + identifier + " identifier's value is :  " + identifierValue);
		return Number(identifierValue);
	});
};


/**
 * Method to get text from daily sunrise report card based on input
 * @ticket e.g. P1 tickets, P2 tickets, P3 tickets
 * @identifier e.g. Created, resolved
 */
dashboard.prototype.getTextFromDailySunRiseReportCard = function (ticket, identifier) {
	util.waitForAngular();
	var xpathSelector = this.dailySunRiseReportDataXpath.format(ticket, identifier);
	browser.wait(EC.visibilityOf(element(by.xpath(xpathSelector))), timeout.timeoutInMilis);
	return element(by.xpath(xpathSelector)).getText().then(function (ticketNumber) {
		logger.info(ticket + " tickets " + identifier + " value is :  " + ticketNumber);
		if (ticketNumber.includes("k")) {
			var ticketNum = parseFloat(ticketNumber);
			logger.info(ticket + " tickets " + identifier + " converted value is :  " + ticketNum);
			return ticketNum;
		} else {
			return Number(ticketNumber);
		}
	});
};


/**
 * Method to get text from daily sunrise report card based on input
 * @ticket e.g. P1 tickets, P2 tickets, P3 tickets
 * @identifier e.g. Created, resolved
 */
dashboard.prototype.clickOnDailySunRiseReportCard = function (ticket, identifier) {
	util.waitForAngular();
	var xpathSelector = this.dailySunRiseReportDataXpath.format(ticket, identifier);
	browser.wait(EC.elementToBeClickable(element(by.xpath(xpathSelector))), timeout.timeoutInMilis);
	element(by.xpath(xpathSelector)).click().then(function () {
		logger.info("Clicked on " + ticket + " tickets " + identifier);
	});
};

/**
 * Function to get tooltip value hovering over the bar in 2D-matrix bar graph
 * @graphName eg: Problem Management ( Bar graph available on dashbord)
 * @barNo is the Number representing, bar from left to right for which value is getting fetched starting with 1
 * @rangeNo  The Position of Bar starts with 0 ,if there is range comparison between Bars
 * e.g Problem Management  Matrix Bar Graph
 * First range---(Ticket Created :RangeNo and barNo respectively)[0 1, 0 2, 0 3]
 * second range---(Ticket Resolved :RangeNo and barNo respectively)[1 1, 1 2, 1 3]
 *
  */
dashboard.prototype.getMatrixBarGraphTicketText = async function (graphName, barNo, RangeNo) {
	var self = this;
	await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	util.waitForAngular();
	var barGraphElement;
	if (graphName == dashboardTestData.problemManagement) {
		barGraphElement = await element(by.css(this.problemManagementGraphWrapperCss + " g.nv-group.nv-series-" + RangeNo + " rect:nth-child(" + barNo + ")"))
	}
	else if (graphName == dashboardTestData.changeManagement) {
		barGraphElement = await element(by.css(this.changeManagementGraphWrapperCss + " g.nv-group.nv-series-" + RangeNo + "  rect:nth-child(" + barNo + ")"))
	}
	else if (graphName == dashboardTestData.incidentManagement) {
		barGraphElement = await element(by.css(this.incidentManagementGraphWrapperCss + " g.nv-group.nv-series-" + RangeNo + "  rect:nth-child(" + barNo + ")"))
	}
	await browser.wait(EC.visibilityOf(barGraphElement), timeout.timeoutInMilis);
	return await browser.actions().mouseMove(barGraphElement).perform().then(function () {
		logger.info("Mouse over " + graphName + " Bar Graph");
		return self.getToolTipText();
	});
};

/**
 * Function to get tooltip value hovering over the bar in 2D-matrix bar graph
 * @graphName eg: Problem Management ( Bar graph available on dashbord)
 * @barNo is the Number representing, bar from left to right for which value is getting fetched starting with 1
 * @rangeNo  The Position of Bar starts with 0 ,if there is range comparison between Bars
 * e.g Problem Management  Matrix Bar Graph
 * First range---(Ticket Created :RangeNo and barNo respectively)[0 1, 0 2, 0 3]
 * second range---(Ticket Resolved :RangeNo and barNo respectively)[1 1, 1 2, 1 3]
 * Used only for Incident, Change and Problem Management
  */
 dashboard.prototype.getColorCodeForBarGraph =async function(cardName, index, legend){
	var self = this;
	util.waitForAngular();
	var barGraphElement = this.GraphWrapperCss.format(cardName);
	browser.wait(EC.visibilityOf(element.all(by.css(barGraphElement)).get(index)), timeout.timeoutInMilis);
	return await element.all(by.css(barGraphElement)).get(index).getCssValue('fill').then(function(colorCode){
		logger.info("Color code for "+ legend +" is: "+colorCode.trim());
		return colorCode.trim();
	});
};

/**
 * Method to get top 5 affected server text for pervasive insights card
 */
dashboard.prototype.getPervasiveInsightsCardTop5ServersText = function () {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.top5ServersPervasiveInsightsTxtCss))), timeout.timeoutInMilis);
	return element.all(by.css(this.top5ServersPervasiveInsightsTxtCss)).getText().then(function (serversName) {
		logger.info("top 5 pervasive insights server name :  " + serversName);
		return serversName;
	});
};

/**
 * Method to get tool tip text from pervasive insights bar graph based on index provided
 */
dashboard.prototype.getPervasiveInsightsGraphBarText = async function (index) {
	var self = this;
	util.waitForAngular();
	browser.sleep(2000);
	var barGraphElement = await element.all(by.css(this.pervasiveInsightsGraphBarTxtCss)).get(index);
	await browser.wait(EC.visibilityOf(barGraphElement), timeout.timeoutInMilis);
	return await browser.actions().mouseMove(barGraphElement).perform().then(async function () {
		var toolTipText = await self.getToolTipText();
		var count = await util.getNumberFromString(toolTipText);
		logger.info("Tool tip text number : ", count);
		return util.stringToFloat(count);
	});
};


/**
 * Method to get card title count
 */
dashboard.prototype.getCardTitleCount = function (cardTitle) {
	util.waitForAngular();
	var cssSelector = this.cardTitleCss.format(cardTitle);
	browser.wait(EC.visibilityOf(element(by.css(cssSelector))), timeout.timeoutInMilis);
	return element(by.css(cssSelector)).getText().then(async function(titleText){
		var count = titleText.replace(/\D/g, "");
		await logger.info(cardTitle+" card title count : ", count);
		return Number(count);
	});
};


/**
 * Method to get data center text from card title
 */
dashboard.prototype.getCardTitleDataCenterText = function (cardTitle) {
	util.waitForAngular();
	var dataCenterCssSelector = this.cardTitleDataCenterCss.format(cardTitle);
	browser.wait(EC.visibilityOf(element(by.css(dataCenterCssSelector))), timeout.timeoutInMilis);
	return element(by.css(dataCenterCssSelector)).getText().then(async function(dataCenterText){
		await logger.info(cardTitle+" data center text : ", dataCenterText);
		var dataCenterSplitStr = dataCenterText.split("(")[1];
		var dataCenterSplitedStr = dataCenterSplitStr.toString().split(")")[0];
		return dataCenterSplitedStr;
	});
};


/**
 * Method to get row count from actionable insights card
 */
dashboard.prototype.getActionableInsightsCardRowCount = function () {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.xpath(this.actionableInsightsRowXpath)).get(0)), timeout.timeoutInMilis);
	return element.all(by.xpath(this.actionableInsightsRowXpath)).count().then(async function(rowCount){
		await logger.info("Actionable insights card row count : ", rowCount);
		return Number(rowCount);
	});
};


/**
 * Method to get row text from actionable insights card based on index provided
 * @index parameter passed to get row text
 */
dashboard.prototype.getActionableInsightsCardRowText = function (index) {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.xpath(this.actionableInsightsRowXpath)).get(index)), timeout.timeoutInMilis);
	return element.all(by.xpath(this.actionableInsightsRowXpath)).get(index).getText().then(async function(rowText){
		await logger.info("Actionable insights card row Text : ", rowText);
		return rowText;
	});
};


/**
 * Method to click on row text from actionable insights card based on index provided
 * @index parameter passed to click on row text
 */
dashboard.prototype.clickOnActionableInsightsCardRow = function (index) {
	util.waitForAngular();
	browser.wait(EC.elementToBeClickable(element.all(by.xpath(this.actionableInsightsRowXpath)).get(index)), timeout.timeoutInMilis);
	element.all(by.xpath(this.actionableInsightsRowXpath)).get(index).click().then(function(){
		logger.info(" Clicked on Actionable insights card row");
	});
};


/**
 * Method returns Card's Definition/Description Text based on Card Name
 * i.e: for Pervasive Insights  it is Top 5 Affected Servers
 */
dashboard.prototype.getCardsDefinitionTextBasedOnCardName = function(cardName)
{
	util.waitForAngular();
	var cardDefinitionTxt = this.cardDefinitionTxtXpath.format(cardName)
	browser.wait(EC.visibilityOf(element(by.xpath(cardDefinitionTxt))), timeout.timeoutInMilis);
	return element(by.xpath(cardDefinitionTxt)).getText().then(function (cardComponentTxt) {
		logger.info("Card definition for "+cardName +" is "+ cardComponentTxt);
		return cardComponentTxt;
	});
}
/**
 *  Method returns the name of keys.
 * keys: are the notations for ,what a particular bar is prepresenting in the Bar graph
 * eg: Ticket Created and Ticket resolved for incident mangement Graph
 */
dashboard.prototype.getCardKeyValuesTextBasedOnCardName = function(cardName)
{
	util.waitForAngular();
	var cardKeyValueTxt = this.barGraphKeyValueXpath.format(cardName)
	browser.wait(EC.visibilityOf(element.all(by.xpath(cardKeyValueTxt)).last()), timeout.timeoutInMilis);
	return element.all(by.xpath(cardKeyValueTxt)).getText().then(function (cardValueTxt) {
		logger.info(cardName+" graph key represtentation values are : " + cardValueTxt);
		return cardValueTxt;
	});
}
/**
 * Method returns X-axis Title text of Bar Graph based on Graph Name
 * i.e for Incident Management it is TICKET COUNT
 */
dashboard.prototype.getCardXaxisTitleTextBasedOnCardName = function(cardName)
{
	util.waitForAngular();
	var cardTitleAxisTxt = this.barGraphXaxisTitleXpath.format(cardName)
	browser.wait(EC.visibilityOf(element(by.xpath(cardTitleAxisTxt))), timeout.timeoutInMilis);
	return element(by.xpath(cardTitleAxisTxt)).getText().then(function (cardTitleTxt) {
		logger.info("X-axis title of " +cardName +" is " + cardTitleTxt);
		return cardTitleTxt;
	});
}
/**
 * Method returns X-axis Title text of Bar Graph based on Graph Name
 * i.e for Incident Mangement it is INCIDENTS BY MONTH
 */
dashboard.prototype.getCardYaxisTitleTextBasedOnCardName = function(cardName)
{
	util.waitForAngular();
	var cardTitleAxisTxt = this.barGraphYaxisTitleXpath.format(cardName)
	browser.wait(EC.visibilityOf(element(by.xpath(cardTitleAxisTxt))), timeout.timeoutInMilis);
	return element(by.xpath(cardTitleAxisTxt)).getText().then(function (cardTitleTxt) {
		logger.info("Y-axis title of " +cardName +" is " + cardTitleTxt);
		return cardTitleTxt;
	});
}
/**
 * Method returns First y-axis label's Name of Bar Graph based on Graph Name
 */
dashboard.prototype.getCardYaxisFirstLabelTextBasedOnCardName =async function(cardName)
{
	var self = this;
	util.waitForAngular();
	var cardLabelAxisTxt = this.barGraphYaxisLabelsCss.format(cardName);
	browser.wait(EC.visibilityOf(element.all(by.css(self.dailySunriseCardSubHeadersCss)).get(0)), timeout.timeoutInMilis);
	browser.wait(EC.visibilityOf(element.all(by.css(cardLabelAxisTxt)).first()), timeout.timeoutInMilis);
	return await element.all(by.css(cardLabelAxisTxt)).first().getText().then(function (cardLabelTxt) {
		logger.info("Y-axis first label of " +cardName +" is " + cardLabelTxt);
		return cardLabelTxt;
	});
}
/**
 * Method returns  all X-axis label's Test of Bar Graph based on Graph Name
 * i.e for Incident magment it will return all x axis label: Mmm YY ,Mmm YY, Mmm YY
 */
dashboard.prototype.getCardXaxisLabelsTextBasedOnCardName =async function(cardName)
{
	var self = this;
	util.waitForAngular();
	var cardLabelAxisTxt = this.barGraphXaxisLabelsCss.format(cardName);
	browser.wait(EC.visibilityOf(element.all(by.css(self.dailySunriseCardSubHeadersCss)).get(0)), timeout.timeoutInMilis);
	browser.wait(EC.visibilityOf(element.all(by.css(cardLabelAxisTxt)).get(0)), timeout.timeoutInMilis);
	return await element.all(by.css(cardLabelAxisTxt)).getText().then(function (cardLabelTxt) {
		var cardLabel = cardLabelTxt.filter((data)=> data !== '');
		logger.info("x-axis  labels of " +cardName +" are " + cardLabel);
		return cardLabel;
	});
}
/**
 * Method returns X-axis label's count of Bar Graph based on Graph Name
 * for Incident magment it will return all x axis label: Mmm YY ,Mmm YY, Mmm YY it will return 3
 */
dashboard.prototype.getCardXaxisLabelsCountTextBasedOnCardName =async function(cardName){
	var self = this;
	util.waitForAngular();
	var cardLabelAxisTxt = this.barGraphXaxisLabelsCss.format(cardName);
	browser.wait(EC.visibilityOf(element.all(by.css(self.dailySunriseCardSubHeadersCss)).get(0)), timeout.timeoutInMilis);
	browser.wait(EC.visibilityOf(element.all(by.css(cardLabelAxisTxt)).get(0)), timeout.timeoutInMilis);
	return await element.all(by.css(cardLabelAxisTxt)).getText().then(function (cardLabelTxt) {
		var cardLabelLength = cardLabelTxt.filter((data)=> data !== '').length;
		logger.info("x-axis labels Count of " +cardName +" is " + cardLabelLength);
		return cardLabelLength;
	});
}
/* get Inventory Items Count from Dashboard
*/
dashboard.prototype.getItemInventoryCount =async function(providerMC,providerDC)
{
	util.waitForAngular();
	var countMC = this.providerCountXpath.format(providerMC)
	var countDC = this.providerCountXpath.format(providerDC)
	var multiCloud=0, dataCenter=0;
	browser.wait(EC.visibilityOf(element(by.xpath(countMC))), timeout.timeoutInMilis);
	await element(by.xpath(countMC)).getText().then(function (itemText) {
		logger.info("MC count is : " + itemText);
		multiCloud = util.stringToInteger(itemText);
	});
	browser.wait(EC.visibilityOf(element(by.xpath(countDC))), timeout.timeoutInMilis);
	await element(by.xpath(countDC)).getText().then(function (itemText) {
		logger.info("DC count is : " + itemText);
		dataCenter = util.stringToInteger(itemText);
	});
	return multiCloud + dataCenter;
}


/**
 * Method to verify card is disabled
 */

dashboard.prototype.getCardDisabled = function() {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.xpath(this.cardDisabledMessageXpath))), timeout.timeoutInMilis);
	return element(by.xpath(this.cardDisabledMessageXpath)).getAttribute("title").then(function(cardDisableMsg){
		logger.info("Card Disabled message is  : "+ cardDisableMsg.trim());
		return cardDisableMsg;
	});
}

/**
 * Method to check Dashboard and account name
 */
dashboard.prototype.getAccountNameText = function() {
	var self = this;
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.xpath(this.accountNameTextXpath))), timeout.timeoutInMilis);
	return element(by.xpath(this.accountNameTextXpath)).getText().then(function (accountName) {
		logger.info("Account title text is : " + accountName);
		return accountName;
	});
}


/**
 * Method to click on customise button
 */

dashboard.prototype.customiseButtonClick = function() {
	var self = this;
	util.waitForAngular();
	return browser.wait(EC.visibilityOf(element(by.css(self.customiseButtonCss))), timeout.timeoutInMilis).then(async function(){
		return await element(by.css(self.customiseButtonCss)).click().then(function () {
			browser.sleep(2000);
			logger.info("Customised button clicked");
			return true
			});
	}).catch(function(){
        logger.info("Customisation button is not present");
        return false
    })
}

/**
 * Method to verify Cancel button for customisation
 */

dashboard.prototype.getSettingsCancelButtonText = function() {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.xpath(this.cancelButtonTextXpath))), timeout.timeoutInMilis);
	return element(by.xpath(this.cancelButtonTextXpath)).getText().then(function(buttonText){
		logger.info("Cancel button text is  : "+ buttonText.trim());
		return buttonText;
	});
}

/**
 * Method to click on Cancel button for customisation
 */

dashboard.prototype.clickCancelButton = function() {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.xpath(this.cancelButtonTextXpath))), timeout.timeoutInMilis);
	element(by.xpath(this.cancelButtonTextXpath)).click().then(function(){
		logger.info("Cancel button clicked");
	});
}



/**
 * Method to verify Save button for customisation
 */
dashboard.prototype.getSettingsSaveButtonText = function() {

	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.xpath(this.saveButtonTextXpath))), timeout.timeoutInMilis);
	return element(by.xpath(this.saveButtonTextXpath)).getText().then(function(buttonText){
		logger.info("Save button text is  : "+ buttonText.trim());
		return buttonText;
	});
}

/**
 * Method to click save button
 */
dashboard.prototype.clickSaveButton = function() {

	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.xpath(this.saveButtonTextXpath))), timeout.timeoutInMilis);
 	element(by.xpath(this.saveButtonTextXpath)).click().then(function(){
		browser.sleep(2000);
		logger.info("Save button clicked");

	});
}


/**
 * Method to click on grey icon
 */
dashboard.prototype.clickOnVisibilityIcon = function(cardName) {
	var visibilityIconXpath = this.visibilityIconButtonXpath.format(cardName);
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.xpath(visibilityIconXpath))), timeout.timeoutInMilis);
	element(by.xpath(visibilityIconXpath)).click().then(function(){
		logger.info("Visibility Icon Button clicked for "+cardName);
	});
}

/**
 * Method to get customisation message
 */
dashboard.prototype.getCustomisationMessage = function() {
	util.waitForAngular();
	browser.sleep(2000);
	browser.wait(EC.visibilityOf(element(by.xpath(this.customisationSuccessMessageXpath))), timeout.timeoutInMilis);
	return  element(by.xpath(this.customisationSuccessMessageXpath)).getText().then(function(customiseMssg){
		logger.info("Customised Message is  : "+ customiseMssg.trim());
		return customiseMssg;

	});
}

/**
 * Method to click on change management created in mini card
 */
dashboard.prototype.clickCreatedChangeMgmt = function() {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.xpath(this.clickChangeMgmtCreatedLnkXpath))), timeout.timeoutInMilis);
	element(by.xpath(this.clickChangeMgmtCreatedLnkXpath)).click().then(function(){
		logger.info("Created Link clicked from Change Management");
	});
}


/**
 * Method to click on incident management created in mini card
 */
dashboard.prototype.clickCreatedIncidentMgmt = function() {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.xpath(this.clickIncidentMgmtCreatedLnkXpath))), timeout.timeoutInMilis);
	element(by.xpath(this.clickIncidentMgmtCreatedLnkXpath)).click().then(function(){
		logger.info("Created Link clicked from Incident Management");
	});
}

/**
 * Method to click on Parvasive management created in mini card
 */
dashboard.prototype.clickParvasiveMgmt = function() {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.xpath(this.clickParvasiveLnkXpath))), timeout.timeoutInMilis);
	element(by.xpath(this.clickParvasiveLnkXpath)).click().then(function(){
		logger.info("Link clicked from Parvasive Management");
	});
}



/**
 * Method to click on Problem management created in mini card
 */
dashboard.prototype.clickProblemMgmt = function() {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.xpath(this.clickProblemCreatedLnkXpath))), timeout.timeoutInMilis);
	element(by.xpath(this.clickProblemCreatedLnkXpath)).click().then(function(){
		logger.info("Link clicked from Problem Management");
	});
}



/**
 * Method to click on Sunrise Report card created in mini card
 */
dashboard.prototype.clickSunriseReport = function() {
	util.waitForAngular();
	browser.sleep(2000);
	browser.wait(EC.visibilityOf(element(by.xpath(this.sunriseReportCreatedXpath))), timeout.timeoutInMilis);
	element(by.xpath(this.sunriseReportCreatedXpath)).click().then(function(){
		logger.info("Link clicked from Sunrise Report card");
	});
}


/**
 * Method to get dashboard title
 */
dashboard.prototype.getDashboardTitleText = function() {
	var self = this;
	util.waitForAngular();
	browser.sleep(2000);
	browser.wait(EC.visibilityOf(element(by.xpath(this.dashboardTitleTextXpath))), timeout.timeoutInMilis);
	return element(by.xpath(this.dashboardTitleTextXpath)).getText().then(function (dashboardTitle) {
		logger.info("Dashboard title text is : " + dashboardTitle);
		return dashboardTitle;
	});
}

/**
 * Method to get Delivery Insight Card Row
 */
dashboard.prototype.getDeliveryInsightsCardRowText = function (index) {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.css(this.deliveryInsightsRowCss))), timeout.timeoutInMilis);
	return element.all(by.css(this.deliveryInsightsRowCss)).getText().then(async function(rowText){
		await logger.info("Delivery insights card row Text : ", rowText);
		return rowText;
	});
}

/*Delivery Insight Dashboard Title*/

dashboard.prototype.clickDeliveryInsightLink = function(dashboardName){
	util.waitForAngular();
	var xpathSelector = this.deliveryInsightDashboardXpath.format(dashboardName);
	browser.wait(EC.elementToBeClickable(element(by.xpath(xpathSelector))), timeout.timeoutInMilis);
	element(by.xpath(xpathSelector)).click().then(function(){
		logger.info("clicked on "+dashboardName+" link");
	});
}

/**
 * Method to select tab based on name on resolver group page
 */
dashboard.prototype.selectResolverGroupTabBasedOnName = async function (tabName) {
	util.waitForAngular();
	var TabXpath = this.resolverGroupTabXpath.format(tabName);
	browser.wait(EC.visibilityOf(element(by.xpath(TabXpath))), timeout.timeoutInMilis);
	browser.wait(EC.elementToBeClickable(element(by.xpath(TabXpath))), timeout.timeoutInMilis);
	return await element(by.xpath(TabXpath)).getText().then(async function (tabText) {
		await element(by.xpath(TabXpath)).click();
		logger.info("Clicked on tab : " + tabText);
		return tabText;
	});
}

/**
 * Method check if apply button is present on resolver group page
 */
dashboard.prototype.checkVisibilityOfApplyButton = async function () {
	var self = this;
	util.waitForAngular();

		return await browser.wait(EC.visibilityOf(element(by.xpath(self.applyResolverGroupSelectionButtonXpath))), timeout.timeoutInMilis).then(async function(){
			await browser.wait(EC.elementToBeClickable(element(by.xpath(self.applyResolverGroupSelectionButtonXpath))), timeout.timeoutInMilis);
			return element(by.xpath(self.applyResolverGroupSelectionButtonXpath)).getText().then(async function (buttonText) {
				logger.info("Button text : ", buttonText);
				logger.info("Apply button is present on the page");
				return true;
			});
		}).catch(function(err){
			logger.info("Apply button is not present on the page");
			return false
		})
}

/*
This method gives table data by index
e.g If you require first column data from any table , you can pass index parameter as 1, for 2nd column data as index paramter 2.
*/

dashboard.prototype.getTableColumnDataByIndex =async function(index){
	var self = this
	util.waitForAngular();
	var tableData = self.tableDataByIndex.format(index)
	browser.wait(EC.visibilityOf(element.all(by.css(tableData)).get(0)), timeout.timeoutInMilis);
	return await element.all(by.css(tableData)).getText().then(function (labelText) {
		logger.info("Associated table label: " + labelText)
		return labelText
	});
}


/*
This method to download template from self service
*/

dashboard.prototype.downloadTemplate =async function(download){
	var self = this;
	util.waitForAngular();
	var downloadTemplate = this.downloadTemplateXpath.format(download);
	browser.wait(EC.elementToBeClickable(element(by.xpath(self.downloadXpath))),timeout.timeoutInMilis);
	return await element(by.xpath(self.downloadXpath)).click().then(async function(){
		logger.info('download icon button is clicked');
		browser.wait(EC.visibilityOf(element(by.css(self.downloadTemplateCss))), timeout.timeoutInMilis);
		await element(by.css(self.downloadTemplateCss)).getText().then(async function () {
			await element(by.css(self.downloadTemplateCss)).click().then(async function () {
				logger.info('Template radio button is clicked' )
			})
		})
		browser.wait(EC.visibilityOf(element(by.xpath(downloadTemplate))), timeout.timeoutInMilis);
		await element(by.xpath(downloadTemplate)).click().then(async function () {
			logger.info('Export download is clicked ')
		})
		return true
	})
}

/*
This method is used to upload template from self service
*/

dashboard.prototype.uploadTemplate =async function(){
	var self = this;
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(self.uploadFileCss))), timeout.timeoutInMilis);
	return await element(by.css(self.uploadFileCss)).click().then(async function() {
		browser.wait(EC.visibilityOf(element(by.css(self.chooseFileCss))), timeout.timeoutInMilis);
		await element(by.css(self.chooseFileCss)).click().then(async function() {
			logger.info('Choose file is clicked')
		})
		
		await browser.actions().mouseMove(element.all(by.css(self.chooseRequestCss)).get(1)).click().perform().then(function () {
			logger.info('Inventory request is selected')
		})
		browser.wait(EC.visibilityOf(element(by.css(self.addFileCss))), timeout.timeoutInMilis);
		var pathFile = path.resolve("aiops_reports") + path.sep + dashboardTestData.selfServiceInventoryFileName;
		logger.info("File Location:",pathFile);
		await element(by.css(self.addFileCss)).sendKeys(pathFile).then(async function(){
			logger.info('File has been inserted')
			browser.wait(EC.visibilityOf(element.all(by.css(self.uploadFileCss)).get(0)), timeout.timeoutInMilis);
			await element.all(by.css(self.uploadFileCss)).get(2).click().then(async function() {
				logger.info('file has been uploaded')
			})
		})
		return true
	})
}
	

dashboard.prototype.selectTicketsInScopeCheckbox =async function(row){
	var self = this
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.css(self.ticketsInScopeCheckboxCss)).get(row)), timeout.timeoutInMilis);
	return await element.all(by.css(self.ticketsInScopeCheckboxCss)).getText().then(async function () {
		logger.info("Select checkbox at row " + row)
		await element.all(by.css(self.ticketsInScopeCheckboxCss)).get(row).click();
		return true
	});
}


/**
 * Method to click on apply button on resolver group page
 */
 dashboard.prototype.clickonApplyButton = async function () {
	var self = this;
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.xpath(self.applyResolverGroupSelectionButtonXpath))), timeout.timeoutInMilis);
	await element(by.xpath(self.applyResolverGroupSelectionButtonXpath)).getText().then(async function (buttonText) {
		await element(by.xpath(self.applyResolverGroupSelectionButtonXpath)).click();
		logger.info("Clicked on : ", buttonText);
	});
}

/**
 * Method to fetch total audit entry counts on resolver group page under Audit log tab
 */
 dashboard.prototype.getAuditLogCountDetails = async function () {
	var self = this;
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(self.totalAuditLogCountCss))), timeout.timeoutInMilis);
	return element(by.css(self.totalAuditLogCountCss)).getText().then(async function (logCountDetails) {
		logger.info("Audit log page details ", logCountDetails );
		return logCountDetails;
	});
}

/**
 * Method to get success message information on applying resolver group changes
 */
 dashboard.prototype.getResolverGroupChangeSuccessMessage = async function () {
	var self = this;
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(self.resolverGroupSuccessNotificationCss))), timeout.timeoutInMilis);
	return await element(by.css(self.resolverGroupSuccessNotificationCss)).getText().then(async function (message) {
		logger.info("Success message on submitting change ", message );
		await element(by.xpath(self.successNotificationCloseIconXpath)).click();
		logger.info("Closed notification popup" );
		return message;
	});
}


/**
 * Method to check last updated date timezone
 */
dashboard.prototype.verifyLastUpdatedTimeZone = function () {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.xpath(this.lastUpdatedTimestampXpath))), timeout.timeoutInMilis);
	return element(by.xpath(this.lastUpdatedTimestampXpath)).getText().then(function (dateTime) {
		return dateTime.split(" ").pop()
	  })
  }

/**
* Method to fetch timezone based on the system/server origin
*/
dashboard.prototype.fetchCurrentTimeZone = async function () {
	var expectedTimezone = new Date().toTimeString().split('(')[1].split(')')[0];
	logger.info("Expected Timezone : " + expectedTimezone);
	switch (expectedTimezone) {
		case 'India Standard Time':
			expectedTimezone = 'IST'
			return expectedTimezone;
		case 'Coordinated Universal Time':
			expectedTimezone = 'UTC'
			return expectedTimezone;
		case 'Central European Standard Time':
			expectedTimezone = 'CEST'
			return expectedTimezone;
		case 'Greenwich Mean Time':
			expectedTimezone = 'GMT'
			return expectedTimezone;
		default:
			break;
	}

}

  
/**
 * Method to check format of last updated date on chrome to be M/DD/YYYY or MM/DD/YYYY
 */
dashboard.prototype.validateDateFormat = function () {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.xpath(this.lastUpdatedTimestampXpath))), timeout.timeoutInMilis);
	return element(by.xpath(this.lastUpdatedTimestampXpath)).getText().then(function (lu_time) {
		var temp = lu_time.split("updated:");
		var temp2 = (temp[1].trim()).split(" ");
		var dateString = (temp2[0].trim()).split(" ");
		dateString = dateString.toString();
		logger.info("Date : " + dateString);

		let dateformat = /^(0?[1-9]|1[0-2])[\/](0?[1-9]|[1-2][0-9]|3[01])[\/]\d{4}$/;

		// Match the date format through regular expression      
		if (dateString.match(dateformat)) {
			let operator = dateString.split('/');

			// Extract the string into month, date and year      
			let datepart = [];
			if (operator.length > 1) {
				datepart = dateString.split('/');
			}
			let month = parseInt(datepart[0]);
			let day = parseInt(datepart[1]);
			let year = parseInt(datepart[2]);

			// Create list of days of a month      
			let ListofDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
			if (month == 1 || month > 2) {
				if (day > ListofDays[month - 1]) {
					///This check is for Confirming that the date is not out of its range      
					return false;
				}
			} else if (month == 2) {
				let leapYear = false;
				if ((!(year % 4) && year % 100) || !(year % 400)) {
					leapYear = true;
				}
				if ((leapYear == false) && (day >= 29)) {
					return false;
				} else
					if ((leapYear == true) && (day > 29)) {
						logger.info('Invalid date format!');
						return false;
					}
			}
		} else {
			logger.info("Invalid date format!");
			return false;
		}
		return true;

	});
}

/*
 * Method to get the self service header text
 */

dashboard.prototype.getSelfServiceHeaderText = async function () {
	browser.waitForAngular();
	var self = this;
	browser.wait(EC.visibilityOf(element(by.css(self.selfServiceHeaderCss))), timeout.timeoutInMilis);
	return await element(by.css(self.selfServiceHeaderCss)).getText().then(async function (selfServiceHeaderText) {
		logger.info('Self service header is ' + selfServiceHeaderText)
		return selfServiceHeaderText
	})
}

/* method to get row items of a table 
*/
dashboard.prototype.totalRowItemsOnTable =async function(){
	var self = this;
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.css(self.totalItemsCountCss)).get(0)), timeout.timeoutInMilis);
	return await element.all(by.css(self.totalItemsCountCss)).get(0).getText().then(async function (totalCount) {
		logger.info('Total count is ' + totalCount )
		return Number(totalCount.split('of')[1].split(" ")[1])
	});
}

/*
Method to navigate each page of the table and add row items and return total row items of the table
*/

dashboard.prototype.totalRowItemsOfAllPages =async function(index,totalPages){
	var self = this;
	var totalRowItems = 0,rowItems = 0, totalEntries = 0;
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(self.paginationDetailsTextCss))), timeout.timeoutInMilis);
	await element(by.css(self.paginationDetailsTextCss)).getText().then(function(paginationInfo){
		var pageInfo = paginationInfo.trim().split(" ");
		totalEntries = parseInt(pageInfo[2]);
		logger.info('total entries are ' + totalEntries);
	})
	for(var count=0;count<totalPages;count++){
		(count === totalPages - 1) && browser.sleep(2000)
		rowItems = await this.clickOnItemsPerPageAndGetRowCount(index,count,totalPages)
		logger.info('Row items is ' + rowItems + 'Total pages are ' + totalPages)
		totalRowItems = totalRowItems + rowItems
		logger.info('Total row items is ',totalRowItems)
		if(count !== totalPages - 1){
			await this.clickOnPagesByIndex(count+1)
		}
	}
	logger.info('Total row items are ' + totalRowItems)
	return totalRowItems;
}

/*
Method click on Items per page and get total row items of the particular page
*/ 

dashboard.prototype.clickOnItemsPerPageAndGetRowCount = async function (size,countNum,totalPages) {
	browser.waitForAngular();
	var count;
	if (size == 0){
		count = 10
	}else if(size == 4){
		count = 50
	}
	var self = this;
	browser.wait(EC.visibilityOf(element.all(by.css(self.clickCss)).get(0)), timeout.timeoutInMilis);
	util.scrollToWebElement(element.all(by.css(self.clickCss)).get(0));
	await browser.actions().mouseMove(element.all(by.css(self.clickCss)).get(0)).click().perform()
	browser.wait(EC.visibilityOf(element(by.css(self.optionCss))), timeout.timeoutInMilis);
	return await element.all(by.css(self.optionCss)).get(size).click().then(async function () {
		if(countNum === totalPages - 1){
			browser.sleep(1000)
		}
		logger.info("Selected Items Per Page as " + count + " in List view");
		return await element.all(by.css(self.applicationResourceTableRowCss)).count().then(function (rowCount) {
			if (rowCount) {
				logger.info("Number of rows in List view: " + rowCount);
				return rowCount;
			} else {
				logger.info("No rows found in List view: " + rowCount);
				return "No Data";
			}
		});
	});
}

/*
Method to click on pages by index , if you pass index as 2 , 2nd page on table will be navigated
*/

dashboard.prototype.clickOnPagesByIndex =async function(index){
	var self = this;
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(self.paginationDisplayCss))), timeout.timeoutInMilis);
	return await element(by.css(self.paginationDisplayCss)).click().then(async function () {
		browser.wait(EC.visibilityOf(element.all(by.css(self.clickOnPageCss)).get(0)), timeout.timeoutInMilis);
		await element.all(by.css(self.clickOnPageCss)).get(index).click();
	});
}

/*
Method to click on table header inorder to sort the table
*/

dashboard.prototype.clickOnTableHeader =async function(){
	var self = this;
	util.waitForAngular();
	browser.wait(EC.elementToBeClickable(element.all(by.css(self.clickResolverGroupTableHeaderCss)).get(0)), timeout.timeoutInMilis);
	await element.all(by.css(self.clickResolverGroupTableHeaderCss)).get(1).click().then(async function () {
		browser.wait(EC.elementToBeClickable(element.all(by.css(self.clickHeaderCss)).get(0)), timeout.timeoutInMilis);
		await element.all(by.css(self.clickHeaderCss)).get(1).click().then(async function () {
		logger.info('Table header is clicked inorder to sort the table')
		})
	})
}

/*
Method to check whether sorting on a table is working on asc
*/

dashboard.prototype.checkTableSortForNumType =async function(numberOfTickets){
	var sortedBool = true;
	for(var i=0; i< numberOfTickets.length; i++ ){
		if (numberOfTickets[i] > numberOfTickets[i+1]) {
			sortedBool = false;
			break;
		}
	}
	return sortedBool
}

/*
Method to check when alert count is zero , no alerts message should be displayed
*/

dashboard.prototype.getNoAlertsMessage = async function(){
	var self = this;
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(self.healthyMessageCss))), timeout.timeoutInMilis);
	return await element(by.css(self.healthyMessageCss)).getText().then(async function (healthyMessageText) {
		browser.wait(EC.visibilityOf(element(by.css(self.noAlertsTextMessageCss))), timeout.timeoutInMilis);
		return await element(by.css(self.noAlertsTextMessageCss)).getText().then(async function (noAlertMessageText) {
			logger.info(healthyMessageText + ' ' +noAlertMessageText)
			return noAlertMessageText;
		})
	})
} 

/*
Method to get sunrise ticket count from dashboard page
*/

dashboard.prototype.getSunriseTicketCountOnDashboard = async function(){
	var self = this;
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.css(self.sunriseTicketsCountCss)).get(0)), timeout.timeoutInMilis);
	return await element.all(by.css(self.sunriseTicketsCountCss)).getText().then(async function (sunriseTicketCount) {
		logger.info('Daily Sunrise report count is '+ sunriseTicketCount )
		return sunriseTicketCount;
	})
}

/*
Method to check if the ticket count has double hyphen or not , returns true if the value doesn't have hyphen
*/ 
	
dashboard.prototype.checkVisibilityOfHyphen = async function(ticketCount){
	var bool = true;
	var count;
	for(var i=0; i<ticketCount.length;i++){
		count = ticketCount[i].toString()
		if(count === '--'){
			bool=false;
			break;
		}
	}
	return bool
}

/*
Method to return cards from api and cards from dashboard
*/

dashboard.prototype.evaluateApiCardsAndDashboardCards = async function(tenantEdition , tenantCards,dashboardCardNames,itOpsManager,aiopsAdminBool,deliveryExecutiveBool){
	var self = this;
	util.waitForAngular();
	var tenantEditionCards = []
	logger.info('Tenant edition is ' + tenantEdition)
	Object.values(tenantCards).forEach((card)=>tenantEditionCards.push(card.split('_ID')[0].split('_').join(' ')))
	var organizedTenantEditionCards = []
	tenantEditionCards.forEach((card)=>{
		if(card === dashboardTestData.monitoringVisibility){
			organizedTenantEditionCards.push(dashboardTestData.monitoringAndVisibility)
		}else{
			if(card === dashboardTestData.serviceability || card === dashboardTestData.serverLifecycleManagement){
				return 
			}
			return organizedTenantEditionCards.push(card)
		} 
	})
	browser.wait(EC.visibilityOf(element(by.css(self.sunriseHeaderCss))), timeout.timeoutInMilis);
	await element(by.css(self.sunriseHeaderCss)).getText().then(async function (sunriseCardHeader) {
		logger.info('Fetched Header is '+ sunriseCardHeader )
		if(sunriseCardHeader === dashboardTestData.dailySunriseReport){
			dashboardCardNames.push(dashboardTestData.sunrise)
		}
	})
	var positionMonitoringAndVisibility = organizedTenantEditionCards.indexOf(dashboardTestData.monitoringAndVisibility)
	if(organizedTenantEditionCards.indexOf(dashboardTestData.crossAccount) > 0){
        var crossAccountCardPosition = organizedTenantEditionCards.indexOf(dashboardTestData.crossAccount)
        organizedTenantEditionCards.splice(crossAccountCardPosition,1)
        organizedTenantEditionCards.push(dashboardTestData.crossAccountInsights)
    }
	if(!aiopsAdminBool){
		organizedTenantEditionCards.splice(positionMonitoringAndVisibility,1)
	}else{
		var position = dashboardCardNames.indexOf(dashboardTestData.adminCardName)
		dashboardCardNames.splice(position,1)
	}

	if(dashboardCardNames.indexOf(dashboardTestData.crossAccountInsights)>0){
		var positionCrossInsightCard = organizedTenantEditionCards.indexOf((dashboardTestData.crossAccountCardName))
		organizedTenantEditionCards.splice(positionCrossInsightCard, 1)
		organizedTenantEditionCards.push(dashboardTestData.crossAccountInsights)
	}

	dashboardCardNames.indexOf(dashboardTestData.bringYourOwnDashboardCard)>0 && dashboardCardNames.splice(dashboardCardNames.indexOf((dashboardTestData.bringYourOwnDashboardCard)),1)
	organizedTenantEditionCards.indexOf(dashboardTestData.extensibilityInsights)>0 && organizedTenantEditionCards.splice(organizedTenantEditionCards.indexOf((dashboardTestData.extensibilityInsights)),1)

	if(!deliveryExecutiveBool){
		var positionCrossInsightCard = organizedTenantEditionCards.indexOf(dashboardTestData.crossAccountCardName)
		organizedTenantEditionCards.splice(positionCrossInsightCard, 1)
	}

	// below if condition will be removed once mainframe insight card is available on dashboard. Currently API call retriving mainframe insight card.
	if(organizedTenantEditionCards.indexOf(dashboardTestData.mainframeInsights) >= 0){
		var positionMainframeInsights = organizedTenantEditionCards.indexOf(dashboardTestData.mainframeInsights);
		organizedTenantEditionCards.splice(positionMainframeInsights, 1);
	}

	// below if condition will be removed once Security Compliance insight card is available on dashboard. Currently API call retriving Security Compliance insight card.
	if(organizedTenantEditionCards.indexOf(dashboardTestData.securityComplianceInsights) >= 0){
		var positionSecurityComplianceInsights = organizedTenantEditionCards.indexOf(dashboardTestData.securityComplianceInsights);
		organizedTenantEditionCards.splice(positionSecurityComplianceInsights, 1);
	}

	if(organizedTenantEditionCards.indexOf(dashboardTestData.resiliencyInsights) >= 0){
		var positionResiliencyInsights = organizedTenantEditionCards.indexOf(dashboardTestData.resiliencyInsights);
		organizedTenantEditionCards.splice(positionResiliencyInsights, 1);
	}

	if(organizedTenantEditionCards.indexOf(dashboardTestData.networkAnalytics) >= 0){
		var positionNetworkAnalytics = organizedTenantEditionCards.indexOf(dashboardTestData.networkAnalytics);
		organizedTenantEditionCards.splice(positionNetworkAnalytics, 1);
	}

	if(organizedTenantEditionCards.indexOf(dashboardTestData.health) >= 0){
		var positionHealth = organizedTenantEditionCards.indexOf(dashboardTestData.health);
		organizedTenantEditionCards.splice(positionHealth, 1);
		organizedTenantEditionCards.push(dashboardTestData.resourceHealth)
	}

	var cardsFromApiData = organizedTenantEditionCards.map((card)=>card.toLowerCase()).sort()
	var dashboardCards =  dashboardCardNames.map((card)=>card.toLowerCase()).sort()
	logger.info('Cards fetched from API is '+ cardsFromApiData)
	logger.info('Cards fetched from dashboard is ' + dashboardCards)
	return [cardsFromApiData,dashboardCards];
}

/*
*
Method to get DSR sub section header on dashboard page
*/


dashboard.prototype.getDsrSubSectionHeader = async function(){
	var self = this;
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.css(self.dailySunriseCardSubHeadersCss)).get(0)), timeout.timeoutInMilis);
	return await element.all(by.css(self.dailySunriseCardSubHeadersCss)).getText().then(async function (headerText) {
		logger.info('Daily Sunrise report headers are  '+ headerText )
		return headerText;
	})
}

/*
*
Method to get priority Count on DSR - Dashboard page
*/


dashboard.prototype.getPriorityCountOnDSR = async function(headerName,type){
	var self = this;
	util.waitForAngular();
	var DailySunrisePriorityCount = self.dailySunrisePriorityCountXpath.format(headerName);
	logger.info('Daily sunrise priority Count is ' + DailySunrisePriorityCount)
	browser.wait(EC.visibilityOf(element.all(by.xpath(DailySunrisePriorityCount)).get(0)), timeout.timeoutInMilis);
	return await element.all(by.xpath(DailySunrisePriorityCount)).getText().then(async function (priorityCount) {
		logger.info( type +' priority Count is '+ priorityCount )
		return priorityCount;
	})
}

/*
*
Method to click view details on DSR from dashboard page
*/

dashboard.prototype.clickOnDSRViewDetails = async function(headerName,type){
	var self = this;
	util.waitForAngular();
	var DailySunriseReportViewDetails = self.dailySunriseReportViewDetailsXpath.format(headerName);
	browser.wait(EC.visibilityOf(element.all(by.css(self.dailySunriseCardSubHeadersCss)).get(0)), timeout.timeoutInMilis);
	browser.wait(EC.elementToBeClickable(element(by.xpath(DailySunriseReportViewDetails))), timeout.timeoutInMilis);
	await browser.actions().mouseMove(element(by.xpath(DailySunriseReportViewDetails))).click().perform().then(function () {
		logger.info('Clicked on ' + type)
	})
}

/*
*
Method to get Formatted  DSR priority count for Incident 
*/

dashboard.prototype.getFormattedDSRPriorityCountonIncident = async function(incidentPriorityCount){
	var priorityValues = {
		created:{},
		resolved:{}
	}

	incidentPriorityCount.forEach((val,index)=>{
		if(index < 5){
			priorityValues.created[`P${index + 1}`] = val
		}else{
			priorityValues.resolved[`P${index - 4}`] = val
		}
	   })
	return priorityValues
}

/*
*
Method to get Formatted  DSR priority count for Problem 
*/

dashboard.prototype.getFormattedDSRPriorityCountonProblem = async function(problemPriorityCount){
	var priorityValues = {
		created:{},
		closed:{},
		rcaComplete:{}
	}

	problemPriorityCount.forEach((val,index)=>{
		if(index < 4){
			priorityValues.created[`P${index + 1}`] = val
		}else if (index > 3 && index < 8){
			priorityValues.closed[`P${index - 3}`] = val
		}else{
			priorityValues.rcaComplete[`P${index - 7}`] = val
		}
	   })
	return priorityValues
}

/*
*
Method to get Formatted DSR count for Service Request 
*/

dashboard.prototype.getFormattedDsrServiceRequestCount= async function(serviceRequestPriorityCount){
	var priorityValues = {
		initiated:{},
		fullfilled:{}
	}

	serviceRequestPriorityCount.forEach((val,index)=>{
		if(index < 4){
			priorityValues.initiated[`P${index + 1}`] = val
		}else{
			priorityValues.fullfilled[`P${index - 3}`] = val
		}
	   })
	return priorityValues
}

/*
*
Method to get Formatted DSR count for Change Request 
*/

dashboard.prototype.getFormattedDsrChangeRequestCount= async function(serviceRequestPriorityCount){
	var priorityValues = {
		expedited:{},
		emergency:{}
	}

	serviceRequestPriorityCount.forEach((val,index)=>{
		if(index < 2){
			index < 1 ? priorityValues.expedited[`created`] = val : priorityValues.expedited[`implemented`] = val
		}else {
			index < 3 ? priorityValues.emergency[`created`] = val : priorityValues.emergency[`implemented`] = val
		}
	   })
	 return priorityValues
}

/*
*
Method to get health Assessment label on cross account insight page
*/
dashboard.prototype.getITHealthAssessmentLabelText = function () {
	var self = this;
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(self.healthAssessmentLabelCss))), timeout.timeoutInMilis);
	return element(by.css(self.healthAssessmentLabelCss)).getText().then(function (healthAssessmentText) {
		logger.info("Header fetched is : " + healthAssessmentText);
		return healthAssessmentText
	});
}

/**
 * method to click on links under Cross Account Insights categories
 */

dashboard.prototype.clickOnCrossAccountInsightCategories = async function(serviceName) {
	var self = this;
	util.waitForAngular();
	var healthAssessment = self.healthAssessmentLinkXpath.format(serviceName);
	browser.wait(EC.elementToBeClickable(element.all(by.xpath(healthAssessment)).get(0)), timeout.timeoutInMilis)
	await element.all(by.xpath(healthAssessment)).get(1).click().then(function(){
		logger.info('Clicked on ' , serviceName);
	})
}

/**
 * Method to get month & year section tab based on input provided
 */
dashboard.prototype.getMonthAndYearTabText = function(index){
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.css(this.monthYearTabCss)).get(index)), timeout.timeoutInMilis);
	return element.all(by.css(this.monthYearTabCss)).get(index).getText().then(function(monthYearText){
		logger.info("Clicked on Cross Insights card month and year text : "+monthYearText);
		return monthYearText;
	});
};

/**
 * Method to get tickets in scope header title
 */
dashboard.prototype.getTicketsInScopeHeader = function(headers){
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.ticketInScopeHeaderCss))), timeout.timeoutInMilis);
	return element(by.css(this.ticketInScopeHeaderCss)).getText().then(function(scopeHeader){
		return headers.push(scopeHeader);
	});
};

/**
 * Method to get legand names from dashboard for Bar chart and Donut chart
 */
dashboard.prototype.getLegendNamesForDonutAndBarChart =async function(cardName){
	var self = this;
	util.waitForAngular();
	var legendNames = self.legendNamesDashboardCss.format(cardName);
	browser.wait(EC.visibilityOf(element.all(by.css(legendNames)).get(0)), timeout.timeoutInMilis);
	return await element.all(by.css(legendNames)).getText().then(function (legendNames) {
		logger.info('Legend names are ' + legendNames);
		return legendNames;
	})
};

/**
 * Method to get legand names from dashboard for Bar chart and column chart - e.g health , inventory , incident , change and problem
 */
dashboard.prototype.getTicketCountForIndividualCard =async function(cardName){
	var ticketsCount = [];
	var self = this;
	util.waitForAngular();
	var ticketCount = self.getTicketCountCss.format(cardName);
	browser.wait(EC.visibilityOf(element.all(by.css(ticketCount)).get(0)), timeout.timeoutInMilis);
	return await element.all(by.css(ticketCount)).getAttribute("aria-label").then(function (ticketCount) {
		ticketCount.map((data)=>data.split(',').map((data)=>ticketsCount.push(data)));
		var count = ticketsCount.filter((data)=>data.indexOf('%') === -1);
		logger.info('Tickets count is ' + count);
		return count.map((data)=>Number(data));
	})
};

/**
 * Method to switch graphical view from donut to Chart column
 */

dashboard.prototype.switchToChartColumn =async function(cardName){
	var self = this;
	util.waitForAngular();
	var chartIcon = self.chartColumnXpath.format(cardName);
	browser.wait(EC.visibilityOf(element.all(by.css(this.dailySunriseCardSubHeadersCss)).get(0)), timeout.timeoutInMilis);
	browser.wait(EC.elementToBeClickable(element(by.xpath(chartIcon))), timeout.timeoutInMilis);
	await element(by.xpath(chartIcon)).click().then(function () {
		logger.info('Switched to Chart column graph');
	})
};


dashboard.prototype.selectLegendBasedOnCard =async function(cardName,index){
    var legendText = [] ,legendCheckbox = [] , bool = true;
    var self = this;
    util.waitForAngular();
    legendText = self.legendNamesDashboardCss.format(cardName);
	legendCheckbox = self.legendCheckboxCss.format(cardName);
	var totalBarGraph = self.totalBarCss.format(cardName);
	var smBarGraph = self.smCardBarCss.format(cardName);
	browser.wait(EC.visibilityOf(element.all(by.css(self.dailySunriseCardSubHeadersCss)).get(0)), timeout.timeoutInMilis);
	browser.wait(EC.visibilityOf(element.all(by.css(legendText)).get(0)), timeout.timeoutInMilis);
	var totalLegends = await element.all(by.css(legendText)).getText();
	logger.info('Available legends are ' + totalLegends)
    browser.wait(EC.visibilityOf(element.all(by.css(legendCheckbox)).get(0)), timeout.timeoutInMilis);

	for(var i=0; i< totalLegends.length ; i++){
		let count ;
		await element.all(by.css(legendCheckbox)).get(i).click();
		if(index == 0){
			browser.wait(EC.visibilityOf(element(by.css(totalBarGraph))), timeout.timeoutInMilis);
			await element.all(by.css(totalBarGraph)).count().then((value)=>{
				count = value;
			}).catch(async ()=>{
				await element(by.css(totalBarGraph)).getAttribute('role');
				count = 1;
			})
			await element(by.css(legendCheckbox)).click();
			if(count != 1){
				bool = false;
				break;
			}
		}else{
			browser.wait(EC.visibilityOf(element(by.css(smBarGraph))), timeout.timeoutInMilis);
			await element.all(by.css(smBarGraph)).count().then((value)=>{
				count = value;
			}).catch(async ()=>{
				await element(by.css(smBarGraph)).getAttribute('role');
				count = 3;
			})
			await element(by.css(legendCheckbox)).click();
			if(count != 3){
				bool = false;
				break;
			}
		}
        
    }
    return bool;
};

module.exports = dashboard;