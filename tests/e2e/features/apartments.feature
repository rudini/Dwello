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

  @create
  Scenario: Navigate to create apartment form
    When I open the apartments page
    And I click the "Neue Wohnung" link
    Then I should be on the new apartment page

  @create
  Scenario: New apartment page shows building dropdown
    When I open the new apartment page
    Then I should see the building dropdown
    And the building dropdown should have all buildings

  @create @preset-building
  Scenario: Building is preset when navigating from building detail
    When I open the new apartment page with building "11111111-1111-1111-1111-111111111111"
    Then the building field should be readonly
    And the building field should show "Musterhaus Zentrum"
    And I should see a lock icon on the building field

  @create @preset-building
  Scenario: Breadcrumb shows building path when preset
    When I open the new apartment page with building "11111111-1111-1111-1111-111111111111"
    Then the breadcrumb should show "Gebäude"
    And the breadcrumb should show "Musterhaus Zentrum"
    And the breadcrumb should show "Neue Wohnung"

  @create @preset-building
  Scenario: Cancel button returns to building when preset
    When I open the new apartment page with building "11111111-1111-1111-1111-111111111111"
    Then the cancel button should link to "/buildings/11111111-1111-1111-1111-111111111111"

  @create @preset-building
  Scenario: Building preset works for different buildings
    When I open the new apartment page with building "22222222-2222-2222-2222-222222222222"
    Then the building field should be readonly
    And the building field should show "Seepark Residenz"
    And the cancel button should link to "/buildings/22222222-2222-2222-2222-222222222222"

  @create @preset-building
  Scenario: Invalid building preset falls back to dropdown
    When I open the new apartment page with building "99999999-9999-9999-9999-999999999999"
    Then the building dropdown should be visible
    And the building field should not be readonly

  @create @form
  Scenario: New apartment form has required fields
    When I open the new apartment page
    Then I should see the floor dropdown
    And I should see the apartment number input
    And I should see the size input
    And I should see the room count dropdown

  @create @form
  Scenario: New apartment form shows validation errors
    When I open the new apartment page
    And I submit the new apartment form
    Then I should see the building validation error
    And I should see the floor validation error
    And I should see the apartment number validation error

  @list @data
  Scenario: Apartments list shows apartments with building names
    When I open the apartments page
    Then I should see apartments in the list
    And I should see apartment building names
    And I should see apartment occupancy status badges

  @list @data
  Scenario: Apartments list shows correct occupancy status
    When I open the apartments page
    Then I should see at least one "Vermietet" badge
    And I should see at least one "Leer" badge

  @duplicate-check
  Scenario: Duplicate apartment number warning on new apartment form
    When I open the new apartment page
    And I select building "Musterhaus Zentrum" from the dropdown
    And I enter apartment number "1.01"
    And I wait for the duplicate check
    Then I should see the duplicate apartment warning
    And the warning should mention apartment number "1.01"

  @duplicate-check
  Scenario: No warning for unique apartment number
    When I open the new apartment page
    And I select building "Musterhaus Zentrum" from the dropdown
    And I enter apartment number "99.99"
    And I wait for the duplicate check
    Then I should not see the duplicate apartment warning
