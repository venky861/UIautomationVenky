"use strict";
const esManager  =  require('./esManager');
const util = require('../helpers/util');
var logGenerator = require("../helpers/logGenerator.js"),
	logger = logGenerator.getApplicationLogger();
const healthTestData = require('../testData/cards/healthTestData');

async function resources_health_status_count(index,tenant_id) {
    const body =
    {
    	 "query": {"bool": {"must": [{"match": {"tenant_id.keyword": tenant_id}}]}},
    	 "aggs":  {"health_status": {"terms": {"field": "health_status.keyword"}}},"size": 0
    }
    try {
    	 const response = await esManager.searchDoc(index, body);
    	 var bucket_results = response.aggregations["health_status"]["buckets"]
    	 var result = {}
    	 for(var i in bucket_results) {
             var health_status_name = bucket_results[i]["key"];
             var health_status_count = bucket_results[i]["doc_count"];
             result[health_status_name] = health_status_count;
		 }
	    var keys = Object.keys(result);
        if(!(keys.includes(healthTestData.resourceCriticalText))) {
                 result[healthTestData.resourceCriticalText] = 0;
        } else if(!(keys.includes(healthTestData.resourceWarningText))) {
                result[healthTestData.resourceWarningText] = 0;
        } else if(!(keys.includes(healthTestData.resourceHealthyText))) {
                result[healthTestData.resourceHealthyText] = 0;
        }
	     logger.info("Resources Health Status Result from Elastic Search: ", result);
    	 return result;
    }
    catch(e) {
        logger.info(e);
    }
}

async function ascResources_health_status_count(index,tenant_id,appName) {
    const body =
    {
        "query":{"bool":{"must":[{"match":{"tenant_id":tenant_id}}]}},
        "size":0,"track_total_hits":true,
        "aggs":{"applicationsName":{"terms":{"field":"context.application.keyword","size":1000000},
        "aggs":{"health":{"terms":{"field":"health_status.keyword","size":10,
        "order":{"_count":"desc"}}}}}}
    }
    try {
        var value;
        var result = {};
        const response = await esManager.searchDoc(index, body);
        var bucket_results = response.aggregations["applicationsName"]["buckets"];
        bucket_results.forEach((appResult)=>{
            var health_bucket_result = appResult["health"]["buckets"];
            if(appResult['key'] === appName){
                health_bucket_result.forEach((healthResult)=>{
                    var health_status_name = healthResult["key"];
                    var health_status_count = healthResult["doc_count"];
                    result[health_status_name] = health_status_count;
                });
            }
        });
        logger.info("Associated Resources Health Status with count for '"+appName+"' Application Result from Elastic Search: ", result);
        var response_object = {[appName]: {result}};
        logger.info(response_object);
        return result;
   }
    catch(e) {
        logger.info(e);
    }
}


async function getTotalAssociatedTicketsDetailsESResponse(index,tenant_id,incident_code_id) {
    const body =
    {
        "track_total_hits":true,"from":0, "size":1,
        "query":{"bool":{"must":[{"match":{"tenant_id":tenant_id}},
        {"match":{"incident_code_id.keyword":incident_code_id}}]}}
    }
    try {
    	 const response = await esManager.searchDoc(index, body);
         logger.info(" ticket full response value is"+response);
         var bucket_results = response.hits.hits;
         for(var app in bucket_results) {
    	    var name = Object.keys(bucket_results[app]['_source']);
            logger.info("keys are"+name);
    	    if (name.includes('status')) {
    	        var ticket_class = bucket_results[app]['_source']['incident_code_id'];
                var ticketStatus = bucket_results[app]['_source']['status'];
                return ticket_class;
            }
        }
    }
    catch(e) {
        logger.info(e)
    }
}

