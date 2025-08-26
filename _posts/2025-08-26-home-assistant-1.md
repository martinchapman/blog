---
layout: default
title: Home Assistant 1
tag: home-automation
---

Documentation of an evolving home automation setup, primarily realised through [home assistant](https://www.home-assistant.io/).

## Devices 

- Amazon Alexa:
    - [Echo Gen 1](https://www.dimensions.com/element/amazon-echo-1st-gen) 
    - [Echo Dot Gen 1 ](https://www.dimensions.com/element/amazon-echo-dot-1st-gen)

- Aqara:
    - [Temperature and humidity sensor](https://www.zigbee2mqtt.io/devices/WSDCGQ11LM.html#aqara-wsdcgq11lm) (x2)

- Ikea:
    - Plugs
        - [Tretakt](https://www.ikea.com/gb/en/p/tretakt-plug-smart-80556514/)
    - Other
        - [Somrig shortcut button](https://www.zigbee2mqtt.io/devices/E2213.html)

- Phillips Hue lights: 
    - [1st Gen Bulb](https://www.zigbee2mqtt.io/devices/9290012573A.html#philips-9290012573a) (x4)
    - [2nd Gen Bulb](https://www.zigbee2mqtt.io/devices/9290012573A.html#philips-9290012573a) (x3)
    - [Lightstrip](https://www.zigbee2mqtt.io/devices/915005106701.html) 
    - [E14 (candle)](https://www.zigbee2mqtt.io/devices/929002294203.html#philips-929002294203)

- Reolink cameras:
    - [4K 8MP Dual-Band Wi-Fi 6 PTZ Indoor Camera with Auto Tracking (E1 Zoom)](https://reolink.com/product/e1-zoom/). 
    This camera is set up to send images and video to a local FTP server, the data from which is also accessible to home assistant.

- Sonos speakers:
    - [Play:1](https://support.sonos.com/en-gb/products/play-1) (x2)

- Tapo
    - Plugs
        - [P100](https://www.tapo.com/uk/product/smart-plug/tapo-p100/)  
        - [P105](https://www.tapo.com/uk/product/smart-plug/tapo-p105/)
        
- Wemo
    - Plugs
        - [Insight Switch Smart Plug](https://www.belkin.com/support-article/?articleNum=42290)

## Services

- [Met Office Weather DataHub](https://datahub.metoffice.gov.uk/)

- [Telegram](https://core.telegram.org/bots/api)

- [Speedtest.net](https://www.speedtest.net/)

## Links

Home assistant links users with these devices and services.

Inputs are via web, app or voice through the Alexa devices above, which are configured to (only) relay commands to home assistant through the process described [here](https://www.home-assistant.io/integrations/alexa.smart_home/#create-an-amazon-alexa-smart-home-skill).

All Zigbee devices are connected via a [SONOFF Zigbee 3.0 USB Dongle Plus](https://www.zigbee2mqtt.io/guide/adapters/zstack.html), which is attached to a [Raspberry Pi 4 Model B](https://www.raspberrypi.com/products/raspberry-pi-4-model-b/) where (dockerised) [Zigbee2MQTT](https://www.zigbee2mqtt.io/) and [Mosquitto](https://mosquitto.org/) interact to control devices at a software level {% include ref.html ref="zigbee setup" %}.
Home assistant itself is also hosted on the Pi.
<br />
Although directly connecting devices via Zigbee is preferable to using vendor-specific hubs, one does lose the functionality offered by these hubs, such as the scenes provided by the Hue Bridge.
In the case of Hue, scenes ares replicated using the values [here](https://www.reddit.com/r/Hue/comments/i97xw9/comment/g1msq1p/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button). 
Scenes with more colours than there are lights available are captured as scripts that randomise colours across the available lights.

{%
  include figure.html
  src="/assets/images/posts/home-assistant-1/zigbee.png"
  alt="zigbee setup"
%}

All non-Zigbee devices are linked to Home Assistant via Wi-Fi, either directly on the local network or via the respective provider's (cloud) platform.

## Automations

Automations that leverage these devices, services and links:

| trigger | action(s) |
| --- | --- |
| Number of mobile devices on network > 0 (someone arrives home) | Turn on lights if after sunset |
| Mobile device joins/leaves network (an individual arrives/leaves home) | Forward this information via Telegram |
| Temperature sensor above 27 degrees | Alert high temperature, and suggestion action based on external temperature (windows open vs. AC on) |
| Number of mobile devices on network = 0 (everyone leaves home) | Turn off relevant lights and plugs, report on Telegram |
| Mobile device plugged in before bed | Lights off/dimmed/delayed off, as appropriate |
| Image or video received from camera | Forward via Telegram |
| Somrig pressed | Timed white noise on speakers, lights off |
| Sunset/sunrise | Lights on/off (if still on) |
| (Seasonal) Sunset/sunrise +- offset | Christmas lights on/off |
{: .table }
