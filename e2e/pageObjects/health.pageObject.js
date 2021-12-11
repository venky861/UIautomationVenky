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
var healthTestData = require('../../testData/cards/healthTestData.json');
var dashboardTestData = require('../../testData/cards/dashboardTestData.json');
var healthAndInventoryUtil = require('../../helpers/healthAndInventoryUtil.js');
var esQueriesHealth = require('../../elasticSearchTool/esQuery_HealthPayload.js');
var tenantId = browser.params.tenantId


var defaultConfig = {
	pageUrl: url,
	/**
	 * Health page Locators
	 */
	healthHeaderTileTextCss: "label.pagetitle",
	healthDashboardViewCss: ".dshDashboardViewport",
	alertsCountFromDonutChartCss: "text.highcharts-title tspan",
	alertTypeDropdownCss: "select.aipos-health-breakdown__dropdown--options",
	alertTypeDropdownValuesCss: "select.aipos-health-breakdown__dropdown--options option",
	mainSectionsXpath: "//h4[contains(text(),'')]",
	topInsightsLabelCss: "div.kbnMarkdown__body p",
	healthApplicationViewXpath : "//span[@class='bx--link']",
	topInsightsSubSectionLabelsCss: "h6.topInsightsTitle",
	topInsightsSubSectionAppRescNameXpath: "//h6[contains(text(), '{0}')]//following::div[1]//ul[@class='listWithDoubleside']//span/a",
	topInsightsSubSectionAppRescCountXpath: "//h6[contains(text(), '{0}')]//following::div[1]//ul[@class='listWithDoubleside']//span/span",
	topInsightsSubSectionNoDataXpath: "//h6[contains(text(), '{0}')]//following::div[1]//div[@class='nodata-placeholder']",
	resourceSummaryHeaderCss : "button.bx--accordion__heading",
	resourceSummaryLabelCss :"label.resourceSummarytitleText",
    resourceSummaryValueCss : "span.resourceSummaryvalue",
	healthStatusSectionLabelCss: "label.donutChart",
	morePopupAppLabelXpath:"//span[@class='title_span']",
	donutChartLabelsCss: "div.chartPro g.labels text",
	donutChartCountsCss: "div.chartPro g.labels text tspan",
	healthStatusNoDataMessageCss: "div.chartPro div.nodata-placeholder",
	appResourceHealthBreakdownSectionLabelCss: "label.stackBarChart",
	appResHealthBreakdownSectionsXpath: "//*[@class='aipos-health-breakdown__chart']//*[name()='rect' and contains(@class,'highcharts-point')]",
	appResHealthBreakdownSectionTooltipXpath: "//*[@class='aipos-health-breakdown__chart']//*[name()='g' and contains(@class,'highcharts-tooltip')]//*[name()='tspan']",
	applicationsSectionLabelCss: ".tableheader h4",
	resourceListSectionLabelCss: ".resourcedefult:nth-child(2) li.bx--tabs__nav-item> a.bx--tabs__nav-link",
	appResourceListTableBodyCss: "ibm-table table.bx--data-table tbody",
	resourcesSectionLabelXpath: "//*[@class='resourcedefult']//a[contains(@title,'Resources')]",
	applicationTableNameColumnCss: "div table.bx--data-table tbody tr td:nth-child({0})>span",
	applicationTableOptionButtonCss: "div table.bx--data-table tbody tr button.bx--overflow-menu",
	applicationViewDetailsButtonCss: "button.bx--overflow-menu-options__btn",
	listViewDataByRowXpath:"//div[@class='listView']//table//tbody/tr//td[{0}]/span",
	navigationButtonLinksCss: "button.color__blue",
	providersListCss: "#tree-provider li.node-tree-provider",
	defaultSelectedHealthStatusXpath: "//*[contains(@id,'donut_path') and @class='clicked']",
	criticalSliceFromDonutChartXpath: "//*[@id='donut_path_#d91e27']",
	warningSliceFromDonutChartXpath: "//*[@id='donut_path_#fcd13a']",
	healthySliceFromDonutChartXpath: "#donut_path_\\#23a247",
	tabSectionLabelCss: "ibm-tab-header-group ibm-tab-header",
	checkboxGlobalFilterXpath:"//span[@class='filterTextOverflow' and contains(text(), '{0}')]",
	applyFilterButtonCss: "app-global-filter div.ops__side-nav button.applyButton",
	clickMoreButtonXpath:"//a[contains(text(),'{0}')]",
	applicationMoreLinkXpath:"//div[@aria-labelledby='apln-grp-label']/a[@class='bx--link']",
	searchBoxCss:"div input.bx--search-input",
	headerTabsCss:"li a.bx--tabs__nav-link",
	listViewHeaderCss:"span.bx--table-sort__flex div.bx--table-header-label",
	listViewItemsCss:"td.undefined a",
	headerMainframeResourceCss:"div.fvt-breadcrumb span.bx--link",
	topInsightsSubSectionNoDataCss: "div.{{CSS}} div div.nodata-placeholder",
	topInsightsSubSectionDataCss: "div.{{CSS}} div ul li span a.cursor-pointer",
	appResFilterDropdownValCss: ".bx--list-box__menu-item__option",
	stackBarGraphxpath:"//*[@class='graph-svg-component']//*[@class='layer']",
	stackBarToolTipcss:"div.chart-tooltip",
	healthBreakdownSectionsXpath: "//*[@class='graph-svg-component']//*[contains(@id,'stackBar_rect_{0}')]",
	healthBreakdownWarningYellowColorXpath: "//*[@class='graph-svg-component']//*[contains(@style,'fill:rgb(252')]",
	healthBreakdownCriticalRedColorXpath: "//*[@class='graph-svg-component']//*[contains(@style,'fill:rgb(21')]",
	healthBreakdownHealthyGreenColorXpath: "//*[@class='graph-svg-component']//*[contains(@style,'fill:rgb(13')]",
    breakdownFooterSectionsTextCss: "g.x-axis g.tick>text",
	tableOverflowMenuCss: ".bx--data-table-container .bx--data-table tbody td ibm-overflow-menu",
	viewDetailsCss:".bx--overflow-menu-options__option-content",
	/**
	 * Application Details page locators
	 */
	appDetailsPageHeaderNameCss: "label.pagetitle",
	associatedResourcesTableRowsCss: "div table.bx--data-table tbody tr",
	associatedResourcesTableLabelCss: ".bx--data-table-header h4",
	topInsightsvalueXpath:"//div[@class='nodata-placeholder']",
	resourceHealthValueXpath: "//td//span[contains(text(),'{0}')]",
	associatedResourcesLinkButtonXpath: "//td/span[contains(text(),'{0}')]//preceding::td//a",
	associatedResourcesNameColumnValueXpath: "//td/span[contains(text(),'{0}')]//preceding::td[1]/span",
	ascResourcesHealthStatusByNameXpath: "//span[@class='verticalalign' and contains(@title, '{0}')]",
	nextPageButtonCss: "div.bx--pagination__right button[aria-label='Forward']",
	paginationItemsPerPageCss: "div.bx--select__item-count select",
	paginationItemsPerPageOptionsCss: "div.bx--select__item-count select option",
	paginationDetailsTextCss: "div.bx--pagination__left span.bx--pagination__text",
	paginationPageDropdownCss: "div.bx--select__page-number",
	paginationSelectPageNumberCss: "div.bx--select__page-number select option:nth-child({0})",
	associatedResourcesTableFirstPageXpath: "//pagination/li[@class='pagination-prev']//following-sibling::li[1]/a",
	searchIconButtonCss : "button span.euiFilterButton__textShift",
	searchInputCss : "input.euiFieldSearch",
	noDataTextCss : "table.health-custom-table__table-container tbody td.body__no-wrap",
	mappedApplicationXpath:"//label[contains(text(),'Mapped application(s)')]",
	ticketlinkXpath:"//td//a[@class='bx--link']",
	ticketTypeXpath:"//div[@class='ticket-type-container']//span[@class='content-values']",
	ticketAutoXpath:"//div[@class='ticket-opentime-container']/span[@class='content-values']",
	/**
	 * App overview detail
	 */
	appOverviewSubSectionTitlesCss : "div.coln-container label.overViewtitle",
	appOverviewSubSectionContentCss : "div.coln-container span",
	associatedResListFilterCss : "ibm-dropdown-list label span.bx--checkbox-label-text",
	ibmDropdownButtonTagName : "ibm-dropdown button",
	appOverviewHeaderStatusCss : "app-header div label.statusText",
	appOverviewHeaderTitleCss : "app-header label.pagetitle",
	headerStatusText: "div.headercontainer label.statusText",
	lastUpdatedTimestampTextCss: "/html/body/app-root/main/div/div/addon/div/div/aiops-health/lib-app-detail-overview/div/app-header/div/div[2]/div[2]/label",
	tableStatusColumnCss : "td span.verticalalign",
	utilizationFilterByDropdownCss: ".performanceFilterBy",
	utilizationFilterByDropdownOptionsXpath: "//div[@class='dropdown performanceFilterBy bx--dropdown__wrapper bx--list-box--expanded']//ul//li[contains(@title,'{0}')]",
	azureSupportUtilizationGraphTabsCss : "div.dateselection.srmTab ul div",
	/**
	 * Breadcrumb
	 */
	breadcrumbTitlesCss : "ibm-breadcrumb .fvt-breadcrumb",
	assResListClickCss : "ibm-table table tbody tr td button",
	breadcrumbAppHealthViewClickCss : "ibm-breadcrumb .fvt-breadcrumb",
	/**
	 * Resource Details page locators
	 */
	alertsTableColumnNamesCss: "div table.bx--data-table th div.bx--table-header-label",
	alertsTableRowsCountCss: "table.dataTable tbody tr",
	alertsTableNoDataTextCss: "table.dataTable tbody td.dataTables_empty",
	alertsTableColumnDataXpath: "//table[contains(@class,'bx--data-table')]//tbody//tr[{0}]/td[{1}]",
	alertsTableNextButtonCss: "div.dataTables_paginate a.next",
	alertsTablePageSizeCss: "div.dataTables_length option[value='10']",
	alertsTablePaginationDetailsTextCss: "div.dataTables_info",
	tableSectionsLinksCss: "div.tableView a.bx--tabs__nav-link",
	summaryOpenTicketsSectionLinksCss: "div.switcher-vis button",
	summaryWidgetHeaderCss: "span.spanFont",
	associatedApplicationsTableLabelCss: "div.health-custom-table div.list-container h5",
	resourceDetailsOverviewLabelValuesCss: "div.headerElm label.pagetitle",
	associatedApplicationsTableAppNameCss: "div.health-custom-table table tbody td:nth-child(1)",
	overviewLabelCss: "label.overViewtitle",
	/**
	 * Command center view locators
	 */
	expandButtonCss: ".commandCenterElm #Button",
	compressButtonCss: "a .fa-compress",
	currentPageBreadcrumbName: "div.fvt-breadcrumb:last-child span",
	healthStatusSectionLabelCommandCenterCss: "div.status-bar-vis h1",
	applicationsResourcesLabelCommandCenterCss: "div.health-status-list-ctrl h2",
	commandCenterBarChartXaxisLabelsCss: ".highcharts-xaxis-labels tspan",
	commandCenterAppResTableSubHeaderAlertNamesXpath: "//div[@class='header-list-item']/span[contains(text(),'{0}')]",
	commandCenterAppResTableSubHeaderNamesCss : ".sublist-header-name>span",
	viewByDropdownCss : ".health-status-dropdown select",
	viewByDropdownValuesCss : ".health-status-dropdown select option",
	healthFilterXpath  : "//span[contains(text(),'filter by health')]",
	globalFilterNameErrCss:"label.helptext",
	healthFilterDefaultSelectedOptionCss: "div.dropdown.bx--dropdown__wrapper.bx--list-box--expanded ul li.bx--list-box__menu-item.bx--list-box__menu-item--active",
	filterByCategoryDropdownCss : ".filtercheckbox span.bx--list-box__label",
	appRescFilterDropdownActiveOptionXpath: "//div[@class='dropdown bx--dropdown__wrapper bx--list-box--expanded']//ul/li[@class='bx--list-box__menu-item bx--list-box__menu-item--active' and @title = '{0}']",
	appResFilterDropdownOptionXpath : "//div[@class='dropdown bx--dropdown__wrapper bx--list-box--expanded']//ul/li[@class='bx--list-box__menu-item' and @title = '{0}']",
	healthStatusProgressBarsCss : ".highchart-bar g.highcharts-tracker rect",
	healthStatusProgressBarsTooltipCss : ".highchart-bar g.highcharts-tooltip tspan",
	appResAlertCardsXpath : "//div[@class='sublist-header-name']/span[normalize-space(text())='{0}']//ancestor::div[contains(@class,'heatlh-status-item')]//div/span[contains(@class,'{1}')]",
	sectionShowMoreLinkXpath : "//div[@class='sublist-header-name']/span[normalize-space(text())='{0}']//ancestor::div[@class='heatlh-status-item']//div[@class='load-more-list']//a[text()='Show More']",
	appResCardNamesCss : "label.app-cotent-text.textellipsis",
	commandCenterCss:"div.commandCenterElm",
	commandCenterSearchCss:"ibm-table-toolbar-search .bx--search-input",
	commandCenterHealthStatusSVGCss : "div.status-content-container svg",
    commandCenterClearFilterHealthSelectionCss: "div.filtercheckbox div.bx--list-box__selection.bx--tag--filter", //"div.filtercheckbox svg:nth-child(1)",
    commandCenterCLoseFilterHealthDropDownCss: "div.filtercheckbox div.bx--list-box.bx--multiselect:nth-child(1)",
    commandCenterApplicationsResourcesTitleCss: "div.main-container label.applicationtitle",
    commandCenterApplicationsResourcesXpath: "//div[@class='main-container'][{0}]//following-sibling::div[2]//div[@class='status-content-container']//label",
    commandCenterApplicationsResourcesCountCss : "label.appCount",
    commandCenterHealthStatusNumbersXpath: "//div[@class='command-center-container']//div[@class='status-container'][{0}]//div//label[@class='statusNumt']",
    commandCenterShowAllButtonXpath: "//div[@class='showMore']//button[contains(text(),'Show all')]",
    commandCenterShowLessButtonXpath: "//div[@class='showMore']//button[contains(text(),'Show less')]",
	/**
	 * Global filters
	 */
	globalFilterCss:"app-global-filter .ops__side-nav",
	globalFilterResetButtonDisableCss: "app-global-filter div.pd-1 a.disable-content",
	globalFilterResetButtonCss: "app-global-filter div.pd-1 a.reset.bx--link",
	golbalFilterMyDcXpath: "//span[@title='MY DC']",
	golbalFilterIBMDcXpath: "//span[@title='IBM DC']",
	globalFilterSectionContentCss: ".bx--fieldset.mt-3",
	globalFilterSectionTitleXpath:"//*[@class='parentLabel']",
	globalFilterProviderCategoriesCss: "app-global-filter .filter-section .groupHeading",
	globalFilterProvidersOptionsCss: "app-global-Filter .groupHeading, .dropdownWrapper",
	dcGlobalFilterXpath: "//*[@class='bx--col-md-6 bx--col-sm-12']//*[@class='bx--form-item bx--checkbox-wrapper']//span[@class='filterTextOverflow']",
	mcGlobalFilterXpath: "//*[@class='bx--col-md-6 bx--col-sm-12 custom-class-example']//*[@class='bx--form-item bx--checkbox-wrapper']//span[@class='filterTextOverflow']",
	selectedMcDcProviderGlobalFilterOptionTagXpath: "//*[@class='bx--fieldset mt-3'][1]//descendant-or-self::div//*[@type='Warm-gray']",
	globalFilterSectionsXpath: "//*[@class='bx--fieldset mt-3']//ul[@id='{0}']",
	globalFilterSubSectionsCheckboxOptionsXpath: "//*[@class='bx--fieldset mt-3']//ul[@id='{0}']//li//span[@class='filterTextOverflow']",
	globalFilterTeamAppCategoriesXpath: "//span[@class='parentLabel']//ancestor::div[@class='bx--fieldset mt-3']",
	globalFilterDisabledSectionCss: "div.bx--fieldset.mt-3.disable-content",
	globalFilterSectionsMoreLinkXpath: "//ul[@id='{0}']//following-sibling::a[contains(@class,'bx--link')]",
	globalFilterMorePopupCss:"div.filter_data div.checkboxpro",
	globalFilterMorePopupOptionNameXpath: "//div[@id='divSearch']//div[@id='searchData']//span[@class='filterTextOverflow' and contains(text(),'{0}')]",
	morePopupCloseBtnCss:"span.closeicons",
	morePopupSearchCss:"input#global-filter-search",
	morePopupDisplayXpath: "//div[@class='searchDiv'][contains(@style,'display: block')]",
	morePopupSearchClearCss:"div#divSearch button.bx--search-close",
	globalFilterSelectFilterDropdownCss: ".containerselectedfilter span.bx--list-box__label",
	globalFilterVerticalOverflowMenuOptionsCss: "ul.bx--overflow-menu-options--open ibm-overflow-menu-option button.bx--overflow-menu-options__btn",
	globalFilterSaveMenuVisibilityCss: "ibm-overflow-menu-option.bx--overflow-menu-options__option--disabled",
	globalFilterSelectFilterNameCss:"input.bx--text-input",
	globalFilterSaveDeletePopupHeaderTextCss: ".SaveDeleteModalwindow header.bx--modal-header h3",
	globalFilterSaveDeletePopupLabelTextCss: ".SaveDeleteModalwindow section.bx--modal-content label",
	globalFilterSaveDeleteCancelFilterXpath: "//ibm-modal[@class='SaveDeleteModalwindow']//footer[@class='bx--modal-footer']//button[contains(text(),'{0}')]",
	globalFilterSelectFilterSaveCancelBtnCss:".SaveDeleteModalwindow footer.bx--modal-footer button",
	globalFilterSelectFilterDuplicateNameErrCss:"div.savefiltercontainer label.helptext",
	globalFilterSelectFilterListCss:"ul.bx--list-box__menu li",
	globalFilterVerticalOverflowMenuCss: "div#global-filter-health ibm-overflow-menu button.bx--overflow-menu",
	globalFilterExceededFilterMsgCss:"label.maxLimitText",
	globalFilterFilterExceedCloseBtnCss:".filterpopupheader button",
	resourceCompareDropDownExpandCss:"div.bx--multi-select .bx--list-box__menu-icon",
	metricsTrendDropDownExpandCss:"div.bx--dropdown .bx--list-box__menu-icon",
	metricsDropdownValuesCss:"li .bx--list-box__menu-item__option",
	leftAxisMetricsLabel:".bx--cc--axes .left text",
	checkNoMetricsData:"div.metrics-nodata",
	/**
	 * Resource Availablity
	 */
	kpiValuesTitleCss : "ibm-tile.kpi-title span",
	/**
	 * Resource performance graph
	 */
	performanceTabNameCss: "ul.performance-tab li a span",
	resourceCategoryCss:"//span[contains(text(),'Resource category')]",
	utilizationTabCss:"span#performance-util",
	processGroupsCss:"#performance-processGroups",
	computeTabNameCss:"ibm-tab-header#performancecompute-tab-header a.bx--tabs__nav-link",
	networkTabCss:"ibm-tab-header#performancenetwork-tab-header a.bx--tabs__nav-link",
	diskTabCss:"ibm-tab-header#performanceutilizationDiskpe-tab-header a.bx--tabs__nav-link",
	memoryTabCss:"ibm-tab-header#performanceutilizationmemory-tab-header a.bx--tabs__nav-link",
	heapSizeTabCss:"ibm-tab-header#performanceheapSize-tab-header a.bx--tabs__nav-link",
	garbageCollectionTabCss:"ibm-tab-header#performancegarbageCollection-tab-header a.bx--tabs__nav-link",
	appResBreakdownRectsXpath:"//*[@class='graph-svg-component']//*[contains(@id,'stackBar_rect_')]",
	filterByDaysCss:"button.bx--list-box__field",
	numbeOfDaysXpath:"//*[@class='bx--list-box__menu-item__selected-icon']//parent::div",
	filterByXpath:"//li[contains(@title, '{0}']",
	appResListTableCss: "ibm-table table.bx--data-table tbody",
	healthColumnXpath: "//td[3]//span[@class='verticalalign']",
	paginationCss: "div.bx--pagination div.bx--pagination__right button",
	listSectionLabelCss: "div ibm-table-header.bx--data-table-header h4",
	tableCss: "div.listView ibm-table-container ibm-table",
	tableHeaderCss: "div.bx--table-header-label",
	tableSearchBarCss: "div.listView ibm-table-toolbar ibm-table-toolbar-content ibm-table-toolbar-search",
	tablePaginationCss: "div.listView ibm-pagination",
	tableNoDataCss: "tbody.no-data-table tr td div",
	tableExportCss: "ibm-overflow-menu.exportMenu button",
	tableExportEnabledCss: "ibm-overflow-menu.exportMenu.enableButton button",
	tableExportModalHeader: "ibm-modal-header header p",
	tableExportRadioOptions: "section ibm-radio-group ibm-radio",
	tableExportRadioOptionClick: "section ibm-radio-group ibm-radio span",
	tableExportButtons: "ibm-modal-footer button",
	tableExportCloseIcon: ".exportmodal ibm-modal-header header button.bx--modal-close",
	paginationSelectInput: "ibm-pagination div input.bx--select-input",
	searchBarInput: "ibm-table-toolbar-search div input.bx--search-input",
	tableFilterSelectionIcon : "ibm-dropdown div.bx--list-box svg",
	tableFilterPlaceholder : "ibm-dropdown span.bx--list-box__label",
	tableFilterOptions : "ibm-dropdown-list label span.bx--checkbox-label-text",
	tableColumnTitleCss:".bx--data-table-container .bx--table-sort__flex, #title",
	tableRowCss:".bx--data-table-container .bx--data-table tbody tr",
	tablePageNumberCss:".bx--select__page-number .bx--select__arrow",
	tableItemsPerPageCss:".bx--select__item-count .bx--select__arrow",
	idLinkCss : 'ibm-table table tbody tr td a.bx--link',
	nameLinkCss : "ibm-table table tbody tr td:nth-child(2) a.bx--link",
	detailsPageOverviewTitleCss : "div.overview label.title",
	resourceOverviewSubSectionTitlesCss : "div.container-overview label.overViewtitle",
	resourceOverviewSubSectionValueCss : "div.container-overview span.overViewcontent",

    /* Table Settings Locators */
	tableSettingsId : "settings-icon",
	tableSettingsHeaderTextCss : "h4.settings-header",
	tableSettingsAllColumnCheckboxXpath: "//input[@name='getAllColumns']",
	tableSettingsAllColumnTextXpath: "//ibm-checkbox[@name='getAllColumns']//*[@class='bx--checkbox-label-text']",
	tableSettingsColumnsNameCss : "span.bx--checkbox-label-text span.column-name",
	tableSettingsColumnsCheckboxXpath : "//span[@class='column-name']//ancestor::label//preceding-sibling::input",
	tableSettingsCloseIconCss : "svg.closeIcon",
	tableSettingsApplyResetCancelButtonsXpath : "//div[@class='btn-div']//button[contains(text(),'{0}')]",
	tableSettingColumnToDragDropXpath :"//span[@class='bx--checkbox-label-text']//span[contains(text(),'{0}')]",
};

function health(selectorConfig) {
	if (!(this instanceof health)) {
		return new health(selectorConfig);
	}
	extend(this, defaultConfig);

	if (selectorConfig) {
		extend(this, selectorConfig);
	}
}

/**
 * Method to perform switch to default content then switch to frame
 */
health.prototype.open = function () {
	util.waitForAngular();
	util.switchToDefault();
	util.switchToFrameById(frames.mcmpIframe);
	util.waitOnlyForInvisibilityOfCarbonDataLoader();
	//util.waitForAngular();
	util.switchToFrameById(frames.cssrIFrame);
	util.waitOnlyForInvisibilityOfCarbonDataLoader();
};

/**
 * Method to get health header title text
 */
health.prototype.getHealthHeaderTitleText = function () {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.healthHeaderTileTextCss))), timeout.timeoutInMilis);
	return element(by.css(this.healthHeaderTileTextCss)).getText().then(function (text) {
		logger.info("Health page header title text : " + text);
		return text;
	});
};

/**
 * Method to check view details button is displaying or not
 */
