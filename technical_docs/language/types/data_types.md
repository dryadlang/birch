# Tipos de Dados

A linguagem Dryad é **dinamicamente tipada**. Todos os valores em memória são representados pela enum `Value` do interpretador.

## Tipos Primitivos

### `Number`
Representado internamente como `f64` (Float 64-bit IEEE 754).
- Suporta notação científica: `1e5`
- Suporta Hex/Bin/Oct: `0xFF`, `0b1010`, `0o77`

### `String`
Texto UTF-8 imutável.
- Escapes comuns: `\n`, `\t`, `\"`
- Suporta Unicode: `\uFFFF`

### `Bool`
Valores lógicos `true` e `false`.

### `Null`
Representa a ausência intencional de valor ou variável não inicializada.

## Tipos Compostos (Ref)

### `Array`
Lista dinâmica heterogênea baseada em `Vec<Value>`.
- Acesso por índice: `arr[0]`
- Tamanho dinâmico (não-fixo).

### `Object`
Coleção chave-valor (Dictionary/Map) implementada com `HashMap<String, Value>`.
- Chaves devem ser strings.
- Valores podem ser de qualquer tipo.

### `Tuple`
Sequência imutável de tamanho fixo `Vec<Value>`.
- Sintaxe: `(a, b)`
- Semelhante a array, mas semanticamente diferente.

## Tipos Internos (Runtime)

### `Function` / `Lambda`
Armazena a definição da função (AST) e, no caso de lambdas, o contexto de encerramento (`closure`).

### `Class` / `Instance`
Define metadados da classe e armazena propriedades da instância.

### `Thread` / `Mutex`
Handles opacos para recursos do sistema operacional (`std::thread`, `std::sync::Mutex`).
