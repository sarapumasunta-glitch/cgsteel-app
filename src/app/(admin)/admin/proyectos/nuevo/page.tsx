import NewProjectForm from "./NewProjectForm";

export default function NuevoProyectoPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-industrial-blue">
        Nuevo proyecto
      </h1>
      <div className="mt-6">
        <NewProjectForm />
      </div>
    </div>
  );
}
