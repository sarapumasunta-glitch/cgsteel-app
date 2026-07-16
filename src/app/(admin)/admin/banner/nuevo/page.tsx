import NewBannerItemForm from "./NewBannerItemForm";

export default function NuevoBannerItemPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-industrial-blue">
        Nuevo item del banner
      </h1>
      <div className="mt-6">
        <NewBannerItemForm />
      </div>
    </div>
  );
}
