<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Claude Code observability

- Claude Code runs must be started in an observable terminal session (preferably tmux), not as an opaque background process.
- Expose the tmux session name immediately so humans can inspect it themselves.
- If Claude asks for approval, input, or stalls, report it immediately.
