import { IGridRevealResponse } from "/src/types";

export function isValidHttpUrl(urlString: string): boolean {
    let url;

    try {
        url = new URL(urlString);
    } catch (_) {
        return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
}

export const sendRenderRequestToApi = (url: string, textLength?: number|undefined, sizeThreshold?: number|undefined): Promise<IGridRevealResponse> => {
    const API_ENDPOINT = `https://europe-west1-grid-reveal.cloudfunctions.net/render`;

    const query = [
        `url=${url}`,
        textLength? `text_length=${textLength}`: undefined,
        sizeThreshold? `size_threshold=${sizeThreshold}`: undefined,
    ].filter((a) => a&&a).join("&");

    return fetch(`${API_ENDPOINT}?${query}`).then((results) => results.json());
}