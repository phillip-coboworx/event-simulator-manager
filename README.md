# Azure IoT Device Simulator
## Setup
1. Clone repository
2. Install npm packages 
3. Create an .env-file which contains a variable with the connection string of the device on the IoT-Hub which will recieve the events. The connection string has the following structure:
`CONNECTION_STRING="HostName=<HN>;DeviceId=<DI>;SharedAccessKey=<SAK>"`

## Run the IoT Device Simulator
- To start the simulator run `node device.js`, which will start the device and use, by default, the `./template_files/events.yml` to generate the events. 

- The simulator also accepts three flags:
	- `--file=<path>` - Defines which template file will be used to generate the events. **NOTE:** To use this flag, the format flag also needs to be set.
	- `--format=<yaml|json>` - Defines in which format said file is written
    - `--loop` - Sets the simulator to run in an infinite loop, constantly iterating the passed events. **NOTE:** The loop needs to be stopped manually or it will continously send events to the IoT-Hub.

	`node device.js --file=./example.yaml --format=yaml`

### Event File Structure
- **node_id** -> The ID of the simulated IoT device. 
- **keep_alive_send_interval** -> Defines the send frequency of the keep-alive event in intervals. E.g., the value 3 would mean that every 3 intervals a keep-alive event is send. 
- **intervals** -> An array which contains event objects. Defines and groups all objects which belong into the same time step and will be sent together. 
    - **interval_length** -> Defines how long the simulator will wait until it sends the messages in the current interval.
	- **events** -> All events that happen in one time step. Multiple, different events can be defined and sent in one time step.
		- **event_type** -> The type of event that is being sent. Further explained under the event types.
        - **randomized** -> When set to true, the event will only be randomly sent.
		- **payload** -> An array that contains the actual values of the event.
			- **changed_field** -> Defines which field has a change of value
			- **<changed_value>** -> Contains the new value. Further explained under the event types.
			
####  YAML-Example
    ---
    node_id: 'sim000001'
    keep_alive_send_interval: 3
    intervals:
    - interval_length: 2
      events:
      - event_type: shift_start
        randomized: false
        payload:
        - program_name: box_palletizing
      - event_type: on_change
        randomized: true
        payload:
        - changed_field: status_change
          status_code: 1
          status_information: Connecting...
    - interval_length: 4
      events:
      - event_type: on_change
        randomized: false
        payload:
        - changed_field: status_change
          status_code: 4
          status_information: Connected and Running
        - changed_field: downtime_change
          downtime_status_code: 0
#### JSON-Example
**Note** that the .json-example is not actually a .json-file, but rather a .js-file which contains a node module which simply exports an object which in turn contains the json. This was done in order to be able to simply import the file, instead of having to parse it beforehand. 

    let events = {
        node_id: 'sim000001',
        keep_alive_send_interval: 3,
        intervals: [
            {
                interval_length: 2,
                events: [
                    {
                        event_type: shift_start,
                        randomized: false,
                        payload: [
                            {
                                program_name: box_palletizing
                            }
                        ]
                    },
                    {
                        event_type: on_change,
                        randomized: true,
                        payload: [
                            {
                                changed_field: status_change,
                                status_code: 1,
                                status_information: Connecting...
                            }
                        ]
                    }
                ]
            },
            {
                interval_length: 4,
                events: [
                    {
                        event_type: on_change,
                        randomized: false,
                        payload: [
                            {
                                changed_field: "status_change",
                                status_code: 4,
                                status_information: "Connected and Running"
                            },
                            {
                                changed_field: "downtime_change",
                                downtime_status_code: 0
                            }
                        ]
                    }
                ]
            }
        ]
    }
    
    module.exports = events;

### Event Types
There are three main types of events:
#### 1. shift_start
Is sent when a device starts a new shift and contains all the relevant information which helps determine what the device will be doing, e.g. the name of the program it will be running.

    event_type: shift_start,
    payload: [
		program_name: box_palletizing
    ]
#### 2. keep_alive
Is sent in a fixed time interval to confirm if the connection to the device is still alive or dead. **This event does not need to be defined in the template, as it is automatically generated by the simulator.** 

    event_type: keep_alive,
	payload: [
		connection_status_code: 0 (dead) | 1 (alive)
	]

#### 3. on_change
Is sent when any value changes during the device's execution. The payload can contain multiple changes as separate objects, which always first define the changed field and then the new values. 

Possible changed fields can be:
- **cycle_change** - Sent when a cycle starts or ends
```yaml
    event_type: on_change
    payload: [
    	changed_field: cycle_change,
    	cycle_status_code: 0 (END) | 1 (START)
    ]
```
- **status_change** - Sent when the device status changes
```yaml
    event_type: on_change
    payload: [
    	changed_field: status_change,
    	cycle_status_code: 0 (NO CONNECTION) | 1 (ON HOLD) | 
									2 (WARNING) | 3 (ERROR) | 4 (RUNNING),
		status_information: "Detailed status information"
    ]
```
- **downtime_change** - Sent when the machine enters/exits downtime
```yaml
event_type: on_change
payload: [
	changed_field: downtime_change,
	downtime_status_code: 0 (END) | 1 (START)
]
```
- **packaging_material_change** - Sent when the packaging material is changed
```yaml
event_type: on_change
payload: [
	changed_field: packaging_material_change,
	packaging_material: "New packaging material"
]
```
- **palette_change** - Sent when a palette enters/exits the packaging area
```yaml
event_type: on_change
payload: [
	changed_field: palette_change,
	palette_status_code: 0 (PALETTE EXITED) | 1 (PALETTE ENTERED)
]
```
- **program_change** - Sent when the device's program changes
 ```yaml
event_type: on_change
payload: [
	changed_field: program_change,
	program_name: "New program"
]
```

A on_change-event can have a payload with multiple changed fields, they just need to be each defined as an individual object inside of the payload. 

```yaml
intervals:
	-events:
		-event_type: on_change
        randomized: false
		payload:
			-changed_field: status_change
			status_code: 4
			status_information: Connected and Running
			-changed_field: downtime_change
			downtime_status_code: 0
```