health.prototype.isViewDetailsButtonDisplayed = async function (index) {
	var self = this;
	util.waitForAngular();
	util.waitOnlyForInvisibilityOfCarbonDataLoader();
	var viewDetailsText, viewDetailsStatus;
	browser.wait(EC.visibilityOf(element.all(by.css(this.listViewHeaderCss)).get(0)), timeout.timeoutInMilis);
	var elementList = element.all(by.css(self.applicationTableOptionButtonCss));
	var count = await elementList.count();
	if(count === 1 || index >= count) {
        index = count - 1;
	}
	return await elementList.isPresent().then(async function(status) {
	    if(status === true) {
	        await elementList.get(index).click();
	        logger.info("Clicked on 3 vertical dots.");
            browser.wait(EC.visibilityOf(element(by.css(self.applicationViewDetailsButtonCss))), timeout.timeoutInMilis);
            viewDetailsText = await element(by.css(self.applicationViewDetailsButtonCss)).getText();
            logger.info("List view - '"+viewDetailsText+"' found");
	    }
	    else {
            logger.info("List view - View Details option is not found");
	    }
	});
}

/**
 * Method to click on view details in application/resource tab
 */
 health.prototype.clickOnViewDetails = async function () {
	var self = this;
	util.waitOnlyForInvisibilityOfCarbonDataLoader();
    return element.all(by.css(self.viewDetailsCss)).isPresent().then(function (status) {
	    if(status == true) {
	        return element.all(by.css(self.viewDetailsCss)).getText().then(function (label) {
		     if (label && label.length > 0) {
			    element.all(by.css(self.viewDetailsCss)).get(0).click().then(function () {
				    logger.info("Clicked on View details");
			    });
		     }
    	   });
    	}
        else {
            logger.info("List view - 'View details' not found");
        }
    });
}

/**
 * Method to add filter
 */
 health.prototype.addFilter = async function(filterNameToAdd) {
	var self = this;
	var i;
	util.waitForAngular();
	var filterNameExistMsg, saveFilterLimitExceedMsg, checkFilterNameLessChar, checkFilterBlankNameChar;
	var filterList = await self.getSavedFilterListFromGlobalFilter();
	browser.wait(EC.visibilityOf(element(by.css(self.globalFilterVerticalOverflowMenuCss))),  timeout.timeoutInMilis);
	return element(by.css(self.globalFilterVerticalOverflowMenuCss)).click().then(async function() {
		await element.all(by.css(self.globalFilterVerticalOverflowMenuOptionsCss)).get(0).click().then(async function() {
			logger.info("Clicked on save option in filter overflow menu");
	        util.waitForAngular();
	        if(filterList.length < 6){
				for(i=0;i<filterNameToAdd.length;i++) {
					logger.info("firstvalue is" +filterNameToAdd[i]);
					if(filterNameToAdd[i].length < 2){
						browser.wait(EC.visibilityOf(element(by.css(self.globalFilterSelectFilterNameCss))),  timeout.timeoutInMilis);
						await element(by.css(self.globalFilterSelectFilterNameCss)).sendKeys(filterNameToAdd[i]);
						if(filterNameToAdd[i]==" "){
							checkFilterBlankNameChar = await element(by.css(self.globalFilterNameErrCss)).getText();
							if(healthTestData.filterSpeCharErrMessage === checkFilterBlankNameChar){
								logger.info("error message for blank filtername displayed correctly");
							}
						}
						if(filterNameToAdd[i].length==1){
							logger.info("filter name has less then 2 char");
							checkFilterNameLessChar = await element(by.css(self.globalFilterNameErrCss)).getText();
							logger.info("Message when filtername less then 2 char:",checkFilterNameLessChar);
							if(healthTestData.filterMinCharErrMessage === checkFilterNameLessChar){
								logger.info(TitleText+" error message for min char is displayed correctly");
							}
						}
						if(filterNameToAdd[i].includes("[^a-zA-Z0-9]")){
							logger.info("filter name has special char");
							checkFilterNameSpecChar = await element(by.css(self.globalFilterNameErrCss)).getText();
							if(healthTestData.filterSpeCharErrMessage === checkFilterNameSpecChar){
								logger.info(TitleText+" error message for special char is displayed correctly");
							}
						}
						}
						browser.wait(EC.visibilityOf(element(by.css(self.globalFilterSelectFilterNameCss))),  timeout.timeoutInMilis);
						await element(by.css(self.globalFilterSelectFilterNameCss)).clear().sendKeys(filterNameToAdd[i]);
						if(!(filterList.includes(filterNameToAdd))){
							await element.all(by.css(self.globalFilterSelectFilterSaveCancelBtnCss)).get(1).click().then(async function(){
									logger.info("clicked on save button");
							}
							)}


				}
			}else{
				browser.wait(EC.visibilityOf(element(by.css(self.globalFilterSelectFilterNameCss))),  timeout.timeoutInMilis);
				await element(by.css(self.globalFilterSelectFilterNameCss)).sendKeys(filterNameToAdd);
				if(!(filterList.includes(filterNameToAdd))){
					await element.all(by.css(self.globalFilterSelectFilterSaveCancelBtnCss)).get(1).click().then(async function(){
						logger.info("clicked on save button");
						util.waitOnlyForInvisibilityOfCarbonDataLoader();
						var checkSavedFilterName = await element(by.css(self.globalFilterSelectFilterDropdownCss)).getText();
						if(checkSavedFilterName === filterNameToAdd) {
							logger.info("Newly added filter is listed in filter dropdown and it is selected: "+checkSavedFilterName);
						}
					})
				}else if(filterList.includes(filterNameToAdd)){
					var text = await self.checkFilterNameAlreadyExist(filterNameToAdd);
			        filterNameExistMsg = text.filterExistMessage;
			        if(filterNameExistMsg != '') {
						logger.info("Duplicate Filter name error message :"+filterNameExistMsg);
						await element.all(by.css(self.globalFilterSelectFilterSaveCancelBtnCss)).get(0).click().then(async function() {
							logger.info("clicked on Cancel button");
						})
					}
				}else if(filterList.length === 6) {
					browser.wait(EC.visibilityOf(element(by.css(self.globalFilterExceededFilterMsgCss))),  timeout.timeoutInMilis);
					saveFilterLimitExceedMsg = await element(by.css(self.globalFilterExceededFilterMsgCss)).getText();
					if(saveFilterLimitExceedMsg != ''){
						logger.info("Message when saved filter count limit reaches to 5:",saveFilterLimitExceedMsg);
						await element(by.css(self.globalFilterFilterExceedCloseBtnCss)).click().then(async function(){
							logger.info("clicked on Cancel button");
						})
					}
				}
			}
		})
		return {filterNameToAdd, filterNameExistMsg, saveFilterLimitExceedMsg, checkFilterNameLessChar};
	})

}


/**
 * Method to save existing filter 'save as new filter(s)' in Global filter panel
 */
health.prototype.saveAsNewFilter = async function (numberOfFilters, action) {
	var self = this;
	var savedFilterName, filterNameExistMsg, filterCountExceedMessage;
	var addFilterName, addFilterNameList = [];
	for(var i=1; i<=numberOfFilters;i++) {
	    addFilterName = "Filter-new".concat(i);
	    logger.info("Filter Name to add:",addFilterName);
	    util.waitForAngular();
	    var getSavedFilterList = await self.getSavedFilterListFromGlobalFilter();
	    browser.wait(EC.elementToBeClickable(element(by.css(self.globalFilterVerticalOverflowMenuCss))), timeout.timeoutInMilis);
	    await element(by.css(self.globalFilterVerticalOverflowMenuCss)).click();
	    browser.wait(EC.elementToBeClickable(element.all(by.css(self.globalFilterVerticalOverflowMenuOptionsCss)).get(1)), timeout.timeoutInMilis);
	    await element.all(by.css(self.globalFilterVerticalOverflowMenuOptionsCss)).get(1).click();
	    logger.info("Clicked on save as new option in filter overflow menu");
             if(getSavedFilterList.length === 6) {
                        browser.wait(EC.visibilityOf(element(by.css(self.globalFilterExceededFilterMsgCss))),  timeout.timeoutInMilis);
    			        filterCountExceedMessage = await element(by.css(self.globalFilterExceededFilterMsgCss)).getText();
    			        logger.info(filterCountExceedMessage);
    			        await element(by.css(self.globalFilterFilterExceedCloseBtnCss)).click();
                        logger.info("clicked on Close button");
                        break;
             }
		     else if(getSavedFilterList.length < 6) {
			            browser.wait(EC.visibilityOf(element(by.css(self.globalFilterSelectFilterNameCss))), timeout.timeoutInMilis);
			            await element(by.css(self.globalFilterSelectFilterNameCss)).sendKeys(addFilterName).then(async function(){
			                var checkFilterNameExist = await self.checkFilterNameAlreadyExist();
			                if(!checkFilterNameExist.status) {
			                    var nameToEnter = await element(by.css(self.globalFilterSelectFilterNameCss)).getText();
			                    var actionXpath = self.globalFilterSaveDeleteCancelFilterXpath.format(action);
                                await element(by.xpath(actionXpath)).click().then(function(){
                                    logger.info("Clicked on '"+action+"' button.");
                                });
                                util.waitForAngular();
			                    browser.wait(EC.visibilityOf(element(by.css(self.globalFilterSelectFilterDropdownCss))), timeout.timeoutInMilis);
			                    savedFilterName = await element(by.css(self.globalFilterSelectFilterDropdownCss)).getText();
			                    logger.info("Saved Filter Name:",savedFilterName);
			                    if(addFilterName === savedFilterName) {
			                        logger.info(addFilterName, "filter is added successfully");
			                    } else {
			                        logger.info(addFilterName, "filter is not added");
			                    }
			                }
			                else if(checkFilterNameExist.status) {
			                    filterNameExistMsg = checkFilterNameExist.filterExistMessage;
                                await element.all(by.css(self.globalFilterSelectFilterSaveCancelBtnCss)).get(0).click();
                                logger.info("clicked on Cancel button");
			                }
			            });
			            addFilterNameList.push(addFilterName);
			 }
    }
    logger.info("Added Filter name :",addFilterNameList);
    return {addFilterNameList, filterNameExistMsg, filterCountExceedMessage};
}

/**
 * Method to delete filter(s) in Global filter panel
 */
health.prototype.deleteFilter = async function (action) {
	var self = this;
	var deleteFilterName = [];
	var getSavedFilterList = await self.getSavedFilterListFromGlobalFilter();
	if(getSavedFilterList.length > 1){
	    for(var i=1; i< getSavedFilterList.length; i++) {
	            browser.wait(EC.elementToBeClickable(element(by.css(self.globalFilterSelectFilterDropdownCss))),  timeout.timeoutInMilis);
	            util.waitForAngular();
        	    await element(by.css(self.globalFilterSelectFilterDropdownCss)).click();
        	    await element.all(by.css(self.globalFilterSelectFilterListCss)).get(1).click();
	            var filterName = await element(by.css(self.globalFilterSelectFilterDropdownCss)).getText();
	            logger.info("Selected '"+filterName+ "' to Delete.");
	            deleteFilterName.push(filterName);
	            browser.wait(EC.visibilityOf(element(by.css(self.globalFilterVerticalOverflowMenuCss))), timeout.timeoutInMilis);
                await element(by.css(self.globalFilterVerticalOverflowMenuCss)).click().then(async function() {
                        browser.wait(EC.elementToBeClickable(element.all(by.css(self.globalFilterVerticalOverflowMenuOptionsCss)).get(2)), timeout.timeoutInMilis);
    	                await element.all(by.css(self.globalFilterVerticalOverflowMenuOptionsCss)).get(2).click();
    	                logger.info("Clicked on Delete option in filter overflow menu");
    	                browser.wait(EC.visibilityOf(element(by.css(self.globalFilterSelectFilterSaveCancelBtnCss))), timeout.timeoutInMilis);
    	                await element(by.css(self.globalFilterSaveDeletePopupHeaderTextCss)).getText().then(async function(deleteHeaderText){
    	                    logger.info("Delete Filter Popup header text:", deleteHeaderText);
    	                    await element(by.css(self.globalFilterSaveDeletePopupLabelTextCss)).getText().then(async function(deletePopupLabelText){
    	                        logger.info("Delete Filter Popup Label text:", deletePopupLabelText);
    	                    });
    	                });
                        var deleteFilterPopupXpath = self.globalFilterSaveDeleteCancelFilterXpath.format(action);
                        await element(by.xpath(deleteFilterPopupXpath)).click().then(function(){
                            logger.info("Clicked on '"+action+"' button.");
                        });
                        util.waitOnlyForInvisibilityOfCarbonDataLoader();
			            browser.wait(EC.elementToBeClickable(element(by.css(self.globalFilterSelectFilterDropdownCss))),  timeout.timeoutInMilis);
			            var selectedFilterName = await element(by.css(self.globalFilterSelectFilterDropdownCss)).getText();
			               logger.info("Selected Filter Name:",selectedFilterName);
			                    if(selectedFilterName != filterName) {
			                        logger.info(filterName, "filter is deleted successfully");
			                    } else {
			                        logger.info(filterName, "filter is not deleted");
			                    }
                });
	    }
        logger.info("Selected Filter to delete:",deleteFilterName);
    }
    else {
        logger.info("No saved Filter is available to delete");
    }
    return deleteFilterName;
}

/**
 * Method to check filter name already exists while saving new filter.
 */
health.prototype.checkFilterNameAlreadyExist = async function(FilterText){
    var self = this;
    util.waitForAngular();
    var filterExistMessage;
    return await element(by.css(self.globalFilterSelectFilterDuplicateNameErrCss)).isPresent().then(async function(status){
        if(status) {
            filterExistMessage = await element(by.css(self.globalFilterSelectFilterDuplicateNameErrCss)).getText();
            logger.info("Duplicate Filter name error message:",filterExistMessage);
        }
        return {status, filterExistMessage};
    });
}

/**
 * Method to get list of all filter(s) name in Select Filter dropdown.
 */
health.prototype.getSavedFilterListFromGlobalFilter = async function(){
	util.waitOnlyForInvisibilityOfCarbonDataLoader();
	var self= this;
	var filterList;
    browser.wait(EC.elementToBeClickable(element(by.css(self.globalFilterSelectFilterDropdownCss))), timeout.timeoutInMilis);
	return await element(by.css(self.globalFilterSelectFilterDropdownCss)).click().then(async function() {
	    logger.info("clicked on Select filter dropdown");
	    filterList = await element.all(by.css(self.globalFilterSelectFilterListCss)).getText()
	    logger.info("Filters List from dropdown:",filterList);
	    await element(by.css(self.globalFilterSelectFilterDropdownCss)).click();
	    return filterList;
	});
}

/**
 * Method to verify select filter dropdown
 */
 health.prototype.isSelectFilterDisplayed = async function () {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.globalFilterSelectFilterDropdownCss))), timeout.timeoutInMilis);
	return await element(by.css(this.globalFilterSelectFilterDropdownCss)).isDisplayed().then(async function(status) {
	    return status;
	});
}

/**
 * Method to select type of alerts in dropdown from Application Breakdown section
 * Ex. alertType - Critical, Warning
 */
health.prototype.selectAlertTypeFromDropdown = function (alertType) {
	var self = this;
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.css(this.alertTypeDropdownValuesCss)).get(0)), timeout.timeoutInMilis);
	return element(by.css(this.alertTypeDropdownCss)).click().then(function () {
		logger.info("Clicked on Dropdown..");
		return element.all(by.css(self.alertTypeDropdownValuesCss)).getText().then(function (values) {
			for (var i = 0; i < values.length; i++) {
				logger.info("Comparing '"+ values[i] +"' with '"+ alertType +"'");
				if (values[i].includes(alertType)) {
					return element.all(by.css(self.alertTypeDropdownValuesCss)).get(i).click().then(function () {
						logger.info("Clicked on dropdown value: " + alertType);
						return;
					});
				}
			}
			if(i == values.length){
				logger.info("'"+alertType+ "' is not found");
				return 0;
			}
		});
	});
};

/*
 * Method to get default selected health status donut chart widget details
*/
health.prototype.getSelectedTypeCountFromDonutChart = async function(){
    util.waitForAngular();
	util.waitOnlyForInvisibilityOfCarbonDataLoader();
	var zeroCount = 0;
	var self = this;
	await browser.wait(EC.visibilityOf(element(by.css(self.donutChartLabelsCss))), timeout.timeoutInMilis);
	var count = await element.all(by.css(self.donutChartLabelsCss)).count();
	for(var i=0; i<count; i++){
		var fontWeightVal = await element.all(by.css(self.donutChartLabelsCss)).get(i).getAttribute('style');
		logger.info("Comparing "+fontWeightVal+" with 'bold'");
		if(fontWeightVal.includes('bold')){
			var donutChartCount = await element.all(by.css(self.donutChartLabelsCss)).get(i).getText();
			logger.info("Donut chart count for selected alert type: "+ donutChartCount);
			var validRegexCount = /[^0-9]/g;
			var count = donutChartCount.replace(validRegexCount,'')
			return parseInt(count);
		}
	}
	return 	zeroCount;
}

/*
 * Method to click on each health status option
*/
health.prototype.clickOnHealthStatusOption = async function(healthStatus) {
    util.waitOnlyForInvisibilityOfCarbonDataLoader();
    var self = this;
    var text;
    await browser.wait(EC.visibilityOf(element(by.css("app-donut-chart svg g"))), timeout.timeoutInMilis);
	await browser.wait(EC.visibilityOf(element.all(by.css(self.donutChartLabelsCss)).get(0)), timeout.timeoutInMilis);
	var count = await element.all(by.css(self.donutChartLabelsCss)).count();
    for(var i=0; i < count; i++) {
    		var fontWeightVal = await element.all(by.css(self.donutChartLabelsCss)).get(i).getAttribute('style');
    		logger.info("fontWeightVal :", fontWeightVal);
            await element.all(by.css(self.donutChartLabelsCss)).get(i).getText().then(async function(name) {
                if (fontWeightVal.includes('bold') && name.includes(healthStatus)) {
                    var status = element(by.xpath(self.defaultSelectedHealthStatusXpath)).isPresent();
                    if(status) {
                        text = healthStatus;
                        logger.info("Default selected health status:", healthStatus);
                    }
                }
                else if (!fontWeightVal.includes('bold') && name.includes(healthStatus)) {
                    if(healthStatus == healthTestData.resourceHealthyText) {
                          var healthyElement = element(by.css(self.healthySliceFromDonutChartXpath));
                          browser.wait(EC.elementToBeClickable(healthyElement), timeout.timeoutInMilis);
                          browser.actions().mouseMove(healthyElement).
                    	  mouseMove({x:95, y:0}).click().perform();
                    }
                    else if(healthStatus == healthTestData.resourceCriticalText) {
                        element(by.xpath(self.criticalSliceFromDonutChartXpath)).click();
                    }
                    else if(healthStatus == healthTestData.resourceWarningText) {
                        element(by.xpath(self.warningSliceFromDonutChartXpath)).click();
                    }
                    text = healthStatus;
                    logger.info(text, "option is clicked in health status widget");
                }
                else if (fontWeightVal.includes('bold') && !name.includes(healthStatus)) {
                    text = healthStatus;
                    logger.info(text, "is not found in Health Status widget.");
                }
            });
    }
	var selectedStatusText = text.replace(/[0-9]/g,'');
	return selectedStatusText;
}


/**
 * Validate if the title text for main section is present or not
 * @param {Title text for main sections; EX: Top insights, Applications, Resource List, etc.} TitleText
 */
health.prototype.isTitleTextFromSectionPresent = function(TitleText){
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.xpath(this.mainSectionsXpath)).get(0)), timeout.timeoutInMilis);
	return element.all(by.xpath(this.mainSectionsXpath)).getText().then(function(titleTextList){
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
	});
}

/**
 * Validate global filter main categories title(s) is present or not
 */
 health.prototype.isGlobalFilterMainCategoriesTitlePresent = function(TitleText){
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.xpath(this.globalFilterSectionTitleXpath)).get(0)), timeout.timeoutInMilis);
	return element.all(by.xpath(this.globalFilterSectionTitleXpath)).getText().then(function(titleTextList){
		for(var i=0; i < titleTextList.length; i++){
			if(TitleText.includes(titleTextList[i])) {
				logger.info(titleTextList[i]+" is present in global filter");
			}
			else {
			    logger.info(TitleText+" is not present in global filter");
			}
		}
		return titleTextList;
	});
}

/**
 * Method to verify Global filter Teams, Application Categories and Applications categories with options
 */
health.prototype.isPresentGlobalFilterTeamAppCategories = async function () {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.globalFilterCss))), timeout.timeoutInMilis);
	return await element.all(by.xpath(this.globalFilterTeamAppCategoriesXpath)).then(async function (elements) {
		var status = false;
		if (elements) {
			for (let i = 0; i < elements.length; i++) {
				let text = await elements[i].getText();
				let subText = text.split('\n')
				if (subText.length > 0) {
					for (let x = 0; x < subText.length; x++) {
						if (x === 0) {
							logger.info("Global filter Category text -> " + subText[x]);
						}
						else {
							logger.info("Global filter options in Category text -> " + subText[x]);
						}
					}
				}
				else {
					logger.info("Global filter Category text -> " + text);
				}
			}
			status = true;
			logger.info("Global filter Categories title status -> " + status);
			return status;
		}
	});
}

/**
 * Method to get Top Insights label text
 */
// health.prototype.getTopInsightsLabelText = function () {
// 	util.waitForAngular();
// 	browser.wait(EC.visibilityOf(element(by.css(this.topInsightsLabelCss))), timeout.timeoutInMilis);
// 	return element(by.css(this.topInsightsLabelCss)).getText().then(function (topInsightsLabel) {
// 		logger.info("Top Insights Label: " + topInsightsLabel);
// 		return topInsightsLabel.replace(/\s+/g, ' ').trim();
// 	});
// }

/**
 * Method to verify Top Insights sub-section label text is present or not
 */
health.prototype.verifyTopInsightsSubSectionLabelText = function (subLabelText) {
	util.waitOnlyForInvisibilityOfCarbonDataLoader();
	var i;
	browser.wait(EC.visibilityOf(element.all(by.css(this.topInsightsSubSectionLabelsCss)).get(0)), timeout.timeoutInMilis);
	return element.all(by.css(this.topInsightsSubSectionLabelsCss)).getText().then(function (labels) {
		for (i = 0; i < labels.length; i++) {
			if (labels[i] == subLabelText) {
				logger.info("Found and Sub Label Section Label text: "+subLabelText);
				return true;
			}
		}
		if (i == labels.length) {
			logger.info("Not found and Sub Label Section Label text: "+subLabelText);
			return false;
		}
	});
}

/**
 * Get Application / Resource Name and count of each sub section of Top Insights
 * subSectionName --> Sub-section name inside top insights. Ex. Least available applications, Most available applications
 */
health.prototype.getTopInsightsSubSectionDetails = async function(subSectionName){
	var self = this;
	util.waitOnlyForInvisibilityOfCarbonDataLoader();
	var topInsightsSubSectionDetails = [];
	var NoDataMessageXpath = self.topInsightsSubSectionNoDataXpath.format(subSectionName);
	var checkNoDataMessage = await self.checkNoData(NoDataMessageXpath, subSectionName);
	if(!checkNoDataMessage.status) {
	    var topInsightsSubSectionAppRescName = self.topInsightsSubSectionAppRescNameXpath.format(subSectionName);
        var topInsightsSubSectionAppRescCount = self.topInsightsSubSectionAppRescCountXpath.format(subSectionName);
        browser.wait(EC.visibilityOf(element.all(by.css(self.topInsightsSubSectionLabelsCss)).get(0)), timeout.timeoutInMilis);
        await element.all(by.xpath(topInsightsSubSectionAppRescName)).getText().then(async function(nameList) {
        		await element.all(by.xpath(topInsightsSubSectionAppRescCount)).getText().then(async function(countList) {
        			for(var i = 0; i < nameList.length; i++){
        				topInsightsSubSectionDetails.push({"name":nameList[i], "value": countList[i]});
        			}
        			logger.info("Top Insights subsection '"+subSectionName+"' name and count:", topInsightsSubSectionDetails);
        		});
        });
	}
	return topInsightsSubSectionDetails;
}

/**
 * Method to Check No data text in all widgets.
 */
health.prototype.checkNoData = async function(checkNoDataLocator, widget) {
	util.waitForAngular();
	var subSectionNoDataXpath = checkNoDataLocator;
	var result, noDataMessage;
	return await element.all(by.xpath(subSectionNoDataXpath)).isPresent().then(async function(status){
	    if (status == true){
    		await element(by.xpath(subSectionNoDataXpath)).getText().then(async function (noDataText) {
    		    noDataMessage = noDataText;
    		});
    	}
    	return {status, noDataMessage};
	});
}

/**
 * Click on any random value in given subsection of top insights and get the name
 */
health.prototype.clickAndGetTextFromTopInsightsSubSection = async function(subSectionName){
	var self = this;
	util.waitForAngular();
	var clickedName = "";
	var topInsightsSubSectionAppRescName = self.topInsightsSubSectionAppRescNameXpath.format(subSectionName);
	var NoDataMessageXpath = self.topInsightsSubSectionNoDataXpath.format(subSectionName);
    var checkNoDataMessage = await self.checkNoData(NoDataMessageXpath, subSectionName);
    if(!checkNoDataMessage.status) {
	    await element.all(by.xpath(topInsightsSubSectionAppRescName)).getText().then(function(nameList){
            clickedName = nameList[0];
        	element.all(by.xpath(topInsightsSubSectionAppRescName)).get(0).click();
        	logger.info("Clicked on '"+clickedName+"' inside "+subSectionName+" sub section of top insights")
        });
	}
	else {
	    logger.info(checkNoDataMessage.noDataMessage);
	}
	return clickedName;
}


