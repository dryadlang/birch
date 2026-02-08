# Lógica para Validador Sintático (IDE)

Este documento descreve a lógica para implementar um validador sintático e semântico leve para a linguagem Dryad, visando o uso em IDEs e ferramentas de linter.

## Objetivo
Fornecer feedback rápido ao desenvolvedor sobre erros de sintaxe e potenciais problemas lógicos sem executar o código.

## Estrutura do Validador

O validador deve operar em três fases:

1.  **Análise Léxica (Tokenização)**
2.  **Análise Sintática (Parsing Resiliente)**
3.  **Análise Semântica Estática (Scope Analysis)**

### 1. Tokenização Resiliente

*   **Entrada**: Código fonte (String).
*   **Processo**: Utilizar o `dryad_lexer` existente.
*   **Tratamento de Erro**:
    *   Ao encontrar um caractere inválido, registrar o erro (ex: código 1001) e continuar a tokenização a partir do próximo caractere válido.
    *   Não abortar o processo.
*   **Saída**: Lista de `TokenWithLocation` e lista de `DryadError` (léxicos).

### 2. Parsing Resiliente (Recovery Mode)

O parser atual (`dryad_parser`) deve ser adaptado ou encapsulado para não parar no primeiro erro.

*   **Estratégia de Recuperação (Panic Mode / Sync)**:
    *   Ao encontrar um token inesperado dentro de um bloco (ex: `function`), descartar tokens até encontrar um ponto de sincronização seguro (ex: `;`, `{`, `}`).
    *   Registrar o erro (ex: código 2001) e tentar continuar o parsing da próxima declaração.
*   **Parênteses/Chaves Desbalanceados**:
    *   Manter uma pilha de delimitadores abertos. Se chegar ao EOF com a pilha não vazia, reportar erro de fechamento ausente (código 2005).

### 3. Análise Semântica (Simulação de Escopo)

Percorrer a AST gerada (mesmo que parcial) para verificar regras de escopo sem executar o código.

#### Tabela de Símbolos
Manter uma estrutura de `Scope` (pilha de HashMaps) durante a travessia da AST.

*   **Entrada no Bloco**: Empilhar novo escopo.
*   **Saída do Bloco**: Desempilhar escopo.
*   **Declaração (`var`, `const`, `function`, `class`)**:
    *   Adicionar nome ao escopo atual.
    *   **Erro**: Se nome já existe no escopo atual -> *Redeclaração inválida*.
*   **Uso de Variável (`Identifier`)**:
    *   Procurar na pilha de escopos (do topo para a base).
    *   **Erro**: Se não encontrado -> *Variável não definida* (código 3001, detectado estaticamente).

#### Verificações Adicionais (Linting)

1.  **Variáveis Não Usadas**:
    *   Ao declarar variável, marcá-la como `unused`.
    *   Ao usar variável, marcar como `used`.
    *   Ao sair do escopo, reportar *Warning* para variáveis `unused` (código 8001).
2.  **Break/Continue Fora de Loop**:
    *   Manter flag `inside_loop` durante a travessia.
    *   Se encontrar `break` ou `continue` quando `inside_loop` é falso -> *Erro código 3010/3011*.
3.  **Return Fora de Função**:
    *   Manter flag `inside_function`.
    *   Se encontrar `return` quando `inside_function` é falso -> *Erro código 3021*.

## Integração com IDE (LSP - Language Server Protocol)

O validador deve expor uma função que recebe o texto do arquivo e retorna uma lista de diagnósticos:

```rust
struct Diagnostic {
    range: Range, // Linha/Coluna inicial e final
    severity: Error | Warning,
    code: u16,
    message: String,
    suggestions: Vec<String> // Para quick-fixes
}

fn validate(source: &str) -> Vec<Diagnostic> {
    let mut diagnostics = Vec::new();
    // 1. Lexer errors
    // 2. Parser errors
    // 3. Semantic errors
    return diagnostics;
}
```
