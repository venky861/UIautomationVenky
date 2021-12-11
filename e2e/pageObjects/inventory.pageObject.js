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
var timeout = require('../../testData/timeout.json');
var launchpadPage = require('./launchpad.pageObject.js'),
	launchpadObj = new launchpadPage();
var dashboardPage = require('./dashboard.pageObject.js'),
	dashboardObj = new dashboardPage();
var	dashboardTestData = require('../../testData/cards/dashboardTestData.json');
var launchpadTestData = require('../../testData/cards/launchpadTestData.json');
var inventoryTestData = require('../../testData/cards/inventoryTestData.json');
var frames = require('../../testData/frames.json');
var healthAndInventoryUtil = require('../../helpers/healthAndInventoryUtil.js');
var	appUrls = require('../../testData/appUrls.json');
var path = require('path');


var defaultConfig = {
	InventoryHeaderTileTextCss: "label.pagetitle",
	resourcesTabXpath: "//div[@class='tabWrapper']/button/span[contains(text(), 'Resources')]",
	applicationsTabXpath: "//div[@class='tabWrapper']/button/span[contains(text(), 'Application')]",
	applicationResourceTableHeaderCss: "div .applicationListView h4",
	applicationResourceTableCellCss: "ibm-table table.bx--data-table tbody tr:first-child td:first-child",
	applyFilterButtonCss: "[id^=applyFilterButton]",
	totalAssestsCss: "div.header-vis div.col > span:nth-child(1)",
	healthFilterXpath  : "//span[contains(text(),'filter by health')]",
	graphChartCss: "g.highcharts-level-group-1",
	appNameFromTopInsightsXpath: "//h6[contains(text(),'{0}')]//ancestor::div[2]//ul[@class='listWithDoubleside']//a",
	resourceCountForAppsFromTopInsightsXpath: "//h6[contains(text(),'{0}')]//ancestor::div[2]//ul[@class='listWithDoubleside']//span/span",
	mainSectionsXpath: "//h4[contains(text(),'')]",
	topInsightsLabelCss: "div.kbnMarkdown__body p",
	appsResBreakdownSectionLabelCss: "div .hcms-header h4",
	appsResByRegionSectionLabelCss: "div .hcms-header h4",
	topInsightsSubSectionHeaderLabelCss: "h6.titleWithDoubleLine",
	appResListTableCss: "ibm-table table.bx--data-table tbody",
	appResBreakdownRectsXpath: "//div[contains(@class,'chart-container')]//*[name()='rect' and @class='node-overlay']",
	resourcesByRegionCss: "text.geo-text",
	appResBreakdownDropdownCss: "div.bx--dropdown button",
	appResBreakdownDropdownListCss: "ul.bx--multi-select",
	appResBreakdownDropdownValCss: ".bx--list-box__menu-item[title = '{0}']",
	applicationResourcesBreakDownCss : "div .svg-ie-support g.graph-node",
    toolTipTextCss : ".main-tooltip.bx--tooltip",   
	topInsightsResourceCountCss: "table.status_table td:nth-child(2)",
	dataCenterOrMulticloudResourceCountXpath : "//h6[contains(text(), '{0}')]/ancestor::div[@class='row']/following-sibling::div//span[1]",
	dataCenterOrMulticloudResourceCategoryXpath : "//h6[contains(text(), '{0}')]/ancestor::div[@class='row']/following-sibling::div//span[2]",
	resourceCountFromTopInsightsSubSectionXpath: "//h6[contains(text(),'{0}')]//ancestor::div[1]//ul[@class='listWithDoubleside']//span/span[1]",
	resourceCountForCategoryFromTopInsightsXpath: "//h6[contains(text(),'{0}')]//ancestor::div[1]//ul[@class='listWithDoubleside']//span[@title='{1}']//parent::li//span/span[1]",
	breakdownSubSectionNoDataCss: "div lib-app-treemap .noDataToShow",
	breakdownValueTextCss: ".graph-node .node__asset__text.node__title",
	applicationResourceTableColumnTitleCss:".bx--data-table-container .bx--table-sort__flex, #title",
	applicationResourceTableOverflowMenuCss: ".bx--data-table-container .bx--data-table tbody td ibm-overflow-menu button",
	applicationResourceTablePageNumberCss:".bx--select__page-number .bx--select__arrow",
	applicationResourceTableItemsPerPageCss:".bx--select__item-count .bx--select__arrow",
	applicationResourceTableRowCss:".bx--data-table-container .bx--data-table tbody tr",
	applicationResourceTableContentCss:".bx--data-table-container .bx--data-table tbody td",
	applicationResourceTablePaginationDropdown: ".bx--select.bx--select--inline.bx--select__page-number",
	listViewCheckboxXpath: "//td[@class='bx--table-column-checkbox']//*[@class='bx--form-item bx--checkbox-wrapper']//*[@class='bx--checkbox']",
    checkboxXpath: "//td[@class='bx--table-column-checkbox']//*[@class='bx--form-item bx--checkbox-wrapper']",
	//table and export
	tableExportCss: "ibm-overflow-menu svg",
	resrcsTableExportCss: ".bx--overflow-menu-options__option",
	tableExportModalHeader: "ibm-modal-header header p",
	tableExportRadioOptions: "section ibm-radio-group ibm-radio",
	tableExportRadioOptionsClick:"section ibm-radio-group ibm-radio span",
	tableExportButtons: "ibm-modal-footer button",
	tableExportCloseIcon: "ibm-modal-header header button.bx--modal-close",
	tableHeaderCss: "div.bx--table-header-label",
	tableSearchBarCss: "div ibm-table-toolbar ibm-table-toolbar-content ibm-table-toolbar-search",
	tablePaginationCss: "div ibm-pagination",
	aciveSortColumnCss: ".bx--table-sort.bx--table-sort--active",
	searchBarInput: "ibm-table-toolbar-search div input.bx--search-input",
	searchBarCloseCss: ".bx--search-close",
	geoMapZoomIn: "geo-map span#zoomInButton",
    geoMapZoomOut: "geo-map span#zoomOutButton",
	geoMapReset: "geo-map span#recenterButton",
	gepMapActiveBoxCss: ".geo.geo--selected",
	applicationResourceTablePageNumberCss: ".bx--select__page-number",
	applicationResourceTableItemsPerPageCss: ".bx--select__item-count",
	viewDetailsCss: ".bx--overflow-menu-options__option-content",
	viewDetailsOverviewCss: "div.overview label.title",
	//global filters
	globalFilterCss:"app-global-filter .ops__side-nav",
	globalFilterCategoriesCss: "app-global-filter .filter-section .parentLabel",
	globalFilterProviderCategoriesCss: "app-global-filter .filter-section .groupHeading",
	pCss: "app-global-Filter .groupHeading, .dropdownWrapper",
	dcGlobalFilterXpath: "//*[@class='bx--col-md-6 bx--col-sm-12']//*[@title='IBM DC']",
	mcGlobalFilterXpath: "//*[@class='bx--col-md-6 bx--col-sm-12 custom-class-example']",
	resourceSummaryDCSubtitleTextCss: "div .datacenter-wrapper label.resourceSummarytitleText",
	resourceSummaryMCSubtitleTextCss: "div .multicloud-wrapper label.resourceSummarytitleText",
	resourceSummaryDCSubtitleValuecss: "div .datacenter-wrapper span.resourceSummaryvalue",
	resourceSummaryMCSubtitleValuecss: "div .multicloud-wrapper span.resourceSummaryvalue",
	breakdownValuesCss: "rect.node-overlay",
	breakdownActiveBoxTextCss: "g.node--selected text",
	globalFilterContentCss: ".bx--fieldset.mt-3",
	geoMapCountryPathCss: "div .svg-ie-support g.geo path.node",
	geoMapToolTipTextCss: "geo-map .tooltip--right.main-tooltip.bx--tooltip",
	geoMapCountryTextCss: "g.geo .geo-text",
	geoMapUnknownCss: ".count-resource.bx--link",
	geoMap:"g.geo",
	tagsTextCss:"#DcTagasTab-header",
	tagNameLinkXpath: "//td[1]//a[@class='bx--link']",
	tagSubSystemLinkXpath : "//td[3]//a[@class='bx--link']",
	tagSubsectionNoDataCss: "div .no-data-table .no-data-row",
	overviewPageTitle    : "div.headerElm .pagetitle",
	resourceOverviewSubSectionContentCss: "div.container-overview span",                                     
	resourceOverviewSubSectionlabelCss: "div.container-overview label",
    //Assign Remove Tags
    assignRemoveTagsCss: "app-list-view button.tagging-enable-bt",
    selectedResourcesTextCss: "div.tagging-enable-txt",
    resourceTaggingHeaderTitleCss: "app-tagging .pagetitle",
    resourceTagsDropdownXpath :"//*[@class='bx--list-box__field']",
    tagModelDropdownItemsXpath: "//*[@class='bx--list-box__menu-item__option']",
    tagKeyDropdownXpath: "//*[@class='bx--text-input']",
    tagModelItemName: "//*[@data-contained-checkbox-state='true']",
    tagModelAppEnvDropdownCloseXpath : "//*[@class='bx--list-box__menu-icon bx--list-box__menu-icon--open']",
    resourceIDDropdownCloseXpath: "//*[@id='res-tagging']//*[@class='bx--list-box bx--multiselect bx--multi-select--selected bx--list-box--expanded']/button",
    tagModelAssignXpath: "btn7",
    tagModelRemoveXpath: "btn8",
    listViewSelectedRowDataXpath :  "//*[@class='bx--data-table--selected']//td",
    multiCloudGlobalFilterXpath: "//div[contains(@class,'filter-section')]//fieldset//ibm-checkbox//span[@title='{1}']",
    tagCancelButtonCss:  "div.bx--col-lg-1 button.tagging-enable-cancel-bt",
    listViewNoDataDisplayCss:"div.applicationListView:nth-child(1) tbody.no-data-table tr:nth-child(1) td.no-data-row > div:nth-child(1)",
	paginationCss: "div.bx--pagination div.bx--pagination__right button",
	paginationForwardButton: ".bx--pagination__button.bx--pagination__button--forward",
	paginationUpAndDownDropdown: ".bx--select.bx--select--inline.bx--select__page-number input.bx--select-input",
	paginationDetailsTextCss: "div.bx--pagination__left span.bx--pagination__text",
	paginationDropdownIDXpath: "//*[contains(@id,'pagination-select-current-page')]",
	globalFilterXpath : "//li[@class='removeFrontSpace']//child::span[@class='filterTextOverflow' and contains(text(), '{0}')]",
	topInsightSubsectionsNoDataCss : "div  .noDataToShow",
	selectAssignedTags : "//span[contains(text(), '{0}')]",
	gcpTaggingNoteXpath : "//p[contains(text(),'{0}')]",
	gcpMultipleValueTaggingErrorCss : "div.bx--inline-notification__subtitle",
	addNewRowIcon : "//button[@id='btn5']",
	globalFilterResetButtonCss: "app-global-filter div.pd-1 a",
	seletAssignedTagKeys : "//div[contains(text(), '{0}')]",
	dragAndDropFileImportCss:".bx--file__drop-container",
	addFileCss:"input[type=file]",
	uploadFileCss:"button.bx--btn--primary",
	topInsightSubsectionNoDataXpath : "//h6[contains(text(), '{0}')]//parent::div//following-sibling::div//div[@class='noDataToShow']",
	labelTextXpath : "//label[contains(text(), '{0}')]",
	unknownLocationResourcesCountCss:"a.count-resource",
	serviceConfigurationFieldsCss:".complex-data-viewer-container .bx--breadcrumb .bx--breadcrumb-item",
	//Table setting story elements
	tableSettingIconXpath :"//span[@id='settings-icon']",
	tableSettingPanelHeaderCss : "h4.settings-header",
	columnHeaderCss : "span.column-name",
	columnHeaderCheckboxStatusXpath : "//span[@class='column-name']//ancestor::label//preceding-sibling::input",
	applyCancelResetButtonXpath : "//div[@class='btn-div']//button[contains(text(),'{0}')]",
	closeTableSettingPanelIconXpath : "//h4[@class='settings-header']//following-sibling::span",
	selectAllHeadersTableSettingXpath: "//input[@name='getAllColumns']",
	selectAllCheckboxXpath : "//input[@name='getAllColumns']//following-sibling::label",
	mcImportBulkTaggingTabXpath : "//div[@class='bx--content-switcher']//button[@name='multiCloud']"

};	

function inventory(selectorConfig) {
	if (!(this instanceof inventory)) {
		return new inventory(selectorConfig);
	}
	extend(this, defaultConfig);

	if (selectorConfig) {
		extend(this, selectorConfig);
	}
}

/**
 * Method to perform switch to default content then switch to frame 
 */
inventory.prototype.open = function(){
	util.waitForAngular();
	util.switchToDefault();
	launchpadObj.clickOnHamburgerMenu(launchpadTestData.leftNavigationExpanded);
	launchpadObj.clickOnleftNavigationMenuBasedOnName(launchpadTestData.aIOpsIntelligentITOperationsBtn);
	launchpadObj.clickLeftNavCardBasedOnName(launchpadTestData.inventoryCard);
	browser.sleep(5000);
};

/**
 * Method to navigate to inventory page from dashboard
 */
inventory.prototype.navigateDashboardInventory = async function(){
	util.waitForAngular();
	util.switchToDefault();
	launchpadObj.open();
	this.open();
};

/**
 * Method to navigate to dashboard page from Inventory
 */

inventory.prototype.navigateInventoryDashboard = async function(){
	util.switchToDefault();
	launchpadObj.clickOnHamburgerMenu(launchpadTestData.leftNavigationExpanded);
	launchpadObj.clickOnleftNavigationMenuBasedOnName(launchpadTestData.aIOpsIntelligentITOperationsBtn);
	launchpadObj.clickLeftNavCardBasedOnName(launchpadTestData.dashboardCard);
	util.switchToFrame();
}


/**
 * Method to get inventory header title text
 */
inventory.prototype.getInventoryHeaderTitleText = async function(){
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.InventoryHeaderTileTextCss))), timeout.timeoutInMilis);
	return await element(by.css(this.InventoryHeaderTileTextCss)).getText().then(function(text){
		logger.info("inventory page header title text : "+text);
		return text;
	});
};

/**
 * Method to click on apply filter button
 */
inventory.prototype.clickOnApplyFilterButton = async function() {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.applyFilterButtonCss))), timeout.timeoutInMilis);
	var applyFilterButtonEle = element(by.css(this.applyFilterButtonCss));
	browser.executeScript("arguments[0].click();", applyFilterButtonEle.getWebElement()).then(function () {
		logger.info("Clicked on apply filter button");
	});
};

/**
 * Method to get application or resources header text count
 */
inventory.prototype.getApplicationOrResourcesTableHeaderTextCount =  async function(){
	util.waitForAngular();
	var self = this;
	var count;
	var noDataInListView = await self.checkNoData(self.listViewNoDataDisplayCss, "listView");
	if(!noDataInListView){
	   browser.wait(EC.visibilityOf(element(by.css(self.applicationResourceTableContentCss))), timeout.timeoutInMilis);
	   browser.wait(EC.visibilityOf(element(by.css(self.paginationDetailsTextCss))), timeout.timeoutInMilis);
	}
    else {
		browser.wait(EC.visibilityOf(element(by.css(self.listViewNoDataDisplayCss))), timeout.timeoutInMilis);
	}
	browser.sleep(2000);
	return element(by.css(self.applicationResourceTableHeaderCss)).getText().then(function(applicationResourceCount){
		var count = applicationResourceCount.toString().replace(/[^0-9.]/g, '');
		logger.info("Application or Resources header count : "+count);
		return Number(count);
	});
};

/*
* get total count of Data centers and Multi Coulds Items under Inventory Tab
*/
inventory.prototype.getDataCentersAndMultiCloudTextTotalCount = async function(){
	util.waitForAngular();
	var  totalAssests =0;
	browser.wait(EC.visibilityOf(element.all(by.css(this.totalAssestsCss)).last()), timeout.timeoutInMilis);
	return await element.all(by.css(this.totalAssestsCss)).getText().then(function(assests){
		console.log(assests);
		for(var i=0;i<assests.length;i++)
		{
			if(assests[i] == "-"){ assests[i] = "0" }
			logger.info("Inventory assest  is: " + assests[i])
			totalAssests = totalAssests + parseInt(assests[i]);
		}
		logger.info("Total assets count from Multi-cloud and Data Centers are : " +totalAssests)
		return totalAssests;
	})
}

/**
 * Validate if the title text for main section is present or not
 * @param {Title text for main sections; EX: Top insights, Applications, Resources, etc.} TitleText 
 */
inventory.prototype.isTitleTextFromSectionPresent = async function(TitleText){
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.xpath(this.mainSectionsXpath)).get(0)), timeout.timeoutInMilis);
	return await element.all(by.xpath(this.mainSectionsXpath)).getText().then(function(titleTextList){
		for(var i=0; i<titleTextList.length; i++){
			logger.info("Comparing "+titleTextList[i]+" with "+TitleText);
			if(titleTextList[i].includes(TitleText)){
				logger.info(TitleText+" is present");
				return true;
			}
		}
		if(i == titleTextList.length){
			logger.info(TitleText+" is not present");
				return false;
		}
	})
}


