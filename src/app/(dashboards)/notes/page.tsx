"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Notes dashboard page has been deprecated; notes should be viewed in the
 * context of their related entities. Redirect to the main dashboard when
 * accessed directly.
 */
const NotesPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);

  return null;
};

export default NotesPage;