async function getAssociatedResourceDetailsESResponse(index, tenant_id, appName) {
    const body =
    {
        "track_total_hits": true, "from": 0, "size": 10,
         "sort": [
           {
             "_script": {
               "type": "number",
               "script": {
                 "lang": "painless",
                 "source": "if(doc['health_status.keyword'].size() != 0 && params.scores.containsKey(doc['health_status.keyword'].value)) { return params.scores[doc['health_status.keyword'].value];} return 1000;",
                 "params": {"scores": {"Critical": 0, "Warning": 1, "Healthy": 2, "": 3}}
               },"order": "asc"}},
               {"lastupdate": "desc"}, {"_id": "asc"}],
         "query": {"bool": {"must": [{"match": {"tenant_id.keyword":tenant_id}},
                                     {"match": {"context.application.keyword": appName}},
                  {"bool": {"should": [] }}], "should": [] }}
    }
    try {
    	 const response = await esManager.searchDoc(index, body);
         var bucket_results = response.hits.hits;
         logger.info("Result : ", bucket_results);
         for(var app in bucket_results) {
    	    var name = Object.keys(bucket_results[app]['_source']);
    	    if (name.includes('status')) {
    	        var provider_resource_name = bucket_results[app]['_source']['provider_resource_name'];
    	        logger.info("First resource name from ASC List ES Query :", provider_resource_name);
                return provider_resource_name;
            }
        }
    }
    catch(e) {
        logger.info(e);
    }
}


async function getTotalAssociatedResourceCountElasticSearchResponse(index,tenant_id,appName) {
    const body =
    {
        "track_total_hits":true,"from":0,"size":10000,
        "query": {"bool": {"must": [{"match": {"tenant_id.keyword": tenant_id}},
        {"match": {"context.application.keyword": appName}}]}}
    }
    try {
    	 const response = await esManager.searchDoc(index, body);
         var bucket_results = response.hits.total['value'];
         logger.info("Associated Resources Total count of '"+appName+"' Application In ES Result :",bucket_results)
         return bucket_results;
    }
    catch(e) {
        logger.info(e)
    }
}


async function deleted_resources_count(index,tenant_id) {
    const body =
    {
    	 "query": {"bool": {"must": [{"match": {"tenant_id.keyword": tenant_id}}]}},
    	 "aggs":  {"deleted_resources_count": {"terms": {"field": "status.keyword"}}},"size": 0
    }
    try {
    	 const response = await esManager.searchDoc(index, body);
    	 var bucket_results = response.aggregations["deleted_resources_count"]["buckets"]
    	 var result = {}
    	 for(var i in bucket_results) {
             var deleted_resources_keyName = bucket_results[i]["key"];
             var deleted_resources_count = bucket_results[i]["doc_count"];
             result[deleted_resources_keyName] = deleted_resources_count;
		 }
	     logger.info("Deleted Resource result from Elastic Search: ", result);
    	 return result;
    }
    catch(e) {
        logger.info(e)
    }
}


async function applications_health_status_count(index,tenant_id) {
    var searchIndex = index;
    var tenantId = tenant_id;
    const body =
    {
    	 "query": {"bool": {"must": [{"match": {"tenant_id.keyword": tenant_id}},
    	 {"exists": {"field": "context.application.keyword"}}]}},
    	 "aggs": {"health": {"terms": {"field": "context.application.keyword","size": 10000},
                   "aggs": {"status": {"terms": {"field": "health_status.keyword", "size": 10}}}
         }}
    }
    try {
    	 const response = await esManager.searchDoc(index, body);
    	 var bucket_results = response.aggregations["health"]["buckets"]
    	 var appHealthStatus = {}, result = {};
    	 for(var i in bucket_results) {
             var health_status_name = bucket_results[i]["key"];
             var health_status_count = bucket_results[i]["doc_count"];
             appHealthStatus[health_status_name] = health_status_count;
		 }
	     var app_status = await this.get_overall_app_status(searchIndex, tenantId);
	     result = await this.set_application_health_status(appHealthStatus, app_status);
	     logger.info("Applications Health Status from Elastic Search: ", result);
    	 return result;
    }
    catch(e) {
        logger.info(e);
    }
}

