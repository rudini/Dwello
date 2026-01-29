@heating-profiles
Feature: Heating Profile Management
  As a property manager
  I want to manage heating profiles
  So that I can configure heating cost distribution for utility statements

  Background:
    Given I am logged in as "Test User"

  @list
  Scenario: View heating profiles list
    When I open the heating profiles page
    Then I should see the heating profiles page
    And I should see a "Neues Profil" link
    And I should see at least 5 heating profiles

  @detail
  Scenario: View heating profile detail page
    When I open the heating profiles page
    And I click on the "Standard" profile
    Then I should be on the heating profile detail page
    And I should see the profile name "Standard"
    And I should see the monthly distribution chart
    And I should see the profile information section

  @detail @sum-validation
  Scenario: Heating profile shows correct sum color for 100%
    When I open the heating profile detail page for "hp-standard"
    Then I should see the total percentage "100%"
    And the total percentage should be displayed in green

  @detail @sum-validation
  Scenario: Heating profile shows red sum color for values not 100%
    When I open the heating profile detail page for "hp-mountain"
    Then I should see the total percentage "95%"
    And the total percentage should be displayed in red

  @edit
  Scenario: Edit custom heating profile
    When I open the heating profile edit page for "hp-custom-1"
    Then I should see the heating profile edit form
    And I should see the monthly percentage inputs
    And I should see the preview chart

  @edit @sum-validation
  Scenario: Sum updates when changing monthly percentages
    When I open the heating profile edit page for "hp-custom-1"
    And I change the January percentage to "20"
    Then the sum should update accordingly
    And the sum color should reflect validity

  @edit @readonly
  Scenario: Cannot edit predefined profiles
    When I open the heating profile detail page for "hp-standard"
    Then I should not see the "Bearbeiten" button for predefined profile

  @navigation
  Scenario: Navigate from profile list to detail
    When I open the heating profiles page
    And I click the view button for "Standard" profile
    Then I should be on the heating profile detail page for "hp-standard"

  @navigation
  Scenario: Navigate from profile detail back to list
    When I open the heating profile detail page for "hp-standard"
    And I click the "Zurück" button
    Then I should be on the heating profiles page
