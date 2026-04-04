import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../supabase";
import ConfirmModal from "../../components/ConfirmModal";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";

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
} from "@mui/material";
import { FaRegEdit } from "react-icons/fa";

type Product = {
  id: number;
  name: string;
  parent_id: number | null;
  parent?: {
    name: string;
  };
  purchaseAmount: number;
  saleAmount: number;
  updated_at: string;
};

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [parentSearch, setParentSearch] = useState("");
  const [confirm, setConfirm] = useState<{ open: boolean; id?: number }>({
    open: false,
  });

  const navigate = useNavigate();

  const fetchProducts = async () => {
    // Select parent info using foreign key join
    const { data, error } = await supabase
      .from("products")
      .select("*, parent:parent_id(name)")
      .order("id", { ascending: false });

    if (error) {
      toast.error("Failed to load products");
    } else {
      setProducts((data ?? []) as Product[]);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesName = p.name.toLowerCase().includes(search.toLowerCase());
      const parentName = (p.parent?.name || "").toLowerCase();
      const matchesParent = parentName.includes(parentSearch.toLowerCase());
      return matchesName && matchesParent;
    });
  }, [products, search, parentSearch]);

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

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
        <TextField
          label="Search by Name"
          variant="outlined"
          fullWidth
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <TextField
          label="Search by Parent"
          variant="outlined"
          fullWidth
          size="small"
          value={parentSearch}
          onChange={(e) => setParentSearch(e.target.value)}
        />
      </Stack>

      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2, overflow: "hidden" }}>
        <Box sx={{ overflowX: "auto" }}>
          <Table size="small">
            <TableHead sx={{ bgcolor: "#f8fafc" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>Name</TableCell>
                <TableCell sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>Parent</TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>Purchase (₹)</TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>Sale (₹)</TableCell>
                <TableCell sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>Updated</TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <TableRow key={product.id} hover>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>{product.name}</TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>{product.parent?.name || "-"}</TableCell>
                    <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                      ₹{product.purchaseAmount}
                    </TableCell>
                    <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                      ₹{product.saleAmount}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap", fontSize: "0.75rem", color: "text.secondary" }}>
                      {formatDate(product.updated_at)}
                    </TableCell>
                    <TableCell align="center" sx={{ whiteSpace: "nowrap" }}>
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                          sx={{ minWidth: 40, p: 0.5 }}
                          onClick={() => navigate(`/add/${product.id}`)}
                        >
                          <FaRegEdit size={18} />
                        </Button>

                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          sx={{ minWidth: 40, p: 0.5 }}
                          onClick={() =>
                            setConfirm({ open: true, id: product.id })
                          }
                        >
                          <MdDelete size={18} />
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    No products found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
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
