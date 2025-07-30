import React, { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { CgLogIn } from "react-icons/cg";
import { PiUserCirclePlusFill, PiUserCirclePlusLight } from "react-icons/pi";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa6";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { BiLoader } from "react-icons/bi";
import { postData2 } from "../../utils/api";
import { MyContext } from "../../App";
import { toast } from "react-toastify";

function Login() {
  const context = useContext(MyContext);

  const [isLoading, setIsLoading] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState(false);

  const [formFields, setFormFields] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormFields(() => ({ ...formFields, [name]: value }));
  };

  const validValue = Object.values(formFields).every((el) => el);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formFields.email === "") {
      toast.error("Please add email!");
      return;
    } else if (formFields.password === "") {
      toast.error("Please add password!");
      return;
    }
    setIsLoading(true);
    postData2("/api/admin/login", formFields)
      .then((res) => {
        if (res?.success === true) {
          toast.success("Login Successful!");
          context.setIsLogin(true);
          setIsLoading(false);
          setFormFields({
            email: "",
            password: "",
          });
          navigate("/");
        } else {
          toast.error(res?.message);
          context.setIsLogin(false);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  return (
    <section className="bg-[#ffffff] bg flex !p-6 flex-col items-center w-full justify-center h-[100lvh]">
      <form
        className="bg-[#ffffff] border flex-wrap border-gray-300 rounded-md shadow-md !p-6  !mx-auto !my-auto !space-y-4"
        onSubmit={handleSubmit}
      >
        <div className="flex items-center justify center w-full gap-3">
          <img
            src="https://png.pngtree.com/png-vector/20240820/ourmid/pngtree-food-restaurant-logo-vector-png-image_13531729.png"
            className="h-16"
            alt="Logo"
          />
          <span className="self-center sm:text-2xl text-lg font-semibold whitespace-nowrap">
            Anurag fast food centre
          </span>
        </div>
        <div>
          <label
            htmlFor="email"
            className="block !mb-2 text-sm font-medium text-gray-900"
          >
            Email
          </label>
          <input
            type="email"
            onChange={onChangeInput}
            name="email"
            id="email"
            disabled={isLoading}
            value={formFields.email}
            className="bg-gray-50 border h-[50px] outline-gray-700 border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full !p-2"
            placeholder="name@company.com"
            required
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block !mb-2 text-sm font-medium text-gray-900"
          >
            Password
          </label>
          <div className="form-group w-full relative">
            <input
              id="password"
              label="Password"
              disabled={isLoading}
              type={isShowPassword ? "text" : "password"}
              variant="outlined"
              placeholder="••••••••"
              name="password"
              className="bg-gray-50 border h-[50px] outline-gray-700 border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full !p-2"
              value={formFields.password}
              onChange={onChangeInput}
            />
            <Button
              onClick={() => setIsShowPassword(!isShowPassword)}
              className="!absolute top-1 right-1 !rounded-full !min-h-[40px] !h-[40px] !min-w-[40px] !w-[40px] !text-gray-500"
            >
              {isShowPassword ? (
                <IoMdEyeOff size={"22px"} />
              ) : (
                <IoMdEye size={"22px"} />
              )}
            </Button>
          </div>
        </div>
        <Button
          disabled={!validValue || isLoading}
          type="submit"
          className="!w-full !text-white !capitalize !bg-blue-600 !hover:bg-blue-700 !focus:ring-4 !focus:outline-none !focus:ring-blue-300 !font-medium !rounded-lg !text-sm !px-5 !py-2.5 !text-center"
        >
          {isLoading ? (
            <BiLoader size={"22px"} className="animate-spin" />
          ) : (
            "Login"
          )}
        </Button>
      </form>
    </section>
  );
}

export default Login;
