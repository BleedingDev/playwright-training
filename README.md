# SídloFlow

SídloFlow spracúva požiadavky zákazníkov na zmenu registračnej adresy firmy. Bežná aplikácia vyhľadáva adresy online v RÚIAN, customer odošle zmenu, operator ju schváli alebo zamietne a admin vidí roly aj všetky požiadavky. Testy používajú malú offline fixture, aby zostali rýchle a deterministické.

## Setup a spustenie

Rovnaké príkazy fungujú v macOS/Linux termináli aj v natívnom Windows PowerShelli. Na Windows musí byť spustený Docker Desktop; WSL nie je potrebné.

```bash
git clone https://github.com/BleedingDev/playwright-training.git
cd playwright-training

git switch -c moje-cviceni origin/workshop/00-start

mise trust
mise install
mise run setup
mise run doctor
```

Aplikácia beží na `http://127.0.0.1:8080`.

| Rola     | Účet                    |
| -------- | ----------------------- |
| Customer | `customer@example.test` |
| Operator | `operator@example.test` |
| Admin    | `admin@example.test`    |

Heslo pre všetky demo účty je `password`.

## Hlavné príkazy

```bash
mise run app:up
mise run app:up:test
mise run app:down
mise run app:reset
mise run app:logs
mise run test:php
mise run test:e2e
mise run test:e2e:docker
mise run test:ui
mise run test:codegen
mise run test:report
```

`mise run app:up` používa živé vyhľadávanie ČÚZK/RÚIAN. `mise run app:up:test` spustí tú istú aplikáciu s malou deterministickou fixture pre testy a ukážky mockovania. `mise run app:reset` obnoví demo dáta. Ďalšie príkazy pribúdajú v priebehu workshopu; mapa vetiev a catch-up postup sú v [CHECKPOINTS.md](CHECKPOINTS.md).
