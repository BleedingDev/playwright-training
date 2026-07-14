# SídloFlow

Kontext spravuje požiadavky na zmenu registračnej adresy jednej firmy a rozhodnutie operátora.

## Language

**Firma**:
Právnická osoba s aktuálnou registračnou adresou, ktorú v aplikácii spravuje jeden customer.
_Avoid_: Účet, zákazník

**Požiadavka na zmenu adresy**:
Customerom odoslaný návrh nahradiť aktuálnu registračnú adresu firmy vybranou adresou.
_Avoid_: Objednávka, ticket

**Aktuálne sídlo**:
Registračná adresa firmy platná pred schválením ďalšej požiadavky.
_Avoid_: Pôvodná adresa

**Návrh adresy**:
Jedna normalizovaná adresa vrátená cez RÚIAN boundary a ponúknutá customerovi na výber.
_Avoid_: Výsledok vyhľadávania

**Rozhodnutie**:
Schválenie alebo zamietnutie čakajúcej požiadavky operátorom.
_Avoid_: Spracovanie
