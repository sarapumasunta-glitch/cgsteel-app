import NewTrustItemForm from "./NewTrustItemForm";

export default function NuevoTrustItemPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-industrial-blue">
        Nuevo cliente / marca
      </h1>
      <div className="mt-6">
        <NewTrustItemForm />
      </div>
    </div>
  );
}
