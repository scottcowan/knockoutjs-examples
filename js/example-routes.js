var viewModel = {
    currentView: ko.observable({
        template: 'dsds'
    })
};

$(function () {
		$.routes({
		"/": function () {
			viewModel.currentView(new Model());
		},
		"/flot/basic": function () {
			viewModel.currentView(new FlotModel());
		},
		"/flot/series": function () {
			viewModel.currentView(new FlotSeriesModel());
		},
		"/flot/hover": function () {
			viewModel.currentView(new FlotHoverModel());
		},		
		"/slickgrid/basic": function () {
			viewModel.currentView(new SlickGridModel());
		},
		"/slickgrid/editor": function () {
			viewModel.currentView(new SlickGridEditorModel());
		},
		"/datepicker/textbox":function(){
			viewModel.currentView(new DatePickerModel());
		},
		"/datepicker/calendar":function(){
			viewModel.currentView(new DatePickerCalModel());
		}
	});
                
    var templateEngine = new ko.jqueryTmplTemplateEngine();

    templateEngine.makeTemplateSource = function (template) {
        // Named template
        if (typeof template == "string") {
            var node = document.getElementById(template);
            if (node == null) {
                var templateHtml = null;
                $.ajax({
                    async: false,
                    url: 'templates/' + template + '.html',
                    dataType: "html",
                    type: "GET",
                    timeout: 0,
                    success: function (response) {
                        templateHtml = response;
                    },
                    error: function (exception) {
                        if (this['useDefaultErrorTemplate'])
                            templateHtml = this['defaultErrorTemplateHtml'].replace('{STATUSCODE}', exception.status).replace('{TEMPLATEID}', templateId).replace('{TEMPLATEURL}', templatePath);
                    } .bind(this)
                });

                if (templateHtml === null)
                    throw new Error("Cannot find template with ID=" + template);

                var node = document.createElement("script");
                node.type = "text/html";
                node.id = template;
                node.text = templateHtml;
                document.body.appendChild(node);
            }
            return new ko.templateSources.domElement(node);
        } else if ((template.nodeType == 1) || (template.nodeType == 8)) {
            // Anonymous template
            return new ko.templateSources.anonymousTemplate(template);
        } else
            throw new Error("Unrecognised template type: " + template);
    }
    ko.setTemplateEngine(templateEngine);

    if (viewModel.currentView.template != "dsds") {
        ko.applyBindings(viewModel.currentView);
    }
});

function Model(){
	this.template = "Index"
};

function FlotModel(){
	this.template = "Flot/Basic"
	this.data = ko.observableArray([]);
    for (var i = 0; i < 14; i += 0.5)
        this.data.push([i, Math.sin(i)]);
        
   ko.bindingHandlers.flot = {
		init: function(element, valueAccessor, allBindingsAccessor, viewModel) {
		    // This will be called when the binding is first applied to an element
		    // Set up any initial state, event handlers, etc. here
		},
		update: function(element, valueAccessor, allBindingsAccessor, viewModel) {
		    // This will be called once when the binding is first applied to an element,
		    // and again whenever the associated observable changes value.
		    // Update the DOM element based on the supplied values here.
		    //var options = allBindingsAccessor().datepickerOptions || {};
		    var value = valueAccessor();
		    var valueUnwrapped = ko.utils.unwrapObservable(value);
			$.plot($(element),
			[
		        {
		            data: valueUnwrapped,
		            lines: { show: true, fill: true }
		        }
		    ]);
		}
	};
};

