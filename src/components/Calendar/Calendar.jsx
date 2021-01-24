import 'bootstrap/dist/css/bootstrap.css';
import React, {useState, useEffect} from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from "reactstrap";
import {useForm} from "react-hook-form";
import {CalendarService} from "../../Services/CalendarService";

export default function Calendar() {
    //hook para el formulario
    const { register, handleSubmit} = useForm();

    //Hook para cargar los datos de las alarmas
    const [events, setEvents] = useState([]);

    //Hook para abrir o cerrar la ventana modal
    const [state = false, setState] = useState();

    //opciones de los datos que muestra el componente full calendar
    const options = {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        defaultView: 'dayGridMonth',
        defaultDate: '2021-01-01',
        header: {
            left: 'prev, next',
            center: 'title',
            right: 'dayGridMonth, t1meGr1dWeek, t1meGr1dDay'
        },
        editable: false,
    };

    //funcion para abrir o cerrar el modal
    const openModal = () => {
        setState(!state);
    }

    //instancia del servicio de peticiones al back
    const calendarService = new CalendarService();

    //peticion get axios para traer las alarmas
    useEffect(() => {
        calendarService.getEvents().then(data => setEvents(data));
    }, []);// eslint-disable-line react-hooks/exhaustive-deps

    //peticion post para guardar una nueva alarma
    const onSubmit = form => {
        console.log(form)
       calendarService.setEvents(form).then(data => console.log(data));
        openModal()
    }

    return(
        <div>
            <div className="class">
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay'
                    }}
                    initialView='dayGridMonth'
                    selectable={true}
                    displayEventEnd={true}
                    selectMirror={true}
                    dayMaxEvents={true}
                    events={events}
                    options={options}
                    select={openModal}
                />
                <Modal isOpen={state}>
                    <ModalHeader>
                        Add Alarm
                    </ModalHeader>
                    <ModalBody>
                        <form className="form"  onSubmit={handleSubmit(onSubmit)}>
                            <input name="start" id="start" type="datetime-local" ref={register()}/>
                            <input name="end" id="end" type="datetime-local" ref={register()}/>
                            <input name="title" id="title" type="text" placeholder="Add name of alarm" ref={register()}/>
                        </form>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={handleSubmit(onSubmit)}>Save</Button>
                        <Button color="secondary" onClick={openModal}>Close</Button>
                    </ModalFooter>
                </Modal>
            </div>

        </div>
    )
}
