# Visão Geral da Arquitetura

Este documento fornece uma visão de alto nível da implementação do interpretador Dryad.

## Componentes Principais

O projeto é dividido em *crates* Rust independentes para facilitar a manutenção e reutilização.

### 1. Dryad Lexer (`dryad_lexer`)
Responsável por transformar o código fonte em tokens.
- **Entrada**: String ou Stream de caracteres.
- **Saída**: `Vec<TokenWithLocation>`.
- **Destaque**: Preserva números de linha/coluna para erros precisos.

### 2. Dryad Parser (`dryad_parser`)
Consome tokens e produz a Árvore Sintática Abstrata (AST).
- **Algoritmo**: Recursive Descent.
- **Saída**: `Program { statements: Vec<Stmt> }`.
- **Destaque**: Tratamento robusto de precedência de operadores.

### 3. Dryad Runtime (`dryad_runtime`)
Executa a AST.
- **Modelo**: Tree-Walking Interpreter.
- **Estado**: Mantém HashMaps para Variáveis, Constantes, Classes e Funções.
- **Destaque**: Suporte a Threads nativas do SO e integração FFI com Rust.

### 4. Dryad Errors (`dryad_errors`)
Sistema unificado de tratamento de erros.
- **Destaque**: Formatação rica com cores e trechos de código.

### 5. Gerenciamento de Pacotes (Adapters)
Sistema desacoplado para resolução de módulos.
- **`ModuleResolver`**: Trait no runtime que abstrai a localização de arquivos.
- **`OakAdapter`**: Implementação na CLI que conecta o runtime ao gerenciador de pacotes Oak (`oaklock.json`).

## Fluxo de Execução

1.  **Leitura**: O arquivo `.dryad` é lido para memória (`String`).
2.  **Lexing**: `Lexer::new(source)` gera lista de tokens.
3.  **Parsing**: `Parser::new(tokens)` constrói a AST.
4.  **Interpretação**: `Interpreter::new()` executa a AST.
    - Se houver erro em qualquer etapa, o processo é abortado e o erro formatado é exibido no stderr.

## Estrutura de Diretórios
```
crates/
├── dryad_cli/        # Interface de Linha de Comando (entry point)
├── dryad_lexer/
├── dryad_parser/
├── dryad_runtime/
├── dryad_errors/
└── dryad_benchmark/  # Testes de performance
```
