/*
 * @author Carlos P.C <carlos@colosa.com, pckrlos@gmail.com>
 * Oct 20th, 2011
 */

Ext.onReady(function(){


  var txtSourceId=new Ext.form.TextField({
  id: 'AUTH_SOURCE_UID',				
  fieldLabel: 'krlos', 
  xtype:'textfield',
  value:'',
  width: 200,
  hideLabel: true,
  hidden : true,
  });

  var txtSourceProvider=new Ext.form.TextField({
  id: 'AUTH_SOURCE_PROVIDER',				
  fieldLabel: 'krlos', 
  xtype:'textfield',
  value:sprovider,
  width: 200,
  hideLabel: true,
  hidden : true,
  });

  var txtName=new Ext.form.TextField({
  id: 'AUTH_SOURCE_NAME',				
  fieldLabel: _('ID_NAME'), 
  xtype:'textfield',
  value:'',
  width: 200,
  autoCreate: {tag: 'input', type: 'text', size: '20', autocomplete: 'off', maxlength: '13'},
  allowBlank: false,
  listeners: {
              'render': function(c) {
                c.getEl().on('keyup', function() {
                }, c);
              }
            }
  });

  var my_values = [['ldap'],['Active Directory']];
  var cboxType = new Ext.form.ComboBox({
      fieldLabel: _('ID_TYPE'),
      hiddenName: 'LDAP_TYPE',
      store: new Ext.data.SimpleStore({
          fields: ['ldap','ad'],
          data : my_values 
      }),
      displayField: 'ldap',
      typeAhead: true,
      mode: 'local',
      triggerAction: 'all',
      emptyText:'Choose an option...',
      selectOnFocus:true,
      listeners:{
       select: function(c,d,i){
          if(i){
            formAuthSource.getForm().findField('AUTH_SOURCE_ATTRIBUTES').setValue('cn' + "\n" + 'samaccountname' + "\n" + 'givenname' + "\n" + 'sn' + "\n" + 'userprincipalname' + "\n" + 'telephonenumber');
          } else {
            formAuthSource.getForm().findField('AUTH_SOURCE_ATTRIBUTES').setValue('cn' + "\n" + 'uid' + "\n" + 'givenname' + "\n" + 'sn' + "\n" + 'mail' + "\n" + 'mobile');
          }
       }
      }
  });

  var txtServerName=new Ext.form.TextField({
  id: 'AUTH_SOURCE_SERVER_NAME',				
  fieldLabel: _('ID_SERVER_NAME'), 
  xtype:'textfield',
  value:'',
  width: 200,
  autoCreate: {tag: 'input', type: 'text', size: '20', autocomplete: 'off', maxlength: '13'},
  allowBlank: false,
  listeners: {
              'render': function(c) {
                c.getEl().on('keyup', function() {
                }, c);
              }
            }
  });

  var txtPort=new Ext.form.TextField({
    id: 'AUTH_SOURCE_PORT',				
    fieldLabel: _('ID_PORT'), 
    xtype:'textfield',
    value:'389',
    width: 200,
    autoCreate: {tag: 'input', type: 'text', size: '10', autocomplete: 'off', maxlength: '13'},
    allowBlank: false,
    listeners: {
                'render': function(c) {
                  c.getEl().on('keyup', function() {
                  }, c);
                }
              }
    });
  var my_valuesTLS= [['no'],['yes']];
  var cboxTLS = new Ext.form.ComboBox({
      fieldLabel: _('ID_ENABLED_TLS'),
      hiddenName: 'AUTH_SOURCE_ENABLED_TLS',
      store: new Ext.data.SimpleStore({
          fields: ['no','yes'],
          data : my_valuesTLS
      }),
      displayField: 'no',
      typeAhead: true,
      mode: 'local',
      triggerAction: 'all',
      emptyText:'Choose an option...',
      selectOnFocus:true
  });

  var my_values_version= [['2'],['3']];
  var cboxVersion = new Ext.form.ComboBox({
      fieldLabel: _('ID_VERSION'),
      hiddenName: 'AUTH_SOURCE_VERSION',
      store: new Ext.data.SimpleStore({
          fields: ['two','three'],
          data : my_values_version
      }),
      displayField: 'two',
      typeAhead: true,
      mode: 'local',
      triggerAction: 'all',
      emptyText:'Choose an option...',
      selectOnFocus:true
  });


  var txtBaseDN=new Ext.form.TextField({
    id: 'AUTH_SOURCE_BASE_DN',				
    fieldLabel: _('ID_BASE_DN'), 
    xtype:'textfield',
    value:'',
    width: 200,
    autoCreate: {tag: 'input', type: 'text', size: '10', autocomplete: 'off', maxlength: '13'},
    allowBlank: false,
    listeners: {
                'render': function(c) {
                  c.getEl().on('keyup', function() {
                  }, c);
                }
              }
    });

  var my_values_Anonymous= [['no'],['yes']];
  var cboxAnonymous = new Ext.form.ComboBox({
      fieldLabel: _('ID_ANONYMOUS'),
      hiddenName: 'AUTH_ANONYMOUS',
      store: new Ext.data.SimpleStore({
          fields: ['0','1'],
          data : my_values_Anonymous
      }),
      displayField: '0',
      typeAhead: true,
      mode: 'local',
      triggerAction: 'all',
      emptyText:'Choose an option...',
      selectOnFocus:true,
//      width: 110,
       listeners:{
            select: function(c,d,i){
            if (!i){
                Ext.getCmp("AUTH_SOURCE_SEARCH_USER").enable();
                Ext.getCmp("AUTH_SOURCE_SEARCH_USER").show();
                txtSearchUser.getEl().up('.x-form-item').setDisplayed(true);
                Ext.getCmp("AUTH_SOURCE_PASSWORD").enable();
                Ext.getCmp("AUTH_SOURCE_PASSWORD").show();
                txtPassword.getEl().up('.x-form-item').setDisplayed(true);
            }else{
                Ext.getCmp("AUTH_SOURCE_SEARCH_USER").disable(); 
                Ext.getCmp("AUTH_SOURCE_SEARCH_USER").hide();
                txtSearchUser.getEl().up('.x-form-item').setDisplayed(false);
                Ext.getCmp("AUTH_SOURCE_PASSWORD").disable(); 
                Ext.getCmp("AUTH_SOURCE_PASSWORD").hide();
                txtPassword.getEl().up('.x-form-item').setDisplayed(false);                
            }     
           }
          }
  });

  var txtSearchUser=new Ext.form.TextField({
    id: 'AUTH_SOURCE_SEARCH_USER',				
    fieldLabel: _('ID_SEARCH_USER'), 
    xtype:'textfield',
    value:'',
    width: 200,
    autoCreate: {tag: 'input', type: 'text', size: '20', autocomplete: 'off', maxlength: '13'},
    listeners: {
                'render': function(c) {
                  c.getEl().on('keyup', function() {
                  }, c);
                }
              }
    });

  var txtPassword=new Ext.form.TextField({
    id: 'AUTH_SOURCE_PASSWORD',				
    fieldLabel: _('ID_CACHE_PASSWORD'), 
    xtype:'textfield',
    inputType:'password',
    value:'',
    width: 200,
    autoCreate: {tag: 'input', type: 'text', size: '20', autocomplete: 'off', maxlength: '13'},
    listeners: {
                'render': function(c) {
                  c.getEl().on('keyup', function() {
                  }, c);
                }
              }
    });

//Identifier for an imported user
  var txtIdentifier=new Ext.form.TextField({
    id: 'AS_INDENTIFIER',				
    fieldLabel: _('ID_IDENTIFIER_IMPORT_USER'), 
    xtype:'textfield',
    value:'uid',
    width: 200,
    autoCreate: {tag: 'input', type: 'text', size: '20', autocomplete: 'off', maxlength: '13'},
    allowBlank: false,
    listeners: {
                'render': function(c) {
                  c.getEl().on('keyup', function() {
                  }, c);
                }
              }
    });
//Object Classes
  var txtaClass=new Ext.form.TextArea({
    id: 'AUTH_SOURCE_OBJECT_CLASSES',				
    fieldLabel: _('ID_OBJECT_CLASS'), 
    xtype:'textarea',
    value:'*',
    width: 200,
    allowBlank: false,
    listeners: {
                'render': function(c) {
                  c.getEl().on('keyup', function() {
                  }, c);
                }
              }
    });
//Additional Filter
  var txtoAddFilter=new Ext.form.TextField({
    id: 'AUTH_SOURCE_ADDITIONAL_FILTER',				
    fieldLabel: _('ID_ADDITIONAL_FILTER'), 
    xtype:'textfield',
    value:'',
    width: 200,
    autoCreate: {tag: 'input', type: 'text', size: '20', autocomplete: 'off', maxlength: '13'},
    allowBlank: false,
    listeners: {
                'render': function(c) {
                  c.getEl().on('keyup', function() {
                  }, c);
                }
              }
    });
//Attributes
  var txtAttributes=new Ext.form.TextArea({
    id: 'AUTH_SOURCE_ATTRIBUTES',				
    fieldLabel: _('ID_ATTRIBUTES'), 
    xtype:'textArea',
    value:'cn' + "\n" + 'uid' + "\n" + 'givenname' + "\n" + 'sn' + "\n" + 'mail' + "\n" + 'mobile',
    width: 200,
    allowBlank: false,
    listeners: {
                'render': function(c) {
                  c.getEl().on('keyup', function() {
                  }, c);
                }
              }
    });
//here we are setting the fields
  fieldsAS = new Ext.form.FieldSet({
    title: 'Authentication Source Information',  
    items: [
            txtSourceId,
            txtSourceProvider,
            txtName,
            cboxType,
            txtServerName,         
            txtPort,
            cboxTLS,
            cboxVersion,
            txtBaseDN,
            cboxAnonymous,
            txtSearchUser,
            txtPassword ,
            txtIdentifier,
            txtaClass,
            txtoAddFilter,
            txtAttributes
            ]    
    });


  formAuthSource = new Ext.FormPanel({
    id:'formAuthSource',       
    labelWidth: 250,
    labelAlign:'right',
    autoScroll: true,
    fileUpload: true,
    width:800,
    bodyStyle:'padding:10px',
    waitMsgTarget : true,
    frame: true,
    defaults: {
      anchor: '100%',
      allowBlank: false,
      resizable: true,
      msgTarget: 'side',
      align:'center'      
    },
    items:[
    fieldsAS
    ],
    buttons: [
      {
        text: 'Save',
        handler: TestSite       
      
      },
      {     
        text: 'Cancel',
        handler: goback
      }
    ]
    
  });

    formAuthSource.render(document.body);
    
 });
 function goback(){
    window.location = 'authSources_List';
 }
 function TestSite(){
   formAuthSource.getForm().submit({
    url: '../adminProxy/saveAuthSources',
      params: {
    //                            action : 'tryit',
       AUTH_SOURCE_UID:  formAuthSource.getForm().findField('AUTH_SOURCE_UID').getValue(), 
       AUTH_SOURCE_NAME: formAuthSource.getForm().findField('AUTH_SOURCE_NAME').getValue(),
       LDAP_TYPE: formAuthSource.getForm().findField('LDAP_TYPE').getValue(),
       AUTH_SOURCE_SERVER_NAME: formAuthSource.getForm().findField('AUTH_SOURCE_SERVER_NAME').getValue(),
       AUTH_SOURCE_PORT: formAuthSource.getForm().findField('AUTH_SOURCE_PORT').getValue(),
       AUTH_SOURCE_ENABLED_TLS: formAuthSource.getForm().findField('AUTH_SOURCE_ENABLED_TLS').getValue(),
       AUTH_ANONYMOUS: formAuthSource.getForm().findField('AUTH_ANONYMOUS').getValue(),
       AUTH_SOURCE_SEARCH_USER: formAuthSource.getForm().findField('AUTH_SOURCE_SEARCH_USER').getValue(),
       AUTH_SOURCE_PASSWORD: formAuthSource.getForm().findField('AUTH_SOURCE_PASSWORD').getValue(),
       AUTH_SOURCE_VERSION: formAuthSource.getForm().findField('AUTH_SOURCE_VERSION').getValue(),
       AUTH_SOURCE_BASE_DN: formAuthSource.getForm().findField('AUTH_SOURCE_BASE_DN').getValue(),
       AUTH_SOURCE_OBJECT_CLASSES: formAuthSource.getForm().findField('AUTH_SOURCE_OBJECT_CLASSES').getValue(),
       AUTH_SOURCE_ATTRIBUTES: formAuthSource.getForm().findField('AUTH_SOURCE_ATTRIBUTES').getValue(),
       AUTH_SOURCE_ADDITIONAL_FILTER: formAuthSource.getForm().findField('AUTH_SOURCE_ADDITIONAL_FILTER').getValue()
       
      },
      waitMsg : 'testing...',
      timeout : 3600,
      success: function(f,a){
       
       resp = Ext.util.JSON.decode(a.response.responseText);
       if (resp.success){
         window.location = 'authSources_List';
       }


      },
      failure: function(f,a){
          if (a.failureType === Ext.form.Action.CONNECT_FAILURE){
              Ext.Msg.alert('Failure', 'Server reported:'+a.response.status+' '+a.response.statusText);
          }
          if (a.failureType === Ext.form.Action.SERVER_INVALID){
              Ext.Msg.alert('Warning', 'you have an error');
          }
      }
    });
 } 
 
 