/**
 * Method to verify Top Insights sub-section label text is present or not
 */
inventory.prototype.verifyTopInsightsSubSectionLabelText = async function (subLabelText) {
	util.waitForAngular();
	var i = 0;
	browser.wait(EC.visibilityOf(element.all(by.css(this.topInsightsSubSectionHeaderLabelCss)).get(0)), timeout.timeoutInMilis);
	return await element.all(by.css(this.topInsightsSubSectionHeaderLabelCss)).getText().then(function (labels) {
		for (i = 0; i < labels.length; i++) {
			if (labels[i] == subLabelText) {
				logger.info("Found and Sub Label Section Label text: "+labels[i]);
				return true;
			}
		}
		if (i == labels.length) {
			logger.info("Not found and Sub Label Section Label text: "+labels[i]);
			return false;
		}
	});
}

/**
 * Method to verify Applications/Resources List table is present or not 
 */
inventory.prototype.isAppResTableDisplayed = async function () {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.appResListTableCss))), timeout.timeoutInMilis);
	browser.wait(EC.visibilityOf(element(by.css(this.paginationDetailsTextCss))), timeout.timeoutInMilis);
	return await element(by.css(this.appResListTableCss)).isDisplayed().then(function (result) {
		if (result == true) {
			logger.info("Applications/Resources Table is displayed.");
		}
		else {
			logger.info("Applications/Resources Table is not displayed.");
		}
		return result;
	});
}

/**
 * Get resource count list based on top insights sub section name
 * subSectionName --> Sub-section name inside top insights. Ex. Application With Most Resources, Untagged Resources, etc.
 */
inventory.prototype.getResourcesCountFromTopInsightsSubSection = async function(subSectionName){
	util.waitForAngular();
	var count = [0 , 0 , 0];
	var resourceNameFromTopInsights = this.appNameFromTopInsightsXpath.format(subSectionName);
	var resourceCountFromTopInsights = this.resourceCountForAppsFromTopInsightsXpath.format(subSectionName);
	var noData = await this.checkTopInsightNoData(this.topInsightSubsectionNoDataXpath,subSectionName );
	if(!noData){
	   browser.wait(EC.visibilityOf(element.all(by.xpath(resourceCountFromTopInsights)).get(0)), timeout.timeoutInMilis);
	   return await element.all(by.xpath(resourceNameFromTopInsights)).getText().then(async function(resNameList){
		   return await element.all(by.xpath(resourceCountFromTopInsights)).getText().then(function(resCountList){
			   logger.info("==================================================================");
			   for(var i = 0; i < resNameList.length; i++){
				  logger.info(resNameList[i]+" : "+resCountList[i]);
			    }
			logger.info("Resource count list for "+subSectionName+": "+resCountList);
			return resCountList;
		    });
		});
	}
	else{
		return count;
	}
}

/**
 * Select category from app/resource breakdown widget dropdown 
 * @param {Name of category from dropdown; Ex: Provider, Environment, etc.} categoryName 
 */
inventory.prototype.selectCategoryFromAppResBreakdownWidget = async function(categoryName){
	var self = this;
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.css(this.appResBreakdownDropdownCss)).get(1)), timeout.timeoutInMilis);
	return await element.all(by.css(this.appResBreakdownDropdownCss)).get(1).click().then(async function(){
		logger.info("Clicked on app/resource breakdown dropdown button..");
		var appResBreakdownDropdownValue = self.appResBreakdownDropdownValCss.format(categoryName);
		browser.wait(EC.visibilityOf(element(by.css(appResBreakdownDropdownValue))), timeout.timeoutInMilis);
		await element(by.css(appResBreakdownDropdownValue)).click().then(function(){
			logger.info("Clicked on app/resource breakdown dropdown category "+ categoryName);
		});
	});
}


/**
 * Click on app/resource breakdown widget filter
 */
inventory.prototype.clickOnFirstAppResBreakdownFilter = async function(){
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.xpath(this.appResBreakdownRectsXpath)).get(0)), timeout.timeoutInMilis);
	return await element.all(by.xpath(this.appResBreakdownRectsXpath)).get(0).click().then(function(){
		logger.info("Clicked on first filter from app/resource breakdown widget..");
	})
}

/**
 * Get resource count list based on top insights sub section name
 * subSectionName --> Sub-section name inside top insights. Ex. Application With Most Resources, Untagged Resources, etc.
 */
inventory.prototype.getResourcesCountFromTopInsightsSubSectionFrmUiForEsValidation = async function(subSectionName){
	util.waitForAngular();
	var resourceNameFromTopInsights = this.appNameFromTopInsightsXpath.format(subSectionName);
	var resourceCountFromTopInsights = this.resourceCountForAppsFromTopInsightsXpath.format(subSectionName);
	browser.wait(EC.visibilityOf(element.all(by.css(this.topInsightsSubSectionHeaderLabelCss)).get(0)), timeout.timeoutInMilis);
	return await element.all(by.xpath(resourceNameFromTopInsights)).getText().then(async function(resNameList){
		return await element.all(by.xpath(resourceCountFromTopInsights)).getText().then(async function(resCountList){
			logger.info("==================================================================");
			var res={};
			for(var i = 0; i < resNameList.length; i++){
				res[resNameList[i]]=parseInt(resCountList[i]);
			}
			logger.info("Application/Resource name and count ",res);
			return res;
		});
	});
}

/**
 * Method to click on top insights resource count
 */
inventory.prototype.clickOnTopInsightsResourcesCount = async function() {
	util.waitForAngular();
	browser.wait(EC.elementToBeClickable(element.all(by.css(this.topInsightsResourceCountCss)).get(0)), timeout.timeoutInMilis);
	await element.all(by.css(this.topInsightsResourceCountCss)).get(0).click().then(function(){
		logger.info("Clicked on topInsights resources count");
	});
};


/**
 * Method to get top insights resource count
 */
inventory.prototype.getTopInsightsResourcesCount = async function() {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.css(this.topInsightsResourceCountCss)).get(0)), timeout.timeoutInMilis);
	return await element.all(by.css(this.topInsightsResourceCountCss)).get(0).getAttribute("innerText").then(async function(resourcesCount){
		logger.info("topInsights resources count",resourcesCount);
		return await util.stringToInteger(resourcesCount);
	});
};


/**
 * Get datacenter or multicloud resource count list based on category provided
 * @params providersList i.e: 'MultiCloud - [AWS, Azure, IBMCloud]', 'Data Center - [IBM DC]'
 */
inventory.prototype.getDataCenterAndMulticloudResourcesCountForEs = async function(providersList){
	util.waitForAngular();
	for(var i=0; i<providersList.length; i++){
		await healthAndInventoryUtil.clickOnProviderCheckBox(providersList[i]);
	}
	await healthAndInventoryUtil.clickOnApplyFilterButton();
	var count = await this.getApplicationOrResourcesTableHeaderTextCount();
	logger.info("Resource count: "+count);
	return count;
}

/**
 * Method to get Top Insights untagged resources Application count
 * topInsightsSubSectionName - Untagged resources, Monitored resources, etc.
 * categoryName - Application, Environment, Unmanaged, etc.
 */
inventory.prototype.getCategoryResourceCountFromTopInsightsSubSection = async function (topInsightsSubSectionName, categoryName) {
	var resourceCountForCategoryFromTopInsights = this.resourceCountForCategoryFromTopInsightsXpath.format(topInsightsSubSectionName, categoryName);
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.xpath(resourceCountForCategoryFromTopInsights))), timeout.timeoutInMilis);
	return await element(by.xpath(resourceCountForCategoryFromTopInsights)).getText().then(function (resCount) {
		if(resCount != "-"){
			logger.info("Top Insights untagged resources "+categoryName+" count : " + resCount);
			return Number(resCount);
		}
		else{
			logger.info("Top Insights untagged resources "+categoryName+" count : " + 0);
			return 0;
		}
		
	});
}

/**
 * Method to get Top Insights sub section list resource count
 * topInsightsSubSectionName - Untagged resources, Monitored resources, etc.
 */
inventory.prototype.getCountsFromTopInsightsResources = async function (topInsightsSubSectionName) {
	var resourceCountFromTopInsightsSubSection = this.resourceCountFromTopInsightsSubSectionXpath.format(topInsightsSubSectionName);
	util.waitForAngular();
	var count = [0 , 0 , 0];
	var noData = await this.checkTopInsightNoData(this.topInsightSubsectionNoDataXpath,topInsightsSubSectionName);
	if(!noData){
	  browser.wait(EC.visibilityOf(element.all(by.xpath(resourceCountFromTopInsightsSubSection)).get(0)), timeout.timeoutInMilis);
	  return await element.all(by.xpath(resourceCountFromTopInsightsSubSection)).getText().then(function (monitoredResourcesList) {
		  var list = [];
		  for(var i=0; i<monitoredResourcesList.length; i++){
				list.push(Number(monitoredResourcesList[i]));
		    }
		    if(list.length == 0){
			  list.push[0];
		    }
		logger.info("Top Insights "+topInsightsSubSectionName+" list count : " + list);
		return list;
	    });
	}
    else{
		return count;
	}
     
}

/**
 * Method to get application and resource breakdown text from each box
 */
inventory.prototype.getApplicationResourceBreakdownGraphText = async function () {
	var self = this;
	browser.waitForAngular();
	var noData = await self.checkNoData(self.breakdownSubSectionNoDataCss, "breakdown");
	if (!noData) {
		var BoxContent;
		var elementList = element.all(by.css(self.applicationResourcesBreakDownCss));
		browser.wait(EC.visibilityOf(elementList.get(0)), timeout.timeoutInMilis);
		util.scrollToWebElement(elementList.get(0));
		return await elementList.count().then(async function (count) {
			browser.wait(EC.visibilityOf(element(by.css(self.breakdownValueTextCss))), timeout.timeoutInMilis);
			await element.all(by.css(self.breakdownValueTextCss)).getText().then(function (boxText) {
				logger.info("Box texts: ", boxText);
				BoxContent = boxText;
			});
			if (count && BoxContent) {
				logger.info("Total number of boxes: ", count);
				logger.info("Total number of box having text: ", BoxContent.length);
				logger.info("Total number of box lower in size & do not have text: ", count - BoxContent.length);
			}
			return BoxContent; 
		});
	}

}

/**
 * Method to Check No data text in all widgets.
 */
inventory.prototype.checkNoData = async function(checkNoDataLocator, widget) {
	browser.waitForAngular();
	var subSectionNoDataCss = checkNoDataLocator;
	return await element.all(by.css(subSectionNoDataCss)).count().then(async function (noDataCount) {
		if (noDataCount > 0) {
			return await element(by.css(subSectionNoDataCss)).getText().then(function (noDataText) {
				logger.info("No data available in "+widget+": " + noDataText);
				return true;
			});
		} else {
		    return false;
		}
	});
}
/**
 * Method to check no data in list view
 */
inventory.prototype.checkNoDataTable = async function () {
	var self = this;
	util.waitForAngular();
	return await element(by.css(self.tagSubsectionNoDataCss)).isPresent().then(function (result) {
		logger.info("No data available in list view ---> ", result);
		return result;
	});
}

/**
 * Method to get application and resource breakdown count from graph
 */
inventory.prototype.getApplicationResourceBreakdownGraphToolTip = async function () {
	var self = this;
	browser.waitForAngular();
	var noData = await self.checkNoData(self.breakdownSubSectionNoDataCss, "breakdown");
	if (!noData) {
		var toolTipContent = [];
		var elementList = element.all(by.css(self.applicationResourcesBreakDownCss));
		browser.wait(EC.visibilityOf(elementList.get(0)), timeout.timeoutInMilis);
		util.scrollToWebElement(elementList.get(0));
		return await elementList.count().then(async function (count) {
			logger.info("Total number of categories: ", count);
			if (count > 5) {
				count = 5;
			}
			for (var i = 0; i < count; i++) {
				await browser.actions().mouseMove(elementList.get(i)).perform().then(async function () {
					browser.wait(EC.visibilityOf(element.all(by.css(self.toolTipTextCss)).get(0)), timeout.timeoutInMilis);
					await element(by.css(self.toolTipTextCss)).getText().then(function (tooTipText) {
						toolTipContent[i] = tooTipText;
						toolTipContent[i] = toolTipContent[i].substring(0,toolTipContent[i].indexOf('\n'));
					});
				});
			}
			return toolTipContent;
		});
	}
}

/**
 * Method to click on zoom & reset in geo map
 */
inventory.prototype.clickOnZoomResetGeoMap = async function(zoomOrReset, feature) {
	util.waitForAngular();
	browser.wait(EC.elementToBeClickable(element.all(by.css(zoomOrReset)).get(0)), timeout.timeoutInMilis);
	util.scrollToWebElement(element(by.css(zoomOrReset)));
	await element.all(by.css(zoomOrReset)).get(0).click().then(function(){
		logger.info("Clicked on GeoMap " + feature);
	});
};

/*
* Method to click on export button in list view
*/
inventory.prototype.isTableExportDisplayed = async function (selectTable) {
	util.waitForAngular();
	var self = this;
	browser.wait(EC.visibilityOf(element(by.css(this.tableExportCss))), timeout.timeoutInMilis);
	util.scrollToWebElement(element(by.css(this.applicationResourceTableColumnTitleCss)));
	return await element(by.css(this.tableExportCss)).click().then(async function () {
		if (selectTable){
			element.all(by.css(this.viewDetailsCss)).get(0).click().then(function(){
				logger.info("Clicked on Export icon");
			});
		}
		logger.info("List Table - Export icon clicked !!");
		browser.wait(EC.visibilityOf(element(by.css(self.tableExportModalHeader))), timeout.timeoutInMilis);
		return await element(by.css(self.tableExportModalHeader)).getText().then(async function (label) {
			logger.info(label);
			if (label === 'Export') {
				logger.info("List Table - Export modal is displayed - " + label);
				browser.wait(EC.visibilityOf(element(by.css(self.tableExportRadioOptions))), timeout.timeoutInMilis);
				return await element.all(by.css(self.tableExportRadioOptions)).getText().then(function (labels) {
					logger.info(labels);
					let result = true;
					labels.forEach(key => {
						if (key.trim() !== '' && ['CSV', 'JSON'].indexOf(key.trim()) === -1) {
							logger.info(key + " radio button is not present modal");
							result = false;
						}
					});
					if (result === true) {
						logger.info("List Table - Export modal contains requred buttons - " + labels);
						browser.wait(EC.visibilityOf(element(by.css(self.tableExportButtons))), timeout.timeoutInMilis);
						return element.all(by.css(self.tableExportButtons)).getText().then(function (labels) {
							logger.info(labels);
							let buttonResult = true;
							labels.forEach(key => {
								if (key.trim() !== '' && ['Cancel', 'Export'].indexOf(key.trim()) === -1) {
									logger.info(key + " button is not present modal");
									buttonResult = false;
								}
							});
							if (buttonResult === true) {
								logger.info("List Table - Export modal contains both radio options - " + labels);
								browser.wait(EC.visibilityOf(element(by.css(self.tableExportCloseIcon))), timeout.timeoutInMilis);
								return element(by.css(self.tableExportCloseIcon)).click().then(function () {
									logger.info("List Table - Export modal closed using close option");
									return true;
								});
							} else {
								logger.info("List Table - Export modal doen't contain Cancel & Export buttons");
								return false;
							}
						});
					} else {
						logger.info("List Table - Export modal doen't contins CSV & JSON options");
						return false;
					}
				});
			} else {
				logger.info("List Table - Export modal is displayed");
				return false;
			}
		});
	});
}

/*
* Method to select csv or json and click on export button list view
*/
inventory.prototype.clickOnExport = async function (size, format, selectTable) {
	util.waitForAngular();
	var self = this;
	browser.wait(EC.visibilityOf(element(by.css(this.tableExportCss))), timeout.timeoutInMilis);
	util.scrollToWebElement(element(by.css(this.applicationResourceTableColumnTitleCss)));
	return await element(by.css(this.tableExportCss)).click().then( async function () {
		logger.info("List Table - Export icon clicked !!");
		if (selectTable){
			element.all(by.css(this.viewDetailsCss)).get(0).click().then(function(){
				logger.info("Clicked on Export icon");
			});
		}
		return await element.all(by.css(self.tableExportRadioOptionsClick)).get(size).click().then( async function () {
			logger.info("Selected "+format+" format");
			return await element.all(by.css(self.tableExportButtons)).get(1).click().then(function () {
				logger.info("Clicked on Export");
				return true;
			});
		});
	});
}

/**
 * Method to verify headers in application/resource list view
 */
