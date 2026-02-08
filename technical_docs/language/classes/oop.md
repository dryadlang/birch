# Orientação a Objetos

## Classes
Dryad suporta programação orientada a objetos baseada em classes, similar a JavaScript (ES6+).

### Declaração
```dryad
class Animal {
    idade = 0; // Propriedade pública com valor inicial

    constructor(nome) {
        this.nome = nome;
    }

    falar() {
        println("Som genérico");
    }
}
```

**Implementação Técnica**:
A classe é um valor de primeira classe (`Value::Class`) armazenado como variável. Ele contém definições de métodos e inicializadores de propriedades.

### Instanciação
```dryad
let dog = new Animal("Rex");
```
O operador `new`:
1.  Cria uma nova instância (`Value::Instance`).
2.  Copia propriedades e valores padrão da classe.
3.  Chama o método `constructor` (se existir).

## Herança (`extends`)
```dryad
class Cachorro extends Animal {
    falar() {
        println("Au Au!");
    }
}
```
**Implementação**:
A classe filha mantém uma referência à classe pai. Métodos não encontrados na filha são buscados na cadeia de protótipos (pai).

### `super`
Permite chamar o construtor da classe pai.
**Nota**: Chamada de métodos da superclasse (`super.metodo()`) ainda está em implementação parcial.

### `this`
Referência à instância atual. Em métodos de classe, é injetado automaticamente pelo interpretador.
