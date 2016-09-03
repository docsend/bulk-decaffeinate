# bulk-decaffeinate

A tool, backed by [decaffeinate](http://decaffeinate-project.org/), to help you
convert some or all of a CoffeeScript codebase to JavaScript.

The tool can check a codebase for decaffeinate-readiness, and once the code (or
a part of it) is ready, bulk-decaffeinate can actually run the conversion and
some follow-up cleanups. Here's an example of checking the Hubot repo:
```
> npm install -g bulk-decaffeinate decaffeinate eslint
...
> git clone git@github.com:github/hubot.git
...
> cd hubot
> bulk-decaffeinate check
Discovering .coffee files in the current directory...
Trying decaffeinate on 18 files using 4 workers...
18/18 (7 failures so far)
Done!

7 files failed to convert:
src/adapters/shell.coffee
src/adapters/campfire.coffee
src/brain.coffee
src/message.coffee
src/user.coffee
src/robot.coffee
test/brain_test.coffee

Wrote decaffeinate-errors.log and decaffeinate-results.json with more detailed info.
To open failures in the online repl, run "bulk-decaffeinate view-errors"
> bulk-decaffeinate view-errors
(7 browser tabs are opened, showing all failures.)
```

## Assumptions

While the underlying [decaffeinate](https://github.com/decaffeinate/decaffeinate)
tool tries to be general-purpose, bulk-decaffeinate intentionally makes some
assumptions about your use case:

* Your build tooling can already handle JavaScript. Replacing a .coffee file
  with a .js file will "just work" as long as the files are equivalent.
* Adding some extra .original.coffee files as temporary backups won't cause
  trouble.
* You are using git for source control and all .coffee files being converted are
  already tracked in the git repo.
* You are using eslint for JS linting and you already have a .eslintrc file
  specifying your preferred styles.

Feel free to file an issue or submit a PR if these assumptions don't match your
current project. Most steps shouldn't be hard to disable using a config setting.

## What it does

There are currently three commands you can run:
* `check` does a dry run of decaffeinate on the specified files and reports how
  decaffeinate-ready the set of files is.
* `view-errors` should be run after `check` reports failures. It opens the
  failed files in the [online decaffeinate repl](http://decaffeinate-project.org/repl/),
  with one browser tab per failed file.
* `convert` actually converts the files from CofeeScript to JavaScript.

Here's what `convert` does in more detail:
  1. It does a dry run of decaffeinate on all files to make sure there won't be
     any failures.
  2. It backs up all .coffee files to .original.coffee files, which makes it
     easily to manually do a before-and-after comparison later.
  3. It generates a commit renaming the files from .coffee to .js (but not
     changing the contents). Putting this step in its own commit allows git to
     track the file history across renames (so, if possible, you should land the
     changes as a merge commit rather than squashing the commits together).
  4. It runs decaffeinate on all files and gets rid of the .coffee files, then
     generates a commit.
  5. It runs `eslint --fix` on all files, which applies some style fixes
     according to your lint rules. For any remaining lint failures, it puts a
     comment at the top of the file disabling those specific lint rules and
     leaves a TODO comment to fix any remaining style issues.
  6. All post-decaffeinate changes are committed as a third commit.

If you want to see the full details, the [source code](src/convert.js) should
hopefully be fairly readable.

## Configuration

You can specify custom configuration in a config file, usually called
`bulk-decaffeinate.json`, in the current working directory. Any file starting
with `bulk-decaffeinate` and ending with `.json` will be counted, and multiple
config files may exist at once. If there are multiple config files, they are
merged, with alphabetically-later config file names taking precedence over
alphabetically-earlier files. Many config options can also be specified directly
as CLI arguments, with CLI arguments taking precedence over any config file
setting.


### Specifying files to process

The following config keys can be specified:

* `searchDirectory`: a path to a directory where bulk-decaffeinate will search
  for all .coffee files (ignoring files in `node_modules` directories).
* `pathFile`: a path to a file containing a list of .coffee file paths to
  process, one per line.
* `filesToProcess`: an array of .coffee file paths to process.

The `filesToProcess` setting has highest precedence, then `pathFile`, then
`searchDirectory`.

### Configuring paths to external tools

Rather than having bulk-decaffeinate automatically discover the relevant
binaries, you can specify them explicitly. If a path is not specified
explicitly, bulk-decaffeinate will first search `node_modules`, then your PATH,
then offer to install the tool globally, so generally it's unnecessary to
specify these paths in the config file.

These keys can be specified:

* `decaffeinatePath`: the path to the decaffeinate binary.
* `eslintPath`: the path to the eslint binary.

## Future plans

* Allow running custom follow-up codemods.
* When displaying errors, classify any known issues automatically and link to
  the corresponding GitHub issue.
* Any other sanity checks, instructions, or help for running decaffeinate on a
  real-world codebase.