inventory.prototype.getListViewHeaders = async function () {
	var self = this;
	var noDataInListView = await self.checkNoData(self.listViewNoDataDisplayCss, "listView");
	if(!noDataInListView){
		browser.wait(EC.visibilityOf(element(by.css(self.paginationDetailsTextCss))), timeout.timeoutInMilis);
	}
    else {
		browser.wait(EC.visibilityOf(element(by.css(self.listViewNoDataDisplayCss))), timeout.timeoutInMilis);
	}
	await browser.wait(EC.visibilityOf(element.all(by.css(this.applicationResourceTableColumnTitleCss)).get(0)), timeout.timeoutInMilis);
	return await element.all(by.css(this.applicationResourceTableColumnTitleCss)).getText().then(function (labels) {
		for (var i = 0; i < labels.length; i++) {
			labels[i] = labels[i].trim()
		}
		return labels;
	});
}

/**
 * Method to verify search bar on application/resource list view
 */
inventory.prototype.isTableSearchBarDisplayed = async function () {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.tableSearchBarCss))), timeout.timeoutInMilis);
	return await element(by.css(this.tableSearchBarCss)).isDisplayed().then(function (res) {
		if (res == true) {
			logger.info("List Table - Search bar is displayed.");
		}
		else {
			logger.info("List Table - Search bar is not displayed.");
		}
		return res;
	});
}

/**
 * Method to verify sorting in list view
 */
inventory.prototype.clickOnTableSort = async function(size) {
	util.waitForAngular();
	util.waitOnlyForInvisibilityOfCarbonDataLoader()
	await browser.wait(EC.elementToBeClickable(element.all(by.css(this.applicationResourceTableColumnTitleCss)).get(0)), timeout.timeoutInMilis);
	util.scrollToWebElement(element(by.css(this.applicationResourceTableColumnTitleCss)));
	browser.wait(EC.visibilityOf(element(by.css(this.applicationResourceTableColumnTitleCss))), timeout.timeoutInMilis);
	await element.all(by.css(this.applicationResourceTableColumnTitleCss)).get(size).click().then(function(){
		logger.info("Clicked on Sort in List view table");
		util.waitOnlyForInvisibilityOfCarbonDataLoader()
	});
};

/**
 * Method to click on ItemsperPage list view
 */
inventory.prototype.clickOnItemsPerPage = async function (cssPath, feature, size) {
	browser.waitForAngular();
	var count;
	var incount;
	if (size == 0){
		count = 10;
		incount = 1;

	}
	else if (size == 1){
		count = 20;
		incount = 2;
	}
	var self = this;
	var clickCss = cssPath;
	var optionCss = cssPath + " .bx--select-option";
	var elementList = element.all(by.css(clickCss));
	browser.wait(EC.visibilityOf(elementList.get(0)), timeout.timeoutInMilis);
	await browser.actions().mouseMove(elementList.get(0)).click().perform();
	logger.info("Clicked on "+feature+ " ("+incount+") in List View");
	browser.wait(EC.visibilityOf(element(by.css(optionCss))), timeout.timeoutInMilis);
	return element.all(by.css(optionCss)).get(size).click().then(function () {
		logger.info("Selected Items Per Page as " + count + " in List view");
		return element.all(by.css(self.applicationResourceTableRowCss)).count().then(function (rowCount) {
			if (rowCount) {
				logger.info("Number of rows in List view: " + rowCount);
				return "Found Rows";
			} else {
				logger.info("No rows found in List view: " + rowCount);
				return "No Data";
			}
		});
	});
}

/**
 * Method to click on view details
 */
inventory.prototype.isViewDetailsButtonDisplayed = async function (index) {
	var self = this;
	util.waitForAngular();
	var elementList = element.all(by.css(this.applicationResourceTableOverflowMenuCss));
	browser.wait(EC.visibilityOf(elementList.get(index)), timeout.timeoutInMilis);
	//await util.scrollToWebElement(elementList.get(index));
	await browser.actions().mouseMove(elementList.get(index)).click().perform();
	var elementList = element.all(by.css(this.viewDetailsCss));
	browser.wait(EC.visibilityOf(elementList.get(0)), timeout.timeoutInMilis);
	return element.all(by.css(self.viewDetailsCss)).getText().then(function (labels) {
		for(var i=0; i<labels.length ; i++)
		   {
			if (labels[i] == inventoryTestData.viewDetails) {
				logger.info("List view - 'View details' found");
				return true;			
			}
		}
	});	

}

/**
 * Method to click on view details
 */
inventory.prototype.clickOnViewDetails = async function () {
	var self = this;
	util.waitForAngular();
	await util.scrollToWebElement(element(by.css(self.viewDetailsCss)));
	return element.all(by.css(self.viewDetailsCss)).get(0).click().then(function() {
			logger.info("Clicked on View details");	
	});	

}

/**
 * Method to click on application/resource list view
 */
inventory.prototype.verifyResrcTableDataAvailable = async function () {
	util.waitForAngular();
	browser.sleep(1000);
	var self = this;
	var elementList = element.all(by.css(this.applicationResourceTableOverflowMenuCss));
	await browser.wait(EC.visibilityOf(elementList.get(0)), timeout.timeoutInMilis);
	util.scrollToWebElement(elementList.get(0));
	await browser.actions().mouseMove(elementList.get(0)).click().perform()
	browser.sleep(500);
	logger.info("Found overflow menu in List View");
	logger.info("Clicked on overflow menu in List View");
	return element.all(by.css(self.applicationResourceTableContentCss)).getText(0).then(function (label) {
		if (label) {
			var resrcName = util.removeBlankSpaces(label[2]).split(" ")[0].trim()
			logger.info("Resource Name: " + resrcName);
			element.all(by.css(self.viewDetailsCss)).get(0).click().then(function(){
				logger.info("Clicked on View details");
			});
			return resrcName;
		} else {
			logger.info("No rows found in List view: " + label);
			return false;
		}
	});
}
/**
 * Method to search list view
 * @param searchText
 */
inventory.prototype.searchTable = async function (searchText) {
	var self = this;
	util.waitForAngular();
	util.waitOnlyForInvisibilityOfCarbonDataLoader();
	browser.wait(EC.visibilityOf(element(by.css(self.searchBarInput))), timeout.timeoutInMilis);
	await util.scrollToWebElement(element(by.css(this.applicationResourceTableColumnTitleCss)));
	return await element(by.css(self.searchBarInput)).click().then(async function () {
		logger.info("Focused on search bar textbox");
		return browser.wait(element(by.css(self.searchBarInput)).clear().sendKeys(searchText + protractor.Key.ENTER)).then(function () {
			util.waitOnlyForInvisibilityOfCarbonDataLoader();
			logger.info("Search for keyword - " + searchText);
			return true;
		});
	});
}

/**
 * Method to get Application/Resources Breakdown section label text 
 */
inventory.prototype.getAppResBreakdownSectionLabelText = async function () {
	util.waitForAngular();
	util.waitOnlyForInvisibilityOfCarbonDataLoader();
 	browser.wait(EC.visibilityOf(element(by.css(this.appsResBreakdownSectionLabelCss))), timeout.timeoutInMilis);
 	return await element(by.css(this.appsResBreakdownSectionLabelCss)).getText().then(function (appBreakdownSectionLabel) {
 		logger.info("Section Label: " + appBreakdownSectionLabel);
 		return appBreakdownSectionLabel;
	 });
};


/**
* Method to get Applications/Resources table label text 
 */
 inventory.prototype.getAppsResTableSectionLabelText = async function () {
	util.waitForAngular();
	util.waitOnlyForInvisibilityOfCarbonDataLoader();
	browser.wait(EC.visibilityOf(element(by.css(this.paginationDetailsTextCss))), timeout.timeoutInMilis);
 	browser.wait(EC.visibilityOf(element(by.css(this.applicationResourceTableHeaderCss))), timeout.timeoutInMilis);
 	return await element(by.css(this.applicationResourceTableHeaderCss)).getText().then(function (applicationsLabel) {
		 var section_label = util.removeBlankSpaces(applicationsLabel).split("(")[0].trim()
		     section_label = section_label.replace(/:/g, "")
 	logger.info("Section Label: " +section_label);
 	return section_label
 	});
 } 

 /**
* Method to get view details Overview label text 
 */
inventory.prototype.getViewDetailsOverviewLabelText = async function () {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.viewDetailsOverviewCss))), timeout.timeoutInMilis);
	return element(by.css(this.viewDetailsOverviewCss)).getText().then(function (overviewLabel) {
		logger.info("Section Label: " + overviewLabel.trim());
		return overviewLabel.trim();
	});
} 

/**
 * Method to verify Global filter
 */
inventory.prototype.isGlobalFilterDisplayed = async function () {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.globalFilterCss))), timeout.timeoutInMilis);
	return await element(by.css(this.globalFilterCss)).isDisplayed().then(function (res) {
		if (res == true) {
			logger.info("Global filter is displayed -> "+ res);
		}
		else {
			logger.info("Global filter is not displayed.");
		}
		return res;
	});
}

/**
 * Method to verify Global filter categories
 */
inventory.prototype.isPresentglobalFilterCategories = async function (categories) {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.globalFilterCss))), timeout.timeoutInMilis);
	return await element.all(by.css(this.globalFilterCategoriesCss)).then(async function (elements) {
		let status = true;
		for (let i = 0; i < elements.length; i++) {
			let text = await elements[i].getText();
			logger.info("Global filter main category title -> " + text);
			if (text !== categories[i]) {
				logger.info("No match found - " + text);
				status = false;
			}
		}
		logger.info("Global filter main category title status -> " + status);
		return status;
	});
}

/**
 * Method to verify Global filter provider sub categories
 */
inventory.prototype.isPresentglobalFilterProviderSubCategories = async function (categories) {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.globalFilterCss))), timeout.timeoutInMilis);
	return await element.all(by.css(this.globalFilterProviderCategoriesCss)).then(async function (elements) {
		let status = true;
		for (let i = 0; i < elements.length; i++) {
			let text = await elements[i].getText();
			logger.info("Global filter Providers sub-category title -> " + text);
			if (text !== categories[i]) {
				logger.info("No match found - " + text);
				status = false;
			}
		}
		logger.info("Global filter Providers sub-category title status -> " + status);
		return status;
	});
}

/**
 * Method to verify Global filter provider sub categories
 */
inventory.prototype.isPresentglobalFilterProviders = async function () {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.globalFilterCss))), timeout.timeoutInMilis);
	return await element.all(by.css(this.pCss)).then(async function (elements) {
		var status = false;
		if (elements) {
			for (let i = 0; i < elements.length; i++) {
				let text = await elements[i].getText();
				let subText = text.split('\n')
				if (subText.length > 0) {
					for (let x = 0; x < subText.length; x++) {
						if (x === 0) {
							logger.info("Global filter Providers text -> " + subText[x]);
						}
						else {
							logger.info("Global filter Provider account text -> " + subText[x]);
						}
					}
				}
				else {
					logger.info("Global filter Providers text -> " + text);
				}
			}
			status = true;
			logger.info("Global filter Providers title status -> " + status);
			return status;
		}
	});
}
/**
 * Method to check header DC resource summary subtitle text
 */
inventory.prototype.getDCResrcSummaryTextAndCount = function () {
	var self = this;
	util.waitForAngular();
	var subcategorytext = [];
	var subcategorycount = [];
	browser.wait(EC.visibilityOf(element(by.css(this.resourceSummaryDCSubtitleTextCss))), timeout.timeoutInMilis);
	return element.all(by.css(this.resourceSummaryDCSubtitleTextCss)).then(async function (elements) {
		return element.all(by.css(self.resourceSummaryDCSubtitleValuecss)).getText().then(async function (labelCount) {
			logger.info("Inventory Header Data centre Resource summary verification started");
			if (labelCount !== undefined && labelCount.length) {
				for (let i = 0; i < elements.length; i++) {
					let text = await elements[i].getText();
					subcategorytext.push(text);
					subcategorycount.push(labelCount[i]);
				}
			}
			return {
				subcategorytext,
				subcategorycount
			};
		});
	});
}

/**
 * Method to check header MC resource summary subtitle text
 */
inventory.prototype.getMCResrcSummaryTextAndCount = async function () {
	var self = this;
	util.waitForAngular();
	var subcategorytext = [];
	var subcategorycount = [];
	browser.wait(EC.visibilityOf(element(by.css(this.resourceSummaryMCSubtitleTextCss))), timeout.timeoutInMilis);
	return await element.all(by.css(this.resourceSummaryMCSubtitleTextCss)).then(async function (elements) {
		return await element.all(by.css(self.resourceSummaryMCSubtitleValuecss)).getText().then(async function (labelCount) {
			logger.info("Inventory Header Multicloud Resource summary verification started");
			if (labelCount !== undefined && labelCount.length) {
				for (let i = 0; i < elements.length; i++) {
					let text = await elements[i].getText();
					subcategorytext.push(text);
					subcategorycount.push(labelCount[i]);
				}
			}
			return {
				subcategorytext,
				subcategorycount
			};
		});
	});
}

/**
 * Method to click on Single box breakdown value
 */
inventory.prototype.clickAndGetTextFromSingleBreakdownBox = async function (category) {
	util.waitForAngular();
	var self = this;
	var status = false;
    var noData = await self.checkNoData(self.breakdownSubSectionNoDataCss, "breakdown");
    if (!noData) {
        var toolTipContent;
        var categoryToolTip;
        var elementList = element.all(by.css(self.applicationResourcesBreakDownCss));
        browser.wait(EC.visibilityOf(elementList.get(0)), timeout.timeoutInMilis);
        browser.wait(EC.elementToBeClickable(element.all(by.css(self.breakdownValuesCss)).get(0)), timeout.timeoutInMilis);
		util.scrollToWebElement(elementList.get(0));
        return await elementList.count().then(async function (count) {
            if (count > 5) {
                count = 5;
            }
            for (var i = 0; i < count; i++) {
				if(!status){
                    await browser.actions().mouseMove(elementList.get(i)).perform().then(async function () {
                       browser.wait(EC.visibilityOf(element.all(by.css(self.toolTipTextCss)).get(0)), timeout.timeoutInMilis);
                       await element(by.css(self.toolTipTextCss)).getText().then(function (tooTipText) {
							toolTipContent = tooTipText;
							toolTipContent = toolTipContent.substring(0,toolTipContent.indexOf('\n'));
							if(toolTipContent === category){
                                element.all(by.css(self.breakdownValuesCss)).get(i).click().then(function(){
								util.waitOnlyForInvisibilityOfCarbonDataLoader();
								categoryToolTip = tooTipText;
								logger.info("Clicked on category---> " +categoryToolTip);
								status = true;
								});
                            }
                        });
					});
				}
            }
    return categoryToolTip;
        });
    }
};

/**
 * Method to get counts from list view and breakdown
 */
inventory.prototype.interactionBetweenBreakdownListView = async function (List,breakdownValue) {
	var self = this;
	var listViewCount=[], breakdownCount=[] ,breakdownList =[], categoryToolTip=[];
	var count;
	breakdownList = List;
	if(breakdownList.length > inventoryTestData.threeRecords)
		{
		count = inventoryTestData.threeRecords;
		}
		else {
		count = breakdownList.length;
		}
	for(var i=0; i< count; i++){
		if(breakdownList[i].includes(".."))
		{
			breakdownList[i] = breakdownList[i].substr(0, breakdownList[i].indexOf('.')); 

		}
		categoryToolTip[i] = await self.clickAndGetTextFromSingleBreakdownBox(breakdownList[i]);
		if(breakdownValue == inventoryTestData.resources)
		{
		breakdownCount[i] = categoryToolTip[i].substring(categoryToolTip[i].indexOf(':') + 2);
		}
		else if(breakdownValue == inventoryTestData.applications)
		{
			breakdownCount[i] = categoryToolTip[i].substring(categoryToolTip[i].indexOf(':'));
			breakdownCount[i] = breakdownCount[i].match(/^(\D*)(\d+)/)[2]; 
		}
		util.waitOnlyForInvisibilityOfCarbonDataLoader();
		await self.getListViewHeaders();
		listViewCount[i] = await self.getApplicationOrResourcesTableHeaderTextCount();
		listViewCount[i] = JSON.stringify(listViewCount[i]);

	}
	logger.info(listViewCount,breakdownCount);
	return {
	listViewCount,
	breakdownCount
	}; 
};

/**
 * Method to get counts from list view and breakdown
 */
inventory.prototype.interactionBetweenRegionListView = async function (list,section) {
	var self = this;
	var listViewCount=[], resourceCount=[] ,regionList =[], categoryToolTip=[], applicationCount = [];
	var count;
	regionList = list;
	if(regionList.length > inventoryTestData.threeRecords)
		{
		count = inventoryTestData.threeRecords;
		}
		else {
		count = regionList.length;
		}
	for(var i=0; i< count; i++){
		categoryToolTip[i] = await self.clickAndGetTextFromResourceByRegion(regionList[i]);
		if(section == inventoryTestData.resources)
		{
		resourceCount[i] = categoryToolTip[i].substring(categoryToolTip[i].indexOf(':') + 2);
		}
		else if(section == inventoryTestData.applications)
		{
			applicationCount[i] = categoryToolTip[i].substring(categoryToolTip[i].indexOf('::'));
			applicationCount[i] = applicationCount[i].match(/^(\D*)(\d+)/)[2]; 
		}
		await self.getListViewHeaders();
		await util.waitOnlyForInvisibilityOfCarbonDataLoader();
		listViewCount[i] = await self.getApplicationOrResourcesTableHeaderTextCount();
		listViewCount[i] = JSON.stringify(listViewCount[i]);

	}
	logger.info(listViewCount,resourceCount);
	return {
	listViewCount,
	resourceCount,
	applicationCount
	}
};

