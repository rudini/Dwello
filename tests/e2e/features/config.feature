@config
Feature: System Configuration
  As a property manager
  I want to configure system settings
  So that I can customize how the application works

  Background:
    Given I am logged in as "Test User"

  @page
  Scenario: View configuration page
    When I open the config page
    Then I should see the config page
    And I should see the quick links section
    And I should see the company info section
    And I should see the accounting settings section
    And I should see the default values section

  @quick-links
  Scenario: Navigate to categories from config
    When I open the config page
    And I click the "Kategorien" quick link
    Then I should be on the categories page

  @quick-links
  Scenario: Navigate to heating profiles from config
    When I open the config page
    And I click the "Heizprofile" quick link
    Then I should be on the heating profiles page

  @quick-links
  Scenario: Navigate to distribution keys from config
    When I open the config page
    And I click the "Verteilschlüssel" quick link
    Then I should be on the distribution keys page

  @heating-dropdown
  Scenario: Heating profile dropdown shows all profiles
    When I open the config page
    Then the heating profile dropdown should have options
    And I should see "Standard" in the dropdown
    And I should see "Mittelland" in the dropdown
    And I should see "Bergregion" in the dropdown

  @heating-dropdown @validation
  Scenario: Valid heating profiles are selectable
    When I open the config page
    Then the "Standard" option should be enabled
    And the "Mittelland" option should be enabled
    And the "Tessin" option should be enabled

  @heating-dropdown @validation
  Scenario: Invalid heating profiles are disabled
    When I open the config page
    Then the "Bergregion" option should be disabled
    And the disabled option should show "nicht wählbar"

  @heating-dropdown @selection
  Scenario: Can select a valid heating profile
    When I open the config page
    And I select "Standard" as the default heating profile
    Then the heating profile dropdown should show "Standard" selected

  @save-button
  Scenario: Save button is disabled when no changes
    When I open the config page
    Then the save button should be disabled

  @save-button
  Scenario: Save button is enabled after making changes
    When I open the config page
    And I change the management fee to "2.0"
    Then the save button should be enabled
    And I should see the unsaved changes indicator
