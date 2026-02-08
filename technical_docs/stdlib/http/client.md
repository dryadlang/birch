# HTTP Client

Biblioteca nativa para realizar requisições web.

## Funções Disponíveis

### `http_get(url: string): string`
Realiza uma requisição GET simples.
- **Retorno**: Corpo da resposta como string.
- **Implementação**: Usa `reqwest` (blocking ou async dependendo da build).

### `http_post(url: string, body: string): string`
Realiza uma requisição POST com corpo.
- **Content-Type**: Assume `application/json` ou `text/plain` por padrão (verificar implementação específica).

### `http_download(url: string, path: string)`
Baixa um arquivo da URL e salva no caminho especificado.

## Exemplo
```dryad
#<http_client>
let json = http_get("https://api.github.com/zen");
println(json);
```