/*
 * Method to verify Resources summary widget header text is displaying or not
*/
health.prototype.isResourcesSummaryHeaderTextDisplaying = async function() {
    util.waitForAngular();
    var self = this;
    var headerText;
    browser.wait(EC.visibilityOf(element(by.css(self.resourceSummaryHeaderCss))), timeout.timeoutInMilis);
    return await element(by.css(self.resourceSummaryHeaderCss)).isDisplayed().then(async function (result) {
       	if (result == true) {
       	    headerText = await element(by.css(self.resourceSummaryHeaderCss)).getText();
       		logger.info(headerText, "widget is Present.");
       	}
      	else {
        	logger.info(headerText, "widget is not Present.");
        }
        logger.info("Resource Summary Widget Header Text: ", headerText);
        return headerText;
    });
}

/*
 * Method to get Health Resources Summary section details
 */
health.prototype.getResourcesSummaryTextAndCount = async function () {
	var self = this;
	util.waitOnlyForInvisibilityOfCarbonDataLoader();
	var resourceSummaryLabelAndCount = [];
	browser.wait(EC.visibilityOf(element.all(by.css(self.resourceSummaryValueCss)).get(0)), timeout.timeoutInMilis);
	return await element(by.css(self.resourceSummaryHeaderCss)).getAttribute('aria-expanded').then(async function(status){
	    if(status == 'true') {
	        await element.all(by.css(self.resourceSummaryLabelCss)).getText().then(async function(labelText) {
        		await element.all(by.css(self.resourceSummaryValueCss)).getText().then(async function(labelCount) {
        			if (labelCount !== undefined && labelCount.length) {
        				for (var i = 0; i < labelText.length; i++) {
        					var text = labelText[i];
        					if(!labelCount[i].includes("K")) {
        					    labelCount[i] = parseInt(labelCount[i]);
        					}
        					resourceSummaryLabelAndCount[labelText[i]] = labelCount[i];
        				}
        			}
        		});
        	});
	    } else if (status == 'false') {
	        logger.info(" Resources Summary widget Label text and count not displaying");
	    }
	    logger.info("Resource Summary Label And Count : ", resourceSummaryLabelAndCount);
        return resourceSummaryLabelAndCount;
	});
}

/*
 * Method to get Health status details from Health widget
   Critical:<count>, Warning:<count>, Healthy:<count>
 */
health.prototype.getHealthStatusSectionTextAndCount = async function () {
	var self = this;
	util.waitOnlyForInvisibilityOfCarbonDataLoader();
	var healthStatusLabelAndCount = [];
	var message;
	var totalHealthStatus = 0;
	browser.wait(EC.visibilityOf(element.all(by.css(self.donutChartCountsCss)).get(0)), timeout.timeoutInMilis);
	return await element(by.css(self.healthStatusNoDataMessageCss)).isPresent().then(async function(result) {
	    if(result == true) {
	        message = await element(by.css(self.healthStatusNoDataMessageCss)).getText();
	        logger.info("Health Status Widget no data message:", message);
	        return message;
	    } else {
            await element.all(by.css(self.donutChartLabelsCss)).getText().then(async function(statusText) {
                    		await element.all(by.css(self.donutChartCountsCss)).getText().then(async function(statusCount) {
                    			if (statusCount !== undefined) {
                    				for (var i = 0; i < statusText.length; i++) {
                    				    statusText[i] = statusText[i].replace(/[0-9]/g, '');
                    				    if(statusCount[i] > 999) {
                    				        statusCount[i] = Math.round(10*(statusCount[i]/1000))/10 + "K" ;
                    				    } else {
                    				        statusCount[i] = parseInt(statusCount[i]);
                    				    }
                    					healthStatusLabelAndCount[statusText[i]] = statusCount[i];
                    					totalHealthStatus = totalHealthStatus + statusCount[i];
                    				}
                    			}
                    		});
            	});
                var keys = Object.keys(healthStatusLabelAndCount);
                if(!(keys.includes(healthTestData.resourceCriticalText))) {
                        healthStatusLabelAndCount[healthTestData.resourceCriticalText] = 0;
                } if(!(keys.includes(healthTestData.resourceWarningText))) {
                        healthStatusLabelAndCount[healthTestData.resourceWarningText] = 0;
                } if(!(keys.includes(healthTestData.resourceHealthyText))) {
                        healthStatusLabelAndCount[healthTestData.resourceHealthyText] = 0;
                }
            	logger.info("Health Status Widget details:", healthStatusLabelAndCount);
            	logger.info("Total Health Status:", totalHealthStatus);
            	return {healthStatusLabelAndCount, totalHealthStatus};
	    }
	});
}

/*
 * Method to get Health status and Deleted resources response from Elastic Search Query
 * And combine together in one array
*/
health.prototype.getHealthStatusAndDeletedResourcesElasticSearchResponse = async function() {
    var sumOfHealthStatusDelResValues = 0;
    var result = [];
    var esHealthStatusResponse = await esQueriesHealth.resources_health_status_count(healthTestData.esHealthSearchIndex,tenantId);
	var esDeletedResourcesResponse = await esQueriesHealth.deleted_resources_count(healthTestData.esDeletedResourcesSearchIndex,tenantId);
    var HealthStatusDelRescData = {...esHealthStatusResponse, ...esDeletedResourcesResponse};
    var keys = Object.keys(HealthStatusDelRescData);
    // Sum of all health status (Critical + Warning + Healthy) and Deleted Resources
    keys.forEach((key, index) => {
        sumOfHealthStatusDelResValues = sumOfHealthStatusDelResValues + HealthStatusDelRescData[key];
    });
    HealthStatusDelRescData[healthTestData.resourceTotalResources] = sumOfHealthStatusDelResValues;
    // Convert number greater than 1000 in 'K' format
    Object.entries(HealthStatusDelRescData).forEach(([key, value]) => {
        if (value > 999) {
           value =  Math.round(10*(value/1000))/10 + "K" ;
        }
        result[key] = value;
    });
    logger.info("Complete Details : ", result);
    return result;
}

/*
 * Method to get health status result from Elastic search query result
*/
health.prototype.getHealthStatusDataFromES = async function(esHealthStatusResponse) {
    var result = [];
    Object.entries(esHealthStatusResponse).forEach(([key, value]) => {
        if (value > 999) {
           value =  Math.round(10*(value/1000))/10 + "K" ;
        }
        result[key] = value;
    });
    if(esHealthStatusResponse.length === 0) {
        return healthTestData.noDataAvailableMessage;
    } else {
        logger.info("Health Status ES Result:", result);
        return result;
    }
}


/**
 * Method to verify Top Insights sub-section value text is present or not
 */
 health.prototype.verifyTopInsightsSubSectionValueText = function (subLabelText) {
	util.waitForAngular();
	var i;
	browser.wait(EC.visibilityOf(element.all(by.xpath(this.topInsightsvalueXpath)).get(0)), timeout.timeoutInMilis);
	return element.all(by.xpath(this.topInsightsvalueXpath)).getText().then(function (labels) {
		for (i = 0; i < labels.length; i++) {
			if (labels[i] == subLabelText) {
				logger.info("Found and Sub Label Section Label text: "+subLabelText);
				return true;
			}
		}
		if (i == labels.length) {
			logger.info("Not found and Sub Label Section Label text: "+subLabelText);
			return false;
		}
	});
}


/**
 * Method to verify Top resource summary label text is present or not
 */
 health.prototype.verifyResourceSummarySectionLabelText = function (subLabelText) {
	util.waitForAngular();
	var i;
	browser.wait(EC.visibilityOf(element.all(by.css(this.resourceSummaryLabelCss)).get(0)), timeout.timeoutInMilis);
	return element.all(by.css(this.resourceSummaryLabelCss)).getText().then(function (labels) {
		for (i = 0; i < labels.length; i++) {
			if (labels[i] == subLabelText) {
				logger.info("Found and Sub Label Section Label text: "+subLabelText);
				return true;
			}
		}
		if (i == labels.length) {
			logger.info("Not found and Sub Label Section Label text: "+subLabelText);
			return false;
		}
	});
}

/**
 * Method to get Health Status label text
 */
health.prototype.getHealthStatusSectionLabelText = function () {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.healthStatusSectionLabelCss))), timeout.timeoutInMilis);
	return element(by.css(this.healthStatusSectionLabelCss)).getText().then(function (healthStatusLabel) {
		logger.info("Health Status Section Label: " + healthStatusLabel);
		return healthStatusLabel;
	});
}


/**
* Method to get Applications/Resources table label text
 */
health.prototype.getAppsResTableSectionLabelText = function () {
	 util.waitForAngular();
 	browser.wait(EC.visibilityOf(element(by.css(this.applicationResourceTableHeaderCss))), timeout.timeoutInMilis);
 	return element(by.css(this.applicationResourceTableHeaderCss)).getText().then(function (applicationsLabel) {
		 var section_label = util.removeBlankSpaces(applicationsLabel).split("(")[0].trim()
		     section_label = section_label.replace(/:/g, "")
 	logger.info("Section Label: " +section_label);
 	return section_label
 	});
 }

/**
 * Method to get Application/Resources Health Breakdown label text
 */
health.prototype.getHealthBreakdownSectionLabelText = function () {
	util.waitOnlyForInvisibilityOfCarbonDataLoader();
	browser.wait(EC.visibilityOf(element(by.css(this.appResourceHealthBreakdownSectionLabelCss))), timeout.timeoutInMilis);
	return element(by.css(this.appResourceHealthBreakdownSectionLabelCss)).getText().then(function (appResHealthBreakdownLabel) {
		logger.info("Health Breakdown Section Label: " + appResHealthBreakdownLabel);
		return appResHealthBreakdownLabel;
	});
}

/*
 * Method to get Applications / Resources Breakdown each sections details
*/
health.prototype.getBreakdownDetailsBasedOnHealthStatus = async function(selectedHealthStatus) {
    var self = this;
    util.waitForAngular();
    var breakdownRecords;
    var breakdown_object = { [selectedHealthStatus]: {'environment': {}, 'provider': {}, 'team': {}, 'category': {}}};
    logger.info("breakdown_object :", breakdown_object);
    if(selectedHealthStatus === 'Critical') {
        return await element.all(by.xpath(self.healthBreakdownCriticalRedColorXpath)).isPresent().then(async function(status) {
            if(status==true) {
                breakdownRecords = await self.getAppRescBreakdownWidgetRecords(selectedHealthStatus);
                return breakdownRecords;
            }
            else {
                return breakdown_object;
            }
        });
    }
    else if(selectedHealthStatus === 'Warning') {
        return await element.all(by.xpath(self.healthBreakdownWarningYellowColorXpath)).isPresent().then(async function(status) {
            if(status==true) {
                breakdownRecords = await self.getAppRescBreakdownWidgetRecords(selectedHealthStatus);
                return breakdownRecords;
            }
            else {
                return breakdown_object;
            }
        });
    }
    else if(selectedHealthStatus === 'Healthy') {
        return await element.all(by.xpath(self.healthBreakdownHealthyGreenColorXpath)).isPresent().then(async function(status) {
            if(status==true) {
                breakdownRecords = await self.getAppRescBreakdownWidgetRecords(selectedHealthStatus);
                return breakdownRecords;
            }
            else {
                return breakdown_object;
            }
        });
    }
}

/*
 * Method to get Applications / Resources Breakdown widgets data
*/
health.prototype.getAppRescBreakdownWidgetRecords = async function(selectedHealthStatus) {
    var self = this;
    util.waitOnlyForInvisibilityOfCarbonDataLoader();
    var breakdown_object = {"resourceBreakdown": { [selectedHealthStatus]: {'environment': {}, 'provider': {}, 'team': {}, 'category': {}}}};
    var result;
    browser.wait(EC.visibilityOf(element.all(by.css(self.breakdownFooterSectionsTextCss)).get(0)), timeout.timeoutInMilis);
    return await element.all(by.css(self.breakdownFooterSectionsTextCss)).getText().then(async function(name) {
        logger.info("breakdown widget x-axis names:", name);
        for(var i=0; i< name.length; i++) {
            if(name[i].includes(healthTestData.environment)) {
                var envBreakdownXpath = self.healthBreakdownSectionsXpath.format('environment');
                await element.all(by.xpath(envBreakdownXpath)).isPresent().then(async function(status) {
                    if(status == true) {
                        var envToolTipTexts = await self.getBreakdownToolTipDetails(envBreakdownXpath);
                        breakdown_object["resourceBreakdown"][selectedHealthStatus]["environment"] = envToolTipTexts;
                    }
                });
            }
            if(name[i].includes(healthTestData.provider)) {
                var providerBreakdownXpath = self.healthBreakdownSectionsXpath.format('provider');
                await element.all(by.xpath(providerBreakdownXpath)).isPresent().then(async function(status) {
                    if(status == true) {
                        var providerToolTipTexts = await self.getBreakdownToolTipDetails(providerBreakdownXpath);
                        breakdown_object["resourceBreakdown"][selectedHealthStatus]["provider"] = providerToolTipTexts;
                    }
                });
            }
            if(name[i].includes(healthTestData.team)) {
                var teamBreakdownXpath = self.healthBreakdownSectionsXpath.format('team');
                await element.all(by.xpath(teamBreakdownXpath)).isPresent().then(async function(status) {
                    if(status == true) {
                        var teamToolTipTexts = await self.getBreakdownToolTipDetails(teamBreakdownXpath);
                        breakdown_object["resourceBreakdown"][selectedHealthStatus]["team"] = teamToolTipTexts;
                    }
                });
            }
            if(name[i].includes(healthTestData.category)) {
                var categoryBreakdownXpath = self.healthBreakdownSectionsXpath.format('category');
                await element.all(by.xpath(categoryBreakdownXpath)).isPresent().then(async function(status) {
                    if(status == true) {
                        var categoryToolTipTexts = await self.getBreakdownToolTipDetails(categoryBreakdownXpath);
                        breakdown_object["resourceBreakdown"][selectedHealthStatus]["category"] = categoryToolTipTexts;
                    }
                });
            }
        }
        result = breakdown_object["resourceBreakdown"];
        logger.info("BreakDown details from UI based on Health Status selection:",result);
        return result;
    });
}

health.prototype.clickOnFilterBy =async function(){
	var self = this;
	util.waitForAngular();

	browser.wait(EC.elementToBeClickable(element.all(by.css(self.tableFilterPlaceholder)).get(0)), timeout.timeoutInMilis);
	await element.all(by.css(self.tableFilterPlaceholder)).get(0).click().then(async function(){
		logger.info("clicked on filterBy dropdown box")
	})
}


health.prototype.selectFilterBy =async function(){
	var self = this;
	util.waitForAngular();
		await self.clickOnFilterBy()
		browser.wait(EC.visibilityOf(element.all(by.xpath(self.filterByXpath)).get(0)), timeout.timeoutInMilis);
		await element.all(by.xpath(self.filterByXpath)).count().then(async function(values){
			for (var i = 0; i < values; i++) {
				await element.all(by.xpath(self.filterByXpath)).get(i).getText().then(async function(numberOfDaysText){
					await element.all(by.xpath(self.filterByXpath)).get(i).click().then(function(){
						logger.info('clicked on ' + numbeOfDaysXpath)
					})
				})
					await self.clickOnFilterBy()
			}
		})
}


/*
 * Method to get Breakdown tooltip details
*/
health.prototype.getBreakdownToolTipDetails = async function(healthBreakdownSections) {
    var self = this;
    util.waitOnlyForInvisibilityOfCarbonDataLoader();
    var toolTipContent = {};
    var elementList = element.all(by.xpath(healthBreakdownSections));
    return await elementList.count().then(async function(count) {
        if (count > 15) {
            count = 15;
        }
        for (var i = 0; i < count; i++) {
            browser.wait(EC.visibilityOf(elementList.get(i)), timeout.timeoutInMilis);
            await browser.actions().mouseMove(elementList.get(i)).perform().then(async function () {
                await browser.wait(EC.presenceOf(element(by.css(self.stackBarToolTipcss))), timeout.timeoutInMilis);
                await browser.wait(EC.visibilityOf(element(by.css(self.stackBarToolTipcss))), timeout.timeoutInMilis);
                await element(by.css(self.stackBarToolTipcss)).getText().then(async function (toolTipText) {
                    var splitToolTipText = toolTipText.split('\n');
                    var text = splitToolTipText[0].toString().replace(/\s/g, '');
                    var count = splitToolTipText[1].replace(/[^0-9.]/g, '');
                    toolTipContent[text] =  parseInt(count);
                });
            });
        }
        return toolTipContent;
    });
}
/**
 * Click on app/resource breakdown widget filter
 */
 health.prototype.clickOnAppResBreakdownBasedOnStackBarIndex = async function(stackBarOption, index){
	var self = this;
	util.waitOnlyForInvisibilityOfCarbonDataLoader();
    var selectedOptionDetails = 0;
    var breakdownOption = stackBarOption.toLowerCase();
    await browser.wait(EC.visibilityOf(element.all(by.css(self.breakdownFooterSectionsTextCss)).get(0)), timeout.timeoutInMilis);
    return await element.all(by.css(self.breakdownFooterSectionsTextCss)).getText().then(async function(breakdownFooterName) {
        logger.info("breakdown widget x-axis names:", breakdownFooterName);
        for(var i=0; i< breakdownFooterName.length; i++) {
            if(breakdownFooterName[i].includes(stackBarOption)) {
                var breakdownXpath = self.healthBreakdownSectionsXpath.format(breakdownOption);
                await element.all(by.xpath(breakdownXpath)).isPresent().then(async function(status) {
                    if(status == true) {
                        var count = await element.all(by.xpath(breakdownXpath)).count();
                        if(count > 1 && (count-1 < index)) {
                            index = parseInt(count/2);
                        }
                        else if(count == 1) {
                            index = count - 1;
                        }
                        var selectedIndex = index;
                        var result = await self.getBreakdownToolTipDetails(breakdownXpath);
                        if(count > 1) {
                            await element.all(by.xpath(breakdownXpath)).get(selectedIndex).click();
                        } else {
                            await element(by.xpath(breakdownXpath)).click();
                        }
                        util.waitForAngular();
                        var toolTipTexts = Object.entries(result);
                        logger.info("BreakDown selected option tool tip details:", toolTipTexts);
                        selectedOptionDetails = toolTipTexts[selectedIndex];
                        logger.info("Clicked on",selectedIndex,"index option in",stackBarOption,"stackbar of breakdown widget");
                        util.waitForAngular();
                    }
                    else {
                        logger.info("No option is available in",breakdownOption,"stackbar to select in breakdown widget.");
                        var searchResult = await self.checkListViewSpecificColumnRecordsBasedOnName('NotApplicable', healthTestData.team);
                        var values = Object.values(searchResult);
                        selectedOptionDetails = values;
                    }
                });
            }
        }
        util.waitOnlyForInvisibilityOfCarbonDataLoader();
        logger.info("BreakDown selected option tool tip details:", selectedOptionDetails);
        return selectedOptionDetails;
    });
}

/**
 * Method to get search '0 results found' label text
 */
 health.prototype.getSearchNoResultLabelText = async function () {
	util.waitForAngular();
	var self = this;
	var result = true;
	return element(by.xpath(self.morePopupAppLabelXpath)).isDisplayed().then(async function (status) {
		if(status == true) {
			util.waitOnlyForInvisibilityOfCarbonDataLoader();
			element(by.xpath(self.morePopupAppLabelXpath)).getText().then(async function (noResultFoundLabel) {
			    logger.info("0 result found Label: " + noResultFoundLabel);
			});
		}
		else {
		    logger.info(" More Popup link is available.");
		}
	    return result;
	});
}

/*
 * Method to get Applications / Resources section Label total count from Health and Command Center Page
*/
health.prototype.getApplicationsResourcesSectionLabelCountFromHealthAndCommandCenter = async function(selectedTab) {
    util.waitOnlyForInvisibilityOfCarbonDataLoader();
    var self = this;
    var appResCountCss, lastBreadcrumbText, totalCount = 0;

    await element(by.css(self.currentPageBreadcrumbName)).getText().then(function(text) {
        lastBreadcrumbText = text;
    });
    var status = await util.isSelectedTabButton(selectedTab);
    // Health Page Applications and Resources Tab
    if (lastBreadcrumbText === healthTestData.headerTitle) {
        if (status == true) {
            if (selectedTab === healthTestData.resourcesButtonName) {
                browser.wait(EC.visibilityOf(element(by.css(self.resourceListSectionLabelCss))), timeout.timeoutInMilis);
                appResCountCss = element(by.css(self.resourceListSectionLabelCss));
            }
            else {
                browser.wait(EC.visibilityOf(element(by.css(self.applicationsSectionLabelCss))), timeout.timeoutInMilis);
                appResCountCss = element(by.css(self.applicationsSectionLabelCss));
            }
        }
    }
	
    // Command center Applications and Resources Tab
    else {
        if ((lastBreadcrumbText === healthTestData.commandCenterLabel) &&
            (selectedTab === healthTestData.applicationsButtonName || selectedTab === healthTestData.resourcesButtonName)) {
            browser.wait(EC.presenceOf(element(by.css(this.commandCenterApplicationsResourcesCountCss))), timeout.timeoutInMilis);
            appResCountCss = element(by.css(self.commandCenterApplicationsResourcesCountCss));
        }
    }
    return await appResCountCss.getText().then(function(labelText) {
        logger.info("labelText :" , labelText);
        var header = labelText.replace(/\s+/g, ' ').trim();
    	var count = header.split("(")[1].split(")")[0];
    	logger.info(selectedTab + " count from label: " + count);
    	totalCount = parseInt(count);
    	return totalCount;
    });
}

/**
 * Get App name from app details page header
 */
health.prototype.getAppNameFromAppDetailsPageHeaderText = async function(){
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.associatedResourcesTableLabelCss))), timeout.timeoutInMilis);
	return await element(by.css(this.appDetailsPageHeaderNameCss)).getText().then(async function (appName) {
		logger.info("App name text from App details page header: " + appName);
		return appName.trim();
	});
}

/**
 * Click on navigation button links from top-left corner
 * Ex. btnName - Health, {Application Name}, {Resource Name}, etc
 */
health.prototype.clickOnNavigationButtonLinks = function(btnName){
	util.waitForAngular();
	var i;
	var self = this;
	browser.wait(EC.visibilityOf(element.all(by.css(this.navigationButtonLinksCss)).get(0)), timeout.timeoutInMilis);
	return element.all(by.css(this.navigationButtonLinksCss)).getText().then(async function(linkTexts){
		for(i=0; i<linkTexts.length; i++){
			if(linkTexts[i] == btnName){
				return await element.all(by.css(self.navigationButtonLinksCss)).get(i).click().then(function(){
					logger.info("Clicked on button link: "+linkTexts[i]);
					return;
				})
			}
		}
	})
}

/**
 * Get Associated applications table label from resource details page
 */
health.prototype.getAssociatedAppsTableLabelText =async function(index){
	util.waitOnlyForInvisibilityOfCarbonDataLoader();
	var applicationTableNameColumn = this.applicationTableNameColumnCss.format(index)
	browser.wait(EC.visibilityOf(element.all(by.css(applicationTableNameColumn)).get(0)), timeout.timeoutInMilis);
	return await element.all(by.css(applicationTableNameColumn)).getText().then(function (labelText) {
		logger.info("Associated table label: " + labelText)
		return labelText
	});
}

/**
 * Method to verify specific application in associated applications table
 * @param {Application name to be verify in associated applications table} appName
 */
health.prototype.isAppPresentInAssociatedApplicationsTable = async function(appName){
	util.waitForAngular();
	var self = this;
	var loopCount = 0;
	browser.wait(EC.visibilityOf(element.all(by.css(this.associatedApplicationsTableAppNameCss)).get(0)), timeout.timeoutInMilis);
	var loopCount = await this.getPageCountForAppsResourcesTable();
	var i = 0;
	for (i = 0; i < loopCount; i++) {
		var cellValueList = await element.all(by.css(this.associatedApplicationsTableAppNameCss)).getText();
		for(var j=0; j<cellValueList.length; j++){
			var cellValue = await element.all(by.css(this.associatedApplicationsTableAppNameCss)).get(j).getAttribute("data-tablecellvalue");
			logger.info("Cell value: "+cellValue);
			if(cellValue.trim() == appName){
				logger.info(appName+ " found in associated applications table.");
				return true;
			}
			else{
				// Check for last page in pagination
				if ((j == cellValueList.length - 1) && (i != loopCount - 1)) {
					await browser.wait(EC.visibilityOf(element(by.css(self.nextPageButtonCss))), timeout.timeoutInMilis);
					await element(by.css(self.nextPageButtonCss)).click().then(function () {
						logger.info("Clicked on Next button..");
					});
				}
			}
		}
	}
	if(i == loopCount){
		logger.info(appName+" not found in associated applications table.");
		return false;
	}
}

