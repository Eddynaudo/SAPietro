# Rilasci DayMarck

Due tipi di aggiornamento:
- **Di sistema** (correzioni, piccoli ritocchi): si pubblicano in root; l'app si aggiorna da sola quando l'utente non sta scrivendo.
- **Importanti** (nuove funzioni, icona): passano da `next/` (anteprima per l'amministratore), poi popup a tutti.

Flusso importante:
1. `tools/stage.sh` → copia in `next/`; si lavora lì. Prova su https://eddynaudo.github.io/SAPietro/next/ (barra arancione "ANTEPRIMA", stessi dati).
2. Via libera dell'amministratore → `tools/promote.sh <build> <versione>`.
3. Aggiornare la riga `app_release` (build, version, notes_it, notes_en, reinstall=true se cambia l'icona), POI commit+push.
4. Gli utenti vedono il popup "Aggiorna ora"; chi preme "Aggiorna" in area utente senza novità legge "Ultima versione già presente".

iPhone: l'icona in Home non cambia da remoto → con `reinstall=true` il popup spiega come rimuoverla e riaggiungerla.
