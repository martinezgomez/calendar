
import axios from 'axios';

export class CalendarService {

    getEvents() {
        return axios.get('http://localhost:5000/data')
            .then(res => res.data);
    }
    setEvents(form) {
        return axios.post('http://localhost:5000/data', form)
            .then(res => res.data);
    }
}