/*
 * Get Application list view total count and Application(s) name
*/
async function applicationsListViewCountAndName(index, tenant_id, healthStatus) {
    var searchIndex = index;
    var tenantId = tenant_id;
    const body =
    {
        "query": {"bool": {"must": [{"match": {"tenant_id": tenant_id}},
        {"terms": {"health_status.keyword": [healthStatus]}}]}},
        "size": 0, "track_total_hits": true ,
        "aggs": {"applications": {"terms": {"field": "context.application.keyword", "size": 1000000},
        "aggs": {"health_status": {"terms":{"field": "health_status.keyword","size": 10, "order": {"_count": "desc"}}}}}}
    }
    try {
    	 const response = await esManager.searchDoc(index, body);
    	 var bucket_results = response.aggregations["applications"]["buckets"]
    	 var appHealthStatus = {}, result = {};
    	 var totalCount = 0;
    	 if(bucket_results.length > 0) {
    	    for(var i in bucket_results) {
    	        var applicationName = bucket_results[i]["key"];
                var healthStatusBucket = bucket_results[i]["health_status"]["buckets"];
                for(var j in healthStatusBucket) {
                    var health_statusName = healthStatusBucket[j]["key"];
                }
                appHealthStatus[applicationName] = health_statusName;
		    }
		    var app_status = await this.get_overall_app_status(searchIndex, tenantId);
	        result = await this.set_application_health_status(appHealthStatus, app_status);
	        var keys = Object.keys(result);
	        if(keys.includes(healthStatus)) {
	            totalCount = result[healthStatus];
	        }
	        logger.info("'"+healthStatus+"' Applications total count from Elastic Search Result: ", totalCount);
	     }
	     else {
	        logger.info("No Application is found for '"+healthStatus+"'.");
	     }
	     return totalCount;
    }
    catch(e) {
        logger.info(e);
    }
}

/*
 * Method to get Resources breakdown details based on Health Status selection
*/
async function health_resource_breakdown(index,tenant_id, health_status) {
    const body =
    {
    	 "query":{"constant_score":{"filter":{"bool":{"must":[{"match":{"tenant_id":tenant_id}},
    	 {"terms": { "health_status.keyword": [health_status]}}]}}}},"size":0,"track_total_hits":true,
         "aggs":{"resources_breakdown":{"terms":{"field":"health_status.keyword","size":1000000},
            "aggs":{
         	"provider_bucket":{"terms":{"field":"provider.keyword","size":1000000,"order":{"_count":"desc"}}},
         	"environment_bucket":{"terms":{"field":"context.environment.keyword","size":1000000,"order":{"_count":"desc"}}},
         	"team_bucket":{"terms":{"field":"context.team.keyword","size":1000000,"order":{"_count":"desc"}}},
         	"category_bucket":{"terms":{"field":"service_category.keyword","size":1000000,"order":{"_count":"desc"}}}
           }}}
    }
    try {
    	 const response = await esManager.searchDoc(index, body);
    	 var esResponse = response.aggregations["resources_breakdown"]["buckets"];
    	 var response_object = {
                                    "resourceBreakdown": {[health_status]: {"environment": {}, "provider": {}, "team": {}, "category": {}}}
                               };
         for(var resource_type_bucket in esResponse) {
            var env_obj = {};
            var env_bucket_details = esResponse[resource_type_bucket]['environment_bucket']['buckets'];
            for(var resource in env_bucket_details){
                var envKey = env_bucket_details[resource]['key'].toString().replace(/\s/g, '');
                env_obj[envKey] = env_bucket_details[resource]['doc_count'];
            }
            var provider_obj = {};
            var provider_bucket_details = esResponse[resource_type_bucket]['provider_bucket']['buckets'];
            for(var resource in provider_bucket_details) {
                var providerKey = provider_bucket_details[resource]['key'].toString().replace(/\s/g, '');
                provider_obj[providerKey] = provider_bucket_details[resource]['doc_count'];
            }
            var team_obj = {};
            var team_bucket_details = esResponse[resource_type_bucket]['team_bucket']['buckets'];
            for(var resource in team_bucket_details) {
                var teamKey = team_bucket_details[resource]['key'].toString().replace(/\s/g, '');
                team_obj[teamKey] = team_bucket_details[resource]['doc_count'];
            }
            var category_obj = {};
            var category_bucket_details = esResponse[resource_type_bucket]['category_bucket']['buckets'];
            for(var resource in category_bucket_details) {
                var categoryKey = category_bucket_details[resource]['key'].toString().replace(/\s/g, '');
                category_obj[categoryKey] = category_bucket_details[resource]['doc_count'];
            }
            if(esResponse[resource_type_bucket]['key'] == health_status) {
                response_object["resourceBreakdown"][health_status]["environment"] = env_obj
                response_object["resourceBreakdown"][health_status]["provider"] = provider_obj
                response_object["resourceBreakdown"][health_status]["team"] = team_obj
                response_object["resourceBreakdown"][health_status]["category"] = category_obj
            }
         }
         response_object = response_object["resourceBreakdown"];
	     logger.info("Resources Breakdown Details ES Result by Health Status ", response_object);
    	 return response_object;
    }
    catch(e) {
        logger.info(e);
    }
}

