import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabase";
import toast from "react-hot-toast";
import { loginLocal } from "../../utils/auth";

type Values = {
  userName: string;
  password: string;
};

const schema = Yup.object({
  userName: Yup.string().trim().min(3, "Kam se kam 3 letters").required("User name required"),
  password: Yup.string().min(3, "Kam se kam 3 letters").required("Password required"),
});

const Login = () => {
  const navigate = useNavigate();

  const submit = async (values: Values, { setSubmitting }: FormikHelpers<Values>) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("userName", values.userName)
        .eq("password", values.password)
        .maybeSingle();
      if (error) throw error;
      if (!data) {
        toast.error("Galat userName ya password");
        return;
      }
      loginLocal(values.userName);
      toast.success("Login successful");
      navigate("/list", { replace: true });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Login failed";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm bg-white rounded-lg shadow p-6">
        <h1 className="text-xl font-semibold text-gray-900 mb-4">Login</h1>
        <Formik initialValues={{ userName: "", password: "" }} validationSchema={schema} onSubmit={submit}>
          {({ isSubmitting }) => (
            <Form className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">User Name</label>
                <Field
                  name="userName"
                  placeholder="Enter user name"
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <ErrorMessage name="userName" component="div" className="text-sm text-rose-600 mt-1" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <Field
                  name="password"
                  type="password"
                  placeholder="••••••"
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <ErrorMessage name="password" component="div" className="text-sm text-rose-600 mt-1" />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-md bg-indigo-600 text-white py-2 font-medium hover:bg-indigo-700 disabled:opacity-60"
              >
                Login
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;
