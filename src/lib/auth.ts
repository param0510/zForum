import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";

export const getServerAuthSession = () => getServerSession(authOptions);
