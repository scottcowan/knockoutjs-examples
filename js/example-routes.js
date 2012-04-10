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
};

function SlickGridModel(){
	this.template = "SlickGrid"
};
