# StreamLabs for EvntBoard

Doc : https://dev.streamlabs.com/docs/socket-api

## Config

```json5
{
  "host": "localhost", // EvntBoard HOST (optionnal)
  "port": 5001, // Evntboard PORT (optionnal)
  "config": {
    "name": "streamlabs", // if no name is provided default value is "streamlabs" (optionnal)
    "token": "mySuperAccessToken"
  }
}
```

## Multiple config

Name property should be different :)

```json5
{
  "host": "localhost", // EvntBoard HOST (optionnal)
  "port": 5001, // Evntboard PORT (optionnal)
  "config": [
    {
      "name": "streamlabs-mainaccount", // if no name is provided default value is "streamlabs-1" (optionnal)
      "token": "mySuperAccessToken"
    },
    {
      "name": "streamlabs-secondaccount", // if no name is provided default value is "streamlabs-2" (optionnal)
      "token": "mySuperSecondAccessToken"
    }
  ]
}
```
