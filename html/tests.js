QUnit.test( "Complex Gherkin", function( assert ) {
    var contents = [
        'Feature: 1.1.1. Create and Destroy Entities',
        '    A user can create and destroy entities, monitor free and available space.',
        '    Errors like out of resources are reported correctly. Each entity can be     # ignore comment',
        '    inspected.',
        '',
        '    Background:',
        '        Given a user who really does understand software',
        '        And a fresh clean universe to work in',
        '',
        '    Scenario: Create and Destroy One Entity',
        '        Given the user "admin" "user1/password" of tennant "tennant1" is signed in using <UI> ',
        '        When the user queries all the entities',
        '        Then the last entity list shows "0" entities',
        '        When the user creates an entity with name "it"',
        '        And the user queries all the entities',
        '        Then the last entity list shows "1" entities',
        '        And entity "it" in the last entity list is named "it"',
        '        When the user destroys entity "it"',
        '        And the user queries all the entities',
        '        Then the last entity list shows "0" entities',
        '',
        '    Examples:',
        '        | UI  |',
        '        | gui |',
        '        | cli |',
        '',
        '    Scenario: Create Many Entities',
        '        Given the user "admin" "user1/password" of tennant "tennant1" is signed in using cli',
    ].join("\n");
    var parsed = parseGherkin("fake file path", contents);
    assert.equal(parsed.error, undefined);
    assert.equal(parsed.title, "1.1.1. Create and Destroy Entities");
    assert.equal(parsed.description, [
        'A user can create and destroy entities, monitor free and available space.',
        'Errors like out of resources are reported correctly. Each entity can be',
        'inspected.'].join(' '));
    var background = parsed.background;
    assert.equal(background.title, "Background");
    assert.equal(background.lines.length, 2);
    assert.equal(background.lines[0].firstToken, 'Given');
    assert.equal(background.lines[0].logical, 'Given');
    assert.equal(background.lines[0].raw, 'Given a user who really does understand software');
    assert.equal(background.lines[0].text, 'a user who really does understand software');
    assert.equal(background.lines[1].firstToken, 'And');
    assert.equal(background.lines[1].logical, 'Given');
    assert.equal(background.lines[1].raw, 'And a fresh clean universe to work in');
    assert.equal(background.lines[1].text, 'a fresh clean universe to work in');
    assert.equal(parsed.scenarios.length, 2);
    var scenario = parsed.scenarios[0];
    assert.equal(scenario.title, 'Create and Destroy One Entity');
    assert.equal(scenario.lines.length, 10);
    assert.equal(scenario.lines[4].firstToken, 'And');
    assert.equal(scenario.lines[4].logical, 'When');
    assert.equal(scenario.lines[6].firstToken, 'And');
    assert.equal(scenario.lines[6].logical, 'Then');
    assert.deepEqual(scenario.examples.columns, ["UI"]);
    assert.deepEqual(scenario.examples.data, [["gui"],["cli"]]);
});
