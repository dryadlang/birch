# System Environment

Biblioteca nativa para interação com o sistema operacional e variáveis de ambiente.

## Funções Disponíveis

### `native_platform(): string`
Retorna o sistema operacional atual.
- **Retorno**: "windows", "linux", "macos", "freebsd", "openbsd", "netbsd" ou "unknown".
- **Uso**: Útil para lógica condicional baseada em SO.

### `native_arch(): string`
Retorna a arquitetura do processador.
- **Retorno**: "x86_64", "aarch64", "arm", etc.

### `native_env(key: string): string | null`
Obtém o valor de uma variável de ambiente.
- **Args**: Nome da variável (ex: "PATH").
- **Retorno**: Valor da variável ou `null` se não definida.

### `native_set_env(key: string, value: string)`
Define uma variável de ambiente para o processo atual.
- **Nota**: A alteração persiste apenas durante a execução do script.

### `native_exec(command: string): number`
Executa um comando no shell do sistema e retorna o código de saída.
- **Args**: Comando completo (ex: "ls -la").
- **Retorno**: Exit code (0 geralmente indica sucesso).
- **Shell**: Usa `cmd /C` no Windows e `sh -c` no Unix.

### `native_exec_output(command: string): string`
Executa um comando e captura sua saída padrão (stdout).
- **Retorno**: String contendo a saída do comando.

### `native_pid(): number`
Retorna o ID do processo atual (PID).

### `native_exit(code: number)`
Encerra a execução do programa imediatamente.
- **Args**: Código de saída (opcional, default 0).

### `get_current_dir(): string`
Retorna o diretório de trabalho atual (CWD).

## Exemplo
```dryad
#<system_env>

let os = native_platform();
println("Rodando em: " + os);

if (os == "linux") {
    let output = native_exec_output("uname -a");
    println("Kernel: " + output);
}

let path = native_env("PATH");
if (path != null) {
    println("PATH encontrado");
}
```
