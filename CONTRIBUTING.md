# CONTRIBUTING

Follow these guidelines when making changes to the project.

## Commit messages

Commit messages must follow
[Conventional Commits](https://www.conventionalcommits.org)' guidelines.

The allowed commit types are:

- `fix`: for bug fixes
- `feat`: for new features
- `refactor`: for code re-writes
- `test`: for test updates
- `chore`: for maintenance updates (e.g. bump dependencies' versions)
- `docs`: for documentation updates 

## CI

Flow for local development:

- Check out a new branch
- Update files
- Stage and commit these updates (see [above](#commit-messages) on how to write
commit messages)
- Push this new branch
- Create a pull request

Flow for merging into main branch:

- Review the pull request
- Merge the pull request into the `master` branch

Flow for releasing on NPM:

- Run `npm version TYPE`, with `TYPE` being either `major`, `minor`, or `patch`