function FlotSeriesModel(){
	this.template = "Flot/Series"
	this.data = ko.observableArray();
	
	var days = [1,	2,	3,	4,	7,	14,	21,	30,	60,	90,	120,	150,	180,	210,	240,	270,	300,	330,	360];
	var bands = ["0 - 50k","50k - 250k","250k - 1m","1m - 10m","10m - 50m","50m - 100m","over 100m"];
	
	function daysToText(days){
		console.log(days);
		if(days==1)
			return "1d";
		if(days==2)
			return "2d";
		if(days==3)
			return "3d";
		if(days==4)
			return "4d";
		if(days==7)
			return "1w";
		if(days==14)
			return "2w";
		if(days==21)
			return "3w";
		if(days==30)
			return "1m";
		if(days==60)
			return "2m";
		if(days==90)
			return "3m";
		if(days==120)
			return "4m";
		if(days==150)
			return "5m";
		if(days==180)
			return "6m";
		if(days==210)
			return "7m";
		if(days==240)
			return "8m";
		if(days==270)
			return "9m";
		if(days==300)
			return "10m";
		if(days==330)
			return "11m";
		if(days==360)
			return "1y";
	}
	
	for(var i=6;i>=0;i--){
		var row = [];
		for(var j = 0; j<19;j++){
			var value = Math.round(150 + 1.2*i*Math.log(j*100));
			if(j<6) value+=i;//i*10*Math.sin(j*2);
			row[j] = [days[j],value];
		}
		this.data().push(row);
	}
        
   ko.bindingHandlers.flot = {
		init: function(element, valueAccessor, allBindingsAccessor, viewModel) {
		    // This will be called when the binding is first applied to an element
		    // Set up any initial state, event handlers, etc. here
		},
		update: function(element, valueAccessor, allBindingsAccessor, viewModel) {
		    // This will be called once when the binding is first applied to an element,
		    // and again whenever the associated observable changes value.
		    // Update the DOM element based on the supplied values here.
		    //var options = allBindingsAccessor().datepickerOptions || {};
		    var value = valueAccessor();
		    var valueUnwrapped = ko.utils.unwrapObservable(value);
		    var gridData = [];
		    for(var i=0;i<7;i++){
		    	gridData[i] = {
					data: valueUnwrapped[i],
					label: bands[i]
				};
		    }
			$.plot($(element),gridData,{
           			series: {
               			lines: { show: true },
               			points: { show: true }
           			},
           			grid: { hoverable: true}
           		}
			);
			
		    function showTooltip(x, y, contents) {
		        $('<div id="tooltip">' + contents + '</div>').css( {
		            position: 'absolute',
		            display: 'none',
		            top: y + 5,
		            left: x + 5,
		            border: '1px solid #fdd',
		            padding: '2px',
		            'background-color': '#fee',
		            opacity: 0.80
		        }).appendTo("body").fadeIn(200);
		    }
		
		    var previousPoint = null;
		    $(element).bind("plothover", function (event, pos, item) {
		        $("#x").text(pos.x.toFixed(2));
		        $("#y").text(pos.y.toFixed(2));
		
	            if (item) {
	                if (previousPoint != item.dataIndex) {
	                    previousPoint = item.dataIndex;
	                    
	                    $("#tooltip").remove();
	                    var x = item.datapoint[0].toFixed(2),
	                        y = item.datapoint[1].toFixed(2);
	                    
	                    showTooltip(item.pageX, item.pageY,
	                    	item.series.label + " for " + daysToText(Math.floor(x)) + " = " + Math.floor(y) + " BPS");
	                }
	            }
	            else {
	                $("#tooltip").remove();
	                previousPoint = null;            
	            }
		    });
		}
	};
};

