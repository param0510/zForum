import { FC } from "react";

interface pageProps {
  searchParams: {
    info: string;
  };
}

const page: FC<pageProps> = ({ searchParams: { info } }) => {
  return <div>{info}</div>;
};

export default page;
