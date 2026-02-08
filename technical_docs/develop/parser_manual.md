# Manual Técnico: Parser (Analisador Sintático)

**Localização**: `crates/dryad_parser/`
**Responsável**: Transformar a lista de tokens em uma Árvore Sintática Abstrata (AST).

## 1. Arquitetura

O Parser implementa o algoritmo **Recursive Descent** (Descida Recursiva).
Cada regra gramatical da linguagem (function declaration, if statement, expression) tem um método correspondente no Parser.

```rust
pub struct Parser {
    tokens: Vec<TokenWithLocation>, // Lista completa de tokens pré-carregada
    position: usize,                // Índice do token atual
}
```

A decisão de pré-carregar todos os tokens (`Vec`) ao invés de consumir um stream (`Iterator`) simplifica operações de *lookahead* infinito e backtracking, embora consuma mais memória.

## 2. Estrutura da AST (`ast.rs`)

A AST é definida através de Enums do Rust, garantindo tipagem forte e pattern matching exaustivo.

### Hierarquia
- **Program**: Raiz (`Vec<Stmt>`)
- **Stmt** (Declarações):
    - `VarDeclaration`, `FunctionDeclaration`, `ClassDeclaration`
    - `If`, `While`, `Return`, `Block`, `ExpressionStmt`
- **Expr** (Expressões):
    - `Binary`, `Unary`, `Literal`, `Variable`
    - `Call`, `Get`, `Set` (Propriedades)
    - `Lambda`, `Await`, `Thread`

## 3. Fluxo de Parsing

### Statements (`statement()`)
O método `statement()` atua como um roteador principal e recursivo. Ele olha o token atual (`peek()`) para decidir qual método chamar:
- `let` -> `var_declaration()`
- `if` -> `if_statement()`
- `class` -> `class_declaration()`
- `{` -> `block_statement()` (Escopo aninhado)
- Outros -> `expression_statement()` (ex: chamada de função ou atribuição)

### Expressões e Precedência (`expression()`)
Para lidar com precedence sem uma tabela complexa, o parser estrutura as chamadas de método em camadas, da menor para a maior precedência.

**Cadeia de Chamadas:**
1.  `expression` (chama `assignment`)
2.  `assignment` (chama `logical_or`)
3.  `logical_or` (chama `logical_and`)
4.  ...
5.  `term` (`+`, `-`)
6.  `factor` (`*`, `/`, `%`)
7.  `unary` (`!`, `-`)
8.  `primary` (Literais, Grupos `()`)

Exemplo: Ao analisar `1 + 2 * 3`:
- `term()` vê `1`, depois `+`.
- Chama `factor()` para o lado direito.
- `factor()` consome `2 * 3` como uma unidade.
- Resultado: `(1 + (2 * 3))`, respeitando a precedência matemática.

## 4. Detalhes de Implementação Críticos

### Sincronização e Recuperação de Erro
Atualmente, o parser opera em modo "Panic". Ao encontrar um token inesperado:
1.  Gera um erro `dryad_errors::Parser`.
2.  Interrompe o processo imediatamente.
*(Futuro: Implementar sincronização pulando até o próximo `;` ou `}` para continuar parseando e relatar múltiplos erros).*

### Parsing de Atribuição (`assignment`)
Diferente de C/Java, onde atribuição é uma expressão comum, Dryad trata atribuição com cuidado especial para evitar ambiguidades com `==`.
- O parser verifica se o lado esquerdo é um "L-Value" válido (variável ou propriedade de objeto) antes de permitir a atribuição.

### Lambdas e Closures
Detectadas em `primary` ao encontrar `(params) =>` ou `param =>`.
- O parser converte a sintaxe de seta em um nó `Expr::Lambda` que captura o corpo como um `Block` ou `Expression`.

## 5. Códigos de Erro Específicos
O Parser emite erros da faixa `2xxx`.
- **2001 (UnexpectedToken)**: O erro mais comum. Esperava `X` mas encontrou `Y`.
- **2003 (MissingSemicolon)**: A função auxiliar `consume_semicolon()` impõe o uso de `;`.
- **2011 (InvalidVarName)**: Validação extra para nomes de variáveis.
