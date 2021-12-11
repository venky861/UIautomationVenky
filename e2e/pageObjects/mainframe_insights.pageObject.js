/**
 * Created by : Tejaswini
 * created on : 23/11/2021
 */

 "use strict";
 var extend = require('extend');
 var url = browser.params.url;
 var logGenerator = require("../../helpers/logGenerator.js"),
     logger = logGenerator.getApplicationLogger();
 var EC = protractor.ExpectedConditions;
 var util = require('../../helpers/util.js');
 var timeout = require('../../testData/timeout.json');
 var frames = require('../../testData/frames.json');
 var launchpadPage = require('./launchpad.pageObject.js'),
	launchpadObj = new launchpadPage();
 var launchpadTestData = require('../../testData/cards/launchpadTestData.json');
 var defaultConfig = {
    HeaderTitleTextCss: "label.pagetitle"
 };
 
function mainframe(selectorConfig) {
	if (!(this instanceof mainframe )) {
		return new (selectorConfig);
	}
	extend(this, defaultConfig);

	if (selectorConfig) {
		extend(this, selectorConfig);
	}
}

/**
 * Method to perform switch to default content then switch to frame 
 */
 mainframe.prototype.open = function(){
	util.waitForAngular();
	util.switchToDefault();
	launchpadObj.clickOnHamburgerMenu(launchpadTestData.leftNavigationExpanded);
	launchpadObj.clickOnleftNavigationMenuBasedOnName(launchpadTestData.aIOpsIntelligentITOperationsBtn);
	launchpadObj.clickLeftNavCardBasedOnName(launchpadTestData.mainframeInsights);
    util.switchToFrameById(frames.mcmpIframe);
	browser.sleep(5000);
};

/**
 * Method to get health header title text
 */
 mainframe.prototype.getHeaderTitleText = async function () {
	util.waitForAngular();
    //launchpadObj.clickOnShowAllTasksLink();
	browser.wait(EC.visibilityOf(element(by.css(this.HeaderTitleTextCss))), timeout.timeoutInMilis);
	return await element(by.css(this.HeaderTitleTextCss)).getText().then(function (text) {
		logger.info(" page header title text : " + text);
		return text;
	});
};


module.exports = mainframe;