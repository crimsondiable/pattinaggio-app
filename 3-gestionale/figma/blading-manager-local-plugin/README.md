# Blading Manager Local Figma Plugin

Questo plugin evita il limite MCP Figma: viene eseguito direttamente dal tuo Figma Desktop/Web come plugin locale di sviluppo.

## Uso

1. Apri il file Figma `Blading Manager Design System`.
2. Vai su `Plugins > Development > Import plugin from manifest...`.
3. Seleziona:
   `/Users/fra/AI/pattinaggio/3-gestionale/figma/blading-manager-local-plugin/manifest.json`
4. Esegui `Blading Manager Design System Bootstrap` da `Plugins > Development`.

## Cosa crea

- Pagine base: `Cover`, `Getting Started`, `Foundations`, `Components`, `Patterns`, `Layouts`, `Utilities`.
- Variabili locali per colori, radius e spacing.
- Text styles e shadow styles.
- Componenti per:
  - pip progresso `NAT/SW` presi da `/Users/fra/AI/skating-tricks/index.html`;
  - card compatta `Skating Trick` con stati glow `lv4`, `lv5`, `one-solid`, `both-solid`;
  - chip filtro e badge difficolta coerenti con la UI skating-tricks;
  - badge stadio `0..3`;
  - card `Aggressive Trick`.
- Pattern visuale `Skating Tricks NAT/SW progress`.
- Layout mobile `Skating Tricks` con header, chip, card e progressi NAT/SW.
