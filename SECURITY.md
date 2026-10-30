# Security

This repository contains translation tooling and translated documentation; it does not ship a runtime library. Two things still matter:

- **Secrets.** The only secret the workflows use is `FIREBASE_SERVICE_ACCOUNT`, scoped to Firebase Hosting Admin on the site's project. Never commit it, never put an Algolia admin key in `site.json` (`search.apiKey` is the search-only key). Workflows pin actions by commit SHA and run with minimal permissions.
- **Content.** A translation PR can only change files under `i18n/<lang>/`; code changes to the site go through `tools/adev-patches/` and are reviewed like code. Reviewers check that links in translated pages point where the English ones do (`pnpm check` compares link targets).

To report a vulnerability in the tooling or a malicious link on a published site, use the repository's **Security → Report a vulnerability** form, or contact the maintainers listed in `i18n/<lang>/README.md` privately. Please do not open a public issue for security reports. Problems in the Angular framework or in angular.dev itself belong to [angular/angular's security policy](https://github.com/angular/angular/security/policy).
