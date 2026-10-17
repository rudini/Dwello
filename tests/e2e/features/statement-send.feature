# language: de
@statements
Funktionalität: Abrechnung per E-Mail senden
  Als Liegenschaftsverwalter
  möchte ich die Nebenkostenabrechnung einem Mieter, der Korrespondenz per E-Mail wünscht, direkt aus Dwello senden
  damit er sie mit der QR-Rechnung erhält, sie unter «Dokumente» liegt und die Zahlungsfrist ab dem Tag des Versands zählt

  # #86: per Brief bleibt der Versand manuell (statement-detail.feature, «Abrechnung versenden»)
  Grundlage:
    Angenommen das Gebäude "Birkenhof" in "Winterthur" existiert
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

  Szenario: Abrechnung per E-Mail senden
    Angenommen "Nora Beispiel" wünscht Korrespondenz per E-Mail
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Nora Beispiel"
    Wenn der Liegenschaftsverwalter die Abrechnung per E-Mail sendet
    Dann hat die Abrechnung den Status "Versendet"
    Und nennt der Verlauf "Versendet" am Tag des Versands
    Und ist die Zahlungsfrist 30 Tage nach dem Tag des Versands
    Und hat "Nora Beispiel" per E-Mail "Nebenkostenabrechnung" mit PDF erhalten
    Und ist die "Nebenkostenabrechnung" an "Nora Beispiel" als versendet festgehalten

  # Die Abrechnung geht nicht hinaus: sie bleibt ein Entwurf, und der Verwalter erfährt, was er tun kann
  Szenario: Mieter ohne E-Mail-Adresse
    Angenommen "Nora Beispiel" wünscht Korrespondenz per E-Mail, hat aber keine E-Mail-Adresse
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Nora Beispiel"
    Wenn der Liegenschaftsverwalter die Abrechnung per E-Mail sendet
    Dann meldet die Abrechnung "Der Mieter hat keine E-Mail-Adresse. Erfassen Sie sie beim Mieter und senden Sie die Abrechnung erneut, oder stellen Sie sie per Brief zu."
    Und hat die Abrechnung den Status "Entwurf"
    Und ist die "Nebenkostenabrechnung" an "Nora Beispiel" nicht unter «Dokumente» abgelegt

  # Dass ein nicht eingerichteter E-Mail-Versand die Abrechnung ebenso als Entwurf lässt, prüft statement-mail.pg.test.ts:
  # der E2E-Stack sendet immer an den Mail-Catcher
  Szenario: Der Mailserver weist die E-Mail ab
    Angenommen "Nora Beispiel" wünscht Korrespondenz per E-Mail an eine Adresse, die der Mailserver abweist
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Nora Beispiel"
    Wenn der Liegenschaftsverwalter die Abrechnung per E-Mail sendet
    Dann meldet die Abrechnung "Die E-Mail wurde nicht zugestellt. Prüfen Sie die E-Mail-Adresse beim Mieter und senden Sie die Abrechnung erneut, oder stellen Sie sie per Brief zu."
    Und hat die Abrechnung den Status "Entwurf"
    Und ist die "Nebenkostenabrechnung" an "Nora Beispiel" nicht unter «Dokumente» abgelegt

  Szenario: Nach gescheiterter E-Mail per Brief zustellen
    Angenommen "Nora Beispiel" wünscht Korrespondenz per E-Mail, hat aber keine E-Mail-Adresse
    Und der Liegenschaftsverwalter ist auf der Detailseite der Abrechnung 2024 von "Nora Beispiel"
    Wenn der Liegenschaftsverwalter die Abrechnung per E-Mail sendet
    Und der Liegenschaftsverwalter die Abrechnung stattdessen per Brief zustellt
    Dann hat die Abrechnung den Status "Versendet"
    Und nennt der Verlauf "Versendet" am Tag des Versands
    Und ist die Zahlungsfrist 30 Tage nach dem Tag des Versands
