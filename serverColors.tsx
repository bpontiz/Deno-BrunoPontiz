// @deno-types="https://deno.land/x/types/react/v16.13.1/react.d.ts"
import React from "https://dev.jspm.io/react@16.13.1";
// @deno-types="https://deno.land/x/types/react-dom/v16.13.1/server.d.ts"
import ReactDOMServer from "https://dev.jspm.io/react-dom@16.13.1/server";
import { GetColorName } from "https://raw.githubusercontent.com/jeff3754/HexColorToColorName/master/src/index.ts";

const colores: string[] = []

import { serve } from "https://deno.land/std@0.106.0/http/mod.ts";

const port = 8080;

const server = serve({ port });

(async () => {
    for await (const req of server) {


    if(req.method === "POST") {
        const thedata = await Deno.readAll(req.body);
        const formData = new URLSearchParams(new TextDecoder().decode(thedata));
        const color = formData.get("color");
        if(color) {
            colores.push(color.toString());
        }
    }

    await req.respond({
        status: 200,
        headers: new Headers({
            "content-type": "text/html; charset=UTF-8",
        }),
        body: ReactDOMServer.renderToString(
            <html>
            <head>
                <meta charSet="utf-8" />
                <title>Deno Server</title>
            </head>
            <body style={{ backgroundColor: "black", padding: "2rem"}}>
                <h3 style={{color: "white"}}>Choose a color</h3>
                <form method="POST" action="/">
                    <label htmlFor="color" style={{color: "white"}}>New color: </label>
                    <input type="color" name="color" id="color" />
                    <input type="submit" value="Apply" style={{fontSize: "1rem", maxHeight: "1.35rem"}} />
                </form>
                <br /><br />
                {colores.length > 0 && 
                <>
                <h2 style={{color: "white"}}>Your colors:</h2>
                    <ul>
                        {colores.map((color, index) => {
                        return (
                            <li key={index} style={{color, fontSize: "1rem"}}>
                            {GetColorName(color)}
                            </li>
                        )
                        })}
                    </ul>
                </>
                }
            </body>
            </html>
        ),
        });
    }
})()



console.log(`Server is running on port http://localhost:${port}!`);