/**
 * Method to get counts from List view for DC Summary text in header
 */
inventory.prototype.getListViewCountWrtDCSummary = async function (DCResrcSummaryObj) {
	var self = this;
	var count =[];
	for (var i = 0; i < DCResrcSummaryObj.subcategorytext.length; i++) {
		if(DCResrcSummaryObj.subcategorycount[i]!= "0")
		{
		    if (DCResrcSummaryObj.subcategorytext[i] == "Compute"){
			   await self.clickAndGetTextFromSingleBreakdownBox(inventoryTestData.computeName)
			}
			else if (DCResrcSummaryObj.subcategorytext[i] == "Network")
			{
			   await self.clickAndGetTextFromSingleBreakdownBox(inventoryTestData.networkName)
			}
			else if (DCResrcSummaryObj.subcategorytext[i] == "Storage")
			{
			   await self.clickAndGetTextFromSingleBreakdownBox(inventoryTestData.storageName)
			}
			util.waitOnlyForInvisibilityOfCarbonDataLoader();
			count[i] = await self.getApplicationOrResourcesTableHeaderTextCount();
			count[i] = JSON.stringify(count[i]);
			if (count[i]>1000){
				count[i] = Math.round(10*(count[i]/1000))/10 + "K" ;
			}
			logger.info("Count is matching for " +DCResrcSummaryObj.subcategorytext[i]);
			logger.info("Count from DC Summary " +DCResrcSummaryObj.subcategorycount[i] +", Count from List view  "  +count[i]);
		}	
		else {
		count[i] = "0";
		}
	}
	return count;

};

/**
 * Method to get counts from List view for DC Summary text in header
 */
inventory.prototype.getListViewCountWrtMCSummary = async function (MCResrcSummaryObj) {
	var self = this;
	var count =[];
	for (var i = 0; i < MCResrcSummaryObj.subcategorytext.length; i++) {
		if(MCResrcSummaryObj.subcategorycount[i]!= "0")
		{
		    if (MCResrcSummaryObj.subcategorytext[i] == "Service instances"){
                await self.searchTable("service_instance");
            }
            else if (MCResrcSummaryObj.subcategorytext[i] == "Associated components")
            {
                await self.searchTable("associated_component");
            }
            else if (MCResrcSummaryObj.subcategorytext[i] == "Independent components")
            {
                await self.searchTable("independent_component");
            }  
			util.waitOnlyForInvisibilityOfCarbonDataLoader();
			count[i] = await self.getApplicationOrResourcesTableHeaderTextCount();
			count[i] = JSON.stringify(count[i]);
			if (count[i]>1000){
				count[i] = Math.round(10*(count[i]/1000))/10 + "K" ;
			}
			logger.info("Count is matching for " +MCResrcSummaryObj.subcategorytext[i]);
			logger.info("Count from MC Summary " +MCResrcSummaryObj.subcategorycount[i] +", Count from List view  "  +count[i]);
		}	
		else {
		count[i] = "0";
		}
	}
	return count;

};

/**
 * Method to get counts from list view and breakdown
 */
inventory.prototype.interactionBetweenBreakdownAndRegion = async function (list,breakdownValue) {
	var self = this;
	var count;
	var resourcesByRegionCount=[], breakdownCount=[] ,breakdownList =[], categoryToolTip=[], applicationsCount = [],
	resourcesCount = [];
	breakdownList = list;
	if(breakdownList.length > inventoryTestData.threeRecords)
		{
		count = inventoryTestData.threeRecords;
		}
		else {
		count = breakdownList.length;
		}
	for(var i=0; i<count; i++){
		if(breakdownList[i].includes(".."))
		{
			breakdownList[i] = breakdownList[i].substr(0, breakdownList[i].indexOf('.')); 

		}
		categoryToolTip[i] = await self.clickAndGetTextFromSingleBreakdownBox(breakdownList[i]);
		if(breakdownValue == inventoryTestData.resources)
		{
		 resourcesCount[i] = categoryToolTip[i].substring(categoryToolTip[i].indexOf(':') + 2);
		}
		else if(breakdownValue == inventoryTestData.applications)
		{
			breakdownCount[i] = categoryToolTip[i].substring(categoryToolTip[i].indexOf(':'));
			applicationsCount[i] = breakdownCount[i].match(/^(\D*)(\d+)/)[2]; 
			resourcesCount[i] = categoryToolTip[i].split(':').pop(); 
			resourcesCount[i] = resourcesCount[i].trim();

		}
		util.waitOnlyForInvisibilityOfCarbonDataLoader();
		resourcesByRegionCount[i] = await self.getResourceByRegionCount()
		resourcesByRegionCount[i] = JSON.stringify(resourcesByRegionCount[i]);

	}
	logger.info(resourcesByRegionCount,applicationsCount,resourcesCount);
	return {
	resourcesByRegionCount,
	applicationsCount,
	resourcesCount
	}
};
/**
 * Method to get MC and DC counts from Dashboard in inventory
 */
inventory.prototype.getMCAndDCListFromDashboardInventoryCard = async function (Cloudtype) {
	util.waitForAngular();
	var currentUrl = await util.getCurrentURL()
	
	if(currentUrl.includes(appUrls.inventoryPageUrl)){
		this.navigateInventoryDashboard();
	}
	// Get all legends from inventory card pie chart
	var legendList = await dashboardObj.getAllLegendsFromInventoryCard();
	var multiCloudList =[],dataCentreList = [];
	for(var i=0; i<legendList.length; i++){
		// Remove IBM Data center from list
		if(legendList[i] == inventoryTestData.IBMDataCenter || legendList[i] == inventoryTestData.MyDataCenter){
			dataCentreList.push(legendList[i]);
		}	
		else
		{
			multiCloudList.push(legendList[i]);
		}
	}
	//Filter the resut based on Cloud type
	if(Cloudtype == "MC")
	{
		return multiCloudList
	}
	else if(Cloudtype == "DC")
	{
		return dataCentreList
	}

};

/**
 * Method to select Teams and apply filters
 */
inventory.prototype.getglobalFilterTeamsList = async function () {
	var self = this;
	var teamsList =[];
	var count;
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.css(self.globalFilterContentCss)).get(0)), timeout.timeoutInMilis);
	return await element.all(by.css(self.globalFilterContentCss)).getText().then(async function (content) {
			if (content && content[1]) {
				var teams =  Array.from(content[1].split('\n'));
				if(teams.length > inventoryTestData.fourRecords)
				{
					count = inventoryTestData.fourRecords;
				}
				else {
					count = teams.length;
				}
				for(var i = 0; i < count; i++){
					teamsList[i] = teams[i];
				}
				teamsList.shift();
				logger.info("Teams list  - " + teamsList);
				return teamsList;
			}
	});
}

/**
 * Method to select Application Category Unit and apply filters
 */
inventory.prototype.getglobalFilterAppCategory = async function () {
	var self = this;
	var appCategoriesList =[];
	var count;
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.css(self.globalFilterContentCss)).get(0)), timeout.timeoutInMilis);
	return await element.all(by.css(self.globalFilterContentCss)).getText().then(async function (content) {
			if (content && content[2]) {
				var appCategories =  Array.from(content[2].split('\n'));
				if(appCategories.length > inventoryTestData.fourRecords)
				{
					count = inventoryTestData.fourRecords;
				}
				else {
					count = appCategories.length;
				}
				for(var i = 0; i < count; i++){
					appCategoriesList[i] = appCategories[i];
				}
				appCategoriesList.shift();
				logger.info("App Categories list  - " + appCategoriesList);
			}
	return appCategoriesList;
	});
}
/**
 * Method to get Applications/Resources By Region section label text 
 */
inventory.prototype.getAppsResByRegionSectionLabelText = function (subLabelText) {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.css(this.appsResByRegionSectionLabelCss)).get(0)), timeout.timeoutInMilis);
	var elementList = element.all(by.css(this.appsResByRegionSectionLabelCss));
	return element.all(by.css(this.appsResByRegionSectionLabelCss)).getText().then(function (appResByRegionSectionLabel) {
		logger.info("Section Label: " + appResByRegionSectionLabel[1]);
		util.scrollToWebElement(elementList.get(1));
		return appResByRegionSectionLabel[1];
	});
}
/**
 * Method to get resource by region count and plus unknown location count
 */
inventory.prototype.getResourceByRegionCount = async function (provider) {
	util.waitForAngular();
	var self = this;
	var totalResourcesByRegionCount = 0;
	var unknownCount = 0;
	var unknownText;
	if(provider === inventoryTestData.MyDataCenter){
			browser.wait(EC.presenceOf(element.all(by.css(this.geoMapCountryTextCss)).get(0)), timeout.timeoutInMilis);
    }else{
        browser.wait(EC.visibilityOf(element.all(by.css(this.geoMapCountryTextCss)).get(0)), timeout.timeoutInMilis);
    }
	browser.sleep(2000);
	return await element.all(by.css(this.geoMapCountryTextCss)).getText().then( async function (resourcesByRegionList) {
		for(var i = 0; i < resourcesByRegionList.length; i++){
			if(!isNaN(parseInt(resourcesByRegionList[i]))){
				totalResourcesByRegionCount = totalResourcesByRegionCount + parseInt(resourcesByRegionList[i]);
			}
		}
		browser.wait(EC.visibilityOf(element(by.css(self.tablePaginationCss))), timeout.timeoutInMilis);
		return await element.all(by.css(self.geoMapUnknownCss)).getText().then(function (unknown) {
			if (unknown.length > 0){
				unknownCount = unknown[0];
				unknownText = unknown[1];
				logger.info("Unknown resources Text: "+ unknownCount +" "+ unknownText);
			}
			else{
				logger.info("Unknown resource text not found");
				unknownCount = 0;
			}
			logger.info("total resources by region count including Unknown: ", totalResourcesByRegionCount + parseInt(unknownCount));
	        return totalResourcesByRegionCount+parseInt(unknownCount);
		});
	});
}


/**
 * Method to verify headers in application/resource list view
 */
inventory.prototype.getTagsSectionHeaders = async function () {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.tagsTextCss))), timeout.timeoutInMilis);
	browser.wait(EC.visibilityOf(element.all(by.css(this.applicationResourceTableColumnTitleCss)).get(0)), timeout.timeoutInMilis);
	return await element.all(by.css(this.applicationResourceTableColumnTitleCss)).getText().then(function (labels) {
		for (var i = 0; i < labels.length; i++) {
			labels[i] = labels[i].trim()
		}
		return labels;
	});
}

/**
 * Method to check if the given columns(in parameter) have values in tags section
 */
inventory.prototype.prescenceOfTagSubData = async function (subsectionName) {
	var self = this;
	util.waitForAngular();
	var subsectionXpath = subsectionName;
	browser.wait(EC.visibilityOf(element(by.css(this.tagsTextCss))), timeout.timeoutInMilis);
	browser.wait(EC.visibilityOf(element.all(by.css(this.applicationResourceTableColumnTitleCss)).get(0)), timeout.timeoutInMilis);
	return await element(by.xpath(subsectionXpath)).isPresent().then(function (result) {
		logger.info("Data available in tags section ---> ", result);
		return result;
	});
}

/**
 * Method to click on link in given column(in parameter) and get the name of link clicked
 */
inventory.prototype.clickAndGetNameTagSubSectionLink = async function (columnName) {
	var self = this;
	if(columnName == "name"){
		columnName = self.tagNameLinkXpath;
	}
	if(columnName == "subSection" ||columnName == "associatedTo" ){
		columnName = self.tagSubSystemLinkXpath;
	}
	let Name = "";
	browser.wait(EC.visibilityOf(element(by.xpath(columnName))), timeout.timeoutInMilis);
	return await element.all(by.xpath(columnName)).getText().then(async function (links) {
		logger.info("Tags subsection links count - " + links.length);
		let index = -1;
		for (var i = 0; i < links.length; i++) {
			if (links[i] !== '--') {
				index = i;
				Name = links[i];
				logger.info("Name link found - " + links[i]);
				break;
			}
		}
		if (index > -1) {
			return await element.all(by.xpath(columnName)).get(index).click().then(async function () {
				logger.info("Clicked on Name link - " + links[i]);
				return Name.trim();
			});
		} else {
			logger.info("No susbsytem found");

		}
	 
	});
}
/**
 * Method to get Overview Page title text
 */
inventory.prototype.getOverviewPageTitleText = async function(){
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.overviewPageTitle))), timeout.timeoutInMilis);
	return await element(by.css(this.overviewPageTitle)).getText().then(function(text){
		logger.info("overview page title text : "+text);
		return text;
	});
};

/**
 * Method to verify Resource Detail page sub section overview content availability
 */
inventory.prototype.resourceOverviewSubSectionContentCheck = async function () {
	var text = [];
	browser.wait(EC.visibilityOf(element(by.css(this.resourceOverviewSubSectionContentCss))), timeout.timeoutInMilis);
	return await element.all(by.css(this.resourceOverviewSubSectionContentCss)).then(async function (contents) {
		for (var i = 0; i < contents.length; i++) {
			text[i] = await contents[i].getText();
		}
		logger.info("Resource overview sub section content status - " + text);
		return text;
	});
}
/**
 * Method to find a resource in resource list view which has given column(:columnName) data
 */
inventory.prototype.getResourceWithTagData = async function (count, columnName) {
	var self = this;
	if(columnName == "name"){
		columnName = self.tagNameLinkXpath;
	}
	if(columnName == "subSection" ||columnName == "associatedTo" ){
		columnName = self.tagSubSystemLinkXpath;
	}
	if(count> 0)
	{
	  await util.clickOnTabButton(inventoryTestData.applicationsButtonName);
	  for(var i=0; i<count ; i++)
	  {
	   await util.clickOnTabButton(inventoryTestData.resourcesButtonName);
	   await self.searchTable(inventoryTestData.mainframeName);
	   await self.isViewDetailsButtonDisplayed(i);
	   await self.clickOnViewDetails();
	   var noData = await self.checkNoDataTable(self.tagSubsectionNoDataCss, "TagsSection");
	   var presence = await self.prescenceOfTagSubData(columnName)
	   if(!noData && presence)
	   {   
		   logger.info("tags section and subsection found");
		   break;
	   }
	    else{
		   browser.navigate().back();
	       logger.info("tags section not found");
		}
	  }
	}
	else 
	{   
		logger.info("Mainframe resources not found");
  
	}}

/**
 * Method to select multiple checkboxes dynamically in resource list view table
 */
 inventory.prototype.selectResourcesFromListView = async function (size) {
    var self = this;
    util.waitForAngular();
    var count = 1;
    var elementList = element.all(by.css(self.applicationResourceTableContentCss));
    await browser.wait(EC.visibilityOf(elementList.get(0)), timeout.timeoutInMilis);
    util.scrollToWebElement(elementList.get(0));
    browser.wait(EC.visibilityOf(element(by.css(this.applicationResourceTableContentCss))), timeout.timeoutInMilis);
    return await element.all(by.xpath(self.listViewCheckboxXpath)).getAttribute("disabled").then(async function (labels) {
        for (let i = 0; i < labels.length; i++) {
            if (labels[i]) {
                logger.info("Row "+i+" - checkbox disabled in list view")
            }
            else {
                await element.all(by.xpath(self.checkboxXpath)).get(i).click().then(function () {
                    logger.info("Row "+i+ " - selected checkbox in list view")
                    count++;
                });
                if (count > size){
                    break;
                }
            }
        }
    });
}

/**
 * Method to click on Top Insights untagged resources Application count
 * topInsightsSubSectionName - Untagged resources, Monitored resources, etc.
 * categoryName - Application, Environment, Unmanaged, etc.
 */
inventory.prototype.clickOntCategoryResourceCountFromTopInsightsSubSection = function (topInsightsSubSectionName, categoryName) {
	util.waitForAngular();
	var resourceCountForCategoryFromTopInsights = this.resourceCountForCategoryFromTopInsightsXpath.format(topInsightsSubSectionName, categoryName);
	browser.wait(EC.visibilityOf(element(by.xpath(resourceCountForCategoryFromTopInsights))), timeout.timeoutInMilis);
	return element(by.xpath(resourceCountForCategoryFromTopInsights)).click().then(function () {
		logger.info("Clicked on '" + categoryName + "' under " + topInsightsSubSectionName);
	});
}
/** 
 * Method to get number of unique links of particular column(columnName) in all pages(pagecount: loopcount)
 */
