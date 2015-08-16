# revo-config
Application configuration component for [revo](https://github.com/clonq/revo)

Loads and updates `appconfig.json` file.

Emits the following events:

* config.&lt;component_name&gt;.new
* config.&lt;component_name&gt;.change

Listens to the following events:

* config:delete
* config:get
* config:push
* config:reload

Sample config section:

```
#revo recipe
config:
  clonq/revo-ui-bootstrap:
    load: clonq/revo-config-ui
    remove: "nav, .container"
```
