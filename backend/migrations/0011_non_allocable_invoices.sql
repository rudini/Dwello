-- ============================================================================
-- Invoices of a non-allocable category are not passed on to the tenants (OR 257a)
-- Before the backend enforced it, the form could save such an invoice as allocable.
-- ============================================================================

UPDATE invoices SET is_valid_utility_cost = false
FROM categories
WHERE invoices.category_id = categories.id
  AND NOT categories.is_allowed_utility_cost
  AND invoices.is_valid_utility_cost;
