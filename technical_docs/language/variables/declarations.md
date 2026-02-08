# Variáveis e Escopo

## Declaração
A linguagem Dryad suporta dois tipos de declaração de variáveis: mutáveis (`let`) e imutáveis (`const`).

### `let`
Declara uma variável mutável no escopo atual. Variáveis não inicializadas recebem o valor `null`.

```dryad
let x = 10;
x = 20; // Permitido
let y;  // y é null
```

**Implementação Técnica**:
No interpretador, `let` insere uma entrada no `HashMap` de variáveis do ambiente atual (`environment`).

### `const`
Declara uma constante. O valor deve ser atribuído na declaração e não pode ser reatribuído.

```dryad
const PI = 3.14159;
PI = 3.14; // Erro de Runtime
```

**Implementação Técnica**:
Constantes são armazenadas em um `HashMap` separado ou com uma flag de imutabilidade. Tentativas de reatribuição são verificadas em tempo de execução.

## Escopo (Scope)
Dryad utiliza **Escopo de Bloco** (Block Scope). Variáveis declaradas dentro de `{ ... }` (if, while, for, funções) não são visíveis fora dele.

```dryad
{
    let local = "visível apenas aqui";
}
// println(local); // Erro: Variável não definida
```

**Implementação Técnica**:
O interpretador implementa escopo através de uma cadeia de ambientes (Environment Chain). Ao entrar em um bloco, um novo ambiente é criado apontando para o ambiente pai. Ao sair, o ambiente é descartado.
