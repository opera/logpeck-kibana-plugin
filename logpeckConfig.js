
export const Version = "0.5.0";

export const TaskName = "TestLog";
export const LogPath = "test.log";
export const Delimiters = "";
export const Keywords = "";
export const LogFormat = "text";

export const ConfigName = "Elasticsearch";
export const LuaString = "--example:client=105.160.71.175 method=GET status=404\n"+
  "function extract(s)\n" +
  "    ret = {}\n" +
  "    --*********此线下可修改*********\n" +
  "    i,j=string.find(s,'client=.- ')\n" +
  "    ret['client']=string.sub(s,i+7,j-1)\n" +
  "    i,j=string.find(s,'method=.- ')\n" +
  "    ret['method']=string.sub(s,i+7,j-1)\n" +
  "    --*********此线上可修改*********\n" +
  "    return ret\n" +
  "end";

export const EsHosts = "127.0.0.1:9200";
export const EsIndex = "my_index-%{+2006.01.02}";
export const EsType = "MyType";
export const EsMapping = JSON.stringify(JSON.parse('{"MyType":{"properties": {"MyField": {"type": "long"}}}}'), null, 4);

export const InfluxHosts = "127.0.0.1:8086";
export const InfluxDBName = "DBname";
export const InfluxInterval = 30;
export const InfluxdbArray = {
  "PreMeasurment":"",
  "Measurment":"_default",
  "Target":"",
  "Aggregations":{
    "cnt":false,"sum":false,"avg":false,"p99":false,"p90":false,"p50":false,"max":false,"min":false
  },
  "Tags":[],
  "Timestamp":"_default"
};

export const KafkaBrokers = "127.0.0.1:9092";
export const KafkaTopic = "";
export const KafkaMaxMessageBytes = 1000000;
export const KafkaRequiredAcks = "1";
export const KafkaTimeout = 10;
export const KafkaCompression = "0";
export const KafkaPartitioner = "RandomPartitioner";
export const KafkaReturnErrors = true;
export const KafkaFlush = {FlushBytes : 0,FlushMessages : 0,FlushFrequency : 0,FlushMaxMessages:0};
export const KafkaRetry = {RetryMax : 3,RetryBackoff : 100};

export const DefaultLogpeckIP = "127.0.0.1";
export const DefaultLogpeckPort = "7117";

//***************************************************
export const Config = {
  HostName:__dirname+'/db/host-name.txt',
  GroupName:__dirname+'/db/group-name.txt',
  TemplateName:__dirname+'/db/template-name.txt',
};