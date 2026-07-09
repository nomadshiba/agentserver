import { tags } from "@purifyjs/core";
import { api } from "~/frontend/api.ts";
import { css } from "~/frontend/kit/css.ts";
import { ProviderManager } from "~/frontend/components/ProviderManager.ts";
import { chatId } from "~/frontend/url.ts";

export async function ChatNavigation() {
    const { nav, ul } = tags;
    const self = nav().id("primary-nav").ariaLabel("Primary Navigation");
    self.$bind(ChatNavigationStyle.useScope());

    const chats = await api.fetch("GET /v1/chats", { params: { pathname: {}, search: {} } });

    self.append$(NewChatLink(), ul().id("chats").ariaLabel("Chat Rooms").append$(chats.map(ChatNavigationItem)), ProviderManager());

    return self;
}

export function NewChatLink() {
    const { a } = tags;
    // Bare `#` clears location.hash, which routes App() back to the NewChat view.
    return a().href("#")
        .id("new-chat")
        .ariaCurrent(chatId.derive((id) => id ? null : "page"))
        .textContent("+ New Chat");
}

export function ChatNavigationItem(chat: { id: string; name: string }) {
    const { a, li } = tags;
    return li().append$(
        a().href(`#${chat.id}`)
            .id(`chat-${chat.id}`)
            .ariaCurrent(chatId.derive((id) => chat.id === id ? "page" : null))
            .textContent(chat.name),
    );
}

const ChatNavigationStyle = css`
    :scope {
        display: block grid;
        grid-template-rows: auto 1fr auto;
        gap: 1em;

        padding-inline: 0.6em;
        padding-block: 1em;
        overflow: hidden;
    }

    ul {
        list-style: none;
        display: block grid;
        gap: 0.3em;
        align-content: start;

        grid-auto-rows: max-content;
        overflow-y: auto;
        scrollbar-width: thin;
    }

    li {
        display: contents;
    }

    a {
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

        &[aria-current="page"] {
            font-weight: var(--weight-medium);
            color: var(--accent-pop);
            background-color: var(--accent-base);
        }
    }

    #new-chat {
        background-color: color-mix(in srgb, var(--base), var(--pop) 5%);
        color: var(--pop);

        &:hover {
            background-color: color-mix(in srgb, var(--accent-base), white 10%);
        }

        &[aria-current="page"] {
            font-weight: var(--weight-medium);
            color: var(--accent-pop);
            background-color: var(--accent-base);
        }
    }
`;
