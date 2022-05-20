# Compact Hostmap Panel for Grafana

Grafana Panel Plugin to easily understand the host's system metric at a glance

<img width="1081" alt="Screenshot_2022-05-20_16-59-14" src="https://user-images.githubusercontent.com/24940457/169499252-a461fbd3-43b6-474e-ae9c-f6aa2da8a521.png">

## Supported Datasources

- promethues
- elasticsearch

tested.

Supports Grafana plugin interface data frames, groupBy each frame based on `name` key.

<img width="966" alt="Screenshot_2022-05-20_18-24-46" src="https://user-images.githubusercontent.com/24940457/169500225-c5f89483-fdab-4798-8933-4df6521c7598.png">
<img width="963" alt="Screenshot_2022-05-20_18-25-13" src="https://user-images.githubusercontent.com/24940457/169500261-fa9db043-325b-40ba-8eeb-4f425bf9c724.png">

## ETC

HostItem is rendered in response to panel size, and Color Threshold is mapped to the largest value.

<img width="1040" alt="Screenshot_2022-05-20_18-23-49" src="https://user-images.githubusercontent.com/24940457/169500959-910ca82b-5561-493b-9fb7-5d41fa221973.png">