inventory.prototype.getCountOfLinks = async function (columnName,loopCount) {
	var self = this;
	var uniqueLinksEachPage = [];
	var uniquelinks = [];
	if(columnName == "name"){
		columnName = self.tagNameLinkXpath;
	}
	if(columnName == "subSection" ||columnName == "associatedTo" ){
		columnName = self.tagSubSystemLinkXpath;
	}
	browser.wait(EC.visibilityOf(element(by.xpath(columnName))), timeout.timeoutInMilis);
	for(var i= 0; i< loopCount ; i++){
	    await element.all(by.xpath(columnName)).getText().then(async function (links) {
			uniqueLinksEachPage = await util.removeDuplicates(links)
			uniquelinks = (uniquelinks + (uniqueLinksEachPage+",")).split(',');
			return element.all(by.css(self.paginationCss)).get(1).click().then(function(){
				logger.info("Clicked on page --> " +(i+1))
			});
	    }); 
	}
	uniquelinks = await util.removeDuplicates(uniquelinks);
	uniquelinks.pop();
	logger.info("Unique links available -->>" +uniquelinks);
	return uniquelinks.length;
}

/**
 * Get page count for the tables [Associated Applications/Resources, Applications table]
 */
inventory.prototype.getPageCountForAppsResourcesTable = function(){
	var self = this;
	var loopCount = 0;
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.paginationDetailsTextCss))), timeout.timeoutInMilis);
	return element(by.css(this.applicationResourceTableItemsPerPageCss)).getText().then(function(itemsPerPage){
		return element(by.css(self.paginationDetailsTextCss)).getText().then(function(paginationInfo){
			var sepInfo = paginationInfo.trim().split(" ");
			var pageSize = parseInt(itemsPerPage);
			var totalEntries = parseInt(sepInfo[2]);
			logger.info("Page Size: "+pageSize+", Total Entries: "+totalEntries);
			if(totalEntries % pageSize == 0){
				loopCount = (totalEntries / pageSize);
			}
			else{
				loopCount = Math.ceil(totalEntries / pageSize);
			}
			logger.info("Total number of pages to travese: "+loopCount);
			return loopCount;
		});
	});
}

/**
 * Method to select Assign & Remove Tags option in Resources List view
 */
 inventory.prototype.selectAssignRemoveTags = function (tagOption) {
    util.waitForAngular();
    if (tagOption === "Assign Tags"){
        browser.wait(EC.visibilityOf(element.all(by.css(this.assignRemoveTagsCss)).get(0)), timeout.timeoutInMilis);
        return element.all(by.css(this.assignRemoveTagsCss)).get(0).click().then(function () {
                logger.info("Clicked on "+ tagOption);
        });
    }
    else {
        browser.wait(EC.visibilityOf(element.all(by.css(this.assignRemoveTagsCss)).get(1)), timeout.timeoutInMilis);
        return element.all(by.css(this.assignRemoveTagsCss)).get(1).click().then(function () {
            logger.info("Clicked on "+ tagOption);
        });
    }
}

/*
  Click on Tag Cancel button in Resources List view
*/
inventory.prototype.clickOnTagCancelButton = function() {
    util.waitForAngular();
    browser.wait(EC.visibilityOf(element(by.css(this.tagCancelButtonCss))), timeout.timeoutInMilis);
    return element(by.css(this.tagCancelButtonCss)).click().then(function () {
           logger.info("Clicked on tag Cancel button");
    });
}

/*
    Method to check either selected resource count along with 'item(s) selected' text is displaying on not in Resource List view
    Ex: '1 item selected' should be displayed in Assign / Remove tags bar of resources list view
*/
inventory.prototype.isSelectedResourcesCountWithTextPresent = async function() {
    util.waitForAngular();
    var selectedResource = element(by.css(this.selectedResourcesTextCss));
    browser.wait(EC.visibilityOf(selectedResource), timeout.timeoutInMilis);
    return await selectedResource.isPresent().then(async function(result) {
        if(result) {
            var text = await selectedResource.getText();
            var count = text.toString().replace(/[^0-9.]/g, '');
            logger.info("Selected Item(s) text:", text);
            return text;
        }
    });
}

/**
 * Method to verify Assign/Remove Tags page title
 */
inventory.prototype.taggingPageTitle = async function () {
	browser.wait(EC.visibilityOf(element(by.css(this.resourceTaggingHeaderTitleCss))), timeout.timeoutInMilis);
	return await element(by.css(this.resourceTaggingHeaderTitleCss)).getText().then(function (text) {
		logger.info("Tagging page title text : " + text.trim());
		return text.trim();
	});
}
/** 
 * Get subsystem counts and lpar counts from application overview --> view details section
 */
inventory.prototype.getSubsystemsCountAsscOverview = async function(){
	var self = this;
	var subSystemCount = 0;
	var count = 0;
	util.waitForAngular();
	self.getListViewHeaders();
	browser.wait(EC.visibilityOf(element(by.xpath(self.tagNameLinkXpath))), timeout.timeoutInMilis);
	return await element.all(by.xpath(self.tagNameLinkXpath)).getText().then(async function (links) {
		for(var i = 0 ; i< links.length ; i++)
		{
			var lparCount = links.length;
			browser.wait(EC.visibilityOf(element(by.xpath(self.tagNameLinkXpath))), timeout.timeoutInMilis);
		    await element.all(by.xpath(self.tagNameLinkXpath)).get(i).click().then(async function () {
			    await self.getListViewHeaders();
				var presence = await self.prescenceOfTagSubData(self.tagSubSystemLinkXpath);
				if(presence){
				var loopCount = await self.getPageCountForAppsResourcesTable();
				var count = await self.getCountOfLinks("subSection",loopCount);
				logger.info(count);
				}
				else
				{
                   count = 0;
				}
			    subSystemCount = subSystemCount + count;
				logger.info("count summary" +subSystemCount);
				browser.navigate().back();
				await self.getListViewHeaders();
			});
		}
		return {subSystemCount,lparCount};
	});
}


/**
 * Method to click on Selected Resources/Application/Environment dropdown on assign/remove tags page
 */
inventory.prototype.clickDropDownAssignOrRemoveTagsScreen = async function (options, row , column) {
    util.waitForAngular();
    var i = 0;
    var self = this;
    var clickDropDown;
    clickDropDown = self.resourceTagsDropdownXpath;
    if (row == 1 && column > 0){
        i = column - 1;
    }
    else {
        i = (column - 1) + 5;
    }
    util.waitForAngular();
    await browser.wait(EC.elementToBeClickable(element(by.xpath(clickDropDown))), timeout.timeoutInMilis);
    return await element.all(by.xpath(clickDropDown)).get(i).click().then(function () {
        logger.info("Clicked on dropdown menu :", options);
    });
}

/* Method to select items from Resources dropdown in Tags Model
 */
inventory.prototype.selectResourcesAssignOrRemoveTagsScreen = async function (size) {
    util.waitForAngular();
    var self = this;
    for(var i=0; i <size;i++){
        await element.all(by.xpath(self.tagModelDropdownItemsXpath)).get(i).click();
    }
    logger.info("Total selected checkboxes:",size)
    return await element.all(by.xpath(self.tagModelItemName)).getText().then(async function (labels) {
        if (labels) {
            labels = JSON.stringify(labels);
            logger.info("Selected item from dropdown : ", labels);
            return await element(by.xpath(self.resourceIDDropdownCloseXpath)).click().then(async function () {
                logger.info("Closed selected dropdown");
            });
        } else {
            logger.info("Dropdown not found in Tag Model : ", labels);
        }
    });
};

/* Method to select key name from tag key dropdown menu based on index
 */
inventory.prototype.selectTagKeysAssignOrRemoveTagsScreen = async function (tagKeyLabelName, selectByIndex, provider) {
	util.waitForAngular();
	var self = this;
	var keysLength = await element.all(by.xpath(self.tagModelDropdownItemsXpath)).count();
	return await element.all(by.xpath(self.tagModelDropdownItemsXpath)).getText().then(async function (optionsAvailable) {
		if (optionsAvailable) {
			if (provider != 'GCP') {
				optionsAvailable = JSON.stringify(optionsAvailable);
				logger.info("Available Options in " + tagKeyLabelName + " dropdown : ", optionsAvailable);
				if (keysLength < selectByIndex) {
					await element.all(by.xpath(self.tagModelDropdownItemsXpath)).get(keysLength - 1).click();
				} else {
					await element.all(by.xpath(self.tagModelDropdownItemsXpath)).get(selectByIndex).click();
				}
				return optionsAvailable;
			} else {
				logger.info("Available Options in " + tagKeyLabelName + " dropdown : ", optionsAvailable);
				logger.info("Select tag keys without uppercase characters due to GCP limitations")
				var isSuccess = false;
				var result;
				var positions = [];
				for (var index = 0; index < optionsAvailable.length; index++) {
					result = /[a-z]/.test(optionsAvailable[index]) && !/[A-Z]/.test(optionsAvailable[index]);
					if (result) {
						isSuccess = true;
						positions.push(index);
					}
				}
				await element.all(by.xpath(self.tagModelDropdownItemsXpath)).get(positions[selectByIndex-1]).click();
				logger.info("Tag key selected : " + optionsAvailable[positions[selectByIndex-1]])
				return optionsAvailable[positions[selectByIndex-1]];
			}
		}
	});
	
};

/**
 * Method to select multiple Application/Environment tag values from dropdown on assign tags page
 */
inventory.prototype.selectTagValuesAssignOrRemoveTagsScreen = async function (size, provider) {
	util.waitForAngular();
	var self = this;
	var selectedItem = [];
	// Fetch all the values in dropdown
	var tagValues = await element.all(by.xpath(self.tagModelDropdownItemsXpath)).getText();
	if (provider == 'GCP') {
		var isSuccess = false;
		var positions = [];
		var result;
		for (var index = 0; index < tagValues.length; index++) {
			result = /[a-z]/.test(tagValues[index]) && !/[A-Z]/.test(tagValues[index]) && /[\-_]/.test(tagValues[index]);
			if (result) {
				isSuccess = true;
				positions.push(index);	
			}
		}
			if (size == '1') {
			await element.all(by.xpath(self.tagModelDropdownItemsXpath)).get(positions[0]).click();
		} else {
			await element.all(by.xpath(self.tagModelDropdownItemsXpath)).get(positions[1]).click();
		}
	} else {
		for (var i = 0; i < size; i++) {
			await element.all(by.xpath(self.tagModelDropdownItemsXpath)).get(i).click();
		}
	}
	return await element.all(by.xpath(self.tagModelItemName)).getText().then(async function (labels) {
		if (labels) {
			selectedItem = labels;
			logger.info("Selected item from dropdown : " + selectedItem);
			await element.all(by.xpath(self.tagModelAppEnvDropdownCloseXpath)).get(0).click().then(async function () { });
			logger.info("Closed selected dropdown");
			return [selectedItem.join()];
		} else {
			logger.info("Dropdown not found in Tag Model : " + labels);
			return [];
		}
	});
};

/**
 * Method to click on Assign/Remove Tags button
 */
 inventory.prototype.clickOnAssignRemoveButton = async function (options) {
    var self = this;
    util.waitForAngular();
    if (options.indexOf("Assign") != -1) {
        return await element.all(by.id(self.tagModelAssignXpath)).click().then(function () {
            logger.info("Clicked on Assign button");
			util.waitOnlyForInvisibilityOfCarbonDataLoader()
        });
    }
    else {
        return await element.all(by.id(self.tagModelRemoveXpath)).click().then(function () {
            logger.info("Clicked on Remove button");
			util.waitOnlyForInvisibilityOfCarbonDataLoader()
        });
    }
}

/*
 * Method to get values of selected resource from Resources list view by index id
 */
 inventory.prototype.getColumnValueBasedOnIndex = async function (list, size, columnNamesList, columnNamesListToGetIndex) {
    var getColumnValuesByIndex = [];
    var i;
    if (list.length && size) {
        for (i=0; i < columnNamesList.length;i++) {
            for (var j=0; j < columnNamesListToGetIndex.length;j++) {
                if(columnNamesList[i] === columnNamesListToGetIndex[j]) {
                    var valueByIndex = list[i];
                    getColumnValuesByIndex.push(valueByIndex);
                    break;
                }
            }
        }
        i=0;
        return getColumnValuesByIndex;
    }
}

/**
  Method to get details of selected resources rows by clicking on checkbox from resources list view table
*/
  inventory.prototype.getSelectedRowsFromListView = async function (columnNamesListToGetIndex) {
      var self = this;
      util.waitForAngular();
   	  var headerColumnNames = await this.getListViewHeaders();
      var elementList = element.all(by.css(self.applicationResourceTableOverflowMenuCss));
      await browser.wait(EC.visibilityOf(elementList.get(0)), timeout.timeoutInMilis);
      return await element.all(by.xpath(self.listViewSelectedRowDataXpath)).getAttribute("title").then(async function (labels) {
          //Splitting rows data into different list.
          var rows = [];
          var columns = headerColumnNames.length;
          var row;
          var size = 1;
          for (let index = 1; index <= labels.length;) {
              row = await self.getColumnValueBasedOnIndex((labels.slice(index, index+columns)), size, headerColumnNames, columnNamesListToGetIndex);
              rows.push(row);
              size = size + 1;
              index = index + columns + 2;
          }
          rows = util.removeBlankSpacesInArray(rows);
          logger.info("Selected Resource Details :", rows);
          return rows;
      });
 }

/*
    Method to check specific provider is present or not in Global Filter
*/
inventory.prototype.checkPresenceOfProviderInGlobalFilter = async function (McDcCloudList, providerName) {
    var name;
    if(McDcCloudList.includes(providerName)){
        logger.info(providerName + " provider is present in Global Filter");
        name = providerName;
    }
    else {
        logger.info(providerName + " provider is not present in Global Filter");
    }
   return name;
}

/*
    Get Untagged Resources Application and Environment counts Before and After Assign tags
*/
inventory.prototype.getUntaggedResourcesAppEnvCount = async function() {
    util.waitForAngular();
    var untaggedResourcesApplicationCount = await this.getCategoryResourceCountFromTopInsightsSubSection(inventoryTestData.untaggedResourcesSubSectionLabel,
                                                      inventoryTestData.untaggedResourcesApplicationLabel);
    var untaggedResourcesEnvironmentCount = await this.getCategoryResourceCountFromTopInsightsSubSection(inventoryTestData.untaggedResourcesSubSectionLabel,
													  inventoryTestData.untaggedResourcesEnvironmentLabel);									  
    return {untaggedResourcesApplicationCount,
            untaggedResourcesEnvironmentCount};
}

/*
    Get number of records to select in resource list view and return status true/false based on data availability in Resources list view
*/
inventory.prototype.getNumberOfRecordsToSelect = async function(selectedOption) {
    var numberOfRecords;
    var untaggedAppEnvCount = await this.getUntaggedResourcesAppEnvCount();
    var noDataInListView = await this.checkNoData(this.listViewNoDataDisplayCss, "resourceListView");
    if(!noDataInListView) {
        var availableCountInListView = await this.clickOnItemsPerPage(this.applicationResourceTableItemsPerPageCss, inventoryTestData.listViewItemPerPage, 0);
        if(selectedOption === inventoryTestData.untaggedResourcesApplicationLabel) {
            if(untaggedAppEnvCount.untaggedResourcesApplicationCount > 1) {
                numberOfRecords = inventoryTestData.thirdIndex;
                if(availableCountInListView < numberOfRecords) {
                    numberOfRecords = availableCountInListView;
                }
            } else if(untaggedAppEnvCount.untaggedResourcesApplicationCount > 0 && untaggedAppEnvCount.untaggedResourcesApplicationCount < 2) {
                numberOfRecords = inventoryTestData.firstIndex;
            } else {
                logger.info("No Application Untagged resource");
            }
        } else if(selectedOption === inventoryTestData.untaggedResourcesEnvironmentLabel) {
            if(untaggedAppEnvCount.untaggedResourcesEnvironmentCount > 1) {
                numberOfRecords = inventoryTestData.secondIndex;
                if(availableCountInListView < numberOfRecords) {
                    numberOfRecords = availableCountInListView;
                }
            } else if(untaggedAppEnvCount.untaggedResourcesEnvironmentCount > 0 && untaggedAppEnvCount.untaggedResourcesEnvironmentCount < 2) {
                numberOfRecords = inventoryTestData.firstIndex;
            } else {
                logger.info("No Environment Untagged resource");
            }
        } else {
            numberOfRecords = inventoryTestData.thirdIndex;
            if(availableCountInListView < numberOfRecords) {
                numberOfRecords = availableCountInListView;
            }
        }
        if(numberOfRecords > 10) {
            numberOfRecords = 10;
        }
    }
    return {numberOfRecords, noDataInListView};
}

