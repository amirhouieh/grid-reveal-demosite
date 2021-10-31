import React, { MouseEventHandler, useState } from "react";
import { isValidHttpUrl, sendRenderRequestToApi } from "/src/utils";
import ReactCompareImage from "react-compare-image";
import { IGridRevealResponse } from "/src/types";

type TButtonFn = MouseEventHandler<HTMLButtonElement>;

export const App: React.FC<{}> = ()=> {
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<null|string>(null);
    const [url, setUrl] = useState<string>("");
    const [res, setRes] = useState<IGridRevealResponse|null>(null);
    const [sizeThreshold, setSizeThreshold] = useState<number|undefined>(0.01);
    const [textLength, setTextLength] = useState<number|undefined>(100);

    const onInputSubmit: TButtonFn = async() => {
        if(!isValidHttpUrl(url)){
            alert("The url does not have a valid format :/")
        }
        setBusy(true);
        setRes(null);

        try{
            setRes(await sendRenderRequestToApi(url, textLength, sizeThreshold))
            setBusy(false);
        }catch (e){
            setRes(null);
            setError(e.message);
            setBusy(false);
        }
    }

    let status = `Ready ☘️`;

    if(error){
        status = `Opps 💔 ${error}`
    }

    if(busy && url){
        status = `Drawing the grid 🎠 . 🎠 . 🎠 .`
    }

    return (
        <>
            <header>
                <div className={"logo"}>
                    <h2>
                        <a href={"https://github.com/amirhouieh/grid-reveal"}>Grid Reveal</a>
                    </h2>
                    <img className={"npm-badge"}
                         src={"https://badge.fury.io/js/grid-reveal@2x.png"}
                    />
                </div>
            </header>

            <div className={`content ${busy? "busy": ""}`}>
                <div className={"canvas"}>
                    {
                        res?
                        <ReactCompareImage leftImage={"data:image/png;base64, "+res.originalBase64}
                                           rightImage={"data:image/png;base64, "+res.gridBase64}
                        />
                            :
                            <span className={"status"}>
                                {status}
                            </span>
                    }
                </div>
                <div className={"controls"}>
                    <div className={"queryInput"}>
                        <input type="text"
                               className={"input"}
                               placeholder="Enter the url ..."
                               value={url}
                               onChange={event => setUrl(event.target.value)}
                               disabled={busy}
                        />
                    </div>
                    <div>
                        <input type={"number"}
                               className={"input"}
                               value={textLength}
                               onInput={(e) => setTextLength(parseInt(e.currentTarget.value))}
                               step={1}
                               min={0}
                               max={1000}
                               disabled={busy}
                        />
                        <label>Element's text length{textLength?` (${textLength})`:""})</label>
                    </div>
                    <div>
                        <div className={"rangeWrapper input"}>
                            <input type={"range"}
                                   min={0}
                                   max={0.5}
                                   value={sizeThreshold}
                                   onInput={(e) => setSizeThreshold(parseFloat(e.currentTarget.value))}
                                   step={0.01}
                                   disabled={busy}
                            />
                        </div>
                        <label>Element's size threshold{sizeThreshold?` (${sizeThreshold})`:""})</label>
                    </div>
                    <div className={"drawBtn"}>
                        <button onClick={onInputSubmit}
                                disabled={busy}
                        >
                            Draw
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}