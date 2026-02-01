@statements
Feature: Utility Cost Statements
  As a property manager
  I want to generate and manage utility cost statements
  So that I can bill tenants correctly according to Swiss law

  Background:
    Given I am logged in as "Test User"

  @list
  Scenario: View statements list page
    When I open the statements page
    Then I should see the statements page
    And I should see the status overview cards
    And I should see a "Abrechnungen erstellen" link

  @list
  Scenario: Statements page shows status filters
    When I open the statements page
    Then I should see draft filter button
    And I should see sent filter button
    And I should see paid filter button
    And I should see overdue filter button

  @generate
  Scenario: Navigate to statement generation wizard
    When I open the statements page
    And I click the "Abrechnungen erstellen" link
    Then I should be on the statement generation wizard

  @generate @heating-profile
  Scenario: Statement wizard shows heating profile chart bars
    When I open the statement generation wizard
    Then I should see the heating profile dropdown
    And I should see the heating profile chart
    And I should see chart bars for each month
    And all chart bars should have visible height

  @generate @heating-profile @validation
  Scenario: Only valid heating profiles are selectable
    When I open the statement generation wizard
    Then I should see all heating profiles in the dropdown
    And valid profiles should show percentage 100%
    And invalid profiles should show their percentage and be disabled
    And invalid profiles should show "nicht wählbar" text

  @generate @heating-profile @validation
  Scenario: First valid heating profile is auto-selected
    When I open the statement generation wizard
    Then the first valid heating profile should be selected
    And the heating profile chart should display the selected profile

  @detail @wip
  Scenario: View statement details
    Given there is a statement "NK-2024-001"
    When I open the statement detail page
    Then I should see the statement number "NK-2024-001"
    And I should see the tenant name
    And I should see the cost breakdown
    And I should see the balance

  @list @data @wip
  Scenario: Statements list shows statement data from backend
    When I open the statements page
    Then I should see statements in the list
    And I should see statement tenant names
    And I should see statement building names
    And I should see statement numbers
    # Note: Keep @wip until test data includes statements
