import keinePalettenklassen from './rules/keine-palettenklassen.js';

/**
 * Die eigenen Design-Regeln als ESLint-Plugin.
 *
 * Einhaengen in `eslint.design.config.js`:
 *
 *     import { plugin as peppermint, bausteinAusnahme, NO_RESTYLE_AUS }
 *         from '@peppermint-digital/eslint-design';
 *
 *     export default [
 *         {
 *             files: ['**\/*.{ts,tsx}'],
 *             plugins: { shadcn, peppermint },
 *             rules: {
 *                 ...NO_RESTYLE_AUS,
 *                 'shadcn/no-raw-colors': 'error',
 *                 'peppermint/keine-palettenklassen': 'error',
 *                 // … projekteigene Regeln
 *             },
 *         },
 *         bausteinAusnahme(),
 *         // … projekteigene Ausnahmen
 *     ];
 */
export const plugin = {
    rules: {
        'keine-palettenklassen': keinePalettenklassen,
    },
};

/**
 * `no-restyle` ist flottenweit aus.
 *
 * Die Regel meldet JEDES Umstylen einer shadcn-Komponente — auch ein
 * `className="mt-4"` an einem Button. Gemessen am 25.09.2026 mit
 * eingeschalteter Regel: 773 Befunde im kleinsten, 3983 im groessten Projekt.
 * Ein Waechter, der von Tag eins an rot ist, wird abgeschaltet.
 *
 * Eingrenzen wurde geprueft und verworfen. Die Regel kann es
 * (`allow: ['layout','spacing','shape','effects','motion']` laesst nur Farbe
 * und Typografie scharf, das sind 75-80 % weniger), aber was uebrig bleibt,
 * sind fast nur TOKEN-Farben:
 *
 *     "bg-muted" is not allowed on <AvatarFallback>: <AvatarFallback> owns its
 *     color. Add a variant in components/ui/avatar.tsx
 *
 * Die Regel verlangt dort keine andere Farbe — die kommt ja schon aus dem
 * Theme —, sondern eine eigene Variante in der Komponente. Ueber hunderte
 * Stellen ist das ein Architekturvorhaben, kein Linter-Fix.
 *
 * Einschalten also nur projektweise als eigenes Vorhaben, mit `contracts` je
 * Komponente. Siehe Task #6280.
 */
export const NO_RESTYLE_AUS = Object.freeze({
    'shadcn/no-restyle': 'off',
});

/**
 * Die shadcn-Bausteine duerfen sich selbst gestalten.
 *
 * Sie bringen Massangaben, dynamische Klassen und Inline-Styles von Haus aus
 * mit — das ist ihr Bauplan, nicht unsere Abweichung. Ohne diese Ausnahme
 * meldet jedes `npx shadcn add` neue Befunde, fuer die niemand etwas kann.
 *
 * `no-raw-colors` und `keine-palettenklassen` bleiben hier ABSICHTLICH scharf:
 * Eine rohe Farbe ist auch in einem Baustein eine rohe Farbe.
 *
 * @param {string} [glob] Abweichender Pfad, falls ein Projekt die Bausteine
 *   woanders fuehrt.
 */
export function bausteinAusnahme(glob = 'resources/js/components/ui/**/*.{ts,tsx}') {
    return {
        files: [glob],
        rules: {
            'shadcn/no-arbitrary-values': 'off',
            'shadcn/require-static-classes': 'off',
            'shadcn/no-inline-styles': 'off',
        },
    };
}
