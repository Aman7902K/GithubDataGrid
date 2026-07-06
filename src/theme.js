import { createTheme } from "@mui/material/styles";

// GitHub-inspired palettes for the two color modes.
const palettes = {
  dark: {
    mode: "dark",
    primary: { main: "#58a6ff" },
    secondary: { main: "#bc8cff" },
    success: { main: "#3fb950" },
    error: { main: "#f85149" },
    background: { default: "#0d1117", paper: "#161b22" },
    text: { primary: "#e6edf3", secondary: "#8b949e" },
    divider: "rgba(240, 246, 252, 0.1)",
  },
  light: {
    mode: "light",
    primary: { main: "#0969da" },
    secondary: { main: "#8250df" },
    success: { main: "#1a7f37" },
    error: { main: "#cf222e" },
    background: { default: "#f6f8fa", paper: "#ffffff" },
    text: { primary: "#1f2328", secondary: "#59636e" },
    divider: "rgba(31, 35, 40, 0.12)",
  },
};

const fontStack = [
  "-apple-system",
  "BlinkMacSystemFont",
  '"Segoe UI"',
  "Roboto",
  '"Helvetica Neue"',
  "Arial",
  "sans-serif",
].join(",");

export function createAppTheme(mode) {
  const palette = palettes[mode] ?? palettes.dark;

  return createTheme({
    palette,
    shape: { borderRadius: 12 },
    typography: {
      fontFamily: fontStack,
      h6: { fontWeight: 700, letterSpacing: "-0.01em" },
      button: { textTransform: "none", fontWeight: 600 },
    },
    components: {
      MuiCard: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: ({ theme }) => ({
            border: `1px solid ${theme.palette.divider}`,
            backgroundImage: "none",
          }),
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: { root: { borderRadius: 8 } },
      },
      MuiAppBar: {
        defaultProps: { elevation: 0, color: "default" },
        styleOverrides: {
          root: ({ theme }) => ({
            backgroundColor: theme.palette.background.paper,
            borderBottom: `1px solid ${theme.palette.divider}`,
            backgroundImage: "none",
          }),
        },
      },
    },
  });
}
