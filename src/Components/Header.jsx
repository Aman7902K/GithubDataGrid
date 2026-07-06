import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import GitHubIcon from "@mui/icons-material/GitHub";
import RefreshIcon from "@mui/icons-material/Refresh";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

export default function Header({ mode, onToggleMode, onRefresh, refreshing }) {
  return (
    <AppBar position="sticky">
      <Toolbar sx={{ gap: 1.5 }}>
        <GitHubIcon sx={{ color: "primary.main" }} />
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" component="h1" lineHeight={1.2}>
            GitHub Data Grid
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Import, browse and manage your repositories
          </Typography>
        </Box>

        <Tooltip title="Refresh data">
          <span>
            <IconButton onClick={onRefresh} disabled={refreshing}>
              <RefreshIcon
                sx={{
                  animation: refreshing ? "spin 0.8s linear infinite" : "none",
                  "@keyframes spin": { to: { transform: "rotate(360deg)" } },
                }}
              />
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip title={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}>
          <IconButton onClick={onToggleMode} color="inherit">
            {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
}
