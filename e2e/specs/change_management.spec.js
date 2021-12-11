/**
 * Created by : Pushpraj
 * created on : 12/02/2020
 */

"use strict";
var logGenerator = require("../../helpers/logGenerator.js"),
	logger = logGenerator.getApplicationLogger(),
	change_management = require('../pageObjects/change_management.pageObject.js'),
	problem_management = require('../pageObjects/problem_management.pageObject.js'),
	appUrls = require('../../testData/appUrls.json'),
	util = require('../../helpers/util.js'),
	serviceMgmtUtil = require('../../helpers/serviceMgmtUtil.js'),
	dashboardTestData = require('../../testData/cards/dashboardTestData.json'),
	changeManagementTestData = require('../../testData/cards/changeManagementTestData.json'),
	launchpad = require('../pageObjects/launchpad.pageObject.js'),
	launchpadTestData = require('../../testData/cards/launchpadTestData.json'),
	frames = require('../../testData/frames.json'),
	expected_values = require('../../expected_values.json'),
	change_Mgmt_expected_values = require('../../testData/expected_value/change_management_expected_values.json'),
	esQueriesChange = require('../../elasticSearchTool/esQuery_ChangePayload.js'),
	tenantId = browser.params.tenantId,
	dashboard = require('../pageObjects/dashboard.pageObject.js'),
	isEnabledESValidation = browser.params.esValidation;

