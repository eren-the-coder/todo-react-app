import { createContext, useState, type ReactNode } from "react"

export type Theme = 'light' | 'dark'

type ThemeContextValue = {
  theme: Theme
  setTheme: React.Dispatch<React.SetStateAction<Theme>>
}

export const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
  setTheme: () => {},
})

const ThemeProvider = ({ children } : { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('light')

  return (
    <ThemeContext.Provider value={{theme, setTheme}}>
      {children}
    </ThemeContext.Provider>
  )
}

export default ThemeProvider