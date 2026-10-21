# Vercel Functions limits (Hobby plan)

Source: https://vercel.com/docs/functions/limitations (page last updated 2026-08-24, read 2026-10-21).

| Limit | Value |
|---|---|
| Request body and response body | 4.5 MB each. Over the limit returns 413 `FUNCTION_PAYLOAD_TOO_LARGE`. |
| Maximum duration (Fluid compute, Node.js) | Hobby: 300 s default and maximum. Streamed responses count in the duration. |
| Memory | Hobby: 2 GB, 1 vCPU. |
| Bundle size | 250 MB uncompressed. |
| Function file name | Maximum 128 characters, no spaces. |

## What this means for the app

- A vision request carries page images as base64. Two pages of about 1 MB each stay under the 4.5 MB body limit. The batch size is 2 pages.
- 300 s is enough for one plan call and for one streamed tutor turn. Each call still does one job.
- The key is read from the `x-llm-key` header. The body limit does not include the key in any meaningful way.
