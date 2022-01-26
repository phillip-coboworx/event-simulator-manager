const events = {
  keep_alive_send_interval: 3,
  intervals: [
    {
      interval_length: 10,
      events: [
        {
          event_type: 'shift_start',
          randomized: false,
          payload: [
            {
              program_name: 'box_palletizing',
            },
          ],
        },
        {
          event_type: 'on_change',
          randomized: false,
          payload: [
            {
              changed_field: 'status_change',
              status_code: 1,
              status_information: 'Connecting...',
            },
          ],
        },
      ],
    },
    {
      interval_length: 1,
      events: [
        {
          event_type: 'on_change',
          randomized: false,
          payload: [
            {
              changed_field: 'status_change',
              status_code: 4,
              status_information: 'Connected and Running',
            },
            {
              changed_field: 'downtime_change',
              downtime_status_code: 0,
            },
          ],
        },
      ],
    },
    {
      interval_length: 10,
      events: [
        {
          event_type: 'on_change',
          randomized: false,
          payload: [
            {
              changed_field: 'status_change',
              status_code: 3,
              status_information: 'No parts left',
            },
            {
              changed_field: 'downtime_change',
              downtime_status_code: 1,
            },
          ],
        },
      ],
    },
    {
      interval_length: 10,
      events: [
        {
          event_type: 'on_change',
          randomized: false,
          payload: [
            {
              changed_field: 'status_change',
              status_code: 4,
              status_information: 'Connected and Running',
            },
            {
              changed_field: 'downtime_change',
              downtime_status_code: 0,
            },
          ],
        },
      ],
    },
  ],
};

module.exports = events;
