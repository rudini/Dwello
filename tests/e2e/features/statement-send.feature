# language: de
@statements
Funktionalität: Abrechnung per E-Mail senden
  Als Liegenschaftsverwalter
  möchte ich die Nebenkostenabrechnung einem Mieter, der Korrespondenz per E-Mail wünscht, direkt aus Dwello senden
  damit er sie mit der QR-Rechnung erhält, sie unter «Dokumente» liegt und die Zahlungsfrist ab dem Tag des Versands zählt

  # #86: per Brief bleibt der Versand manuell (statement-detail.feature, «Abrechnung versenden»)
  Grundlage:
    Angenommen die Verwaltung hat die IBAN "CH93 0076 2011 6238 5295 7" hinterlegt
    Und das Gebäude "Birkenhof" in "Winterthur" existiert
    Und im Gebäude "Birkenhof" gibt es die leere Wohnung "1.01"
    Und der Mieter "Nora Beispiel" existiert
    Und "Nora Beispiel" mietet die Wohnung "1.01" seit "2014-01-01" für "950" Franken mit "150" Franken Akonto
    Und im Gebäude "Birkenhof" gibt es eine Heizkostenrechnung über "4000" Franken für 2024
    Und für "Nora Beispiel" im Gebäude "Birkenhof" gibt es die Nebenkostenabrechnung 2024

  Szenario: Vor dem Senden Empfänger und Zahlungsfrist prüfen
    Angenommen "Nora Beispiel" wünscht Korrespondenz per E-Mail
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Nora Beispiel"
    Wenn der Liegenschaftsverwalter die Abrechnung per E-Mail senden will
    Dann nennt die Bestätigung den Empfänger "Nora Beispiel" mit dem Korrespondenzkanal "Per E-Mail"
    Und sagt die Bestätigung, dass Dwello die Abrechnung per E-Mail sendet und die Zahlungsfrist ab dem Tag des Versands rechnet
    Und erklärt die Bestätigung des Versands "Kommt die E-Mail später als unzustellbar zurück, stellen Sie die Abrechnung per Brief zu. Mahnen Sie dann erst, wenn der Mieter die Abrechnung per Brief erhalten hat und die Zahlungsfrist danach abgelaufen ist."

  Szenario: Abrechnung per E-Mail senden
    Angenommen "Nora Beispiel" wünscht Korrespondenz per E-Mail
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Nora Beispiel"
    Wenn der Liegenschaftsverwalter die Abrechnung per E-Mail sendet
    Dann hat die Abrechnung den Status "Versendet"
    Und nennt der Verlauf den Versand per E-Mail an "Nora Beispiel" am Tag des Versands
    Und ist die Zahlungsfrist 30 Tage nach dem Tag des Versands
    Und hat "Nora Beispiel" per E-Mail "Nebenkostenabrechnung" mit PDF erhalten
    Und ist die "Nebenkostenabrechnung" an "Nora Beispiel" als versendet festgehalten

  # #449 (Entscheid in #404, Punkt 6): ohne E-Mail-Adresse bietet der Versand nur den Brief an
  Szenario: Mieter ohne E-Mail-Adresse
    Angenommen "Nora Beispiel" wünscht Korrespondenz per E-Mail, hat aber keine E-Mail-Adresse
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Nora Beispiel"
    Wenn der Liegenschaftsverwalter die Abrechnung per E-Mail senden will
    Dann bietet die Bestätigung nur den Brief an

  # Dass ein nicht eingerichteter E-Mail-Versand die Abrechnung ebenso als Entwurf lässt, prüft statement-mail.pg.test.ts:
  # der E2E-Stack sendet immer an den Mail-Catcher
  Szenario: Der Mailserver weist die E-Mail ab
    Angenommen "Nora Beispiel" wünscht Korrespondenz per E-Mail an eine Adresse, die der Mailserver abweist
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Nora Beispiel"
    Wenn der Liegenschaftsverwalter die Abrechnung per E-Mail sendet
    Dann meldet die Abrechnung "Die E-Mail wurde nicht zugestellt. Prüfen Sie die E-Mail-Adresse beim Mieter und senden Sie die Abrechnung erneut, oder stellen Sie sie per Brief zu."
    Und hat die Abrechnung den Status "Entwurf"
    Und ist die "Nebenkostenabrechnung" an "Nora Beispiel" nicht unter «Dokumente» abgelegt

  # #449: ohne Adresse bietet der Versand gleich den Brief an; gescheitert ist die E-Mail hier am Mailserver
  Szenario: Nach gescheiterter E-Mail per Brief zustellen
    Angenommen "Nora Beispiel" wünscht Korrespondenz per E-Mail an eine Adresse, die der Mailserver abweist
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Nora Beispiel"
    Wenn der Liegenschaftsverwalter die Abrechnung per E-Mail sendet
    Und der Liegenschaftsverwalter die Abrechnung stattdessen per Brief zustellt
    Dann hat die Abrechnung den Status "Versendet"
    Und nennt der Verlauf "Versendet per Brief" am Tag des Versands
    Und ist die Zahlungsfrist 30 Tage nach dem Tag des Versands

  # #449 (Entscheid in #404, Punkte 6 und 7): der Brief statt der E-Mail, ohne den Korrespondenzkanal zu ändern; das PDF
  # liegt als Dokument unter «Dokumente», und der Verlauf nennt den Weg
  Szenario: Stattdessen per Brief zustellen
    Angenommen "Nora Beispiel" wünscht Korrespondenz per E-Mail
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Nora Beispiel"
    Wenn der Liegenschaftsverwalter die Abrechnung statt per E-Mail per Brief zustellt
    Dann hat die Abrechnung den Status "Versendet"
    Und nennt der Verlauf "Versendet per Brief" am Tag des Versands
    Und ist die "Nebenkostenabrechnung" an "Nora Beispiel" per Brief versendet festgehalten
    Und wünscht "Nora Beispiel" weiterhin Korrespondenz per E-Mail
