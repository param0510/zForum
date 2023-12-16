import { NextRequest, NextResponse } from "next/server";
import og from "open-graph";

// #REFRACTOR
export async function GET(req: NextRequest) {
  try {
    const url = req.nextUrl.searchParams.get("url");
    if (!url) {
      return new NextResponse("No 'url' query parameter found", {
        status: 400,
      });
    }
    // Change this later. Make this type safe
    const result: any = await new Promise((resolve, reject) => {
      og(url, (err, meta) => {
        if (err) {
          // console.error(err);
          reject(err);
          // res
        } else {
          // console.log(meta);
          resolve(meta);
        }
      });
    });

    if (result) {
      const responseObj = {
        success: 1,
        link: url,
        meta: result,
        // OR
        // meta: {
        //   title: result.title,
        //   description: result.description,
        //   image: {
        //     url: result.image.url,
        //   },
        // },
      };
      responseObj.link;
      // console.log("resp", responseObj);

      // const resultString = JSON.stringify(result);
      // console.log("resultString", resultString);
      return new NextResponse(JSON.stringify(responseObj), { status: 200 });
    } else {
      const responseObj = {
        success: 0,
        link: url,
        meta: {},
      };
      // console.log("No metadata found");
      return new NextResponse("No metadata found", { status: 404 });
    }
  } catch (error) {
    const responseObj = {
      success: 0,
      link: "",
      meta: {},
    };
    // console.error("Error fetching metadata:", error);
    return new NextResponse(JSON.stringify(error), { status: 500 });
  }
}
