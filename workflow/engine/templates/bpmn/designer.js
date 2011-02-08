new Ext.KeyMap(document, {
  key: Ext.EventObject.F5,
  fn: function(keycode, e) {
    e.stopEvent();      
    if (Ext.isIE)
      e.browserEvent.keyCode = 8;
    e.stopEvent();
    Ext.Msg.alert('Refresh', 'You clicked: F5');
    location = "../bpmn/designer?PRO_UID=" + pro_uid;
    document.location = document.location;
  }
});


var saveProcess;

Ext.onReady ( function() {

  workflow  = new MyWorkflow("paintarea");
  workflow.setEnableSmoothFigureHandling(false);
  workflow.scrollArea.width = 2000;
  //For Undo and Redo Options
  // workflow.getCommandStack().addCommandStackEventListener(new commandListener());
  //Getting process id from the URL using getUrlvars function
  //var pro_uid = getUrlVars();

  if(typeof pro_uid !== 'undefined') {
    Ext.Ajax.request({
      url: 'openProcess.php?PRO_UID=' + pro_uid,
      success: function(response) {
        shapesData =  createShapes(response.responseText,this);
        createConnection(shapesData);
      },
      failure: function(){
        Ext.Msg.alert ('Failure');
      }
    });
  }

  

  /**********************************************************************************
  *
  * Do the Ext (Yahoo UI) Stuff
  *
  **********************************************************************************/
  var west= {
    id         : 'palette',
    title      : 'Palette',
    region     : 'west',
    width      : 65,
    border     : false,
    autoScroll : true,
    collapsible :true,
    split       :true,
    //collapseMode:'mini',
    hideCollapseTool: false,

    items:{
      html:'<div id="x-shapes">\n\
        <p id="x-shapes-task" title="Task" ><img src= "/skins/ext/images/gray/shapes/pallete/task.png"/></p>\n\
        <p id="x-shapes-startEvent" title="Start"><img src= "/skins/ext/images/gray/shapes/pallete/startevent.png"/></p>\n\
        <p id="x-shapes-interEvent" title="Intermediate Event"><img src= "/skins/ext/images/gray/shapes/pallete/interevent.png"/></p>\n\
        <p id="x-shapes-endEvent" title="End Event"><img src= "/skins/ext/images/gray/shapes/pallete/endevent.png"/></p>\n\
        <p id="x-shapes-gateways" title="Gateway"><img src= "/skins/ext/images/gray/shapes/pallete/gateway.png"/></p>\n\
        <p id="x-shapes-annotation" title="Annotation"><img src= "/skins/ext/images/gray/shapes/pallete/annotation.png"/></p>\n\
        <!--<p id="x-shapes-group" title="Group"><img src= "/skins/ext/images/gray/shapes/pallete/group.png"/></p>\n\
        <p id="x-shapes-dataobject" title="Data Object"><img src= "/skins/ext/images/gray/shapes/pallete/dataobject.png"/></p>\n\
        <p id="x-shapes-pool" title="Pool"><img src= "/skins/ext/images/gray/shapes/pallete/pool.png"/></p>\n\
        <p id="x-shapes-lane" title="Lane"><img src= "/skins/ext/images/gray/shapes/pallete/lane.png"/></p>\n\
        <p id="x-shapes-milestone" title="Milestone"><img src= "/skins/ext/images/gray/shapes/pallete/milestone.png"/></p>-->\n\
      </div>'
    }
  };
  
  var east= {
    id         : 'eastPanel',
    title      : '',
    region     : 'east',
    width      : 150,
    border     : false,
    autoScroll : true,
    collapsible :true,
    split       :true,
    collapseMode:'mini',
    hideCollapseTool: false,

    items:{
      html:'east panel'
    }
  };

  var north= {
    xtype	:	"panel",
    initialSize: 60,
    split:false,
    titlebar: false,
    collapsible: false,
    animate: false,
    region	:	"north"
  };
  
  var south= {
    xtype	:	"panel",
    initialSize: 120,
    height: 100,
    split:true,
    titlebar: false,
    collapsible: true,
    autoScroll:true,
    animate: true,
    region	:	"south",
    items: {
      region: 'center',
      xtype: 'tabpanel',
      items: [{
        title: 'Properties',
        html: 'Properties'
      },
      {
        title: 'Debug Console',
        html: 'Debug Console'
      }]
    }
  };

  var center= {
    id: 'centerRegion',
    width:100,
    height:2000,
    xtype	:	"panel",
    //autoScroll:true,
    fitToFrame:true,
    region	:	"center"
  };

  var processObj = new ProcessOptions();

  var main = new Ext.Panel({
    renderTo  : "center1",
    region    : "center",
    layout    : "border",
    autoScroll: true,
    height    : 1000,
    width     : 1300,
    //items   : [west, north, center]
    items   : [north, center]
  });
  

  var designaerToolbar = new Ext.Window({
    id: 'designaerToolbar',
    title: '<center>Toolbar</center>',
    titleAlign: 'center',
    width: 320,
    height:70,
    x: 0,
    y: 0,
    minimizable: true,
    maximizable: false,
    closable: false,
    resizable: false,
    floating: true,
      
    shim: true,
    plugin: new Ext.ux.WindowAlwaysOnTop,
    html: '<div id="x-shapes">\n\
      <p id="x-shapes-task" class="toolbar-item"><img src= "/skins/ext/images/gray/shapes/pallete/task.png"/></p>\n\
      <p id="x-shapes-startEvent" class="toolbar-item"><img src= "/skins/ext/images/gray/shapes/pallete/startevent.png"/></p>\n\
      <p id="x-shapes-interEvent" class="toolbar-item"><img src= "/skins/ext/images/gray/shapes/pallete/interevent.png"/></p>\n\
      <p id="x-shapes-endEvent" title="" class="toolbar-item"><img src= "/skins/ext/images/gray/shapes/pallete/endevent.png"/></p>\n\
      <p id="x-shapes-gateways" title="" class="toolbar-item"><img src= "/skins/ext/images/gray/shapes/pallete/gateway.png"/><br/></p>\n\
      <p id="x-shapes-annotation" title="" class="toolbar-item"><img src= "/skins/ext/images/gray/shapes/pallete/annotation.png"/></p>\n\
      <!--<p id="x-shapes-group" title="Group"><img src= "/skins/ext/images/gray/shapes/pallete/group.png"/></p>\n\
      <p id="x-shapes-dataobject" title="Data Object" class="toolbar-item"><img src= "/skins/ext/images/gray/shapes/pallete/dataobject.png"/></p>\n\
      <p id="x-shapes-pool" title="Pool" class="toolbar-item"><img src= "/skins/ext/images/gray/shapes/pallete/pool.png"/></p>\n\
      <p id="x-shapes-lane" title="Lane" class="toolbar-item"><img src= "/skins/ext/images/gray/shapes/pallete/lane.png"/></p>\n\
      <p id="x-shapes-milestone" title="Milestone" class="toolbar-item"><img src= "/skins/ext/images/gray/shapes/pallete/milestone.png"/></p>-->\n\
    </div>'
  });
  designaerToolbar.on('minimize',function(w){
    //console.debug('minimizing...');
    if( w.collapsed )
      designaerToolbar.expand();
    else
      designaerToolbar.collapse(); //collapse the window
    
  });
  
  designaerToolbar.show();


var win = Ext.getCmp('designaerToolbar');
var divScroll = document.body;

// custom variables
win._posRelToView = win.getPosition(true);
win._scrollPosTimer = false;
win._moveBlocker = false;
win.show();



// save relative pos to view when moving (for scrolling event below)
// also, manually do a constrain, else the win would be lost if moved outside the view
win.on('move', function() {
    // lock function (because we move the window again inside)
    if (win._moveBlocker) return;
    win._moveBlocker = true;

    var winPos = win.getPosition(true);
    win._posRelToView = [winPos[0] - divScroll.scrollLeft, winPos[1] - divScroll.scrollTop];

    // manually do what constrain should do if it worked as assumed
    var layersize = [Ext.get(divScroll).getWidth(), Ext.get(divScroll).getHeight()];
    var windowsize = [win.getSize().width, win.getSize().height];
    // assumed width of the scrollbar (true for windows 7) plus some padding to be sure
    var scrollSize = 17 + 5;
    if (win._posRelToView[0] < 0) { // too far left
        win.setPosition(divScroll.scrollLeft, winPos[1]);
        win._posRelToView = [0, win._posRelToView[1]];
    } else if (win._posRelToView[0] >= (layersize[0] - windowsize[0])) { // too far right
        win.setPosition(((divScroll.scrollLeft + layersize[0]) - windowsize[0] - scrollSize), winPos[1]);
        win._posRelToView = [(layersize[0] - windowsize[0] - scrollSize), win._posRelToView[1]];
    }

    winPos = win.getPosition(true); // update pos
    if (win._posRelToView[1] < 0) { // too high up
        win.setPosition(winPos[0], divScroll.scrollTop);
        win._posRelToView = [win._posRelToView[0], 0];
    } else if (win._posRelToView[1] >= layersize[1]) { // too low
        win.setPosition(winPos[0], ((divScroll.scrollTop + layersize[1]) - windowsize[1] - scrollSize));
        win._posRelToView = [win._posRelToView[0], (layersize[1] - windowsize[1] - scrollSize)];
    }

    // release function
    win._moveBlocker = false;
});



  Ext.fly(document).on("scroll", function(){
    //console.log("body scrolled");
    //alert(document.body.scrollTop);
    
    
    //var _posRelToView = win.getPosition(true);

    //alert(win.x +'   '+ win.y);
    //win.setPosition(_posRelToView[0] + divScroll.scrollLeft, _posRelToView[1] + divScroll.scrollTop)



    if (win._scrollPosTimer) {
        clearTimeout(win._scrollPosTimer);
    }
    win._scrollPosTimer = setTimeout(function() {
        win.setPosition(win._posRelToView[0] + divScroll.scrollLeft, win._posRelToView[1] + divScroll.scrollTop);
    }, 100);
    
  });

   

  new Ext.ToolTip({
      target: 'x-shapes-task',
      title: 'Task',
      trackMouse: true,
      anchor: 'top',
      html: ''
  });
  new Ext.ToolTip({
      target: 'x-shapes-startEvent',
      title: '  Start Event',
      trackMouse: true,
      anchor: 'top',
      html: ''
  });
  new Ext.ToolTip({
      target: 'x-shapes-interEvent',
      title: 'Intermediate Event',
      trackMouse: true,
      anchor: 'top',
      html: ''
  });
  new Ext.ToolTip({
      target: 'x-shapes-endEvent',
      title: 'End Event',
      trackMouse: true,
      anchor: 'top',
      html: ''
  });
  new Ext.ToolTip({
      target: 'x-shapes-gateways',
      title: 'Gateway',
      trackMouse: true,
      anchor: 'top',
      html: ''
  });
  new Ext.ToolTip({
      target: 'x-shapes-annotation',
      title: 'Annotation',
      anchor: 'left',
      trackMouse: true,
      html: ''
  });


  //Getting Process name and setting Title of center region to that processname
  /*var urlparams = '?action=load&data={"uid":"'+ pro_uid +'"}';
  Ext.Ajax.request({
      url: "processes_Ajax.php"+ urlparams,
      success: function(response) {
          var processes = Ext.util.JSON.decode(response.responseText);
          main.items.items[2].setTitle(processes.title.label);     //items[2]=>center region
      },
      failure: function(){
          Ext.Msg.alert ('Failure');
      }
  });*/

  //Get main into workflow object
  workflow.main = main;
  //items[3]=>'center region'
  var centerRegionId = Ext.getCmp('centerRegion').body.id;
  canvas = Ext.get(centerRegionId);

  //Context Menu of ProcessMap
  ProcessMapObj = new ProcessMapContext();
  contextCanvasMenu = new Ext.menu.Menu({
      items: [{
          text: 'Edit Process',
          handler: ProcessMapObj.editProcess,
          //icon: '/skins/ext/images/gray/shapes/more.gif',
          iconCls: 'button_menu_ext ss_sprite ss_page_white_edit',
          scope: this
      }, {
          text: 'Export Process',
          handler: ProcessMapObj.exportProcess,
          iconCls: 'button_menu_ext ss_sprite ss_script_go',
          scope: this
      }, {
          text: 'Add Task',
          handler: ProcessMapObj.addTask,
          iconCls: 'button_menu_ext ss_sprite ss_layout_add',
          scope: this
      }, {
          text: 'Add Subprocess',
          handler: workflow.subProcess,
          iconCls: 'button_menu_ext ss_sprite ss_layout_link',
          scope: this
      },/* {
          text: 'Horizontal Line',
          handler: ProcessMapObj.horiLine,
          scope: this
      }, {
          text: 'Vertical Line',
          handler: ProcessMapObj.vertiLine,
          scope: this
      }, {
          text: 'Delete All Lines',
          handler: ProcessMapObj.delLines,
          scope: this
      }, */{
          text: 'Process Permission',
          iconCls: 'button_menu_ext ss_sprite ss_application_key',
          handler: ProcessMapObj.processPermission,
          scope: this
      },{
          text: 'Process Supervisor',
          iconCls: 'button_menu_ext ss_sprite ss_group',
          menu: {        // <-- submenu by nested config object
                  items: [
                      // stick any markup in a menu
                      {
                          text: 'Supervisors',
                          iconCls: 'button_menu_ext ss_sprite ss_group',
                          handler: ProcessMapObj.processSupervisors
                      },
                      {
                          text: 'DynaForm',
                          iconCls: 'button_menu_ext ss_sprite ss_application_form',
                          handler: ProcessMapObj.processDynaform
                      },
                      {
                          text: 'Input Documents',
                          iconCls: 'button_menu_ext ss_sprite ss_page_white_put',
                          handler: ProcessMapObj.processIODoc
                      }
                  ]
              }
      },{
          text: 'Case Tracker',
          iconCls: 'button_menu_ext ss_sprite ss_exclamation',

          menu: {        // <-- submenu by nested config object
                  items: [
                      // stick any markup in a menu
                      {
                          text: 'Properties',
                          iconCls: 'button_menu_ext ss_sprite ss_exclamation',
                          handler: ProcessMapObj.caseTrackerProperties,
                          scope:this
                      },
                      {
                          text: 'Objects',
                          iconCls: 'button_menu_ext ss_sprite ss_exclamation',
                          handler: ProcessMapObj.caseTrackerObjects,
                          scope:this
                      }
                  ]
              }
      }, {
          text: 'Process File Manager',
          iconCls: 'button_menu_ext ss_sprite ss_folder',
          menu: {        // <-- submenu by nested config object
                  items: [
                      // stick any markup in a menu
                      {
                          text: 'mailTemplates',
                          iconCls: 'button_menu_ext ss_sprite ss_email',
                          handler: ProcessMapObj.processFileManager
                      },
                      {
                          text: 'public',
                          iconCls: 'button_menu_ext ss_sprite ss_folder_go',
                          handler: ProcessMapObj.processFileManager
                      }
                  ]
              }
      }]
  });

  canvas.on('contextmenu', function(e) {
      e.stopEvent();
      this.workflow.contextX = e.xy[0];
      this.workflow.contextY = e.xy[1];
      var pmosExtObj = new pmosExt();
      //Load all the process Data
      pmosExtObj.loadEditProcess(this);
      pmosExtObj.loadProcessCategory(this);
      this.contextCanvasMenu.showAt(e.getXY());
  }, this);

  canvas.on('click', function(e) {
      e.stopEvent();
      this.workflow.contextClicked = false;
      if(this.workflow.currentSelection != null)
          this.workflow.disablePorts(this.workflow.currentSelection);
      //Removes Flow menu
      this.workflow.setCurrentSelection(null);
  }, this);

  var simpleToolbar = new Ext.Toolbar('toolbar');
  simpleToolbar.addButton({
      text: 'Save',
      cls: 'x-btn-text-icon scroll-bottom'
  });
  simpleToolbar.addButton({
      text: 'Save As',
      cls: 'x-btn-text-icon scroll-bottom'
  });
  simpleToolbar.addButton({
      text: 'Undo',
      cls: 'x-btn-text-icon'
  });
  simpleToolbar.addButton({
      text: 'Redo',
      cls: 'x-btn-text-icon'
  });

  var menu = new FlowMenu(workflow);
  workflow.addSelectionListener(menu);
  workflow.scrollArea = document.getElementById(centerRegionId).parentNode;
  
  
  
  
  
  var dragsource=new Ext.dd.DragSource("x-shapes-task", {
      ddGroup:'TreeDD',
      dragData:{
          name: "bpmnTask"
      }
  });
  var dragsource=new Ext.dd.DragSource("x-shapes-startEvent", {
      ddGroup:'TreeDD',
      dragData:{
          name: "bpmnEventEmptyStart"
      }
  });
  var dragsource=new Ext.dd.DragSource("x-shapes-interEvent", {
      ddGroup:'TreeDD',
      dragData:{
          name: "bpmnEventEmptyInter"
      }
  });
  var dragsource=new Ext.dd.DragSource("x-shapes-endEvent", {
      ddGroup:'TreeDD',
      dragData:{
          name: "bpmnEventEmptyEnd"
      }
  });
  var dragsource=new Ext.dd.DragSource("x-shapes-gateways", {
      ddGroup:'TreeDD',
      dragData:{
          name: "bpmnGatewayExclusiveData"
      }
  });
  /*var dragsource=new Ext.dd.DragSource("x-shapes-dataobject", {
      ddGroup:'TreeDD',
      dragData:{
          name: "bpmnDataobject"
      }
  });
  var dragsource=new Ext.dd.DragSource("x-shapes-pool", {
      ddGroup:'TreeDD',
      dragData:{
          name: "bpmnPool"
      }
  });*/
  var dragsource=new Ext.dd.DragSource("x-shapes-annotation", {
      ddGroup:'TreeDD',
      dragData:{
          name: "bpmnAnnotation"
      }
  });


  var droptarget=new Ext.dd.DropTarget(centerRegionId,{
      ddGroup:'TreeDD'
  });

  //Creating Pool
  var oPool = new bpmnPool(workflow);
  //workflow.addFigure(oPool,100,70);
  if(workflow.taskNo == '')
      workflow.taskNo= 0; //Initializing Count for the bpmnTask
  var count = 0;
  this.taskName='';
  droptarget.notifyDrop=function(dd, e, data)
  {
      if(data.name)
      {
          var xOffset    = workflow.getAbsoluteX();
          var yOffset    = workflow.getAbsoluteY();
          if(data.name == 'bpmnTask')
          {
              workflow.boundaryEvent = false;
          }


          NewShape = eval("new "+data.name+"(workflow)");
          NewShape.x = e.xy[0];
          NewShape.y = e.xy[1];
          NewShape.actiontype = 'addTask';

          if(data.name == 'bpmnAnnotation')
              {
                  NewShape.actiontype = 'addText';
                  workflow.saveShape(NewShape);      //Saving task when user drags and drops it
              }
          if(data.name == 'bpmnTask')
              {
                  NewShape.actiontype = 'addTask';
                  workflow.saveShape(NewShape);      //Saving Annotations when user drags and drops it
                  // NewShape.taskName = workflow.taskName;
              }




          var scrollLeft = workflow.getScrollLeft();
          var scrollTop  = workflow.getScrollTop();
          workflow.addFigure(NewShape,e.xy[0]-xOffset+scrollLeft,e.xy[1]-yOffset+scrollTop);
          return true;
      }
  }


  function createConnection(shapes)
  {
      //var totaltask = shapes[0].length;                //shapes[0] is an array for all the tasks
      //var totalgateways = shapes[1].length;          //shapes[1] is an array for all the gateways
      //var totalevents = shapes[2].length;           //shapes[2] is an array for all the events
      var totalroutes  = shapes.routes.length;           //shapes[3] is an array for all the routes

      for(var i=0;i<=totalroutes-1;i++)
      {
          var sourceid = shapes.routes[i][1];      //getting source id for connection from Routes array
          var targetid = shapes.routes[i][2];      //getting target id for connection from Routes array

          //After creating all the shapes, check one by one shape id
          for(var conn =0; conn < this.workflow.figures.data.length ; conn++)
          {
              if(typeof this.workflow.figures.data[conn] === 'object')
              {
                  if(sourceid == this.workflow.figures.data[conn].id){
                      sourceObj = this.workflow.figures.data[conn];
                  }
              }
          }

          for(var conn =0; conn < this.workflow.figures.data.length ; conn++)
          {
              if(typeof this.workflow.figures.data[conn] === 'object')
              {
                  //If End Process or Evaluate
                  if(targetid == '-1' || typeof shapes.routes[i][5] != 'undefined' && shapes.routes[i][5] == 'EVALUATE')
                  {
                      targetObj = eval("new bpmnEventEmptyEnd (this.workflow)");
                      this.workflow.addFigure(targetObj,sourceObj.x+67,sourceObj.y+60);
                      break;
                  }
                  else if(targetid == this.workflow.figures.data[conn].id ){
                      targetObj = this.workflow.figures.data[conn];
                  }
              }
          }


          //Making Connections
          var connObj = new DecoratedConnection();
          connObj.setSource(sourceObj.output1);
          connObj.setTarget(targetObj.input2);
          connObj.id = shapes.routes[i][0];
          this.workflow.addFigure(connObj);

      }
  }




  /*function getUrlVars()
  {
      var vars = [], hash;
      var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');

      for(var i = 0; i < hashes.length; i++)
      {
          hash = hashes[i].split('=');
          vars.push(hash[0]);
          vars[hash[0]] = hash[1];
      }
      var pro_uid = vars["PRO_UID"];
      return pro_uid;
  }*/

  function createShapes(stringData,_4562)
  {

      var responsearray = stringData.split("|");
      var jsonstring = new Array();
      var shapes = new Array();
      //var param = new Array();
      var shapeType = new Array();

      for(var i=0; i<=responsearray.length-1;i++)
      {
          jsonstring[i] = responsearray[i].split(":");
          var param = jsonstring[i][0].replace(" ","");
          shapeType[i] = param;
          switch(param)
          {
              case 'tasks':
                  shapes[param] = new Array();
                  shapes[param] = Ext.util.JSON.decode(jsonstring[i][1]);
                  break;
              case 'gateways':
                  shapes[param] = new Array();
                  shapes[param] = Ext.util.JSON.decode(jsonstring[i][1]);
                  break;
              case 'events':
                  shapes[param] = new Array();
                  shapes[param] = Ext.util.JSON.decode(jsonstring[i][1]);
                  break;
              case 'annotations':
                  shapes[param] = new Array();
                  shapes[param] = Ext.util.JSON.decode(jsonstring[i][1]);
                  break;
              case 'process':
                  shapes[param] = new Array();
                  shapes[param] = Ext.util.JSON.decode(jsonstring[i][1]);
                  break;
              case 'subprocess':
                  shapes[param] = new Array();
                  shapes[param] = Ext.util.JSON.decode(jsonstring[i][1]);
                  break;
              case 'routes':
                  shapes[param] = new Array();
                  shapes[param] = Ext.util.JSON.decode(jsonstring[i][1]);
                  break;
          }
      }
      workflow.taskNo = 0;
      //Create all shapes
      for(var j=0;j< shapeType.length;j++)
      {
          //  _4562.workflow.taskNo=0;
          
          switch(shapeType[j])
          {
              case 'tasks':
                  for(var k=0;k<shapes.tasks.length;k++){
                      var task_boundary = shapes.tasks[k][6];
                      if(task_boundary != null && task_boundary == 'TIMER' && task_boundary != '')
                          workflow.boundaryEvent = true;
                      else
                          workflow.boundaryEvent = false;

                      if(k != 0)
                          workflow.taskNo++;

                      workflow.taskName = shapes.tasks[k][1];
                      workflow.task_width = shapes.tasks[k][4];
                      workflow.task_height = shapes.tasks[k][5];
                      NewShape = eval("new bpmnTask(workflow)");
                      NewShape.x = shapes.tasks[k][2];
                      NewShape.y = shapes.tasks[k][3];
                      NewShape.taskName = shapes.tasks[k][1];
                      workflow.setBoundary(NewShape);
                      workflow.addFigure(NewShape, NewShape.x, NewShape.y);
                      NewShape.html.id = shapes.tasks[k][0];
                      NewShape.id = shapes.tasks[k][0];
                  }
                  break;
              case 'gateways':
                  for(var k=0;k<shapes.gateways.length;k++){
                      var srctype = shapes.gateways[k][1];
                      
                      NewShape = eval("new "+srctype+"(_4562.workflow)");
                      NewShape.x = shapes.gateways[k][2];
                      NewShape.y = shapes.gateways[k][3];
                     // workflow.setBoundary(NewShape);
                      workflow.addFigure(NewShape, NewShape.x, NewShape.y);
                      //Setting newshape id to the old shape id
                      NewShape.html.id = shapes.gateways[k][0];
                      NewShape.id = shapes.gateways[k][0];
                  }
                  break;
              case 'events':
                      for(var k=0;k<shapes.events.length;k++){
                          var srceventtype = shapes.events[k][1];
                          if(! srceventtype.match(/End/))
                          {
                              NewShape = eval("new "+srceventtype+"(_4562.workflow)");
                              NewShape.x = shapes.events[k][2];
                              NewShape.y = shapes.events[k][3];
                              workflow.setBoundary(NewShape);
                              workflow.addFigure(NewShape, NewShape.x, NewShape.y);
                              //Setting newshape id to the old shape id
                              NewShape.html.id = shapes.events[k][0];
                              NewShape.id = shapes.events[k][0];
                          }
                  }
                  break;
              case 'annotations':
                  for(var k=0;k<shapes.annotations.length;k++){
                      workflow.annotationName = shapes.annotations[k][1];
                      workflow.anno_width = shapes.annotations[k][4];
                      workflow.anno_height = shapes.annotations[k][5];
                      NewShape = eval("new bpmnAnnotation(_4562.workflow)");
                      NewShape.x = shapes.annotations[k][2];
                      NewShape.y = shapes.annotations[k][3];
                      workflow.setBoundary(NewShape);
                      workflow.addFigure(NewShape, NewShape.x, NewShape.y);
                      //Setting newshape id to the old shape id
                      NewShape.html.id = shapes.annotations[k][0];
                      NewShape.id = shapes.annotations[k][0];
                  }
                  break;
          case 'subprocess':
              for(var k=0;k<shapes.subprocess.length;k++){
                  workflow.subProcessName = shapes.subprocess[k][1];
                  NewShape = eval("new bpmnSubProcess(_4562.workflow)");
                  NewShape.x = shapes.subprocess[k][2];
                  NewShape.y = shapes.subprocess[k][3];
                  workflow.setBoundary(NewShape);
                  workflow.addFigure(NewShape, NewShape.x, NewShape.y);
                  //Setting newshape id to the old shape id
                  NewShape.html.id = shapes.subprocess[k][0];
                  NewShape.id = shapes.subprocess[k][0];
              }
              break;
          }
      }
      if(typeof(workflow.taskNo) != 'undefined' && workflow.taskNo != 0)
          workflow.taskNo++;
      return shapes;
  }


  function updateConnection(connArray,oldid,newid)
  {
      for(var i=0;i< connArray.length;i++)
      {
          if(connArray[i][1] == oldid)
              connArray[i][1] = newid;
          else if(connArray[i][2] == oldid)
              connArray[i][2] = newid;
      }
      return connArray;
  }

  function debug(msg)
  {
      var console = document.getElementById("debug");
      console.innerHTML=console.innerHTML+"<br>"+msg;
  }

  saveProcess = function()
  {
      // console.dir(this.workflow);

      var tasks = new Array();
      var events = new Array();
      var gateways = new Array();
      var annotations = new Array();
      var subprocess = new Array();
      var l=0;
      var m=0;
      var n=0;
      var p=0;
      var r=0;

      for(var c = 0; c<this.workflow.figures.data.length; c++)
      {
          if(this.workflow.figures.data[c]){
              if(typeof this.workflow.figures.data[c] === "object")
              {
                  if(this.workflow.figures.data[c].type.match(/Task/))
                  {
                      tasks[l] = new Array();

                      tasks[l][0] = this.workflow.figures.data[c].id;
                      tasks[l][1] = this.workflow.figures.data[c].taskName;
                      tasks[l][2] = this.workflow.figures.data[c].x;
                      tasks[l][3] = this.workflow.figures.data[c].y;
                      tasks[l][4] = this.workflow.figures.data[c].width;
                      tasks[l][5] = this.workflow.figures.data[c].height;
                      tasks[l][6] = 'NORMAL';

                      l++;
                  }

                  if(this.workflow.figures.data[c].type.match(/Gateway/))
                  {
                      gateways[m] = new Array();

                      gateways[m][0] = this.workflow.figures.data[c].id;
                      gateways[m][1] = this.workflow.figures.data[c].type;
                      gateways[m][2] = this.workflow.figures.data[c].x;
                      gateways[m][3] = this.workflow.figures.data[c].y;
                      gateways[m][4] = this.workflow.figures.data[c].width;
                      gateways[m][5] = this.workflow.figures.data[c].height;

                      m++;
                  }

                  if(this.workflow.figures.data[c].type.match(/Event/))
                  {
                      events[n] = new Array();

                      events[n][0] = this.workflow.figures.data[c].id;
                      events[n][1] = this.workflow.figures.data[c].type;
                      events[n][2] = this.workflow.figures.data[c].x;
                      events[n][3] = this.workflow.figures.data[c].y;
                      events[n][4] = this.workflow.figures.data[c].width;
                      events[n][5] = this.workflow.figures.data[c].height;

                      n++;
                  }

                  if(this.workflow.figures.data[c].type.match(/Annotation/))
                  {
                      annotations[p] = new Array();

                      annotations[p][0] = this.workflow.figures.data[c].id;
                      annotations[p][1] = this.workflow.figures.data[c].type;
                      annotations[p][2] = this.workflow.figures.data[c].x;
                      annotations[p][3] = this.workflow.figures.data[c].y;
                      annotations[p][4] = this.workflow.figures.data[c].width;
                      annotations[p][5] = this.workflow.figures.data[c].height;
                      annotations[p][6] = this.workflow.figures.data[c].annotationName;
                      p++;
                  }

                  if(this.workflow.figures.data[c].type.match(/SubProcess/))
                  {
                      subprocess[r] = new Array();

                      subprocess[r][0] = this.workflow.figures.data[c].id;
                      subprocess[r][1] = this.workflow.figures.data[c].subProcessName;
                      subprocess[r][2] = this.workflow.figures.data[c].x;
                      subprocess[r][3] = this.workflow.figures.data[c].y;
                      subprocess[r][4] = this.workflow.figures.data[c].width;
                      subprocess[r][5] = this.workflow.figures.data[c].height;
                      subprocess[r][6] = 'SUBPROCESS';
                      r++;
                  }
              }
          }
      }

      var routes = new Array();
      routes = this.workflow.getCommonConnections(this);

      //array task ['idTask','name','pos_X','pos_y']
      var oldtasks    = [['4043621294c5bda0d9625f4067933182','Task 1','431','131'],['4131425644c5bda073ed062050942935','Task 2','360','274'],['6367816924c6cbc57f36c36034634744','Task 3','540','274']];
      //array gateways ['idGateway','type_gateway','pos_X','pos_y']
      var oldgateways = [['6934720824c5be48364b533001453464','GatewayExclusiveData','461','228']];
      //array gateways ['idEvent','type_event','pos_X','pos_y']
      var oldevents    = [['2081943344c5bdbb38a7ae9016052622','EventEmptyStart','480','95'],['5585460614c5bdbb8629170012669821','EventEmptyEnd','411','347'],['8565089054c5be1e6efeca5077280809','EventEmptyEnd','590','347']];
      //array routes ['id','from','to']
      var oldroutes    = [['2081943344c5bdbb38a7ae9016052982','2081943344c5bdbb38a7ae9016052622','4043621294c5bda0d9625f4067933182'],['4031913164c5bdbb5329a05024607071','4043621294c5bda0d9625f4067933182','6934720824c5be48364b533001453464'],['8851314534c5a6777ee2c96009360450','6934720824c5be48364b533001453464','4131425644c5bda073ed062050942935'],['6934720824c5be48364b533001453464','6934720824c5be48364b533001453464','6367816924c6cbc57f36c36034634744'],['7298598774c5bd9fa3ed1c8035004509','4131425644c5bda073ed062050942935','5585460614c5bdbb8629170012669821'],['8565089054c5be1e6efeca5077280809','6367816924c6cbc57f36c36034634744','8565089054c5be1e6efeca5077280809']];

      var allRoutes = routes
      var aTasks        =  	Ext.util.JSON.encode(tasks);
      var aGateways     = 	Ext.util.JSON.encode(gateways);
      var aEvents       = 	Ext.util.JSON.encode(events);
      var aAnnotations  = 	Ext.util.JSON.encode(annotations);
      var aRoutes       = 	Ext.util.JSON.encode(routes);
      var aSubProcess   = Ext.util.JSON.encode(subprocess);

      //var pro_uid = getUrlVars();
      var loadMask = new Ext.LoadMask(document.body, {msg:'Saving..'});
      loadMask.show();
    
      if(typeof pro_uid != 'undefined')
      {
          Ext.Ajax.request({
              url: 'saveProcess.php',
              method: 'POST',
              success: function(response) {
                var result = Ext.util.JSON.decode(response.responseText);
                loadMask.hide();
                
                if( result.success ) {
                  PMExt.notify(_('ID_PROCESS_SAVE'), result.msg);
                } else {
                  PMExt.error(_('ID_ERROR'), result.msg);
                }
              },
              failure: function(){},
              params: {
                  PRO_UID:pro_uid,
                  tasks: aTasks,
                  gateways:aGateways,
                  events:aEvents,
                  annotations:aAnnotations,
                  subprocess:aSubProcess,
                  routes:aRoutes
              }
          });
      }
      else
          Ext.Msg.alert ('Process ID Undefined');
  }


});

Ext.ux.WindowAlwaysOnTop = function(){
       this.init = function(win){
            win.on('deactivate', function(){
               var i=1;
               this.manager.each(function(){i++});
               this.setZIndex(this.manager.zseed + (i*10));
            })
       }
}