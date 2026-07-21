import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProductForm from "../ProductForm";
import DeleteProductButton from "./DeleteProductButton";
import ProductPhotoGallery from "./ProductPhotoGallery";
import AddProductPhotosForm from "./AddProductPhotosForm";
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

  const { data: images } = await supabase
    .from("product_images")
    .select("*")
    .eq("product_id", params.id)
    .order("display_order");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-industrial-blue">{product.name}</h1>
        <DeleteProductButton productId={product.id} />
      </div>
      <div className="max-w-2xl">
        <ProductForm
          product={product}
          action={updateProduct.bind(null, product.id)}
          submitLabel="Guardar cambios"
        />
      </div>

      <div className="bg-white rounded shadow p-6">
        <h2 className="font-bold text-industrial-blue mb-4">Fotos del producto</h2>
        <ProductPhotoGallery productId={product.id} images={images ?? []} />
      </div>

      <div className="bg-white rounded shadow p-6 max-w-2xl">
        <h2 className="font-bold text-industrial-blue mb-4">Agregar más fotos</h2>
        <AddProductPhotosForm productId={product.id} />
      </div>
    </div>
  );
}
