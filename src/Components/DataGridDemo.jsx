import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import LaunchIcon from "@mui/icons-material/Launch";
import FolderOffOutlinedIcon from "@mui/icons-material/FolderOffOutlined";

// A small subset of GitHub's linguist colors, with a deterministic fallback.
const LANG_COLORS = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  "C#": "#178600",
  Go: "#00ADD8",
  Rust: "#dea584",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Shell: "#89e051",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Vue: "#41b883",
  Dart: "#00B4AB",
  Kotlin: "#A97BFF",
  Swift: "#F05138",
};

function langColor(lang) {
  if (LANG_COLORS[lang]) return LANG_COLORS[lang];
  let hash = 0;
  for (let i = 0; i < lang.length; i++) hash = lang.charCodeAt(i) + ((hash << 5) - hash);
  return `hsl(${hash % 360}, 65%, 55%)`;
}

const dateFmt = new Intl.DateTimeFormat(undefined, {
  year: "numeric",
  month: "short",
  day: "numeric",
});

function DateCell({ value }) {
  if (!value) return <Typography variant="body2" color="text.secondary">—</Typography>;
  const d = new Date(value);
  return (
    <Tooltip title={d.toLocaleString()}>
      <Typography variant="body2">{dateFmt.format(d)}</Typography>
    </Tooltip>
  );
}

const columns = [
  {
    field: "name",
    headerName: "Repository",
    flex: 1.4,
    minWidth: 200,
    renderCell: (params) => (
      <Link
        href={params.row.url}
        target="_blank"
        rel="noopener noreferrer"
        underline="hover"
        sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, fontWeight: 600 }}
      >
        {params.value}
        <LaunchIcon sx={{ fontSize: 14, opacity: 0.6 }} />
      </Link>
    ),
  },
  {
    field: "owner",
    headerName: "Owner",
    flex: 1,
    minWidth: 150,
    renderCell: (params) =>
      params.value ? (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Avatar
            src={`https://github.com/${params.value}.png?size=40`}
            sx={{ width: 24, height: 24, fontSize: 12 }}
          >
            {params.value[0]?.toUpperCase()}
          </Avatar>
          <Typography variant="body2">{params.value}</Typography>
        </Box>
      ) : (
        "—"
      ),
  },
  {
    field: "lang",
    headerName: "Language",
    flex: 0.8,
    minWidth: 130,
    renderCell: (params) =>
      params.value ? (
        <Chip
          size="small"
          variant="outlined"
          label={params.value}
          icon={
            <Box
              component="span"
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                bgcolor: langColor(params.value),
                ml: 1,
              }}
            />
          }
        />
      ) : (
        <Typography variant="body2" color="text.secondary">—</Typography>
      ),
  },
  {
    field: "githubUpdatedAt",
    headerName: "Last updated",
    flex: 0.9,
    minWidth: 140,
    type: "dateTime",
    valueGetter: (value) => (value ? new Date(value) : null),
    renderCell: (params) => <DateCell value={params.value} />,
  },
  {
    field: "createdAt",
    headerName: "Imported",
    flex: 0.9,
    minWidth: 140,
    type: "dateTime",
    valueGetter: (value) => (value ? new Date(value) : null),
    renderCell: (params) => <DateCell value={params.value} />,
  },
];

const EMPTY_SELECTION = { type: "include", ids: new Set() };

function selectedIds(model, rows) {
  if (model.type === "exclude") {
    return rows.map((r) => r._id).filter((id) => !model.ids.has(id));
  }
  return Array.from(model.ids);
}

function NoRowsOverlay() {
  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
        color: "text.secondary",
      }}
    >
      <FolderOffOutlinedIcon sx={{ fontSize: 40, opacity: 0.5 }} />
      <Typography variant="body2">No repositories yet</Typography>
      <Typography variant="caption">Import a token above to get started</Typography>
    </Box>
  );
}

export default function DataGridDemo({ rows, loading, deleting, onDelete }) {
  const [selection, setSelection] = useState(EMPTY_SELECTION);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const ids = selectedIds(selection, rows);
  const count = ids.length;

  const handleConfirmDelete = async () => {
    await onDelete(ids);
    setSelection(EMPTY_SELECTION);
    setConfirmOpen(false);
  };

  return (
    <Card>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          p: 2,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Typography variant="subtitle1" fontWeight={700} sx={{ flexGrow: 1 }}>
          Repositories
        </Typography>
        {count > 0 && (
          <Typography variant="body2" color="text.secondary">
            {count} selected
          </Typography>
        )}
        <Button
          color="error"
          variant="outlined"
          size="small"
          startIcon={<DeleteOutlineIcon />}
          disabled={count === 0 || deleting}
          onClick={() => setConfirmOpen(true)}
        >
          Delete
        </Button>
      </Box>

      <Box sx={{ height: 560, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row._id}
          loading={loading}
          checkboxSelection
          disableRowSelectionOnClick
          showToolbar
          rowSelectionModel={selection}
          onRowSelectionModelChange={setSelection}
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
            sorting: { sortModel: [{ field: "githubUpdatedAt", sort: "desc" }] },
          }}
          slots={{ noRowsOverlay: NoRowsOverlay }}
          sx={{
            border: 0,
            "& .MuiDataGrid-columnHeaders": { fontWeight: 700 },
            "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
              outline: "none",
            },
          }}
        />
      </Box>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Delete {count} repositor{count === 1 ? "y" : "ies"}?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This removes the selected records from the database. This action
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleConfirmDelete} disabled={deleting}>
            {deleting ? "Deleting…" : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
