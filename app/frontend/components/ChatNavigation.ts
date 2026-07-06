import { tags } from "@purifyjs/core";
import { Codec } from "@nomadshiba/codec";
import { api } from "~/frontend/api.ts";
import { ChatOutput } from "~/backend/handlers/chats/ChatOutput.ts";
import { css } from "~/frontend/kit/css.ts";

export async function ChatNavigation() {
    const { nav } = tags;
    const self = nav().id("chats").ariaLabel("Chat Rooms");
    self.$bind(ChatNavigationSheet.useScope());

    const chats = await api.fetch("GET /v1/chats", { params: { pathname: {}, search: {} } });

    self.append$(chats.map(ChatNavigationItem));

    return self;
}

export function ChatNavigationItem(chat: Codec.InferOutput<typeof ChatOutput>) {
    const { a } = tags;
    return a().href(`#${chat.id}`).id(`chat-${chat.id}`).textContent(chat.name);
}

const ChatNavigationSheet = css`
    :scope {
        display: block grid;
        gap: 0.3em;
        align-content: start;

        padding-inline: 0.6em;
        padding-block: 1em;
    }

    a {
        display: block grid;
        align-items: center;
        padding-inline: 0.7em;
        padding-block: 0.55em;
        border-radius: var(--radius);
        background-color: color-mix(in srgb, var(--base), var(--pop) 5%);
        color: var(--pop);
        font-size: var(--text-md);

        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-decoration: none;
        transition: background-color 0.12s ease;

        &:hover {
            background-color: var(--surface-hover-strong);
        }
    }
`;
