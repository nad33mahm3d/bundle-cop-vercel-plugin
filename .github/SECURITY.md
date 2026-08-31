# Security Policy

## Supported versions

| Version | Supported |
|---------|-----------|
| 0.1.x   | Yes       |
| &lt; 0.1  | No        |

## Reporting a vulnerability

Please **do not** file a public GitHub issue for security vulnerabilities.

Email **ebox.nadeem@gmail.com** with:

- A description of the issue
- Steps to reproduce or a proof of concept (if available)
- Affected package/version or URL (`bundle-cop-vercel-plugin` and/or `bundle-cop.vercel.app`)
- Any known impact or suggested fix

We aim to acknowledge reports within **7 days** and will coordinate a fix and disclosure timeline with you.

## Scope

In scope: the npm adapter, the hosted integration app, webhook/OAuth handling, and related repository code.

Out of scope: third-party services (Vercel platform, npm registry, GitHub), dependency vulnerabilities already disclosed upstream (unless we fail to upgrade after a reasonable window).
