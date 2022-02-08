# Azure IoT Device Simulator
## Setup
1. Clone repository
2. Install npm packages 
3. Create an .env-file which contains a variable with the connection string of the device on the IoT-Hub which will recieve the events. The connection string has the following structure:
`CONNECTION_STRING="HostName=<HN>;DeviceId=<DI>;SharedAccessKey=<SAK>"`

_________________

## Message Schema
```yaml
{
    "nodeId": "sim000001",
    "timestamp": 1643715187022,
    "event": "shift_start|keep_alive|change|shift_end",
    "payload": {
        <Optional and variable content, depending on event and passed fields.>
    }
}
```

_________________

## Run the IoT Device Simulator
- To start the simulator run `node device.js`, which will start the device and use, by default, the `./template_files/events.yml` to generate the events. 

- The simulator also accepts three flags:
	- `--file=<path>` - Defines which template file will be used to generate the events.
    - `--loop` - Sets the simulator to run in an infinite loop, constantly iterating the passed events. **NOTE:** The loop needs to be stopped manually or it will continously send events to the IoT-Hub.

	`node device.js --file=./example.yaml --loop`

### Event File Structure
- **node_id** -> The ID of the simulated IoT device. 
- **keep_alive_send_interval** -> Defines the send frequency of the keep-alive event in intervals. E.g., the value 3 would mean that every 3 intervals a keep-alive event is send. 
- **intervals** -> An array which contains event objects. Defines and groups all objects which belong into the same time step and will be sent together. 
    - **interval_length (OPTIONAL))** -> Defines how long the simulator will wait until it sends the messages in the current interval. If not present, the value will be set to 2 seconds.
	- **events** -> All events that happen in one time step. Multiple, different events can be defined and sent in one time step.
		- **event_type** -> The type of event that is being sent. Further explained under the event types.
        - **randomized (OPTIONAL)** -> When set to true, the event will only be randomly sent. If not present, it will be set to false.
		- **payload** -> An array that contains the actual values of the event.
			- **changed_field** -> Defines which field has a change of value
			- **<changed_value>** -> Contains the new value. Further explained under the event types.

####  YAML-Example
```yaml
---
node_id: 'sim000001'
keep_alive_send_interval: 3
intervals:
- events:
  - event_type: shift_start
    payload:
    - program_name: box_palletizing
  - event_type: status
    payload:
    - status_code: 1
      status_information: Connecting...
- interval_length: 4
  events:
  - event_type: status
    payload: 
    - status_code: 4
      status_information: Connected and Running
  - event_type: change
    randomized: true
    payload:
    - changed_field: downtime
      downtime_status_code: 0
- events: 
  - event_type: shift_end
    payload: 
```
#### JSON-Example
```json
{
    "node_id": "sim000001",
    "keep_alive_send_interval": 3,
    "intervals": [
        {
            "interval_length": 2,
            "events": [
            {
                "event_type": "shift_start",
                "randomized": false,
                "payload": [
                    {
                        "program_name": "box_palletizing"
                    }
                ]
            },
            {
                "event_type": "change",
                "randomized": true,
                "payload": [
                    {
                        "changed_field": "status",
                        "status_code": 1,
                        "status_information": "Connecting..."
                    }
                ]
            }
            ]
        },
        {
            "events": [
                {
                    "event_type": "change",
                    "payload": [
                        {
                            "changed_field": "status",
                            "status_code": 4,
                            "status_information": "Connected and Running"
                        },
                        {
                            "changed_field": "downtime",
                            "downtime_status_code": 0
                        }
                    ]
                }
            ]
        }
    ]
}
```

#### JS-Example
For more information on the parameters for each object, read the Event Types section
```js
const { Interval, Intervals, ChangeEvent, ShiftStartEvent, ShiftEndEvent, StatusEvent } = require('../classes');

module.exports = new Intervals('sim000001', 3, [
  new Interval([
    new ShiftStartEvent(),
    new StatusEvent(1, 'Connecting...'),
    new Event('custom_event', {changed_field: 'custom_field'})
  ]),
  new Interval([
    new StatusEvent(4, 'Connected and Running'),
    new ChangeEvent({ changed_field: 'downtime', downtime_status_code: 0 }, true),
  ], 5),
  new Interval([
    new StatusEvent(3, 'No parts left'),
    new ChangeEvent({ changed_field: 'downtime', downtime_status_code: 1 }),
  ]),
  new Interval([
    new StatusEvent(4, 'Connected and Running'),
    new ChangeEvent({ changed_field: 'downtime', downtime_status_code: 0 }, true),
  ], 5),
  new Interval([
    new ShiftEndEvent(),
  ]),
]);
```

_________________

## Event Types

There are five main types of events:
#### 1. shift_start
Is sent when a device starts a new shift and contains all the relevant information which helps determine what the device will be doing, e.g. the name of the program it will be running.

#### 2. keep_alive
Is sent in a fixed time interval to confirm if the connection to the device is still alive or dead. **This event does not need to be defined in the template, as it is automatically generated by the simulator.** 

#### 3. status
Sent when the device status changes

#### 4. change
Is sent when any value changes during the device's execution. The payload can contain multiple changes as separate objects, which always first define the changed field and then the new values. 

Possible changed fields can be:
- **cycle** - Sent when a cycle starts or ends
- **downtime** - Sent when the machine enters/exits downtime
- **packaging_material** - Sent when the packaging material is changed
- **palette** - Sent when a palette enters/exits the packaging area
- **program** - Sent when the device's program changes

