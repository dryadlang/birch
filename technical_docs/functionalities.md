# Funcionalidades Implementadas

Abaixo está a lista detalhada das funcionalidades implementadas na linguagem Dryad, com referência ao código fonte.

Legenda:
- **[implementado]**: Funcionalidade completa.
- **[parcialmente]**: Funcionalidade presente, mas com limitações conhecidas.
- **[planejado]**: Funcionalidade futura (não listada aqui, focando no código existente).

## Checklist

### Declarações e Variáveis

| Estado | Nome | Documento:Linha | Descrição | Sintaxe |
| :--- | :--- | :--- | :--- | :--- |
| **[implementado]** | `VarDeclaration` | `ast.rs:7`, `parser.rs:256` | Declaração de variável mutável. | `var nome = valor;` |
| **[implementado]** | `ConstDeclaration` | `ast.rs:8`, `parser.rs:276` | Declaração de constante imutável. | `const NOME = valor;` |
| **[implementado]** | `Assignment` | `ast.rs:9`, `parser.rs:321` | Atribuição de valor a variável existente. | `nome = valor;` |

### Controle de Fluxo

| Estado | Nome | Documento:Linha | Descrição | Sintaxe |
| :--- | :--- | :--- | :--- | :--- |
| **[implementado]** | `If` / `IfElse` | `ast.rs:13-14` | Estrutura condicional. | `if (cond) { ... } else { ... }` |
| **[implementado]** | `While` | `ast.rs:15`, `parser.rs:988` | Loop enquanto condição for verdadeira. | `while (cond) { ... }` |
| **[implementado]** | `DoWhile` | `ast.rs:16`, `parser.rs:1024` | Loop com verificação no final. | `do { ... } while (cond);` |
| **[implementado]** | `For` | `ast.rs:17`, `parser.rs:1100` | Loop tradicional estilo C. | `for (init; cond; inc) { ... }` |
| **[implementado]** | `ForEach` | `ast.rs:18` | Iteração sobre coleções. | `for (item in colecao) { ... }` |
| **[implementado]** | `Break` | `ast.rs:19`, `parser.rs:1076` | Interrompe o loop atual. | `break;` |
| **[implementado]** | `Continue` | `ast.rs:20`, `parser.rs:1088` | Pula para a próxima iteração. | `continue;` |
| **[implementado]** | `Return` | `ast.rs:30` | Retorna valor de uma função. | `return valor;` |

### Funções

| Estado | Nome | Documento:Linha | Descrição | Sintaxe |
| :--- | :--- | :--- | :--- | :--- |
| **[implementado]** | `FunctionDeclaration` | `ast.rs:23` | Função nomeada padrão. | `function nome() { ... }` |
| **[implementado]** | `AsyncFunction` | `ast.rs:24` | Função assíncrona. | `async function nome() { ... }` |
| **[implementado]** | `ThreadFunction` | `ast.rs:25` | Função executada em nova thread. | `thread function nome() { ... }` |
| **[implementado]** | `Lambda` | `ast.rs:56` | Função anônima (arrow function). | `(args) => expr` |

### Orientação a Objetos

| Estado | Nome | Documento:Linha | Descrição | Sintaxe |
| :--- | :--- | :--- | :--- | :--- |
| **[implementado]** | `ClassDeclaration` | `ast.rs:26` | Definição de classe com herança opcional. | `class Nome extends Pai { ... }` |
| **[implementado]** | `Method` | `ast.rs:89` | Método de instância ou estático. | `metodo() { ... }` ou `static metodo() { ... }` |
| **[implementado]** | `Property` | `ast.rs:91` | Propriedade de classe. | `prop = valor;` |
| **[implementado]** | `ClassInstantiation` | `ast.rs:61` | Criação de instância. | `NomeClasse()` ou `new NomeClasse()` |
| **[parcialmente]** | `Super` | `ast.rs:58` | Acesso à superclasse (parser ok, runtime pendente). | `super` |
| **[implementado]** | `This` | `ast.rs:57` | Referência à instância atual. | `this` |

### Módulos

| Estado | Nome | Documento:Linha | Descrição | Sintaxe |
| :--- | :--- | :--- | :--- | :--- |
| **[implementado]** | `Import` | `ast.rs:29` | Importação de módulo (ES6 style). | `import { ... } from "mod"` |
| **[implementado]** | `Export` | `ast.rs:27` | Exportação de símbolos. | `export ...` |
| **[implementado]** | `Use` | `ast.rs:28` | Importação simplificada/legada. | `use "arquivo"` |
| **[implementado]** | `NativeDirective` | `ast.rs:31` | Importação de módulos nativos do runtime. | `#modulo` |

### Tratamento de Erros

| Estado | Nome | Documento:Linha | Descrição | Sintaxe |
| :--- | :--- | :--- | :--- | :--- |
| **[implementado]** | `Try/Catch` | `ast.rs:21` | Bloco de captura de exceções. | `try { ... } catch (e) { ... }` |
| **[implementado]** | `Throw` | `ast.rs:22` | Lançamento de exceção. | `throw "erro";` |

### Concorrência e Assincronia

| Estado | Nome | Documento:Linha | Descrição | Sintaxe |
| :--- | :--- | :--- | :--- | :--- |
| **[implementado]** | `Await` | `ast.rs:63`, `interpreter.rs` | Aguarda promessa/função async. | `await expr` |
| **[implementado]** | `ThreadCall` | `ast.rs:64` | Chamada de função em thread. | `thread(func, args)` |
| **[implementado]** | `Mutex` | `ast.rs:65` | Criação de mutex para sincronização. | `mutex()` |
