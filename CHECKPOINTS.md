# Workshop branches

| Branch                        | Účel                                              | Očakávanie              | Overenie                                                                                     |
| ----------------------------- | ------------------------------------------------- | ----------------------- | -------------------------------------------------------------------------------------------- |
| `workshop/00-start`           | Hotová aplikácia, infra, skills a seed test       | zelená                  | `mise run doctor`                                                                            |
| `checkpoint/01-context`       | Referenčný kontext a Test Brief                   | zelená                  | `mise run doctor`                                                                            |
| `exercise/02-weak-green-test` | Slabý green test prehliada chýbajúci pending stav | slabý test prejde       | `mise run exercise:weak-test`                                                                |
| `checkpoint/02-critical-test` | Kritický customer test a opravený produkt         | zelená                  | `mise run test:e2e`                                                                          |
| `exercise/03-ruian-mocking`   | Nenamockovaná odpoveď 500 čaká na `page.route`    | zámerne červená         | `mise run exercise:mocking`                                                                  |
| `checkpoint/03-ruian-mocking` | `page.route` a MSW scenáre                        | zelená                  | `mise run exercise:mocking`                                                                  |
| `exercise/04-timing-trace`    | Predčasná assertion nad oneskorenou odpoveďou     | zámerne červená + trace | `mise run exercise:timing`                                                                   |
| `checkpoint/04-timing-fixed`  | Web-first čakanie bez pevného sleepu              | zelená                  | `mise run exercise:timing`                                                                   |
| `exercise/05-visual-diff`     | Jedna CSS regresia oproti stabilnej baseline      | zámerne červená + diff  | `mise run exercise:visual`                                                                   |
| `checkpoint/05-visual-fixed`  | Opravená regresia bez zmeny baseline              | zelená                  | `mise run test:visual`                                                                       |
| `checkpoint/06-auth-tags`     | Tri `storageState`, tagy, UI Mode a Codegen       | zelená                  | `mise run test:e2e`                                                                          |
| `checkpoint/07-verify-hook`   | Pevný verify a opt-in pre-push hook               | zelená                  | `mise run verify`                                                                            |
| `exercise/08-ci-failure`      | Deterministicky chybná interná `baseURL`          | zámerne červené CI      | GitHub Actions                                                                               |
| `checkpoint/08-docker-ci`     | Opravený Docker a funkčné CI artefakty            | zelená                  | `mise run test:e2e:docker`                                                                   |
| `checkpoint/09-staging`       | Nedestruktívny smoke proti inej `baseURL`         | zelená                  | `mise run app:up:secondary && PLAYWRIGHT_BASE_URL=http://127.0.0.1:8081 mise run test:smoke` |

## Bezpečný catch-up

Najprv uložte rozpracovanú prácu. `git switch -C` prepíše lokálny branch pointer.

```bash
git status
git add -A
git commit -m "WIP before checkpoint"

git switch -C moje-cviceni origin/checkpoint/NN-name
pnpm install
mise run app:reset
```
