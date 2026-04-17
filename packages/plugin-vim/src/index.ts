import { vim } from "@replit/codemirror-vim";
import type { NexusPlugin } from "@nexus/core";

export function createVimPlugin(): NexusPlugin {
  return {
    name: "plugin-vim",
    cmExtensions: [vim()],
  };
}
