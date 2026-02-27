"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Documents dashboard page has been deprecated; documents should be accessed
 * via their related entities. Redirect any direct navigation to the main
 * dashboard to avoid orphaned views.
 */
const DocumentsPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);

  return null;
};

export default DocumentsPage;
