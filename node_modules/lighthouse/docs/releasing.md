### Release guide for maintainers

## Release Policy

### Cadence

We ship once a month, on the Thursday before the 1st. While not necessary, followup minor/patch releases may be done if warranted. The planned ship dates are added to the internal Lighthouse calendar.

### Release manager

Release manager is appointed, according to the list below. However, if the appointed manager is absent, the next engineer in line in the list would own it.

    bckenny, paulirish, patrickhulce

Release manager follows the below _Release Process_.

### Release publicity

1. Release mgr copies changelog to a new [Releases](https://github.com/GoogleChrome/lighthouse/releases). Tags and ships it.
   * Include a line of `We expect this release to ship in the DevTools of Chrome XX`.
1. Release mgr tells the _LH public_ Hangout chat about the new version.
1. V & Kayce write and publish the [/updates](https://developers.google.com/web/updates/) blog post
1. Paul writes the tweet (linking the /updates post) and sends it on [@____lighthouse](https://twitter.com/____lighthouse).
1. Paul prepares a roll for DevTools frontend

### Versioning

We follow [semver](https://semver.org/) versioning semantics (`vMajor.Minor.Patch`), to align with the greater Node community. Generally, this means our bi-weekly releases will bump a minor. Though we will release a new patch version if high-priority fixes are required before the next schedule release. Additionally, if a schedule release contains no new features, then we'll only bump the patch version.


## Release Process

```sh
# Run the tests
bash ./lighthouse-core/scripts/release/test.sh
# Prepare the commit, replace x.x.x with the desired version
bash ./lighthouse-core/scripts/release/prepare-commit.sh x.x.x

# Open the PR and await merge...
echo "It's been merged! 🎉"

# Run the tests again :)
bash ./lighthouse-core/scripts/release/test.sh
# Package everything for publishing
bash ./lighthouse-core/scripts/release/prepare-package.sh

# Make sure you're in the Lighthouse pristine repo we just tested.
cd ../lighthouse-pristine

# Publish to NPM
npm publish

# Publish viewer
yarn deploy-viewer

# Upload the extension
open https://chrome.google.com/webstore/developer/edit/blipmdconlkpinefehnmjammfjpmpbjk
cd dist/extension-package/
echo "Upload the package zip to CWS dev dashboard..."
# Be in lighthouse-extension-owners group
# Open <https://chrome.google.com/webstore/developer/dashboard>
# Click _Edit_ on lighthouse
# _Upload Updated Package_
# Select `lighthouse-X.X.X.zip`
# _Publish_ at the bottom

# * Tell the world!!! *
echo "Complete the _Release publicity_ tasks documented above"
```
