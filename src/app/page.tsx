import Home from "@/layouts/Home";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Construction Materials eCommerce | Ayceebuilder Nigeria",
  description: "Shop for high-quality construction materials online. Your one-stop builder for all construction needs in Nigeria.",
  openGraph: {
    title: "Construction Materials eCommerce | Ayceebuilder Nigeria",
    description: "Shop for high-quality construction materials online. Your one-stop builder for all construction needs in Nigeria.",
  }
};

export default function page() {
  return <Home />;
}