#### 5. shift_end
Is sent when a shift has ended.

**NOTE** that any custom event can also be send following the same structure of each different template files. For more detailed examples, read below.

### **JS**
1. shift_start
```js
//randomized - (OPTIONAL) Sets the event to be randomly send
new ShiftStart(<randomized>)
```

2. status
```js
//code - The new status code
//information - The status information
//<randomized> - (OPTIONAL) Sets the event to be randomly send
new StatusEvent(code, information, <randomized>)
```

3. change
- **cycle** - Sent when a cycle starts or ends
```js
//payload - A js object which contains the changed fields and information
//randomized - (OPTIONAL) Sets the event to be randomly send
new ChangeEvent(payload, <randomized>)
```
- **downtime** - Sent when the machine enters/exits downtime
- **packaging_material** - Sent when the packaging material is changed
- **palette** - Sent when a palette enters/exits the packaging area
- **program** - Sent when the device's program changes

4. shift_end
```js
//randomized - (OPTIONAL) Sets the event to be randomly send
new ShiftEndEvent(<randomized>)
```

5. custom_event
```js
//eventType - Type of event
//payload - Payload which can contain any information needed
//randomized - (OPTIONAL) Sets the event to be randomly send
new Event(eventType, payload, <randomized>)
```

**NOTE** that a change-event can have a payload with multiple changed fields, they just need to be each defined as an individual object inside of the payload. 

### **YAML**
1. shift_start
```yaml
event_type: shift_start,
payload:
- program_name: box_palletizing
```
2. status:
```yaml
event_type: change
payload:
- changed_field: status,
  status_code: 0 (NO CONNECTION) | 1 (ON HOLD) | 2 (WARNING) | 3 (ERROR) | 4 (RUNNING),
  status_information: "Detailed status information"
```

3. change:
- **cycle** - Sent when a cycle starts or ends
```yaml
event_type: change
payload:
- changed_field: cycle,
  cycle_status_code: 0 (END) | 1 (START)
```

- **downtime** - Sent when the machine enters/exits downtime
```yaml
event_type: change
payload:
- changed_field: downtime,
  downtime_status_code: 0 (END) | 1 (START)
```

- **packaging_material** - Sent when the packaging material is changed
```yaml
event_type: change
payload: 
- changed_field: packaging_material,
  packaging_material: "New packaging material"
```

- **palette** - Sent when a palette enters/exits the packaging area
```yaml
event_type: change
payload:
- changed_field: palette,
  palette_status_code: 0 (PALETTE EXITED) | 1 (PALETTE ENTERED)
```

- **program** - Sent when the device's program changes
 ```yaml
event_type: change
payload:
- changed_field: program,
  program_name: "New program"
```

4. shift_end:
```yaml
event_type: shift_end
payload: 
```

5. custom_event:
```yaml
event_type: custom_event_type
payload: {custom_payload}
```


**NOTE** that a change-event can have a payload with multiple changed fields, they just need to be each defined as an individual object inside of the payload. 

```yaml
intervals:
- events:
 - event_type: change
   payload:
   - changed_field: status
     status_code: 4
     status_information: Connected and Running
   - changed_field: downtime
     downtime_status_code: 0
```

### JSON
1. shift_start
```json
{
    "event_type": "shift_start",
    "payload": [
        {
            "program_name": "box_palletizing"
        }
    ]
}
```
2. status:
```json
{
    "event_type": "status",
    "payload": [
    {
        "status_code": 1,
        "status_information": "Connecting..."
    }
    ]
}
```

3. change:

- **cycle** - Sent when a cycle starts or ends
```json
{
    "event_type": "change",
    "payload": {
        "changed_field": "packaging_material",
        "packaging_material": "New packaging material"
    }
}
```

- **downtime** - Sent when the machine enters/exits downtime
```json
{
    "event_type": "change",
    "payload": {
        "changed_field": "downtime",
        "downtime_status_code": "0 (END) | 1 (START)"
    }
}
```

- **packaging_material** - Sent when the packaging material is changed
```json
{
    "event_type": "change",
    "payload": {
        "changed_field": "packaging_material",
        "packaging_material": "New packaging material"
    }
}
```

- **palette** - Sent when a palette enters/exits the packaging area
```json
{
    "event_type": "change",
    "payload": {
        "changed_field": "palette",
        "palette_status_code": "0 (PALETTE EXITED) | 1 (PALETTE ENTERED)"
    }
}
```

- **program** - Sent when the device's program changes
```json
{
    "event_type": "change",
    "payload": {
        "changed_field": "program",
        "program_name": "New program"
    }
}
```

4. shift_end:
```json
{
    "event_type": "shift_end",
    "payload": { }
}
```

5. custom_event:
```json
{
    "event_type": "custom_event",
    "payload": {
        "custom_payload": "custom_content"
    }
}
```

**NOTE** that a change-event can have a payload with multiple changed fields, they just need to be each defined as an individual object inside of the payload. 

```json
"intervals": [
    {
        "events": [
            {
                "event_type": "change",
                "payload": [
                    {
                        "changed_field": "palette",
                        "palette_status_code": 0
                    },
                    {
                        "changed_field": "program",
                        "program_name": "New program"
                    }
                ]
            }
        ]
    }
]
```