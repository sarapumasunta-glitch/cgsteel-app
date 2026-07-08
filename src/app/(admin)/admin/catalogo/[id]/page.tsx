import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProductForm from "../ProductForm";
import DeleteProductButton from "./DeleteProductButton";
import { updateProduct } from "./actions";

export default async function EditarProductoPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!product) {
    notFound();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-industrial-blue">{product.name}</h1>
        <DeleteProductButton productId={product.id} />
      </div>
      <div className="mt-6">
        <ProductForm
          product={product}
          action={updateProduct.bind(null, product.id)}
          submitLabel="Guardar cambios"
        />
      </div>
    </div>
  );
}
