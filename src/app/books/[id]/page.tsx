
import { Suspense } from "react";
import BookDetails from "./BookDetails";

export default function BookDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<p className="py-10 text-center">Loading book...</p>}>
      <BookDetails params={params} />
    </Suspense>
  );
}
