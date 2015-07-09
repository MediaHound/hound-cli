# hound-cli

## A command line utility to find where to watch a movie.

For a web version of this (and more) check out [Find.Media](https://find.media).

Authors: Dustin Bachrach

### Prequisites

* npm

### Installation

```npm install -g hound-cli```

### Usage

To find media just `hound` it:

```
➜ hound Gladiator
Gladiator (2000) is available on:
1) Google Play Rent from $2.99
2) Google Play Buy from $9.99
...
```

To find media with a specific actor/director/etc:

```
➜ hound --with George Clooney
George Clooney has done:
1) Anton Corbijn Inside Out (2012)
2) Batman & Robin (1997)
3) Burn After Reading (2008)
4) Combat High (1986)
...
```

To find recommendations from two of your favorite movies (like [DateNight](http://datenight.media)):

```
➜ hound The Notebook --meets Gladiator
Looking for: The Notebook (2004) meets Gladiator (2000)
1) The Last of the Mohicans (1992)
2) The English Patient (1996)
3) The Curious Case of Benjamin Button (2008)
...
```

### Development

NOTE: If you do not have npm or gulp you will need to install them globally.

```brew install node```

```npm install --global gulp```


1. Clone the repo into a local folder
2. cd into project folder
3. Run `npm install`
4. Run `(sudo) npm link` to link this local build to your global command prompt.
5. You can now run `hound` and it will use your local build.

#### Gulp Tasks

Running `gulp` will lint, style-check, and run unit tests.
