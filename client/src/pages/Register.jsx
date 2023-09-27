import { Link, Form, redirect, useNavigation } from "react-router-dom";
import Wrapper from "../assets/wrappers/RegisterAndLoginPage";
import { FormRow, Logo, SubmitBtn } from "../components";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";

export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  try {
    await customFetch.post("/auth/register", data);
    toast.success("Registration successful");
    return redirect("/login"); //  must return any value
  } catch (error) {
    console.log(error);
    console.log(error?.response?.data?.error);
    toast.error(error?.response?.data?.error);
    return error;
  }
};

const Register = () => {
  return (
    <Wrapper>
      <Form method="POST" className="form">
        <Logo />
        <h4>Register</h4>

        <FormRow name="name" defaultValue="john" type="text" />
        <FormRow
          labelText="last name"
          name="lastName"
          defaultValue="smith"
          type="text"
        />
        <FormRow name="location" type="text" />
        <FormRow name="email" type="email" />
        <FormRow name="password" type="password" />

        <SubmitBtn />

        <p>
          Already a member?
          <Link to="/login" className="member-btn">
            Login
          </Link>
        </p>
      </Form>
    </Wrapper>
  );
};

export default Register;
