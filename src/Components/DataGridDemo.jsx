import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
// import { token } from "./InputData"; 


const columns = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "name",
    headerName: "name",
    width: 150,
    editable: true,
  },
  {
    field: "status",
    headerName: "Status",
    width: 150,
    editable: true,
  },
  {
    field: "date",
    headerName: "Date",
    type: "number",
    width: 110,
    editable: true,
  }
];

export default function DataGridDemo({token, refreshTrigger}) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState({
    type: "include",
    ids: new Set(),
  });

  console.log(token);
  
  // Function to fetch data
  const fetchData = () => {
    setLoading(true);
    fetch("http://localhost:8000/repos")
      .then((res) => res.json())
      .then((data) => {
        setRows(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  };

  // Fetch data on component mount and whenever refreshTrigger changes
  useEffect(() => {
    fetchData();
  }, [refreshTrigger]);

  const handleDelete = async () => {
    if (deleteId.ids.size === 0) return;

    const idsArray = Array.from(deleteId.ids);
    console.log("Deleting IDs:", idsArray);

    try {
      const res = await fetch('http://localhost:8000/repos', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: idsArray }),
      });
      const data = await res.json();
      console.log(data);
      // Refresh data after deletion
      fetchData();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <Box sx={{ height: "100%", width: "60%" }}>
      <Button onClick={handleDelete}>
        Delete
      </Button>

      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(row) => row._id}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5, 10, 25]}
        checkboxSelection
        disableRowSelectionOnClick
        showToolbar
        onRowSelectionModelChange={(ids) => setDeleteId(ids)}
      />
    </Box>
  );
}
