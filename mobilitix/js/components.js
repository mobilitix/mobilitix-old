var welcome = new Ext.Component({
	title: 'Mobilitix',
    cls: 'welcomeCnt',
	iconCls: 'settings',
	id: 'welcomeTab',
    scroll: 'vertical',
    html: ['<div style="height:35px"><h1 id="title">Mobile Web Analytics</h1>',
			'<img src="/img/bee.png" alt="Mobile Web Analytics"/><br/>',
		   '<img src="/img/dummy.gif" style="display:none" alt="required for Google Data"/>',
		   '<p>Tap to <strong>login with your Google Analytics</strong> account. You will login on Google Servers: we will never store nor see your password.</p></div>']				
});
		 
var traffic = new Ext.Component({
	title: 'Traffic',
    cls: 'trafficCnt',
	iconCls: 'traffic',
	id: 'trafficTab',
    scroll: 'vertical',
    html: ['<h1>Traffic Summary</h1>',
		'<div id="trafficChart"></div>',
		'<div id="trafficTable"></div>']
});
		
var visitors = new Ext.Component({
	title: 'Visitors',
    cls: 'visitorsCnt',
	iconCls: 'visitors',
	id: 'visitorsTab',
    scroll: 'vertical',
    html: ['<h1>Visitors Summary</h1>',
		'<div id="visitorsChart"></div>',
		'<div id="visitorsTable"></div>'
		]
});

var goals = new Ext.Component({
	title: 'Goals',
	cls: 'goalsCnt',
	iconCls: 'goals',
	id: 'goalsTab',
    scroll: 'vertical',
    html: ['<h1>Goals Summary</h1>',
		'<div id="goalsChart"></div>',
		'<div id="goalsTable"></div>',]
});

var campaigns = new Ext.Component({
	title: 'Campaigns',
    cls: 'campaignsCnt',
	iconCls: 'campaigns',
	id: 'campaignsTab',
    scroll: 'vertical',
    html: ['<h1>Campaigns Summary</h1>',
		'<div id="campaignsChart"></div>',
		'<div id="campaignsTable"></div>']
});

var seo = new Ext.Component({
	title: 'SEO',
	cls: 'seoCnt',
	iconCls: 'seo',
	id: 'seoTab',
    scroll: 'vertical',
    html: ['<h1>SEO Summary</h1>',
		'<div id="seoChart"></div>',
		'<div id="seoTable"></div>']
});


var appLoader = new Ext.Panel({
            floating: true,
            modal: true,
            centered: true,
            width: 300,
			height:70,
            styleHtmlContent: true,
			hideOnMaskTap: false,
            html: '<div><img src="/img/ajax-loader.gif" alt="loading" style="float:left;padding:0 10px"/> Loading your data</div>',
            
          
 });