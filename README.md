# @peppermint-digital/eslint-design

Ergänzung zu [`@shadcn/lint`](https://ui.shadcn.com): die eigene Regel gegen
rohe Farbklassen, dazu die beiden Ausnahmen, die in **jedem** Peppermint-Projekt
gleich aussehen.

Vorher lag die Regel als 158-Zeilen-Kopie in acht Repositories — byte-gleich.
Eine Nachschärfung hätte achtmal passieren müssen.

## Einbinden

```bash
npm i -D github:peppermint-digital/eslint-design
```

npm 12 sperrt Git-Abhängigkeiten in der Vorgabe. Falls das Projekt noch keine
`.npmrc` hat:

```ini
# `root`: Erlaubt sind nur Git-Abhängigkeiten aus DIESER package.json.
allow-git=root
```

## Benutzen

```js
import { plugin as shadcn } from '@shadcn/lint';
import { plugin as peppermint, bausteinAusnahme, NO_RESTYLE_AUS }
    from '@peppermint-digital/eslint-design';

export default [
    {
        files: ['resources/js/**/*.{ts,tsx}'],
        plugins: { shadcn, peppermint },
        rules: {
            ...NO_RESTYLE_AUS,
            'shadcn/no-raw-colors': 'error',
            'peppermint/keine-palettenklassen': 'error',
            // … projekteigene Regeln
        },
    },
    bausteinAusnahme(),
    // … projekteigene Ausnahmen
];
```

## Was die Regel prüft

**`keine-palettenklassen`** schließt zwei Lücken von `no-raw-colors`. Die Regel
dort sucht Farb*literale* (`#22c55e`, `oklch(…)`, `rgb(…)`) und sieht Klassen
nicht.

1. **Rohe Palettenklassen** — `bg-green-500`, `text-purple-800`. Sie bleiben im
   Dunkelmodus hell und fallen aus jeder Theme-Anpassung heraus.
2. **Handgebaute Modusfarben** — `text-black dark:text-white` ist
   `text-foreground`, von Hand nachgebaut.

Bewusst **nicht** gemeldet, weil dort richtig:

- `text-white` allein auf gesättigter Fläche (`bg-purple-600 text-white`)
- Überlagerungen mit Deckkraft (`bg-black/60`) und Verlaufsstopps
  (`from-black/70`) — die sollen in beiden Modi gleich aussehen

## Kategorienfarben sind kein Fehler

Ein Programmpunkt, eine Belegart, eine vom Benutzer gewählte Projektfarbe haben
im Theme keine Entsprechung und sollen auch keine bekommen. `success` /
`warning` / `info` tragen eine **Wertung** — eine Gutschrift ist kein Fehler.

Solche Stellen gehören in die Ausnahmeliste der Projekt-Konfiguration, mit
Begründung. Der Unterschied zu vorher ist nicht, dass sie erlaubt sind, sondern
dass sie **dort stehen** statt unbemerkt durchzurutschen.
