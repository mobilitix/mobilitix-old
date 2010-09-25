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
		
		Mobilitix.selectedAccount = null;
		Mobilitix.reportsEnabled = false;
		Mobilitix.startDate = '2010-09-01';
		Mobilitix.endDate = '2010-09-08';
		
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
	

        var home = new Ext.Panel({
            title: 'Settings',
            cls: 'settingsCnt',
			iconCls: 'settings',
			id: 'settingsTab',
            scroll: 'vertical',
			align: 'center',
			dockedItems: [{
		        dock: 'top',
		        xtype: 'toolbar',
		        title: 'Mobilitix'
		    },{
				dock: 'bottom',
				xtype: 'button',				
				text: 'Login',
				ui:'round',
				id:'accountButton',
				handler:checkAuth
			}],
			items: [{
		        xtype: 'fieldset',
		        items: [welcome]
		    }]
           
        });


		// app initing
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
	            items: [home]
	        });	

		
		/* helpers */
		
		
		//auth
		var checkAuth = function() {
			Ext.get("accountButton").remove();
			
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
			        width: Ext.is.Phone ? getDesiredW(0) : 300,
			        height: getDesiredH(52),
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
			Ext.get('welcomeTab').hide();	
			hideLoader();

			
			home.add(accountList);
			home.doLayout();
			
		}
		
		
		var enableReports = function(){
			console.log('enable reports');
			
			tabpanel.add(traffic,visitors,goals,campaigns)
			tabpanel.doLayout();
			
			traffic.on("activate", doTraffic);
			visitors.on("activate", doVisitors);
			goals.on("activate", doGoals);
			campaigns.on("activate", doCampaigns);
			
		}
		
		
		var checkReports = function(){
			console.log("you selected account:"  + Mobilitix.selectedAccount);
			if(Mobilitix.selectedAccount !== null && Mobilitix.reportsEnabled!==true){
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
			
			    '?start-date=' + Mobilitix.startDate +
			    '&end-date=' + Mobilitix.endDate +
			    '&dimensions=ga:medium' +
			    '&metrics=ga:visits' +
			    '&sort=-ga:visits' +
			    '&max-results=10' +
			    '&ids=' + Mobilitix.selectedAccount;
			  
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
			
			var chart = new google.visualization.PieChart(document.getElementById('trafficDataHolder'));
    		chart.draw(data, {width: 400, height: 240, is3D: true, title: 'Visitors by traffic source'});
		      
		     
			
		}
		
		var dataFeedHandler = function(result){
			console.log("get the data!" + result)
			
		}
		
		
		
		/* reporting */
		 
		var doTraffic = function(){
			
			console.log("let's do some traffic reporting!")
			dataManager();
			
			
		}
		
		
		var doVisitors = function(){
			console.log("let's do some visitors reporting!")
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