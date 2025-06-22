import Link from "next/link";
import LoginForm from "./LoginForm";

export const metadata = {
  title: "PudinaMart - Login",
};

const Login = () => {
  console.log(process.env.NODE_ENV);
  return (
    <div className="w-full flex justify-center">
      <div className="w-[30rem] h-max flex flex-col gap-5 p-7 rounded-md border-2 shadow-2xl">
        <div className="text-4xl font-bold flex flex-col self-start mb-5">
          <span>Login</span>
          <span className="font-light">to PudinaMart</span>
        </div>

        <LoginForm />

        <div className="text-center">
          <span>Don&#39;t have an account? </span>{" "}
          <Link href={"/auth/signup"} className="underline">
            Signup
          </Link>
        </div>
      </div>
    </div>
  );
};
export default Login;
