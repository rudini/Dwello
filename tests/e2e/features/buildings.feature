@buildings
Feature: Building Management
  As a property manager
  I want to manage my buildings
  So that I can track all my properties

  Background:
    Given I am logged in as "Test User"

  @list
  Scenario: View buildings list
    When I open the buildings page
    Then I should see a list of buildings
    And I should see a "Neues Gebäude" link

  @list
  Scenario: Buildings list shows key information
    When I open the buildings page
    Then I should see building addresses
    And I should see apartment counts

  @search
  Scenario: Search for buildings
    When I open the buildings page
    And I search for "Zürich"
    Then I should only see buildings in Zürich

  @detail @data
  Scenario: Building detail page shows apartments with correct data
    When I open building detail page "11111111-1111-1111-1111-111111111111"
    Then I should see the building name "Musterhaus Zentrum"
    And I should see apartments grouped by floor
    And I should see apartment numbers in the list
    And I should see apartment occupancy badges
