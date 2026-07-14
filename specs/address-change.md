# Test Brief: customer odošle zmenu sídla

## Intent

Chrániť istotu customera, že zvolená adresa bola odoslaná ako nová požiadavka a systém ju eviduje ako čakajúcu na rozhodnutie.

## Setup

- Deterministický reset demo dát.
- Customer session zo `storageState`.
- Offline `FixtureRuianAddressProvider` s deterministickou adresou.

## Actions

1. Otvoriť „Zmena sídla“.
2. Zadať dostatočne dlhý výraz.
3. Vybrať návrh podľa role `option` a accessible name.
4. Overiť rekapituláciu.
5. Odoslať požiadavku.

## Assertions

- Zobrazí sa jednoznačné potvrdenie odoslania.
- Zvolená adresa je v histórii.
- Jej stav je presne „Čaká na schválenie“.

## Boundary

Test prechádza skutočnou cestou React -> Laravel endpoint -> offline `FixtureRuianAddressProvider`. Neoveruje HTTP RÚIAN adapter ani externú službu.

## Failure proof

Test musí sčervenať, ak odoslanie iba presmeruje na dashboard, ale nevytvorí alebo nezobrazí pending požiadavku. Samotná URL alebo prítomnosť všeobecného nadpisu nie je postačujúca assertion.
