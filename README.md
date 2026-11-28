# wordspeltwrong.io

<div align="center">

<h2>Fully functional.<br>Completely useless.</h2>

<h3>Enterprise-grade software for the achievement of absolutely nothing.</h3>

<h3><em>✨ 1% flatter every day. ✨</em></h3>

</div>

Rails 8.1 monolith with PostgreSQL, Hotwire (Turbo + Stimulus), Tailwind CSS and importmaps (no Node required).

## Local setup

Requirements: Ruby (see `.ruby-version`) and PostgreSQL running locally.

```sh
bin/setup      # installs gems, prepares the database, starts the server
bin/dev        # Rails server + Tailwind watcher
```

Open <http://localhost:3000>.

Environment variables are documented in `.env.example`.

## Checks

```sh
bundle exec rspec     # tests (request + system specs)
bin/rubocop           # lint (rubocop-rails-omakase)
npx prettier@3 --check "app/javascript/**/*.js" ".vscode/*.json" "*.md" ".github/**/*.md"  # JS/JSON/Markdown formatting
bin/brakeman          # security static analysis
bin/bundler-audit     # gem vulnerabilities
bin/importmap audit   # JS vulnerabilities
```

CI (GitHub Actions) runs all of the above on every pull request.

## Editor

`.vscode/` contains recommended extensions and settings (auto-save on focus change, format and lint on save). Prettier formats JavaScript, JSON and Markdown; RuboCop formats Ruby.

## UI building blocks

- Tokens and component classes (`btn-primary`, `card`, `notification`): `app/assets/tailwind/application.css`
- Partials: `app/views/components/` (`button`, `card`, `notification`, `celebration`)
- Confetti: `celebration` Stimulus controller (respects reduced motion)

## Dependency updates

Dependabot opens weekly PRs for gems and GitHub Actions; patch and minor updates auto-merge once required checks pass. Major updates, Ruby, Turbo and Stimulus are reviewed by hand, and Rails only auto-merges patch releases (minor/major upgrades follow the Rails upgrade guide). Vendored importmap packages (e.g. canvas-confetti) are not tracked by Dependabot; a weekly workflow runs `bin/importmap outdated` and opens an issue.
