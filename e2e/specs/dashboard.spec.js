/**
 * Created by : Pushpraj
 * created on : 12/02/2020
 */

"use strict";

var logGenerator = require("../../helpers/logGenerator.js"),
    logger = logGenerator.getApplicationLogger(),
	dashboardPage = require('../pageObjects/dashboard.pageObject.js'),
	launchpadPage = require('../pageObjects/launchpad.pageObject.js'),
	healthPage = require('../pageObjects/health.pageObject.js'),
	inventory = require('../pageObjects/inventory.pageObject.js'),
    actionableInsight = require('../pageObjects/actionable_insights.pageObject.js'),
    pervasiveInsight = require('../pageObjects/pervasive_insights.pageObject.js'),
    incidentManagement = require('../pageObjects/incident_management.pageObject.js'),
    problemManagement = require('../pageObjects/problem_management.pageObject.js'),
    changeManagement = require('../pageObjects/change_management.pageObject.js'),
    sunrise_report = require('../pageObjects/sunrise_report.pageObject.js'),
	userAccess = require("../pageObjects/user_access.pageObject.js"),
	appUrls = require('../../testData/appUrls.json'),
	launchpadTestData = require('../../testData/cards/launchpadTestData.json'),
	dashboardTestData = require('../../testData/cards/dashboardTestData.json'),
	healthTestData = require('../../testData/cards/healthTestData.json'),
    inventoryTestData = require('../../testData/cards/inventoryTestData.json'),
    actionableInsightTestData = require('../../testData/cards/actionableInsightsTestData.json'),
    pervasiveInsightTestData = require('../../testData/cards/pervasiveInsightsTestData.json'),
    incidentManagementTestData = require('../../testData/cards/incidentManagementTestData.json'),
    problemManagementTestData = require('../../testData/cards/problemManagementTestData.json'),
    changeManagementTestData = require('../../testData/cards/changeManagementTestData.json'),
    sunriseReportTestData = require('../../testData/cards/sunriseReportTestData.json'),
    dashboardApiUtil = require('../../helpers/dashboardApiUtil.js'),
	dashboardApiTestData = require('../../testData/cards/dashboardAPITestData.json'),
	frames = require('../../testData/frames.json'),
	expected_values = require('../../expected_values.json'),
	dashboard_expected_values = require('../../testData/expected_value/dashboard_expected_values.json'),
	healthAndInventoryUtil = require("../../helpers/healthAndInventoryUtil.js"),
	util = require('../../helpers/util.js');
