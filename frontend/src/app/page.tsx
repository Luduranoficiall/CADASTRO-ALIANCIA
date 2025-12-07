"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import Loader from "../components/Loader";

export default function Home() {
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const ref = params.get("ref");
    if (ref) {
      localStorage.setItem("ref", ref);
      router.push("/cadastro");
    } else {
      router.push("/login");
    }
  }, []);

  return <Loader />;
}
}
