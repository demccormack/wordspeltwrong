# wordspeltwrong.io

Satire as a Service. *1% flatter every day.*

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
bin/brakeman          # security static analysis
bin/bundler-audit     # gem vulnerabilities
bin/importmap audit   # JS vulnerabilities
```

CI (GitHub Actions) runs all of the above on every pull request.

## Editor

`.vscode/` contains recommended extensions and settings (auto-save on focus change, format and lint on save).

## UI building blocks

- Tokens and component classes (`btn-primary`, `card`, `notification`): `app/assets/tailwind/application.css`
- Partials: `app/views/components/` (`button`, `card`, `notification`, `celebration`)
- Confetti: `celebration` Stimulus controller (respects reduced motion)
