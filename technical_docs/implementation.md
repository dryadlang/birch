# Implementação Técnica da Linguagem Dryad

## Visão Geral da Arquitetura

A implementação da Dryad segue uma arquitetura clássica de interpretador "tree-walking" (execução direta da AST), dividida em quatro componentes principais contidos no diretório `crates`:

1.  **Lexer (`dryad_lexer`)**: Análise léxica. [Ver Manual Detalhado](./develop/lexer_manual.md)
2.  **Parser (`dryad_parser`)**: Análise sintática e geração da AST. [Ver Manual Detalhado](./develop/parser_manual.md)
3.  **Runtime (`dryad_runtime`)**: Execução (Interpreter) e definições de valores. [Ver Manual Detalhado](./develop/runtime_manual.md)
4.  **Errors (`dryad_errors`)**: Sistema centralizado de reporte de erros. [Ver Manual Detalhado](./develop/errors_manual.md)

## 1. Analisador Léxico (Lexer)

*   **Localização**: `crates/dryad_lexer/src/lexer.rs`
*   **Funcionamento**: Itera sobre a string de entrada caractere a caractere.
*   **Tokens**: Definidos em `token.rs`, carregam informações de localização (`SourceLocation`).
*   **Destaques**:
    *   Suporte a strings interpoladas (potencialmente, dada a complexidade do lexer).
    *   Reconhecimento de diretivas de pré-processamento/nativas (`#`).

## 2. Analisador Sintático (Parser)

*   **Localização**: `crates/dryad_parser/src/parser.rs`
*   **Algoritmo**: Descida Recursiva (Recursive Descent).
*   **Estrutura**:
    *   Cada regra gramatical corresponde a um método no parser (ex: `parse_statement`, `parse_expression`).
    *   Utiliza precedência de operadores (Pratt Parsing ou precedência padrão em métodos como `term`, `factor`, `unary`).
*   **Saída**: Gera uma Árvore Sintática Abstrata (AST) definida em `ast.rs`.
*   **Recuperação de Erro**: O parser reporta erros com códigos específicos e tenta fornecer contexto (tokens esperados vs encontrados).

## 3. Abstract Syntax Tree (AST)

*   **Localização**: `crates/dryad_parser/src/ast.rs`
*   **Design**: Baseado em Enums do Rust (`Stmt` para declarações, `Expr` para expressões).
*   **Características**:
    *   Fortemente tipado (graças ao Rust).
    *   Cada nó carrega sua `SourceLocation` para rastreamento de erros em tempo de execução.

## 4. Runtime e Interpretador

*   **Localização**: `crates/dryad_runtime/src/interpreter.rs`
*   **Execução**:
    *   O `Interpreter` percorre a AST recursivamente (`execute_statement`, `evaluate`).
    *   Gerencia escopos de variáveis (provavelmente usando um `Environment` ou `HashMap`).
*   **Sistema de Tipos (`Value`)**:
    *   Dinâmico.
    *   Tipos suportados: `Number`, `String`, `Bool`, `Null`, `Array`, `Tuple`, `Function`, `Instance`, `Object`.
*   **Funções Nativas**:
    *   `native_functions.rs` mapeia chamadas de código Dryad para funções Rust.
*   **Concorrência**:
    *   Implementa `async/await` no nível da linguagem.
    *   Suporte a Threads reais via `eval_thread_call`.

## 5. Gerenciamento de Erros

*   **Localização**: `crates/dryad_errors`
*   **Design**:
    *   Enum central `DryadError` cobrindo todas as fases (Lexer, Parser, Runtime).
    *   Códigos numéricos (ex: E1001, E2001) para fácil referência.
    *   Geração de URLs de documentação automática baseada no código do erro.
