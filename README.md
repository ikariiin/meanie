# meanie
Will probably change that name in a while, but it stays that for the while :smile:

The project is structured as follows
```text
/dist                 # The build directory, built code gets spit into this directory
/package.json         # Dependencies
/tsconfig.json        # Config for typescript, basically strict all the things!
/src                  # Code!
  custom.d.ts         # Custom type defs for the application
  behind/             # Backend for the application
    entity/           # DB Entities
    middlewares/      # Middle ware for express, handles APIs and other persistent storage
    modules/          # Contains routes and classes of the functional part of the backend
    util/             # General utility functions / classes
    config.json       # FS based storage for key value pairs for the app
    index.ts          # Starts the server, and the middle wares, database, and entities are defined here
    install.ts        # Initializes the DB and sets defaults for the settings
  ui/                 # Frontend for the application
    html/             # Contains HTML files, basically the files you want to mount to, and currently only 1 file
    resources/        # Static resources for the frontend
    javascript/       # JS/TS Files
      bundles/        # Basically chunks of the application frontend divided by domain
        <bundle>/     # Bundle name
          components/ # React components for the bundle
          scss/       # SCSS styles for the components
          utils/      # Might be present in a bundle if the domain requires some utility functions
                      # all over the place
```

Here are the list of bundles currently present in the frontend of the application:
 - `activities`
Activities as in stuff that is running behind the scenes in the backend, includes Torrent components
And management for it
 - `common`
Common components such as the app theme and general stuff like Titles and Dividers
 - `display` 
Components that handle the layout and overall display of the page once loaded in
 - `forms`
Forms that usually need filling out to be processed, like search or filter and sort
 - `root`
A very small bundle where the app is actually mounted and initialized with all the connections
 - `settings`
A context page for settings for the application, for viewing and editing.

Feel free to create a pull request or an issue!

Currently the video profile only works in chrome due to MIME limitations on firefox.

## Screenshots WIP
![](https://i.imgur.com/VQwoMAg.png)
![](https://i.imgur.com/LdKp2RT.png)
![](https://i.imgur.com/KzwuM67.png)
![](https://i.imgur.com/hqcryXP.png)