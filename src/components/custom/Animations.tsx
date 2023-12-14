import { cn } from "@/lib/utils";
import { Loader2, LucideProps } from "lucide-react";

const Animations = {
  spinner: (props: LucideProps) => (
    <Loader2
      className={cn("animate-spin text-zinc-500", props.className || "h-6 w-6")}
    />
  ),
};

export default Animations;
