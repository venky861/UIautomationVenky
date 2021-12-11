/**
 * Created by : Pushpraj
 * created on : 12/02/2020
 */

"use strict";
var logGenerator = require("../../helpers/logGenerator.js"),
logger = logGenerator.getApplicationLogger(),
healthPage = require('../pageObjects/health.pageObject.js'),
launchpad = require('../pageObjects/launchpad.pageObject.js'),
dashboard = require('../pageObjects/dashboard.pageObject.js'),
launchpadTestData = require('../../testData/cards/launchpadTestData.json'),
healthTestData = require('../../testData/cards/healthTestData.json'),
dashboardTestData = require('../../testData/cards/dashboardTestData.json'),
appUrls = require('../../testData/appUrls.json'),
elasticViewData = require('../../expected_values.json'),
util = require('../../helpers/util.js'),
healthAndInventoryUtil = require("../../helpers/healthAndInventoryUtil.js"),
inventoryPage = require('../pageObjects/inventory.pageObject.js'),
esQueriesHealth = require('../../elasticSearchTool/esQuery_HealthPayload.js'),
tenantId = browser.params.tenantId,
isEnabledESValidation = browser.params.esValidation;

describe('Health - functionality: ', function() {
	var healthObj,launchpadObj, dashboardObj, inventory_page;
	var healthAppData = elasticViewData.health.applications.no_filters.expected_values;
	var healthResData = elasticViewData.health.resources.no_filters.expected_values;

	beforeAll(function() {
		healthObj = new healthPage();
		launchpadObj = new launchpad();
		dashboardObj = new dashboard();
		inventory_page = new inventoryPage();
		browser.driver.manage().window().maximize();
        });

	beforeEach(function() {
		launchpadObj.open();
		expect(launchpadObj.getWelcomeMessageTxt()).toEqual(launchpadTestData.welcome);
		launchpadObj.clickOnHamburgerMenu(launchpadTestData.leftNavigationExpanded);
		launchpadObj.clickOnleftNavigationMenuBasedOnName(launchpadTestData.aIOpsIntelligentITOperationsBtn);
		launchpadObj.clickLeftNavCardBasedOnName(launchpadTestData.healthCard);
		expect(healthObj.getHealthHeaderTitleText()).toEqual(healthTestData.headerTitle);
	});

	it('Verify Resource Summary Widget data is matching with Health status widget and data should match against ES Result', async function() {
	    await util.clickOnTabButton(healthTestData.resourcesButtonName);
	    expect(util.isSelectedTabButton(healthTestData.resourcesButtonName)).toEqual(true);
	    await expect(healthObj.isResourcesSummaryHeaderTextDisplaying()).toEqual(healthTestData.resourceSummary);
	    // Get data of Resource Summary widget from UI
	    var resourceSummaryData = await healthObj.getResourcesSummaryTextAndCount();
	    // Get data of Health Status widget from UI
	    var healthStatusData = await healthObj.getHealthStatusSectionTextAndCount();
	    // Verify health status data matches with health status data shown Resources Summary widget in UI
        await expect(resourceSummaryData).toEqual(jasmine.arrayContaining(healthStatusData.healthStatusLabelAndCount));
        if (isEnabledESValidation) {
            // Get Consolidated result of Health status, deleted resources and total resources from ES queries
            var elasticSearchResult = await healthObj.getHealthStatusAndDeletedResourcesElasticSearchResponse();
            // Verify Resource Summary data from Ui is matching with Elastic Query response
            await expect(resourceSummaryData).toEqual(elasticSearchResult);
        }
	});

	it('Verify Associated resources total count in Application Details Page should match against ES query result', async function() {
		expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
		await healthObj.isViewDetailsButtonDisplayed(healthTestData.twoIndex);
		await healthObj.clickOnViewDetails();
		await expect(healthObj.getViewDetailsOverviewLabelText()).toEqual(healthTestData.OverviewTitle);
		var associatedResourceCount = await healthObj.getResourceCountFromAssociatedResourcesTableLabel();
		var applicationName = await healthObj.getHealthHeaderTitleText();
		if (isEnabledESValidation) {
              //Get resources tickets details from ES queries
              var elasticSearchResult = await esQueriesHealth.getTotalAssociatedResourceCountElasticSearchResponse(healthTestData.esHealthSearchIndex,tenantId,applicationName);
			  //Verify resources tickets details data from Ui is matching with Elastic Query response
             await expect(associatedResourceCount).toEqual(elasticSearchResult);
    		}
	});
	
	it('Verify Associated resources count filter by health status in Application Details Page should match against ES query result', async function() {
		expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
		await healthObj.isViewDetailsButtonDisplayed(healthTestData.twoIndex);
		await healthObj.clickOnViewDetails();
		await expect(healthObj.getViewDetailsOverviewLabelText()).toEqual(healthTestData.OverviewTitle);
		var associatedResourceCount = await healthObj.getResourceCountFromAssociatedResourcesTableLabel();
		var pageCount = await healthObj.getPageCountForAppsResourcesTable();
        var healthStatusResourcesCount = await healthObj.getCountOfLinks(healthTestData.headerTitle, pageCount);
		var applicationName = await healthObj.getHealthHeaderTitleText();
		if (isEnabledESValidation) {
              //Get resources tickets details from ES queries
              var elasticSearchResult = await esQueriesHealth.ascResources_health_status_count(healthTestData.esHealthSearchIndex,tenantId,applicationName);
			  //Verify resources tickets details data from Ui is matching with Elastic Query response
              await expect(healthStatusResourcesCount.result).toEqual(elasticSearchResult);
    	}
	});
	
	it('Verify Associated resources Details should match against ES query result', async function() {
		expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
		await healthObj.isViewDetailsButtonDisplayed(healthTestData.twoIndex);
		await healthObj.clickOnViewDetails();
		util.waitOnlyForInvisibilityOfCarbonDataLoader();
		var applicationName = await healthObj.getHealthHeaderTitleText();
        var resourceName = await healthObj.clickOnFirstAffectedResourceViewDetailsButton();
        if (isEnabledESValidation) {
              //Get resources name from ES queries
              var elasticSearchResult = await esQueriesHealth.getAssociatedResourceDetailsESResponse(healthTestData.esHealthSearchIndex,tenantId,applicationName);
			  //Verify resources name from Ui is matching with Elastic Query response
			  await expect(resourceName).toEqual(elasticSearchResult);
    		}
	});

	it('Verify resources tickets Details on Associated resource details page from Application Details Page Tickets detail against ES query result', async function() {
	    await util.clickOnTabButton(healthTestData.resourcesButtonName);
	    expect(util.isSelectedTabButton(healthTestData.resourcesButtonName)).toEqual(true);
		await expect(healthObj.publicFilterValuesTitle()).toEqual(healthTestData.ibmDCProviderFilterText);
		expect(await healthObj.clickOnCheckBox(healthTestData.ibmDCProviderFilterText)).toEqual(true);
		expect(await healthObj.applyGlobalFilter()).toEqual(true);
	    await healthObj.isViewDetailsButtonDisplayed(healthTestData.zeroIndex);
		await healthObj.clickOnViewDetails();
		util.waitOnlyForInvisibilityOfCarbonDataLoader();
		var ticketDetailsOverview=await healthObj.clickOnIdLink();
        if (isEnabledESValidation) {
            logger.info("==============ES Data Validation===================");
              //Get resources tickets details from ES queries
              var elasticSearchResult = await esQueriesHealth.getTotalAssociatedTicketsDetailsESResponse(healthTestData.esIncidentsSearchIndex,tenantId,ticketDetailsOverview);
              //Verify resources tickets details data from Ui is matching with Elastic Query response
             await expect(ticketDetailsOverview).toEqual(elasticSearchResult);
    		}
	});

	it('Verify if all elements within Applications tab are loaded or not', function(){
		expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
		expect(healthObj.isTitleTextFromSectionPresent(healthTestData.topInsightsLabelText)).toBe(true);
		expect(healthObj.getHealthStatusSectionLabelText()).toEqual(healthTestData.healthStatusLabelText);
		expect(healthObj.getHealthBreakdownSectionLabelText()).toEqual(healthTestData.applicationBreakdownLabelText);
		expect(healthObj.verifyTopInsightsSubSectionLabelText(healthTestData.leastAvailableAppLabelText)).toEqual(true);
		expect(healthObj.verifyTopInsightsSubSectionLabelText(healthTestData.mostAvailableAppLabelText)).toEqual(true);
		expect(healthObj.verifyTopInsightsSubSectionLabelText(healthTestData.appsWithMostIncidentsLabelText)).toEqual(true);
		expect(healthObj.verifyTopInsightsSubSectionLabelText(healthTestData.appWithMostHighPriorityIncidentsLabelText)).toEqual(true);
		expect(healthObj.isTitleTextFromSectionPresent(healthTestData.applicationsLabelText)).toBe(true);
		expect(healthObj.getApplicationsResourcesSectionLabelCountFromHealthAndCommandCenter(healthTestData.applicationsButtonName)).toEqual(healthObj.getSelectedTypeCountFromDonutChart());
		expect(inventory_page.checkNoDataTable()).toBe(false);
	});

	it("To verify the Azure Cloud Health compute Services", async function(){
	    expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
		await util.clickOnTabButton(healthTestData.resourcesButtonName);
	    expect(util.isSelectedTabButton(healthTestData.resourcesButtonName)).toEqual(true);
	    util.waitOnlyForInvisibilityOfCarbonDataLoader();
	    await healthObj.clickOnHealthStatusOption(healthTestData.resourceHealthyText);
		await expect(healthObj.searchTable(healthTestData.azureComputeSearchText)).toBe(true);
		var healthyApplicationsCountFromUI = await healthObj.getAppRescTotalCountBaseOnSelectedColumnValue(healthTestData.azureComputeSearchText,
		                                                            healthTestData.resourcesButtonName,
			                                                        healthTestData.resourceTableHeaders[healthTestData.tenthIndex])
		await expect(healthyApplicationsCountFromUI.listCount).toEqual(healthyApplicationsCountFromUI.totalRecordsCount);
		await healthObj.isViewDetailsButtonDisplayed(healthTestData.zeroIndex);
		await healthObj.clickOnViewDetails();
		await expect(healthObj.getViewDetailsOverviewLabelText()).toEqual(healthTestData.OverviewTitle);
		var overviewDetails = await healthObj.getOverviewLabelFromResourceDetailsPage();
        await expect(healthTestData.azureComputeSearchText).toEqual(Object.values(overviewDetails)[healthTestData.oneIndex]);
        await util.clickOnTabButton(healthTestData.performanceLinkText);
        await expect(util.isSelectedTabButton(healthTestData.performanceLinkText)).toEqual(true);
        await expect(healthObj.kpiValuesTitle()).toEqual(healthTestData.kpiValues);
		await util.clickOnTabButton(healthTestData.performanceLinkText);
		await expect(healthObj.clickOnUtilization()).toEqual(true);
		await healthObj.performanceUtilizationSelectFilterByOption(healthTestData.azureMonitor);
	});

    it('Verify in Application Tab, Top Insights Subsection "Least available applications" name and count are matching with ES Query Result and applications are clickable', async function(){
        expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
    	expect(healthObj.isTitleTextFromSectionPresent(healthTestData.topInsightsLabelText)).toBe(true);
    	expect(healthObj.verifyTopInsightsSubSectionLabelText(healthTestData.leastAvailableAppLabelText)).toEqual(true);
    	var leastAvailableApplicationsDetailsFromUI = await healthObj.getTopInsightsSubSectionDetails(healthTestData.leastAvailableAppLabelText);
        if(isEnabledESValidation) {
            var leastAvailableApplicationsDetailsFromES = await esQueriesHealth.topInsightsLeastMostApplications(healthTestData.esTotalIndividualApplicationsSearchIndex,tenantId,healthTestData.leastAvailableAppLabelText,
	            healthTestData.criticalAlertName);
	        await expect(leastAvailableApplicationsDetailsFromUI).toEqual(leastAvailableApplicationsDetailsFromES);
	    }
	    var selectedOption = await healthObj.clickAndGetTextFromTopInsightsSubSection(healthTestData.leastAvailableAppLabelText);
	    var detailPageTitle = await healthObj.getNameFromAppResourceDetailsPage();
        //Verify the title in overview page is matching with application that is clicked
        await expect(selectedOption.toString()).toEqual(detailPageTitle);
    });

    it('Verify in Application Tab, Top Insights Subsection "Most available applications" name and count are matching with ES Query Result and applications are clickable', async function(){
        expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
    	expect(healthObj.isTitleTextFromSectionPresent(healthTestData.topInsightsLabelText)).toBe(true);
    	expect(healthObj.verifyTopInsightsSubSectionLabelText(healthTestData.mostAvailableAppLabelText)).toEqual(true);
    	var mostAvailableApplicationsDetailsFromUI = await healthObj.getTopInsightsSubSectionDetails(healthTestData.mostAvailableAppLabelText);
        if(isEnabledESValidation) {
            var mostAvailableApplicationsDetailsFromES = await esQueriesHealth.topInsightsLeastMostApplications(healthTestData.esTotalIndividualApplicationsSearchIndex,tenantId,
	                    healthTestData.mostAvailableAppLabelText, healthTestData.healthyAlertName);
	        await expect(mostAvailableApplicationsDetailsFromUI).toEqual(mostAvailableApplicationsDetailsFromES);
	    }
	    var selectedOption = await healthObj.clickAndGetTextFromTopInsightsSubSection(healthTestData.mostAvailableAppLabelText);
	    var detailPageTitle = await healthObj.getNameFromAppResourceDetailsPage();
        //Verify the title in overview page is matching with application that is clicked
        await expect(selectedOption.toString()).toEqual(detailPageTitle);
    });

    it('Verify in Application Tab, Top Insights Subsection "Application with most incidents" name and count are matching with ES Query Result and applications are clickable', async function(){
        expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
    	expect(healthObj.isTitleTextFromSectionPresent(healthTestData.topInsightsLabelText)).toBe(true);
    	expect(healthObj.verifyTopInsightsSubSectionLabelText(healthTestData.appsWithMostIncidentsLabelText)).toEqual(true);
    	util.waitOnlyForInvisibilityOfTopInsightsLoader(healthTestData.appTopInsightsMostIncidents);
    	var mostIncidentsApplicationsDetailsFromUI = await healthObj.getTopInsightsSubSectionDetails(healthTestData.appsWithMostIncidentsLabelText);
        if(isEnabledESValidation) {
            var mostIncidentsApplicationsDetailsFromES = await esQueriesHealth.topInsightsMostIncidentsApplications(healthTestData.esIncidentsSearchIndex,
                                                               tenantId, healthTestData.appsWithMostIncidentsLabelText);
	        await expect(mostIncidentsApplicationsDetailsFromUI).toEqual(mostIncidentsApplicationsDetailsFromES);
	    }
	    var selectedOption = await healthObj.clickAndGetTextFromTopInsightsSubSection(healthTestData.appsWithMostIncidentsLabelText);
	    var detailPageTitle = await healthObj.getNameFromAppResourceDetailsPage();
        //Verify the title in overview page is matching with application that is clicked
        await expect(selectedOption.toString()).toEqual(detailPageTitle);
    });

    it('Verify in Application Tab, Top Insights Subsection "Application with most high priority incidents" name and count are matching with ES Query Result and applications are clickable', async function(){
        expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
    	expect(healthObj.isTitleTextFromSectionPresent(healthTestData.topInsightsLabelText)).toBe(true);
    	expect(healthObj.verifyTopInsightsSubSectionLabelText(healthTestData.appWithMostHighPriorityIncidentsLabelText)).toEqual(true);
    	var mostHighPriorityIncidentsApplicationsDetailsFromUI = await healthObj.getTopInsightsSubSectionDetails(healthTestData.appWithMostHighPriorityIncidentsLabelText);
        if(isEnabledESValidation) {
            var mostHighPriorityIncidentsApplicationsDetailsFromES = await esQueriesHealth.topInsightsMostHighPriorityIncidentsApplications(healthTestData.esIncidentsSearchIndex,
                                                               tenantId, healthTestData.appWithMostHighPriorityIncidentsLabelText);
	        await expect(mostHighPriorityIncidentsApplicationsDetailsFromUI).toEqual(mostHighPriorityIncidentsApplicationsDetailsFromES);
	    }
	    var selectedOption = await healthObj.clickAndGetTextFromTopInsightsSubSection(healthTestData.appWithMostHighPriorityIncidentsLabelText);
	    var detailPageTitle = await healthObj.getNameFromAppResourceDetailsPage();
        //Verify the title in overview page is matching with application that is clicked
        await expect(selectedOption.toString()).toEqual(detailPageTitle);
    });

    it('Verify in Resources Tab, Top Insights Subsection "Resources with maximum CPU utilization" name and count are matching with ES Query Result and resources are clickable', async function(){
        await util.clickOnTabButton(healthTestData.resourcesButtonName);
        expect(util.isSelectedTabButton(healthTestData.resourcesButtonName)).toEqual(true);
    	expect(healthObj.isTitleTextFromSectionPresent(healthTestData.topInsightsLabelText)).toBe(true);
    	expect(healthObj.verifyTopInsightsSubSectionLabelText(healthTestData.resourcesWithMaxCPUUtilizationLabelText)).toEqual(true);
    	var maxCpuUtilizationResourcesDetailsFromUI = await healthObj.getTopInsightsSubSectionDetails(healthTestData.resourcesWithMaxCPUUtilizationLabelText);
	    var selectedOption = await healthObj.clickAndGetTextFromTopInsightsSubSection(healthTestData.resourcesWithMaxCPUUtilizationLabelText);
	    var detailPageTitle = await healthObj.getNameFromAppResourceDetailsPage();
        //Verify the title in overview page is matching with application that is clicked
        await expect(selectedOption.toString()).toEqual(detailPageTitle);
    });

    it('Verify in Resources Tab, Top Insights Subsection "Resources with most incidents" name and count are matching with ES Query Result and resources are clickable', async function(){
        await util.clickOnTabButton(healthTestData.resourcesButtonName);
        expect(util.isSelectedTabButton(healthTestData.resourcesButtonName)).toEqual(true);
    	expect(healthObj.isTitleTextFromSectionPresent(healthTestData.topInsightsLabelText)).toBe(true);
    	expect(healthObj.verifyTopInsightsSubSectionLabelText(healthTestData.resourcesWithMostIncidentsLabelText)).toEqual(true);
    	var mostIncidentsResourcesDetailsFromUI = await healthObj.getTopInsightsSubSectionDetails(healthTestData.resourcesWithMostIncidentsLabelText);
        if(isEnabledESValidation) {
            var mostIncidentsResourcesDetailsFromES = await esQueriesHealth.topInsightsMostIncidentsResources(healthTestData.esIncidentsSearchIndex,
                                                               tenantId, healthTestData.resourcesWithMostIncidentsLabelText);
	        await expect(mostIncidentsResourcesDetailsFromUI).toEqual(mostIncidentsResourcesDetailsFromES);
	    }
	    var selectedOption = await healthObj.clickAndGetTextFromTopInsightsSubSection(healthTestData.resourcesWithMostIncidentsLabelText);
	    var detailPageTitle = await healthObj.getNameFromAppResourceDetailsPage();
        //Verify the title in overview page is matching with application that is clicked
        await expect(selectedOption.toString()).toEqual(detailPageTitle);
    });

    it('Verify in Resources Tab, Top Insights Subsection "Resources with most least availability" name and count are matching with ES Query Result and resources are clickable', async function(){
         await util.clickOnTabButton(healthTestData.resourcesButtonName);
        expect(util.isSelectedTabButton(healthTestData.resourcesButtonName)).toEqual(true);
    	expect(healthObj.isTitleTextFromSectionPresent(healthTestData.topInsightsLabelText)).toBe(true);
    	expect(healthObj.verifyTopInsightsSubSectionLabelText(healthTestData.resourcesWithLeastAvailabilityLabelText)).toEqual(true);
    	var leastAvailabilityResourcesDetailsFromUI = await healthObj.getTopInsightsSubSectionDetails(healthTestData.resourcesWithLeastAvailabilityLabelText);
        if(isEnabledESValidation) {
            var leastAvailabilityResourcesDetailsFromES = await esQueriesHealth.topInsightsLeastAvailabilityResources(healthTestData.esTotalIndividualApplicationsSearchIndex,
                                                               tenantId, healthTestData.resourcesWithLeastAvailabilityLabelText, healthTestData.criticalAlertName);
	        await expect(leastAvailabilityResourcesDetailsFromUI).toEqual(leastAvailabilityResourcesDetailsFromES);
	    }
	    var selectedOption = await healthObj.clickAndGetTextFromTopInsightsSubSection(healthTestData.resourcesWithLeastAvailabilityLabelText);
	    var detailPageTitle = await healthObj.getNameFromAppResourceDetailsPage();
        //Verify the title in overview page is matching with application that is clicked
        await expect(selectedOption.toString()).toEqual(detailPageTitle);
    });

    it('Verify on Resources Tab, Health status (Critical, Warning and Healthy) count is matching with ElasticSearch Result', async function(){
	    expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
	    await util.clickOnTabButton(healthTestData.resourcesButtonName);
	    expect(util.isSelectedTabButton(healthTestData.resourcesButtonName)).toEqual(true);
	    await expect(healthObj.getHealthStatusSectionLabelText()).toEqual(healthTestData.healthStatusLabelText);
	    var healthStatusData = await healthObj.getHealthStatusSectionTextAndCount();
	    await expect(healthObj.getSelectedTypeCountFromDonutChart()).toEqual(healthObj.getApplicationsResourcesSectionLabelCountFromHealthAndCommandCenter(healthTestData.resourcesButtonName));
	    if(isEnabledESValidation) {
	        var esResourcesTabHealthStatusResponse = await esQueriesHealth.resources_health_status_count(healthTestData.esHealthSearchIndex,tenantId);
            var healthStatusEsResponse = await healthObj.getHealthStatusDataFromES(esResourcesTabHealthStatusResponse);
            await expect(healthStatusData.healthStatusLabelAndCount).toEqual(healthStatusEsResponse);
	    }
	});

	it('Verify on Applications Tab, Health status (Critical, Warning and Healthy) count is matching with ElasticSearch Result', async function(){
    	expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
    	await expect(healthObj.getHealthStatusSectionLabelText()).toEqual(healthTestData.healthStatusLabelText);
    	var healthStatusData = await healthObj.getHealthStatusSectionTextAndCount();
    	await expect(healthObj.getSelectedTypeCountFromDonutChart()).toEqual(healthObj.getApplicationsResourcesSectionLabelCountFromHealthAndCommandCenter(healthTestData.applicationsButtonName));
    	if(isEnabledESValidation) {
            var esApplicationsTabHealthStatusResponse = await esQueriesHealth.applications_health_status_count(healthTestData.esHealthSearchIndex,tenantId);
    	    var healthStatusEsResponse = await healthObj.getHealthStatusDataFromES(esApplicationsTabHealthStatusResponse);
            await expect(healthStatusData.healthStatusLabelAndCount).toEqual(healthStatusEsResponse);
    	}
    });

    it("Verify on Applications Tab, Applications list view total count of 'Critical' health status is matching with ElasticSearch Result and with total items count per page", async function(){
    	expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
        util.waitOnlyForInvisibilityOfCarbonDataLoader();
	    await expect(healthObj.getHealthStatusSectionLabelText()).toEqual(healthTestData.healthStatusLabelText);
	    var healthStatus = await healthObj.clickOnHealthStatusOption(healthTestData.resourceCriticalText);
	    var criticalApplicationsCountFromUI = await healthObj.getAppRescTotalCountBaseOnSelectedColumnValue(healthStatus, healthTestData.applicationsButtonName,
	            healthTestData.resourceTableHeaders[healthTestData.twoIndex]);
	    await expect(criticalApplicationsCountFromUI.listCount).toEqual(criticalApplicationsCountFromUI.totalRecordsCount);
	    if(isEnabledESValidation) {
            var criticalApplicationsCountESResponse = await esQueriesHealth.applicationsListViewCountAndName(healthTestData.esHealthSearchIndex,
	                                                                    tenantId, healthStatus);
            expect(criticalApplicationsCountFromUI.listCount).toEqual(criticalApplicationsCountESResponse);
	    }
    });

    it("Verify on Applications Tab, Applications list view total count of 'Healthy' health status is matching with ElasticSearch Result and with total items count per page", async function(){
    	expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
        util.waitOnlyForInvisibilityOfCarbonDataLoader();
	    await expect(healthObj.getHealthStatusSectionLabelText()).toEqual(healthTestData.healthStatusLabelText);
	    var healthStatus = await healthObj.clickOnHealthStatusOption(healthTestData.resourceHealthyText);
		var healthyApplicationsCountFromUI = await healthObj.getAppRescTotalCountBaseOnSelectedColumnValue(healthStatus, healthTestData.applicationsButtonName,
                                                             	            healthTestData.resourceTableHeaders[healthTestData.twoIndex])
	    await expect(healthyApplicationsCountFromUI.listCount).toEqual(healthyApplicationsCountFromUI.totalRecordsCount);
	    if(isEnabledESValidation) {
            var healthyApplicationsCountESResponse = await esQueriesHealth.applicationsListViewCountAndName(healthTestData.esHealthSearchIndex,
	                                                                    tenantId, healthStatus);
            expect(healthyApplicationsCountFromUI.listCount).toEqual(healthyApplicationsCountESResponse);
	    }
    });

    it("Verify on Applications Tab, Applications list view total count of 'Warning' health status is matching with ElasticSearch Result and with total items count per page", async function(){
    	expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
        util.waitOnlyForInvisibilityOfCarbonDataLoader();
	    await expect(healthObj.getHealthStatusSectionLabelText()).toEqual(healthTestData.healthStatusLabelText);
	    var healthStatus = await healthObj.clickOnHealthStatusOption(healthTestData.resourceWarningText);
	    var warningApplicationsCountFromUI = await healthObj.getAppRescTotalCountBaseOnSelectedColumnValue(healthStatus, healthTestData.applicationsButtonName,
                                                             	            healthTestData.resourceTableHeaders[healthTestData.twoIndex])
	    await expect(warningApplicationsCountFromUI.listCount).toEqual(warningApplicationsCountFromUI.totalRecordsCount);
	    if(isEnabledESValidation) {
            var warningApplicationsCountESResponse = await esQueriesHealth.applicationsListViewCountAndName(healthTestData.esHealthSearchIndex,
	                                                                    tenantId, healthStatus);
            expect(warningApplicationsCountFromUI.listCount).toEqual(warningApplicationsCountESResponse);
	    }
    });

    it("Verify on Resources Tab, Resources list view total count of 'Critical' health status is matching with ElasticSearch Result and with total items count per page", async function(){
	    expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
	    await util.clickOnTabButton(healthTestData.resourcesButtonName);
	    expect(util.isSelectedTabButton(healthTestData.resourcesButtonName)).toEqual(true);
	    util.waitOnlyForInvisibilityOfCarbonDataLoader();
	    await expect(healthObj.getHealthStatusSectionLabelText()).toEqual(healthTestData.healthStatusLabelText);
	    var healthStatus = await healthObj.clickOnHealthStatusOption(healthTestData.resourceCriticalText);
	    var criticalResourcesCountFromUI = await healthObj.getAppRescTotalCountBaseOnSelectedColumnValue(healthStatus, healthTestData.resourcesButtonName,
                                                           	            healthTestData.resourceTableHeaders[healthTestData.twoIndex])
	    await expect(criticalResourcesCountFromUI.listCount).toEqual(criticalResourcesCountFromUI.totalRecordsCount);
	    if(isEnabledESValidation) {
            var criticalResourceCountESResponse = await esQueriesHealth.resourceTotalCountBasedOnHealthStatus(healthTestData.esHealthSearchIndex,
	                                                                    tenantId, healthStatus, healthTestData.esSourceType);
            expect(criticalResourcesCountFromUI.listCount).toEqual(criticalResourceCountESResponse.totalCount);
	    }
	});

    it("Verify on Resources Tab, Resources list view total count of 'Healthy' health status is matching with ElasticSearch Result and with Total items count per page", async function(){
	    expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
	    await util.clickOnTabButton(healthTestData.resourcesButtonName);
	    expect(util.isSelectedTabButton(healthTestData.resourcesButtonName)).toEqual(true);
	    util.waitOnlyForInvisibilityOfCarbonDataLoader();
	    await expect(healthObj.getHealthStatusSectionLabelText()).toEqual(healthTestData.healthStatusLabelText);
	    var healthStatus = await healthObj.clickOnHealthStatusOption(healthTestData.resourceHealthyText);
	    var healthyResourcesCountFromUI = await healthObj.getAppRescTotalCountBaseOnSelectedColumnValue(healthStatus, healthTestData.resourcesButtonName,
                                                          	            healthTestData.resourceTableHeaders[healthTestData.twoIndex])
	    await expect(healthyResourcesCountFromUI.listCount).toEqual(healthyResourcesCountFromUI.totalRecordsCount);
	    if(isEnabledESValidation) {
            var healthyResourceCountESResponse = await esQueriesHealth.resourceTotalCountBasedOnHealthStatus(healthTestData.esHealthSearchIndex,
            	                                                                    tenantId, healthStatus, healthTestData.esSourceType);
            expect(healthyResourcesCountFromUI.listCount).toEqual(healthyResourceCountESResponse.totalCount);
	    }
	});

    it("Verify on Resources Tab, Resources list view total count of 'Warning' health status is matching with ElasticSearch Result and with Total items count per page", async function(){
	    expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
	    await util.clickOnTabButton(healthTestData.resourcesButtonName);
	    expect(util.isSelectedTabButton(healthTestData.resourcesButtonName)).toEqual(true);
	    util.waitOnlyForInvisibilityOfCarbonDataLoader();
	    await expect(healthObj.getHealthStatusSectionLabelText()).toEqual(healthTestData.healthStatusLabelText);
	    var healthStatus = await healthObj.clickOnHealthStatusOption(healthTestData.resourceWarningText);
	    var warningResourcesCountFromUI = await healthObj.getAppRescTotalCountBaseOnSelectedColumnValue(healthStatus, healthTestData.resourcesButtonName,
                                                          	            healthTestData.resourceTableHeaders[healthTestData.twoIndex])
	    await expect(warningResourcesCountFromUI.listCount).toEqual(warningResourcesCountFromUI.totalRecordsCount);
	    if(isEnabledESValidation) {
            var warningResourceCountESResponse = await esQueriesHealth.resourceTotalCountBasedOnHealthStatus(healthTestData.esHealthSearchIndex,
            	                                                                    tenantId, healthStatus, healthTestData.esSourceType);
            expect(warningResourcesCountFromUI.listCount).toEqual(warningResourceCountESResponse.totalCount);
	    }
	});

    it("Verify on Applications Tab, Application Breakdown widget stackBar count of 'Critical' health status is matching with ElasticSearch Result", async function(){
	    expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
	    util.waitOnlyForInvisibilityOfCarbonDataLoader();
	    await expect(healthObj.getHealthStatusSectionLabelText()).toEqual(healthTestData.healthStatusLabelText);
	    var healthStatus = await healthObj.clickOnHealthStatusOption(healthTestData.resourceCriticalText);
	    expect(healthObj.getHealthBreakdownSectionLabelText()).toEqual(healthTestData.applicationBreakdownLabelText);
	    var applicationBreakdownUIResponse = await healthObj.getBreakdownDetailsBasedOnHealthStatus(healthStatus);
	});

    it("Verify on Applications Tab, Application Breakdown widget stackBar count of 'Healthy' health status is matching with ElasticSearch Result", async function(){
	    expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
	    util.waitOnlyForInvisibilityOfCarbonDataLoader();
	    await expect(healthObj.getHealthStatusSectionLabelText()).toEqual(healthTestData.healthStatusLabelText);
	    var healthStatus = await healthObj.clickOnHealthStatusOption(healthTestData.resourceHealthyText);
	    expect(healthObj.getHealthBreakdownSectionLabelText()).toEqual(healthTestData.applicationBreakdownLabelText);
	    var applicationBreakdownUIResponse = await healthObj.getBreakdownDetailsBasedOnHealthStatus(healthStatus);
	});

    it("Verify on Applications Tab, Application Breakdown widget stackBar count of 'Warning' health status is matching with ElasticSearch Result", async function(){
	    expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
	    util.waitOnlyForInvisibilityOfCarbonDataLoader();
	    await expect(healthObj.getHealthStatusSectionLabelText()).toEqual(healthTestData.healthStatusLabelText);
	    var healthStatus = await healthObj.clickOnHealthStatusOption(healthTestData.resourceWarningText);
	    expect(healthObj.getHealthBreakdownSectionLabelText()).toEqual(healthTestData.applicationBreakdownLabelText);
	    var applicationsBreakdownUIResponse = await healthObj.getBreakdownDetailsBasedOnHealthStatus(healthStatus);
    });

    it("Verify on Resources Tab, Resource Breakdown widget stackBar count of 'Critical' health status is matching with ElasticSearch Result", async function(){
	    expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
	    await util.clickOnTabButton(healthTestData.resourcesButtonName);
	    expect(util.isSelectedTabButton(healthTestData.resourcesButtonName)).toEqual(true);
	    util.waitOnlyForInvisibilityOfCarbonDataLoader();
	    await expect(healthObj.getHealthStatusSectionLabelText()).toEqual(healthTestData.healthStatusLabelText);
	    var healthStatus = await healthObj.clickOnHealthStatusOption(healthTestData.resourceCriticalText);
	    expect(healthObj.getHealthBreakdownSectionLabelText()).toEqual(healthTestData.resourceBreakdownLabelText);
	    var resourceBreakdownUIResponse = await healthObj.getBreakdownDetailsBasedOnHealthStatus(healthTestData.resourceCriticalText);
	    if(isEnabledESValidation) {
            var resourceBreakdownEsResponse = await esQueriesHealth.health_resource_breakdown(healthTestData.esHealthSearchIndex,tenantId, healthStatus);
	        expect(resourceBreakdownUIResponse).toEqual(resourceBreakdownEsResponse);
	    }
	});

    it("Verify on Resources Tab, Resource Breakdown widget stackBar count of 'Healthy' health status is matching with ElasticSearch Result", async function(){
	    expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
	    await util.clickOnTabButton(healthTestData.resourcesButtonName);
	    expect(util.isSelectedTabButton(healthTestData.resourcesButtonName)).toEqual(true);
	    util.waitOnlyForInvisibilityOfCarbonDataLoader();
	    await expect(healthObj.getHealthStatusSectionLabelText()).toEqual(healthTestData.healthStatusLabelText);
	    var healthStatus = await healthObj.clickOnHealthStatusOption(healthTestData.resourceHealthyText);
	    expect(healthObj.getHealthBreakdownSectionLabelText()).toEqual(healthTestData.resourceBreakdownLabelText);
	    var resourceBreakdownUIResponse = await healthObj.getBreakdownDetailsBasedOnHealthStatus(healthStatus);
	    if(isEnabledESValidation) {
            await esQueriesHealth.health_resource_breakdown(healthTestData.esHealthSearchIndex,tenantId, healthStatus);
	    }
	});

    it("Verify on Resources Tab, Resource Breakdown widget stackBar count of 'Warning' health status is matching with ElasticSearch Result", async function(){
	    expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
	    await util.clickOnTabButton(healthTestData.resourcesButtonName);
	    expect(util.isSelectedTabButton(healthTestData.resourcesButtonName)).toEqual(true);
	    util.waitOnlyForInvisibilityOfCarbonDataLoader();
	    await expect(healthObj.getHealthStatusSectionLabelText()).toEqual(healthTestData.healthStatusLabelText);
	    var healthStatus = await healthObj.clickOnHealthStatusOption(healthTestData.resourceWarningText);
	    expect(healthObj.getHealthBreakdownSectionLabelText()).toEqual(healthTestData.resourceBreakdownLabelText);
	    var resourceBreakdownUIResponse = await healthObj.getBreakdownDetailsBasedOnHealthStatus(healthStatus);
	    if(isEnabledESValidation) {
            var resourceBreakdownEsResponse = await esQueriesHealth.health_resource_breakdown(healthTestData.esHealthSearchIndex,tenantId, healthStatus);
	        expect(resourceBreakdownUIResponse).toEqual(resourceBreakdownEsResponse);
	    }
	});

    it('Verify if all elements within Global filter loaded or not in Health Applications Tab', async function(){
		expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
		util.waitOnlyForInvisibilityOfCarbonDataLoader();
		await expect(inventory_page.isGlobalFilterDisplayed()).toEqual(true);
		var globalFilterMainCategories = await healthObj.isGlobalFilterMainCategoriesTitlePresent(healthTestData.globalFilterMainCategories);
		await expect(globalFilterMainCategories).toEqual(healthTestData.globalFilterMainCategories);
		await expect(inventory_page.isPresentglobalFilterProviderSubCategories(healthTestData.globalFilterProviderSubCategories)).toBe(true);
		await expect(inventory_page.isPresentglobalFilterProviders()).toBe(true);
		await expect(healthObj.isPresentGlobalFilterTeamAppCategories()).toBe(true);
		await healthAndInventoryUtil.clickOnProviderCheckBox(healthTestData.awsProvider);
		await healthAndInventoryUtil.clickOnApplyFilterButton();
		util.waitOnlyForInvisibilityOfCarbonDataLoader();
		await healthObj.resetGlobalFilters();
	});

	it("To verify globalFilter add filter functionality, to check for duplicate filter and error message,newly added filter and check data reflects once the user clicks apply filters ", async function(){
		expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
        util.waitOnlyForInvisibilityOfCarbonDataLoader();
        await expect(inventory_page.isGlobalFilterDisplayed()).toEqual(true);
		var applicationsList = await healthObj.getOptionsListBasedOnSectionNameInGlobalFilter(healthTestData.applicationsLabelText);
		await healthObj.clickOnCheckBox(applicationsList.optionsList[healthTestData.zeroIndex]);
		await expect(healthObj.isSelectFilterDisplayed()).toEqual(true);
		var savedFilterName = await healthObj.addFilter(healthTestData.filterNameToAdd);
		await expect(savedFilterName.filterNameToAdd[healthTestData.threeIndex]).toEqual(healthTestData.filterNameToAdd[healthTestData.threeIndex]);
		await healthAndInventoryUtil.clickOnApplyFilterButton();
		util.waitOnlyForInvisibilityOfCarbonDataLoader();
		await expect(healthObj.verifyCellValueFromTicketsTable(healthTestData.OverviewApplicationColName, applicationsList[healthTestData.zeroIndex])).toEqual(true);
		await util.clickOnTabButton(healthTestData.resourcesButtonName);
        expect(util.isSelectedTabButton(healthTestData.resourcesButtonName)).toEqual(true);
		util.waitOnlyForInvisibilityOfCarbonDataLoader();
		await expect(healthObj.verifyCellValueFromTicketsTable(healthTestData.OverviewApplicationColName, applicationsList[healthTestData.zeroIndex])).toEqual(true);
	});

	it("To verify the error message while adding filter name if blank name, min char length, name with special char", async function(){
		var applicationsList = await healthObj.getOptionsListBasedOnSectionNameInGlobalFilter(healthTestData.applicationsLabelText);
		await healthObj.clickOnCheckBox(applicationsList.optionsList[healthTestData.zeroIndex]);
		await expect(healthObj.isSelectFilterDisplayed()).toEqual(true);
		var savedFilterName = await healthObj.addFilter(healthTestData.filterNameToAdd);
		await expect(savedFilterName.filterNameToAdd[healthTestData.threeIndex]).toEqual(healthTestData.filterNameToAdd[healthTestData.threeIndex]);
		await healthObj.deleteFilter(healthTestData.globalFilterSaveOptions[healthTestData.twoIndex]);
	});

    it("Verify in Applications Tab, user is able to save existing single filter to save as new filter and able to Delete only selected saved filter. Data should revert back to original after delete filter", async function(){
        expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
        var heathStatusDataBeforeApplySaveAndDeleteFilter = await healthObj.getHealthStatusSectionTextAndCount();
		await healthAndInventoryUtil.clickOnProviderCheckBox(healthTestData.awsProvider);
		var teamList = await healthObj.getOptionsListBasedOnSectionNameInGlobalFilter(healthTestData.globalFilterMainCategories[healthTestData.oneIndex]);
		expect(await healthObj.clickOnCheckBox(teamList.optionsList[healthTestData.zeroIndex])).toEqual(true);
		await expect(healthObj.isSelectFilterDisplayed()).toEqual(true);
		var savedFilter = await healthObj.saveAsNewFilter(healthTestData.oneIndex, healthTestData.globalFilterSaveOptions[healthTestData.zeroIndex]);
		await expect(healthObj.getSavedFilterListFromGlobalFilter()).toEqual(jasmine.arrayContaining(savedFilter.addFilterNameList));
		await expect(healthObj.isGlobalFilterApplyButtonEnabled()).toEqual(true);
		await healthAndInventoryUtil.clickOnApplyFilterButton();
		util.waitOnlyForInvisibilityOfCarbonDataLoader();
		var heathStatusDataAfterApplySaveFilter = await healthObj.getHealthStatusSectionTextAndCount();
		expect(heathStatusDataBeforeApplySaveAndDeleteFilter).not.toEqual(heathStatusDataAfterApplySaveFilter);
		await expect(healthObj.verifyCellValueFromTicketsTable(healthTestData.OverviewApplicationColName, healthTestData.awsProvider)).toEqual(true);
		await expect(healthObj.verifyCellValueFromTicketsTable(healthTestData.OverviewApplicationColName, teamList.optionsList[healthTestData.zeroIndex])).toEqual(true);
        var deletedFilterName = await healthObj.deleteFilter(healthTestData.globalFilterSaveOptions[healthTestData.twoIndex]);
        await expect(healthObj.getSavedFilterListFromGlobalFilter()).not.toContain(deletedFilterName.toString());
        util.waitOnlyForInvisibilityOfCarbonDataLoader();
        var heathStatusDataAfterDeleteFilter = await healthObj.getHealthStatusSectionTextAndCount();
        expect(heathStatusDataBeforeApplySaveAndDeleteFilter).toEqual(heathStatusDataAfterDeleteFilter);
	});	
	
	it("To verify that user can reset any filters selected when user makes selection in the filters ", async function(){
		// To check reset link is disabled without selecting any filter
		await expect(healthObj.isGlobalFilterResetLinkEnabled()).toBe(false);
    	var applicationsList = await healthObj.globalFilterSectionsMorePopupSelection(healthTestData.applicationsLabelText);
        // Select Applications option
        await healthObj.clickOnMorePopupOptions(applicationsList.optionsList[healthTestData.zeroIndex]);
        await healthObj.closeMorePopup();
		await expect(healthObj.isSelectFilterDisplayed()).toEqual(true);
		await healthObj.addFilter(healthTestData.filterNameToAdd);
		//To check reset link is enabled after selecting any filter
		await expect(healthObj.isGlobalFilterResetLinkEnabled()).toBe(true);
		await expect(healthObj.resetGlobalFilters()).toBe(true);
		//To check reset link is disabled after clicked on apply filter
		await expect(healthObj.isGlobalFilterResetLinkEnabled()).toBe(false);

		var providers = await healthObj.getGlobalFilterMcDcProvidersList();
		await healthAndInventoryUtil.clickOnProviderCheckBox(providers.mcProviders[healthTestData.zeroIndex]);
		await expect(healthObj.isGlobalFilterResetLinkEnabled()).toBe(true);
		await expect(healthObj.resetGlobalFilters()).toBe(true);
		//To check reset link is disabled after clicked on reset filter
		await expect(healthObj.isGlobalFilterResetLinkEnabled()).toBe(false);
	});	

	it("To verify that reset action will reset the widgets only if a selection is made on the widget after applying the filter.", async function(){
		util.waitOnlyForInvisibilityOfCarbonDataLoader();
		await expect(healthObj.isGlobalFilterResetLinkEnabled()).toBe(false);
		await healthObj.clickOnHealthStatusOption(healthTestData.resourceCriticalText);
		await expect(healthObj.isGlobalFilterResetLinkEnabled()).toBe(false);

		await healthObj.clickOnAppResBreakdownBasedOnStackBarIndex(healthTestData.environment, healthTestData.zeroIndex);
		await expect(healthObj.isGlobalFilterResetLinkEnabled()).toBe(false);
		var applicationsList = await inventory_page.getglobalFilterApplicationList();
		expect(await healthObj.clickOnCheckBox(applicationsList[healthTestData.zeroIndex])).toEqual(true);
		await expect(healthObj.isGlobalFilterResetLinkEnabled()).toBe(true);
		await healthAndInventoryUtil.clickOnApplyFilterButton();
		util.waitOnlyForInvisibilityOfCarbonDataLoader();
		var applicationCountBeforeReset = healthObj.getApplicationsResourcesSectionLabelCountFromHealthAndCommandCenter(healthTestData.applicationsButtonName);
		var applicationHealthStatusCountBeforeReset = healthObj.getSelectedTypeCountFromDonutChart();
		await healthObj.resetGlobalFilters();
		await expect(healthObj.isGlobalFilterResetLinkEnabled()).toBe(false);
		util.waitOnlyForInvisibilityOfCarbonDataLoader();
		var applicationCountAfterReset = healthObj.getApplicationsResourcesSectionLabelCountFromHealthAndCommandCenter(healthTestData.applicationsButtonName);
		var applicationHealthStatusCountAfterReset = healthObj.getSelectedTypeCountFromDonutChart()
		await expect(applicationCountBeforeReset).not.toEqual(applicationCountAfterReset);
		await expect(applicationHealthStatusCountBeforeReset).not.toEqual(applicationHealthStatusCountAfterReset);
	});

    it("Verify in Applications Tab Global filter Panel, user should be able to save maximum 5 filters to save as new filters. Verify save filter limit exceed message and Delete only selected saved filter. Data should revert back to original after delete filter", async function(){
        expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
        var heathStatusDataBeforeApplySaveAndDeleteFilter = await healthObj.getHealthStatusSectionTextAndCount();
        // Select IBM DC provider
		await healthAndInventoryUtil.clickOnProviderCheckBox(healthTestData.ibmDCProviderFilterText);
		// Select Application Categories option
		var appCategoriesList = await healthObj.globalFilterSectionsMorePopupSelection(healthTestData.globalFilterMainCategories[healthTestData.twoIndex]);
		await healthObj.clickOnMorePopupOptions(appCategoriesList.optionsList[healthTestData.zeroIndex]);
        await healthObj.closeMorePopup();
        // Select Applications option
		var applicationsList = await healthObj.globalFilterSectionsMorePopupSelection(healthTestData.applicationsLabelText);
        await healthObj.clickOnMorePopupOptions(applicationsList.optionsList[healthTestData.zeroIndex]);
        await healthObj.closeMorePopup();
		await expect(healthObj.isSelectFilterDisplayed()).toEqual(true);
		var savedFilter = await healthObj.saveAsNewFilter(healthTestData.sixIndex, healthTestData.globalFilterSaveOptions[healthTestData.zeroIndex]);
		await expect(healthObj.getSavedFilterListFromGlobalFilter()).toEqual(jasmine.arrayContaining(savedFilter.addFilterNameList));
		await expect(savedFilter.filterCountExceedMessage).toEqual(healthTestData.filterExceedsErrMessage);
		await expect(healthObj.isGlobalFilterApplyButtonEnabled()).toEqual(true);
		await healthAndInventoryUtil.clickOnApplyFilterButton();
		util.waitOnlyForInvisibilityOfCarbonDataLoader();
		var heathStatusDataAfterApplySaveFilter = await healthObj.getHealthStatusSectionTextAndCount();
		expect(heathStatusDataBeforeApplySaveAndDeleteFilter).not.toEqual(heathStatusDataAfterApplySaveFilter);
		await expect(healthObj.verifyCellValueFromTicketsTable(healthTestData.OverviewApplicationColName, healthTestData.ibmDCProviderFilterText)).toEqual(true);
		var deletedFilterName = await healthObj.deleteFilter(healthTestData.globalFilterSaveOptions[healthTestData.twoIndex]);
        await expect(healthObj.getSavedFilterListFromGlobalFilter()).not.toContain(deletedFilterName.toString());
        util.waitOnlyForInvisibilityOfCarbonDataLoader();
        var heathStatusDataAfterDeleteFilter = await healthObj.getHealthStatusSectionTextAndCount();
        expect(heathStatusDataBeforeApplySaveAndDeleteFilter).toEqual(heathStatusDataAfterDeleteFilter);
	});

    it("Verify in Resources Tab, save existing single filter to 'save as new' filter and Delete only selected saved filter. Data should revert back to original after delete filter", async function(){
        await util.clickOnTabButton(healthTestData.resourcesButtonName);
        expect(util.isSelectedTabButton(healthTestData.resourcesButtonName)).toEqual(true);
        util.waitOnlyForInvisibilityOfCarbonDataLoader();
        var heathStatusDataBeforeApplySaveAndDeleteFilter = await healthObj.getHealthStatusSectionTextAndCount();
		await healthAndInventoryUtil.clickOnProviderCheckBox(healthTestData.azureProvider);
		var applicationsList = await healthObj.globalFilterSectionsMorePopupSelection(healthTestData.applicationsLabelText);
		await healthObj.clickOnMorePopupOptions(applicationsList.optionsList[healthTestData.zeroIndex]);
		await healthObj.clickOnMorePopupOptions(applicationsList.optionsList[applicationsList.optionsCount - healthTestData.oneIndex]);
		await healthObj.closeMorePopup();
		await expect(healthObj.isSelectFilterDisplayed()).toEqual(true);
		var savedFilter = await healthObj.saveAsNewFilter(healthTestData.oneIndex, healthTestData.globalFilterSaveOptions[healthTestData.zeroIndex]);
		await expect(healthObj.getSavedFilterListFromGlobalFilter()).toEqual(jasmine.arrayContaining(savedFilter.addFilterNameList));
		await expect(healthObj.isGlobalFilterApplyButtonEnabled()).toEqual(true);
		await healthAndInventoryUtil.clickOnApplyFilterButton();
		util.waitOnlyForInvisibilityOfCarbonDataLoader();
		var heathStatusDataAfterApplySaveFilter = await healthObj.getHealthStatusSectionTextAndCount();
		expect(heathStatusDataBeforeApplySaveAndDeleteFilter).not.toEqual(heathStatusDataAfterApplySaveFilter);
		var deletedFilterName = await healthObj.deleteFilter(healthTestData.globalFilterSaveOptions[healthTestData.twoIndex]);
        await expect(healthObj.getSavedFilterListFromGlobalFilter()).not.toContain(deletedFilterName.toString());
        util.waitOnlyForInvisibilityOfCarbonDataLoader();
        var heathStatusDataAfterDeleteFilter = await healthObj.getHealthStatusSectionTextAndCount();
        expect(heathStatusDataBeforeApplySaveAndDeleteFilter).toEqual(heathStatusDataAfterDeleteFilter);
	});

	it("Verify in Global filter 'Application Categories' section should be disabled When only Public cloud provider is selected even before clicking on Apply Filter button", async function(){
        expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
		util.waitOnlyForInvisibilityOfCarbonDataLoader();
		await expect(inventory_page.isGlobalFilterDisplayed()).toEqual(true);
		var globalFilterMainCategories = await healthObj.isGlobalFilterMainCategoriesTitlePresent(healthTestData.globalFilterMainCategories);
		await expect(globalFilterMainCategories).toEqual(healthTestData.globalFilterMainCategories);
		await expect(healthObj.resetGlobalFilters()).toEqual(false);
		// Global filter panel sections enable/disable status before selecting MC provider option
		await expect(healthObj.isGlobalFilterSelectedOptionTagPresent()).toEqual(false);
		var disabledStatusBeforeMCProviderSelection = await healthObj.getTeamAppCategoriesSectionDisabledStatus(healthTestData.globalFilterProviderSubCategories[healthTestData.zeroIndex]);
		expect(disabledStatusBeforeMCProviderSelection).toEqual(false);
		await expect(healthObj.isGlobalFilterApplyButtonEnabled()).toBe(false);
		// Global filter panel sections enable/disable status after selecting MC provider option
        var mcProviders = await healthObj.getGlobalFilterMcDcProvidersList();
		expect(mcProviders).not.toBe(null);
		await healthAndInventoryUtil.clickOnProviderCheckBox(mcProviders.mcProviders[healthTestData.zeroIndex]);
		await expect(healthObj.isGlobalFilterSelectedOptionTagPresent()).toEqual(true);
		var disabledStatusAfterMCProviderSelection = await healthObj.getTeamAppCategoriesSectionDisabledStatus(healthTestData.globalFilterProviderSubCategories[healthTestData.zeroIndex]);
        expect(disabledStatusAfterMCProviderSelection).toEqual(true);
        expect(disabledStatusBeforeMCProviderSelection).not.toEqual(disabledStatusAfterMCProviderSelection);
        await expect(healthObj.isGlobalFilterApplyButtonEnabled()).toBe(true);
	});

    it("Verify in Global filter 'Teams' section should be disabled When only DC provider is selected even before clicking on Apply Filter button", async function(){
        expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
		util.waitOnlyForInvisibilityOfCarbonDataLoader();
		await expect(inventory_page.isGlobalFilterDisplayed()).toEqual(true);
		var globalFilterMainCategories = await healthObj.isGlobalFilterMainCategoriesTitlePresent(healthTestData.globalFilterMainCategories);
		await expect(globalFilterMainCategories).toEqual(healthTestData.globalFilterMainCategories);
		// Global filter panel Team section enable/disable status before selecting DC provider option
		await expect(healthObj.isGlobalFilterSelectedOptionTagPresent()).toEqual(false);
		var disabledStatusBeforeDCProviderSelection = await healthObj.getTeamAppCategoriesSectionDisabledStatus(healthTestData.globalFilterProviderSubCategories[healthTestData.oneIndex]);
		expect(disabledStatusBeforeDCProviderSelection).toEqual(false);
		await expect(healthObj.isGlobalFilterApplyButtonEnabled()).toBe(false);
		// Global filter panel Team section enable/disable status after selecting DC provider option
		var dcProviders = await healthObj.getGlobalFilterMcDcProvidersList();
		expect(dcProviders).not.toBe(null);
		await healthAndInventoryUtil.clickOnProviderCheckBox(dcProviders.dcProviders[healthTestData.zeroIndex]);
		await expect(healthObj.isGlobalFilterSelectedOptionTagPresent()).toEqual(true);
		var disabledStatusAfterDCProviderSelection = await healthObj.getTeamAppCategoriesSectionDisabledStatus(healthTestData.globalFilterProviderSubCategories[healthTestData.oneIndex]);
        expect(disabledStatusAfterDCProviderSelection).toEqual(true);
        expect(disabledStatusBeforeDCProviderSelection).not.toEqual(disabledStatusAfterDCProviderSelection);
        await expect(healthObj.isGlobalFilterApplyButtonEnabled()).toBe(true);
	});

    it("Verify in Global filter 'Teams' and 'Application Categories' sections should be enabled on selecting both MC and DC providers even before clicking on Apply Filter button", async function(){
        expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
		util.waitOnlyForInvisibilityOfCarbonDataLoader();
		await expect(inventory_page.isGlobalFilterDisplayed()).toEqual(true);
		var globalFilterMainCategories = await healthObj.isGlobalFilterMainCategoriesTitlePresent(healthTestData.globalFilterMainCategories);
		await expect(globalFilterMainCategories).toEqual(healthTestData.globalFilterMainCategories);
		// Global filter panel Teams / App Categories sections enable/disable status before selecting MC and DC providers option
		await expect(healthObj.isGlobalFilterSelectedOptionTagPresent()).toEqual(false);
		var disabledStatusBeforeMCProviderSelection = await healthObj.getTeamAppCategoriesSectionDisabledStatus(healthTestData.globalFilterProviderSubCategories[healthTestData.zeroIndex]);
		var disabledStatusBeforeDCProviderSelection = await healthObj.getTeamAppCategoriesSectionDisabledStatus(healthTestData.globalFilterProviderSubCategories[healthTestData.oneIndex]);
		expect(disabledStatusBeforeMCProviderSelection).toEqual(false);
		expect(disabledStatusBeforeDCProviderSelection).toEqual(false);
		await expect(healthObj.isGlobalFilterApplyButtonEnabled()).toBe(false);
		// Global filter panel Teams / App Categories sections enable/disable status after selecting MC and DC provider option
		var providers = await healthObj.getGlobalFilterMcDcProvidersList();
		expect(providers.mcProviders).not.toBe(null);
		expect(providers.dcProviders).not.toBe(null);
		await healthAndInventoryUtil.clickOnProviderCheckBox(providers.mcProviders[healthTestData.zeroIndex]);
		await healthAndInventoryUtil.clickOnProviderCheckBox(providers.dcProviders[healthTestData.zeroIndex]);
		await expect(healthObj.isGlobalFilterSelectedOptionTagPresent()).toEqual(true);
		var disabledStatusAfterMCProviderSelection = await healthObj.getTeamAppCategoriesSectionDisabledStatus(healthTestData.globalFilterProviderSubCategories[healthTestData.zeroIndex]);
		var disabledStatusAfterDCProviderSelection = await healthObj.getTeamAppCategoriesSectionDisabledStatus(healthTestData.globalFilterProviderSubCategories[healthTestData.oneIndex]);
        expect(disabledStatusAfterMCProviderSelection).toEqual(false);
        expect(disabledStatusAfterDCProviderSelection).toEqual(false);
        expect(disabledStatusBeforeMCProviderSelection).toEqual(disabledStatusAfterMCProviderSelection);
        expect(disabledStatusBeforeDCProviderSelection).toEqual(disabledStatusAfterDCProviderSelection);
        await expect(healthObj.isGlobalFilterApplyButtonEnabled()).toBe(true);
	});

	it('Verify Specific "Team" in Health Resource Tab with Global filter', async function(){
	    expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
	    await util.clickOnTabButton(healthTestData.resourcesButtonName);
        expect(util.isSelectedTabButton(healthTestData.resourcesButtonName)).toEqual(true);
		var teamList = await healthObj.getOptionsListBasedOnSectionNameInGlobalFilter(healthTestData.globalFilterMainCategories[healthTestData.oneIndex]);
		expect(await healthObj.clickOnCheckBox(teamList.optionsList[healthTestData.zeroIndex])).toBe(true);
		expect(await healthObj.applyGlobalFilter()).toBe(true);
		util.waitOnlyForInvisibilityOfCarbonDataLoader();
		var result = await healthObj.getAppRescTotalCountBaseOnSelectedColumnValue(teamList.optionsList[healthTestData.zeroIndex],
		                                            healthTestData.resourcesButtonName, healthTestData.team);
        await expect(result.listCount).toEqual(result.totalRecordsCount);
	});

	it('Verify Specific "Application" in Health Resource Tab with Global filter', async function(){
	    expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
    	await util.clickOnTabButton(healthTestData.resourcesButtonName);
        expect(util.isSelectedTabButton(healthTestData.resourcesButtonName)).toEqual(true);
        await expect(inventory_page.isGlobalFilterDisplayed()).toEqual(true);
    	var applicationsList = await healthObj.globalFilterSectionsMorePopupSelection(healthTestData.applicationsLabelText);
		await healthObj.clickOnMorePopupOptions(applicationsList.optionsList[healthTestData.zeroIndex]);
		await healthObj.closeMorePopup();
		await healthAndInventoryUtil.clickOnApplyFilterButton();
		util.waitOnlyForInvisibilityOfCarbonDataLoader();
		var result = await healthObj.getAppRescTotalCountBaseOnSelectedColumnValue(applicationsList.optionsList[healthTestData.zeroIndex],
        		                                            healthTestData.resourcesButtonName, healthTestData.application);
        await expect(result.listCount).toEqual(result.totalRecordsCount);
	});

	it('To verify either Application Categories is displaying in global filter or not and to verify selected Application Categories should reflect at top insights,Health status and Application list', async function(){
		expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
        await expect(inventory_page.isGlobalFilterDisplayed()).toEqual(true);
		await expect(healthObj.isGlobalFilterMainCategoriesTitlePresent(healthTestData.globalFilterApplicationCategories)).toContain(healthTestData.globalFilterApplicationCategories);
		//To check the Health status and application list count before applying the global filter at application tab
		//util.waitOnlyForInvisibilityOfCarbonDataLoader();
		await expect(healthObj.getApplicationsResourcesSectionLabelCountFromHealthAndCommandCenter(healthTestData.applicationsButtonName)).toEqual(healthObj.getSelectedTypeCountFromDonutChart());
		await util.clickOnTabButton(healthTestData.resourcesButtonName)
		util.waitOnlyForInvisibilityOfCarbonDataLoader();
		//To check the Health status and application list count before applying the global filter at resource tab
		await expect(healthObj.getApplicationsResourcesSectionLabelCountFromHealthAndCommandCenter(healthTestData.resourcesButtonName)).toEqual(healthObj.getSelectedTypeCountFromDonutChart());
		//To check the Application Categories GlobalFilter
		await util.clickOnTabButton(healthTestData.applicationsButtonName)
		util.waitOnlyForInvisibilityOfCarbonDataLoader();
		//To select a Categories checkbox from the Application Categories GlobalFilter
		var globalFilterCategoryData = await healthObj.globalFilterSectionsMorePopupSelection(healthTestData.globalFilterMainCategories[healthTestData.twoIndex]);
		await healthObj.clickOnMorePopupOptions(globalFilterCategoryData.optionsList[healthTestData.zeroIndex]);
		await healthObj.closeMorePopup();
		//After select the application categories click on applyGlobalFilter
		await healthAndInventoryUtil.clickOnApplyFilterButton();
		util.waitOnlyForInvisibilityOfCarbonDataLoader();
		expect(healthObj.verifyTopInsightsSubSectionLabelText(healthTestData.leastAvailableAppLabelText)).toEqual(true);
		expect(healthObj.verifyTopInsightsSubSectionValueText(healthTestData.topInsightsApplicationNoDataMessage)).toEqual(true);
		expect(healthObj.verifyTopInsightsSubSectionLabelText(healthTestData.mostAvailableAppLabelText)).toEqual(true);
		expect(healthObj.verifyTopInsightsSubSectionValueText(healthTestData.topInsightsApplicationNoDataMessage)).toEqual(true);
		expect(healthObj.verifyTopInsightsSubSectionLabelText(healthTestData.appsWithMostIncidentsLabelText)).toEqual(true);
		expect(healthObj.verifyTopInsightsSubSectionValueText(healthTestData.topInsightsApplicationNoDataMessage)).toEqual(true);
		expect(healthObj.verifyTopInsightsSubSectionLabelText(healthTestData.appWithMostHighPriorityIncidentsLabelText)).toEqual(true);
		expect(healthObj.verifyTopInsightsSubSectionValueText(healthTestData.topInsightsApplicationNoDataMessage)).toEqual(true);
		//If healthstatus displayed then to verify the application list count.
		await expect(healthObj.getApplicationsResourcesSectionLabelCountFromHealthAndCommandCenter(healthTestData.applicationsButtonName)).toEqual(healthObj.getSelectedTypeCountFromDonutChart());
		//Navigate to resource tab to check the Health status and Resource list count
		await util.clickOnTabButton(healthTestData.resourcesButtonName)
		util.waitOnlyForInvisibilityOfCarbonDataLoader();
		//To check healthstatus displayed and the application list count.
		await expect(healthObj.getApplicationsResourcesSectionLabelCountFromHealthAndCommandCenter(healthTestData.resourcesButtonName)).toEqual(healthObj.getSelectedTypeCountFromDonutChart());
	});

	it('To verify Filter Application to check respective application reflected in HealthStatus, Application list in application Tab', async function(){
		expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
		await expect(inventory_page.isGlobalFilterDisplayed()).toEqual(true);
		await expect(healthObj.isGlobalFilterMainCategoriesTitlePresent(healthTestData.globalFilterApplicationCategories)).toEqual(healthTestData.globalFilterMainCategories);
		//To check the Health status and application list count before applying the global filter at application tab
		//Application List before selection of the Application Categories.
		var globalFilterApplicationDataBefore = await healthObj.getOptionsListBasedOnSectionNameInGlobalFilter(healthTestData.applicationsLabelText);
		var globalFilterCategoryData = await healthObj.globalFilterSectionsMorePopupSelection(healthTestData.globalFilterMainCategories[healthTestData.twoIndex]);
		await healthObj.clickOnMorePopupOptions(globalFilterCategoryData.optionsList[healthTestData.zeroIndex]);
		await healthObj.closeMorePopup();
		//After select the application categories click on applyGlobalFilter
		await healthAndInventoryUtil.clickOnApplyFilterButton();
		util.waitOnlyForInvisibilityOfCarbonDataLoader();
		var globalFilterApplicationDataAfter = await healthObj.getOptionsListBasedOnSectionNameInGlobalFilter(healthTestData.applicationsLabelText);
		//To check the application list after apply the filter is not same.
		await expect(globalFilterApplicationDataBefore.optionsList).not.toEqual(globalFilterApplicationDataAfter.optionsList);
		//to check the total number of application at application list and the health status
		await expect(healthObj.getApplicationsResourcesSectionLabelCountFromHealthAndCommandCenter(healthTestData.applicationsButtonName)).toEqual(healthObj.getSelectedTypeCountFromDonutChart());
		//To check selected application categories in global filter are reflected in the App category colmn of application table
		await expect(healthObj.verifyCellValueFromTicketsTable(healthTestData.OverviewApplicationCategory, globalFilterCategoryData[healthTestData.zeroIndex])).toEqual(true);
		//To check the total number of application count in global filter are reflected in the health status total applicaiton.
		var healthStatusAndCount =await healthObj.getHealthStatusSectionTextAndCount();
		await expect(healthStatusAndCount.totalHealthStatus).toEqual(globalFilterApplicationDataAfter.optionsCount);
	});

	it('To search the Application via search bar in more popup, to search relevant applications displayed after search,to verify the no results found and Search text clear', async function(){
		expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
		await expect(inventory_page.isGlobalFilterDisplayed()).toEqual(true);
		await expect(healthObj.isPresentGlobalFilterTeamAppCategories()).toBe(true);
		//Application List before selection of the Application Categories.
		var globalFilterCategoryData = await healthObj.globalFilterSectionsMorePopupSelection(healthTestData.globalFilterMainCategories[healthTestData.twoIndex]);
		await healthObj.clickOnMorePopupOptions(globalFilterCategoryData.optionsList[healthTestData.zeroIndex]);
		await healthObj.closeMorePopup();
		//After select the application categories click on applyGlobalFilter
		await healthAndInventoryUtil.clickOnApplyFilterButton();
		util.waitOnlyForInvisibilityOfCarbonDataLoader();
		var globalFilterApplicationDataAfter = await healthObj.globalFilterSectionsMorePopupSelection(healthTestData.applicationsLabelText);
		//To search the Application via search bar and to verify only relevant applications are displayed
		await healthObj.filterMorePopupSearchBox(globalFilterApplicationDataAfter.optionsList[healthTestData.zeroIndex]);
		await healthObj.verifyMorePopupSearch(globalFilterApplicationDataAfter.optionsList[healthTestData.zeroIndex]);
		//To check Search text can be cleared by clicking on clear icon
		await healthObj.clickOnMorePopupSearchClearButton();
		//When no search results found then show '0 results found' message
		await healthObj.filterMorePopupSearchBox(healthTestData.noResultFoundMessage);
		await expect(healthObj.getSearchNoResultLabelText()).toEqual(true);
		await healthObj.closeMorePopup();
	});

    it("Verify in Global filter 'Save, Sav as new and Delete' filter options should be disabled when no filter is selected and Delete option should be disabled when filter is not saved, before applying filter", async function(){
        await expect(inventory_page.isGlobalFilterDisplayed()).toEqual(true);
		// Check no option is selected in global filter
		await expect(healthObj.isGlobalFilterSelectedOptionTagPresent()).toEqual(false);
		await expect(healthObj.isGlobalFilterSelectedFilterDropdownPresent()).toEqual(true);
		// Check 'Save, Sav as new and Delete' should be disabled before selecting any filter option
		var saveFilter = await healthObj.isGlobalFilterSaveDeleteFilterOptionsEnabled();
		expect(saveFilter.saveOptionStatus).toEqual(true);
		expect(saveFilter.saveAsNewStatus).toEqual(true);
		expect(saveFilter.deleteStatus).toEqual(true);
		expect(saveFilter.optionsList).toEqual(healthTestData.globalFilterSaveOptions);
		await expect(healthObj.isGlobalFilterApplyButtonEnabled()).toBe(false);
        // Get MC and DC provider option
		var providers = await healthObj.getGlobalFilterMcDcProvidersList();
		await healthAndInventoryUtil.clickOnProviderCheckBox(providers.mcProviders[healthTestData.zeroIndex]);
		await healthAndInventoryUtil.clickOnProviderCheckBox(providers.dcProviders[healthTestData.zeroIndex]);
        // Check option is selected in global filter
		await expect(healthObj.isGlobalFilterSelectedOptionTagPresent()).toEqual(true);
		await expect(healthObj.isGlobalFilterSelectedFilterDropdownPresent()).toEqual(true);
		// Check 'Save, Sav as new' should be enabled and 'Delete' option should be disabled after selecting any filter option
		var saveFilter = await healthObj.isGlobalFilterSaveDeleteFilterOptionsEnabled();
		expect(saveFilter.saveOptionStatus).toEqual(false);
        expect(saveFilter.saveAsNewStatus).toEqual(false);
        expect(saveFilter.deleteStatus).toEqual(true);
        await expect(healthObj.isGlobalFilterApplyButtonEnabled()).toBe(true);
    });

	it('Verify Global Filter is having MY DC option for application', async function(){
		var gfilter=await expect(healthObj.publicFilterValuesIBMDCTitle()).toEqual(healthTestData.ibmDCProviderFilterText);
		if(gfilter!= 'undefined' && gfilter!= null){
			await expect(healthObj.publicFilterValuesTitle()).toEqual(healthTestData.myDCPublicFilterText);
			expect(await healthObj.clickOnCheckBox(healthTestData.myDCPublicFilterText)).toEqual(true);
			await healthAndInventoryUtil.clickOnApplyFilterButton();
			var headerNames = await healthObj.getListViewHeaders();
			await expect(headerNames.includes(healthTestData.provider)).toBe(true);
			var resDetails = await healthObj.verifyCellValueFromTicketsTable(healthTestData.provider, healthTestData.myDCPublicFilterText);
			expect(resDetails).toEqual(true);
		}
		else{
			logger.info("------ MY DC global filter not present ------");
		}
	});
	
	it('Verify MY DC related application View details click navigates to corresponding Application or resource details page', async function(){
        await expect(healthObj.publicFilterValuesIBMDCTitle()).toEqual(healthTestData.ibmDCProviderFilterText);
		var gfilter=await expect(healthObj.publicFilterValuesTitle()).toEqual(healthTestData.ibmDCProviderFilterText);
		if(gfilter!= 'undefined' && gfilter!= null){
				expect(await healthObj.clickOnCheckBox(healthTestData.myDCPublicFilterText)).toEqual(true);
				await healthAndInventoryUtil.clickOnApplyFilterButton();
				await healthObj.isViewDetailsButtonDisplayed(healthTestData.zeroIndex);
				await healthObj.clickOnViewDetails();
				expect(healthAndInventoryUtil.clickOnBreadcrumbLink(healthTestData.healthApplicationBreadcrumbLinkName)).toEqual(healthTestData.healthApplicationBreadcrumbLinkName);
				await util.clickOnTabButton(healthTestData.resourcesButtonName);
				await healthObj.isViewDetailsButtonDisplayed(healthTestData.zeroIndex);
				await healthObj.clickOnViewDetails();
				expect(healthAndInventoryUtil.clickOnBreadcrumbLink(healthTestData.healthResourceBreadcrumbLinkName)).toEqual(healthTestData.healthResourceBreadcrumbLinkName);
			}
			else{
				logger.info("------ MY DC global filter not present ------");
			}
	});

	it('Verify click from Application or Resource view going to details page', async function () {
		await expect(healthObj.publicFilterValuesIBMDCTitle()).toEqual(healthTestData.ibmDCProviderFilterText);
		var gfilter=await expect(healthObj.publicFilterValuesTitle()).toEqual(healthTestData.ibmDCProviderFilterText);
		if(gfilter!= 'undefined' && gfilter!= null){
			//we need to uncomment these two when we get the mydc resource at TopInsights
			//expect(await healthObj.clickOnCheckBox(healthTestData.myDCPublicFilterText)).toEqual(true);
			//await healthAndInventoryUtil.clickOnApplyFilterButton();
			util.clickOnTabButton(healthTestData.applicationsButtonName);
			expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
			await util.waitOnlyForInvisibilityOfTopInsightsLoader(healthTestData.appTopInsightsLeastHealthy);
			var topInsightArr = await healthObj.verifyTopInsightsDataAvailable(healthTestData.appTopInsightsLeastHealthy);
			if (topInsightArr[0]) {
				await expect(healthObj.getViewDetailsOverviewLabelText()).toEqual(healthTestData.OverviewTitle);
				await expect(healthObj.appOverviewSubSectionTitles()).toEqual(true);
				await expect(healthObj.appOverviewSubSectionContentCheck()).toEqual(true);
				await expect(healthObj.appOverviewHeaderStatusCheck()).toEqual(true);
				await expect(healthObj.appOverviewHeaderTitleCheck(topInsightArr[1])).toEqual(true);
				}
		else {
			expect(topInsightArr[0]).toEqual(false);
		}
	}
	else{
		logger.info("------ MY DC global filter not present ------");
	}
	});
	
	it('Verify Global Filter is having MY DC option for resource', async function(){
		await util.clickOnTabButton(healthTestData.resourcesButtonName);
		await expect(healthObj.publicFilterValuesIBMDCTitle()).toEqual(healthTestData.ibmDCProviderFilterText);
		var gfilter= await expect(healthObj.publicFilterValuesTitle()).toEqual(healthTestData.ibmDCProviderFilterText);
		if(gfilter!= 'undefined' && gfilter!= null){
			expect(await healthObj.clickOnCheckBox(healthTestData.myDCPublicFilterText)).toEqual(true);
			await healthAndInventoryUtil.clickOnApplyFilterButton();
			var headerNames = await healthObj.getListViewHeaders();
			await expect(headerNames.includes(healthTestData.provider)).toBe(true);
			var resDetails = await healthObj.verifyCellValueFromTicketsTable(healthTestData.provider, healthTestData.myDCPublicFilterText);
			expect(resDetails).toEqual(true);	
			}
		else{
				logger.info("------ MY DC global filter not present ------");
			}	
	});

	
	it('Verify Global Filter is having MY DC option for resource and select MYDC and other filter option and verify MY DC Resource', async function(){
		await util.clickOnTabButton(healthTestData.resourcesButtonName);
		await expect(healthObj.publicFilterValuesIBMDCTitle()).toEqual(healthTestData.ibmDCProviderFilterText);
		var gfilter= await expect(healthObj.publicFilterValuesTitle()).toEqual(healthTestData.ibmDCProviderFilterText);
		if(gfilter!= 'undefined' && gfilter!= null){
			expect(await healthObj.clickOnCheckBox(healthTestData.myDCPublicFilterText)).toEqual(true);
			expect(await healthObj.clickOnCheckBox(healthTestData.ibmDCProviderFilterText)).toEqual(true);
			await healthAndInventoryUtil.clickOnApplyFilterButton();
			var headerNames = await healthObj.getListViewHeaders();
			await expect(headerNames.includes(healthTestData.provider)).toBe(true);
			var resDetails = await healthObj.verifyCellValueFromTicketsTable(healthTestData.provider, healthTestData.myDCPublicFilterText);
			expect(resDetails).toEqual(true);
		}
		else{
				logger.info("------ MY DC global filter not present ------");
			}	
		
	});


	it('Verify the tabs are clickable under KPI values', async function () {
		await util.clickOnTabButton(healthTestData.resourcesButtonName);
		await expect(util.isSelectedTabButton(healthTestData.resourcesButtonName)).toEqual(true);
		await expect(healthObj.getListSectionCountFromLabel(healthTestData.resourcesLabelText)).toEqual(true);
		await expect(inventory_page.checkNoDataTable()).toBe(false);
		await expect(healthObj.isTableOverflowMenuDisplayed()).toBe(true);
		await util.clickOnTabButton(healthTestData.performanceLinkText);
		await expect(util.isSelectedTabButton(healthTestData.performanceLinkText)).toEqual(true);
		await expect(healthObj.kpiValuesTitle()).toEqual(healthTestData.kpiValues);
		await expect(healthObj.clickOnResourceCategory()).toEqual(true)
		await expect(healthObj.filterValuesTitle()).toEqual(healthTestData.filterBy);
		await healthObj.selectFilterByDays()
		await expect(healthObj.clickOnComputeTab()).toEqual(true)
		await expect(healthObj.clickOnNetworkTab()).toEqual(true)
		await expect(healthObj.clickOnUtilization()).toEqual(true)
		await expect(healthObj.clickOnDiskTab()).toEqual(true)
		await expect(healthObj.clickOnMemoryTab()).toEqual(true)
		await expect(healthObj.clickOnProcessGroups()).toEqual(true)
		await expect(healthObj.clickOnHeapSizeTab()).toEqual(true)
		await expect(healthObj.clickOnGarbageCollectionTab()).toEqual(true)
	});

	it('Verify hyperlinks are there for application Name & Subsystems and check whether able to navigate to the respective page', async function(){
		await util.clickOnTabButton(healthTestData.resourcesButtonName);
		await expect(util.isSelectedTabButton(healthTestData.resourcesButtonName)).toBe(true);
		await expect(inventory_page.isGlobalFilterDisplayed()).toEqual(true);
		await healthAndInventoryUtil.clickOnProviderCheckBox(healthTestData.ibmDCProviderFilterText);
		await healthAndInventoryUtil.clickOnApplyFilterButton();
		await expect(healthObj.getListSectionCountFromLabel(healthTestData.resourcesLabelText)).toEqual(true);
		await inventory_page.searchTable(healthTestData.mainframe)
		// If there is no table data , then tableDataBool will return false
		var tableDataBool = await inventory_page.checkNoDataTable()
		//await healthObj.clickOnHealthDonut()
		if(!tableDataBool){
			await expect(healthObj.isTableOverflowMenuDisplayed()).toBe(true);
			await util.clickOnTabButton(healthTestData.tagsLinkText);

			var tagsTableDataBool = await inventory_page.checkNoDataTable()
			if(!tagsTableDataBool){
				// index one clicks on subsystem name under tags sections and takes to subsystem page
				await healthObj.clickOnListViewUnderTags(healthTestData.oneIndex);
				await util.clickOnTabButton(healthTestData.tagsLinkText);
				var headerNames = await healthObj.getListViewHeaders();
				// check whether we are in LPAR page by verify headername
				await expect(headerNames.includes(healthTestData.lparHealth)).toBe(true);
				await inventory_page.checkNoDataTable()
				// click on mainframe resource header to reach resource page
				await healthObj.clickOnMainframeResourceHeader(healthTestData.oneIndex)
				await util.clickOnTabButton(healthTestData.tagsLinkText);
				await inventory_page.checkNoDataTable()
				// click on mainframe resource with index 1
				await healthObj.clickOnListViewUnderTags(healthTestData.oneIndex)
				//index zero clicks on application under tags sections and takes to application page
				await util.clickOnTabButton(healthTestData.tagsLinkText);
				await healthObj.clickOnListViewUnderTags(healthTestData.zeroIndex)
				// verify whether we are in application page by verifying headername
				headerNames = await healthObj.getListViewHeaders();
				await expect(headerNames.includes(healthTestData.application)).toBe(true);
			}
		}
	});


	it('Verify Prometheus filter, LPAR details page,Verify Tags section table columns, Verify hyperlinks are there for application Name & Subsystems and check whether able to navigate to the respective page', async function(){
		await util.clickOnTabButton(healthTestData.resourcesButtonName);
		await expect(util.isSelectedTabButton(healthTestData.resourcesButtonName)).toBe(true);
		await expect(inventory_page.isGlobalFilterDisplayed()).toEqual(true);
		await healthAndInventoryUtil.clickOnProviderCheckBox(healthTestData.ibmDCProviderFilterText);
		await healthAndInventoryUtil.clickOnApplyFilterButton();
		await expect(healthObj.getListSectionCountFromLabel(healthTestData.resourcesLabelText)).toEqual(true);
		await inventory_page.searchTable(healthTestData.mainframe)
		// If there is no table data , then tableDataBool will return false
		var tableDataBool = await inventory_page.checkNoDataTable()
		//await healthObj.clickOnHealthDonut()
		if(!tableDataBool){
			await expect(healthObj.isTableOverflowMenuDisplayed()).toBe(true);
			await util.clickOnTabButton(healthTestData.tagsLinkText);

			await expect(headerNames.includes(healthTestData.subsystem)).toBe(true);
			var tagsTableDataBool = await inventory_page.checkNoDataTable()
			if(!tagsTableDataBool){
				// index one clicks on subsystem name under tags sections and takes to subsystem page
				await healthObj.clickOnListViewUnderTags(healthTestData.oneIndex);
				await util.clickOnTabButton(healthTestData.tagsLinkText);
				var headerNames = await healthObj.getListViewHeaders();
				//check whether the Mapped application field displayed in overview
				await expect(healthObj.getMappedAppLabelFromResourceDetailsPage(healthTestData.OverviewMappedApplicaiton)).toEqual(true);
				//To verify the App Category column
				//getListViewHeaders
				await expect(headerNames.includes(healthTestData.appCategory)).toBe(true);
				// check whether we are in LPAR page by verify headername
				await expect(headerNames.includes(healthTestData.lparHealth)).toBe(true);

				util.clickOnTabButton(healthTestData.resourcesButtonName);

				await inventory_page.checkNoDataTable()
				// click on mainframe resource header to reach resource page
				await healthObj.clickOnMainframeResourceHeader(healthTestData.oneIndex)
				await util.clickOnTabButton(healthTestData.tagsLinkText);
				await inventory_page.checkNoDataTable()
				// click on mainframe resource with index 1
				await healthObj.clickOnListViewUnderTags(healthTestData.oneIndex)
				//index zero clicks on application under tags sections and takes to application page
				await util.clickOnTabButton(healthTestData.tagsLinkText);
				await healthObj.clickOnListViewUnderTags(healthTestData.zeroIndex)
				// verify whether we are in application page by verifying headername
				headerNames = await healthObj.getListViewHeaders();
				await expect(headerNames.includes(healthTestData.application)).toBe(true);
			}
		}
	});

	it('Verify Export is working in Tickets and Tags tabs', async function(){
		await util.clickOnTabButton(healthTestData.resourcesButtonName);
		await expect(util.isSelectedTabButton(healthTestData.resourcesButtonName)).toEqual(true);
		await expect(inventory_page.isGlobalFilterDisplayed()).toEqual(true);
		await healthAndInventoryUtil.clickOnProviderCheckBox(healthTestData.ibmDCProviderFilterText);
		await healthAndInventoryUtil.clickOnApplyFilterButton();
		await expect(healthObj.getListSectionCountFromLabel(healthTestData.resourcesLabelText)).toEqual(true);
		await inventory_page.searchTable(healthTestData.mainframe);
		// If there is no table data , then tableDataBool will return false
		var tableDataBool = await inventory_page.checkNoDataTable()
		if(!tableDataBool){
			await expect(healthObj.isTableOverflowMenuDisplayed()).toBe(true);
			for(var i=0; i<healthTestData.tagsTickets.length; i++){
				await util.clickOnTabButton(healthTestData.tagsTickets[i]);
				await expect(inventory_page.isTableExportDisplayedAndClick()).toBe(true);
				await expect(inventory_page.clickOnExport(1, "JSON")).toBe(true);
				await expect(inventory_page.clickOnExport(0, "CSV")).toBe(true);
			}
		}
	});

	/* ----------------- Started Command Center testcases ------------------------------------- */

	it('Verify CommandCenter is visible and able to click on Command Center button from Health Page Applications Tab', async function() {
		// Verify selected tab is 'Applications' on health page
		expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
		// Verify Command center button is displayed on 'Applications' tab of Health Page or not
      	expect(healthObj.isCommandCenterButtonDisplayedOnHealthPage()).toEqual(true);
      	// Click on Command Center button
		healthObj.clickonCommandCenter();
		// Verify on Command Center Page, By default 'Applications' tab is selected or not
		expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
		// Get Selected Applications tab total count on command center
        healthObj.getApplicationsResourcesSectionLabelCountFromHealthAndCommandCenter(healthTestData.applicationsButtonName);
        // To click and verify on Health Application View Breadcrumb link to navigate back to Health page
        expect(healthAndInventoryUtil.clickOnBreadcrumbLink(healthTestData.healthApplicationBreadcrumbLinkName)).
                                                                    toEqual(healthTestData.healthApplicationBreadcrumbLinkName);
        // Verify after navigate back to 'health application view' from command center, selected tab is 'Applications' on health page
       	expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
	});

	it('Verify CommandCenter is visible and able to click on Command center button from Health Page Resources Tab', async function() {
         	// Select Resources tab on health page
         	util.clickOnTabButton(healthTestData.resourcesButtonName);
			util.waitOnlyForInvisibilityOfCarbonDataLoader();
    	 	// Verify selected tab is 'Resources' on health page
    	 	expect(util.isSelectedTabButton(healthTestData.resourcesButtonName)).toEqual(true);
    	 	// Verify Command center button is displayed on 'Resources' tab of Health Page or not
         	expect(healthObj.isCommandCenterButtonDisplayedOnHealthPage()).toEqual(true);
         	// Click on Command Center button
         	healthObj.clickonCommandCenter();
         	// Verify on Command Center Page, By default 'Applications' tab is selected or not
         	expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
         	// Select Resources tab on Command Center page
         	util.clickOnTabButton(healthTestData.resourcesButtonName);
    	 	// Verify on Command Center Page, 'Resources' tab is selected or not
    	 	expect(util.isSelectedTabButton(healthTestData.resourcesButtonName)).toEqual(true);
    	 	// Get Selected Resources tab total count on command center
    	 	healthObj.getApplicationsResourcesSectionLabelCountFromHealthAndCommandCenter(healthTestData.resourcesButtonName);
    	 	// To click and verify on Health Resource View Breadcrumb link to navigate back to Health page
         	expect(healthAndInventoryUtil.clickOnBreadcrumbLink(healthTestData.healthResourceBreadcrumbLinkName)).toEqual(healthTestData.healthResourceBreadcrumbLinkName);
         	// Verify after navigate back to 'health resource view' from command center, selected tab is 'Resources' on health page
         	expect(util.isSelectedTabButton(healthTestData.resourcesButtonName)).toEqual(true);
    });

	it('Verify to click on CommandCenter and verify to navigate to Applications and Resources tab and tab labels', async function(){
		expect(healthObj.isCommandCenterButtonDisplayedOnHealthPage()).toEqual(true);
		healthObj.clickonCommandCenter();
		expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
		util.waitOnlyForInvisibilityOfCarbonDataLoader();
		var categoryFilterOptions = await healthObj.getCategoryFilterOptionsList();
        expect(categoryFilterOptions.defaultSelectedText).toEqual(healthTestData.categoryAppCategory);
        expect(categoryFilterOptions.optionList).toEqual(healthTestData.applicationsCategoryFilterOptions);
		//To click on the application in commandcenter
		healthObj.clickOnFirstAppResourceCammandCenterCard();
		//To click on the commandcenter Breadcrub link to navigate back to commandCenter from application details apge
		healthAndInventoryUtil.clickOnBreadcrumbLink(healthTestData.commandCenterLabel);
	});
	
	it('Verify in CommandCenter on click on resource- Navigate to Resources overview page and navigate back on click on Breadcrumb', async function(){
		healthObj.clickonCommandCenter();
		expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
		var categoryFilterOptions = await healthObj.getCategoryFilterOptionsList();
        expect(categoryFilterOptions.defaultSelectedText).toEqual(healthTestData.categoryAppCategory);
        expect(categoryFilterOptions.optionList).toEqual(healthTestData.applicationsCategoryFilterOptions);
		//To click on the application in commandcenter
		healthObj.clickOnFirstAppResourceCammandCenterCard();
		//To click on the commandcenter Breadcrub link to navigate back to commandCenter from application details apge
		healthAndInventoryUtil.clickOnBreadcrumbLink(healthTestData.commandCenterLabel);
		util.clickOnTabButton(healthTestData.resourcesButtonName);
		expect(util.isSelectedTabButton(healthTestData.resourcesButtonName)).toEqual(true);
		var categoryFilterOptions = await healthObj.getCategoryFilterOptionsList();
        expect(categoryFilterOptions.defaultSelectedText).toEqual(healthTestData.OverviewResourceCategory);
        expect(categoryFilterOptions.optionList).toEqual(healthTestData.resourcesCategoryFilterOptions);
		healthObj.clickOnFirstAppResourceCammandCenterCard();
		healthAndInventoryUtil.clickOnBreadcrumbLink(healthTestData.breadcrumbApplication);
	});

    it('Verify in Command Center, the resource dropdown with Resource category, environment, Provider, Team and filter by health dropdown displayed with Critical, Warning, Healthy option displayed for resource tab', async function(){
		expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
		util.waitOnlyForInvisibilityOfCarbonDataLoader();
		healthObj.clickonCommandCenter();
		util.clickOnTabButton(healthTestData.resourcesButtonName);
		expect(util.isSelectedTabButton(healthTestData.resourcesButtonName)).toEqual(true);
        var categoryFilterOptions = await healthObj.getCategoryFilterOptionsList();
		expect(categoryFilterOptions.defaultSelectedText).toEqual(healthTestData.OverviewResourceCategory);
		expect(categoryFilterOptions.optionList).toEqual(healthTestData.resourcesCategoryFilterOptions);

        var healthFilterOptions = await healthObj.getHealthFilterOptionsList();
		expect(healthFilterOptions.defaultSelectedText).toEqual(healthTestData.healthFilter);
		expect(healthFilterOptions.optionList.toString()).toEqual(healthTestData.filterHealthOptions);
	});
	
	it('Verify resource details in Command Center on selecting "Resource category" filter option and "Critical" filter by health option on Resources tab', async function(){
		expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
		util.waitOnlyForInvisibilityOfCarbonDataLoader();
		healthObj.clickonCommandCenter();
		util.clickOnTabButton(healthTestData.resourcesButtonName);
		expect(util.isSelectedTabButton(healthTestData.resourcesButtonName)).toEqual(true);
        var categoryFilterOptions = await healthObj.getCategoryFilterOptionsList();
		expect(categoryFilterOptions.defaultSelectedText).toEqual(healthTestData.OverviewResourceCategory);
		expect(categoryFilterOptions.optionList).toEqual(healthTestData.resourcesCategoryFilterOptions);
		var categoryFilterList = categoryFilterOptions.optionList;

        var healthFilterOptions = await healthObj.getHealthFilterOptionsList();
        var healthFilterList = healthFilterOptions.optionList;
		expect(healthFilterOptions.defaultSelectedText).toEqual(healthTestData.healthFilter);
		expect(healthFilterList.toString()).toEqual(healthTestData.filterHealthOptions);

        expect(categoryFilterList[healthTestData.zeroIndex]).toEqual(healthTestData.OverviewResourceCategory);
        expect(healthFilterList[healthTestData.zeroIndex]).toEqual(healthTestData.filterCritical);

		await healthObj.selectCategoryFromAppResFilterDropdown(categoryFilterList[healthTestData.zeroIndex]);
		healthObj.clickOnFirstAppResourceCammandCenterCard();
		healthAndInventoryUtil.clickOnBreadcrumbLink(healthTestData.commandCenterLabel);

        await healthObj.selectFilterFromHealthAppResBreakdownWidget(healthFilterList[healthTestData.zeroIndex]);
        healthObj.clickOnFirstAppResourceCammandCenterCard();
        healthAndInventoryUtil.clickOnBreadcrumbLink(healthTestData.commandCenterLabel);
		healthAndInventoryUtil.clickOnBreadcrumbLink(healthTestData.breadcrumbApplication);	
	});

    it('Verify in Command Center, the application dropdown with category, environment, Provider, Team and filter by health dropdown displayed with Critical, Warning, Healthy option displayed for application tab', async function(){
		expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
		util.waitOnlyForInvisibilityOfCarbonDataLoader();
		healthObj.clickonCommandCenter();
        var categoryFilterOptions = await healthObj.getCategoryFilterOptionsList();
		expect(categoryFilterOptions.defaultSelectedText).toEqual(healthTestData.categoryAppCategory);
		expect(categoryFilterOptions.optionList).toEqual(healthTestData.applicationsCategoryFilterOptions);

        var healthFilterOptions = await healthObj.getHealthFilterOptionsList();
		expect(healthFilterOptions.defaultSelectedText).toEqual(healthTestData.healthFilter);
		expect((healthFilterOptions.optionList).toString()).toEqual(healthTestData.filterHealthOptions);
	});

	it('Verify in Command Center, application details on selecting "App category" filter option and "Critical" filter by health option on Applications tab', async function(){
        expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
		util.waitOnlyForInvisibilityOfCarbonDataLoader();
		healthObj.clickonCommandCenter();
		expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
        var categoryFilterOptions = await healthObj.getCategoryFilterOptionsList();
		expect(categoryFilterOptions.defaultSelectedText).toEqual(healthTestData.categoryAppCategory);
		expect(categoryFilterOptions.optionList).toEqual(healthTestData.applicationsCategoryFilterOptions);
		var categoryFilterList = categoryFilterOptions.optionList;

        var healthFilterOptions = await healthObj.getHealthFilterOptionsList();
        var healthFilterList = healthFilterOptions.optionList;
		expect(healthFilterOptions.defaultSelectedText).toEqual(healthTestData.healthFilter);
		expect(healthFilterList.toString()).toEqual(healthTestData.filterHealthOptions);

        expect(categoryFilterList[healthTestData.zeroIndex]).toEqual(healthTestData.categoryAppCategory);
        expect(healthFilterList[healthTestData.zeroIndex]).toEqual(healthTestData.filterCritical);

		await healthObj.selectCategoryFromAppResFilterDropdown(categoryFilterList[healthTestData.zeroIndex]);
		healthObj.clickOnFirstAppResourceCammandCenterCard();
		healthAndInventoryUtil.clickOnBreadcrumbLink(healthTestData.commandCenterLabel);

        await healthObj.selectFilterFromHealthAppResBreakdownWidget(healthFilterList[healthTestData.zeroIndex]);
        healthObj.clickOnFirstAppResourceCammandCenterCard();
        healthAndInventoryUtil.clickOnBreadcrumbLink(healthTestData.commandCenterLabel);
		healthAndInventoryUtil.clickOnBreadcrumbLink(healthTestData.breadcrumbApplication);
	});
	
	it('Verify to navigate to Applications and Resources tab and tab labels', async function(){
		expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
		await healthObj.isViewDetailsButtonDisplayed(healthTestData.zeroIndex);
		await healthObj.clickOnViewDetails();
		await expect(healthObj.getViewDetailsOverviewLabelText()).toEqual(healthTestData.OverviewTitle);
		healthAndInventoryUtil.clickOnBreadcrumbLink(healthTestData.applicationViewLink);
		util.clickOnTabButton(healthTestData.resourcesButtonName);
		expect(util.isSelectedTabButton(healthTestData.resourcesButtonName)).toEqual(true);
		await healthObj.isViewDetailsButtonDisplayed(healthTestData.zeroIndex);
		await healthObj.clickOnViewDetails();
		await expect(healthObj.getViewDetailsOverviewLabelText()).toEqual(healthTestData.OverviewTitle);
		healthAndInventoryUtil.clickOnBreadcrumbLink(healthTestData.resourceViewLink);
	});

	it('[Command Center][Applications Tab][Filter by App category] : Verify, visibility of Show all/ show less options when Applications count is more than 100 and validate performed action.', async function() {
        // Verify Command center button is displayed on Health Page or not
        expect(healthObj.isCommandCenterButtonDisplayedOnHealthPage()).toEqual(true);
        // Click on Command Center button on Health page
        healthObj.clickonCommandCenter();
        // Verify by default Applications tab is selected
        expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
        // Select 'App category' option in Application Category dropdown
        await healthObj.selectCategoryFromAppResFilterDropdown(healthTestData.categoryAppCategory);
        // Clear default selected items in filter by health dropdown
        await healthObj.clearDefaultSelectedInFilterByHealthDropDownOnCommandCenter();
        util.waitOnlyForInvisibilityOfCarbonDataLoader();
        // Get Total health status count along with 'Applications' title name from each section
        var titleNameAndHealthStatusCount = await healthObj.getCommandCenterHealthStatusCount();
        // Verify 'Show all' button is displaying or not in Applications tab. If displaying the match button text name
        expect(healthObj.isShowAllButtonDisplayedInCommandCenter()).toEqual(healthTestData.commandCenterShowAllButtonName);
        // Click on each 'Show all' button and get totalAppRescCount, beforeShowAllClickCount, afterClickButtonName
        var showAllResult = await healthObj.clickOnShowAllButtonInCommandCenter(titleNameAndHealthStatusCount, healthTestData.applicationsButtonName);
        // Verify on Click of 'Show all' will display all the remaining Applications.
        // where 'totalAppRescCount' will return total applications count after click on 'Show all'
        expect(titleNameAndHealthStatusCount.toString()).toContain((showAllResult.totalAppRescCount).toString());
        // Verify after click on 'Show all' button, 'Show less' button is displaying or not on Applications Tab
        expect(healthObj.isShowLessButtonDisplayedInCommandCenter()).toEqual(healthTestData.commandCenterShowLessButtonName);
        // Verify after click on 'Show all' text is replaced with 'Show less' text
        expect(showAllResult.afterClickButtonName).toEqual(healthTestData.commandCenterShowLessButtonName);
        // Click on Show less button(s) and get applications count after click on 'Show less' button
        var recordsCountAfterShowLessClick = await healthObj.clickOnShowLessButtonInCommandCenter(titleNameAndHealthStatusCount);
        // Verify after click on 'Show less' button, applications count should display back to 100
        expect(recordsCountAfterShowLessClick).toEqual(showAllResult.beforeShowAllClickCount);
    });

    it('[Command Center][Resources Tab][Filter by Resource Category] : Verify, visibility of Show all/ show less options when Resources count is more than 100 and validate performed action.', async function() {
        // Verify Command center button is displayed on Health Page or not
        expect(healthObj.isCommandCenterButtonDisplayedOnHealthPage()).toEqual(true);
        // Click on Command Center button on Health page
        healthObj.clickonCommandCenter();
        // Verify by default Applications tab is selected
        expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
        // Select Resources tab on Command Center page
        util.clickOnTabButton(healthTestData.resourcesButtonName);
        // Verify on Command Center Page, 'Resources' tab is selected or not
        expect(util.isSelectedTabButton(healthTestData.resourcesButtonName)).toEqual(true);
        // Select 'Resource Category' option in Resource Category dropdown
        await healthObj.selectCategoryFromAppResFilterDropdown(healthTestData.OverviewResourceCategory);
        // Clear default selected items in filter by health dropdown
        await healthObj.clearDefaultSelectedInFilterByHealthDropDownOnCommandCenter();
        util.waitForAngular();
        // Get Total health status count along with 'Resources' title name from each section
        var titleNameAndHealthStatusCount = await healthObj.getCommandCenterHealthStatusCount();
        // Verify 'Show all' button is displaying or not in Resources tab. If displaying the match button text name
        expect(healthObj.isShowAllButtonDisplayedInCommandCenter()).toEqual(healthTestData.commandCenterShowAllButtonName);
        // Click on each 'Show all' button and get totalAppRescCount, beforeShowAllClickCount, afterClickButtonName
        var showAllResult = await healthObj.clickOnShowAllButtonInCommandCenter(titleNameAndHealthStatusCount,
                                               healthTestData.resourcesButtonName);
        // Verify on Click of 'Show all' will display all the remaining Resources.
        // where 'totalAppRescCount' will return total resources count after click on 'Show all'
        expect(titleNameAndHealthStatusCount.toString()).toContain((showAllResult.totalAppRescCount).toString());
        // Verify after click on 'Show all' button, 'Show less' button is displaying or not on Resources Tab
        expect(healthObj.isShowLessButtonDisplayedInCommandCenter()).toEqual(healthTestData.commandCenterShowLessButtonName);
        // Verify after click on 'Show all' text is replaced with 'Show less' text
        expect(showAllResult.afterClickButtonName).toEqual(healthTestData.commandCenterShowLessButtonName);
        // Click on Show less button(s) and get resources count after click on 'Show less' button
        var recordsCountAfterShowLessClick = await healthObj.clickOnShowLessButtonInCommandCenter(titleNameAndHealthStatusCount);
        // Verify after click on 'Show less' button, resources count should display back to 100
        expect(recordsCountAfterShowLessClick).toEqual(showAllResult.beforeShowAllClickCount);
    	});

    it('Verify command center Application search', async function(){
		healthObj.clickonCommandCenter();
		util.clickOnTabButton(healthTestData.applicationsButtonName);
		expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
		await healthObj.clearDefaultSelectedInFilterByHealthDropDownOnCommandCenter();
		util.waitOnlyForInvisibilityOfCarbonDataLoader();
		var name = await healthObj.getCommandCenterFirstAppResName();
		healthObj.commandCenterSearch(name);
		var result = await healthObj.verifyCommandCenterSearch(name);
		expect(result).toEqual(true);
	});

	it('Verify command center Resource search', async function(){
		healthObj.clickonCommandCenter();
		util.clickOnTabButton(healthTestData.resourcesButtonName);
		expect(util.isSelectedTabButton(healthTestData.resourcesButtonName)).toEqual(true);
		var name = await healthObj.getCommandCenterFirstAppResName();
		healthObj.commandCenterSearch(name);
		var result = await healthObj.verifyCommandCenterSearch(name);
		expect(result).toEqual(true);
	});

/* ------------------------------ End of Command Center testcases ---------------------------------------------- */

// ***** Application detail page test cases - start *****

	it('Verify Application detail page overview section', async function () {
		await util.waitForDashboardTab();
		util.clickOnTabButton(healthTestData.applicationsButtonName);
		expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
		await util.waitOnlyForInvisibilityOfTopInsightsLoader(healthTestData.appTopInsightsLeastHealthy);
		var topInsightArr = await healthObj.verifyTopInsightsDataAvailable(healthTestData.appTopInsightsLeastHealthy);
		if (topInsightArr[0]) {
			await expect(healthObj.getViewDetailsOverviewLabelText()).toEqual(healthTestData.OverviewTitle);
			await expect(healthObj.appOverviewSubSectionTitles()).toEqual(true);
			await expect(healthObj.appOverviewSubSectionContentCheck()).toEqual(true);
			await expect(healthObj.appOverviewHeaderStatusCheck()).toEqual(true);
			await expect(healthObj.appOverviewHeaderTitleCheck(topInsightArr[1])).toEqual(true);
		}
		else {
			expect(topInsightArr[0]).toEqual(false);
		}
	});

	it('Verify Application detail page breadcrumb', async function () {
		await util.waitForDashboardTab();
		util.clickOnTabButton(healthTestData.applicationsButtonName);
		expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
		await util.waitOnlyForInvisibilityOfTopInsightsLoader(healthTestData.appTopInsightsLeastHealthy);
		var topInsightArr = await healthObj.verifyTopInsightsDataAvailable(healthTestData.appTopInsightsLeastHealthy);
		if (topInsightArr[0]) {
			await expect(healthObj.breadcrumbText(topInsightArr[1])).toEqual(true);
			await expect(healthObj.getHeaderStatusText()).toEqual(true);
			await expect(healthObj.getLastUpdatedTimestampFormat()).toEqual(true);
		}
		else {
			expect(topInsightArr[0]).toEqual(false);
		}
	});

	it('Verify Application detail impacted resources count in UI and count should match with ES query result', async function () {
        expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
    	expect(healthObj.isTitleTextFromSectionPresent(healthTestData.topInsightsLabelText)).toBe(true);
    	expect(healthObj.verifyTopInsightsSubSectionLabelText(healthTestData.leastAvailableAppLabelText)).toEqual(true);
    	var selectedAppName = await healthObj.clickAndGetTextFromTopInsightsSubSection(healthTestData.leastAvailableAppLabelText);
	    var detailPageTitle = await healthObj.getNameFromAppResourceDetailsPage();
        //Verify the title in overview page is matching with application that is clicked
        await expect(selectedAppName.toString()).toEqual(detailPageTitle);
        var impactedResourceDetailsFromOverviewUI = await healthObj.getImpactedResourcesFromOverview();
        if(isEnabledESValidation) {
            var appDetailsImpactedResourcesCountFromES = await esQueriesHealth.appOverviewDetailsImpactedResourceCount(healthTestData.esHealthSearchIndex,
                    tenantId, selectedAppName);
        	await expect(impactedResourceDetailsFromOverviewUI).toEqual(appDetailsImpactedResourcesCountFromES);
        }
        var pageCount = await healthObj.getPageCountForAppsResourcesTable();
        var impactedResourcesFromTable = await healthObj.getCountOfLinks(healthTestData.associatedResourcesTableSettingsHeaders[healthTestData.twoIndex],
                                                                            pageCount);
        await expect(impactedResourcesFromTable.critical).toEqual(Object.values(impactedResourceDetailsFromOverviewUI)[0]);
        await expect(impactedResourcesFromTable.warning).toEqual(Object.values(impactedResourceDetailsFromOverviewUI)[1]);
	});

	it('Verify Associated resources list view table', async function () {
		await util.waitForDashboardTab();
		util.clickOnTabButton(healthTestData.applicationsButtonName);
		expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
		await util.waitOnlyForInvisibilityOfTopInsightsLoader(healthTestData.appTopInsightsLeastHealthy);
		await expect(inventory_page.checkNoDataTable()).toBe(false);
        await expect(healthObj.isTableOverflowMenuDisplayed()).toBe(true);
		await expect(healthObj.getListSectionLabelText()).toEqual(healthTestData.associatedResourceLabelText);
		expect(healthObj.isTableDisplayed()).toBe(true);
        expect(healthObj.isTableHeadersDisplayed(healthTestData.resourceTableHeaders)).toBe(true);
        expect(healthObj.isTableSearchBarDisplayed()).toBe(true);
        expect(healthObj.isTablePaginationDisplayed()).toBe(true);
        expect(healthObj.isTableExportDisplayedAndClick()).toBe(true);
        await expect(healthObj.clickOnExport(healthTestData.zeroIndex, healthTestData.csv)).toBe(true);
        await expect(healthObj.clickOnExport(healthTestData.oneIndex, healthTestData.json)).toBe(true);
        await expect(healthObj.clickOnTableSort(healthTestData.oneIndex)).toBe(true);
        await expect(healthObj.clickOnTableSort(healthTestData.twoIndex)).toBe(true);
        await expect(healthObj.clickOnTableSort(healthTestData.zeroIndex)).toBe(true);
        await expect(healthObj.searchTable(healthTestData.sampleSearchText)).toBe(true);
        await expect(healthObj.searchTable('')).toBe(true);
        expect(healthObj.clickOnItemsPerPage(healthTestData.tableItemsPerPageCss, healthTestData.itemsPerPage, healthTestData.zeroIndex)).toBeTruthy();
        expect(healthObj.clickOnItemsPerPage(healthTestData.tablePageNumberCss, healthTestData.pagination, healthTestData.zeroIndex)).toBeTruthy();
        expect(healthObj.getRowCountFromAssociatedResourcesAppsTable()).toEqual(healthObj.getResourceCountFromAssociatedResourcesTableLabel());
        expect(healthObj.verifyDropdownFilter(healthTestData.filterHealthPlaceholder, healthTestData.filterHealthOptions, 'noTab')).toBe(true);
		await expect(healthObj.isTableDisplayed()).toBe(true);
		await healthObj.clickOnIdLink();
		await expect(healthObj.getViewDetailsOverviewLabelText()).toEqual(healthTestData.OverviewTitle);
	});

	// ***** Application detail page test cases - end *****

	it('Verify Application List view headers, sort functionality, pagination, Search text in list and view details', async function(){
		util.clickOnTabButton(healthTestData.applicationsButtonName);
		var headers = await healthObj.getListViewHeaders();
		expect(headers).toEqual(healthTestData.applicationTableHeaders);
		expect(healthObj.isTableSearchBarDisplayed()).toBe(true);
		expect(healthObj.isTableExportDisplayedAndClick()).toBe(true);
        await expect(healthObj.clickOnExport(healthTestData.zeroIndex, healthTestData.csv)).toBe(true);
        await expect(healthObj.clickOnExport(healthTestData.oneIndex, healthTestData.json)).toBe(true);
        await expect(healthObj.clickOnTableSort(healthTestData.oneIndex)).toBe(true);
        await expect(healthObj.clickOnTableSort(healthTestData.twoIndex)).toBe(true);
        await expect(healthObj.clickOnTableSort(healthTestData.zeroIndex)).toBe(true);
        await expect(healthObj.searchTable(healthTestData.sampleSearchText)).toBe(true);
        await expect(healthObj.searchTable('')).toBe(true);
		expect(healthObj.clickOnItemsPerPage(healthTestData.tableItemsPerPageCss, healthTestData.itemsPerPage, healthTestData.zeroIndex)).toBeTruthy();
        expect(healthObj.clickOnItemsPerPage(healthTestData.tablePageNumberCss, healthTestData.pagination, healthTestData.zeroIndex)).toBeTruthy();
		await healthObj.clickOnViewDetails();
		await expect(healthObj.getViewDetailsOverviewLabelText()).toEqual(healthTestData.OverviewTitle);
		healthAndInventoryUtil.clickOnBreadcrumbLink(healthTestData.applicationViewLink);
	});

	it('Verify on Resources Tab, In Resources List view and in details page Azure cloud Database "Microsoft.Sql/servers/databases" service is displaying along with tabs', async function(){
        expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
    	await util.clickOnTabButton(healthTestData.resourcesButtonName);
    	expect(util.isSelectedTabButton(healthTestData.resourcesButtonName)).toEqual(true);
    	await healthObj.clickOnHealthStatusOption(healthTestData.resourceHealthyText);
    	expect(healthObj.isTableSearchBarDisplayed()).toBe(true);
    	await expect(healthObj.searchTable(healthTestData.azureSupportDatabaseServices[healthTestData.zeroIndex])).toBe(true);
    	var resourceType = await healthObj.getAppRescTotalCountBaseOnSelectedColumnValue(healthTestData.azureSupportDatabaseServices[healthTestData.zeroIndex],
    	                                                                           healthTestData.resourcesButtonName,
                		                                            healthTestData.resourceTableHeaders[healthTestData.tenthIndex]);
        await expect(resourceType.listCount).toEqual(resourceType.totalRecordsCount);
        var providerValue = await healthObj.getAppRescTotalCountBaseOnSelectedColumnValue(healthTestData.azureProvider, healthTestData.resourcesButtonName,
                                                                                            healthTestData.provider);
        await expect(providerValue.listCount).toEqual(providerValue.totalRecordsCount);
        await healthObj.isViewDetailsButtonDisplayed(healthTestData.twoIndex);
        await healthObj.clickOnViewDetails();
        await expect(healthObj.getViewDetailsOverviewLabelText()).toEqual(healthTestData.OverviewTitle);
        var overviewDetails = await healthObj.getOverviewLabelFromResourceDetailsPage();
        await expect(healthTestData.azureSupportDatabaseServices[healthTestData.zeroIndex]).toEqual(Object.values(overviewDetails)[healthTestData.oneIndex]);
        await util.clickOnTabButton(healthTestData.performanceLinkText);
        await expect(util.isSelectedTabButton(healthTestData.performanceLinkText)).toEqual(true);
        await expect(healthObj.kpiValuesTitle()).toEqual(healthTestData.kpiValues);
        await expect(healthObj.clickOnUtilization()).toEqual(true);
        await healthObj.performanceUtilizationSelectFilterByOption(healthTestData.azureMonitor);
        var tabsNames = await healthObj.azureSupportGraphTabs(healthTestData.azureSupportDatabaseServices[healthTestData.zeroIndex]);
        expect(tabsNames).toEqual(healthTestData.azureSqlServersDatabasesTabsName);
    });

    it('Verify on Resources Tab, In Resources List view and in details page Azure cloud Database "Microsoft.DocumentDB/databaseAccounts" services is displaying along with tabs', async function(){
        expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
    	await util.clickOnTabButton(healthTestData.resourcesButtonName);
    	expect(util.isSelectedTabButton(healthTestData.resourcesButtonName)).toEqual(true);
    	await healthObj.clickOnHealthStatusOption(healthTestData.resourceHealthyText);
    	expect(healthObj.isTableSearchBarDisplayed()).toBe(true);
    	await expect(healthObj.searchTable(healthTestData.azureSupportDatabaseServices[healthTestData.oneIndex])).toBe(true);
    	var resourceType = await healthObj.getAppRescTotalCountBaseOnSelectedColumnValue(healthTestData.azureSupportDatabaseServices[healthTestData.oneIndex],
    	                                                                           healthTestData.resourcesButtonName,
                		                                            healthTestData.resourceTableHeaders[healthTestData.tenthIndex]);
        await expect(resourceType.listCount).toEqual(resourceType.totalRecordsCount);
        var providerValue = await healthObj.getAppRescTotalCountBaseOnSelectedColumnValue(healthTestData.azureProvider, healthTestData.resourcesButtonName,
                                                                                            healthTestData.provider);
        await expect(providerValue.listCount).toEqual(providerValue.totalRecordsCount);
        await healthObj.isViewDetailsButtonDisplayed(healthTestData.zeroIndex);
        await healthObj.clickOnViewDetails();
        await expect(healthObj.getViewDetailsOverviewLabelText()).toEqual(healthTestData.OverviewTitle);
        var overviewDetails = await healthObj.getOverviewLabelFromResourceDetailsPage();
        await expect(healthTestData.azureSupportDatabaseServices[healthTestData.oneIndex]).toEqual(Object.values(overviewDetails)[healthTestData.oneIndex]);
        await util.clickOnTabButton(healthTestData.performanceLinkText);
        await expect(util.isSelectedTabButton(healthTestData.performanceLinkText)).toEqual(true);
        await expect(healthObj.kpiValuesTitle()).toEqual(healthTestData.kpiValues);
        await expect(healthObj.clickOnUtilization()).toEqual(true);
        await healthObj.performanceUtilizationSelectFilterByOption(healthTestData.azureMonitor);
        var tabsNames = await healthObj.azureSupportGraphTabs(healthTestData.azureSupportDatabaseServices[healthTestData.oneIndex]);
        expect(tabsNames).toEqual(healthTestData.azureDocumentDBAccountsTabsName);
    });


	it('Verify Application breakdown widget "Environment" Stackbar selection interaction with Applications List view. Applications list view should get updated and navigate back to list view via breadcrumb ', async function(){
		expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
		expect(healthObj.getHealthBreakdownSectionLabelText()).toEqual(healthTestData.applicationBreakdownLabelText);
		var details = await healthObj.clickOnAppResBreakdownBasedOnStackBarIndex(healthTestData.environment, healthTestData.zeroIndex);
		await healthObj.isViewDetailsButtonDisplayed(healthTestData.zeroIndex);
		expect(healthObj.getApplicationsResourcesSectionLabelCountFromHealthAndCommandCenter(healthTestData.applicationsButtonName)).toEqual(details[healthTestData.oneIndex]);
		await healthObj.clickOnViewDetails();
		await expect(healthObj.getViewDetailsOverviewLabelText()).toEqual(healthTestData.OverviewTitle);
		healthAndInventoryUtil.clickOnBreadcrumbLink(healthTestData.applicationViewLink);
		var result = await healthObj.getAppRescTotalCountBaseOnSelectedColumnValue(details[healthTestData.zeroIndex], healthTestData.applicationsButtonName,
        		                                            healthTestData.environment);
        await expect(result.listCount).toEqual(result.totalRecordsCount);
	});

    it('Verify Application breakdown widget "Provider" Stackbar selection interaction with Applications List view. Applications list view should get updated and navigate back to list view via breadcrumb ', async function(){
        expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
        expect(healthObj.getHealthBreakdownSectionLabelText()).toEqual(healthTestData.applicationBreakdownLabelText);
        var details = await healthObj.clickOnAppResBreakdownBasedOnStackBarIndex(healthTestData.provider, healthTestData.oneIndex);
        await healthObj.isViewDetailsButtonDisplayed(healthTestData.zeroIndex);
        expect(healthObj.getApplicationsResourcesSectionLabelCountFromHealthAndCommandCenter(healthTestData.applicationsButtonName)).toEqual(details[healthTestData.oneIndex]);
        await healthObj.clickOnViewDetails();
        await expect(healthObj.getViewDetailsOverviewLabelText()).toEqual(healthTestData.OverviewTitle);
        healthAndInventoryUtil.clickOnBreadcrumbLink(healthTestData.applicationViewLink);
        var result = await healthObj.getAppRescTotalCountBaseOnSelectedColumnValue(details[healthTestData.zeroIndex], healthTestData.applicationsButtonName,
                		                                            healthTestData.provider);
        await expect(result.listCount).toEqual(result.totalRecordsCount);
   });

   it('Verify Application breakdown widget "Team" Stackbar selection interaction with Applications List view. Applications list view should get updated and navigate back to list view via breadcrumb ', async function(){
        expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
        expect(healthObj.getHealthBreakdownSectionLabelText()).toEqual(healthTestData.applicationBreakdownLabelText);
        var details = await healthObj.clickOnAppResBreakdownBasedOnStackBarIndex(healthTestData.team, healthTestData.zeroIndex);
        await healthObj.isViewDetailsButtonDisplayed(healthTestData.zeroIndex);
        expect(healthObj.getApplicationsResourcesSectionLabelCountFromHealthAndCommandCenter(healthTestData.applicationsButtonName)).toEqual(details[healthTestData.oneIndex]);
        await healthObj.clickOnViewDetails();
        await expect(healthObj.getViewDetailsOverviewLabelText()).toEqual(healthTestData.OverviewTitle);
        healthAndInventoryUtil.clickOnBreadcrumbLink(healthTestData.applicationViewLink);
        var result = await healthObj.getAppRescTotalCountBaseOnSelectedColumnValue(details[healthTestData.zeroIndex], healthTestData.applicationsButtonName,
                        		                                            healthTestData.team);
        await expect(result.listCount).toEqual(result.totalRecordsCount);
   });

	it('Verify Resource breakdown widget "Environment" stackBar selection interaction with Resources List view. Resource list view should get updated and navigate back to list view via breadcrumb ', async function(){
		util.clickOnTabButton(healthTestData.resourcesButtonName);
		expect(util.isSelectedTabButton(healthTestData.resourcesButtonName)).toEqual(true);
		expect(healthObj.getHealthBreakdownSectionLabelText()).toEqual(healthTestData.resourceBreakdownLabelText);
		var details = await healthObj.clickOnAppResBreakdownBasedOnStackBarIndex(healthTestData.environment, healthTestData.zeroIndex);
		await healthObj.isViewDetailsButtonDisplayed(healthTestData.zeroIndex);
		expect(healthObj.getApplicationsResourcesSectionLabelCountFromHealthAndCommandCenter(healthTestData.resourcesButtonName)).toEqual(details[healthTestData.oneIndex]);
		await healthObj.clickOnViewDetails();
		await expect(inventory_page.getViewDetailsOverviewLabelText()).toEqual(healthTestData.OverviewTitle);
		healthAndInventoryUtil.clickOnBreadcrumbLink(healthTestData.resourceViewLink);
		var result = await healthObj.getAppRescTotalCountBaseOnSelectedColumnValue(details[healthTestData.zeroIndex], healthTestData.resourcesButtonName,
                        		                                            healthTestData.environment);
        await expect(result.listCount).toEqual(result.totalRecordsCount);
	});

   it('Verify Resource breakdown widget "Provider" stackBar selection interaction with Resources List view. Resource list view should get updated and navigate back to list view via breadcrumb ', async function(){
        util.clickOnTabButton(healthTestData.resourcesButtonName);
        expect(util.isSelectedTabButton(healthTestData.resourcesButtonName)).toEqual(true);
        expect(healthObj.getHealthBreakdownSectionLabelText()).toEqual(healthTestData.resourceBreakdownLabelText);
        var details = await healthObj.clickOnAppResBreakdownBasedOnStackBarIndex(healthTestData.provider, healthTestData.zeroIndex);
        await healthObj.isViewDetailsButtonDisplayed(healthTestData.zeroIndex);
        expect(healthObj.getApplicationsResourcesSectionLabelCountFromHealthAndCommandCenter(healthTestData.resourcesButtonName)).toEqual(details[healthTestData.oneIndex]);
        await healthObj.clickOnViewDetails();
        await expect(healthObj.getViewDetailsOverviewLabelText()).toEqual(healthTestData.OverviewTitle);
        healthAndInventoryUtil.clickOnBreadcrumbLink(healthTestData.resourceViewLink);
        var result = await healthObj.getAppRescTotalCountBaseOnSelectedColumnValue(details[healthTestData.zeroIndex], healthTestData.resourcesButtonName,
                        		                                            healthTestData.provider);
        await expect(result.listCount).toEqual(result.totalRecordsCount);
    });

   it('Verify Resource breakdown widget "Team" stackBar selection interaction with Resources List view. Resource list view should get updated and navigate back to list view via breadcrumb ', async function(){
        util.clickOnTabButton(healthTestData.resourcesButtonName);
        expect(util.isSelectedTabButton(healthTestData.resourcesButtonName)).toEqual(true);
        expect(healthObj.getHealthBreakdownSectionLabelText()).toEqual(healthTestData.resourceBreakdownLabelText);
        var details = await healthObj.clickOnAppResBreakdownBasedOnStackBarIndex(healthTestData.team, healthTestData.zeroIndex);
        await healthObj.isViewDetailsButtonDisplayed(healthTestData.zeroIndex);
        expect(healthObj.getApplicationsResourcesSectionLabelCountFromHealthAndCommandCenter(healthTestData.resourcesButtonName)).toEqual(details[healthTestData.oneIndex]);
        await healthObj.clickOnViewDetails();
        await expect(healthObj.getViewDetailsOverviewLabelText()).toEqual(healthTestData.OverviewTitle);
        healthAndInventoryUtil.clickOnBreadcrumbLink(healthTestData.resourceViewLink);
        var result = await healthObj.getAppRescTotalCountBaseOnSelectedColumnValue(details[healthTestData.zeroIndex], healthTestData.resourcesButtonName,
                        		                                            healthTestData.team);
        await expect(result.listCount).toEqual(result.totalRecordsCount);
    });

   it('Verify Resource breakdown widget "Category" stackBar selection interaction with Resources List view. Resource list view should get updated and navigate back to list view via breadcrumb ', async function(){
        util.clickOnTabButton(healthTestData.resourcesButtonName);
        expect(util.isSelectedTabButton(healthTestData.resourcesButtonName)).toEqual(true);
        expect(healthObj.getHealthBreakdownSectionLabelText()).toEqual(healthTestData.resourceBreakdownLabelText);
        var details = await healthObj.clickOnAppResBreakdownBasedOnStackBarIndex(healthTestData.category, healthTestData.oneIndex);
        await healthObj.isViewDetailsButtonDisplayed(healthTestData.zeroIndex);
        expect(healthObj.getApplicationsResourcesSectionLabelCountFromHealthAndCommandCenter(healthTestData.resourcesButtonName)).toEqual(details[healthTestData.oneIndex]);
        await healthObj.clickOnViewDetails();
        await expect(healthObj.getViewDetailsOverviewLabelText()).toEqual(healthTestData.OverviewTitle);
        healthAndInventoryUtil.clickOnBreadcrumbLink(healthTestData.resourceViewLink);
        var result = await healthObj.getAppRescTotalCountBaseOnSelectedColumnValue(details[healthTestData.zeroIndex], healthTestData.resourcesButtonName,
                        		                                            healthTestData.OverviewResourceCategory);
        await expect(result.listCount).toEqual(result.totalRecordsCount);
    });

	if (browser.params.dataValiadtion) {
		it("Applications tab: Verify Application Breakdown Section 'By Provider' data with JSON data", async function(){
			logger.info("------Data Validation------");
			/**
			 * Data validation for Application Breakdown section By Provider
			 */
			util.clickOnTabButton(healthTestData.applicationsButtonName);
			util.waitOnlyForInvisibilityOfKibanaDataLoader();
			var appBreakdownData = healthAppData[healthTestData.appBreakdownJsonKey];
			var awsAppCountForProviderFilter = util.getDataFromElasticViewJSON(appBreakdownData[healthTestData.providerFilterJsonKey], healthTestData.awsJsonKey);
			var azureAppCountForProviderFilter = util.getDataFromElasticViewJSON(appBreakdownData[healthTestData.providerFilterJsonKey], healthTestData.azureJsonKey);
			var ibmCloudAppCountForProviderFilter = util.getDataFromElasticViewJSON(appBreakdownData[healthTestData.providerFilterJsonKey], healthTestData.ibmCloudJsonKey);
			var ibmDCAppCountForProviderFilter = util.getDataFromElasticViewJSON(appBreakdownData[healthTestData.providerFilterJsonKey], healthTestData.ibmDcJsonKey);
			// For critical alerts
			healthObj.selectAlertTypeFromDropdown(dashboardTestData.criticalAlertName);
			util.waitOnlyForInvisibilityOfKibanaDataLoader();
			expect(awsAppCountForProviderFilter[healthTestData.criticalAppJsonKey]).toEqual(await healthObj.getAppResCountFromBreakdownSection(healthTestData.awsProviderFilterText));
			expect(azureAppCountForProviderFilter[healthTestData.criticalAppJsonKey]).toEqual(await healthObj.getAppResCountFromBreakdownSection(healthTestData.azureProviderFilterText));
			expect(ibmCloudAppCountForProviderFilter[healthTestData.criticalAppJsonKey]).toEqual(await healthObj.getAppResCountFromBreakdownSection(healthTestData.ibmCloudProviderFilterText));
			expect(ibmDCAppCountForProviderFilter[healthTestData.criticalAppJsonKey]).toEqual(await healthObj.getAppResCountFromBreakdownSection(healthTestData.ibmDCProviderFilterText));
			// For warning alerts
			healthObj.selectAlertTypeFromDropdown(dashboardTestData.warningAlertName);
			util.waitOnlyForInvisibilityOfKibanaDataLoader();
			expect(awsAppCountForProviderFilter[healthTestData.warningAppJsonKey]).toEqual(await healthObj.getAppResCountFromBreakdownSection(healthTestData.awsProviderFilterText));
			expect(azureAppCountForProviderFilter[healthTestData.warningAppJsonKey]).toEqual(await healthObj.getAppResCountFromBreakdownSection(healthTestData.azureProviderFilterText));
			expect(ibmCloudAppCountForProviderFilter[healthTestData.warningAppJsonKey]).toEqual(await healthObj.getAppResCountFromBreakdownSection(healthTestData.ibmCloudProviderFilterText));
			expect(ibmDCAppCountForProviderFilter[healthTestData.warningAppJsonKey]).toEqual(await healthObj.getAppResCountFromBreakdownSection(healthTestData.ibmDCProviderFilterText));
			// For healthy alerts
			healthObj.selectAlertTypeFromDropdown(dashboardTestData.healthyAlertName);
			util.waitOnlyForInvisibilityOfKibanaDataLoader();
			expect(awsAppCountForProviderFilter[healthTestData.healthyAppJsonKey]).toEqual(await healthObj.getAppResCountFromBreakdownSection(healthTestData.awsProviderFilterText));
			expect(azureAppCountForProviderFilter[healthTestData.healthyAppJsonKey]).toEqual(await healthObj.getAppResCountFromBreakdownSection(healthTestData.azureProviderFilterText));
			expect(ibmCloudAppCountForProviderFilter[healthTestData.healthyAppJsonKey]).toEqual(await healthObj.getAppResCountFromBreakdownSection(healthTestData.ibmCloudProviderFilterText));
			expect(ibmDCAppCountForProviderFilter[healthTestData.healthyAppJsonKey]).toEqual(await healthObj.getAppResCountFromBreakdownSection(healthTestData.ibmDCProviderFilterText));
		});
	}

	if (browser.params.dataValiadtion) {
		it("Applications tab: Verify Application Breakdown Section 'By Environment' data with JSON data", async function(){
			logger.info("------Data Validation------");
			/**
			 * Data validation for Application Breakdown section By Environment
			 */
			util.clickOnTabButton(healthTestData.applicationsButtonName);
			util.waitOnlyForInvisibilityOfKibanaDataLoader();
			var appCountForEnvFilter = util.getDataFromElasticViewJSON(healthAppData[healthTestData.appBreakdownJsonKey], healthTestData.environmentFilterJsonKey);
			var envKeyList = Object.keys(appCountForEnvFilter);
			var envValueList = Object.values(appCountForEnvFilter);
			// For critical alerts
			healthObj.selectAlertTypeFromDropdown(dashboardTestData.criticalAlertName);
			util.waitOnlyForInvisibilityOfKibanaDataLoader();
			for(var i=0; i<envKeyList.length; i++){
				await expect(envValueList[i][healthTestData.criticalAppJsonKey]).toEqual(await healthObj.getAppResCountFromBreakdownSection(JSON.stringify(envKeyList[i])));
			}
			// For warning alerts
			healthObj.selectAlertTypeFromDropdown(dashboardTestData.warningAlertName);
			util.waitOnlyForInvisibilityOfKibanaDataLoader();
			for(var i=0; i<envKeyList.length; i++){
				await expect(envValueList[i][healthTestData.warningAppJsonKey]).toEqual(await healthObj.getAppResCountFromBreakdownSection(JSON.stringify(envKeyList[i])));
			}
			// For healthy alerts
			healthObj.selectAlertTypeFromDropdown(dashboardTestData.healthyAlertName);
			util.waitOnlyForInvisibilityOfKibanaDataLoader();
			for(var i=0; i<envKeyList.length; i++){
				await expect(envValueList[i][healthTestData.healthyAppJsonKey]).toEqual(await healthObj.getAppResCountFromBreakdownSection(JSON.stringify(envKeyList[i])));
			}
		});
	}

	if (browser.params.dataValiadtion) {
		it("Applications tab: Verify Application Breakdown Section 'By Team' data with JSON data", async function(){
			logger.info("------Data Validation------");
			/**
			 * Data validation for Application Breakdown section By Team
			 */
			util.clickOnTabButton(healthTestData.applicationsButtonName);
			util.waitOnlyForInvisibilityOfKibanaDataLoader();
			var appCountForTeamFilter = util.getDataFromElasticViewJSON(healthAppData[healthTestData.appBreakdownJsonKey], healthTestData.teamFilterJsonKey);
			var teamKeyList = Object.keys(appCountForTeamFilter);
			var teamValueList = Object.values(appCountForTeamFilter);
			// For critical alerts
			healthObj.selectAlertTypeFromDropdown(dashboardTestData.criticalAlertName);
			util.waitOnlyForInvisibilityOfKibanaDataLoader();
			for(var i=0; i<teamKeyList.length; i++){
				await expect(teamValueList[i][healthTestData.criticalAppJsonKey]).toEqual(await healthObj.getAppResCountFromBreakdownSection(JSON.stringify(teamKeyList[i])));
			}
			// For warning alerts
			healthObj.selectAlertTypeFromDropdown(dashboardTestData.warningAlertName);
			util.waitOnlyForInvisibilityOfKibanaDataLoader();
			for(var i=0; i<teamKeyList.length; i++){
				await expect(teamValueList[i][healthTestData.warningAppJsonKey]).toEqual(await healthObj.getAppResCountFromBreakdownSection(JSON.stringify(teamKeyList[i])));
			}
			// For healthy alerts
			healthObj.selectAlertTypeFromDropdown(dashboardTestData.healthyAlertName);
			util.waitOnlyForInvisibilityOfKibanaDataLoader();
			for(var i=0; i<teamKeyList.length; i++){
				await expect(teamValueList[i][healthTestData.healthyAppJsonKey]).toEqual(await healthObj.getAppResCountFromBreakdownSection(JSON.stringify(teamKeyList[i])));
			}
		});
	};

	it('Verify if all elements within Resources tab are loaded or not', function(){
		util.clickOnTabButton(healthTestData.resourcesButtonName);
		expect(util.isSelectedTabButton(healthTestData.resourcesButtonName)).toEqual(true);
		util.waitOnlyForInvisibilityOfCarbonDataLoader();
		expect(healthObj.isTitleTextFromSectionPresent(healthTestData.topInsightsLabelText)).toBe(true);
		expect(healthObj.getHealthStatusSectionLabelText()).toEqual(healthTestData.healthStatusLabelText);
		expect(healthObj.getHealthBreakdownSectionLabelText()).toEqual(healthTestData.resourceBreakdownLabelText);
		expect(healthObj.verifyTopInsightsSubSectionLabelText(healthTestData.resourcesWithMaxCPUUtilizationLabelText)).toEqual(true);
		expect(healthObj.verifyTopInsightsSubSectionLabelText(healthTestData.resourcesWithMostIncidentsLabelText)).toEqual(true);
		expect(healthObj.verifyTopInsightsSubSectionLabelText(healthTestData.resourcesWithLeastAvailabilityLabelText)).toEqual(true);
		expect(healthObj.isTitleTextFromSectionPresent(healthTestData.resourceListLabelText)).toBe(true);
		expect(healthObj.getApplicationsResourcesSectionLabelCountFromHealthAndCommandCenter(healthTestData.resourcesButtonName)).toEqual(healthObj.getSelectedTypeCountFromDonutChart());
		expect(inventory_page.checkNoDataTable()).toBe(false);
		expect(healthObj.verifyResourceSummarySectionLabelText(healthTestData.resourceTotalResources)).toEqual(true);
		expect(healthObj.verifyResourceSummarySectionLabelText(healthTestData.resourceCriticalText)).toEqual(true);
		expect(healthObj.verifyResourceSummarySectionLabelText(healthTestData.resourceWarningText)).toEqual(true);
		expect(healthObj.verifyResourceSummarySectionLabelText(healthTestData.resourceHealthyText)).toEqual(true);
		expect(healthObj.verifyResourceSummarySectionLabelText(healthTestData.resourceDeletedText)).toEqual(true);
	});

	if (browser.params.dataValiadtion) {
		it("Resources tab: Verify Resources Breakdown Section 'By Provider' data with JSON data", async function(){
			logger.info("------Data Validation------");
			/**
			 * Data validation for Resources Breakdown section By Provider
			 */
			util.clickOnTabButton(healthTestData.resourcesButtonName);
			util.waitOnlyForInvisibilityOfKibanaDataLoader();
			var resBreakdownData = healthResData[healthTestData.resBreakdownJsonKey];
			var awsResCountForProviderFilter = util.getDataFromElasticViewJSON(resBreakdownData[healthTestData.providerFilterJsonKey], healthTestData.awsJsonKey);
			var azureResCountForProviderFilter = util.getDataFromElasticViewJSON(resBreakdownData[healthTestData.providerFilterJsonKey], healthTestData.azureJsonKey);
			var ibmCloudResCountForProviderFilter = util.getDataFromElasticViewJSON(resBreakdownData[healthTestData.providerFilterJsonKey], healthTestData.ibmCloudJsonKey);
			var ibmDCResCountForProviderFilter = util.getDataFromElasticViewJSON(resBreakdownData[healthTestData.providerFilterJsonKey], healthTestData.ibmDcJsonKey);
			// For critical alerts
			healthObj.selectAlertTypeFromDropdown(dashboardTestData.criticalAlertName);
			util.waitOnlyForInvisibilityOfKibanaDataLoader();
			expect(awsResCountForProviderFilter[healthTestData.criticalResJsonKey]).toEqual(await healthObj.getAppResCountFromBreakdownSection(healthTestData.awsProviderFilterText));
			expect(azureResCountForProviderFilter[healthTestData.criticalResJsonKey]).toEqual(await healthObj.getAppResCountFromBreakdownSection(healthTestData.azureProviderFilterText));
			expect(ibmCloudResCountForProviderFilter[healthTestData.criticalResJsonKey]).toEqual(await healthObj.getAppResCountFromBreakdownSection(healthTestData.ibmCloudProviderFilterText));
			expect(ibmDCResCountForProviderFilter[healthTestData.criticalResJsonKey]).toEqual(await healthObj.getAppResCountFromBreakdownSection(healthTestData.ibmDCProviderFilterText));
			// For warning alerts
			healthObj.selectAlertTypeFromDropdown(dashboardTestData.warningAlertName);
			util.waitOnlyForInvisibilityOfKibanaDataLoader();
			expect(awsResCountForProviderFilter[healthTestData.warningResJsonKey]).toEqual(await healthObj.getAppResCountFromBreakdownSection(healthTestData.awsProviderFilterText));
			expect(azureResCountForProviderFilter[healthTestData.warningResJsonKey]).toEqual(await healthObj.getAppResCountFromBreakdownSection(healthTestData.azureProviderFilterText));
			expect(ibmCloudResCountForProviderFilter[healthTestData.warningResJsonKey]).toEqual(await healthObj.getAppResCountFromBreakdownSection(healthTestData.ibmCloudProviderFilterText));
			expect(ibmDCResCountForProviderFilter[healthTestData.warningResJsonKey]).toEqual(await healthObj.getAppResCountFromBreakdownSection(healthTestData.ibmDCProviderFilterText));
			// For healthy alerts
			healthObj.selectAlertTypeFromDropdown(dashboardTestData.healthyAlertName);
			util.waitOnlyForInvisibilityOfKibanaDataLoader();
			expect(awsResCountForProviderFilter[healthTestData.healthyResJsonKey]).toEqual(await healthObj.getAppResCountFromBreakdownSection(healthTestData.awsProviderFilterText));
			expect(azureResCountForProviderFilter[healthTestData.healthyResJsonKey]).toEqual(await healthObj.getAppResCountFromBreakdownSection(healthTestData.azureProviderFilterText));
			expect(ibmCloudResCountForProviderFilter[healthTestData.healthyResJsonKey]).toEqual(await healthObj.getAppResCountFromBreakdownSection(healthTestData.ibmCloudProviderFilterText));
			expect(ibmDCResCountForProviderFilter[healthTestData.healthyResJsonKey]).toEqual(await healthObj.getAppResCountFromBreakdownSection(healthTestData.ibmDCProviderFilterText));
		});
	}

	if (browser.params.dataValiadtion) {
		it("Resources tab: Verify Resources Breakdown Section 'By Environment' data with JSON data", async function(){
			logger.info("------Data Validation------");
			/**
			 * Data validation for Resources Breakdown section By Environment
			 */
			util.clickOnTabButton(healthTestData.resourcesButtonName);
			util.waitOnlyForInvisibilityOfKibanaDataLoader();
			var resCountForEnvFilter = util.getDataFromElasticViewJSON(healthResData[healthTestData.resBreakdownJsonKey], healthTestData.environmentFilterJsonKey);
			var envKeyList = Object.keys(resCountForEnvFilter);
			var envValueList = Object.values(resCountForEnvFilter);
			// For critical alerts
			healthObj.selectAlertTypeFromDropdown(dashboardTestData.criticalAlertName);
			util.waitOnlyForInvisibilityOfKibanaDataLoader();
			for(var i=0; i<envKeyList.length; i++){
				await expect(envValueList[i][healthTestData.criticalResJsonKey]).toEqual(await healthObj.getAppResCountFromBreakdownSection(JSON.stringify(envKeyList[i])));
			}
			// For warning alerts
			healthObj.selectAlertTypeFromDropdown(dashboardTestData.warningAlertName);
			util.waitOnlyForInvisibilityOfKibanaDataLoader();
			for(var i=0; i<envKeyList.length; i++){
				await expect(envValueList[i][healthTestData.warningResJsonKey]).toEqual(await healthObj.getAppResCountFromBreakdownSection(JSON.stringify(envKeyList[i])));
			}
			// For healthy alerts
			healthObj.selectAlertTypeFromDropdown(dashboardTestData.healthyAlertName);
			util.waitOnlyForInvisibilityOfKibanaDataLoader();
			for(var i=0; i<envKeyList.length; i++){
				await expect(envValueList[i][healthTestData.healthyResJsonKey]).toEqual(await healthObj.getAppResCountFromBreakdownSection(JSON.stringify(envKeyList[i])));
			}
		});
	}

	if (browser.params.dataValiadtion) {
		it("Resources tab: Verify Resources Breakdown Section 'By Team' data with JSON data", async function(){
			logger.info("------Data Validation------");
			/**
			 * Data validation for Resources Breakdown section By Team
			 */
			util.clickOnTabButton(healthTestData.resourcesButtonName);
			util.waitOnlyForInvisibilityOfKibanaDataLoader();
			var resCountForTeamFilter = util.getDataFromElasticViewJSON(healthResData[healthTestData.resBreakdownJsonKey], healthTestData.teamFilterJsonKey);
			var teamKeyList = Object.keys(resCountForTeamFilter);
			var teamValueList = Object.values(resCountForTeamFilter);
			// For critical alerts
			healthObj.selectAlertTypeFromDropdown(dashboardTestData.criticalAlertName);
			util.waitOnlyForInvisibilityOfKibanaDataLoader();
			for(var i=0; i<teamKeyList.length; i++){
				await expect(teamValueList[i][healthTestData.criticalResJsonKey]).toEqual(await healthObj.getAppResCountFromBreakdownSection(JSON.stringify(teamKeyList[i])));
			}
			// For warning alerts
			healthObj.selectAlertTypeFromDropdown(dashboardTestData.warningAlertName);
			util.waitOnlyForInvisibilityOfKibanaDataLoader();
			for(var i=0; i<teamKeyList.length; i++){
				await expect(teamValueList[i][healthTestData.warningResJsonKey]).toEqual(await healthObj.getAppResCountFromBreakdownSection(JSON.stringify(teamKeyList[i])));
			}
			// For healthy alerts
			healthObj.selectAlertTypeFromDropdown(dashboardTestData.healthyAlertName);
			util.waitOnlyForInvisibilityOfKibanaDataLoader();
			for(var i=0; i<teamKeyList.length; i++){
				await expect(teamValueList[i][healthTestData.healthyResJsonKey]).toEqual(await healthObj.getAppResCountFromBreakdownSection(JSON.stringify(teamKeyList[i])));
			}
		});
	};

	it('Verify Critical servers count from Critical application details', async function(){
		launchpadObj.clickOnHamburgerMenu(launchpadTestData.leftNavigationExpanded);
		launchpadObj.clickOnleftNavigationMenuBasedOnName(launchpadTestData.aIOpsIntelligentITOperationsBtn);
		launchpadObj.clickLeftNavCardBasedOnName(launchpadTestData.dashboardCard);
		dashboardObj.open();
		// Verify critical row count on alerts card should be less than equal to critical alerts on health card
		expect(dashboardObj.getCriticalAlertsRowCount()).toBeLessThanOrEqual(dashboardObj.getCriticalAlertsCountFromHealthCard());
		var criticalAppDetails = await dashboardObj.getFirstCriticalAlertDetailsFromAlertsCard();
		if(criticalAppDetails != false){
			await dashboardObj.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.health);
			await healthObj.clickOnApplicationViewDetailsButton(criticalAppDetails[healthTestData.zeroIndex]);
			// Verify the Application name text for App details page header
            expect(healthObj.getAppNameFromAppDetailsPageHeaderText()).toEqual(criticalAppDetails[healthTestData.zeroIndex]);
			var criticalServerCount = await healthObj.getAffectedServerCountFromAssociatedResourcesTable(healthTestData.criticalAlertName);
			// Compare CI impacted count on Dashboard with affected resource count on Health
			expect(criticalAppDetails[healthTestData.oneIndex]).toEqual(criticalServerCount);
		}
	});


	it('Verify if Resource details page for Critical Resource is loaded or not', async function(){
		launchpadObj.clickOnHamburgerMenu(launchpadTestData.leftNavigationExpanded);
		launchpadObj.clickOnleftNavigationMenuBasedOnName(launchpadTestData.aIOpsIntelligentITOperationsBtn);
		launchpadObj.clickLeftNavCardBasedOnName(launchpadTestData.dashboardCard);
		dashboardObj.open();
		// Verify critical row count on alerts card should be less than equal to critical alerts on health card
		expect(dashboardObj.getCriticalAlertsRowCount()).toBeLessThanOrEqual(dashboardObj.getCriticalAlertsCountFromHealthCard());
		var criticalAppDetails = await dashboardObj.getFirstCriticalAlertDetailsFromAlertsCard();
		if(criticalAppDetails != false){
			await dashboardObj.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.health);
			await healthObj.clickOnApplicationViewDetailsButton(criticalAppDetails[0]);
			// Verify the Application name text for App details page header
			expect(healthObj.getAppNameFromAppDetailsPageHeaderText()).toEqual(criticalAppDetails[0]);
			// Verify Associated Resources table label text
			expect(healthObj.getAssociatedResourcesTableLabelText()).toEqual(healthTestData.associatedResourcesTableText);
			// Verify count from Associated Resources table label with row count in the table
			expect(healthObj.getResourceCountFromAssociatedResourcesTableLabel()).toEqual(healthObj.getRowCountFromAssociatedResourcesAppsTable());
			await healthAndInventoryUtil.clickOnBreadcrumbLink(healthTestData.healthBreadcrumbLabel);
			expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
			util.waitOnlyForInvisibilityOfCarbonDataLoader();
			await healthObj.clickOnApplicationViewDetailsButton(criticalAppDetails[0]);
			// Verify Resource name from the app details page with Hostname field value on resource details page
			var resourceName = await healthObj.clickOnFirstAffectedResourceViewDetailsButton(healthTestData.criticalAlertName);
			await expect(healthObj.getNameFromAppResourceDetailsPage()).toEqual(resourceName);
			// Verify if Tickets/Performance/Tags links are displayed or not in table
			expect(healthObj.isDisplayedResourceDetailsTableSectionLinks(healthTestData.ticketsLinkText)).toBe(true);
			expect(healthObj.isDisplayedResourceDetailsTableSectionLinks(healthTestData.performanceLinkText)).toBe(true);
			expect(healthObj.isDisplayedResourceDetailsTableSectionLinks(healthTestData.tagsLinkText)).toBe(true);
			await healthObj.clickOnResourceDetailsTableSectionLink(healthTestData.tagsLinkText);
			// Verify Associated Application name in Tags tab of resource details page
			expect(healthObj.getAssociatedAppsTableLabelText(healthTestData.oneIndex)).toContain(criticalAppDetails[0]);
			await healthObj.clickOnResourceDetailsTableSectionLink(healthTestData.ticketsLinkText);
			// Verify if critical event is present or not in Ticket tab list
			var resDetails = await healthObj.verifyCellValueFromTicketsTable(healthTestData.eventsHealthColumnName, healthTestData.criticalAlertName);
			expect(resDetails).toEqual(true);
		}
	});

    it('[Associated Resources list][Table Settings] Verify on selecting unchecked columns, changes are reflecting in list view / table settings and resets to default view on applying reset from table settings', async function() {
	     expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
	     // select application from top insights sub section to redircet to Application details page
	     inventory_page.clickandGetTextInsightFromTopInsightsSubSection(healthTestData.leastAvailableAppLabelText);
	     // verify user redirected to Application details page
         await expect(healthObj.getListSectionLabelText()).toEqual(healthTestData.associatedResourceLabelText);
	     // Get List of columns header name from Associated Resources List
	     var listViewColumnsNameBeforeChange = await healthObj.getListViewHeaders();
	     // Verify either Table settings Icon is displaying or not
	     await expect(healthObj.isTableSettingsIconDisplayed()).toEqual(true);
	     // Click on Table settings icon
	     await healthObj.clickOnTableSettingsIcon();
	     // Verify table settings menu is expanded and match table settings header text
	     await expect(healthObj.verifyIsTableSettingsMenuExpanded()).toEqual(healthTestData.tableSettingsMenuHeaderText);
	     // Verify 'All Columns' field checkbox Text match with expected result
	     var name = await healthObj.verifyAllColumnsOptionFromTableSettings();
	     await expect(name.allColumnsFieldTextName).toEqual(healthTestData.tableSettingsAllColumnsCheckboxText)
	     // Get all columns name from table settings menu
	     var allColumnsName = await healthObj.getTableSettingsMenuAllColumnNames();
	     // Verify table settings columns names are matching with expected columns name
         await expect(allColumnsName).toEqual(healthTestData.associatedResourcesTableSettingsHeaders);
	     // Get list of checked / unchecked columns name from table settings menu
	     var unCheckedColumnsListBeforeChange = await healthObj.getCheckedUncheckedAndDisabledColumnsFromTableSettingsMenu();
	     // Verify selected columns names from table settings are matching with ASC list view columns header name
	     await expect(unCheckedColumnsListBeforeChange.selectedColumnsListWithDisabledColumns).toEqual(listViewColumnsNameBeforeChange);
	     // Verify unselected columns names from table settings are not matching with ASC list view columns header name
	     await expect(unCheckedColumnsListBeforeChange.unSelectedColumns).not.toEqual(listViewColumnsNameBeforeChange);
	     // Get random List of columns to perform check/uncheck action on table settings columns
	     var randomColumnsToSelect = util.getRandomMultipleUniqueElementsFromArray(unCheckedColumnsListBeforeChange.unSelectedColumns,
	                                                util.getNumberOfElementsToSelectFromArray(unCheckedColumnsListBeforeChange.unSelectedColumns));
	     // Select unchecked columns in table settings menu
         await healthObj.clickToSelectUnselectColumnsInTableSettingsMenu(randomColumnsToSelect, allColumnsName);
         // Verify Apply button Text name matches with expected name and click on Apply button to save changes
         await expect(healthObj.clickOnApplyResetCancelButton(healthTestData.tableSettingsMenuApplyButtonText)).
                                                                    toEqual(healthTestData.tableSettingsMenuApplyButtonText);
	     util.waitOnlyForInvisibilityOfCarbonDataLoader();
         // Get list of ASC list columns header after applying columns changes in table setting menu
	     var listViewColumnsNameAfterChange = await healthObj.getListViewHeaders();
	     await healthObj.clickOnTableSettingsIcon();
	     await expect(healthObj.verifyIsTableSettingsMenuExpanded()).toEqual(healthTestData.tableSettingsMenuHeaderText);
	     // Get list of checked / unchecked columns name from table settings menu after applying changes
	     var unCheckedColumnsListAfterChange = await healthObj.getCheckedUncheckedAndDisabledColumnsFromTableSettingsMenu();
	     await expect(unCheckedColumnsListAfterChange.selectedColumnsListWithDisabledColumns).toEqual(listViewColumnsNameAfterChange);
	     await expect(unCheckedColumnsListAfterChange.unSelectedColumns).not.toEqual(listViewColumnsNameAfterChange);
	     // Verify Reset button Text name matches with expected name and click on Reset button to back to original state
         await expect(healthObj.clickOnApplyResetCancelButton(healthTestData.tableSettingsMenuResetButtonText)).
                                                                    toEqual(healthTestData.tableSettingsMenuResetButtonText);
	     util.waitOnlyForInvisibilityOfCarbonDataLoader();
	     // Get list of ASC list columns header after reset columns changes in table setting menu
         var listViewColumnsNameAfterReset = await healthObj.getListViewHeaders();
         await expect(listViewColumnsNameBeforeChange).toEqual(listViewColumnsNameAfterReset);
	     await healthObj.clickOnTableSettingsIcon();
	     var unCheckedColumnsListAfterReset = await healthObj.getCheckedUncheckedAndDisabledColumnsFromTableSettingsMenu();
	     // Verify table settings changes and ASC list view columns changes after reset
	     await expect(unCheckedColumnsListAfterReset.selectedColumnsListWithDisabledColumns).toEqual(listViewColumnsNameBeforeChange);
         await expect(unCheckedColumnsListAfterReset.unSelectedColumns).not.toEqual(listViewColumnsNameBeforeChange);
         // Close opened table setting menu by clicking on (x) icon
         await healthObj.closeTableSettingsMenu();
	});

    it('[Associated Resources list][Table Settings] Verify on unchecking selected columns, changes are reflecting in list view / table settings and resets to default view on applying reset from table settings', async function() {
	     expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
	     // select application from top insights sub section to redircet to Application details page
	     inventory_page.clickandGetTextInsightFromTopInsightsSubSection(healthTestData.leastAvailableAppLabelText);
	     // verify user redirected to Application details page
         await expect(healthObj.getListSectionLabelText()).toEqual(healthTestData.associatedResourceLabelText);
	     // Get List of columns header name from Associated Resources List
	     var listViewColumnsNameBeforeChange = await healthObj.getListViewHeaders();
	     // Verify either Table settings Icon is displaying or not
	     await expect(healthObj.isTableSettingsIconDisplayed()).toEqual(true);
	     // Click on Table settings icon
	     await healthObj.clickOnTableSettingsIcon();
	     // Verify table settings menu is expanded and match table settings header text
	     await expect(healthObj.verifyIsTableSettingsMenuExpanded()).toEqual(healthTestData.tableSettingsMenuHeaderText);
	     // Verify 'All Columns' checkbox column Text match with expected result
         var name = await healthObj.verifyAllColumnsOptionFromTableSettings();
         await expect(name.allColumnsFieldTextName).toEqual(healthTestData.tableSettingsAllColumnsCheckboxText)
	     // Get all columns name from table settings menu
	     var allColumnsName = await healthObj.getTableSettingsMenuAllColumnNames();
	     // Verify table settings columns names are matching with expected columns name
	     await expect(allColumnsName).toEqual(healthTestData.associatedResourcesTableSettingsHeaders);
	     // Get list of checked / unchecked columns name from table settings menu
	     var checkedColumnsListBeforeChange = await healthObj.getCheckedUncheckedAndDisabledColumnsFromTableSettingsMenu();
	     // Verify selected columns names from table settings are matching with ASC list view columns header name
	     await expect(checkedColumnsListBeforeChange.selectedColumnsListWithDisabledColumns).toEqual(listViewColumnsNameBeforeChange);
	     // Verify unselected columns names from table settings are not matching with ASC list view columns header name
	     await expect(checkedColumnsListBeforeChange.unSelectedColumns).not.toEqual(listViewColumnsNameBeforeChange);
	     // Get random List of columns to perform check/uncheck action on table settings columns
	     var randomColumnsToSelect = util.getRandomMultipleUniqueElementsFromArray(checkedColumnsListBeforeChange.selectedColumns,
	                                                util.getNumberOfElementsToSelectFromArray(checkedColumnsListBeforeChange.selectedColumns));
	     // Uncheck selected columns in table settings menu
         await healthObj.clickToSelectUnselectColumnsInTableSettingsMenu(randomColumnsToSelect, allColumnsName);
         // Verify Apply button Text name matches with expected name and Click on button to save changes
         await expect(healthObj.clickOnApplyResetCancelButton(healthTestData.tableSettingsMenuApplyButtonText)).
                                                                    toEqual(healthTestData.tableSettingsMenuApplyButtonText);
	     util.waitOnlyForInvisibilityOfCarbonDataLoader();
         // Get list of ASC list columns header after applying columns changes in table setting menu
	     var listViewColumnsNameAfterChange = await healthObj.getListViewHeaders();
	     await healthObj.clickOnTableSettingsIcon();
	     await expect(healthObj.verifyIsTableSettingsMenuExpanded()).toEqual(healthTestData.tableSettingsMenuHeaderText);
	     // // Get list of checked / unchecked columns name from table settings menu after applying changes
	     var checkedColumnsListAfterChange = await healthObj.getCheckedUncheckedAndDisabledColumnsFromTableSettingsMenu();
	     await expect(checkedColumnsListAfterChange.selectedColumnsListWithDisabledColumns).toEqual(listViewColumnsNameAfterChange);
	     await expect(checkedColumnsListAfterChange.unSelectedColumns).not.toEqual(listViewColumnsNameAfterChange);
	     // Verify Reset button Text name matches with expected name and click on Reset button to back to original state
         await expect(healthObj.clickOnApplyResetCancelButton(healthTestData.tableSettingsMenuResetButtonText)).
                                                                toEqual(healthTestData.tableSettingsMenuResetButtonText);
	     util.waitOnlyForInvisibilityOfCarbonDataLoader();
	     // Get list of ASC list columns header after reset columns changes in table setting menu
         var listViewColumnsNameAfterReset = await healthObj.getListViewHeaders();
         await expect(listViewColumnsNameBeforeChange).toEqual(listViewColumnsNameAfterReset);
	     await healthObj.clickOnTableSettingsIcon();
	     var checkedColumnsListAfterReset = await healthObj.getCheckedUncheckedAndDisabledColumnsFromTableSettingsMenu();
	     // Verify table settings changes and ASC list view columns changes after reset
	     await expect(checkedColumnsListAfterReset.selectedColumnsListWithDisabledColumns).toEqual(listViewColumnsNameBeforeChange);
         await expect(checkedColumnsListAfterReset.unSelectedColumns).not.toEqual(listViewColumnsNameBeforeChange);
         // Close opened table setting menu by clicking on (x) icon
         await healthObj.closeTableSettingsMenu();
	});

    it('[Associated Resources list][Table Settings] Verify whether disabled columns are displaying or not. Click on Cancel button.', async function() {
	     expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
	     // select application from top insights sub section to redircet to Application details page
	     inventory_page.clickandGetTextInsightFromTopInsightsSubSection(healthTestData.leastAvailableAppLabelText);
	     // verify user redirected to Application details page
         await expect(healthObj.getListSectionLabelText()).toEqual(healthTestData.associatedResourceLabelText);
	     // Get List of columns header name from Associated Resources List
	     var listViewColumnsNameBeforeChange = await healthObj.getListViewHeaders();
	     // Verify either Table settings Icon is displaying or not
	     await expect(healthObj.isTableSettingsIconDisplayed()).toEqual(true);
	     // Click on Table settings icon
	     await healthObj.clickOnTableSettingsIcon();
         // Verify table settings menu is expanded and match table settings header text
	     await expect(healthObj.verifyIsTableSettingsMenuExpanded()).toEqual(healthTestData.tableSettingsMenuHeaderText);
	     // Verify 'All Columns' checkbox column Text match with expected result
    	 var name = await healthObj.verifyAllColumnsOptionFromTableSettings();
         await expect(name.allColumnsFieldTextName).toEqual(healthTestData.tableSettingsAllColumnsCheckboxText)
	     // Get all columns name from table settings menu
	     var allColumnsName = await healthObj.getTableSettingsMenuAllColumnNames();
	     // Get list of checked / unchecked columns name from table settings menu
	     var disabledColumns = await healthObj.getCheckedUncheckedAndDisabledColumnsFromTableSettingsMenu();
	     // Verify ASC tabled settings menu has disabled columns
	     await expect(disabledColumns.defaultCheckedDisabledColumns).not.toBe(null);
	     // Verify fetched disabled columns are present in list of columns fetched from table settings menu
	     await expect(allColumnsName).toEqual(jasmine.arrayContaining(disabledColumns.defaultCheckedDisabledColumns));
	     // Verify Cancel button Text name matches with expected name and click on cancel button to abort changes
         await expect(healthObj.clickOnApplyResetCancelButton(healthTestData.cancelButtonText)).
                                                                     toEqual(healthTestData.cancelButtonText);
	});

    it('[Associated Resources list][Table Settings] Verify table settings elements drag and drop changes are reflecting in ASC list view and in Table settings itself or not.', async function() {
	     expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
	     // select application from top insights sub section to redirect to Application details page
	     inventory_page.clickandGetTextInsightFromTopInsightsSubSection(healthTestData.leastAvailableAppLabelText);
	     // verify user redirected to Application details page
         await expect(healthObj.getListSectionLabelText()).toEqual(healthTestData.associatedResourceLabelText);
	     // Get List of columns header position from Associated Resources List before drag and drop in able settings
	     var listViewColumnsPositionBeforeDragDrop = await healthObj.getListViewHeaders();
	     // Verify either Table settings Icon is displaying or not
	     await expect(healthObj.isTableSettingsIconDisplayed()).toEqual(true);
	     // Click on Table settings icon
	     await healthObj.clickOnTableSettingsIcon();
         // Verify table settings menu is expanded and match table settings header text
	     await expect(healthObj.verifyIsTableSettingsMenuExpanded()).toEqual(healthTestData.tableSettingsMenuHeaderText);
	     // Verify 'All Columns' checkbox column Text match with expected result
    	 var name = await healthObj.verifyAllColumnsOptionFromTableSettings();
         await expect(name.allColumnsFieldTextName).toEqual(healthTestData.tableSettingsAllColumnsCheckboxText)
	     // Get all columns name  with index position from table settings menu before drag and drop
	     var allColumnsBeforeDragDrop = await healthObj.getTableSettingsMenuAllColumnNames();
	     // Get list of checked / unchecked columns name from table settings menu
         var checkedColumnsListBeforeDragDrop = await healthObj.getCheckedUncheckedAndDisabledColumnsFromTableSettingsMenu();
         // Get random List of columns to perform check/uncheck action on table settings columns
	     var elements = util.getRandomMultipleUniqueElementsFromArray(checkedColumnsListBeforeDragDrop.selectedColumns, healthTestData.twoIndex);
	     // Selected columns position before drag and drop in table settings menu
	     var elementPositionBeforeDragDrop = util.getSubArrayElementWithIndex(elements, allColumnsBeforeDragDrop);
         // Drag and Drop element
	     await healthObj.dragAndDropTableSettingsColumn(elements[healthTestData.zeroIndex], elements[healthTestData.oneIndex]);
	     // Verify Apply button Text name matches with expected name and Click on button to save changes
         await expect(healthObj.clickOnApplyResetCancelButton(healthTestData.tableSettingsMenuApplyButtonText)).
                                                                             toEqual(healthTestData.tableSettingsMenuApplyButtonText);
         util.waitOnlyForInvisibilityOfCarbonDataLoader();
         // Get List of columns header name and position from Associated Resources List after drag and drop
         var listViewColumnsPositionAfterDragDrop = await healthObj.getListViewHeaders();
         // Verify List view columns positions before and after drag and drop should not be same
         await expect(util.getArrayElementWithIndex(listViewColumnsPositionBeforeDragDrop)).not
                                                                     .toEqual(util.getArrayElementWithIndex(listViewColumnsPositionAfterDragDrop));
         // Click on Table settings icon
         await healthObj.clickOnTableSettingsIcon();
         // Verify table settings menu is expanded and match table settings header text
         await expect(healthObj.verifyIsTableSettingsMenuExpanded()).toEqual(healthTestData.tableSettingsMenuHeaderText)
         // Get all columns name  with index position from table settings menu before drag and drop
         var allColumnsAfterDragDrop = await healthObj.getTableSettingsMenuAllColumnNames();
         // Selected columns position After drag and drop in table settings menu
         var elementPositionAfterDragDrop = util.getSubArrayElementWithIndex(elements, allColumnsAfterDragDrop);
         // Verify all columns positions in tables settings should not be same before and after drag and drop
         await expect(util.getArrayElementWithIndex(allColumnsBeforeDragDrop)).not
                                                                    .toEqual(util.getArrayElementWithIndex(allColumnsAfterDragDrop));
         // Verify selected columns positions in tables settings should not be same before and after drag and drop
          await expect(elementPositionBeforeDragDrop).not.toEqual(elementPositionAfterDragDrop);
         // Verify Reset button Text name matches with expected name and click on Reset button to back to original state
         await expect(healthObj.clickOnApplyResetCancelButton(healthTestData.tableSettingsMenuResetButtonText))
                                                                     .toEqual(healthTestData.tableSettingsMenuResetButtonText);
	});

   it('[Associated Resources list][Table Settings] Verify on click to Cancel button, changes made on check/uncheck columns in table settings should not be saved in table settings menu and List view header', async function() {
	expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
	// select application from top insights sub section to redircet to Application details page
	inventory_page.clickandGetTextInsightFromTopInsightsSubSection(healthTestData.leastAvailableAppLabelText);
	// verify user redirected to Application details page
	await expect(healthObj.getListSectionLabelText()).toEqual(healthTestData.associatedResourceLabelText);
	// Get List of columns header name from Associated Resources List
	var listViewColumnsNameBeforeChange = await healthObj.getListViewHeaders();
	// Verify either Table settings Icon is displaying or not
	await expect(healthObj.isTableSettingsIconDisplayed()).toEqual(true);
	// Click on Table settings icon
	await healthObj.clickOnTableSettingsIcon();
	// Verify table settings menu is expanded and match table settings header text
	await expect(healthObj.verifyIsTableSettingsMenuExpanded()).toEqual(healthTestData.tableSettingsMenuHeaderText);
	// Verify 'All Columns' field checkbox Text match with expected result
	var name = await healthObj.verifyAllColumnsOptionFromTableSettings();
	await expect(name.allColumnsFieldTextName).toEqual(healthTestData.tableSettingsAllColumnsCheckboxText)
	// Get all columns name from table settings menu
	var allColumnsName = await healthObj.getTableSettingsMenuAllColumnNames();
	// Verify table settings columns names are matching with expected columns name
	await expect(allColumnsName).toEqual(healthTestData.associatedResourcesTableSettingsHeaders);
	// Get list of checked / unchecked columns name from table settings menu
	var unCheckedColumnsListBeforeChange = await healthObj.getCheckedUncheckedAndDisabledColumnsFromTableSettingsMenu();
	// Verify selected columns names from table settings are matching with ASC list view columns header name
	await expect(unCheckedColumnsListBeforeChange.selectedColumnsListWithDisabledColumns).toEqual(listViewColumnsNameBeforeChange);
	// Verify unselected columns names from table settings are not matching with ASC list view columns header name
	await expect(unCheckedColumnsListBeforeChange.unSelectedColumns).not.toEqual(listViewColumnsNameBeforeChange);
	// Get random List of columns to perform check/uncheck action on table settings columns
	var randomColumnsToSelect = util.getRandomMultipleUniqueElementsFromArray(unCheckedColumnsListBeforeChange.unSelectedColumns,
											   util.getNumberOfElementsToSelectFromArray(unCheckedColumnsListBeforeChange.unSelectedColumns));
	// Select unchecked columns in table settings menu
	await healthObj.clickToSelectUnselectColumnsInTableSettingsMenu(randomColumnsToSelect, allColumnsName);
	// Verify Apply button Text name matches with expected name and click on Apply button to save changes
	await expect(healthObj.clickOnApplyResetCancelButton(healthTestData.cancelButtonText)).
															   toEqual(healthTestData.cancelButtonText);
	// Get list of ASC list columns header after applying columns changes in table setting menu
	var listViewColumnsNameAfterChange = await healthObj.getListViewHeaders();
	await healthObj.clickOnTableSettingsIcon();
	await expect(healthObj.verifyIsTableSettingsMenuExpanded()).toEqual(healthTestData.tableSettingsMenuHeaderText);
	// Get list of checked / unchecked columns name from table settings menu after applying changes
	var unCheckedColumnsListAfterChange = await healthObj.getCheckedUncheckedAndDisabledColumnsFromTableSettingsMenu();
	await expect(unCheckedColumnsListAfterChange.selectedColumnsListWithDisabledColumns).toEqual(listViewColumnsNameAfterChange);
	await expect(unCheckedColumnsListAfterChange.unSelectedColumns).not.toEqual(listViewColumnsNameAfterChange);
	// Close opened table setting menu by clicking on (x) icon
	await healthObj.closeTableSettingsMenu();
});

