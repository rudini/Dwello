@buildings
Feature: Building Management
  As a property manager
  I want to manage my buildings
  So that I can track all my properties

  Background:
    Given I am logged in as "Test User"
    And the backend API is mocked

  @list
  Scenario: View buildings list
    Given there are buildings in the system
    When I open the buildings page
    Then I should see a list of buildings
    And I should see a "Neues Gebäude" link

  @list
  Scenario: Buildings list shows key information
    Given there are buildings in the system
    When I open the buildings page
    Then I should see building addresses
    And I should see apartment counts

  @create @wip
  Scenario: Navigate to create building form
    When I open the buildings page
    And I click the "Neues Gebäude" link
    Then I should be on the new building page

  @detail @wip
  Scenario: View building details
    Given there is a building "Musterhaus" in the system
    When I open the building detail page for "Musterhaus"
    Then I should see the building name "Musterhaus"
    And I should see the building address
    And I should see the apartment list

  @search
  Scenario: Search for buildings
    Given there are multiple buildings in the system
    When I open the buildings page
    And I search for "Zürich"
    Then I should only see buildings in Zürich
