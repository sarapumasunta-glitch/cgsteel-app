import NewServiceForm from "./NewServiceForm";

export default function NuevoServicioPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-industrial-blue">Nuevo servicio</h1>
      <div className="mt-6">
        <NewServiceForm />
      </div>
    </div>
  );
}
