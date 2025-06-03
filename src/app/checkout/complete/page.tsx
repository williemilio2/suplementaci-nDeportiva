// /app/checkout/complete/page.tsx

import React, { Suspense } from "react";
import CompletePageClient from "./completePageClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <CompletePageClient />
    </Suspense>
  );
}