var applicationUrl = browser.params.url;
var serviceMgmtUtil = require('../../helpers/serviceMgmtUtil.js');
describe('Dashboard Test Suite: ', function() {
	var dashboardObj, launchpadObj, healthObj, inventoryObj, actionableInsightObj, pervasiveInsightObj, incidentManagementObj, problemManagementObj,
    changeManagementObj, sunrise_reportObj , user_accessObj;
	var expected_valuesObj, dashboard_expected_valuesObj;

	beforeAll(function() {
		dashboardObj = new dashboardPage();
		launchpadObj = new launchpadPage();
		healthObj = new healthPage();
        inventoryObj = new inventory();
        actionableInsightObj = new actionableInsight();
        pervasiveInsightObj = new pervasiveInsight();
        incidentManagementObj = new incidentManagement();
        problemManagementObj = new problemManagement();
        changeManagementObj = new changeManagement();
        sunrise_reportObj = new sunrise_report();
		user_accessObj = new userAccess();
        expected_valuesObj = JSON.parse(JSON.stringify(expected_values));
        dashboard_expected_valuesObj = JSON.parse(JSON.stringify(dashboard_expected_values));
	});	

	beforeEach(function() {
		launchpadObj.open();
		expect(launchpadObj.getWelcomeMessageTxt()).toEqual(launchpadTestData.welcome);
		launchpadObj.clickOnHamburgerMenu(launchpadTestData.leftNavigationExpanded);
        launchpadObj.clickOnleftNavigationMenuBasedOnName(launchpadTestData.aIOpsIntelligentITOperationsBtn);
        expect(launchpadObj.isCardDisplayedOnLeftNavigation(launchpadTestData.dashboardCard)).toBe(true);
        launchpadObj.clickLeftNavCardBasedOnName(launchpadTestData.dashboardCard);
		dashboardObj.open();
	});

	it('Verify available cards on dashboard page', function() { 
		expect(dashboardObj.getAllAvialableCardsNameFromDashboard()).toContain(dashboardTestData.dailySunriseReport);
		expect(dashboardObj.getAllAvialableCardsNameFromDashboard()).toContain(dashboardTestData.alerts);
		expect(dashboardObj.getAllAvialableCardsNameFromDashboard()).toContain(dashboardTestData.resourceHealth);
		expect(dashboardObj.getAllAvialableCardsNameFromDashboard()).toContain(dashboardTestData.inventory);
		expect(dashboardObj.getAllAvialableCardsNameFromDashboard()).toContain(dashboardTestData.actionableInsights);
		expect(dashboardObj.getAllAvialableCardsNameFromDashboard()).toContain(dashboardTestData.pervasiveInsights);
		expect(dashboardObj.getAllAvialableCardsNameFromDashboard()).toContain(dashboardTestData.incidentManagement);
		expect(dashboardObj.getAllAvialableCardsNameFromDashboard()).toContain(dashboardTestData.problemManagement);
		expect(dashboardObj.getAllAvialableCardsNameFromDashboard()).toContain(dashboardTestData.changeManagement);
	});

	it('Compare Alerts total count, No. of alert rows on Alerts card and Critical+Warning count on Health card', async function() {
		var totalAlertCount = await dashboardObj.getAlertsTotalCount();
		var rowCnt = await dashboardObj.getAlertsRowCount();
		expect(totalAlertCount).toEqual(rowCnt);
		expect(totalAlertCount).toBeLessThanOrEqual(dashboardObj.getTotalAlertsCountFromHealthCard());
		var object = await dashboardApiUtil.getAlertsCardDetails(0);
		expect(totalAlertCount).toEqual(object["count"]);
		expect(rowCnt).toEqual(object["count"]);
	});

	it('Verify that the alert items from Alerts card are clickable or not', async function(){
	   //verify alert presence
	    var rowCnt = await dashboardObj.getAlertsRowCount();
	    expect(rowCnt).toBeGreaterThanOrEqual(0);
		//Retrieve alert and match against alert header page
		if(rowCnt > 0){
			var alertName=await dashboardObj.retrieveFirstAlert();
			await dashboardObj.clickOnFirstAlertFromAlertsCard();
			expect(alertName).toContain(dashboardObj.retrieveAlertHeader());
		}
	});


	it('verify aiops admin role user is able to see admin card on dashboard page', async function() {
		var aiopsAdminBool = await user_accessObj.verifyUserHasAiopsAdminrole(dashboardTestData.aiopsAdmin,dashboardTestData.oneIndex);
		await launchpadObj.open();
		await launchpadObj.clickOnHamburgerMenu(launchpadTestData.leftNavigationExpanded);
		await launchpadObj.clickOnleftNavigationMenuBasedOnName(launchpadTestData.aIOpsIntelligentITOperationsBtn);
		await launchpadObj.isCardDisplayedOnLeftNavigation(launchpadTestData.dashboardCard);
		await launchpadObj.clickLeftNavCardBasedOnName(launchpadTestData.dashboardCard);
		await dashboardObj.open();
		if(aiopsAdminBool){
		expect(await dashboardObj.getAllCardsNameFromDashboard(dashboardTestData.adminCardName)).toContain(dashboardTestData.adminCardName)
		await dashboardObj.clickOnAdminConsoleCategories(dashboardTestData.selfServiceName);
		await dashboardObj.getAuditLogHeaderText()
		}else{
			await expect(await dashboardObj.getAllCardsNameFromDashboard(dashboardTestData.adminCardName)).not.toContain(dashboardTestData.adminCardName);
		}
	});

	it('Verify that the alert are displaying in descending order', async function(){
		util.waitForAngular();
		var alertLength = await dashboardObj.getAlertsTotalCount();
		if(alertLength>0)
		{
			var alerts = await dashboardObj.getAlertsTimestamp();
			var sortedAlerts = await util.sortArrayList(alerts,"descending","numeric")
	         expect(alerts).toEqual(sortedAlerts);
		}
	});

	it('Verify that the associated resource header and count is displaying', async function(){
		var alertBool = false;
		alertBool= await dashboardObj.clickOnFirstAlertFromAlertsCard();
		if(alertBool === true){
		util.waitForAngular();
		expect(await healthObj.getAssociatedResourcesTableLabelText()).toEqual(healthTestData.associatedResourcesTableText);
		expect(await healthObj.getResourceCountFromAssociatedResourcesTableLabel()).toEqual(await healthObj.getRowCountFromAssociatedResourcesAppsTable());
		}
	});

	it('Verify that the right parameter is displaying in alert overview section', async function(){
		var alertBool = false;
		alertBool= await dashboardObj.clickOnFirstAlertFromAlertsCard();
		if(alertBool === true){
		util.waitForAngular();
		expect(await dashboardObj.getAllAvailableParameterNameFromAlert()).toContain(healthTestData.OverviewApplicationCategory);
		expect(await dashboardObj.getAllAvailableParameterNameFromAlert()).toContain(healthTestData.OverviewImpactedResources);
		expect(await dashboardObj.getAllAvailableParameterNameFromAlert()).toContain(healthTestData.provider);
		expect(await dashboardObj.getAllAvailableParameterNameFromAlert()).toContain(healthTestData.environment);
		expect(await dashboardObj.getAllAvailableParameterNameFromAlert()).toContain(healthTestData.team);
		}
	});
    it('Verify that associated resource is downloadable as csv and json and match the count againast table rows count', async function () {
		var alertBool = false;
		alertBool = await dashboardObj.clickOnFirstAlertFromAlertsCard();
		if(alertBool === true){
		// Download Associated resources as csv and json file
		var jsonFileDownload = await healthAndInventoryUtil.downloadAssociatedResourcesJSON();
		var csvFileDownload =  await healthAndInventoryUtil.downloadAssociatedResourcesCSV();
		if(csvFileDownload == true && jsonFileDownload == true)
		{
			// Verify if the downloaded file exists or not
			expect(util.isTicketDetailsFileExists()).toBe(true);
			var associated_resources_csv_count = await util.getCsvFileRowCount();
			var associated_resources_json_count=await util.getTicketCountFromJsonData();
			//verify number of record in csv and json file matches with number of records in table
			expect(associated_resources_csv_count).toEqual(healthObj.getRowCountFromAssociatedResourcesAppsTable());
			expect(associated_resources_json_count).toEqual(healthObj.getRowCountFromAssociatedResourcesAppsTable());
		}
	}
	});
	it('Verify that user is able to search and verify the right columns in the associated resource table', async function () {
		var totalAlertCount = await dashboardObj.getAlertsTotalCount()
		if(totalAlertCount >0){
			var firstAlertEventName = await dashboardObj.getFirstAlertEventName();
			await dashboardObj.clickOnFirstAlertFromAlertsCard();
			await expect(inventoryObj.isTableSearchBarDisplayed()).toBe(true);
			//Search validation
			await inventoryObj.searchTable(firstAlertEventName);
	    	await expect(healthObj.getResourceCountFromAssociatedResourcesTableLabel()).toEqual(await healthObj.getRowCountFromAssociatedResourcesAppsTable());
	    	//Associated table columns presence checks
	    	await expect(healthObj.getAssociatedColumnPresence()).toBe(true);
		}
	});

    it('Verify that upon clicking on health breadcrumb from alerts, system is navigating to health dashboard', async function () {
		var alertBool = false;
		alertBool = await dashboardObj.clickOnFirstAlertFromAlertsCard();
		if(alertBool === true){
	        //Click on Health breadcrumb
	        healthAndInventoryUtil.clickOnBreadcrumbLink(healthTestData.breadcrumbApplication);
			expect(healthObj.getHealthHeaderTitleText()).toEqual(healthTestData.headerTitle);
		}
	});

	it('Verify that upon clicking on Aiops console breadcrumb from alerts, system is navigating to Aiops landing page', async function () {
		var alertBool = false;
		alertBool = await dashboardObj.clickOnFirstAlertFromAlertsCard();
		if(alertBool === true){
	        //Click on AIops Console breadcrumb
	        healthAndInventoryUtil.clickOnBreadcrumbLink(dashboardTestData.dashboardBreadCrumb);
			expect(util.getCurrentURL()).toMatch(appUrls.dashboardPageUrl);
		}
	});

	it('Verify that critical alerts count is same on Dashboard and Health page donut chart', async function(){
		var count = await dashboardObj.getCriticalAlertsCountFromHealthCard();
		if(count != 0){	
			await dashboardObj.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.resourceHealth);
			util.switchToDefault();
			await healthAndInventoryUtil.clickOnProviderCheckBox(healthTestData.ibmDCProviderFilterText);
			await healthAndInventoryUtil.clickOnProviderCheckBox(healthTestData.myDCPublicFilterText);
			expect(await healthObj.applyGlobalFilter()).toEqual(true);
			await healthObj.clickOnCriticalSliceFromDonutChart();
			expect(healthObj.getSelectedTypeCountFromDonutChart()).toEqual(count);
			if(browser.params.dataValiadtion){
				logger.info("------data validation------");
				var healthCriticalCount =  dashboard_expected_valuesObj.health.business_applications.critical;
				expect(healthObj.getSelectedTypeCountFromDonutChart()).toEqual(healthCriticalCount);
			}
		}
	});

	it('Verify that warning alerts count is same on Dashboard and Health page donut chart', async function(){
		var count = await dashboardObj.getWarningAlertsCountFromHealthCard();
		if(count != 0){
			await dashboardObj.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.resourceHealth);
			var warningCount = await dashboardApiUtil.getHealthCardDetails(dashboardApiTestData.convergedHealth, dashboardApiTestData.warning)
			expect(warningCount).toEqual(count);
			if(browser.params.dataValiadtion){
				logger.info("------data validation------");
				var healthWarningCount =  dashboard_expected_valuesObj.health.business_applications.warning;
				expect(healthObj.getSelectedTypeCountFromDonutChart()).toEqual(healthWarningCount);
			}
		}
	});

	// Disabled because of Protractor limitation [Not able to automate donut chart]
	
	// it('Verify that healthy alerts count is same on Dashboard and Health page donut chart', async function(){
	// 	var count = await dashboardObj.getHealthyAlertsCountFromHealthCard();		
	// 	dashboardObj.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.health);
	// 	healthObj.open();
	// 	var status = await healthObj.selectAlertTypeFromDropdown(dashboardTestData.healthyAlertName);
	// 	if(status != 0){
	// 		expect(healthObj.getCountFromDonutChart()).toEqual(count);
	// 		if(browser.params.dataValiadtion){
	// 			logger.info("------data validation------");
	// 			var healthHealthyCount =  dashboard_expected_valuesObj.health.business_applications.healthy;
	// 			expect(healthObj.getCountFromDonutChart()).toEqual(healthHealthyCount);
	// 		}
	// 	}	
	// });
	
	it('Verify health card count from dashboard API', async function() { 
		await dashboardObj.clickOnMiniViewIcon();
		expect(await dashboardApiUtil.getHealthCardDetails(dashboardApiTestData.convergedHealth, dashboardApiTestData.critical))
		.toEqual(await dashboardObj.getTextFromMiniViewCard(dashboardTestData.resourceHealth, dashboardTestData.criticalAlertName));
		expect(await dashboardApiUtil.getHealthCardDetails(dashboardApiTestData.convergedHealth, dashboardApiTestData.warning))
		.toEqual(await dashboardObj.getTextFromMiniViewCard(dashboardTestData.resourceHealth, dashboardTestData.warningAlertName));
		expect(await dashboardApiUtil.getHealthCardDetails(dashboardApiTestData.convergedHealth, dashboardApiTestData.healthy))
		.toEqual(await dashboardObj.getTextFromMiniViewCard(dashboardTestData.resourceHealth, dashboardTestData.healthyAlertName));
		await dashboardObj.clickOnLargeViewIcon();
		expect(await dashboardApiUtil.getHealthCardDetails(dashboardApiTestData.convergedOpenTicket, dashboardApiTestData.high))
		.toEqual(await dashboardObj.getTextFromMiniViewCard(dashboardTestData.resourceHealth, dashboardTestData.highPriority));
		expect(await dashboardApiUtil.getHealthCardDetails(dashboardApiTestData.convergedOpenTicket, dashboardApiTestData.medium))
		.toEqual(await dashboardObj.getTextFromMiniViewCard(dashboardTestData.resourceHealth, dashboardTestData.mediumPriority));
		expect(await dashboardApiUtil.getHealthCardDetails(dashboardApiTestData.convergedOpenTicket, dashboardApiTestData.low))
		.toEqual(await dashboardObj.getTextFromMiniViewCard(dashboardTestData.resourceHealth, dashboardTestData.lowPriority));
	});
	
	it('Verify no data available message is not present', function() { 
		expect(dashboardObj.isNoDataAvailableTextPresent(launchpadTestData.inventoryCard)).toBe(false);
		expect(dashboardObj.isNoDataAvailableTextPresent(launchpadTestData.pervasiveInsightsCard)).toBe(false);
		expect(dashboardObj.isNoDataAvailableTextPresent(dashboardTestData.resourceHealth)).toBe(false);
		expect(dashboardObj.isNoDataAvailableTextPresent(launchpadTestData.incidentManagementCard)).toBe(false);
		expect(dashboardObj.isNoDataAvailableTextPresent(launchpadTestData.problemManagementCard)).toBe(false);
		expect(dashboardObj.isNoDataAvailableTextPresent(launchpadTestData.changeManagementCard)).toBe(false);
		expect(dashboardObj.isNoDataAvailableTextPresent(launchpadTestData.actionableInsightsCard)).toBe(false);
		expect(dashboardObj.isNoDataAvailableTextPresent(dashboardTestData.alerts)).toBe(false);
	});
	
	it('Verify connection failure message is not present', function() { 
		expect(dashboardObj.isConnectionFailureTextPresent(launchpadTestData.inventoryCard)).toBe(false);
		expect(dashboardObj.isConnectionFailureTextPresent(launchpadTestData.pervasiveInsightsCard)).toBe(false);
		expect(dashboardObj.isConnectionFailureTextPresent(dashboardTestData.resourceHealth)).toBe(false);
		expect(dashboardObj.isConnectionFailureTextPresent(launchpadTestData.incidentManagementCard)).toBe(false);
		expect(dashboardObj.isConnectionFailureTextPresent(launchpadTestData.problemManagementCard)).toBe(false);
		expect(dashboardObj.isConnectionFailureTextPresent(launchpadTestData.changeManagementCard)).toBe(false);
		expect(dashboardObj.isConnectionFailureTextPresent(launchpadTestData.actionableInsightsCard)).toBe(false);
		expect(dashboardObj.isConnectionFailureTextPresent(dashboardTestData.alerts)).toBe(false);
	});
	
	it('verify able to click on View Details link for health card from dashboard page, navigation url and header title', function() { 
		dashboardObj.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.resourceHealth);
        expect(healthObj.getHealthHeaderTitleText()).toEqual(healthTestData.headerTitle);
        expect(util.getCurrentURL()).toEqual(applicationUrl + appUrls.healthPageUrl);
    });
	
	it('verify able to click on View Details link for Inventory card from dashboard page, navigation url and header title', function() { 
		dashboardObj.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.inventory);
        expect(inventoryObj.getInventoryHeaderTitleText()).toEqual(inventoryTestData.headerTitle);
        expect(util.getCurrentURL()).toEqual(applicationUrl + appUrls.inventoryPageUrl);
    });
	
	it('verify able to click on View Details link for Actionable Insights card from dashboard page, navigation url and header title', function() { 
		dashboardObj.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.actionableInsights);
		actionableInsightObj.open();
        expect(util.getHeaderTitleText()).toEqual(actionableInsightTestData.headerTitle);
        expect(util.getCurrentURL()).toEqual(applicationUrl + appUrls.actionableInsightPageUrl);
	});
	
	it("Verify count of total insights ticket from Actionable Insights card should match with sum of the count from different categories on AI Landing page", async function(){
		var countFromTitleText = await dashboardObj.getCardTitleCount(dashboardTestData.actionableInsights);
		if(countFromTitleText != 0){
			await dashboardObj.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.actionableInsights);
			await actionableInsightObj.open();
			await util.waitOnlyForInvisibilityOfKibanaDataLoader();
			util.switchToFrameById(frames.cssrIFrame);
			util.waitForAngular();
			expect(await actionableInsightObj.getTotalInsightsCategoriesCount()).toEqual(countFromTitleText);
		}
	})
	
	it('verify able to click on View Details link for Pervasive Insights card from dashboard page, navigation url and header title', function() { 
		dashboardObj.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.pervasiveInsights);
		pervasiveInsightObj.open();
        expect(util.getHeaderTitleText()).toEqual(pervasiveInsightTestData.headerTitle);
        expect(util.getCurrentURL()).toEqual(applicationUrl + appUrls.pervasiveInsightPageUrl);
    });
	
	it('verify able to click on View Details link for Incident Management card from dashboard page, navigation url and header title', function() { 
		dashboardObj.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.incidentManagement);
		incidentManagementObj.open();
        expect(util.getHeaderTitleText()).toEqual(incidentManagementTestData.headerTitle);
        expect(util.getCurrentURL()).toEqual(applicationUrl + appUrls.incidentManagementPageUrl);
    });
	
	it('verify able to click on View Details link for Problem Management card from dashboard page, navigation url and header title', function() { 
		dashboardObj.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.problemManagement);
		problemManagementObj.open();
        expect(util.getHeaderTitleText()).toEqual(problemManagementTestData.headerTitle);
        expect(util.getCurrentURL()).toEqual(applicationUrl + appUrls.problemManagementPageUrl);
    });
			
	it('verify able to click on View Details link for Change Management card from dashboard page, navigation url and header title', function() { 
		dashboardObj.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.changeManagement);
        changeManagementObj.open();
        expect(util.getHeaderTitleText()).toEqual(changeManagementTestData.headerTitle);
        expect(util.getCurrentURL()).toEqual(applicationUrl + appUrls.changeManagementPageUrl);
    });

