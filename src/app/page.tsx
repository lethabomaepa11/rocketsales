"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "@/providers/authProvider";
import LandingPage from "./(dashboards)/landing/page";
import { useStyles } from "./style/page.style";

export default function Home() {
  const router = useRouter();
  const { user, isSuccess } = useAuthState();
  const { styles } = useStyles();

  useEffect(() => {
    if (isSuccess && user) {
      router.push("/dashboard");
    }
  });

  // Show landing page while checking auth or if user is not logged in
  if (!isSuccess || !user) {
    return <LandingPage />;
  }

  // Show loading while redirecting
  return (
    <div className={styles.loadingContainer}>
      <div>Loading...</div>
    </div>
  );
}
