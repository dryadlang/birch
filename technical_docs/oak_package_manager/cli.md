# Oak CLI Reference

Oak é o gerenciador de pacotes oficial da linguagem Dryad. Ele gerencia dependências, scripts e a estrutura de projetos.

## Instalação

O Oak é distribuído junto com o toolchain da Dryad.

```bash
# Verificar instalação
oak --help
```

## Comandos

### `init`

Inicializa um novo projeto Dryad.

```bash
oak init <nome_do_projeto> [--type=project|library]
```

- `--type`: Define se é um projeto executável (`project`, padrão) ou uma biblioteca reutilizável (`library`).

### `install`

Baixa e instala dependências do Registry.

```bash
# Instalar um pacote específico
oak install dryad-utils

# Instalar uma versão específica
oak install dryad-utils --version 1.0.0

# Instalar todas as dependências listadas em oaklibs.json
oak install
```

O Oak utiliza o `git` para baixar pacotes e gera/atualiza o arquivo `oaklock.json`.

### `run`

Executa scripts definidos no `oaklibs.json`.

```bash
oak run start
oak run test
```

### `lock`

Regera o arquivo de travamento `oaklock.json` baseado nos pacotes presentes em `oak_modules/`.

```bash
oak lock
```

Útil se você modificar manualmente a pasta de módulos ou se o arquivo de travamento estiver dessincronizado.

### `registry`

Gerencia os registries configurados.

```bash
# Listar registries
oak registry list

# Adicionar um novo registry
oak registry add private http://meu-registry.com/api

# Remover um registry
oak registry remove private
```

## Arquivos de Configuração

### `oaklibs.json`

Arquivo principal de manifesto do projeto. Define metadados e dependências.

```json
{
  "name": "meu-projeto",
  "version": "0.1.0",
  "type": "project",
  "dependencies": {
    "dryad-utils": "1.0.0"
  },
  "scripts": {
    "start": "oak exec main.dryad"
  }
}
```

### `oaklock.json`

Arquivo gerado automaticamente que mapeia os módulos para seus caminhos físicos. **Não deve ser editado manualmente.**


## Registry

O Oak suporta múltiplos registries simultaneamente. A configuração é global (armazenada em `~/.oak/config.json`).

Se um pacote for encontrado em múltiplos registries, o Oak solicitará interativamente qual fonte deve ser utilizada.
