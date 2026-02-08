# Controle de Fluxo

## Condicionais

### `if` / `else`
Avalia a expressão para `bool`. Valores não-bool são convertidos implicitamente (truthy/falsy).
- **Truthy**: `true`, números != 0, strings não vazias, objetos.
- **Falsy**: `false`, `0`, `""`, `null`.

**Atenção**: Parênteses `(cond)` são obrigatórios conforme padrão C.

## Loops

### `while`
Repete o bloco enquanto a condição for verdadeira. Verificado antes da execução.

### `do-while`
Executa o bloco pelo menos uma vez antes de verificar a condição.

### `for` (Estilo C)
`for (init; cond; update) { ... }`
- **Init**: Declaração de variável (escopo do loop).
- **Cond**: Verificada antes de cada iteração.
- **Update**: Executado após cada iteração.

### `for-in` (Iteração)
`for (item in iterable) { ... }` (Implementado parcialmente para Arrays).

## Estrutura de Retorno

### `break` / `continue`
Interrompem ou pulam a iteração atual.
**Implementação**: No runtime, são tratados como valores de retorno especiais (`Result::Break`, `Result::Continue`) que propagam até o loop mais próximo.

### `return`
Sai da função atual.
**Implementação**: Retorna um valor especial encapsulado em `Exception` ou `Result` que é capturado pelo interpretador da função.
