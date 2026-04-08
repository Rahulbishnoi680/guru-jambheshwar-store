import { useEffect, useMemo, useState } from "react";
import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../supabase";
import toast from "react-hot-toast";
// import { Autocomplete, TextField } from "@mui/material";

type FormValues = {
  name: string;
  // parentId: number | null;
  purchaseAmount: number | "";
  saleAmount: number | "";
};

// type ParentOption = {
//   id: number;
//   name: string;
// };

const AddProduct = () => {
  const { id } = useParams();
  const isEdit = useMemo(() => Boolean(id), [id]);
  const [initialValues, setInitialValues] = useState<FormValues>({
    name: "",
    // parentId: null,
    purchaseAmount: "",
    saleAmount: "",
  });
  // const [parentOptions, setParentOptions] = useState<ParentOption[]>([]);
  const navigate = useNavigate();

  const fetchParents = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("id, name")
      .order("name");

    if (error) {
      console.error("Failed to load parent options", error);
    } else if (data) {
      // Avoid circular dependency by removing current product from options
      // const filteredOptions = id
      //   ? data.filter((item) => item.id !== Number(id))
      //   : data;
      // setParentOptions(filteredOptions as ParentOption[]);
    }
  };

  useEffect(() => {
    fetchParents();
    const fetchById = async () => {
      if (!id) return;
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", Number(id))
        .single();
      if (error) {
        toast.error("Failed to load product");
      } else if (data) {
        setInitialValues({
          name: data.name ?? "",
          // parentId: data.parent_id ?? null,
          purchaseAmount: data.purchaseAmount ?? "",
          saleAmount: data.saleAmount ?? "",
        });
      }
    };
    fetchById();
  }, [id]);

  const schema = Yup.object({
    name: Yup.string()
      .trim()
      .min(2, "Name min 2 chars")
      .required("Name is required"),
    parentId: Yup.number().nullable(),
    // purchaseAmount: Yup.number().typeError("Purchase must be a number").min(0, "Purchase must be ≥ 0").required("Purchase is required"),
    // saleAmount: Yup.number().typeError("Sale must be a number").min(0, "Sale must be ≥ 0").required("Sale is required"),
  });

  const onSubmit = async (
    values: FormValues,
    { setSubmitting, resetForm }: FormikHelpers<FormValues>,
  ) => {
    try {
      const payload = {
        name: values.name,
        // parent_id: values.parentId,
        purchaseAmount: Number(values.purchaseAmount),
        saleAmount: Number(values.saleAmount),
      };

      if (isEdit && id) {
        const { error } = await supabase
          .from("products")
          .update(payload)
          .eq("id", Number(id));
        if (error) throw error;
        toast.success("Product updated");
      } else {
        const { error } = await supabase.from("products").insert([payload]);
        if (error) throw error;
        toast.success("Product added");
        resetForm();
      }
      navigate("/list");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Something went wrong";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pb-16 w-full">
      <div className="mx-auto max-w-md p-4">
        <h1 className="text-xl font-semibold text-gray-900 mb-3">
          {isEdit ? "Edit Product" : "Add Product"}
        </h1>
        <Formik
          initialValues={initialValues}
          enableReinitialize
          validationSchema={schema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <Field
                  name="name"
                  placeholder="Product name"
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-sm text-rose-600 mt-1"
                />
              </div>
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Parent (e.g. Tea)</label>
                <Autocomplete
                  options={parentOptions}
                  getOptionLabel={(option) => option.name || ""}
                  value={parentOptions.find((opt) => opt.id === values.parentId) || null}
                  onChange={(_, newValue) => {
                    setFieldValue("parentId", newValue ? newValue.id : null);
                  }}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Search and select parent product"
                      size="small"
                      className="bg-white"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "6px",
                          "& fieldset": {
                            borderColor: "#d1d5db",
                          },
                          "&:hover fieldset": {
                            borderColor: "#9ca3af",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#6366f1",
                          },
                        },
                      }}
                    />
                  )}
                />
                <ErrorMessage name="parentId" component="div" className="text-sm text-rose-600 mt-1" />
              </div> */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Purchase Amount
                </label>
                <Field
                  name="purchaseAmount"
                  type="number"
                  placeholder="0"
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <ErrorMessage
                  name="purchaseAmount"
                  component="div"
                  className="text-sm text-rose-600 mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Sale Amount
                </label>
                <Field
                  name="saleAmount"
                  type="number"
                  placeholder="0"
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <ErrorMessage
                  name="saleAmount"
                  component="div"
                  className="text-sm text-rose-600 mt-1"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-md bg-orange-600 text-white py-2 font-medium hover:bg-orange-700 disabled:opacity-60"
              >
                {isEdit ? "Update Product" : "Add Product"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddProduct;
