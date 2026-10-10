# language: de
@a11y
Funktionalität: Barrierefreiheit
  Als Liegenschaftsverwalter, auch mit Screenreader, Tastatur oder grosser Schrift,
  möchte ich jeden Bildschirm in jedem Zustand bedienen können
  damit ich meine Mietverträge und Abrechnungen ohne fremde Hilfe erledige

  # Bildschirme und Zustände: tests/a11y/screens.json (die Liste muss mit den Beispielen übereinstimmen).
  # Geprüft mit axe-core nach WCAG 2.2 AA in allen Ansichten (Desktop, Tablet, Handy).

  Szenariogrundriss: Bildschirm ohne Barrieren
    Dann ist der Bildschirm "<Bildschirm>" im Zustand "<Zustand>" in allen Ansichten barrierefrei

    Beispiele:
      | Bildschirm             | Zustand             |
      | gallery                | default             |
      | gallery                | dialog-open         |
      | gallery                | busy-dialog-open    |
      | login                  | default             |
      | login                  | login-error         |
      | error-404              | default             |
      | dashboard              | default             |
      | dashboard              | mobile-menu-open    |
      | dashboard              | user-menu-open      |
      | buildings              | default             |
      | buildings              | filtered-empty      |
      | building-new           | default             |
      | building-new           | submit-empty        |
      | building-detail        | default             |
      | building-detail        | delete-dialog       |
      | building-edit          | default             |
      | apartments             | default             |
      | apartments             | filtered-empty      |
      | apartment-new          | default             |
      | apartment-new          | submit-empty        |
      | apartment-detail       | default             |
      | apartment-edit         | default             |
      | tenants                | default             |
      | tenants                | filtered-empty      |
      | tenant-new             | default             |
      | tenant-new             | submit-empty        |
      | tenant-detail          | default             |
      | tenant-detail          | delete-dialog       |
      | tenant-edit            | default             |
      | contracts              | default             |
      | contracts              | filtered-empty      |
      | contract-new           | default             |
      | contract-new           | submit-empty        |
      | contract-new           | every-wizard-step   |
      | contract-new           | overlap-warning     |
      | contract-new           | draft-restored      |
      | contract-detail        | default             |
      | contract-detail        | end-dialog          |
      | contract-detail        | delete-dialog       |
      | contract-edit          | default             |
      | invoices               | default             |
      | invoices               | filtered-empty      |
      | invoice-new            | default             |
      | invoice-new            | submit-empty        |
      | invoice-detail         | default             |
      | invoice-detail         | delete-dialog       |
      | invoice-edit           | default             |
      | statements             | default             |
      | statements             | filtered-empty      |
      | statement-generate     | default             |
      | statement-generate     | every-wizard-step   |
      | statement-generate     | preview-empty       |
      | statement-generate     | draft-restored      |
      | statement-detail       | default             |
      | statement-detail       | send-dialog         |
      | statement-detail       | delete-dialog       |
      | statement-sent-detail  | default             |
      | statement-sent-detail  | reminder-dialog     |
      | statement-sent-detail  | mark-paid-dialog    |
      | statement-sent-detail  | action-error        |
      | statement-edit         | default             |
      | documents              | default             |
      | config                 | default             |
      | categories             | default             |
      | category-new           | default             |
      | category-new           | submit-empty        |
      | category-edit          | default             |
      | categories             | delete-dialog       |
      | distribution-keys      | default             |
      | distribution-key-new   | default             |
      | distribution-key-new   | submit-empty        |
      | distribution-key-new   | formula-tested      |
      | distribution-key-edit  | default             |
      | distribution-keys      | delete-dialog       |
      | heating-profiles       | default             |
      | heating-profile-new    | default             |
      | heating-profile-new    | profile-sum-invalid |
      | heating-profile-detail | default             |
      | heating-profile-detail | delete-dialog       |
      | heating-profile-edit   | default             |
      | help                   | default             |
      | privacy                | default             |
      | terms                  | default             |
      | analytics              | default             |
      | reports                | default             |
