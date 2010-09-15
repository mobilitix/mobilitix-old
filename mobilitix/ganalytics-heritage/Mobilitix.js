Ext.ns('Mobilitix');
Mobilitix.errorHandler = function(e) {
    Ext.Msg.show({
        title: e.name,
        msg: e.message,
        buttons: Ext.Msg.OK,
        icon: Ext.MessageBox.ERROR
    });
}

Ext.onReady(function() {
    google.gdata.client.init(Mobilitix.errorHandler);
	
	var loginScope = 'https://www.google.com/analytics/feeds';    
    var auth = google.accounts.user.checkLogin(loginScope);
    var analyticsService = new google.gdata.analytics.AnalyticsService('gaExportAPI_acctSample_v2.0');
	
	
	
	
	
	
    var store = new Ext.data.Store({
        proxy: new Ext.data.MobilitixProxy({
            analyticsService: analyticsService,
            uri: 'https://www.google.com/analytics/feeds/accounts/default',
            limit: 15
        }),
        reader: new Ext.data.JsonReader({
            totalProperty: 'total'
        }, [
            {name: 'accountName'},
            {name: 'title'},           
            {name: 'tableId'}
        ])
    });
   
    var loaded = false;
	
	
	if(auth){
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
            items: [{
                title: 'Account',
                html: '<h1>Choose account</h1>',
                iconCls: 'favorites',
                cls: 'card2'
                
            }, {
                title: 'Traffic',
                id: 'tab3',
                html: '<h1>Site Traffic</h1>',
                badgeText: 'Text can go here too, but it will be cut off if it is too long.',
                cls: 'card3',
                iconCls: 'download'
            }
			
			]
        });	
	}else{
		google.accounts.user.login(loginScope);
	}
	
	 
/*
    var vp = new Ext.Viewport({
        layout: 'fit',
        items: {
            xtype: 'editorgrid',
            id: 'gc-grid',
            stripeRows: true,
            autoExpandColumn: 'auto',
            store: store,
            viewConfig: {
                onLayout : function(vw, vh){
                    if ((vh !== 0) && (loaded === false)) {
                        console.log(vh);
                        loaded = true;
                        var pageSize = Math.floor(vh / 21);
                        console.log(pageSize);                      
                        pager.pageSize = pageSize;
                        store.proxy.limit = pageSize;
                        store.proxy.data.limit = pageSize;
                        if (auth) {
                            store.load();
                        }                                       
                    }
                }                
            },
            tbar: [{
                id: 'btn-login',
                text: 'Login',
                iconCls: 'i-login',
                disabled: auth,
                listeners: {
                    click: {
                        fn: function(o) {
                            google.accounts.user.login('http://www.google.com/m8/feeds/');
                        }
                    }
                }
            }, '-', {
                id: 'btn-logout',
                text: 'Logout',
                iconCls: 'i-logout',
                disabled: !auth,
                listeners: {
                    click: {
                        fn: function(o) {
                            google.accounts.user.logout();
                            o.disable();
                            Ext.getCmp('btn-login').enable();
                            Ext.getCmp('gc-grid').store.removeAll();
                        }
                    }
                }
            }],
            bbar: pager,            
            sm: new Ext.grid.RowSelectionModel({
                singleSelect: true
            }),
            columns: [{
                id: 'auto',
                header: "Title",
                align: 'left',
                sortable: false,
                dataIndex: 'title',
                editor: new Ext.form.TextField({
                })
            }, {
                width: 200,
                header: "Email Address",
                align: 'left',
                sortable: false,
                dataIndex: 'primaryEmail',
                editor: new Ext.form.TextField({
                })
            }, {
                header: "Phone Number",
                align: 'center',
                width: 120,
                sortable: false,
                dataIndex: 'primaryPhone',
                editor: new Ext.form.TextField({
                })
            }],
            listeners: {
                afteredit: {
                    fn: function(o) {
                        var entry = o.record.data.rawObj;
                        if (o.field == 'title') {
                            entry.setTitle(google.gdata.Text.create(o.value));
                        }
                        if (o.field == 'primaryEmail') {
                            var emailAddresses = entry.getEmailAddresses();
                            if (!emailAddresses.length) { // New Email
                                var primaryObj = new google.gdata.Email();
                                primaryObj.setAddress(o.value);
                                primaryObj.setRel(google.gdata.Email.REL_WORK);
                                entry.setEmailAddresses([primaryObj]);
                            } else {
                                var idx = 0;
                                var primaryObj = emailAddresses[0];
                                for (var j = 0; j < emailAddresses.length; j++) {
                                    if (emailAddresses[j].getPrimary()) {
                                        idx = j;
                                        var primaryObj = emailAddresses[j];
                                    }
                                }
                                if (primaryObj) {
                                    if (o.value == '') { // Delete Email
                                        emailAddresses.splice(idx, 1);
                                    } else { // Update Email
                                        primaryObj.setAddress(o.value);
                                    }
                                }
                            }
                        }
                        if (o.field == 'primaryPhone') {
                            var phoneNumbers = entry.getPhoneNumbers();
                            if (!phoneNumbers.length) { // New Phone
                                var primaryObj = new google.gdata.PhoneNumber();
                                primaryObj.setValue(o.value);
                                primaryObj.setRel(google.gdata.PhoneNumber.REL_WORK);
                                entry.setPhoneNumbers([primaryObj]);
                            } else {
                                var idx = 0;
                                var primaryObj = phoneNumbers[0];
                                for (var j = 0; j < phoneNumbers.length; j++) {
                                    if (phoneNumbers[j].getPrimary()) {
                                        idx = j;
                                        var primaryObj = phoneNumbers[j];
                                    }
                                }
                                if (primaryObj) {
                                    if (o.value == '') { // Delete Phone
                                        phoneNumbers.splice(idx, 1);
                                    } else { // Update Phone
                                        primaryObj.setValue(o.value);
                                    }
                                }
                            }
                        }
                        // Commit Changes
                        entry.updateEntry(function() {
                            Ext.getCmp('gc-grid').store.commitChanges();
                        }, Mobilitix.errorHandler);
                    }
                }
            }
        }
    });
	*/
});