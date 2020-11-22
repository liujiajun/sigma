import { ThemeProvider, CSSReset, ColorModeProvider, ChakraProvider } from '@chakra-ui/react'

import customTheme from '../theme'

function MyApp({ Component, pageProps }) {
  return (
      <ChakraProvider theme={customTheme}>
        <Component {...pageProps} />
      </ChakraProvider>
  )
}

export default MyApp
