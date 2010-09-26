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
		

		Mobilitix.startDate = '2010-09-01';
		Mobilitix.endDate = '2010-09-08';
		
		Mobilitix.reportConfig = {
				metrics: 'ga:visits',
				dimension:'ga:date',
				sort: 'ga:date',
				results: '10',
				chartTarget: 'trafficChart',
				tableTarget: 'trafficTable',
				reportType: 'TIMELINE'
			};

		
		Mobilitix.AccountStore = new Ext.data.Store({
		    model: 'Account',
		    sorters: 'profileName',
		    getGroupString : function(record) {
		        return record.get('profileName');
		    },
		    data: []
		});
		
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
				items:[]	 
			});	
		
		// application manager
		var init = {
			authorized: auth ? true : false,
			status: "bootstrap",
			baseLayout: function(){
				console.log("baseLayout");
				
			},
			welcomeLayout: function(){
				console.log("welcome");
				home.add(welcome);		
					  		       
			},
			bootstrap: function(){
				console.log("bootsrapping");
								
				if(auth){
					init.baseLayout();
					
					// FIXME:LOGOUT TEXT 
					Ext.get("accountButton").text = "Logout";
					init.appInit();
				}
				else{
					init.baseLayout();
					init.welcomeLayout();
				}	

				//Ext.EventManager.on("accountButton", 'click', checkAuth);
			},
			appInit: function(){
				showLoader();	
				analyticsService.getAccountFeed(accountFeedUri, accountFeedHandler, errorHandler);
				
			}
			
			
		}
		
		
		
		
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
	

		
			

        



		/* helpers */

		
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
			console.log(Mobilitix.reportConfig.startDate);
			var dataQuery = 'https://www.google.com/analytics/feeds/data' +
			
			    '?start-date=' + Mobilitix.startDate +
			    '&end-date=' + Mobilitix.endDate +
			    '&dimensions=' + Mobilitix.reportConfig.dimension +
			    '&metrics=' + Mobilitix.reportConfig.metrics +
			    '&sort=-' + Mobilitix.reportConfig.sort +
			    '&max-results=' + Mobilitix.reportConfig.results +
			    '&ids=' + Mobilitix.selectedAccount;
			  
			 analyticsService.getDataFeed(dataQuery, reportRenderer, errorHandler);					
		}
		
		
		var reportRenderer = function(result){
			
			console.log("rendering");
			var entries = result.feed.getEntries();
			var data = new google.visualization.DataTable();
			
			data.addColumn('string', 'Traffic Source');
		    data.addColumn('number', 'Visitors');
			
			for (var i = 0, entry; entry = entries[i]; ++i) {
				data.addRow([entry.getValueOf('ga:medium'), entry.getValueOf('ga:visits')]); 
			}
			
			
			switch(Mobilitix.reportConfig.reportType){
				case "PIE":
					var pieChart = new google.visualization.PieChart(document.getElementById(Mobilitix.reportConfig.chartTarget));
    				pieChart.draw(data, {width: 400, height: 240, is3D: true, title: 'Visitors by traffic source'});
					return;
				case "TIMELINE":
					var lineChart = new google.visualization.LineChart(document.getElementById(Mobilitix.reportConfig.chartTarget));
    				lineChart.draw(data, {width: 400, height: 240, is3D: true, title: 'Visitors by traffic source'});
					return;	
			}
			
		     
			//var table = new google.visualization.Table(document.getElementById(Mobilitix.reportConfig.tableTarget));  
		    //table.draw(data, {showRowNumber: true}); 
			
		}
		
		var dataFeedHandler = function(result){
			console.log("get the data!" + result)
			
		}
		
		
		
		/* reporting */
		 
		var doTraffic = function(){
			
			Mobilitix.reportConfig = {
				metrics: 'ga:visits',
				dimension:'ga:date',
				sort: 'ga:date',
				results: '10',
				chartTarget: 'trafficChart',
				tableTarget: 'trafficTable',
				reportType: 'TIMELINE'
			};
			
			/*Mobilitix.reportConfig.dimension = "ga:date";
			Mobilitix.reportConfig.sort = "ga:date";
			Mobilitix.reportConfig.results = "10";
			Mobilitix.reportConfig.chartTarget = "trafficChart"; 
			Mobilitix.reportConfig.tableTarget = "trafficTable";
			Mobilitix.reportConfig.reportType = "PIE";
			*/
			console.log("let's do some traffic reporting!")
			dataManager();
			
			
		}
		
		
		var doVisitors = function(){
			console.log("let's do some visitors reporting!")
			
			Mobilitix.reportConfig = {
				metrics: 'ga:visits',
				dimension:'ga:medium',
				sort: 'ga:visits',
				results: '10',
				chartTarget: 'visitorsChart',
				tableTarget: 'visitorsTable',
				reportType: 'PIE'
				
			}
				
				
			/*
			Mobilitix.reportConfig.metrics = "ga:visits";
			Mobilitix.reportConfig.dimension = "ga:medium";
			Mobilitix.reportConfig.sort = "ga:visits"; 
			Mobilitix.reportConfig.results = "10";
			Mobilitix.reportConfig.chartTarget = "visitorsChart";
			Mobilitix.reportConfig.tableTarget = "visitorsTable"; 
			Mobilitix.reportConfig.reportType = "TIMELINE";
			*/
			
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
			Mobilitix.selectedAccount = caller.store.data.items[index].get('tableId');
			console.log(Mobilitix.selectedAccount);	
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
		
		//auth
		var checkAuth = function() {

			// auth
			if(!auth)
				google.accounts.user.login(scope);				
			else
				google.accounts.user.logout();	
				
        };

		
		init.bootstrap();
		
	
		
		
    }
});