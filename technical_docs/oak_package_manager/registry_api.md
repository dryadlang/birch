# Oak Registry API

O Oak Registry é um serviço simples que mapeia nomes de pacotes para metadados (principalmente URLs Git). O Oak não armazena os arquivos dos pacotes ("tarballs"); ele delega o armazenamento para repositórios Git (GitHub, GitLab, etc).

## Especificação da API

### `GET /packages/:name/:version?`

Retorna metadados de um pacote.

#### Parâmetros
- `name`: Nome do pacote (ex: `dryad-utils`).
- `version`: (Opcional) Versão específica (ex: `1.0.0`). Se omitido, retorna a `latest`.

#### Resposta (JSON)

```json
{
  "version": "1.0.0",
  "gitUrl": "https://github.com/Dryad-lang/utils.git",
  "tag": "v1.0.0",
  "dependencies": {
    "dryad-stdlib": "^0.1.0"
  }
}
```

- `version`: Versão resolvida.
- `gitUrl`: URL do repositório Git para clonar.
- `tag`: Tag ou branch do Git correspondente à versão.
- `dependencies`: Dependências deste pacote.

### `GET /search?q=:query`

Pesquisa pacotes por nome.

#### Parâmetros
- `q`: Termo de pesquisa.

#### Resposta (JSON)
Array de strings com nomes dos pacotes encontrados.

```json
["dryad-utils", "dryad-stdlib"]
```

## Implementação de Referência

Uma implementação mock do registry está disponível em `dryad-registry-mock/`.
