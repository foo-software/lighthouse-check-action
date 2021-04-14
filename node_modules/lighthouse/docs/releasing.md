### Release guide for maintainers

This doc is only relevant to core member.

## Release Policy

### Cadence

We aim to release every 3 weeks. Our schedule is set as follows: Two days before the [expected Chromium branch point](https://www.chromium.org/developers/calendar) (which is every six weeks) and again exactly 3 weeks after that day. These are Tuesdays.

For example, following this schedule, we will attempt a release on these dates:

* _Sep 29 2020_ (M87)
* Oct 20 2020
* _Nov 10 2020_ (M88)
* Dec 1 2020
* ...

Italicized dates are two days before the expected Chromium branch point.

The planned ship dates are added to the internal Lighthouse calendar.

If a release is necessary outside these scheduled dates, we may choose to skip the next scheduled release.

In general, the above release dates are when new versions will be available in npm. Within 2 weeks, it will be reflected in LR / PSI. Some 10 weeks later, it will be available in Stable Chrome.

### Release manager

Release manager is appointed, according to the list below. However, if the appointed manager is absent, the next engineer in line in the list would own it.

    @cjamcl, @adamraine

Release manager follows the below _Release Process_.

### Release publicity

Note: actively undergoing changes by @exterkamp and @egsweeny.

1. Release mgr copies changelog to a new [Releases](https://github.com/GoogleChrome/lighthouse/releases). Tags and ships it.
1. Release mgr tells the _LH public_ Hangout chat about the new version.
1. V & Kayce write and publish the [/updates](https://developers.google.com/web/updates/) blog post
1. Addy writes the tweet (linking the /updates post) and sends it on [@____lighthouse](https://twitter.com/____lighthouse).

### Versioning

We follow [semver](https://semver.org/) versioning semantics (`vMajor.Minor.Patch`). Breaking changes will bump the major version. New features or bug fixes will bump the minor version. If a release contains no new features, then we'll only bump the patch version.

## Release Process

### On the scheduled release date

Before starting, you should announce to the LH eng channel that you are releasing,
and that no new PRs should be merged until you are done.

```sh
# Run the tests.
bash ./lighthouse-core/scripts/release/test.sh
```

Confirm DevTools integration will work:
```sh
# Change into the newly-created pristine folder.
cd ../lighthouse-pristine

yarn test-devtools

# Do some manual testing on a number of sites.
yarn open-devtools

# Done with DevTools for now, will open a CL later.

# Leave pristine folder.
cd ../lighthouse
```

### Lightrider

Confirm Lightrider integration will work.

1. See the internal README for updating Lighthouse: go/lightrider-doc
1. Roll to the canary feed in a workspace
1. Run the tests
1. Update/fix any failing tests
1. All good: Hold on submitting a CL until after cutting a release

### Open the PR

Now that the integrations are confirmed to work, go back to `lighthouse` folder.

```sh
# Prepare the commit, replace x.x.x with the desired version
bash ./lighthouse-core/scripts/release/prepare-commit.sh x.x.x

# Rebaseline DevTools tests one more time (only version number should change).
yarn build-devtools && yarn update:test-devtools
```

1. Edit changelog.md before opening the PR
1. Open the PR with title `vx.x.x`
1. Hold until approved and merged

### Cut the release

```sh
# One last test (this script uses origin/master, so we also get the commit with the new changelog - that commit should be HEAD).
bash ./lighthouse-core/scripts/release/test.sh
# Package everything for publishing
bash ./lighthouse-core/scripts/release/prepare-package.sh

# Make sure you're in the Lighthouse pristine repo we just tested.
cd ../lighthouse-pristine

# Last chance to abort.
git status
git log

# Publish tag.
git push --follow-tags

# Publish to npm.
npm publish

# Publish viewer and treemap.
yarn deploy-viewer
yarn deploy-treemap
```

### Extensions

If the extensions changed, publish them.

```sh
# Publish the extensions (if it changed).
open https://chrome.google.com/webstore/developer/edit/blipmdconlkpinefehnmjammfjpmpbjk
cd dist/extension-package/
echo "Upload the package zip to CWS dev dashboard..."
# Be in lighthouse-extension-owners group
# Open <https://chrome.google.com/webstore/developer/dashboard>
# Click _Edit_ on lighthouse
# _Upload Updated Package_
# Select `lighthouse-X.X.X.X.zip`
# _Publish_ at the bottom

# For Firefox: https://addons.mozilla.org/en-US/developers/addon/google-lighthouse/versions/submit/

# * Tell the world!!! *
echo "Complete the _Release publicity_ tasks documented above"

# Roll the tagged commit to Chromium and update the CL you made. Do not land, see next section.
# Roll the tagged commit to LR and land the CL.
```

### Chromium CL

```sh
git checkout vx.x.x # Checkout the specific version.
yarn build-devtools
yarn devtools ~/src/devtools/devtools-frontend

cd ~/src/devtools/devtools-frontend
git new-branch rls
git commit -am "[Lighthouse] Roll Lighthouse x.x.x"
git cl upload -b 772558
```
