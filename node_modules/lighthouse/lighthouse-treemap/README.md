# Lighthouse Treemap Viewer

## Development

```sh
yarn serve-treemap

# in separate terminal, start build watch
# dependency: `brew install entr`
find lighthouse-treemap | entr -s 'DEBUG=1 yarn build-treemap'
open http://localhost:8000/treemap/?debug
```
