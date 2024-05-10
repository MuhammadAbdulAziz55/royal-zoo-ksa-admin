import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

const SearchOrders = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((text: string) => {
    console.log(`Searching... ${text}`);

    const params = new URLSearchParams(searchParams);
    if (text) {
      params.set("query", text);
      params.delete("page");
    } else {
      params.delete("query");
      // params.delete("page");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 800);

  //   function handleSearch(text: string) {
  //     const params = new URLSearchParams(searchParams);

  //     if (text) {
  //       params.set("query", text);
  //     } else {
  //       params.delete("query");
  //     }
  //     replace(`${pathname}?${params.toString()}`);
  //     }

  return (
    <div>
      <Input
        type="text"
        placeholder="search"
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get("query")?.toString()}
      />
    </div>
  );
};

export default SearchOrders;
