# Guia de Sintaxe da Linguagem Dryad

Este documento serve como referência definitiva para a sintaxe da linguagem Dryad, detalhando regras gramaticais, estruturas de controle e convenções.

## 1. Estrutura Léxica

### Comentários
*   **Linha**: `// ...` até o fim da linha.
*   **Bloco**: `/* ... */`, não aninháveis.

### Identificadores
*   Devem começar com `a-z`, `A-Z` ou `_`.
*   Podem conter números após o primeiro caractere.
*   Case-sensitive (`minhaVar` != `minhavar`).

### Palavras Reservadas
`let`, `const`, `if`, `else`, `while`, `do`, `for`, `break`, `continue`, `return`, `function`, `class`, `extends`, `static`, `this`, `super`, `import`, `export`, `from`, `as`, `try`, `catch`, `finally`, `throw`, `async`, `await`, `thread`, `mutex`.

## 2. Tipos e Literais

| Tipo | Exemplo | Notas |
| :--- | :--- | :--- |
| **Number** | `10`, `3.14`, `0xFF` | 64-bit float IEEE 754. Suporta Hex (`0x`), Bin (`0b`), Oct (`0o`). |
| **String** | `"Olá"`, `'Mundo'` | Unicode (UTF-8). Escapes: `\n`, `\t`, `\uXXXX`. |
| **Boolean** | `true`, `false` | |
| **Null** | `null` | Valor de ausência intencional. |
| **Array** | `[1, 2, "a"]` | Lista dinâmica indexada por zero. |
| **Tuple** | `(1, true)` | Sequência imutável de tamanho fixo. |
| **Object** | `{ k: "v" }` | Coleção chave-valor (chaves são strings). |

## 3. Variáveis e Escopo

### Declaração
*   `let x = 10;` (Mutável, escopo de bloco)
*   `const PI = 3.14;` (Imutável, escopo de bloco, requer inicialização)
*   Variáveis não inicializadas (`let x;`) têm valor `null`.

### Escopo
Dryad utiliza escopo léxico (estático) de bloco. Variáveis declaradas dentro de `{ ... }` não são visíveis fora.

## 4. Operadores e Precedência

Da maior para a menor precedência:

1.  **Acesso/Chamada**: `.` (ponto), `[]`, `()`
2.  **Unário**: `!`, `-`, `++`, `--`
3.  **Potência**: `**` (direita para esquerda)
4.  **Multiplicativo**: `*`, `/`, `%`
5.  **Aditivo**: `+`, `-`
6.  **Shift**: `<<`, `>>`, `<<<`, `>>>`
7.  **Relacional**: `<`, `<=`, `>`, `>=`
8.  **Igualdade**: `==`, `!=`
9.  **Bitwise AND**: `&`
10. **Bitwise XOR**: `^`
11. **Bitwise OR**: `|`
12. **Lógico AND**: `&&`
13. **Lógico OR**: `||`
14. **Atribuição**: `=`, `+=`, `-=`, etc.

## 5. Controle de Fluxo

### Condicional
```javascript
if (x > 0) { ... } else if (x < 0) { ... } else { ... }
```

### Loops
```javascript
while (cond) { ... }
do { ... } while (cond);
for (let i = 0; i < 10; i++) { ... }
for (item in colecao) { ... } // Itera sobre valores
```

## 6. Funções

### Declaração
```javascript
function soma(a, b) {
    return a + b;
}
```

### Lambdas (Arrow Functions)
```javascript
let dobro = (x) => x * 2;
let soma = (a, b) => { return a + b; };
```
*Nota: Lambdas capturam o `this` do contexto léxico (closure).*

### Async / Await
```javascript
async function buscar() {
    let dados = await fetch("url");
    return dados;
}
```

## 7. Classes e Objetos

```javascript
class Retangulo {
    largura = 0;
    altura = 0;

    area() {
        return this.largura * this.altura;
    }

    static criarQuadrado(lado) {
        let r = new Retangulo(); // 'new' opcional
        r.largura = lado;
        r.altura = lado;
        return r;
    }
}
```

## 8. Módulos

*   **Import**: `import { x } from "mod";` ou `import * as m from "mod";`
*   **Export**: `export function f() { ... }`

## 9. Diretivas Nativas
Uso especial para injetar módulos do runtime Rust:
```javascript
#console_io
#file_io
```
