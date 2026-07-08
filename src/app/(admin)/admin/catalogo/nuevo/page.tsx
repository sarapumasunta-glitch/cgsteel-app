import ProductForm from "../ProductForm";
import { createProduct } from "./actions";

export default function NuevoProductoPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-industrial-blue">Nuevo producto</h1>
      <div className="mt-6">
        <ProductForm action={createProduct} submitLabel="Crear producto" />
      </div>
    </div>
  );
}
