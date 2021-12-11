/**
 * Created by : Pushpraj
 * created on : 12/02/2020
 */

"use strict";
var logGenerator = require("../../helpers/logGenerator.js"),
	logger = logGenerator.getApplicationLogger(),
	problem_management = require('../pageObjects/problem_management.pageObject.js'),
	change_management = require('../pageObjects/change_management.pageObject.js'),
	dashboardTestData = require('../../testData/cards/dashboardTestData.json'),
	dashboard = require('../pageObjects/dashboard.pageObject.js'),
	launchpad = require('../pageObjects/launchpad.pageObject.js'),
	problemManagementTestData = require('../../testData/cards/problemManagementTestData.json'),
	launchpadTestData = require('../../testData/cards/launchpadTestData.json'),
	appUrls = require('../../testData/appUrls.json'),
	frames = require('../../testData/frames.json'),
	serviceMgmtUtil = require('../../helpers/serviceMgmtUtil.js'),
	elasticViewData = require('../../expected_values.json'),
	elasticViewDataProblemMgmt = require('../../testData/expected_value/problem_management_expected_values.json'),
	util = require('../../helpers/util.js'),
	esQueriesProblem = require('../../elasticSearchTool/esQuery_ProblemPayload.js'),
	tenantId = browser.params.tenantId,
	isEnabledESValidation = browser.params.esValidation;


