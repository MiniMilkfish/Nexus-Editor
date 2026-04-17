import { describe, expect, it } from "vitest";

import { createHistoryPlugin } from "../../plugin-history/src/index";
import { createEditor } from "../src/index";

describe("live preview regressions", () => {
  it("keeps live preview working when the history plugin is registered", () => {
    const container = document.createElement("div");
    const editor = createEditor({
      container,
      initialValue: "Text **bold**\n\nend",
      livePreview: true,
      plugins: [createHistoryPlugin()]
    });

    const content = container.querySelector("[contenteditable='true']");

    // Move cursor away from the bold line
    editor.setSelection(editor.getDocument().length);

    editor.setDocument("Text **changed**\n\nend");
    editor.setSelection(editor.getDocument().length);

    content?.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "z",
        ctrlKey: true,
        bubbles: true,
        cancelable: true
      })
    );

    // Cursor on different line → markers hidden
    editor.setSelection(editor.getDocument().length);

    const text = container.textContent ?? "";
    expect(text).toContain("bold");
    expect(text).not.toContain("**");
    editor.destroy();
  });

  it("restores preview after the cursor leaves a markdown range", () => {
    const container = document.createElement("div");
    const editor = createEditor({
      container,
      initialValue: "Text **bold** end\n\nother line",
      livePreview: true
    });

    // Cursor on bold line: raw markdown visible
    editor.setSelection(8);
    expect(container.textContent).toContain("**bold**");

    // Cursor moves to different line: markers hidden
    editor.setSelection(editor.getDocument().length);

    const text = container.textContent ?? "";
    expect(text).toContain("bold");
    expect(text).not.toContain("**");
    editor.destroy();
  });
});
