Feature: Sign In
    User can login and logout, wrong password is rejected
    right password is accepted. Both the tiny sign in form
    and the big version work.
    Missing expiry

    Background:
        Given the user is not signed in

    Scenario: Sign in successfully
        Given a "admin" user "root"/"root" is in the db
        When user signs in as "root"/"root"
        Then signed in at the menu bar shows user "root"
        And toast says "successfully"

    Scenario: Sign in fails when user does not exist
        Given a "admin" user "root"/"root" is in the db
        When user signs in as "nosuchuser"/"root"
        Then sign in form shows full screen
        And toast says "invalid"

    Scenario: Sign in fails when password is incorrect
        Given a "admin" user "root"/"root" is in the db
        When user signs in as "root"/"wrongpassword"
        Then sign in form shows full screen
        And toast says "invalid"
        When user signs in as "root"/"root"
        Then signed in at the menu bar shows user "root"
        And toast says "successfully"
