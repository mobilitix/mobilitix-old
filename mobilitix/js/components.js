var welcome = new Ext.Component({
	title: 'Mobilitix',
    cls: 'welcomeCnt',
	iconCls: 'settings',
	id: 'welcomeTab',
    scroll: 'vertical',
    html: ['<div style="height:35px"><h1 id="title">Mobile Web Analytics</h1>',
		   '<img src="/img/dummy.gif" style="display:none" alt="required for Google Data"/></div>']				
});
		 
var traffic = new Ext.Component({
	title: 'Traffic',
    cls: 'trafficCnt',
	iconCls: 'traffic',
	id: 'trafficTab',
    scroll: 'vertical',
    html: ['<h1>Traffic Summary</h1>']
});
		
var visitors = new Ext.Component({
	title: 'Visitors',
    cls: 'visitorsCnt',
	iconCls: 'visitors',
	id: 'visitorsTab',
    scroll: 'vertical',
    html: ['<h1>Visitors Summary</h1>']
});

var goals = new Ext.Component({
	title: 'Goals',
	cls: 'goalsCnt',
	iconCls: 'goals',
	id: 'goalsTab',
    scroll: 'vertical',
    html: ['<h1>Goals Summary</h1>']
});

var campaigns = new Ext.Component({
	title: 'Campaigns',
    cls: 'campaignsCnt',
	iconCls: 'campaigns',
	id: 'campaignsTab',
    scroll: 'vertical',
    html: ['<h1>Campaigns Summary</h1>']
});

var seo = new Ext.Component({
	title: 'SEO',
	cls: 'seoCnt',
	iconCls: 'seo',
	id: 'seoTab',
    scroll: 'vertical',
    html: ['<h1>SEO Summary</h1>']
});


var appLoader = new Ext.Panel({
            floating: true,
            modal: true,
            centered: true,
            width: 300,
			height:70,
            styleHtmlContent: true,
			hideOnMaskTap: false,
            html: '<img src="/img/ajax-loader.gif" alt="loading"/>',
            
          
 });