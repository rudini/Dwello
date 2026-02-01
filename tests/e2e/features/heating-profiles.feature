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
    And I should see at least 5 heating profiles

  @detail
  Scenario: View heating profile detail page
    When I open the heating profile detail page for "7628fe38-6720-4281-998e-4319b8f2b68d"
    Then I should be on the heating profile detail page
    And I should see the profile name "Heating + Hot Water"
    And I should see the monthly distribution chart

  @detail @sum-validation
  Scenario: Heating profile shows correct sum color for 100%
    # Heating Mountain profile has exactly 100% sum
    When I open the heating profile detail page for "011c4636-e43c-4121-b26d-fd750ef2d8c3"
    Then I should see the total percentage "100%"
    And the total percentage should be displayed in green

  @detail @sum-validation @wip
  # This test needs a profile with sum != 100%, none exist in seed data
  Scenario: Heating profile shows red sum color for values not 100%
    When I open the heating profile detail page for "011c4636-e43c-4121-b26d-fd750ef2d8c3"
    Then I should see the total percentage that is not 100%
    And the total percentage should be displayed in red

  @edit @wip
  # No custom profiles in seed data
  Scenario: Edit custom heating profile
    When I open the heating profile edit page for "custom-profile-id"
    Then I should see the heating profile edit form
    And I should see the monthly percentage inputs
    And I should see the preview chart

  @edit @sum-validation @wip
  # No custom profiles in seed data
  Scenario: Sum updates when changing monthly percentages
    When I open the heating profile edit page for "custom-profile-id"
    And I change the January percentage to "20"
    Then the sum should update accordingly
    And the sum color should reflect validity

  @edit @readonly
  Scenario: Cannot edit predefined profiles
    When I open the heating profile detail page for "7628fe38-6720-4281-998e-4319b8f2b68d"
    Then I should not see the "Bearbeiten" button for predefined profile

  @navigation
  Scenario: Navigate from profile list to detail
    When I open the heating profiles page
    And I click the first profile link
    Then I should be on a heating profile detail page

  @navigation
  Scenario: Navigate from profile detail back to list
    When I open the heating profile detail page for "7628fe38-6720-4281-998e-4319b8f2b68d"
    And I click the back link
    Then I should be on the heating profiles page
