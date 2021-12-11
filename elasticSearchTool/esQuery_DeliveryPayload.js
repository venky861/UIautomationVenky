"use strict";
const esManager  =  require('./esManager');
const util = require('../helpers/util');
var logGenerator = require("../helpers/logGenerator.js"),
	logger = logGenerator.getApplicationLogger();

async function getTotalTicketCount(index,tenant_id,year_month,action_plan_id) {
	const body = {
		"query":{"bool":{"must":[{"match":{"tenant_id.keyword":tenant_id}},{"match":{"year_month.keyword":year_month}},
		{"match":{"action_plan_id":action_plan_id}}]}},"aggs":{"total":{"max":{"field":"total_tickets"}}}
	}
	try {
		const resp = await esManager.searchDocWithScroll(index, body);
		var resultCount = resp.aggregations.total.value;
		logger.info("Elastic Response", resultCount);
		return resultCount;
	}
	catch (e) {
		logger.info(e);
	}
}

async function getAEOpportunityWidgetCount(index,tenant_id,year_month) {
	const body = {
	"query":{"bool":{"must":[{"term":{"tenant_id.keyword":{"value":tenant_id}}},
	{"terms":{"action_plan_id":["104","111","112"]}},{"term":{"year_month.keyword":{"value":year_month}}}]}},"aggs":{"2":{"terms":{"field":"action_plan_id"},
	"aggs":{"total_tickets":{"max":{"field":"total_tickets"}}}}}
	}
	try {
    	 const resp = await esManager.searchDoc(index, body);
    	 var bucket_results=resp.aggregations["2"]["buckets"];
    	 var res = bucket_results[0]["total_tickets"]["value"]-(bucket_results[1]["total_tickets"]["value"] + bucket_results[2]["total_tickets"]["value"]);
		 logger.info("Elastic response: ", res);
    	 return res;
    	 }
	catch (e) {
		logger.info(e);
	}
}

async function getNotAEOpportunityWidgetCount(index,tenant_id,year_month) {
	const body = {
	"query":{"bool":{"must":[{"term":{"tenant_id.keyword":{"value":tenant_id}}},
	{"terms":{"action_plan_id":["105","113"]}},{"term":{"year_month.keyword":{"value":year_month}}}]}},
	"aggs":{"2":{"terms":{"field":"action_plan_id"},"aggs":{"total_tickets":{"max":{"field":"total_tickets"}}}}}
	}
	try {
    	 const resp = await esManager.searchDoc(index, body);
    	 var bucket_results=resp.aggregations["2"]["buckets"];
    	 var res = (bucket_results[0]["total_tickets"]["value"]-bucket_results[1]["total_tickets"]["value"]);
		 logger.info("Elastic response: ", res);
    	 return res;
    	 }
	catch (e) {
		logger.info(e);
	}
}

async function getManualOpportunityWidgetCount(index,tenant_id,year_month) {
	const body = {
	"query":{"bool":{"must":[{"term":{"tenant_id.keyword":{"value":tenant_id}}},
	{"terms":{"action_plan_id":["106","116"]}},{"term":{"year_month.keyword":{"value":year_month}}}]}},
	"aggs":{"2":{"terms":{"field":"action_plan_id"},"aggs":{"total_tickets":{"max":{"field":"total_tickets"}}}}}
	}
	try {
    	 const resp = await esManager.searchDoc(index, body);
    	 var bucket_results=resp.aggregations["2"]["buckets"];
    	 var res = (bucket_results[0]["total_tickets"]["value"]-bucket_results[1]["total_tickets"]["value"]);
		 logger.info("Elastic response: ", res);
    	 return res;
    	 }
	catch (e) {
		logger.info(e);
	}
}

async function getAEActionPlanOpportunityWidgetCount(index,tenant_id,year_month) {
	const body = {
	"query":{"bool":{"must":[{"term":{"tenant_id.keyword":{"value":tenant_id}}},
	{"terms":{"action_plan_id":["8","4","7","10","9"]}},{"terms":{"high_level_qualifier.keyword":["header","Clearing Event - Not Automated (Flowing into automation engine)"]}},
	{"term":{"is_header":{"value":"1"}}},{"term":{"year_month.keyword":{"value":year_month}}}]}},
	"aggs":{"total":{"sum":{"field":"total_tickets"}}}
	}
	try {
		const resp = await esManager.searchDocWithScroll(index, body);
		var resultCount = resp.aggregations.total.value;
		logger.info("Elastic Response", resultCount);
		return resultCount;
	}
	catch (e) {
		logger.info(e);
	}
}