it('[Application list][Table Settings] Verify on selecting unchecked columns, changes are reflecting in list view / table settings and resets to default view on applying reset from table settings', async function() {
	expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
	// Get List of columns header name from Applicaiton List
	var listViewColumnsNameBeforeChange = await healthObj.getListViewHeaders();
	// Verify either Table settings Icon is displaying or not
	await expect(healthObj.isTableSettingsIconDisplayed()).toEqual(true);
	// Click on Table settings icon
	await healthObj.clickOnTableSettingsIcon();
	// Verify table settings menu is expanded and match table settings header text
	await expect(healthObj.verifyIsTableSettingsMenuExpanded()).toEqual(healthTestData.tableSettingsMenuHeaderText);
	// Verify 'All Columns' field checkbox Text match with expected result
	var name = await healthObj.verifyAllColumnsOptionFromTableSettings();
	await expect(name.allColumnsFieldTextName).toEqual(healthTestData.tableSettingsAllColumnsCheckboxText)
	// Get all columns name from table settings menu
	var allColumnsName = await healthObj.getTableSettingsMenuAllColumnNames();
	// Verify table settings columns names are matching with expected columns name
	await expect(allColumnsName).toEqual(healthTestData.applicationTableSettingsHeaders);
	// Get list of checked / unchecked columns name from table settings menu
	var unCheckedColumnsListBeforeChange = await healthObj.getCheckedUncheckedAndDisabledColumnsFromTableSettingsMenu();
	// Verify selected columns names from table settings are matching with ASC list view columns header name
	await expect(unCheckedColumnsListBeforeChange.selectedColumnsListWithDisabledColumns).toEqual(listViewColumnsNameBeforeChange);
	// Verify unselected columns names from table settings are not matching with ASC list view columns header name
	await expect(unCheckedColumnsListBeforeChange.unSelectedColumns).not.toEqual(listViewColumnsNameBeforeChange);
	// Get random List of columns to perform check/uncheck action on table settings columns
	var randomColumnsToSelect = util.getRandomMultipleUniqueElementsFromArray(unCheckedColumnsListBeforeChange.unSelectedColumns,
											   util.getNumberOfElementsToSelectFromArray(unCheckedColumnsListBeforeChange.unSelectedColumns));
	// Select unchecked columns in table settings menu
	await healthObj.clickToSelectUnselectColumnsInTableSettingsMenu(randomColumnsToSelect, allColumnsName);
	// Verify Apply button Text name matches with expected name and click on Apply button to save changes
	await expect(healthObj.clickOnApplyResetCancelButton(healthTestData.tableSettingsMenuApplyButtonText)).
															   toEqual(healthTestData.tableSettingsMenuApplyButtonText);
	util.waitOnlyForInvisibilityOfCarbonDataLoader();
	// Get list of ASC list columns header after applying columns changes in table setting menu
	var listViewColumnsNameAfterChange = await healthObj.getListViewHeaders();
	await healthObj.clickOnTableSettingsIcon();
	await expect(healthObj.verifyIsTableSettingsMenuExpanded()).toEqual(healthTestData.tableSettingsMenuHeaderText);
	// Get list of checked / unchecked columns name from table settings menu after applying changes
	var unCheckedColumnsListAfterChange = await healthObj.getCheckedUncheckedAndDisabledColumnsFromTableSettingsMenu();
	await expect(unCheckedColumnsListAfterChange.selectedColumnsListWithDisabledColumns).toEqual(listViewColumnsNameAfterChange);
	await expect(unCheckedColumnsListAfterChange.unSelectedColumns).not.toEqual(listViewColumnsNameAfterChange);
	// Verify Reset button Text name matches with expected name and click on Reset button to back to original state
	await expect(healthObj.clickOnApplyResetCancelButton(healthTestData.tableSettingsMenuResetButtonText)).
															   toEqual(healthTestData.tableSettingsMenuResetButtonText);
	util.waitOnlyForInvisibilityOfCarbonDataLoader();
	// Get Applications list columns header after reset columns changes in table setting menu
    var listViewColumnsNameAfterReset = await healthObj.getListViewHeaders();
    await expect(listViewColumnsNameBeforeChange).toEqual(listViewColumnsNameAfterReset);
	await healthObj.clickOnTableSettingsIcon();
	var unCheckedColumnsListAfterReset = await healthObj.getCheckedUncheckedAndDisabledColumnsFromTableSettingsMenu();
	// Verify table settings changes and ASC list view columns changes after reset
	await expect(unCheckedColumnsListAfterReset.selectedColumnsListWithDisabledColumns).toEqual(listViewColumnsNameBeforeChange);
	await expect(unCheckedColumnsListAfterReset.unSelectedColumns).not.toEqual(listViewColumnsNameBeforeChange);
	// Close opened table setting menu by clicking on (x) icon
	await healthObj.closeTableSettingsMenu();
});

