# AIOPS 2.0 UI Automation
Repo for all the consume ui test automation. <br>
- [Pre Reqs](#pre-reqs)<br>
    - [Install Dependencies](#install-dependencies)<br>
    - [Adding user and New Env](#adding-user-and-new-env)<br>
- [Running Protractor Tests](#running-protractor-tests)<br>
- [Useful Links](#useful-links)<br>

## Pre Reqs <br>
### Install Dependencies:
1. Upgrade node to version 7 or greater. async and await functionality requires node 7 or greater<br>
2. Install the following package <br>
    **protractor** - To run all the tests. **```npm install -g protractor```**<br>
    **webdriver-manager** - To interact with browser. **npm install webdriver-manager**<br>
    **jasmine-reporters** - To report the test results. **```npm install jasmine-reporters```**<br>
    **xml2js** - To parse and read the jasmine report. **```npm install xml2js```** <br>
    **request** - To make api calls. **```npm install request```**<br>
    **request-promise** - To make slack webhook-api calls. **```npm install request-promise```**<br>
    **extend** - **```npm install extend```**<br>
    **protractor-html-reporter** - To generate html report **```npm install protractor-html-reporter```**
    **npm install log4js** ---to install the log4j Module
	**npm install exceljs** -- To work with excel reports
3. Run ```npm list``` to make sure you can find all the above mention listed as a package. <br>
4. Check the java version in echo $JAVA_HOME it should say **8** .<br>
5. If required need change the path of java home in **.bash_profile** of mac or windows path.<br>

### Adding user and New Env:
Open aiopsSmokeConf.js ```aiops2_ui_automation``` and add your **environment** **username** **password** **secretKey** **userId** **apiKey** **tenantId**. Your new env info should be given as follows.<br> 

#### Example to add an env:
```aiopsSmokeConf.js
if (environment == null)
	environment = "aiops-svt-wpp-plc"
if (username == null)
	username = "XXXXXXXX@in.ibm.com"
if (password == null)
	password = "w3id password ********"
if (secretKey == null)
	secretKey = "user's google auth secret key *****"
if (userId == null)
	userId = "Application/Enviornment user id XXXXXXXXXXXXXX"
if (apiKey == null)
	apiKey = "Application/Envornment API Key ******************"
if (tenantId == null)
	tenantId = "Application/Enviornment tenant id 5e54ef4aXXXXXXXXXXXXXXXXX16d7"
```

## Running Protractor Tests
1. Open terminal and run ```webdriver-manager update```<br>  
2. Once webdriver-manager is updated run ```webdriver-manager start```<br>
3. In a new terminal and go to aiops2_ui_automation directory.<br>  
5. Run **protractor aiopsSmokeConf.js** <br>


## Useful Links
Jenkins daily regression run link can be found <a href = "https://gts-mcmpe2esvtauto-jenkins.swg-devops.com/job/AIOPS2_Dev2Fra_ES/">here</a><br>
Protractor API tutorial can be found <a href = "https://www.protractortest.org/#/api">here</a>


##Files And Folders Structure
1) aiops_reports - Application downloaded reports are available here.
2) e2e - Spec file and Page object model are designed in this folder.
3) elasticSearchTool - elk queries are defined in this folder with respect to specific card's.
4) helpers - Collection of functions used in different card's to perform specific task.
5) import_tags - Contains files for bulk import feature. 
6) logs - returns Logger method which can be used to print output.
7) testData - Contains Test data of this application.
8) aiopsSmokeConf.js - configuration file which has details like specs ,seleniumAddress, userDetails and other default configurations.
9) expected_values.json - Expected values for the test cases are added here.
10) package.json - Provides Metadata info and project dependencies.