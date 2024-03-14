# Angulon
Demo website (without ledstrip connected) is available at: [https://demo.phos.steinjonker.nl](https://demo.phos.steinjonker.nl/)

todo
## What is Angulon?

Angulon is an application to control a WS2812B ledstrip using an ESP32 microcontroller.  
The front-end is made in Angular which serves a manifest, so it can be installed as a PWA

### Features

- Highly configurable Audio Visualizer*
- Wide variety in modes (about 50)
- Saving settings and current colors
- Razer Chroma support for keyboard, mouse and headset (with possibly more devices to come)
- Modern UI
- Easy to use
  (*) - Only with SSL (or using localhost/serving in electron)

# Getting started with source code

## ESP Module

First, buy
an [ESP32](https://www.aliexpress.com/item/1005002440791883.html?spm=a2g0o.search0302.0.0.3e352a47YQNvj1&algo_pvid=null&algo_expid=null&btsid=2100bb4a16248086021948239eca57&ws_ab_test=searchweb0_0,searchweb201602_,searchweb201603_)
module, and
a [WS2812B](https://www.aliexpress.com/item/32682015405.html?spm=a2g0o.productlist.0.0.7da168dcDkZ1se&algo_pvid=abfd90ee-f9b5-4ada-997e-8332b024a105&algo_exp_id=abfd90ee-f9b5-4ada-997e-8332b024a105-0)
ledstrip.  
I'm not going to go into detail about power, because ledstrips use too much power for the ESP to handle.  
Connect the ledstrip on pin 12 on the ESP.

Download
the [Arduino IDE](https://randomnerdtutorials.com/installing-the-esp32-board-in-arduino-ide-windows-instructions/) and
follow this [tutorial](https://randomnerdtutorials.com/installing-the-esp32-board-in-arduino-ide-windows-instructions/)



# Generating migrations
To generate a migration, run `npx nx run api:migration-generate --name=your-migration-name`.  
However keep in mind, TypeORM compares the current state of the database against the state of the detected entities.  
If your database is already up-to-date (because `synchronize` was perhaps set to `true`), you will have to make sure the database is in the state of the last migration to successfully generate a new migration.  
To do this, easiest is to drop the database and start the API (migrations are run automatically)