it('[Resources list][Table Settings] Verify on selecting unchecked columns, changes are reflecting in list view / table settings and resets to default view on applying reset from table settings', async function() {
	await util.clickOnTabButton(healthTestData.resourcesButtonName);
	expect(util.isSelectedTabButton(healthTestData.resourcesButtonName)).toEqual(true);
	// Get List of columns header name from Resources List
	var listViewColumnsNameBeforeChange = await healthObj.getListViewHeaders();
	// Verify either Table settings Icon is displaying or not
	await expect(healthObj.isTableSettingsIconDisplayed()).toEqual(true);
	// Click on Table settings icon
	await healthObj.clickOnTableSettingsIcon();
	// Verify table settings menu is expanded and match table settings header text
	await expect(healthObj.verifyIsTableSettingsMenuExpanded()).toEqual(healthTestData.tableSettingsMenuHeaderText);
	// Verify 'All Columns' field checkbox Text match with expected result
	var name = await healthObj.verifyAllColumnsOptionFromTableSettings();
	await expect(name.allColumnsFieldTextName).toEqual(healthTestData.tableSettingsAllColumnsCheckboxText)
	// Get all columns name from table settings menu
	var allColumnsName = await healthObj.getTableSettingsMenuAllColumnNames();
	// Verify table settings columns names are matching with expected columns name
	await expect(allColumnsName).toEqual(healthTestData.associatedResourcesTableSettingsHeaders);
	// Get list of checked / unchecked columns name from table settings menu
	var unCheckedColumnsListBeforeChange = await healthObj.getCheckedUncheckedAndDisabledColumnsFromTableSettingsMenu();
	// Verify selected columns names from table settings are matching with ASC list view columns header name
	await expect(unCheckedColumnsListBeforeChange.selectedColumnsListWithDisabledColumns).toEqual(listViewColumnsNameBeforeChange);
	// Verify unselected columns names from table settings are not matching with ASC list view columns header name
	await expect(unCheckedColumnsListBeforeChange.unSelectedColumns).not.toEqual(listViewColumnsNameBeforeChange);
	// Get random List of columns to perform check/uncheck action on table settings columns
	var randomColumnsToSelect = util.getRandomMultipleUniqueElementsFromArray(unCheckedColumnsListBeforeChange.unSelectedColumns,
											   util.getNumberOfElementsToSelectFromArray(unCheckedColumnsListBeforeChange.unSelectedColumns));
	// Select unchecked columns in table settings menu
	await healthObj.clickToSelectUnselectColumnsInTableSettingsMenu(randomColumnsToSelect, allColumnsName);
	// Verify Apply button Text name matches with expected name and click on Apply button to save changes
	await expect(healthObj.clickOnApplyResetCancelButton(healthTestData.tableSettingsMenuApplyButtonText)).
															   toEqual(healthTestData.tableSettingsMenuApplyButtonText);
	util.waitOnlyForInvisibilityOfCarbonDataLoader();
	// Get list of ASC list columns header after applying columns changes in table setting menu
	var listViewColumnsNameAfterChange = await healthObj.getListViewHeaders();
	await healthObj.clickOnTableSettingsIcon();
	await expect(healthObj.verifyIsTableSettingsMenuExpanded()).toEqual(healthTestData.tableSettingsMenuHeaderText);
	// Get list of checked / unchecked columns name from table settings menu after applying changes
	var unCheckedColumnsListAfterChange = await healthObj.getCheckedUncheckedAndDisabledColumnsFromTableSettingsMenu();
	await expect(unCheckedColumnsListAfterChange.selectedColumnsListWithDisabledColumns).toEqual(listViewColumnsNameAfterChange);
	await expect(unCheckedColumnsListAfterChange.unSelectedColumns).not.toEqual(listViewColumnsNameAfterChange);
	// Verify Reset button Text name matches with expected name and click on Reset button to back to original state
	await expect(healthObj.clickOnApplyResetCancelButton(healthTestData.tableSettingsMenuResetButtonText)).
															   toEqual(healthTestData.tableSettingsMenuResetButtonText);
	util.waitOnlyForInvisibilityOfCarbonDataLoader();
	// Get list columns header after reset columns changes in table setting menu
    var listViewColumnsNameAfterReset = await healthObj.getListViewHeaders();
    await expect(listViewColumnsNameBeforeChange).toEqual(listViewColumnsNameAfterReset);
	await healthObj.clickOnTableSettingsIcon();
	var unCheckedColumnsListAfterReset = await healthObj.getCheckedUncheckedAndDisabledColumnsFromTableSettingsMenu();
	// Verify table settings changes and ASC list view columns changes after reset
	await expect(unCheckedColumnsListAfterReset.selectedColumnsListWithDisabledColumns).toEqual(listViewColumnsNameBeforeChange);
	await expect(unCheckedColumnsListAfterReset.unSelectedColumns).not.toEqual(listViewColumnsNameBeforeChange);
	// Close opened table setting menu by clicking on (x) icon
	await healthObj.closeTableSettingsMenu();
});

