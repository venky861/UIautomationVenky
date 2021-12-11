/**
 * Created by : Tejaswini
 * created on : 23/11/2021
 */
 "use strict";

 var logGenerator = require("../../helpers/logGenerator.js"),
     logger = logGenerator.getApplicationLogger(),
     mainframeInsightsPage = require('../pageObjects/mainframe_insights.pageObject.js'),
     appUrls = require('../../testData/appUrls.json'),
     dashboardTestData = require('../../testData/cards/dashboardTestData.json'),
     mainframeTestData = require('../../testData/cards/mainframeTestData.json'),
     dashboard = require('../pageObjects/dashboard.pageObject.js'),
     launchpad = require('../pageObjects/launchpad.pageObject.js'),
     launchpadTestData = require('../../testData/cards/launchpadTestData.json'),
     util = require('../../helpers/util.js'),
     serviceMgmtUtil = require('../../helpers/serviceMgmtUtil.js'),
     applicationUrl = browser.params.url,
     frames = require('../../testData/frames.json');


    describe('Mainframe - functionality ', function () {
        var mainframeInsights_page , dashboard_page, launchpad_page ;
        var globalFilterList = [mainframeTestData.LPAR,mainframeTestData.Date];
 
     beforeAll(function () {
         mainframeInsights_page = new mainframeInsightsPage();
         dashboard_page = new dashboard();
         launchpad_page = new launchpad();
         browser.driver.manage().window().maximize();
     });
 
     beforeEach(function () {
         launchpad_page.open();
         expect(launchpad_page.getWelcomeMessageTxt()).toEqual(launchpadTestData.welcome);
         mainframeInsights_page.open();
     })

    it('Verify tabs present in Mainframe Batch Insights', async function() { 
       await serviceMgmtUtil.clickOnTab(mainframeTestData.Pervasive_Abend_Reduction);
       await expect(serviceMgmtUtil.isTabLinkSelected(mainframeTestData.Pervasive_Abend_Reduction)).toBe(true);   
       await serviceMgmtUtil.clickOnTab(mainframeTestData.Adhoc_Audit);
       await expect(serviceMgmtUtil.isTabLinkSelected(mainframeTestData.Adhoc_Audit)).toBe(true);   
       await serviceMgmtUtil.clickOnTab(mainframeTestData.Executed_Jobs);
       await expect(serviceMgmtUtil.isTabLinkSelected(mainframeTestData.Executed_Jobs)).toBe(true);   

    });

    it('Verify global filter names for Abend_rate,Pervasive_Abend_Reduction,Adhoc_Audit and Executed Jobs', async function() { 
        await expect(serviceMgmtUtil.isTabLinkSelected(mainframeTestData.Abend_Rate)).toBe(true);
        util.switchToFrameById(frames.cssrIFrame);
		util.waitForInvisibilityOfKibanaDataLoader();
		await expect(await serviceMgmtUtil.getAllFiltersButtonNameText()).toEqual(jasmine.arrayContaining(globalFilterList)); 
        util.switchToDefault();
        util.switchToFrameById(frames.mcmpIframe);

        await serviceMgmtUtil.clickOnTab(mainframeTestData.Pervasive_Abend_Reduction);
        await expect(serviceMgmtUtil.isTabLinkSelected(mainframeTestData.Pervasive_Abend_Reduction)).toBe(true);   
        util.switchToFrameById(frames.cssrIFrame);
		util.waitForInvisibilityOfKibanaDataLoader();
		await expect(await serviceMgmtUtil.getAllFiltersButtonNameText()).toEqual(jasmine.arrayContaining(globalFilterList)); 
        util.switchToDefault();
        util.switchToFrameById(frames.mcmpIframe);


        await serviceMgmtUtil.clickOnTab(mainframeTestData.Adhoc_Audit);
        await expect(serviceMgmtUtil.isTabLinkSelected(mainframeTestData.Adhoc_Audit)).toBe(true);   
        util.switchToFrameById(frames.cssrIFrame);
		util.waitForInvisibilityOfKibanaDataLoader();
		await expect(await serviceMgmtUtil.getAllFiltersButtonNameText()).toEqual(jasmine.arrayContaining(globalFilterList)); 
        util.switchToDefault();
        util.switchToFrameById(frames.mcmpIframe);


        await serviceMgmtUtil.clickOnTab(mainframeTestData.Executed_Jobs);
        await expect(serviceMgmtUtil.isTabLinkSelected(mainframeTestData.Executed_Jobs)).toBe(true);   
        util.switchToFrameById(frames.cssrIFrame);
		util.waitForInvisibilityOfKibanaDataLoader();
		await expect(await serviceMgmtUtil.getAllFiltersButtonNameText()).toEqual(jasmine.arrayContaining(globalFilterList)); 
     });


    afterAll(async function() {
		await launchpad_page.clickOnLogoutAndLogin(browser.params.username, browser.params.password);
	});


    });