import { tags } from "@purifyjs/core";
import { ToolCall } from "~/backend/handlers/chats/messages/MessageContent.ts";
import { Markdown } from "~/frontend/components/Markdown.ts";
import { css } from "~/frontend/kit/css.ts";
import { StatusTextMixin } from "~/frontend/styles/StatusMixin.ts";
import { WeakRefMap } from "~/libs/collections/WeakRefMap.ts";

const modalCache = new WeakRefMap<string, ReturnType<typeof ToolCallModal>>();

export function ToolCallWidget(
    call: ToolCall,
    options: { streaming: boolean },
) {
    const { button, span } = tags;

    const status = call.value.result ? "Done" : options.streaming ? `Generating…${call.value.arguments.slice(-16)}` : "Running…";
    const busy = call.value.result ? "false" : "true";

    const { modal, update } = modalCache.getOrInsertComputed(call.value.id, () => ToolCallModal());
    modal.onclose((event) => event.currentTarget.remove());
    update(call);

    const self = button().type("button")
        .disabled(!modal)
        .$bind(ToolCallStyle.useScope())
        .append$(
            Markdown(call.value.display.summary),
            span().role("status").ariaBusy(busy).textContent(status),
        )
        .onclick(() => {
            if (!modal) return;
            document.body.append(modal.$node);
            modal.showModal();
        });

    return self;
}

const ToolCallStyle = css`
    :scope {
        all: unset;
        cursor: pointer;
        display: block grid;
        gap: 0.3em;
        cursor: pointer;
        padding-inline: 0.6em;
        padding-block: 0.3em;
        border-radius: var(--radius);
        font-size: var(--text-sm);
        font-weight: var(--weight-medium);
        color: var(--muted-low);
        background-color: var(--surface);
        transition: background-color 0.12s ease;

        &:hover {
            background-color: var(--surface-strong);
        }
    }

    x-markdown {
        display: inline;
    }

    ${StatusTextMixin};
`;

function ToolCallModal() {
    const { dialog, header, section, button, span } = tags;
    const self = dialog().$bind(ToolCallsModalStyle.useScope());

    const update = (call: ToolCall) => {
        const busy = call.value.result ? "false" : "true";

        self.replaceChildren$(
            header().append$(
                Markdown(call.value.display.summary),
                button().type("button").ariaLabel("Close").textContent("×").onclick(() => self?.close()),
            ),
            section().ariaLabel("Call").append$(
                span({ class: "label" }).textContent("Call"),
                Markdown(call.value.display.content),
            ),
            section().ariaLabel("Result").ariaBusy(call.value.result ? "false" : "true").append$(
                span({ class: "label" }).textContent("Result"),
                call.value.result ? Markdown(call.value.result.display) : span().ariaBusy(busy).role("status").textContent(status),
            ),
        );
    };

    return { modal: self, update };
}

const ToolCallsModalStyle = css`
    :scope[open] {
        display: block grid;
        align-content: start;
        inline-size: min(44em, 100vi);
    }

    header {
        display: block grid;
        grid-template-columns: 1fr auto;
        align-items: center;
        gap: 0.5em;
        padding-block: 0.85em;
        padding-inline: 1em;
        border-block-end: 1px solid var(--border);
    }

    header button {
        all: unset;
        cursor: pointer;
        font-size: 1.4em;
        line-height: 1;
        color: var(--current-medium);

        &:hover {
            color: var(--pop);
        }
    }

    section {
        display: block grid;
        gap: 0.5em;
        align-content: start;
        padding: 1em;

        &:not(:last-child) {
            border-block-end: 1px solid var(--border);
        }
    }

    .label {
        font-size: var(--text-xs);
        font-weight: var(--weight-medium);
        text-transform: uppercase;
        letter-spacing: 0.04em;
        color: var(--current-medium);
    }

    ${StatusTextMixin};
`;
