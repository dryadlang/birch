# Operadores

## Aritméticos
Dryad implementa operadores padrão e estendidos.

### Básicos
- `+` (Adição / Concatenação de String)
- `-` (Subtração)
- `*` (Multiplicação)
- `/` (Divisão)
- `%` (Módulo - resto da divisão)

### Especiais
- `**` (Exponenciação): `2 ** 3` = 8.
- `%%` (Módulo Positivo): Garante resultado positivo mesmo para operandos negativos.
- `^^` (Raiz N-ésima): `27 ^^ (1/3)` = Raiz cúbica.
- `##` (Potência base 10): `1.5 ## 3` = $1.5 \times 10^3$.

## Comparação
- `==` (Igualdade frouxa ou estrita dependendo da implementação - **Nota**: Verificar semântica exata, atualmente compara valores `PartialEq`).
- `!=` (Diferença).
- `<`, `>`, `<=`, `>=`.

## Lógicos
- `&&` (AND): Curto-circuito. Retorna o primeiro operando falsy ou o último.
- `||` (OR): Curto-circuito. Retorna o primeiro operando truthy.
- `!` (NOT): Inverte o valor booleano.

## Bitwise
Operam em inteiros de 64-bit (convertidos de f64).
- `&` (AND), `|` (OR), `^` (XOR), `~` (NOT).
- `<<` (Left Shift).
- `>>` (Sign-propagating Right Shift).
- `>>>` (Zero-fill Right Shift).

## Precedência
A precedência segue o padrão da maioria das linguagens C-like, com `**` tendo precedência sobre multiplicação.
