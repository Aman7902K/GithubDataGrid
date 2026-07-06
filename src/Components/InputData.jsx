import { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import CircularProgress from "@mui/material/CircularProgress";
import VpnKeyOutlinedIcon from "@mui/icons-material/VpnKeyOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import DownloadIcon from "@mui/icons-material/Download";

export default function InputData({ onTokenSubmit, loading }) {
  const [token, setToken] = useState("");
  const [show, setShow] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const value = token.trim();
    if (!value || loading) return;
    onTokenSubmit(value);
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
          <VpnKeyOutlinedIcon fontSize="small" color="primary" />
          <Typography variant="subtitle1" fontWeight={700}>
            Import repositories
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Paste a GitHub personal access token. It is sent only to your backend
          to fetch your repositories.
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, alignItems: "flex-start" }}
        >
          <TextField
            value={token}
            onChange={(e) => setToken(e.target.value)}
            type={show ? "text" : "password"}
            placeholder="ghp_xxxxxxxxxxxxxxxx"
            label="Personal access token"
            size="small"
            autoComplete="off"
            sx={{ flex: "1 1 320px" }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShow((s) => !s)}
                      edge="end"
                      size="small"
                      aria-label={show ? "Hide token" : "Show token"}
                    >
                      {show ? (
                        <VisibilityOffOutlinedIcon fontSize="small" />
                      ) : (
                        <VisibilityOutlinedIcon fontSize="small" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !token.trim()}
            startIcon={
              loading ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <DownloadIcon />
              )
            }
            sx={{ height: 40 }}
          >
            {loading ? "Fetching…" : "Fetch"}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
