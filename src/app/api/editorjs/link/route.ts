import og from "open-graph";

export async function GET(req: Request) {
  //   const reqBody = await req.json();
  console.log(og);

  const url =
    "https://www.gobankingrates.com/money/wealth/robert-kiyosaki-passive-income-ideas/amp/";
  og(
    url,
    async (err, meta) => {
      console.log({ meta, err });

      if (meta) {
        return new Response("JSON.stringify(meta), { status: 400 }");
      } else {
        return new Response(JSON.stringify(err), { status: 500 });
      }
    },
    {
      strict: false,
    },
  );
  //   return new Response("this work");
}
