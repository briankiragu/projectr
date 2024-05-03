![CodeQL](https://github.com/briankiragu/projectr/actions/workflows/github-code-scanning/codeql/badge.svg)
![Coverage](https://github.com/briankiragu/projectr/actions/workflows/coverage.yml/badge.svg)

# Summary

A simple projection application.
Intended to be used by churches and faith-based organisations
to project/cast song lyrics and/or Bible verses to an audience without distruputing the flow of ministry.

## Features:

- Separate projection screen from control dashboard.
- Fuzzy search for lyrics by title, lyrics or author _(coming soon)_.
- Offline caching of search results.
- _(Coming soon)_ Support for wireless casting.

> [!NOTE]
> For more information on this project,
> consult our [wiki](https://github.com/briankiragu/projectr/wiki)
> to get started.

# Getting started locally

To get a good launching point for working on this project, follow the instructions in this README **in the order they appear in**.

> [!CAUTION]
> There are steps labelled as [Recommended]. These can be skipped. However,
> following them will significantly improve your developer experience and we
> highly recommend following them.

## Prerequisites

### NodeJS [Mandatory]

Ensure you have the latest version **_(LTS)_** of
[NodeJS](https://nodejs.org/download/) installed on your machine.

#### PNPM [Mandatory]

This project uses [PNPM](https://pnpm.io/) as its dependency manager. Install it on your local
machine to manage all the packages in the `package.json` as well as run the
scripts for **developing**, **testing** and **previewing** the application.

### Docker [Recommended]

While it is not necessary for the code to run,
the backend and data served by this application come from various
[Docker](https://docker.com/) images running in the background. These images are:

- [MySQL](https://dev.mysql.com/doc/refman/8.0/en/tutorial.html/)
- [Directus](https://directus.io/)
- [Meilisearch](https://www.meilisearch.com/docs/)
- [Meilisync](https://github.com/long2ice/meilisync/)
- [Certbot](https://certbot.eff.org/pages/about/)
- [Nginx](https://www.nginx.com/resources/wiki/)

We suggest that you have
[Docker Desktop](https://www.docker.com/products/docker-desktop/)
installed and running these image to access test data during development.

## Configuration

After cloning the repository to your local machine, follow these steps:

1. [Mandatory] Create a copy of the `.env.example` and rename it to `.env`.
   **It is important that you maintain the names of the keys**.
2. [Mandatory] Fill in the values of the `.env` file with your own custom
   values. If unsure which values to use, consult the documentation
   of each container image provided above.
3. [Recommended] In the folder `/docker/meilisync/`, create a copy of
   `config.example.yml` in the same folder and rename it to `config.yml`.
4. [Recommended] Fill in the missing values of the `config.yml` with the
   corresponding values in your `.env`.

## Starting up the application

### Starting, stopping and dropping Docker containers

To manage the Docker images, use the following commands:

- Starting: `docker compose up -d`
- Stopping: `docker compose stop`
- Dropping: `docker compose down --remove-orphans`

### Installing `node_modules`

Install the dependencies via `pnpm` using the command:

- `pnpm install`

### Developing, testing and previewing the application.

To manage the scripts in the `package.json`, use the following commands:

- Development: `pnpm run dev`
- Unit Testing: `pnpm run test`
- Unit Testing (With coverage): `pnpm run test:coverage`
- Preview: `pnpm run build && pnpm run preview`

## Viewing the application

When you run `dev` or `preview`, you can view the rendered UI in a browser
on the following URLs:

- Development: `http://localhost:5173/`
- Preview: `http://localhost:4173/`
