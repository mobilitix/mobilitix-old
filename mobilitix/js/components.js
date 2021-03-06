var welcome = new Ext.Component({
	title: 'Mobilitix',
    cls: 'welcomeCnt',
	iconCls: 'settings',
	id: 'welcomeTab',
    scroll: 'vertical',
    html: ['<h1 id="title">Mobile Web Analytics</h1>',
			'<img src="/img/bee.png" alt="Mobile Web Analytics"/><br/>',
		   '<p>Tap to <strong>login with your Google Analytics</strong> account. You will login on Google Servers: we will never store nor see your password.</p>']				
});

var logout = new Ext.Component({
	title: 'Logout',
    cls: 'welcomeCnt',
	id: 'logoutTab',
    scroll: 'vertical',
    html: ['<h1 id="title">Mobile Web Analytics</h1>',
			'Sure you want to Logout?',
			'<button id="logoutButton">Logout</button>']				
});

		 
var traffic = new Ext.Component({
	title: 'Traffic',
    cls: 'trafficCnt',
	iconCls: 'traffic',
	id: 'trafficTab',
    scroll: 'vertical',
    html: ['<div id="trafficChart"></div>',
		'<div id="trafficTable"></div>']
});
		
var visitors = new Ext.Component({
	title: 'Visitors',
    cls: 'visitorsCnt',
	iconCls: 'visitors',
	id: 'visitorsTab',
    scroll: 'vertical',
    html: ['<div id="visitorsChart"></div>',
		'<div id="visitorsTable"></div>']
});

var goals = new Ext.Component({
	title: 'Goals',
	cls: 'goalsCnt',
	iconCls: 'goals',
	id: 'goalsTab',
    scroll: 'vertical',
    html: ['<div id="goalsChart"></div>',
		'<div id="goalsTable"></div>',]
});

var campaigns = new Ext.Component({
	title: 'Campaigns',
    cls: 'campaignsCnt',
	iconCls: 'campaigns',
	id: 'campaignsTab',
    scroll: 'vertical',
    html: ['<div id="campaignsTable"></div>']
});

var seo = new Ext.Component({
	title: 'SEO',
	cls: 'seoCnt',
	iconCls: 'seo',
	id: 'seoTab',
    scroll: 'vertical',
    html: ['<div id="seoChart"></div>',
		'<div id="seoTable"></div>']
});


var startDatePicker = {
    xtype: 'datepickerfield',
    name: 'startDateP',
    label: 'Start Date',
    datePickerConfig: { yearFrom: 1900 }
}


var settingsButton = {
	xtype: 'button',
	text: 'Date',
	id: 'settingsButton'
	/*,
	hidden:true*/
}	


var loginButton = {
	xtype: 'button',
	text: 'Login',
	id: 'accountButton'
}


var headerButtonsR = [
	loginButton,
	{xtype: 'spacer'},
	settingsButton
];	
		


