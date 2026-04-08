import { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import ConfirmModal from "../../components/ConfirmModal";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Typography,
  Button,
  Stack,
  Box,
  Switch,
  FormControlLabel,
  TablePagination,
  CircularProgress,
  Tooltip,
} from "@mui/material";

type Product = {
  id: number;
  name: string;
  purchaseAmount: number;
  saleAmount: number;
  updated_at: string;
};

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [showPurchase, setShowPurchase] = useState(false);
  const [loading, setLoading] = useState(false);

  const [confirm, setConfirm] = useState<{ open: boolean; id?: number }>({
    open: false,
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [totalCount, setTotalCount] = useState(0);

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const navigate = useNavigate();

  const fetchProducts = async () => {
    setLoading(true);

    let query = supabase.from("products").select("*", { count: "exact" });

    if (search) {
      query = query.ilike("name", `%${search}%`);
    }

    query = query
      .order("name", { ascending: sortOrder === "asc" })
      .range(page * rowsPerPage, (page + 1) * rowsPerPage - 1);

    const { data, error, count } = await query;

    if (error) {
      toast.error("Failed to load products");
    } else {
      setProducts((data ?? []) as Product[]);
      setTotalCount(count || 0);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [page, rowsPerPage, search, sortOrder]);

  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;

      toast.success("Product deleted");
      fetchProducts();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Delete failed";
      toast.error(msg);
    } finally {
      setConfirm({ open: false });
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div style={{ padding: "20px 10px", maxWidth: 1200, margin: "auto" }}>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Product List
      </Typography>

      {/* 🔍 Search */}
      <Stack spacing={2} sx={{ mb: 2 }}>
        <TextField
          label="Search by Name"
          size="small"
          fullWidth
          value={search}
          onChange={(e) => {
            setPage(0);
            setSearch(e.target.value);
          }}
        />

        {/* ✅ Sort + Toggle SAME LINE (mobile fix) */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button
            variant="outlined"
            size="small"
            sx={{ whiteSpace: "nowrap" }}
            onClick={() => {
              setPage(0);
              setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
            }}
          >
            {sortOrder === "asc" ? "A → Z" : "Z → A"}
          </Button>

          <FormControlLabel
            sx={{
              m: 0,
              "& .MuiFormControlLabel-label": {
                fontSize: { xs: "12px", sm: "14px" },
                whiteSpace: "nowrap",
              },
            }}
            control={
              <Switch
                size="small" // 👈 small toggle
                checked={showPurchase}
                onChange={() => setShowPurchase((prev) => !prev)}
              />
            }
            label="Purchase"
          />
        </Box>
      </Stack>

      {/* 📊 Table */}
      <TableContainer component={Paper} elevation={4}>
        <Table size="small">
          <TableHead sx={{ bgcolor: "#1e293b" }}>
            <TableRow>
              <TableCell sx={{ color: "#fff", fontWeight: 600 }}>
                Name
              </TableCell>

              {showPurchase && (
                <TableCell
                  align="right"
                  sx={{ color: "#fff", fontWeight: 600, whiteSpace: "nowrap" }}
                >
                  Purchase (₹)
                </TableCell>
              )}

              <TableCell
                align="right"
                sx={{ color: "#fff", fontWeight: 600, whiteSpace: "nowrap" }}
              >
                Sale (₹)
              </TableCell>

              <TableCell sx={{ color: "#fff", fontWeight: 600 }}>
                Updated
              </TableCell>

              <TableCell align="center" sx={{ color: "#fff", fontWeight: 600 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={showPurchase ? 5 : 4}
                  align="center"
                  sx={{ py: 4 }}
                >
                  <CircularProgress size={30} />
                </TableCell>
              </TableRow>
            ) : products.length > 0 ? (
              products.map((product) => (
                <TableRow key={product.id} hover>
                  {/* ✅ NOWRAP applied */}
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {product.name}
                  </TableCell>

                  {showPurchase && (
                    <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                      ₹{product.purchaseAmount}
                    </TableCell>
                  )}

                  <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                    ₹{product.saleAmount}
                  </TableCell>

                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {formatDate(product.updated_at)}
                  </TableCell>

                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      {/* ✏️ Edit Tooltip */}
                      <Tooltip title="Edit">
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          sx={{ minWidth: 40, p: 1 }}
                          onClick={() => navigate(`/add/${product.id}`)}
                        >
                          <FaRegEdit size={16} />
                        </Button>
                      </Tooltip>

                      {/* 🗑 Delete Tooltip */}
                      <Tooltip title="Delete">
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          sx={{ minWidth: 40, p: 1 }}
                          onClick={() =>
                            setConfirm({ open: true, id: product.id })
                          }
                        >
                          <MdDelete size={16} />
                        </Button>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={showPurchase ? 5 : 4} align="center">
                  No products found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* 📄 Pagination */}
        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[10, 20, 50, 100]}
          // ✅ ADD THIS
          sx={{
            backgroundColor: "#f1f5f9", // light gray
            borderTop: "1px solid #e2e8f0",
            "& .MuiTablePagination-toolbar": {
              minHeight: "48px",
            },
            "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
              {
                color: "#475569", // dark gray text
                fontWeight: 500,
              },
            "& .MuiSvgIcon-root": {
              color: "#64748b", // icons gray
            },
          }}
        />
      </TableContainer>

      <ConfirmModal
        open={confirm.open}
        title="Delete this product?"
        description="This action cannot be undone."
        onCancel={() => setConfirm({ open: false })}
        onConfirm={() => handleDelete(confirm.id!)}
      />
    </div>
  );
};

export default ProductList;
