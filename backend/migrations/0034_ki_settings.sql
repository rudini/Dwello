-- ============================================================================
-- #580 (product owner 2026-10-21): the KI set in the browser. One row: local KI, a provider or none; for a provider
-- its address, model, name and country (named by the privacy statement) and its API key, encrypted with the
-- installation's ENCRYPTION_KEY (AES-256-GCM, never stored in clear). The operator's LLM_* variables take precedence.
-- ============================================================================

CREATE TABLE ki_settings (
	id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
	mode VARCHAR(10) NOT NULL CHECK (mode IN ('local', 'provider', 'none')),
	base_url TEXT,
	model TEXT,
	provider TEXT,
	provider_country TEXT,
	api_key_encrypted TEXT,
	updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
