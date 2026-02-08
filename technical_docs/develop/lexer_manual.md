# Manual Técnico: Lexer (Analisador Léxico)

**Localização**: `crates/dryad_lexer/`
**Responsável**: Transformar o código fonte (texto) em uma sequência de tokens.

## 1. Visão Geral
O Lexer é o primeiro estágio do compilador. Ele atua como um `Iterator<Item = Result<Token, Error>>`, produzindo tokens sob demanda.

### Design
- **Single Pass**: Lê o arquivo uma vez, caractere a caractere.
- **Lookahead (Peek)**: Suporta espiar 1 ou 2 caracteres à frente para desambiguação (ex: `+` vs `++` vs `+=`).
- **Context-Free**: O lexer não sabe sobre a gramática, apenas sobre tokens individuais.

## 2. Estrutura de Dados

O Lexer mantém o estado atual da leitura do código fonte.

```rust
pub struct Lexer {
    source: Vec<char>,          // Código fonte como vetor de caracteres (Unicode-aware)
    source_lines: Vec<String>,  // Linhas originais para contexto de erro na impressão
    position: usize,            // Índice do caractere atual no vetor source
    line: usize,                // Linha atual (1-based)
    column: usize,              // Coluna atual (1-based)
    file_path: Option<PathBuf>, // Caminho do arquivo original
}
```

## 3. Máquina de Estados (Simplificada)

O método principal `next_token()` opera como uma máquina de estados finitos:

| Estado Inicial (Char) | Ação / Transição | Próximo Estado / Token |
| :--- | :--- | :--- |
| `Space`, `\t`, `\n` | `skip_whitespace()` | Ignorar e repetir |
| `0`..`9` | `number()` | **TOKEN: Number** (Int, Float, Hex, Bin, Oct) |
| `"`, `'` | `string(quote)` | **TOKEN: String** |
| `a`..`z`, `_` | `identifier()` | **TOKEN: Identifier** ou **Keyword** |
| `/` | Verifica próximo char | Se `/` -> Comentário de linha (Ignorar)<br>Se `*` -> Comentário de bloco (Ignorar)<br>Se não -> **TOKEN: Slash** |
| `#` | Verifica próximo char | Se `<` -> Diretiva Nativa<br>Se `#` -> **TOKEN: Power10** (`##`) |
| `EOF` | N/A | **TOKEN: EOF** |

## 4. Tratamento de Casos Específicos

### Strings e Escape Sequences
A função `string(delimiter)` consome caracteres até encontrar o delimitador de fechamento.
- **Escapes Suportados**:
    - `\n` (Nova linha)
    - `\t` (Tabulação)
    - `\"`, `\'` (Aspas)
    - `\\` (Barra invertida)
    - `\uFFFF` (Unicode Hex Code - 4 dígitos)
- **Erro**: Se chegar ao EOF sem fechar, retorna erro `1002 (UnterminatedString)`.

### Números e Bases
Detecta automaticamente a base numérica pelo prefixo:
- `0b...`: Binário (ex: `0b1010`) -> `10`
- `0o...`: Octal (ex: `0o77`) -> `63`
- `0x...`: Hexadecimal (ex: `0xFF`) -> `255`
- `123`, `12.34`: Decimal / Float

A conversão é feita usando `i64::from_str_radix` ou `f64::parse`.

### Identificadores vs Keywords
O lexer lê todo o identificador (sequência de alfanuméricos) e *depois* verifica se ele corresponde a uma palavra reservada.
```rust
// Pseudo-code
let ident = consume_alphanun();
if let Some(keyword_token) = KEYWORDS.get(&ident) {
    return keyword_token;
}
return Token::Identifier(ident);
```
Isso simplifica a lógica e evita backtracking.

## 5. Rastreamento de Localização
Cada token emitido é envolvido em um `TokenWithLocation`:
```rust
pub struct TokenWithLocation {
    pub token: Token,
    pub location: SourceLocation, // { file, line, column, position }
}
```
Isso é crucial para que o Parser e o sistema de erros possam apontar exatamente onde um problema ocorreu.

## 6. Integração com Sistema de Erros
O Lexer gera erros do tipo `DryadError::Lexer` (código 1xxx).
- **Recuperação**: O lexer geralmente não se recupera de erros fatais (como string não terminada), retornando `Err` imediatamente.
- **Sugestões**: Utiliza `with_auto_context()` para anexar URLs de ajuda baseadas no código do erro.