function FlotHoverModel(){
	this.template = "Flot/Hover"
	this.data = ko.observableArray();
		
   ko.bindingHandlers.flot = {
		init: function(element, valueAccessor, allBindingsAccessor, viewModel) {
		    // This will be called when the binding is first applied to an element
		    // Set up any initial state, event handlers, etc. here
		},
		update: function(element, valueAccessor, allBindingsAccessor, viewModel) {
		    // This will be called once when the binding is first applied to an element,
		    // and again whenever the associated observable changes value.
		    // Update the DOM element based on the supplied values here.
		    //var options = allBindingsAccessor().datepickerOptions || {};
		    var value = valueAccessor();
		    var valueUnwrapped = ko.utils.unwrapObservable(value);
		    var sin = [], cos = [];
		    for (var i = 0; i < 14; i += 0.5) {
		        sin.push([i, Math.sin(i)]);
		        cos.push([i, Math.cos(i)]);
		    }
    
			$.plot($(element),
				[{ data: sin, label: "sin(x)"}, { data: cos, label: "cos(x)" } ], 
				{
           			series: {
               			lines: { show: true },
               			points: { show: true }
           			},
           			grid: { hoverable: true, clickable: true },
           			yaxis: { min: -1.2, max: 1.2 }
         		}
         	);

		    function showTooltip(x, y, contents) {
		        $('<div id="tooltip">' + contents + '</div>').css( {
		            position: 'absolute',
		            display: 'none',
		            top: y + 5,
		            left: x + 5,
		            border: '1px solid #fdd',
		            padding: '2px',
		            'background-color': '#fee',
		            opacity: 0.80
		        }).appendTo("body").fadeIn(200);
		    }
		
		    var previousPoint = null;
		    $("#placeholder").bind("plothover", function (event, pos, item) {
		        $("#x").text(pos.x.toFixed(2));
		        $("#y").text(pos.y.toFixed(2));
		
		        if ($("#enableTooltip:checked").length > 0) {
		            if (item) {
		                if (previousPoint != item.dataIndex) {
		                    previousPoint = item.dataIndex;
		                    
		                    $("#tooltip").remove();
		                    var x = item.datapoint[0].toFixed(2),
		                        y = item.datapoint[1].toFixed(2);
		                    
		                    showTooltip(item.pageX, item.pageY,
		                                item.series.label + " of " + x + " = " + y);
		                }
		            }
		            else {
		                $("#tooltip").remove();
		                previousPoint = null;            
		            }
		        }
		    });
		
		    $("#placeholder").bind("plotclick", function (event, pos, item) {
		        if (item) {
		            $("#clickdata").text("You clicked point " + item.dataIndex + " in " + item.series.label + ".");
		            plot.highlight(item.series, item.datapoint);
		        }
		    });       	
		}
	};	
}

function SlickGridModel(){
	this.template = "SlickGrid/Basic"
	
  var grid;
  var i = 0;

    this.GridData = ko.observableArray([]);
	this.GridColumns = ko.observableArray([
		    {id: "title", name: "Title", field: "title"},
		    {id: "duration", name: "Duration", field: "duration"},
		    {id: "%", name: "% Complete", field: "percentComplete"},
		    {id: "start", name: "Start", field: "start"},
		    {id: "finish", name: "Finish", field: "finish"},
		    {id: "effort-driven", name: "Effort Driven", field: "effortDriven"}
		  ]);

    
    this.AddRow = function(){
    	this.GridData.push({
        title: "Task " + i++,
        duration: "5 days",
        percentComplete: Math.round(Math.random() * 100),
        start: "01/01/2009",
        finish: "01/05/2009",
        effortDriven: (i % 5 == 0)
      });
    };
	
	this.AddRow();
	
ko.bindingHandlers.slickGrid = {
		init: function(element, valueAccessor, allBindingsAccessor, viewModel) {
		    // This will be called when the binding is first applied to an element
		    // Set up any initial state, event handlers, etc. here
		
		  var options = {
		    enableCellNavigation: true,
		    enableColumnReorder: false
		  };
		  
		  	var settings = valueAccessor();
	        var data = ko.utils.unwrapObservable(settings.data);
	        var columns = ko.utils.unwrapObservable(settings.columns);
		
		    grid = new Slick.Grid(element, data, columns, options);
		},
		update: function(element, valueAccessor, allBindingsAccessor, viewModel) {
			var settings = valueAccessor();
	        var data = ko.utils.unwrapObservable(settings.data);
			grid.setData(data,true);
			grid.render();
		}
	};
}