/**
 * Get Associated resources table label from app details page
 */
health.prototype.getAssociatedResourcesTableLabelText = function(){
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.css(this.associatedResourcesTableRowsCss)).get(0)), timeout.timeoutInMilis);
	return element(by.css(this.associatedResourcesTableLabelCss)).getText().then(function (labelText) {
		logger.info("Associated Resources table label from App details page: " + labelText.split("(")[0].trim());
		return labelText.split("(")[0].trim();
	});
}
/**
 * Get Each health Status name and count from Associated resources list tbale from applications details page
 */
 health.prototype.getHealthStatusNameCountFromAscList = async function() {
    util.waitOnlyForInvisibilityOfCarbonDataLoader();
    browser.wait(EC.visibilityOf(element.all(by.css(this.associatedResourcesTableRowsCss)).get(0)), timeout.timeoutInMilis);

 }


/**
 * Get Resource count from Associated resources table label
 */
health.prototype.getResourceCountFromAssociatedResourcesTableLabel = function(){
	util.waitForAngular();
	util.waitOnlyForInvisibilityOfCarbonDataLoader();
	browser.wait(EC.visibilityOf(element.all(by.css(this.associatedResourcesTableRowsCss)).get(0)), timeout.timeoutInMilis);
	return element(by.css(this.associatedResourcesTableLabelCss)).getText().then(function (labelText) {
		var resCount = labelText.trim().split("(")[1].split(")")[0];
		logger.info("Resource count from Associated Resources table label: " + resCount);
		return parseInt(resCount);
	});
}
/**
 * Method to click on first page from pagination section for associated resources table
 */
health.prototype.clickOnFirstPageForAssociatedResourcesTable = async function(){
	util.waitForAngular();
	var loopCount = await this.getPageCountForAppsResourcesTable();
	if(loopCount == 1){
		logger.info("Only one page is present, no need to click on first page.");
	}
	else{
		browser.wait(EC.visibilityOf(element(by.xpath(this.associatedResourcesTableFirstPageXpath))), timeout.timeoutInMilis);
		element(by.xpath(this.associatedResourcesTableFirstPageXpath)).click().then(function(){
			logger.info("Clicked on first page of associated resources table.");
		});
	}
}

/**
 * Get page count for the tables [Associated Applications/Resources, Applications table]
 */
health.prototype.getPageCountForAppsResourcesTable = function(){
	var self = this;
	var loopCount = 0;
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.paginationDetailsTextCss))), timeout.timeoutInMilis);
	return element(by.css(self.paginationDetailsTextCss)).getText().then(function(paginationInfo){
		var sepInfo = paginationInfo.trim().split(" ");
		var pageSize = 10;
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
}
/**
 * Get Associated resources column presence
 */
health.prototype.getAssociatedColumnPresence = async function() {
	util.waitForAngular();
	var ascColumns=[];
	var tableColumns=await healthAndInventoryUtil.retrieveTableColumns();
	var tColumns=tableColumns.split("\n");
	for(var i=0;i<tColumns.length;i++)
    {
        tColumns[i] = tColumns[i].replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    }
    var associatedColumns=dashboardTestData.associatedTableColumns;
    logger.info("Associated table columns",tColumns);
    logger.info("associatedColumns from test data:",associatedColumns);
    if(JSON.stringify(associatedColumns)==JSON.stringify(tColumns))
    {
        return true;
    }
    else
    {
      return false;
    }
}
/**
 * Get Row count from Associated resources/applications table
 */
health.prototype.getRowCountFromAssociatedResourcesAppsTable = async function(){
	var rowCount = 0;
	var self = this;
	util.waitForAngular();
	return element.all(by.css(this.noDataTextCss)).count().then(async function(count){
		if(count != 0){
			return element(by.css(self.noDataTextCss)).getText().then(function(noDataText){
				logger.info("No data is available in associated resources/applications table, Text is : "+noDataText);
				return 0;
			});
		}
		else{
			var loopCount = await self.getPageCountForAppsResourcesTable();
			for (var i = 0; i < loopCount; i++) {
				await browser.wait(EC.visibilityOf(element.all(by.css(self.associatedResourcesTableRowsCss)).get(0)), timeout.timeoutInMilis);
				util.waitOnlyForInvisibilityOfCarbonDataLoader()
				rowCount = rowCount + await element.all(by.css(self.associatedResourcesTableRowsCss)).count();
				logger.info("Navigated on page --> " +(i+1));
				if (i != loopCount - 1) {
					await browser.wait(EC.visibilityOf(element(by.css(self.nextPageButtonCss))), timeout.timeoutInMilis);
					await element(by.css(self.nextPageButtonCss)).click().then(function(){
						logger.info("Clicked on Next button..");

					});
					await browser.wait(EC.visibilityOf(element.all(by.css(self.associatedResourcesTableRowsCss)).get(0)), timeout.timeoutInMilis);
				}
				else {
					logger.info("Reached on last page..");
					logger.info("Total row count from Associated resources/applications table: " + rowCount);
					return rowCount;
				}
			}
		}
	});
}

/**
 * Get Resource name from resource details page
 * Ex. labelName - HostName from overview panel
 */
health.prototype.getNameFromAppResourceDetailsPage = async function(){
	util.waitForAngular();
	var self = this;
	var detailPageName = "";
	return await element(by.css(self.resourceDetailsOverviewLabelValuesCss)).isPresent().then(async function(status){
	    if(status == true) {
    	    detailPageName = await element(by.css(self.resourceDetailsOverviewLabelValuesCss)).getText();
    	    if(detailPageName == 'Health') {
    	        detailPageName = "";
    	    }
        	logger.info("Resource name text from Resource details page: " + detailPageName);
    	}
    	return detailPageName;
	});
}

/**
  * Get Resource name from resource details page
  * Ex. labelName - HostName from overview panel
  */
 health.prototype.getOverviewLabelFromResourceDetailsPage = async function(){
    var self = this;
	util.waitOnlyForInvisibilityOfCarbonDataLoader();
	var resourceOverviewSubSectionDetails = {};
	browser.wait(EC.visibilityOf(element.all(by.css(self.overviewLabelCss)).get(0)), timeout.timeoutInMilis);
	await element.all(by.css(self.overviewLabelCss)).getText().then(async function (resourceOverviewSubSectionTitles) {
        await element.all(by.css(self.resourceOverviewSubSectionValueCss)).getText().then(async function(resourceOverviewSubSectionValue) {
            for(var i = 0; i < resourceOverviewSubSectionTitles.length; i++){
                resourceOverviewSubSectionDetails[resourceOverviewSubSectionTitles[i]] = resourceOverviewSubSectionValue[i];
            }
        });
    });
	logger.info("Resource details page Overview details: ", resourceOverviewSubSectionDetails);
	return resourceOverviewSubSectionDetails;
}

/**
  * Get Resource name from resource details page
  * Ex. labelName - HostName from overview panel
  */
 health.prototype.getMappedAppLabelFromResourceDetailsPage = function(){
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.xpath(this.mappedApplicationXpath))), timeout.timeoutInMilis);
	return element(by.xpath(this.mappedApplicationXpath)).getText().then(function (resName) {
		logger.info("Resource name text from Resource details page: " + resName.trim().toLowerCase());
		return resName.trim().toLowerCase();
	});
}

/**
 * Method to click on Application view details button
 * Ex. appName - Application name get from dashboard alert card
 */
health.prototype.clickOnApplicationViewDetailsButton = async function(appName){
	util.waitForAngular();
	var self = this;
	var loopCount = 0;
	var isPresent = false;
	var donutChartCount = await self.getSelectedTypeCountFromDonutChart();
	if(donutChartCount > 0){
		var loopCount = await self.getPageCountForAppsResourcesTable();
		for(var i=0; i<loopCount; i++){
		    var appTableNamesCss = self.applicationTableNameColumnCss.format(healthTestData.oneIndex);
			await browser.wait(EC.visibilityOf(element.all(by.css(appTableNamesCss)).get(0)), timeout.timeoutInMilis);
			var appNames = await element.all(by.css(appTableNamesCss)).getAttribute("title");
			for(var j=0; j<appNames.length; j++){
				if(appNames[j].includes(appName)){
				    await browser.wait(EC.visibilityOf(element.all(by.css(self.applicationTableOptionButtonCss)).get(j)), timeout.timeoutInMilis);
					await util.scrollToWebElement(element.all(by.css(self.applicationTableOptionButtonCss)).get(j));
					await element.all(by.css(self.applicationTableOptionButtonCss)).get(j).click();
					await browser.wait(EC.visibilityOf(element(by.css(self.applicationViewDetailsButtonCss))), timeout.timeoutInMilis);
					await element(by.css(self.applicationViewDetailsButtonCss)).click().then(function(){
						logger.info("Clicked on View details button of : "+appNames[j]);
						isPresent = true;
					})
					return isPresent;
				}
			}
			if(isPresent == false){
				if(i != loopCount-1){
					await element(by.css(self.nextPageButtonCss)).click().then(function(){
						logger.info("Clicked on Next button..");
					})
				}
				else{
					logger.info(appName+" is not present in table..");
					return isPresent;
				}
			}
		}
	}
	else{
		logger.info("There are no applications available..");
		return isPresent;
	}
}

/**
 * Method to click on First affected Resource view details button and returns Resource name
 * Ex. alertType - Critical, Warning
 */
health.prototype.clickOnFirstAffectedResourceViewDetailsButton = async function () {
	util.waitForAngular();
	var self = this;
	var resourceName = "";
	var rescCount = await element.all(by.css(self.nameLinkCss)).count();
	if(rescCount > 0) {
	    resourceName = await element.all(by.css(self.nameLinkCss)).get(0).getText();
        logger.info("Resource Name: "+resourceName.toLowerCase());
        await element.all(by.css(self.nameLinkCss)).get(0).click().then(async function () {
            logger.info("Clicked on first resource name is "+resourceName.trim());
        	resourceName = resourceName.trim();
        });
	}
    else {
    	logger.info("No resource found.");
    }
    return resourceName;
}

/**
 * Method to verify Tickets/Performance/Tags Links are displayed or not
 * Ex. sectionLabelText - Tickets, Performance, Tags, etc.
 */
health.prototype.isDisplayedResourceDetailsTableSectionLinks = function(sectionLabelText){
	util.waitForAngular();
	var i = 0;
	browser.wait(EC.visibilityOf(element.all(by.css(this.tableSectionsLinksCss)).get(0)), timeout.timeoutInMilis);
	return element.all(by.css(this.tableSectionsLinksCss)).getText().then(function(labels) {
		for (i = 0; i < labels.length; i++) {
			if (labels[i].includes(sectionLabelText)) {
				logger.info("Resource details table Section Label " + labels[i] + " is displayed.");
				return true;
			}
		}
		if (i == labels.length) {
			logger.info("Resource details table Label " + sectionLabelText + " not found.");
			return false;
		}
	});
}

health.prototype.clickOnResourceDetailsTableSectionLink = function(sectionName){
	util.waitOnlyForInvisibilityOfCarbonDataLoader();
	var self = this;
	var i = 0;
	browser.wait(EC.visibilityOf(element.all(by.css(this.tableSectionsLinksCss)).get(0)), timeout.timeoutInMilis);
	return element.all(by.css(this.tableSectionsLinksCss)).getText().then(async function(labels) {
		for (i = 0; i < labels.length; i++) {
			if (labels[i].includes(sectionName)) {
				await element.all(by.css(self.tableSectionsLinksCss)).get(i).click();
				logger.info("Resource details table Label " + labels[i] + " is clicked.");
				return;
			}
		}
		if (i == labels.length) {
			logger.info("Resource details table Label " + sectionName + " not found.");
		}
	});
}

/**
 * Method to verify Summary/Open Tickets Links are displayed or not
 * Ex. sectionLabelText - Summary, Open Tickets
 */
health.prototype.isDisplayedSummaryAndOpenTicketsSectionLinks =async function(sectionLabelText){
	util.waitForAngular();
	var i=0;
	var self = this;
	logger.info("inside the function");
	browser.wait(EC.visibilityOf(element(by.xpath(this.ticketlinkXpath))), timeout.timeoutInMilis);
	return element.all(by.xpath(this.ticketlinkXpath)).getText().then(async function(labels) {
		logger.info("inside the function locator");
		if ( labels.length>0) {
			if (labels[i].includes(sectionLabelText)) {
				logger.info("Section Label " + labels[i] + " is displayed.");
				element.all(by.xpath(self.ticketlinkXpath)).get(0).click();
				util.waitOnlyForInvisibilityOfCarbonDataLoader();
				var ticketType=await element.all(by.xpath(self.ticketTypeXpath)).get(0).getText();
				return ticketType;
			}
		}
		if (labels.length==0) {
			logger.info("Section Label " + sectionLabelText + " not found.");
			return false;
		}
	});
}

/**
 * Method to verify Summary/Open Tickets Links are displayed or not
 * Ex. sectionLabelText - Summary, Open Tickets
 */
 health.prototype.toClickOnTicketsLinks = function(ticketsLinksText){
	util.waitForAngular();
	var i;
	browser.wait(EC.visibilityOf(element(by.css(this.summaryWidgetHeaderCss))), timeout.timeoutInMilis);
	return element.all(by.css(this.summaryOpenTicketsSectionLinksCss)).getText().then(function(labels) {
		for (i = 0; i < labels.length; i++) {
			if (labels[i].includes(ticketsLinksText)) {
				logger.info("Section Label " + labels[i] + " is displayed.");
				return true;
			}
		}
		if (i == labels.length) {
			logger.info("Section Label " + sectionLabelText + " not found.");
			return false;
		}
	});
}


/**
 * Method to get affected server count from Application resources table
 * Ex. alertType - Critical, Warning
 */
health.prototype.getAffectedServerCountFromAssociatedResourcesTable = async function(alertType){
	util.waitForAngular();
	var self = this;
	var serverCount = 0;
	var loopCount = 0;
	var resHealthValueXpath = this.resourceHealthValueXpath.format(alertType);
	var loopCount = await this.getPageCountForAppsResourcesTable();
    for(var i=0; i<loopCount; i++){
		await browser.wait(EC.visibilityOf(element(by.css(self.paginationDetailsTextCss))), timeout.timeoutInMilis);
		serverCount = serverCount + await element.all(by.xpath(resHealthValueXpath)).count();
		if(i != loopCount-1){
			await browser.wait(EC.visibilityOf(element(by.css(self.nextPageButtonCss))), timeout.timeoutInMilis);
			await element(by.css(self.nextPageButtonCss)).click().then(function(){
				logger.info("Clicked on Next button..");
			});
			await browser.wait(EC.visibilityOf(element.all(by.css(self.associatedResourcesTableRowsCss)).get(0)), timeout.timeoutInMilis);
		}
		else{
			logger.info("Reached on last page..");
			logger.info("Total affected server count: "+serverCount);
			return serverCount;
		}
	}
}

/**
 * Get page count for the tables [Alerts Events/Tickets table]
 */
health.prototype.getPageCountForEventsTicketsTable = function(){
	var self = this;
	var loopCount = 0;
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.alertsTablePaginationDetailsTextCss))), timeout.timeoutInMilis);
	return element(by.css(this.alertsTablePageSizeCss)).getText().then(function(itemsPerPage){
		return element(by.css(self.alertsTablePaginationDetailsTextCss)).getText().then(function(paginationInfo){
			var sepInfo = paginationInfo.trim().split(" ");
			var pageSize = parseInt(itemsPerPage);
			var totalEntries = parseInt(sepInfo[4]);
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
 * Method to verify Cell value from Resource details Table[Tickets]
 * Ex. columnName - Event health
 * Ex. cellValue - Critical, Warning, etc
 */
health.prototype.verifyCellValueFromTicketsTable = function(columnName, cellValue){
	util.waitForAngular();
	util.waitOnlyForInvisibilityOfCarbonDataLoader();
	var self = this;
	var columnIndex, cellValueXpath;
	return element.all(by.css(this.alertsTableNoDataTextCss)).count().then(async function(count){
		if(count > 0){
			return element(by.css(self.alertsTableNoDataTextCss)).getText().then(function(noDataText){
				logger.info("No data is available in alerts table, Text is : "+noDataText);
				return false;
			});
		}
		var loopCount = await self.getPageCountForAppsResourcesTable();
		var totalRowCount = 0;
		for(var k=0; k<loopCount; k++){
			browser.wait(EC.visibilityOf(element.all(by.css(self.associatedResourcesTableRowsCss)).get(0)), timeout.timeoutInMilis);
			var rowCount = await element.all(by.css(self.associatedResourcesTableRowsCss)).count();
			totalRowCount = totalRowCount + rowCount;
			for(var i=1; i<=rowCount; i++){
				var columnNames = await element.all(by.css(self.alertsTableColumnNamesCss)).getText();
				for(var j=0; j<columnNames.length; j++){
					if(columnNames[j].includes(columnName)){
						columnIndex = j+1;
						cellValueXpath = self.alertsTableColumnDataXpath.format(i,columnIndex);
						var columnValue = await element(by.xpath(cellValueXpath)).getText();
						if(columnValue.includes(cellValue)){
							logger.info("Row number: "+i+", Cell value: "+columnValue);
						}
					}
				}
				return true;
			}
			// Check for last page in pagination
			if(k != loopCount-1){
				await element(by.css(self.nextPageButtonCss)).click().then(function(){
					logger.info("Clicked on Next button..");
				})
			}
			else{
				logger.info("On Last page, no need to click on Next button..");
				if(totalRowCount == 50){
					logger.info("There can be maximum 50 entries. Not found "+cellValue);
					return true;
				}
				else{
					return false;
				}
			}
		}
	});
}

/*
 * Verify either Command Center button is displaying on Health page or not
*/
health.prototype.isCommandCenterButtonDisplayedOnHealthPage = function() {
    util.waitOnlyForInvisibilityOfCarbonDataLoader();
    browser.wait(EC.visibilityOf(element(by.css(this.commandCenterCss))), timeout.timeoutInMilis);
    return element(by.css(this.commandCenterCss)).isDisplayed().then(function (result) {
    	if (result == true) {
    		logger.info("Command Center button is Present on Health Page.");
    	}
    	else {
    		logger.info("Command Center button is not Present on Health Page.");
    	}
   		return result;
    });
}

/**
 * Method to click on Command center
 */
 health.prototype.clickonCommandCenter =async function () {
    var self = this;
    util.waitForAngular();
    browser.wait(EC.visibilityOf(element(by.css(self.commandCenterCss))), timeout.timeoutInMilis);
    await element(by.css(self.commandCenterCss)).click().then(async function () {
        logger.info("Clicked on Command center button")
    });
}

/*
 * Method to clear default selected value in filter by health dropdown in Command Center
*/
health.prototype.clearDefaultSelectedInFilterByHealthDropDownOnCommandCenter = async function() {
    util.waitForAngular();
    browser.wait(EC.visibilityOf(element(by.css(this.commandCenterClearFilterHealthSelectionCss))), timeout.timeoutInMilis);
    await element(by.css(this.commandCenterClearFilterHealthSelectionCss)).click().then(async function() {
        logger.info("Cleared default selected filter by health item");
    });
    await element(by.css(this.commandCenterCLoseFilterHealthDropDownCss)).click().then(async function() {
        logger.info("Closed filter by health dropdown");
    });
}

/*
 * Method to get Command Center Applications/ Resources Name and Count
*/
health.prototype.getCommandCenterApplicationsResourcesNameAndCount = async function() {
    util.waitForAngular();
    var self = this;
    var titleCount, titleText;
    var titleTextWithIndexValue = {};
    browser.wait(EC.visibilityOf(element.all(by.css(self.commandCenterApplicationsResourcesTitleCss)).get(0)), timeout.timeoutInMilis);
    await element.all(by.css(self.commandCenterApplicationsResourcesTitleCss)).getText().then(async function(text) {
        titleCount = text.length;
        titleText = text;
        for(var i=0; i<titleCount;i++){
            titleTextWithIndexValue[text[i]] = i;
        }
    });
    return {titleCount, titleText, titleTextWithIndexValue};
}

/*
 * Method to get health status (critical, warning and healthy) total count on Applications / Resources tab in Command center
*/
health.prototype.getCommandCenterHealthStatusCount = async function() {
    util.waitForAngular();
    var self = this;
    var statusCount = 0, obj = {};
    var data = await this.getCommandCenterApplicationsResourcesNameAndCount();
    var index = data.titleCount;
    var titleName = data.titleText;
    if (index > 0) {
        for(var j=0; j<index; j++) {
            browser.wait(EC.visibilityOf(element.all(by.xpath(self.commandCenterHealthStatusNumbersXpath.format(j+1))).get(0)), timeout.timeoutInMilis);
            await element.all(by.xpath(self.commandCenterHealthStatusNumbersXpath.format(j+1))).getText().then(async function(count) {
                for(var i=0; i<count.length;i++) {
                    statusCount = statusCount + parseInt(count[i]);
                }
                obj[titleName[j]] = statusCount;
            });
            statusCount=0;
        }
    }
    logger.info("Records list : ", obj);
    return obj;
}

/*
 * Get total count from each section of Applications and health in command center
*/
health.prototype.getTotalCountFromEachAppResourcesSectionInCommandCenter = async function(index) {
        util.waitForAngular();
        var self = this;
        var recordsCount;
        browser.wait(EC.visibilityOf(element.all(by.xpath(self.commandCenterApplicationsResourcesXpath.format(index))).get(0)), timeout.timeoutInMilis);
        return await element.all(by.xpath(self.commandCenterApplicationsResourcesXpath.format(index))).count().then(async function(count) {
                recordsCount = count;
           return recordsCount;
        });
}

/*
 * Method to get total count of Show all button displaying in Command center Applications/ Resources tab
*/
health.prototype.getShowAllButtonCountInCommandCenter = async function() {
     util.waitForAngular();
     var self = this;
     var showAllLinksCount = await element.all(by.xpath(self.commandCenterShowAllButtonXpath)).count();
     return showAllLinksCount;
}

/*
 * Method to check either Show all button is displayed or not
*/
health.prototype.isShowAllButtonDisplayedInCommandCenter = async function() {
    util.waitForAngular();
    var self = this;
    var buttonName;
    return await element.all(by.xpath(self.commandCenterShowAllButtonXpath)).get(0).isPresent().then(async function (result) {
        if(result) {
            buttonName = await element.all(by.xpath(self.commandCenterShowAllButtonXpath)).get(0).getText();
            logger.info(buttonName,"button is displayed");
            return buttonName;
        } else {
            return result;
        }
    });
}

/*
 *  Method to click on 'Show all' button in Command center Applications/Resources tab
*/
health.prototype.clickOnShowAllButtonInCommandCenter = async function(titleNameAndCount, selectedTab) {
    var self = this;
    var value, value1, index, totalAppRescCount={}, i=0, j=0, k=0, m=0;
    var beforeShowAllClickCount, afterClickButtonName;

    var showAllLinksCount = await self.getShowAllButtonCountInCommandCenter();
    var data = await self.getCommandCenterApplicationsResourcesNameAndCount();
    var titleIndexes = data.titleTextWithIndexValue;

    logger.info("Show All buttons display Count in",selectedTab,"tab:", showAllLinksCount);
    var size = Object.keys(titleNameAndCount).length;
    for(var key of Object.keys(titleNameAndCount)) {
        value = titleNameAndCount[key];
        if(showAllLinksCount > 0) {
            for(;i<size;) {
                if(value > healthTestData.hundredRecords) {
                    for(var key1 of Object.keys(titleIndexes)) {
                        value1 = titleIndexes[key1];
                        if(key===key1) {
                            index = value1;
                            break;
                        }
                    }
                    k= index+1;
                      // Get records count before click on Show all button
                      beforeShowAllClickCount = await this.getTotalCountFromEachAppResourcesSectionInCommandCenter(k);
                      logger.info(selectedTab,"count before click on Show all button in'",key,"':", beforeShowAllClickCount);
                      // Click on 'Show all' button
                      browser.wait(EC.visibilityOf(element.all(by.xpath(self.commandCenterShowAllButtonXpath)).get(0)), timeout.timeoutInMilis);
                      await element.all(by.xpath(self.commandCenterShowAllButtonXpath)).get(0).click();
                      logger.info("Clicked On Show All button in", key,selectedTab,"section");
                      util.waitForAngular();
                      browser.wait(EC.visibilityOf(element.all(by.xpath(self.commandCenterShowLessButtonXpath)).get(m)), timeout.timeoutInMilis);
                      afterClickButtonName = await element.all(by.xpath(self.commandCenterShowLessButtonXpath)).get(m).getText();
                      // Get records count after click on Show all button
                      totalAppRescCount[key] = await this.getTotalCountFromEachAppResourcesSectionInCommandCenter(k);
                    m= m+1;
                }
                break;
              }
            i= i+1;
        } else {
            if(value < healthTestData.hundredRecords) {
                logger.info("No Show All button is found in",selectedTab,"section");
                totalAppRescCount[key] = await this.getTotalCountFromEachAppResourcesSectionInCommandCenter(j+1);
                j=j+1;
            }
        }
    }
    logger.info("Button Name after click on Show all : ", afterClickButtonName);
    logger.info("Total",selectedTab, "name and count having more than 100 records :",totalAppRescCount);
    return {totalAppRescCount, beforeShowAllClickCount, afterClickButtonName};
}

/*
 * Method to get total count of 'Show less' button
*/
health.prototype.getShowLessButtonCountInCommandCenter = async function() {
     util.waitForAngular();
     var self = this;
     var showLessLinksCount = await element.all(by.xpath(self.commandCenterShowLessButtonXpath)).count();
     return showLessLinksCount;
}

/*
 * Method to check 'Show less' button is displaying or not in command center
*/
health.prototype.isShowLessButtonDisplayedInCommandCenter = async function() {
    util.waitForAngular();
    var self = this;
    var buttonName;
    return await element.all(by.xpath(self.commandCenterShowLessButtonXpath)).get(0).isPresent().then(async function (result) {
        if(result) {
            buttonName = await element.all(by.xpath(self.commandCenterShowLessButtonXpath)).get(0).getText();
            logger.info(buttonName,"button is displayed");
            return buttonName;
        } else {
            return result;
        }
    });
}

/*
 * Method to click on show less button and return records count
 */
health.prototype.clickOnShowLessButtonInCommandCenter = async function(titleNameAndCount) {
    util.waitForAngular();
    var self = this;
    var recordsCount, i=0, k=0, index=0, value, value1;

    var data = await self.getCommandCenterApplicationsResourcesNameAndCount();
    var titleIndexes = data.titleTextWithIndexValue;

    var showLessLinksCount = await this.getShowLessButtonCountInCommandCenter();
    logger.info("Show less buttons display Count:", showLessLinksCount);
    var size = Object.keys(titleNameAndCount).length;
    for(var key of Object.keys(titleNameAndCount)) {
        value = titleNameAndCount[key];
        if(showLessLinksCount > 0) {
            for(;i<size;) {
                if(value > healthTestData.hundredRecords) {
                    for(var key1 of Object.keys(titleIndexes)) {
                         value1 = titleIndexes[key1];
                         if(key===key1) {
                            k = value1;
                            break;
                         }
                    }
                    index= k+1;
                    logger.info("index value :", index);
                            browser.wait(EC.visibilityOf(element.all(by.xpath(self.commandCenterShowLessButtonXpath)).get(0)), timeout.timeoutInMilis);
                            await element.all(by.xpath(self.commandCenterShowLessButtonXpath)).get(0).click();
                            logger.info("Clicked On Show less button");
                            util.waitOnlyForInvisibilityOfCarbonDataLoader()
                            recordsCount = await this.getTotalCountFromEachAppResourcesSectionInCommandCenter(index);
                }
                break;
            }
            i = i+1;
        }
    }
    logger.info("records Count after click on Show less button: ", recordsCount);
    return recordsCount;
}

/**
 * Method to get Breadcrumb text for current page name
 */
health.prototype.getCurrentPageBreadcrumbNameText = function(){
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.currentPageBreadcrumbName))), timeout.timeoutInMilis);
	return element(by.css(this.currentPageBreadcrumbName)).getText(function(label){
		logger.info("Current page breadcrumb name text is : "+label.trim());
		return label.trim();
	});
}

