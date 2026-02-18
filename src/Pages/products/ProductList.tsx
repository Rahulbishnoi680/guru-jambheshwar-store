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
} from "@mui/material";
import { FaRegEdit } from "react-icons/fa";

type Product = {
  id: number;
  name: string;
  purchaseAmount: number;
  saleAmount: number;
};

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [confirm, setConfirm] = useState<{ open: boolean; id?: number }>({
    open: false,
  });

  const navigate = useNavigate();

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
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
    return products.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]);

  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id);

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

  return (
    <div style={{ padding: 20, maxWidth: 1000, margin: "auto" }}>
      <Typography variant="h5" gutterBottom>
        Product List
      </Typography>

      <TextField
        label="Search Product"
        variant="outlined"
        fullWidth
        size="small"
        margin="normal"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Name</b></TableCell>
              <TableCell align="right"><b>Purchase (₹)</b></TableCell>
              <TableCell align="right"><b>Sale (₹)</b></TableCell>
              <TableCell align="center"><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell align="right">
                    ₹{product.purchaseAmount}
                  </TableCell>
                  <TableCell align="right">
                    ₹{product.saleAmount}
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() => navigate(`/add/${product.id}`)}
                      >
                        <FaRegEdit />

                      </Button>

                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() =>
                          setConfirm({ open: true, id: product.id })
                        }
                      >
                        <MdDelete />
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No products found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
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
