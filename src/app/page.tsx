"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "@/providers/authProvider";
import LandingPage from "./(dashboards)/landing/page";

export default function Home() {
  const router = useRouter();
  const { user, isSuccess } = useAuthState();

  useEffect(() => {
    if (isSuccess && user) {
      router.push("/dashboard");
    }
  }, [isSuccess, user, router]);

  // Show landing page while checking auth or if user is not logged in
  if (!isSuccess || !user) {
    return <LandingPage />;
  }

  // Show loading while redirecting
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <div>Loading...</div>
    </div>
  );
}
