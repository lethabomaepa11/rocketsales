"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Contacts dashboard page has been deprecated; users should access
 * contact information through client or opportunity detail views.
 * Redirect any direct navigation to the main dashboard.
 */
const ContactsPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);

  return null;
};

export default ContactsPage;