it('[Application list][Table Settings] Verify on unchecking selected columns, changes are reflecting in list view / table settings and resets to default view on applying reset from table settings', async function() {
	expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
	// Get List of columns header name from Application List
	var listViewColumnsNameBeforeChange = await healthObj.getListViewHeaders();
	// Verify either Table settings Icon is displaying or not
	await expect(healthObj.isTableSettingsIconDisplayed()).toEqual(true);
	// Click on Table settings icon
	await healthObj.clickOnTableSettingsIcon();
	// Verify table settings menu is expanded and match table settings header text
	await expect(healthObj.verifyIsTableSettingsMenuExpanded()).toEqual(healthTestData.tableSettingsMenuHeaderText);
	// Verify 'All Columns' checkbox column Text match with expected result
	var name = await healthObj.verifyAllColumnsOptionFromTableSettings();
	await expect(name.allColumnsFieldTextName).toEqual(healthTestData.tableSettingsAllColumnsCheckboxText)
	// Get all columns name from table settings menu
	var allColumnsName = await healthObj.getTableSettingsMenuAllColumnNames();
	// Verify table settings columns names are matching with expected columns name
	await expect(allColumnsName).toEqual(healthTestData.applicationTableSettingsHeaders);
	// Get list of checked / unchecked columns name from table settings menu
	var checkedColumnsListBeforeChange = await healthObj.getCheckedUncheckedAndDisabledColumnsFromTableSettingsMenu();
	// Verify selected columns names from table settings are matching with ASC list view columns header name
	await expect(checkedColumnsListBeforeChange.selectedColumnsListWithDisabledColumns).toEqual(listViewColumnsNameBeforeChange);
	// Verify unselected columns names from table settings are not matching with ASC list view columns header name
	await expect(checkedColumnsListBeforeChange.unSelectedColumns).not.toEqual(listViewColumnsNameBeforeChange);
	// Get random List of columns to perform check/uncheck action on table settings columns
	var randomColumnsToSelect = util.getRandomMultipleUniqueElementsFromArray(checkedColumnsListBeforeChange.selectedColumns,
											   util.getNumberOfElementsToSelectFromArray(checkedColumnsListBeforeChange.selectedColumns));
	// Uncheck selected columns in table settings menu
	await healthObj.clickToSelectUnselectColumnsInTableSettingsMenu(randomColumnsToSelect, allColumnsName);
	// Verify Apply button Text name matches with expected name and Click on button to save changes
	await expect(healthObj.clickOnApplyResetCancelButton(healthTestData.tableSettingsMenuApplyButtonText)).
															   toEqual(healthTestData.tableSettingsMenuApplyButtonText);
	util.waitOnlyForInvisibilityOfCarbonDataLoader();
	// Get list of ASC list columns header after applying columns changes in table setting menu
	var listViewColumnsNameAfterChange = await healthObj.getListViewHeaders();
	await healthObj.clickOnTableSettingsIcon();
	await expect(healthObj.verifyIsTableSettingsMenuExpanded()).toEqual(healthTestData.tableSettingsMenuHeaderText);
	// // Get list of checked / unchecked columns name from table settings menu after applying changes
	var checkedColumnsListAfterChange = await healthObj.getCheckedUncheckedAndDisabledColumnsFromTableSettingsMenu();
	await expect(checkedColumnsListAfterChange.selectedColumnsListWithDisabledColumns).toEqual(listViewColumnsNameAfterChange);
	await expect(checkedColumnsListAfterChange.unSelectedColumns).not.toEqual(listViewColumnsNameAfterChange);
	// Verify Reset button Text name matches with expected name and click on Reset button to back to original state
	await expect(healthObj.clickOnApplyResetCancelButton(healthTestData.tableSettingsMenuResetButtonText)).
														   toEqual(healthTestData.tableSettingsMenuResetButtonText);
	util.waitOnlyForInvisibilityOfCarbonDataLoader();
	// Get list of columns header after reset columns changes in table setting menu
    var listViewColumnsNameAfterReset = await healthObj.getListViewHeaders();
    await expect(listViewColumnsNameBeforeChange).toEqual(listViewColumnsNameAfterReset);
	await healthObj.clickOnTableSettingsIcon();
	var checkedColumnsListAfterReset = await healthObj.getCheckedUncheckedAndDisabledColumnsFromTableSettingsMenu();
	// Verify table settings changes and ASC list view columns changes after reset
	await expect(checkedColumnsListAfterReset.selectedColumnsListWithDisabledColumns).toEqual(listViewColumnsNameBeforeChange);
	await expect(checkedColumnsListAfterReset.unSelectedColumns).not.toEqual(listViewColumnsNameBeforeChange);
	// Close opened table setting menu by clicking on (x) icon
	await healthObj.closeTableSettingsMenu();
});

