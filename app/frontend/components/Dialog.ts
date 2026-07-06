import { tags } from "@purifyjs/core";
import { css } from "~/frontend/kit/css.ts";

export function Dialog() {
    const { dialog } = tags;
    const self = dialog().$bind(DialogStyle.useScope());

    return self;
}

const DialogStyle = css`
    :scope[open] {
        all: unset;
        display: block grid;
        align-content: start;
        padding: 1em;
        position: fixed;
        inset-block: 0;
        inset-inline-end: 0;
        inline-size: min(100%, 30em);
        background-color: var(--base);
    }
`;
