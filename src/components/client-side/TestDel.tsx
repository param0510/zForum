"use client";

import { useSession } from "next-auth/react";

const TestDel = () => {
  const { data: session } = useSession();
  console.log(session);

  return <div>TestDel</div>;
};

export default TestDel;