async function get_overall_app_status(index, tenant_id) {
     const body =
        {
        	 "query": {"bool": {"must": [{"match": {"tenant_id.keyword": tenant_id}}]}},"size":0,"track_total_hits": true,
        	 "aggs": {"app": {"terms": {"field": "context.application.keyword","size": 1000000},
                       "aggs": {"health": {"terms": {"field": "health_status.keyword", "size": 10,"order": {"_count": "desc"}}}}
             }}
        }
        try {
             const response = await esManager.searchDoc(index, body);
         	 var bucket_results = response.aggregations["app"]["buckets"];
         	 var app_status = {};
             for(var element in bucket_results) {
                var health_status = '';
                var statusData = bucket_results[element]["health"]["buckets"];
                for(var elem in statusData) {
                    health_status += statusData[elem]["key"];
                }
                if(health_status.includes("Critical")){
                    app_status[bucket_results[element]["key"]] = "Critical";
                }
                else if(health_status.includes("Warning")){
                    app_status[bucket_results[element]["key"]] = "Warning";
                }
                else if(health_status.includes("Healthy")){
                    app_status[bucket_results[element]["key"]] = "Healthy";
                }
             }
     	     return app_status;
        }
        catch(e) {
             logger.info(e);
        }
}

async function set_application_health_status(appHealthStatus, app_status) {
    var critical = 0, warning = 0, healthy = 0, unknown = 0;
    var response_object = {"health_status":{"Healthy":0, "Critical":0, "Warning":0}};
    var data = await this.allow_selected_apps(appHealthStatus);
    logger.info("Applications: ", data);
    if(data.length > 0) {
        for(var key in data) {
            if(app_status[data[key]]=='Healthy') {
                healthy += 1;
            }
            else if(app_status[data[key]]=='Critical') {
                critical += 1;
            }
            else if(app_status[data[key]]=='Warning') {
                warning += 1;
            }
            else {
                unknown += 1;
            }
        }
    }
    response_object["health_status"]["Critical"] = critical;
    response_object["health_status"]["Healthy"] = healthy;
    response_object["health_status"]["Warning"] = warning;
    return response_object["health_status"];
}

async function allow_selected_apps(data) {
    var selected_apps = [];
    var arrayLength;
    if(typeof data == 'object'){
        arrayLength = Object.keys(data).length;
    } else {
        arrayLength = data.length;
    }
    if(arrayLength > 0) {
        for(var app in data) {
            selected_apps.push(app);
        }
    }
    return selected_apps;
}