/* Sunrise is modified as per BCM-4885 and automation is in progress
	it('verify able to click on daily sunrise report card from dashboard page, navigation url and header title', function() { 
		dashboardObj.clickOnDailySunRiseReportCard(dashboardTestData.p1Tickets, dashboardTestData.created);
		sunrise_reportObj.open();
		expect(util.getCurrentURL()).toEqual(applicationUrl + appUrls.sunriseReportPageUrl);
		util.switchToDefault();
		util.switchToFrameById(frames.mcmpIframe);
        expect(util.getHeaderTitleText()).toEqual(sunriseReportTestData.headerTitle);
    });
	
	it('Verify daily sunrise report card is displaying data', function() { 
		expect(dashboardObj.getTextFromDailySunRiseReportCard(dashboardTestData.p1Tickets, dashboardTestData.created)).toEqual(jasmine.any(Number));
		expect(dashboardObj.getTextFromDailySunRiseReportCard(dashboardTestData.p1Tickets, dashboardTestData.resolved)).toEqual(jasmine.any(Number));
		expect(dashboardObj.getTextFromDailySunRiseReportCard(dashboardTestData.p2Tickets, dashboardTestData.created)).toEqual(jasmine.any(Number));
		expect(dashboardObj.getTextFromDailySunRiseReportCard(dashboardTestData.p2Tickets, dashboardTestData.resolved)).toEqual(jasmine.any(Number));
		expect(dashboardObj.getTextFromDailySunRiseReportCard(dashboardTestData.p3Tickets, dashboardTestData.created)).toEqual(jasmine.any(Number));
		expect(dashboardObj.getTextFromDailySunRiseReportCard(dashboardTestData.p3Tickets, dashboardTestData.resolved)).toEqual(jasmine.any(Number));
    });
	
	it('Verify daily sunrise report card data from dashboard sunriseReportCard api', async function() { 
		expect(dashboardObj.getTextFromDailySunRiseReportCard(dashboardTestData.p1Tickets, dashboardTestData.created))
		.toEqual(await dashboardApiUtil.getSunRiseReportCardDetails(dashboardApiTestData.p1Tickets, dashboardApiTestData.created));
		expect(dashboardObj.getTextFromDailySunRiseReportCard(dashboardTestData.p1Tickets, dashboardTestData.resolved))
		.toEqual(await dashboardApiUtil.getSunRiseReportCardDetails(dashboardApiTestData.p1Tickets, dashboardApiTestData.resolved));
		expect(dashboardObj.getTextFromDailySunRiseReportCard(dashboardTestData.p2Tickets, dashboardTestData.created))
		.toEqual(await dashboardApiUtil.getSunRiseReportCardDetails(dashboardApiTestData.p2Tickets, dashboardApiTestData.created));
		expect(dashboardObj.getTextFromDailySunRiseReportCard(dashboardTestData.p2Tickets, dashboardTestData.resolved))
		.toEqual(await dashboardApiUtil.getSunRiseReportCardDetails(dashboardApiTestData.p2Tickets, dashboardApiTestData.resolved));
		expect(dashboardObj.getTextFromDailySunRiseReportCard(dashboardTestData.p3Tickets, dashboardTestData.created))
		.toEqual(await dashboardApiUtil.getSunRiseReportCardDetails(dashboardApiTestData.p3Tickets, dashboardApiTestData.created));
		expect(dashboardObj.getTextFromDailySunRiseReportCard(dashboardTestData.p3Tickets, dashboardTestData.resolved))
		.toEqual(await dashboardApiUtil.getSunRiseReportCardDetails(dashboardApiTestData.p3Tickets, dashboardApiTestData.resolved));
    }); */
	
	it('Verify inventory card data count for MC and DC is displayed in inventory page', async function() { 
		dashboardObj.clickOnMiniViewIcon();
		var dcCount = await dashboardObj.getTextFromMiniViewCard(dashboardTestData.inventory, dashboardTestData.dataCenter);
		expect(dcCount).toEqual(await dashboardApiUtil.getInventoryCardDetails(dashboardApiTestData.dataCenter));
		var mcCount = await dashboardObj.getTextFromMiniViewCard(dashboardTestData.inventory, dashboardTestData.multiCloud);
		expect(mcCount).toEqual(await dashboardApiUtil.getInventoryCardDetails(dashboardApiTestData.multiCloud));
		var totalInventoryCount = dcCount + mcCount;
		await dashboardObj.clickOnLargeViewIcon();
		await dashboardObj.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.inventory);
		await util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		expect(util.isSelectedTabButton(inventoryTestData.resourcesButtonName)).toEqual(true);
		expect(totalInventoryCount).toEqual(await inventoryObj.getApplicationOrResourcesTableHeaderTextCount());
    });
	
	it('Verify incident management api data should be a number [zero or greater than zero] for created and resolved tickets', async function() {
		var twoMonthsPreviousDate = util.getPreviousMonthYearDate(2);
		var createdTicketsCount1 = await dashboardApiUtil.getIncidentManagementCardDetails(dashboardApiTestData.created, twoMonthsPreviousDate);
		expect(createdTicketsCount1).toBeGreaterThanOrEqual(0);
		expect(createdTicketsCount1).toEqual(jasmine.any(Number));
		var resolvedticketsCount1 = await dashboardApiUtil.getIncidentManagementCardDetails(dashboardApiTestData.resolved, twoMonthsPreviousDate);
		expect(resolvedticketsCount1).toBeGreaterThanOrEqual(0);
		expect(resolvedticketsCount1).toEqual(jasmine.any(Number));
		var oneMonthPreviousDate = util.getPreviousMonthYearDate(1);
		var createdTicketsCount2 = await dashboardApiUtil.getIncidentManagementCardDetails(dashboardApiTestData.created, oneMonthPreviousDate);
		expect(createdTicketsCount2).toBeGreaterThanOrEqual(0);
		expect(createdTicketsCount2).toEqual(jasmine.any(Number));
		var resolvedticketsCount2 = await dashboardApiUtil.getIncidentManagementCardDetails(dashboardApiTestData.resolved, oneMonthPreviousDate);
		expect(resolvedticketsCount2).toBeGreaterThanOrEqual(0);
		expect(resolvedticketsCount2).toEqual(jasmine.any(Number));
		// Not necessary data will be present for current month
		var currentMonthDate = util.getPreviousMonthYearDate(0);
		var createdTicketsCount3 = await dashboardApiUtil.getIncidentManagementCardDetails(dashboardApiTestData.created, currentMonthDate);
		expect(createdTicketsCount3).toBeGreaterThanOrEqual(0);
		expect(createdTicketsCount3).toEqual(jasmine.any(Number));
		var resolvedticketsCount3 = await dashboardApiUtil.getIncidentManagementCardDetails(dashboardApiTestData.resolved, currentMonthDate);
		expect(resolvedticketsCount3).toBeGreaterThanOrEqual(0);
		expect(resolvedticketsCount3).toEqual(jasmine.any(Number));
	});
	
	it('Verify problem management api data should be a number [zero or greater than zero] for created and resolved tickets', async function() {
		var twoMonthsPreviousDate = util.getPreviousMonthYearDate(2);
		var createdTicketsCount1 = await dashboardApiUtil.getProblemManagementCardDetails(dashboardApiTestData.created, twoMonthsPreviousDate);
		expect(createdTicketsCount1).toBeGreaterThanOrEqual(0);
		expect(createdTicketsCount1).toEqual(jasmine.any(Number));
		var resolvedticketsCount1 = await dashboardApiUtil.getProblemManagementCardDetails(dashboardApiTestData.resolved, twoMonthsPreviousDate);
		expect(resolvedticketsCount1).toBeGreaterThanOrEqual(0);
		expect(resolvedticketsCount1).toEqual(jasmine.any(Number));
		var oneMonthPreviousDate = util.getPreviousMonthYearDate(1);
		var createdTicketsCount2 = await dashboardApiUtil.getProblemManagementCardDetails(dashboardApiTestData.created, oneMonthPreviousDate);
		expect(createdTicketsCount2).toBeGreaterThanOrEqual(0);
		expect(createdTicketsCount2).toEqual(jasmine.any(Number));
		var resolvedticketsCount2 = await dashboardApiUtil.getProblemManagementCardDetails(dashboardApiTestData.resolved, oneMonthPreviousDate);
		expect(resolvedticketsCount2).toBeGreaterThanOrEqual(0);
		expect(resolvedticketsCount2).toEqual(jasmine.any(Number));
		//Not necessary data will be present for current month
		var currentMonthDate = util.getPreviousMonthYearDate(0);
		var createdTicketsCount3 = await dashboardApiUtil.getProblemManagementCardDetails(dashboardApiTestData.created, currentMonthDate);
		expect(createdTicketsCount3).toBeGreaterThanOrEqual(0);
		expect(createdTicketsCount3).toEqual(jasmine.any(Number));
		var resolvedticketsCount3 = await dashboardApiUtil.getProblemManagementCardDetails(dashboardApiTestData.resolved, currentMonthDate);
		expect(resolvedticketsCount3).toBeGreaterThanOrEqual(0);
		expect(resolvedticketsCount3).toEqual(jasmine.any(Number));
	});
	
	it('Verify change management api data should be a number [zero or greater than zero] for created and implemented tickets', async function() {
		var twoMonthsPreviousDate = util.getPreviousMonthYearDate(2);
		var createdTicketsCount1 = await dashboardApiUtil.getChangeManagementCardDetails(dashboardApiTestData.created, twoMonthsPreviousDate)
		expect(createdTicketsCount1).toBeGreaterThanOrEqual(0);
		expect(createdTicketsCount1).toEqual(jasmine.any(Number));
		var resolvedticketsCount1 = await dashboardApiUtil.getChangeManagementCardDetails(dashboardApiTestData.resolved, twoMonthsPreviousDate)
		expect(resolvedticketsCount1).toBeGreaterThanOrEqual(0);
		expect(resolvedticketsCount1).toEqual(jasmine.any(Number));
		var oneMonthPreviousDate = util.getPreviousMonthYearDate(1);
		var createdTicketsCount2 = await dashboardApiUtil.getChangeManagementCardDetails(dashboardApiTestData.created, oneMonthPreviousDate)
		expect(createdTicketsCount2).toBeGreaterThanOrEqual(0);
		expect(createdTicketsCount2).toEqual(jasmine.any(Number));
		var resolvedticketsCount2 = await dashboardApiUtil.getChangeManagementCardDetails(dashboardApiTestData.resolved, oneMonthPreviousDate)
		expect(resolvedticketsCount2).toBeGreaterThanOrEqual(0);
		expect(resolvedticketsCount2).toEqual(jasmine.any(Number));
		//Not necessary data will be present for current month
		var currentMonthDate = util.getPreviousMonthYearDate(0);
		var createdTicketsCount3 = await dashboardApiUtil.getChangeManagementCardDetails(dashboardApiTestData.created, currentMonthDate)
		expect(createdTicketsCount3).toBeGreaterThanOrEqual(0);
		expect(createdTicketsCount3).toEqual(jasmine.any(Number));
		var resolvedticketsCount3 = await dashboardApiUtil.getChangeManagementCardDetails(dashboardApiTestData.resolved, currentMonthDate)
		expect(resolvedticketsCount3).toBeGreaterThanOrEqual(0);
		expect(resolvedticketsCount3).toEqual(jasmine.any(Number));
	});
	
	it('Verify pervasive insights graph tickets count from api data', async function() {
		var serversName = await dashboardObj.getLegendNamesForDonutAndBarChart(dashboardTestData.pervasiveMain);
		var ticketsCount = await dashboardObj.getTicketCountForIndividualCard(dashboardTestData.pervasiveMain)
		expect(ticketsCount[0]).toEqual(await dashboardApiUtil.getPervasiveInsightsCardDetails(serversName[0]));
		expect(ticketsCount[1]).toEqual(await dashboardApiUtil.getPervasiveInsightsCardDetails(serversName[1]));
		expect(ticketsCount[2]).toEqual(await dashboardApiUtil.getPervasiveInsightsCardDetails(serversName[2]));
		expect(ticketsCount[3]).toEqual(await dashboardApiUtil.getPervasiveInsightsCardDetails(serversName[3]));
		expect(ticketsCount[4]).toEqual(await dashboardApiUtil.getPervasiveInsightsCardDetails(serversName[4]));
	});
	
	it('Verify actionable insights graph tickets count from api data', async function() {
		var object = await dashboardApiUtil.getActionableInsightsCardDetails(0);	
		await logger.info("count : ", object["count"]);
		expect(await dashboardObj.getCardTitleCount(dashboardTestData.actionableInsights)).toEqual(object["count"]);
		if(object["count"] != 0){
			expect(await dashboardObj.getActionableInsightsCardRowCount()).toEqual(object["count"]);
			expect(await dashboardObj.getActionableInsightsCardRowText(0)).toEqual(object["title"]);
		}
	});
	
	it('Verify component name Text is Present for Pervasive Insights, Incident Management, Change Management, Problem Management, Inventory, and Health', function () {
		expect(dashboardObj.getCardsDefinitionTextBasedOnCardName(dashboardTestData.pervasiveInsights)).toEqual(dashboardTestData.pervasiveCardComponentText);
		expect(dashboardObj.getCardsDefinitionTextBasedOnCardName(dashboardTestData.incidentManagement)).toEqual(dashboardTestData.incidentMangementCardComponentText);
		expect(dashboardObj.getCardsDefinitionTextBasedOnCardName(dashboardTestData.problemManagement)).toEqual(dashboardTestData.problemMangementCardComponentText);
		expect(dashboardObj.getCardsDefinitionTextBasedOnCardName(dashboardTestData.changeManagement)).toEqual(dashboardTestData.changeMangementCardComponentText);
		expect(dashboardObj.getCardsDefinitionTextBasedOnCardName(dashboardTestData.health)).toEqual(dashboardTestData.applicationsLabelText);
		expect(dashboardObj.getCardsDefinitionTextBasedOnCardName(dashboardTestData.inventory)).toContain(dashboardTestData.inventoryCardComponentText);

	});

	it('Verify all Key values of Incident Management, Change Management, Problem Management graphs are Present',async function () {
		expect(await dashboardObj.getLegendNamesForDonutAndBarChart(dashboardTestData.incidentMain)).toContain(dashboardTestData.ticketCreatedName);
		expect(await dashboardObj.getLegendNamesForDonutAndBarChart(dashboardTestData.incidentMain)).toContain(dashboardTestData.ticketResolvedName);
		expect(await dashboardObj.getLegendNamesForDonutAndBarChart(dashboardTestData.problemMain)).toContain(dashboardTestData.ticketCreatedName);
		expect(await dashboardObj.getLegendNamesForDonutAndBarChart(dashboardTestData.problemMain)).toContain(dashboardTestData.ticketResolvedName);
		expect(await dashboardObj.getLegendNamesForDonutAndBarChart(dashboardTestData.changeMain)).toContain(dashboardTestData.changeImplemented);
		expect(await dashboardObj.getLegendNamesForDonutAndBarChart(dashboardTestData.changeMain)).toContain(dashboardTestData.changeCreatedName);
		expect(await dashboardObj.getLegendNamesForDonutAndBarChart(dashboardTestData.healthMain)).toContain(dashboardTestData.health);
		expect(await dashboardObj.getLegendNamesForDonutAndBarChart(dashboardTestData.healthMain)).toContain(dashboardTestData.criticalAlertName);
		expect(await dashboardObj.getLegendNamesForDonutAndBarChart(dashboardTestData.healthMain)).toContain("warning");
	});

	it('Verify x-axis Label values are Present for last 3 months and y-axis Label Value start from 0 for Pervasive Insights, Incident Management, Change Management, Problem Management',async function () {
		var cardNameList = [dashboardTestData.incidentMain, dashboardTestData.problemMain, dashboardTestData.changeMain]
		expect(await dashboardObj.getCardYaxisFirstLabelTextBasedOnCardName(dashboardTestData.pervasiveMain)).toContain(dashboardTestData.firstYaxisLabelvalue);
		cardNameList.forEach(async function (cardName) {
			var xaxisLabelNames = await dashboardObj.getCardXaxisLabelsTextBasedOnCardName(cardName)
			expect(xaxisLabelNames).toContain(util.getPreviousMonthYearDate(2));
			expect(xaxisLabelNames).toContain(util.getPreviousMonthYearDate(1));
			expect(xaxisLabelNames).toContain(util.getPreviousMonthYearDate(0));
			expect(await dashboardObj.getCardXaxisLabelsCountTextBasedOnCardName(cardName)).toBe(dashboardTestData.previousMonthsLabelsCount);
			expect(await dashboardObj.getCardYaxisFirstLabelTextBasedOnCardName(cardName)).toBe(dashboardTestData.firstYaxisLabelvalue);
		});
	});

	/* There is not x-axios and y-axis title for new Dashboard design
	it('Verify x-axis and y-axis Title of bar graphs', function () {
		var cardNameList = [dashboardTestData.incidentManagement, dashboardTestData.problemManagement, dashboardTestData.changeManagement, dashboardTestData.pervasiveInsights]
		cardNameList.forEach(function (cardName) {
			expect(dashboardObj.getCardYaxisTitleTextBasedOnCardName(cardName)).toBe(dashboardTestData.yaxisTitle);
		});
		expect(dashboardObj.getCardXaxisTitleTextBasedOnCardName(dashboardTestData.pervasiveInsights)).toBe(dashboardTestData.pervasiveInsightsXaxisTitle);
		expect(dashboardObj.getCardXaxisTitleTextBasedOnCardName(dashboardTestData.changeManagement)).toBe(dashboardTestData.changeMgntXaxisTitle);
		expect(dashboardObj.getCardXaxisTitleTextBasedOnCardName(dashboardTestData.problemManagement)).toBe(dashboardTestData.problemMgntXaxisTitle);
		expect(dashboardObj.getCardXaxisTitleTextBasedOnCardName(dashboardTestData.incidentManagement)).toBe(dashboardTestData.IncidentMgntXaxisTitle);
	});
	*/

	it('Verify the color codes for bar graphs on incident management',async function(){
		expect(util.getCurrentURL()).toMatch(appUrls.dashboardPageUrl);
		expect(dashboardObj.getDashboardHeaderTitleText()).toEqual(dashboardTestData.headerTitle);
		// Verify color code for ticket created bar graphs
		expect(await dashboardObj.getColorCodeForBarGraph(dashboardTestData.incidentMain, inventoryTestData.zerothIndex,dashboardTestData.ticketCreatedName)).toEqual(dashboardTestData.ticketsCreatedColorCode);
		expect(await dashboardObj.getColorCodeForBarGraph(dashboardTestData.incidentMain, inventoryTestData.secondIndex,dashboardTestData.ticketCreatedName)).toEqual(dashboardTestData.ticketsCreatedColorCode);
		expect(await dashboardObj.getColorCodeForBarGraph(dashboardTestData.incidentMain, inventoryTestData.fourthIndex,dashboardTestData.ticketCreatedName)).toEqual(dashboardTestData.ticketsCreatedColorCode);
		// Verify color code for ticket resolved bar graphs
		expect(await dashboardObj.getColorCodeForBarGraph(dashboardTestData.incidentMain, inventoryTestData.firstIndex, dashboardTestData.ticketResolvedName)).toEqual(dashboardTestData.ticketsResolvedColorCode);
		expect(await dashboardObj.getColorCodeForBarGraph(dashboardTestData.incidentMain, inventoryTestData.thirdIndex, dashboardTestData.ticketResolvedName)).toEqual(dashboardTestData.ticketsResolvedColorCode);
		expect(await dashboardObj.getColorCodeForBarGraph(dashboardTestData.incidentMain, inventoryTestData.fifthIndex, dashboardTestData.ticketResolvedName)).toEqual(dashboardTestData.ticketsResolvedColorCode);
	});

	it('Verify the color codes for bar graphs on change management',async function(){
		expect(util.getCurrentURL()).toMatch(appUrls.dashboardPageUrl);
		expect(dashboardObj.getDashboardHeaderTitleText()).toEqual(dashboardTestData.headerTitle);
		// Verify color code for ticket created bar graphs
		expect(await dashboardObj.getColorCodeForBarGraph(dashboardTestData.changeMain, inventoryTestData.zerothIndex, dashboardTestData.ticketCreatedName)).toEqual(dashboardTestData.ticketsCreatedColorCode);
		expect(await dashboardObj.getColorCodeForBarGraph(dashboardTestData.changeMain, inventoryTestData.secondIndex, dashboardTestData.ticketCreatedName)).toEqual(dashboardTestData.ticketsCreatedColorCode);
		expect(await dashboardObj.getColorCodeForBarGraph(dashboardTestData.changeMain, inventoryTestData.fourthIndex, dashboardTestData.ticketCreatedName)).toEqual(dashboardTestData.ticketsCreatedColorCode);
		// Verify color code for ticket resolved bar graphs
		expect(await dashboardObj.getColorCodeForBarGraph(dashboardTestData.changeMain, inventoryTestData.firstIndex, dashboardTestData.ticketResolvedName)).toEqual(dashboardTestData.ticketsResolvedColorCode);
		expect(await dashboardObj.getColorCodeForBarGraph(dashboardTestData.changeMain, inventoryTestData.thirdIndex, dashboardTestData.ticketResolvedName)).toEqual(dashboardTestData.ticketsResolvedColorCode);
		expect(await dashboardObj.getColorCodeForBarGraph(dashboardTestData.changeMain, inventoryTestData.fifthIndex, dashboardTestData.ticketResolvedName)).toEqual(dashboardTestData.ticketsResolvedColorCode);
	});

	it('Verify the color codes for bar graphs on problem management',async function(){
		expect(util.getCurrentURL()).toMatch(appUrls.dashboardPageUrl);
		expect(dashboardObj.getDashboardHeaderTitleText()).toEqual(dashboardTestData.headerTitle);
		// Verify color code for ticket created bar graphs
		expect(await dashboardObj.getColorCodeForBarGraph(dashboardTestData.problemMain, inventoryTestData.zerothIndex, dashboardTestData.ticketCreatedName)).toEqual(dashboardTestData.ticketsCreatedColorCode);
		expect(await dashboardObj.getColorCodeForBarGraph(dashboardTestData.problemMain, inventoryTestData.secondIndex, dashboardTestData.ticketCreatedName)).toEqual(dashboardTestData.ticketsCreatedColorCode);
		expect(await dashboardObj.getColorCodeForBarGraph(dashboardTestData.problemMain, inventoryTestData.fourthIndex, dashboardTestData.ticketCreatedName)).toEqual(dashboardTestData.ticketsCreatedColorCode);
		// Verify color code for ticket resolved bar graphs
		expect(await dashboardObj.getColorCodeForBarGraph(dashboardTestData.problemMain, inventoryTestData.firstIndex, dashboardTestData.ticketResolvedName)).toEqual(dashboardTestData.ticketsResolvedColorCode);
		expect(await dashboardObj.getColorCodeForBarGraph(dashboardTestData.problemMain, inventoryTestData.thirdIndex, dashboardTestData.ticketResolvedName)).toEqual(dashboardTestData.ticketsResolvedColorCode);
		expect(await dashboardObj.getColorCodeForBarGraph(dashboardTestData.problemMain, inventoryTestData.fifthIndex, dashboardTestData.ticketResolvedName)).toEqual(dashboardTestData.ticketsResolvedColorCode);
	});

	it('verify user is able to verify account name and click on settings for customisation', async function() { 

		expect(await dashboardObj.getAccountNameText()).not.toEqual(null);
		dashboardObj.customiseButtonClick();
		expect(await dashboardObj.getSettingsCancelButtonText()).toEqual(dashboardTestData.cancelName);
		expect(await dashboardObj.getSettingsSaveButtonText()).toEqual(dashboardTestData.saveName);
		expect(await dashboardObj.getCardDisabled()).toEqual(dashboardTestData.cardDisabledMsg);
		dashboardObj.clickCancelButton();

	});

	it('verify user is able to apply customisation and save changes', async function() { 
		await dashboardObj.getAllAvialableCardsNameFromDashboard();
		dashboardObj.customiseButtonClick();
		dashboardObj.clickOnVisibilityIcon(dashboardTestData.resourceHealth);
		dashboardObj.clickSaveButton();
		expect(await dashboardObj.getCustomisationMessage()).toEqual(dashboardTestData.customizationMsg);
		expect(await dashboardObj.getAllAvialableCardsNameFromDashboard()).not.toContain(dashboardTestData.resourceHealth);
	});

	it('verify user is able to apply customisation and save changes again', async function() { 
		await dashboardObj.getAllAvialableCardsNameFromDashboard();
		dashboardObj.customiseButtonClick();
		dashboardObj.clickOnVisibilityIcon(dashboardTestData.resourceHealth);
		dashboardObj.clickSaveButton();
		expect(await dashboardObj.getCustomisationMessage()).toEqual(dashboardTestData.customizationMsg);
		expect(await dashboardObj.getAllAvialableCardsNameFromDashboard()).toContain(dashboardTestData.resourceHealth);
	});

	it('verify user is able to click change Management from mini card view', async function() { 
		dashboardObj.clickOnMiniViewIcon();
		dashboardObj.clickCreatedChangeMgmt();
		expect(await util.getHeaderTitleText()).toEqual(dashboardTestData.changeManagement);
		util.clickOnHeaderDashboardLink();
		expect(await dashboardObj.getDashboardTitleText()).toContain(dashboardTestData.headerTitle);
	});

	it('verify user is able to click incident Management from mini card view', async function() { 
		dashboardObj.clickOnMiniViewIcon();
		dashboardObj.clickCreatedIncidentMgmt();
		expect(await util.getHeaderTitleText()).toEqual(dashboardTestData.incidentManagement);
		util.clickOnHeaderDashboardLink();
		expect(await dashboardObj.getDashboardTitleText()).toContain(dashboardTestData.headerTitle);
	});

	it('verify user is able to click Parvasive Management from mini card view', async function() { 
		dashboardObj.clickOnMiniViewIcon();
		dashboardObj.clickParvasiveMgmt();
		expect(await util.getHeaderTitleText()).toEqual(dashboardTestData.pervasiveInsights);
		util.clickOnHeaderDashboardLink();
		expect(await dashboardObj.getDashboardTitleText()).toContain(dashboardTestData.headerTitle);
	});

	it('verify user is able to click Problem Management from mini card view', async function() { 
		dashboardObj.clickOnMiniViewIcon();
		dashboardObj.clickProblemMgmt();
		expect(await util.getHeaderTitleText()).toEqual(dashboardTestData.problemManagement);
		util.clickOnHeaderDashboardLink();
		expect(await dashboardObj.getDashboardTitleText()).toContain(dashboardTestData.headerTitle);
	});

