@contracts
Feature: Contract Management
  As a property manager
  I want to manage rental contracts
  So that I can track tenant agreements

  Background:
    Given I am logged in as "Test User"

  @list
  Scenario: View contracts list page
    When I open the contracts page
    Then I should see the contracts page
    And I should see a "Neuer Vertrag" link

  @list
  Scenario: Contracts page shows search and filters
    When I open the contracts page
    Then I should see the contracts search input
    And I should see the building filter
    And I should see the status filter

  @create @wip
  Scenario: Navigate to create contract form
    When I open the contracts page
    And I click the "Neuer Vertrag" link
    Then I should be on the new contract page

  @list @data
  Scenario: Contracts list shows contract data from backend
    When I open the contracts page
    Then I should see contracts in the list
    And I should see contract tenant names
    And I should see contract building names
    And I should see contract apartment numbers

  @list @data
  Scenario: Contracts list shows correct status
    When I open the contracts page
    Then I should see at least one "AKTIV" contract status badge
