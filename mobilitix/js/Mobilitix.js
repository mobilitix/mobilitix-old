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
		var auth = google.accounts.user.checkLogin(scope);
		
		Mobilitix.selectedAccount = null;
		Mobilitix.reportsEnabled = false;
		Mobilitix.startDate = '2010-09-01';
		Mobilitix.endDate = '2010-09-08';
		
		Mobilitix.AccountStore = new Ext.data.Store({
		    model: 'Account',
		    sorters: 'profileName',
		    getGroupString : function(record) {
		        return record.get('profileName')[0];
		    },
		    data: []
		});
		
		var calculateDesiredWidth = function() {
		    var viewWidth = Ext.Element.getViewportWidth(),
		        desiredWidth = Math.min(viewWidth, 400) - 10;
		
		    return desiredWidth;
		};
		
		var welcome = new Ext.Component({
			title: 'Mobilitix',
            cls: 'welcomeCnt',
			iconCls: 'settings',
			id: 'welcomeTab',
            scroll: 'vertical',
            html: ['<h1 id="title">Mobilitix</h1>',
					'<h2>Mobile Web Analytics</h2>',
      				'<button id="accountButton">Login</button>',
					'<div id="loading" style="visibility:hidden;">Loading your settings</div>',
    				'<img src="/img/dummy.gif" style="display:none" alt="required for Google Data"/>']
		});
		 



		
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
		    }],
			items: [{
		        xtype: 'fieldset',
		        items: [welcome]
		    }]
           
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
			// auth
			if(!auth)
				google.accounts.user.login(scope);				
			else
				appInit();
							
        };


		// app Init
		var appInit = function(){
			Ext.get("accountButton").hide();
			Ext.get("loading").show();
			var analyticsService = new google.gdata.analytics.AnalyticsService('Mobilitix-Webapp');	
   			var accountFeedUri = 'https://www.google.com/analytics/feeds/accounts/default?max-results=50'; 
	
			analyticsService.getAccountFeed(accountFeedUri, accountFeedHandler, errorHandler);
		}
		
		
		
		
		// analytics api data handlers
		var accountFeedHandler = function(result){
			var entries = result.feed.getEntries();
			console.log("accountHandler");
			
			for (var i = 0, entry; entry = entries[i]; ++i) {
				Mobilitix.AccountStore.add(
					{profileName:entry.getTitle().getText(), accountName:entry.getPropertyValue('ga:accountName'),tableId:entry.getTableId().getValue()}
				);
				//console.log(entry.getPropertyValue('ga:accountName') + ' ' + entry.getTitle().getText() + ' ' + entry.getTableId().getValue());
			}	
			
			accountList = new Ext.Panel({
				title:'Account List',
				cls: 'accontCnt',
				iconCls: 'accont',
				id: 'accoutTab',
				scroll: 'vertical',
			    layout: Ext.is.Phone ? 'fit' : {
			        type: 'vbox',
			        align: 'left',
			        pack: 'center'
			    },
			    cls: 'account-list',
			    items: [{
			        width: Ext.is.Phone ? undefined : 300,
			        height: 500,
			        xtype: 'list',
			        disclosure: {
			            scope: Mobilitix.AccountStore,
			            handler: function(record, btn, index) {
			                Mobilitix.selectedAccount = record.get('tableId');	
							checkReports();
							
			            }
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
			home.add(accountList);
			home.doLayout();
			
		}
		
		
		var enableReports = function(){
			console.log('enable reports');
			
			tabpanel.add(traffic,visitors,goals,campaigns)
			tabpanel.doLayout();
		}
		
		
		var checkReports = function(){
			console.log("you selected account:"  + Mobilitix.selectedAccount);
			if(Mobilitix.selectedAccount !== null && Mobilitix.reportsEnabled!==true){
				enableReports();
			}			
		}
		
		// query handler
		var dataManager = function(){
			var dataQuery = 'https://www.google.com/analytics/feeds/data' +
			
			    '?start-date=' + Mobilitix.startDate +
			    '&end-date=' + Mobilitix.endDate +
			    '&dimensions=ga:pageTitle,ga:pagePath' +
			    '&metrics=ga:pageviews' +
			    '&sort=-ga:pageviews' +
			    '&max-results=10' +
			    '&ids=' + Mobilitix.selectedAccount;
			  
			 analyticsService.getDataFeed(dataQuery, handleDataFeed, handleError);					
		}
		
		
		var dataFeedHandler = function(result){
			console.log("get the data!" + result)
			
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