-- ============================================================================
-- Rätoromanisch is no longer a tenant language (#63): its statements were German anyway. Tenants and the default
-- language with Romansh move to German.
-- ============================================================================

UPDATE tenants SET language = 'de', updated_at = NOW() WHERE language = 'rm';
UPDATE configuration SET value = 'de', updated_at = NOW() WHERE key = 'default_language' AND value = 'rm';

ALTER TABLE tenants DROP CONSTRAINT tenants_language_check;
ALTER TABLE tenants ADD CONSTRAINT tenants_language_check CHECK (language IN ('de', 'fr', 'it', 'en'));
