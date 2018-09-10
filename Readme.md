# alyticsync

`alyticsync` is a command line tool used for editing of [alytic.io](https://alytic.io/) cards locally.

## Instalation

I recommend installing the script globally.
`npm install -g alyticsync`

## Usage

1. Run `alyticsync init` to connect to the desired Alytic.io card with the folder that you are currently in. (you will need the card and deck ids)
2. Run `alyticsync login` to log in with your credentials
3. Run `alyticsync pull` to pull the stylesheet, script, and data query files locally

Now you can edit the files with any editor you prefer.

4. Pushing changes
  - Run `alyticsync push` to push the local changes to Alytic.io server
  - Run `alyticsync watch` to watch the files and automatically push all changes.

5. Run `alyticsync view` to get the URL to view the card.