/**
 * Method to get applications/resources count from Breakdown section using filter
 * filtername --> IBM DC, Aws, Prod, Dev, etc.
 */
health.prototype.getAppResCountFromBreakdownSection = function(filterName){
	util.waitForAngular();
	var self = this;
	browser.wait(EC.visibilityOf(element.all(by.xpath(this.appResHealthBreakdownSectionsXpath)).get(0)), timeout.timeoutInMilis);
	return element.all(by.xpath(this.appResHealthBreakdownSectionsXpath)).count().then(async function(sectionsList){
		var i = 0;
		filterName = await util.removeInvertedCommasFromString(filterName);
		for(i=0; i<sectionsList; i++){
			await browser.actions().mouseMove(element.all(by.xpath(self.appResHealthBreakdownSectionsXpath)).get(i)).perform();
			var infoList = await element.all(by.xpath(self.appResHealthBreakdownSectionTooltipXpath)).getText();
			if(infoList[0].trim() == filterName){
				logger.info("App/Res count for "+infoList[0]+" is: "+infoList[2]);
				return util.stringToInteger(infoList[2]);
			}
		}
		if(i == sectionsList){
			logger.info("Section with filter name "+filterName+" not found");
			return 0;
		}
	})
}

/**
 * Method to get the DC and Cloud provider lists from filters panel
 */
health.prototype.getDCAndCloudProvidersListFromFilters = function(){
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.css(this.providersListCss)).get(0)), timeout.timeoutInMilis);
	return element.all(by.css(this.providersListCss)).getText().then(function(providersList){
		var filteredList = providersList.filter(function(ele){
			return (ele != "DataCenter" & ele != "Cloud");
		});
		logger.info("Providers list: "+ filteredList);
		return filteredList;
	})
}

/**
 * Method to get list for all Apps/Resources count with respect to Breakdown Filters
 */
health.prototype.getListOfBreakdownSectionWithCount = function(){
	util.waitForAngular();
	var self = this;
	var listOfSection = [];
	browser.wait(EC.visibilityOf(element.all(by.xpath(this.appResHealthBreakdownSectionsXpath)).get(0)), timeout.timeoutInMilis);
	return element.all(by.xpath(this.appResHealthBreakdownSectionsXpath)).count().then(async function(sectionsList){
		for(var i=0; i<sectionsList; i++){
			var item = "";
			await browser.actions().mouseMove(element.all(by.xpath(self.appResHealthBreakdownSectionsXpath)).get(i)).perform();
			var infoList = await element.all(by.xpath(self.appResHealthBreakdownSectionTooltipXpath)).getText();
			item = infoList[0].trim() + " ("+ util.addCommasInNumber(infoList[2]) + ")";
			logger.info(item);
			listOfSection.push(item);
		}
		var filteredList = [...new Set(listOfSection)];
		logger.info("List of Sections: ", filteredList);
		return filteredList;
	});
}

/**
 * Method to get list of options from 'filter by category' dropdown
 */
 health.prototype.getCategoryFilterOptionsList = async function(){
	var self = this;
	util.waitOnlyForInvisibilityOfCarbonDataLoader();
	browser.wait(EC.visibilityOf(element.all(by.css(self.filterByCategoryDropdownCss)).get(0)), timeout.timeoutInMilis);
	var defaultSelectedText = await element.all(by.css(self.filterByCategoryDropdownCss)).get(0).getText();
    logger.info("Default selected filter in category filter dropdown:",defaultSelectedText);
    return await element.all(by.css(self.filterByCategoryDropdownCss)).get(0).click().then(function(){
        logger.info("Clicked on app/resource Category filter dropdown button..");
    	return element.all(by.css(self.appResFilterDropdownValCss)).getText().then(function(optionList){
    		        logger.info("List of options from category Filter dropdown: ", optionList);
    		        element.all(by.css(self.filterByCategoryDropdownCss)).get(0).click();
    		        return {defaultSelectedText, optionList};
    	});
    });
}

/**
 * Method to get list of options from 'Filter by Health' dropdown
 */
 health.prototype.getHealthFilterOptionsList = async function(){
    var self = this;
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.xpath(self.healthFilterXpath))), timeout.timeoutInMilis);
	var defaultSelectedText = await element(by.xpath(self.healthFilterXpath)).getText();
	logger.info("Default selected filter in health filter dropdown:",defaultSelectedText);
	return await element(by.xpath(self.healthFilterXpath)).click().then(async function(){
    		logger.info("Clicked on health filter dropdown");
	        return await element.all(by.css(self.appResFilterDropdownValCss)).getText().then(async function(optionList){
		        logger.info("List of options from Health Filter dropdown: ", optionList);
		        await element(by.xpath(self.healthFilterXpath)).click();
		        return {defaultSelectedText, optionList};
		    });
	});
}

/**
 * Method to get Section wise applications/resources count from applications/resources table sub-headers [Section Name adn Alert Type] from command center view
 * sectionName --> Prod, Dev, Aws, IBM DC, etc.
 * alertType --> Critical, Warning, Healthy
 * Returns list of count from both subheaders [Section Name and Alert Type] in apps/resources table
 */
health.prototype.getAppResCountFromCommandCenterTableSubHeaderLabel = async function(sectionName, alertType){
	util.waitForAngular();
	var self = this;
	var alertLabelXpath = self.commandCenterAppResTableSubHeaderAlertNamesXpath.format(alertType);
	var options = [healthTestData.environmentDropdownValue, healthTestData.provider, healthTestData.team];
	var j=0;
	for(j=0; j<options.length; j++){
		this.clickOnViewByDropdown();
		this.selectOptionFromViewByDropdown(options[j]);
		await util.waitOnlyForInvisibilityOfKibanaDataLoader();
		browser.wait(EC.visibilityOf(element.all(by.css(this.commandCenterAppResTableSubHeaderNamesCss)).get(0)), timeout.timeoutInMilis);
		var labelCount = await element.all(by.css(this.commandCenterAppResTableSubHeaderNamesCss)).count();
		var i=0;
		for(i=0; i<labelCount; i++){
			var label = await element.all(by.css(self.commandCenterAppResTableSubHeaderNamesCss)).get(i).getText();
			var alertLabel = await element.all(by.xpath(alertLabelXpath)).get(i).getText();
			logger.info("Comparing "+label+" with "+sectionName);
			if(label.trim() == sectionName){
				var appResCountFromLabel = label.split("(")[1].split(")")[0].trim();
				var appResCountFromAlertLabel = alertLabel.split("(")[1].split(")")[0].trim();
				logger.info("Count for section name "+sectionName+" from table sub-header label is: "+appResCountFromLabel);
				logger.info("Count for section name "+sectionName+" from table sub-header alert label is: "+appResCountFromAlertLabel);
				return [util.stringToInteger(appResCountFromLabel), util.stringToInteger(appResCountFromAlertLabel)];
			}
		}
		if(i == labelCount){
			logger.info("Section name "+sectionName+" not found in "+options[j]+" category");
		}
	}
	if(j == options.length){
		logger.info("Section name "+sectionName+" not found in all categories. Count : 0");
		return [0, 0];
	}
}

/**
 * Method to get count from Tooltip on hovering specific Progress bar
 * alertType --> Critical, Warning, Healthy
 * Return array of strings has Alert type on index '1' and Count of apps/resources on index '3'
 */
health.prototype.getTooltipCountForProgressBarFromCommandCenterView = function(alertType){
	util.waitForAngular();
	var self = this;
	var tooltipInfoList = [];
	browser.wait(EC.visibilityOf(element.all(by.css(this.healthStatusProgressBarsCss)).get(0)), timeout.timeoutInMilis);
	return element.all(by.css(this.healthStatusProgressBarsCss)).count().then(async function(alertsList){
		var i=0;
		for(i=0; i<alertsList; i++){
			await browser.actions().mouseMove(element.all(by.css(self.healthStatusProgressBarsCss)).get(i)).perform();
			tooltipInfoList = await element.all(by.css(self.healthStatusProgressBarsTooltipCss)).getText();
			if(tooltipInfoList[1].includes(alertType)){
				logger.info("Count from progress bar tooltip for "+alertType+": "+tooltipInfoList[3]);
				return util.stringToInteger(tooltipInfoList[3]);
			}
		}
		if(i == alertsList){
			logger.info(alertType+" not found in progress bar.");
			return 0;
		}
	});
}

health.prototype.selectSpecificProgressBar = function(alertType){
	var self = this;
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.css(this.healthStatusProgressBarsCss)).get(0)), timeout.timeoutInMilis);
	return element.all(by.css(this.commandCenterBarChartXaxisLabelsCss)).getText().then(async function(alertsList){
		var i=0;
		for(i=0; i<alertsList.length; i++){
			if(alertsList[i].includes(alertType)){
				var opacity = await element.all(by.css(self.healthStatusProgressBarsCss)).get(i).getCssValue("opacity");
				if(opacity == "1"){
					logger.info(alertType+" is already selected in progress bar.");
					return;
				}
				else{
					logger.info(alertType+" is not selected in progress bar.");
					await self.clickOnAlertProgressBar(alertType);
					return;
				}
			}
		}
		if(i == alertsList.length){
			logger.info(alertType+" not found in progress bar.");
			return false;
		}
	});
}

health.prototype.deselectSpecificProgressBar = function(alertType){
	var self = this;
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.css(this.healthStatusProgressBarsCss)).get(0)), timeout.timeoutInMilis);
	return element.all(by.css(this.commandCenterBarChartXaxisLabelsCss)).getText().then(async function(alertsList){
		var i=0;
		for(i=0; i<alertsList.length; i++){
			if(alertsList[i].includes(alertType)){
				var opacity = await element.all(by.css(self.healthStatusProgressBarsCss)).get(i).getCssValue("opacity");
				if(opacity == "1"){
					logger.info(alertType+" is selected in progress bar.");
					await self.clickOnAlertProgressBar(alertType);
					return;
				}
				else{
					logger.info(alertType+" is not already selected in progress bar.");
					return;
				}
			}
		}
		if(i == alertsList.length){
			logger.info(alertType+" not found in progress bar.");
			return false;
		}
	});
}

/**
 * Method to verify if progress bar for specific alert is selected or not
 * alertType --> Critical, Warning, Healthy
 */
health.prototype.checkSelectionOfAlertsProgressBar = function(alertType){
	var self = this;
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.css(this.healthStatusProgressBarsCss)).get(0)), timeout.timeoutInMilis);
	return element.all(by.css(this.commandCenterBarChartXaxisLabelsCss)).getText().then(async function(alertsList){
		var i=0;
		for(i=0; i<alertsList.length; i++){
			if(alertsList[i].includes(alertType)){
				var opacity = await element.all(by.css(self.healthStatusProgressBarsCss)).get(i).getCssValue("opacity");
				if(opacity == "1"){
					logger.info(alertType+" is selected in progress bar.");
					return true;
				}
				else{
					logger.info(alertType+" is not selected in progress bar.");
					return false;
				}
			}
		}
		if(i == alertsList.length){
			logger.info(alertType+" not found in progress bar.");
			return false;
		}
	});
}

/**
 * Method to click on progress bar for specific alert
 * alertType --> Critical, Warning, Healthy
 */
health.prototype.clickOnAlertProgressBar = function(alertType){
	util.waitForAngular();
	var self = this;
	browser.wait(EC.visibilityOf(element.all(by.css(this.healthStatusProgressBarsCss)).get(0)), timeout.timeoutInMilis);
	return element.all(by.css(this.commandCenterBarChartXaxisLabelsCss)).getText().then(async function(alertsList){
		var i=0;
		for(i=0; i<alertsList.length; i++){
			if(alertsList[i].includes(alertType)){
				await element.all(by.css(self.healthStatusProgressBarsCss)).get(i).click();
				logger.info("Clicked on progress bar with alert type : "+alertType);
				await util.waitOnlyForInvisibilityOfKibanaDataLoader();
				return true;
			}
		}
		if(i == alertsList.length){
			logger.info(alertType+" not found in progress bar.");
			return false;
		}
	});
}

/**
 * Method to get applications/resources cards count from specific table section from command center view
 * sectionName --> Prod, Dev, Aws, IBM DC, etc.
 * alertType --> Critical, Warning, Healthy
 */
health.prototype.getAppResCardsCountFromTableSection = function(sectionName, alertType){
	util.waitForAngular();
	var totalCount = 0;
	var alertCardsXpath = this.appResAlertCardsXpath.format(sectionName,alertType);
	var showMoreLinkForSection = this.sectionShowMoreLinkXpath.format(sectionName);
	return element.all(by.xpath(alertCardsXpath)).count().then(function(labelCount){
		if(labelCount != 0){
			return element.all(by.xpath(showMoreLinkForSection)).count().then(async function(linkCount){
				if(linkCount != 0){
					// To get all cards click on Show More link, if displayed
					var bool = await element(by.xpath(showMoreLinkForSection)).isDisplayed();
					logger.info("Is Show more link displayed: "+bool);
					while(bool)
					{
						await browser.actions().mouseMove(element(by.xpath(showMoreLinkForSection))).perform();
						await element(by.xpath(showMoreLinkForSection)).click();
						await util.waitOnlyForInvisibilityOfKibanaDataLoader();
						linkCount = await element.all(by.xpath(showMoreLinkForSection)).count();
						if(linkCount == 0){
							bool = false;
							logger.info("Is Show more link displayed: "+bool);
						}
						else{
							logger.info("Is Show more link displayed: "+bool+", Clicking on next one..");
						}
					}
				}
				totalCount = await element.all(by.xpath(alertCardsXpath)).count();
				logger.info("Total cards count for "+alertType+" is: "+totalCount);
				return totalCount;
			});
		}
		else{
			logger.info("Section name "+sectionName+" not found. Count : 0");
			return 0;
		}
	});
}

/**
 * Method to verify app or resource card is present in command center view table
 * @param {Application or resource card name to be verified} appResName
 */
health.prototype.isDisplayedAppResourceCard = function(appResName){
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.css(this.appResCardNamesCss)).get(0)), timeout.timeoutInMilis);
	return element.all(by.css(this.appResCardNamesCss)).getText().then(function(cardsList){
		var i=0;
		for(i=0; i<cardsList.length; i++){
			if(cardsList[i] == appResName){
				logger.info(appResName+" card found in table.");
				return true;
			}
		}
		if(i == cardsList.length){
			logger.info(appResName+" card not forund in table.");
			return false;
		}
	});
}

/**
 * Method to click on specific app or resource card on command center view table
 * @param {Application or resource card name to be click on} appResName
 */
health.prototype.clickOnAppResourceCard = function(appResName){
	var self = this;
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.css(this.appResCardNamesCss)).get(0)), timeout.timeoutInMilis);
	return element.all(by.css(this.appResCardNamesCss)).getText().then(async function(cardsList){
		var i=0;
		for(i=0; i<cardsList.length; i++){
			if(cardsList[i] == appResName){
				await element.all(by.css(self.appResCardNamesCss)).get(i).click();
				logger.info("Clicked on "+appResName+" card.");
				return true;
			}
		}
		if(i == cardsList.length){
			logger.info(appResName+" card not forund in table.");
			return false;
		}
	});
}

/**
 * Method to click first app or resource card from command center view table
 */
health.prototype.clickOnFirstAppResourceCard = function(){
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.css(this.appResCardNamesCss)).get(0)), timeout.timeoutInMilis);
	element.all(by.css(this.appResCardNamesCss)).get(0).click().then(function(){
		logger.info("Clicked on first application/resources card.");
	});
}

/**
 * Method to click first app or resource card from command center view table
 */
 health.prototype.clickOnFirstAppResourceCammandCenterCard = function(){
	util.waitOnlyForInvisibilityOfCarbonDataLoader();
	var self = this;
	var elementVisibility = element.all(by.css(self.appResCardNamesCss));
	return elementVisibility.isPresent().then(function(status){
	    if(status == true) {
	        element.all(by.css(self.appResCardNamesCss)).get(0).click().then(function(){
                logger.info("Clicked on first record of applications/resources card.");
            });
	    }
	    else {
	        logger.info("No Data to Display.");
	    }
	});
}


/**
 * Select health filter from app/resource tabs dropdown
 * @param {Name of filter from dropdown; Ex: Critical, Warning, healthy.} filter 
 */
 health.prototype.selectFilterFromHealthAppResBreakdownWidget = async function(filter){
	var self = this;
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.xpath(self.healthFilterXpath))), timeout.timeoutInMilis);
	await element(by.xpath(self.healthFilterXpath)).click();
	logger.info("Clicked on app/resource health filter dropdown button..");
	var appResDropdownSelectedOption = self.appRescFilterDropdownActiveOptionXpath.format(filter);
    await element(by.xpath(appResDropdownSelectedOption)).isPresent().then(async function(status){
            if(status == true) {
                var defaultSelectedOption = await element(by.xpath(appResDropdownSelectedOption)).getText();
                if(defaultSelectedOption === filter) {
                    logger.info(defaultSelectedOption, "is by default selected. no need to perform click action here.");
                }
            }
            else {
	            var appResDropdownValue = self.appResFilterDropdownOptionXpath.format(filter);
		        browser.wait(EC.visibilityOf(element(by.xpath(appResDropdownValue))), timeout.timeoutInMilis);
		        await element(by.xpath(appResDropdownValue)).click().then(async function() {
			        logger.info("selected the filter option: "+ filter);
		        });
	        }
    });
}


/**
 * Select category from app/resource breakdown widget dropdown 
 * @param {Name of category from dropdown; Ex: Provider, Environment, etc.} categoryName 
 */
 health.prototype.selectCategoryFromAppResFilterDropdown = async function(categoryName){
	var self = this;
	util.waitOnlyForInvisibilityOfCarbonDataLoader();
	browser.wait(EC.visibilityOf(element.all(by.css(this.filterByCategoryDropdownCss)).get(0)), timeout.timeoutInMilis);
	var defaultSelectedOption = await element.all(by.css(this.filterByCategoryDropdownCss)).get(0).getText();
	if(defaultSelectedOption === categoryName) {
        logger.info(defaultSelectedOption, "is by default selected. no need to perform click action here.");
	}
	else {
	    return await element.all(by.css(this.filterByCategoryDropdownCss)).get(0).click().then(async function(){
    		logger.info("Clicked on app/resource category filter dropdown button");
    		var appResDropdownValue = self.appResFilterDropdownOptionXpath.format(categoryName);
    		browser.wait(EC.visibilityOf(element(by.xpath(appResDropdownValue))), timeout.timeoutInMilis);
    		await element(by.xpath(appResDropdownValue)).click().then(async function(){
    			logger.info("Clicked on app/resource filter dropdown category "+ categoryName);
    		});
    	});
	}
}

/**
 * Method to search resources according to their health status
 * @param {Type of alert - Critical, Warning, Healthy} alertType
 */
health.prototype.searchResourcesFromAssociatedResourcesTable = function(alertType){
	var self = this;
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.searchIconButtonCss))), timeout.timeoutInMilis);
	element(by.css(this.searchIconButtonCss)).click().then(function(){
		logger.info("Clicked on search icon button.");
		browser.wait(EC.visibilityOf(element(by.css(self.searchInputCss))), timeout.timeoutInMilis);
		element(by.css(self.searchInputCss)).click().then(function(){
			logger.info("Focused on search textbox.");
			element(by.css(self.searchInputCss)).sendKeys(alertType + protractor.Key.ENTER).then(function(){
				logger.info("Searching resources using keyword " + alertType + "..");
			})
		})
	});
}

/**
 * Method to check if No Data is available in table
 */
health.prototype.isNoDataMessageTextPresentInTable = function(){
	var self = this;
	util.waitForAngular();
	return element.all(by.css(this.noDataTextCss)).count().then(function(count){
		if(count != 0){
			return element(by.css(self.noDataTextCss)).isDisplayed().then(function(isVisible){
				logger.info("Is No Data available in table: "+ isVisible);
				return isVisible;
			});
		}
		else{
			logger.info("Is No Data available in table: "+ false);
			return false;
		}
	});
}

/**
 * Method to reset global filters
 */
health.prototype.resetGlobalFilters = function() {
	util.waitForAngular();
	var self = this;
	var result;
	return element(by.css(self.globalFilterResetButtonDisableCss)).isPresent().then(function (status) {
	    if(status == true) {
	        logger.info("Reset link is disabled. Unable to click on reset link");
	    }
	    else if (status == false) {
	        element(by.css(self.globalFilterResetButtonCss)).click();
	        logger.info("Clicked on reset button");
	    }
	    result = !status
	    return result;
	});
}

/**
 * Method to get list section count from section label
 */
health.prototype.getListSectionCountFromLabel = function (label) {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.tabSectionLabelCss))), timeout.timeoutInMilis);
	return element.all(by.css(this.tabSectionLabelCss)).getText().then(function (labels) {
		logger.info(labels);
		let result = false;
		labels.forEach(key => {
			key = key.trim();
			if (key !== '' && key.indexOf(label + '(') > -1) {
				var sectionLabel = key;
				logger.info(label + " Section Label: " + sectionLabel.replace(/\s+/g, ' ').split("(")[0].trim());
				var header = sectionLabel.replace(/\s+/g, ' ').trim();
				var resCount = header.split("(")[1].split(")")[0];
				logger.info(label + " count from label: " + resCount);
				if (resCount >= 0) {
					result = true;
				}
			}
		});
		if (result === true) {
			logger.info(label + " list table contains lable and count");
			return true;
		} else {
			logger.info(label + " list table does't contains lable and count");
			return false;
		}
	});
}


