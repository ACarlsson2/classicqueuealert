# classicqueuealert
### Disclamer
Kinda works... might need some tweaking.
## How to use
Set up an IFTTT trigger that listens for a webhook event and sends a notification to your device. (For example) 
Give the event a name and save your IFTTT api key.
Create a constants.js that exports both:
* EVENT_NAME 
    * The name you gave the event in IFTTT 
* IFTTT_KEY
    * Your IFTTT api key

In index.js there are 2 variables 
* X_PIXEL
* Y_PIXEL
These might have to be configured for your screen.
The idea here is to select a pixel that is on the "Change Realm" button that is present when in queue.
When you get out of the queue you enter Chararcter selection screen that button will not be present and the program will detect the change and send a http request to your IFTTT webhook that triggers a notification on your device.

Happy queueing!


 
