# Gerenciamento de Pacotes e Módulos

O sistema de gerenciamento de pacotes da Dryad foi refatorado para ser desacoplado do Runtime, permitindo flexibilidade e suporte a múltiplos gerenciadores de pacotes através de um padrão de Adapter.

## Arquitetura de Resolução de Módulos

O núcleo da resolução de módulos reside no trait `ModuleResolver` dentro do `dryad_runtime`. O interpretador não possui conhecimento sobre *como* os pacotes são instalados ou onde estão localizados, apenas solicita a resolução de um caminho de módulo.

### Trait `ModuleResolver`

Localizado em `crates/dryad_runtime/src/resolver.rs`:

```rust
pub trait ModuleResolver: Send + Sync {
    /// Resolve o caminho de importação para um caminho físico no sistema de arquivos
    /// 
    /// # Argumentos
    /// * `module_path` - O caminho ou alias do módulo a ser importado (ex: "./foo", "pkg/mod")
    /// * `current_path` - O caminho do arquivo atual que está fazendo a importação (se houver)
    fn resolve(&self, module_path: &str, current_path: Option<&Path>) -> Result<PathBuf, DryadError>;
}
```

### Implementações Padrão

O runtime fornece uma implementação padrão:
- **`FileSystemResolver`**: Resolve apenas caminhos relativos (`./`, `../`) e absolutos do projeto (`@/`). É agnóstico a gerenciadores de pacotes.

## Adaptadores de Pacotes (`Package Adapters`)

Para integrar com gerenciadores de pacotes específicos (como Oak, NPM, Cargo), deve-se implementar o trait `ModuleResolver`.

### Oak Adapter (`OakModuleResolver`)

Localizado em `crates/dryad_cli/src/oak_adapter.rs`.

Este adaptador permite que a Dryad utilize o gerenciador de pacotes Oak. Ele:
1.  Lê o arquivo `oaklock.json` na raiz do projeto.
2.  Interpreta os aliases de pacotes (ex: `matematica-utils/matematica`).
3.  Mapeia os aliases para os caminhos físicos dos arquivos instalados dentro de `oak_modules/` (ou onde estiver configurado).

## Integração na CLI

A CLI (`dryad_cli`) é responsável por instanciar o `Interpreter` e configurar o resolver apropriado.

No `crates/dryad_cli/src/main.rs`:
```rust
let mut interpreter = Interpreter::new();

// Configura o resolver para usar o adaptador do Oak
interpreter.set_resolver(Box::new(OakModuleResolver));
```

Isso permite que a CLI suporte diferentes modos ou configurações de projeto no futuro, simplesmente trocando a implementação do resolver injetada no interpretador.