it('[Resource list][Table Settings] Verify on unchecking selected columns, changes are reflecting in list view / table settings and resets to default view on applying reset from table settings', async function() {
	await util.clickOnTabButton(healthTestData.resourcesButtonName);
	expect(util.isSelectedTabButton(healthTestData.resourcesButtonName)).toEqual(true);
	// Get List of columns header name from Resource List
	var listViewColumnsNameBeforeChange = await healthObj.getListViewHeaders();
	// Verify either Table settings Icon is displaying or not
	await expect(healthObj.isTableSettingsIconDisplayed()).toEqual(true);
	// Click on Table settings icon
	await healthObj.clickOnTableSettingsIcon();
	// Verify table settings menu is expanded and match table settings header text
	await expect(healthObj.verifyIsTableSettingsMenuExpanded()).toEqual(healthTestData.tableSettingsMenuHeaderText);
	// Verify 'All Columns' checkbox column Text match with expected result
	var name = await healthObj.verifyAllColumnsOptionFromTableSettings();
	await expect(name.allColumnsFieldTextName).toEqual(healthTestData.tableSettingsAllColumnsCheckboxText)
	// Get all columns name from table settings menu
	var allColumnsName = await healthObj.getTableSettingsMenuAllColumnNames();
	// Verify table settings columns names are matching with expected columns name
	//await expect(allColumnsName).toEqual(healthTestData.associatedResourcesTableSettingsHeaders);
	await expect(allColumnsName).toEqual(healthTestData.associatedResourcesTableSettingsHeaders);
	// Get list of checked / unchecked columns name from table settings menu
	var checkedColumnsListBeforeChange = await healthObj.getCheckedUncheckedAndDisabledColumnsFromTableSettingsMenu();
	// Verify selected columns names from table settings are matching with ASC list view columns header name
	await expect(checkedColumnsListBeforeChange.selectedColumnsListWithDisabledColumns).toEqual(listViewColumnsNameBeforeChange);
	// Verify unselected columns names from table settings are not matching with ASC list view columns header name
	await expect(checkedColumnsListBeforeChange.unSelectedColumns).not.toEqual(listViewColumnsNameBeforeChange);
	// Get random List of columns to perform check/uncheck action on table settings columns
	var randomColumnsToSelect = util.getRandomMultipleUniqueElementsFromArray(checkedColumnsListBeforeChange.selectedColumns,
											   util.getNumberOfElementsToSelectFromArray(checkedColumnsListBeforeChange.selectedColumns));
	// Uncheck selected columns in table settings menu
	await healthObj.clickToSelectUnselectColumnsInTableSettingsMenu(randomColumnsToSelect, allColumnsName);
	// Verify Apply button Text name matches with expected name and Click on button to save changes
	await expect(healthObj.clickOnApplyResetCancelButton(healthTestData.tableSettingsMenuApplyButtonText)).
															   toEqual(healthTestData.tableSettingsMenuApplyButtonText);
	util.waitOnlyForInvisibilityOfCarbonDataLoader();
	// Get list of ASC list columns header after applying columns changes in table setting menu
	var listViewColumnsNameAfterChange = await healthObj.getListViewHeaders();
	await healthObj.clickOnTableSettingsIcon();
	await expect(healthObj.verifyIsTableSettingsMenuExpanded()).toEqual(healthTestData.tableSettingsMenuHeaderText);
	// // Get list of checked / unchecked columns name from table settings menu after applying changes
	var checkedColumnsListAfterChange = await healthObj.getCheckedUncheckedAndDisabledColumnsFromTableSettingsMenu();
	await expect(checkedColumnsListAfterChange.selectedColumnsListWithDisabledColumns).toEqual(listViewColumnsNameAfterChange);
	await expect(checkedColumnsListAfterChange.unSelectedColumns).not.toEqual(listViewColumnsNameAfterChange);
	// Verify Reset button Text name matches with expected name and click on Reset button to back to original state
	await expect(healthObj.clickOnApplyResetCancelButton(healthTestData.tableSettingsMenuResetButtonText)).
														   toEqual(healthTestData.tableSettingsMenuResetButtonText);
	util.waitOnlyForInvisibilityOfCarbonDataLoader();
	// Get list of columns header after reset columns changes in table setting menu
    var listViewColumnsNameAfterReset = await healthObj.getListViewHeaders();
    await expect(listViewColumnsNameBeforeChange).toEqual(listViewColumnsNameAfterReset);
	await healthObj.clickOnTableSettingsIcon();
	var checkedColumnsListAfterReset = await healthObj.getCheckedUncheckedAndDisabledColumnsFromTableSettingsMenu();
	// Verify table settings changes and ASC list view columns changes after reset
	await expect(checkedColumnsListAfterReset.selectedColumnsListWithDisabledColumns).toEqual(listViewColumnsNameBeforeChange);
	await expect(checkedColumnsListAfterReset.unSelectedColumns).not.toEqual(listViewColumnsNameBeforeChange);
	// Close opened table setting menu by clicking on (x) icon
	await healthObj.closeTableSettingsMenu();
});

