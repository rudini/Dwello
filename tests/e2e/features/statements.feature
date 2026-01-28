@statements
Feature: Utility Cost Statements
  As a property manager
  I want to generate and manage utility cost statements
  So that I can bill tenants correctly according to Swiss law

  Background:
    Given I am logged in as "Test User"
    And the backend API is mocked

  @list
  Scenario: View statements list
    Given there are statements in the system
    When I open the statements page
    Then I should see a list of statements
    And I should see status overview cards

  @list
  Scenario: Filter statements by status
    Given there are statements with different statuses
    When I open the statements page
    And I filter by status "overdue"
    Then I should only see overdue statements

  @generate
  Scenario: Start statement generation wizard
    When I open the statements page
    And I click on "Abrechnungen erstellen"
    Then I should be on the statement generation wizard
    And I should see step 1 of 4

  @generate
  Scenario: Complete statement generation wizard step 1
    When I open the statement generation wizard
    And I select a period from "2024-01-01" to "2024-12-31"
    And I select a heating profile
    And I click "Weiter"
    Then I should be on step 2 of the wizard

  @generate
  Scenario: Complete statement generation wizard step 2
    When I am on step 2 of the statement wizard
    And I select buildings to include
    And I click "Weiter"
    Then I should be on step 3 of the wizard
    And I should see a preview of the statements

  @detail
  Scenario: View statement details
    Given there is a statement "NK-2024-001"
    When I open the statement detail page
    Then I should see the statement number "NK-2024-001"
    And I should see the tenant name
    And I should see the cost breakdown
    And I should see the balance

  @payment
  Scenario: Mark statement as paid
    Given there is a sent statement
    When I open the statement detail page
    And I click on "Als bezahlt markieren"
    And I confirm the payment
    Then the statement status should be "paid"

  @reminder
  Scenario: Send payment reminder
    Given there is an overdue statement
    When I open the statement detail page
    And I click on "Mahnung senden"
    And I select reminder level 1
    And I confirm sending
    Then a reminder should be sent