function SlickGridEditorModel(){
	this.template = "SlickGrid/Editor"
	
  var grid;
  var i = 0;

    this.GridData = ko.observableArray([]);
	this.GridColumns = ko.observableArray([
		    {id: "title", name: "Title", field: "title"},
		    {id: "duration", name: "Duration", field: "duration", editor:Slick.Editors.Text},
		    {id: "%", name: "% Complete", field: "percentComplete", editor:Slick.Editors.Text},
		    {id: "start", name: "Start", field: "start", editor:Slick.Editors.Text},
		    {id: "finish", name: "Finish", field: "finish", editor:Slick.Editors.Text},
		    {id: "effort-driven", name: "Effort Driven", field: "effortDriven", editor:Slick.Editors.Text}
		  ]);

    
    this.AddRow = function(){
    	this.GridData.push({
        title: "Task " + i++,
        duration: "5 days",
        percentComplete: Math.round(Math.random() * 100),
        start: "01/01/2009",
        finish: "01/05/2009",
        effortDriven: (i % 5 == 0)
      });
    };
    
    this.Save = function(){
		grid.getEditController().commitCurrentEdit()
    	console.log(grid.getData());
    }
	
	this.AddRow();
	
ko.bindingHandlers.slickGrid = {
		init: function(element, valueAccessor, allBindingsAccessor, viewModel) {
		    // This will be called when the binding is first applied to an element
		    // Set up any initial state, event handlers, etc. here
		
		  var options = {
		    enableCellNavigation: true,
		    enableColumnReorder: false,
		    editable: true, 
		    enableAddRow: false, 
		    asyncEditorLoading: false, 
		    autoEdit: true
		  };
		  
		  	var settings = valueAccessor();
	        var data = ko.utils.unwrapObservable(settings.data);
	        var columns = ko.utils.unwrapObservable(settings.columns);
		
		    grid = new Slick.Grid(element, data, columns, options);
  			grid.onCellChange.subscribe(function (e, args) {
  				data[args.row] = args.item;
  			});
		},
		update: function(element, valueAccessor, allBindingsAccessor, viewModel) {
			var settings = valueAccessor();
	        var data = ko.utils.unwrapObservable(settings.data);
			grid.render();
		}
	};
}

function DatePickerModel(){
	this.template = "DatePicker";
	
	self.Tomorrow = nextDay(new Date());

	self.StartDate = ko.observable(self.Tomorrow);
	
	ko.bindingHandlers.datepicker = {
		init: function(element, valueAccessor, allBindingsAccessor) {
			//initialize datepicker with some optional options
			var options = allBindingsAccessor().datepickerOptions || {};
			$(element).datepicker(options);

			//handle the field changing
			ko.utils.registerEventHandler(element, "change", function() {
				var observable = valueAccessor();
				observable($(element).datepicker("getDate"));
			});

			//handle disposal (if KO removes by the template binding)
			ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
				$(element).datepicker("destroy");
			});

		},
		update: function(element, valueAccessor) {
			var value = ko.utils.unwrapObservable(valueAccessor());
			//debugger;
			if (isNaN(Date.parse(value))==false){
				$(element).datepicker("setDate", value);
			}
		}
	};
}

function DatePickerCalModel(){
	this.template = "DatePickerCal";
	
	self.Tomorrow = nextDay(new Date());

	self.StartDate = ko.observable(self.Tomorrow);
	
	ko.bindingHandlers.datepicker = {
		init: function(element, valueAccessor, allBindingsAccessor) {
			//initialize datepicker with some optional options
			var options = allBindingsAccessor().datepickerOptions || {};
			$(element).datepicker(options);

			//handle the field changing
			ko.utils.registerEventHandler(element, "change", function() {
				var observable = valueAccessor();
				observable($(element).datepicker("getDate"));
			});

			//handle disposal (if KO removes by the template binding)
			ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
				$(element).datepicker("destroy");
			});

		},
		update: function(element, valueAccessor) {
			var value = ko.utils.unwrapObservable(valueAccessor());
			//debugger;
			if (isNaN(Date.parse(value))==false){
				$(element).datepicker("setDate", value);
			}
		}
	};
}

function nextDay(date){
	var tomorrow = new Date();
	tomorrow.setDate(date.getDate()+1);
	return tomorrow;
}

function NextYear(){
	var date1 = new Date();
	date1.setFullYear(date1.getFullYear()+1);
	return date1;
}

function noWeekendsOrHolidays(date) {
  var noWeekend = jQuery.datepicker.noWeekends(date);
    if (noWeekend[0]) {
        return noWeekend;
    } else {
        return noWeekend;
    }
}