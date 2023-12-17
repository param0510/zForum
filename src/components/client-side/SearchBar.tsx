"use client";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/shadcn-ui/Command";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";
import { toast } from "@/hooks/use-toast";
import { Community } from "@prisma/client";
import axios from "axios";
import debounce from "lodash.debounce";
import { Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";

const SearchBar = () => {
  const [input, setInput] = useState("");
  const router = useRouter();
  const [communities, setCommunities] = useState<string[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [emptyIsShowing, setEmptyIsShowing] = useState(false);
  const commandRef = useRef<HTMLDivElement>(null);

  // Used for detecting any blur events on the search bar
  useOnClickOutside(commandRef, () => {
    setInput("");
  });

  const getCommunites = async (nameQuery: string) => {
    // console.log("fetch is run");
    try {
      setIsLoading(true);
      const { data } = await axios.get<Community[]>(
        `${window.location.origin}/api/c?name=${nameQuery}`,
      );
      setCommunities(data.map(({ name }) => name));
    } catch (error) {
      toast({
        title: "Something went wrong!",
        description: "Couldn't fetch communities. Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setEmptyIsShowing(true);
    }
  };

  // function used to debounce/cancel consecutive function calls till a provided number of miliseconds of not evoking the function - (lodoash.debounce package)
  const debouncedFetch = useCallback(debounce(getCommunites, 500), []);

  const searchFn = (value: string) => {
    setInput(value);
    if (emptyIsShowing) setEmptyIsShowing(false);
    if (value.trim().length === 0) {
      setCommunities(undefined);
      return;
    }
    // if (!isLoading) setIsLoading(true);
    // this cancels all the consecutive calls to it for 500 ms
    debouncedFetch(value);
  };

  return (
    <div className="max-w-lg grow">
      <Command
        ref={commandRef}
        className="relative z-50 overflow-visible rounded-lg border"
      >
        <CommandInput
          isLoading={isLoading}
          className="border-none outline-none ring-0 focus:border-none focus:outline-none"
          placeholder="Search communities..."
          value={input}
          onValueChange={(val: string) => {
            searchFn(val);
          }}
        />
        {!!input.trim().length && (
          <CommandList className="absolute inset-x-0 top-full rounded-b-md bg-white shadow">
            <CommandEmpty hidden={!emptyIsShowing}>
              No results found.
            </CommandEmpty>
            {!!communities?.length && (
              <CommandGroup heading="Communities">
                {communities.map((comName) => (
                  <CommandItem
                    key={comName}
                    value={comName}
                    className="cursor-pointer"
                    onSelect={(e: string) => {
                      router.push(`/c/view/${e}`);
                      router.refresh();
                      setInput("");
                    }}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    c/{comName}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        )}
      </Command>
    </div>
  );
};

export default SearchBar;