/*
 * Method to get total individual applications
*/
async function topInsights_total_IndividualApps(index, tenant_id) {
    const body =
        {
            "size":0,"query":{"bool":{"must":[{"bool":{"must":[{"match_phrase":{"tenant_id":{"query":tenant_id}}},
            {"range":{"timestamp":{"gte":"now-30d/d"}}}]}}]}},
            "aggs":{"totalIndividualApp":{"terms":{"field":"context.application.keyword","size":10000}}}
        }
    try {
        	const response = await esManager.searchDoc(index, body);
        	var totalApps_bucket_results = response.aggregations["totalIndividualApp"]["buckets"];
            var totalApps = {};
            for(var i in totalApps_bucket_results) {
                 var name = totalApps_bucket_results[i]["key"];
                 var count = totalApps_bucket_results[i]["doc_count"];
                 totalApps[name] = count;
    		}
        	return totalApps_bucket_results;
    } catch(e) {
        logger.info(e);
    }
}

/*
 * Method to get Least and Most Available applications Top Insights
 * Parameters: availabilityType = Least / most, healthStatus = Critical / Healthy respectively
*/
async function topInsightsLeastMostApplications(index, tenant_id, availabilityType, healthStatus) {
    const body = {
        "size":0,"query":{"bool":{"must":[{"match_phrase":{"tenant_id":{"query":tenant_id}}},
        {"match":{"health_status.keyword":healthStatus}},
        {"range":{"timestamp":{"gte":"now-30d/d"}}}]}},
        "aggs":{"applications_topInsights":{"terms":{"field":"context.application.keyword","order":{"_count":"desc"}}}}
    }
    try {
        	const response = await esManager.searchDoc(index, body);
        	var healthyApps = response.aggregations["applications_topInsights"]["buckets"];
            var totalIndividualApps, applications = [];
        	totalIndividualApps = await this.topInsights_total_IndividualApps(index, tenant_id);
        	if(healthyApps.length > 0) {
                for (var i in healthyApps) {
                    for (var j in totalIndividualApps) {
                        //if the app found in both total apps and most/least healthy apps then find the percentage
                        if (healthyApps[i] && healthyApps[i].key
                            && totalIndividualApps[j] && totalIndividualApps[j].key
                            && healthyApps[i].key === totalIndividualApps[j].key) {
                                var doc_count = parseFloat(healthyApps[i].doc_count / totalIndividualApps[j].doc_count * 100).toFixed(1);
                                applications.push({ "name": (healthyApps[i].key).trim(), "value": doc_count });
                        }
                    }
                }
                if (availabilityType === healthTestData.leastAvailableAppLabelText) {
                    // Sort the value in asc order
                    applications.sort(function (a, b) {
                        return (a.value - b.value);
                    });
                } else {
                    //sort the value in desc order
                    applications.sort(function (a, b) {
                       return (b.value - a.value);
                    });
                }
                applications.forEach((element, index) => {
                    element.value = element.value + " %";
                });

                logger.info("'"+availabilityType+"'order list:", applications);
                applications = applications.slice(0, 3);
                logger.info("'"+availabilityType+"' 3 applications ES details:", applications);
            }
            else {
                logger.info("No '"+availabilityType+"' applications ES details available.");
            }
        	return applications;
    } catch(e) {
        logger.info(e);
    }
}

async function topInsightsMostIncidentsApplications(index, tenant_id, availabilityType) {
    const body = {
            "query":{"bool":{"must":[{"match_phrase":{"tenant_id":{"query":tenant_id}}},
            {"exists":{"field":"incident_code_id.keyword"}},{"range":{"open_dttm":{"gte":"now-30d/d","lte":"now/d"}}},
            {"bool":{"must_not":[{"match_phrase":{"context.application.keyword":{"query":""}}}]}}]}},
            "aggs":{"topInsightsMostIncidentsApplications":{"terms":{"field":"context.application.keyword","order":{"_count":"desc"},"size":3}}},
            "size":0
    }
    try {
        	const response = await esManager.searchDoc(index, body);
        	var mostIncidentsApps = response.aggregations["topInsightsMostIncidentsApplications"]["buckets"];
            var mostIncidentsApplications = [];
        	if(mostIncidentsApps.length > 0) {
                for (var i in mostIncidentsApps) {
                        if (mostIncidentsApps[i] && mostIncidentsApps[i].key) {
                             var value = mostIncidentsApps[i].doc_count;
                             value = util.kFormatter(value);
                              mostIncidentsApplications.push({ "name": mostIncidentsApps[i].key, "value": value.toString() });
                        }
                }
                logger.info("'"+availabilityType+"' applications ES details:", mostIncidentsApplications);
        	}
        	else {
        	    logger.info("No '"+availabilityType+"' applications ES details available.");
        	}
            return mostIncidentsApplications;

    } catch(e) {
        logger.info(e);
    }
}


