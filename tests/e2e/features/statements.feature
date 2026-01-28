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

  @generate @wip
  Scenario: Navigate to statement generation wizard
    When I open the statements page
    And I click the "Abrechnungen erstellen" link
    Then I should be on the statement generation wizard

  @detail @wip
  Scenario: View statement details
    Given there is a statement "NK-2024-001"
    When I open the statement detail page
    Then I should see the statement number "NK-2024-001"
    And I should see the tenant name
    And I should see the cost breakdown
    And I should see the balance
