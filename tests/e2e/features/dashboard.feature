@dashboard
Feature: Dashboard Overview
  As a property manager
  I want to see an overview of my portfolio
  So that I can quickly assess my business status

  Background:
    Given I am logged in as "Test User"
    And the backend API is mocked

  @overview
  Scenario: Dashboard shows portfolio statistics
    When I open the dashboard
    Then I should see the total number of buildings
    And I should see the total number of apartments
    And I should see the occupancy rate

  @financial
  Scenario: Dashboard shows financial overview
    When I open the dashboard
    Then I should see outstanding statements count
    And I should see total pending amount
    And I should see overdue amount

  @statements
  Scenario: Dashboard shows statement status cards
    When I open the dashboard
    Then I should see draft statements count
    And I should see sent statements count
    And I should see paid statements count
    And I should see overdue statements count

  @activity @wip
  Scenario: Dashboard shows recent activity
    When I open the dashboard
    Then I should see the activity feed
    And I should see recent activities

  @occupancy @wip
  Scenario: Dashboard shows occupancy chart
    When I open the dashboard
    Then I should see the occupancy chart
    And I should see building names in the chart

  @quick-actions
  Scenario: Dashboard provides quick actions
    When I open the dashboard
    Then I should see a "Rechnung erfassen" link
    And I should see a "Abrechnungen erstellen" link

  @navigation @wip
  Scenario: Navigate to buildings from dashboard
    When I open the dashboard
    And I click on the buildings stat card
    Then I should be on the buildings page

  @navigation @wip
  Scenario: Navigate to statements from dashboard
    When I open the dashboard
    And I click on the overdue statements card
    Then I should be on the statements page with overdue filter
