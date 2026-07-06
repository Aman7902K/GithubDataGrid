import { useCallback, useEffect, useMemo, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { createAppTheme } from "./theme";
import { fetchRepos, importRepos, deleteRepos } from "./api";
import Header from "./Components/Header";
import StatCards from "./Components/StatCards";
import InputData from "./Components/InputData";
import DataGridDemo from "./Components/DataGridDemo";

const MODE_KEY = "gdg-color-mode";

export default function App() {
  const [mode, setMode] = useState(
    () => localStorage.getItem(MODE_KEY) || "dark"
  );
  const theme = useMemo(() => createAppTheme(mode), [mode]);

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState(null); // { severity, message }

  const toggleMode = () => {
    setMode((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      localStorage.setItem(MODE_KEY, next);
      return next;
    });
  };

  const loadRepos = useCallback(async () => {
    setLoading(true);
    try {
      setRows(await fetchRepos());
    } catch {
      setToast({ severity: "error", message: "Failed to load repositories. Is the backend running?" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Intentional one-time data fetch on mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadRepos();
  }, [loadRepos]);

  const handleImport = async (token) => {
    setImporting(true);
    try {
      const result = await importRepos(token);
      const n = result?.recordsInserted;
      setToast({
        severity: "success",
        message: n != null ? `Imported ${n} repositories.` : "Repositories imported.",
      });
      await loadRepos();
    } catch (err) {
      const message =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Import failed. Check the token and try again.";
      setToast({ severity: "error", message });
    } finally {
      setImporting(false);
    }
  };

  const handleDelete = async (ids) => {
    if (!ids.length) return;
    setDeleting(true);
    try {
      const result = await deleteRepos(ids);
      setToast({
        severity: "success",
        message: result?.message || `Deleted ${ids.length} repositories.`,
      });
      await loadRepos();
    } catch {
      setToast({ severity: "error", message: "Delete failed. Please try again." });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        <Header
          mode={mode}
          onToggleMode={toggleMode}
          onRefresh={loadRepos}
          refreshing={loading}
        />
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Stack spacing={3}>
            <StatCards rows={rows} />
            <InputData onTokenSubmit={handleImport} loading={importing} />
            <DataGridDemo
              rows={rows}
              loading={loading}
              deleting={deleting}
              onDelete={handleDelete}
            />
          </Stack>
        </Container>
      </Box>

      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={5000}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        {toast ? (
          <Alert
            onClose={() => setToast(null)}
            severity={toast.severity}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {toast.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </ThemeProvider>
  );
}