/**
 * Method to click on application/resource list view
 */
health.prototype.isTableOverflowMenuDisplayed = async function () {
	var self = this;
	util.waitForAngular();
	util.waitOnlyForInvisibilityOfCarbonDataLoader();
	var tableStatus = true;
	return await element.all(by.css(self.tableOverflowMenuCss)).isPresent().then(async function(status){
	    if(status == true) {
	        var elementList = element.all(by.css(self.tableOverflowMenuCss));
        	await util.scrollToWebElement(elementList.get(0));
        	await browser.actions().mouseMove(elementList.get(0)).click().perform()
        	logger.info("Found overflow menu in List View");
        	logger.info("Clicked on overflow menu in List View");
            var clickStatus = await self.clickOnViewDetails();
	    }
	    else {
	        logger.info("No Data is found");
	    }
	    return tableStatus;
	});
}


/**
 * Method to click global filter
 */

health.prototype.applyGlobalFilter =async function(){
	var self = this;
	util.waitForAngular();
	browser.wait(EC.elementToBeClickable(element(by.css(self.applyFilterButtonCss))),timeout.timeoutInMilis);
	return await element(by.css(self.applyFilterButtonCss)).click().then(function(){
		 logger.info('Apply filter button is clicked');
		 util.waitOnlyForInvisibilityOfCarbonDataLoader();
		 return true
	 })
}

/**
 * Method to select checkbox
 */
health.prototype.clickOnCheckBox =async function(checkBoxText){
	var self = this;
	util.waitForAngular();
    var checkboxGlobalFilter = self.checkboxGlobalFilterXpath.format(checkBoxText);
	 browser.wait(EC.elementToBeClickable(element(by.xpath(checkboxGlobalFilter))), timeout.timeoutInMilis)
	 return await element(by.xpath(checkboxGlobalFilter)).click().then(function(){
		logger.info(checkBoxText+" checkbox is clicked");
		return true
	 })
}


/**
 * Method to check specific Header Column records of applications and resources list based on Column Name
 */
 health.prototype.checkListViewSpecificColumnRecordsBasedOnName = async function(recordsList, selectedHeaderName){
 	var self = this;
 	var status = true, count = 0;
 	util.waitForAngular();
 	var lisViewHeaderIndex = await self.getListViewHeaders();
 	var headerIndex = lisViewHeaderIndex.indexOf(selectedHeaderName)+1;
 	var selectedHeaderRowValueXpath = self.listViewDataByRowXpath.format(headerIndex);
 	return await element.all(by.xpath(selectedHeaderRowValueXpath)).isPresent().then(async function(visibilityStatus){
 	    if(visibilityStatus == true){
 	        await element.all(by.xpath(selectedHeaderRowValueXpath)).getText().then(function(text){
         		for(var i=0; i < text.length; i++) {
         		    text[i] = text[i].replace(/\s/g, '');
         		    if(text[i].includes(recordsList)) {
         		        logger.info(text[i], 'includes in selected',selectedHeaderName,' column:', recordsList);
         		        count = count+1;
         		    }
         		    else {
         		        logger.info(text[i], 'does not include selected',selectedHeaderName,':', recordsList);
                        count = 0;
                        status = false;
         		    }
         		}
         	});
 	    }
 	    else {
 	        logger.info("No Data is found");
 	        status = false;
 	    }
 	    return {status, count};
 	});
 }

/**
 * Method to verify KPI Values title
 */
health.prototype.kpiValuesTitle = async function () {
	logger.info("KPI Values Title started");
	browser.wait(EC.visibilityOf(element(by.css(this.kpiValuesTitleCss))), timeout.timeoutInMilis);
	let titleText = await element(by.css(this.kpiValuesTitleCss)).getText();
	logger.info("Title text - " + titleText);
	return titleText;
}

 /**
  *
  * Method to verify the FilterBy Prometheus Value
  */
  health.prototype.filterValuesTitle = async function () {
	logger.info("KPI Values Title started");
	browser.wait(EC.visibilityOf(element.all(by.css(this.filterByDaysCss)).get(0)), timeout.timeoutInMilis);
	let titleText = await element.all(by.css(this.filterByDaysCss)).get(0).getText();
	logger.info("Title text - " + titleText);
	return titleText;
}

/**
  *
  * Method to verify the MY DC Public filter Value
  */
 health.prototype.publicFilterValuesTitle = async function () {
	logger.info("Public filter started");
	browser.wait(EC.visibilityOf(element.all(by.xpath(this.golbalFilterIBMDcXpath)).get(0)), timeout.timeoutInMilis);
	var titleText = await element.all(by.xpath(this.golbalFilterIBMDcXpath)).get(0).getText();
	logger.info("Public filter text - " + titleText);
	return titleText;
}


/**
  *
  * Method to verify the IBM DC Public filter Value 
  */
 health.prototype.publicFilterValuesIBMDCTitle = async function () {
	logger.info("Checking the Public filter value");
	browser.wait(EC.visibilityOf(element.all(by.xpath(this.golbalFilterIBMDcXpath)).get(0)), timeout.timeoutInMilis);
	var titleText = await element.all(by.xpath(this.golbalFilterIBMDcXpath)).get(0).getText();
	logger.info("Public filter text - " + titleText);
	return titleText;
}

/**
 * method to click on header tab on health resource view
 */
health.prototype.clickOnHeaderTab = async function (tabName) {
	var EC = protractor.ExpectedConditions;
	var self = this;
	browser.wait(EC.visibilityOf(element.all(by.css(self.headerTabsCss)).get(0)), timeout.timeoutInMilis);
	return await element.all(by.css(self.headerTabsCss)).then(async function (navItems) {
		for (var i = 0; i < navItems.length; i++) {
			var text = await navItems[i].getText();
			if (text === tabName) {
				await element.all(by.css(self.headerTabsCss)).get(i).click().then(function () {
					logger.info("Clicked on " + tabName + " Tab");
				});
			}
		}
	});
}

/**
 * This function will click on Performance Tab button
 */
health.prototype.clickOnPerformanceTab = async function (tabName) {
	var EC = protractor.ExpectedConditions;
	var self = this;
	browser.wait(EC.visibilityOf(element(by.tagName(self.performanceTabNameCss))), timeout.timeoutInMilis);
	return element.all(by.tagName(self.performanceTabNameCss)).then(async function (navItems) {
		for (var i = 0; i < navItems.length; i++) {
			var text = await navItems[i].getText();
			if (text == tabName || text.indexOf(tabName) > -1) {
				element.all(by.tagName(self.performanceTabNameCss)).get(i).click().then(function () {
					logger.info("Clicked on " + tabName + " Tab");
				});
			}
		}
	});
}

/**
 * Method to verify Resource Availability sub title
 */
health.prototype.resourceAvailabilitySubTitle = async function () {
    util.waitOnlyForInvisibilityOfCarbonDataLoader();
	logger.info("Resource Availability sub Title check started");
	browser.wait(EC.visibilityOf(element(by.css(this.resourceAvailabilityDateTitleCss))), timeout.timeoutInMilis);
	let subTitleText = await element(by.css(this.resourceAvailabilityDateTitleCss)).getText();
	logger.info("Sub Title text - " + subTitleText);
	return  subTitleText ? true :false;
}

/**
 * Method to verify Resource Availability container check
 */
health.prototype.resourceAvailabilityContainerCheck = async function () {
	logger.info("Resource Availability container check started");
	browser.wait(EC.visibilityOf(element(by.css(this.resourceAvailabilityContainerCss))), timeout.timeoutInMilis);
	let count = await element.all(by.css(this.resourceAvailabilityContainerCss)).count();
	logger.info("container count - " + count);
	return  count === 123 ? true :false;
}

/**
 * Method to verify Resource Availability footer check
 */
health.prototype.resourceAvailabilityFooterCheck = async function () {
	logger.info("Resource Availability footer check started");
	browser.wait(EC.visibilityOf(element(by.css(this.resourceAvailabilityFooterCss))), timeout.timeoutInMilis);
	let footerText = await element.all(by.css(this.resourceAvailabilityFooterCss)).getText();
	logger.info("Footer text - " + footerText);
	return  (footerText.toString() == "Up,Down,Degraded,Info Not Available") ? true :false;
}

/**
 * Method to click on resource category tab
 */
health.prototype.clickOnResourceCategory =async function(){
	var self = this;
	util.waitForAngular();
	browser.wait(EC.elementToBeClickable(element(by.xpath(self.resourceCategoryCss))), timeout.timeoutInMilis);
	return element(by.xpath(self.resourceCategoryCss)).click().then(function(){
		logger.info("clicked on Resource category Tab")
		return true
	})
}

/**
 * Method to click on compute tab
 */
health.prototype.clickOnComputeTab =async function(){
	var self = this;
	util.waitForAngular();
	browser.wait(EC.elementToBeClickable(element(by.css(self.computeTabNameCss))), timeout.timeoutInMilis);
	return element(by.css(self.computeTabNameCss)).click().then(function(){
		logger.info("clicked on Compute Tab")
		return true
	})
}

/**
 * Method to click on network tab
 */
health.prototype.clickOnNetworkTab =async function(){
	var self = this;
	util.waitForAngular();
	browser.wait(EC.elementToBeClickable(element(by.css(self.networkTabCss))), timeout.timeoutInMilis);
	return element(by.css(self.networkTabCss)).click().then(function(){
		logger.info("clicked on network Tab")
		return true
	})
}


/**
 * Method to click on utilization tab
 */
health.prototype.clickOnUtilization =async function(){
	var self = this;
	util.waitForAngular();
	browser.wait(EC.elementToBeClickable(element(by.css(self.utilizationTabCss))), timeout.timeoutInMilis);
	return element(by.css(self.utilizationTabCss)).click().then(function(){
		logger.info("clicked on Utilization Tab ")
		return true
	})

}

/**
 * Method to click on disk tab
 */
health.prototype.clickOnDiskTab =async function(){
	var self = this;
	util.waitForAngular();

	browser.wait(EC.elementToBeClickable(element(by.css(self.diskTabCss))), timeout.timeoutInMilis);
	return element(by.css(self.diskTabCss)).click().then(function(){
		logger.info("clicked on disk tab")
		return true
	})
}

/**
 * Method to click on memory tab
 */


health.prototype.clickOnMemoryTab =async function(){
	var self = this;
	util.waitForAngular();

	browser.wait(EC.elementToBeClickable(element(by.css(self.memoryTabCss))), timeout.timeoutInMilis);
	return element(by.css(self.memoryTabCss)).click().then(function(){
		logger.info("clicked on memory Tab")
		return true
	})
}



/**
 * Method to click on process group tab
 */

health.prototype.clickOnProcessGroups =async function(){
	var self = this;
	util.waitForAngular();

	browser.wait(EC.elementToBeClickable(element(by.css(self.processGroupsCss))), timeout.timeoutInMilis);
	return element(by.css(self.processGroupsCss)).click().then(function(){
		logger.info("clicked on process group tab")
		return true
	})
}

/**
 * Method to click on heap size tab
 */

health.prototype.clickOnHeapSizeTab =async function(){
	var self = this;
	util.waitForAngular();

	browser.wait(EC.elementToBeClickable(element(by.css(self.heapSizeTabCss))), timeout.timeoutInMilis);
	return element(by.css(self.heapSizeTabCss)).click().then(function(){
		logger.info("clicked on heap size tab")
		return true
	})
}

/**
 * Method to click on garbage collection tab
 */

health.prototype.clickOnGarbageCollectionTab =async function(){
	var self = this;
	util.waitForAngular();

	browser.wait(EC.elementToBeClickable(element(by.css(self.garbageCollectionTabCss))), timeout.timeoutInMilis);
	return element(by.css(self.garbageCollectionTabCss)).click().then(function(){
		logger.info("clicked on garbage collection tab")
		return true
	})
}

/**
 * Method to click on filter by days under performance tab
 */

health.prototype.clickOnFilterByDays =async function(){
	var self = this;
	util.waitForAngular();

	browser.wait(EC.elementToBeClickable(element.all(by.css(self.filterByDaysCss)).get(0)), timeout.timeoutInMilis);
	await element.all(by.css(self.filterByDaysCss)).get(1).click().then(async function(){
		logger.info("clicked on filter by days dropdown box")
	})
}

/**
 * Method to select days under filter by 7 , 30 and 90days
 */

health.prototype.selectFilterByDays =async function(){
	var self = this;
	util.waitForAngular();
		await self.clickOnFilterByDays()
		browser.wait(EC.visibilityOf(element.all(by.xpath(self.numbeOfDaysXpath)).get(0)), timeout.timeoutInMilis);
		await element.all(by.xpath(self.numbeOfDaysXpath)).count().then(async function(values){
			for (var i = 0; i < values; i++) {
				await element.all(by.xpath(self.numbeOfDaysXpath)).get(i).getText().then(async function(numberOfDaysText){
					await element.all(by.xpath(self.numbeOfDaysXpath)).get(i).click().then(function(){
						logger.info('clicked on ' + numberOfDaysText)
					})
				})
					await self.clickOnFilterByDays()
			}
		})
}

/**
 * Method to type mainframe in search box and press enter
 */
health.prototype.filterSearchBox = async function (mainframeText) {
	var self = this;
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(self.searchBoxCss))), timeout.timeoutInMilis);
	await element(by.css(self.searchBoxCss)).sendKeys(mainframeText + protractor.Key.ENTER).then(function(){
		logger.info("Searching resources using keyword " + mainframeText + "..");
	})
}

/**
 * Method to type application in search box and press enter in more popUp
 */
 health.prototype.filterMorePopupSearchBox = async function(applicationText) {
	var self = this;
	util.waitForAngular();
	await element(by.xpath(self.morePopupDisplayXpath)).isPresent().then(async function(status) {
		if(status == true) {
			await element(by.css(self.morePopupSearchCss)).sendKeys(applicationText + protractor.Key.ENTER).then(function(){
				logger.info("Searching application :", applicationText);
			});
		} else {
		    logger.info("More popup is not available to perform search action.");
		}
	});
}

/**
 * Method to verify headers in application/resource list view
 */
 health.prototype.getListViewHeaders = async function () {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.css(this.listViewHeaderCss)).get(0)), timeout.timeoutInMilis);
	return element.all(by.css(this.listViewHeaderCss)).getText().then(function (labels) {
		for (var i = 0; i < labels.length; i++) {
			labels[i] = labels[i].trim()
		}
		return labels;
	});
}


/**
 * Method to click on list view item
 */
health.prototype.clickOnListViewUnderTags =async function (index) {
	var self = this;
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.css(self.listViewItemsCss)).get(0)), timeout.timeoutInMilis);
	await element.all(by.css(self.listViewItemsCss)).get(index).getText().then(async function (listItemText) {
		await element.all(by.css(self.listViewItemsCss)).get(index).click().then(function () {
			logger.info('clicked on ' + listItemText)
		})
	});
}

/**
 * Method to click on mainframe resource header
 */
health.prototype.clickOnMainframeResourceHeader =async function (index) {
	var self = this;
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.css(self.headerMainframeResourceCss)).get(index)), timeout.timeoutInMilis);
	await element.all(by.css(self.headerMainframeResourceCss)).get(index).getText().then(async function (mainframeResourceText) {
		await element.all(by.css(self.headerMainframeResourceCss)).get(index).click().then(function () {
			logger.info("clicked on " + mainframeResourceText +"Mainframe resource")
		})
	});
}

/**
 * Method to return the first App/Res name from command center list.
 */
 health.prototype.getCommandCenterFirstAppResName = async function(){
	var commandCenterAppResName = '';
	util.waitOnlyForInvisibilityOfCarbonDataLoader();
	browser.wait(EC.visibilityOf(element.all(by.css(this.appResCardNamesCss)).get(0)), timeout.timeoutInMilis);
	commandCenterAppResName = await element.all(by.css(this.appResCardNamesCss)).get(0).getText();
	return commandCenterAppResName.replace('...','');
}

/**
 * Method to search the app/res name in command center.
 */
 health.prototype.commandCenterSearch = async function(name){
	var self = this;
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(self.commandCenterSearchCss))),  timeout.timeoutInMilis);
	await element(by.css(self.commandCenterSearchCss)).clear().sendKeys(name).sendKeys(protractor.Key.ENTER);
	logger.info("clicked enter on command center search");
}

/**
 * Method to verify list after command center searched for the app/res name.
 */
health.prototype.verifyCommandCenterSearch = async function (name) {
	var self = this;
	var flag = true, healthStatusSvgCount = 0, labelCount = 0;
	util.waitOnlyForInvisibilityOfCarbonDataLoader();
	browser.wait(EC.visibilityOf(element.all(by.css(self.appResCardNamesCss)).get(0)), timeout.timeoutInMilis);
	await element.all(by.css(self.appResCardNamesCss)).then(async function (elements) {
		elements.forEach(async element => {
			let text = await element.getText();
			text = text.replace('...','');
			logger.info('label text : ' + text);
			if (name !== text) {
				flag = false;
			}
		});
	});
	// verify health status icon count vs label count.
	healthStatusSvgCount = await element.all(by.css(self.commandCenterHealthStatusSVGCss)).count();
	labelCount = await element.all(by.css(self.appResCardNamesCss)).count();
	logger.info('label count : ' + labelCount, 'health status svg count :' + healthStatusSvgCount);
	if (healthStatusSvgCount !== labelCount) {
		flag = false;
	}
	return flag;
}


/**
 * Method to verify Top Insights sub-section data is present or not to navigate to  app detail page
 */
health.prototype.verifyTopInsightsDataAvailable = async function (topInsightCss) {
	var self = this;
	logger.info("Top insights sub section verification started - " + topInsightCss);
	return await element.all(by.css(self.topInsightsSubSectionNoDataCss.replace('{{CSS}}',
		topInsightCss))).count().then(async function (count) {
			logger.info("No data available text count - " + count);
			if (count > 0) {
				return element(by.css(self.topInsightsSubSectionNoDataCss.replace('{{CSS}}',
					topInsightCss))).getText().then(function (noDataText) {
						logger.info("No data available in top insights  - " + noDataText);
						return [false];
					});
			}
			else {
				browser.wait(EC.visibilityOf(element.all(by.css(self.topInsightsSubSectionDataCss.replace('{{CSS}}',
					topInsightCss))).get(0)), timeout.timeoutInMilis);
				return element.all(by.css(self.topInsightsSubSectionDataCss.replace('{{CSS}}',
					topInsightCss))).getText().then(async function (labels) {
						if (labels) {
							logger.info("Top insights sub section data found - " + labels);
							let selectedElement = await element.all(by.css(self.topInsightsSubSectionDataCss.replace('{{CSS}}', topInsightCss))).get(0).getText();
							logger.info("Top insights selected element - " + selectedElement);
							await element.all(by.css(self.topInsightsSubSectionDataCss.replace('{{CSS}}', topInsightCss))).get(0).click();
							return [true, selectedElement];
						} else {
							logger.info("Top insights sub section data not found - " + labels);
							return [false];
						}
					});
			}
		});
}


/**
 * Method to Select option in More popup based on given index
 */
health.prototype.clickOnMorePopupOptions = async function(option) {
    var self = this;
    util.waitOnlyForInvisibilityOfCarbonDataLoader();
    var morePopupOptions = self.globalFilterMorePopupOptionNameXpath.format(option);
    await element(by.css(self.morePopupSearchCss)).isDisplayed().then(async function(status){
        if(status == true) {
            await element.all(by.xpath(morePopupOptions)).count().then(async function(count) {
                    if(count > 1) {
                        element.all(by.xpath(morePopupOptions)).get(0).click();
                    }
                    else {
                        element.all(by.xpath(morePopupOptions)).click();
                    }
                    logger.info("Selected '"+option+"' in Popup");
            });
        }
        else {
            await self.clickOnCheckBox(option);
        }
    });
}


/**
 * Method to Close More popup
 */
health.prototype.closeMorePopup = async function(option) {
    var self = this;
    util.waitForAngular();
    await element(by.css(self.morePopupSearchCss)).isDisplayed().then(async function(status) {
        if(status === true) {
            element(by.css(self.morePopupCloseBtnCss)).click();
            logger.info("Closed More Popup");
        }
    });
}


/**
 * Method to verify list after searched for the app name.
 */
 health.prototype.verifyMorePopupSearch = async function(name) {
	var self = this;
	var optionsList = [], textList;
	await element(by.xpath(self.morePopupDisplayXpath)).isPresent().then(async function(status) {
		if(status == true) {
		    var optionsCount = await element.all(by.css(self.globalFilterMorePopupCss)).count();
		    if(optionsCount > 1) {
		        textList = await element.all(by.css(self.globalFilterMorePopupCss)).getText();
		        for(var index = 0; index < optionsCount; index++){
		            optionsList.push(textList[i]);
		        }
            	for(var i=0; i < optionsList.length; i++){
            		logger.info('Search Result text : ' + optionsList[i]);
            		if (optionsList[i].includes(name)) {
            		    logger.info("Search result '"+optionsList[i]+"' is matching with '"+name+"'.");
            		} else {
            		    logger.info("Search result '"+optionsList[i]+"' is not matching with '"+name+"'.");
            		}
            	}
		    }
		    else if (optionsCount == 1){
                optionsList.push(await element(by.css(self.globalFilterMorePopupCss)).getText());
                if (optionsList == name) {
            		 logger.info("Search result '"+optionsList+"' is matching with '"+name+"'.");
            	}
            	else {
            		 logger.info("Search result '"+optionsList+"' is not matching with '"+name+"'.");
            	}
		    }
		}
	});	
 }

 /**
 * Method to click on clear button in search popup
 */
  health.prototype.clickOnMorePopupSearchClearButton = async function () {
	var self = this;
	util.waitForAngular();
	return await element(by.xpath(self.morePopupDisplayXpath)).isPresent().then(async function (status) {
		if(status == true) {
			await util.scrollToWebElement(element(by.css(self.morePopupSearchClearCss)));
			await element.all(by.css(self.morePopupSearchClearCss)).click();
			logger.info("cleared the searched text");
		}
	});
}


/**
 * Method to verify App Detail page sub section overview titles
 */
health.prototype.appOverviewSubSectionTitles = async function () {
	browser.wait(EC.visibilityOf(element(by.css(this.appOverviewSubSectionTitlesCss))), timeout.timeoutInMilis);
	return await element.all(by.css(this.appOverviewSubSectionTitlesCss)).then(async function (elements) {
		let status = true;
		for (let i = 0; i < elements.length; i++) {
			let text = await elements[i].getText();
			logger.info("Application overview sub section title - " + text);
			if (i === 0 && text !== healthTestData.appCategory) {
				status = false;
			}
			else if (i === 1 && text !== healthTestData.impactedResource) {
				status = false;
			}
			else if (i === 2 && text !== healthTestData.provider) {
				status = false;
			}
			else if (i === 3 && text !== healthTestData.environment) {
				status = false;
			}
			else if (i === 4 && text !== healthTestData.team) {
				status = false;
			}
		}
		return status;
	});
}

/**
 * Method to verify App Detail page sub section overview content availability
 */
health.prototype.appOverviewSubSectionContentCheck = async function () {
	browser.wait(EC.visibilityOf(element(by.css(this.appOverviewSubSectionContentCss))), timeout.timeoutInMilis);
	util.waitOnlyForInvisibilityOfCarbonDataLoader();
	return await element.all(by.css(this.appOverviewSubSectionContentCss)).then(async function (elements) {
		let status = true;
		for (let i = 0; i < elements.length; i++) {
			let text = await elements[i].getText();
			logger.info("Application overview sub section content check - " + text);
			if (i === 0 && !text.trim()) {
				status = false;
			}
			else if (i === 3 && !text.trim()) {
				status = false;
			}
			else if (i === 4 && !text.trim()) {
				status = false;
			}
			else if (i === 5 && !text.trim()) {
				status = false;
			}
		}
		return status;
	});
}

/**
 * Method to verify App Detail page header status
 */
health.prototype.appOverviewHeaderStatusCheck = async function () {
	let css = this.appOverviewSubSectionContentCss + " label";
	let healthStatus;
	browser.wait(EC.visibilityOf(element(by.css(css))), timeout.timeoutInMilis);
	util.waitOnlyForInvisibilityOfCarbonDataLoader();
	await element.all(by.css(css)).then(async function (elements) {
		for (let i = 0; i < elements.length; i++) {
			let text = await elements[i].getText();
			logger.info("Application overview impacted resources - " + text);
			if (i === 0 && text > 0) {
				healthStatus = "Critical";
			}
			else if (i === 1 && text > 0) {
				healthStatus = "Warning";
			} else if (healthStatus !== "Critical") {
				healthStatus = "Healthy";
			}
		}
	});
	let headerStatus = await element(by.css(this.appOverviewHeaderStatusCss)).getText();
	if (headerStatus === healthStatus)
		return true;
	else
		return false;
}

