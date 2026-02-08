# Sintaxe Real da Linguagem Dryad

Este documento descreve a sintaxe *real* da linguagem Dryad, conforme implementada no analisador léxico (`dryad_lexer`) e sintático (`dryad_parser`).

## 1. Comentários

*   **Linha única**: `// comentário`
*   **Bloco**: `/* comentário */`

## 2. Declaração de Variáveis

O parser suporta `var` (implícito no AST como `VarDeclaration`) e `const`.

```javascript
// Variável mutável
var x = 10;
var y; // Inicialização opcional

// Constante (valor obrigatório)
const PI = 3.14159;
```

## 3. Tipos de Dados e Literais

*   **Números**: Inteiros e flutuantes (`10`, `3.14`).
*   **Strings**: Aspas duplas (`"texto"`).
*   **Booleanos**: `true`, `false`.
*   **Nulo**: `null`.
*   **Arrays**: `[1, 2, 3]`.
*   **Tuplas**: `(1, "dois", true)`.
*   **Objetos Literais**: `{ chave: "valor", metodo() { ... } }`.

## 4. Estruturas de Controle

### Condicionais

```javascript
if (condicao) {
    // bloco
} else if (outra_condicao) {
    // bloco
} else {
    // bloco
}
```

### Loops

**While**
```javascript
while (condicao) {
    // corpo
}
```

**Do-While**
```javascript
do {
    // corpo
} while (condicao);
```

**For**
```javascript
for (var i = 0; i < 10; i++) {
    // corpo
}
```

**ForEach**
```javascript
for (item in lista) {
    // corpo
}
```

### Controle de Fluxo
*   `break;`
*   `continue;`
*   `return [expressão];`

## 5. Tratamento de Erros

```javascript
try {
    // código perigoso
} catch (erro) {
    // tratamento
} finally {
    // limpeza (opcional)
}

// Lançar exceção
throw "Mensagem de erro";
```

## 6. Funções

### Declaração Padrão
```javascript
function soma(a, b) {
    return a + b;
}
```

### Funções Assíncronas
```javascript
async function carregarDados() {
    await tarefa();
}
```

### Lambdas (Arrow Functions)
```javascript
(x) => x * 2
(a, b) => { return a + b; }
```

### Funções de Thread
```javascript
thread function tarefaPesada() {
    // Executa em outra thread
}
```
*(Também acessível via `thread(func, args...)`)*

## 7. Classes

Suporte a herança, métodos estáticos e propriedades.

```javascript
class Animal {
    // Propriedade
    nome = "Sem nome";

    // Construtor implícito, mas métodos podem inicializar
    
    falar() {
        print("Som genérico");
    }
}

class Cachorro extends Animal {
    static criar() {
        return new Cachorro();
    }
    
    async latir() {
        print("Au au!");
    }
}
```

## 8. Módulos

### Importação
```javascript
import { item1, item2 } from "modulo";
import * as utils from "utils";
import "init_script";

// Sintaxe alternativa/legada
use "caminho/para/arquivo";
```

### Exportação
```javascript
export function util() { ... }
export class MinhaClasse { ... }
```

### Diretivas Nativas
```javascript
#console_io
#http
```

## 9. Operadores

*   **Aritméticos**: `+`, `-`, `*`, `/`, `%`
*   **Lógicos**: `&&`, `||`, `!`
*   **Comparação**: `==`, `!=`, `<`, `>`, `<=`, `>=`
*   **Bitwise**: `&`, `|`, `^`, `<<`, `>>`
*   **Atribuição**: `=`, `+=`, `-=`, etc.
*   **Unários (Incremento/Decremento)**: `++`, `--`

## 10. Concorrência

Além de `async/await` e `thread function`, existe suporte a mutexes:

```javascript
var m = mutex();
```
