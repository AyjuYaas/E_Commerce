import DisplayProducts from "@/components/Home/DisplayProducts";
import FilterBar from "@/components/Home/FilterBar";

export const metadata = {
  title: "PinguinaMart",
};

export default function Home() {
  return (
    <div>
      <div className="flex flex-col gap-7">
        <section className="text-4xl flex flex-col">
          <span className="font-semibold">Our</span>
          <span className="font-extralight">Products</span>
        </section>

        <FilterBar />

        <hr />

        <DisplayProducts />
      </div>
    </div>
  );
}