/*
* Method to get the details of selected resources after assign tags to same resources
  Parameters:
    selectedResourcesList : Return selected resources details before assign tags
    option : selected option (Application or Environment) from 'Untagged Resources' section
    listOfColumnsToFetch : List of columns to fetch details
    selectedApplicationTag : Application tags selected to assign on 'Assign Tags' page
    selectedEnvironmentTag : Environment tags selected to assign on 'Assign Tags' page
  Return:
    appTags: Array of all assigned application tags to selected resources
    envTags: Array of all assigned environment tags to selected resources
    count: Count of unassigned tags Application/Environment column from list of selected resources based of
           'Application / Environment' option in Untagged Resources
*/
inventory.prototype.getSelectedResourceTaggingDetails = async function(selectedResourcesList, option, listOfColumnsToFetch,
                                                                            selectedApplicationTag, selectedEnvironmentTag) {
        var count=0, i;
        var resourceDetailsAfterTagging = [], appTags = [], envTags = [];
        var noData = await this.checkNoData(this.listViewNoDataDisplayCss, "resourceListView");
        for(i=0; i < selectedResourcesList.length; i++) {
            if(option === inventoryTestData.untaggedResourcesApplicationLabel) {
                if(selectedResourcesList[i][3] === '--') {
                    count = count+1;
                } else {
                    count;
                }
            } else if(option === inventoryTestData.untaggedResourcesEnvironmentLabel) {
                if(selectedResourcesList[i][2] === '--') {
                    count = count+1;
                }else {
                    count;
                }
            }
            // Search by Resource ID of selected Assigned Tags resource
            await this.searchTable(selectedResourcesList[i][0]);
            if(!noData) {
                await this.isAppResTableDisplayed();
                await this.selectResourcesFromListView(inventoryTestData.firstIndex);
                resourceDetailsAfterTagging = await this.getSelectedRowsFromListView(listOfColumnsToFetch);
                appTags.push(resourceDetailsAfterTagging[0][2]);
                appTags.sort();
                envTags.push(resourceDetailsAfterTagging[0][3]);
                envTags.sort();
                resourceDetailsAfterTagging = JSON.stringify(resourceDetailsAfterTagging);
                // Click on 'Cancel' option of Assign/Remove Tags bar displaying in Resources List View
                await this.clickOnTagCancelButton();
            } else {
                noData;
            }
        }
        appTags = JSON.stringify(appTags);
        envTags = JSON.stringify(envTags);
        logger.info("Assigned Application Tags to all selected resources :"+appTags);
        logger.info("Assigned Environment Tags to all selected resources :"+envTags);
        return {appTags, envTags, count, noData};
}

/**
 * Method to check whether application breakdown and resource region works on different browsers
 */
inventory.prototype.checkMouseHoverOnApplicationBeakdownAndResources = async function (browserName) {
	var browserBool = inventoryTestData.browsers.includes(browserName)
	if(browserBool){
		var listViewCount =await this.getApplicationOrResourcesTableHeaderTextCount()
		var regionCount =await this.getResourceByRegionCount()
		if(listViewCount && regionCount > 0){
			 return true
		}
		return false
	}
	return true
 }

 /*
 * Method to select filter/any checkbox based on text
 */

inventory.prototype.clickAndGetTextFromGlobalFilters = async function (filterList) {
	var self = this;
	util.waitForAngular();
	var filterBasedOnNameXpath = self.globalFilterXpath.format(filterList);
	return element(by.xpath(filterBasedOnNameXpath)).click().then(function () {
		logger.info('checkbox is clicked under ' + filterList);
		return filterList;
	})
}

/**
 * Method to fetch counts of top insights , Application breakdown , resources by region , application List view
 */

inventory.prototype.getCountsFromAllWidgetsApplication = async function (dataSource) {
	var self = this;
	var resourceByRegionCount = 0;
	var listviewcount = 0
	var applicationCount;
	var applicationsWithMostEOLResourcesCounts = [];
	var applicationsWithMostActiveResourcesCounts = [];
	util.waitForAngular();
	var applicationsWithMostResourcesCounts = await self.getResourcesCountFromTopInsightsSubSection(inventoryTestData.applicationsWithMostResourcesSubSectionLabel);
	var  applicationsWithMostActiveResourcesCounts = await self.getResourcesCountFromTopInsightsSubSection(inventoryTestData.applicationsWithMostActiveResourcesSubSectionLabel);
	var applicationsWithMostEOLResourcesCounts = await self.getResourcesCountFromTopInsightsSubSection(inventoryTestData.applicationsWithMostEOLResourcesSubSectionLabel);
	browser.wait(EC.visibilityOf(element(by.css(this.applicationResourceTableHeaderCss))), timeout.timeoutInMilis);
    await element(by.css(self.applicationResourceTableHeaderCss)).getText().then(function(applicationResourceCount){
        var count = applicationResourceCount.toString().replace(/[^0-9.]/g, '');
        logger.info("Application or Resources header count : "+count);
        applicationCount = Number(count);
    })
    if (applicationCount > 0) {
        if(!dataSource){
            resourceByRegionCount = await self.getResourceByRegionCount();
        }else if(dataSource == inventoryTestData.MyDataCenter ){
            resourceByRegionCount = await self.getResourceByRegionCount(inventoryTestData.MyDataCenter);
        }
        listviewcount = await self.getApplicationOrResourcesTableHeaderTextCount();
    }
	var appResBreakdownList = await self.getApplicationResourceBreakdownGraphText();
	return {
		applicationsWithMostResourcesCounts, applicationsWithMostActiveResourcesCounts, applicationsWithMostEOLResourcesCounts, resourceByRegionCount, listviewcount, appResBreakdownList
	}
}

/**
 * Method to fetch counts of top insights , resource breakdown , resources by region , resource List view
 */

inventory.prototype.getCountsFromAllWidgetsResource = async function (dataSource) {
	var self = this;
	var resourceByRegionCount;
	util.waitForAngular();
	var untaggedResourcesCounts = await self.getCountsFromTopInsightsResources(inventoryTestData.untaggedResourcesSubSectionLabel);
	var monitoredResourcesCounts = await self.getCountsFromTopInsightsResources(inventoryTestData.monitoredResourcesSubSectionLabel);
	var resourceCloudReadinessCounts = await self.getCountsFromTopInsightsResources(inventoryTestData.resourceCloudReadinessSubSectionLabel);
	var resourceCurrencyDesignatorCounts = await self.getCountsFromTopInsightsResources(inventoryTestData.resourceCurrencyDesignatorSubSectionLabel);
	if (!dataSource) {
		resourceByRegionCount = await self.getResourceByRegionCount();
	}else if(dataSource == inventoryTestData.MyDataCenter){
        resourceByRegionCount = await self.getResourceByRegionCount(inventoryTestData.MyDataCenter);
    }
	var listviewcount = await self.getApplicationOrResourcesTableHeaderTextCount();
	var appResBreakdownList = await self.getApplicationResourceBreakdownGraphText();

	return {
		untaggedResourcesCounts, monitoredResourcesCounts, resourceCloudReadinessCounts, resourceCurrencyDesignatorCounts, resourceByRegionCount, listviewcount, appResBreakdownList
	}
}

/**
 * Method to get list of Application global filters
 */
inventory.prototype.getglobalFilterApplicationList = async function () {
	var self = this;
	var applicationList = [];
	var count;
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.css(self.globalFilterContentCss)).get(0)), timeout.timeoutInMilis);
	return await element.all(by.css(self.globalFilterContentCss)).getText().then(async function (content) {
		if (content && content[3]) {
			var applications = Array.from(content[3].split('\n'));
			if (applications.length > inventoryTestData.threeRecords) {
				count = inventoryTestData.threeRecords;
			}
			else {
				count = applications.length;
			}
			for (var i = 0; i < count; i++) {
				applicationList[i] = applications[i];
			}
			applicationList.shift();
			logger.info("Application filter list  - " + applicationList);
			return applicationList;
		}
	});
}

/**
  * Get Application name from top insights sub section name
  */
inventory.prototype.getAppResNameFromTopInsightsSubSection = function (subSectionName) {
	util.waitForAngular();
	var resourceNameFromTopInsights = this.appNameFromTopInsightsXpath.format(subSectionName);
	var resourceCountFromTopInsights = this.resourceCountForAppsFromTopInsightsXpath.format(subSectionName);
	browser.wait(EC.visibilityOf(element.all(by.xpath(resourceCountFromTopInsights)).get(0)), timeout.timeoutInMilis);
	return element.all(by.xpath(resourceNameFromTopInsights)).getText().then(function (resNameList) {
		for (var i = 0; i < resNameList.length; i++) {
			logger.info(resNameList[i]);
		}
		logger.info("Resource list for " + subSectionName);
		return resNameList;
	});

}

/* Select assigned tags only for untagging */
inventory.prototype.selectTagsToBeRemoved = async function (tagsArray , tagKeys , tagKeyValueDetails) {
	util.waitForAngular();
	var self = this;
		await element(by.xpath(self.selectAssignedTags.format(tagsArray))).click();
		logger.info("Clicked on " + tagsArray + " checkbox");
	
	// close the dropdown menu after selection
	return await element.all(by.xpath(self.tagModelItemName)).getText().then(async function (labels) {
		if (labels) {
			logger.info("Selected item from dropdown " + labels);
			return await element.all(by.xpath(self.tagModelAppEnvDropdownCloseXpath)).get(0).click().then(async function () {
				return true;
			});
		} else {
			logger.info("Dropdown not found in Tag Model " + labels);
			return false;
		}
	});
}

/* Selected tags which are assigned to selcted resource  */
inventory.prototype.removeAssignedTags = async function (selectedAppKeys,selectedEnvKeys ,tagKeyValueDetails) {
	var self = this;
	var appTagToBeRemoved , envTagToBeRemoved;
	// Split tag-key values 
	var tagKeyValue = await self.getAssignedTagKeyValueDetails(tagKeyValueDetails);
	//click on remove tags link
	await self.selectAssignRemoveTags(inventoryTestData.removeTags);
	for(var i=0; i<selectedAppKeys.length ; i++){
		appTagToBeRemoved = tagKeyValue[selectedAppKeys[i]] ;
		envTagToBeRemoved = tagKeyValue[selectedEnvKeys[i]];
		// Select single resource from 'Select resources' dropdown in Assign Tags window
		await self.clickDropDownAssignOrRemoveTagsScreen(inventoryTestData.assignRemoveSelectedResources, i+1, inventoryTestData.firstIndex);
		await self.selectResourcesAssignOrRemoveTagsScreen(inventoryTestData.firstIndex);
		// Select Application key from 'Application key' dropdown in Assign Tags window
		await self.clickDropDownAssignOrRemoveTagsScreen(inventoryTestData.assignRemoveApplicationTagKey, i+1, inventoryTestData.secondIndex);
		await self.selectAssignedTagKeys(selectedAppKeys[i]);
		// Select Application value from 'Application value' dropdown in Assign Tags window
		await self.clickDropDownAssignOrRemoveTagsScreen(inventoryTestData.assignRemoveApplicationTagValue, i+1, inventoryTestData.thirdIndex);
		await self.selectTagsToBeRemoved(appTagToBeRemoved);
		// Select Environment key from 'Environment key' dropdown in Assign Tags window
		await self.clickDropDownAssignOrRemoveTagsScreen(inventoryTestData.assignRemoveEnvironmentTagKey, i+1, inventoryTestData.fourthIndex);
		await self.selectAssignedTagKeys(selectedEnvKeys[i]);
		// Select Environment value from 'Environment value' dropdown in Assign Tags window
		await self.clickDropDownAssignOrRemoveTagsScreen(inventoryTestData.assignRemoveEnvironmentTagValue, i+1, inventoryTestData.fifthIndex);
		await self.selectTagsToBeRemoved(envTagToBeRemoved);

		//if(selectedAppKeys.length > 1  || selectedEnvKeys.length > 1){
		if((selectedAppKeys.length - i) >= 2){
			//Click on + icon to add new row
			await self.clickOnAddNewRowIcon();
		}
}
	// Click on Assign Tags button
	await self.clickOnAssignRemoveButton(inventoryTestData.removeTags);
	util.waitForAngular();
}

/**
 * Method to verify message present on assign Tags page for GCP resource only: GCP resource supports only one tag value for Application and Environment key
 */
 inventory.prototype.taggingGcpResourceNotePresent = async function () {
	var noteForGCPTagging = this.gcpTaggingNoteXpath.format(inventoryTestData.gcpAssignTagsNote);
	browser.wait(EC.visibilityOf(element(by.xpath(noteForGCPTagging))), timeout.timeoutInMilis);
	return await element(by.xpath(noteForGCPTagging)).getText().then(function (text) {
		logger.info("Note for GCP resources on assign page : " + text.trim());
		return text.trim();
	});
}

/**
 * Method to click countries in geo map and get text
 */
inventory.prototype.clickAndGetTextFromResourceByRegion = async function (country) {
	var self = this;
	var status = false;
	var categoryToolTip;
	var noData = await self.checkNoData(self.breakdownSubSectionNoDataCss, "breakdown");
	if (!noData) {
		var toolTipContent;
        var elementList = element.all(by.css(self.geoMapCountryPathCss));
        browser.wait(EC.visibilityOf(elementList.get(0)), timeout.timeoutInMilis);
        util.scrollToWebElement(elementList.get(0));
        return await elementList.count().then(async function (count) {
            if (count > 5) {
                count = 5;
            }
            for (var i = 0; i < count; i++) {
				if(!status){
                await browser.actions().mouseMove(elementList.get(i)).perform().then(async function () {
                      browser.wait(EC.visibilityOf(element.all(by.css(self.geoMapToolTipTextCss)).get(0)), timeout.timeoutInMilis);
                      await element(by.css(self.geoMapToolTipTextCss)).getText().then(async function (tooTipText) {
							toolTipContent = tooTipText;
							toolTipContent = toolTipContent.substring(0,toolTipContent.indexOf('\n'));
							if(toolTipContent === country){
								browser.wait(EC.visibilityOf(element.all(by.css(self.geoMapCountryTextCss)).get(i)), timeout.timeoutInMilis);
								await browser.actions().mouseMove(element.all(by.css(self.geoMapCountryTextCss)).get(i)).click().perform().then(async function (){
									util.waitOnlyForInvisibilityOfCarbonDataLoader();
									categoryToolTip = tooTipText;
								    logger.info("Clicked on category---> " +categoryToolTip);
				                    status = true;
								   });
                            }
                        });
					});
				}
            }
    return categoryToolTip;
        });
	}
};

/**
 * Method to get tooltip value from Application/Resource by Region
 */
inventory.prototype.getApplicationResourceByRegionToolTip = async function () {
	var self = this;
	browser.waitForAngular();
	var noData = await self.checkNoData(self.breakdownSubSectionNoDataCss, "geoMap");
	if (!noData) {
		var toolTipContent = [];
		var elementList = element.all(by.css(self.geoMapCountryTextCss));
		browser.wait(EC.visibilityOf(elementList.get(0)), timeout.timeoutInMilis);
		util.scrollToWebElement(elementList.get(0));
		return await elementList.count().then(async function (count) {
			if (count > 2) {
				count = 2;
			}
			for (var i = 0; i < count; i++) {
				await browser.actions().mouseMove(elementList.get(i)).perform().then(async function () {
					browser.wait(EC.visibilityOf(element.all(by.css(self.geoMapToolTipTextCss)).get(0)), timeout.timeoutInMilis);
					await element(by.css(self.geoMapToolTipTextCss)).getText().then(function (tooTipText) {
						toolTipContent[i] = tooTipText;
						toolTipContent[i] = toolTipContent[i].substring(0,toolTipContent[i].indexOf('\n'));
					});
				});
			}
			return toolTipContent;
		});
	}
}

/**
 * Method to get active or selected box text
 */
inventory.prototype.getActiveBoxText = async function (widget) {
	var self = this;
	var activeBoxText;
	if(widget === inventoryTestData.applicationBreakdownSectionLabel || widget === inventoryTestData.resourcesBreakdownSectionLabel){
	   var elementList = element.all(by.css(self.applicationResourcesBreakDownCss));
	   browser.wait(EC.visibilityOf(elementList.get(0)), timeout.timeoutInMilis);
	   return await element(by.css(self.breakdownActiveBoxTextCss)).getText().then(function(activeBoxText){
		   logger.info("Active Box in breakdown ---->" +activeBoxText)
		     return activeBoxText;
		});
	}
	else if (widget === inventoryTestData.applicationsByRegionSectionLabel || widget === inventoryTestData.resourcesByRegionSectionLabel)
	{
		var elementList = element.all(by.css(self.geoMapCountryTextCss));
		browser.wait(EC.visibilityOf(elementList.get(0)), timeout.timeoutInMilis);
		await browser.actions().mouseMove(element(by.css(self.gepMapActiveBoxCss))).perform().then(async function () {
			browser.wait(EC.visibilityOf(element.all(by.css(self.geoMapToolTipTextCss)).get(0)), timeout.timeoutInMilis);
            return await element(by.css(self.geoMapToolTipTextCss)).getText().then(function (tooTipText) {
				var toolTipContent = tooTipText;
				activeBoxText = toolTipContent.substring(0,toolTipContent.indexOf('\n'));
				logger.info("Active Box in geo map ---->" +activeBoxText)
			});
		});
	return activeBoxText;
	}
};

/**
 * Method to get total number of pages and Items in Application/Resource list view
 */
inventory.prototype.getTotalPagesAndItemsInListView = async function(){
	var self = this;
	util.waitForAngular();
	var pageSize = [];
	var totalEntries = [];
	browser.wait(EC.visibilityOf(element(by.css(this.paginationDetailsTextCss))), timeout.timeoutInMilis);
	await element(by.css(this.applicationResourceTableItemsPerPageCss)).getText().then(async function(itemsPerPage){
		return await element(by.css(self.paginationDetailsTextCss)).getText().then(async function(paginationInfo){
			var sepInfo = paginationInfo.trim().split(" ");
			pageSize = parseInt(itemsPerPage);
			totalEntries = parseInt(sepInfo[2]);
		});
	});
	return {pageSize,totalEntries};
}


