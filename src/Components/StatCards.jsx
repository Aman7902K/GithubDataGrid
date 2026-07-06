import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import CodeOutlinedIcon from "@mui/icons-material/CodeOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";

function StatCard({ icon, label, value, color }) {
  return (
    <Card sx={{ flex: "1 1 200px" }}>
      <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            display: "grid",
            placeItems: "center",
            bgcolor: (t) => `${t.palette[color].main}1f`,
            color: `${color}.main`,
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography variant="h5" fontWeight={700} lineHeight={1.1}>
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function StatCards({ rows }) {
  const totalRepos = rows.length;
  const languages = new Set(rows.map((r) => r.lang).filter(Boolean)).size;
  const owners = new Set(rows.map((r) => r.owner).filter(Boolean)).size;

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
      <StatCard
        icon={<FolderOutlinedIcon />}
        label="Repositories"
        value={totalRepos}
        color="primary"
      />
      <StatCard
        icon={<CodeOutlinedIcon />}
        label="Languages"
        value={languages}
        color="secondary"
      />
      <StatCard
        icon={<PersonOutlineOutlinedIcon />}
        label="Owners"
        value={owners}
        color="success"
      />
    </Box>
  );
}
