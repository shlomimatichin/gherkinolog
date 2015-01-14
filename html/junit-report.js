function TestCase(name, classname, status, time, output, absPath) {
    var self = this;
    self.name = name;
    self.classname = classname;
    self.status = status;
    self.time = time;
    self.output = output;
    self.featureTitle = classname.split(".")[1];
    self.featureFilename = classname.split(".")[0];
}

var junitReportTestCases = [];
var junitReportDirectoriesScanned = {};
var junitReportNewCasesCallbacks = [];

function junitReportRegisterNewCasesCallback(callback) {
    junitReportNewCasesCallbacks.push(callback);
}

function junitReportReadDirectory(directory) {
    if (junitReportDirectoriesScanned[absoluteURI(directory)])
        return;
    junitReportDirectoriesScanned[absoluteURI(directory)] = true;
    var remaining = 0;
    getDirectoryListing({
        url: directory,
        callbackPerFile: function(filename) {
            if (!stringEndsWith(filename, ".xml"))
                return;
            var absPath = directory + '/' + filename;
            remaining += 1;
            $.ajax({url: absPath}).done(function(xml) {
                var testCases = xml.firstChild.childNodes;
                for (var i = 0; i < testCases.length; i++) {
                    var testCase = new TestCase(
                        testCases[i].attributes.name.value,
                        testCases[i].attributes.classname.value,
                        testCases[i].attributes.status.value,
                        testCases[i].attributes.time.value,
                        testCases[i].firstChild.firstChild.wholeText,
                        absPath);
                    junitReportTestCases.push(testCase);
                    _.sortBy(junitReportTestCases, function(testCase) { return testCase.classname; });
                }
                remaining -= 1;
                if (remaining == 0)
                    for (var i in junitReportNewCasesCallbacks)
                        junitReportNewCasesCallbacks[i]();
            });
        }});
}
