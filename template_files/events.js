let events = {
    "intervals": [
        {
            "events": [
                {
                    "event_type": "shift_start",
                    "payload": [
                        {
                            "program_name": "box_palletizing"
                        }
                    ]
                },
                {
                    "event_type": "on_change",
                    "payload": [
                        {
                            "changed_field": "status_change",
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
                    "event_type": "on_change",
                    "payload": [
                        {
                            "changed_field": "status_change",
                            "status_code": 4,
                            "status_information": "Connected and Running"
                        },
                        {
                            "changed_field": "downtime_change",
                            "downtime_status_code": 0
                        }
                    ]
                }
            ]
        }
    ]
}

module.exports = events;