import { AppProps } from "next/app"
import { ReactElement } from "react"

const App = ({ Component, pageProps }: AppProps): ReactElement => <Component {...pageProps} />

export default App
