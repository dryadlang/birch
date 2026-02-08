# Funções

## Sintaxe

### Declaração Padrão
```dryad
function soma(a, b) {
    return a + b;
}
```

### Funções Anônimas (Lambda)
```dryad
let dobro = (n) => n * 2;
```
**Implementação**: Lambdas capturam o ambiente (variáveis) onde foram criadas (`closure`).

### Funções Assíncronas (`async`)
```dryad
async function tarefa() {
    await carregar();
}
```
**Implementação**: Marca na AST que a função deve ser executada em um contexto assíncrono (Promise).

### Funções de Thread (`thread`)
```dryad
thread function paralela() {
    // ...
}
```
**Implementação**: Dispara uma nova `std::thread::spawn` no sistema operacional. O interpretador clona o estado necessário para isolamento.

## Passagem de Parâmetros
Dryad utiliza passagem por valor para primitivos e **referência** para objetos/arrays (devido ao modelo de memória Rust `Rc<RefCell>` ou similar).

## Retorno
Se nenhum `return` for encontrado, a função retorna `null` implicitamente.
