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
		"/flot": function () {
			viewModel.currentView(new FlotModel());
		},
		"/slickgrid": function () {
			viewModel.currentView(new SlickGridModel());
		},
		"/datepicker":function(){
			viewModel.currentView(new DatePickerModel());
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
	this.template = "Flot"
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

function SlickGridModel(){
	this.template = "SlickGrid"
	
  var grid;
ko.bindingHandlers.slickGrid = {
		init: function(element, valueAccessor, allBindingsAccessor, viewModel) {
		    // This will be called when the binding is first applied to an element
		    // Set up any initial state, event handlers, etc. here
  var columns = [
    {id: "title", name: "Title", field: "title"},
    {id: "duration", name: "Duration", field: "duration"},
    {id: "%", name: "% Complete", field: "percentComplete"},
    {id: "start", name: "Start", field: "start"},
    {id: "finish", name: "Finish", field: "finish"},
    {id: "effort-driven", name: "Effort Driven", field: "effortDriven"}
  ];

  var options = {
    enableCellNavigation: true,
    enableColumnReorder: false
  };

    var data = [];
    for (var i = 0; i < 500; i++) {
      data[i] = {
        title: "Task " + i,
        duration: "5 days",
        percentComplete: Math.round(Math.random() * 100),
        start: "01/01/2009",
        finish: "01/05/2009",
        effortDriven: (i % 5 == 0)
      };
    }

    grid = new Slick.Grid("#myGrid", data, columns, options);
		},
		update: function(element, valueAccessor, allBindingsAccessor, viewModel) {  
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