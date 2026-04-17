import { EditorSelection } from "@codemirror/state";
import type { Root } from "mdast";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { describe, expect, it } from "vitest";

import { collectLivePreviewRanges } from "../src/live-preview-ranges";

function parse(markdown: string): Root {
  return unified().use(remarkParse).parse(markdown) as Root;
}

describe("live preview ranges", () => {
  it("collects stable ranges for block and image previews", () => {
    const doc = "Intro\n\n# Heading\n\n> Quote\n\n![Alt](https://example.com/image.png)";
    const ranges = collectLivePreviewRanges(
      parse(doc),
      doc,
      [EditorSelection.cursor(0)]
    );

    expect(ranges.map((range) => range.node.type)).toEqual(["heading", "blockquote", "image"]);
    expect(ranges.at(-1)?.source).toBe("![Alt](https://example.com/image.png)");
  });

  it("omits inline ranges when cursor is on the same line", () => {
    const doc = "Text **bold** *italic*\n\nother line";
    // Cursor on same line as bold+italic → both omitted
    const rangesSameLine = collectLivePreviewRanges(
      parse(doc),
      doc,
      [EditorSelection.cursor(8)]
    );
    expect(rangesSameLine.map((r) => r.node.type)).toEqual([]);

    // Cursor on different line → both collected
    const rangesDiffLine = collectLivePreviewRanges(
      parse(doc),
      doc,
      [EditorSelection.cursor(doc.length)]
    );
    expect(rangesDiffLine.map((r) => r.node.type)).toEqual(["strong", "emphasis"]);
  });
});
