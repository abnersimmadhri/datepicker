# datepicker
Custom Javascript datepicker allows user to specify public holidays, custom months and more.

![image](https://github.com/abnersimmadhri/datepicker/assets/8105977/25c42293-3a8d-40c6-a298-99217f188b98)

Download the zip file. include the datepicker stylesheet and datepicker js file in your Html

<link rel="stylesheet" href="datepicker/css/datepicker.css">

<script src="datepicker/js/date-picker.js"></script>

Then initialise the date picker with the defaults 
<script>
    const myDatePicker = new DatePicker();
</script>

or specify custom values

  <script>	
      const monthNamesFrench = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
      const publicHolidays = {
      "2024-01-01": "New Year's Day",
      "2024-12-25": "Christmas Day",
    };
    
    const myDatePicker2 = new DatePicker('datepickerInput2', 'calendar2', monthNamesFrench,true, publicHolidays, 'MM/DD/YYYY');
  </script>