it('[Application list][Table Settings] Verify whether disabled columns are displaying or not. Click on Cancel button.', async function() {
	expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
	var listViewColumnsNameBeforeChange = await healthObj.getListViewHeaders();
	// Verify either Table settings Icon is displaying or not
	await expect(healthObj.isTableSettingsIconDisplayed()).toEqual(true);
	// Click on Table settings icon
	await healthObj.clickOnTableSettingsIcon();
	// Verify table settings menu is expanded and match table settings header text
	await expect(healthObj.verifyIsTableSettingsMenuExpanded()).toEqual(healthTestData.tableSettingsMenuHeaderText);
	// Verify 'All Columns' checkbox column Text match with expected result
	var name = await healthObj.verifyAllColumnsOptionFromTableSettings();
	await expect(name.allColumnsFieldTextName).toEqual(healthTestData.tableSettingsAllColumnsCheckboxText)
	// Get all columns name from table settings menu
	var allColumnsName = await healthObj.getTableSettingsMenuAllColumnNames();
	// Get list of checked / unchecked columns name from table settings menu
	var disabledColumns = await healthObj.getCheckedUncheckedAndDisabledColumnsFromTableSettingsMenu();
	// Verify ASC tabled settings menu has disabled columns
	await expect(disabledColumns.defaultCheckedDisabledColumns).not.toBe(null);
	// Verify fetched disabled columns are present in list of columns fetched from table settings menu
	await expect(allColumnsName).toEqual(jasmine.arrayContaining(disabledColumns.defaultCheckedDisabledColumns));
	// Verify Cancel button Text name matches with expected name and click on cancel button to abort changes
	await expect(healthObj.clickOnApplyResetCancelButton(healthTestData.cancelButtonText)).
																toEqual(healthTestData.cancelButtonText);
});