/*   Sunrise is modified as per BCM-4885 and automation is in progress
	it('verify user is able to click Sunrise report from mini card view', async function() { 
		dashboardObj.clickOnMiniViewIcon();
		dashboardObj.clickSunriseReport();
		expect(await util.getHeaderTitleText()).toEqual(dashboardTestData.dailySunriseReport);
		util.clickOnHeaderDashboardLink();
		expect(await dashboardObj.getDashboardTitleText()).toContain(dashboardTestData.headerTitle);
	}); */

	it('verify if resolver group link is clickable on admin card on dashboard page and verify table headers for both tabs ', async function() {		
		await dashboardObj.clickOnAdminConsoleCategories(dashboardTestData.resolverGroupName);
		expect(await util.getHeaderTitleText()).toEqual(dashboardTestData.resolverGroupName);
		expect(await dashboardObj.selectResolverGroupTabBasedOnName(dashboardTestData.scopeOfTicketsTabName)).toBe(dashboardTestData.scopeOfTicketsTabName);
		var headers = await healthObj.getListViewHeaders();
		await dashboardObj.getTicketsInScopeHeader(headers);
		expect(headers).toEqual(dashboardTestData.scopeOfTicketsTabColumns);
		expect(await dashboardObj.selectTicketsInScopeCheckbox(1)).toBe(true);
		expect(dashboardObj.checkVisibilityOfApplyButton()).toBe(true);
		expect(await dashboardObj.selectResolverGroupTabBasedOnName(dashboardTestData.historyTabName)).toBe(dashboardTestData.historyTabName);
		headers = await healthObj.getListViewHeaders();
		expect(headers).toEqual(dashboardTestData.auditLogTabColumns);	
		expect(dashboardObj.checkVisibilityOfApplyButton()).toBe(false);
	});
	
	it('verify if audit entry is added under Audit LOg tab after selecting/deselecting resolver group', async function () {
		await dashboardObj.clickOnAdminConsoleCategories(dashboardTestData.resolverGroupName);
		await expect(await util.getHeaderTitleText()).toEqual(dashboardTestData.resolverGroupName);
		// Switch to audit logs tab and get the entry count
		await expect(await dashboardObj.selectResolverGroupTabBasedOnName(dashboardTestData.historyTabName)).toBe(dashboardTestData.historyTabName);
		var beforeChange = await dashboardObj.getAuditLogCountDetails();
		//Switch to scope of ticket tab and make
		await expect(await dashboardObj.selectResolverGroupTabBasedOnName(dashboardTestData.scopeOfTicketsTabName)).toBe(dashboardTestData.scopeOfTicketsTabName);
		await expect(await dashboardObj.selectTicketsInScopeCheckbox(1)).toBe(true);
		await dashboardObj.clickonApplyButton();
		//verify sccess message
		await expect(await dashboardObj.getResolverGroupChangeSuccessMessage()).toEqual(dashboardTestData.resolverGroupSuccessMessage);
		//Switch to Audit lgs tab and check for the audit log counts
		await expect(await dashboardObj.selectResolverGroupTabBasedOnName(dashboardTestData.historyTabName)).toBe(dashboardTestData.historyTabName);
		var afterChange = await dashboardObj.getAuditLogCountDetails();
		expect(beforeChange).not.toBe(afterChange);
		var firstfieldInTable = await dashboardObj.getTableColumnDataByIndex(1);
		await user_accessObj.clickSearchOnAiopsAdmin();
		await user_accessObj.searchOrgTeamUser(firstfieldInTable[0]);
		var statusOfTheFirstRecord = await dashboardObj.getTableColumnDataByIndex(6);
		expect(statusOfTheFirstRecord[0]).toEqual('In progress')
	
	});

	it('verify if search functionality works for scope of ticket tab and audit log tab', async function () {
		await dashboardObj.clickOnAdminConsoleCategories(dashboardTestData.resolverGroupName);
		expect(await util.getHeaderTitleText()).toEqual(dashboardTestData.resolverGroupName);
		expect(await dashboardObj.selectResolverGroupTabBasedOnName(dashboardTestData.scopeOfTicketsTabName)).toBe(dashboardTestData.scopeOfTicketsTabName);
		var firstNameInTable = await dashboardObj.getTableColumnDataByIndex(1);
		await user_accessObj.clickSearchOnAiopsAdmin();
		await user_accessObj.searchOrgTeamUser(firstNameInTable[0]);
		var firstNameInTableAfterSearch = await dashboardObj.getTableColumnDataByIndex(1);
		expect(firstNameInTableAfterSearch.indexOf(firstNameInTable[0]) >= 0).toBe(true);
		//Switch to Audit logs tab and search for text
		expect(await dashboardObj.selectResolverGroupTabBasedOnName(dashboardTestData.historyTabName)).toBe(dashboardTestData.historyTabName);
		firstNameInTable = await dashboardObj.getTableColumnDataByIndex(2);
		await user_accessObj.clickSearchOnAiopsAdmin();
		await user_accessObj.searchOrgTeamUser(firstNameInTable[0]);
		firstNameInTableAfterSearch = await dashboardObj.getTableColumnDataByIndex(2);
		expect(firstNameInTableAfterSearch.every((name)=>name.toLowerCase() === firstNameInTable[0].toLowerCase())).toBe(true)
	});

	it('verify aiops admin role user is able to see resolver group option under admin card on dashboard page and also verify the timezone , date format on redirecting to resolver group page', async function () {
		var aiopsAdminBool = await user_accessObj.verifyUserHasAiopsAdminrole(dashboardTestData.aiopsAdmin,dashboardTestData.oneIndex);
		await launchpadObj.open();
		await launchpadObj.clickOnHamburgerMenu(launchpadTestData.leftNavigationExpanded);
		await launchpadObj.clickOnleftNavigationMenuBasedOnName(launchpadTestData.aIOpsIntelligentITOperationsBtn);
		await launchpadObj.isCardDisplayedOnLeftNavigation(launchpadTestData.dashboardCard);
		await launchpadObj.clickLeftNavCardBasedOnName(launchpadTestData.dashboardCard);
		await dashboardObj.open();
		if (aiopsAdminBool) {
			await expect(await dashboardObj.getAllCardsNameFromDashboard(dashboardTestData.adminCardName)).toContain(dashboardTestData.adminCardName);
			await dashboardObj.clickOnAdminConsoleCategories(dashboardTestData.resolverGroupName);
			await expect(await util.getHeaderTitleText()).toEqual(dashboardTestData.resolverGroupName);
			await expect(dashboardObj.verifyLastUpdatedTimestampForITOps(dashboardTestData.hoursValue, dashboardTestData.hoursTimeUnit)).toBe(true);
			var timeZone = await await dashboardObj.verifyLastUpdatedTimeZone();
			var expectedTimezone = await dashboardObj.fetchCurrentTimeZone();
			await expect(timeZone).toBe(expectedTimezone)
			await expect(dashboardObj.validateDateFormat()).toBe(true);
		} else {
			await expect(await dashboardObj.getAllCardsNameFromDashboard(dashboardTestData.adminCardName)).not.toContain(dashboardTestData.adminCardName);
		}
	});
	it('verify if user details of the audit log added under Audit LOg tab after selecting/deselecting resolver group are correct', async function () {
		//Fetch the user details like name , email id
		var userDetails = await user_accessObj.getUserDetails();
		//Switch to Audit lgs tab and check for the audit log counts
		await launchpadObj.open();
		await launchpadObj.clickOnHamburgerMenu(launchpadTestData.leftNavigationExpanded);
		await launchpadObj.clickOnleftNavigationMenuBasedOnName(launchpadTestData.aIOpsIntelligentITOperationsBtn);
		await launchpadObj.isCardDisplayedOnLeftNavigation(launchpadTestData.dashboardCard);
		await launchpadObj.clickLeftNavCardBasedOnName(launchpadTestData.dashboardCard);
		await dashboardObj.open();
		//On resolver group page apply resolver group change  
		await dashboardObj.clickOnAdminConsoleCategories(dashboardTestData.resolverGroupName);
		await expect(await dashboardObj.selectTicketsInScopeCheckbox(1)).toBe(true);
		await dashboardObj.clickonApplyButton();
		await expect(await dashboardObj.getResolverGroupChangeSuccessMessage()).toEqual(dashboardTestData.resolverGroupSuccessMessage);
		//Switch to Audit lgs tab and check for the audit log user details - firstname , lastname and emailaddress
		await expect(await dashboardObj.selectResolverGroupTabBasedOnName(dashboardTestData.historyTabName)).toBe(dashboardTestData.historyTabName);
		var firstfieldInTable = await dashboardObj.getTableColumnDataByIndex(1);
		await user_accessObj.clickSearchOnAiopsAdmin();
		await user_accessObj.searchOrgTeamUser(firstfieldInTable[0]);
		var firstName = await dashboardObj.getTableColumnDataByIndex(2)
		var lastName = await dashboardObj.getTableColumnDataByIndex(3)
		var emailId = await dashboardObj.getTableColumnDataByIndex(4)
		await expect(firstName[0]).toBe(userDetails.userName.split(" ")[0])
		await expect(lastName[0]).toBe(userDetails.userName.split(" ")[1])
		await expect(emailId[0]).toBe(userDetails.emailAddress[0].split(',')[0])
	});

	it('Verify user is able to use pagination present at then end of the table for scope of service and Audit logs tabs', async function() {
		var aiopsAdminBool = await user_accessObj.verifyUserHasAiopsAdminrole(dashboardTestData.aiopsAdmin,dashboardTestData.oneIndex);
		await launchpadObj.open();
		await launchpadObj.clickOnHamburgerMenu(launchpadTestData.leftNavigationExpanded);
		await launchpadObj.clickOnleftNavigationMenuBasedOnName(launchpadTestData.aIOpsIntelligentITOperationsBtn);
		await launchpadObj.isCardDisplayedOnLeftNavigation(launchpadTestData.dashboardCard);
		await launchpadObj.clickLeftNavCardBasedOnName(launchpadTestData.dashboardCard);
		await dashboardObj.open();
		if (aiopsAdminBool) {
			await expect(await dashboardObj.getAllCardsNameFromDashboard(dashboardTestData.adminCardName)).toContain(dashboardTestData.adminCardName);
			await dashboardObj.clickOnAdminConsoleCategories(dashboardTestData.resolverGroupName);
			await expect(await util.getHeaderTitleText()).toEqual(dashboardTestData.resolverGroupName);
			// to get the table data of second column
			await dashboardObj.getTableColumnDataByIndex(1);
			// To get total number of pages on list view
			var totalNumberOfPages = await inventoryObj.getPageCountForAppsResourcesTable()
			var totalCount = await dashboardObj.totalRowItemsOnTable()
			await expect(dashboardObj.totalRowItemsOfAllPages(dashboardTestData.zerothIndex,totalNumberOfPages)).toEqual(totalCount);
		} else {
			await expect(await dashboardObj.getAllCardsNameFromDashboard(dashboardTestData.adminCardName)).not.toContain(dashboardTestData.adminCardName);
		}
	})

	it('Verify if data is sorted in ascending or descending order when clicked on respective column header', async function() {
		var aiopsAdminBool = await user_accessObj.verifyUserHasAiopsAdminrole(dashboardTestData.aiopsAdmin,dashboardTestData.oneIndex);
		await launchpadObj.open();
		await launchpadObj.clickOnHamburgerMenu(launchpadTestData.leftNavigationExpanded);
		await launchpadObj.clickOnleftNavigationMenuBasedOnName(launchpadTestData.aIOpsIntelligentITOperationsBtn);
		await launchpadObj.isCardDisplayedOnLeftNavigation(launchpadTestData.dashboardCard);
		await launchpadObj.clickLeftNavCardBasedOnName(launchpadTestData.dashboardCard);
		await dashboardObj.open();
		if (aiopsAdminBool) {
			await expect(await dashboardObj.getAllCardsNameFromDashboard(dashboardTestData.adminCardName)).toContain(dashboardTestData.adminCardName);
			await dashboardObj.clickOnAdminConsoleCategories(dashboardTestData.resolverGroupName);
			await expect(await util.getHeaderTitleText()).toEqual(dashboardTestData.resolverGroupName);
			await dashboardObj.getTableColumnDataByIndex(2);
			// click on table header to sort the table
			await dashboardObj.clickOnTableHeader()
			var numberOfTickets= await dashboardObj.getTableColumnDataByIndex(2);
			// to check whether the array is sorted from ascending to descending order
			await expect(await dashboardObj.checkTableSortForNumType(numberOfTickets)).toBe(true);
		} else {
			await expect(await dashboardObj.getAllCardsNameFromDashboard(dashboardTestData.adminCardName)).not.toContain(dashboardTestData.adminCardName);
		}
	})

	it('Verify appropriate message is displayed when alert count is zero on dashboard', async function() {
		var totalAlertCount = await dashboardObj.getAlertsTotalCount()
		// if the alert count is zero , message should be no alerts for your account
		if(totalAlertCount === 0){
			expect(dashboardObj.getNoAlertsMessage()).toEqual(dashboardTestData.noAlertsMessage);
		}
	})

	it('Verify tickets count on dashboard and list view on resolver group should not have double hyphen when the count is zero', async function() {
		await dashboardObj.clickOnMiniViewIcon();
		var criticalCount = await dashboardObj.getTextFromMiniViewCard(dashboardTestData.resourceHealth, dashboardTestData.criticalAlertName);
		var warningCount = await dashboardObj.getTextFromMiniViewCard(dashboardTestData.resourceHealth, dashboardTestData.warningAlertName);
		var healthyCount = await dashboardObj.getTextFromMiniViewCard(dashboardTestData.resourceHealth, dashboardTestData.healthyAlertName);
		await expect(await dashboardObj.checkVisibilityOfHyphen([criticalCount,warningCount,healthyCount])).toBe(true);
		//Get inventory count on dashboard
		var inventoryCount = await dashboardObj.getItemInventoryCount(healthTestData.mc,healthTestData.dc);
		await dashboardObj.clickOnLargeViewIcon();
		await expect(await dashboardObj.checkVisibilityOfHyphen([inventoryCount])).toBe(true)
		var aiopsAdminBool = await user_accessObj.verifyUserHasAiopsAdminrole(dashboardTestData.aiopsAdmin,dashboardTestData.oneIndex);
		await launchpadObj.open();
		await launchpadObj.clickOnHamburgerMenu(launchpadTestData.leftNavigationExpanded);
		await launchpadObj.clickOnleftNavigationMenuBasedOnName(launchpadTestData.aIOpsIntelligentITOperationsBtn);
		await launchpadObj.isCardDisplayedOnLeftNavigation(launchpadTestData.dashboardCard);
		await launchpadObj.clickLeftNavCardBasedOnName(launchpadTestData.dashboardCard);
		await dashboardObj.open();
		if (aiopsAdminBool) {
			await expect(await dashboardObj.getAllCardsNameFromDashboard(dashboardTestData.adminCardName)).toContain(dashboardTestData.adminCardName);
			await dashboardObj.clickOnAdminConsoleCategories(dashboardTestData.resolverGroupName);
			await expect(await util.getHeaderTitleText()).toEqual(dashboardTestData.resolverGroupName);
			await dashboardObj.getTableColumnDataByIndex(2);
			// click on table header to sort the table
			await dashboardObj.clickOnTableHeader()
			var numberOfTickets= await dashboardObj.getTableColumnDataByIndex(2);
			await expect(await dashboardObj.checkVisibilityOfHyphen(numberOfTickets)).toBe(true)
		}else{
			await expect(await dashboardObj.getAllCardsNameFromDashboard(dashboardTestData.adminCardName)).not.toContain(dashboardTestData.adminCardName);
		}
	})

	it('Verify api response is matching with the cards available on dasboard for the respective tenant edition', async function() {
		var tenantEdition = await dashboardApiUtil.getTenantEdition();
		var aiopsAdminBool = await user_accessObj.verifyUserHasAiopsAdminrole(dashboardTestData.aiopsAdmin,1);
		var itOpsManager = await user_accessObj.verifyUserHasAiopsAdminrole(dashboardTestData.itOpsManager,2);
		var executiveCountryRoleBool = await user_accessObj.verifyUserHasAiopsAdminrole(dashboardTestData.deliveryExecutiveCountry,dashboardTestData.twoIndex);
		var executiveGeoBool = await user_accessObj.verifyUserHasAiopsAdminrole(dashboardTestData.deliveryExecutiveGeo,dashboardTestData.twoIndex);
		var executiveMarketBool = await user_accessObj.verifyUserHasAiopsAdminrole(dashboardTestData.deliveryExecutiveMarket,dashboardTestData.twoIndex);
		var deliveryExecutiveBool = [executiveCountryRoleBool,executiveGeoBool,executiveMarketBool].includes(true)
		await launchpadObj.clickOnMCMPHeader();
		await launchpadObj.open();
		await launchpadObj.clickOnHamburgerMenu(launchpadTestData.leftNavigationExpanded);
		await launchpadObj.clickOnleftNavigationMenuBasedOnName(launchpadTestData.aIOpsIntelligentITOperationsBtn);
		await launchpadObj.isCardDisplayedOnLeftNavigation(launchpadTestData.dashboardCard);
		await launchpadObj.clickLeftNavCardBasedOnName(launchpadTestData.dashboardCard);
		await dashboardObj.open();
		var allCardNamesFromDashboard = await dashboardObj.getAllCardsNameFromDashboard();
		var cardNames = await dashboardObj.evaluateApiCardsAndDashboardCards(tenantEdition.mcmpEdition, tenantEdition.card,allCardNamesFromDashboard,itOpsManager,aiopsAdminBool,deliveryExecutiveBool);
		expect(cardNames[0]).toEqual(cardNames[1]);
	})

	it('Verify incident , problem , service request and change request are present under Daily Sunrise Report widget', async function() {
		var dsrSubSectionHeaders = await dashboardObj.getDsrSubSectionHeader()
		expect(dsrSubSectionHeaders).toEqual(dashboardTestData.dsrHeaders)
	})

	it('Verify incident , problem , service request and change request priority count are displayed under respective headers and should not contain hyphen', async function() {
		var incidentPriorityCount = await dashboardObj.getPriorityCountOnDSR(dashboardTestData.DSRIncidentLabel,dashboardTestData.incident)
		expect(await dashboardObj.checkVisibilityOfHyphen(incidentPriorityCount)).toBe(true)
		var incidentPriorityCount = await dashboardObj.getPriorityCountOnDSR(dashboardTestData.DSRProblemLabel,dashboardTestData.problem)
		expect(await dashboardObj.checkVisibilityOfHyphen(incidentPriorityCount)).toBe(true)
		var incidentPriorityCount = await dashboardObj.getPriorityCountOnDSR(dashboardTestData.DSRServiceRequestLabel,dashboardTestData.serviceRequests)
		expect(await dashboardObj.checkVisibilityOfHyphen(incidentPriorityCount)).toBe(true)
		var incidentPriorityCount = await dashboardObj.getPriorityCountOnDSR(dashboardTestData.DSRChangeReuqestLabel,dashboardTestData.ChangeRequests)
		expect(await dashboardObj.checkVisibilityOfHyphen(incidentPriorityCount)).toBe(true)
	})


	it("Verify if user is redirected to correct page when clicked on view details under 'Daily Sunrise Report' widget' on dashboard", async function() {
		await dashboardObj.clickOnDSRViewDetails(dashboardTestData.DSRIncidentLabel,dashboardTestData.incident);
		util.switchToDefault();
		util.switchToFrameById(frames.mcmpIframe);
		expect(serviceMgmtUtil.isTabLinkSelected(dashboardTestData.incident)).toBe(true);
		util.clickOnHeaderDashboardLink();
		await dashboardObj.clickOnDSRViewDetails(dashboardTestData.DSRProblemLabel,dashboardTestData.problem);
		util.switchToDefault();
		util.switchToFrameById(frames.mcmpIframe);
		expect(serviceMgmtUtil.isTabLinkSelected(dashboardTestData.problem)).toBe(true);
		util.clickOnHeaderDashboardLink();
		await dashboardObj.clickOnDSRViewDetails(dashboardTestData.DSRServiceRequestLabel,dashboardTestData.serviceRequests);
		util.switchToDefault();
		util.switchToFrameById(frames.mcmpIframe);
		expect(serviceMgmtUtil.isTabLinkSelected(dashboardTestData.serviceRequests)).toBe(true);
		util.clickOnHeaderDashboardLink();
		await dashboardObj.clickOnDSRViewDetails(dashboardTestData.DSRChangeReuqestLabel,dashboardTestData.ChangeRequests);
		util.switchToDefault();
		util.switchToFrameById(frames.mcmpIframe);
		expect(await serviceMgmtUtil.isTabLinkSelected(dashboardTestData.ChangeRequests)).toBe(true);
	})

	it('Verify DSR incident priority count on dashboard page matches with incident priority count on DSR page', async function() {
		var incidentPriorityCount = await dashboardObj.getPriorityCountOnDSR(dashboardTestData.DSRIncidentLabel,dashboardTestData.incident)
		var formattedDsrData =await dashboardObj.getFormattedDSRPriorityCountonIncident(incidentPriorityCount)
		await dashboardObj.clickOnDSRViewDetails(dashboardTestData.DSRIncidentLabel,dashboardTestData.incident);
		util.waitForAngular();
		util.switchToFrameById(frames.cssrIFrame);
		serviceMgmtUtil.clickOnFilterButtonBasedOnName(sunriseReportTestData.priorityFilterName);
		expect(serviceMgmtUtil.verifyFilterPanelExpanded(sunriseReportTestData.priorityFilterName)).toBe(true);
		var priorityValues = await serviceMgmtUtil.getAllValuesFromMultiselectFilter(sunriseReportTestData.priorityFilterName)
		expect(await sunrise_reportObj.ValidateIncidentDsrPriorityData(priorityValues,formattedDsrData)).toBe(true)
	})

	it('Verify DSR problem priority count on dashboard page matches with problem priority count on DSR page', async function() {
		var problemPriorityCount = await dashboardObj.getPriorityCountOnDSR(dashboardTestData.DSRProblemLabel,dashboardTestData.problem)
		var formattedDsrData =await dashboardObj.getFormattedDSRPriorityCountonProblem(problemPriorityCount)
		await dashboardObj.clickOnDSRViewDetails(dashboardTestData.DSRProblemLabel,dashboardTestData.problem);
		util.waitForAngular();
		util.switchToFrameById(frames.cssrIFrame);
		serviceMgmtUtil.clickOnFilterButtonBasedOnName(sunriseReportTestData.priorityFilterName);
		expect(serviceMgmtUtil.verifyFilterPanelExpanded(sunriseReportTestData.priorityFilterName)).toBe(true);
		var priorityValues = await serviceMgmtUtil.getAllValuesFromMultiselectFilter(sunriseReportTestData.priorityFilterName)
		// Below Assertion will fail as we have a defect for count mismatch --> AIOP-13438
		expect(await sunrise_reportObj.ValidateProblemDsrPriorityData(priorityValues,formattedDsrData)).toBe(true)
	})

	it('Verify DSR Service request count on dashboard page matches with Service request on DSR page', async function() {
		var serviceRequestCounts = await dashboardObj.getPriorityCountOnDSR(dashboardTestData.DSRServiceRequestLabel,dashboardTestData.serviceRequests)
		var formattedDsrData =await dashboardObj.getFormattedDsrServiceRequestCount(serviceRequestCounts)
		await dashboardObj.clickOnDSRViewDetails(dashboardTestData.DSRServiceRequestLabel,dashboardTestData.serviceRequests);
		util.waitForAngular();
		util.switchToFrameById(frames.cssrIFrame);
		serviceMgmtUtil.clickOnFilterButtonBasedOnName(sunriseReportTestData.priorityFilterName);
		expect(serviceMgmtUtil.verifyFilterPanelExpanded(sunriseReportTestData.priorityFilterName)).toBe(true);
		var priorityValues = await serviceMgmtUtil.getAllValuesFromMultiselectFilter(sunriseReportTestData.priorityFilterName)
		expect(await sunrise_reportObj.ValidateServiceRequestDsrPriorityData(priorityValues,formattedDsrData)).toBe(true)
	})

	it('Verify DSR Change request count on dashboard page matches with Change request count on DSR page', async function() {
		var changeRequestCounts = await dashboardObj.getPriorityCountOnDSR(dashboardTestData.DSRChangeReuqestLabel,dashboardTestData.ChangeRequests)
		var formattedDsrData =await dashboardObj.getFormattedDsrChangeRequestCount(changeRequestCounts)
		await dashboardObj.clickOnDSRViewDetails(dashboardTestData.DSRChangeReuqestLabel,dashboardTestData.ChangeRequests);
		util.waitForAngular();
		util.switchToFrameById(frames.cssrIFrame);
		// Below Assertion will fail as we have a defect for count mismatch --> AIOP-13438
		expect(await sunrise_reportObj.ValidateChangeRequestDsrPriorityData(formattedDsrData)).toBe(true)
	})

	it('Verify delivery executive country role user is able to see cross account Insight card on dashboard page', async function() {
		var executiveCountryRoleBool = await user_accessObj.verifyUserHasAiopsAdminrole(dashboardTestData.deliveryExecutiveCountry,dashboardTestData.oneIndex);
		await launchpadObj.open();
		await launchpadObj.clickOnHamburgerMenu(launchpadTestData.leftNavigationExpanded);
		await launchpadObj.clickOnleftNavigationMenuBasedOnName(launchpadTestData.aIOpsIntelligentITOperationsBtn);
		await launchpadObj.isCardDisplayedOnLeftNavigation(launchpadTestData.dashboardCard);
		await launchpadObj.clickLeftNavCardBasedOnName(launchpadTestData.dashboardCard);
		await dashboardObj.open();
		if(executiveCountryRoleBool){
			expect(await dashboardObj.getAllCardsNameFromDashboard()).toContain(dashboardTestData.crossAccountInsights)
		}
	})

	it('Verify delivery executive Geo role user is able to see cross account Insight card on dashboard page', async function() {
		var executiveGeoBool = await user_accessObj.verifyUserHasAiopsAdminrole(dashboardTestData.deliveryExecutiveGeo,dashboardTestData.oneIndex);
		await launchpadObj.open();
		await launchpadObj.clickOnHamburgerMenu(launchpadTestData.leftNavigationExpanded);
		await launchpadObj.clickOnleftNavigationMenuBasedOnName(launchpadTestData.aIOpsIntelligentITOperationsBtn);
		await launchpadObj.isCardDisplayedOnLeftNavigation(launchpadTestData.dashboardCard);
		await launchpadObj.clickLeftNavCardBasedOnName(launchpadTestData.dashboardCard);
		await dashboardObj.open();
		if(executiveGeoBool){
			expect(await dashboardObj.getAllCardsNameFromDashboard()).toContain(dashboardTestData.crossAccountInsights)
		}
	})

	it('Verify delivery executive Markert role user is able to see cross account Insight card on dashboard page', async function() {
		var executiveMarketBool = await user_accessObj.verifyUserHasAiopsAdminrole(dashboardTestData.deliveryExecutiveMarket,dashboardTestData.oneIndex);
		await launchpadObj.open();
		await launchpadObj.clickOnHamburgerMenu(launchpadTestData.leftNavigationExpanded);
		await launchpadObj.clickOnleftNavigationMenuBasedOnName(launchpadTestData.aIOpsIntelligentITOperationsBtn);
		await launchpadObj.isCardDisplayedOnLeftNavigation(launchpadTestData.dashboardCard);
		await launchpadObj.clickLeftNavCardBasedOnName(launchpadTestData.dashboardCard);
		await dashboardObj.open();
		if(executiveMarketBool){
			expect(await dashboardObj.getAllCardsNameFromDashboard()).toContain(dashboardTestData.crossAccountInsights)
		}
	})

	it('Verify if IT health Assessment link is clickable on Cross account Insight card on dashboard page and validate header and months tab', async function() {
		var executiveCountryRoleBool = await user_accessObj.verifyUserHasAiopsAdminrole(dashboardTestData.deliveryExecutiveCountry,dashboardTestData.oneIndex);
		var executiveGeoBool = await user_accessObj.verifyUserHasAiopsAdminrole(dashboardTestData.deliveryExecutiveGeo,dashboardTestData.twoIndex);
		var executiveMarketBool = await user_accessObj.verifyUserHasAiopsAdminrole(dashboardTestData.deliveryExecutiveMarket,dashboardTestData.twoIndex);
		var deliveryExecutiveBool = [executiveCountryRoleBool,executiveGeoBool,executiveMarketBool].includes(true)
		await launchpadObj.clickOnMCMPHeader();
		await launchpadObj.open();
		await launchpadObj.clickOnHamburgerMenu(launchpadTestData.leftNavigationExpanded);
		await launchpadObj.clickOnleftNavigationMenuBasedOnName(launchpadTestData.aIOpsIntelligentITOperationsBtn);
		await launchpadObj.isCardDisplayedOnLeftNavigation(launchpadTestData.dashboardCard);
		await launchpadObj.clickLeftNavCardBasedOnName(launchpadTestData.dashboardCard);
		await dashboardObj.open();
		if(deliveryExecutiveBool){
			expect(await dashboardObj.getAllCardsNameFromDashboard()).toContain(dashboardTestData.crossAccountInsights);
			await dashboardObj.clickOnCrossAccountInsightCategories(dashboardTestData.ITHealthAssessment)
			expect(await util.getHeaderTitleText()).toEqual(dashboardTestData.ITHealthAssessment);
			expect(await dashboardObj.getMonthAndYearTabText(0)).toEqual(util.getFullPreviousMonthYearDate(0));	
			expect(await dashboardObj.getMonthAndYearTabText(1)).toEqual(util.getFullPreviousMonthYearDate(1));
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitOnlyForInvisibilityOfKibanaDataLoader();
			expect(await dashboardObj.getITHealthAssessmentLabelText()).toBe(dashboardTestData.crossAccountITHealthAssessment)
		}else{
			expect(await dashboardObj.getAllCardsNameFromDashboard()).not.toContain(dashboardTestData.crossAccountInsights)
		}
	})

	it('verify customisation Icon is not present on dashboard when mini card view is selected', async function() { 
		await dashboardObj.clickOnMiniViewIcon();
		expect(await dashboardObj.customiseButtonClick()).toBe(false)
	});

	fit("three test cases",async function(){
		expect(await dashboardObj.selectLegendBasedOnCard("healthmain",0)).toBe(true);
		expect(await dashboardObj.selectLegendBasedOnCard("incidentMain",1)).toBe(true);
		expect(await dashboardObj.selectLegendBasedOnCard("problemMain",1)).toBe(true);
		expect(await dashboardObj.selectLegendBasedOnCard("changeMain",1)).toBe(true);
		expect(await dashboardObj.selectLegendBasedOnCard("invMain",0)).toBe(true);
	})

	afterAll(async function() {
    //	await launchpadObj.clickOnLogoutAndLogin(browser.params.username, browser.params.password);
	});	
});