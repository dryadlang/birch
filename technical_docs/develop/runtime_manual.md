# Manual Técnico: Runtime (Interpretador)

**Localização**: `crates/dryad_runtime/`
**Responsável**: Executar a AST, gerenciar memória, escopo e interagir com o sistema operacional.

## 1. Estrutura do Interpretador

O `Interpreter` é a máquina virtual da linguagem. Ele mantém o estado global e local da execução.

```rust
pub struct Interpreter {
    // Memória / Estado
    variables: HashMap<String, Value>,      // Escopo de variáveis (Stack Frame atual)
    constants: HashMap<String, Value>,      // Constantes globais/locais
    classes: HashMap<String, Value>,        // Definições de classes carregadas
    
    // Contexto de Execução
    current_instance: Option<Value>,        // 'this' para métodos de classe
    current_stack_trace: StackTrace,        // Rastreamento de chamadas para debug
    
    // Concorrência e IO
    threads: HashMap<u64, JoinHandle...>,   // Handles de threads OS
    mutexes: HashMap<u64, Arc<Mutex<()>>>,  // Primitivas de sincronização
    native_modules: NativeModuleManager,    // Ponte para código Rust (FFI)
    
    // Resolução de Módulos
    resolver: Box<dyn ModuleResolver>,      // Abstração para carregar módulos (File System, Oak, etc)
}
```

## 2. Sistema de Tipos (`Value`)

A linguagem é dinamicamente tipada. Todos os valores são variantes do enum `Value` (Clone-on-Write para strings/vecs onde possível).

- **Primitivos**: `Number` (f64), `String`, `Bool`, `Null`.
- **Compostos**: `Array(Vec<Value>)`, `Object(HashMap<String, Value>)`.
- **Executáveis**: `Function`, `Lambda`, `Class`.
- **Internos**: `NativeFunction`, `Future` (para async).

## 3. Gerenciamento de Memória e Escopo
Dryad utiliza um sistema de escopo léxico simulado através de HashMaps.

### Stack Frames
A cada chamada de função:
1.  Os valores atuais de `variables` são salvos (clonados).
2.  Um novo escopo vazio é criado.
3.  Argumentos são inseridos no novo escopo.
4.  Após o retorno, o escopo anterior é restaurado.
*(Nota: Isso é ineficiente para recursão profunda. Uma otimização futura seria usar uma lista ligada de Scopes).*

### Garbage Collection
Atualmente, o Rust gerencia a memória dos valores `Value` usando RAII (Resource Acquisition Is Initialization) e `Arc` (Atomic Reference Counting) para estruturas compartilhadas. Não há um ciclo de GC separado ("Stop-the-world"), o que garante latência previsível mas pode causar leaks em ciclos de referência.

## 4. Módulos Nativos e FFI

O sistema de módulos nativos (`native_modules`) permite estender a linguagem com Rust.
- **Carregamento**: Sob demanda via diretiva `#<categoria>`.
- **Registro**: O `NativeModuleManager` mantém um mapa de funções `fn(&[Value]) -> Result<Value, Error>`.
- **Segurança**: Funções nativas operam em "Sandbox" lógica, acessando apenas o que é passado como argumento (exceto IO).

## 5. Resolução de Módulos (`ModuleResolver`)

O Runtime delega a localização de arquivos importados para um `resolver`.
- **Desacoplamento**: O runtime não sabe sobre `node_modules`, `oak_modules` ou `Cargo.toml`.
- **Interface**: O trait `ModuleResolver` recebe uma string (caminho/alias) e retorna um `PathBuf` absoluto.
- **Implementação Padrão**: `FileSystemResolver` (arquivos locais apenas).
- **Extensibilidade**: A CLI injeta adaptadores mais complexos (como o `OakAdapter`) na inicialização do interpretador.

## 6. Concorrência

Dryad implementa concorrência real (Threads do SO) e Assincronia.
- **Threads**: `thread function` gera `std::thread::spawn`. O interpretador clona o estado necessário para a nova thread (evitando condições de corrida globais por design, já que não há memória compartilhada implícita, apenas via Mutex/Mensagens).
- **Async/Await**: Suporte sintático. O runtime executa Promises (Futures) de forma síncrona ou em pool de threads dependendo da implementação da lib nativa subjacente.

## 7. Tratamento de Erros de Runtime

Erros gerados durante a execução (`3xxx`) interrompem o fluxo atual.
- **Stack Trace**: O interpretador anexa automaticamente a pilha de chamadas ao erro.
- **Pânico Controlado**: Diferente de C++, exceções de runtime na Dryad são valores de retorno `Err` no Rust, garantindo que o interpretador (host) nunca crashe, apenas reporte o erro do script (guest).