async function topInsightsMostHighPriorityIncidentsApplications(index, tenant_id, availabilityType) {
    const body = {
            "query" : { "bool": {"must": [ {"bool":{"should":[{"bool": { "must": [{ "bool": {"must":
            [{"match_phrase":{"tenant_id":{"query": tenant_id}}},{ "match": { "priority": 1 } },
            { "range": { "open_dttm": { "gte": "now-30d/d", "lte": "now/d" } } } ] } },
            {"bool": {"must_not": {"match": {"context.application.keyword": ""}}}}]}},
            { "bool": { "must": [{ "bool": { "must": [{"match_phrase":{"tenant_id":{"query": tenant_id}}},
            { "match": { "priority": 2 } }, { "range": { "open_dttm":{"gte":"now-30d/d","lte":"now/d"}}}]}},
            {"bool":{"must_not":{"match": {"context.application.keyword":""}}}}]}}]}}]} },
            "aggs": {"application_with_high_priority_incidents": {"terms": {"field": "context.application.keyword","order": {"_count": "desc"},"size": 3}}},
            "size": 0
    }
    try {
        	const response = await esManager.searchDoc(index, body);
        	var mostHighPriorityIncidentsApps = response.aggregations["application_with_high_priority_incidents"]["buckets"];
            var mostHighPriorityIncidentsApplications = [];
        	if(mostHighPriorityIncidentsApps.length > 0) {
                for (var i in mostHighPriorityIncidentsApps) {
                        if (mostHighPriorityIncidentsApps[i] && mostHighPriorityIncidentsApps[i].key) {
                              var value = mostHighPriorityIncidentsApps[i].doc_count;
                              value = util.kFormatter(value);
                              mostHighPriorityIncidentsApplications.push({ "name": mostHighPriorityIncidentsApps[i].key,
                                                                           "value": value.toString() });
                        }
                }
                logger.info("'"+availabilityType+"' applications ES details:", mostHighPriorityIncidentsApplications);
        	}
        	else {
        	    logger.info("No '"+availabilityType+"' applications ES details available.");
        	}
            return mostHighPriorityIncidentsApplications;

    } catch(e) {
        logger.info(e);
    }
}

async function topInsightsMostIncidentsResources(index, tenant_id, availabilityType) {
    const body = {
            "query" : { "bool": {"must": [ {"bool":{"must":[{"match_phrase":{"tenant_id":{"query": tenant_id}}},
            {"bool": {"must_not": [{"match_phrase": {"correlation_id.keyword":{ "query": "" }}}]}},
            {"exists":{"field": "incident_code_id.keyword"}},{"range": {"open_dttm":{"gte": "now-30d/d","lte": "now/d"}}}]}}]} },
            "aggs": {"mostIncidentsResources": {"terms": {"field": "correlation_id.keyword","order": {"_count": "desc"},"size": 3},
            "aggs": { "resource_name": { "terms": { "field": "provider_resource_id.value.keyword","order": {"_count": "desc"}, "size": 3}},
            "hostName":{"terms":{"field":"hostname.keyword"}},
            "sourceType":{"top_hits":{"size":1,"_source":{"includes":["source_type"]}}}}}}, "size": 0
    }
    try {
        	const response = await esManager.searchDoc(index, body);
        	var mostIncidentsResc = response.aggregations["mostIncidentsResources"]["buckets"];
            var mostIncidentsResources = [];
        	if(mostIncidentsResc.length > 0) {
                for (var i in mostIncidentsResc) {
                        var rescName = mostIncidentsResc[i]["hostName"]["buckets"];
                        if (mostIncidentsResc[i] && mostIncidentsResc[i].key && rescName.length > 0 && rescName[0].key) {
                              var value = mostIncidentsResc[i].doc_count;
                              value = util.kFormatter(value);
                              mostIncidentsResources.push({ "name": rescName[0].key, "value": value.toString() });
                        }
                }
                logger.info("'"+availabilityType+"' resources ES details:", mostIncidentsResources);
        	}
        	else {
        	    logger.info("No '"+availabilityType+"' resources ES details available.");
        	}
            return mostIncidentsResources;

    } catch(e) {
        logger.info(e);
    }
}

