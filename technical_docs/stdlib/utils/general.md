# Utils

Módulo de utilitários gerais.

## Funções Disponíveis

### `random(): number`
Retorna um número aleatório entre 0.0 e 1.0.

### `sleep(ms: number)`
Pausa a execução da thread atual por `ms` milissegundos.
- **Args**: Tempo em milissegundos.

### `base64_encode(str: string): string`
Codifica uma string para Base64.

### `base64_decode(str: string): string`
Decodifica uma string Base64 para texto.
- **Erro**: Lança exceção se a string não for Base64 válido.

### `json_stringify(value: any): string`
Converte qualquer valor Dryad para uma string JSON.

### `json_parse(json_string: string): any`
Analisa uma string JSON e retorna o objeto Dryad correspondente.
- **Erro**: Lança exceção se o JSON for inválido.

### `sha256(str: string): string`
Calcula o hash SHA256 de uma string.

### `uuid_v4(): string`
Gera um identificador único universal (UUID) versão 4.

## Exemplo
```dryad
#<utils>

let obj = { id: uuid_v4(), data: random() };
let json = json_stringify(obj);
println(json);

sleep(1000);
```
