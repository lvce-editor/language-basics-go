/**
 * @enum number
 */
export const State = {
  TopLevelContent: 1,
  InsideDoubleQuoteString: 2,
  InsideLineComment: 3,
}

/**
 * @enum number
 */
export const TokenType = {
  None: 901,
  Whitespace: 0,
  TypeName: 35,
  PlainText: 117,
  Comment: 60,
  String: 50,
  Numeric: 30,
  FunctionName: 112,
  TypeNamePrimitive: 36,
  Text: 117,
  PunctuationTag: 228,
  TagName: 118,
  AttributeName: 119,
  Punctuation: 10,
  Error: 141,
  PunctuationString: 11,
  NewLine: 771,
  Keyword: 951,
  VariableName: 952,
}

export const TokenMap = {
  [TokenType.Whitespace]: 'Whitespace',
  [TokenType.TypeName]: 'TypeName',
  [TokenType.PlainText]: 'PlainText',
  [TokenType.Comment]: 'Comment',
  [TokenType.String]: 'String',
  [TokenType.Numeric]: 'Numeric',
  [TokenType.FunctionName]: 'FunctionName',
  [TokenType.TypeNamePrimitive]: 'TypeNamePrimitive',
  [TokenType.Text]: 'Text',
  [TokenType.PunctuationTag]: 'PunctuationTag',
  [TokenType.TagName]: 'TagName',
  [TokenType.AttributeName]: 'AttributeName',
  [TokenType.Punctuation]: 'Punctuation',
  [TokenType.Error]: 'Error',
  [TokenType.PunctuationString]: 'PunctuationString',
  [TokenType.NewLine]: 'NewLine',
  [TokenType.Keyword]: 'Keyword',
  [TokenType.VariableName]: 'VariableName',
}

const RE_WHITESPACE = /^\s+/
const RE_WHITESPACE_SINGLE_LINE = /^( |\t)+/
const RE_WHITESPACE_NEWLINE = /^\n/
const RE_CONSTANT = /^(true|false|null)/
const RE_STRING_DOUBLE_QUOTE_CONTENT = /^[^"\n]+/
const RE_STRING_SINGLE_QUOTE_CONTENT = /^[^'\n]+/
const RE_DOUBLE_QUOTE = /^"/
const RE_CURLY_OPEN = /^\{/
const RE_CURLY_CLOSE = /^\}/
const RE_SQUARE_OPEN = /^\[/
const RE_SQUARE_CLOSE = /^\]/
const RE_COMMA = /^,/
const RE_COLON = /^:/
const RE_NUMERIC =
  /^((0(x|X)[0-9a-fA-F]*)|(([0-9]+\.?[0-9]*)|(\.[0-9]+))((e|E)(\+|-)?[0-9]+)?)/
const RE_NEWLINE_WHITESPACE = /^\n\s*/
const RE_BLOCK_COMMENT_START = /^\/\*/
const RE_BLOCK_COMMENT_CONTENT = /^.+(?=\*\/|$)/s
const RE_BLOCK_COMMENT_END = /^\*\//
const RE_UNKNOWN_VALUE = /^[^\}\{\s,"]+/
const RE_IMPORT = /^[a-zA-Z\.]+/
const RE_SEMICOLON = /^;/
const RE_VARIABLE_NAME = /^[a-zA-Z\_][a-zA-Z\_\d]*/
const RE_LINE_COMMENT = /^\/\//
const RE_ROUND_OPEN = /^\(/
const RE_ROUND_CLOSE = /^\)/
const RE_DOT = /^\./
const RE_EQUAL_SIGN = /^=/
const RE_SINGLE_QUOTE = /^'/
const RE_PUNCTUATION = /^[\(\)=\+\-><\.,\/\*\^\[\]\{\}\|:]/
const RE_ANYTHING_UNTIL_END = /^.+/s
const RE_START_OF_FUNCTION = /^( )*\(/
const RE_COLON_COLON = /^::/
const RE_BASH_SLASH = /^\\/
const RE_ANY_CHAR = /^./
const RE_SQUARE_OPEN_SQUARE_OPEN = /^\[\[/
const RE_SQUARE_CLOSE_SQUARE_CLOSE = /^\]\]/
const RE_STRING_MULTILINE_CONTENT = /^.+?(?=\]\]|$)/s
const RE_KEYWORD =
  /^(?:var|type|switch|struct|select|return|range|package|map|interface|import|if|goto|go|func|default|continue|const|chan|case|break)\b/
const RE_TEXT = /^.+/s

export const initialLineState = {
  state: State.TopLevelContent,
}

export const isLineStateEqual = (lineStateA, lineStateB) => {
  return lineStateA.state === lineStateB.state
}

export const tokenizeLine = (line, lineState) => {
  let next = null
  let index = 0
  let tokens = []
  let token = TokenType.None
  let state = lineState.state
  while (index < line.length) {
    const part = line.slice(index)
    switch (state) {
      case State.TopLevelContent:
        if ((next = part.match(RE_WHITESPACE))) {
          token = TokenType.Whitespace
          state = State.TopLevelContent
        } else if ((next = part.match(RE_KEYWORD))) {
          token = TokenType.Keyword
          state = State.TopLevelContent
        } else if ((next = part.match(RE_VARIABLE_NAME))) {
          token = TokenType.VariableName
          state = State.TopLevelContent
        } else if ((next = part.match(RE_LINE_COMMENT))) {
          token = TokenType.Comment
          state = State.InsideLineComment
        } else if ((next = part.match(RE_PUNCTUATION))) {
          token = TokenType.Punctuation
          state = State.TopLevelContent
        } else if ((next = part.match(RE_TEXT))) {
          token = TokenType.Text
          state = State.TopLevelContent
        } else {
          part //?
          throw new Error('no')
        }
        break
      case State.InsideLineComment:
        if ((next = part.match(RE_TEXT))) {
          token = TokenType.Comment
          state = State.TopLevelContent
        } else {
          throw new Error('no')
        }
        break
      default:
        state
        throw new Error('no')
    }
    index += next[0].length
    tokens.push({
      type: token,
      length: next[0].length,
    })
  }
  return {
    state,
    tokens,
  }
}
