import { IMAGES } from "@/utils/constants";

export const staticSeo = {
  default: {
    title: "Home",
    description: "Online store",
    image: IMAGES.logo,
    canonical: "/",
  },
  register : {
    title: "Register",
    description: "Create your account",
    image: IMAGES.logo,
    canonical: "/customer/register",
  },
  login: {
    title: "Login",
    description: "Sign in to your account",
    image: IMAGES.logo,
    canonical: "/customer/login",
  },
  forget:{
    title: "Forgot Password",
  description: "Reset your account password",
  image: IMAGES.logo,
  canonical: "/customer/forget-password",
  }
};
