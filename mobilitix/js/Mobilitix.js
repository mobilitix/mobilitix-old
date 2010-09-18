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
	
		
		
		var welcome = new Ext.Component({
			title: 'Mobilitix',
            cls: 'welcomeCnt',
			iconCls: 'settings',
			id: 'welcomeTab',
            scroll: 'vertical',
            html: ['<div style="height:35px"><h1 id="title">Mobile Web Analytics</h1>',
    			   '<img src="/img/dummy.gif" style="display:none" alt="required for Google Data"/></div>']
					
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
			console.log("checkauth");
			
			// auth
			if(!auth)
				google.accounts.user.login(scope);				
			else
				appInit();
							
        };


		// app Init
		var appInit = function(){
			Ext.get("accountButton").hide();
			
			showLoader();
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
			hideLoader();
			
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