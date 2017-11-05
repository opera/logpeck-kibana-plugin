# Logpeck Kibana Plugin

---

## About this plugin

We have been able to control collection tasks remotely with HTTP API by [Logpeck](https://github.com/opera/logpeck) instead of Logstash(NONE configuration file).To be more convenient,We want to send these HTTP requests by kibana plugin.


## Installation from build

* Before download this plugin,you should have installed [Elasticsearch](https://www.elastic.co/downloads)，[Kibana](https://www.elastic.co/downloads)(Kibana=5.6.3) and [Logpeck](https://github.com/opera/logpeck).

- `cd kibana`

   Into your Kibana installaton directory

- `git clone https://github.com/opera/logpeck-kibana-plugin.git`

   Clone this plugin to the Kibana installaton directory

- `sh logpeck-kibana-plugin/install.sh`

   Install logpeck-kibana-plugin

- `bin/kibana`

   run your Kibana
   

## Kibana Plugin Development

See the [kibana contributing guide](https://github.com/elastic/kibana/blob/master/CONTRIBUTING.md) for instructions setting up your development environment.



