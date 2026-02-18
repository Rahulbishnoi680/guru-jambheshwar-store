import { useEffect, useState } from "react";
import { supabase } from "../../supabase";

interface Product {
  id?: number;
  name: string;
  purchaseAmount: number;
  saleAmount: number;
}

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState("");
  const [purchase, setPurchase] = useState("");
  const [sale, setSale] = useState("");
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState<number | null>(null);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: false });

    if (!error && data) setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async () => {
    if (!name || !purchase || !sale) return;

    if (editId) {
      await supabase
        .from("products")
        .update({
          name,
          purchaseAmount: Number(purchase),
          saleAmount: Number(sale),
        })
        .eq("id", editId);

      setEditId(null);
    } else {
      await supabase.from("products").insert([
        {
          name,
          purchaseAmount: Number(purchase),
          saleAmount: Number(sale),
        },
      ]);
    }

    setName("");
    setPurchase("");
    setSale("");
    fetchProducts();
  };

  const handleDelete = async (id: number) => {
    await supabase.from("products").delete().eq("id", id);
    fetchProducts();
  };

  const handleEdit = (product: Product) => {
    setName(product.name);
    setPurchase(product.purchaseAmount.toString());
    setSale(product.saleAmount.toString());
    setEditId(product.id || null);
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: 20, maxWidth: 500, margin: "auto" }}>
      <h2>Shop Management</h2>

      <input
        placeholder="Search Product"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      />

      <input
        placeholder="Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ width: "100%", marginBottom: 5 }}
      />

      <input
        placeholder="Purchase Amount"
        type="number"
        value={purchase}
        onChange={(e) => setPurchase(e.target.value)}
        style={{ width: "100%", marginBottom: 5 }}
      />

      <input
        placeholder="Sale Amount"
        type="number"
        value={sale}
        onChange={(e) => setSale(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      />

      <button
        onClick={handleSubmit}
        style={{
          width: "100%",
          padding: 10,
          background: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: 5,
        }}
      >
        {editId ? "Update Product" : "Add Product"}
      </button>

      <hr />

      {filteredProducts.map((p) => (
        <div
          key={p.id}
          style={{
            border: "1px solid #ddd",
            padding: 10,
            marginTop: 10,
            borderRadius: 5,
          }}
        >
          <h4>{p.name}</h4>
          <p>Purchase: ₹{p.purchaseAmount}</p>
          <p>Sale: ₹{p.saleAmount}</p>
          <p>Profit: ₹{p.saleAmount - p.purchaseAmount}</p>

          <button onClick={() => handleEdit(p)}>Edit</button>
          <button
            onClick={() => handleDelete(p.id!)}
            style={{ marginLeft: 10 }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
