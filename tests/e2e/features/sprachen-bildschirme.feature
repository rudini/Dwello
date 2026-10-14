# language: de
@i18n
Funktionalität: Jeder Bildschirm in jeder Sprache
  Als Liegenschaftsverwalter, der Französisch, Italienisch oder Englisch gewählt hat,
  möchte ich auf keinem Bildschirm mehr deutsche Texte sehen, ausser meinen eigenen Daten,
  damit ich jeden Schritt verstehe, auch auf dem Handy

  # Bildschirme und Zustände wie bei der Barrierefreiheit: tests/a11y/screens.json (die Beispiele stimmen überein).
  # Deutsch erkennt die Prüfung an Wörtern aus messages/de.json, die in keinem Text der gewählten Sprache vorkommen;
  # Namen aus den Testdaten sind ausgenommen. Auf 390 Pixel darf nichts seitlich scrollen oder abgeschnitten sein.

  Szenariogrundriss: Bildschirm ohne deutschen Text
    Dann zeigt der Bildschirm "<Bildschirm>" im Zustand "<Zustand>" auf Französisch, Italienisch und Englisch kein Deutsch und passt in 390 Pixel

    # title-format: <Bildschirm> <Zustand>
    Beispiele:
      | Bildschirm             | Zustand             |
      | gallery                | default             |
      | gallery                | dialog-open         |
      | gallery                | busy-dialog-open    |
      | login                  | default             |
      | login                  | login-error         |
      | login                  | other-language      |
      | error-404              | default             |
      | error-server           | default             |
      | error-server           | server-error        |
      | dashboard              | default             |
      | dashboard              | first-use           |
      | dashboard              | mobile-menu-open    |
      | dashboard              | user-menu-open      |
      | dashboard              | other-language      |
      | dashboard              | language-menu-open  |
      | buildings              | default             |
      | buildings              | empty               |
      | buildings              | filtered-empty      |
      | building-new           | default             |
      | building-new           | submit-empty        |
      | building-detail        | default             |
      | building-detail        | delete-dialog       |
      | building-detail        | fuel-stock-dialog   |
      | building-edit          | default             |
      | building-edit          | submit-cleared      |
      | building-edit          | saved-toast         |
      | apartments             | default             |
      | apartments             | empty               |
      | apartments             | filtered-empty      |
      | apartment-new          | default             |
      | apartment-new          | submit-empty        |
      | apartment-detail       | default             |
      | apartment-edit         | default             |
      | apartment-edit         | submit-cleared      |
      | tenants                | default             |
      | tenants                | empty               |
      | tenants                | filtered-empty      |
      | tenant-new             | default             |
      | tenant-new             | submit-empty        |
      | tenant-detail          | default             |
      | tenant-detail          | delete-dialog       |
      | tenant-edit            | default             |
      | tenant-edit            | submit-cleared      |
      | contracts              | default             |
      | contracts              | empty               |
      | contracts              | filtered-empty      |
      | contract-new           | default             |
      | contract-new           | submit-empty        |
      | contract-new           | every-wizard-step   |
      | contract-new           | overlap-warning     |
      | contract-new           | draft-restored      |
      | contract-new           | contracts-unknown   |
      | contract-new           | contracts-unknown-review |
      | contract-detail        | default             |
      | contract-detail        | end-dialog          |
      | contract-detail        | end-dialog-error    |
      | contract-detail        | past-end-error      |
      | contract-detail        | end-dialog-refused  |
      | contract-detail        | delete-dialog       |
      | contract-edit          | default             |
      | contract-edit          | submit-cleared      |
      | contract-edit          | past-end-error      |
      | contract-edit          | edit-refused        |
      | contract-edit          | contracts-unknown   |
      | contract-detail-notice | default             |
      | contract-edit-notice   | default             |
      | invoices               | default             |
      | invoices               | empty               |
      | invoices               | filtered-empty      |
      | invoice-new            | default             |
      | invoice-new            | submit-empty        |
      | invoice-detail         | default             |
      | invoice-detail         | delete-dialog       |
      | invoice-edit           | default             |
      | invoice-edit           | submit-cleared      |
      | invoice-billed-detail  | default             |
      | invoice-billed-detail  | delete-dialog       |
      | invoice-billed-edit    | default             |
      | invoice-late-detail    | default             |
      | statements             | default             |
      | statements             | empty               |
      | statements             | filtered-empty      |
      | statements             | mark-paid-dialog    |
      | statement-generate     | default             |
      | statement-generate     | every-wizard-step   |
      | statement-generate     | preview-empty       |
      | statement-generate     | category-check      |
      | statement-generate     | period-not-over     |
      | statement-generate     | tank-question       |
      | statement-generate     | preview-all-billed  |
      | statement-generate     | draft-restored      |
      | statement-generate     | link-preset         |
      | statement-detail       | default             |
      | statement-detail       | send-dialog         |
      | statement-detail       | delete-dialog       |
      | statement-sent-detail  | default             |
      | statement-sent-detail  | reminder-dialog     |
      | statement-sent-detail  | mark-paid-dialog    |
      | statement-sent-detail  | action-error        |
      | statement-empty-detail | default             |
      | statement-edit         | default             |
      | statement-edit         | submit-cleared      |
      | documents              | default             |
      | documents              | empty               |
      | config                 | default             |
      | categories             | default             |
      | category-new           | default             |
      | category-new           | submit-empty        |
      | category-edit          | default             |
      | category-edit          | submit-cleared      |
      | category-edit          | saved-toast         |
      | categories             | delete-dialog       |
      | distribution-keys      | default             |
      | distribution-key-new   | default             |
      | distribution-key-new   | submit-empty        |
      | distribution-key-new   | formula-tested      |
      | distribution-key-edit  | default             |
      | distribution-key-edit  | submit-cleared      |
      | distribution-keys      | delete-dialog       |
      | heating-profiles       | default             |
      | heating-profile-new    | default             |
      | heating-profile-new    | profile-sum-invalid |
      | heating-profile-detail | default             |
      | heating-profile-detail | delete-dialog       |
      | heating-profile-edit   | default             |
      | heating-profile-edit   | submit-cleared      |
      | help                   | default             |
      | privacy                | default             |
      | terms                  | default             |
      | analytics              | default             |
      | reports                | default             |
      | help-public            | default             |
      | privacy-public         | default             |
      | terms-public           | default             |
