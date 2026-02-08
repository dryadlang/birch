# File I/O

Biblioteca nativa para manipulação de arquivos e diretórios.

## Funções Disponíveis

### `read_file(path: string): string`
Lê todo o conteúdo de um arquivo de texto.
- **Erro**: Lança exceção se o arquivo não existir ou não puder ser lido.

### `write_file(path: string, content: string)`
Escreve (sobrescreve) o conteúdo em um arquivo.
- **Criação**: Cria o arquivo se não existir.

### `append_file(path: string, content: string)`
Adiciona conteúdo ao final de um arquivo existente.

### `file_exists(path: string): bool`
Verifica se um caminho existe no sistema de arquivos.

### `delete_file(path: string)`
Remove um arquivo.

### `mkdir(path: string)`
Cria um diretório (recursivo, como `mkdir -p`).

### `list_dir(path: string): [string]`
Retorna um array com os nomes dos arquivos e pastas no diretório especificado.

## Exemplo
```dryad
#<file_io>
if (!file_exists("log.txt")) {
    write_file("log.txt", "Log iniciado\n");
}
append_file("log.txt", "Evento registrado\n");
```