/**
 * Method to verify App Detail page header title
 */
health.prototype.appOverviewHeaderTitleCheck = async function (selectedTopinsight) {
	logger.info("topinsight slected one - " + selectedTopinsight);
	browser.wait(EC.visibilityOf(element(by.css(this.appOverviewHeaderTitleCss))), timeout.timeoutInMilis);
	util.waitOnlyForInvisibilityOfCarbonDataLoader();
	let headerText = await element(by.css(this.appOverviewHeaderTitleCss)).getText();
	logger.info("header text - " + headerText);
	if (headerText.trim() === selectedTopinsight.trim())
		return true
	else
		return false;
}

/*
* Method to verify breadcrumbText
*/
health.prototype.breadcrumbText = async function (selectedTxt) {
    util.waitForAngular();
	var self = this;
	logger.info("Breadcrumb started - " + self.breadcrumbTitlesCss);
	return await element.all(by.css(self.breadcrumbTitlesCss)).then(async function (elements) {
		let status = true;
		for (let i = 0; i < elements.length; i++) {
			let text = await elements[i].getText();
			logger.info('breadcrumb text : ' + text);
			if (i === 0 && text !== healthTestData.portal) {
				status = false;
			}
			else if (i === 1 && text !== healthTestData.AIOpsConsole) {
				status = false;
			}
			else if (i === 2 && (text !== healthTestData.headerTitle
				&& text !== healthTestData.appBreadcrumbTitle
				&& text !== healthTestData.resBreadcrumbTitle)) {
				status = false;
			}
			else if (i === 3 && text !== selectedTxt) {
				status = false;
			}
		}
		return status;
	});
}

/**
 * Method to check Last updated timestamp text
 */
health.prototype.getHeaderStatusText = async function () {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.headerStatusText))), timeout.timeoutInMilis);
	return await element(by.css(this.headerStatusText)).getText().then(async function (text) {
		logger.info("header status text: " + text);
		return true;
	});
}

/**
 * Method to check Last updated timestamp format
 */
health.prototype.getLastUpdatedTimestampFormat = async function () {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.xpath(this.lastUpdatedTimestampTextCss))), timeout.timeoutInMilis);
	util.waitOnlyForInvisibilityOfCarbonDataLoader();
	return await element(by.xpath(this.lastUpdatedTimestampTextCss)).getText().then(async function (text) {
		logger.info("header last updated timestamp: " + text);
		if (text.indexOf(healthTestData.lastUpdatedTimestampText) > -1) {
			var regexP = /Last updated \d{1,2}\/\d{1,2}\/\d{4} ([0-1]?[0-9]|2[0-3]):[0-5][0-9] ([AaPp][Mm]) [A-Z]{3}/;
			var result = text.match(regexP);
			if (result && result[0] && result[0] === text) {
				logger.info("date format is correct");
				return true;
			} else {
				logger.info("date format is not correct");
				return false;
			}
		} else {
			logger.info("text does not contain last updated timestamp");
			return false;
		}
	});
}

/**
 * Method to get impacted resources from app details overview
 */
health.prototype.getImpactedResourcesFromOverview = async function () {
	browser.wait(EC.visibilityOf(element(by.css(this.appOverviewSubSectionContentCss))), timeout.timeoutInMilis);
	util.waitOnlyForInvisibilityOfCarbonDataLoader();
	var impactedResources = {};
	return await element.all(by.css(this.appOverviewSubSectionContentCss)).then(async function (elements) {
		let critical = 0;
		let warning = 0;
		if (elements && elements.length === 6) {
			critical = await elements[1].getText();
			warning = await elements[2].getText();
			impactedResources['Critical'] = parseInt(critical);
			impactedResources['Warning'] = parseInt(warning);
			logger.info("Impacted Resources details from UI: ", impactedResources);
		}
		return impactedResources;
	});
}

/**
 * Method to get number of unique links of particular column(columnName) in all pages(pagecount: loopcount)
 */
health.prototype.getCountOfLinks = async function (columnName, loopCount) {
	var self = this;
	var critical = 0, warning = 0, healthy = 0, statusList = [], result = {};
	var totalItemsCount = 0;
	var lisViewHeaderIndex = await self.getListViewHeaders();
    var headerIndex = lisViewHeaderIndex.indexOf(columnName)+1;
	var columnNameCss = self.applicationTableNameColumnCss.format(headerIndex);

	for (var i = 0; i < loopCount; i++) {
	    browser.wait(EC.visibilityOf(element.all(by.css(columnNameCss)).get(0)), timeout.timeoutInMilis);
		await element.all(by.css(columnNameCss)).getText().then(async function (links) {
			var counts = {};
			statusList = statusList.concat(links);
			links.forEach(function (x) { counts[x] = (counts[x] || 0) + 1; });
			var values = parseInt(Object.values(counts));
			totalItemsCount = totalItemsCount + values;
			logger.info('Counts per page - ' + JSON.stringify(counts));
			if (counts['Critical']) {
				critical += counts['Critical'];
				result['Critical'] = critical;
			}
			if (counts['Warning']) {
				warning += counts['Warning'];
				result['Warning'] = warning;
			}
			if (counts['Healthy']) {
            	healthy += counts['Healthy'];
            	result['Healthy'] = healthy;
            }
			browser.wait(EC.visibilityOf(element.all(by.css(self.paginationCss)).get(0)), timeout.timeoutInMilis);
			return element.all(by.css(self.paginationCss)).get(1).click().then(function () {
				logger.info("Clicked on page - " + (i + 1));
				util.waitOnlyForInvisibilityOfCarbonDataLoader();
			});
		});
		if(i === loopCount - 1) {
		    logger.info("On last page of List Pagination. No need to perform Next page click action.");
		    if (loopCount > 1) {
	            browser.wait(EC.visibilityOf(element(by.css(self.paginationPageDropdownCss))), timeout.timeoutInMilis);
        		await element(by.css(self.paginationPageDropdownCss)).click();
        		logger.info("Clicked on Pagination Page numbers dropdown");
        		var paginationSelectPageNumber = self.paginationSelectPageNumberCss.format(1);
        		await element(by.css(paginationSelectPageNumber)).click();
        		logger.info("Navigated back to first page of list navigation");
		    }
		}
	}
	let statusList1 = [...statusList];
	let statusOrder = ["Critical", "Warning", "Healthy", "--"];
    let statusList2 = statusList.sort((a, b) =>
		statusOrder.indexOf(a) -
		statusOrder.indexOf(b)
	);
	if(statusList1.join(',') === statusList2.join(',')){
		logger.info('RAG Status (Critical -> Warning -> Healthy -> --) order is correct');
	}
	else {
		logger.info('RAG Status (Critical -> Warning -> Healthy -> --) order is not correct');
	}
	await expect(statusList1.join(',') === statusList2.join(',')).toEqual(true);
	var resourcesDetailsByHealthStatus = {"resourcesTotalCount": {[totalItemsCount]: {"Critical": critical, "Healthy": healthy, "Warning": warning}}};
	logger.info(resourcesDetailsByHealthStatus);
	return {critical, warning, totalItemsCount, result};
}

/**
 * Method to get Applications label text
 */
health.prototype.getListSectionLabelText = async function () {
	util.waitOnlyForInvisibilityOfCarbonDataLoader();
	var self = this;
	var labelText;
	return element(by.css(self.listSectionLabelCss)).isPresent().then(async function(status){
	    if(status === true) {
	        await element(by.css(self.listSectionLabelCss)).getText().then(async function (listLabel) {
	            labelText = listLabel.replace(/\s+/g, ' ').split("(")[0].trim();
                logger.info("Found List Section Label: " + labelText);
            });
	    }
	    return labelText;
	});
}

health.prototype.isTableDisplayed = function () {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.tableCss))), timeout.timeoutInMilis);
	return element(by.css(this.tableCss)).isDisplayed().then(function (res) {
		if (res == true) {
			logger.info("List Table is displayed.");
		}
		else {
			logger.info("List Table is not displayed.");
		}
		return res;
	});
}

health.prototype.isTableHeadersDisplayed = function (headers) {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.css(this.tableHeaderCss)).get(0)), timeout.timeoutInMilis);
	return element.all(by.css(this.tableHeaderCss)).getText().then(function (labels) {
		logger.info(JSON.stringify(labels));
		if (labels) {
			let result = true;
			labels.forEach(key => {
				if (key.trim() !== '' && headers.indexOf(key.trim()) === -1) {
					logger.info(key + " is not present in Headers");
					result = false;
				}
			});
			if (result === true) {
				logger.info("List Table Headers are displayed - " + labels);
				return true;
			} else {
				logger.info("List Table Headers are not correct.");
				return false;
			}
		}
		else {
			logger.info("List Table Headers are not displayed.");
			return false;
		}
	});
}

health.prototype.isTableSearchBarDisplayed = function () {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.tableSearchBarCss))), timeout.timeoutInMilis);
	return element(by.css(this.tableSearchBarCss)).isDisplayed().then(function (res) {
		if (res == true) {
			logger.info("List Table - Search bar is displayed.");
		}
		else {
			logger.info("List Table - Search bar is not displayed.");
		}
		return res;
	});
}

health.prototype.isTablePaginationDisplayed = function () {
	util.waitForAngular();
	var self = this;
	util.waitOnlyForInvisibilityOfCarbonDataLoader();
	return element.all(by.css(self.tableNoDataCss)).getText().then(function (text) {
		logger.info(text);
		if (text.indexOf('No data to display at this time.') > -1) {
			logger.info("List Table is empty - Pagination is not displayed.");
			return true;
		} else {
			browser.wait(EC.visibilityOf(element(by.css(self.tablePaginationCss))), timeout.timeoutInMilis);
			return element(by.css(self.tablePaginationCss)).isDisplayed().then(function (res) {
				if (res == true) {
					logger.info("List Table - Pagination is displayed.");
				}
				else {
					logger.info("List Table - Pagination is not displayed.");
				}
				return res;
			});
		}
	});
}

