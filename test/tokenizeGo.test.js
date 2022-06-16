import {
  initialLineState,
  tokenizeLine,
  TokenType,
  TokenMap,
} from '../src/tokenizeGo'

const DEBUG = false

const expectTokenize = (text, state = initialLineState.state) => {
  const lineState = {
    state,
  }
  const tokens = []
  const lines = text.split('\n')
  for (let i = 0; i < lines.length; i++) {
    const result = tokenizeLine(lines[i], lineState)
    lineState.state = result.state
    tokens.push(...result.tokens.map((token) => token.type))
    tokens.push(TokenType.NewLine)
  }
  tokens.pop()
  return {
    toEqual(...expectedTokens) {
      if (DEBUG) {
        expect(tokens.map((token) => TokenMap[token])).toEqual(
          expectedTokens.map((token) => TokenMap[token])
        )
      } else {
        expect(tokens).toEqual(expectedTokens)
      }
    },
  }
}

test('empty', () => {
  expectTokenize(``).toEqual()
})

test('whitespace', () => {
  expectTokenize(' ').toEqual(TokenType.Whitespace)
})

test('keywords', () => {
  // see https://golang.org/ref/spec#Keywords
  expectTokenize('break').toEqual(TokenType.Keyword)
  expectTokenize('case').toEqual(TokenType.Keyword)
  expectTokenize('chan').toEqual(TokenType.Keyword)
  expectTokenize('const').toEqual(TokenType.Keyword)
  expectTokenize('continue').toEqual(TokenType.Keyword)
  expectTokenize('default').toEqual(TokenType.Keyword)
  expectTokenize('func').toEqual(TokenType.Keyword)
  expectTokenize('go').toEqual(TokenType.Keyword)
  expectTokenize('goto').toEqual(TokenType.Keyword)
  expectTokenize('if').toEqual(TokenType.Keyword)
  expectTokenize('import').toEqual(TokenType.Keyword)
  expectTokenize('interface').toEqual(TokenType.Keyword)
  expectTokenize('map').toEqual(TokenType.Keyword)
  expectTokenize('package').toEqual(TokenType.Keyword)
  expectTokenize('range').toEqual(TokenType.Keyword)
  expectTokenize('return').toEqual(TokenType.Keyword)
  expectTokenize('select').toEqual(TokenType.Keyword)
  expectTokenize('struct').toEqual(TokenType.Keyword)
  expectTokenize('switch').toEqual(TokenType.Keyword)
  expectTokenize('type').toEqual(TokenType.Keyword)
  expectTokenize('var').toEqual(TokenType.Keyword)
})
