/**
 * @author marcodeseri
 */

var trafficReport = {
	metrics: 'ga:visits',
	dimension:'ga:date',
	sort: 'ga:date',
	results: '10',
	chartTarget: 'trafficChart',
	tableTarget: 'trafficTable',
	reportType: 'TIMELINE',
	title: 'Visit Trend',
	dimensionTitle: 'Date',
	metricsTitle:'Visits'
};
			
var visitorsReport = {
	metrics: 'ga:visits',
	dimension:'ga:medium',
	sort: 'ga:visits',
	results: '10',
	chartTarget: 'visitorsChart',
	tableTarget: 'visitorsTable',
	reportType: 'PIE',
	title: 'Visitor Type',
	dimensionTitle: 'Medium',
	metricsTitle:'Visits'
	
};

var goalsReport = {};

var campaignsReport ={}					