/**
 * @author marcodeseri
 */
Ext.regModel('Account', {
    fields: ['profileName', 'accountName', 'tableId']
});
 
 
 Ext.ns('Mobilitix');
 
 Ext.setup({
    tabletStartupScreen: 'tablet_startup.png',
    phoneStartupScreen: 'phone_startup.png',
    icon: 'icon.png',
    glossOnIcon: false,
    onReady: function() {
		
		var scope = "https://www.google.com/analytics/feeds";
		var analyticsService = new google.gdata.analytics.AnalyticsService('Mobilitix-Webapp');	
   		var accountFeedUri = 'https://www.google.com/analytics/feeds/accounts/default?max-results=50';
		 
		var auth = google.accounts.user.checkLogin(scope);
		
		Mobilitix.reportConfig = {
			selectedAccount: null,
			reportsEnabled: false,
			startDate: '2010-09-01',
			endDate: '2010-09-08',
			metrics: 'ga:visits',
			dimension:'ga:date',
			sort: 'ga:date',
			results: '10',
			chartTarget: 'trafficDataHolder'
		}
	
		
		/*
Mobilitix.selectedAccount = null;
		Mobilitix.reportsEnabled = false;
		Mobilitix.startDate = '2010-09-01';
		Mobilitix.endDate = '2010-09-08';
		Mobilitix.metrics = "ga:visits";
		Mobilitix.dimension = "ga:date";
		Mobilitix.sort = "ga:date"; 
		Mobilitix.results = "10";
		Mobilitix.chartTarget = "trafficDataHolder"; 
*/
		
		Mobilitix.AccountStore = new Ext.data.Store({
		    model: 'Account',
		    sorters: 'profileName',
		    getGroupString : function(record) {
		        return record.get('profileName');
		    },
		    data: []
		});
		
		var getDesiredW = function(offset) {
		    var viewW = Ext.Element.getViewportWidth(),
		        desiredW = Math.min(viewW-offset, 400);
		
		    return desiredW;
		};
		
		
		var getDesiredH = function(offset){
			var viewH = Ext.Element.getViewportHeight(),
		        desiredH = Math.min(viewH-offset, 400);
			console.log(Ext.Element.getViewportHeight() + ' - ' + desiredH);
		    return desiredH;
			
		}
	

		var dockedItems = [{
				dock: 'top',
				xtype: 'toolbar',
				title: 'Mobilitix',
				pack: 'justify', 
				items: [{
					xtype: 'button',
					text: 'Login',
					ui: 'round',
					id: 'accountButton',
					handler: checkAuth
				}]
			}];
			

        var home = new Ext.Panel({
            title: 'Settings',
            cls: 'settingsCnt',
			iconCls: 'settings',
			id: 'settingsTab',
            scroll: 'vertical',
			align: 'center',
			fullscreen:true,
			layout:{
			        type: 'vbox',
			        align: 'left',	
			        pack: 'center'
			},
			dockedItems: dockedItems,
			items:[welcome]				
			   
        });



		/* helpers */
		
		
		//auth
		var checkAuth = function() {
			//Ext.get("accountButton").remove();
			
			// auth
			if(!auth)
				google.accounts.user.login(scope);				
			else
				appInit();
        };


		// app Init
		var appInit = function(){
			
				
			showLoader();
			analyticsService.getAccountFeed(accountFeedUri, accountFeedHandler, errorHandler);
		}
		
		
		
		
		// analytics api data handlers
		var accountFeedHandler = function(result){
			home.remove(welcome);
			
			var entries = result.feed.getEntries();
			console.log("accountHandler");
			
			for (var i = 0, entry; entry = entries[i]; ++i) {
				Mobilitix.AccountStore.add(
					{profileName:entry.getTitle().getText(), accountName:entry.getPropertyValue('ga:accountName').toUpperCase(),tableId:entry.getTableId().getValue()}
				);
				console.log(entry.getPropertyValue('ga:accountName') + ' ' + entry.getTitle().getText() + ' ' + entry.getTableId().getValue());
			}	
			
			accountList = new Ext.Panel({
				title:'Account List',
				cls: 'accontCnt',
				iconCls: 'accont',
				id: 'accountTab',
				scroll: 'vertical',
			    layout:{
			        type: 'vbox',
			        align: 'left',	
			        pack: 'center'
			    },
			    cls: 'account-list',
			    items: [{
			        width: getDesiredW(0),
			        height: getDesiredH(0),
			        xtype: 'list',
					listeners: {
				        itemtap: setAccount,
				    },
			        store: Mobilitix.AccountStore,
			        tpl: '<tpl for="."><div class="accountList"><strong>{profileName}</strong></div></tpl>',
			        itemSelector: 'div.accountList',
			        singleSelect: true,
			        grouped: true,
			        indexBar: true
			    }]
			});
		
			accountList.update();		
			//Ext.get('welcomeTab').hide();	
			hideLoader();

			
			home.add(accountList);
			home.doLayout();
			
		}
		
		
		var enableReports = function(){
			home.remove(accountList);
			
			
			var tabpanel = new Ext.TabPanel({
	            tabBar: {
	                dock: 'bottom',
	                layout: {
	                    pack: 'center'
	                }
	            },
	            fullscreen: true,
	            ui: 'light',
	            animation: {
	                type: 'cardslide',
	                cover: true
	            },
	            
	            defaults: {
	                scroll: 'vertical'
	            },
	            items: [traffic,visitors,goals,campaigns]
	        });	
			
			
			// set up listeners
			traffic.on("activate", doTraffic);
			visitors.on("activate", doVisitors);
			goals.on("activate", doGoals);
			campaigns.on("activate", doCampaigns);
			
			
			doTraffic();
		}
		
		
		var checkReports = function(){
			if(Mobilitix.reportConfig.selectedAccount !== null && Mobilitix.reportConfig.reportsEnabled!==true){
				enableReports();
			}			
		}
		
		
		var hideLoader = function(){					
			appLoader.hide();					
		}
		
		var showLoader = function(){    
            if (!appLoader) {
				appLoader = new appLoader();
                
            }
            appLoader.show('pop');			
		}
		
		
		// query handler
		var dataManager = function(){
			var dataQuery = 'https://www.google.com/analytics/feeds/data' +
			
			    '?start-date=' + Mobilitix.reportConfig.startDate +
			    '&end-date=' + Mobilitix.reportConfig.endDate +
			    '&dimensions=' + Mobilitix.reportConfig.dimension +
			    '&metrics=' + Mobilitix.reportConfig.metrics +
			    '&sort=-' + Mobilitix.reportConfig.sort +
			    '&max-results=' + Mobilitix.reportConfig.results +
			    '&ids=' + Mobilitix.reportConfig.selectedAccount;
			  
			 analyticsService.getDataFeed(dataQuery, handleDataFeed, errorHandler);					
		}
		
		
		var handleDataFeed = function(result){
			
			
			var entries = result.feed.getEntries();
			var data = new google.visualization.DataTable();
			
			data.addColumn('string', 'Traffic Source');
		    data.addColumn('number', 'Visitors');
			
			for (var i = 0, entry; entry = entries[i]; ++i) {
				data.addRow([entry.getValueOf('ga:medium'), entry.getValueOf('ga:visits')]); 
			}
			
			var chart = new google.visualization.PieChart(document.getElementById(Mobilitix.reportConfig.chartTarget));
    		chart.draw(data, {width: 400, height: 240, is3D: true, title: 'Visitors by traffic source'});
		      
		     
			
		}
		
		var dataFeedHandler = function(result){
			console.log("get the data!" + result)
			
		}
		
		
		
		/* reporting */
		 
		var doTraffic = function(){
			
			Mobilitix.reportConfig.metrics = "ga:visits";
			Mobilitix.reportConfig.dimension = "ga:date";
			Mobilitix.reportConfig.sort = "ga:date";
			Mobilitix.reportConfig.results = "10";
			Mobilitix.reportConfig.chartTarget = "trafficDataHolder"; 
			
			console.log("let's do some traffic reporting!")
			dataManager();
			
			
		}
		
		
		var doVisitors = function(){
			console.log("let's do some visitors reporting!")
			Mobilitix.reportConfig.metrics = "ga:visits";
			Mobilitix.reportConfig.dimension = "ga:medium";
			Mobilitix.reportConfig.sort = "ga:visits"; 
			Mobilitix.reportConfig.results = "10";
			Mobilitix.reportConfig.chartTarget = "visitorsDataHolder"; 
			
			dataManager();
		}
		
		
		var doGoals = function(){
			console.log("let's do some goals reporting!")
			dataManager();
		}
		
		var doCampaigns = function(){
			console.log("let's do some campaigns reporting!")
			
		}
		
		
		var setAccount = function(caller, index, item, e){
			Mobilitix.reportConfig.selectedAccount = caller.store.data.items[index].get('tableId');
			console.log(Mobilitix.reportConfig.selectedAccount);	
			checkReports();
		}
		
		
				
		// feed logic
		
		
		var errorHandler = function(){
			console.log("there was an error");
			
		}
		
		
		var doLogout = function(){
			console.log("logging out");
			google.accounts.user.logout();				
		}
		
		
		// Event Managers	
		Ext.EventManager.on("accountButton", 'click', checkAuth);
		
    }
});