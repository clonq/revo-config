# revo-config
application config component for the revo container

Loads and updates appconfig.json file and emits `config.<component>.new` and `config.<component>.change` events.

Listens to `config:reload` and `config:push` events.

Sample config section:

```
#revo recipe
config:
  clonq/revo-ui-bootstrap:
    load: clonq/revo-config-ui
    remove: "nav, .container"
```