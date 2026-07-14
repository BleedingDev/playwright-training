# SídloFlow Product Contract

SídloFlow spracúva požiadavku firmy na zmenu registračnej adresy. UI je v slovenčine; doménové názvy v kóde sú v angličtine.

## Roly

- **Customer** vlastní jednu demo firmu, vidí jej aktuálnu adresu a históriu požiadaviek a môže odoslať novú požiadavku.
- **Operator** vidí čakajúcu frontu a môže požiadavku schváliť alebo zamietnuť. Zamietnutie vyžaduje poznámku.
- **Admin** vidí všetky požiadavky a používateľské roly. Customer ani operator nesmú otvoriť admin route.

## Hlavný flow

Customer zadá aspoň tri znaky adresy. Po debounce UI zavolá interný endpoint, zobrazí návrhy, umožní jeden vybrať, ukáže rekapituláciu a odošle požiadavku. Úspech je pozorovateľný potvrdením a položkou so stavom **Čaká na schválenie**.

Operator otvorí pending požiadavku. Schválenie zmení stav na **Schválená** a aktualizuje aktuálne sídlo firmy. Zamietnutie zmení stav na **Zamietnutá**, zachová pôvodné sídlo a zobrazí dôvod.

## Address search states

UI rozlišuje vstup kratší než tri znaky, loading, výsledky, prázdny výsledok, externú chybu, timeout, vybraný výsledok a retry. Chyba alebo timeout nesmie zmazať možnosť skúsiť vyhľadávanie znova.

## RÚIAN boundary

React volá iba `GET /api/addresses?query=...`. Laravel `AddressSearchService` volá `RuianAddressProvider`. Bežná aplikácia používa online HTTP provider nad oficiálnou vyhľadávacou službou ČÚZK/RÚIAN. Testovací režim používa malú offline fixture, aby testy a ukážky mockovania zostali deterministické. Úspešná odpoveď má v oboch režimoch jednotný kontrakt `items[]` s `id`, `label`, `street`, `houseNumber`, `city` a `postalCode`.

## Edge cases

- Query kratšia než tri znaky nevolá API.
- Prázdna odpoveď nie je chyba.
- 5xx a timeout sú recoverable.
- Už spracovanú požiadavku nemožno spracovať znova.
- Test-only reset existuje iba v `local` alebo `testing` prostredí.
- Testy nezávisia od poradia, internetu, náhodných dát ani aktuálneho času.

Zámerne neurčujeme právne dokumenty potrebné na schválenie; workshop testuje integračnú hranicu, nie legislatívny proces.