it('[Resource list][Table Settings] Verify whether disabled columns are displaying or not. Click on Cancel button.', async function() {
	await util.clickOnTabButton(healthTestData.resourcesButtonName);
	expect(util.isSelectedTabButton(healthTestData.resourcesButtonName)).toEqual(true);
	// Get List of columns header name from Resources List
	var listViewColumnsNameBeforeChange = await healthObj.getListViewHeaders();
	// Verify either Table settings Icon is displaying or not
	await expect(healthObj.isTableSettingsIconDisplayed()).toEqual(true);
	// Click on Table settings icon
	await healthObj.clickOnTableSettingsIcon();
	// Verify table settings menu is expanded and match table settings header text
	await expect(healthObj.verifyIsTableSettingsMenuExpanded()).toEqual(healthTestData.tableSettingsMenuHeaderText);
	// Verify 'All Columns' checkbox column Text match with expected result
	var name = await healthObj.verifyAllColumnsOptionFromTableSettings();
	await expect(name.allColumnsFieldTextName).toEqual(healthTestData.tableSettingsAllColumnsCheckboxText)
	// Get all columns name from table settings menu
	var allColumnsName = await healthObj.getTableSettingsMenuAllColumnNames();
	// Get list of checked / unchecked columns name from table settings menu
	var disabledColumns = await healthObj.getCheckedUncheckedAndDisabledColumnsFromTableSettingsMenu();
	// Verify ASC tabled settings menu has disabled columns
	await expect(disabledColumns.defaultCheckedDisabledColumns).not.toBe(null);
	// Verify fetched disabled columns are present in list of columns fetched from table settings menu
	await expect(allColumnsName).toEqual(jasmine.arrayContaining(disabledColumns.defaultCheckedDisabledColumns));
	// Verify Cancel button Text name matches with expected name and click on cancel button to abort changes
	await expect(healthObj.clickOnApplyResetCancelButton(healthTestData.cancelButtonText)).
																toEqual(healthTestData.cancelButtonText);
});

it('[Application list][Table Settings] Verify table settings elements drag and drop changes are reflecting in Application list view and in Table settings itself or not.', async function() {
	expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
	var listViewColumnsPositionBeforeDragDrop = await healthObj.getListViewHeaders();
	// Verify either Table settings Icon is displaying or not
	await expect(healthObj.isTableSettingsIconDisplayed()).toEqual(true);
	// Click on Table settings icon
	await healthObj.clickOnTableSettingsIcon();
	// Verify table settings menu is expanded and match table settings header text
	await expect(healthObj.verifyIsTableSettingsMenuExpanded()).toEqual(healthTestData.tableSettingsMenuHeaderText);
	// Verify 'All Columns' checkbox column Text match with expected result
	var name = await healthObj.verifyAllColumnsOptionFromTableSettings();
	await expect(name.allColumnsFieldTextName).toEqual(healthTestData.tableSettingsAllColumnsCheckboxText)
	// Get all columns name  with index position from table settings menu before drag and drop
	var allColumnsBeforeDragDrop = await healthObj.getTableSettingsMenuAllColumnNames();
	// Get list of checked / unchecked columns name from table settings menu
	var checkedColumnsListBeforeDragDrop = await healthObj.getCheckedUncheckedAndDisabledColumnsFromTableSettingsMenu();
	// Get random List of columns to perform check/uncheck action on table settings columns
	var elements = util.getRandomMultipleUniqueElementsFromArray(checkedColumnsListBeforeDragDrop.selectedColumns, healthTestData.twoIndex);
	// Selected columns position before drag and drop in table settings menu
	var elementPositionBeforeDragDrop = util.getSubArrayElementWithIndex(elements, allColumnsBeforeDragDrop);
	// Drag and Drop element
	await healthObj.dragAndDropTableSettingsColumn(elements[healthTestData.zeroIndex], elements[healthTestData.oneIndex]);
	// Verify Apply button Text name matches with expected name and Click on button to save changes
	await expect(healthObj.clickOnApplyResetCancelButton(healthTestData.tableSettingsMenuApplyButtonText)).
																		toEqual(healthTestData.tableSettingsMenuApplyButtonText);
	util.waitOnlyForInvisibilityOfCarbonDataLoader();
	// Get List of columns header name and position from Associated Resources List after drag and drop
	var listViewColumnsPositionAfterDragDrop = await healthObj.getListViewHeaders();
	// Verify List view columns positions before and after drag and drop should not be same
	await expect(util.getArrayElementWithIndex(listViewColumnsPositionBeforeDragDrop)).not
																.toEqual(util.getArrayElementWithIndex(listViewColumnsPositionAfterDragDrop));
	// Click on Table settings icon
	await healthObj.clickOnTableSettingsIcon();
	// Verify table settings menu is expanded and match table settings header text
	await expect(healthObj.verifyIsTableSettingsMenuExpanded()).toEqual(healthTestData.tableSettingsMenuHeaderText)
	// Get all columns name  with index position from table settings menu before drag and drop
	var allColumnsAfterDragDrop = await healthObj.getTableSettingsMenuAllColumnNames();
	// Selected columns position After drag and drop in table settings menu
	var elementPositionAfterDragDrop = util.getSubArrayElementWithIndex(elements, allColumnsAfterDragDrop);
	// Verify all columns positions in tables settings should not be same before and after drag and drop
	await expect(util.getArrayElementWithIndex(allColumnsBeforeDragDrop)).not
															   .toEqual(util.getArrayElementWithIndex(allColumnsAfterDragDrop));
	// Verify selected columns positions in tables settings should not be same before and after drag and drop
	 await expect(elementPositionBeforeDragDrop).not.toEqual(elementPositionAfterDragDrop);
	// Verify Reset button Text name matches with expected name and click on Reset button to back to original state
	await expect(healthObj.clickOnApplyResetCancelButton(healthTestData.tableSettingsMenuResetButtonText))
																.toEqual(healthTestData.tableSettingsMenuResetButtonText);
});

it('[Resource list][Table Settings] Verify table settings elements drag and drop changes are reflecting in Resource list view and in Table settings itself or not.', async function() {
	await util.clickOnTabButton(healthTestData.resourcesButtonName);
	expect(util.isSelectedTabButton(healthTestData.resourcesButtonName)).toEqual(true);
	var listViewColumnsPositionBeforeDragDrop = await healthObj.getListViewHeaders();
	// Verify either Table settings Icon is displaying or not
	await expect(healthObj.isTableSettingsIconDisplayed()).toEqual(true);
	// Click on Table settings icon
	await healthObj.clickOnTableSettingsIcon();
	// Verify table settings menu is expanded and match table settings header text
	await expect(healthObj.verifyIsTableSettingsMenuExpanded()).toEqual(healthTestData.tableSettingsMenuHeaderText);
	// Verify 'All Columns' checkbox column Text match with expected result
	var name = await healthObj.verifyAllColumnsOptionFromTableSettings();
	await expect(name.allColumnsFieldTextName).toEqual(healthTestData.tableSettingsAllColumnsCheckboxText)
	// Get all columns name  with index position from table settings menu before drag and drop
	var allColumnsBeforeDragDrop = await healthObj.getTableSettingsMenuAllColumnNames();
	// Get list of checked / unchecked columns name from table settings menu
	var checkedColumnsListBeforeDragDrop = await healthObj.getCheckedUncheckedAndDisabledColumnsFromTableSettingsMenu();
	// Get random List of columns to perform check/uncheck action on table settings columns
	var elements = util.getRandomMultipleUniqueElementsFromArray(checkedColumnsListBeforeDragDrop.selectedColumns, healthTestData.twoIndex);
	// Selected columns position before drag and drop in table settings menu
	var elementPositionBeforeDragDrop = util.getSubArrayElementWithIndex(elements, allColumnsBeforeDragDrop);
	// Drag and Drop element
	await healthObj.dragAndDropTableSettingsColumn(elements[healthTestData.zeroIndex], elements[healthTestData.oneIndex]);
	// Verify Apply button Text name matches with expected name and Click on button to save changes
	await expect(healthObj.clickOnApplyResetCancelButton(healthTestData.tableSettingsMenuApplyButtonText)).
																		toEqual(healthTestData.tableSettingsMenuApplyButtonText);
	util.waitOnlyForInvisibilityOfCarbonDataLoader();
	// Get List of columns header name and position from Associated Resources List after drag and drop
	var listViewColumnsPositionAfterDragDrop = await healthObj.getListViewHeaders();
	// Verify List view columns positions before and after drag and drop should not be same
	await expect(util.getArrayElementWithIndex(listViewColumnsPositionBeforeDragDrop)).not
																.toEqual(util.getArrayElementWithIndex(listViewColumnsPositionAfterDragDrop));
	// Click on Table settings icon
	await healthObj.clickOnTableSettingsIcon();
	// Verify table settings menu is expanded and match table settings header text
	await expect(healthObj.verifyIsTableSettingsMenuExpanded()).toEqual(healthTestData.tableSettingsMenuHeaderText)
	// Get all columns name  with index position from table settings menu before drag and drop
	var allColumnsAfterDragDrop = await healthObj.getTableSettingsMenuAllColumnNames();
	// Selected columns position After drag and drop in table settings menu
	var elementPositionAfterDragDrop = util.getSubArrayElementWithIndex(elements, allColumnsAfterDragDrop);
	// Verify all columns positions in tables settings should not be same before and after drag and drop
	await expect(util.getArrayElementWithIndex(allColumnsBeforeDragDrop)).not
															   .toEqual(util.getArrayElementWithIndex(allColumnsAfterDragDrop));
	// Verify selected columns positions in tables settings should not be same before and after drag and drop
	 await expect(elementPositionBeforeDragDrop).not.toEqual(elementPositionAfterDragDrop);
	// Verify Reset button Text name matches with expected name and click on Reset button to back to original state
	await expect(healthObj.clickOnApplyResetCancelButton(healthTestData.tableSettingsMenuResetButtonText))
																.toEqual(healthTestData.tableSettingsMenuResetButtonText);
});


