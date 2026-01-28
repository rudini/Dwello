@authentication
Feature: User Authentication
  As a property manager
  I want to securely log in to Dwello
  So that I can manage my buildings and utility statements

  Background:
    Given I am not logged in

  @login-page
  Scenario: Login page displays correctly
    When I open the login page
    Then I should see the Dwello branding
    And I should see the text "Sign in to your account"
    And I should see a "Sign in with Google" button
    And I should see a "Sign in with Microsoft" button

  @login-page
  Scenario: Login page shows security information
    When I open the login page
    Then I should see the text "Secure OAuth 2.0 authentication"
    And I should see the text "Your data is stored securely in Switzerland"

  @oauth
  Scenario: Google OAuth initiates redirect
    When I call the login API with provider "google"
    Then I should receive a redirect to Google

  @oauth
  Scenario: Invalid OAuth provider is rejected
    When I call the login API with provider "facebook"
    Then I should receive a validation error

  @oauth
  Scenario: Missing OAuth provider returns error
    When I call the login API without a provider
    Then I should receive a validation error

  @protected-routes
  Scenario: Protected dashboard requires authentication
    When I try to access the dashboard
    Then I should be redirected to the login page

  @protected-routes
  Scenario: Protected buildings page requires authentication
    When I try to access the buildings page
    Then I should be redirected to the login page

  @logout
  Scenario: Logout API clears session
    When I call the logout API
    Then I should receive a successful response
