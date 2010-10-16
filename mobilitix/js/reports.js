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

var goalsReport = {
	metrics: 'ga:goalCompletionsAll',
	dimension:'ga:date',
	sort: 'ga:date',
	results: '10',
	chartTarget: 'goalsChart',
	tableTarget: 'goalsTable',
	reportType: 'TIMELINE',
	title: 'Goals Trend',
	dimensionTitle: 'Date',
	metricsTitle:'Goals'
};

var campaignsReport ={
	metrics: 'ga:pageviews',
	dimension:'ga:pagePath',
	sort: 'ga:pageviews',
	results: '10',
	tableTarget: 'campaignsTable',
	reportType: 'TABLE',
	title: 'Content Overview',
	dimensionTitle: 'Content',
	metricsTitle:'Pageviews'
}					