/**
 * Method to click on given pages: pagenumber
 */
inventory.prototype.clickOnPageNumber = async function (pagenumber,totalEntries) {
	var self = this;
	util.waitForAngular();
    if(totalEntries < 10000){
	   browser.wait(EC.visibilityOf(element(by.css(self.tablePaginationCss))), timeout.timeoutInMilis);
	   return await element.all(by.css(self.applicationResourceTablePaginationDropdown)).click().then(async function(){
		      return await element(by.xpath(self.paginationDropdownIDXpath)).all(by.tagName('option')).then(async function(options) {
			         await options[pagenumber].click();
			         logger.info("Clicked on page number ---->" +(pagenumber+1));
			    });
	    });
	}  
	else if(totalEntries > 10000) {
		for(var i =0; i < pagenumber; i++){
		   browser.wait(EC.visibilityOf(element(by.css(self.tablePaginationCss))), timeout.timeoutInMilis);
		        await element.all(by.css(self.paginationForwardButton)).click().then(function(){
			    });
		}
	logger.info("Clicked on page number ---->" +(pagenumber+1));
	}  
	
}

/**
 * Method to click on next pages: pagination
 */
inventory.prototype.getPageNumber = async function (totalEntries) {
	var self = this;
	util.waitForAngular();
	if(totalEntries < 10000){
	   browser.wait(EC.visibilityOf(element(by.css(self.tablePaginationCss))), timeout.timeoutInMilis);
	   return await element.all(by.css(self.applicationResourceTablePaginationDropdown)).click().then(async function(){
		    return await element(by.xpath(self.paginationDropdownIDXpath)).all(by.tagName('option')).then(async function() {
			     return await element.all(by.css('option:checked')).get(1).getText().then(function(selectedPageNumber) {
				    logger.info("selectedPageNumber---->" +selectedPageNumber);
				     return parseInt(selectedPageNumber);		
		        });
	        });
		});
    }
	else if(totalEntries > 10000)
	{
	   browser.wait(EC.visibilityOf(element(by.css(self.tablePaginationCss))), timeout.timeoutInMilis);
	   return await element.all(by.css(self.paginationUpAndDownDropdown)).click().then(async function(){
		   return await element.all(by.css(self.paginationUpAndDownDropdown)).getAttribute('value').then(async function(pageText){
			logger.info("selectedPageNumber---->" +parseInt(pageText));
			return parseInt(pageText);
		   });
	   });
	}

}


/**
 * Method to get the text from search bar
 */
inventory.prototype.getTextFromSearchBar = async function () {
	var self = this;
	util.waitForAngular();
	browser.sleep(1000);
	browser.wait(EC.visibilityOf(element(by.css(self.searchBarInput))), timeout.timeoutInMilis);
	util.scrollToWebElement(element(by.css(this.applicationResourceTableColumnTitleCss)));
	return await element(by.css(self.searchBarInput)).getAttribute('value').then(function (searchText) {
		logger.info("searchText----> " +searchText);
		return searchText;
	});
}

/**
 * Method to get the column which is sorted in list view
 */
inventory.prototype.getSortedColumnIndex = async function() {
	var self = this;
	var selectedText;
	util.waitForAngular();
	await browser.wait(EC.elementToBeClickable(element.all(by.css(self.applicationResourceTableColumnTitleCss)).get(0)), timeout.timeoutInMilis);
	util.scrollToWebElement(element(by.css(self.applicationResourceTableColumnTitleCss)));
	var parent = element.all(by.css(self.aciveSortColumnCss)).get(0);
	parent.element(by.css(self.applicationResourceTableColumnTitleCss)).getText().then(function(text){
		selectedText = text;
		logger.info("Sorted column name --->" +selectedText);
	});
	return element.all(by.css(this.applicationResourceTableColumnTitleCss)).getText().then(function (labels) {
		for (var i = 0; i < labels.length; i++) {
			if(labels[i] === selectedText)
			{
				logger.info("Sorted Column Index ---->" +i);
				return i;
			}

		}
	});
};

/**
 * Method to reset global filters
 */
inventory.prototype.resetGlobalFilters = function () {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.globalFilterResetButtonCss))), timeout.timeoutInMilis);
	element(by.css(this.globalFilterResetButtonCss)).click().then(function () {
		logger.info("Clicked on reset button");
	});
}




/*
* Method to search resources for which tags are assigned and remove those tags
*/
inventory.prototype.searchResourceAndRemoveTags = async function (selectedResourcesList, option, listOfColumnsToFetch,
	selectedApplicationTag, selectedEnvironmentTag, rows, selectedAppKeys , selectedEnvKeys) {
	var count = 0, i;
	var resourceDetailsAfterTagging = [], appTags = [], envTags = [];
	var noData = await this.checkNoData(this.listViewNoDataDisplayCss, "resourceListView");
	for (i = 0; i < selectedResourcesList.length; i++) {
		if (option === inventoryTestData.untaggedResourcesApplicationLabel) {
			if (selectedResourcesList[i][3] === '--') {
				count = count + 1;
			} else {
				count;
			}
		} else if (option === inventoryTestData.untaggedResourcesEnvironmentLabel) {
			if (selectedResourcesList[i][2] === '--') {
				count = count + 1;
			} else {
				count;
			}
		}
		// Search by Resource ID of selected Assigned Tags resource
		await this.searchTable(selectedResourcesList[i][0]);
		if (!noData) {
			await this.isAppResTableDisplayed();
			await this.selectResourcesFromListView(inventoryTestData.firstIndex);
			resourceDetailsAfterTagging = await this.getSelectedRowsFromListView(listOfColumnsToFetch);
			appTags.push(resourceDetailsAfterTagging[0][2]);
			appTags.sort();
			envTags.push(resourceDetailsAfterTagging[0][3]);
			envTags.sort();
			//fetch latest tag-key value column details
			var tagKeyValueAfterTagging = resourceDetailsAfterTagging[0][4];
			resourceDetailsAfterTagging = JSON.stringify(resourceDetailsAfterTagging);
			// Click on 'Remove tags' option of Assign/Remove Tags bar displaying in Resources List View
			await this.removeAssignedTags(selectedAppKeys,selectedEnvKeys,tagKeyValueAfterTagging);
		} else {
			noData;
		}
	}
	appTags = JSON.stringify(appTags);
	envTags = JSON.stringify(envTags);
	logger.info("Removed Application Tags from all selected resources :" + appTags);
	logger.info("Removed Environment Tags from all selected resources :" + envTags);
	return { appTags, envTags, count, noData };
}

/*
* Method to click on '+' icon to add new row on assign /remove tags page 
*/
inventory.prototype.clickOnAddNewRowIcon = async function () {
	var self = this;
	util.waitForAngular();
	await browser.wait(EC.elementToBeClickable(element(by.xpath(self.addNewRowIcon))), timeout.timeoutInMilis);
	return await element(by.xpath(self.addNewRowIcon)).click().then(function () {
		logger.info("Clicked on + icon ");
		return true;
	});
}

// Get row data and return it as list
inventory.prototype.getrowData = async function(rowNumber,category){
    var self = this;
    util.waitForAngular();
    var webTable = element.all(by.css(self.appResListTableCss));
    if(rowNumber === 0){
        throw new Error("Row number starts from 1");
    }
    return await webTable.all(by.xpath("//tr["+rowNumber+"]/td")).getText().then(async function(rowData){
		if(category === inventoryTestData.applicationsButtonName){
		//Details section is removed from row data
		await rowData.pop();
		}
		if (category === inventoryTestData.resourcesButtonName)
		{
		   //Checkbox and details section icons are removed from row data
	        rowData = rowData.slice(1, -1);
		}
		for (var i = 0; i < rowData.length; i++) {
			rowData[i] = rowData[i].trim()
		}
		return rowData;
    }); 
}

//Map the rows in a list with headers
inventory.prototype.mapRowsWithHeaders = async function(rows, headers) {
	var mappedRows = {};
	var i;
    for (i=0; i < rows.length; i++) {
		mappedRows[headers[i]] = rows[i];
	}  
	return mappedRows;
}

/* Method to select keys from tag key dropdown menu based on index
 */
inventory.prototype.selectAssignedTagKeys = async function (tagKeys) {
	util.waitForAngular();
	var self = this;
	await element(by.xpath(self.seletAssignedTagKeys.format(tagKeys))).click();
		logger.info("Clicked on " + tagKeys + " checkbox");
};

/* Method to select keys from tag key dropdown menu based on index
 */
inventory.prototype.getAssignedTagKeyValueDetails = async function (tagKeyValueDetails ) {
	util.waitForAngular();
	var keyValueSplit = tagKeyValueDetails.split(';');
	var keyValueObj = {};
	for (let index = 0; index < keyValueSplit.length; index++) {
		var keyValuePair = keyValueSplit[index].split(':');
		keyValueObj[keyValuePair[0]] = keyValuePair[1];
	}
	return keyValueObj;
};

/**
 * Method to select import tags method
 */
inventory.prototype.selectImportTags = async function(importFileName){
	util.waitForAngular();
	var self = this;
	browser.wait(EC.visibilityOf(element(by.css(self.tableExportCss))), timeout.timeoutInMilis);
	util.scrollToWebElement(element(by.css(self.applicationResourceTableColumnTitleCss)));
	return await element.all(by.css(self.tableExportCss)).get(1).click().then(async function () {
        await element.all(by.css(self.viewDetailsCss)).get(0).click().then(async function(){
			browser.wait(EC.visibilityOf(element(by.xpath(self.mcImportBulkTaggingTabXpath))), timeout.timeoutInMilis);
			await element(by.xpath(self.mcImportBulkTaggingTabXpath)).click().then(async function(){
			util.scrollToWebElement(element(by.css(self.dragAndDropFileImportCss)));
			browser.wait(EC.visibilityOf(element(by.css(self.dragAndDropFileImportCss))),timeout.timeoutInMilis);
				var pathFile = path.resolve('../' +'AIOPS2_Dev2Fra_ES' +'/import_tags/' + importFileName);
			    logger.info("pathFile" +pathFile);
			    await element(by.css(self.addFileCss)).sendKeys(pathFile).then(async function(){
				    logger.info('File has been inserted')
			        browser.wait(EC.visibilityOf(element.all(by.css(self.uploadFileCss)).get(0)), timeout.timeoutInMilis);
				    await element.all(by.css(self.uploadFileCss)).get(3).click().then(async function() {
						  logger.info('file has been uploaded')
					});
				});	
			});		
		});
	});
}

/* Method to verify if manadtory fields are not empty for all the resources present in the input file
 */
inventory.prototype.getImportedTagsDataFromExcel = async function (importFileData) {
	util.waitForAngular();
	var self = this;
	var mandatFieldDataArray = [], appValuesFromImportFile =[],envValuesFromImportFile =[] , resourceListFromImportFile =[];
	var appKeysFromImportFile = [], envKeysFromImportFile = [];
    for (var i = 0; i < importFileData.length; i++) {
		var mandatFieldArray = [];
		mandatFieldArray.push(importFileData[i].id);
        mandatFieldArray.push(importFileData[i].correlationID);
		mandatFieldArray.push(importFileData[i].provider);
        mandatFieldArray.push(importFileData[i].application);
        mandatFieldArray.push(importFileData[i].environment);
        mandatFieldArray.push(importFileData[i]["Application Tag Key"]);
		mandatFieldArray.push(importFileData[i]["Environment Tag Key"]);
        if (mandatFieldArray.some((value) => value === null || value === '--' || value === undefined)) {
            logger.info('Value is empty for mandatory field')
		}
		else {
			mandatFieldDataArray[i] = mandatFieldArray;
			resourceListFromImportFile[i] = mandatFieldDataArray[i][0];
			appValuesFromImportFile[i]= mandatFieldDataArray[i][3];
			envValuesFromImportFile[i]= mandatFieldDataArray[i][4];
			appKeysFromImportFile[i]= mandatFieldDataArray[i][5];
			envKeysFromImportFile[i]= mandatFieldDataArray[i][6];
		}
	}
	logger.info("Array of rows from import sheet ---> ", mandatFieldDataArray);
    return {mandatFieldDataArray,appValuesFromImportFile,envValuesFromImportFile,appKeysFromImportFile,envKeysFromImportFile,resourceListFromImportFile};
};

/* Method to verify if manadtory fields are not empty for all the resources present in the input file
 */
inventory.prototype.getApplicationEnvironmentTags = async function (mandatFieldDataArray,appKeysFromImportFile,appValuesFromImportFile,envKeysFromImportFile,envValuesFromImportFile) {
	util.waitForAngular();
	var self = this;
	var appTagsFromListView = [], envTagsFromListView = [],resourceDetailsAfterTagging =[], appTags =[], envTags =[] ;
	var rowDataWithHeaders = []
	var appKeys = appKeysFromImportFile;
	var envKeys = envKeysFromImportFile;
	var appValues = appValuesFromImportFile;
	var envValues = envValuesFromImportFile;
	for (var i = 0; i < mandatFieldDataArray.length; i++) {
		rowDataWithHeaders = mandatFieldDataArray[i];
		await self.searchTable(rowDataWithHeaders[0]);
		await self.getListViewHeaders();
		await self.selectResourcesFromListView(inventoryTestData.firstIndex);
	    resourceDetailsAfterTagging = await self.getSelectedRowsFromListView([inventoryTestData.resourceListColumnApplication,inventoryTestData.resourceListColumnEnvironment,inventoryTestData.resourceListColumnTagKeyValue]);
		appTags = resourceDetailsAfterTagging[0][0];
		appTagsFromListView[i] = appTags;
		envTags = resourceDetailsAfterTagging[0][1];
		envTagsFromListView[i] = envTags;
		await self.clickOnTagCancelButton();
		await util.clickOnTabButton(inventoryTestData.applicationsButtonName);
		await util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		await self.searchTable(rowDataWithHeaders[0]);
		await self.removeTagsUploadedByImportTags(appKeys[i],appValues[i],envKeys[i],envValues[i]);
	}
	return {appTagsFromListView,envTagsFromListView};
};

/* Method to compare whether array1 is subset of array2
 */
inventory.prototype.compareArraysubSets = async function (subSet,superSet) {
	var compareArray = [];
	//Loop over all values in the array
	subSet.forEach((subSetValue, index) => {var superSetValue = superSet[index];
		//Split the tags in each index
		var List1 = subSetValue.split(",")
		var List2 = superSetValue.split(",") 
		var misMatch = 0
		for (var i = 0; i < List1.length; i++) {
		 //Verify if any mismatch 
		  if(!List2.includes(List1[i])){
			misMatch = 1
		  }
		}
		compareArray.push(misMatch)
	});
	  console.log(compareArray)
	  var compareResult = compareArray.every(function (e) {
		  return e===0;
	   });
	   return compareResult;
}

/* Method to remove tags uploaded via import tags
 */
inventory.prototype.removeTagsUploadedByImportTags = async function (appKeys,appValues,envKeys,envValues) {
		util.waitOnlyForInvisibilityOfCarbonDataLoader()
		var self = this;
		var appValues = appValues.split(",");
		var envValues = envValues.split(",");
		await self.selectResourcesFromListView(inventoryTestData.firstIndex);
		await self.selectAssignRemoveTags(inventoryTestData.removeTags);
		await self.clickDropDownAssignOrRemoveTagsScreen(inventoryTestData.assignRemoveSelectedResources, "1", inventoryTestData.firstIndex);
		await self.selectResourcesAssignOrRemoveTagsScreen(inventoryTestData.firstIndex);
		// Select Application key from 'Application key' dropdown in remove Tags window
		await self.clickDropDownAssignOrRemoveTagsScreen(inventoryTestData.assignRemoveApplicationTagKey, "1", inventoryTestData.secondIndex);
		await self.selectAssignedTagKeys(appKeys);
		// Select Application value from 'Application value' dropdown in remove Tags window
		for(var j=0 ; j< appValues.length; j++)
		{
		   await self.clickDropDownAssignOrRemoveTagsScreen(inventoryTestData.assignRemoveApplicationTagValue, "1", inventoryTestData.thirdIndex);
		   await self.selectTagsToBeRemoved(appValues[j]);
		}
		// Select Environment key from 'Environment key' dropdown in remove Tags window
		await self.clickDropDownAssignOrRemoveTagsScreen(inventoryTestData.assignRemoveEnvironmentTagKey, "1", inventoryTestData.fourthIndex);
		await self.selectAssignedTagKeys(envKeys);
		// Select Environment value from 'Environment value' dropdown in remove Tags window
		for(var j=0 ; j< envValues.length; j++)
		{
		   await self.clickDropDownAssignOrRemoveTagsScreen(inventoryTestData.assignRemoveEnvironmentTagValue, "1", inventoryTestData.fifthIndex);
		   await self.selectTagsToBeRemoved(envValues[j]);

		}
		await self.clickOnAssignRemoveButton(inventoryTestData.removeTags);
	    util.waitForAngular();

};