describe('Change management - functionality ', function () {
	var change_management_page, dashboard_page, launchpad_page,problem_management_page;
	var changeManagementTestDataObject = JSON.parse(JSON.stringify(changeManagementTestData));
	var globalFilterList = [changeManagementTestDataObject.assignmentQueueFilterName, changeManagementTestDataObject.locationFilterName, changeManagementTestDataObject.assignmentGroupFilterName, changeManagementTestDataObject.statusFilterName, changeManagementTestDataObject.serviceLineFilterName]
	var datePickerGlobalFilterList = [changeManagementTestDataObject.createdOnFilterName, changeManagementTestDataObject.closedOnFilterName, changeManagementTestDataObject.scheduledStartFilterName, changeManagementTestDataObject.scheduledFinishFilterName]
	var expected_valuesObj, expected_ValuesChangeMgmtDashboard, expected_ValuesChangeMgmtTopography, expected_ValuesChangeMgmtTrend ,expected_values_change_Mgmt_Obj;
	beforeAll(function () {
		change_management_page = new change_management();
		dashboard_page = new dashboard();
		launchpad_page = new launchpad();
		problem_management_page = new problem_management();
		browser.driver.manage().window().maximize();
		expected_valuesObj = JSON.parse(JSON.stringify(expected_values));
		expected_values_change_Mgmt_Obj = JSON.parse(JSON.stringify(change_Mgmt_expected_values));
		expected_ValuesChangeMgmtDashboard = expected_values_change_Mgmt_Obj.dashboard.default_filters.expected_values;
		expected_ValuesChangeMgmtTopography = expected_values_change_Mgmt_Obj.topography.default_filters.expected_values;
		expected_ValuesChangeMgmtTrend = expected_values_change_Mgmt_Obj.trend.default_filters.expected_values;
	});

	beforeEach(function () {
		launchpad_page.open();
		expect(launchpad_page.getWelcomeMessageTxt()).toEqual(launchpadTestData.welcome);
		launchpad_page.clickOnHamburgerMenu(launchpadTestData.leftNavigationExpanded);
		launchpad_page.clickOnleftNavigationMenuBasedOnName(launchpadTestData.aIOpsIntelligentITOperationsBtn);
		launchpad_page.clickLeftNavCardBasedOnName(launchpadTestData.changeManagementCard);
		change_management_page.open();
	});

	// Need to skip the test case as global filter Created is not available now 
	// it('Verify the change count(change created) on Change Management card and kibana report', async function () {
	// 	launchpad_page.clickOnHamburgerMenu(launchpadTestData.leftNavigationExpanded);
	// 	launchpad_page.clickOnleftNavigationMenuBasedOnName(launchpadTestData.aIOpsIntelligentITOperationsBtn);
	// 	launchpad_page.clickLeftNavCardBasedOnName(launchpadTestData.dashboardCard);
	// 	dashboard_page.open();
	// 	var twoMonthsPreviousChangeCreatedValue = await dashboard_page.getMatrixBarGraphTicketText(dashboardTestData.changeManagement, dashboardTestData.previousSecondMonth, dashboardTestData.ticketCreated);
	// 	var oneMonthPreviousChangeCreatedValue = await dashboard_page.getMatrixBarGraphTicketText(dashboardTestData.changeManagement, dashboardTestData.previousFirstmonth, dashboardTestData.ticketCreated);
	// 	var currentMonthChangeCreatedValue = await dashboard_page.getMatrixBarGraphTicketText(dashboardTestData.changeManagement, dashboardTestData.currentMonth, dashboardTestData.ticketCreated);
	// 	var twoMonthsPreviousChangeImplementedValue = await dashboard_page.getMatrixBarGraphTicketText(dashboardTestData.changeManagement, dashboardTestData.previousSecondMonth, dashboardTestData.ticketResolved);
	// 	var oneMonthPreviousChangeImplementedValue = await dashboard_page.getMatrixBarGraphTicketText(dashboardTestData.changeManagement, dashboardTestData.previousFirstmonth, dashboardTestData.ticketResolved);
	// 	var currentMonthChangeImplementedValue = await dashboard_page.getMatrixBarGraphTicketText(dashboardTestData.changeManagement, dashboardTestData.currentMonth, dashboardTestData.ticketResolved);
	// 	dashboard_page.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.changeManagement);
	// 	util.switchToFrameById(frames.cssrIFrame);
	// 	util.waitForAngular();
	// 	await util.waitForInvisibilityOfKibanaDataLoader();
	// 	expect(util.getCurrentURL()).toMatch(appUrls.changeManagementPageUrl);

	// 	var twoMonthsPreviousName = util.getPreviousMonthName(2);
	// 	var oneMonthsPreviousName = util.getPreviousMonthName(1);
	// 	var currentMonthName = util.getPreviousMonthName(0);
	// 	//selects 2 month's Previous filter to fetch changes created 
	// 	serviceMgmtUtil.clickOnFilterButtonBasedOnName(changeManagementTestData.createdMonthFilterName);
	// 	serviceMgmtUtil.selectFilterValueBasedOnName(changeManagementTestData.createdMonthFilterName, twoMonthsPreviousName);
	// 	serviceMgmtUtil.clickOnApplyFilterButton(changeManagementTestData.createdMonthFilterName).then(async function () {
	// 		await util.waitForInvisibilityOfKibanaDataLoader();
	// 		expect(await serviceMgmtUtil.getKabianaBoardCardValueInKformatter(changeManagementTestData.createdChangesCardName)).toEqual(twoMonthsPreviousChangeCreatedValue);
	// 		expect(await serviceMgmtUtil.getKabianaBoardCardValueInKformatter(changeManagementTestData.implementedChangesCardName)).toEqual(twoMonthsPreviousChangeImplementedValue);
	// 		await serviceMgmtUtil.deselectFilterValue(changeManagementTestData.createdMonthFilterName, twoMonthsPreviousName);
	// 	});

	// 	//selects 1 month's Previous filter to fetch changes created 
	// 	serviceMgmtUtil.clickOnFilterButtonBasedOnName(changeManagementTestData.createdMonthFilterName);
	// 	serviceMgmtUtil.selectFilterValueBasedOnName(changeManagementTestData.createdMonthFilterName, oneMonthsPreviousName);
	// 	serviceMgmtUtil.clickOnApplyFilterButton(changeManagementTestData.createdMonthFilterName).then(async function () {
	// 		await util.waitForInvisibilityOfKibanaDataLoader();
	// 		expect(await serviceMgmtUtil.getKabianaBoardCardValueInKformatter(changeManagementTestData.createdChangesCardName)).toEqual(oneMonthPreviousChangeCreatedValue);
	// 		expect(await serviceMgmtUtil.getKabianaBoardCardValueInKformatter(changeManagementTestData.implementedChangesCardName)).toEqual(oneMonthPreviousChangeImplementedValue);
	// 		await serviceMgmtUtil.deselectFilterValue(changeManagementTestData.createdMonthFilterName, oneMonthsPreviousName);
	// 	});

	// 	//selects current month's filter to fetch changes created 
	// 	serviceMgmtUtil.clickOnFilterButtonBasedOnName(changeManagementTestData.createdMonthFilterName);
	// 	serviceMgmtUtil.selectFilterValueBasedOnName(changeManagementTestData.createdMonthFilterName, currentMonthName);
	// 	serviceMgmtUtil.clickOnApplyFilterButton(changeManagementTestData.createdMonthFilterName).then(async function () {
	// 		await util.waitForInvisibilityOfKibanaDataLoader();
	// 		expect(await serviceMgmtUtil.getKabianaBoardCardValueInKformatter(changeManagementTestData.createdChangesCardName)).toEqual(currentMonthChangeCreatedValue);
	// 		expect(await serviceMgmtUtil.getKabianaBoardCardValueInKformatter(changeManagementTestData.implementedChangesCardName)).toEqual(currentMonthChangeImplementedValue);
	// 		await serviceMgmtUtil.deselectFilterValue(changeManagementTestDataObject.createdMonthFilterName, currentMonthName);
	// 	});
	// });

	it('Validate Change Management title section, last updated Information  and all Tabs Present on Change Management Page', function () {
		var TabLinkList = [changeManagementTestDataObject.changeDashboardTabLink, changeManagementTestDataObject.trendTabLink]
		expect(util.getHeaderTitleText()).toEqual(changeManagementTestData.headerTitle);
		serviceMgmtUtil.clickOnLastUpdatedInfoIcon();
		expect(serviceMgmtUtil.getLastUpdatedInfoIconText()).toBe(changeManagementTestData.infoIconText)
		TabLinkList.forEach(function (tabLink) {
			expect(serviceMgmtUtil.getAllTabsLinkText()).toContain(tabLink);
		});
		serviceMgmtUtil.clickOnLastUpdatedInfoIcon();
	});

	/*it("Validate all widget Names are Present on 'change Dashboard' Tab for change Management", async function () {
		var widgetNameList = [changeManagementTestDataObject.createdChangesCardName, changeManagementTestDataObject.closedChangesCardName, changeManagementTestDataObject.backlogChangesCardName, changeManagementTestDataObject.opCoViewCardName,
		changeManagementTestDataObject.openPendingCardName, changeManagementTestDataObject.implementedChangesCardName, changeManagementTestDataObject.FSCHrsCardName, changeManagementTestDataObject.expeditedCardName, changeManagementTestDataObject.emergencyCardName, changeManagementTestDataObject.categoryViewCardName,
		changeManagementTestDataObject.normalCardName, changeManagementTestDataObject.failedChangesCardName, changeManagementTestDataObject.successChangesCardName, changeManagementTestDataObject.changeAgingBucketCardName,
		changeManagementTestDataObject.changeTypePercentCardName, changeManagementTestDataObject.exceptionReasonCardName, changeManagementTestDataObject.unauthorizedPercentCardName, changeManagementTestDataObject.changeStatusCardName, changeManagementTestDataObject.top25AssignmentGroupCardName,
		changeManagementTestDataObject.failedandSuccessfulPercentCardName, changeManagementTestDataObject.changeRiskCardName, changeManagementTestDataObject.regionViewCardName, changeManagementTestDataObject.closureCodesCardName, changeManagementTestDataObject.serviceLineCardName,changeManagementTestDataObject.changeTicketDetailsCardName,changeManagementTestDataObject.Top25SiteIDsCardName,changeManagementTestDataObject.standardCardName,
		changeManagementTestDataObject.Top25StreetAddressesCardName]
		var widgetTextList = [changeManagementTestDataObject.createdChangesCardName, changeManagementTestDataObject.closedChangesCardName, changeManagementTestDataObject.backlogChangesCardName, changeManagementTestDataObject.emergencyCardName,
		changeManagementTestDataObject.openPendingCardName, changeManagementTestDataObject.implementedChangesCardName, changeManagementTestDataObject.FSCHrsCardName, changeManagementTestDataObject.expeditedCardName,
		changeManagementTestDataObject.normalCardName, changeManagementTestDataObject.failedChangesCardName, changeManagementTestDataObject.successChangesCardName]
		//verify landing on correct Tab
		await expect(await serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.changeDashboardTabLink)).toBe(true);
		await expect(await serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.trendTabLink)).toBe(false);
		await util.switchToFrameById(frames.cssrIFrame);
		await util.waitForAngular()
		await util.waitForInvisibilityOfKibanaDataLoader();

		// check all widgets on Kibana report are Present
		widgetNameList.forEach(async function (widgetName) {
			await expect(await serviceMgmtUtil.getAllKibanaReportWidgetsNameText()).toContain(widgetName);
		})
		//check widget data is present
		widgetTextList.forEach(function (widgetName) {
			expect(serviceMgmtUtil.checkIfDataPresentOnwidget(widgetName)).toBe(true);
		});
		if (browser.params.dataValiadtion) {
			var createdChangesValue = await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestDataObject.createdChangesCardName);
			var backlogChangesValue = await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestDataObject.backlogChangesCardName);
			var openPendingValue = await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestDataObject.openPendingCardName);
			var changeTypeExpeditedValue = await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestDataObject.expeditedCardName);
			var changeTypeEmergencyValue = await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestDataObject.emergencyCardName);
			var changeTypeNormalValue = await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestDataObject.normalCardName);
			var failedChangesValue = await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestDataObject.failedChangesCardName);
			logger.info("------data validation------");
			expect(util.stringToInteger(createdChangesValue)).toEqual(expected_ValuesChangeMgmtDashboard.created_changes.created);
			expect(util.stringToInteger(backlogChangesValue)).toEqual(expected_ValuesChangeMgmtDashboard.backlog_changes);
			expect(util.stringToInteger(openPendingValue)).toEqual(expected_ValuesChangeMgmtDashboard.open_pending);
			expect(util.stringToInteger(changeTypeExpeditedValue)).toEqual(expected_ValuesChangeMgmtDashboard.change_type_Expedited);
			expect(util.stringToInteger(changeTypeEmergencyValue)).toEqual(expected_ValuesChangeMgmtDashboard.change_type_Emergency);
			expect(util.stringToInteger(changeTypeNormalValue)).toEqual(expected_ValuesChangeMgmtDashboard.change_type_Normal);
			expect(util.stringToInteger(failedChangesValue)).toEqual(expected_ValuesChangeMgmtDashboard.failed_changes);

		}
	}); 

	it("verify global Filter's Presence ,Expantion, default Tooltip text  on 'change Dashboard' Tab for change Management", async function () {
		await expect(await serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.changeDashboardTabLink)).toBe(true);
		await util.switchToFrameById(frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();
		// check all global filters on Kibana report are Present
		globalFilterList.forEach(async function (globalFilter) {
			await expect(await serviceMgmtUtil.getAllFiltersButtonNameText(globalFilter)).toContain(globalFilter);
		})
		//check all date Picker Global filters on Kibana report are Present
		datePickerGlobalFilterList.forEach(async function (datePickerGlobalFilter) {
			await expect(await serviceMgmtUtil.getAllFiltersButtonNameText(datePickerGlobalFilter)).toContain(datePickerGlobalFilter);
		})
		// Validate the default global filter is applied for "Last 210 days" on Created date-range filter
		await expect(await serviceMgmtUtil.getDateRangeFilterDateDifference(changeManagementTestDataObject.createdOnFilterName)).toEqual(changeManagementTestDataObject.defaultCreatedFilterDateRangeDiff);
		// Validate each date-range filter is expanded or not
		datePickerGlobalFilterList.forEach(async function (dateRangeFilter) {
			await serviceMgmtUtil.clickOnDateRangeFilterButton(dateRangeFilter);
			await expect(await serviceMgmtUtil.verifyDateRangeFilterPanelExpanded(dateRangeFilter)).toBe(true);
		});
		// Validate each filter is expanded or not
		globalFilterList.forEach(async function (globalFilter) {
			await serviceMgmtUtil.clickOnFilterButtonBasedOnName(globalFilter);
			await expect(await serviceMgmtUtil.verifyFilterPanelExpanded(globalFilter)).toBe(true);
		});
	});

	it("Verify Global filters functionality on 'Change Dashboard' tab", async function () {
		expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.changeDashboardTabLink)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();
		// Iterate through each multi-select filter, select first value
		var filterValues = await serviceMgmtUtil.selectAndDeselectFilterValue(globalFilterList);
		await expect(filterValues.appliedFilterValues).toEqual(filterValues.selectedFilterValues);
		// Iterate through each date-range filter, select first value
		await serviceMgmtUtil.selectAndVerifyDateRangeFilterButton(changeManagementTestData.createdFilterName)
		await serviceMgmtUtil.selectAndVerifyDateRangeFilterButton(changeManagementTestData.scheduledStartFilterName)
		await serviceMgmtUtil.selectAndVerifyDateRangeFilterButton(changeManagementTestData.closedFilterName)
		await serviceMgmtUtil.selectAndVerifyDateRangeFilterButton(changeManagementTestData.scheduledFinishFilterName)
		// Validate default values for date-range filter after clearing it
		await expect(await serviceMgmtUtil.getDateRangeFilterDateDifference(changeManagementTestData.createdOnFilterName)).toEqual(changeManagementTestData.defaultCreatedFilterDateRangeDiff);
	});
	
	it("Validate 'change Aging Bucket' Acending Decending Order Features  on 'change Dashboard' Tab for change Management", async function () {
		expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.changeDashboardTabLink)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		util.waitForInvisibilityOfKibanaDataLoader();
		var changeAgingBucketcolumnNames = await serviceMgmtUtil.getColumnNamesBasedOnTableName(changeManagementTestData.changeAgingBucketCardName)
		expect(changeAgingBucketcolumnNames).toContain(changeManagementTestData.columnNameFilters);
		expect(changeAgingBucketcolumnNames).toContain(changeManagementTestData.columNameSummary);
		expect(changeAgingBucketcolumnNames).toContain(changeManagementTestData.columnNameInProgress);
		expect(changeAgingBucketcolumnNames).toContain(changeManagementTestData.columnNameReview);
		changeAgingBucketcolumnNames.shift();
		await expect(await serviceMgmtUtil.checkAscendingDescendingOrderOfTableItems(changeManagementTestData.changeAgingBucketCardName, changeAgingBucketcolumnNames, changeManagementTestData.OrderTypeAcending, changeManagementTestData.cloumnTypeNumeric)).toBe(true);
		await expect(await serviceMgmtUtil.checkAscendingDescendingOrderOfTableItems(changeManagementTestData.changeAgingBucketCardName, changeAgingBucketcolumnNames, changeManagementTestData.OrderTypeDecending, changeManagementTestData.cloumnTypeNumeric)).toBe(true);
	}); */

	it("Validate all  widget Names are Present on 'Trends' Tab for change Management", function () {
		var widgetNameList = [changeManagementTestDataObject.createdChangeTrendCardName, changeManagementTestDataObject.closedChangeTrendCardName, changeManagementTestDataObject.createdChangeWeeklyTrendCardName, changeManagementTestDataObject.timeInDayChangeCreatedCardName, changeManagementTestDataObject.timeInDayChangeClosedCardName,
		changeManagementTestDataObject.closedChangeWeeklyTrendCardName,changeManagementTestDataObject.changeTicketDetailsCardName, changeManagementTestDataObject.serviceLineCardName, changeManagementTestDataObject.changeRiskCardName,changeManagementTestDataObject.trendChangeType, changeManagementTestDataObject.closureCodesCardName]
		serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.trendTabLink);
		expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.changeDashboardTabLink)).toBe(false);
		expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.trendTabLink)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		util.waitForAngular()
		util.waitForInvisibilityOfKibanaDataLoader();
		// check all widgets on Kibana report are Present
		widgetNameList.forEach(function (widgetName) {
			expect(serviceMgmtUtil.getAllKibanaReportWidgetsNameText()).toContain(widgetName);
		})
	});

	it("verify global Filter's Presence ,Expantion on 'Trends' Tab for change Management",async  function () {
		await serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.trendTabLink);
		await expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.trendTabLink)).toBe(true);
		await util.switchToFrameById(frames.cssrIFrame);
		// check all global filters on Kibana report are Present
		globalFilterList.forEach(async function (globalFilter) {
			await expect(await serviceMgmtUtil.getAllFiltersButtonNameText(globalFilter)).toContain(globalFilter);
		})
		//check all date Picker Global filters on Kibana report are Present
		datePickerGlobalFilterList.forEach(async function (datePickerGlobalFilter) {
			await expect(await serviceMgmtUtil.getAllFiltersButtonNameText(datePickerGlobalFilter)).toContain(datePickerGlobalFilter);
		})
		// Validate each date-range filter is expanded or not
		datePickerGlobalFilterList.forEach(async function (dateRangeFilter) {
			await serviceMgmtUtil.clickOnDateRangeFilterButton(dateRangeFilter);
			await expect(await serviceMgmtUtil.verifyDateRangeFilterPanelExpanded(dateRangeFilter)).toBe(true);
		});
		// Validate the default global filter is applied for "Last 210 days" on Created date-range filter
		await expect(await serviceMgmtUtil.getDateRangeFilterDateDifference(changeManagementTestDataObject.createdOnFilterName)).toEqual(changeManagementTestDataObject.defaultCreatedFilterDateRangeDiff);
		// Validate each filter is expanded or not
		globalFilterList.forEach(async function (globalFilter) {
			await serviceMgmtUtil.clickOnFilterButtonBasedOnName(globalFilter);
			await expect(await serviceMgmtUtil.verifyFilterPanelExpanded(globalFilter)).toBe(true);
		});
	});

	it("Verify Global filters functionality on 'Trends' tab", async function () {
		serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.trendTabLink);
		expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.trendTabLink)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();
		// Iterate through each multi-select filter, select first value
		var filterValues = await serviceMgmtUtil.selectAndDeselectFilterValue(globalFilterList);
		await expect(filterValues.appliedFilterValues).toEqual(filterValues.selectedFilterValues);
		// Iterate through each date-range filter, select first value
		await serviceMgmtUtil.selectAndVerifyDateRangeFilterButton(changeManagementTestData.createdFilterName)
		await serviceMgmtUtil.selectAndVerifyDateRangeFilterButton(changeManagementTestData.scheduledStartFilterName)
		await serviceMgmtUtil.selectAndVerifyDateRangeFilterButton(changeManagementTestData.closedFilterName)
		await serviceMgmtUtil.selectAndVerifyDateRangeFilterButton(changeManagementTestData.scheduledFinishFilterName)
		// Validate default values for date-range filter after clearing it
		await expect(await serviceMgmtUtil.getDateRangeFilterDateDifference(changeManagementTestData.createdOnFilterName)).toEqual(changeManagementTestData.defaultCreatedFilterDateRangeDiff);
	});

	it("Verify Local Filter Functionality doesn't persist across all the Tabs for change Management", async function () {
		expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.changeDashboardTabLink)).toBe(true);
		util.switchToCssrIFramebyID(frames.mcmpIframe, frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();
		var createdChangesVal = await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestData.createdChangeCardName);
		var createdChangesValOnChangeDashboardTabBeforeFilter = util.stringToInteger(createdChangesVal);
		var changeRisklegendList = await change_management_page.getLegendListBasedOnWidgetName(changeManagementTestData.changeRiskCardName);
		expect(await util.isListEmpty(changeRisklegendList)).toBe(false);
		change_management_page.clickOnChartSectionBasedOnDataLabel(changeManagementTestData.changeRiskCardName, changeRisklegendList[0]);
		expect(serviceMgmtUtil.isDisplayedSelectFiltersDialogueBox()).toBe(true);
		serviceMgmtUtil.clickOnSelectFiltersDialogueBoxApplyButton();
		await util.waitForInvisibilityOfKibanaDataLoader();
		createdChangesVal = await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestData.createdChangeCardName);
		var createdChangesValOnChangeDashboardTabAfterFilter = util.stringToInteger(createdChangesVal);
		expect(await change_management_page.verifyChartFilterIsPresent(changeManagementTestData.changeRiskCardName, changeRisklegendList[0])).toBe(true);
		expect(await change_management_page.verifyChartFilterIsPresent(changeManagementTestData.changeRiskCardName, changeRisklegendList[1])).toBe(false);
		expect(await change_management_page.verifyChartFilterIsPresent(changeManagementTestData.changeRiskCardName, changeRisklegendList[2])).toBe(false);
		expect(await change_management_page.verifyChartFilterIsPresent(changeManagementTestData.changeRiskCardName, changeRisklegendList[3])).toBe(false);
		expect(await change_management_page.verifyChartFilterIsPresent(changeManagementTestData.changeRiskCardName, changeRisklegendList[4])).toBe(false);
		// Click on Trends Tab
		util.switchToDefault();
		util.switchToFrameById(frames.mcmpIframe);
		await serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.trendTabLink);
		await expect(await serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.trendTabLink)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();
		expect(await change_management_page.verifyChartFilterIsPresent(changeManagementTestData.changeRiskCardName, changeRisklegendList[0])).toBe(true);
		expect(await change_management_page.verifyChartFilterIsPresent(changeManagementTestData.changeRiskCardName, changeRisklegendList[1])).toBe(true);
		expect(await change_management_page.verifyChartFilterIsPresent(changeManagementTestData.changeRiskCardName, changeRisklegendList[2])).toBe(true);
		expect(await change_management_page.verifyChartFilterIsPresent(changeManagementTestData.changeRiskCardName, changeRisklegendList[3])).toBe(true);
		expect(await change_management_page.verifyChartFilterIsPresent(changeManagementTestData.changeRiskCardName, changeRisklegendList[4])).toBe(true);
		expect(createdChangesValOnChangeDashboardTabAfterFilter).toBeLessThanOrEqual(await serviceMgmtUtil.getTotalCountFromWaveGraphPoints(changeManagementTestData.createdChangeTrendCardName));
		expect(createdChangesValOnChangeDashboardTabBeforeFilter).toEqual(await serviceMgmtUtil.getTotalCountFromWaveGraphPoints(changeManagementTestData.createdChangeTrendCardName));
	});

