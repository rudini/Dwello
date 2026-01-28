@apartments
Feature: Apartment Management
  As a property manager
  I want to manage apartments
  So that I can track units in my buildings

  Background:
    Given I am logged in as "Test User"

  @list
  Scenario: View apartments list page
    When I open the apartments page
    Then I should see the apartments page
    And I should see a "Neue Wohnung" link

  @list
  Scenario: Apartments page shows search and filters
    When I open the apartments page
    Then I should see the apartments search input
    And I should see the building filter
    And I should see the apartment status filter

  @create @wip
  Scenario: Navigate to create apartment form
    When I open the apartments page
    And I click the "Neue Wohnung" link
    Then I should be on the new apartment page
