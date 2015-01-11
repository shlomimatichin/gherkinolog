function parseGherkin(filePath, contents) {
    var result = {description: "", scenarios: []};

    var lines = contents.split("\n");
    var descriptionDone = false;
    var latestBlock = null;

    for (var lineIndex in lines) {
        var line = stringStripWhitespace(lines[lineIndex]);
        if (line.indexOf('#') != -1)
            line = stringStripWhitespace(line.substr(0, line.indexOf('#')));
        if (line == "")
            continue;
        if (lineIndex == 0) {
            if (stringStartsWith(line, "Feature:")) {
                result.title = stringStripWhitespace(line.substr("Feature:".length));
            } else {
                result.error = "Error: line 1 of '" + filePath + "' does not start with 'Feature:'";
                return result;
            }
        } else if (stringStartsWith(line, "Background:")) {
            latestBlock = {lines:[], title:"Background"};
            result.background = latestBlock;
            descriptionDone = true;
        } else if (stringStartsWith(line, "Scenario:")) {
            latestBlock = {lines:[], title:stringStripWhitespace(line.substr("Scenario:".length))};
            result.scenarios.push(latestBlock);
            descriptionDone = true;
        } else if (stringStartsWith(line, "Examples:")) {
            latestBlock.examples = {columns: undefined, data: []};
        } else {
            if (descriptionDone) {
                if (stringStartsWith(line, "|")) {
                    var parts = line.split("|");
                    if (parts.length < 3) {
                        result.error = "Examples line " + lineIndex + " does not contain at least two '|' characters";
                        return result;
                    }
                    parts.pop();
                    parts.shift();
                    for (var x in parts)
                        parts[x] = stringStripWhitespace(parts[x]);
                    if (latestBlock.examples.columns === undefined) {
                        latestBlock.examples.columns = parts;
                    } else {
                        if (parts.length != latestBlock.examples.columns.length) {
                            result.error = "Examples line " + lineIndex + " does not contain the same amount of '|' characters as its previous line";
                            return result;
                        }
                        latestBlock.examples.data.push(parts);
                    }

                    latestBlock.examples
                } else {
                    var firstToken = line.split(" ")[0];
                    var goodTokens = ["Given", "When", "Then", "And", "But"];
                    if (goodTokens.indexOf[firstToken] == -1) {
                        result.error = "Error: line " + lineIndex + " starts with token '" + firstToken + "' which" +
                                    " is not a valid token:" + goodTokens;
                        return result;
                    }
                    var logical = firstToken;
                    if (logical == "And" || logical == "But")
                        logical = latestBlock.lines[latestBlock.lines.length - 1].logical;
                    var parsedLine = {
                        raw: line,
                        firstToken: firstToken,
                        logical: logical,
                        text: line.substr(firstToken.length + 1)};
                    latestBlock.lines.push(parsedLine);
                }
            } else {
                result.description = stringStripWhitespace(result.description + " " + line);
            }
        }
    }

    return result;
}