async function topInsightsLeastAvailabilityResources(index, tenant_id, availabilityType, healthStatus) {
    const body = {
            "track_total_hits":true,"query":{"bool":{"must":[{"bool":{"must":[{"match_phrase":{"tenant_id":{"query":tenant_id}}},
            {"match":{"health_status.keyword":healthStatus}},{"range":{"timestamp":{"gte":"now-90d/d","lt":"now/d"}}}]}}]}},
            "aggs":{"leastAvailabilityResources":{"terms":{"field":"correlation_id.keyword","order":{"_count":"desc"},"size":3},
            "aggs":{"resource_name":{"terms":{"field":"provider_resource_id.value.keyword","order":{"_count":"desc"},"size":3}},
            "source_type":{"top_hits":{"size":1,"_source":{"includes":["source_type"]}}}}}},"size":0
    }
    try {
        	const response = await esManager.searchDoc(index, body);
        	var leastAvailabilityResc = response.aggregations["leastAvailabilityResources"]["buckets"];
            var leastAvailabilityResources = [];
        	if(leastAvailabilityResc.length > 0) {
                for (var i in leastAvailabilityResc) {
                        var details = leastAvailabilityResc[i]["resource_name"]["buckets"];
                        if (leastAvailabilityResc[i] && details && details.length > 0) {
                            for (var j in details) {
                                var value = details[j].doc_count / response.hits["total"]["value"] * 100;
                                value = Math.round(value * 10) / 10 + " %";
                                leastAvailabilityResources.push({ "name": details[j].key, "value": value });
                            }
                        }
                }
                logger.info("'"+availabilityType+"' resources ES details:", leastAvailabilityResources);
        	}
        	else {
        	    logger.info("No '"+availabilityType+"' resources ES details available.");
        	}
            return leastAvailabilityResources;

    } catch(e) {
        logger.info(e);
    }
}


async function appOverviewDetailsImpactedResourceCount(index, tenant_id, appName) {
    const body =
    {   "_source": "health_status",
        "query":{"bool":{ "should":[{"bool":{"must":[{"match":{"context.application.keyword":appName}},
        {"match":{"health_status.keyword":"Warning"}},
        {"match":{"tenant_id.keyword":tenant_id}}]}},{"bool":{"must":[{"match":{"context.application.keyword":appName}},
        {"match":{"health_status.keyword":"Critical"}},{"match":{"tenant_id.keyword":tenant_id}}]}}]}}
    }
    try {
    	 const response = await esManager.searchDoc(index, body);
    	 var bucket_results = response["hits"]["hits"];
    	 var result = {}, num_critical = 0, num_warning = 0;
    	 for(var app in bucket_results) {
    	    var name = Object.keys(bucket_results[app]['_source']);
    	    if (name.includes('health_status')) {
    	        var health_status = bucket_results[app]['_source']['health_status'];
    	        if(health_status == "Critical") {
    	            num_critical += 1;
    	            result[health_status] = num_critical;
    	        }
    	        if(health_status == "Warning") {
                    num_warning += 1;
                    result[health_status] = num_warning;
                }
    	    }
		 }
	    var keys = Object.keys(result);
        if(!(keys.includes(healthTestData.resourceCriticalText))) {
                 result[healthTestData.resourceCriticalText] = 0;
        }
        if(!(keys.includes(healthTestData.resourceWarningText))) {
                result[healthTestData.resourceWarningText] = 0;
        }
	     logger.info("Impacted Resources count result from Elastic Search Query: ", result);
    	 return result;
    }
    catch(e) {
        logger.info(e);
    }
}

