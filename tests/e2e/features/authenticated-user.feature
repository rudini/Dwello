@authentication @authenticated
Feature: Authenticated User Access
  As a logged in property manager
  I want to access all protected features
  So that I can manage my properties

  Background:
    Given I am logged in as "Test User"

  @navigation
  Scenario: Authenticated user sees navigation
    When I open the dashboard
    Then I should see the main navigation
    And I should see my username in the header

  @dashboard
  Scenario: Authenticated user can access dashboard
    When I open the dashboard
    Then I should stay on the dashboard
    And I should see portfolio statistics

  @redirect
  Scenario: Authenticated user is redirected from login page
    When I open the login page
    Then I should be redirected to the dashboard