/**
 * Method to Check No data text under top insights
 */
 inventory.prototype.checkTopInsightNoData = async function(checkNoDataLocator, subSectionName) {
	browser.waitForAngular();
	await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	var subSectionNoDataXpath = checkNoDataLocator.format(subSectionName);
	return element.all(by.xpath(subSectionNoDataXpath)).count().then(async function (noDataCount) {
		if (noDataCount > 0) {
			return element(by.xpath(subSectionNoDataXpath)).getText().then(function (noDataText) {
				logger.info("No data available in "+ subSectionName +": " + noDataText);
				return true;
			});
		} else {
		    return false;
		}
	});
}
/**
 * Method to check if required label is present on view details page
 */
inventory.prototype.visibilityOfLabels = async function (text) {
	var labelXpath = this.labelTextXpath.format(text);
	browser.wait(EC.visibilityOf(element(by.xpath(labelXpath))), timeout.timeoutInMilis);
	return await element(by.xpath(labelXpath)).getText().then(function (text) {
		logger.info("Label " + text + " is present on the page");
		return text
	});
}
/* Method to get transform property on application and resource tab
 */

inventory.prototype.getTransformValues = async function (transform) {
	var self = this;
	util.waitForAngular();
	return await element.all(by.css(self.geoMap)).get(0).getAttribute(transform).then(function (transformValue) {
		logger.info("Transform value is " + transformValue);
		return transformValue;
	})
}

/* Method to zoomIn , zoomOut and reset on resource on region
 */

inventory.prototype.getTransformValuesAfterZoomIn = async function (feature) {
	var self = this;
	util.waitForAngular();
	if(inventoryTestData.resetGeoMap === feature){
		await browser.wait(EC.elementToBeClickable(element(by.css(self.geoMapZoomIn.format('zoomInButton')))), timeout.timeoutInMilis);
		util.scrollToWebElement(element(by.css(self.geoMapZoomIn.format('zoomInButton'))))
		await element(by.css(self.geoMapZoomIn.format('zoomInButton'))).click().then(function () {
			logger.info("Clicked on" + feature);
		})
	}
	var beforeZoomInTransformValue = await self.getTransformValues(inventoryTestData.transformName);
	var zoomFeature = self.geoMapZoomIn.format(feature);
	await browser.wait(EC.elementToBeClickable(element(by.css(zoomFeature))), timeout.timeoutInMilis);
	util.scrollToWebElement(element(by.css(zoomFeature)))
	await element(by.css(zoomFeature)).click().then(function () {
		logger.info("Clicked on" + feature);
	})
	var afterZoomTransformValue = await self.getTransformValues(inventoryTestData.transformName);
	var zoomBefore = beforeZoomInTransformValue.split('(')[1].split(')')[0].split(',');
	var zoomAfter = afterZoomTransformValue.split('(')[1].split(')')[0].split(',');
	logger.info('Zoom Before transform value is ' + zoomBefore +', Zoom after transform value is ' + zoomAfter)
	return {zoomBefore,zoomAfter}
}

/* Method to get unknown resources count from resources and applications
 */

inventory.prototype.clickAndGetUnknownLocationCount = async function ( ) {
	var self = this;
	util.waitForAngular();
	browser.wait(EC.elementToBeClickable(element(by.css(self.unknownLocationResourcesCountCss))), timeout.timeoutInMilis);
	return await element(by.css(self.unknownLocationResourcesCountCss)).getText().then(async function (count) {
		logger.info("resource(s) with unknown location " + count);
		await element(by.css(self.unknownLocationResourcesCountCss)).click().then(function () {
			logger.info(count + " resources with unknown location has been clicked");
		});
		return parseInt(count)
	});
}

/**
 * Method to get CreationDate , owner , Name , tags from service configuration by using index
 */

inventory.prototype.getServiceConfigDetails =async function(index){
	var self = this;
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.css(self.serviceConfigurationFieldsCss)).get(0)), timeout.timeoutInMilis);
	return await element.all(by.css(self.serviceConfigurationFieldsCss)).getText().then(function(text){
		logger.info("Service configuration resource name is : "+text);
		return text.toString();
	});
}

/**
 * Click on one of the value in top insights and get the value
 * subSectionName --> Sub-section name inside top insights. Ex. Application With Most Resources, Untagged Resources, etc.
 */
inventory.prototype.clickandGetTextInsightFromTopInsightsSubSection = async function(subSectionName){
	util.waitForAngular();
	var clickedName;
	var resourceNameFromTopInsights = this.appNameFromTopInsightsXpath.format(subSectionName);
	var resourceCountFromTopInsights = this.resourceCountForAppsFromTopInsightsXpath.format(subSectionName);
	browser.wait(EC.visibilityOf(element.all(by.xpath(resourceCountFromTopInsights)).get(0)), timeout.timeoutInMilis);
	return await element.all(by.xpath(resourceNameFromTopInsights)).getText().then(function(resNameList){
		   clickedName = resNameList[0];
	       element.all(by.xpath(resourceNameFromTopInsights)).get(0).click();
		   logger.info("Clicked on top insights subsection")
		   return clickedName;
	});
}

/**
 * Get the count of unmanaged count in top insights
 */
inventory.prototype.getUnmanagedCountFromTopInsights =  async function(managedKey){
	util.waitForAngular();
	var self = this;
	var totalResourcesCount = await self.getApplicationOrResourcesTableHeaderTextCount();
	await self.searchTable(managedKey);
	var noDataInListView = await self.checkNoData(self.listViewNoDataDisplayCss, "listView");
	if(!noDataInListView){
		browser.wait(EC.visibilityOf(element(by.css(this.paginationDetailsTextCss))), timeout.timeoutInMilis);
	}
    else {
		browser.wait(EC.visibilityOf(element(by.css(self.listViewNoDataDisplayCss))), timeout.timeoutInMilis);
	}
	//get the managed resources count
	var managedResourcesCount = await self.getApplicationOrResourcesTableHeaderTextCount();
	//Get the count of keys such as ibm_mcms_managed_database, ibm_mcms_managed_ etc.
	await self.removeSearchTextListView();
	await self.getListViewHeaders();
	await self.searchTable(inventoryTestData.managedTagKeyWithOtherValues);
	await self.getListViewHeaders();
	var managedTagKeyWithOtherValues = await self.getApplicationOrResourcesTableHeaderTextCount();
	//Get the unmanaged count by substracting managed resources count from total resource count
	return ((totalResourcesCount) - ((managedResourcesCount) - (managedTagKeyWithOtherValues)));
}
/* Method to click on table setting icon 
 */
inventory.prototype.clickOnTableSettingIcon = async function () {
	util.waitForAngular();
	var self = this;
	browser.wait(EC.visibilityOf(element(by.xpath(self.tableSettingIconXpath))), timeout.timeoutInMilis);
	await element(by.xpath(self.tableSettingIconXpath)).click();
	logger.info("Clicked on table setting icon");
};

/**
 * Method to verify if table setting menu is expanded or not
 */
inventory.prototype.verifyTableSettingMenuHeader = async function () {

	util.waitForAngular();
	var self = this;
	await self.clickOnTableSettingIcon();
	browser.wait(EC.visibilityOf(element(by.css(self.tableSettingPanelHeaderCss))), timeout.timeoutInMilis);
	return await element(by.css(self.tableSettingPanelHeaderCss)).getText().then(function (text) {
		logger.info("Table setting panel expanded with header : " + text.trim());
		return text.trim();
	});
}

/**
 * Method to fetch column headers from table setting panel
 */
inventory.prototype.getColumnHeadersFromTableSettingPanel = async function () {
	util.waitForAngular();
	var self = this;
	var columnHeader = [];
	util.waitOnlyForInvisibilityOfCarbonDataLoader();
	browser.wait(EC.visibilityOf(element(by.css(self.paginationDetailsTextCss))), timeout.timeoutInMilis);
	browser.wait(EC.visibilityOf(element.all(by.css(self.columnHeaderCss)).get(0)), timeout.timeoutInMilis);
	return await element.all(by.css(self.columnHeaderCss)).count().then(async function (headerCount) {
		logger.info("Table setting headerCount : " + headerCount);
		columnHeader = await element.all(by.css(self.columnHeaderCss)).getText();
		logger.info("Table setting column header list : " + columnHeader);
		return columnHeader
	});
}

/**
 * Method to check the status of column headers from table setting panel
 */
inventory.prototype.columnHeaderStatusFromTableSettingPanel = async function () {
	util.waitForAngular();
	var self = this;
	var selectedColumnHeaders = [], unSelectedColumnHeaders = [];
	var status;
	browser.wait(EC.visibilityOf(element.all(by.xpath(self.columnHeaderCheckboxStatusXpath)).get(0)), timeout.timeoutInMilis);
	return await element.all(by.xpath(self.columnHeaderCheckboxStatusXpath)).count().then(async function (headerCount) {
		logger.info("Table setting headerCount : " + headerCount);

		for (var index = 0; index < headerCount; index++) {
			status = await element.all(by.xpath(self.columnHeaderCheckboxStatusXpath)).get(index).getAttribute("aria-checked");
			if (status == 'true') {
				selectedColumnHeaders.push(await element.all(by.xpath(self.columnHeaderCheckboxStatusXpath)).get(index).getAttribute("name"));
			} else {
				unSelectedColumnHeaders.push(await element.all(by.xpath(self.columnHeaderCheckboxStatusXpath)).get(index).getAttribute("name"));
			}
		}
		logger.info("List of headers which are selected : " + selectedColumnHeaders + " and list of headers which are not selected : " + unSelectedColumnHeaders)
		return { selectedColumnHeaders, unSelectedColumnHeaders }
	});
}


/**
 * Method to check/uncheck the column headers from table setting panel
 */
inventory.prototype.selectingColumnHeaders = async function (headerArray, lookupArray) {
	util.waitForAngular();
	var self = this;
	browser.wait(EC.visibilityOf(element.all(by.xpath(self.columnHeaderCheckboxStatusXpath)).get(0)), timeout.timeoutInMilis);
	await element.all(by.xpath(self.columnHeaderCheckboxStatusXpath)).count().then(async function () {
		for (var index = 0; index < headerArray.length; index++) {
			await element.all(by.css(self.columnHeaderCss)).get(lookupArray.indexOf(headerArray[index])).click();
		}
	});
}


/**
 * Method to select apply/cancel/reset button
 */
inventory.prototype.selectApplyResetCancelButton = async function (button) {
	util.waitForAngular();
	var self = this;
	var buttonXpath = self.applyCancelResetButtonXpath.format(button);
	browser.wait(EC.visibilityOf(element(by.xpath(buttonXpath))), timeout.timeoutInMilis);
	await element(by.xpath(buttonXpath)).click();
	logger.info("Clicked on : " + button)
}


/**
 * Method to select apply/cancel/reset button
 */
inventory.prototype.removeSearchTextListView = async function (button) {
	util.waitForAngular();
	var self = this;
	browser.wait(EC.visibilityOf(element.all(by.css(self.searchBarCloseCss)).get(1)), timeout.timeoutInMilis);
    await element.all(by.css(self.searchBarCloseCss)).get(1).click();
	logger.info("Closed the search in list view : ")
}

/**
 * Method to check if name,ID checkboxes are disabled 
 */
 inventory.prototype.verifyDisabledHeaderCheckboxes = async function (tabName) {
	util.waitForAngular();
	var self = this;
	var nameStatus;
	if (tabName == inventoryTestData.applicationsButtonName) {
		logger.info("Checking Name checkbox")
		nameStatus = await element.all(by.xpath(self.columnHeaderCheckboxStatusXpath)).get(0).getAttribute("disabled");
		return Boolean(nameStatus)
	} else {
		logger.info("Checking ID and Name checkboxes")
		var idStatus = await element.all(by.xpath(self.columnHeaderCheckboxStatusXpath)).get(0).getAttribute("disabled");
		nameStatus = await element.all(by.xpath(self.columnHeaderCheckboxStatusXpath)).get(1).getAttribute("disabled");
		return Boolean(idStatus && nameStatus)
	}
}

/**
 * Method to click on close table setting panel and cofirm its closed
 */
inventory.prototype.closeTableSettingPanelAndVerify = async function () {
	util.waitForAngular();
	var self = this;
	browser.wait(EC.visibilityOf(element(by.xpath(self.closeTableSettingPanelIconXpath))), timeout.timeoutInMilis);
	await element(by.xpath(self.closeTableSettingPanelIconXpath)).click();
	logger.info("Clicked on x icon")
	//verify if its closed
	return browser.wait(EC.visibilityOf(element(by.css(self.tableSettingPanelHeaderCss))), 20000).then(async function () {
		logger.info("Table setting panel is expanded");
		return false
	}).catch(function (err) {
		logger.info("Table Setting panel is closed , table setting header is not visible");
		return true
	})

}

/**
 * Method to click on select all cehcbox and check if its reflected in table setting panel
 */
inventory.prototype.clickOnSelectAllHeaders = async function () {
	util.waitForAngular();
	var self = this;
	var status;
	var selectAll = null;
	browser.wait(EC.visibilityOf(element(by.xpath(self.selectAllCheckboxXpath))), timeout.timeoutInMilis);
	return await element.all(by.xpath(self.columnHeaderCheckboxStatusXpath)).count().then(async function () {
		status = await element(by.xpath(self.selectAllHeadersTableSettingXpath)).getAttribute("aria-checked");
		if (status != 'true') {
			await element(by.xpath(self.selectAllCheckboxXpath)).click();
			logger.info("Clicked on select all checkbox");
		}
		selectAll = await self.columnHeaderStatusFromTableSettingPanel();
		return selectAll
	});
}

/**
 * Method to select resource ,tag keys & values
 */
inventory.prototype.selectResourceTagkeyValue = async function (row, resourceSize, tagKeys, provider,appTagSize, envTagSize) {
	util.waitForAngular();
	var self = this;
	util.waitOnlyForInvisibilityOfCarbonDataLoader();
	// Select single resource from 'Select resources' dropdown in Assign Tags window
	await self.clickDropDownAssignOrRemoveTagsScreen(inventoryTestData.assignRemoveSelectedResources, row, inventoryTestData.firstIndex);
	await self.selectResourcesAssignOrRemoveTagsScreen(resourceSize);
	// Select Application key from 'Application key' dropdown in Assign Tags window
	await self.clickDropDownAssignOrRemoveTagsScreen(inventoryTestData.assignRemoveApplicationTagKey, row, inventoryTestData.secondIndex);
	await self.selectAssignedTagKeys(tagKeys[0]);
	// Select Application value from 'Application value' dropdown in Assign Tags window
	await self.clickDropDownAssignOrRemoveTagsScreen(inventoryTestData.assignRemoveApplicationTagValue, row, inventoryTestData.thirdIndex);
	var appTags = await self.selectTagValuesAssignOrRemoveTagsScreen(appTagSize, provider);
	// Select Environment key from 'Environment key' dropdown in Assign Tags window
	await self.clickDropDownAssignOrRemoveTagsScreen(inventoryTestData.assignRemoveEnvironmentTagKey, row, inventoryTestData.fourthIndex);
	await self.selectAssignedTagKeys(tagKeys[1]);
	// Select Environment value from 'Environment value' dropdown in Assign Tags window
	await self.clickDropDownAssignOrRemoveTagsScreen(inventoryTestData.assignRemoveEnvironmentTagValue, row, inventoryTestData.fifthIndex);
	var envTags = await self.selectTagValuesAssignOrRemoveTagsScreen( envTagSize, provider);
	logger.info('Selected resource and tag details : ',{ appTags, envTags ,tagKeys})
	return { appTags, envTags ,tagKeys}
}

/**
 * Method to switch between application and resource tab and wait for data to load
 */
inventory.prototype.switchBetweenTabs = async function () {
	util.waitOnlyForInvisibilityOfCarbonDataLoader();
	await util.clickOnTabButton(inventoryTestData.applicationsButtonName);
	util.waitOnlyForInvisibilityOfCarbonDataLoader();
	await util.clickOnTabButton(inventoryTestData.resourcesButtonName);
	util.waitOnlyForInvisibilityOfCarbonDataLoader();
}

/**
 * Method to switch between application and resource tab and wait for data to load
 */
inventory.prototype.selectAndFetchResourceDetailsFromListView = async function (size) {
	util.waitForAngular();
	var self = this;
	// Select single resource in Resources list view by passing number of records count in parameter
	await self.selectResourcesFromListView(size);
	// Get details of specific columns of selected resources from resources list view
	var resourceListView = await self.getSelectedRowsFromListView([inventoryTestData.resourceListColumnID, inventoryTestData.resourceListColumnResourceName,
	inventoryTestData.resourceListColumnApplication, inventoryTestData.resourceListColumnEnvironment, inventoryTestData.resourceListColumnTagKeyValue]);
	return resourceListView
}

/* Select required provider account only */
inventory.prototype.selectProviderAccount = async function (accountNumber) {
	util.waitForAngular();
	var self = this;
	util.waitOnlyForInvisibilityOfCarbonDataLoader();
	await element(by.xpath(self.selectAssignedTags.format(accountNumber))).click();
	logger.info("Clicked on " + accountNumber + " checkbox");
	util.waitOnlyForInvisibilityOfCarbonDataLoader();
}
module.exports = inventory;