@tenants
Feature: Tenant Management
  As a property manager
  I want to manage tenants
  So that I can track who lives in my apartments

  Background:
    Given I am logged in as "Test User"

  @list
  Scenario: View tenants list page
    When I open the tenants page
    Then I should see the tenants page
    And I should see a "Neuer Mieter" link

  @list
  Scenario: Tenants page shows search and filters
    When I open the tenants page
    Then I should see the tenants search input
    And I should see the tenant status filter

  @create @wip
  Scenario: Navigate to create tenant form
    When I open the tenants page
    And I click the "Neuer Mieter" link
    Then I should be on the new tenant page

  @list @data
  Scenario: Tenants list shows tenant data from backend
    When I open the tenants page
    Then I should see tenants in the list
    And I should see tenant names
    And I should see tenant email addresses

  @list @data
  Scenario: Tenants list shows current apartment info
    When I open the tenants page
    Then I should see tenant apartment information