health.prototype.isTableExportDisplayedAndClick = function () {
	util.waitForAngular();
	var self = this;
	browser.wait(EC.visibilityOf(element(by.css(this.tableExportCss))), timeout.timeoutInMilis);
	return element(by.css(this.tableExportCss)).click().then(function () {
		logger.info("List Table - Export icon clicked");
		util.waitForAngular();
		return browser.getAllWindowHandles().then(function (handles) {
			logger.info("List Table - Focus on modal");
			return browser.switchTo().window(handles[0]).then(function () {
				browser.wait(EC.visibilityOf(element(by.css(self.tableExportModalHeader))), timeout.timeoutInMilis);
				return element(by.css(self.tableExportModalHeader)).getText().then(function (label) {
					logger.info("List Table - Export modal header - " + label);
					if (label === 'Export') {
						logger.info("List Table - Export modal is displayed - " + label);
						browser.wait(EC.visibilityOf(element(by.css(self.tableExportRadioOptions))), timeout.timeoutInMilis);
						return element.all(by.css(self.tableExportRadioOptions)).getText().then(function (labels) {
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
		});
	});
}

/*
* Method to select csv or json and click on export button list view
*/
health.prototype.clickOnExport = async function (size, format) {
	util.waitForAngular();
	util.waitOnlyForInvisibilityOfCarbonDataLoader();
	var self = this;
	browser.wait(EC.elementToBeClickable(element(by.css(self.tableExportCss))), timeout.timeoutInMilis);
	return await element(by.css(self.tableExportCss)).click().then( async function () {
		logger.info("List Table - Export icon clicked !!");
		browser.wait(EC.visibilityOf(element.all(by.css(self.tableExportButtons)). get(1)), timeout.timeoutInMilis);
		return await element.all(by.css(self.tableExportRadioOptionClick)).get(size).click().then( async function () {
			logger.info("Selected "+format+" format");
			return await element.all(by.css(self.tableExportButtons)).get(1).click().then(function () {
				logger.info("Clicked on Export");
				return true;
			});
		});
	});
}




/**
 * Method to click on application/resource/tickets/tags list view
 */
health.prototype.clickOnItemsPerPage = function (cssPath, feature, size) {
	util.waitForAngular();
	var count;
	var incount;
	if (size == 0) {
		count = 10;
		incount = 1;
	}
	else if (size == 1) {
		count = 20;
		incount = 2;
	}
	var self = this;
	var clickCss = cssPath + " .bx--select__arrow";
	var optionCss = cssPath + " .bx--select-option";
	var elementList = element.all(by.css(clickCss));

	return element.all(by.css(clickCss)).count().then(async function (selectArrowCount) {
		logger.info('Selection arrow count - ' + selectArrowCount);
		if (elementList && selectArrowCount && selectArrowCount > 0) {
			browser.wait(EC.visibilityOf(elementList.get(0)), timeout.timeoutInMilis);
			util.scrollToWebElement(elementList.get(0));
			await browser.actions().mouseMove(elementList.get(0)).click().perform()
			util.waitForAngular();
			logger.info("Clicked on " + feature + " (" + incount + ") in List View");
			return element.all(by.css(optionCss)).get(size).click().then(function () {
				logger.info("Selected Items Per Page as " + count + " in List view");
				return element.all(by.css(self.tableRowCss)).count().then(function (rowCount) {
					if (rowCount) {
						logger.info("Number of rows in List view: " + rowCount);
						return "Found Rows";
					} else {
						logger.info("No rows found in List view: " + rowCount);
						return "No Data";
					}
				});
			});
		} else {
			return element.all(by.css(self.paginationSelectInput)).count().then(async function (selectInputCount) {
				logger.info('Select input count - ' + selectInputCount);
				if (selectInputCount && selectInputCount > 0) {
					browser.wait(EC.visibilityOf(element(by.css(self.paginationSelectInput))), timeout.timeoutInMilis);
					return element(by.css(self.paginationSelectInput)).click().then(function () {
						logger.info("Focused on page select textbox.");
						return element(by.css(self.paginationSelectInput)).sendKeys('1' + protractor.Key.ENTER).then(function () {
							logger.info("Selected page number is 11");
							util.waitOnlyForInvisibilityOfCarbonDataLoader();
							return element.all(by.css(self.tableRowCss)).count().then(function (rowCount) {
								if (rowCount) {
									logger.info("Number of rows in List view: " + rowCount);
									return "Found Rows";
								} else {
									logger.info("No rows found in List view: " + rowCount);
									return "No Data";
								}
							});
						})
					});
				} else {
					logger.info("No rows found in List view");
					return "No Data";
				}
			});
		}
	});
}

/**
 * Method to search list view
 * @param searchText
 */
health.prototype.searchTable = async function(searchText) {
	var self = this;
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(self.searchBarInput))), timeout.timeoutInMilis);
	return await element(by.css(self.searchBarInput)).click().then(async function () {
		logger.info("Focused on search bar textbox");
		return await element(by.css(self.searchBarInput)).clear().sendKeys(searchText + protractor.Key.ENTER).then(async function () {
			logger.info("Search for keyword - " + searchText);
			await self.isViewDetailsButtonDisplayed(healthTestData.zeroIndex);
			return true;
		});
	});
}

/**
 * Method to verify sorting in list view
 */
health.prototype.clickOnTableSort = async function (index) {
	util.waitForAngular();
	util.waitOnlyForInvisibilityOfCarbonDataLoader()
	var self = this;
	browser.wait(EC.elementToBeClickable(element.all(by.css(self.tableColumnTitleCss)).get(0)), timeout.timeoutInMilis);
	util.scrollToWebElement(element(by.css(self.tableColumnTitleCss)));
	browser.wait(EC.visibilityOf(element(by.css(self.tableColumnTitleCss))), timeout.timeoutInMilis);
	return await element.all(by.css(self.tableColumnTitleCss)).get(index).click().then(async function () {
	    var tableSortedColumnName = await element.all(by.css(self.tableColumnTitleCss)).get(index).getText();
	    logger.info("Table Sorted Column Name :", tableSortedColumnName);
		logger.info("Clicked on Sort in List view table");
		util.waitOnlyForInvisibilityOfCarbonDataLoader()
		return true;
	});
};

/*
* Method to verify dropdown filter
*/
health.prototype.verifyDropdownFilter = function (placeholder, filterOptions, tabCheck) {
	if (tabCheck !== 'noTab') {
		util.waitForDashboardTab();
	}
	var self = this;
	browser.wait(EC.visibilityOf(element.all(by.css(self.tableFilterPlaceholder)).get(0)), timeout.timeoutInMilis);
	return element.all(by.css(self.tableFilterPlaceholder)).getText().then(function (text) {
		logger.info('Filter placeholder actual - ');
		logger.info(text.toString().trim());
		logger.info('Filter placeholder expected - ');
		logger.info(placeholder);
		let index = text.indexOf(placeholder);
		if (text.indexOf(placeholder) > -1) {
			browser.wait(EC.visibilityOf(element.all(by.css(self.tableFilterSelectionIcon)).get(index)), timeout.timeoutInMilis);
			return element.all(by.css(self.tableFilterSelectionIcon)).get(index).click().then(function () {
				logger.info("Filter selection icon clicked");
				browser.wait(EC.visibilityOf(element.all(by.css(self.tableFilterOptions)).get(index)), timeout.timeoutInMilis);
				return element.all(by.css(self.tableFilterOptions)).getText().then(function (options) {
					logger.info('Filter options actual - ');
					logger.info(options.toString().trim());
					logger.info('Filter options expected - ');
					logger.info(filterOptions);
					if (options.toString().trim() === filterOptions) {
						self.clickCheckBox('Unchecked', options, filterOptions);
						self.clickCheckBox('Checked', options, filterOptions);
						return true;
					} else {
						logger.info('Filter options not matching');
						return false;
					}
				});
			});
		} else {
			logger.info('Filter placeholder not found');
			return false;
		}
	});
}

/**
 * Method to check/uncheck filter options
 */
health.prototype.clickCheckBox = function (type, options, filterOptions) {
	for (var i = 0; i < options.length; i++) {
		let option = options[i].trim();
		if (filterOptions.indexOf(option) > -1) {
			util.waitForAngular();
			element.all(by.css(this.tableFilterOptions)).get(i).click().then(function () {
				logger.info(type + " an option  - " + option);
			});
		}
	}
}

/**
 * Method to click on resource id link
 */
health.prototype.clickOnIdLink = async function () {
	var self = this;
	util.waitOnlyForInvisibilityOfCarbonDataLoader();
	browser.wait(EC.visibilityOf(element(by.css(self.idLinkCss))), timeout.timeoutInMilis);
	return await element.all(by.css(self.idLinkCss)).getText().then(async function (ids) {
		logger.info("ID links count - " + ids.length);
		let index = -1;
		let id;
		for (var i = 0; i < 1; i++) {
			if (ids[i] !== '--') {
				index = i;
				id = ids[i];
				logger.info("ID link found - " + ids[i]);
				break;
			}
		}
		if (index > -1) {
			return await element.all(by.css(self.idLinkCss)).get(index).click().then(async function () {
				logger.info("Clicked on ID link - " + ids[i]);
				return id;
			});
		} else {
			logger.info("No IDs found");
			return [true, ''];
		}
	});
}

/**
 * Method to verify Resource id click
 */
health.prototype.verifyResourceIdClick = async function () {
	await expect(this.isTableDisplayed()).toBe(true);
	util.waitOnlyForInvisibilityOfCarbonDataLoader();
	let result = await this.clickOnIdLink();
	if (result && result.length === 2 && result[1] !== '') {
		await expect(this.resourceOverviewTitle()).toEqual(healthTestData.OverviewTitle);
		return true;
	} else {
		return false;
	}
}

/**
 * Method to verify Application Details Page and Resource Detail page overview title
 */
health.prototype.getViewDetailsOverviewLabelText = async function () {
    var self = this;
    util.waitOnlyForInvisibilityOfCarbonDataLoader();
	browser.wait(EC.visibilityOf(element(by.css(self.detailsPageOverviewTitleCss))), timeout.timeoutInMilis);
	return await element(by.css(self.detailsPageOverviewTitleCss)).getText().then(async function (text) {
		logger.info("Details Page overview title text - " + text.trim());
		return text.trim();
	});
}

/* Method to check either Table setting Icon is displaying or not */
health.prototype.isTableSettingsIconDisplayed = function() {
    util.waitForAngular();
    var self = this;
    browser.wait(EC.visibilityOf(element(by.id(self.tableSettingsId))), timeout.timeoutInMilis);
    return element(by.id(self.tableSettingsId)).isDisplayed().then(function (result) {
    	if (result == true) {
    		logger.info("Table settings icon is Present.");
    	}
    	else {
    		logger.info("Table settings icon is not Present.");
    	}
   		return result;
    });
}

/* Method to CLick on Table Setting Icon */
health.prototype.clickOnTableSettingsIcon = async function () {
	util.waitForAngular();
	var self = this;
	browser.wait(EC.visibilityOf(element(by.id(self.tableSettingsId))), timeout.timeoutInMilis);
	browser.wait(EC.visibilityOf(element.all(by.css(this.listViewHeaderCss)).get(0)), timeout.timeoutInMilis);
	await element(by.id(self.tableSettingsId)).click();
	logger.info("Clicked on table settings icon");
}

/**
 * Method to verify if table settings menu is expanded or not
 */
health.prototype.verifyIsTableSettingsMenuExpanded = async function () {
	util.waitForAngular();
	var self = this;
	var headerText;
	browser.wait(EC.visibilityOf(element(by.css(self.tableSettingsHeaderTextCss))), timeout.timeoutInMilis);
	return await element(by.css(self.tableSettingsHeaderTextCss)).getText().then(function (text) {
	    headerText = text.trim();
		logger.info("Table settings panel is expanded with header :", headerText);
		return headerText;
	});
}

/* Method to get all column names displaying in Table settings Menu */
health.prototype.getTableSettingsMenuAllColumnNames = async function () {
	util.waitForAngular();
	var self = this;
	var columnNames = [];
	browser.wait(EC.visibilityOf(element.all(by.css(self.tableSettingsColumnsNameCss)).get(0)), timeout.timeoutInMilis);
	return await element.all(by.css(self.tableSettingsColumnsNameCss)).count().then(async function (columnsCount) {
		logger.info("Total columns count in Table settings menu : " + columnsCount);
		columnNames = await element.all(by.css(self.tableSettingsColumnsNameCss)).getText();
		logger.info("List of Columns name displaying in Table settings menu : " + columnNames);
		return columnNames;
	});
}

/* Method to get list of checked / unchecked Columns Names from Table settings Menu */
health.prototype.getCheckedUncheckedAndDisabledColumnsFromTableSettingsMenu = async function () {
    util.waitForAngular();
	var self = this;
	var selectedColumns = [], unSelectedColumns = [], defaultCheckedDisabledColumns = [], selectedColumnsListWithDisabledColumns = [];
	var checkedStatus, disabledColumnStatus, checkboxesLocation;
	browser.wait(EC.visibilityOf(element.all(by.xpath(self.tableSettingsColumnsCheckboxXpath)).get(0)), timeout.timeoutInMilis);
	return await element.all(by.xpath(self.tableSettingsColumnsCheckboxXpath)).count().then(async function (columnsCheckboxCount) {
		logger.info("Total count of columns having checkboxes in Table settings : " + columnsCheckboxCount);
		for (var i = 0; i < columnsCheckboxCount; i++) {
		    checkboxesLocation = element.all(by.xpath(self.tableSettingsColumnsCheckboxXpath)).get(i);
			checkedStatus = await checkboxesLocation.getAttribute("aria-checked");
			disabledColumnStatus = await checkboxesLocation.getAttribute("Disabled");

			if (disabledColumnStatus == 'true' && checkedStatus == 'true') {
			    defaultCheckedDisabledColumns.push(await checkboxesLocation.getAttribute("name"));
			}
			else if (checkedStatus == 'true' && (await checkboxesLocation.isPresent())) {
              	selectedColumns.push(await checkboxesLocation.getAttribute("name"));
            }
			else if (checkedStatus == 'false') {
				unSelectedColumns.push(await checkboxesLocation.getAttribute("name"));
			}
		}
		selectedColumnsListWithDisabledColumns = defaultCheckedDisabledColumns.concat(selectedColumns);
		logger.info("List of default checked disabled columns name :", defaultCheckedDisabledColumns);
		logger.info("List of selected columns name excluding disabled columns :", selectedColumns);
		logger.info("List of selected columns name including disabled columns :", selectedColumnsListWithDisabledColumns);
		logger.info("List of unSelected columns name :", unSelectedColumns);
		return { selectedColumns, unSelectedColumns, defaultCheckedDisabledColumns, selectedColumnsListWithDisabledColumns }
	});
}

/* Method to get 'All Columns' option text and checkbox status table settings menu*/
health.prototype.verifyAllColumnsOptionFromTableSettings = async function() {
    util.waitForAngular();
    var self = this;
    var allColumnsCheckbox, allColumnsFieldTextName;
    allColumnsCheckbox = element(by.xpath(self.tableSettingsAllColumnCheckboxXpath));
    browser.wait(EC.visibilityOf(allColumnsCheckbox), timeout.timeoutInMilis);
    return await allColumnsCheckbox.getAttribute("aria-checked").then(async function(checkBoxStatus) {
        allColumnsFieldTextName = await element(by.xpath(self.tableSettingsAllColumnTextXpath)).getText();
        return {allColumnsCheckbox, checkBoxStatus, allColumnsFieldTextName};
    });
}


/* Method to check / uncheck 'all columns' field in table settings menu*/
health.prototype.clickAllColumnsOptionFromTableSettings = async function(){
    var self = this;
    var allColumnsField = await self.verifyAllColumnsOptionFromTableSettings();
    if(allColumnsField.checkBoxStatus === 'false') {
            logger.info("By default", allColumnsField.allColumnsFieldTextName,"checkbox is unchecked.");
            await element(by.xpath(self.tableSettingsAllColumnTextXpath)).click();
            logger.info("Clicked on unchecked",allColumnsField.allColumnsFieldTextName,"option");
            await self.getCheckedUncheckedAndDisabledColumnsFromTableSettingsMenu();
    } else {
            await element(by.xpath(self.tableSettingsAllColumnTextXpath)).click();
            logger.info("Clicked on checked",allColumnsField.allColumnsFieldTextName,"option");
            await self.getCheckedUncheckedAndDisabledColumnsFromTableSettingsMenu();
    }
}

/**
 * Method to check/uncheck the column headers from table setting panel
 */
health.prototype.clickToSelectUnselectColumnsInTableSettingsMenu = async function (columnsToSelectUnselect, allColumnsList) {
	util.waitForAngular();
	var self = this;
	browser.wait(EC.visibilityOf(element.all(by.xpath(self.tableSettingsColumnsCheckboxXpath)).get(0)), timeout.timeoutInMilis);
	await element.all(by.xpath(self.tableSettingsColumnsCheckboxXpath)).count().then(async function () {
		for (var index = 0; index < columnsToSelectUnselect.length; index++) {
		    var i = allColumnsList.indexOf(columnsToSelectUnselect[index]);
			await element.all(by.css(self.tableSettingsColumnsNameCss)).get(allColumnsList.indexOf(columnsToSelectUnselect[index])).click();
			logger.info("selected " + columnsToSelectUnselect[index] + " column.");
		}
	});
}

/**
 * Method to click on apply/cancel/reset button
 */
health.prototype.clickOnApplyResetCancelButton = async function (buttonNameToSelect) {
	util.waitForAngular();
	var self = this;
	var buttonXpath = self.tableSettingsApplyResetCancelButtonsXpath.format(buttonNameToSelect);
	browser.wait(EC.visibilityOf(element(by.xpath(buttonXpath))), timeout.timeoutInMilis);
	var buttonText = element(by.xpath(buttonXpath)).getText();
	return await buttonText.then(async function(buttonName) {
	    if(buttonNameToSelect === buttonName) {
	        await element(by.xpath(buttonXpath)).click();
            logger.info("Clicked on :",buttonName);
            browser.wait(EC.visibilityOf(element.all(by.css(self.listViewHeaderCss)).get(0)), timeout.timeoutInMilis);
        }
        return buttonText;
	});
}

/**
 * Method to click on close icon in table settings menu
 */
health.prototype.closeTableSettingsMenu = async function () {
	util.waitForAngular();
	var self = this;
	browser.wait(EC.visibilityOf(element(by.css(self.tableSettingsCloseIconCss))), timeout.timeoutInMilis);
    return element(by.css(self.tableSettingsCloseIconCss)).isDisplayed().then(async function (result) {
    	if (result == true) {
    		await element(by.css(self.tableSettingsCloseIconCss)).click();
            logger.info("Clicked on close (x) icon in table settings menu");
    	}
    	else {
    		logger.info("Close (x) icon is not found in table settings menu .");
    	}
    });
}

/* Method to drag and drop table settings column */
health.prototype.dragAndDropTableSettingsColumn = async function(source, destination) {
    util.waitForAngular();
    var self = this;
    logger.info("Source Column name : ", source);
    logger.info("Destination Column name :" , destination);
    var sourceColumn = self.tableSettingColumnToDragDropXpath.format(source);
    var destinationColumn = self.tableSettingColumnToDragDropXpath.format(destination);
    var locateSourceColumn = element(by.xpath(sourceColumn));
    var locateDestinationColumn = element(by.xpath(destinationColumn));
    await browser.actions().mouseMove(await locateSourceColumn.getWebElement()).perform();
    await browser.actions().mouseDown(await locateSourceColumn.getWebElement()).perform();
    await browser.actions().mouseMove(await locateDestinationColumn.getWebElement()).perform();
    await browser.actions().mouseDown(await locateDestinationColumn.getWebElement()).perform();
    await browser.actions().mouseUp().perform();
    logger.info(source,"column is dropped successfully before",destination, "column");
}

/*
 * Method to get 'Apply filter' button enabled / disabled status in Global Filter Panel
*/
health.prototype.isGlobalFilterApplyButtonEnabled = async function() {
    var self = this;
    util.waitForAngular();
    return await element(by.css(self.applyFilterButtonCss)).isEnabled().then(async function(status){
        if(status) {
            logger.info("Global Filter Apply button is enabled.");
        } else {
            logger.info("Global Filter Apply button is disabled.");
        }
        return status;
    });
}

/*
 * Method to get 'Reset link' button enabled / disabled status in Global Filter Panel
*/
health.prototype.isGlobalFilterResetLinkEnabled = async function() {
    var self = this;
    util.waitForAngular();
    return await element(by.css(self.globalFilterResetButtonDisableCss)).isPresent().then(async function(status){
        if(status) {
            logger.info("Global Filter Reset link is disabled.");
        } else {
            logger.info("Global Filter Reset link is enabled.");
        }
        return !status;
    });
}

/*
 * Method to check if any provider is selected or not in Global Filter section
*/
health.prototype.isGlobalFilterSelectedOptionTagPresent = async function() {
    var self = this;
    util.waitForAngular();
    return await element(by.xpath(self.selectedMcDcProviderGlobalFilterOptionTagXpath)).isPresent().then(async function(status){
        return status;
    });
}

/*
 * Get Global filter options selection details
*/
health.prototype.getTeamAppCategoriesSectionDisabledStatus = async function(providerType) {
    var self = this;
    util.waitForAngular();
    var selectedProviderTagStatus = await self.isGlobalFilterSelectedOptionTagPresent();
    if(selectedProviderTagStatus) {
            logger.info("Provider is selected in Global Filter.");
            return await element(by.css(self.globalFilterDisabledSectionCss)).isPresent().then(async function(status){
                if(status) {
                    var disabledSectionTitleCss = self.globalFilterDisabledSectionCss + ' .parentLabel';
                    await element(by.css(disabledSectionTitleCss)).getText().then(async function(disabledSectionText){
                        logger.info(disabledSectionText, " Section is disabled on selecting '",providerType,"' provider.");
                    });
                }
                else {
                    logger.info("No disabled section is found. All sections are enabled");
                }
                return status;
            });
    }
    else {
        logger.info("No provider is selected in Global Filter.");
        return selectedProviderTagStatus;
    }
}

/*
 * Method to Get MC and DC providers name from Global Filter
*/
health.prototype.getGlobalFilterMcDcProvidersList = async function() {
    var self = this;
    util.waitForAngular();
    var mcProviders = [], dcProviders = [];
    browser.wait(EC.visibilityOf(element.all(by.xpath(self.mcGlobalFilterXpath)).get(0)), timeout.timeoutInMilis);
    browser.wait(EC.visibilityOf(element.all(by.xpath(self.dcGlobalFilterXpath)).get(0)), timeout.timeoutInMilis);
    await element.all(by.xpath(self.mcGlobalFilterXpath)).getText().then(function(mcProvidersList){
       mcProviders = mcProvidersList;
    });
    await element.all(by.xpath(self.dcGlobalFilterXpath)).getText().then(function(dcProvidersList){
       dcProviders = dcProvidersList;
    });
    logger.info("Global Filter MC Providers :", mcProviders);
    logger.info("Global Filter DC Providers :", dcProviders);
    return {mcProviders, dcProviders};
}


/*
 * Method to check either selected filter dropdown is present or not in Global filter panel
*/
health.prototype.isGlobalFilterSelectedFilterDropdownPresent = async function() {
    var self = this;
    util.waitForAngular();
    browser.wait(EC.visibilityOf(element(by.css(self.globalFilterSelectFilterDropdownCss))), timeout.timeoutInMilis);
    return element(by.css(self.globalFilterSelectFilterDropdownCss)).isPresent().then(function(status){
        if(status) {
            logger.info("Selected Filter dropdown is displaying in Global Filter Panel.");
        }
        else {
           logger.info("Selected Filter dropdown is not displaying in Global Filter Panel.");
        }
        return status;
    });
}

/*
 * Method to check either save filter options are enabled or not in Global filter panel
*/
health.prototype.isGlobalFilterSaveDeleteFilterOptionsEnabled = async function() {
    var self = this;
    util.waitForAngular();
    var optionsList = [];
    var saveOptionStatus, saveAsNewStatus, deleteStatus;
    browser.wait(EC.visibilityOf(element(by.css(self.globalFilterVerticalOverflowMenuCss))), timeout.timeoutInMilis);
    return await element(by.css(self.globalFilterVerticalOverflowMenuCss)).isPresent().then(async function(status){
            if(status) {
                logger.info("Save filter vertical dots option is displaying in Global Filter Panel.");
                await element(by.css(self.globalFilterVerticalOverflowMenuCss)).click();
                logger.info("Clicked on Save filter vertical overflow menu");
                browser.wait(EC.visibilityOf(element.all(by.css(self.globalFilterVerticalOverflowMenuOptionsCss)).get(0)), timeout.timeoutInMilis);
                await element.all(by.css(self.globalFilterVerticalOverflowMenuOptionsCss)).count().then(async function(optionsCount){
                    for(var i=0; i<optionsCount; i++) {
                        optionsList = await element.all(by.css(self.globalFilterVerticalOverflowMenuOptionsCss)).getText();
                        var optionsVisibilityStatus = await element.all(by.css(self.globalFilterSaveMenuVisibilityCss)).isPresent();
                            if(optionsVisibilityStatus == true) {
                                var disableText = await element.all(by.css(self.globalFilterSaveMenuVisibilityCss)).getText();
                                if(disableText.includes('Save')) {
                                    saveOptionStatus = optionsVisibilityStatus;
                                    logger.info("Save option disable status:", saveOptionStatus);
                                } else {
                                    saveOptionStatus = !optionsVisibilityStatus;
                                }
                                if(disableText.includes('Save as new')){
                                    saveAsNewStatus = optionsVisibilityStatus;
                                    logger.info("Save as new option disable status:", saveAsNewStatus);
                                } else {
                                    saveAsNewStatus = !optionsVisibilityStatus;
                                }
                                if(disableText.includes('Delete')){
                                    deleteStatus = optionsVisibilityStatus;
                                    logger.info("Delete option disable status:", deleteStatus);
                                } else {
                                    deleteStatus = !optionsVisibilityStatus;
                                }
                            }
                            else if (optionsVisibilityStatus == false) {
                                if(optionsList.includes('Save')) {
                                    saveOptionStatus = optionsVisibilityStatus;
                                    logger.info("Save option disable status:", saveOptionStatus);
                                    logger.info("Save option is enabled in save filter menu to perform action.");
                                }
                                else if(optionsList.includes('Save as new')) {
                                    saveAsNewStatus = optionsVisibilityStatus;
                                    logger.info("Save as new option disable status:", saveAsNewStatus);
                                    logger.info("Save as new option is enabled in save filter menu to perform action.");
                                }
                                else if(optionsList.includes('Delete')) {
                                    deleteStatus = optionsVisibilityStatus;
                                    logger.info("Delete option disable status:", deleteStatus);
                                    logger.info("Delete option is enabled in save filter menu to perform action.");
                                }
                            }
                    }
                });
            }
            else {
               logger.info("Save filter vertical dots option is not displaying in Global Filter Panel.");
            }
        logger.info("Available option to save a filter:", optionsList);
        return {optionsList, saveOptionStatus, saveAsNewStatus, deleteStatus};
    });
}

/*
 Method to get total count and list of options available in each sections of Global Filter, Close popup.
*/
health.prototype.getOptionsListBasedOnSectionNameInGlobalFilter = async function(sectionName) {
    util.waitOnlyForInvisibilityOfCarbonDataLoader();
    var self = this;
    var optionsList, optionsCount;
    if(sectionName === healthTestData.globalFilterMainCategories[healthTestData.oneIndex]) {
        sectionName = 'teams';
    } else if(sectionName === healthTestData.globalFilterApplicationCategories) {
        sectionName = 'AppCategories';
    } else if(sectionName === healthTestData.applicationsLabelText) {
        sectionName = 'applications';
    }
    var globalFilterSectionsXpathBasedOnName = self.globalFilterSectionsXpath.format(sectionName);
    var globalFilterSectionOptionsList = self.globalFilterSubSectionsCheckboxOptionsXpath.format(sectionName);
    var globalFilterSectionMoreLink = self.globalFilterSectionsMoreLinkXpath.format(sectionName);
    browser.wait(EC.visibilityOf(element(by.xpath(globalFilterSectionsXpathBasedOnName))), timeout.timeoutInMilis);
    return await element.all(by.xpath(globalFilterSectionOptionsList)).isPresent().then(async function(status){
        if(status == true) {
            optionsCount = await element.all(by.xpath(globalFilterSectionOptionsList)).count();
             await element(by.xpath(globalFilterSectionMoreLink)).isPresent().then(async function(isMoreLinkPresent){
                if(isMoreLinkPresent == true && optionsCount <= 4) {
                    var moreLinkText = await element(by.xpath(globalFilterSectionMoreLink)).getText();
                    await element(by.xpath(globalFilterSectionMoreLink)).click();
                    logger.info("Clicked on '"+moreLinkText+"' of '"+sectionName+"'");
                    browser.wait(EC.visibilityOf(element(by.css(self.morePopupCloseBtnCss))), timeout.timeoutInMilis);
                    optionsCount = await element.all(by.css(self.globalFilterMorePopupCss)).count();
                    optionsList = await element.all(by.css(self.globalFilterMorePopupCss)).getText();
                    element(by.css(self.morePopupCloseBtnCss)).click();
                    logger.info("Closed '"+sectionName+"' popup");
                }
                else if(isMoreLinkPresent == false) {
                    logger.info("Total options available in '"+sectionName+"':",optionsCount);
                    optionsList = await element.all(by.xpath(globalFilterSectionOptionsList)).getText();
                }
            });
        }
        else {
            logger.info("No option is available in'",sectionName,"'");
        }
        logger.info(sectionName,"options List:",optionsList);
        logger.info(sectionName,"options Count:",optionsCount);
        return{optionsList, optionsCount};
    });
}

/*
 Method to get total count and list of options available to perform action in each sections of Global Filter.
 Method to handle More popup to perform options selection  - without closing popup
*/
health.prototype.globalFilterSectionsMorePopupSelection = async function(sectionName) {
    util.waitOnlyForInvisibilityOfCarbonDataLoader();
    var self = this;
    var optionsList, optionsCount;
    if(sectionName === healthTestData.globalFilterMainCategories[healthTestData.oneIndex]) {
        sectionName = 'teams';
    } else if(sectionName === healthTestData.globalFilterApplicationCategories) {
        sectionName = 'AppCategories';
    } else if(sectionName === healthTestData.applicationsLabelText) {
        sectionName = 'applications';
    }
    var globalFilterSectionsXpathBasedOnName = self.globalFilterSectionsXpath.format(sectionName);
    var globalFilterSectionOptionsList = self.globalFilterSubSectionsCheckboxOptionsXpath.format(sectionName);
    var globalFilterSectionMoreLink = self.globalFilterSectionsMoreLinkXpath.format(sectionName);
    browser.wait(EC.visibilityOf(element(by.xpath(globalFilterSectionsXpathBasedOnName))), timeout.timeoutInMilis);
    return await element.all(by.xpath(globalFilterSectionOptionsList)).isPresent().then(async function(status){
        if(status == true) {
            optionsCount = await element.all(by.xpath(globalFilterSectionOptionsList)).count();
             await element(by.xpath(globalFilterSectionMoreLink)).isPresent().then(async function(isMoreLinkPresent){
                if(isMoreLinkPresent == true && optionsCount <= 4) {
                    var moreLinkText = await element(by.xpath(globalFilterSectionMoreLink)).getText();
                    await element(by.xpath(globalFilterSectionMoreLink)).click();
                    logger.info("Clicked on '"+moreLinkText+"' of '"+sectionName+"'");
                    optionsCount = await element.all(by.css(self.globalFilterMorePopupCss)).count();
                    optionsList = await element.all(by.css(self.globalFilterMorePopupCss)).getText();
					}
                else if(isMoreLinkPresent == false) {
                    logger.info("Total options available in '"+sectionName+"':",optionsCount);
                    optionsList = await element.all(by.xpath(globalFilterSectionOptionsList)).getText();
                }
            });
        }
        else {
            logger.info("No option is available in'",sectionName,"'");
        }
        logger.info(sectionName,"options List:",optionsList);
        logger.info(sectionName,"options Count:",optionsCount);
        return{optionsList, optionsCount};
    });
}

/**
 * Method to click on critical slice from Donut Chart
 */

health.prototype.clickOnCriticalSliceFromDonutChart = function(){
	var self = this;
	util.waitForAngular();
	return browser.wait(EC.visibilityOf(element(by.xpath(this.criticalSliceFromDonutChartXpath))), timeout.timeoutInMilis).then(function(){
		element(by.xpath(self.criticalSliceFromDonutChartXpath)).click().then(function(){
			logger.info("Clicked on Critical slice from donut chart..");
		});
	});
}

/**
 * Method to click on warning slice from Donut Chart
 */


health.prototype.clickOnWarningSliceFromDonutChart = function(){
	var self = this;
	util.waitForAngular();
	return browser.wait(EC.visibilityOf(element(by.xpath(this.warningSliceFromDonutChartXpath))), timeout.timeoutInMilis).then(function(){
		element(by.xpath(self.warningSliceFromDonutChartXpath)).click().then(function(){
			logger.info("Clicked on Warning slice from donut chart..");
		});
	});
}


health.prototype.getAppRescTotalCountBaseOnSelectedColumnValue = async function(selectedValue, selectedTab, selectedHeaderName) {
    util.waitOnlyForInvisibilityOfCarbonDataLoader();
    var self = this;
    var listCount = 0, totalRecordsCount = 0;
    var status = await self.checkListViewSpecificColumnRecordsBasedOnName(selectedValue, selectedHeaderName);
    if(status.status === true) {
        var pageCount = await self.getPageCountForAppsResourcesTable();
        var totalCount = await self.getCountOfLinks("Health", pageCount);
        totalRecordsCount = totalCount.totalItemsCount;
        logger.info("Total Items in List view after count per page:", totalRecordsCount);
        listCount = await self.getApplicationsResourcesSectionLabelCountFromHealthAndCommandCenter(selectedTab);
    }
    return {listCount, totalRecordsCount};
}


health.prototype.performanceUtilizationSelectFilterByOption = async function(optionToSelect) {
    util.waitOnlyForInvisibilityOfCarbonDataLoader();
    var self  = this;
    await element(by.css(self.utilizationFilterByDropdownCss)).isPresent().then(async function(status){
        if(status == true) {
            await element(by.css(self.utilizationFilterByDropdownCss)).click();
            var filterByOption = self.utilizationFilterByDropdownOptionsXpath.format(optionToSelect);
            browser.wait(EC.presenceOf(element(by.xpath(filterByOption))), timeout.timeoutInMilis);
            browser.wait(EC.elementToBeClickable(element(by.xpath(filterByOption))), timeout.timeoutInMilis);
            var optionName = await element(by.xpath(filterByOption)).getText();
            await element(by.xpath(filterByOption)).click();
            logger.info("Selected '"+optionName+ "' option from dropdown.");
        } else {
            logger.info("Filter options are not available");
        }
    });
}


health.prototype.azureSupportGraphTabs = async function(resourcesType) {
    util.waitOnlyForInvisibilityOfCarbonDataLoader();
    var self  = this;
    var tabNamesList = [];
    await element.all(by.css(self.azureSupportUtilizationGraphTabsCss)).isPresent().then(async function(status){
        if(status == true) {
            await element.all(by.css(self.azureSupportUtilizationGraphTabsCss)).getText().then(async function(tabNames){
                for(var i=0; i < tabNames.length; i++) {
                    tabNamesList.push(tabNames[i]);
                }
                logger.info("Tab Names for '",resourcesType,"' :", tabNamesList);
            });
        }
        else {
            logger.info("No Data to display");
        }
    });
    return tabNamesList;
}


health.prototype.getMetricsDropDownValueCount = async function() {
	util.waitOnlyForInvisibilityOfCarbonDataLoader();
	var self  = this;
	browser.wait(EC.visibilityOf(element(by.css(self.leftAxisMetricsLabel))), timeout.timeoutInMilis);
	browser.wait(EC.presenceOf(element.all(by.css(self.metricsDropdownValuesCss)).get(0)), timeout.timeoutInMilis);
	var count = await element.all(by.css(self.metricsDropdownValuesCss)).count();
	return count;
}

health.prototype.expandResouceCompareDropDown = async function() {
	util.waitOnlyForInvisibilityOfCarbonDataLoader();
	var self  = this;
	browser.wait(EC.elementToBeClickable(element(by.css(self.resourceCompareDropDownExpandCss))), timeout.timeoutInMilis);
	await element(by.css(self.resourceCompareDropDownExpandCss)).click();
	logger.info('Expanded resource compare dropdown menu');
}

health.prototype.expandMetricsTrendDropDown = async function() {
	util.waitOnlyForInvisibilityOfCarbonDataLoader();
	var self  = this;
	browser.wait(EC.elementToBeClickable(element(by.css(self.metricsTrendDropDownExpandCss))), timeout.timeoutInMilis);
	await element(by.css(self.metricsTrendDropDownExpandCss)).click();
	logger.info('Expanded metrics trend dropdown menu');
}

health.prototype.clickOnMetricsTabAndSelectDropDownValues = async function() {
    util.waitOnlyForInvisibilityOfCarbonDataLoader();
	var self  = this;
	var status = await element(by.css(self.checkNoMetricsData)).isPresent();
	if(status){
		logger.info(" No data available at this time.")
		return true
	}
	await this.expandResouceCompareDropDown();
	var count = await this.getMetricsDropDownValueCount();
	util.waitOnlyForInvisibilityOfCarbonDataLoader();
	if(count > 0){
		logger.info('Drop down has values to select')
		for(var i=1 ; i<count ; i++){
			if(i <= 4){
				browser.wait(EC.visibilityOf(element(by.css(self.leftAxisMetricsLabel))), timeout.timeoutInMilis);
				await browser.actions().mouseMove(element.all(by.css(self.metricsDropdownValuesCss)).get(i)).perform();
				await element.all(by.css(self.metricsDropdownValuesCss)).get(i).click();
				await element(by.css(self.resourceCompareDropDownExpandCss)).click();
				util.waitOnlyForInvisibilityOfCarbonDataLoader();
			}
		}
		if(count > 4){
			var selectedCount = await element.all(by.css(self.metricsDropdownValuesCss)).count();
			logger.info('Selected dropdown count is ' + selectedCount)
			if(selectedCount != 4){
				return false
			} 
			return true
		}
	}
}

health.prototype.clickOnMetricsTabAndCompare = async function() {
	util.waitOnlyForInvisibilityOfCarbonDataLoader();
	var self  = this;
	var status = await element(by.css(self.checkNoMetricsData)).isPresent();
	if(status){
		logger.info(" No data available at this time.")
		return true
	}
	// get metrics trend dropdown count
	await this.expandMetricsTrendDropDown();
	var metricsTrendCount = await this.getMetricsDropDownValueCount();
	await this.expandMetricsTrendDropDown();
	// get resource compare dropdown count
	await this.expandResouceCompareDropDown();
	var resourceCompareCount = await this.getMetricsDropDownValueCount();
	await this.expandResouceCompareDropDown();
	logger.info('metricsTrendCount',metricsTrendCount,'resourceCompareCount',resourceCompareCount)
	// select 2nd index of metrics trend
	if(metricsTrendCount > 1){
		await this.expandMetricsTrendDropDown();
		await element.all(by.css(self.metricsDropdownValuesCss)).get(1).click();
		util.waitOnlyForInvisibilityOfCarbonDataLoader();
		await element(by.css(self.metricsTrendDropDownExpandCss)).click();
		// get resource compare dropdown count
		await this.expandResouceCompareDropDown();
		var resourceCompareCountAfterSelectingCategory = await this.getMetricsDropDownValueCount();
		if(resourceCompareCount !== resourceCompareCountAfterSelectingCategory){
			return false
		}
	}
	return true
}

module.exports = health;