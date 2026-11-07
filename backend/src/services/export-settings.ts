// The settings by the names of the form under «Einstellungen»
export const SETTINGS: Record<string, readonly [string, string, string, string]> = {
	company_name: ['Firmenname', 'Nom de l’entreprise', 'Nome dell’azienda', 'Company name'],
	company_address: ['Strasse und Hausnummer', 'Rue et numéro', 'Via e numero civico', 'Street and house number'],
	company_postal_code: ['PLZ', 'NPA', 'NPA', 'Postcode'],
	company_city: ['Ort', 'Localité', 'Località', 'Town'],
	company_phone: ['Telefon', 'Téléphone', 'Telefono', 'Phone'],
	company_email: ['E-Mail', 'E-mail', 'E-mail', 'Email'],
	iban: ['IBAN', 'IBAN', 'IBAN', 'IBAN'],
	account_holder_name: ['Name des Kontoinhabers', 'Nom du titulaire du compte', 'Nome del titolare del conto', 'Account holder’s name'],
	account_holder_address: ['Strasse und Hausnummer des Kontoinhabers', 'Rue et numéro du titulaire du compte', 'Via e numero civico del titolare del conto', 'Account holder’s street and house number'],
	account_holder_postal_code: ['PLZ des Kontoinhabers', 'NPA du titulaire du compte', 'NPA del titolare del conto', 'Account holder’s postcode'],
	account_holder_city: ['Ort des Kontoinhabers', 'Localité du titulaire du compte', 'Località del titolare del conto', 'Account holder’s town'],
	payment_deadline_days: ['Zahlungsfrist (Tage)', 'Délai de paiement (jours)', 'Termine di pagamento (giorni)', 'Payment deadline (days)'],
	reminder_after_days: ['Mahnfrist (Tage)', 'Délai de rappel (jours)', 'Termine di sollecito (giorni)', 'Reminder period (days)'],
	management_fee_pct: ['Verwaltungspauschale in %', 'Frais d’administration en %', 'Spese amministrative in %', 'Management fee in %'],
	default_distribution_key_id: ['Standard-Verteilschlüssel', 'Clé de répartition par défaut', 'Chiave di riparto predefinita', 'Default distribution key'],
	default_heating_profile_id: ['Standard-Heizprofil', 'Profil de chauffage par défaut', 'Profilo di riscaldamento predefinito', 'Default heating profile'],
	default_language: ['Sprache', 'Langue', 'Lingua', 'Language']
};
