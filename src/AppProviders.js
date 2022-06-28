import { BrowserRouter } from "react-router-dom";
import { createBrowserHistory } from 'history';
import { ThemeProvider } from "styled-components";
import theme from "theme";
import {QueryClient, QueryClientProvider} from "react-query"
import { Toaster } from "react-hot-toast";
import GlobalStyle from "styles/globalStyle";
import useStore from "store";
import { ReactQueryDevtools } from "react-query/devtools";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
});
const history = createBrowserHistory();

export default function AppProviders({ children }) {
  const isDarkTheme = useStore(s => s.isDarkTheme)
  
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools />
      <Toaster position = "bottom-center" />
      <ThemeProvider theme={theme(isDarkTheme)}>
        <GlobalStyle />
        <BrowserRouter history={history}>{children}</BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
    );
}
