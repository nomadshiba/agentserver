import { tags, toChild } from "@purifyjs/core";
import { Chat } from "~/frontend/components/Chat.ts";
import { ChatNavigation } from "~/frontend/components/ChatNavigation.ts";
import { NewChat } from "~/frontend/components/NewChat.ts";
import { awaited } from "~/frontend/kit/awaited.ts";
import { useReplaceChildren } from "~/frontend/kit/bind.ts";
import { css } from "~/frontend/kit/css.ts";
import { unroll } from "~/frontend/kit/unroll.ts";
import { chatId } from "~/frontend/url.ts";

function App() {
    const { body, header, main, progress } = tags;
    const self = body().$bind(AppStyle.useScope());

    const navigation = awaited(ChatNavigation(), progress());

    const chat = chatId.derive((chatId) => awaited(chatId ? Chat(chatId) : NewChat(), progress())).pipe(unroll);

    self.append$(
        header().$bind(useReplaceChildren(navigation)),
        main().$bind(useReplaceChildren(chat)),
    );

    return self;
}

const AppStyle = css`
    :scope {
        display: block grid;
        grid-template-columns: 15em 1fr;
        color: var(--pop);
        background-color: var(--layout-base);
        gap: var(--layout-gap);
    }

    header {
        display: block grid;
        position: sticky;
        inset-block-start: 0;
        block-size: 100dvb;

        background-color: var(--base);
        z-index: 1;
    }

    main {
        display: block grid;
    }

    @container (inline-size < 50em) {
        :scope {
            grid-template-columns: 1fr;
        }

        header {
            display: none;
            position: fixed;
            inline-size: min(100%, 20em);
        }
    }
`;

const GlobalStyle = css`
    :root {
        --base: hsl(240, 12%, 11%);
        --pop: hsl(0, 0%, 96%);
        --surface: color-mix(in srgb, var(--base), currentcolor 8%);
        --surface-strong: color-mix(in srgb, var(--base), currentcolor 14%);

        --accent-base: hsl(240, 50%, 50%);
        --accent-pop: hsl(240, 50%, 98%);
        --accent-surface: color-mix(in srgb, var(--accent-base), currentcolor 8%);

        --layout-base: hsl(240, 12%, 12%);
        --layout-pop: hsl(0, 0%, 96%);
        --layout-surface: color-mix(in srgb, var(--layout-base), currentcolor 8%);

        --muted-low: color-mix(in srgb, currentcolor, transparent 35%);
        --muted-mid: color-mix(in srgb, currentcolor, transparent 45%);
        --muted-high: color-mix(in srgb, currentcolor, transparent 88%);

        --border: var(--muted-high);
        --radius: 0.35em;
        --layout-gap: 0.625em;
        --layout-radius: 0.75em;

        --text-xs: 0.75em;
        --text-sm: 0.8125em;
        --text-md: 0.875em;
        --text-lg: 1.125em;

        --weight-regular: 400;
        --weight-medium: 600;
        --weight-bold: 700;

        accent-color: var(--accent-base);
        font-family: monospace;
        font-size: 1rem;
        line-height: 1.55;
    }

    *, *::before, *::after {
        box-sizing: border-box !important;
        margin: 0;
        text-box-trim: trim-both;
    }

    ol, ul, menu {
        padding: 0;
        list-style: none;
    }

    button {
        appearance: none;
        background-color: transparent;
        color: currentcolor;
        padding: 0;
        border: none;
    }

    dialog:where([open]) {
        all: unset;
        user-select: text;
        cursor: auto;
        position: fixed;
        inset-block: 0;
        inset-inline-end: 0;
        inline-size: min(100%, 30em);
        background-color: var(--base);

        overflow-y: auto;
        overscroll-behavior: contain;
        scrollbar-gutter: stable;
        scrollbar-width: thin;

        &::backdrop {
            background-color: color-mix(in srgb, black, transparent 45%);
        }
    }

    html {
        container-type: inline-size;
        container-name: root;
    }
`;

document.adoptedStyleSheets.push(GlobalStyle.sheet());
document.body.replaceWith(toChild(App()));