async function resourceTotalCountBasedOnHealthStatus(index, tenant_id, healthStatus, source_type) {
    const body =
    {
    	 "track_total_hits":true,"from":0,"size":10000,
           "_source":{"includes": ["provider_resource_id.value","provider_resource_name", "health_status", "status", "source_type",
                            "context.environment",
                            "type", "parent_resource_id.value", "provider", "provider_account", "service_category",
                            "service_category_type",
                            "source.os", "context.application", "context.category.name.keyword", "location.region",
                            "location.country_code","environment",
                            "context.team", "tags.name", "tags.values","eol_date","eos_date","machine_type","manufacturer", "model"]},
         "sort": [{"provider_resource_id.value.keyword": "asc"}],
         "query":{"bool":
           {"must":[{"match":{"tenant_id":tenant_id}},
           {"match":{"health_status":healthStatus}},
           {"terms": {"source_type.keyword": source_type}}],"should":[]}
         }
    }
    try {
    	 const response = await esManager.searchDoc(index, body);
    	 var totalCount = response["hits"]["total"]["value"];
    	 var bucket_result = response["hits"]["hits"];
    	 var result = [];
    	 if(bucket_result.length > 0) {
    	    for(var i in bucket_result) {
                var provider_resource_name = bucket_result[i]["_source"]["provider_resource_name"];
                var resc_health_status = bucket_result[i]["_source"]["health_status"];
                result.push({ "resourceName": provider_resource_name, "healthStatus": resc_health_status });
		    }
		    logger.info("ES details of '"+ healthStatus+ "' resources:", result);
		    logger.info("Total '"+ healthStatus+ "' resources in ES result:", totalCount);
		 }
		 else {
		    logger.info("ES details are not available for '"+ healthStatus+ "' resources.");
		 }
    	 return {totalCount, result};
    }
    catch(e) {
        logger.info(e);
    }
}

module.exports = {
resources_health_status_count:resources_health_status_count,
deleted_resources_count:deleted_resources_count,
applications_health_status_count:applications_health_status_count,
get_overall_app_status:get_overall_app_status,
set_application_health_status:set_application_health_status,
allow_selected_apps:allow_selected_apps,
health_resource_breakdown:health_resource_breakdown,
topInsights_total_IndividualApps:topInsights_total_IndividualApps,
topInsightsLeastMostApplications:topInsightsLeastMostApplications,
topInsightsMostIncidentsApplications:topInsightsMostIncidentsApplications,
topInsightsMostHighPriorityIncidentsApplications:topInsightsMostHighPriorityIncidentsApplications,
topInsightsMostIncidentsResources:topInsightsMostIncidentsResources,
topInsightsLeastAvailabilityResources:topInsightsLeastAvailabilityResources,
resourceTotalCountBasedOnHealthStatus:resourceTotalCountBasedOnHealthStatus,
appOverviewDetailsImpactedResourceCount:appOverviewDetailsImpactedResourceCount,
applicationsListViewCountAndName:applicationsListViewCountAndName,
getTotalAssociatedResourceCountElasticSearchResponse:getTotalAssociatedResourceCountElasticSearchResponse,
getAssociatedResourceDetailsESResponse:getAssociatedResourceDetailsESResponse,
ascResources_health_status_count:ascResources_health_status_count,
getTotalAssociatedTicketsDetailsESResponse:getTotalAssociatedTicketsDetailsESResponse
}