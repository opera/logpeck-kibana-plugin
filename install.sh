#!/bin/bash
sudo cp -r ./logpeck-kibana-plugin/plugins/logpeck ./plugins/logpeck
sudo curl -XPUT '127.0.0.1:9200/logpeck/'
sudo curl -XPUT '127.0.0.1:9200/logpeck_group/'
sudo curl -XPUT '127.0.0.1:9200/.logpeck/'
