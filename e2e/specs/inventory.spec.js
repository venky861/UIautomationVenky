/**
 * Created by : Pushpraj
 * created on : 12/02/2020
 */

"use strict";


var logGenerator = require("../../helpers/logGenerator.js"),
	logger = logGenerator.getApplicationLogger(),
	InventoryPage = require('../pageObjects/inventory.pageObject.js'),
	HealthPage = require('../pageObjects/health.pageObject.js'),
	appUrls = require('../../testData/appUrls.json'),
	dashboardTestData = require('../../testData/cards/dashboardTestData.json'),
	dashboard = require('../pageObjects/dashboard.pageObject.js'),
	launchpad = require('../pageObjects/launchpad.pageObject.js'),
	launchpadTestData = require('../../testData/cards/launchpadTestData.json'),
	inventoryTestData = require('../../testData/cards/inventoryTestData.json'),
	frames = require('../../testData/frames.json'),
	elasticViewData = require('../../expected_values.json'),
	healthInventoryUtil = require('../../helpers/healthAndInventoryUtil.js'),
	util = require('../../helpers/util.js'),
	esQueriesInventory=require('../../elasticSearchTool/esQuery_InventoryPayload.js'),
	tenantId = browser.params.tenantId,
	isEnabledESValidation = browser.params.esValidation;
	
  describe('Inventory - functionality ', function () {
	var inventory_page, dashboard_page, launchpad_page ,health_page;


	beforeAll(function () {
		inventory_page = new InventoryPage();
		dashboard_page = new dashboard();
		launchpad_page = new launchpad();
		health_page = new HealthPage();
		browser.driver.manage().window().maximize();
	});

	beforeEach(function () {
		launchpad_page.open();
		expect(launchpad_page.getWelcomeMessageTxt()).toEqual(launchpadTestData.welcome);
		inventory_page.open();
	});

	if(tenantId === inventoryTestData.mainframeTenantID)
	{
	 it('Verify LPAR Details page headers,navigation to assoc overview page,title,search and content validation in overview page', async function(){
		await util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		expect(util.isSelectedTabButton(inventoryTestData.resourcesButtonName)).toEqual(true);
		await inventory_page.searchTable(inventoryTestData.mainframeName);
		var count = await inventory_page.getApplicationOrResourcesTableHeaderTextCount();
		await inventory_page.getResourceWithTagData(count,"name");
		await expect(inventory_page.getViewDetailsOverviewLabelText()).toEqual(inventoryTestData.OverviewTitle);
		//Get the headers from tags section and compare with expected new headers
		var lparHeaders = await inventory_page.getTagsSectionHeaders();
		await expect(lparHeaders).toEqual(inventoryTestData.mainframeTagsHeaders);
		//Get the subsection contents from overview section
		var overviewContents = await inventory_page.resourceOverviewSubSectionContentCheck();
		//Click on first name available in tags section
		var nameFromLPARDetailsPage = await inventory_page.clickAndGetNameTagSubSectionLink("name");
		await expect(inventory_page.getViewDetailsOverviewLabelText()).toEqual(inventoryTestData.OverviewTitle);
		//Get the page title of application Overview page and compare with selected name in resource list view
		var assocOverviewPageTitle = await inventory_page.getOverviewPageTitleText();
		expect(nameFromLPARDetailsPage).toEqual(assocOverviewPageTitle);
		await inventory_page.searchTable(overviewContents[inventoryTestData.zerothIndex]);
		//Get the ID from associate overview section and compare with System ID in res list view details
		var nameFromAppOverview = await inventory_page.clickAndGetNameTagSubSectionLink("name");
		expect(overviewContents[inventoryTestData.firstIndex]).toEqual(nameFromAppOverview);
	 });

	 it('Verify Subsystem Details page headers,navigation to assoc overview page,title,search and content validation in overview page', async function(){
		await util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		expect(util.isSelectedTabButton(inventoryTestData.resourcesButtonName)).toEqual(true);
		await inventory_page.searchTable(inventoryTestData.mainframeName);
		var count = await inventory_page.getApplicationOrResourcesTableHeaderTextCount();
		await inventory_page.getResourceWithTagData(count,"subSection");
		await expect(inventory_page.getViewDetailsOverviewLabelText()).toEqual(inventoryTestData.OverviewTitle);
		//Click on first subsytem available in tags section
		var nameFromLPARDetailsPage = await inventory_page.clickAndGetNameTagSubSectionLink("subSection");
		//Get the page title of subsytem details page and compare with selected name in LPAR details page
		var nameFromSubSytemDetailsPage = await inventory_page.getOverviewPageTitleText();
		expect(nameFromLPARDetailsPage).toEqual(nameFromSubSytemDetailsPage);
		//Validate susbsytem detail page header section
		var subsytemHeaders = await inventory_page.getTagsSectionHeaders();
		await expect(subsytemHeaders).toEqual(inventoryTestData.subsytemTagsHeaders);
		//Click on application name in subsytem detail page
		var nameFromSubSytemDetailsPage = await inventory_page.clickAndGetNameTagSubSectionLink("name");
		//Validate whether it is navigated to application overview section
		await expect(inventory_page.getViewDetailsOverviewLabelText()).toEqual(inventoryTestData.OverviewTitle);
		//Get the page title of application Overview page and compare with selected name in susbsytem details page
		var assocOverviewPageTitle = await inventory_page.getOverviewPageTitleText();
		expect(nameFromSubSytemDetailsPage).toEqual(assocOverviewPageTitle);
	
	  });

	  it('Verify navigation from subsystem details page to LPAR details page from Assc to column and title,search and content validation', async function(){
		await util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		expect(util.isSelectedTabButton(inventoryTestData.resourcesButtonName)).toEqual(true);
		await inventory_page.searchTable(inventoryTestData.mainframeName);
		var count = await inventory_page.getApplicationOrResourcesTableHeaderTextCount();
		await inventory_page.getResourceWithTagData(count,"subSection");
		await expect(inventory_page.getViewDetailsOverviewLabelText()).toEqual(inventoryTestData.OverviewTitle);
		//Click on first subsytem available in tags section
		await inventory_page.clickAndGetNameTagSubSectionLink("subSection");
		//Get the subsystem overview contents from overview section
		var overviewContents = await inventory_page.resourceOverviewSubSectionContentCheck();
		//Validate susbsytem detail page header section
		var subsytemHeaders = await inventory_page.getTagsSectionHeaders();
		await expect(subsytemHeaders).toEqual(inventoryTestData.subsytemTagsHeaders);
		//Click on Associated to in subsytem detail page
		var assctoFromSubSytemDetailsPage = await inventory_page.clickAndGetNameTagSubSectionLink("associatedTo");
		//Validate whether it is navigated to LPAR Details page
		await expect(inventory_page.getViewDetailsOverviewLabelText()).toEqual(inventoryTestData.OverviewTitle);
		//Get the page title of LPAR Details and compare with selected name in susbsytem details page
		var lparDetailsPageTitle = await inventory_page.getOverviewPageTitleText();
		expect(assctoFromSubSytemDetailsPage).toEqual(lparDetailsPageTitle);
		await inventory_page.searchTable(overviewContents[inventoryTestData.zerothIndex]);
		//Get the name fro LPAR Details page and compare with mapped application in subsystem details page
		var nameFromAppOverview = await inventory_page.clickAndGetNameTagSubSectionLink("name");
		expect(overviewContents[inventoryTestData.seventhIndex]).toEqual(nameFromAppOverview);
		
	  });

	  it('Verify applications tagged in LPAR Details page', async function(){
		await util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		expect(util.isSelectedTabButton(inventoryTestData.resourcesButtonName)).toEqual(true);
		await inventory_page.searchTable(inventoryTestData.mainframeName)
		var count = await inventory_page.getApplicationOrResourcesTableHeaderTextCount();
		await inventory_page.getResourceWithTagData(count,"subSection");
		await expect(inventory_page.getViewDetailsOverviewLabelText()).toEqual(inventoryTestData.OverviewTitle);
		var overviewContents = await inventory_page.resourceOverviewSubSectionContentCheck();
		//Get the number of pages in the tags section
		var loopCount = await inventory_page.getPageCountForAppsResourcesTable();
		//Get unique count of name links from all pages
		var count = await inventory_page.getCountOfLinks("name",loopCount);
		//Get the applications tagged value from overview section and compare with count of links
		expect(overviewContents[inventoryTestData.twentyThirdIndex]).toEqual(count.toString());

		});

	  it('Verify subsystems tagged in LPAR Details page', async function(){
		await util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		expect(util.isSelectedTabButton(inventoryTestData.resourcesButtonName)).toEqual(true);
		await inventory_page.searchTable(inventoryTestData.mainframeName);
		var count = await inventory_page.getApplicationOrResourcesTableHeaderTextCount();
		await inventory_page.getResourceWithTagData(count,"subSection");
		await expect(inventory_page.getViewDetailsOverviewLabelText()).toEqual(inventoryTestData.OverviewTitle);
		var overviewContents = await inventory_page.resourceOverviewSubSectionContentCheck();
		//Get the number of pages in the tags section
		var loopCount = await inventory_page.getPageCountForAppsResourcesTable();
		//Get unique count of subsytem links from all pages
		var count = await inventory_page.getCountOfLinks("subSection",loopCount);
	    //Get the subsystems tagged value from overview section and compare with count of links
		expect(overviewContents[inventoryTestData.twentyFourthIndex]).toEqual(count.toString());
	  });

	  it('Verify applications tagged in subsystem Details page', async function(){
		await util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		expect(util.isSelectedTabButton(inventoryTestData.resourcesButtonName)).toEqual(true);
		await inventory_page.searchTable(inventoryTestData.mainframeName)
		var count = await inventory_page.getApplicationOrResourcesTableHeaderTextCount();
		await inventory_page.getResourceWithTagData(count,"subSection");
		//Click on first subsection
		await inventory_page.clickAndGetNameTagSubSectionLink("subSection");
		//Validate susbsytem detail page header section
		var subsytemHeaders = await inventory_page.getTagsSectionHeaders();
		await expect(subsytemHeaders).toEqual(inventoryTestData.subsytemTagsHeaders);
		var overviewContents = await inventory_page.resourceOverviewSubSectionContentCheck();
		//Get the number of pages in the tags section
		var loopCount = await inventory_page.getPageCountForAppsResourcesTable();
		//Get unique count of name links from all pages
		var count = await inventory_page.getCountOfLinks("name",loopCount);
		//Get the applications tagged value from overview section and compare with count of links
		expect(overviewContents[inventoryTestData.twentyOneIndex]).toEqual(count.toString());

		});

	  it('Verify LPARs tagged in subsystem Details page', async function(){
		await util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		expect(util.isSelectedTabButton(inventoryTestData.resourcesButtonName)).toEqual(true);
		await inventory_page.searchTable(inventoryTestData.mainframeName)
		var count = await inventory_page.getApplicationOrResourcesTableHeaderTextCount();
		await inventory_page.getResourceWithTagData(count,"subSection");
		//Click on first subsection
		await inventory_page.clickAndGetNameTagSubSectionLink("subSection");
		//Validate susbsytem detail page header section
		var subsytemHeaders = await inventory_page.getTagsSectionHeaders();
		await expect(subsytemHeaders).toEqual(inventoryTestData.subsytemTagsHeaders);
		var overviewContents = await inventory_page.resourceOverviewSubSectionContentCheck();
		//Get the number of pages in the tags section
		var loopCount = await inventory_page.getPageCountForAppsResourcesTable();
		//Get unique count of name links from all pages
		var count = await inventory_page.getCountOfLinks("associatedTo",loopCount);
		//Get the applications tagged value from overview section and compare with count of links
		expect(overviewContents[inventoryTestData.twentyTwoIndex]).toEqual(count.toString());	
	   });


	 it('Verify subsystems tagged and LPARs tagged in Associated resources column in associated overview page for mainframe resource', async function(){
		await util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		expect(util.isSelectedTabButton(inventoryTestData.resourcesButtonName)).toEqual(true);
		await inventory_page.searchTable(inventoryTestData.mainframeName);
		var count = await inventory_page.getApplicationOrResourcesTableHeaderTextCount();
		//Get the resource which has application tagged
		await inventory_page.getResourceWithTagData(count,"name");
		await expect(inventory_page.getViewDetailsOverviewLabelText()).toEqual(inventoryTestData.OverviewTitle);
		await inventory_page.getListViewHeaders();
		//Click on application available in tags section
		await inventory_page.clickAndGetNameTagSubSectionLink("name");
		//Get the count of Subsystems and LPAR's tagged by navigating to all pages
		var counts = await inventory_page.getSubsystemsCountAsscOverview();
		//Get subsytems count from LPAR details page
        var subSystemsTaggedFromPages = counts.subSystemCount;
		//Get the subsytems count displayed in overview section
		var overviewContents = await inventory_page.resourceOverviewSubSectionContentCheck();
		var subSystemsTaggedFromOverview = (overviewContents[1]).split(" ")[0];
		//Compare the susbystems count with count in associated resources in overview section
		expect(subSystemsTaggedFromOverview).toEqual(subSystemsTaggedFromPages.toString());	
		//Get LPAR's count from LPAR details page
		var lparTaggedFromAssocOverview = counts.lparCount;
		//Get the subsytems count displayed in overview section
		var overviewContents = await inventory_page.resourceOverviewSubSectionContentCheck();
		var lparsTaggedFromOverview = (overviewContents[1]).split(" ")[2];
		//Compare the lpar's count with count in associated resources in overview sectionx
		expect(lparsTaggedFromOverview).toEqual(lparTaggedFromAssocOverview.toString());	

	  });

	}

	it("Verify if all elements within Applications tab are loaded and ES response validation with application tab ui values", async function () {
		expect(util.isSelectedTabButton(inventoryTestData.applicationsButtonName)).toEqual(true);
		expect(inventory_page.isTitleTextFromSectionPresent(inventoryTestData.topInsightsSectionLabel)).toBe(true);
		expect(inventory_page.isTitleTextFromSectionPresent(inventoryTestData.applicationBreakdownSectionLabel)).toBe(true);
		expect(inventory_page.isTitleTextFromSectionPresent(inventoryTestData.applicationsByRegionSectionLabel)).toBe(true);
		expect(inventory_page.verifyTopInsightsSubSectionLabelText(inventoryTestData.applicationsWithMostResourcesSubSectionLabel)).toEqual(true);
		expect(inventory_page.verifyTopInsightsSubSectionLabelText(inventoryTestData.applicationsWithMostActiveResourcesSubSectionLabel)).toEqual(true);
		expect(inventory_page.verifyTopInsightsSubSectionLabelText(inventoryTestData.applicationsWithMostEOLResourcesSubSectionLabel)).toEqual(true);
		expect(inventory_page.isTitleTextFromSectionPresent(inventoryTestData.applicationsTableLabel)).toBe(true);
		logger.info("===============================================");
		logger.info("ES Validation flag value: "+ isEnabledESValidation);
		logger.info("===============================================");
		if (isEnabledESValidation) {
			logger.info("==============ES Data Validation===================");
			//Application with most resources
			var uiresponse=await inventory_page.getResourcesCountFromTopInsightsSubSectionFrmUiForEsValidation(inventoryTestData.applicationsWithMostResourcesSubSectionLabel);
			var dbresponse=await esQueriesInventory.application_With_Most_Resources(inventoryTestData.eSInventorySearchIndex,tenantId);
			expect(util.isJsonObjectsEqual(dbresponse,uiresponse)).toBe(true);
			
			//Application with most active resources
			var uiresponse=await inventory_page.getResourcesCountFromTopInsightsSubSectionFrmUiForEsValidation(inventoryTestData.applicationsWithMostActiveResourcesSubSectionLabel);
			var dbresponse=await esQueriesInventory.application_With_Most_Active_Resources(inventoryTestData.eSInventorySearchIndex,tenantId);
			expect(util.isJsonObjectsEqual(dbresponse,uiresponse)).toBe(true);
			
			//Application with most EOL resources
			var uiresponse=await inventory_page.getResourcesCountFromTopInsightsSubSectionFrmUiForEsValidation(inventoryTestData.applicationsWithMostEOLResourcesSubSectionLabel);
			var dbresponse=await esQueriesInventory.application_With_EOL_Resources(inventoryTestData.eSInventorySearchIndex,tenantId);
			expect(util.isJsonObjectsEqual(dbresponse,uiresponse)).toBe(true);
		}
		expect(inventory_page.isAppResTableDisplayed()).toBe(true);
	});

	if (isEnabledESValidation) {
		it("Verify Data center and Multicloud resource count from es response", async function () {	
			logger.info("==============ES Data Validation===================");
			var dataCentreList = await inventory_page.getMCAndDCListFromDashboardInventoryCard("DC");
			var multiCloudList = await inventory_page.getMCAndDCListFromDashboardInventoryCard("MC");
			await inventory_page.navigateDashboardInventory();
			await util.clickOnTabButton(inventoryTestData.resourcesButtonName);
			expect(util.isSelectedTabButton(inventoryTestData.resourcesButtonName)).toEqual(true);
			// Datacenter resources count from kibana page
			var uiDataCenterResponse = await inventory_page.getDataCenterAndMulticloudResourcesCountForEs(dataCentreList);
			var esDataCenterResponse = await esQueriesInventory.dataCenter_Resources_count(inventoryTestData.eSInventorySearchIndex,tenantId);
			expect(util.isJsonObjectsEqual(esDataCenterResponse,uiDataCenterResponse)).toBe(true);
			healthInventoryUtil.clickOnClearFilterButton();
			//Multicloud resources count from kibana page
			var uiMultiCloudResponse = await inventory_page.getDataCenterAndMulticloudResourcesCountForEs(multiCloudList);
			var esMultiCloudResponse = await esQueriesInventory.multiCloud_Resources_count(inventoryTestData.eSInventorySearchIndex,tenantId);
			expect(util.isJsonObjectsEqual(esMultiCloudResponse,uiMultiCloudResponse)).toBe(true);
		});
	}
	
	if (isEnabledESValidation) {
		it("Verify untagged resources application, environment, unmanagged count from es response", async function () {	
			logger.info("==============ES Data Validation===================");
			util.waitForAngular();
			await util.clickOnTabButton(inventoryTestData.resourcesButtonName);
			expect(util.isSelectedTabButton(inventoryTestData.resourcesButtonName)).toEqual(true);
			var uiApplicationCount = await inventory_page.getCategoryResourceCountFromTopInsightsSubSection(inventoryTestData.untaggedResourcesSubSectionLabel, inventoryTestData.untaggedResourcesApplicationLabel);
			var esApplicationResponse = await esQueriesInventory.untagged_Resources_Application_count(inventoryTestData.eSInventorySearchIndex, tenantId);
			expect(uiApplicationCount).toEqual(esApplicationResponse);

			var uiEnvironmentCount = await inventory_page.getCategoryResourceCountFromTopInsightsSubSection(inventoryTestData.untaggedResourcesSubSectionLabel, inventoryTestData.untaggedResourcesEnvironmentLabel);
			var esEnvironmentResponse = await esQueriesInventory.untagged_Resources_Environment_count(inventoryTestData.eSInventorySearchIndex, tenantId);
			expect(uiEnvironmentCount).toEqual(esEnvironmentResponse);

			var uiUnmanagedCount = await inventory_page.getCategoryResourceCountFromTopInsightsSubSection(inventoryTestData.untaggedResourcesSubSectionLabel, inventoryTestData.untaggedResourcesUnmanagedLabel);
			var esUnmanagedResponse = await esQueriesInventory.untagged_Resources_Unmanaged_count(inventoryTestData.eSInventorySearchIndex, tenantId);
			expect(uiUnmanagedCount).toEqual(esUnmanagedResponse);
		});

		it("Verify Cloud Ready, Upgrade required , Re-platform required counts from es response", async function () {
			logger.info("==============ES Data Validation===================");
			util.waitForAngular();
			await util.clickOnTabButton(inventoryTestData.resourcesButtonName);
			expect(util.isSelectedTabButton(inventoryTestData.resourcesButtonName)).toEqual(true);
			//validate the Insight Headers
			expect(inventory_page.verifyTopInsightsSubSectionLabelText(inventoryTestData.resourceCloudReadinessSubSectionLabel)).toEqual(true);
			// Fetch the count from Ui and es query and compare
			var uiCloudReadyCount = await inventory_page.getCategoryResourceCountFromTopInsightsSubSection(inventoryTestData.resourceCloudReadinessSubSectionLabel, inventoryTestData.resourceCloudReadyLabel);
			var esCloudReadyResponse = await esQueriesInventory.cloud_Readiness_Counts(inventoryTestData.eSInventorySearchIndex, tenantId, "READY");
			expect(uiCloudReadyCount).toEqual(esCloudReadyResponse);
			var uiUpgradeRequiredCount = await inventory_page.getCategoryResourceCountFromTopInsightsSubSection(inventoryTestData.resourceCloudReadinessSubSectionLabel, inventoryTestData.resourceUpgradeRequiredLabel);
			var esUpgradeRequiredResponse = await esQueriesInventory.cloud_Readiness_Counts(inventoryTestData.eSInventorySearchIndex, tenantId,"UPGRADE");
			expect(uiUpgradeRequiredCount).toEqual(esUpgradeRequiredResponse);
			var uiRePlatformRequiredCount = await inventory_page.getCategoryResourceCountFromTopInsightsSubSection(inventoryTestData.resourceCloudReadinessSubSectionLabel, inventoryTestData.resourceRePlatformRequiredLabel);
			var esRePlatformRequiredResponse = await esQueriesInventory.cloud_Readiness_Counts(inventoryTestData.eSInventorySearchIndex, tenantId, "REPLATFORM");
			expect(uiRePlatformRequiredCount).toEqual(esRePlatformRequiredResponse);
		});

		it("Verify Monitored resources by netcool , Not Monitored by Netcool, Total Resources counts from es response", async function () {
			logger.info("==============ES Data Validation===================");
			util.waitForAngular();
			await util.clickOnTabButton(inventoryTestData.resourcesButtonName);
			expect(util.isSelectedTabButton(inventoryTestData.resourcesButtonName)).toEqual(true);
			//validate the Insight Headers
			expect(inventory_page.verifyTopInsightsSubSectionLabelText(inventoryTestData.monitoredResourcesSubSectionLabel)).toEqual(true);
			// Fetch the count from Ui and es query and compare
			var uiMonitoredCount = await inventory_page.getCategoryResourceCountFromTopInsightsSubSection(inventoryTestData.monitoredResourcesSubSectionLabel, inventoryTestData.resourcesMonitoredByNetcoolLabel);
			var esMonitoredResponse = await esQueriesInventory.monitored_Resource_Counts(inventoryTestData.eSInventorySearchIndex, tenantId, "YES");
			expect(uiMonitoredCount).toEqual(esMonitoredResponse);
			var uiNotMonitoredCount = await inventory_page.getCategoryResourceCountFromTopInsightsSubSection(inventoryTestData.monitoredResourcesSubSectionLabel, inventoryTestData.resourcesNotMonitoredByNetcoolLabel);
			var esNotMonitoredResponse = await esQueriesInventory.monitored_Resource_Counts(inventoryTestData.eSInventorySearchIndex, tenantId, "NO");
			expect(uiNotMonitoredCount).toEqual(esNotMonitoredResponse);
			var uiTotalCount = await inventory_page.getCategoryResourceCountFromTopInsightsSubSection(inventoryTestData.monitoredResourcesSubSectionLabel, inventoryTestData.totalResourcesUnderMonitoredSubSectionLabel);
			expect(uiTotalCount).toEqual(esMonitoredResponse+esNotMonitoredResponse);
		});

		it("Verify Firmware Currency Designator based on the level resource counts from es response", async function () {
			logger.info("==============ES Data Validation===================");
			util.waitForAngular();
			await util.clickOnTabButton(inventoryTestData.resourcesButtonName);
			expect(util.isSelectedTabButton(inventoryTestData.resourcesButtonName)).toEqual(true);
			//validate the Insight Headers
			expect(inventory_page.verifyTopInsightsSubSectionLabelText(inventoryTestData.resourceCurrencyDesignatorSubSectionLabel)).toEqual(true);
			// Fetch the count from Ui and es query and compare
			var uiBelowTargetLevelCount = await inventory_page.getCategoryResourceCountFromTopInsightsSubSection(inventoryTestData.resourceCurrencyDesignatorSubSectionLabel, inventoryTestData.currencyDesignatorBelowTargetLevel);
			var esBelowTargetLevelResponse = await esQueriesInventory.firmware_Currency_Designator_count(inventoryTestData.eSInventorySearchIndex, tenantId, "N-1");
			expect(uiBelowTargetLevelCount).toEqual(esBelowTargetLevelResponse);
			var uiTargetLevelCount = await inventory_page.getCategoryResourceCountFromTopInsightsSubSection(inventoryTestData.resourceCurrencyDesignatorSubSectionLabel, inventoryTestData.currencyDesignatorTargetLevel);
			var esTargetLevelResponse = await esQueriesInventory.firmware_Currency_Designator_count(inventoryTestData.eSInventorySearchIndex, tenantId, "N");
			expect(uiTargetLevelCount).toEqual(esTargetLevelResponse);
			var uiAboveTargetLevelCount = await inventory_page.getCategoryResourceCountFromTopInsightsSubSection(inventoryTestData.resourceCurrencyDesignatorSubSectionLabel, inventoryTestData.currencyDesignatorAboveTargetLevel);
			var esAboveTargetLevelResponse = await esQueriesInventory.firmware_Currency_Designator_count(inventoryTestData.eSInventorySearchIndex, tenantId, "N+1");
			expect(uiAboveTargetLevelCount).toEqual(esAboveTargetLevelResponse);
		});
	}
	
	if (browser.params.dataValiadtion) {
		it("Verify Applications tab UI data with Elastic view JSON data", async function () {
			logger.info("------Data Validation------");
			var inventoryAppData = elasticViewData.inventory.applications.no_filters.expected_values;
			util.clickOnTabButton(inventoryTestData.applicationsButtonName);
			util.waitOnlyForInvisibilityOfKibanaDataLoader();
			/**
			 * Validation for Top Insights section in Applications tab
			 */
			// Verify resources count under sub-section Applications with Most Resources
			var appsWithMostResourcesCount = util.getDataFromElasticViewJSON(inventoryAppData[inventoryTestData.topInsightsJsonKey], inventoryTestData.applicationsWithMostResourcesJsonKey);
			var resourceCountList = await inventory_page.getResourcesCountFromTopInsightsSubSection(inventoryTestData.applicationsWithMostResourcesSubSectionLabel);
			expect(util.IsDataMissingInJSONOrUI(appsWithMostResourcesCount, resourceCountList)).toBe(true);
			if (util.IsDataMissingInJSONOrUI(appsWithMostResourcesCount, resourceCountList)) {
				for (var i = 0; i < Object.keys(appsWithMostResourcesCount).length; i++) {
					expect(Object.values(appsWithMostResourcesCount)[i]).toEqual(parseInt(resourceCountList[i]));
				}
			}
			// Verify resources count under sub-section Applications with Most Active Resources
			var appsWithMostActiveResourcesCount = util.getDataFromElasticViewJSON(inventoryAppData[inventoryTestData.topInsightsJsonKey], inventoryTestData.applicationsWithMostActiveResourcesJsonKey);
			resourceCountList = await inventory_page.getResourcesCountFromTopInsightsSubSection(inventoryTestData.applicationsWithMostActiveResourcesSubSectionLabel);
			expect(util.IsDataMissingInJSONOrUI(appsWithMostActiveResourcesCount, resourceCountList)).toBe(true);
			if (util.IsDataMissingInJSONOrUI(appsWithMostActiveResourcesCount, resourceCountList)) {
				for (var i = 0; i < Object.keys(appsWithMostActiveResourcesCount).length; i++) {
					expect(Object.values(appsWithMostActiveResourcesCount)[i]).toEqual(parseInt(resourceCountList[i]));
				}
			}
			// Verify resources count under sub-section Applications with Most EOL Resources
			var appsWithMostEolResourcesCount = util.getDataFromElasticViewJSON(inventoryAppData[inventoryTestData.topInsightsJsonKey], inventoryTestData.applicationsWithMostEolResourcesJsonKey);
			resourceCountList = await inventory_page.getResourcesCountFromTopInsightsSubSection(inventoryTestData.applicationsWithMostEOLResourcesSubSectionLabel);
			expect(util.IsDataMissingInJSONOrUI(appsWithMostEolResourcesCount, resourceCountList)).toBe(true);
			if (util.IsDataMissingInJSONOrUI(appsWithMostEolResourcesCount, resourceCountList)) {
				for (var i = 0; i < Object.keys(appsWithMostEolResourcesCount).length; i++) {
					expect(Object.values(appsWithMostEolResourcesCount)[i]).toEqual(parseInt(resourceCountList[i]));
				}
			}
		});
	}

	it("Verify if all elements within Resources tab are loaded or not", function () {
		util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		expect(util.isSelectedTabButton(inventoryTestData.resourcesButtonName)).toEqual(true);
		expect(inventory_page.isTitleTextFromSectionPresent(inventoryTestData.topInsightsSectionLabel)).toBe(true);
		expect(inventory_page.isTitleTextFromSectionPresent(inventoryTestData.resourcesBreakdownSectionLabel)).toBe(true);
		expect(inventory_page.isTitleTextFromSectionPresent(inventoryTestData.resourcesByRegionSectionLabel)).toBe(true);
		expect(inventory_page.verifyTopInsightsSubSectionLabelText(inventoryTestData.untaggedResourcesSubSectionLabel)).toEqual(true);
		inventory_page.getResourcesCountFromTopInsightsSubSection(inventoryTestData.untaggedResourcesSubSectionLabel);
		expect(inventory_page.verifyTopInsightsSubSectionLabelText(inventoryTestData.monitoredResourcesSubSectionLabel)).toEqual(true);
		inventory_page.getResourcesCountFromTopInsightsSubSection(inventoryTestData.monitoredResourcesSubSectionLabel);
		expect(inventory_page.verifyTopInsightsSubSectionLabelText(inventoryTestData.resourceCloudReadinessSubSectionLabel)).toEqual(true);
		inventory_page.getResourcesCountFromTopInsightsSubSection(inventoryTestData.resourceCloudReadinessSubSectionLabel);
		expect(inventory_page.verifyTopInsightsSubSectionLabelText(inventoryTestData.resourceCurrencyDesignatorSubSectionLabel)).toEqual(true);
		inventory_page.getResourcesCountFromTopInsightsSubSection(inventoryTestData.resourceCurrencyDesignatorSubSectionLabel);
		expect(inventory_page.isTitleTextFromSectionPresent(inventoryTestData.resourcesTableLabel)).toBe(true);
		expect(inventory_page.isAppResTableDisplayed()).toBe(true);
	});

	if (browser.params.dataValiadtion) {
		it("Verify Resources tab UI data with Elastic view JSON data", async function () {
			logger.info("------Data Validation------");
			var inventoryResData = elasticViewData.inventory.resources.no_filters.expected_values;
			util.clickOnTabButton(inventoryTestData.resourcesButtonName);
			util.waitOnlyForInvisibilityOfKibanaDataLoader();
			/**
			 * Validation for Top Insights section in Resources tab
			 */
			// Verify resources count under sub-section Untagged Resources
			var untaggedResourcesCount = util.getDataFromElasticViewJSON(inventoryResData[inventoryTestData.topInsightsJsonKey], inventoryTestData.untaggedResourcesJsonKey);
			var resourceCountList = await inventory_page.getResourcesCountFromTopInsightsSubSection(inventoryTestData.untaggedResourcesSubSectionLabel);
			expect(util.IsDataMissingInJSONOrUI(untaggedResourcesCount, resourceCountList)).toBe(true);
			if (util.IsDataMissingInJSONOrUI(untaggedResourcesCount, resourceCountList)) {
				for (var i = 0; i < Object.keys(untaggedResourcesCount).length; i++) {
					expect(Object.values(untaggedResourcesCount)[i]).toEqual(parseInt(resourceCountList[i]));
				}
			}
			// Verify resources count under sub-section Monitored Resources
			var monitoredResourcesCount = util.getDataFromElasticViewJSON(inventoryResData[inventoryTestData.topInsightsJsonKey], inventoryTestData.monitoredResourcesJsonKey);
			resourceCountList = await inventory_page.getResourcesCountFromTopInsightsSubSection(inventoryTestData.monitoredResourcesSubSectionLabel);
			expect(util.IsDataMissingInJSONOrUI(monitoredResourcesCount, resourceCountList)).toBe(true);
			if (util.IsDataMissingInJSONOrUI(monitoredResourcesCount, resourceCountList)) {
				for (var i = 0; i < Object.keys(monitoredResourcesCount).length; i++) {
					expect(Object.values(monitoredResourcesCount)[i]).toEqual(parseInt(resourceCountList[i]));
				}
			}
			// Verify resources count under sub-section Resource Cloud Readiness
			var resourceCloudReadinessCount = util.getDataFromElasticViewJSON(inventoryResData[inventoryTestData.topInsightsJsonKey], inventoryTestData.resourceCloudReadinessJsonKey);
			resourceCountList = await inventory_page.getResourcesCountFromTopInsightsSubSection(inventoryTestData.resourceCloudReadinessSubSectionLabel);
			expect(util.IsDataMissingInJSONOrUI(resourceCloudReadinessCount, resourceCountList)).toBe(true);
			if (util.IsDataMissingInJSONOrUI(resourceCloudReadinessCount, resourceCountList)) {
				for (var i = 0; i < Object.keys(resourceCloudReadinessCount).length; i++) {
					expect(Object.values(resourceCloudReadinessCount)[i]).toEqual(parseInt(resourceCountList[i]));
				}
			}
			// Verify resources count under sub-section Resource Currency Designator
			var resourceCurrencyDesignatorCount = util.getDataFromElasticViewJSON(inventoryResData[inventoryTestData.topInsightsJsonKey], inventoryTestData.resourceCurrencyDesignatorJsonKey);
			var resourceCountList = await inventory_page.getResourcesCountFromTopInsightsSubSection(inventoryTestData.resourceCurrencyDesignatorSubSectionLabel);
			expect(util.IsDataMissingInJSONOrUI(resourceCurrencyDesignatorCount, resourceCountList)).toBe(true);
			if (util.IsDataMissingInJSONOrUI(resourceCurrencyDesignatorCount, resourceCountList)) {
				for (var i = 0; i < Object.keys(resourceCurrencyDesignatorCount).length; i++) {
					expect(Object.values(resourceCurrencyDesignatorCount)[i]).toEqual(parseInt(resourceCountList[i]));
				}
			}
		});
	}
	
	it('Verify inventory card data count for Multicloud is displaying properly', async function() { 
		healthInventoryUtil.clickOnBreadcrumbLink(inventoryTestData.aiopsConsoleLabel);
		util.switchToFrame();
		dashboard_page.clickOnMiniViewIcon();
		var multicloudInventoryCount = await dashboard_page.getTextFromMiniViewCard(dashboardTestData.inventory, dashboardTestData.multiCloud);
		if(multicloudInventoryCount > 0){
			dashboard_page.clickOnLargeViewIcon();
			// Get all legends from inventory card pie chart
			var legendList = await dashboard_page.getAllLegendsFromInventoryCard();
			var filteredList = [];
			// Remove IBM Data center and MY DC from list
			for(var i=0; i<legendList.length; i++){
				if(legendList[i] != inventoryTestData.IBMDataCenter && legendList[i] != inventoryTestData.MyDataCenter){
					filteredList.push(legendList[i]);
				}
			}
			inventory_page.navigateDashboardInventory();
			await util.clickOnTabButton(inventoryTestData.resourcesButtonName);
			expect(util.isSelectedTabButton(inventoryTestData.resourcesButtonName)).toEqual(true);
			// Click on all providers from multi-cloud
			for(var j=0; j<filteredList.length; j++){
				await healthInventoryUtil.clickOnProviderCheckBox(filteredList[j]);
			}
			await healthInventoryUtil.clickOnApplyFilterButton();
			await expect(multicloudInventoryCount).toEqual(await inventory_page.getApplicationOrResourcesTableHeaderTextCount());
	    }
    });
	
	it('Verify inventory card data count for Data center is displaying properly', async function() { 
		//Check if MY DC and IBM DC filters are present or not
		var dcProvidersList = await inventory_page.getMCAndDCListFromDashboardInventoryCard("DC");
		await inventory_page.navigateDashboardInventory();
		var providerPresentText =await inventory_page.checkPresenceOfProviderInGlobalFilter(dcProvidersList, inventoryTestData.MyDataCenter);
		healthInventoryUtil.clickOnBreadcrumbLink(inventoryTestData.aiopsConsoleLabel);
		util.switchToFrame();
		dashboard_page.clickOnMiniViewIcon();
		var dataCenterInventoryCount = await dashboard_page.getTextFromMiniViewCard(dashboardTestData.inventory, dashboardTestData.dataCenter);
		if(dataCenterInventoryCount > 0){
			dashboard_page.clickOnLargeViewIcon();
			await inventory_page.navigateDashboardInventory();
			await util.clickOnTabButton(inventoryTestData.resourcesButtonName);
			expect(util.isSelectedTabButton(inventoryTestData.resourcesButtonName)).toEqual(true);
			healthInventoryUtil.clickOnProviderCheckBox(inventoryTestData.IBMDataCenter);
			if(providerPresentText == inventoryTestData.MyDataCenter)
			healthInventoryUtil.clickOnProviderCheckBox(inventoryTestData.MyDataCenter);
			healthInventoryUtil.clickOnApplyFilterButton();
			expect(dataCenterInventoryCount).toEqual(inventory_page.getApplicationOrResourcesTableHeaderTextCount());
		}
    });
	
	it('Verify local filter is applying and count is matching on Applications tab', async function() { 
		expect(util.isSelectedTabButton(inventoryTestData.applicationsButtonName)).toEqual(true);
		var appCountBefore = await inventory_page.getApplicationOrResourcesTableHeaderTextCount();
		inventory_page.selectCategoryFromAppResBreakdownWidget(inventoryTestData.dropDownProvider);
		inventory_page.clickOnFirstAppResBreakdownFilter();
		var appCountAfter = await inventory_page.getApplicationOrResourcesTableHeaderTextCount();
		expect(appCountBefore).toBeGreaterThanOrEqual(appCountAfter);
	});
	
	it('Verify local filter is applying and count is matching on Resources tab', async function() { 
		await util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		expect(util.isSelectedTabButton(inventoryTestData.resourcesButtonName)).toEqual(true);
		var resourceCountBefore = await inventory_page.getApplicationOrResourcesTableHeaderTextCount();
		inventory_page.selectCategoryFromAppResBreakdownWidget(inventoryTestData.dropDownProvider);
		inventory_page.clickOnFirstAppResBreakdownFilter();
		var resourceCountAfter = await inventory_page.getApplicationOrResourcesTableHeaderTextCount();
		expect(resourceCountBefore).toBeGreaterThanOrEqual(resourceCountAfter);
	});

	it('Verify Application List view headers, sort functionality, pagination and view details', async function(){
		util.clickOnTabButton(inventoryTestData.applicationsButtonName);
		expect(inventory_page.getAppsResTableSectionLabelText()).toEqual(inventoryTestData.applicationsTableLabel);
		var headers = await inventory_page.getListViewHeaders();
		await expect(headers).toEqual(inventoryTestData.applicationTableHeaders);
		await expect(inventory_page.isTableSearchBarDisplayed()).toBe(true);
		await inventory_page.clickOnTableSort(3);
		await expect(inventory_page.clickOnItemsPerPage(inventory_page.applicationResourceTableItemsPerPageCss, "Items Per Page", 0)).toBeTruthy()
		await expect(inventory_page.clickOnItemsPerPage(inventory_page.applicationResourceTablePageNumberCss, "Pagination", 0)).toBeTruthy()
		await inventory_page.clickOnTableSort(3);
		await expect(inventory_page.isViewDetailsButtonDisplayed(inventoryTestData.zerothIndex)).toBe(true);
		await inventory_page.clickOnViewDetails();
		await expect(inventory_page.getViewDetailsOverviewLabelText()).toEqual(inventoryTestData.OverviewTitle);
	});


	it('Verify if Applications list table has an export option with CSV & JSON format', function(){
		util.clickOnTabButton(inventoryTestData.applicationsButtonName);
		expect(inventory_page.getAppsResTableSectionLabelText()).toEqual(inventoryTestData.applicationsTableLabel);
		expect(inventory_page.isTableExportDisplayed()).toBe(true);
		expect(inventory_page.clickOnExport(1, "JSON")).toBe(true);
		expect(inventory_page.clickOnExport(0, "CSV")).toBe(true);
	});

    it('Verify Resource List view headers, sort functionality, pagination and view details', async function(){
		await util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		await expect(inventory_page.getAppsResTableSectionLabelText()).toEqual(inventoryTestData.resourcesTableLabel);
		var headers = await inventory_page.getListViewHeaders();
		await expect(headers).toEqual(inventoryTestData.resourceTableHeaders);
		await expect(inventory_page.isTableSearchBarDisplayed()).toBe(true);
		await inventory_page.clickOnTableSort(3);
		await expect(inventory_page.clickOnItemsPerPage(inventory_page.applicationResourceTableItemsPerPageCss, "Items Per Page", 0)).toBeTruthy()
		await inventory_page.searchTable(inventoryTestData.sampleSearchText);
		await expect(inventory_page.clickOnItemsPerPage(inventory_page.applicationResourceTablePageNumberCss, "Pagination", 0)).toBeTruthy()
		await inventory_page.clickOnTableSort(3);
		await expect(inventory_page.isViewDetailsButtonDisplayed(inventoryTestData.zerothIndex)).toBe(true);
		await inventory_page.clickOnViewDetails();
		await expect(inventory_page.getViewDetailsOverviewLabelText()).toEqual(inventoryTestData.OverviewTitle);

	});
   
	it("Verify count of Data centre categories in DC summary is matching with resource list view", async function () {	
		var count =[];
		var dataCentreList = await inventory_page.getMCAndDCListFromDashboardInventoryCard("DC");
		inventory_page.navigateDashboardInventory();
		await util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		expect(util.isSelectedTabButton(inventoryTestData.resourcesButtonName)).toEqual(true);
		// Apply Datacenter filter in global filters
		await inventory_page.getDataCenterAndMulticloudResourcesCountForEs(dataCentreList);
		var DCResrcSummaryObj = await inventory_page.getDCResrcSummaryTextAndCount();
		await expect(DCResrcSummaryObj.subcategorytext).toEqual(inventoryTestData.dCResourceSummary);
		//Get the resource list view count corresponding to DC Summary
		count = await inventory_page.getListViewCountWrtDCSummary(DCResrcSummaryObj);
		//Verify the counts in list view against DC Summary
		await expect(DCResrcSummaryObj.subcategorycount).toEqual(count);
	});

    it("Verify count of MC categories in MC summary is matching with resource list view", async function () {	
		var count =[];
		var multiCloudList = await inventory_page.getMCAndDCListFromDashboardInventoryCard("MC");
		inventory_page.navigateDashboardInventory();
		await util.clickOnTabButton(inventoryTestData.applicationsButtonName);
		await util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		await expect(util.isSelectedTabButton(inventoryTestData.resourcesButtonName)).toEqual(true);
		// Apply Multicloud filter in global filters
		await inventory_page.getDataCenterAndMulticloudResourcesCountForEs(multiCloudList);
		var MCResrcSummaryObj = await inventory_page.getMCResrcSummaryTextAndCount();
		await expect(MCResrcSummaryObj.subcategorytext).toEqual(inventoryTestData.mCResourceSummary);
	    //Get the resource list view count corresponding to MC Summary
		count = await inventory_page.getListViewCountWrtMCSummary(MCResrcSummaryObj);
		//Verify the counts in list view against MC Summary
		await expect(MCResrcSummaryObj.subcategorycount).toEqual(count);

	});


	it('Verify if all elements within Global filter loaded or not in Inventory', async function(){
		//healthInventoryUtil.clickOnBreadcrumbLink(inventoryTestData.aiopsConsoleLabel);
		util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		let gfilter = await inventory_page.isGlobalFilterDisplayed();
		let filterCategory = await inventory_page.isPresentglobalFilterCategories(inventoryTestData.globalFilterCategories);
		if(gfilter && filterCategory){
			await expect(inventory_page.isPresentglobalFilterProviderSubCategories(inventoryTestData.globalFilterProviderSubCategories)).toBe(true);
			await expect(inventory_page.isPresentglobalFilterProviders()).toBe(true);
			await healthInventoryUtil.clickOnProviderCheckBox(inventoryTestData.awsProvider);
			await healthInventoryUtil.clickOnApplyFilterButton();
			await healthInventoryUtil.clickOnClearFilterButton();
		}
		else{
			expect(filterCategory).toEqual(false);
		}
	});

	it('Verify interaction between resource breakdown and list view for Resource Category dropdown', async function(){
		//Resource Category Dropdown
		util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		await expect(inventory_page.getAppResBreakdownSectionLabelText()).toEqual(inventoryTestData.resourcesBreakdownSectionLabel);
		inventory_page.selectCategoryFromAppResBreakdownWidget(inventoryTestData.dropDownResourceCategory);
        //Get list view count and Breakdown count
		var interactionObj = await inventory_page.interactionBetweenBreakdownListView(inventoryTestData.resourceCategories,inventoryTestData.resources);
		//Compare list view count with resource breakdown count
		await expect(interactionObj.listViewCount).toEqual(interactionObj.breakdownCount);
	});

	it('Verify interaction between resource breakdown and list view for Provider dropdown', async function(){
		//Get MC Providers list from Dashboard
		var multiCloudList = await inventory_page.getMCAndDCListFromDashboardInventoryCard("MC");
		await inventory_page.navigateDashboardInventory();
		await util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		await expect(inventory_page.getAppResBreakdownSectionLabelText()).toEqual(inventoryTestData.resourcesBreakdownSectionLabel);
		await inventory_page.getDataCenterAndMulticloudResourcesCountForEs(multiCloudList);
		await inventory_page.selectCategoryFromAppResBreakdownWidget(inventoryTestData.dropDownProvider);
		//Compare list view count with resource breakdown count
		var interactionObj = await inventory_page.interactionBetweenBreakdownListView(multiCloudList,inventoryTestData.resources);
		//Compare list view count with resource breakdown count
		await expect(interactionObj.listViewCount).toEqual(interactionObj.breakdownCount);

		//Get DC Providers list from Dashboard
		var dataCentreList = await inventory_page.getMCAndDCListFromDashboardInventoryCard("DC");
		await inventory_page.navigateDashboardInventory();
		await util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		await expect(inventory_page.getAppResBreakdownSectionLabelText()).toEqual(inventoryTestData.resourcesBreakdownSectionLabel);
		await inventory_page.getDataCenterAndMulticloudResourcesCountForEs(dataCentreList);
		await inventory_page.selectCategoryFromAppResBreakdownWidget(inventoryTestData.dropDownProvider);
		//Compare list view count with resource breakdown count
		var interactionObj = await inventory_page.interactionBetweenBreakdownListView(dataCentreList,inventoryTestData.resources);
		//Compare list view count with resource breakdown count
		await expect(interactionObj.listViewCount).toEqual(interactionObj.breakdownCount);
	});

	it('Verify interaction between resource breakdown and list view for Teams dropdown', async function(){
		util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		//Get list of teams from global filter
		var teamsList = await inventory_page.getglobalFilterTeamsList();
		await expect(inventory_page.getAppResBreakdownSectionLabelText()).toEqual(inventoryTestData.resourcesBreakdownSectionLabel);
		inventory_page.selectCategoryFromAppResBreakdownWidget(inventoryTestData.dropDownTeam);
		//Get list view count and Breakdown count
		var interactionObj = await inventory_page.interactionBetweenBreakdownListView(teamsList,inventoryTestData.resources);
		//Compare list view count with resource breakdown count
		await expect(interactionObj.listViewCount).toEqual(interactionObj.breakdownCount);
		
	});	

	it('Verify interaction between resource breakdown and list view for Environment dropdown', async function(){
		util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		await expect(inventory_page.getAppResBreakdownSectionLabelText()).toEqual(inventoryTestData.resourcesBreakdownSectionLabel);
		await inventory_page.selectCategoryFromAppResBreakdownWidget(inventoryTestData.dropDownEnvironment);
		//Get environment values from Resource Breakdown
		var BoxContent = await inventory_page.getApplicationResourceBreakdownGraphText();
		//Get list view count and Breakdown count
		var interactionObj = await inventory_page.interactionBetweenBreakdownListView(BoxContent,inventoryTestData.resources);
		//Compare list view count with resource breakdown count
		await expect(interactionObj.listViewCount).toEqual(interactionObj.breakdownCount);
	});


	it('Verify whether resource list view is reverted to match  the deselection or selection of different View By', async function(){
		await util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		await expect(inventory_page.getAppsResTableSectionLabelText()).toEqual(inventoryTestData.resourcesTableLabel);
		await inventory_page.getListViewHeaders();
		var listViewCountBeforeClick = await inventory_page.getApplicationOrResourcesTableHeaderTextCount();
		await expect(inventory_page.getAppResBreakdownSectionLabelText()).toEqual(inventoryTestData.resourcesBreakdownSectionLabel);
	   //Select Resource Category Dropdown
		await inventory_page.selectCategoryFromAppResBreakdownWidget(inventoryTestData.dropDownResourceCategory);
		//Click on network resource category
		await inventory_page.clickAndGetTextFromSingleBreakdownBox(inventoryTestData.networkName);
		await inventory_page.getApplicationOrResourcesTableHeaderTextCount();
		//Select a diffrent view by - Team
		await inventory_page.selectCategoryFromAppResBreakdownWidget(inventoryTestData.dropDownTeam);
		var listViewCountDiffViewBy = await inventory_page.getApplicationOrResourcesTableHeaderTextCount();
		await expect(listViewCountBeforeClick).toEqual(listViewCountDiffViewBy);
	    //Select a Team
	    var teamsList = await inventory_page.getglobalFilterTeamsList();
	    await inventory_page.clickAndGetTextFromSingleBreakdownBox(teamsList[inventoryTestData.firstIndex]);
	    //Deselect the same attribute
	    await inventory_page.clickAndGetTextFromSingleBreakdownBox(teamsList[inventoryTestData.firstIndex]);
	    //List view count after deselection
		var listViewCountAfterDeselection = await inventory_page.getApplicationOrResourcesTableHeaderTextCount();
	    await expect(listViewCountDiffViewBy).toEqual(listViewCountAfterDeselection);

	});
	
	it('Verify whether Resource by Region widget is updated when resource breakdown segment is clicked', async function(){
		util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		//Get list of teams from global filter
		var teamsList = await inventory_page.getglobalFilterTeamsList();
		await expect(inventory_page.getAppResBreakdownSectionLabelText()).toEqual(inventoryTestData.resourcesBreakdownSectionLabel);
		await expect(inventory_page.getAppsResByRegionSectionLabelText()).toEqual(inventoryTestData.resourcesByRegionSectionLabel);
		await inventory_page.selectCategoryFromAppResBreakdownWidget(inventoryTestData.dropDownTeam);
		//Get resourcebyregion count and Breakdown count
		var interactionObj = await inventory_page.interactionBetweenBreakdownAndRegion(teamsList,inventoryTestData.resources);
		//Compare list view count with resource breakdown count
		await expect(interactionObj.resourcesByRegionCount).toEqual(interactionObj.resourcesCount);
	});

	it('Verify whether resource by region is reverted to match  the deselection or selection of different View By', async function(){
		await util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		expect(inventory_page.getAppResBreakdownSectionLabelText()).toEqual(inventoryTestData.resourcesBreakdownSectionLabel);
		expect(inventory_page.getAppsResByRegionSectionLabelText()).toEqual(inventoryTestData.resourcesByRegionSectionLabel);
		//Select Resource Category Dropdown
		await inventory_page.selectCategoryFromAppResBreakdownWidget(inventoryTestData.dropDownResourceCategory);
		var resourceByRegionBeforeClickRC = await inventory_page.getResourceByRegionCount();
		//Click on network resource category
		await inventory_page.clickAndGetTextFromSingleBreakdownBox(inventoryTestData.computeName);
		//Select a diffrent view by - Team
		await inventory_page.selectCategoryFromAppResBreakdownWidget(inventoryTestData.dropDownTeam);
		var resourceByRegionDiffViewBy = await inventory_page.getResourceByRegionCount();
		expect(resourceByRegionBeforeClickRC).toEqual(resourceByRegionDiffViewBy);
	    //Select a Team
		var teamsList = await inventory_page.getglobalFilterTeamsList();
		var resourceByRegionBeforeClickBU = await inventory_page.getResourceByRegionCount();
	    await inventory_page.clickAndGetTextFromSingleBreakdownBox(teamsList[inventoryTestData.firstIndex]);
	    //Deselect the same attribute
	    await inventory_page.clickAndGetTextFromSingleBreakdownBox(teamsList[inventoryTestData.firstIndex]);
	    //List view count after deselection
	    var resourceByRegionAfterDeselection = await inventory_page.getResourceByRegionCount();;
	    await expect(resourceByRegionBeforeClickBU).toEqual(resourceByRegionAfterDeselection);

	});

	/*it('Verify interaction between resource breakdown and list view for Operating System dropdown', async function(){
		util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		expect(inventory_page.getAppResBreakdownSectionLabelText()).toEqual(inventoryTestData.resourcesBreakdownSectionLabel);
		await inventory_page.selectCategoryFromAppResBreakdownWidget(inventoryTestData.dropDownOperatingSystem);
		//Get OS values from Resource Breakdown
		var toolTipContent = await inventory_page.getApplicationResourceBreakdownGraphToolTip();
		//Get list view count and Breakdown count
		var interactionObj = await inventory_page.interactionBetweenBreakdownListView(toolTipContent,inventoryTestData.resources);
		//Compare list view count with resource breakdown count
		await expect(interactionObj.listViewCount).toEqual(interactionObj.breakdownCount);
	});*/
	
	it('Verify whether Resource by Region widget is updated when resource breakdown segment is clicked for Operating System dropdown ', async function(){
		var multiCloudList = await inventory_page.getMCAndDCListFromDashboardInventoryCard("MC");
		await inventory_page.navigateDashboardInventory();
		await util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		await expect(util.isSelectedTabButton(inventoryTestData.resourcesButtonName)).toEqual(true);
		// Apply Multicloud filter in global filters
		await inventory_page.getDataCenterAndMulticloudResourcesCountForEs(multiCloudList);
		expect(inventory_page.getAppResBreakdownSectionLabelText()).toEqual(inventoryTestData.resourcesBreakdownSectionLabel);
		expect(inventory_page.getAppsResByRegionSectionLabelText()).toEqual(inventoryTestData.resourcesByRegionSectionLabel);
		await inventory_page.selectCategoryFromAppResBreakdownWidget(inventoryTestData.dropDownOperatingSystem);
		//Get OS values from Resource Breakdown
		var toolTipContent = await inventory_page.getApplicationResourceBreakdownGraphToolTip();
		//Get list view count and Breakdown count
		var interactionObj = await inventory_page.interactionBetweenBreakdownAndRegion(toolTipContent,inventoryTestData.resources);
		//Compare list view count with resource breakdown count
		await expect(interactionObj.resourcesByRegionCount).toEqual(interactionObj.resourcesCount);
	});

	it('Application : Verify that on applying provider global filters all the widgets in inventory dashboard gets updated and the selection is reverted when the filter is deselected', async function () {
		// Check for the presence of providers legends under Inventory on dashboard
		var globalFilterProviderData = await inventory_page.getMCAndDCListFromDashboardInventoryCard("MC");
		await inventory_page.navigateDashboardInventory();
		expect(util.isSelectedTabButton(inventoryTestData.applicationsButtonName)).toEqual(true);
		// fetch counts of top insights , App breakdown , resources by region , List view	before applying filter
		let appWidgetCountObjBefore = await inventory_page.getCountsFromAllWidgetsApplication();
		// Select first provider from global filter
		if (globalFilterProviderData.length != 0) {
			healthInventoryUtil.clickOnProviderCheckBox(globalFilterProviderData[0]);
		}
		// Click on Apply filter button in global filter section
		await healthInventoryUtil.clickOnApplyFilterButton();
		await util.waitOnlyForInvisibilityOfKibanaDataLoader();
		// fetch counts of top insights , App breakdown , resources by region , List view	after applying filter
		let appWidgetCountObjAfter = await inventory_page.getCountsFromAllWidgetsApplication();
		//Validations
		await expect(appWidgetCountObjBefore.applicationsWithMostResourcesCounts).not.toEqual(appWidgetCountObjAfter.applicationsWithMostResourcesCounts);
		await expect(appWidgetCountObjBefore.applicationsWithMostActiveResourcesCounts).not.toEqual(appWidgetCountObjAfter.applicationsWithMostActiveResourcesCounts);
		await expect(appWidgetCountObjBefore.applicationsWithMostEOLResourcesCounts).not.toEqual(appWidgetCountObjAfter.applicationsWithMostEOLResourcesCounts);
		await expect(appWidgetCountObjBefore.resourceByRegionCount).not.toEqual(appWidgetCountObjAfter.resourceByRegionCount);
		await expect(appWidgetCountObjBefore.listviewcount).not.toEqual(appWidgetCountObjAfter.listviewcount);
		var listViewProviderData = await dashboard_page.getTableColumnDataByIndex(5);
		await expect(listViewProviderData.every((provider) => provider.trim() === globalFilterProviderData[0].trim())).toBe(true)
		// Reset filter and validate the count is restored
		await healthInventoryUtil.clickOnClearFilterButton();
		// fetch counts of top insights , App breakdown , resources by region , List view	after filter reset
		let appWidgetCountObjAfterReset = await inventory_page.getCountsFromAllWidgetsApplication();
		await expect(appWidgetCountObjBefore.applicationsWithMostResourcesCounts).toEqual(appWidgetCountObjAfterReset.applicationsWithMostResourcesCounts);
		await expect(appWidgetCountObjBefore.applicationsWithMostActiveResourcesCounts).toEqual(appWidgetCountObjAfterReset.applicationsWithMostActiveResourcesCounts);
		await expect(appWidgetCountObjBefore.applicationsWithMostEOLResourcesCounts).toEqual(appWidgetCountObjAfterReset.applicationsWithMostEOLResourcesCounts);
		await expect(appWidgetCountObjBefore.resourceByRegionCount).toEqual(appWidgetCountObjAfterReset.resourceByRegionCount);
		await expect(appWidgetCountObjBefore.listviewcount).toEqual(appWidgetCountObjAfterReset.listviewcount);
		await expect(appWidgetCountObjBefore.appResBreakdownList).toEqual(appWidgetCountObjAfterReset.appResBreakdownList);
		});

	it('Resources : Verify that on applying provider global filters all the widgets in inventory dashboard gets updated and the selection is reverted when the filter is deselected', async function () {
		// Check for the presence of providers legends under Inventory on dashboard
		var globalFilterProviderData = await inventory_page.getMCAndDCListFromDashboardInventoryCard("MC");
		await inventory_page.navigateDashboardInventory();
		await util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		util.waitForAngular();
		await expect(util.isSelectedTabButton(inventoryTestData.resourcesButtonName)).toEqual(true);
		await util.waitOnlyForInvisibilityOfKibanaDataLoader();
		// fetch counts of top insights , App breakdown , resources by region , List view	before applying filter
		let resWidgetCountObjBefore = await inventory_page.getCountsFromAllWidgetsResource();
		// Select first provider from global filter
		if (globalFilterProviderData.length != 0) {
			healthInventoryUtil.clickOnProviderCheckBox(globalFilterProviderData[0]);
		}
		// Click on Apply filter button in global filter section
		await healthInventoryUtil.clickOnApplyFilterButton();
		await util.waitOnlyForInvisibilityOfCarbonDataLoader();
		// fetch counts of top insights , App breakdown , resources by region , List view	after applying filter
		let resWidgetCountObjAfter = await inventory_page.getCountsFromAllWidgetsResource();
		//Validations
		await expect(resWidgetCountObjBefore.untaggedResourcesCounts).not.toEqual(resWidgetCountObjAfter.untaggedResourcesCounts);
		await expect(resWidgetCountObjBefore.monitoredResourcesCounts).not.toEqual(resWidgetCountObjAfter.monitoredResourcesCounts);
		await expect(resWidgetCountObjBefore.resourceCloudReadinessCounts).not.toEqual(resWidgetCountObjAfter.resourceCloudReadinessCounts);
		await expect(resWidgetCountObjBefore.resourceCurrencyDesignatorCounts).not.toEqual(resWidgetCountObjAfter.resourceCurrencyDesignatorCounts);
		await expect(resWidgetCountObjBefore.resourceByRegionCount).not.toEqual(resWidgetCountObjAfter.resourceByRegionCount);
		await expect(resWidgetCountObjBefore.listviewcount).not.toEqual(resWidgetCountObjAfter.listviewcount);
		var listViewProviderData = await dashboard_page.getTableColumnDataByIndex(7);
		await expect(listViewProviderData.every((provider) => provider.trim() === globalFilterProviderData[0].trim())).toBe(true)
		// Reset filter and validate the count is restored
		await healthInventoryUtil.clickOnClearFilterButton();
		await util.waitOnlyForInvisibilityOfCarbonDataLoader();
		// fetch counts of top insights , App breakdown , resources by region , List view	after filter reset
		let resWidgetCountObjAfterReset = await inventory_page.getCountsFromAllWidgetsResource();
		await expect(resWidgetCountObjBefore.untaggedResourcesCounts).toEqual(resWidgetCountObjAfterReset.untaggedResourcesCounts);
		await expect(resWidgetCountObjBefore.monitoredResourcesCounts).toEqual(resWidgetCountObjAfterReset.monitoredResourcesCounts);
		await expect(resWidgetCountObjBefore.resourceCloudReadinessCounts).toEqual(resWidgetCountObjAfterReset.resourceCloudReadinessCounts);
		await expect(resWidgetCountObjBefore.resourceCurrencyDesignatorCounts).toEqual(resWidgetCountObjAfterReset.resourceCurrencyDesignatorCounts);
		await expect(resWidgetCountObjBefore.resourceByRegionCount).toEqual(resWidgetCountObjAfterReset.resourceByRegionCount);
		await expect(resWidgetCountObjBefore.listviewcount).toEqual(resWidgetCountObjAfterReset.listviewcount);
		await expect(resWidgetCountObjBefore.appResBreakdownList).toEqual(resWidgetCountObjAfterReset.appResBreakdownList);
	});

	it('Application : Verify that on applying teams global filters all the widgets in inventory dashboard gets updated and the selection is reverted when the filter is deselected', async function () {
		expect(util.isSelectedTabButton(inventoryTestData.applicationsButtonName)).toEqual(true);
		// Select teams from breakdown region
		await inventory_page.selectCategoryFromAppResBreakdownWidget(inventoryTestData.dropDownTeam);
		// fetch counts of top insights , App breakdown , resources by region , List view	before applying filter
		var appWidgetCountObjBefore = await inventory_page.getCountsFromAllWidgetsApplication();
		// select filter
		var teamsList = await inventory_page.getglobalFilterTeamsList();
		var filterSelected = await inventory_page.clickAndGetTextFromGlobalFilters(teamsList[0]);
		await healthInventoryUtil.clickOnApplyFilterButton();
		await util.waitOnlyForInvisibilityOfCarbonDataLoader();
		await inventory_page.selectCategoryFromAppResBreakdownWidget(inventoryTestData.dropDownTeam);
		await util.waitOnlyForInvisibilityOfCarbonDataLoader();
		// fetch counts of top insights , App breakdown , resources by region , List view	after applying filter
		var appWidgetCountObjAfter = await inventory_page.getCountsFromAllWidgetsApplication();
		//Validations
		await expect(appWidgetCountObjBefore.applicationsWithMostResourcesCounts).not.toEqual(appWidgetCountObjAfter.applicationsWithMostResourcesCounts);
		await expect(appWidgetCountObjBefore.applicationsWithMostActiveResourcesCounts).not.toEqual(appWidgetCountObjAfter.applicationsWithMostActiveResourcesCounts);
		await expect(appWidgetCountObjBefore.applicationsWithMostEOLResourcesCounts).not.toEqual(appWidgetCountObjAfter.applicationsWithMostEOLResourcesCounts);
		await expect(appWidgetCountObjBefore.resourceByRegionCount).not.toEqual(appWidgetCountObjAfter.resourceByRegionCount);
		await expect(appWidgetCountObjBefore.listviewcount).not.toEqual(appWidgetCountObjAfter.listviewcount);
		await expect(appWidgetCountObjAfter.appResBreakdownList).toEqual([filterSelected]);
		// Reset filter and validate the count is restored
		await healthInventoryUtil.clickOnClearFilterButton();
		await util.waitOnlyForInvisibilityOfCarbonDataLoader();
		await inventory_page.selectCategoryFromAppResBreakdownWidget(inventoryTestData.dropDownTeam);
		// fetch counts of top insights , App breakdown , resources by region , List view	after filter reset
		var appWidgetCountObjAfterReset = await inventory_page.getCountsFromAllWidgetsApplication();
		await expect(appWidgetCountObjBefore.applicationsWithMostResourcesCounts).toEqual(appWidgetCountObjAfterReset.applicationsWithMostResourcesCounts);
		await expect(appWidgetCountObjBefore.applicationsWithMostActiveResourcesCounts).toEqual(appWidgetCountObjAfterReset.applicationsWithMostActiveResourcesCounts);
		await expect(appWidgetCountObjBefore.applicationsWithMostEOLResourcesCounts).toEqual(appWidgetCountObjAfterReset.applicationsWithMostEOLResourcesCounts);
		await expect(appWidgetCountObjBefore.resourceByRegionCount).toEqual(appWidgetCountObjAfterReset.resourceByRegionCount);
		await expect(appWidgetCountObjBefore.listviewcount).toEqual(appWidgetCountObjAfterReset.listviewcount);
		await expect(appWidgetCountObjBefore.appResBreakdownList).toEqual(appWidgetCountObjAfterReset.appResBreakdownList);
	});

	it('Resources : Verify that on applying team global filters all the widgets in inventory dashboard gets updated and the selection is reverted when the filter is deselected', async function () {
		await util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		util.waitForAngular();
		await expect(util.isSelectedTabButton(inventoryTestData.resourcesButtonName)).toEqual(true);
		await inventory_page.selectCategoryFromAppResBreakdownWidget(inventoryTestData.dropDownTeam);
		await util.waitOnlyForInvisibilityOfKibanaDataLoader();
		// fetch counts of top insights , App breakdown , resources by region , List view	before applying filter
		var resWidgetCountObjBefore = await inventory_page.getCountsFromAllWidgetsResource();
		// select filter
		var teamsList = await inventory_page.getglobalFilterTeamsList();
		var filterSelected = await inventory_page.clickAndGetTextFromGlobalFilters(teamsList[0]);
		await healthInventoryUtil.clickOnApplyFilterButton();
		await util.waitOnlyForInvisibilityOfCarbonDataLoader();
		await inventory_page.selectCategoryFromAppResBreakdownWidget(inventoryTestData.dropDownTeam);
		// fetch counts of top insights , App breakdown , resources by region , List view	after applying filter
		var resWidgetCountObjAfter = await inventory_page.getCountsFromAllWidgetsResource();
		//Validations
		await expect(resWidgetCountObjBefore.untaggedResourcesCounts).not.toEqual(resWidgetCountObjAfter.untaggedResourcesCounts);
		await expect(resWidgetCountObjBefore.monitoredResourcesCounts).not.toEqual(resWidgetCountObjAfter.monitoredResourcesCounts);
		await expect(resWidgetCountObjBefore.resourceCloudReadinessCounts).not.toEqual(resWidgetCountObjAfter.resourceCloudReadinessCounts);
		await expect(resWidgetCountObjBefore.resourceCurrencyDesignatorCounts).not.toEqual(resWidgetCountObjAfter.resourceCurrencyDesignatorCounts);
		await expect(resWidgetCountObjBefore.resourceByRegionCount).not.toEqual(resWidgetCountObjAfter.resourceByRegionCount);
		await expect(resWidgetCountObjBefore.listviewcount).not.toEqual(resWidgetCountObjAfter.listviewcount);
		await expect(resWidgetCountObjAfter.appResBreakdownList).toEqual([filterSelected]);
		// Reset filter and validate the count is restored
		await healthInventoryUtil.clickOnClearFilterButton();
		await util.waitOnlyForInvisibilityOfCarbonDataLoader();
		await inventory_page.selectCategoryFromAppResBreakdownWidget(inventoryTestData.dropDownTeam);
		// fetch counts of top insights , App breakdown , resources by region , List view	after filter reset
		var resWidgetCountObjAfterReset = await inventory_page.getCountsFromAllWidgetsResource();
		await expect(resWidgetCountObjBefore.untaggedResourcesCounts).toEqual(resWidgetCountObjAfterReset.untaggedResourcesCounts);
		await expect(resWidgetCountObjBefore.monitoredResourcesCounts).toEqual(resWidgetCountObjAfterReset.monitoredResourcesCounts);
		await expect(resWidgetCountObjBefore.resourceCloudReadinessCounts).toEqual(resWidgetCountObjAfterReset.resourceCloudReadinessCounts);
		await expect(resWidgetCountObjBefore.resourceCurrencyDesignatorCounts).toEqual(resWidgetCountObjAfterReset.resourceCurrencyDesignatorCounts);
		await expect(resWidgetCountObjBefore.resourceByRegionCount).toEqual(resWidgetCountObjAfterReset.resourceByRegionCount);
		await expect(resWidgetCountObjBefore.listviewcount).toEqual(resWidgetCountObjAfterReset.listviewcount);
		await expect(resWidgetCountObjBefore.appResBreakdownList).toEqual(resWidgetCountObjAfterReset.appResBreakdownList);
	});

	it('Application: Verify that on applying application global filters all the widgets in inventory dashboard gets updated and the selection is reverted when the filter is deselected', async function () {
		  expect(util.isSelectedTabButton(inventoryTestData.applicationsButtonName)).toEqual(true);
		  // fetch counts of top insights , App breakdown , resources by region , List view	before applying filter
		  var appWidgetCountObjBefore = await inventory_page.getCountsFromAllWidgetsApplication();
		  // select filter
		  var applicationList = await inventory_page.getglobalFilterApplicationList();
		  var selectedFilter = await inventory_page.clickAndGetTextFromGlobalFilters(applicationList[0]);
		  await healthInventoryUtil.clickOnApplyFilterButton();
		  await util.waitOnlyForInvisibilityOfCarbonDataLoader();
		  // fetch counts of top insights , App breakdown , resources by region , List view	after applying filter
		  let appWidgetCountObjAfter = await inventory_page.getCountsFromAllWidgetsApplication();
		  let topInsightApplication = await inventory_page.getAppResNameFromTopInsightsSubSection(inventoryTestData.applicationsWithMostResourcesSubSectionLabel);
		  //Validations
		  await expect(appWidgetCountObjBefore.applicationsWithMostResourcesCounts).not.toEqual(appWidgetCountObjAfter.applicationsWithMostResourcesCounts);
		  await expect(appWidgetCountObjBefore.applicationsWithMostActiveResourcesCounts).not.toEqual(appWidgetCountObjAfter.applicationsWithMostActiveResourcesCounts);
		  await expect(appWidgetCountObjBefore.applicationsWithMostEOLResourcesCounts).not.toEqual(appWidgetCountObjAfter.applicationsWithMostEOLResourcesCounts);
		  await expect(appWidgetCountObjBefore.resourceByRegionCount).not.toEqual(appWidgetCountObjAfter.resourceByRegionCount);
		  await expect(appWidgetCountObjBefore.listviewcount).not.toEqual(appWidgetCountObjAfter.listviewcount);
		  await expect(appWidgetCountObjAfter.listviewcount).toEqual(inventoryTestData.firstIndex);
		  await expect(topInsightApplication).toEqual([selectedFilter]);
		  // Reset filter and validate the count is restored
		  await healthInventoryUtil.clickOnClearFilterButton();
		  await util.waitOnlyForInvisibilityOfCarbonDataLoader();
		  // fetch counts of top insights , App breakdown , resources by region , List view	after filter reset
		  let appWidgetCountObjAfterReset = await inventory_page.getCountsFromAllWidgetsApplication();
		  await expect(appWidgetCountObjBefore.applicationsWithMostResourcesCounts).toEqual(appWidgetCountObjAfterReset.applicationsWithMostResourcesCounts);
		  await expect(appWidgetCountObjBefore.applicationsWithMostActiveResourcesCounts).toEqual(appWidgetCountObjAfterReset.applicationsWithMostActiveResourcesCounts);
		  await expect(appWidgetCountObjBefore.applicationsWithMostEOLResourcesCounts).toEqual(appWidgetCountObjAfterReset.applicationsWithMostEOLResourcesCounts); 
		  await expect(appWidgetCountObjBefore.resourceByRegionCount).toEqual(appWidgetCountObjAfterReset.resourceByRegionCount);
		  await expect(appWidgetCountObjBefore.listviewcount).toEqual(appWidgetCountObjAfterReset.listviewcount);
		  await expect(appWidgetCountObjBefore.appResBreakdownList).toEqual(appWidgetCountObjAfterReset.appResBreakdownList);
	  });

	it('Resources : Verify that on applying application global filters all the widgets in inventory dashboard gets updated and the selection is reverted when the filter is deselected', async function () {
		await util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		util.waitForAngular();
		await expect(util.isSelectedTabButton(inventoryTestData.resourcesButtonName)).toEqual(true);
		await util.waitOnlyForInvisibilityOfKibanaDataLoader();
		// fetch counts of top insights , App breakdown , resources by region , List view	before applying filter
		let resWidgetCountObjBefore = await inventory_page.getCountsFromAllWidgetsResource();
		// select filter
		var applicationList = await inventory_page.getglobalFilterApplicationList();
		await inventory_page.clickAndGetTextFromGlobalFilters(applicationList[0]);
		await healthInventoryUtil.clickOnApplyFilterButton();
		await util.waitOnlyForInvisibilityOfKibanaDataLoader();
		// fetch counts of top insights , App breakdown , resources by region , List view	after applying filter
		let resWidgetCountObjAfter = await inventory_page.getCountsFromAllWidgetsResource();
		//Validations
		await expect(resWidgetCountObjBefore.untaggedResourcesCounts).not.toEqual(resWidgetCountObjAfter.untaggedResourcesCounts);
		await expect(resWidgetCountObjBefore.monitoredResourcesCounts).not.toEqual(resWidgetCountObjAfter.monitoredResourcesCounts);
		await expect(resWidgetCountObjBefore.resourceCloudReadinessCounts).not.toEqual(resWidgetCountObjAfter.resourceCloudReadinessCounts);
		await expect(resWidgetCountObjBefore.resourceCurrencyDesignatorCounts).not.toEqual(resWidgetCountObjAfter.resourceCurrencyDesignatorCounts);
		await expect(resWidgetCountObjBefore.resourceByRegionCount).not.toEqual(resWidgetCountObjAfter.resourceByRegionCount);
		await expect(resWidgetCountObjBefore.listviewcount).not.toEqual(resWidgetCountObjAfter.listviewcount);
		// Reset filter and validate the count is restored
		await healthInventoryUtil.clickOnClearFilterButton();
		await util.waitOnlyForInvisibilityOfCarbonDataLoader();
		// fetch counts of top insights , App breakdown , resources by region , List view	after filter reset
		let resWidgetCountObjAfterReset = await inventory_page.getCountsFromAllWidgetsResource();
		await expect(resWidgetCountObjBefore.untaggedResourcesCounts).toEqual(resWidgetCountObjAfterReset.untaggedResourcesCounts);
		await expect(resWidgetCountObjBefore.monitoredResourcesCounts).toEqual(resWidgetCountObjAfterReset.monitoredResourcesCounts);
		await expect(resWidgetCountObjBefore.resourceCloudReadinessCounts).toEqual(resWidgetCountObjAfterReset.resourceCloudReadinessCounts);
		await expect(resWidgetCountObjBefore.resourceCurrencyDesignatorCounts).toEqual(resWidgetCountObjAfterReset.resourceCurrencyDesignatorCounts);
		await expect(resWidgetCountObjBefore.listviewcount).toEqual(resWidgetCountObjAfterReset.listviewcount);
		await expect(resWidgetCountObjBefore.appResBreakdownList).toEqual(resWidgetCountObjAfterReset.appResBreakdownList);
	});

	it('Applications : Verify that on applying app category in global filters all the widgets in inventory dashboard gets updated and the selection is reverted when the filter is deselected', async function () {
		// Check for the presence of providers legends under Inventory on dashboard
		var appCategoryList = await inventory_page.getglobalFilterAppCategory();
		// fetch counts of top insights , App breakdown , resources by region , List view	before applying filter
		let appWidgetCountObjBefore = await inventory_page.getCountsFromAllWidgetsApplication();
		// Select first app category from global filter
		var filterSelected = await inventory_page.clickAndGetTextFromGlobalFilters(appCategoryList[0]);
		// Click on Apply filter button in global filter section
		await healthInventoryUtil.clickOnApplyFilterButton();
	    await util.waitOnlyForInvisibilityOfCarbonDataLoader();
		// fetch counts of top insights , App breakdown , resources by region , List view	after applying filter
		let appWidgetCountObjAfter = await inventory_page.getCountsFromAllWidgetsApplication(inventoryTestData.dataCenterProviders);
		//Validations
		await expect(appWidgetCountObjBefore.applicationsWithMostResourcesCounts).not.toEqual(appWidgetCountObjAfter.applicationsWithMostResourcesCounts);
		await expect(appWidgetCountObjBefore.applicationsWithMostActiveResourcesCounts).not.toEqual(appWidgetCountObjAfter.applicationsWithMostActiveResourcesCounts);
		await expect(appWidgetCountObjBefore.listviewcount).not.toEqual(appWidgetCountObjAfter.listviewcount);
		await expect(appWidgetCountObjBefore.appResBreakdownList).not.toEqual(appWidgetCountObjAfter.appResBreakdownList);
		//get application category details from list view
		var listViewAppCategory = await dashboard_page.getTableColumnDataByIndex(2);
		//Verify whether app category is filtered in list view
		await expect(listViewAppCategory.every((category) => category.trim() === filterSelected.trim())).toBe(true)
		// Reset filter and validate the count is restored
		await healthInventoryUtil.clickOnClearFilterButton();
		await util.waitOnlyForInvisibilityOfCarbonDataLoader();
		// fetch counts of top insights , App breakdown , resources by region , List view after filter reset
		var appWidgetCountObjAfterReset = await inventory_page.getCountsFromAllWidgetsApplication(inventoryTestData.dataCenterProviders);
		await expect(appWidgetCountObjBefore.applicationsWithMostResourcesCounts).toEqual(appWidgetCountObjAfterReset.applicationsWithMostResourcesCounts);
		await expect(appWidgetCountObjBefore.applicationsWithMostActiveResourcesCounts).toEqual(appWidgetCountObjAfterReset.applicationsWithMostActiveResourcesCounts);
		await expect(appWidgetCountObjBefore.listviewcount).toEqual(appWidgetCountObjAfterReset.listviewcount);
		await expect(appWidgetCountObjBefore.appResBreakdownList).toEqual(appWidgetCountObjAfterReset.appResBreakdownList);
	});

	it('Resources : Verify that on applying app category in global filters all the widgets in inventory dashboard gets updated and the selection is reverted when the filter is deselected', async function () {
		util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		util.waitOnlyForInvisibilityOfCarbonDataLoader();
		// fetch counts of top insights , App breakdown , resources by region , List view	before applying filter
		let resWidgetCountObjBefore = await inventory_page.getCountsFromAllWidgetsResource();
		// Check for the presence of providers legends under Inventory on dashboard
		var appCategoryList = await inventory_page.getglobalFilterAppCategory();
		// Select first app category from global filter
		var filterSelected = await inventory_page.clickAndGetTextFromGlobalFilters(appCategoryList[0]);
		// Click on Apply filter button in global filter section
		await healthInventoryUtil.clickOnApplyFilterButton();
		await util.waitOnlyForInvisibilityOfCarbonDataLoader();
		// fetch counts of top insights , App breakdown , resources by region , List view	after applying filter
		let resWidgetCountObjAfter = await inventory_page.getCountsFromAllWidgetsResource(inventoryTestData.dataCenterProviders);
		//Validations
		await expect(resWidgetCountObjBefore.untaggedResourcesCounts).not.toEqual(resWidgetCountObjAfter.untaggedResourcesCounts);
		await expect(resWidgetCountObjBefore.monitoredResourcesCounts).not.toEqual(resWidgetCountObjAfter.monitoredResourcesCounts);
		await expect(resWidgetCountObjBefore.resourceCloudReadinessCounts).not.toEqual(resWidgetCountObjAfter.resourceCloudReadinessCounts);
		await expect(resWidgetCountObjBefore.resourceCurrencyDesignatorCounts).not.toEqual(resWidgetCountObjAfter.resourceCurrencyDesignatorCounts);
	    await expect(resWidgetCountObjBefore.listviewcount).not.toEqual(resWidgetCountObjAfter.listviewcount);
		//get application category details from list view
		var listViewAppCategory = await dashboard_page.getTableColumnDataByIndex(13);
		//Verify whether app category is filtered in list view
		await expect(listViewAppCategory.every((category) => category.trim() === filterSelected.trim())).toBe(true)
		// Reset filter and validate the count is restored
		await healthInventoryUtil.clickOnClearFilterButton();
		await util.waitOnlyForInvisibilityOfCarbonDataLoader();
		// fetch counts of top insights , App breakdown , resources by region , List view	after filter reset
		var resWidgetCountObjAfterReset = await inventory_page.getCountsFromAllWidgetsResource(inventoryTestData.dataCenterProviders);
		await expect(resWidgetCountObjBefore.untaggedResourcesCounts).toEqual(resWidgetCountObjAfterReset.untaggedResourcesCounts);
		await expect(resWidgetCountObjBefore.monitoredResourcesCounts).toEqual(resWidgetCountObjAfterReset.monitoredResourcesCounts);
		await expect(resWidgetCountObjBefore.resourceCloudReadinessCounts).toEqual(resWidgetCountObjAfterReset.resourceCloudReadinessCounts);
		await expect(resWidgetCountObjBefore.resourceCurrencyDesignatorCounts).toEqual(resWidgetCountObjAfterReset.resourceCurrencyDesignatorCounts);
		await expect(resWidgetCountObjBefore.listviewcount).toEqual(resWidgetCountObjAfterReset.listviewcount);
		await expect(resWidgetCountObjBefore.appResBreakdownList).toEqual(resWidgetCountObjAfterReset.appResBreakdownList);
	});

	it('Verify inventory dashboard supports on fire fox ,chrome & safari browser and whether user is able to mouse hover on all attribute in Application and Resources',async function() {
		var browserName = await util.getBrowserName()
		expect(await inventory_page.checkMouseHoverOnApplicationBeakdownAndResources(browserName)).toBe(true)
	});

	it('Verify interaction between application breakdown and list view for provider dropdown',async function() {
		await util.clickOnTabButton(inventoryTestData.applicationsButtonName);
		expect(inventory_page.getAppResBreakdownSectionLabelText()).toEqual(inventoryTestData.applicationBreakdownSectionLabel);
		inventory_page.selectCategoryFromAppResBreakdownWidget(inventoryTestData.dropDownProvider);
		var boxContent = await inventory_page.getApplicationResourceBreakdownGraphText();
		//Get list view count and Breakdown count
		var interactionObj = await inventory_page.interactionBetweenBreakdownListView(boxContent,inventoryTestData.applications);
		//Compare list view count with resource breakdown count
		await expect(interactionObj.listViewCount).toEqual(interactionObj.breakdownCount);
	});

	it('Verify interaction between application breakdown and list view for Team dropdown', async function(){
		await util.clickOnTabButton(inventoryTestData.applicationsButtonName);
		//Get list of teams from global filter
		var teamsList = await inventory_page.getglobalFilterTeamsList();
		expect(inventory_page.getAppResBreakdownSectionLabelText()).toEqual(inventoryTestData.applicationBreakdownSectionLabel);
		inventory_page.selectCategoryFromAppResBreakdownWidget(inventoryTestData.dropDownTeam);
		//Get list view count and Breakdown count
		var interactionObj = await inventory_page.interactionBetweenBreakdownListView(teamsList,inventoryTestData.applications);
		//Compare list view count with application breakdown count
		await expect(interactionObj.listViewCount).toEqual(interactionObj.breakdownCount);
		
	});

	it('Application: Verify interaction between application breakdown and list view for environment dropdown',async function() {
		await util.clickOnTabButton(inventoryTestData.applicationsButtonName);
		expect(inventory_page.getAppResBreakdownSectionLabelText()).toEqual(inventoryTestData.applicationBreakdownSectionLabel);
		inventory_page.selectCategoryFromAppResBreakdownWidget(inventoryTestData.dropDownEnvironment);
		var boxContent = await inventory_page.getApplicationResourceBreakdownGraphText();
		//Get list view count and Breakdown count
		var interactionObj = await inventory_page.interactionBetweenBreakdownListView(boxContent,inventoryTestData.applications);
		//Compare list view count with application breakdown count
		await expect(interactionObj.listViewCount).toEqual(interactionObj.breakdownCount);
	});

	it('Verify application breakdown is reset when other View By is selected or same attribute is clicked again', async function(){
		await util.clickOnTabButton(inventoryTestData.applicationsButtonName);
		//Get list of teams from global filter
		var teamsList = await inventory_page.getglobalFilterTeamsList();
		await expect(inventory_page.getAppResBreakdownSectionLabelText()).toEqual(inventoryTestData.applicationBreakdownSectionLabel);
		await inventory_page.selectCategoryFromAppResBreakdownWidget(inventoryTestData.dropDownTeam);
		var countBeforeSelection = await inventory_page.getApplicationOrResourcesTableHeaderTextCount();
		await inventory_page.clickAndGetTextFromSingleBreakdownBox(teamsList[inventoryTestData.zerothIndex]);
		await inventory_page.getApplicationOrResourcesTableHeaderTextCount();
		await inventory_page.selectCategoryFromAppResBreakdownWidget(inventoryTestData.dropDownEnvironment);
		var countDiffViewBy = await inventory_page.getApplicationOrResourcesTableHeaderTextCount();
		await expect(countBeforeSelection).toEqual(countDiffViewBy);
		//Get environment values from application Breakdown
		var BoxContent = await inventory_page.getApplicationResourceBreakdownGraphText();
		//Select and click one environment value
		await inventory_page.clickAndGetTextFromSingleBreakdownBox(BoxContent[inventoryTestData.zerothIndex]);
		await inventory_page.getApplicationOrResourcesTableHeaderTextCount();
		//Deselect the attribute
		await inventory_page.clickAndGetTextFromSingleBreakdownBox(BoxContent[inventoryTestData.zerothIndex]);
		var countAfterDeselection = await inventory_page.getApplicationOrResourcesTableHeaderTextCount();
		await expect(countDiffViewBy).toEqual(countAfterDeselection);

	});
	it('Application list view: Verify whether filters applied in application breakdown, geo map are retained when user navigates back from overview section', async function () {
		await util.clickOnTabButton(inventoryTestData.applicationsButtonName);
		//Select any value from application breakdown and get the value
		expect(inventory_page.getAppResBreakdownSectionLabelText()).toEqual(inventoryTestData.applicationBreakdownSectionLabel);
		inventory_page.selectCategoryFromAppResBreakdownWidget(inventoryTestData.dropDownTeam);
		inventory_page.getApplicationOrResourcesTableHeaderTextCount();
		var teamsList = await inventory_page.getglobalFilterTeamsList();
		var breakdownToolTip = await inventory_page.clickAndGetTextFromSingleBreakdownBox(teamsList[inventoryTestData.zerothIndex]);
		var breakdownValue = breakdownToolTip.substring(0,breakdownToolTip.indexOf('\n'));
		//Select any value from application geo map and get the value
		expect(inventory_page.getAppsResByRegionSectionLabelText()).toEqual(inventoryTestData.applicationsByRegionSectionLabel);
		var toolTipContent = await inventory_page.getApplicationResourceByRegionToolTip();
		var geoMapToolTip = await inventory_page.clickAndGetTextFromResourceByRegion(toolTipContent[inventoryTestData.zerothIndex]);
		var geoMapValue = geoMapToolTip.substring(0,geoMapToolTip.indexOf('\n'));
		//Navigate to application list view and click on view details
		expect(inventory_page.getAppsResTableSectionLabelText()).toEqual(inventoryTestData.applicationsTableLabel);
		await inventory_page.getListViewHeaders();
		await expect(inventory_page.isViewDetailsButtonDisplayed(inventoryTestData.zerothIndex)).toBe(true);
		inventory_page.clickOnViewDetails();
		await expect(inventory_page.getViewDetailsOverviewLabelText()).toEqual(inventoryTestData.OverviewTitle);
		//Navigate back to application view via breadcrumb
		healthInventoryUtil.clickOnBreadcrumbLink(inventoryTestData.applicationViewLink);
		//Check whether its navigated to application list view
		await expect(inventory_page.isAppResTableDisplayed()).toBe(true);
		//Verify whether breakdown filter is retained by comparing the active box text
		expect(inventory_page.getAppResBreakdownSectionLabelText()).toEqual(inventoryTestData.applicationBreakdownSectionLabel);
		var breakdownActiveBoxText= await inventory_page.getActiveBoxText(inventoryTestData.applicationBreakdownSectionLabel);
		expect(breakdownValue).toEqual(breakdownActiveBoxText);
		//Verify whether geo map filter is retained and get the text
		expect(inventory_page.getAppsResByRegionSectionLabelText()).toEqual(inventoryTestData.applicationsByRegionSectionLabel);
		var geoMapActiveBoxText= await inventory_page.getActiveBoxText(inventoryTestData.applicationsByRegionSectionLabel);
		expect(geoMapValue).toEqual(geoMapActiveBoxText);
		await inventory_page.resetGlobalFilters();
	});

	it('Application list view: Verify whether pagination,search,sort,items per page selected are retained when user navigates back from overview section', async function () {
		await util.clickOnTabButton(inventoryTestData.applicationsButtonName);
		//Navigate to application list view
		expect(inventory_page.getAppsResTableSectionLabelText()).toEqual(inventoryTestData.applicationsTableLabel);
		var headers = await inventory_page.getListViewHeaders();
		var rows = await inventory_page.getrowData(inventoryTestData.ninthIndex,inventoryTestData.applicationsButtonName);
		var mapped = await inventory_page.mapRowsWithHeaders(rows,headers)
		//search for any resource
		await inventory_page.searchTable(mapped["Provider"]);
		//Apply sort on any of the column
		await inventory_page.clickOnTableSort(inventoryTestData.secondIndex);
		//Click on a different page
		var listViewDetails = await inventory_page.getTotalPagesAndItemsInListView();
		await inventory_page.clickOnPageNumber(inventoryTestData.thirdIndex,listViewDetails.totalEntries);
		await expect(inventory_page.isViewDetailsButtonDisplayed(inventoryTestData.zerothIndex)).toBe(true);
		inventory_page.clickOnViewDetails();
		await expect(inventory_page.getViewDetailsOverviewLabelText()).toEqual(inventoryTestData.OverviewTitle);
		//Navigate back to application view via breadcrumb
		await healthInventoryUtil.clickOnBreadcrumbLink(inventoryTestData.applicationViewLink);
		//Check whether its navigated to application list view
		await expect(inventory_page.isAppResTableDisplayed()).toBe(true);
		//Verify whether selected page number is retained
		var pagenumber =  await inventory_page.getPageNumber(listViewDetails.totalEntries);
		//Index start from zero, hence page number is compared with index+1
		expect(inventoryTestData.fourthIndex).toEqual(pagenumber);
		//Verify whether search text is retained
		var searchText = await inventory_page.getTextFromSearchBar();
		await expect(searchText).toEqual(mapped["Provider"]);
		//Verify whether sort is retained
		var sortedIndex = await inventory_page.getSortedColumnIndex();
		expect(inventoryTestData.secondIndex).toEqual(sortedIndex);
		await inventory_page.resetGlobalFilters();

	});

	it('Resource list view: Verify whether pagination,search,sort,items per page selected are retained when user navigates back from overview section', async function () {
		await util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		//Navigate to application list view
		expect(inventory_page.getAppsResTableSectionLabelText()).toEqual(inventoryTestData.resourcesTableLabel);
		var headers = await inventory_page.getListViewHeaders();
		var rows = await inventory_page.getrowData(inventoryTestData.firstIndex,inventoryTestData.resourcesButtonName);
		var mapped = await inventory_page.mapRowsWithHeaders(rows,headers)
		//search for any resource
		await inventory_page.searchTable(mapped["Provider account"]);
		//Apply sort on any of the column
		await inventory_page.clickOnTableSort(inventoryTestData.secondIndex);
		//Click on a different page
		var listViewDetails = await inventory_page.getTotalPagesAndItemsInListView();
		await inventory_page.clickOnPageNumber(inventoryTestData.thirdIndex,listViewDetails.totalEntries);
		await expect(inventory_page.isViewDetailsButtonDisplayed(inventoryTestData.zerothIndex)).toBe(true);
		await inventory_page.clickOnViewDetails();
		await expect(inventory_page.getViewDetailsOverviewLabelText()).toEqual(inventoryTestData.OverviewTitle);
		//Navigate back to application view via breadcrumb
		await healthInventoryUtil.clickOnBreadcrumbLink(inventoryTestData.resourceViewLink);
		//Check whether its navigated to application list view
		await expect(inventory_page.isAppResTableDisplayed()).toBe(true);
		//Verify whether selected page number is retained
		var pagenumber =  await inventory_page.getPageNumber(listViewDetails.totalEntries);
		//Index start from zero, hence page number is compared with index+1
		expect(inventoryTestData.fourthIndex).toEqual(pagenumber);
		//Verify whether search text is retained
		var searchText = await inventory_page.getTextFromSearchBar();
		await expect(searchText).toEqual(mapped["Provider account"]);
		//Verify whether sort is retained
		var sortedIndex = await inventory_page.getSortedColumnIndex();
		expect(inventoryTestData.secondIndex).toEqual(sortedIndex);
		await inventory_page.resetGlobalFilters();
	});


	it('Resource list view: Verify whether filters applied in resource breakdown, geo map are retained when user navigates back from overview section', async function () {
		await util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		//Select any value from resource breakdown and get the value
		expect(inventory_page.getAppResBreakdownSectionLabelText()).toEqual(inventoryTestData.resourcesBreakdownSectionLabel);
		await inventory_page.selectCategoryFromAppResBreakdownWidget(inventoryTestData.dropDownTeam);
		var teamsList = await inventory_page.getApplicationResourceBreakdownGraphText();
		var breakdownToolTip = await inventory_page.clickAndGetTextFromSingleBreakdownBox(teamsList[inventoryTestData.zerothIndex]);
		var breakdownValue = breakdownToolTip.substring(0,breakdownToolTip.indexOf('\n'));
		//Select any value from resource geo map and get the value
		expect(inventory_page.getAppsResByRegionSectionLabelText()).toEqual(inventoryTestData.resourcesByRegionSectionLabel);
		var toolTipContent = await inventory_page.getApplicationResourceByRegionToolTip();
		var geoMapToolTip = await inventory_page.clickAndGetTextFromResourceByRegion(toolTipContent[inventoryTestData.zerothIndex]);
		var geoMapValue = geoMapToolTip.substring(0,geoMapToolTip.indexOf('\n'));
		//Navigate to resource list view and click on view details
		await expect(inventory_page.getAppsResTableSectionLabelText()).toEqual(inventoryTestData.resourcesTableLabel);
		await inventory_page.getListViewHeaders();
		await expect(inventory_page.isViewDetailsButtonDisplayed(inventoryTestData.zerothIndex)).toBe(true);
		await inventory_page.clickOnViewDetails();
		await expect(inventory_page.getViewDetailsOverviewLabelText()).toEqual(inventoryTestData.OverviewTitle);
		//Navigate back to resource view via breadcrumb
		await healthInventoryUtil.clickOnBreadcrumbLink(inventoryTestData.resourceViewLink);
		//Check whether its navigated to application list view
		await expect(inventory_page.isAppResTableDisplayed()).toBe(true);
		//Verify whether breakdown filter is retained by comparing the active box text
		await expect(inventory_page.getAppResBreakdownSectionLabelText()).toEqual(inventoryTestData.resourcesBreakdownSectionLabel);
		var breakdownActiveBoxText= await inventory_page.getActiveBoxText(inventoryTestData.resourcesBreakdownSectionLabel);
		expect(breakdownValue).toEqual(breakdownActiveBoxText);
		//Verify whether geo map filter is retained and get the text
		await expect(inventory_page.getAppsResByRegionSectionLabelText()).toEqual(inventoryTestData.resourcesByRegionSectionLabel);
		var geoMapActiveBoxText= await inventory_page.getActiveBoxText(inventoryTestData.resourcesByRegionSectionLabel);
		expect(geoMapValue).toEqual(geoMapActiveBoxText);
		await inventory_page.resetGlobalFilters();
   
	});
	
	it('Application list view:Verify whether pagination,search,sort,items per page selected are retained for Application --> Application details page -->Associated resource -->Resource details page--> inventory application view', async function () {
		await util.clickOnTabButton(inventoryTestData.applicationsButtonName);
		//Navigate to application list view
		expect(inventory_page.getAppsResTableSectionLabelText()).toEqual(inventoryTestData.applicationsTableLabel);
		var headers = await inventory_page.getListViewHeaders();
		var rows = await inventory_page.getrowData(inventoryTestData.ninthIndex,inventoryTestData.applicationsButtonName);
		var mapped = await inventory_page.mapRowsWithHeaders(rows,headers)
		//search for any resource
		await inventory_page.searchTable(mapped["Provider"]);
		//Apply sort on any of the column
		await inventory_page.clickOnTableSort(inventoryTestData.secondIndex);
		//Click on a different page
		var listViewDetails = await inventory_page.getTotalPagesAndItemsInListView();
		await inventory_page.clickOnPageNumber(inventoryTestData.thirdIndex,listViewDetails.totalEntries);
		await expect(inventory_page.isViewDetailsButtonDisplayed(inventoryTestData.zerothIndex)).toBe(true);
		inventory_page.clickOnViewDetails();
		await expect(inventory_page.getViewDetailsOverviewLabelText()).toEqual(inventoryTestData.OverviewTitle);
		util.waitForAngular();
		//Click on any resource and navigate to resource list view
		await inventory_page.clickAndGetNameTagSubSectionLink("name");
		await expect(inventory_page.getViewDetailsOverviewLabelText()).toEqual(inventoryTestData.OverviewTitle);
		util.waitForAngular();
		//Navigate back to application view via breadcrumb
		await healthInventoryUtil.clickOnBreadcrumbLink(inventoryTestData.applicationViewLink);
		//Check whether its navigated to application list view
		await expect(inventory_page.isAppResTableDisplayed()).toBe(true);
		//Verify whether selected page number is retained
		var pagenumber =  await inventory_page.getPageNumber(listViewDetails.totalEntries);
		//Index start from zero, hence page number is compared with index+1
		expect(inventoryTestData.fourthIndex).toEqual(pagenumber);
		//Verify whether search text is retained
		var searchText = await inventory_page.getTextFromSearchBar();
		await expect(searchText).toEqual(mapped["Provider"]);
		//Verify whether sort is retained
		var sortedIndex = await inventory_page.getSortedColumnIndex();
		expect(inventoryTestData.secondIndex).toEqual(sortedIndex);
		await inventory_page.resetGlobalFilters();

	});

	it('Application details:Verify whether pagination,search,sort,items per page selected are retained for Application --> Application details page -->Associated resource -->Resource details page-->application details page', async function () {
		await util.clickOnTabButton(inventoryTestData.applicationsButtonName);
		//Navigate to application list view
		expect(inventory_page.getAppsResTableSectionLabelText()).toEqual(inventoryTestData.applicationsTableLabel);
		await inventory_page.getListViewHeaders();
		await expect(inventory_page.isViewDetailsButtonDisplayed(inventoryTestData.zerothIndex)).toBe(true);
		inventory_page.clickOnViewDetails();
		await expect(inventory_page.getViewDetailsOverviewLabelText()).toEqual(inventoryTestData.OverviewTitle);
		var headers = await inventory_page.getListViewHeaders();
		var rows = await inventory_page.getrowData(inventoryTestData.ninthIndex,inventoryTestData.applicationsButtonName);
		var mapped = await inventory_page.mapRowsWithHeaders(rows,headers)
		//search for any resource
		await inventory_page.searchTable(mapped["Provider"]);
		var assocOverviewPageTitle = await inventory_page.getOverviewPageTitleText();
		//Apply sort on any of the column
		await inventory_page.clickOnTableSort(inventoryTestData.secondIndex);
		//Click on a different page
		var listViewDetails = await inventory_page.getTotalPagesAndItemsInListView();
		await inventory_page.clickOnPageNumber(inventoryTestData.firstIndex,listViewDetails.totalEntries);
		util.waitForAngular();
		//Click on any resource and navigate to resource list view
		await inventory_page.clickAndGetNameTagSubSectionLink("name");
		await expect(inventory_page.getViewDetailsOverviewLabelText()).toEqual(inventoryTestData.OverviewTitle);
		//Navigate back to application view via breadcrumb
		await healthInventoryUtil.clickOnBreadcrumbLink(assocOverviewPageTitle);
		//Check whether its navigated to application list view
		await expect(inventory_page.getViewDetailsOverviewLabelText()).toEqual(inventoryTestData.OverviewTitle);
		//Verify whether selected page number is retained
		var pagenumber =  await inventory_page.getPageNumber(listViewDetails.totalEntries);
		//Index start from zero, hence page number is compared with index+1
		expect(inventoryTestData.secondIndex).toEqual(pagenumber);
		//Verify whether search text is retained
		var searchText = await inventory_page.getTextFromSearchBar();
		await expect(searchText).toEqual(mapped["Provider"]);
		//Verify whether sort is retained
		var sortedIndex = await inventory_page.getSortedColumnIndex();
		await expect(inventoryTestData.secondIndex).toEqual(sortedIndex);
		//Navigate back to application view via breadcrumb
	    healthInventoryUtil.clickOnBreadcrumbLink(inventoryTestData.applicationViewLink);
		await inventory_page.resetGlobalFilters();

	});

	it('Import Tags: Verify functionalities -  multiple/single application,mandatory field validations,user defined map keys', async function(){
		util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		await expect(inventory_page.getAppsResTableSectionLabelText()).toEqual(inventoryTestData.resourcesTableLabel);
		await inventory_page.getListViewHeaders();
		await inventory_page.selectImportTags(inventoryTestData.importTagsFile);
		var formattedImportFileData = await util.getDataFromImportTagsFile(inventoryTestData.importTagsFile);
		var impExcelData = await inventory_page.getImportedTagsDataFromExcel(formattedImportFileData);
		await util.clickOnTabButton(inventoryTestData.applicationsButtonName);
		await util.clickOnTabButton(inventoryTestData.resourcesButtonName); 
		var tagsFromListView = await inventory_page.getApplicationEnvironmentTags(impExcelData.mandatFieldDataArray,
			impExcelData.appKeysFromImportFile,impExcelData.appValuesFromImportFile,impExcelData.envKeysFromImportFile,impExcelData.envValuesFromImportFile);
		var appTagsCompareResult = await inventory_page.compareArraysubSets(impExcelData.appValuesFromImportFile, tagsFromListView.appTagsFromListView);
		var envTagsCompareResult = await inventory_page.compareArraysubSets(impExcelData.envValuesFromImportFile, tagsFromListView.envTagsFromListView);
		await expect(appTagsCompareResult).toBe(true);
		await expect(envTagsCompareResult).toBe(true);
	});
	it('Verify My DC is present on dashboard and inventory global filters and check if all the widgets under application and resource tabs display correct data on selecting My DC global filter', async function () {
		var providersList = await inventory_page.getMCAndDCListFromDashboardInventoryCard("DC");
		await inventory_page.navigateDashboardInventory();
		var providerPresentText = await inventory_page.checkPresenceOfProviderInGlobalFilter(providersList, inventoryTestData.MyDataCenter);
		if (providerPresentText) {
			// Verify selected provider is present or not in Global filter, return provider name and check name.
			expect(providerPresentText).toEqual(inventoryTestData.MyDataCenter);
			expect(util.isSelectedTabButton(inventoryTestData.applicationsButtonName)).toEqual(true);
			// fetch counts of top insights , App breakdown , resources by region , List view	before applying filter
			var appWidgetCountObjBefore = await inventory_page.getCountsFromAllWidgetsApplication(inventoryTestData.MyDataCenter);
			// Select MY DC global filter
			healthInventoryUtil.clickOnProviderCheckBox(inventoryTestData.MyDataCenter);
			// Click on Apply filter button in global filter section
			healthInventoryUtil.clickOnApplyFilterButton();
			await util.waitOnlyForInvisibilityOfKibanaDataLoader();
			// Select provider dropdown from resource breakdown category
			await inventory_page.selectCategoryFromAppResBreakdownWidget(inventoryTestData.dropDownProvider);
			var appWidgetCountObjAfter = await inventory_page.getCountsFromAllWidgetsApplication(inventoryTestData.MyDataCenter);
			//Validations
			await expect(appWidgetCountObjBefore.applicationsWithMostResourcesCounts).not.toEqual(jasmine.arrayContaining(appWidgetCountObjAfter.applicationsWithMostResourcesCounts));
			await expect(appWidgetCountObjBefore.resourceByRegionCount).not.toEqual(appWidgetCountObjAfter.resourceByRegionCount);
			await expect(appWidgetCountObjBefore.listviewcount).not.toEqual(appWidgetCountObjAfter.listviewcount);
			if(appWidgetCountObjAfter.applicationCount > 0){
                var listViewProviderData = await dashboard_page.getTableColumnDataByIndex(5);
                await expect(listViewProviderData.every((provider) => provider.trim() === inventoryTestData.MyDataCenter)).toBe(true)
            }
			if(appWidgetCountObjAfter.appResBreakdownList != undefined){
				await expect(appWidgetCountObjAfter.appResBreakdownList).toEqual([inventoryTestData.MyDataCenter]);
			}
			// Reset filter and validate the count is restored
			await healthInventoryUtil.clickOnClearFilterButton();
			// Switch to resource tab and fetch the count
			await util.clickOnTabButton(inventoryTestData.resourcesButtonName);
			util.waitForAngular();
			await expect(util.isSelectedTabButton(inventoryTestData.resourcesButtonName)).toEqual(true);
			// fetch counts of top insights , App breakdown , resources by region , List view	before applying filter
			var resWidgetCountObjBefore = await inventory_page.getCountsFromAllWidgetsResource(inventoryTestData.MyDataCenter);
			// Select MY DC global filter
			healthInventoryUtil.clickOnProviderCheckBox(inventoryTestData.MyDataCenter);
			// Click on Apply filter button in global filter section
			healthInventoryUtil.clickOnApplyFilterButton();
			await util.waitOnlyForInvisibilityOfKibanaDataLoader();
			// Select provider dropdown from resource breakdown category
			await inventory_page.selectCategoryFromAppResBreakdownWidget(inventoryTestData.dropDownProvider);
			await util.waitOnlyForInvisibilityOfKibanaDataLoader();
			// fetch counts of top insights , App breakdown , resources by region , List view	after applying filter
			var resWidgetCountObjAfter = await inventory_page.getCountsFromAllWidgetsResource(inventoryTestData.MyDataCenter);
			//Validations
			await expect(resWidgetCountObjBefore.untaggedResourcesCounts).not.toEqual(resWidgetCountObjAfter.untaggedResourcesCounts);
			await expect(resWidgetCountObjBefore.monitoredResourcesCounts).not.toEqual(resWidgetCountObjAfter.monitoredResourcesCounts);
			await expect(resWidgetCountObjBefore.resourceCloudReadinessCounts).not.toEqual(resWidgetCountObjAfter.resourceCloudReadinessCounts);
			await expect(resWidgetCountObjBefore.resourceByRegionCount).not.toEqual(resWidgetCountObjAfter.resourceByRegionCount);
			await expect(resWidgetCountObjBefore.listviewcount).not.toEqual(resWidgetCountObjAfter.listviewcount);
			listViewProviderData = await dashboard_page.getTableColumnDataByIndex(7);
			await expect(listViewProviderData.every((provider) => provider.trim() === inventoryTestData.MyDataCenter)).toBe(true)
			await expect(resWidgetCountObjAfter.appResBreakdownList).toEqual([inventoryTestData.MyDataCenter]);
			// Click on overflow menu and go to view details page
			await inventory_page.verifyResrcTableDataAvailable();
			await expect(inventory_page.getViewDetailsOverviewLabelText()).toEqual(inventoryTestData.OverviewTitle);
			await expect(inventory_page.visibilityOfLabels(inventoryTestData.fqhnLabel)).toEqual(inventoryTestData.fqhnLabel);
		}
		else {
			logger.info("MY DC filter is not present");
		}
	});

	it('Verify user should be able to zoom in, zoom out and reset in application geo map and resource geo map', async function () {
		// Below code is to verify zoom in , zoom out and reset is working for Application tab on Application resource by region
		await util.clickOnTabButton(inventoryTestData.applicationsButtonName);
		expect(util.isSelectedTabButton(inventoryTestData.applicationsButtonName)).toBe(true);
		var zoomIn = await inventory_page.getTransformValuesAfterZoomIn(inventoryTestData.zoomInBtnName);
		expect(zoomIn.zoomBefore).not.toEqual(zoomIn.zoomAfter);
		var zoomOut = await inventory_page.getTransformValuesAfterZoomIn(inventoryTestData.zoomOutBtnName);
		expect(zoomOut.zoomBefore).not.toEqual(zoomOut.zoomAfter);
		await inventory_page.getTransformValues(inventoryTestData.transformName);
		var reset = await inventory_page.getTransformValuesAfterZoomIn(inventoryTestData.resetGeoMap);
		expect(reset.zoomBefore).not.toEqual(reset.zoomAfter);
		// Below code is to verify zoom in , zoom out and reset is working for resource tab on resource by region
		await util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		expect(util.isSelectedTabButton(inventoryTestData.resourcesButtonName)).toBe(true);
		var zoomIn = await inventory_page.getTransformValuesAfterZoomIn(inventoryTestData.zoomInBtnName);
		expect(zoomIn.zoomBefore).not.toEqual(zoomIn.zoomAfter);
		var zoomOut = await inventory_page.getTransformValuesAfterZoomIn(inventoryTestData.zoomOutBtnName);
		expect(zoomOut.zoomBefore).not.toEqual(zoomOut.zoomAfter);
		await inventory_page.getTransformValues(inventoryTestData.transformName);
		var reset = await inventory_page.getTransformValuesAfterZoomIn(inventoryTestData.resetGeoMap);
		expect(reset.zoomBefore).not.toEqual(reset.zoomAfter);
	})

	it('Verify the unknown location resources count under resource by region for resources tab and application tab are matching with resource list view and application list view', async function () {
		await util.clickOnTabButton(inventoryTestData.applicationsButtonName);
		expect(util.isSelectedTabButton(inventoryTestData.applicationsButtonName)).toBe(true);
		// To get resource(s) with unknown location for Application tab
		var applicationCount = await inventory_page.clickAndGetUnknownLocationCount();
		await util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		expect(util.isSelectedTabButton(inventoryTestData.resourcesButtonName)).toBe(true);
		// To get resource(s) with unknown location for Resource tab
		var unknownLocationResourceTabCount = await inventory_page.clickAndGetUnknownLocationCount();
		var resourceListViewCount = await inventory_page.getApplicationOrResourcesTableHeaderTextCount();
		// Resources by region for unknown location matches with list view count in Resource tab
		expect(unknownLocationResourceTabCount).toBe(resourceListViewCount);
		await inventory_page.clickOntCategoryResourceCountFromTopInsightsSubSection(inventoryTestData.untaggedResourcesSubSectionLabel,inventoryTestData.untaggedResourcesApplicationLabel);
		var unknownLocationResourceCountForApplication = await inventory_page.clickAndGetUnknownLocationCount();	
		// Resources by region for unknown location matches with list view count in Application tab
		expect(resourceListViewCount - unknownLocationResourceCountForApplication).toBe(applicationCount)
	})

	fit('verify the view details page of service configuration and tags for a resource', async function () {
		await healthInventoryUtil.clickOnProviderCheckBox(inventoryTestData.azureProvider);
		await healthInventoryUtil.clickOnApplyFilterButton();
		await util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		expect(util.isSelectedTabButton(inventoryTestData.resourcesButtonName)).toBe(true);
		// Click on overflow menu and go to view details page
		await inventory_page.verifyResrcTableDataAvailable(); 
		await util.clickOnTabButton(inventoryTestData.serviceConfigurationName);
		expect(util.isSelectedTabButton(inventoryTestData.serviceConfigurationName)).toBe(true);
		var resourceHeader = await inventory_page.getInventoryHeaderTitleText();
		var serviceConfigurationName = await inventory_page.getServiceConfigDetails();
		expect(resourceHeader).toBe(serviceConfigurationName);
		await util.clickOnTabButton(inventoryTestData.serviceConfigTags);
		expect(util.isSelectedTabButton(inventoryTestData.serviceConfigTags)).toBe(true);
	})

    it('Resources:Verify that upon clicking on any count under resource by region list view is updated with right values', async function(){
		util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		// Select AWS provider from global filter
		await healthInventoryUtil.clickOnProviderCheckBox(inventoryTestData.azureProvider);
		await healthInventoryUtil.clickOnApplyFilterButton();
		expect(inventory_page.getAppsResByRegionSectionLabelText()).toEqual(inventoryTestData.resourcesByRegionSectionLabel);
		var toolTipContent = await inventory_page.getApplicationResourceByRegionToolTip();
		//Get list view count and region count by clicking on region
		var interactionObj = await inventory_page.interactionBetweenRegionListView(toolTipContent,inventoryTestData.resources);
		//Compare list view count with resource count from resource by region
		await expect(interactionObj.listViewCount).toEqual(interactionObj.resourceCount);
	});

    it('Resources:Verify that upon clicking the same attribute or different attribute in resources region, list view is getting reset', async function(){
		util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		//Get list of teams from global filter
		expect(inventory_page.getAppsResByRegionSectionLabelText()).toEqual(inventoryTestData.resourcesByRegionSectionLabel);
		var toolTipContent = await inventory_page.getApplicationResourceByRegionToolTip();
		var listViewCountBeforeClick = await inventory_page.getApplicationOrResourcesTableHeaderTextCount();
		var resourcesByRegionBeforeClick = await inventory_page.getResourceByRegionCount();
		//Verify whether the list view count and resource count are equal
		expect(listViewCountBeforeClick).toEqual(resourcesByRegionBeforeClick);
		//Click on one region in resource by region
		await inventory_page.clickAndGetTextFromResourceByRegion(toolTipContent[inventoryTestData.zerothIndex]);
		//Deselect the same attribute
		await inventory_page.clickAndGetTextFromResourceByRegion(toolTipContent[inventoryTestData.zerothIndex]);
		//Get the list view count and see if the view got reset
		var listviewCountAfterClick = await inventory_page.getApplicationOrResourcesTableHeaderTextCount();
		expect(listViewCountBeforeClick).toEqual(listviewCountAfterClick);
		
	});

	it('Applications:Verify that upon clicking on any count under application by region list view is updated with right values', async function(){
		var multiCloudList = await inventory_page.getMCAndDCListFromDashboardInventoryCard("MC");
		await inventory_page.navigateDashboardInventory();
		await util.clickOnTabButton(inventoryTestData.applicationsButtonName);
		await expect(util.isSelectedTabButton(inventoryTestData.applicationsButtonName)).toEqual(true);
		// Apply Multicloud filter in global filters
		await inventory_page.getDataCenterAndMulticloudResourcesCountForEs(multiCloudList);
		expect(inventory_page.getAppsResByRegionSectionLabelText()).toEqual(inventoryTestData.applicationsByRegionSectionLabel);
		var toolTipContent = await inventory_page.getApplicationResourceByRegionToolTip();
		//Get list view count and region count by clicking on region
		var interactionObj = await inventory_page.interactionBetweenRegionListView(toolTipContent,inventoryTestData.applications);
		//Compare list view count with application count from application by region
		await expect(interactionObj.listViewCount).toEqual(interactionObj.applicationCount);
	});

	it('Application:Verify that upon clicking the same attribute or different attribute in resources region, list view is getting reset', async function(){
		util.clickOnTabButton(inventoryTestData.applicationsButtonName);
		//Get list of teams from global filter
		expect(inventory_page.getAppsResByRegionSectionLabelText()).toEqual(inventoryTestData.applicationsByRegionSectionLabel);
		var toolTipContent = await inventory_page.getApplicationResourceByRegionToolTip();
		var listViewCountBeforeClick = await inventory_page.getApplicationOrResourcesTableHeaderTextCount();
		//Click on one region in application by region
		await inventory_page.clickAndGetTextFromResourceByRegion(toolTipContent[inventoryTestData.zerothIndex]);
		//Deselect the same attribute
		await inventory_page.clickAndGetTextFromResourceByRegion(toolTipContent[inventoryTestData.zerothIndex]);
		//Get the list view count and see if the view got reset
		var listviewcountAfterDeSelection = await inventory_page.getApplicationOrResourcesTableHeaderTextCount();
		expect(listViewCountBeforeClick).toEqual(listviewcountAfterDeSelection);
		
	});

	it('Applications:Verify that upon clicking top insights it navigates to associated list view and title validations', async function(){
		util.clickOnTabButton(inventoryTestData.applicationsButtonName);
		var applicationClicked = await inventory_page.clickandGetTextInsightFromTopInsightsSubSection(inventoryTestData.applicationsWithMostResourcesSubSectionLabel);	
		var assocOverviewPageTitle = await inventory_page.getOverviewPageTitleText();
		//Validate whether page is navigated to associated overview section
		await expect(inventory_page.getViewDetailsOverviewLabelText()).toEqual(inventoryTestData.OverviewTitle);
		//Verify the title in overview page is matching with application that is clicked
		await expect(applicationClicked).toEqual(assocOverviewPageTitle);

	});

	it('Resources:Verify interaction between top insights and Geo map and List view', async function(){
		util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		var resourceByRegionCountBeforeSelection = await inventory_page.getResourceByRegionCount();
		var listviewcountBeforeSelection = await inventory_page.getApplicationOrResourcesTableHeaderTextCount();
		await inventory_page.clickOntCategoryResourceCountFromTopInsightsSubSection(inventoryTestData.untaggedResourcesSubSectionLabel,inventoryTestData.untaggedResourcesApplicationLabel);
		// Get Untagged Resources Application/ Environment counts
		var appEnvCount = await inventory_page.getUntaggedResourcesAppEnvCount();
		//Get resource by region and list view count
		var resourceByRegionCount = await inventory_page.getResourceByRegionCount();
		var listviewcount = await inventory_page.getApplicationOrResourcesTableHeaderTextCount();
		await expect(appEnvCount.untaggedResourcesApplicationCount).toEqual(resourceByRegionCount);
		await expect(appEnvCount.untaggedResourcesApplicationCount).toEqual(listviewcount);
		//Click on different category - untagged environments
		await inventory_page.clickOntCategoryResourceCountFromTopInsightsSubSection(inventoryTestData.untaggedResourcesSubSectionLabel,inventoryTestData.untaggedResourcesEnvironmentLabel);
		//Get resource by region and list view count
		var resourceByRegionCount = await inventory_page.getResourceByRegionCount();
		var listviewcount = await inventory_page.getApplicationOrResourcesTableHeaderTextCount();
		await expect(appEnvCount.untaggedResourcesEnvironmentCount).toEqual(resourceByRegionCount);
		await expect(appEnvCount.untaggedResourcesEnvironmentCount).toEqual(listviewcount);
		//Click on same attribute and cross check if the counts are reverted
		await inventory_page.clickOntCategoryResourceCountFromTopInsightsSubSection(inventoryTestData.untaggedResourcesSubSectionLabel,inventoryTestData.untaggedResourcesEnvironmentLabel);
		var resourceByRegionCountAfterDeSelection = await inventory_page.getResourceByRegionCount();
		var listviewcountAfterDeSelection = await inventory_page.getApplicationOrResourcesTableHeaderTextCount();
		await expect(resourceByRegionCountBeforeSelection).toEqual(resourceByRegionCountAfterDeSelection);
		await expect(listviewcountBeforeSelection).toEqual(listviewcountAfterDeSelection);
	});

	it('Resources:Verify whether unmanaged count in topinsights is matching with count from resource list view', async function(){
		var multiCloudList = await inventory_page.getMCAndDCListFromDashboardInventoryCard("MC");
		await inventory_page.navigateDashboardInventory();
		await util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		//Select MC providers in global filters
		await inventory_page.getDataCenterAndMulticloudResourcesCountForEs(multiCloudList);
		var unmanagedCountActual = await inventory_page.getCategoryResourceCountFromTopInsightsSubSection(inventoryTestData.untaggedResourcesSubSectionLabel,
			inventoryTestData.untaggedResourcesUnmanagedLabel);	
		var unmanagedCountExpected = await inventory_page.getUnmanagedCountFromTopInsights(inventoryTestData.managedTagKey);
		//compare unamanaged resource counts between list view and top insights 
		await expect(unmanagedCountExpected).toEqual(unmanagedCountActual);
		//verify the case insensitive feature for the key
		await util.clickOnTabButton(inventoryTestData.applicationsButtonName);
		await util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		var unmanagedCountExpected = await inventory_page.getUnmanagedCountFromTopInsights(inventoryTestData.managedTagKeySmallCase);
		//compare unamanaged resource counts between list view and top insights for small case
		await expect(unmanagedCountExpected).toEqual(unmanagedCountActual);
		//Verify for GCP resource
		await healthInventoryUtil.clickOnClearFilterButton();
		util.clickOnTabButton(inventoryTestData.applicationsButtonName);
		util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		// Select GCP provider from global filter
		await healthInventoryUtil.clickOnProviderCheckBox(inventoryTestData.gcpProvider);
		await healthInventoryUtil.clickOnApplyFilterButton();
		var unmanagedCountActual = await inventory_page.getCategoryResourceCountFromTopInsightsSubSection(inventoryTestData.untaggedResourcesSubSectionLabel,
			inventoryTestData.untaggedResourcesUnmanagedLabel);	
		var unmanagedCountExpected = await inventory_page.getUnmanagedCountFromTopInsights(inventoryTestData.managedTagKey);
		//compare unamanaged resource counts between list view and top insights for gcp
		await expect(unmanagedCountExpected).toEqual(unmanagedCountActual);
	});


	it('[Application] Verify if all the selected checkboxes are reflected/added in list view on applying the change and resets to default view on reset', async function(){
		util.waitOnlyForInvisibilityOfKibanaDataLoader();
		var listViewHeadersBeforeChange = await inventory_page.getListViewHeaders();
		await expect(await inventory_page.verifyTableSettingMenuHeader()).toEqual(inventoryTestData.tableSettingPanelHeader)
		await expect(await inventory_page.getColumnHeadersFromTableSettingPanel()).toEqual(listViewHeadersBeforeChange)
		var headerstatus = await inventory_page.columnHeaderStatusFromTableSettingPanel();
		await expect(headerstatus.selectedColumnHeaders).toEqual(listViewHeadersBeforeChange)
		// Uncheck any 2 columns , apply change and verify table headers
		await inventory_page.selectingColumnHeaders(['App category','Provider'],inventoryTestData.applicationTableHeaders);
		await inventory_page.selectApplyResetCancelButton(inventoryTestData.applyButtonLabel)
		util.waitOnlyForInvisibilityOfCarbonDataLoader();
		// fetch the checkbox status after applying change
		await inventory_page.verifyTableSettingMenuHeader();
		var headerstatusAfterChange = await inventory_page.columnHeaderStatusFromTableSettingPanel();
		await expect(headerstatusAfterChange.selectedColumnHeaders).toEqual(await inventory_page.getListViewHeaders())
		await expect(headerstatusAfterChange.unSelectedColumnHeaders).not.toEqual(await inventory_page.getListViewHeaders());
		//Click on reset and validate with deafult header list
		await inventory_page.selectApplyResetCancelButton(inventoryTestData.resetButtonLabel);
		util.waitOnlyForInvisibilityOfCarbonDataLoader();
		await expect(await inventory_page.getListViewHeaders()).toEqual(inventoryTestData.applicationTableHeaders);
		// Verify checkbox status 
		await inventory_page.verifyTableSettingMenuHeader();
		var headerstatusAfterReset = await inventory_page.columnHeaderStatusFromTableSettingPanel();
		await expect(headerstatusAfterReset.selectedColumnHeaders).toEqual(await inventory_page.getListViewHeaders())
		await expect(headerstatusAfterReset.unSelectedColumnHeaders).not.toEqual(await inventory_page.getListViewHeaders());
	});

	it('[Application] Verify if list view is not updated when user select/deselect column headers and click on Cancel button', async function(){
		var listViewHeadersBeforeChange = await inventory_page.getListViewHeaders();
		await expect(await inventory_page.verifyTableSettingMenuHeader()).toEqual(inventoryTestData.tableSettingPanelHeader)
		var headerstatusBeforeChange = await inventory_page.columnHeaderStatusFromTableSettingPanel();
		await expect(headerstatusBeforeChange.selectedColumnHeaders).toEqual(listViewHeadersBeforeChange)
		// Check/Uncheck headers and click on cancel button
		await inventory_page.selectingColumnHeaders(['Team','Environment','Resource count'],inventoryTestData.applicationTableHeaders);
		await inventory_page.selectApplyResetCancelButton(inventoryTestData.cancelButtonLabel)
		util.waitOnlyForInvisibilityOfCarbonDataLoader();
		// fetch the checkbox status after clicking on cancel
		await inventory_page.verifyTableSettingMenuHeader();
		var headerstatusAfterChange = await inventory_page.columnHeaderStatusFromTableSettingPanel();
		await expect(headerstatusAfterChange.selectedColumnHeaders).toEqual(headerstatusBeforeChange.selectedColumnHeaders)
		await expect(listViewHeadersBeforeChange).toEqual(await inventory_page.getListViewHeaders());
	});

	it('Application: Verify whether application by region is updated when application breakdown is clicked', async function(){
		//Fetch list view count before selecting value from application breakdown region
		var listViewCountBeforeSelection = await inventory_page.getApplicationOrResourcesTableHeaderTextCount();
		await expect(inventory_page.getAppResBreakdownSectionLabelText()).toEqual(inventoryTestData.applicationBreakdownSectionLabel);
		await expect(inventory_page.getAppsResByRegionSectionLabelText()).toEqual(inventoryTestData.applicationsByRegionSectionLabel);
		await inventory_page.selectCategoryFromAppResBreakdownWidget(inventoryTestData.dropDownTeam);
		//Get application's resourcebyregion count and Breakdown count
		var toolTipContent = await inventory_page.getApplicationResourceBreakdownGraphToolTip();
		var interactionObj = await inventory_page.interactionBetweenBreakdownAndRegion(toolTipContent, inventoryTestData.applications);
		//Compare list view count with last application's resource breakdown count
		var applicationCount = await interactionObj.applicationsCount;
		var listViewCountAfterSelection = await inventory_page.getApplicationOrResourcesTableHeaderTextCount();
		//Compare list view count with resource breakdown count
		await expect(interactionObj.resourcesByRegionCount).toEqual(interactionObj.resourcesCount);
		await expect(Number.parseInt(applicationCount[applicationCount.length - 1])).toEqual(listViewCountAfterSelection);
		await expect(listViewCountBeforeSelection).not.toEqual(listViewCountAfterSelection);
	});
	
	it('Application: Verify whether application by region is reverted to match the deselection in breakdown segment', async function(){
		await expect(inventory_page.getAppResBreakdownSectionLabelText()).toEqual(inventoryTestData.applicationBreakdownSectionLabel);
		await expect(inventory_page.getAppsResByRegionSectionLabelText()).toEqual(inventoryTestData.applicationsByRegionSectionLabel);
		//Select team dropdown
		await inventory_page.selectCategoryFromAppResBreakdownWidget(inventoryTestData.dropDownTeam);
		var applicationByRegionBeforeClick = await inventory_page.getResourceByRegionCount();
		//Get teams tool tip content
		var toolTipContent = await inventory_page.getApplicationResourceBreakdownGraphToolTip();
		//Click on one team
		await inventory_page.clickAndGetTextFromSingleBreakdownBox(toolTipContent[inventoryTestData.zerothIndex]);
		//Deselect the same attribute
		await inventory_page.clickAndGetTextFromSingleBreakdownBox(toolTipContent[inventoryTestData.zerothIndex]);
		var applicationByRegionAfterDeselection = await inventory_page.getResourceByRegionCount();
		//Verify whether count is matching for application by region
		expect(applicationByRegionBeforeClick).toEqual(applicationByRegionAfterDeselection);
	});

	it('[Application] Verify if name field is disabled for user and panel closes on clicking x icon', async function(){
		util.waitOnlyForInvisibilityOfCarbonDataLoader();
		var listViewHeadersBeforeChange = await inventory_page.getListViewHeaders();
		await expect(await inventory_page.verifyTableSettingMenuHeader()).toEqual(inventoryTestData.tableSettingPanelHeader)
		var headerCheckBoxStatus = await inventory_page.columnHeaderStatusFromTableSettingPanel();
		await expect(headerCheckBoxStatus.selectedColumnHeaders).toEqual(listViewHeadersBeforeChange)
		await expect(await inventory_page.verifyDisabledHeaderCheckboxes(inventoryTestData.applicationsButtonName)).toBe(true);
		//click on x icon to close the panel and verify if its closed
		await expect(await inventory_page.closeTableSettingPanelAndVerify()).toBe(true);
	});
	it('[Application] Verify if all the column checkboxes are checked/unchecked on selecting Select all checkboxes', async function(){
		var listViewHeadersBeforeChange = await inventory_page.getListViewHeaders();
		await expect(await inventory_page.verifyTableSettingMenuHeader()).toEqual(inventoryTestData.tableSettingPanelHeader)
		//await expect(await inventory_page.getColumnHeadersFromTableSettingPanel()).toEqual(listViewHeadersBeforeChange)
		var headerstatus = await inventory_page.columnHeaderStatusFromTableSettingPanel();
		await expect(headerstatus.selectedColumnHeaders).toEqual(listViewHeadersBeforeChange)
		// Click on select all checkbox and verify if its reflected in table setting panel
		var selectAllStatus = await inventory_page.clickOnSelectAllHeaders()
		await expect(selectAllStatus.selectedColumnHeaders).toEqual(inventoryTestData.applicationTableHeaders)
		await expect(selectAllStatus.unSelectedColumnHeaders.length).toBe(0);
	});
	it('[Resource] Verify if ID and name fields are disabled for user and panel closes on clicking x icon', async function(){
		util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		util.waitOnlyForInvisibilityOfCarbonDataLoader();
		var listViewHeaders = await inventory_page.getListViewHeaders();
		await expect(await inventory_page.verifyTableSettingMenuHeader()).toEqual(inventoryTestData.tableSettingPanelHeader)
		var headerCheckBoxStatus = await inventory_page.columnHeaderStatusFromTableSettingPanel();
		await expect(headerCheckBoxStatus.selectedColumnHeaders).toEqual(listViewHeaders)
		await expect(await inventory_page.verifyDisabledHeaderCheckboxes(inventoryTestData.resourcesButtonName)).toBe(true);
		//click on x icon to close the panel and verify if its closed
		await expect(await inventory_page.closeTableSettingPanelAndVerify()).toBe(true);
	});

	it('[Resource] Verify if list view is not updated when user select/deselect column headers and click on Cancel button', async function(){
		util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		util.waitOnlyForInvisibilityOfCarbonDataLoader();
		var listViewHeadersBeforeChange = await inventory_page.getListViewHeaders();
		await expect(await inventory_page.verifyTableSettingMenuHeader()).toEqual(inventoryTestData.tableSettingPanelHeader)
		var headerstatusBeforeChange = await inventory_page.columnHeaderStatusFromTableSettingPanel();
		await expect(headerstatusBeforeChange.selectedColumnHeaders).toEqual(listViewHeadersBeforeChange)
		// Check/Uncheck headers and click on cancel button
		await inventory_page.selectingColumnHeaders(['Tags','Correlation id','EOS date','OS provider','Cloud readiness status'], inventoryTestData.resourceTableSettingHeaders);
		await inventory_page.selectApplyResetCancelButton(inventoryTestData.cancelButtonLabel)
		util.waitOnlyForInvisibilityOfCarbonDataLoader();
		// fetch the checkbox status after clicking on cancel
		await inventory_page.verifyTableSettingMenuHeader();
		var headerstatusAfterChange = await inventory_page.columnHeaderStatusFromTableSettingPanel();
		await expect(headerstatusAfterChange.selectedColumnHeaders).toEqual(headerstatusBeforeChange.selectedColumnHeaders)
		await expect(headerstatusAfterChange.unSelectedColumnHeaders).toEqual(headerstatusBeforeChange.unSelectedColumnHeaders)
		await expect(listViewHeadersBeforeChange).toEqual(await inventory_page.getListViewHeaders());
	});

	it('[Resource] Verify if all the selected checkboxes are reflected/added in list view on applying the change and resets to default view on reset', async function(){
		util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		util.waitOnlyForInvisibilityOfCarbonDataLoader();
		var listViewHeadersBeforeChange = await inventory_page.getListViewHeaders();
		await expect(await inventory_page.verifyTableSettingMenuHeader()).toEqual(inventoryTestData.tableSettingPanelHeader)
		//Verify if required headers are present under table setting panel
		await expect(await inventory_page.getColumnHeadersFromTableSettingPanel()).toEqual(inventoryTestData.resourceTableSettingHeaders)
		var headerstatus = await inventory_page.columnHeaderStatusFromTableSettingPanel();
		await expect(headerstatus.selectedColumnHeaders).toEqual(listViewHeadersBeforeChange)
		// Check/uncheck few checkboxes, apply change and verify table headers
		await inventory_page.selectingColumnHeaders(['Associated to','Resource type','Environment','Tags','Correlation id','OS release','Monitored by Netcool'],inventoryTestData.resourceTableSettingHeaders);
		await inventory_page.selectApplyResetCancelButton(inventoryTestData.applyButtonLabel)
		util.waitOnlyForInvisibilityOfCarbonDataLoader();
		// fetch the checkbox status after applying change
		await inventory_page.verifyTableSettingMenuHeader();
		var headerstatusAfterChange = await inventory_page.columnHeaderStatusFromTableSettingPanel();
		await expect(headerstatusAfterChange.selectedColumnHeaders).toEqual(await inventory_page.getListViewHeaders())
		await expect(headerstatusAfterChange.unSelectedColumnHeaders).not.toEqual(await inventory_page.getListViewHeaders());
		//Click on reset and validate with deafult header list
		await inventory_page.selectApplyResetCancelButton(inventoryTestData.resetButtonLabel);
		util.waitOnlyForInvisibilityOfCarbonDataLoader();
		await expect(await inventory_page.getListViewHeaders()).toEqual(inventoryTestData.resourceTableHeaders);
		// Verify checkbox status 
		await inventory_page.verifyTableSettingMenuHeader();
		util.waitOnlyForInvisibilityOfCarbonDataLoader();
		var headerstatusAfterReset = await inventory_page.columnHeaderStatusFromTableSettingPanel();
		await expect(headerstatusAfterReset.selectedColumnHeaders).toEqual(await inventory_page.getListViewHeaders())
		await expect(headerstatusAfterReset.unSelectedColumnHeaders).not.toEqual(await inventory_page.getListViewHeaders());
	});

	it('[Resource] Verify if all the column checkboxes are checked/unchecked on selecting Select all checkboxes', async function(){
		util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		util.waitOnlyForInvisibilityOfCarbonDataLoader();
		var listViewHeadersBeforeChange = await inventory_page.getListViewHeaders();
		await expect(await inventory_page.verifyTableSettingMenuHeader()).toEqual(inventoryTestData.tableSettingPanelHeader)
		//await expect(await inventory_page.getColumnHeadersFromTableSettingPanel()).toEqual(listViewHeadersBeforeChange)
		var headerstatus = await inventory_page.columnHeaderStatusFromTableSettingPanel();
		await expect(headerstatus.selectedColumnHeaders).toEqual(listViewHeadersBeforeChange)
		// Click on select all checkbox and verify if its reflected in table setting panel
		var selectAllStatus = await inventory_page.clickOnSelectAllHeaders()
		await expect(selectAllStatus.selectedColumnHeaders).toEqual(inventoryTestData.resourceTableSettingHeaders)
		await expect(selectAllStatus.unSelectedColumnHeaders.length).toBe(0)
	});

	it('[Associated resource] Verify if ID and name fields are disabled for user and panel closes on clicking x icon', async function(){
		inventory_page.clickandGetTextInsightFromTopInsightsSubSection(inventoryTestData.applicationsWithMostResourcesSubSectionLabel)
		util.waitOnlyForInvisibilityOfCarbonDataLoader();
		var listViewHeaders = await inventory_page.getListViewHeaders();
		await expect(await inventory_page.verifyTableSettingMenuHeader()).toEqual(inventoryTestData.tableSettingPanelHeader)
		var headerCheckBoxStatus = await inventory_page.columnHeaderStatusFromTableSettingPanel();
		await expect(headerCheckBoxStatus.selectedColumnHeaders).toEqual(listViewHeaders)
		await expect(await inventory_page.verifyDisabledHeaderCheckboxes(inventoryTestData.resourcesButtonName)).toBe(true);
		//click on x icon to close the panel and verify if its closed
		await expect(await inventory_page.closeTableSettingPanelAndVerify()).toBe(true);
	});

	it('[Associated resource] Verify if list view is not updated when user select/deselect column headers and click on Cancel button', async function(){
		inventory_page.clickandGetTextInsightFromTopInsightsSubSection(inventoryTestData.applicationsWithMostResourcesSubSectionLabel)
		util.waitOnlyForInvisibilityOfCarbonDataLoader();
		var listViewHeadersBeforeChange = await inventory_page.getListViewHeaders();
		await expect(await inventory_page.verifyTableSettingMenuHeader()).toEqual(inventoryTestData.tableSettingPanelHeader)
		var headerstatusBeforeChange = await inventory_page.columnHeaderStatusFromTableSettingPanel();
		await expect(headerstatusBeforeChange.selectedColumnHeaders).toEqual(listViewHeadersBeforeChange)
		// Check/Uncheck headers and click on cancel button
		await inventory_page.selectingColumnHeaders(['Tags','Correlation id','EOS date','OS provider','Cloud readiness status'], inventoryTestData.resourceTableSettingHeaders);
		await inventory_page.selectApplyResetCancelButton(inventoryTestData.cancelButtonLabel)
		util.waitOnlyForInvisibilityOfCarbonDataLoader();
		// fetch the checkbox status after clicking on cancel
		await inventory_page.verifyTableSettingMenuHeader();
		var headerstatusAfterChange = await inventory_page.columnHeaderStatusFromTableSettingPanel();
		await expect(headerstatusAfterChange.selectedColumnHeaders).toEqual(headerstatusBeforeChange.selectedColumnHeaders)
		await expect(headerstatusAfterChange.unSelectedColumnHeaders).toEqual(headerstatusBeforeChange.unSelectedColumnHeaders)
		await expect(listViewHeadersBeforeChange).toEqual(await inventory_page.getListViewHeaders());
	});

	it('[Associated resource] Verify if all the selected checkboxes are reflected/added in list view on applying the change and resets to default view on reset', async function(){
		inventory_page.clickandGetTextInsightFromTopInsightsSubSection(inventoryTestData.applicationsWithMostResourcesSubSectionLabel)
		util.waitOnlyForInvisibilityOfCarbonDataLoader();
		var listViewHeadersBeforeChange = await inventory_page.getListViewHeaders();
		await expect(await inventory_page.verifyTableSettingMenuHeader()).toEqual(inventoryTestData.tableSettingPanelHeader)
		//Verify if required headers are present under table setting panel
		await expect(await inventory_page.getColumnHeadersFromTableSettingPanel()).toEqual(inventoryTestData.resourceTableSettingHeaders)
		var headerstatus = await inventory_page.columnHeaderStatusFromTableSettingPanel();
		await expect(headerstatus.selectedColumnHeaders).toEqual(listViewHeadersBeforeChange)
		// Check/uncheck few checkboxes, apply change and verify table headers
		await inventory_page.selectingColumnHeaders(['Resource type','Environment','Tags','Correlation id','OS release','Monitored by Netcool'],inventoryTestData.resourceTableSettingHeaders);
		await inventory_page.selectApplyResetCancelButton(inventoryTestData.applyButtonLabel)
		util.waitOnlyForInvisibilityOfCarbonDataLoader();
		// fetch the checkbox status after applying change
		await inventory_page.verifyTableSettingMenuHeader();
		var headerstatusAfterChange = await inventory_page.columnHeaderStatusFromTableSettingPanel();
		await expect(headerstatusAfterChange.selectedColumnHeaders).toEqual(await inventory_page.getListViewHeaders())
		await expect(headerstatusAfterChange.unSelectedColumnHeaders).not.toEqual(await inventory_page.getListViewHeaders());
		//Click on reset and validate with deafult header list
		await inventory_page.selectApplyResetCancelButton(inventoryTestData.resetButtonLabel);
		util.waitOnlyForInvisibilityOfCarbonDataLoader();
		await expect(await inventory_page.getListViewHeaders()).toEqual(inventoryTestData.resourceTableHeaders);
		// Verify checkbox status 
		await inventory_page.verifyTableSettingMenuHeader();
		var headerstatusAfterReset = await inventory_page.columnHeaderStatusFromTableSettingPanel();
		await expect(headerstatusAfterReset.selectedColumnHeaders).toEqual(await inventory_page.getListViewHeaders())
		await expect(headerstatusAfterReset.unSelectedColumnHeaders).not.toEqual(await inventory_page.getListViewHeaders());
	});

	it('[Associated resource] Verify if all the column checkboxes are checked/unchecked on selecting Select all checkboxes', async function(){
		inventory_page.clickandGetTextInsightFromTopInsightsSubSection(inventoryTestData.applicationsWithMostResourcesSubSectionLabel)
		util.waitOnlyForInvisibilityOfCarbonDataLoader();
		var listViewHeadersBeforeChange = await inventory_page.getListViewHeaders();
		await expect(await inventory_page.verifyTableSettingMenuHeader()).toEqual(inventoryTestData.tableSettingPanelHeader)
		//await expect(await inventory_page.getColumnHeadersFromTableSettingPanel()).toEqual(listViewHeadersBeforeChange)
		var headerstatus = await inventory_page.columnHeaderStatusFromTableSettingPanel();
		await expect(headerstatus.selectedColumnHeaders).toEqual(listViewHeadersBeforeChange)
		// Click on select all checkbox and verify if its reflected in table setting panel
		var selectAllStatus = await inventory_page.clickOnSelectAllHeaders()
		await expect(selectAllStatus.selectedColumnHeaders).toEqual(inventoryTestData.resourceTableSettingHeaders);
		await expect(selectAllStatus.unSelectedColumnHeaders.length).toBe(0);
	});

	it('[Application]Verify table settings elements drag and drop changes are reflecting in list view and in Table settings panel', async function(){
		util.waitOnlyForInvisibilityOfCarbonDataLoader();
		var listViewHeadersBeforeChange = await inventory_page.getListViewHeaders();
		await expect(await inventory_page.verifyTableSettingMenuHeader()).toEqual(inventoryTestData.tableSettingPanelHeader)
		await expect(await inventory_page.getColumnHeadersFromTableSettingPanel()).toEqual(listViewHeadersBeforeChange)
		var headerstatus = await inventory_page.columnHeaderStatusFromTableSettingPanel();
		await expect(headerstatus.selectedColumnHeaders).toEqual(listViewHeadersBeforeChange)
		// Perform drag and drop operation
		await health_page.dragAndDropTableSettingsColumn(listViewHeadersBeforeChange[inventoryTestData.fifthIndex], listViewHeadersBeforeChange[inventoryTestData.thirdIndex]);
		await inventory_page.selectApplyResetCancelButton(inventoryTestData.applyButtonLabel);
		// fetch the checkbox status after applying change
		util.waitOnlyForInvisibilityOfCarbonDataLoader();
		await inventory_page.verifyTableSettingMenuHeader();
		var headerstatusAfterChange = await inventory_page.columnHeaderStatusFromTableSettingPanel();
		await expect(headerstatusAfterChange.selectedColumnHeaders).toEqual(await inventory_page.getListViewHeaders())
		await expect(listViewHeadersBeforeChange).not.toEqual(await inventory_page.getListViewHeaders());
		//Click on reset and validate with deafult header list
		await inventory_page.selectApplyResetCancelButton(inventoryTestData.resetButtonLabel);
		util.waitOnlyForInvisibilityOfCarbonDataLoader();
		await expect(await inventory_page.getListViewHeaders()).toEqual(inventoryTestData.applicationTableHeaders);
		// Verify checkbox status 
		await inventory_page.verifyTableSettingMenuHeader();
		var headerstatusAfterReset = await inventory_page.columnHeaderStatusFromTableSettingPanel();
		await expect(headerstatusAfterReset.selectedColumnHeaders).toEqual(await inventory_page.getListViewHeaders())
		await expect(headerstatusAfterReset.unSelectedColumnHeaders).not.toEqual(await inventory_page.getListViewHeaders());
	});

	it('[Resource] Verify table settings elements drag and drop changes are reflecting in list view and in Table settings panel', async function(){
		util.waitOnlyForInvisibilityOfCarbonDataLoader();
		util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		util.waitOnlyForInvisibilityOfCarbonDataLoader();
		var listViewHeadersBeforeChange = await inventory_page.getListViewHeaders();
		await expect(await inventory_page.verifyTableSettingMenuHeader()).toEqual(inventoryTestData.tableSettingPanelHeader)
		var headerstatusBeforeChange = await inventory_page.columnHeaderStatusFromTableSettingPanel();
		await expect(headerstatusBeforeChange.selectedColumnHeaders).toEqual(listViewHeadersBeforeChange);
		// Perform drag and drop operation
		await health_page.dragAndDropTableSettingsColumn(listViewHeadersBeforeChange[inventoryTestData.fifthIndex], listViewHeadersBeforeChange[inventoryTestData.thirdIndex]);
		await inventory_page.selectApplyResetCancelButton(inventoryTestData.applyButtonLabel);
		// fetch the checkbox status after applying change
		util.waitOnlyForInvisibilityOfCarbonDataLoader();
		await inventory_page.verifyTableSettingMenuHeader();
		var headerstatusAfterChange = await inventory_page.columnHeaderStatusFromTableSettingPanel();
		await expect(headerstatusAfterChange.selectedColumnHeaders).toEqual(await inventory_page.getListViewHeaders());
		await expect(listViewHeadersBeforeChange).not.toEqual(await inventory_page.getListViewHeaders());
		//Click on reset and validate with deafult header list
		await inventory_page.selectApplyResetCancelButton(inventoryTestData.resetButtonLabel);
		util.waitOnlyForInvisibilityOfCarbonDataLoader();
		await expect(await inventory_page.getListViewHeaders()).toEqual(inventoryTestData.resourceTableHeaders);
		// Verify checkbox status 
		await inventory_page.verifyTableSettingMenuHeader();
		var headerstatusAfterReset = await inventory_page.columnHeaderStatusFromTableSettingPanel();
		await expect(headerstatusAfterReset.selectedColumnHeaders).toEqual(await inventory_page.getListViewHeaders());
		await expect(headerstatusAfterReset.unSelectedColumnHeaders).not.toEqual(await inventory_page.getListViewHeaders());
	});

	it('[Associated Resource] Verify table settings elements drag and drop changes are reflecting in list view and in Table settings panel', async function(){
		util.waitOnlyForInvisibilityOfCarbonDataLoader();
		inventory_page.clickandGetTextInsightFromTopInsightsSubSection(inventoryTestData.applicationsWithMostResourcesSubSectionLabel)
		util.waitOnlyForInvisibilityOfCarbonDataLoader();
		var listViewHeadersBeforeChange = await inventory_page.getListViewHeaders();
		await expect(await inventory_page.verifyTableSettingMenuHeader()).toEqual(inventoryTestData.tableSettingPanelHeader)
		var headerstatusBeforeChange = await inventory_page.columnHeaderStatusFromTableSettingPanel();
		await expect(headerstatusBeforeChange.selectedColumnHeaders).toEqual(listViewHeadersBeforeChange);
		// Perform drag and drop operation
		await health_page.dragAndDropTableSettingsColumn(listViewHeadersBeforeChange[inventoryTestData.ninthIndex], listViewHeadersBeforeChange[inventoryTestData.thirdIndex]);
		await inventory_page.selectApplyResetCancelButton(inventoryTestData.applyButtonLabel);
		// fetch the checkbox status after applying change
		util.waitOnlyForInvisibilityOfCarbonDataLoader();
		await inventory_page.verifyTableSettingMenuHeader();
		var headerstatusAfterChange = await inventory_page.columnHeaderStatusFromTableSettingPanel();
		await expect(headerstatusAfterChange.selectedColumnHeaders).toEqual(await inventory_page.getListViewHeaders());
		await expect(listViewHeadersBeforeChange).not.toEqual(await inventory_page.getListViewHeaders());
		//Click on reset and validate with deafult header list
		await inventory_page.selectApplyResetCancelButton(inventoryTestData.resetButtonLabel);
		util.waitOnlyForInvisibilityOfCarbonDataLoader();
		await expect(await inventory_page.getListViewHeaders()).toEqual(inventoryTestData.resourceTableHeaders);
		// Verify checkbox status 
		await inventory_page.verifyTableSettingMenuHeader();
		var headerstatusAfterReset = await inventory_page.columnHeaderStatusFromTableSettingPanel();
		await expect(headerstatusAfterReset.selectedColumnHeaders).toEqual(await inventory_page.getListViewHeaders());
		await expect(headerstatusAfterReset.unSelectedColumnHeaders).not.toEqual(await inventory_page.getListViewHeaders());
	});

	it('[AWS] Verify whether user is able to assign and remove application and environment tag to single resource from list view', async function () {
		var providersList = await inventory_page.getMCAndDCListFromDashboardInventoryCard("MC");
		await inventory_page.navigateDashboardInventory();
		var providerPresentText = inventory_page.checkPresenceOfProviderInGlobalFilter(providersList, inventoryTestData.awsProvider);
		expect(providerPresentText).toEqual(inventoryTestData.awsProvider);
		util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		// Select AWS provider from global filter and click on apply
		await inventory_page.selectProviderAccount(inventoryTestData.awsAccountNumber);
		healthInventoryUtil.clickOnApplyFilterButton();
		// Search keyword and fetch selected resource details from List view
		await inventory_page.searchTable(inventoryTestData.awsResourceSearchTerm)
		var resourceListView = await inventory_page.selectAndFetchResourceDetailsFromListView(inventoryTestData.firstIndex);
		//Click on Assign tags option and Verify Assign Tags text in Assign Tag window
		await inventory_page.selectAssignRemoveTags(inventoryTestData.assignTags);
		await expect(inventory_page.taggingPageTitle()).toEqual(inventoryTestData.assignTags);
		// Select resource , tag key & value
		var assignTagsData = await inventory_page.selectResourceTagkeyValue(inventoryTestData.firstIndex, inventoryTestData.firstIndex, inventoryTestData.defaultTagKeys, inventoryTestData.awsProvider,inventoryTestData.firstIndex,inventoryTestData.firstIndex)
		// Click on Assign Tags button
		await inventory_page.clickOnAssignRemoveButton(inventoryTestData.assignTags);
		util.waitOnlyForInvisibilityOfCarbonDataLoader();
		await inventory_page.switchBetweenTabs();
		//Validation and untagging
		var tagsFromListView = await inventory_page.getApplicationEnvironmentTags(resourceListView,
			[assignTagsData.tagKeys[0]], assignTagsData.appTags, [assignTagsData.tagKeys[1]], assignTagsData.envTags);
		var appTagsCompareResult = await inventory_page.compareArraysubSets(assignTagsData.appTags, tagsFromListView.appTagsFromListView);
		var envTagsCompareResult = await inventory_page.compareArraysubSets(assignTagsData.envTags, tagsFromListView.envTagsFromListView);
		await expect(appTagsCompareResult).toBe(true);
		await expect(envTagsCompareResult).toBe(true);
	  });

	it('[Azure] Verify whether user is able to assign and remove application and environment tag to single resource from list view', async function () {
		var providersList = await inventory_page.getMCAndDCListFromDashboardInventoryCard("MC");
		await inventory_page.navigateDashboardInventory();
		var providerPresentText = inventory_page.checkPresenceOfProviderInGlobalFilter(providersList, inventoryTestData.azureProvider);
		expect(providerPresentText).toEqual(inventoryTestData.azureProvider);
		util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		// Select Azure provider from global filter and click on apply
		await inventory_page.selectProviderAccount(inventoryTestData.azureAccountNumber);
		healthInventoryUtil.clickOnApplyFilterButton();
		// Search keyword and fetch selected resource details from List view
		await inventory_page.searchTable(inventoryTestData.serviceInstanceSearchTerm)
		var resourceListView = await inventory_page.selectAndFetchResourceDetailsFromListView(inventoryTestData.firstIndex);
		//Click on Assign tags option and Verify Assign Tags text in Assign Tag window
		await inventory_page.selectAssignRemoveTags(inventoryTestData.assignTags);
		await expect(inventory_page.taggingPageTitle()).toEqual(inventoryTestData.assignTags);
		// Select resource , tag key & value
		var assignTagsData = await inventory_page.selectResourceTagkeyValue(inventoryTestData.firstIndex, inventoryTestData.firstIndex, inventoryTestData.defaultTagKeys, inventoryTestData.azureAccountNumber, inventoryTestData.firstIndex, inventoryTestData.firstIndex)
		// Click on Assign Tags button
		await inventory_page.clickOnAssignRemoveButton(inventoryTestData.assignTags);
		util.waitOnlyForInvisibilityOfCarbonDataLoader();
		await inventory_page.switchBetweenTabs();
		//Validation and untagging
		var tagsFromListView = await inventory_page.getApplicationEnvironmentTags(resourceListView,
			[assignTagsData.tagKeys[0]], assignTagsData.appTags, [assignTagsData.tagKeys[1]], assignTagsData.envTags);
		var appTagsCompareResult = await inventory_page.compareArraysubSets(assignTagsData.appTags, tagsFromListView.appTagsFromListView);
		var envTagsCompareResult = await inventory_page.compareArraysubSets(assignTagsData.envTags, tagsFromListView.envTagsFromListView);
		await expect(appTagsCompareResult).toBe(true);
		await expect(envTagsCompareResult).toBe(true);
	});

	it('[AWS] Verify whether user is able to assign and remove 1 or more application and environment tags to multiple resources from list view', async function () {
		var providersList = await inventory_page.getMCAndDCListFromDashboardInventoryCard("MC");
		await inventory_page.navigateDashboardInventory();
		var providerPresentText = inventory_page.checkPresenceOfProviderInGlobalFilter(providersList, inventoryTestData.awsProvider);
		expect(providerPresentText).toEqual(inventoryTestData.awsProvider);
		util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		// Select AWS provider from global filter and click on apply
		await inventory_page.selectProviderAccount(inventoryTestData.awsAccountNumber);
		healthInventoryUtil.clickOnApplyFilterButton();
		// Search keyword and fetch selected resource details from List view
		await inventory_page.searchTable(inventoryTestData.awsResourceSearchTerm)
		var resourceListView = await inventory_page.selectAndFetchResourceDetailsFromListView(inventoryTestData.secondIndex);
		//Click on Assign tags option and Verify Assign Tags text in Assign Tag window
		await inventory_page.selectAssignRemoveTags(inventoryTestData.assignTags);
		await expect(inventory_page.taggingPageTitle()).toEqual(inventoryTestData.assignTags);
		// Select resource , tag key & value
		var assignTagsData = await inventory_page.selectResourceTagkeyValue(inventoryTestData.firstIndex, inventoryTestData.secondIndex, inventoryTestData.defaultTagKeys, inventoryTestData.awsProvider, inventoryTestData.firstIndex, inventoryTestData.secondIndex)
		// Duplicate tags in array to verify both resources
		assignTagsData.appTags.push(assignTagsData.appTags[0]);
		assignTagsData.envTags.push(assignTagsData.envTags[0]);
		var appKey = assignTagsData.tagKeys[0];
		var envKey = assignTagsData.tagKeys[1];
		// Click on Assign Tags button
		await inventory_page.clickOnAssignRemoveButton(inventoryTestData.assignTags);
		util.waitOnlyForInvisibilityOfCarbonDataLoader();
		await inventory_page.switchBetweenTabs();
		//Validation and untagging
		var tagsFromListView = await inventory_page.getApplicationEnvironmentTags(resourceListView, [appKey, appKey], assignTagsData.appTags, [envKey, envKey], assignTagsData.envTags);
		var appTagsCompareResult = await inventory_page.compareArraysubSets(assignTagsData.appTags, tagsFromListView.appTagsFromListView);
		var envTagsCompareResult = await inventory_page.compareArraysubSets(assignTagsData.envTags, tagsFromListView.envTagsFromListView);
		await expect(appTagsCompareResult).toBe(true);
		await expect(envTagsCompareResult).toBe(true);
	});

	it('[Azure] Verify whether user is able to assign and remove 1 or more application and environment tags to multiple resources from list view', async function () {
		var providersList = await inventory_page.getMCAndDCListFromDashboardInventoryCard("MC");
		await inventory_page.navigateDashboardInventory();
		var providerPresentText = inventory_page.checkPresenceOfProviderInGlobalFilter(providersList, inventoryTestData.azureProvider);
		expect(providerPresentText).toEqual(inventoryTestData.azureProvider);
		util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		// Select Azure provider from global filter and click on apply
		await inventory_page.selectProviderAccount(inventoryTestData.azureAccountNumber);
		healthInventoryUtil.clickOnApplyFilterButton();
		// Search keyword and fetch selected resource details from List view
		await inventory_page.searchTable(inventoryTestData.serviceInstanceSearchTerm)
		var resourceListView = await inventory_page.selectAndFetchResourceDetailsFromListView(inventoryTestData.secondIndex);
		//Click on Assign tags option and Verify Assign Tags text in Assign Tag window
		await inventory_page.selectAssignRemoveTags(inventoryTestData.assignTags);
		await expect(inventory_page.taggingPageTitle()).toEqual(inventoryTestData.assignTags);
		// Select resource , tag key & value
		var assignTagsData = await inventory_page.selectResourceTagkeyValue(inventoryTestData.firstIndex, inventoryTestData.secondIndex, inventoryTestData.defaultTagKeys, inventoryTestData.azureProvider, inventoryTestData.firstIndex, inventoryTestData.secondIndex)
		// Duplicate tags in array to verify both resources
		assignTagsData.appTags.push(assignTagsData.appTags[0]);
		assignTagsData.envTags.push(assignTagsData.envTags[0]);
		var appKey = assignTagsData.tagKeys[0];
		var envKey = assignTagsData.tagKeys[1];
		// Click on Assign Tags button
		await inventory_page.clickOnAssignRemoveButton(inventoryTestData.assignTags);
		util.waitOnlyForInvisibilityOfCarbonDataLoader();
		await inventory_page.switchBetweenTabs();
		//Validation and untagging
		var tagsFromListView = await inventory_page.getApplicationEnvironmentTags(resourceListView, [appKey, appKey], assignTagsData.appTags, [envKey, envKey], assignTagsData.envTags);
		var appTagsCompareResult = await inventory_page.compareArraysubSets(assignTagsData.appTags, tagsFromListView.appTagsFromListView);
		var envTagsCompareResult = await inventory_page.compareArraysubSets(assignTagsData.envTags, tagsFromListView.envTagsFromListView);
		await expect(appTagsCompareResult).toBe(true);
		await expect(envTagsCompareResult).toBe(true);
	});
	
	it('[AWS] Verify whether user is able to assign and remove multiple application and environment tag to single resource from untagged card', async function () {
		var providersList = await inventory_page.getMCAndDCListFromDashboardInventoryCard("MC");
		await inventory_page.navigateDashboardInventory();
		var providerPresentText =await inventory_page.checkPresenceOfProviderInGlobalFilter(providersList, inventoryTestData.awsProvider);
		expect(providerPresentText).toEqual(inventoryTestData.awsProvider);
		util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		// Select AWS provider from global filter and click on apply
		await inventory_page.selectProviderAccount(inventoryTestData.awsAccountNumber);
		healthInventoryUtil.clickOnApplyFilterButton();
		// Verify 'Untagged resources text is present and Select Application count from Untagged resources subsection of Top Insights
		expect(inventory_page.verifyTopInsightsSubSectionLabelText(inventoryTestData.untaggedResourcesSubSectionLabel)).toBe(true);
		await inventory_page.clickOntCategoryResourceCountFromTopInsightsSubSection(inventoryTestData.untaggedResourcesSubSectionLabel, inventoryTestData.untaggedResourcesApplicationLabel);
		// Get Untagged Resources Application/ Environment counts and compare with Resources list view count
		var appEnvCount = await inventory_page.getUntaggedResourcesAppEnvCount();
		expect(appEnvCount.untaggedResourcesApplicationCount).toEqual(inventory_page.getApplicationOrResourcesTableHeaderTextCount());
		// Search keyword and fetch selected resource details from List view
		await inventory_page.searchTable(inventoryTestData.awsResourceSearchTerm)
		var resourceListView = await inventory_page.selectAndFetchResourceDetailsFromListView(inventoryTestData.firstIndex);
		//Click on Assign tags option and Verify Assign Tags text in Assign Tag window
		await inventory_page.selectAssignRemoveTags(inventoryTestData.assignTags);
		await expect(inventory_page.taggingPageTitle()).toEqual(inventoryTestData.assignTags);
		// Select resource , tag key & value
		var assignTagsData = await inventory_page.selectResourceTagkeyValue(inventoryTestData.firstIndex, inventoryTestData.firstIndex, inventoryTestData.defaultTagKeys, inventoryTestData.awsProvider, inventoryTestData.secondIndex, inventoryTestData.secondIndex)
		// Click on Assign Tags button
		await inventory_page.clickOnAssignRemoveButton(inventoryTestData.assignTags);
		await inventory_page.switchBetweenTabs();
		var appEnvCountAfterTagging = await inventory_page.getUntaggedResourcesAppEnvCount();
		expect(appEnvCount.untaggedResourcesApplicationCount).not.toEqual(appEnvCountAfterTagging.untaggedResourcesApplicationCount)
		expect((appEnvCount.untaggedResourcesApplicationCount - resourceListView.length)).toEqual(appEnvCountAfterTagging.untaggedResourcesApplicationCount)
		//Validation and untagging
		var tagsFromListView = await inventory_page.getApplicationEnvironmentTags(resourceListView,
			[assignTagsData.tagKeys[0]], assignTagsData.appTags, [assignTagsData.tagKeys[1]], assignTagsData.envTags);
		var appTagsCompareResult = await inventory_page.compareArraysubSets(assignTagsData.appTags, tagsFromListView.appTagsFromListView);
		var envTagsCompareResult = await inventory_page.compareArraysubSets(assignTagsData.envTags, tagsFromListView.envTagsFromListView);
		await expect(appTagsCompareResult).toBe(true);
		await expect(envTagsCompareResult).toBe(true);
		await inventory_page.switchBetweenTabs();
		//Verify if untagged count is matching with original count after untagging
		var appEnvCountAfterUnTagging = await inventory_page.getUntaggedResourcesAppEnvCount();
		expect(appEnvCountAfterUnTagging.untaggedResourcesApplicationCount).not.toEqual(appEnvCountAfterTagging.untaggedResourcesApplicationCount)
		expect((appEnvCount.untaggedResourcesApplicationCount)).toEqual(appEnvCountAfterUnTagging.untaggedResourcesApplicationCount)
	});

	it('[Azure] Verify whether user is able to assign and remove multiple application and environment tag to single resource from untagged card', async function () {
		var providersList = await inventory_page.getMCAndDCListFromDashboardInventoryCard("MC");
		await inventory_page.navigateDashboardInventory();
		var providerPresentText =await inventory_page.checkPresenceOfProviderInGlobalFilter(providersList, inventoryTestData.azureProvider);
		expect(providerPresentText).toEqual(inventoryTestData.azureProvider);
		util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		// Select Azure provider from global filter and click on apply
		await inventory_page.selectProviderAccount(inventoryTestData.azureAccountNumber);
		healthInventoryUtil.clickOnApplyFilterButton();
		// Verify 'Untagged resources text is present and Select Application count from Untagged resources subsection of Top Insights
		expect(inventory_page.verifyTopInsightsSubSectionLabelText(inventoryTestData.untaggedResourcesSubSectionLabel)).toBe(true);
		await inventory_page.clickOntCategoryResourceCountFromTopInsightsSubSection(inventoryTestData.untaggedResourcesSubSectionLabel, inventoryTestData.untaggedResourcesApplicationLabel);
		// Get Untagged Resources Application/ Environment counts and compare with Resources list view count
		var appEnvCount = await inventory_page.getUntaggedResourcesAppEnvCount();
		expect(appEnvCount.untaggedResourcesApplicationCount).toEqual(inventory_page.getApplicationOrResourcesTableHeaderTextCount());
		// Search keyword and fetch selected resource details from List view
		await inventory_page.searchTable(inventoryTestData.serviceInstanceSearchTerm)
		var resourceListView = await inventory_page.selectAndFetchResourceDetailsFromListView(inventoryTestData.firstIndex);
		//Click on Assign tags option and Verify Assign Tags text in Assign Tag window
		await inventory_page.selectAssignRemoveTags(inventoryTestData.assignTags);
		await expect(inventory_page.taggingPageTitle()).toEqual(inventoryTestData.assignTags);
		// Select resource , tag key & value
		var assignTagsData = await inventory_page.selectResourceTagkeyValue(inventoryTestData.firstIndex, inventoryTestData.firstIndex, inventoryTestData.defaultTagKeys, inventoryTestData.azureProvider, inventoryTestData.secondIndex, inventoryTestData.secondIndex)
		// Click on Assign Tags button
		await inventory_page.clickOnAssignRemoveButton(inventoryTestData.assignTags);
		await inventory_page.switchBetweenTabs();
		var appEnvCountAfterTagging = await inventory_page.getUntaggedResourcesAppEnvCount();
		expect(appEnvCount.untaggedResourcesApplicationCount).not.toEqual(appEnvCountAfterTagging.untaggedResourcesApplicationCount)
		expect((appEnvCount.untaggedResourcesApplicationCount - resourceListView.length)).toEqual(appEnvCountAfterTagging.untaggedResourcesApplicationCount)
		//Validation and untagging
		var tagsFromListView = await inventory_page.getApplicationEnvironmentTags(resourceListView,
			[assignTagsData.tagKeys[0]], assignTagsData.appTags, [assignTagsData.tagKeys[1]], assignTagsData.envTags);
		var appTagsCompareResult = await inventory_page.compareArraysubSets(assignTagsData.appTags, tagsFromListView.appTagsFromListView);
		var envTagsCompareResult = await inventory_page.compareArraysubSets(assignTagsData.envTags, tagsFromListView.envTagsFromListView);
		await expect(appTagsCompareResult).toBe(true);
		await expect(envTagsCompareResult).toBe(true);
		await inventory_page.switchBetweenTabs();
		//Verify if untagged count is matching with original count after untagging
		var appEnvCountAfterUnTagging = await inventory_page.getUntaggedResourcesAppEnvCount();
		expect(appEnvCountAfterUnTagging.untaggedResourcesApplicationCount).not.toEqual(appEnvCountAfterTagging.untaggedResourcesApplicationCount);
		expect((appEnvCount.untaggedResourcesApplicationCount)).toEqual(appEnvCountAfterUnTagging.untaggedResourcesApplicationCount);
	});

	it('[GCP] Verify whether user is able to assign and remove application and environment tag to single resource from list view', async function () {
		var providersList = await inventory_page.getMCAndDCListFromDashboardInventoryCard("MC");
		await inventory_page.navigateDashboardInventory();
		var providerPresentText =await inventory_page.checkPresenceOfProviderInGlobalFilter(providersList, inventoryTestData.gcpProvider);
		expect(providerPresentText).toEqual(inventoryTestData.gcpProvider);
		util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		// Select GCP provider from global filter and click on apply
		healthInventoryUtil.clickOnProviderCheckBox(inventoryTestData.gcpProvider);
		healthInventoryUtil.clickOnApplyFilterButton();
		// Search keyword and fetch selected resource details from List view
		await inventory_page.searchTable(inventoryTestData.gcpResourceSearchTerm)
		var resourceListView = await inventory_page.selectAndFetchResourceDetailsFromListView(inventoryTestData.firstIndex);
		//Click on Assign tags option and Verify Assign Tags text in Assign Tag window
		await inventory_page.selectAssignRemoveTags(inventoryTestData.assignTags);
		await expect(inventory_page.taggingPageTitle()).toEqual(inventoryTestData.assignTags);
		// Select resource , tag key & value
		var assignTagsData = await inventory_page.selectResourceTagkeyValue(inventoryTestData.firstIndex, inventoryTestData.firstIndex, inventoryTestData.defaultTagKeys, inventoryTestData.gcpProvider)
		// Click on Assign Tags button
		await inventory_page.clickOnAssignRemoveButton(inventoryTestData.assignTags);
		await inventory_page.switchBetweenTabs();
		//Validation and untagging
		var tagsFromListView = await inventory_page.getApplicationEnvironmentTags(resourceListView,
			[assignTagsData.tagKeys[0]], assignTagsData.appTags, [assignTagsData.tagKeys[1]], assignTagsData.envTags);
		var appTagsCompareResult = await inventory_page.compareArraysubSets(assignTagsData.appTags, tagsFromListView.appTagsFromListView);
		var envTagsCompareResult = await inventory_page.compareArraysubSets(assignTagsData.envTags, tagsFromListView.envTagsFromListView);
		await expect(appTagsCompareResult).toBe(true);
		await expect(envTagsCompareResult).toBe(true);
	});

	afterAll(async function() {
	//	await launchpad_page.clickOnLogoutAndLogin(browser.params.username, browser.params.password);
	});
});