// Disabled because of Protractor limitation [Not able to automate donut chart]

	// it('Verify Warning servers count from Warning application details', async function(){
	// 	launchpadObj.clickOnHamburgerMenu(launchpadTestData.leftNavigationExpanded);
	// 	launchpadObj.clickOnleftNavigationMenuBasedOnName(launchpadTestData.aIOpsIntelligentITOperationsBtn);
	// 	launchpadObj.clickLeftNavCardBasedOnName(launchpadTestData.dashboardCard);
	// 	dashboardObj.open();
	// 	// Verify warning row count on alerts card should be less than equal to warning alerts on health card
	// 	expect(dashboardObj.getWarningAlertsRowCount()).toBeLessThanOrEqual(dashboardObj.getWarningAlertsCountFromHealthCard());
	// 	var warningAppDetails = await dashboardObj.getFirstWarningAlertDetailsFromAlertsCard();
	// 	if(warningAppDetails != false){
	// 		dashboardObj.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.health);
	// 		healthObj.open();
	// 		await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 		healthObj.selectAlertTypeFromDropdown(healthTestData.warningAlertName);
	// 		await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 		await healthObj.clickOnApplicationViewDetailsButton(warningAppDetails[0]);
	// 		await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 		var warningServerCount = await healthObj.getAffectedServerCountFromAssociatedResourcesTable(healthTestData.warningAlertName);
	// 		// Compare CI impacted count on Dashboard with affected resource count on Health
	// 		expect(warningAppDetails[1]).toEqual(warningServerCount);
	// 	}
	// });

	// Disabled because of Protractor limitation [Not able to automate donut chart]

	// it('Verify if Resource details page for Warning Resource is loaded or not', async function(){
	// 	launchpadObj.clickOnHamburgerMenu(launchpadTestData.leftNavigationExpanded);
	// 	launchpadObj.clickOnleftNavigationMenuBasedOnName(launchpadTestData.aIOpsIntelligentITOperationsBtn);
	// 	launchpadObj.clickLeftNavCardBasedOnName(launchpadTestData.dashboardCard);
	// 	dashboardObj.open();
	// 	// Verify warning row count on alerts card should be less than equal to warning alerts on health card
	// 	expect(dashboardObj.getWarningAlertsRowCount()).toBeLessThanOrEqual(dashboardObj.getWarningAlertsCountFromHealthCard());
	// 	var warningAppDetails = await dashboardObj.getFirstWarningAlertDetailsFromAlertsCard();
	// 	if(warningAppDetails != false){
	// 		dashboardObj.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.health);
	// 		healthObj.open();
	// 		await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 		healthObj.selectAlertTypeFromDropdown(healthTestData.warningAlertName);
	// 		await healthObj.clickOnApplicationViewDetailsButton(warningAppDetails[0]);
	// 		// Verify the Application name text for App details page header
	// 		expect(healthObj.getAppNameFromAppDetailsPageHeaderText()).toEqual(warningAppDetails[0]);
	// 		// Verify Associated Resources table label text
	// 		expect(healthObj.getAssociatedResourcesTableLabelText()).toEqual(healthTestData.associatedResourcesTableText);
	// 		// Verify count from Associated Resources table label with row count in the table
	// 		expect(healthObj.getResourceCountFromAssociatedResourcesTableLabel()).toEqual(healthObj.getRowCountFromAssociatedResourcesAppsTable());
	// 		healthObj.clickOnNavigationButtonLinks(dashboardTestData.health);
	// 		healthObj.open();
	// 		healthObj.selectAlertTypeFromDropdown(healthTestData.warningAlertName);
	// 		await healthObj.clickOnApplicationViewDetailsButton(warningAppDetails[0]);
	// 		// Verify Resource name from the app details page with Hostname field value on resource details page
	// 		var resourceName = await healthObj.clickOnFirstAffectedResourceViewDetailsButton(healthTestData.warningAlertName);
	// 		await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 		expect(healthObj.getResourceNameFromResourceDetailsPageText(healthTestData.overviewHostnameLabelText)).toEqual(resourceName);
	// 		// Verify if Events and Tickets links are displayed or not in Alerts table
	// 		expect(healthObj.isDisplayedResourceDetailsTableSectionLinks(healthTestData.eventsLinkText)).toBe(true);
	// 		expect(healthObj.isDisplayedResourceDetailsTableSectionLinks(healthTestData.ticketsLinkText)).toBe(true);
	// 		// Verify Associated Applications table label text
	// 		expect(healthObj.getAssociatedAppsTableLabelText()).toEqual(healthTestData.associatedApplicationsTableText);
	// 		// Verify count from Associated Applications table label with row count in the table
	// 		expect(healthObj.getAppsCountFromAssociatedAppsTableLabel()).toEqual(healthObj.getRowCountFromAssociatedResourcesAppsTable());
	// 		// Verify if warning event is present or not
	// 		var resDetails = await healthObj.verifyCellValueFromTicketsTable(healthTestData.eventsSeverityColumnName, healthTestData.warningAlertName);
	// 		expect(resDetails).toEqual(true);
	// 	}
	// });

	// Disabled because Carbonization is still in progress for Command centre UI

	// it("Verify command center view from Application tab is loaded or not", async function(){
	// 	await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 	expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
	// 	healthObj.selectAlertTypeFromDropdown(healthTestData.criticalAlertName);
	// 	await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 	healthObj.clickOnCommandCenterExpandButton();
	// 	await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 	expect(healthObj.getCurrentPageBreadcrumbNameText()).toEqual(healthTestData.commandCenterLabel);
	// 	expect(util.isSelectedTabButton(healthTestData.applicationViewTabName)).toEqual(true);
	// 	expect(healthObj.getCommandCenterHealthStatusSectionLabelText()).toEqual(healthTestData.healthStatusLabelText);
	// 	expect(healthObj.verifyTopInsightsSubSectionLabelText(healthTestData.leastHealthyAppLabelText)).toEqual(true);
	// 	expect(healthObj.verifyTopInsightsSubSectionLabelText(healthTestData.mostHealthyAppLabelText)).toEqual(true);
	// 	expect(healthObj.verifyTopInsightsSubSectionLabelText(healthTestData.appsWithMostIncidentsLabelText)).toEqual(true);
	// 	expect(healthObj.verifyTopInsightsSubSectionLabelText(healthTestData.appWithMostHighPriorityIncidentsLabelText)).toEqual(true);
	// 	expect(healthObj.getCommandCenterAppsResSectionLabelText()).toEqual(healthTestData.applicationsLabelText);
	// 	var appCountFromLabel = await healthObj.getCountFromCommandCenterAppsResSectionLabelText();
	// 	if(appCountFromLabel > 0){
	// 		expect(appCountFromLabel).toEqual(await healthObj.getCountFromCommandCenterBarChartXaxisLabels(healthTestData.criticalAlertName));
	// 	}
	// 	expect(await healthObj.getListOfOptionsFromViewByDropdown()).toContain(healthTestData.environmentDropdownValue);
	// 	expect(await healthObj.getListOfOptionsFromViewByDropdown()).toContain(healthTestData.providerDropdownValue);
	// 	expect(await healthObj.getListOfOptionsFromViewByDropdown()).toContain(healthTestData.teamDropdownValue);
	// 	expect(await healthObj.getListOfOptionsFromViewByDropdown()).toContain(healthTestData.categoryDropdownValue);
	// 	healthObj.clickOnCommandCenterCompressButton();
	// 	await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 	expect(healthObj.getHealthHeaderTitleText()).toEqual(healthTestData.headerTitle);
	// });

	// it("Verify command center view from Resources tab is loaded or not", async function(){
	// 	util.clickOnTabButton(healthTestData.resourcesButtonName);
	// 	await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 	expect(util.isSelectedTabButton(healthTestData.resourcesButtonName)).toEqual(true);
	// 	healthObj.selectAlertTypeFromDropdown(healthTestData.criticalAlertName);
	// 	await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 	healthObj.clickOnCommandCenterExpandButton();
	// 	await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 	expect(healthObj.getCurrentPageBreadcrumbNameText()).toEqual(healthTestData.commandCenterLabel);
	// 	expect(util.isSelectedTabButton(healthTestData.resourceViewTabName)).toEqual(true);
	// 	expect(healthObj.getCommandCenterHealthStatusSectionLabelText()).toEqual(healthTestData.healthStatusLabelText);
	// 	expect(healthObj.verifyTopInsightsSubSectionLabelText(healthTestData.resourcesWithMaxCPUUtilizationLabelText)).toEqual(true);
	// 	expect(healthObj.verifyTopInsightsSubSectionLabelText(healthTestData.resourcesWithMostIncidentsLabelText)).toEqual(true);
	// 	expect(healthObj.verifyTopInsightsSubSectionLabelText(healthTestData.resourcesWithLeastHealthLabelText)).toEqual(true);
	// 	expect(healthObj.getCommandCenterAppsResSectionLabelText()).toEqual(healthTestData.resourcesLabelText);
	// 	var resCountFromLabel = await healthObj.getCountFromCommandCenterAppsResSectionLabelText();
	// 	if(resCountFromLabel > 0){
	// 		expect(resCountFromLabel).toEqual(await healthObj.getCountFromCommandCenterBarChartXaxisLabels(healthTestData.criticalAlertName));
	// 	}
	// 	expect(await healthObj.getListOfOptionsFromViewByDropdown()).toContain(healthTestData.environmentDropdownValue);
	// 	expect(await healthObj.getListOfOptionsFromViewByDropdown()).toContain(healthTestData.providerDropdownValue);
	// 	expect(await healthObj.getListOfOptionsFromViewByDropdown()).toContain(healthTestData.teamDropdownValue);
	// 	expect(await healthObj.getListOfOptionsFromViewByDropdown()).toContain(healthTestData.categoryDropdownValue);
	// 	healthObj.clickOnCommandCenterCompressButton();
	// 	await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 	expect(healthObj.getHealthHeaderTitleText()).toEqual(healthTestData.headerTitle);
	// });

	// it("Verify 'Critical' Applications count from Health page with Command center view Applications count", async function(){
	// 	await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 	expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
	// 	// For Critical alerts
	// 	var status = await healthObj.selectAlertTypeFromDropdown(healthTestData.criticalAlertName);
	// 	await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 	if(status == 0){
	// 		var appCountFromDountChart = 0;
	// 	}
	// 	else{
	// 		// Get app count from Health status donut chart
	// 		var appCountFromDountChart = await healthObj.getCountFromDonutChart();
	// 	}
	// 	if(appCountFromDountChart != 0){
	// 		// Get filter name and app count in list from breakdown section
	// 		var sectionKeysList = await healthObj.getListOfBreakdownSectionWithCount();
	// 		healthObj.clickOnCommandCenterExpandButton();
	// 		await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 		expect(util.isSelectedTabButton(healthTestData.applicationViewTabName)).toEqual(true);
	// 		expect(appCountFromDountChart).toEqual(await healthObj.getCountFromCommandCenterBarChartXaxisLabels(healthTestData.criticalAlertName));
	// 		expect(appCountFromDountChart).toEqual(await healthObj.getCountFromCommandCenterAppsResSectionLabelText());
	// 		for(var i =0; i<sectionKeysList.length; i++){
	// 			// Extract app count from String
	// 			var appCountFromBreakdownSection = util.stringToInteger(sectionKeysList[i].split("(")[1].split(")")[0]);
	// 			// Get list of count from both subheaders [Section Label count, Alert Label count] in apps/resources table
	// 			var appCountFromCommandCenter = await healthObj.getAppResCountFromCommandCenterTableSubHeaderLabel(sectionKeysList[i], healthTestData.criticalAlertName);
	// 			var appCardCountFromTable = await healthObj.getAppResCardsCountFromTableSection(sectionKeysList[i], healthTestData.criticalAlertName);
	// 			// Validate app count from breakdown section with app count in command center table section label
	// 			expect(appCountFromBreakdownSection).toEqual(appCountFromCommandCenter[0]);
	// 			// Validate app count from breakdown section with app count in command center table alert label
	// 			expect(appCountFromBreakdownSection).toEqual(appCountFromCommandCenter[1]);
	// 			// Validate app cards count in a section with app count table section label
	// 			expect(appCardCountFromTable).toEqual(appCountFromCommandCenter[1]);
	// 		}
	// 	}
	// });

	// it("Verify 'Warning' Applications count from Health page with Command center view Applications count", async function(){
	// 	await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 	expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
	// 	// For Warning alerts
	// 	var status = await healthObj.selectAlertTypeFromDropdown(healthTestData.warningAlertName);
	// 	await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 	if(status == 0){
	// 		var appCountFromDountChart = 0;
	// 	}
	// 	else{
	// 		// Get app count from Health status donut chart
	// 		var appCountFromDountChart = await healthObj.getCountFromDonutChart();
	// 	}
	// 	if(appCountFromDountChart != 0){
	// 		// Get filter name and app count in list from breakdown section
	// 		var sectionKeysList = await healthObj.getListOfBreakdownSectionWithCount();
	// 		healthObj.clickOnCommandCenterExpandButton();
	// 		await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 		expect(util.isSelectedTabButton(healthTestData.applicationViewTabName)).toEqual(true);
	// 		expect(appCountFromDountChart).toEqual(await healthObj.getCountFromCommandCenterBarChartXaxisLabels(healthTestData.warningAlertName));
	// 		expect(appCountFromDountChart).toEqual(await healthObj.getCountFromCommandCenterAppsResSectionLabelText());
	// 		for(var i =0; i<sectionKeysList.length; i++){
	// 			// Extract app count from String
	// 			var appCountFromBreakdownSection = util.stringToInteger(sectionKeysList[i].split("(")[1].split(")")[0]);
	// 			// Get list of count from both subheaders [Section Label count, Alert Label count] in apps/resources table
	// 			var appCountFromCommandCenter = await healthObj.getAppResCountFromCommandCenterTableSubHeaderLabel(sectionKeysList[i], healthTestData.warningAlertName);
	// 			var appCardCountFromTable = await healthObj.getAppResCardsCountFromTableSection(sectionKeysList[i], healthTestData.warningAlertName);
	// 			// Validate app count from breakdown section with app count in command center table section label
	// 			expect(appCountFromBreakdownSection).toEqual(appCountFromCommandCenter[0]);
	// 			// Validate app count from breakdown section with app count in command center table alert label
	// 			expect(appCountFromBreakdownSection).toEqual(appCountFromCommandCenter[1]);
	// 			// Validate app cards count in a section with app count table section label
	// 			expect(appCardCountFromTable).toEqual(appCountFromCommandCenter[1]);
	// 		}
	// 	}
	// });

	// it("Verify 'Healthy' Applications count from Health page with Command center view Applications count", async function(){
	// 	await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 	expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
	// 	// For Healthy alerts
	// 	var status = await healthObj.selectAlertTypeFromDropdown(healthTestData.healthyAlertName);
	// 	await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 	if(status == 0){
	// 		var appCountFromDountChart = 0;
	// 	}
	// 	else{
	// 		// Get app count from Health status donut chart
	// 		var appCountFromDountChart = await healthObj.getCountFromDonutChart();
	// 	}
	// 	if(appCountFromDountChart != 0){
	// 		// Get filter name and app count in list from breakdown section
	// 		var sectionKeysList = await healthObj.getListOfBreakdownSectionWithCount();
	// 		await healthObj.clickOnCommandCenterExpandButton();
	// 		await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 		expect(await util.isSelectedTabButton(healthTestData.applicationViewTabName)).toEqual(true);
	// 		expect(appCountFromDountChart).toEqual(await healthObj.getCountFromCommandCenterBarChartXaxisLabels(healthTestData.healthyAlertName));
	// 		expect(appCountFromDountChart).toEqual(await healthObj.getCountFromCommandCenterAppsResSectionLabelText());
	// 		for(var i =0; i<sectionKeysList.length; i++){
	// 			// Extract app count from String
	// 			var appCountFromBreakdownSection = util.stringToInteger(sectionKeysList[i].split("(")[1].split(")")[0]);
	// 			// Get list of count from both subheaders [Section Label count, Alert Label count] in apps/resources table
	// 			var appCountFromCommandCenter = await healthObj.getAppResCountFromCommandCenterTableSubHeaderLabel(sectionKeysList[i], healthTestData.healthyAlertName);
	// 			var appCardCountFromTable = await healthObj.getAppResCardsCountFromTableSection(sectionKeysList[i], healthTestData.healthyAlertName);
	// 			// Validate app count from breakdown section with app count in command center table section label
	// 			await expect(appCountFromBreakdownSection).toEqual(appCountFromCommandCenter[0]);
	// 			// Validate app count from breakdown section with app count in command center table alert label
	// 			await expect(appCountFromBreakdownSection).toEqual(appCountFromCommandCenter[1]);
	// 			// Validate app cards count in a section with app count table section label
	// 			await expect(appCardCountFromTable).toEqual(appCountFromCommandCenter[1]);
	// 		}
	// 	}
	// });

	// it("Verify 'Critical' Resources count from Health page with Command center view Resources count", async function(){
	// 	util.clickOnTabButton(healthTestData.resourcesButtonName);
	// 	await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 	expect(util.isSelectedTabButton(healthTestData.resourcesButtonName)).toEqual(true);
	// 	// For Critical alerts
	// 	var status = await healthObj.selectAlertTypeFromDropdown(healthTestData.criticalAlertName);
	// 	await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 	if(status == 0){
	// 		var resCountFromDonutChart = 0;
	// 	}
	// 	else{
	// 		// Get resources count from Health status donut chart
	// 		var resCountFromDonutChart = await healthObj.getCountFromDonutChart();
	// 	}
	// 	if(resCountFromDonutChart != 0){
	// 		// Get filter name and resources count in list from breakdown section
	// 		var sectionKeysList = await healthObj.getListOfBreakdownSectionWithCount();
	// 		healthObj.clickOnCommandCenterExpandButton();
	// 		await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 		expect(util.isSelectedTabButton(healthTestData.resourceViewTabName)).toEqual(true);
	// 		expect(resCountFromDonutChart).toEqual(await healthObj.getCountFromCommandCenterBarChartXaxisLabels(healthTestData.criticalAlertName));
	// 		expect(resCountFromDonutChart).toEqual(await healthObj.getCountFromCommandCenterAppsResSectionLabelText());
	// 		for(var i =0; i<sectionKeysList.length; i++){
	// 			// Extract resource count from String
	// 			var resCountFromBreakdownSection = util.stringToInteger(sectionKeysList[i].split("(")[1].split(")")[0]);
	// 			// Get list of count from both subheaders [Section Label count, Alert Label count] in apps/resources table
	// 			var resCountFromCommandCenter = await healthObj.getAppResCountFromCommandCenterTableSubHeaderLabel(sectionKeysList[i], healthTestData.criticalAlertName);
	// 			var resCardCountFromTable = await healthObj.getAppResCardsCountFromTableSection(sectionKeysList[i], healthTestData.criticalAlertName);
	// 			// Validate resources count from breakdown section with resources count in command center table section label
	// 			expect(resCountFromBreakdownSection).toEqual(resCountFromCommandCenter[0]);
	// 			// Validate resources count from breakdown section with resources count in command center table alert label
	// 			expect(resCountFromBreakdownSection).toEqual(resCountFromCommandCenter[1]);
	// 			// Validate resources cards count in a section with resources count table section label
	// 			expect(resCardCountFromTable).toEqual(resCountFromCommandCenter[1]);
	// 		}
	// 	}
	// });

	// it("Verify 'Warning' Resources count from Health page with Command center view Resources count", async function(){
	// 	util.clickOnTabButton(healthTestData.resourcesButtonName);
	// 	await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 	expect(util.isSelectedTabButton(healthTestData.resourcesButtonName)).toEqual(true);
	// 	// For Warning alerts
	// 	var status = await healthObj.selectAlertTypeFromDropdown(healthTestData.warningAlertName);
	// 	await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 	if(status == 0){
	// 		var resCountFromDonutChart = 0;
	// 	}
	// 	else{
	// 		// Get resources count from Health status donut chart
	// 		var resCountFromDonutChart = await healthObj.getCountFromDonutChart();
	// 	}
	// 	if(resCountFromDonutChart != 0){
	// 		// Get filter name and resources count in list from breakdown section
	// 		var sectionKeysList = await healthObj.getListOfBreakdownSectionWithCount();
	// 		healthObj.clickOnCommandCenterExpandButton();
	// 		await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 		expect(util.isSelectedTabButton(healthTestData.resourceViewTabName)).toEqual(true);
	// 		expect(resCountFromDonutChart).toEqual(await healthObj.getCountFromCommandCenterBarChartXaxisLabels(healthTestData.warningAlertName));
	// 		expect(resCountFromDonutChart).toEqual(await healthObj.getCountFromCommandCenterAppsResSectionLabelText());
	// 		for(var i =0; i<sectionKeysList.length; i++){
	// 			// Extract resource count from String
	// 			var resCountFromBreakdownSection = util.stringToInteger(sectionKeysList[i].split("(")[1].split(")")[0]);
	// 			// Get list of count from both subheaders [Section Label count, Alert Label count] in apps/resources table
	// 			var resCountFromCommandCenter = await healthObj.getAppResCountFromCommandCenterTableSubHeaderLabel(sectionKeysList[i], healthTestData.warningAlertName);
	// 			var resCardCountFromTable = await healthObj.getAppResCardsCountFromTableSection(sectionKeysList[i], healthTestData.warningAlertName);
	// 			// Validate resources count from breakdown section with resources count in command center table section label
	// 			expect(resCountFromBreakdownSection).toEqual(resCountFromCommandCenter[0]);
	// 			// Validate resources count from breakdown section with resources count in command center table alert label
	// 			expect(resCountFromBreakdownSection).toEqual(resCountFromCommandCenter[1]);
	// 			// Validate resources cards count in a section with resources count table section label
	// 			expect(resCardCountFromTable).toEqual(resCountFromCommandCenter[1]);
	// 		}
	// 	}
	// });

	// it("Verify 'Healthy' Resources count from Health page with Command center view Resources count", async function(){
	// 	util.clickOnTabButton(healthTestData.resourcesButtonName);
	// 	await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 	expect(util.isSelectedTabButton(healthTestData.resourcesButtonName)).toEqual(true);
	// 	// For Healthy alerts
	// 	var status = await healthObj.selectAlertTypeFromDropdown(healthTestData.healthyAlertName);
	// 	await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 	if(status == 0){
	// 		var resCountFromDonutChart = 0;
	// 	}
	// 	else{
	// 		// Get resources count from Health status donut chart
	// 		var resCountFromDonutChart = await healthObj.getCountFromDonutChart();
	// 	}
	// 	if(resCountFromDonutChart != 0){
	// 		// Get filter name and resources count in list from breakdown section
	// 		var sectionKeysList = await healthObj.getListOfBreakdownSectionWithCount();
	// 		healthObj.clickOnCommandCenterExpandButton();
	// 		await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 		expect(util.isSelectedTabButton(healthTestData.resourceViewTabName)).toEqual(true);
	// 		expect(resCountFromDonutChart).toEqual(await healthObj.getCountFromCommandCenterBarChartXaxisLabels(healthTestData.healthyAlertName));
	// 		expect(resCountFromDonutChart).toEqual(await healthObj.getCountFromCommandCenterAppsResSectionLabelText());
	// 		for(var i = 0; i < sectionKeysList.length; i++){
	// 			// Extract resource count from String
	// 			var resCountFromBreakdownSection = util.stringToInteger(sectionKeysList[i].split("(")[1].split(")")[0]);
	// 			// Get list of count from both subheaders [Section Label count, Alert Label count] in apps/resources table
	// 			var resCountFromCommandCenter = await healthObj.getAppResCountFromCommandCenterTableSubHeaderLabel(sectionKeysList[i], healthTestData.healthyAlertName);
	// 			// Commenting this validation as taking too much time to calculate all cards
	// 			// var resCardCountFromTable = await healthObj.getAppResCardsCountFromTableSection(sectionKeysList[i], healthTestData.healthyAlertName);
	// 			// Validate resources count from breakdown section with resources count in command center table section label
	// 			await expect(resCountFromBreakdownSection).toEqual(resCountFromCommandCenter[0]);
	// 			// Validate resources count from breakdown section with resources count in command center table alert label
	// 			await expect(resCountFromBreakdownSection).toEqual(resCountFromCommandCenter[1]);
	// 			// Validate resources cards count in a section with resources count table section label
	// 			// expect(resCardCountFromTable).toEqual(resCountFromCommandCenter[1]);
	// 		}
	// 	}
	// });

	// it("Verify Progess bar chart opacity and 'Applications' cards in table", async function(){
	// 	await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 	expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
	// 	// Get Healthy count
	// 	var status = await healthObj.selectAlertTypeFromDropdown(healthTestData.healthyAlertName);
	// 	await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 	if(status == 0){
	// 		var healthyAppCountFromDonutChart = 0;
	// 	}
	// 	else{
	// 		// Get Healthy app count from Health status donut chart
	// 		var healthyAppCountFromDonutChart = await healthObj.getCountFromDonutChart();
	// 	}
	// 	// Get Warning count
	// 	status = await healthObj.selectAlertTypeFromDropdown(healthTestData.warningAlertName);
	// 	await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 	if(status == 0){
	// 		var warningAppCountFromDonutChart = 0;
	// 	}
	// 	else{
	// 		// Get Warning app count from Health status donut chart
	// 		var warningAppCountFromDonutChart = await healthObj.getCountFromDonutChart();
	// 	}
	// 	// Get Critical count
	// 	status = await healthObj.selectAlertTypeFromDropdown(healthTestData.criticalAlertName);
	// 	await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 	if(status == 0){
	// 		var criticalAppCountFromDonutChart = 0;
	// 	}
	// 	else{
	// 		// Get Critical app count from Health status donut chart
	// 		var criticalAppCountFromDonutChart = await healthObj.getCountFromDonutChart();
	// 	}
	// 	healthObj.clickOnCommandCenterExpandButton();
	// 	await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 	expect(util.isSelectedTabButton(healthTestData.applicationViewTabName)).toEqual(true);
	// 	// For Critical alerts
	// 	if(criticalAppCountFromDonutChart != 0){
	// 		await healthObj.selectSpecificProgressBar(healthTestData.criticalAlertName);
	// 		await healthObj.deselectSpecificProgressBar(healthTestData.warningAlertName);
	// 		await healthObj.deselectSpecificProgressBar(healthTestData.healthyAlertName);
	// 		// Verify progress bar opacity for each alert
	// 		expect(await healthObj.checkSelectionOfAlertsProgressBar(healthTestData.criticalAlertName)).toBe(true);
	// 		expect(await healthObj.checkSelectionOfAlertsProgressBar(healthTestData.warningAlertName)).toBe(false);
	// 		expect(await healthObj.checkSelectionOfAlertsProgressBar(healthTestData.healthyAlertName)).toBe(false);
	// 		expect(await healthObj.getCountFromCommandCenterAppsResSectionLabelText()).toEqual(await healthObj.getTooltipCountForProgressBarFromCommandCenterView(healthTestData.criticalAlertName));
	// 	}
	// 	// For Warning alerts
	// 	if(warningAppCountFromDonutChart != 0){
	// 		await healthObj.selectSpecificProgressBar(healthTestData.warningAlertName);
	// 		await healthObj.deselectSpecificProgressBar(healthTestData.criticalAlertName);
	// 		await healthObj.deselectSpecificProgressBar(healthTestData.healthyAlertName);
	// 		// Verify progress bar opacity for each alert
	// 		expect(await healthObj.checkSelectionOfAlertsProgressBar(healthTestData.criticalAlertName)).toBe(false);
	// 		expect(await healthObj.checkSelectionOfAlertsProgressBar(healthTestData.warningAlertName)).toBe(true);
	// 		expect(await healthObj.checkSelectionOfAlertsProgressBar(healthTestData.healthyAlertName)).toBe(false);
	// 		expect(await healthObj.getCountFromCommandCenterAppsResSectionLabelText()).toEqual(await healthObj.getTooltipCountForProgressBarFromCommandCenterView(healthTestData.warningAlertName));
	// 	}
	// 	// For Healthy alerts
	// 	if(healthyAppCountFromDonutChart != 0){
	// 		await healthObj.selectSpecificProgressBar(healthTestData.healthyAlertName);
	// 		await healthObj.deselectSpecificProgressBar(healthTestData.warningAlertName);
	// 		await healthObj.deselectSpecificProgressBar(healthTestData.criticalAlertName);
	// 		// Verify progress bar opacity for each alert
	// 		expect(await healthObj.checkSelectionOfAlertsProgressBar(healthTestData.criticalAlertName)).toBe(false);
	// 		expect(await healthObj.checkSelectionOfAlertsProgressBar(healthTestData.warningAlertName)).toBe(false);
	// 		expect(await healthObj.checkSelectionOfAlertsProgressBar(healthTestData.healthyAlertName)).toBe(true);
	// 		expect(await healthObj.getCountFromCommandCenterAppsResSectionLabelText()).toEqual(await healthObj.getTooltipCountForProgressBarFromCommandCenterView(healthTestData.healthyAlertName));
	// 	}
	// });

	// it("Verify Progess bar chart opacity and 'Resources' cards in table", async function(){
	// 	util.clickOnTabButton(healthTestData.resourcesButtonName);
	// 	await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 	expect(util.isSelectedTabButton(healthTestData.resourcesButtonName)).toEqual(true);
	// 	// Get Healthy count
	// 	var status = await healthObj.selectAlertTypeFromDropdown(healthTestData.healthyAlertName);
	// 	await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 	if(status == 0){
	// 		var healthyResCountFromDonutChart = 0;
	// 	}
	// 	else{
	// 		// Get Healthy resources count from Health status donut chart
	// 		var healthyResCountFromDonutChart = await healthObj.getCountFromDonutChart();
	// 	}
	// 	// Get Warning count
	// 	status = await healthObj.selectAlertTypeFromDropdown(healthTestData.warningAlertName);
	// 	await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 	if(status == 0){
	// 		var warningResCountFromDonutChart = 0;
	// 	}
	// 	else{
	// 		// Get Warning resources count from Health status donut chart
	// 		var warningResCountFromDonutChart = await healthObj.getCountFromDonutChart();
	// 	}
	// 	// Get Critical count
	// 	status = await healthObj.selectAlertTypeFromDropdown(healthTestData.criticalAlertName);
	// 	await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 	if(status == 0){
	// 		var criticalResCountFromDonutChart = 0;
	// 	}
	// 	else{
	// 		// Get Critical resources count from Health status donut chart
	// 		var criticalResCountFromDonutChart = await healthObj.getCountFromDonutChart();
	// 	}
	// 	healthObj.clickOnCommandCenterExpandButton();
	// 	await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 	expect(util.isSelectedTabButton(healthTestData.resourceViewTabName)).toEqual(true);
	// 	// For Critical alerts
	// 	if(criticalResCountFromDonutChart != 0){
	// 		await healthObj.selectSpecificProgressBar(healthTestData.criticalAlertName);
	// 		await healthObj.deselectSpecificProgressBar(healthTestData.warningAlertName);
	// 		await healthObj.deselectSpecificProgressBar(healthTestData.healthyAlertName);
	// 		// Verify progress bar opacity for each alert
	// 		expect(await healthObj.checkSelectionOfAlertsProgressBar(healthTestData.criticalAlertName)).toBe(true);
	// 		expect(await healthObj.checkSelectionOfAlertsProgressBar(healthTestData.warningAlertName)).toBe(false);
	// 		expect(await healthObj.checkSelectionOfAlertsProgressBar(healthTestData.healthyAlertName)).toBe(false);
	// 		expect(await healthObj.getCountFromCommandCenterAppsResSectionLabelText()).toEqual(await healthObj.getTooltipCountForProgressBarFromCommandCenterView(healthTestData.criticalAlertName));
	// 	}
	// 	// For Warning alerts
	// 	if(warningResCountFromDonutChart != 0){
	// 		await healthObj.selectSpecificProgressBar(healthTestData.warningAlertName);
	// 		await healthObj.deselectSpecificProgressBar(healthTestData.criticalAlertName);
	// 		await healthObj.deselectSpecificProgressBar(healthTestData.healthyAlertName);
	// 		// Verify progress bar opacity for each alert
	// 		expect(await healthObj.checkSelectionOfAlertsProgressBar(healthTestData.criticalAlertName)).toBe(false);
	// 		expect(await healthObj.checkSelectionOfAlertsProgressBar(healthTestData.warningAlertName)).toBe(true);
	// 		expect(await healthObj.checkSelectionOfAlertsProgressBar(healthTestData.healthyAlertName)).toBe(false);
	// 		expect(await healthObj.getCountFromCommandCenterAppsResSectionLabelText()).toEqual(await healthObj.getTooltipCountForProgressBarFromCommandCenterView(healthTestData.warningAlertName));
	// 	}
	// 	// For Healthy alerts
	// 	if(healthyResCountFromDonutChart != 0){
	// 		await healthObj.selectSpecificProgressBar(healthTestData.healthyAlertName);
	// 		await healthObj.deselectSpecificProgressBar(healthTestData.warningAlertName);
	// 		await healthObj.deselectSpecificProgressBar(healthTestData.criticalAlertName);
	// 		// Verify progress bar opacity for each alert
	// 		expect(await healthObj.checkSelectionOfAlertsProgressBar(healthTestData.criticalAlertName)).toBe(false);
	// 		expect(await healthObj.checkSelectionOfAlertsProgressBar(healthTestData.warningAlertName)).toBe(false);
	// 		expect(await healthObj.checkSelectionOfAlertsProgressBar(healthTestData.healthyAlertName)).toBe(true);
	// 		expect(await healthObj.getCountFromCommandCenterAppsResSectionLabelText()).toEqual(await healthObj.getTooltipCountForProgressBarFromCommandCenterView(healthTestData.healthyAlertName));
	// 	}
	// });

	// it("Verify 'Critical' servers count from Critical application details and Verify mapped resource to it, when navigate from command center view", async function(){
	// 	launchpadObj.clickOnHamburgerMenu(launchpadTestData.leftNavigationExpanded);
	// 	launchpadObj.clickOnleftNavigationMenuBasedOnName(launchpadTestData.aIOpsIntelligentITOperationsBtn);
	// 	launchpadObj.clickLeftNavCardBasedOnName(launchpadTestData.dashboardCard);
	// 	dashboardObj.open();
	// 	// Verify critical row count on alerts card should be less than equal to critical alerts on health card
	// 	expect(dashboardObj.getCriticalAlertsRowCount()).toBeLessThanOrEqual(dashboardObj.getCriticalAlertsCountFromHealthCard());
	// 	var criticalAppDetails = await dashboardObj.getFirstCriticalAlertDetailsFromAlertsCard();
	// 	if(criticalAppDetails != false){
	// 		dashboardObj.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.health);
	// 		healthObj.open();
	// 		await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 		healthObj.selectAlertTypeFromDropdown(healthTestData.criticalAlertName);
	// 		await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 		healthObj.clickOnCommandCenterExpandButton();
	// 		await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 		expect(await healthObj.isDisplayedAppResourceCard(criticalAppDetails[0])).toBe(true);
	// 		await healthObj.clickOnAppResourceCard(criticalAppDetails[0]);
	// 		await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 		// Verify the Application name text for App details page header
	// 		expect(healthObj.getAppNameFromAppDetailsPageHeaderText()).toEqual(criticalAppDetails[0]);
	// 		// Verify application name from breadcrumb navigation
	// 		expect(healthObj.getCurrentPageBreadcrumbNameText()).toEqual(criticalAppDetails[0]);
	// 		// Verify Associated Resources table label text
	// 		expect(healthObj.getAssociatedResourcesTableLabelText()).toEqual(healthTestData.associatedResourcesTableText);
	// 		// Verify count from Associated Resources table label with row count in the table
	// 		expect(healthObj.getResourceCountFromAssociatedResourcesTableLabel()).toEqual(healthObj.getRowCountFromAssociatedResourcesAppsTable());
	// 		healthObj.clickOnNavigationButtonLinks(dashboardTestData.health);
	// 		healthObj.open();
	// 		healthObj.selectAlertTypeFromDropdown(healthTestData.criticalAlertName);
	// 		await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 		healthObj.clickOnCommandCenterExpandButton();
	// 		await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 		expect(await healthObj.isDisplayedAppResourceCard(criticalAppDetails[0])).toBe(true);
	// 		await healthObj.clickOnAppResourceCard(criticalAppDetails[0]);
	// 		await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 		var criticalServerCount = await healthObj.getAffectedServerCountFromAssociatedResourcesTable(healthTestData.criticalAlertName);
	// 		// Compare CI impacted count on Dashboard with affected resource count on Health
	// 		expect(criticalAppDetails[1]).toEqual(criticalServerCount);
	// 		healthObj.searchResourcesFromAssociatedResourcesTable(healthTestData.criticalAlertName);
	// 		expect(await healthObj.isNoDataMessageTextPresentInTable()).toBe(false);
	// 		var isNoDataAvailable = await healthObj.isNoDataMessageTextPresentInTable();
	// 		if(isNoDataAvailable != true){
	// 			// Verify Resource name from the app details page with Hostname field value on resource details page
	// 			var resourceName = await healthObj.clickOnFirstAffectedResourceViewDetailsButton(healthTestData.criticalAlertName);
	// 			await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 			// Validate resource name from application details page with hostname field value from overview section
	// 			expect(healthObj.getResourceNameFromResourceDetailsPageText(healthTestData.overviewHostnameLabelText)).toEqual(resourceName);
	// 			// Verify if Events and Tickets links are displayed or not in Alerts table
	// 			expect(healthObj.isDisplayedResourceDetailsTableSectionLinks(healthTestData.eventsLinkText)).toBe(true);
	// 			expect(healthObj.isDisplayedResourceDetailsTableSectionLinks(healthTestData.ticketsLinkText)).toBe(true);
	// 			// Verify Associated Applications table label text
	// 			expect(healthObj.getAssociatedAppsTableLabelText()).toEqual(healthTestData.associatedApplicationsTableText);
	// 			// Verify count from Associated Applications table label with row count in the table
	// 			expect(healthObj.getAppsCountFromAssociatedAppsTableLabel()).toEqual(healthObj.getRowCountFromAssociatedResourcesAppsTable());
	// 			// Verify the application mapped to resource in resource details page
	// 			expect(healthObj.isAppPresentInAssociatedApplicationsTable(criticalAppDetails[0])).toBe(true);
	// 			// Verify if critical event is present or not
	// 			var resDetails = await healthObj.verifyCellValueFromTicketsTable(healthTestData.eventsSeverityColumnName, healthTestData.criticalAlertName);
	// 			expect(resDetails).toEqual(true);
	// 		}
	// 	}
	// });

	// it("Verify 'Warning' servers count from Warning application details and Verify mapped resource to it, when navigate from command center view", async function(){
	// 	launchpadObj.clickOnHamburgerMenu(launchpadTestData.leftNavigationExpanded);
	// 	launchpadObj.clickOnleftNavigationMenuBasedOnName(launchpadTestData.aIOpsIntelligentITOperationsBtn);
	// 	launchpadObj.clickLeftNavCardBasedOnName(launchpadTestData.dashboardCard);
	// 	dashboardObj.open();
	// 	// Verify warning row count on alerts card should be less than equal to warning alerts on health card
	// 	expect(dashboardObj.getWarningAlertsRowCount()).toBeLessThanOrEqual(dashboardObj.getWarningAlertsCountFromHealthCard());
	// 	var warningAppDetails = await dashboardObj.getFirstWarningAlertDetailsFromAlertsCard();
	// 	if(warningAppDetails != false){
	// 		dashboardObj.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.health);
	// 		healthObj.open();
	// 		await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 		healthObj.selectAlertTypeFromDropdown(healthTestData.warningAlertName);
	// 		await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 		healthObj.clickOnCommandCenterExpandButton();
	// 		await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 		expect(await healthObj.isDisplayedAppResourceCard(warningAppDetails[0])).toBe(true);
	// 		await healthObj.clickOnAppResourceCard(warningAppDetails[0]);
	// 		await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 		// Verify the Application name text for App details page header
	// 		expect(healthObj.getAppNameFromAppDetailsPageHeaderText()).toEqual(warningAppDetails[0]);
	// 		// Verify application name from breadcrumb navigation
	// 		expect(healthObj.getCurrentPageBreadcrumbNameText()).toEqual(warningAppDetails[0]);
	// 		// Verify Associated Resources table label text
	// 		expect(healthObj.getAssociatedResourcesTableLabelText()).toEqual(healthTestData.associatedResourcesTableText);
	// 		// Verify count from Associated Resources table label with row count in the table
	// 		expect(healthObj.getResourceCountFromAssociatedResourcesTableLabel()).toEqual(healthObj.getRowCountFromAssociatedResourcesAppsTable());
	// 		healthObj.clickOnNavigationButtonLinks(dashboardTestData.health);
	// 		healthObj.open();
	// 		healthObj.selectAlertTypeFromDropdown(healthTestData.warningAlertName);
	// 		await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 		healthObj.clickOnCommandCenterExpandButton();
	// 		await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 		expect(await healthObj.isDisplayedAppResourceCard(warningAppDetails[0])).toBe(true);
	// 		await healthObj.clickOnAppResourceCard(warningAppDetails[0]);
	// 		await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 		var warningServerCount = await healthObj.getAffectedServerCountFromAssociatedResourcesTable(healthTestData.warningAlertName);
	// 		// Compare CI impacted count on Dashboard with affected resource count on Health
	// 		expect(warningAppDetails[1]).toEqual(warningServerCount);
	// 		healthObj.searchResourcesFromAssociatedResourcesTable(healthTestData.warningAlertName);
	// 		expect(await healthObj.isNoDataMessageTextPresentInTable()).toBe(false);
	// 		var isNoDataAvailable = await healthObj.isNoDataMessageTextPresentInTable();
	// 		if(isNoDataAvailable != true){
	// 			// Verify Resource name from the app details page with Hostname field value on resource details page
	// 			var resourceName = await healthObj.clickOnFirstAffectedResourceViewDetailsButton(healthTestData.warningAlertName);
	// 			await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 			// Validate resource name from application details page with hostname field value from overview section
	// 			expect(healthObj.getResourceNameFromResourceDetailsPageText(healthTestData.overviewHostnameLabelText)).toEqual(resourceName);
	// 			// Verify if Events and Tickets links are displayed or not in Alerts table
	// 			expect(healthObj.isDisplayedResourceDetailsTableSectionLinks(healthTestData.eventsLinkText)).toBe(true);
	// 			expect(healthObj.isDisplayedResourceDetailsTableSectionLinks(healthTestData.ticketsLinkText)).toBe(true);
	// 			// Verify Associated Applications table label text
	// 			expect(healthObj.getAssociatedAppsTableLabelText()).toEqual(healthTestData.associatedApplicationsTableText);
	// 			// Verify count from Associated Applications table label with row count in the table
	// 			expect(healthObj.getAppsCountFromAssociatedAppsTableLabel()).toEqual(healthObj.getRowCountFromAssociatedResourcesAppsTable());
	// 			// Verify the application mapped to resource in resource details page
	// 			expect(await healthObj.isAppPresentInAssociatedApplicationsTable(warningAppDetails[0])).toBe(true);
	// 			// Verify if warning event is present or not
	// 			var resDetails = await healthObj.verifyCellValueFromTicketsTable(healthTestData.eventsSeverityColumnName, healthTestData.warningAlertName);
	// 			expect(resDetails).toEqual(true);
	// 		}
	// 	}
	// });

	// it("Verify Resource details page for 'Critical' Resource is loaded, when navigate from command center view", async function(){
	// 	launchpadObj.clickOnHamburgerMenu(launchpadTestData.leftNavigationExpanded);
	// 	launchpadObj.clickOnleftNavigationMenuBasedOnName(launchpadTestData.aIOpsIntelligentITOperationsBtn);
	// 	launchpadObj.clickLeftNavCardBasedOnName(launchpadTestData.dashboardCard);
	// 	dashboardObj.open();
	// 	// Verify critical row count on alerts card should be less than equal to critical alerts on health card
	// 	expect(dashboardObj.getCriticalAlertsRowCount()).toBeLessThanOrEqual(dashboardObj.getCriticalAlertsCountFromHealthCard());
	// 	var criticalAppCount = await dashboardObj.getCriticalAlertsCountFromHealthCard();
	// 	if(criticalAppCount != 0){
	// 		dashboardObj.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.health);
	// 		healthObj.open();
	// 		await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 		util.clickOnTabButton(healthTestData.resourcesButtonName);
	// 		await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 		healthObj.selectAlertTypeFromDropdown(healthTestData.criticalAlertName);
	// 		await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 		healthObj.clickOnCommandCenterExpandButton();
	// 		await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 		expect(util.isSelectedTabButton(healthTestData.resourceViewTabName)).toEqual(true);
	// 		healthObj.clickOnFirstAppResourceCard();
	// 		await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 		var resourceName = await healthObj.getHealthHeaderTitleText();
	// 		if(resourceName.includes(healthTestData.ibmProvider)){
	// 			// Verify if Events and Tickets links are displayed or not in Alerts table
	// 			expect(healthObj.isDisplayedResourceDetailsTableSectionLinks(healthTestData.eventsLinkText)).toBe(true);
	// 			expect(healthObj.isDisplayedResourceDetailsTableSectionLinks(healthTestData.ticketsLinkText)).toBe(true);
	// 			// Verify Associated Applications table label text
	// 			expect(healthObj.getAssociatedAppsTableLabelText()).toEqual(healthTestData.associatedApplicationsTableText);
	// 			// Verify count from Associated Applications table label with row count in the table
	// 			expect(healthObj.getAppsCountFromAssociatedAppsTableLabel()).toEqual(healthObj.getRowCountFromAssociatedResourcesAppsTable());
	// 			// Verify if critical event is present or not
	// 			var resDetails = await healthObj.verifyCellValueFromTicketsTable(healthTestData.eventsSeverityColumnName, healthTestData.criticalAlertName);
	// 			expect(resDetails).toEqual(true);
	// 		}
	// 		else{
	// 			// Verify if Summary and Open Tickets links are displayed or not
	// 			expect(healthObj.isDisplayedSummaryAndOpenTicketsSectionLinks(healthTestData.summaryLinkText)).toBe(true);
	// 			expect(healthObj.isDisplayedSummaryAndOpenTicketsSectionLinks(healthTestData.openTicketsLinkText)).toBe(true);
	// 		}
	// 	}
	// });

	// it("Verify Resource details page for 'Warning' Resource is loaded, when navigate from command center view", async function(){
	// 	launchpadObj.clickOnHamburgerMenu(launchpadTestData.leftNavigationExpanded);
	// 	launchpadObj.clickOnleftNavigationMenuBasedOnName(launchpadTestData.aIOpsIntelligentITOperationsBtn);
	// 	launchpadObj.clickLeftNavCardBasedOnName(launchpadTestData.dashboardCard);
	// 	dashboardObj.open();
	// 	// Verify warning row count on alerts card should be less than equal to warning alerts on health card
	// 	expect(dashboardObj.getWarningAlertsRowCount()).toBeLessThanOrEqual(dashboardObj.getWarningAlertsCountFromHealthCard());
	// 	var warningAppCount = await dashboardObj.getWarningAlertsCountFromHealthCard();
	// 	if(warningAppCount != 0){
	// 		dashboardObj.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.health);
	// 		healthObj.open();
	// 		await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 		util.clickOnTabButton(healthTestData.resourcesButtonName);
	// 		await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 		healthObj.selectAlertTypeFromDropdown(healthTestData.warningAlertName);
	// 		await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 		healthObj.clickOnCommandCenterExpandButton();
	// 		await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 		expect(util.isSelectedTabButton(healthTestData.resourceViewTabName)).toEqual(true);
	// 		healthObj.clickOnFirstAppResourceCard();
	// 		await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 		// Verify if Events and Tickets links are displayed or not in Alerts table
	// 		expect(healthObj.isDisplayedResourceDetailsTableSectionLinks(healthTestData.eventsLinkText)).toBe(true);
	// 		expect(healthObj.isDisplayedResourceDetailsTableSectionLinks(healthTestData.ticketsLinkText)).toBe(true);
	// 		// Verify Associated Applications table label text
	// 		expect(healthObj.getAssociatedAppsTableLabelText()).toEqual(healthTestData.associatedApplicationsTableText);
	// 		// Verify count from Associated Applications table label with row count in the table
	// 		expect(healthObj.getAppsCountFromAssociatedAppsTableLabel()).toEqual(healthObj.getRowCountFromAssociatedResourcesAppsTable());
	// 		// Verify if warning event is present or not
	// 		var resDetails = await healthObj.verifyCellValueFromTicketsTable(healthTestData.eventsSeverityColumnName, healthTestData.warningAlertName);
	// 		expect(resDetails).toEqual(true);
	// 	}
	// });xxxxx

	it('Verify User can select multiple resources (maximum 4) from same category to compare the metrics', async function(){
		expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
		await util.clickOnTabButton(healthTestData.resourcesButtonName);
		expect(util.isSelectedTabButton(healthTestData.resourcesButtonName)).toEqual(true);
		await healthObj.clickOnHealthStatusOption(healthTestData.resourceHealthyText);
		expect(await healthObj.isTableSearchBarDisplayed()).toBe(true);
		await healthObj.isViewDetailsButtonDisplayed(healthTestData.zeroIndex);
		await healthObj.clickOnViewDetails();
		await expect(healthObj.getViewDetailsOverviewLabelText()).toEqual(healthTestData.OverviewTitle);
		util.waitOnlyForInvisibilityOfCarbonDataLoader();
		await util.clickOnTabButton(healthTestData.metrics);
		expect(await healthObj.clickOnMetricsTabAndSelectDropDownValues()).toBe(true);
	})

	it('Verify the resource category count remains same when switching between the different metrics trend', async function(){
		expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
		await util.clickOnTabButton(healthTestData.resourcesButtonName);
		expect(util.isSelectedTabButton(healthTestData.resourcesButtonName)).toEqual(true);
		await healthObj.clickOnHealthStatusOption(healthTestData.resourceHealthyText);
		expect(await healthObj.isTableSearchBarDisplayed()).toBe(true);
		await healthObj.isViewDetailsButtonDisplayed(healthTestData.zeroIndex);
		await healthObj.clickOnViewDetails();
		await expect(healthObj.getViewDetailsOverviewLabelText()).toEqual(healthTestData.OverviewTitle);
		util.waitOnlyForInvisibilityOfCarbonDataLoader();
		await util.clickOnTabButton(healthTestData.metrics);
		expect(await healthObj.clickOnMetricsTabAndCompare()).toBe(true);
	})

    afterAll(async function() {
		await launchpadObj.clickOnLogoutAndLogin(browser.params.username, browser.params.password);
	});
});