/*	it("Verify Local Filter Functionality of 'Change Type' on 'change dashboard' Tab for change Management", async function () {
		expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.changeDashboardTabLink)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();
		var changeTypelegendName = await change_management_page.getLegendListBasedOnWidgetName(changeManagementTestData.changeTypePercentChartName);
		await expect(util.isListEmpty(changeTypelegendName)).toBe(false);
		await change_management_page.clickOnPieChartSectionBasedOnDataLabel(changeManagementTestData.changeTypePercentChartName, changeTypelegendName[1]);
		await util.waitForInvisibilityOfKibanaDataLoader();
		await expect(change_management_page.verifyPieChartFilterIsPresent(changeManagementTestData.changeTypePercentChartName, changeTypelegendName[1])).toBe(true);
		await expect(change_management_page.verifyPieChartFilterIsPresent(changeManagementTestData.changeTypePercentChartName, changeTypelegendName[0])).toBe(false);
		await expect(change_management_page.verifyPieChartFilterIsPresent(changeManagementTestData.changeTypePercentChartName, changeTypelegendName[2])).toBe(false);
	});

	// Protractor limitation
	// it("Verify Local Filter Functionality of 'exception reason' on 'change dashboard' Tab for change Management", async function () {
	// 	expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.changeDashboardTabLink)).toBe(true);
	// 	util.switchToFrameById(frames.cssrIFrame);
	// 	await util.waitForInvisibilityOfKibanaDataLoader();
	// 	var changeTypelegendName = await serviceMgmtUtil.getLegendNamesFromLocalFilter(changeManagementTestData.exceptionReasonCardName);
	// 	change_management_page.clickOnChartSectionBasedOnDataLabel(changeManagementTestData.exceptionReasonCardName, changeTypelegendName[0]);
	// 	util.waitForInvisibilityOfKibanaDataLoader();
	// });

	it("Verify Local Filter Functionality of 'Change Status' on 'change dashboard' Tab for change Management", async function () {
		expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.changeDashboardTabLink)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();
		if (browser.params.dataValiadtion) {
			var changeStatusBarValue = await serviceMgmtUtil.getTextValuesofHorizontalBar(changeManagementTestDataObject.changeStatusCardName);
			var YaxisChangeStatusBarLabels = await serviceMgmtUtil.getKibanaBarGraphYaxisLabelsBasedOnWidgetName(changeManagementTestDataObject.changeStatusCardName);
			var expectedValuesChangeMgmtDashboardChangeStatus = expected_ValuesChangeMgmtDashboard.change_status
			logger.info("------data validation------");
			for (var i = 0; i < YaxisChangeStatusBarLabels.length; i++) {
				expect(changeStatusBarValue[i]).toEqual(expectedValuesChangeMgmtDashboardChangeStatus[YaxisChangeStatusBarLabels[i]]);
			}
		}
		serviceMgmtUtil.clickOnGraphFirstHorizontalBar(changeManagementTestData.changeStatusCardName);
		await util.waitForInvisibilityOfKibanaDataLoader();
		expect(serviceMgmtUtil.getFirstBarGraphToolTipText(changeManagementTestData.graphtooltipText2, changeManagementTestData.changeStatusCardName)).toEqual(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestData.createdChangesCardName));
	});

	it("Verify Local Filter Functionality of 'Closure Codes' on 'change dashboard' Tab for change Management", async function () {
		expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.changeDashboardTabLink)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();
		if (browser.params.dataValiadtion) {
			var closureCodesBarValue = await serviceMgmtUtil.getTextValuesofHorizontalBar(changeManagementTestDataObject.closureCodesCardName);
			var YaxisClosureCodessBarLabels = await serviceMgmtUtil.getKibanaBarGraphYaxisLabelsBasedOnWidgetName(changeManagementTestDataObject.closureCodesCardName);
			var expectedValuesChangeMgmtDashboardClosureCodes = expected_ValuesChangeMgmtDashboard.closure_codes
			logger.info("------data validation------");
			for (var i = 0; i < YaxisClosureCodessBarLabels.length; i++) {
				expect(closureCodesBarValue[i]).toEqual(expectedValuesChangeMgmtDashboardClosureCodes[YaxisClosureCodessBarLabels[i]]);
			}
		}
		serviceMgmtUtil.clickOnGraphFirstHorizontalBar(changeManagementTestData.closureCodesCardName);
		util.waitForInvisibilityOfKibanaDataLoader();
		expect(serviceMgmtUtil.getFirstBarGraphToolTipText(changeManagementTestData.graphtooltipText2, changeManagementTestData.closureCodesCardName)).toEqual(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestData.createdChangesCardName));
	});

	// Protractor limitation
	// it("Verify Local Filter Functionality of 'Region View' on 'change dashboard' Tab for change Management", async function () {
	// 	expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.changeDashboardTabLink)).toBe(true);
	// 	util.switchToFrameById(frames.cssrIFrame);
	// 	await util.waitForInvisibilityOfKibanaDataLoader();
	// 	var changeTypelegendName = await serviceMgmtUtil.getLegendNamesFromLocalFilter(changeManagementTestData.regionViewCardName);
	// 	await change_management_page.clickOnChartSectionBasedOnDataLabel(changeManagementTestData.regionViewCardName, changeTypelegendName[1]);
	// 	await util.waitForInvisibilityOfKibanaDataLoader();
	// 	expect(await change_management_page.getToolTipTextForChartSectionBasedOnDataLabel(changeManagementTestData.regionViewCardName, changeTypelegendName[1])).toEqual(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestData.createdChangeCardName));
	// });

	it("Verify Local Filter Functionality of 'Change Risk' on 'change dashboard' Tab for change Management", async function () {
		expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.changeDashboardTabLink)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();
		var changeTypelegendName = await change_management_page.getAllChartLabels(changeManagementTestData.changeRiskCardName);
		var isListEmpty = util.isListEmpty(changeTypelegendName);
		if (!isListEmpty) {
			await change_management_page.clickOnChartSectionBasedOnDataLabel(changeManagementTestData.changeRiskCardName, changeTypelegendName[0]);
			await expect(await serviceMgmtUtil.isDisplayedSelectFiltersDialogueBox()).toBe(true);
			await serviceMgmtUtil.clickOnSelectFiltersDialogueBoxApplyButton();
			await util.waitForInvisibilityOfKibanaDataLoader();
			for (var i = 1; i < changeTypelegendName.length; i++) {
				if (changeTypelegendName[i] == changeTypelegendName[0]) {
					await expect(await change_management_page.verifyChartFilterIsPresent(changeManagementTestData.changeRiskCardName, changeTypelegendName[0])).toBe(true);
				} else {
					await expect(await change_management_page.verifyChartFilterIsPresent(changeManagementTestData.changeRiskCardName, changeTypelegendName[i])).toBe(false);
				}
			}
		}
		await expect(await change_management_page.getToolTipTextForChartSectionBasedOnDataLabel(changeManagementTestData.changeRiskCardName, changeTypelegendName[0])).toEqual(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestData.createdChangesCardName));
	});

	// Protractor limitation
	// it("Verify Local Filter Functionality of 'Region View' on 'Topography' Tab for change Management", async function () {
	// 	serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.topographyTabLink);
	// 	expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.topographyTabLink)).toBe(true);
	// 	util.switchToFrameById(frames.cssrIFrame);
	// 	util.waitForInvisibilityOfKibanaDataLoader();
	// 	var changeTypelegendName = await serviceMgmtUtil.getLegendNamesFromLocalFilter(changeManagementTestData.regionViewCardName);
	// 	change_management_page.clickOnChartSectionBasedOnDataLabel(changeManagementTestData.regionViewCardName, changeTypelegendName[1]);
	// 	util.waitForInvisibilityOfKibanaDataLoader();
	// 	expect(change_management_page.getToolTipTextForChartSectionBasedOnDataLabel(changeManagementTestData.regionViewCardName, changeTypelegendName[1])).toEqual(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestData.createdChangeCardName));
	// });
	/*	it("Verify applied Global filter persist across all tabs within Change management and won't persist when moved to another report page", async function () {
		serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.changeDashboardTabLink);
		// Verify if tab is selected, after clicking on it or not
		expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.changeDashboardTabLink)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();
		// Apply assignment Group filter with its first value
		await serviceMgmtUtil.clickOnFilterButtonBasedOnName(changeManagementTestDataObject.assignmentGroupFilterName);
		expect(await serviceMgmtUtil.verifyFilterPanelExpanded(changeManagementTestDataObject.assignmentGroupFilterName)).toBe(true);
		var filterValue = await serviceMgmtUtil.selectFirstFilterValueBasedOnName(changeManagementTestDataObject.assignmentGroupFilterName);
		await expect(filterValue).not.toBe(false)
		await serviceMgmtUtil.clickOnUpdateFilterButton(changeManagementTestDataObject.assignmentGroupFilterName);
		await serviceMgmtUtil.clickOnApplyFilterButton();
		await util.waitForInvisibilityOfKibanaDataLoader();
		// Verify if applied filter value is selected or not
		await serviceMgmtUtil.clickOnFilterButtonBasedOnName(changeManagementTestDataObject.assignmentGroupFilterName);
		var appliedFilter = await serviceMgmtUtil.getSelectedItemsFromCheckbox();
		await expect(filterValue).toBe(appliedFilter);
		// Navigate to' Trends' tab 
		util.switchToDefault();
		util.switchToFrameById(frames.mcmpIframe);
		serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.trendTabLink);
		expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.trendTabLink)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		await util.waitOnlyForInvisibilityOfKibanaDataLoader();
		// Verify if applied filter value is selected or not
		await serviceMgmtUtil.clickOnFilterButtonBasedOnName(changeManagementTestDataObject.assignmentGroupFilterName);
		var appliedFilter = await serviceMgmtUtil.getSelectedItemsFromCheckbox();
		await expect(filterValue).toBe(appliedFilter);
		util.switchToDefault();
		util.switchToFrameById(frames.mcmpIframe);
		// Navigate to Problem Management page
		await launchpad_page.clickOnHamburgerMenu(launchpadTestData.leftNavigationExpanded);
		await launchpad_page.clickOnleftNavigationMenuBasedOnName(launchpadTestData.aIOpsIntelligentITOperationsBtn);
		await launchpad_page.clickLeftNavCardBasedOnName(launchpadTestData.problemManagementCard);
		problem_management_page.open();
		// Navigate to Change Management page
		util.switchToDefault();
		util.switchToFrameById(frames.mcmpIframe);
		launchpad_page.clickOnHamburgerMenu(launchpadTestData.leftNavigationExpanded);
		launchpad_page.clickOnleftNavigationMenuBasedOnName(launchpadTestData.aIOpsIntelligentITOperationsBtn);
		launchpad_page.clickLeftNavCardBasedOnName(launchpadTestData.changeManagementCard);
		change_management_page.open();
		util.switchToFrameById(frames.cssrIFrame);
		// Click on same filter and fetch unselected values
		await serviceMgmtUtil.clickOnFilterButtonBasedOnName(changeManagementTestDataObject.assignmentGroupFilterName);
		expect(await serviceMgmtUtil.verifyFilterPanelExpanded(changeManagementTestDataObject.assignmentGroupFilterName)).toBe(true);
		var unSelectedFilterValues = await serviceMgmtUtil.getUnSelectedItemsFromCheckbox();
		expect(unSelectedFilterValues).toEqual(jasmine.arrayContaining([filterValue]));
	});
*/
	// Disable Test case because of Known issue: https://jira.gravitant.net/browse/AIOP-7557
	// it("Verify if Exception Reason data on chart is equal 100%", async function() {
	// 	serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.changeDashboardTabLink);
	// 	expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.changeDashboardTabLink)).toBe(true);
	// 	util.switchToFrameById(frames.cssrIFrame);
	// 	await util.waitForInvisibilityOfKibanaDataLoader();
	// 	util.waitForAngular();
	// 	var exceptionDatafromDashboard = await serviceMgmtUtil.getElementDataFrompieChart(changeManagementTestData.exceptionReasonCardName);
	// 	expect(Math.round(exceptionDatafromDashboard[1])).toEqual(100);
	// });

	it("Verify if Change type percentage data on chart is equal to 100%", async function() {
		serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.changeDashboardTabLink);
		expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.changeDashboardTabLink)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();
		util.waitForAngular();
		var changeTypeDatafromDashboard = await serviceMgmtUtil.getElementDataFrompieChart(changeManagementTestData.changeTypePercentChartName);
		expect(Math.round(changeTypeDatafromDashboard[1])).toEqual(100);
	});

	it("Verify if Failed and Success percentage is equal to 100%", async function() {
		serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.changeDashboardTabLink);
		expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.changeDashboardTabLink)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();
		util.waitForAngular();
		var pieChartDatafromDashboard = await serviceMgmtUtil.getElementDataFrompieChart(changeManagementTestData.failedandSuccessfulPercentCardName);
		expect(Math.round(pieChartDatafromDashboard[1])).toEqual(100);
	});

	it("Verify if Unauthorized percentage is equal to 100%", async function() {
		serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.changeDashboardTabLink);
		expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.changeDashboardTabLink)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();
		util.waitForAngular();
		var pieChartDatafromDashboard = await serviceMgmtUtil.getElementDataFrompieChart(changeManagementTestData.unauthorizedPercentCardName);
		expect(Math.round(pieChartDatafromDashboard[1])).toEqual(100);
	});

	/*it("Verify if Count of Created Changes matches with the breakup in Chart for Change Status", async function () {
		expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.changeDashboardTabLink)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();
		var changeStatusBarValue = await serviceMgmtUtil.getTextValuesofHorizontalBar(changeManagementTestDataObject.changeStatusCardName);
		var createdChangesChangeDashboardTab = await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestDataObject.createdChangesCardName);
		createdChangesChangeDashboardTab=createdChangesChangeDashboardTab.replace(/,/g, '');
		var createChanges = parseInt(createdChangesChangeDashboardTab)
		var sumChangeStatus = await serviceMgmtUtil.getSumStatusBarValue(changeStatusBarValue)
		expect(createChanges).toEqual(sumChangeStatus);
	});

	it("Verify Local Filter Functionality of 'Top 25 assignment group' on 'Change Dashboard' Tab for Change Management", async function(){
		await serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.changeDashboardTabLink);
		expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.changeDashboardTabLink)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();
		util.waitForAngular();
		// Get Created changes count before applying local filter
		var createdChangesBefore = util.stringToInteger(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestData.createdChangesCardName));
		// Get Implemented changes count before applying local filter
		var implementedChangesBefore = util.stringToInteger(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestData.implementedChangesCardName));
		// Get all names from name map widget
		var top25AssignmentGroupNamesFromWidget = await serviceMgmtUtil.getNamesFromWordCloud(changeManagementTestData.top25AssignmentGroupCardName);
		if(!util.isListEmpty(top25AssignmentGroupNamesFromWidget)){
			// Click on first name from name map widget
			await serviceMgmtUtil.clickOnSectionInNameListsFilters(changeManagementTestData.top25AssignmentGroupCardName, top25AssignmentGroupNamesFromWidget[0]);
			await util.waitForInvisibilityOfKibanaDataLoader();
			// Get Created changes and Implemented changes count after applying local filter
			var createdChangesAfter = util.stringToInteger(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestData.createdChangesCardName));
			var implementedChangesAfter = util.stringToInteger(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestData.implementedChangesCardName));
			// Verify if Created changes and Implemented changes count are less than or equal to the count values before applying local filter
			expect(createdChangesAfter).toBeLessThanOrEqual(createdChangesBefore);
			expect(implementedChangesAfter).toBeLessThanOrEqual(implementedChangesBefore);
			// Click on reset filters link to undo local filter applied
			await util.clickOnResetFilterLink();
			await util.waitForInvisibilityOfKibanaDataLoader();
			// Get Created changes and Implemented changes count after applying reset filters
			var createdChangesAfterReset = util.stringToInteger(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestData.createdChangesCardName));
			var implementedChangesAfterReset = util.stringToInteger(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestData.implementedChangesCardName));
			// Verify if Created changes and Implemented changes count are equal to the count values before applying local filter
			expect(createdChangesAfterReset).toEqual(createdChangesBefore);
			expect(implementedChangesAfterReset).toEqual(implementedChangesBefore);
		}
	});
*/
	it("Verify Local Filter Functionality of 'Service Line' on 'Change Dashboard' Tab for Change Management", async function(){
		await serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.changeDashboardTabLink);
		expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.changeDashboardTabLink)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();
		util.waitForAngular();
		// Get Created changes count before applying local filter
		var createdChangesBefore = util.stringToInteger(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestData.createdChangesCardName));
		// Get Implemented changes count before applying local filter
		var implementedChangesBefore = util.stringToInteger(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestData.implementedChangesCardName));
		// Get all names from name map widget
		var serviceLineNamesFromWidget = await serviceMgmtUtil.getLabelsFromWidget(changeManagementTestData.serviceLineCardName);
		if(!util.isListEmpty(serviceLineNamesFromWidget)){
			// Click on first name from name map widget
			await serviceMgmtUtil.clickOnSectionInNameListsFilters(changeManagementTestData.serviceLineCardName, serviceLineNamesFromWidget[0]);
			await util.waitForInvisibilityOfKibanaDataLoader();
			// Get Created changes and Implemented changes count after applying local filter
			var createdChangesAfter = util.stringToInteger(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestData.createdChangesCardName));
			var implementedChangesAfter = util.stringToInteger(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestData.implementedChangesCardName));
			// Verify if Created changes and Implemented changes count are less than or equal to the count values before applying local filter
			expect(createdChangesAfter).toBeLessThanOrEqual(createdChangesBefore);
			expect(implementedChangesAfter).toBeLessThanOrEqual(implementedChangesBefore);
			// Click on reset filters link to undo local filter applied
			await util.clickOnResetFilterLink();
			await util.waitForInvisibilityOfKibanaDataLoader();
			// Get Created changes and Implemented changes count after applying reset filters
			var createdChangesAfterReset = util.stringToInteger(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestData.createdChangesCardName));
			var implementedChangesAfterReset = util.stringToInteger(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestData.implementedChangesCardName));
			// Verify if Created changes and Implemented changes count are equal to the count values before applying local filter
			expect(createdChangesAfterReset).toEqual(createdChangesBefore);
			expect(implementedChangesAfterReset).toEqual(implementedChangesBefore);
		}
	});

	/*it("Verify Local Filter Functionality of 'Category View' on 'Change Dashboard' Tab for Change Management", async function(){
		await serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.changeDashboardTabLink);
		expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.changeDashboardTabLink)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();
		util.waitForAngular();
		// Get Created changes count before applying local filter
		var createdChangesBefore = util.stringToInteger(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestData.createdChangesCardName));
		// Get Implemented changes count before applying local filter
		var implementedChangesBefore = util.stringToInteger(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestData.implementedChangesCardName));
		// Get all names from name map widget
		var categoryViewNamesFromWidget = await serviceMgmtUtil.getNamesFromWordCloud(changeManagementTestData.categoryViewCardName);
		if(!util.isListEmpty(categoryViewNamesFromWidget)){
			// Click on first name from name map widget
			await serviceMgmtUtil.clickOnSectionInNameListsFilters(changeManagementTestData.categoryViewCardName, categoryViewNamesFromWidget[0]);
			await util.waitForInvisibilityOfKibanaDataLoader();
			// Get Created changes and Implemented changes count after applying local filter
			var createdChangesAfter = util.stringToInteger(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestData.createdChangesCardName));
			var implementedChangesAfter = util.stringToInteger(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestData.implementedChangesCardName));
			// Verify if Created changes and Implemented changes count are less than or equal to the count values before applying local filter
			expect(createdChangesAfter).toBeLessThanOrEqual(createdChangesBefore);
			expect(implementedChangesAfter).toBeLessThanOrEqual(implementedChangesBefore);
			// Click on reset filters link to undo local filter applied
			await util.clickOnResetFilterLink();
			await util.waitForInvisibilityOfKibanaDataLoader();
			// Get Created changes and Implemented changes count after applying reset filters
			var createdChangesAfterReset = util.stringToInteger(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestData.createdChangesCardName));
			var implementedChangesAfterReset = util.stringToInteger(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestData.implementedChangesCardName));
			// Verify if Created changes and Implemented changes count are equal to the count values before applying local filter
			expect(createdChangesAfterReset).toEqual(createdChangesBefore);
			expect(implementedChangesAfterReset).toEqual(implementedChangesBefore);
		}
	});
*/
	if (browser.params.dataValiadtion) {
		it("Verify Local Filter Functionality of 'closure codes' on 'Trends' Tab for change Management", async function () {
			serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.trendTabLink);
			expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.trendTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			util.waitForInvisibilityOfKibanaDataLoader();
			var closureCodesBarValue = await serviceMgmtUtil.getTextValuesofHorizontalBar(changeManagementTestDataObject.closureCodesCardName);
			var YaxisClosureCodessBarLabels = await serviceMgmtUtil.getKibanaBarGraphYaxisLabelsBasedOnWidgetName(changeManagementTestDataObject.closureCodesCardName);
			var expectedValuesChangeMgmtTrendClosureCodes = expected_ValuesChangeMgmtTrend.closure_codes
			logger.info("------data validation------");
			for (var i = 0; i < YaxisClosureCodessBarLabels.length; i++) {
				expect(closureCodesBarValue[i]).toEqual(expectedValuesChangeMgmtTrendClosureCodes[YaxisClosureCodessBarLabels[i]]);
			}
		});
	}
	
	if (browser.params.dataValiadtion) {
		it("Verify Local Filter Functionality of 'Service Lines' on 'Trends' Tab for change Management", async function () {
			serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.trendTabLink);
			expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.trendTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			util.waitForInvisibilityOfKibanaDataLoader();
			var serviceLinesBarValue = await serviceMgmtUtil.getTextValuesofHorizontalBar(changeManagementTestDataObject.serviceLineCardName);
			var YaxisServiceLinesBarLabels = await serviceMgmtUtil.getKibanaBarGraphYaxisLabelsBasedOnWidgetName(changeManagementTestDataObject.serviceLineCardName);
			var expectedValuesChangeMgmtTrendsServiceLines = expected_ValuesChangeMgmtTrend.service_line
			logger.info("------data validation------");
			for (var i = 0; i < YaxisServiceLinesBarLabels.length; i++) {
				expect(serviceLinesBarValue[i]).toEqual(expectedValuesChangeMgmtTrendsServiceLines[YaxisServiceLinesBarLabels[i]]);
			}
		});
	}
	
	if (browser.params.dataValiadtion) {
		it("Verify Local Filter Functionality of 'Change Type' on 'Trends' Tab for change Management", async function () {
			logger.info("------data validation------");
			serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.trendTabLink);
			expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.trendTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			util.waitForInvisibilityOfKibanaDataLoader();
			var expectedValuesChangeMgmtTrendChangeType = expected_ValuesChangeMgmtTrend.change_type
			var envKeyList = Object.keys(expectedValuesChangeMgmtTrendChangeType);
			for (var i = 0; i < envKeyList.length; i++) {
				var changeTypeToolTipText = await change_management_page.getToolTipTextForChartSectionBasedOnDataLabel(changeManagementTestData.changeTypeCardName, envKeyList[i])
				expect(util.stringToInteger(changeTypeToolTipText)).toEqual(expectedValuesChangeMgmtTrendChangeType[envKeyList[i]])
			}
		});
	}
	
	if (browser.params.dataValiadtion) {
		it("Verify Local Filter Functionality of 'Change Risk' on 'Trends' Tab for change Management", async function () {
			logger.info("------data validation------");
			serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.trendTabLink);
			expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.trendTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			util.waitForInvisibilityOfKibanaDataLoader();
			var expectedValuesChangeMgmtTrendChangeRisk = expected_ValuesChangeMgmtTrend.change_risk
			var envKeyList = Object.keys(expectedValuesChangeMgmtTrendChangeRisk);
			for (var i = 0; i < envKeyList.length; i++) {
				var changeTypeToolTipText = await change_management_page.getToolTipTextForChartSectionBasedOnDataLabel(changeManagementTestData.changeRiskCardName, envKeyList[i])
				expect(util.stringToInteger(changeTypeToolTipText)).toEqual(expectedValuesChangeMgmtTrendChangeRisk[envKeyList[i]])
			}
		});
	}
	
	if (browser.params.dataValiadtion) {
		it("Verify Local Filter Functionality of 'What time in the day change was created' on 'Trends' Tab for change Management", async function () {
			serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.trendTabLink);
			expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.trendTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			util.waitForInvisibilityOfKibanaDataLoader();
			var expectedValuesChangeMgmtTrendschangeCreatedDayTime = expected_ValuesChangeMgmtTrend.what_time_in_the_day_change_was_created
			var changeCreatedWeeksKeyList = Object.keys(expectedValuesChangeMgmtTrendschangeCreatedDayTime);
			logger.info("------data validation------");
			for (var i = 0; i < changeCreatedWeeksKeyList.length - 1; i++) {
				var changeCreatedWeeksKey = expected_ValuesChangeMgmtTrend.what_time_in_the_day_change_was_created[changeCreatedWeeksKeyList[i]]
				var changeCreatedDayTimekeys = Object.keys(changeCreatedWeeksKey)
				for (var j = 0; j < changeCreatedDayTimekeys.length; j++) {
					var changeCreatedDayTimeValue = await change_management_page.getAllValuesofSpecifRowFromMatrixGraph(changeManagementTestDataObject.timeInDayChangeCreatedCardName, j);
					var changeCreatedDayTimeblockvalue = util.stringToInteger(changeCreatedDayTimeValue[i])
					logger.info("value of row no " + j + " and column no " + i + " is :" + changeCreatedDayTimeblockvalue + " on UI")
					logger.info("value of " + changeCreatedWeeksKeyList[i] + " :" + changeCreatedDayTimekeys[j] + " is :" + expectedValuesChangeMgmtTrendschangeCreatedDayTime[changeCreatedWeeksKeyList[i]][changeCreatedDayTimekeys[j]] + " in JSON")
					await expect(changeCreatedDayTimeblockvalue).toEqual(expectedValuesChangeMgmtTrendschangeCreatedDayTime[changeCreatedWeeksKeyList[i]][changeCreatedDayTimekeys[j]]);
				}
			}
		});
	}
	
	if (browser.params.dataValiadtion) {
		it("Verify Local Filter Functionality of 'What time in the day change was closed' on 'Trends' Tab for change Management", async function () {
			serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.trendTabLink);
			expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.trendTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			util.waitForInvisibilityOfKibanaDataLoader();
			var expectedValuesChangeMgmtTrendschangeCreatedDayTime = expected_ValuesChangeMgmtTrend.what_time_in_the_day_change_was_closed
			var changeCreatedWeeksKeyList = Object.keys(expectedValuesChangeMgmtTrendschangeCreatedDayTime);
			logger.info("------data validation------");
			for (var i = 0; i < changeCreatedWeeksKeyList.length - 1; i++) {
				var changeCreatedWeeksKey = expected_ValuesChangeMgmtTrend.what_time_in_the_day_change_was_closed[changeCreatedWeeksKeyList[i]]
				var changeCreatedDayTimekeys = Object.keys(changeCreatedWeeksKey)
				for (var j = 0; j < changeCreatedDayTimekeys.length; j++) {
					var changeCreatedDayTimeValue = await change_management_page.getAllValuesofSpecifRowFromMatrixGraph(changeManagementTestDataObject.timeInDayChangeClosedCardName, j);
					var changeCreatedDayTimeblockvalue = util.stringToInteger(changeCreatedDayTimeValue[i])
					logger.info("value of row no " + j + " and column no " + i + " is :" + changeCreatedDayTimeblockvalue + " on UI")
					logger.info("value of " + changeCreatedWeeksKeyList[i] + " :" + changeCreatedDayTimekeys[i] + " is :" + expectedValuesChangeMgmtTrendschangeCreatedDayTime[changeCreatedWeeksKeyList[i]][changeCreatedDayTimekeys[j]] + " in JSON")
					await expect(changeCreatedDayTimeblockvalue).toEqual(expectedValuesChangeMgmtTrendschangeCreatedDayTime[changeCreatedWeeksKeyList[i]][changeCreatedDayTimekeys[j]]);
				}
			}
		});
	}
	
	if (isEnabledESValidation) {
		/*it("Verify if the count of variables in Top 25 Assignment Group widget from Change Dashboard tab is equal to count from Elastic Index", async function() {
			logger.info("------ES Data validation------");
			serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.changeDashboardTabLink);
	        expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.changeDashboardTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			util.waitForAngular();
			var top25assignmentGroupfromWidget = await serviceMgmtUtil.getNamesFromWordCloud(changeManagementTestDataObject.top25AssignmentGroupCardName);
			var filteredTop25AssignmentGroupFromWidget = await util.removeEmptyNullValuesFromList(top25assignmentGroupfromWidget);
			var top25AssignmentGroupFromES =  await esQueriesChange.getTop25AssignmentGroup(changeManagementTestData.eSChangeSearchIndex, tenantId,210);
			expect(change_management_page.getAllValuesofWordCloudGraph(filteredTop25AssignmentGroupFromWidget,top25AssignmentGroupFromES)).not.toContain("Not-matching");
		});*/

		it("Verify if the count of variables in OpCo View widget from Change Dashboard tab is equal to count from Elastic Index", async function() {
			logger.info("------ES Data validation------");
			serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.changeDashboardTabLink);
	        expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.changeDashboardTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			util.waitForAngular();
			var opcoViewfromWidget = await serviceMgmtUtil.getNamesFromWordCloud(changeManagementTestDataObject.opCoViewCardName);
			var filteredOpcoViewfromWidget = await util.removeEmptyNullValuesFromList(opcoViewfromWidget);
			var opcoViewFromES =  await esQueriesChange.getOpcoView(changeManagementTestData.eSChangeSearchIndex, tenantId, 210);
			expect(change_management_page.getAllValuesofWordCloudGraph(filteredOpcoViewfromWidget,opcoViewFromES)).not.toContain("Not-matching");
		});

		it("Verify if the count of variables in Category View widget from Change Dashboard tab is equal to count from Elastic Index", async function() {
			logger.info("------ES Data validation------");
			serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.changeDashboardTabLink);
	        expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.changeDashboardTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			util.waitForAngular();
			var categoryViewfromWidget = await serviceMgmtUtil.getNamesFromWordCloud(changeManagementTestDataObject.categoryViewCardName);
			var filteredCategoryViewFromWidget = await util.removeEmptyNullValuesFromList(categoryViewfromWidget);
			var categoryViewFromES =  await esQueriesChange.getCategoryView(changeManagementTestData.eSChangeSearchIndex, tenantId, 210);
			expect(change_management_page.getAllValuesofWordCloudGraph(filteredCategoryViewFromWidget,categoryViewFromES)).not.toContain("Not-matching");
		});
    }
	if (isEnabledESValidation) {
		// Need to resolve Jenkins/ES Query timezone issue
		/*it("Verify if count of Change Type: Expedited/Emergency/Standard/Normal, Failed/Success Changes on Change Dashboard tab is equal to count from Elastic Index", async function(){
			logger.info("------ES Data validation------");
			serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.changeDashboardTabLink);
			expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.changeDashboardTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			util.waitForAngular();
			var changeTypeExpedictedCountFromUI = util.stringToInteger(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestData.expeditedCardName));
			var changeTypeExpedictedCountFromES =  await esQueriesChange.getChangeTypeExpedictedCount(changeManagementTestData.eSChangeSearchIndex,tenantId,210);
			var changeTypeEmergencyCountFromUI = util.stringToInteger(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestData.emergencyCardName));
			var changeTypeEmergencyCountFromES =  await esQueriesChange.getChangeTypeEmergencyCount(changeManagementTestData.eSChangeSearchIndex,tenantId,210);
			var changeTypeStandardCountFromUI = util.stringToInteger(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestData.standardCardName));
			var changeTypeStandardCountFromES =  await esQueriesChange.getChangeTypeStandardCount(changeManagementTestData.eSChangeSearchIndex,tenantId,210);
			var changeTypeNormalCountFromUI = util.stringToInteger(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestData.normalCardName));
			var changeTypeNormalCountFromES =  await esQueriesChange.getChangeTypeNormalCount(changeManagementTestData.eSChangeSearchIndex,tenantId,210);
			var failedChangesCountFromUI = util.stringToInteger(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestData.failedChangesCardName));
			var failedChangesCountFromES =  await esQueriesChange.getFailedChangeCount(changeManagementTestData.eSChangeSearchIndex,tenantId,210);
			var successChangesCountFromUI = util.stringToInteger(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestData.successChangesCardName));
			var successChangesCountFromES =  await esQueriesChange.getSuccessChangeCount(changeManagementTestData.eSChangeSearchIndex,tenantId,210);
			expect(changeTypeExpedictedCountFromUI).toEqual(changeTypeExpedictedCountFromES);
			expect(changeTypeEmergencyCountFromUI).toEqual(changeTypeEmergencyCountFromES);
			expect(changeTypeStandardCountFromUI).toEqual(changeTypeStandardCountFromES);
			expect(changeTypeNormalCountFromUI).toEqual(changeTypeNormalCountFromES);
			expect(failedChangesCountFromUI).toEqual(failedChangesCountFromES);
			expect(successChangesCountFromUI).toEqual(successChangesCountFromES);
		});

		it("Verify if count of Implemented changes on Change Dashboard tab is greater or equal to count of Closed changes and is equal to count from Elastic Index", async function() {
			logger.info("------ES Data validation------");
			serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.changeDashboardTabLink);
	        expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.changeDashboardTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			util.waitForAngular();
			var ClosedChangesChangeDashboardTab = util.stringToInteger(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestDataObject.closedChangesCardName));
			var ImplementedChangesChangeDashboardTab = util.stringToInteger(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestDataObject.implementedChangesCardName));
			var ImplementedChangesCountFromES =  await esQueriesChange.getImplementedChangesCount(changeManagementTestData.eSChangeSearchIndex, tenantId,210);
			expect(ImplementedChangesChangeDashboardTab).toBeGreaterThanOrEqual(ClosedChangesChangeDashboardTab);
			expect(ImplementedChangesChangeDashboardTab).toEqual(ImplementedChangesCountFromES);
		});
			
		it("Verify if Unauthorised % and Others % on Change Dashboard tab matches the percentage of data extracted from Elastic Index", async function(){
			logger.info("------ES Data validation------");
			serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.changeDashboardTabLink);
	        expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.changeDashboardTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			util.waitForAngular();
			var legendsList = await serviceMgmtUtil.getLegendNamesFromLocalFilter(changeManagementTestData.unauthorizedPercentCardName);
			var pieChartPercentageList = await serviceMgmtUtil.getPieChartPercentageUsingLegendName(changeManagementTestData.unauthorizedPercentCardName,legendsList);
			var unauthorisedCountFromES =  await esQueriesChange.getUnauthorisedCount(changeManagementTestData.eSChangeSearchIndex, tenantId);
			var othersCountFromES =  await esQueriesChange.getUnauthorisedOthersCount(changeManagementTestData.eSChangeSearchIndex, tenantId);
			var totalCount = unauthorisedCountFromES + othersCountFromES;
			var unauthorisedCountFromChart = Math.round((pieChartPercentageList[0]*totalCount)/100);
			expect(unauthorisedCountFromChart).toEqual(unauthorisedCountFromES);
			var othersCountFromChart = Math.round((pieChartPercentageList[1]*totalCount)/100);
			expect(othersCountFromChart).toEqual(othersCountFromES);
		});*/

		// Disable Test case because of Known issue: https://jira.gravitant.net/browse/AIOP-7557
		// it("Verify if Exception Reason percentage on Change Dashboard tab matches the percentage of data extracted from Elastic Index", async function() {
		// 	logger.info("------ES Data validation------");
		// 	serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.changeDashboardTabLink);
	    //     expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.changeDashboardTabLink)).toBe(true);
		// 	util.switchToFrameById(frames.cssrIFrame);
		// 	await util.waitForInvisibilityOfKibanaDataLoader();
		// 	util.waitForAngular();
		// 	var exceptionDatafromDashboard = await serviceMgmtUtil.getElementDataFrompieChart(changeManagementTestData.exceptionReasonCardName);
		// 	var ExceptionCountFromES =  await esQueriesChange.getExceptionReasonCount(changeManagementTestData.eSChangeSearchIndex, tenantId,210);
		// 	expect(change_management_page.getAllValuesofPieChart(exceptionDatafromDashboard[0],ExceptionCountFromES)).not.toContain('Not Matching');
		// });
		
		// Need to resolve Jenkins/ES Query timezone issue
		/*it("Verify if Failed and Success percentage on Change Dashboard tab is equivalent to percentage data from Elastic Index", async function() {
			logger.info("------ES Data validation------");
			serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.changeDashboardTabLink);
	        expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.changeDashboardTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			util.waitForAngular();
			var legendsList = await serviceMgmtUtil.getLegendNamesFromLocalFilter(changeManagementTestData.failedandSuccessfulPercentCardName);
			var pieChartPercentageList = await serviceMgmtUtil.getPieChartPercentageUsingLegendName(changeManagementTestData.failedandSuccessfulPercentCardName,legendsList);
			var failedchangesFromES =  await esQueriesChange.getFailedChangeCount(changeManagementTestData.eSChangeSearchIndex, tenantId,210);
			var successchangesFromES =  await esQueriesChange.getSuccessChangeCount(changeManagementTestData.eSChangeSearchIndex, tenantId,210);
			var totalfailsuccesscount = (failedchangesFromES + successchangesFromES);
			var successcountfromchart=Math.round((pieChartPercentageList[0]*totalfailsuccesscount)/100);
			expect(successcountfromchart).toEqual(successchangesFromES);
			var failedcountfromchart=Math.round((pieChartPercentageList[1]*totalfailsuccesscount)/100);
			expect(failedcountfromchart).toEqual(failedchangesFromES);
		});*/
		
	 	it("Verify if Change type percentage data on Change Dashboard tab is equal to data from Elastic index", async function() {
			logger.info("------ES Data validation------");
			serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.changeDashboardTabLink);
	        expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.changeDashboardTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			util.waitForAngular();
			var changeTypeDatafromDashboard = await serviceMgmtUtil.getElementDataFrompieChart(changeManagementTestData.changeTypePercentChartName);
			var changeCountFromES =  await esQueriesChange.getChangeCount(changeManagementTestData.eSChangeSearchIndex, tenantId,210);
			expect(change_management_page.getAllValuesofPieChart(changeTypeDatafromDashboard[0],changeCountFromES)).not.toContain('Not Matching');
		});

		// Need to resolve Jenkins/ES Query timezone issue
		/*it("Verify if Change Status count on Change Dashboard tab is equal to data from Elastic index", async function(){
			logger.info("------ES Data validation------");
			serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.changeDashboardTabLink);
	        expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.changeDashboardTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			util.waitForAngular();
			var changeStatusJsonObj = await esQueriesChange.getChangeStatusCount(changeManagementTestData.eSChangeSearchIndex, tenantId);
			expect(await serviceMgmtUtil.verifyValuesFromJSONAndUIForHorizontalBarGraph(changeManagementTestData.changeStatusCardName, changeStatusJsonObj)).toBe(true);
		});

		it("Verify if Closure Codes count on Change Dashboard tab is equal to data from Elastic index", async function(){
			logger.info("------ES Data validation------");
			serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.changeDashboardTabLink);
	        expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.changeDashboardTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			util.waitForAngular();
			var closureCodesJsonObj = await esQueriesChange.getClosureCodesCount(changeManagementTestData.eSChangeSearchIndex, tenantId);
			expect(await serviceMgmtUtil.verifyValuesFromJSONAndUIForHorizontalBarGraph(changeManagementTestData.closureCodesCardName, closureCodesJsonObj)).toBe(true);
		});

		it("Verify if Change Risk count on Change Dashboard tab is equal to data from Elastic index", async function(){
			logger.info("------ES Data validation------");
			serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.changeDashboardTabLink);
	        expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.changeDashboardTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			util.waitForAngular();
			var changeRiskJsonObj = await esQueriesChange.getChangeRiskCount(changeManagementTestData.eSChangeSearchIndex, tenantId);
			expect(await serviceMgmtUtil.verifyCircleChartCountListFromUIWithESValues(changeManagementTestData.changeRiskCardName, changeRiskJsonObj)).toBe(true);
		});

		it("Verify if Change Type count on Change Dashboard tab is equal to data from Elastic index", async function(){
			logger.info("------ES Data validation------");
			serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.changeDashboardTabLink);
	        expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.changeDashboardTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			util.waitForAngular();
			var changeTypeJsonObj = await esQueriesChange.getChangeTypeCount(changeManagementTestData.eSChangeSearchIndex, tenantId);
			expect(await serviceMgmtUtil.verifyCircleChartCountListFromUIWithESValues(changeManagementTestData.changeTypeChartName, changeTypeJsonObj)).toBe(true);
		});

		it("Verify if Change Aging Bucket count on Change Dashboard tab is equal to data from Elastic index", async function(){
			logger.info("------ES Data validation------");
			serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.changeDashboardTabLink);
	        expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.changeDashboardTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			util.waitForAngular();
			// Get list of cell values from the first column [row filter names]
			var firstColCellValuesList = await serviceMgmtUtil.getFirstColumnCellValuesListFromTableWidget(changeManagementTestData.changeAgingBucketDataTitleName);
			var countListFromUI = await serviceMgmtUtil.getListOfCountListRowWiseFromTableWidget(changeManagementTestData.changeAgingBucketDataTitleName, firstColCellValuesList);
			var countListFromES = await esQueriesChange.getChangeAgingBucketCount(changeManagementTestData.eSChangeSearchIndex, tenantId, firstColCellValuesList);
			// Verify the list of list of count values for each row filter from UI with the list of list of count values from ES query response
			expect(util.compareNestedArrays(countListFromUI, countListFromES)).toBe(true);
		});*/

		// Need to resolve Jenkins/ES Query timezone issue
		/*it("Verify if Failed and Success percentage on Topography tab is equivalent to percentage data from Elastic Index", async function() {
			logger.info("------ES Data validation------");
			serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.topographyTabLink);
	        expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.topographyTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			util.waitForAngular();
			var legendsList = await serviceMgmtUtil.getLegendNamesFromLocalFilter(changeManagementTestData.failedandSuccessfulPercentCardName);
			var pieChartPercentageList = await serviceMgmtUtil.getPieChartPercentageUsingLegendName(changeManagementTestData.failedandSuccessfulPercentCardName,legendsList);
			var failedchangesFromES =  await esQueriesChange.getFailedChangeCount(changeManagementTestData.eSChangeSearchIndex, tenantId, 210);
			var successchangesFromES =  await esQueriesChange.getSuccessChangeCount(changeManagementTestData.eSChangeSearchIndex, tenantId, 210);
			var totalfailsuccesscount = (failedchangesFromES + successchangesFromES);
			var successcountfromchart=Math.round((pieChartPercentageList[0]*totalfailsuccesscount)/100);
			expect(successcountfromchart).toEqual(successchangesFromES);
			var failedcountfromchart=Math.round((pieChartPercentageList[1]*totalfailsuccesscount)/100);
			expect(failedcountfromchart).toEqual(failedchangesFromES);
		});

		it("Verify if Service Line count on Topography tab is equal to data from Elastic index", async function(){
			logger.info("------ES Data validation------");
			serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.topographyTabLink);
	        expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.topographyTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			util.waitForAngular();
			var serviceLineJsonObj = await esQueriesChange.getServiceLineCount(changeManagementTestData.eSChangeSearchIndex, tenantId);
			expect(await serviceMgmtUtil.verifyValuesFromJSONAndUIForHorizontalBarGraph(changeManagementTestData.serviceLineCardName, serviceLineJsonObj)).toBe(true);
		});

		it("Verify if Closure Codes count on Topography tab is equal to data from Elastic index", async function(){
			logger.info("------ES Data validation------");
			serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.topographyTabLink);
	        expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.topographyTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			util.waitForAngular();
			var closureCodesJsonObj = await esQueriesChange.getClosureCodesCount(changeManagementTestData.eSChangeSearchIndex, tenantId);
			expect(await serviceMgmtUtil.verifyValuesFromJSONAndUIForHorizontalBarGraph(changeManagementTestData.closureCodesCardName, closureCodesJsonObj)).toBe(true);
		});

		it("Verify if Change Risk count on Topography tab is equal to data from Elastic index", async function(){
			logger.info("------ES Data validation------");
			serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.topographyTabLink);
	        expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.topographyTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			util.waitForAngular();
			var changeRiskJsonObj = await esQueriesChange.getChangeRiskCount(changeManagementTestData.eSChangeSearchIndex, tenantId);
			expect(await serviceMgmtUtil.verifyCircleChartCountListFromUIWithESValues(changeManagementTestData.changeRiskChartName, changeRiskJsonObj)).toBe(true);
		});

		it("Verify if Change Type count on Topography tab is equal to data from Elastic index", async function(){
			logger.info("------ES Data validation------");
			serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.topographyTabLink);
	        expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.topographyTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			util.waitForAngular();
			var changeTypeJsonObj = await esQueriesChange.getChangeTypeCount(changeManagementTestData.eSChangeSearchIndex, tenantId);
			expect(await serviceMgmtUtil.verifyCircleChartCountListFromUIWithESValues(changeManagementTestData.changeTypeCardName, changeTypeJsonObj)).toBe(true);
		});

		it("Verify if Service Line count on Trends tab is equal to data from Elastic index", async function(){
			logger.info("------ES Data validation------");
			serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.trendTabLink);
	        expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.trendTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			util.waitForAngular();
			var serviceLineJsonObj = await esQueriesChange.getServiceLineCount(changeManagementTestData.eSChangeSearchIndex, tenantId);
			expect(await serviceMgmtUtil.verifyValuesFromJSONAndUIForHorizontalBarGraph(changeManagementTestData.serviceLineCardName, serviceLineJsonObj)).toBe(true);
		});

		it("Verify if Created Change Trend count on Trends tab is equal to data from Elastic index", async function(){
			logger.info("------ES Data validation------");
			serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.trendTabLink);
	        expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.trendTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			util.waitForAngular();
			var xAxisLabels = await serviceMgmtUtil.getXAxisLabelsFromWaveGraph(changeManagementTestData.createdChangeTrendCardName);
			var createdChangeTrendObjFromES = await esQueriesChange.getCreatedChangeTrendCount(changeManagementTestData.eSChangeSearchIndex,tenantId,xAxisLabels);
			expect(await serviceMgmtUtil.verifyCountListWaveGraphPointsFromUIAndESQuery(changeManagementTestData.createdChangeTrendCardName,createdChangeTrendObjFromES)).toBe(true);
		});

		it("Verify if Closed Change Trend count on Trends tab is equal to data from Elastic index", async function(){
			logger.info("------ES Data validation------");
			serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.trendTabLink);
	        expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.trendTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			util.waitForAngular();
			var xAxisLabels = await serviceMgmtUtil.getXAxisLabelsFromWaveGraph(changeManagementTestData.closedChangeTrendCardName);
			var closedChangeTrendObjFromES = await esQueriesChange.getClosedChangeTrendCount(changeManagementTestData.eSChangeSearchIndex,tenantId,xAxisLabels);
			expect(await serviceMgmtUtil.verifyCountListWaveGraphPointsFromUIAndESQuery(changeManagementTestData.closedChangeTrendCardName,closedChangeTrendObjFromES)).toBe(true);
		});

		it("Verify if Created Change Weekly Trend count on Trends tab is equal to data from Elastic index", async function(){
			logger.info("------ES Data validation------");
			serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.trendTabLink);
	        expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.trendTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			util.waitForAngular();
			var xAxisLabels = await serviceMgmtUtil.getXAxisLabelsFromWaveGraph(changeManagementTestData.createdChangeWeeklyTrendCardName);
			var createdChangeWeeklyTrendObjFromES = await esQueriesChange.getCreatedChangeWeeklyTrendCount(changeManagementTestData.eSChangeSearchIndex,tenantId,xAxisLabels);
			expect(await serviceMgmtUtil.verifyCountListWaveGraphPointsFromUIAndESQuery(changeManagementTestData.createdChangeWeeklyTrendCardName,createdChangeWeeklyTrendObjFromES)).toBe(true);
		});

		it("Verify if Closed Change Weekly Trend count on Trends tab is equal to data from Elastic index", async function(){
			logger.info("------ES Data validation------");
			serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.trendTabLink);
	        expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.trendTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			util.waitForAngular();
			var xAxisLabels = await serviceMgmtUtil.getXAxisLabelsFromWaveGraph(changeManagementTestData.closedChangeWeeklyTrendCardName);
			var closedChangeWeeklyTrendObjFromES = await esQueriesChange.getClosedChangeWeeklyTrendCount(changeManagementTestData.eSChangeSearchIndex,tenantId,xAxisLabels);
			expect(await serviceMgmtUtil.verifyCountListWaveGraphPointsFromUIAndESQuery(changeManagementTestData.closedChangeWeeklyTrendCardName,closedChangeWeeklyTrendObjFromES)).toBe(true);
		});

		it("Verify if Closure Codes count on Trends tab is equal to data from Elastic index", async function(){
			logger.info("------ES Data validation------");
			serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.trendTabLink);
	        expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.trendTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			util.waitForAngular();
			var closureCodesJsonObj = await esQueriesChange.getClosureCodesCount(changeManagementTestData.eSChangeSearchIndex, tenantId);
			expect(await serviceMgmtUtil.verifyValuesFromJSONAndUIForHorizontalBarGraph(changeManagementTestData.closureCodesCardName, closureCodesJsonObj)).toBe(true);
		});

		it("Verify if Change Risk count on Trends tab is equal to data from Elastic index", async function(){
			logger.info("------ES Data validation------");
			serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.trendTabLink);
	        expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.trendTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			util.waitForAngular();
			var changeRiskJsonObj = await esQueriesChange.getChangeRiskCount(changeManagementTestData.eSChangeSearchIndex, tenantId);
			expect(await serviceMgmtUtil.verifyCircleChartCountListFromUIWithESValues(changeManagementTestData.changeRiskCardName, changeRiskJsonObj)).toBe(true);
		});

		it("Verify if Change Type count on Trends tab is equal to data from Elastic index", async function(){
			logger.info("------ES Data validation------");
			serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.trendTabLink);
	        expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.trendTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			util.waitForAngular();
			var changeTypeJsonObj = await esQueriesChange.getChangeTypeCount(changeManagementTestData.eSChangeSearchIndex, tenantId);
			expect(await serviceMgmtUtil.verifyCircleChartCountListFromUIWithESValues(changeManagementTestData.changeTypeCardName, changeTypeJsonObj)).toBe(true);
		});

		it("Verify if What time in the day change was created count on Trends tab is equal to data from Elastic index", async function(){
			logger.info("------ES Data validation------");
			serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.trendTabLink);
	        expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.trendTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			util.waitForAngular();
			var whatTimeInDayChangeWasCreatedJsonObj = await esQueriesChange.getWhatTimeInDayChangeWasCreatedCount(changeManagementTestData.eSChangeSearchIndex, tenantId);
			expect(await serviceMgmtUtil.verifyValuesFromJSONAndUIForHeatMapWidget(changeManagementTestData.timeInDayChangeCreatedCardName, whatTimeInDayChangeWasCreatedJsonObj)).toBe(true);
		});

		it("Verify if What time in the day change was closed count on Trends tab is equal to data from Elastic index", async function(){
			logger.info("------ES Data validation------");
			serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.trendTabLink);
	        expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.trendTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			util.waitForAngular();
			var whatTimeInDayChangeWasClosedJsonObj = await esQueriesChange.getWhatTimeInDayChangeWasClosedCount(changeManagementTestData.eSChangeSearchIndex, tenantId);
			expect(await serviceMgmtUtil.verifyValuesFromJSONAndUIForHeatMapWidget(changeManagementTestData.timeInDayChangeClosedCardName, whatTimeInDayChangeWasClosedJsonObj)).toBe(true);
		});*/
	}

	// Need to skip the test case as global filter Created Year Month and Closed Year Month is not available now
	// it("Verify Wave-points widgets on 'Trends' tab after applying global filter 'Created Year Month'", async function(){
	// 	serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.trendTabLink);
	// 	expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.trendTabLink)).toBe(true);
	// 	util.switchToFrameById(frames.cssrIFrame);
	// 	await util.waitForInvisibilityOfKibanaDataLoader();
	// 	util.waitForAngular();
	// 	// Get number of points from 'Created Change Trend' widget
	// 	var createdChangeTrendWidgetPointsCountBefore = await serviceMgmtUtil.getCountOfWaveGraphPoints(changeManagementTestData.createdChangeTrendCardName);
	// 	if(createdChangeTrendWidgetPointsCountBefore > 1){
	// 		await serviceMgmtUtil.clickOnFilterButtonBasedOnName(changeManagementTestData.createdYearMonthFilterName);
	// 		await expect(serviceMgmtUtil.verifyFilterPanelExpanded(changeManagementTestData.createdYearMonthFilterName)).toBe(true);
	// 		var filterValue = await serviceMgmtUtil.selectFirstFilterValueBasedOnName(changeManagementTestData.createdYearMonthFilterName);
	// 		if(filterValue != false){
	// 			// Apply 'Created Year Month' filter
	// 			await serviceMgmtUtil.clickOnApplyFilterButton(changeManagementTestData.createdYearMonthFilterName);
	// 			await util.waitForInvisibilityOfKibanaDataLoader();
	// 			// Verify tooltip text with applied filter value
	// 			await expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(changeManagementTestData.createdYearMonthFilterName)).toEqual(filterValue);
	// 			// Get number of points from 'Created Change Trend' widget after applying filter
	// 			var createdChangeTrendWidgetPointsCountAfter = await serviceMgmtUtil.getCountOfWaveGraphPoints(changeManagementTestData.createdChangeTrendCardName);
	// 			expect(createdChangeTrendWidgetPointsCountAfter).toBeLessThan(createdChangeTrendWidgetPointsCountBefore);
	// 			expect(createdChangeTrendWidgetPointsCountAfter).toEqual(1);
	// 			var xAxisLabel = await serviceMgmtUtil.getXAxisLabelsFromWaveGraph(changeManagementTestData.createdChangeTrendCardName);
	// 			expect(xAxisLabel[0]).toEqual(filterValue);
	// 			await util.clickOnResetFilterLink();
	// 			await util.waitForInvisibilityOfKibanaDataLoader();
	// 			// Get number of points from 'Created Change Trend' widget after resetting filter
	// 			var createdChangeTrendWidgetPointsCountAfter1 = await serviceMgmtUtil.getCountOfWaveGraphPoints(changeManagementTestData.createdChangeTrendCardName);
	// 			expect(createdChangeTrendWidgetPointsCountAfter1).toEqual(createdChangeTrendWidgetPointsCountBefore);
	// 		}
	// 	}
	// });

	// it("Verify Wave-points widgets on 'Trends' tab after applying global filter 'Closed Year Month'", async function(){
	// 	serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.trendTabLink);
	// 	expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.trendTabLink)).toBe(true);
	// 	util.switchToFrameById(frames.cssrIFrame);
	// 	await util.waitForInvisibilityOfKibanaDataLoader();
	// 	util.waitForAngular();
	// 	// Get number of points from 'Closed Change Trend' widget
	// 	var closedChangeTrendWidgetPointsCountBefore = await serviceMgmtUtil.getCountOfWaveGraphPoints(changeManagementTestData.closedChangeTrendCardName);
	// 	if(closedChangeTrendWidgetPointsCountBefore > 1){
	// 		await serviceMgmtUtil.clickOnFilterButtonBasedOnName(changeManagementTestData.closedMonthYearFilterName);
	// 		await expect(serviceMgmtUtil.verifyFilterPanelExpanded(changeManagementTestData.closedMonthYearFilterName)).toBe(true);
	// 		var filterValue = await serviceMgmtUtil.selectFirstFilterValueBasedOnName(changeManagementTestData.closedMonthYearFilterName);
	// 		if(filterValue != false){
	// 			// Apply 'Closed Year Month' filter
	// 			await serviceMgmtUtil.clickOnApplyFilterButton(changeManagementTestData.closedMonthYearFilterName);
	// 			await util.waitForInvisibilityOfKibanaDataLoader();
	// 			// Verify tooltip text with applied filter value
	// 			await expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(changeManagementTestData.closedMonthYearFilterName)).toEqual(filterValue);
	// 			// Get number of points from 'Closed Change Trend' widget after applying filter
	// 			var closedChangeTrendWidgetPointsCountAfter = await serviceMgmtUtil.getCountOfWaveGraphPoints(changeManagementTestData.closedChangeTrendCardName);
	// 			expect(closedChangeTrendWidgetPointsCountAfter).toBeLessThan(closedChangeTrendWidgetPointsCountBefore);
	// 			expect(closedChangeTrendWidgetPointsCountAfter).toEqual(1);
	// 			var xAxisLabel = await serviceMgmtUtil.getXAxisLabelsFromWaveGraph(changeManagementTestData.closedChangeTrendCardName);
	// 			expect(xAxisLabel[0]).toEqual(filterValue);
	// 			await util.clickOnResetFilterLink();
	// 			await util.waitForInvisibilityOfKibanaDataLoader();
	// 			// Get number of points from 'Closed Change Trend' widget after resetting filter
	// 			var closedChangeTrendWidgetPointsCountAfter1 = await serviceMgmtUtil.getCountOfWaveGraphPoints(changeManagementTestData.closedChangeTrendCardName);
	// 			expect(closedChangeTrendWidgetPointsCountAfter1).toEqual(closedChangeTrendWidgetPointsCountBefore);
	// 		}
	// 	}
	// });
	it("Verify Local Filter Functionality of 'Created Change Trend' on 'Trends' Tab for Change Management", async function(){
		serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.trendTabLink);
		expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.trendTabLink)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();
		util.waitForAngular();
		// Get number of points from 'Created Change Trend' widget
		var createdChangeTrendWidgetPointsCountBefore = await serviceMgmtUtil.getCountOfWaveGraphPoints(changeManagementTestData.createdChangeTrendCardName);
		if(createdChangeTrendWidgetPointsCountBefore > 1){
			var pointIndex = parseInt(createdChangeTrendWidgetPointsCountBefore / 2);
			// Click on mid point from Created Change Trend widget
			await serviceMgmtUtil.clickOnWavePointGraphUsingIndex(changeManagementTestData.createdChangeTrendCardName, pointIndex);
			await util.waitForInvisibilityOfKibanaDataLoader();
			// Get number of points from 'Created Change Trend' widget after applying local filter
			var createdChangeTrendWidgetPointsCountAfter = await serviceMgmtUtil.getCountOfWaveGraphPoints(changeManagementTestData.createdChangeTrendCardName);
			expect(createdChangeTrendWidgetPointsCountAfter).toBeLessThan(createdChangeTrendWidgetPointsCountBefore);
			expect(createdChangeTrendWidgetPointsCountAfter).toEqual(1);
			await util.clickOnResetFilterLink();
			await util.waitForInvisibilityOfKibanaDataLoader();
			// Get number of points from 'Created Change Trend' widget after resetting local filter
			var createdChangeTrendWidgetPointsCountAfter1 = await serviceMgmtUtil.getCountOfWaveGraphPoints(changeManagementTestData.createdChangeTrendCardName);
			expect(createdChangeTrendWidgetPointsCountAfter1).toEqual(createdChangeTrendWidgetPointsCountBefore);
		}
	});

	it("Verify Local Filter Functionality of 'Closed Change Trend' on 'Trends' Tab for Change Management", async function(){
		serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.trendTabLink);
		expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.trendTabLink)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();
		util.waitForAngular();
		// Get number of points from 'Closed Change Trend' widget
		var closedChangeTrendWidgetPointsCountBefore = await serviceMgmtUtil.getCountOfWaveGraphPoints(changeManagementTestData.closedChangeTrendCardName);
		if(closedChangeTrendWidgetPointsCountBefore > 1){
			var pointIndex = parseInt(closedChangeTrendWidgetPointsCountBefore / 2);
			// Click on mid point from Closed Change Trend widget
			await serviceMgmtUtil.clickOnWavePointGraphUsingIndex(changeManagementTestData.closedChangeTrendCardName, pointIndex);
			await util.waitForInvisibilityOfKibanaDataLoader();
			// Get number of points from 'Closed Change Trend' widget after applying local filter
			var closedChangeTrendWidgetPointsCountAfter = await serviceMgmtUtil.getCountOfWaveGraphPoints(changeManagementTestData.closedChangeTrendCardName);
			expect(closedChangeTrendWidgetPointsCountAfter).toBeLessThan(closedChangeTrendWidgetPointsCountBefore);
			expect(closedChangeTrendWidgetPointsCountAfter).toEqual(1);
			await util.clickOnResetFilterLink();
			await util.waitForInvisibilityOfKibanaDataLoader();
			// Get number of points from 'Closed Change Trend' widget after resetting local filter
			var closedChangeTrendWidgetPointsCountAfter1 = await serviceMgmtUtil.getCountOfWaveGraphPoints(changeManagementTestData.closedChangeTrendCardName);
			expect(closedChangeTrendWidgetPointsCountAfter1).toEqual(closedChangeTrendWidgetPointsCountBefore);
		}
	});

	it("Verify Local Filter Functionality of 'Created Change Weekly Trend' on 'Trends' Tab for Change Management", async function(){
		serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.trendTabLink);
		expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.trendTabLink)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();
		util.waitForAngular();
		// Get number of points from 'Created Change Weekly Trend' widget
		var createdChangeWeeklyTrendWidgetPointsCountBefore = await serviceMgmtUtil.getCountOfWaveGraphPoints(changeManagementTestData.createdChangeWeeklyTrendCardName);
		if(createdChangeWeeklyTrendWidgetPointsCountBefore > 1){
			var pointIndex = parseInt(createdChangeWeeklyTrendWidgetPointsCountBefore / 2);
			// Click on mid point from Created Change Weekly Trend widget
			await serviceMgmtUtil.clickOnWavePointGraphUsingIndex(changeManagementTestData.createdChangeWeeklyTrendCardName, pointIndex);
			await util.waitForInvisibilityOfKibanaDataLoader();
			// Get number of points from 'Created Change Weekly Trend' widget after applying local filter
			var createdChangeWeeklyTrendWidgetPointsCountAfter = await serviceMgmtUtil.getCountOfWaveGraphPoints(changeManagementTestData.createdChangeWeeklyTrendCardName);
			expect(createdChangeWeeklyTrendWidgetPointsCountAfter).toBeLessThan(createdChangeWeeklyTrendWidgetPointsCountBefore);
			expect(createdChangeWeeklyTrendWidgetPointsCountAfter).toEqual(1);
			await util.clickOnResetFilterLink();
			await util.waitForInvisibilityOfKibanaDataLoader();
			// Get number of points from 'Created Change Weekly Trend' widget after resetting local filter
			var createdChangeWeeklyTrendWidgetPointsCountAfter1 = await serviceMgmtUtil.getCountOfWaveGraphPoints(changeManagementTestData.createdChangeWeeklyTrendCardName);
			expect(createdChangeWeeklyTrendWidgetPointsCountAfter1).toEqual(createdChangeWeeklyTrendWidgetPointsCountBefore);
		}
	});

	it("Verify Local Filter Functionality of 'Closed Change Weekly Trend' on 'Trends' Tab for Change Management", async function(){
		serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.trendTabLink);
		expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.trendTabLink)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();
		util.waitForAngular();
		// Get number of points from 'Closed Change Weekly Trend' widget
		var closedChangeWeeklyTrendWidgetPointsCountBefore = await serviceMgmtUtil.getCountOfWaveGraphPoints(changeManagementTestData.closedChangeWeeklyTrendCardName);
		if(closedChangeWeeklyTrendWidgetPointsCountBefore > 1){
			var pointIndex = parseInt(closedChangeWeeklyTrendWidgetPointsCountBefore / 2);
			// Click on mid point from Closed Change Weekly Trend widget
			await serviceMgmtUtil.clickOnWavePointGraphUsingIndex(changeManagementTestData.closedChangeWeeklyTrendCardName, pointIndex);
			await util.waitForInvisibilityOfKibanaDataLoader();
			// Get number of points from 'Closed Change Weekly Trend' widget after applying local filter
			var closedChangeWeeklyTrendWidgetPointsCountAfter = await serviceMgmtUtil.getCountOfWaveGraphPoints(changeManagementTestData.closedChangeWeeklyTrendCardName);
			expect(closedChangeWeeklyTrendWidgetPointsCountAfter).toBeLessThan(closedChangeWeeklyTrendWidgetPointsCountBefore);
			expect(closedChangeWeeklyTrendWidgetPointsCountAfter).toEqual(1);
			await util.clickOnResetFilterLink();
			await util.waitForInvisibilityOfKibanaDataLoader();
			// Get number of points from 'Closed Change Weekly Trend' widget after resetting local filter
			var closedChangeWeeklyTrendWidgetPointsCountAfter1 = await serviceMgmtUtil.getCountOfWaveGraphPoints(changeManagementTestData.closedChangeWeeklyTrendCardName);
			expect(closedChangeWeeklyTrendWidgetPointsCountAfter1).toEqual(closedChangeWeeklyTrendWidgetPointsCountBefore);
		}
	});
	
	afterAll(async function () {
		 await launchpad_page.clickOnLogoutAndLogin(browser.params.username, browser.params.password);
	});

});