async function getNotAEActionPlanOpportunityWidgetCount(index,tenant_id,year_month) {
	const body = {
	"query":{"bool":{"must":[{"term":{"tenant_id.keyword":{"value":tenant_id}}},
	{"terms":{"action_plan_id":["9","1"]}},{"terms":{"high_level_qualifier.keyword":["header","Clearing Event - Not Automated (Not Flowing into automation engine)"]}},
	{"term":{"is_header":{"value":"1"}}},{"term":{"year_month.keyword":{"value":year_month}}}]}},
	"aggs":{"total":{"sum":{"field":"total_tickets"}}}
	}
	try {
		const resp = await esManager.searchDocWithScroll(index, body);
		var resultCount = resp.aggregations.total.value;
		logger.info("Elastic Response", resultCount);
		return resultCount;
	}
	catch (e) {
		logger.info(e);
	}
}

async function getManualActionPlanOpportunityWidgetCount(index,tenant_id,year_month) {
	const body = {
	"query":{"bool":{"must":[{"term":{"tenant_id.keyword":{"value":tenant_id}}},
	{"terms":{"action_plan_id":["9","2"]}},{"terms":{"high_level_qualifier.keyword":["header","Cleared and Re-fired - Not Automated"]}},
	{"term":{"is_header":{"value":"1"}}},{"term":{"year_month.keyword":{"value":year_month}}}]}},
	"aggs":{"total":{"sum":{"field":"total_tickets"}}}
	}
	try {
		const resp = await esManager.searchDocWithScroll(index, body);
		var resultCount = resp.aggregations.total.value;
		logger.info("Elastic Response", resultCount);
		return resultCount;
	}
	catch (e) {
		logger.info(e);
	}
}

async function getActionZeroOpportunityWidgetCount(index,tenant_id,high_level_qualifier,year_month) {
	const body = {
	"query":{"bool":{"must":[{"term":{"tenant_id.keyword":{"value":tenant_id}}},
	{"terms":{"action_plan_id":["0"]}},{"terms":{"high_level_qualifier.keyword":[high_level_qualifier]}},
	{"term":{"is_header":{"value":"1"}}},{"term":{"year_month.keyword":{"value":year_month}}}]}},
	"aggs":{"total":{"sum":{"field":"total_tickets"}}}
	}
	try {
		const resp = await esManager.searchDocWithScroll(index, body);
		var resultCount = resp.aggregations.total.value;
		logger.info("Elastic Response", resultCount);
		return resultCount;
	}
	catch (e) {
		logger.info(e);
	}
}

async function getActionIdCount(index,tenant_id,action_plan_id,high_level_qualifier,year_month) {
	const body = {
	"query":{"bool":{"must":[{"term":{"tenant_id.keyword":{"value":tenant_id}}},
	{"terms":{"action_plan_id":[action_plan_id]}},{"terms":{"high_level_qualifier.keyword":[high_level_qualifier]}},
	{"term":{"year_month.keyword":{"value":year_month}}}]}},"aggs":{"total":{"sum":{"field":"total_tickets"}}}
	}
	try {
		const resp = await esManager.searchDocWithScroll(index, body);
		var resultCount = resp.aggregations.total.value;
		logger.info("Elastic Response", resultCount);
		return resultCount;
	}
	catch (e) {
		logger.info(e);
	}
}

async function getActionIdNineCount(index,tenant_id,high_level_qualifier,year_month) {
	const body = {
	"query":{"bool":{"must":[{"term":{"tenant_id.keyword":{"value":tenant_id}}},
	{"terms":{"action_plan_id":["9"]}},{"terms":{"high_level_qualifier.keyword":[high_level_qualifier]}},
	{"term":{"is_header":{"value":"1"}}},{"term":{"year_month.keyword":{"value":year_month}}}]}},
	"aggs":{"total":{"sum":{"field":"total_tickets"}}}
	}
	try {
		const resp = await esManager.searchDocWithScroll(index, body);
		var resultCount = resp.aggregations.total.value;
		logger.info("Elastic Response", resultCount);
		return resultCount;
	}
	catch (e) {
		logger.info(e);
	}
}


module.exports = {
	    getTotalTicketCount:getTotalTicketCount,
	    getAEOpportunityWidgetCount:getAEOpportunityWidgetCount,
	    getNotAEOpportunityWidgetCount:getNotAEOpportunityWidgetCount,
	    getManualOpportunityWidgetCount:getManualOpportunityWidgetCount,
	    getAEActionPlanOpportunityWidgetCount:getAEActionPlanOpportunityWidgetCount,
	    getNotAEActionPlanOpportunityWidgetCount:getNotAEActionPlanOpportunityWidgetCount,
	    getManualActionPlanOpportunityWidgetCount:getManualActionPlanOpportunityWidgetCount,
	    getActionZeroOpportunityWidgetCount:getActionZeroOpportunityWidgetCount,
	    getActionIdCount:getActionIdCount,
	    getActionIdNineCount:getActionIdNineCount

}