describe('Problem management  - functionality ', function () {
	var problem_management_page, dashboard_page, launchpad_page, change_management_page;
	var problemManagementTestDataObject = JSON.parse(JSON.stringify(problemManagementTestData));
	var globalFilterList = [problemManagementTestDataObject.assignmentQueueFilterName, problemManagementTestDataObject.statusFilterName, problemManagementTestDataObject.ownerGroupFilterName, problemManagementTestDataObject.priorityFilterName];
	var globalFilterToolTipList = [problemManagementTestDataObject.assignmentQueueFilterName, problemManagementTestDataObject.statusFilterName, problemManagementTestDataObject.ownerGroupFilterName, problemManagementTestDataObject.priorityFilterName];
	var TabLinkList = [problemManagementTestDataObject.problemDashboardTab,problemManagementTestDataObject.overallTrendLinkText, problemManagementTestDataObject.topVolumeDriversLinkText];
	var twoMonthsPreviousDate = util.getPerviousDateInMonthYearFormat(2);
	var oneMonthPreviousDate = util.getPerviousDateInMonthYearFormat(1);
	var currentMonthDate = util.getPerviousDateInMonthYearFormat(0);
	var expected_ValuesProblemMgnt_ticket_overview,expected_ValuesProblemMgnt_overall_trend,expected_ValuesProblemMgnt_top_volume_drivers;
	var widgetNameList = [problemManagementTestDataObject.filterByWidget,problemManagementTestDataObject.OwnerGroupByVolumeOfProblemWidget, problemManagementTestDataObject.OwnerGroupSummary, problemManagementTestDataObject.MinedCategoryByVolumeOfProblem, problemManagementTestDataObject.CauseByVolumeOfProblemRecords, problemManagementTestDataObject.subComponentByVolumeOfProblemRecords,problemManagementTestDataObject.ticketDetails,problemManagementTestDataObject.OwnerGroupSummary,problemManagementTestDataObject.MinedCategoryByVolumeOfProblem,problemManagementTestDataObject.CauseByVolumeOfProblemRecords,problemManagementTestDataObject.subComponentByVolumeOfProblemRecords,problemManagementTestDataObject.OwnerGroupSummary,problemManagementTestDataObject.MinedCategoryByVolumeOfProblem,problemManagementTestDataObject.CauseByVolumeOfProblemRecords,problemManagementTestDataObject.subComponentByVolumeOfProblemRecords];
    var ticketCountColumnNamesList = [problemManagementTestDataObject.columnNameProblemNo, problemManagementTestDataObject.statusFilterName, problemManagementTestDataObject.priorityFilterName,problemManagementTestDataObject.columnNameOpenDate,problemManagementTestDataObject.columnNameClosedDate,problemManagementTestDataObject.columnNameTicketSummary,problemManagementTestDataObject.columnNameAssignmentGroup,problemManagementTestDataObject.columnNameProblemCause,problemManagementTestDataObject.columnNameSubComponent];
	beforeAll(function () {
		problem_management_page = new problem_management();
		dashboard_page = new dashboard();
		launchpad_page = new launchpad();
		change_management_page = new change_management();
		browser.driver.manage().window().maximize();
		expected_ValuesProblemMgnt_ticket_overview = elasticViewDataProblemMgmt.ticket_overview.default_filters.expected_values;
		expected_ValuesProblemMgnt_overall_trend = elasticViewDataProblemMgmt.overall_trend.default_filters.expected_values;
		expected_ValuesProblemMgnt_top_volume_drivers = elasticViewDataProblemMgmt.top_volume_drivers.default_filters.expected_values;
	});
	beforeEach(function () {
		launchpad_page.open();
		expect(launchpad_page.getWelcomeMessageTxt()).toEqual(launchpadTestData.welcome);
		problem_management_page.open();
	});

	// Need to skip the test case as global filters Created and Resolved are not available now 
	// it('Verify the problem count on Problem Management card and kibana report for "Created" Global Filter ', async function () {
	// 	launchpad_page.open();
	// 	launchpad_page.clickOnHamburgerMenu(launchpadTestData.leftNavigationExpanded);
	// 	launchpad_page.clickOnleftNavigationMenuBasedOnName(launchpadTestData.aIOpsIntelligentITOperationsBtn);
	// 	launchpad_page.clickLeftNavCardBasedOnName(launchpadTestData.dashboardCard);
	// 	await dashboard_page.open();
	// 	var twoMonthsPreviousTicketCreatedValue = await dashboard_page.getMatrixBarGraphTicketText(dashboardTestData.problemManagement, dashboardTestData.previousSecondMonth, dashboardTestData.ticketCreated);
	// 	var oneMonthPreviousTicketCreatedValue = await dashboard_page.getMatrixBarGraphTicketText(dashboardTestData.problemManagement, dashboardTestData.previousFirstmonth, dashboardTestData.ticketCreated);
	// 	var currentMonthTicketCreatedValue = await dashboard_page.getMatrixBarGraphTicketText(dashboardTestData.problemManagement, dashboardTestData.currentMonth, dashboardTestData.ticketCreated);
	// 	await dashboard_page.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.problemManagement);
	// 	util.switchToCssrIFramebyID(frames.mcmpIframe, frames.cssrIFrame);
	// 	expect(util.getCurrentURL()).toMatch(appUrls.problemManagementPageUrl);
	// 	await util.waitForInvisibilityOfKibanaDataLoader();
	// 	if(twoMonthsPreviousTicketCreatedValue != '0'){
	// 		serviceMgmtUtil.clickOnFilterButtonBasedOnName(problemManagementTestData.createdFilterName);
	// 		//selects 2 month's Previous filter to fetch Problem count text
	// 		serviceMgmtUtil.selectFilterValueBasedOnName(problemManagementTestData.createdFilterName, twoMonthsPreviousDate);
	// 		await serviceMgmtUtil.clickOnUpdateFilterButton(problemManagementTestData.createdFilterName);
	// 		await serviceMgmtUtil.clickOnApplyFilterButton().then(async function () {
	// 			await util.waitForInvisibilityOfKibanaDataLoader();
	// 			expect(serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(problemManagementTestData.problemCount)).toEqual(twoMonthsPreviousTicketCreatedValue);
	// 			// deselects 2 month's Previous filter to avoid addition of Problem count value  with Next Month value
	// 			await serviceMgmtUtil.deselectFilterValue(problemManagementTestData.createdFilterName, twoMonthsPreviousDate);
	// 		});
	// 	}
	// 	//selects 1 month's Previous filter to fetch Problem count text
	// 	await util.waitForInvisibilityOfKibanaDataLoader();
	// 	if(oneMonthPreviousTicketCreatedValue != '0'){
	// 		serviceMgmtUtil.clickOnFilterButtonBasedOnName(problemManagementTestData.createdFilterName);
	// 		serviceMgmtUtil.selectFilterValueBasedOnName(problemManagementTestData.createdFilterName, oneMonthPreviousDate);
	// 		await serviceMgmtUtil.clickOnUpdateFilterButton(problemManagementTestData.createdFilterName);
	// 		await serviceMgmtUtil.clickOnApplyFilterButton().then(async function () {
	// 			await util.waitForInvisibilityOfKibanaDataLoader();
	// 			expect(serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(problemManagementTestData.problemCount)).toEqual(oneMonthPreviousTicketCreatedValue);
	// 			// deselects 1 month's Previous filter to avoid addition of Problem count value  with Next Month value
	// 			await serviceMgmtUtil.deselectFilterValue(problemManagementTestData.createdFilterName, oneMonthPreviousDate);
	// 		});
	// 	}
	// 	//selects current month's filter to fetch Problem count text
	// 	await util.waitForInvisibilityOfKibanaDataLoader();
	// 	if(currentMonthTicketCreatedValue != '0'){
	// 		serviceMgmtUtil.clickOnFilterButtonBasedOnName(problemManagementTestData.createdFilterName);
	// 		serviceMgmtUtil.selectFilterValueBasedOnName(problemManagementTestData.createdFilterName, currentMonthDate);
	// 		await serviceMgmtUtil.clickOnUpdateFilterButton(problemManagementTestData.createdFilterName);
	// 		await serviceMgmtUtil.clickOnApplyFilterButton().then(async function () {
	// 			await util.waitForInvisibilityOfKibanaDataLoader();
	// 			expect(serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(problemManagementTestData.problemCount)).toEqual(currentMonthTicketCreatedValue);
	// 			// deselects current months filter to avoid addition of Problem count value  with Next value filter
	// 			await serviceMgmtUtil.deselectFilterValue(problemManagementTestData.createdFilterName, currentMonthDate);
	// 		});
	// 	}
	// });

	// it('Verify the problem count on Problem Management card and kibana report for "Resolved" Global Filter ', async function () {
	// 	launchpad_page.open();
	// 	launchpad_page.clickOnHamburgerMenu(launchpadTestData.leftNavigationExpanded);
	// 	launchpad_page.clickOnleftNavigationMenuBasedOnName(launchpadTestData.aIOpsIntelligentITOperationsBtn);
	// 	launchpad_page.clickLeftNavCardBasedOnName(launchpadTestData.dashboardCard);
	// 	await dashboard_page.open();
	// 	var twoMonthsPreviousTicketResolvedValue = await dashboard_page.getMatrixBarGraphTicketText(dashboardTestData.problemManagement, problemManagementTestDataObject.firstColumnOrGraphBar, dashboardTestData.ticketResolved);
	// 	var oneMonthPreviousTicketResolvedValue = await dashboard_page.getMatrixBarGraphTicketText(dashboardTestData.problemManagement, problemManagementTestDataObject.SecondColumnOrGraphBar, dashboardTestData.ticketResolved);
	// 	var currentMonthTicketResolvedValue = await dashboard_page.getMatrixBarGraphTicketText(dashboardTestData.problemManagement, problemManagementTestDataObject.thirdColumnOrGraphBar, dashboardTestData.ticketResolved);
	// 	await dashboard_page.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.problemManagement);
	// 	util.switchToCssrIFramebyID(frames.mcmpIframe, frames.cssrIFrame);
	// 	expect(util.getCurrentURL()).toMatch(appUrls.problemManagementPageUrl);
	// 	await util.waitForInvisibilityOfKibanaDataLoader();
	// 	//selects 2 month's Previous filter to fetch Problem count text
	// 	if(twoMonthsPreviousTicketResolvedValue != '0'){
	// 		serviceMgmtUtil.clickOnFilterButtonBasedOnName(problemManagementTestData.resolvedFilterName);
	// 		serviceMgmtUtil.selectFilterValueBasedOnName(problemManagementTestData.resolvedFilterName, twoMonthsPreviousDate);
	// 		await serviceMgmtUtil.clickOnUpdateFilterButton(problemManagementTestData.resolvedFilterName);
	// 		await serviceMgmtUtil.clickOnApplyFilterButton().then(function () {
	// 			expect(serviceMgmtUtil.getKabianaBoardCardValueInKformatter(problemManagementTestData.problemCount)).toEqual(twoMonthsPreviousTicketResolvedValue);
	// 			// deselects 2 month's Previous filter to avoid addition of Problem count value  with Next Month value
	// 			await serviceMgmtUtil.deselectFilterValue(problemManagementTestData.resolvedFilterName, twoMonthsPreviousDate);
	// 		});
	// 	}
	// 	//selects 1 month's Previous filter to fetch Problem count text
	// 	await util.waitForInvisibilityOfKibanaDataLoader();
	// 	if(oneMonthPreviousTicketResolvedValue != '0'){
	// 		serviceMgmtUtil.clickOnFilterButtonBasedOnName(problemManagementTestData.resolvedFilterName);
	// 		serviceMgmtUtil.selectFilterValueBasedOnName(problemManagementTestData.resolvedFilterName, oneMonthPreviousDate);
	// 		await serviceMgmtUtil.clickOnUpdateFilterButton(problemManagementTestData.resolvedFilterName);
	// 		await serviceMgmtUtil.clickOnApplyFilterButton().then(function () {
	// 			expect(serviceMgmtUtil.getKabianaBoardCardValueInKformatter(problemManagementTestData.problemCount)).toEqual(oneMonthPreviousTicketResolvedValue);
	// 			// deselects 1 month's Previous filter to avoid addition of Problem count value  with Next Month value
	// 			await serviceMgmtUtil.deselectFilterValue(problemManagementTestData.resolvedFilterName, oneMonthPreviousDate);
	// 		});
	// 	}
	// 	//selects current month's filter to fetch Problem count text
	// 	await util.waitForInvisibilityOfKibanaDataLoader();
	// 	if(currentMonthTicketResolvedValue != '0'){
	// 		serviceMgmtUtil.clickOnFilterButtonBasedOnName(problemManagementTestData.resolvedFilterName);
	// 		serviceMgmtUtil.selectFilterValueBasedOnName(problemManagementTestData.resolvedFilterName, currentMonthDate);
	// 		await serviceMgmtUtil.clickOnUpdateFilterButton(problemManagementTestData.resolvedFilterName);
	// 		await serviceMgmtUtil.clickOnApplyFilterButton().then(function () {
	// 			expect(serviceMgmtUtil.getKabianaBoardCardValueInKformatter(problemManagementTestData.problemCount)).toEqual(currentMonthTicketResolvedValue);
	// 			// deselects current months filter to avoid addition of Problem count value  with Next value filter
	// 			await serviceMgmtUtil.deselectFilterValue(problemManagementTestData.resolvedFilterName, currentMonthDate);
	// 		});
	// 	}
	// });

	it('Validate Problem Management title section, last updated Information and all Tabs Present', async function () {
		expect(util.getHeaderTitleText()).toEqual(problemManagementTestData.headerTitle);
		serviceMgmtUtil.clickOnLastUpdatedInfoIcon();
		expect(serviceMgmtUtil.getLastUpdatedInfoIconText()).toBe(problemManagementTestData.infoIconText);
		TabLinkList.forEach(function (tabLink) {
			expect(serviceMgmtUtil.getAllTabsLinkText()).toContain(tabLink);
		});
		serviceMgmtUtil.clickOnLastUpdatedInfoIcon();
	});
	it("Validate all  widgets and there Data are Present on 'Overall Trend' Tab for Problem Management", async function () {
		var widgetNameList = [problemManagementTestDataObject.filterByWidget,problemManagementTestDataObject.ticketCount,problemManagementTestDataObject.trendOfIncomingProblemVolumeByPriority,problemManagementTestDataObject.TrendOfResolvedProblemVolumeByPriority,problemManagementTestDataObject.ticketDetailsLinkText];
		var widgetList = [problemManagementTestDataObject.filterByWidget,problemManagementTestDataObject.ticketCount,problemManagementTestDataObject.trendOfIncomingProblemVolumeByPriority,problemManagementTestDataObject.TrendOfResolvedProblemVolumeByPriority,problemManagementTestDataObject.ticketDetailsLinkText];
		serviceMgmtUtil.clickOnTabLink(problemManagementTestDataObject.overallTrendLinkText);
		expect(serviceMgmtUtil.isTabLinkSelected (problemManagementTestDataObject.overallTrendLinkText)).toBe(true);
		expect(serviceMgmtUtil.isTabLinkSelected (problemManagementTestDataObject.topVolumeDriversLinkText)).toBe(false);
		util.switchToFrameById(frames.cssrIFrame);
		util.waitForAngular();
		// check all widgets on Kibana report are Present
		widgetNameList.forEach(function (widgetName) {
			expect(serviceMgmtUtil.getAllKibanaReportWidgetsNameText()).toContain(widgetName);
		});
		// check results are found for Widgets on Kibana report
		widgetList.forEach(async function (widgetName) {
			var status = await problem_management_page.isNoResultFoundTextPresentOnWidgets(widgetName);
			if(status != true){
			expect(await problem_management_page.isNoResultFoundTextPresentOnWidgets(widgetName)).toBe(false);
			}
		});
	});

	it("Validate 'ticket detail' table Column presence under 'Overall Trend' Tab for Problem Management", async function () {
		serviceMgmtUtil.clickOnTabLink(problemManagementTestDataObject.overallTrendLinkText);
		util.waitForAngular();
		//tab link selection check
		expect(serviceMgmtUtil.isTabLinkSelected (problemManagementTestDataObject.overallTrendLinkText)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		util.waitForInvisibilityOfKibanaDataLoader();
		var ticketCountColumnNamesListOnUI = await serviceMgmtUtil.getColumnNamesBasedOnTableName(problemManagementTestDataObject.ticketDetails);
		// check all column Names are present for "Ticket Count" Table
		ticketCountColumnNamesList.forEach(function (ticketCountColumnName) {
			expect(ticketCountColumnNamesListOnUI).toContain(ticketCountColumnName);
		});
	});

	it("Validate all widgets  are Present on 'Top Volume Drivers' Tab for Problem Management", async function () {
		serviceMgmtUtil.clickOnTabLink(problemManagementTestDataObject.topVolumeDriversLinkText);
		expect(serviceMgmtUtil.isTabLinkSelected (problemManagementTestDataObject.overallTrendLinkText)).toBe(false);
		expect(serviceMgmtUtil.isTabLinkSelected (problemManagementTestDataObject.topVolumeDriversLinkText)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		util.waitForAngular();
		util.waitForInvisibilityOfKibanaDataLoader();
		// check all widgets on Kibana report are Present
		widgetNameList.forEach(function (widgetName) {
			expect(serviceMgmtUtil.getAllKibanaReportWidgetsNameText()).toContain(widgetName);
		});
		// check results are found for Widgets on Kibana report
		widgetNameList.forEach(async function (widgetName) {
			var status = await problem_management_page.isNoResultFoundTextPresentOnWidgets(widgetName);
			if(status != true){
			expect(await problem_management_page.isNoResultFoundTextPresentOnWidgets(widgetName)).toBe(false);
			}
		});
	});

	it("Validate 'ticket details' Table's Column presence under 'Top Volume Drivers' Tab for Problem Management", async function () {
		serviceMgmtUtil.clickOnTabLink(problemManagementTestDataObject.topVolumeDriversLinkText);
		util.waitForAngular();
		//tab link selection check
		expect(serviceMgmtUtil.isTabLinkSelected (problemManagementTestDataObject.topVolumeDriversLinkText)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		util.waitForInvisibilityOfKibanaDataLoader();
		var ticketCountColumnNamesListOnUI = await serviceMgmtUtil.getColumnNamesBasedOnTableName(problemManagementTestDataObject.ticketDetails);
		//check all column Names are present for "Ticket Count" Table
		ticketCountColumnNamesList.forEach(function (ticketCountColumnName) {
			expect(ticketCountColumnNamesListOnUI).toContain(ticketCountColumnName);
		});
	});
   /*
	it("Validate Owner Group Sumarry Table's Column presence and Acending Decending Order Features on 'Top Volume Drivers' Tab for Problem Management", async function () {
		var overallGroupSummaryColumnNamesList = [problemManagementTestDataObject.MTTRDays, problemManagementTestDataObject.ownerGroupColumnName, problemManagementTestDataObject.columnNameCount];
		serviceMgmtUtil.clickOnTabLink(problemManagementTestDataObject.topVolumeDriversLinktext);
		util.waitForAngular();
		//tab link selection check
		expect(serviceMgmtUtil.isTabLinkSelected (problemManagementTestDataObject.topVolumeDriversLinktext)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();
		var overallGroupSummaryColumnNamesListOnUI = await serviceMgmtUtil.getColumnNamesBasedOnTableName(problemManagementTestDataObject.OwnerGroupSummary);
		//check all column Names are present for "Overall group Summary" Table
		overallGroupSummaryColumnNamesList.forEach(function (overallGroupSummaryColumnName) {
			expect(overallGroupSummaryColumnNamesListOnUI).toContain(overallGroupSummaryColumnName);
		});
		if (browser.params.dataValiadtion) {
			
			util.waitForInvisibilityOfKibanaDataLoader();
			var expected_Values_owner_group_summary = expected_ValuesProblemMgnt_top_volume_drivers.owner_group_summary;
			var ticketCountCountcloumnValues = await serviceMgmtUtil.getColumnDataBasedOnColumnNo(problemManagementTestDataObject.OwnerGroupSummary, problemManagementTestDataObject.SecondColumnOrGraphBar);
			var ticketCountMTTRcloumnValues = await serviceMgmtUtil.getColumnDataBasedOnColumnNo(problemManagementTestDataObject.OwnerGroupSummary, problemManagementTestDataObject.thirdColumnOrGraphBar);
			var envKeyList = Object.keys(expected_Values_owner_group_summary);
			for (var i = 0; i < envKeyList.length; i++) {
			logger.info("value on UI for Count of coulumn No :" +i + " is :"+ticketCountCountcloumnValues[i]+" and value in JSON for "+envKeyList[i] + " is "  +expected_Values_owner_group_summary[envKeyList[i]][problemManagementTestData.columnNamecount]);
			// for ticketCountMTTRcloumnValues[i] = "-" the json will be undefined
			logger.info("value on UI for MTTR of coulumn No :" +i + " is :"+ticketCountMTTRcloumnValues[i]+" and value in JSON for "+envKeyList[i] + " is "  +expected_Values_owner_group_summary[envKeyList[i]][problemManagementTestData.columnNameMTTR]);
			var ticketCountCountcloumnValue = util.stringToInteger(ticketCountCountcloumnValues[i]);
			expect(ticketCountCountcloumnValue).toEqual(expected_Values_owner_group_summary[envKeyList[i]][problemManagementTestData.columnNamecount]);
			if(ticketCountMTTRcloumnValues[i] != "-")
			{
				//var ticketCountMTTRcloumnValue = util.stringToInteger(ticketCountMTTRcloumnValues[i])
			expect(ticketCountMTTRcloumnValues[i]).toEqual(JSON.stringify(expected_Values_owner_group_summary[envKeyList[i]][problemManagementTestData.columnNameMTTR]));
		}
			}
		}
		overallGroupSummaryColumnNamesListOnUI.shift();
		//check Ascending Descending order of table columns(Local filters) for  'Ticket Count' Table
		await expect(await serviceMgmtUtil.checkAscendingDescendingOrderOfTableItems(problemManagementTestDataObject.OwnerGroupSummary, overallGroupSummaryColumnNamesListOnUI, problemManagementTestDataObject.OrderTypeDecending, problemManagementTestData.cloumnTypeNumeric)).toBe(true);
		await expect(await serviceMgmtUtil.checkAscendingDescendingOrderOfTableItems(problemManagementTestDataObject.OwnerGroupSummary, overallGroupSummaryColumnNamesListOnUI, problemManagementTestDataObject.OrderTypeAcending, problemManagementTestData.cloumnTypeNumeric)).toBe(true);
	});

	it("Validate Cause By Volume Of Problem Records's Column presence and data on 'Top Volume Drivers' Tab for Problem Management", async function () {
		serviceMgmtUtil.clickOnTabLink(problemManagementTestDataObject.topVolumeDriversLinktext);
		util.waitForAngular();
		//tab link selection check
		expect(serviceMgmtUtil.isTabLinkSelected (problemManagementTestDataObject.topVolumeDriversLinktext)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		util.waitForAngular();
		util.waitForInvisibilityOfKibanaDataLoader()
			var CausebyVolumeOfProblemRecordscloumnNames = await serviceMgmtUtil.getColumnNamesBasedOnTableName(problemManagementTestDataObject.CausebyVolumeOfProblemRecords);
			expect(CausebyVolumeOfProblemRecordscloumnNames).toContain(problemManagementTestDataObject.columnNameCount);
			expect(CausebyVolumeOfProblemRecordscloumnNames).toContain(problemManagementTestDataObject.columnNameCause);
			if (browser.params.dataValiadtion) {
				var expected_Values_cause_by_volume_of_problem_records =  expected_ValuesProblemMgnt_top_volume_drivers.cause_by_volume_of_problem_records;
			var	CausebyVolumeOfProblemRecordsCountcloumnValues =  await serviceMgmtUtil.getColumnDataBasedOnColumnNo(problemManagementTestDataObject.CausebyVolumeOfProblemRecords, problemManagementTestDataObject.SecondColumnOrGraphBar);
			var envKeyList = Object.keys(expected_Values_cause_by_volume_of_problem_records);
			for (var i = 0; i < envKeyList.length; i++) {
				var CausebyVolumeOfProblemRecordsCountcloumnValue = util.stringToInteger(CausebyVolumeOfProblemRecordsCountcloumnValues[i]);
			expect(CausebyVolumeOfProblemRecordsCountcloumnValue).toEqual(expected_Values_cause_by_volume_of_problem_records[envKeyList[i]]);
			}
		}
	})
	it("Verify applied Global filter persist across all tabs within Problem management and won't persist when moved to another report page", async function () {
		serviceMgmtUtil.clickOnTabLink(problemManagementTestDataObject.ticketOverviewLinkText);
		// Verify if tab is selected, after clicking on it or not
		util.switchToFrameById(frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();
		// Apply Contact Type filter with its first value
		serviceMgmtUtil.clickOnFilterButtonBasedOnName(problemManagementTestDataObject.priorityFilterName);
		expect(serviceMgmtUtil.verifyFilterPanelExpanded(problemManagementTestDataObject.priorityFilterName)).toBe(true);
		var filterValue = await serviceMgmtUtil.selectFirstFilterValueBasedOnName(problemManagementTestDataObject.priorityFilterName);
		await serviceMgmtUtil.clickOnUpdateFilterButton(problemManagementTestDataObject.priorityFilterName);
		await serviceMgmtUtil.clickOnApplyFilterButton();
		await util.waitForInvisibilityOfKibanaDataLoader();
		// Verify tooltip text with applied filter value
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(problemManagementTestDataObject.priorityFilterName)).toEqual(filterValue);
		util.switchToDefault();
		util.switchToFrameById(frames.mcmpIframe);
		// Navigate to'Overall Trends' tab 
		serviceMgmtUtil.clickOnTabLink(problemManagementTestDataObject.overallTrendLinkText);
		expect(serviceMgmtUtil.isTabLinkSelected (problemManagementTestDataObject.overallTrendLinkText)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();
		// Verify tooltip text on 'Overall Trends' with applied filter value on 'Ticket Overview' tab
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(problemManagementTestDataObject.priorityFilterName)).toEqual(filterValue);
		util.switchToDefault();
		util.switchToFrameById(frames.mcmpIframe);
		// Navigate to Top Volume Drivers tab 
		serviceMgmtUtil.clickOnTabLink(problemManagementTestDataObject.topVolumeDriversLinktext);
		expect(serviceMgmtUtil.isTabLinkSelected (problemManagementTestDataObject.topVolumeDriversLinktext)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();
		// Verify tooltip text on Top Volume Drivers tab with applied filter value on 'Ticket Overview' tab
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(problemManagementTestDataObject.priorityFilterName)).toEqual(filterValue);
		util.switchToDefault();
		util.switchToFrameById(frames.mcmpIframe);
		util.switchToFrameById(frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();
		// Verify tooltip text on Ticket details tab with applied filter value on 'Ticket Overview' tab
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(problemManagementTestDataObject.priorityFilterName)).toEqual(filterValue);
		// Navigate to Problem Management page
		launchpad_page.clickOnHamburgerMenu(launchpadTestData.leftNavigationExpanded);
		launchpad_page.clickOnleftNavigationMenuBasedOnName(launchpadTestData.aIOpsIntelligentITOperationsBtn);
		launchpad_page.clickLeftNavCardBasedOnName(launchpadTestData.changeManagementCard);
		change_management_page.open();
		launchpad_page.clickOnHamburgerMenu(launchpadTestData.leftNavigationExpanded);
		launchpad_page.clickOnleftNavigationMenuBasedOnName(launchpadTestData.aIOpsIntelligentITOperationsBtn);
		launchpad_page.clickLeftNavCardBasedOnName(launchpadTestData.problemManagementCard);
		problem_management_page.open();
		util.switchToFrameById(frames.cssrIFrame);
		util.waitForAngular();
		await util.waitForInvisibilityOfKibanaDataLoader();
		// Verify tooltip text on Problem Magement 'Ticket Overview' tab with default tooltip text
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(problemManagementTestDataObject.priorityFilterName)).toEqual(problemManagementTestDataObject.noneSelectedTooltipText);
	});
	it("verify global Filter's Presence ,Expantion, default and selected Tooltip text  on 'Overall Trends' Tab for Problem Management", async function(){
		serviceMgmtUtil.clickOnTabLink(problemManagementTestDataObject.overallTrendLinkText);
		expect(serviceMgmtUtil.isTabLinkSelected (problemManagementTestDataObject.overallTrendLinkText)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();
		// check all global filters on Kibana report are Present
		globalFilterList.forEach(function (globalFilter) {
			expect(serviceMgmtUtil.getAllFiltersButtonNameText()).toContain(globalFilter);
		})
		// Validate each global filter default tooltip text (None selected)
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(problemManagementTestDataObject.assignmentQueueFilterName)).toEqual(problemManagementTestDataObject.noneSelectedTooltipText);
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(problemManagementTestDataObject.priorityFilterName)).toEqual(problemManagementTestDataObject.noneSelectedTooltipText);
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(problemManagementTestDataObject.statusFilterName)).toEqual(problemManagementTestDataObject.noneSelectedTooltipText);
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(problemManagementTestDataObject.ownerGroupFilterName)).toEqual(problemManagementTestDataObject.noneSelectedTooltipText);
		// Validate the default global filter is applied for "Last 210 days" on Creation Date date-range filter
		expect(serviceMgmtUtil.getDateRangeFilterDateDifference(problemManagementTestDataObject.createdOnFilterName)).toEqual(problemManagementTestDataObject.defaultCreationDateFilterDateRangeDiff);
		expect(serviceMgmtUtil.getAllFiltersButtonNameText()).toContain(problemManagementTestDataObject.createdOnFilterName);
		// Validate each global filter is expanded or not
		globalFilterList.forEach(function (globalFilter) {
			serviceMgmtUtil.clickOnFilterButtonBasedOnName(globalFilter);
			expect(serviceMgmtUtil.verifyFilterPanelExpanded(globalFilter)).toBe(true);
		});
		await util.waitForInvisibilityOfKibanaDataLoader();
		// Iterate through each multi-select global filter, select first value and verify tooltip text
		for (var globalFilter of globalFilterToolTipList) {
			await serviceMgmtUtil.clickOnFilterButtonBasedOnName(globalFilter);
			expect(serviceMgmtUtil.verifyFilterPanelExpanded(globalFilter)).toBe(true);
			var filterValue = await serviceMgmtUtil.selectFirstFilterValueBasedOnName(globalFilter);
			if(filterValue != false){
				await serviceMgmtUtil.clickOnUpdateFilterButton(globalFilter);
				await serviceMgmtUtil.clickOnApplyFilterButton();
				await util.waitForInvisibilityOfKibanaDataLoader();
				// Verify tooltip text with applied filter value
				await expect(await serviceMgmtUtil.getGlobalFilterButtonToolTipText(globalFilter)).toEqual(filterValue);
				await serviceMgmtUtil.deselectFilterValue(globalFilter, filterValue);
				await util.waitForInvisibilityOfKibanaDataLoader();
			}
		}
		//Iterate through "Creation Date" date-range global filter, select first value and verify tooltip text
		await serviceMgmtUtil.clickOnDateRangeFilterButton(problemManagementTestDataObject.createdOnFilterName);
		expect(serviceMgmtUtil.verifyDateRangeFilterPanelExpanded(problemManagementTestDataObject.createdOnFilterName)).toBe(true);
		var last30DaysText = problemManagementTestDataObject.lastCustomDaysDateRangeText.format(problemManagementTestDataObject.thirtyDaysDateRangeDiff);
		await serviceMgmtUtil.selectDateRangeFilterValue(last30DaysText);
		await serviceMgmtUtil.clickOnApplyFilterButton();
		await util.waitForInvisibilityOfKibanaDataLoader(problemManagementTestDataObject.createdOnFilterName);
		// Verify tooltip text with applied global filter value
		await expect(serviceMgmtUtil.getDaysFromDateRangeFilterToolTip(problemManagementTestDataObject.createdOnFilterName)).toEqual(problemManagementTestDataObject.thirtyDaysDateRangeDiff);
	});

	it("verify global Filter's Presence ,Expantion, default and selected Tooltip text  on 'Top Volume Drivers' Tab for Problem Management", async function(){
		serviceMgmtUtil.clickOnTabLink(problemManagementTestDataObject.topVolumeDriversLinktext);
		expect(serviceMgmtUtil.isTabLinkSelected (problemManagementTestDataObject.topVolumeDriversLinktext)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();
		// check all global filters on Kibana report are Present
		globalFilterList.forEach(function (globalFilter) {
			expect(serviceMgmtUtil.getAllFiltersButtonNameText()).toContain(globalFilter);
		})
		expect(serviceMgmtUtil.getAllFiltersButtonNameText()).toContain(problemManagementTestDataObject.createdOnFilterName);
		//// Validate each global filter default tooltip text (None selected)
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(problemManagementTestDataObject.assignmentQueueFilterName)).toEqual(problemManagementTestDataObject.noneSelectedTooltipText);
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(problemManagementTestDataObject.priorityFilterName)).toEqual(problemManagementTestDataObject.noneSelectedTooltipText);
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(problemManagementTestDataObject.statusFilterName)).toEqual(problemManagementTestDataObject.noneSelectedTooltipText);
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(problemManagementTestDataObject.ownerGroupFilterName)).toEqual(problemManagementTestDataObject.noneSelectedTooltipText);
		// Validate the default global filter is applied for "Last 210 days" on Creation Date date-range filter
		expect(serviceMgmtUtil.getDateRangeFilterDateDifference(problemManagementTestDataObject.createdOnFilterName)).toEqual(problemManagementTestDataObject.defaultCreationDateFilterDateRangeDiff);
		// Validate each global filter is expanded or not
		globalFilterList.forEach(function (globalFilter) {
			serviceMgmtUtil.clickOnFilterButtonBasedOnName(globalFilter);
			expect(serviceMgmtUtil.verifyFilterPanelExpanded(globalFilter)).toBe(true);
		});
		//Iterate through each multi-select global filter, select first value and verify tooltip text
		for (var globalFilter of globalFilterToolTipList) {
			await serviceMgmtUtil.clickOnFilterButtonBasedOnName(globalFilter);
			expect(serviceMgmtUtil.verifyFilterPanelExpanded(globalFilter)).toBe(true);
			var filterValue = await serviceMgmtUtil.selectFirstFilterValueBasedOnName(globalFilter);
			if(filterValue != false){
				await serviceMgmtUtil.clickOnUpdateFilterButton(globalFilter);
				await serviceMgmtUtil.clickOnApplyFilterButton();
				await util.waitForInvisibilityOfKibanaDataLoader();
				// Verify tooltip text with applied global filter value
				await expect(await serviceMgmtUtil.getGlobalFilterButtonToolTipText(globalFilter)).toEqual(filterValue);
				await serviceMgmtUtil.deselectFilterValue(globalFilter, filterValue);
				await util.waitForInvisibilityOfKibanaDataLoader();
			}
		}
		// Iterate through each date-range global filter, select first value and verify tooltip text
		await serviceMgmtUtil.clickOnDateRangeFilterButton(problemManagementTestDataObject.createdOnFilterName);
		expect(serviceMgmtUtil.verifyDateRangeFilterPanelExpanded(problemManagementTestDataObject.createdOnFilterName)).toBe(true);
		var last30DaysText = problemManagementTestDataObject.lastCustomDaysDateRangeText.format(problemManagementTestDataObject.thirtyDaysDateRangeDiff);
		await serviceMgmtUtil.selectDateRangeFilterValue(last30DaysText);
		await serviceMgmtUtil.clickOnApplyFilterButton();
		await util.waitForInvisibilityOfKibanaDataLoader(problemManagementTestDataObject.createdOnFilterName);
		// Verify tooltip text with applied global filter value
		await expect(serviceMgmtUtil.getDaysFromDateRangeFilterToolTip(problemManagementTestDataObject.createdOnFilterName)).toEqual(problemManagementTestDataObject.thirtyDaysDateRangeDiff);
	});

	it("verify global Filter's Presence ,Expantion, default and selected Tooltip text  on 'Ticket Details' Tab for Problem Management", async function(){
		serviceMgmtUtil.clickOnTabLink(problemManagementTestDataObject.ticketDetailsLinktext);
		expect(serviceMgmtUtil.isTabLinkSelected (problemManagementTestDataObject.ticketDetailsLinktext)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();
		// check all global filters on Kibana report are Present
		globalFilterList.forEach(async function (globalFilter) {
			await expect(serviceMgmtUtil.getAllFiltersButtonNameText()).toContain(globalFilter);
		})
		expect(serviceMgmtUtil.getAllFiltersButtonNameText()).toContain(problemManagementTestDataObject.createdOnFilterName);
		await util.waitForInvisibilityOfKibanaDataLoader();
		// // Validate each global filter default tooltip text (None selected)
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(problemManagementTestDataObject.assignmentQueueFilterName)).toEqual(problemManagementTestDataObject.noneSelectedTooltipText);
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(problemManagementTestDataObject.priorityFilterName)).toEqual(problemManagementTestDataObject.noneSelectedTooltipText);
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(problemManagementTestDataObject.statusFilterName)).toEqual(problemManagementTestDataObject.noneSelectedTooltipText);
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(problemManagementTestDataObject.ownerGroupFilterName)).toEqual(problemManagementTestDataObject.noneSelectedTooltipText);
		// Validate the default global filter is applied for "Last 210 days" on Creation Date date-range filter
		expect(serviceMgmtUtil.getDateRangeFilterDateDifference(problemManagementTestDataObject.createdOnFilterName)).toEqual(problemManagementTestDataObject.defaultCreationDateFilterDateRangeDiff);
		// Validate each global filter is expanded or not
		globalFilterList.forEach(async function (globalFilter) {
			await serviceMgmtUtil.clickOnFilterButtonBasedOnName(globalFilter);
			await expect(serviceMgmtUtil.verifyFilterPanelExpanded(globalFilter)).toBe(true);
		});
		// Iterate through each date-range filter, select first value and verify tooltip text
		await serviceMgmtUtil.clickOnDateRangeFilterButton(problemManagementTestDataObject.createdOnFilterName);
		await expect(serviceMgmtUtil.verifyDateRangeFilterPanelExpanded(problemManagementTestDataObject.createdOnFilterName)).toBe(true);
		var last30DaysText = problemManagementTestDataObject.lastCustomDaysDateRangeText.format(problemManagementTestDataObject.thirtyDaysDateRangeDiff);
		await serviceMgmtUtil.selectDateRangeFilterValue(last30DaysText);
		await serviceMgmtUtil.clickOnApplyFilterButton();
		await util.waitForInvisibilityOfKibanaDataLoader();
		// Verify tooltip text with applied global filter value
		await expect(serviceMgmtUtil.getDaysFromDateRangeFilterToolTip(problemManagementTestDataObject.createdOnFilterName)).toEqual(problemManagementTestDataObject.thirtyDaysDateRangeDiff);
		await util.clickOnResetFilterLink();
		await util.waitForInvisibilityOfKibanaDataLoader();
		// Iterate through each multi-select global filter, select first value and verify tooltip text
		for (var globalFilter of globalFilterToolTipList) {
			await serviceMgmtUtil.clickOnFilterButtonBasedOnName(globalFilter);
			await expect(await serviceMgmtUtil.verifyFilterPanelExpanded(globalFilter)).toBe(true);
			var filterValue = await serviceMgmtUtil.selectFirstFilterValueBasedOnName(globalFilter);
			if(filterValue != false){
				await serviceMgmtUtil.clickOnUpdateFilterButton(globalFilter);
				await serviceMgmtUtil.clickOnApplyFilterButton();
				await util.waitForInvisibilityOfKibanaDataLoader();
				// Verify tooltip text with applied global filter value
				await expect(await serviceMgmtUtil.getGlobalFilterButtonToolTipText(globalFilter)).toEqual(filterValue);
				await serviceMgmtUtil.deselectFilterValue(globalFilter, filterValue);
				await util.waitForInvisibilityOfKibanaDataLoader();
			}
		}
	});
   */
	if (browser.params.dataValiadtion) {
	it("Validate all value count from 'Owner Group by Volume of Problem' horizontal bar chart with JSON data  on 'Top Volume Drivers' Tab for Problem Management", async function () {
		serviceMgmtUtil.clickOnTabLink(problemManagementTestDataObject.topVolumeDriversLinktext);
		expect(serviceMgmtUtil.isTabLinkSelected (problemManagementTestDataObject.topVolumeDriversLinktext)).toBe(true);
		util.switchToCssrIFramebyID(frames.mcmpIframe, frames.cssrIFrame);
		util.waitForInvisibilityOfKibanaDataLoader();
			logger.info("------Data validation------");
			var ownerGroupKeys = Object.keys(expected_ValuesProblemMgnt_top_volume_drivers.owner_group_by_volume_of_problem);
			var ownerGroupValues = Object.values(expected_ValuesProblemMgnt_top_volume_drivers.owner_group_by_volume_of_problem);
			var ownerGroupLength = ownerGroupKeys.length;
			if(ownerGroupLength > 5){ ownerGroupLength=5 }
			for(var i=0; i<ownerGroupLength; i++){
				var problemCount = await serviceMgmtUtil.getCountFromHorizontalBarGraphWidget(problemManagementTestData.OwnerGroupbyVolumeofProblem, ownerGroupKeys[i]);
				await expect(problemCount).toEqual(ownerGroupValues[i]);
			}
		
	});
}

	if (browser.params.dataValiadtion) {
		it("Validate all value count from 'Mined Category by Volume of Problem' horizontal bar chart with JSON data  on 'Top Volume Drivers' Tab for Problem Management", async function () {
			serviceMgmtUtil.clickOnTabLink(problemManagementTestDataObject.topVolumeDriversLinktext);
			expect(serviceMgmtUtil.isTabLinkSelected (problemManagementTestDataObject.topVolumeDriversLinktext)).toBe(true);
			util.switchToCssrIFramebyID(frames.mcmpIframe, frames.cssrIFrame);
			util.waitForInvisibilityOfKibanaDataLoader();
			logger.info("------Data validation------");
			var minedCategoryKeys = Object.keys(expected_ValuesProblemMgnt_top_volume_drivers.mined_category_by_volume_of_problem);
			var minedCategoryValues = Object.values(expected_ValuesProblemMgnt_top_volume_drivers.mined_category_by_volume_of_problem);
			var minedCategoryLength = minedCategoryKeys.length;
			if(minedCategoryLength > 5) { minedCategoryLength = 5 }
			for(var i=0; i<minedCategoryLength; i++){
				var problemCount = await serviceMgmtUtil.getCountFromHorizontalBarGraphWidget(problemManagementTestData.MinedCategorybyVolumeOfProblem, minedCategoryKeys[i]);
				await expect(problemCount).toEqual(minedCategoryValues[i]);
			}
		});
	}

	if (browser.params.dataValiadtion) {
		it("Validate all value count from 'Owner Group by Volume of Problem' horizontal bar chart with JSON data  on 'Ticket Overview' Tab for Problem Management", async function () {
			expect(serviceMgmtUtil.isTabLinkSelected (problemManagementTestDataObject.ticketOverviewLinkText)).toBe(true);
			util.switchToCssrIFramebyID(frames.mcmpIframe, frames.cssrIFrame);
			util.waitForInvisibilityOfKibanaDataLoader();
			logger.info("------Data validation------");
			var ownerGroupKeys = Object.keys(expected_ValuesProblemMgnt_ticket_overview.owner_group);
			var ownerGroupValues = Object.values(expected_ValuesProblemMgnt_ticket_overview.owner_group);
			var ownerGroupLength = ownerGroupKeys.length ;
			if(ownerGroupLength >5){ ownerGroupLength=5 }
			for(var i=0; i<ownerGroupLength; i++){
				var problemCount = await serviceMgmtUtil.getCountFromHorizontalBarGraphWidget(problemManagementTestData.OwnerGroupbyVolumeofProblem, ownerGroupKeys[i]);
				await expect(problemCount).toEqual(ownerGroupValues[i]);
			}
		});
	}
/*
	if (isEnabledESValidation) {
		it("Validate all value count from 'Owner Group by Volume of Problem' Horizontal bar chart with ES Query data  on 'Ticket Overview' Tab for Problem Management", async function () {
			util.switchToCssrIFramebyID(frames.mcmpIframe, frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			logger.info("------ES Query validation------");
			// Get Y-Axis labels list from horizontal bar chart widget
			var yAxisLabels = await serviceMgmtUtil.getYAxisLabelsForHorizontalBarGraphWidget(problemManagementTestData.OwnerGroupbyVolumeofProblem);
			var problemCountUIList = await serviceMgmtUtil.getCountListForHorizontalBarGraphWidget(problemManagementTestData.OwnerGroupbyVolumeofProblem, yAxisLabels);
			var problemCountESList = await esQueriesProblem.getOwnerGroupByVolumeOfProblemHorizontalBarGraphCountList(problemManagementTestData.eSProblemSearchIndex, tenantId, yAxisLabels);
			// Verify the list of count values for each Y-axis label from UI with the list of count values from ES query response
			expect(util.compareArrays(problemCountUIList, problemCountESList)).toBe(true);
		});
	}
	*/
	if (isEnabledESValidation) {
		it("Validate all value count from 'Contact Type' 2 column Table widget with ES Query data  on 'Ticket Overview' Tab for Problem Management", async function () {
			util.switchToCssrIFramebyID(frames.mcmpIframe, frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			var status = await problem_management_page.isNoResultFoundTextPresentOnWidgets(problemManagementTestDataObject.contactType);
			if (status != true) {
				logger.info("------ES Query validation------");
				// Get list of cell values from the first column [row filter names]
				var firstColCellValuesList = await serviceMgmtUtil.getFirstColumnCellValuesListFromTableWidget(problemManagementTestData.contactType);
				var countListFromUI = await serviceMgmtUtil.getCountListFrom2ColumnsTableWidget(problemManagementTestData.contactType, firstColCellValuesList);
				var countListFromES = await esQueriesProblem.getContactTypeTableWidgetCountList(problemManagementTestData.eSProblemSearchIndex, tenantId, firstColCellValuesList);
				// Verify the list of count values for each row filter value from UI with the list of count values from ES query response
				expect(util.compareArrays(countListFromUI, countListFromES)).toBe(true);
			}
		});
	}
/*
	if(isEnabledESValidation) {
		it("Validate all value count from 'Priority by Age Bin' Table widget with ES Query data  on 'Ticket Overview' Tab for Problem Management", async function () {
			util.switchToCssrIFramebyID(frames.mcmpIframe, frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			logger.info("------ES Query validation------");
			// Get list of cell values from the first column [row filter names]
			var firstColCellValuesList = await serviceMgmtUtil.getFirstColumnCellValuesListFromTableWidget(problemManagementTestDataObject.prioritybyAgeBin);
			var columnList = await serviceMgmtUtil.getColumnNameListFromTableWidget(problemManagementTestDataObject.prioritybyAgeBin);
			columnList.shift();
			var countListFromUI = await serviceMgmtUtil.getListOfCountListColumnWiseFromTableWidget(problemManagementTestDataObject.prioritybyAgeBin);
			var countListFromES = await esQueriesProblem.getListOfCountListFromPrioritybyAgeBinTableWidget(problemManagementTestData.eSProblemSearchIndex, tenantId, firstColCellValuesList, columnList);
			// Verify the list of list of count values for each row filter from UI with the list of list of count values from ES query response
			expect(util.compareNestedArrays(countListFromUI, countListFromES)).toBe(true);
		});
	}

	if(isEnabledESValidation) {
		it("Validate all value count from 'Priority by Status' Table widget with ES Query data  on 'Ticket Overview' Tab for Problem Management", async function () {
			util.switchToCssrIFramebyID(frames.mcmpIframe, frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			logger.info("------ES Query validation------");
			// Get list of cell values from the first column [row filter names]
			var firstColCellValuesList = await serviceMgmtUtil.getFirstColumnCellValuesListFromTableWidget(problemManagementTestDataObject.prioritybyStatus);
			var columnList = await serviceMgmtUtil.getColumnNameListFromTableWidget(problemManagementTestDataObject.prioritybyStatus);
			columnList.shift();
			var countListFromUI = await serviceMgmtUtil.getListOfCountListColumnWiseFromTableWidget(problemManagementTestDataObject.prioritybyStatus);
			var countListFromES = await esQueriesProblem.getListOfCountListFromPriorityByStatusTableWidget(problemManagementTestData.eSProblemSearchIndex, tenantId, firstColCellValuesList, columnList);
			// Verify the list of list of count values for each row filter from UI with the list of list of count values from ES query response
			expect(util.compareNestedArrays(countListFromUI, countListFromES)).toBe(true);
		});
	}
*/
	if(isEnabledESValidation) {
		// Commented due to kibana limitation wave charts count can not be verified properly. Defect ID: AIOP-6522

		// it("Validate all value count from 'Trend Of Incoming Problem Volume by Priority' Multi-wave data points widget with ES Query data  on 'Ticket Overview' Tab for Problem Management", async function () {
		// 	util.switchToCssrIFramebyID(frames.mcmpIframe, frames.cssrIFrame);
		// 	await util.waitForInvisibilityOfKibanaDataLoader();
		// 	logger.info("------ES Query validation------");
		// 	var filterValues = await serviceMgmtUtil.getAllValuesFromMultiselectFilter(problemManagementTestData.createdFilterName);
		// 	expect(util.isListEmpty(filterValues)).toBe(false);
		// 	if(!util.isListEmpty(filterValues)){
		// 		var countListFromUI = await serviceMgmtUtil.getListOfTotalCountListFromMultiWaveGraphPoints(problemManagementTestData.trendOfIncomingProblemVolumebyPriority, problemManagementTestData.createdFilterName, filterValues);
		// 		var countListFromES = await esQueriesProblem.getListOfCountListFromTrendOfIncomingProblemVolumebyPriorityMultiWaveWidget(problemManagementTestData.eSProblemSearchIndex, tenantId, filterValues);
		// 		// Verify the list of list of count values for each row filter from UI with the list of list of count values from ES query response
		// 		expect(util.compareNestedArrays(countListFromUI, countListFromES)).toBe(true);
		// 	}
		// });

		// Need to skip the test case as global filters Created and Resolved are not available now 
		// it("Validate count from 'Priority by Age Bin' Table widget applying 'Created' filter values with ES Query data from 'Trend Of Incoming Problem Volume by Priority' Multi-wave data points widget on 'Ticket Overview' Tab for Problem Management", async function () {
		// 	util.switchToCssrIFramebyID(frames.mcmpIframe, frames.cssrIFrame);
		// 	await util.waitForInvisibilityOfKibanaDataLoader();
		// 	logger.info("------ES Query validation------");
		// 	var filterValues = await serviceMgmtUtil.getAllValuesFromMultiselectFilter(problemManagementTestData.createdFilterName);
		// 	expect(util.isListEmpty(filterValues)).toBe(false);
		// 	if(!util.isListEmpty(filterValues)){
		// 		var countListFromUI = await serviceMgmtUtil.getListOfSummaryCountListFromTableWidget(problemManagementTestData.prioritybyAgeBin, problemManagementTestData.createdFilterName, filterValues);
		// 		var countListFromES = await esQueriesProblem.getListOfCountListFromTrendOfIncomingProblemVolumebyPriorityMultiWaveWidget(problemManagementTestData.eSProblemSearchIndex, tenantId, filterValues);
		// 		// Verify the list of list of count values for each row filter from UI with the list of list of count values from ES query response
		// 		expect(util.compareNestedArrays(countListFromUI, countListFromES)).toBe(true);
		// 	}
		// });
	}
/*
	if(isEnabledESValidation) {
		it("Validate all value count from 'Ticket count' Table widget with ES Query data  on 'Overall Trend' Tab for Problem Management", async function () {
			await serviceMgmtUtil.clickOnTabLink(problemManagementTestDataObject.overallTrendLinkText);
			util.switchToFrameById(frames.cssrIFrame);
			util.waitForAngular();
			await util.waitForInvisibilityOfKibanaDataLoader();
			logger.info("------ES Query validation------");
			// Get list of cell values from the first column [row filter names]
			var countListFromUI = await serviceMgmtUtil.getListOfCountListColumnWiseFromTableWidget(problemManagementTestDataObject.ticketCount);
			var countListFromES = await esQueriesProblem.getListOfCountListFromTicketCountTableWidget(problemManagementTestData.eSProblemSearchIndex, tenantId);
			// Verify the list of list of count values for each row filter from UI with the list of list of count values from ES query response
			expect(util.compareNestedArrays(countListFromUI, countListFromES)).toBe(true);
		});
	}
*/
	if(isEnabledESValidation) {
		// Commented due to kibana limitation wave charts count can not be verified properly. Defect ID: AIOP-6522

		// it("Validate all value count from 'Trend Of Incoming Problem Volume by Priority' Multi-wave data points widget with ES Query data  on 'Overall Trend' Tab for Problem Management", async function () {
		// 	await serviceMgmtUtil.clickOnTabLink(problemManagementTestDataObject.overallTrendLinkText);
		// 	util.switchToFrameById(frames.cssrIFrame);
		// 	util.waitForAngular();
		// 	await util.waitForInvisibilityOfKibanaDataLoader();
		// 	logger.info("------ES Query validation------");
		// 	var filterValues = await serviceMgmtUtil.getAllValuesFromMultiselectFilter(problemManagementTestData.createdFilterName);
		// 	expect(util.isListEmpty(filterValues)).toBe(false);
		// 	if(!util.isListEmpty(filterValues)){
		// 		var countListFromUI = await serviceMgmtUtil.getListOfTotalCountListFromMultiWaveGraphPoints(problemManagementTestData.trendOfIncomingProblemVolumebyPriority, problemManagementTestData.createdFilterName, filterValues);
		// 		var countListFromES = await esQueriesProblem.getListOfCountListFromTrendOfIncomingProblemVolumebyPriorityMultiWaveWidget(problemManagementTestData.eSProblemSearchIndex, tenantId, filterValues);
		// 		// Verify the list of list of count values for each row filter from UI with the list of list of count values from ES query response
		// 		expect(util.compareNestedArrays(countListFromUI, countListFromES)).toBe(true);
		// 	}
		// });

		// Need to skip the test case as global filters Created and Resolved are not available now 
		// it("Validate count from 'Ticket Count' Table widget applying 'Created' filter values with ES Query data from 'Trend Of Incoming Problem Volume by Priority' Multi-wave data points widget on 'Overall Trend' Tab for Problem Management", async function () {
		// 	await serviceMgmtUtil.clickOnTabLink(problemManagementTestDataObject.overallTrendLinkText);
		// 	util.switchToFrameById(frames.cssrIFrame);
		// 	util.waitForAngular();
		// 	await util.waitForInvisibilityOfKibanaDataLoader();
		// 	logger.info("------ES Query validation------");
		// 	var filterValues = await serviceMgmtUtil.getAllValuesFromMultiselectFilter(problemManagementTestData.createdFilterName);
		// 	expect(util.isListEmpty(filterValues)).toBe(false);
		// 	if(!util.isListEmpty(filterValues)){
		// 		var countListFromUI = await serviceMgmtUtil.getListOfListOfColumnValuesFromTableWidget(problemManagementTestData.ticketCount, problemManagementTestData.createdFilterName, filterValues);
		// 		var countListFromES = await esQueriesProblem.getListOfCountListFromTrendOfIncomingProblemVolumebyPriorityMultiWaveWidget(problemManagementTestData.eSProblemSearchIndex, tenantId, filterValues);
		// 		// Verify the list of list of count values for each row filter from UI with the list of list of count values from ES query response
		// 		expect(util.compareNestedArrays(countListFromUI, countListFromES)).toBe(true);
		// 	}
		// });
	}

	// Commented due to kibana limitation wave charts count can not be verified properly. Defect ID: AIOP-6522

	// if(isEnabledESValidation) {
	// 	it("Validate all value count from 'Trend Of Resolved Problem Volume by Priority' Multi-wave data points widget with ES Query data  on 'Overall Trend' Tab for Problem Management", async function () {
	// 		await serviceMgmtUtil.clickOnTabLink(problemManagementTestDataObject.overallTrendLinkText);
	// 		util.switchToFrameById(frames.cssrIFrame);
	// 		util.waitForAngular();
	// 		await util.waitForInvisibilityOfKibanaDataLoader();
	// 		logger.info("------ES Query validation------");
	// 		var filterValues = await serviceMgmtUtil.getAllValuesFromMultiselectFilter(problemManagementTestData.resolvedFilterName);
	// 		expect(util.isListEmpty(filterValues)).toBe(false);
	// 		if(!util.isListEmpty(filterValues)){
	// 			var countListFromUI = await serviceMgmtUtil.getListOfTotalCountListFromMultiWaveGraphPoints(problemManagementTestData.TrendOfResolvedProblemVolumebyPriority, problemManagementTestData.resolvedFilterName, filterValues);
	// 			var countListFromES = await esQueriesProblem.getListOfCountListFromTrendOfResolvedProblemVolumebyPriorityMultiWaveWidget(problemManagementTestData.eSProblemSearchIndex, tenantId, filterValues);
	// 			// Verify the list of list of count values for each row filter from UI with the list of list of count values from ES query response
	// 			expect(util.compareNestedArrays(countListFromUI, countListFromES)).toBe(true);
	// 		}
	// 	});
	// }
/*
	if(isEnabledESValidation) {
		it("Validate all value count from 'Owner Group by Volume of Problem' Name list widget with ES Query data  on 'Overall Trend' Tab for Problem Management", async function () {
			await serviceMgmtUtil.clickOnTabLink(problemManagementTestDataObject.overallTrendLinkText);
			util.switchToFrameById(frames.cssrIFrame);
			util.waitForAngular();
			await util.waitForInvisibilityOfKibanaDataLoader();
			logger.info("------ES Query validation------");
			var listOfNames = await serviceMgmtUtil.getAllNamesFromNameListWidget(problemManagementTestData.OwnerGroupbyVolumeofProblemWidget);
			var countListFromUI = await serviceMgmtUtil.getListOfCountForNameListWidgetSections(problemManagementTestData.OwnerGroupbyVolumeofProblemWidget, listOfNames);
			var countListFromES = await esQueriesProblem.getCountListForOwnerGroupByVolumeOfProblemWidget(problemManagementTestData.eSProblemSearchIndex, tenantId, listOfNames);
			expect(util.compareArrays(countListFromUI, countListFromES)).toBe(true);
		});
	}

	if (isEnabledESValidation) {
		it("Validate all value count from 'Owner Group by Volume of Problem' Horizontal bar chart with ES Query data  on 'Top Volume Drivers' Tab for Problem Management", async function () {
			await serviceMgmtUtil.clickOnTabLink(problemManagementTestDataObject.topVolumeDriversLinktext);
			util.switchToFrameById(frames.cssrIFrame);
			util.waitForAngular();
			await util.waitForInvisibilityOfKibanaDataLoader();
			logger.info("------ES Query validation------");
			// Get Y-Axis labels list from horizontal bar chart widget
			var yAxisLabels = await serviceMgmtUtil.getYAxisLabelsForHorizontalBarGraphWidget(problemManagementTestData.OwnerGroupbyVolumeofProblem);
			var problemCountUIList = await serviceMgmtUtil.getCountListForHorizontalBarGraphWidget(problemManagementTestData.OwnerGroupbyVolumeofProblem, yAxisLabels);
			var problemCountESList = await esQueriesProblem.getOwnerGroupByVolumeOfProblemHorizontalBarGraphCountList(problemManagementTestData.eSProblemSearchIndex, tenantId, yAxisLabels);
			// Verify the list of count values for each Y-axis label from UI with the list of count values from ES query response
			expect(util.compareArrays(problemCountUIList, problemCountESList)).toBe(true);
		});
	}

	if(isEnabledESValidation) {
		it("Validate all value count from 'Ticket count' Table widget with ES Query data  on 'Top Volume Drivers' Tab for Problem Management", async function () {
			await serviceMgmtUtil.clickOnTabLink(problemManagementTestDataObject.topVolumeDriversLinktext);
			util.switchToFrameById(frames.cssrIFrame);
			util.waitForAngular();
			await util.waitForInvisibilityOfKibanaDataLoader();
			logger.info("------ES Query validation------");
			// Get list of cell values from the first column [row filter names]
			var countListFromUI = await serviceMgmtUtil.getListOfCountListColumnWiseFromTableWidget(problemManagementTestDataObject.ticketCount);
			var countListFromES = await esQueriesProblem.getListOfCountListFromTicketCountTableWidget(problemManagementTestData.eSProblemSearchIndex, tenantId);
			// Verify the list of list of count values for each row filter from UI with the list of list of count values from ES query response
			expect(util.compareNestedArrays(countListFromUI, countListFromES)).toBe(true);
		});
	}

	if(isEnabledESValidation) {
		it("Validate all value count from 'Owner Group Summary' Table widget with ES Query data  on 'Top Volume Drivers' Tab for Problem Management", async function () {
			await serviceMgmtUtil.clickOnTabLink(problemManagementTestDataObject.topVolumeDriversLinktext);
			util.switchToFrameById(frames.cssrIFrame);
			util.waitForAngular();
			await util.waitForInvisibilityOfKibanaDataLoader();
			logger.info("------ES Query validation------");
			// Get list of cell values from the first column [row filter names]
			var firstColCellValuesList = await serviceMgmtUtil.getFirstColumnCellValuesListFromTableWidget(problemManagementTestDataObject.OwnerGroupSummary);
			var countListFromUI = await serviceMgmtUtil.getListOfCountListRowWiseFromTableWidget(problemManagementTestDataObject.OwnerGroupSummary, firstColCellValuesList);
			var countListFromES = await esQueriesProblem.getListOfCountListFromOwnerGroupSummaryTableWidget(problemManagementTestData.eSProblemSearchIndex, tenantId, firstColCellValuesList);
			// Verify the list of list of count values for each row filter from UI with the list of list of count values from ES query response
			expect(util.compareNestedArrays(countListFromUI, countListFromES)).toBe(true);
		});
	}

	if(isEnabledESValidation) {
		it("Validate all value count from 'Mined Category by Volume of Problem' Horizontal bar chart with ES Query data  on 'Top Volume Drivers' Tab for Problem Management", async function () {
			await serviceMgmtUtil.clickOnTabLink(problemManagementTestDataObject.topVolumeDriversLinktext);
			util.switchToFrameById(frames.cssrIFrame);
			util.waitForAngular();
			await util.waitForInvisibilityOfKibanaDataLoader();
			logger.info("------ES Query validation------");
			// Get Y-Axis labels list from horizontal bar chart widget
			var yAxisLabels = await serviceMgmtUtil.getYAxisLabelsForHorizontalBarGraphWidget(problemManagementTestData.MinedCategorybyVolumeOfProblem);
			var problemCountUIList = await serviceMgmtUtil.getCountListForHorizontalBarGraphWidget(problemManagementTestData.MinedCategorybyVolumeOfProblem, yAxisLabels);
			var problemCountESList = await esQueriesProblem.getMinedCategoryByVolumeOfProblemHorizontalBarGraphCountList(problemManagementTestData.eSProblemSearchIndex, tenantId, yAxisLabels);
			// Verify the list of count values for each Y-axis label from UI with the list of count values from ES query response
			expect(util.compareArrays(problemCountUIList, problemCountESList)).toBe(true);
		});
	}
*/
	afterAll(async function() {
		await launchpad_page.clickOnLogoutAndLogin(browser.params.username, browser.params.password);
	});
});
