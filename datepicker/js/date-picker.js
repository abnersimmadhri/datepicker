class DatePicker {
    constructor(inputId = 'datepickerInput', calendarId = 'calendar', monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], disableWeekends, publicHolidays = {}, dateFormat = '') {
        this.datePickerInput = document.getElementById(inputId);
        this.calendarElement = document.getElementById(calendarId);
        if (monthNames.length !== 12) {
            throw new Error('monthNames array must contain exactly 12 elements.');
        }
        this.monthNames = monthNames;
        this.disableWeekends = disableWeekends;
        this.publicHolidays = publicHolidays;
        this.dateFormat = dateFormat;
        this.currentYear = new Date().getFullYear();
        this.currentMonth = new Date().getMonth();
        this.initialize();
    }

    initialize() {
        if (this.datePickerInput && this.calendarElement) {
            this.datePickerInput.addEventListener('click', () => {
                this.calendarElement.classList.toggle('visible');
            });

            this.generateCalendar(this.currentYear, this.currentMonth);

            document.addEventListener('click', (event) => {
                const isClickInsideCalendar = this.calendarElement.contains(event.target);
                const isClickInsideInput = this.datePickerInput.contains(event.target);
                const isClickInsidePrevMonthBtn = event.target.id.startsWith('prevMonth');
                const isClickInsideNextMonthBtn = event.target.id.startsWith('nextMonth');
                if (!isClickInsideCalendar && !isClickInsideInput && !isClickInsidePrevMonthBtn && !isClickInsideNextMonthBtn) {
                    this.calendarElement.classList.remove('visible');
                }
            });
        } else {
            console.error('Datepicker initialization failed: Input or calendar element not found.');
        }
    }

    getDefaultDateFormat() {
        const date = new Date();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
    }

    formatDate(dateObj) {
        const selectedMonth = this.monthNames[dateObj.getMonth()];
        const day = dateObj.getDate();
        const year = dateObj.getFullYear();

        if (this.dateFormat && this.dateFormat.includes('MM') && this.dateFormat.includes('DD') && this.dateFormat.includes('YYYY')) {
            let formattedDate = this.dateFormat
                .replace('MM', String(dateObj.getMonth() + 1).padStart(2, '0'))
                .replace('DD', String(day).padStart(2, '0'))
                .replace('YYYY', year)
                .replace('selectedMonth', selectedMonth);

            return formattedDate;
        } else {
            return `${selectedMonth} ${day}, ${year}`;
        }
    }

    generateCalendar(year, month) {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const totalWeeks = Math.ceil((daysInMonth + firstDayOfMonth) / 7);

        let html = '';

        html += this.generateCalendarHeader(year, month);
        html += '<table>';
        html += '<tr><th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th></tr>';
        html += this.generateCalendarBody(year, month, totalWeeks, firstDayOfMonth, daysInMonth);
        html += '</table>';

        this.calendarElement.innerHTML = html;

        this.setupNavigationListeners();
        this.setupDateListeners();
    }

    generateCalendarHeader(year, month) {
        let html = '';
        html += '<div class="calendar-header">';
        html += `<button id="prevMonth_${this.datePickerInput.id}" class="prevMonthButton">&lt;</button>`;
        html += `<div class="month-year">${this.monthNames[month]} ${year}</div>`;
        html += `<button id="nextMonth_${this.datePickerInput.id}" class="nextMonthButton">&gt;</button>`;
        html += '</div>';
        return html;
    }

    generateCalendarBody(year, month, totalWeeks, firstDayOfMonth, daysInMonth) {
        let html = '';
        let dayCounter = 1;

        for (let i = 0; i < totalWeeks; i++) {
            html += '<tr>';
            for (let j = 0; j < 7; j++) {
                const isWeekend = j === 0 || j === 6;
                const isWeekendDisabled = (this.disableWeekends && isWeekend);

                if (i === 0 && j < firstDayOfMonth) {
                    const prevMonthDays = new Date(year, month, 0).getDate();
                    const prevMonthDay = prevMonthDays - firstDayOfMonth + j + 1;
                    html += `<td class="disabled">${prevMonthDay}</td>`;
                } else if (dayCounter > daysInMonth) {
                    html += '<td class="disabled"></td>';
                } else {
                    const currentDate = new Date(year, month, dayCounter);
                    const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;
                    if (isWeekendDisabled) {
                        html += `<td class="disabled weekend">${dayCounter}</td>`;
                    } else if (this.publicHolidays[dateKey]) {
                        html += `<td class="public-holiday">${dayCounter}</td>`;
                    } else {
                        html += `<td data-date="${year}-${month + 1}-${dayCounter}">${dayCounter}</td>`;
                    }
                    dayCounter++;
                }
            }
            html += '</tr>';
        }
        return html;
    }

    setupNavigationListeners() {
        const prevMonthBtn = document.getElementById(`prevMonth_${this.datePickerInput.id}`);
        const nextMonthBtn = document.getElementById(`nextMonth_${this.datePickerInput.id}`);

        prevMonthBtn.addEventListener('click', () => {
            this.currentMonth--;
            if (this.currentMonth < 0) {
                this.currentMonth = 11;
                this.currentYear--;
            }
            this.updateCalendar();
        });

        nextMonthBtn.addEventListener('click', () => {
            this.currentMonth++;
            if (this.currentMonth > 11) {
                this.currentMonth = 0;
                this.currentYear++;
            }
            this.updateCalendar();
        });
    }

    setupDateListeners() {
        const dateCells = this.calendarElement.querySelectorAll('td[data-date]');
        dateCells.forEach(cell => {
            const date = cell.getAttribute('data-date');
            if (this.publicHolidays[date]) {
                cell.classList.add('public-holiday');
                cell.setAttribute('title', this.publicHolidays[date]);
                cell.innerHTML += `<span class="holiday-name">${this.publicHolidays[date]}</span>`;
            }
            cell.addEventListener('click', () => {
                if (!cell.classList.contains('disabled')) {
                    const selectedDate = cell.getAttribute('data-date');
                    const dateObj = new Date(selectedDate);
                    const selectedMonth = this.monthNames[dateObj.getMonth()];
                    const formattedDate = this.formatDate(dateObj);
                    this.datePickerInput.value = formattedDate;
                    this.calendarElement.classList.remove('visible');
                }
            });
        });
    }


    updateCalendar() {
        const monthYearElement = this.calendarElement.querySelector('.month-year');
        monthYearElement.textContent = `${this.monthNames[this.currentMonth]} ${this.currentYear}`;
        this.generateCalendar(this.currentYear, this.currentMonth);
    }
}